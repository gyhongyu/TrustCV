"""
project_environment_doctor - 專案原生自包含環境依賴自檢與自癒引擎 (Project Environment Doctor)
- 100% 依賴 Python 標準庫 (ast, importlib, json, sys, os, subprocess)
- 自動掃描專案所有業務代碼與子技能代碼，提取真實第三方依賴
- 智能排除專案內部模組與標準庫，零誤報
- 優先識別專案虛擬環境 (.venv / venv)，支援一鍵自癒安裝 (--fix -y)
"""

import os
import sys
import ast
import json
import shutil
import argparse
import subprocess
import importlib.util
from pathlib import Path

# Python 標準庫模組 (3.10+)
STDLIB_MODULES = {
    '__future__', '_thread', 'abc', 'aifc', 'argparse', 'array', 'ast', 'asynchat',
    'asyncio', 'asyncore', 'atexit', 'audioop', 'base64', 'bdb', 'binascii', 'binhex',
    'bisect', 'builtins', 'bz2', 'cProfile', 'calendar', 'cgi', 'cgitb', 'chunk',
    'cmath', 'cmd', 'code', 'codecs', 'codeop', 'collections', 'colorsys', 'compileall',
    'concurrent', 'configparser', 'contextlib', 'contextvars', 'copy', 'copyreg', 'crypt',
    'csv', 'ctypes', 'curses', 'dataclasses', 'datetime', 'dbm', 'decimal', 'difflib',
    'dis', 'distutils', 'doctest', 'email', 'encodings', 'ensurepip', 'enum', 'errno',
    'faulthandler', 'fcntl', 'filecmp', 'fileinput', 'fnmatch', 'fractions', 'ftplib',
    'functools', 'gc', 'getopt', 'getpass', 'gettext', 'glob', 'graphlib', 'grp',
    'gzip', 'hashlib', 'heapq', 'hmac', 'html', 'http', 'idlelib', 'imaplib', 'imghdr',
    'imp', 'importlib', 'inspect', 'io', 'ipaddress', 'itertools', 'json', 'keyword',
    'lib2to3', 'linecache', 'locale', 'logging', 'lzma', 'mailbox', 'mailcap', 'marshal',
    'math', 'mimetypes', 'mmap', 'modulefinder', 'msilib', 'msvcrt', 'multiprocessing',
    'netrc', 'nntplib', 'numbers', 'operator', 'optparse', 'os', 'ossaudiodev', 'parser',
    'pathlib', 'pdb', 'pickle', 'pickletools', 'pipes', 'pkgutil', 'platform', 'plistlib',
    'poplib', 'posix', 'posixpath', 'pprint', 'profile', 'pstats', 'pty', 'pwd', 'py_compile',
    'pyclbr', 'pydoc', 'queue', 'quopri', 'random', 're', 'readline', 'reprlib', 'resource',
    'rlcompleter', 'runpy', 'sched', 'secrets', 'select', 'selectors', 'shelve', 'shlex',
    'shutil', 'signal', 'site', 'smtpd', 'smtplib', 'sndhdr', 'socket', 'socketserver',
    'spwd', 'sqlite3', 'sre', 'sre_compile', 'sre_constants', 'sre_parse', 'ssl', 'stat',
    'statistics', 'string', 'stringprep', 'struct', 'subprocess', 'sunau', 'symbol',
    'symtable', 'sys', 'sysconfig', 'syslog', 'tabnanny', 'tarfile', 'telnetlib', 'tempfile',
    'termios', 'test', 'textwrap', 'threading', 'time', 'timeit', 'tkinter', 'token',
    'tokenize', 'tomllib', 'trace', 'traceback', 'tracemalloc', 'tty', 'turtle', 'turtledemo',
    'types', 'typing', 'unicodedata', 'unittest', 'urllib', 'uu', 'uuid', 'venv', 'warnings',
    'wave', 'weakref', 'webbrowser', 'winreg', 'winsound', 'wsgiref', 'xdrlib', 'xml',
    'xmlrpc', 'zipapp', 'zipfile', 'zipimport', 'zlib', 'zoneinfo'
}

# Import 名稱轉 PyPI 安裝套件名稱映射表
IMPORT_TO_PACKAGE = {
    'pptx': 'python-pptx',
    'docx': 'python-docx',
    'bs4': 'beautifulsoup4',
    'dotenv': 'python-dotenv',
    'faster_whisper': 'faster-whisper',
    'edge_tts': 'edge-tts',
    'googleapiclient': 'google-api-python-client',
    'google_auth_oauthlib': 'google-auth-oauthlib',
    'PIL': 'pillow',
    'cv2': 'opencv-python',
    'yaml': 'pyyaml',
    'sklearn': 'scikit-learn',
}

# 掃描時應排除的忽略目錄
IGNORE_DIRS = {
    '.git', '.venv', 'venv', 'env', 'ENV', 'node_modules', '__pycache__',
    '.pytest_cache', '.mypy_cache', 'dist', 'build', 'eggs', '.eggs'
}


def get_project_root() -> Path:
    # 預期路徑：<project_root>/.agents/skills/project_environment_doctor/scripts/doctor.py
    curr = Path(__file__).resolve()
    try:
        # 回溯 4 層即為專案根目錄
        if curr.parent.name == 'scripts' and curr.parent.parent.parent.name == '.agents':
            return curr.parent.parent.parent.parent
    except Exception:
        pass
    return Path.cwd()


def detect_python_executable(project_root: Path) -> str:
    """自動偵測專案是否自帶虛擬環境，優先使用虛擬環境之 python"""
    candidates = [
        project_root / '.venv' / 'Scripts' / 'python.exe',
        project_root / 'venv' / 'Scripts' / 'python.exe',
        project_root / '.venv' / 'bin' / 'python',
        project_root / 'venv' / 'bin' / 'python',
    ]
    for c in candidates:
        if c.exists() and os.access(c, os.X_OK):
            return str(c)
    return sys.executable


def get_project_internal_modules(project_root: Path) -> set:
    """收集專案內部所有 py 檔案與子模組目錄名稱，用於排除誤報"""
    internal_mods = set()
    for item in project_root.iterdir():
        if item.name.startswith('.') or item.name in IGNORE_DIRS:
            continue
        if item.is_file() and item.suffix == '.py':
            internal_mods.add(item.stem)
        elif item.is_dir():
            internal_mods.add(item.name)
            for sub_py in item.glob('*.py'):
                internal_mods.add(sub_py.stem)
    return internal_mods


def scan_project_dependencies(project_root: Path) -> dict:
    """以 AST 靜態解析整個專案之 Python 程式碼，提取第三方依賴與其調用檔案"""
    internal_mods = get_project_internal_modules(project_root)
    ext_deps = {}

    for root, dirs, files in os.walk(project_root):
        dirs[:] = [d for d in dirs if d not in IGNORE_DIRS and not d.startswith('.')]
        for f in files:
            if not f.endswith('.py'):
                continue
            py_path = Path(root) / f
            try:
                with open(py_path, 'r', encoding='utf-8', errors='ignore') as fp:
                    tree = ast.parse(fp.read(), filename=str(py_path))
                for node in ast.walk(tree):
                    mod_name = None
                    if isinstance(node, ast.Import):
                        for alias in node.names:
                            mod_name = alias.name.split('.')[0]
                            _add_dep(mod_name, py_path, project_root, internal_mods, ext_deps)
                    elif isinstance(node, ast.ImportFrom):
                        if node.module:
                            mod_name = node.module.split('.')[0]
                            _add_dep(mod_name, py_path, project_root, internal_mods, ext_deps)
            except Exception:
                pass

    return ext_deps


def _add_dep(mod_name: str, py_path: Path, project_root: Path, internal_mods: set, ext_deps: dict):
    if not mod_name or mod_name in STDLIB_MODULES or mod_name in internal_mods:
        return
    rel_path = str(py_path.relative_to(project_root))
    if mod_name not in ext_deps:
        ext_deps[mod_name] = set()
    ext_deps[mod_name].add(rel_path)


def check_module_installed(module_name: str, python_exe: str) -> bool:
    """以探針秒級檢查模組是否可在目標 Python 環境載入"""
    try:
        cmd = [python_exe, '-c', f'import importlib.util; sys.exit(0 if importlib.util.find_spec("{module_name}") else 1)']
        res = subprocess.run(cmd, capture_output=True, timeout=5)
        return res.returncode == 0
    except Exception:
        return False


def check_all(project_root: Path, python_exe: str):
    deps = scan_project_dependencies(project_root)
    status_report = {}
    for mod in sorted(deps.keys()):
        installed = check_module_installed(mod, python_exe)
        pypi_pkg = IMPORT_TO_PACKAGE.get(mod, mod)
        status_report[mod] = {
            'installed': installed,
            'package': pypi_pkg,
            'files': sorted(list(deps[mod]))
        }
    return status_report


def print_report(status_report: dict, project_root: Path, python_exe: str, json_mode: bool = False):
    if json_mode:
        print(json.dumps(status_report, ensure_ascii=False, indent=2))
        return

    is_venv = '.venv' in python_exe or 'venv' in python_exe
    venv_str = " (專案自帶虛擬環境)" if is_venv else " (系統全域環境)"

    print("=" * 72)
    print(f"  🩺 [Project Doctor] 專案環境依賴健康診斷: {project_root.name}")
    print(f"  🐍 執行 Python: {python_exe}{venv_str}")
    print("=" * 72)
    print(f"[*] 掃描完成: 專案程式碼共引用 {len(status_report)} 個第三方外部依賴\n")

    missing_pkgs = []
    print("【Python 第三方套件狀態】")
    print("-" * 72)
    for mod, info in status_report.items():
        state_icon = "🟢 已安裝" if info['installed'] else "🔴 缺失"
        pkg_name = info['package']
        files_str = ", ".join(info['files'][:2])
        if len(info['files']) > 2:
            files_str += f" 等 {len(info['files'])} 個檔案"

        print(f" {state_icon:<8} | {pkg_name:<20} (import {mod:<14}) -> [{files_str}]")
        if not info['installed']:
            missing_pkgs.append(pkg_name)

    print("\n" + "=" * 72)
    if not missing_pkgs:
        print("  🎉 完美！專案所有程式碼依賴皆已 100% 安裝完畢，可正常運作！")
    else:
        print(f"  ⚠️  偵測到 {len(missing_pkgs)} 個套件尚未安裝！")
        print(f"  👉 一鍵安裝指令: \"{python_exe}\" -m pip install {' '.join(missing_pkgs)}")
        print("  👉 或直接執行本腳本: py .agents\\skills\\project_environment_doctor\\scripts\\doctor.py --fix")
    print("=" * 72)


def install_missing(status_report: dict, python_exe: str, auto_yes: bool = False):
    missing_pkgs = [info['package'] for info in status_report.values() if not info['installed']]
    if not missing_pkgs:
        print("[INFO] 當前環境沒有缺失任何第三方套件，無需安裝！")
        return

    print(f"[INFO] 準備安裝以下 {len(missing_pkgs)} 個套件: {', '.join(missing_pkgs)}")
    if not auto_yes:
        confirm = input("是否立即執行 pip 安裝？ [Y/n]: ").strip().lower()
        if confirm and confirm not in ('y', 'yes'):
            print("[INFO] 已取消安裝。")
            return

    cmd = [python_exe, '-m', 'pip', 'install'] + missing_pkgs
    print(f"[RUN] 正在執行: {' '.join(cmd)}")
    res = subprocess.run(cmd)
    if res.returncode == 0:
        print("\n[SUCCESS] 所有缺失套件安裝完畢！\n")
        if 'playwright' in missing_pkgs:
            print("[INFO] 偵測到新安裝 playwright，自動安裝 chromium 瀏覽器核心...")
            subprocess.run([python_exe, '-m', 'playwright', 'install', 'chromium'])
    else:
        print(f"\n[ERROR] 安裝過程出現錯誤，返回代碼: {res.returncode}")


def main():
    parser = argparse.ArgumentParser(description="專案原生自包含環境依賴自檢與一鍵修復總管")
    parser.add_argument('--check', action='store_true', default=True, help="執行環境依賴掃描與狀態比對 (預設)")
    parser.add_argument('--fix', '--install', dest='fix', action='store_true', help="自動批次安裝所有缺失套件")
    parser.add_argument('-y', '--yes', dest='yes', action='store_true', help="自動確認安裝，無需終端提示")
    parser.add_argument('--json', dest='json', action='store_true', help="以 JSON 格式輸出")
    args = parser.parse_args()

    project_root = get_project_root()
    python_exe = detect_python_executable(project_root)
    status_report = check_all(project_root, python_exe)

    if args.fix:
        install_missing(status_report, python_exe, auto_yes=args.yes)
        status_report = check_all(project_root, python_exe)
        print_report(status_report, project_root, python_exe, json_mode=args.json)
    else:
        print_report(status_report, project_root, python_exe, json_mode=args.json)


if __name__ == '__main__':
    main()

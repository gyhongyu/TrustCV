import os
import sys
import io

# 根除 Windows 終端 GBK 編碼錯誤
if sys.platform.startswith('win'):
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

import re
import json
import shutil
import hashlib
import argparse
from datetime import datetime
from pathlib import Path
from typing import Optional

# 母技能模組內聚資料庫目錄 (Central Fleet Registry)
SKILL_ROOT = Path(__file__).resolve().parent.parent
DATA_DIR = SKILL_ROOT / "data"
SEEDS_REGISTRY_FILE = DATA_DIR / "seeds_registry.json"
CURRENT_TEMPLATE_VERSION = "2.2.0"

MAX_ACTIVE_LOG_LINES = 200

def get_workspace_root(start_dir: Optional[Path] = None) -> Path:
    cwd = (start_dir or Path.cwd()).resolve()
    for parent in [cwd] + list(cwd.parents):
        if (parent / 'docs').exists() or (parent / '.git').exists():
            return parent
    return cwd

def calculate_template_fingerprint() -> str:
    """計算當前 DMC 範本之特徵指紋 (SHA-256 前 12 位)"""
    hasher = hashlib.sha256()
    hasher.update(b"dmc_knowledge_manager_v2.2.0")
    return hasher.hexdigest()[:12]

def load_seeds_registry() -> dict:
    """讀取中央播種台帳 (模組內聚)"""
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    if not SEEDS_REGISTRY_FILE.is_file():
        default_data = {
            "mother_skill": "dmc_knowledge_manager",
            "schema_version": "1.0.0",
            "current_template_version": CURRENT_TEMPLATE_VERSION,
            "seeds": []
        }
        SEEDS_REGISTRY_FILE.write_text(json.dumps(default_data, indent=2, ensure_ascii=False), encoding='utf-8')
        return default_data
    try:
        return json.loads(SEEDS_REGISTRY_FILE.read_text(encoding='utf-8'))
    except Exception:
        return {"mother_skill": "dmc_knowledge_manager", "seeds": []}

def save_seeds_registry(data: dict):
    """保存中央播種台帳"""
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    SEEDS_REGISTRY_FILE.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding='utf-8')

def register_seed_in_fleet(proj_path: Path):
    """將受體專案登記/更新至中央播種台帳 (Upsert)"""
    reg = load_seeds_registry()
    norm_path = str(proj_path.resolve()).replace("\\", "/")
    pname = proj_path.name
    now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    fp = calculate_template_fingerprint()

    seeds = reg.get("seeds", [])
    found = False
    for s in seeds:
        if s.get("project_path") == norm_path:
            s["project_name"] = pname
            s["last_scaffolded_at"] = now_str
            s["version"] = CURRENT_TEMPLATE_VERSION
            s["template_hash"] = fp
            s["status"] = "UP_TO_DATE"
            found = True
            break

    if not found:
        seeds.append({
            "project_name": pname,
            "project_path": norm_path,
            "sub_skill_rel_path": "docs",
            "last_scaffolded_at": now_str,
            "version": CURRENT_TEMPLATE_VERSION,
            "template_hash": fp,
            "status": "UP_TO_DATE"
        })

    reg["seeds"] = seeds
    reg["last_updated_at"] = now_str
    save_seeds_registry(reg)
    print(f"   📋 已登記至 DMC 中央艦隊台帳 (Fleet Registry): {norm_path}")

def status_fleet():
    """盤點全專案艦隊 DMC 知識庫健康度 (Fleet Health & Threshold Inspection)"""
    reg = load_seeds_registry()
    seeds = reg.get("seeds", [])
    print("=" * 80)
    print(" 🚢 [Fleet Status] dmc_knowledge_manager 全專案知識庫艦隊健康巡檢 (Central Fleet Registry)")
    print(f" 📂 母體台帳路徑: {SEEDS_REGISTRY_FILE}")
    print(f" 🏷️ 母體當前版本: v{CURRENT_TEMPLATE_VERSION} (Hash: {calculate_template_fingerprint()})")
    print("=" * 80)

    if not seeds:
        print(" ℹ️ 目前台帳中尚無登記任何受體專案。")
        print("    執行 `scaffold --path <路徑>` 時將自動登記首個專案。")
        print("=" * 80)
        return

    overheated_count = 0
    orphan_count = 0
    healthy_count = 0

    entry_pattern = re.compile(r'^###\s+\[(.*?)\]\s+\[(.*?)\]\s+\[(.*?)\]\s+(.*)')

    for idx, s in enumerate(seeds, 1):
        pname = s.get("project_name", "Unknown")
        ppath = Path(s.get("project_path", ""))
        ver = s.get("version", "1.0.0")
        docs_dir = ppath / "docs"
        active_log = docs_dir / "ACTIVE_LOG.md"
        state_md = docs_dir / "STATE.md"

        # 檢測專案路徑是否存活
        if not ppath.is_dir():
            s["status"] = "ORPHAN"
            orphan_count += 1
            print(f" {idx:2d}. ⚪ [{pname}] ⚠️ 目錄已失效/遷移 (ORPHAN)")
            print(f"     路徑: {ppath}")
            continue

        if not docs_dir.is_dir():
            s["status"] = "MISSING_DOCS"
            overheated_count += 1
            print(f" {idx:2d}. 🟡 [{pname}] ⚠️ docs 目錄遺失需補播 (v{ver} -> v{CURRENT_TEMPLATE_VERSION})")
            print(f"     路徑: {ppath}")
            continue

        log_lines = 0
        unrefined = 0
        refined = 0
        if active_log.is_file():
            lines = active_log.read_text(encoding='utf-8', errors='replace').splitlines()
            log_lines = len(lines)
            for line in lines:
                m = entry_pattern.match(line)
                if m:
                    if 'UNREFINED' in m.group(2).upper():
                        unrefined += 1
                    else:
                        refined += 1

        state_lines = 0
        if state_md.is_file():
            state_lines = len(state_md.read_text(encoding='utf-8', errors='replace').splitlines())

        is_overheated = log_lines > MAX_ACTIVE_LOG_LINES or unrefined >= 5 or state_lines > 200
        if is_overheated:
            s["status"] = "OVERHEATED"
            overheated_count += 1
            status_icon = "🔥"
            msg = "警報：知識庫過熱需蒸餾"
        else:
            s["status"] = "UP_TO_DATE"
            healthy_count += 1
            status_icon = "🟢"
            msg = "健康達標"

        print(f" {idx:2d}. {status_icon} [{pname}] {msg} (v{ver})")
        print(f"     ACTIVE_LOG: {log_lines} 行 (未精煉: {unrefined} 筆) | STATE: {state_lines} 行 | 路徑: {ppath}")

    save_seeds_registry(reg)
    print("=" * 80)
    print(f" 📊 艦隊摘要: 總計 {len(seeds)} 個受管專案 | 🟢 健康: {healthy_count} | 🔥 過熱/需處置: {overheated_count} | ⚪ 遺失: {orphan_count}")
    if overheated_count > 0:
        print(" 👉 處置建議: 針對過熱專案執行日誌蒸餾 (Distill) 或歷史舊檔歸檔。")
    print("=" * 80)

def sync_all_fleet():
    """一鍵全量同步受管專案 DMC 艦隊 (補齊缺失目錄與治理骨架)"""
    reg = load_seeds_registry()
    seeds = reg.get("seeds", [])
    print("=" * 80)
    print(" 🚀 [Fleet Sync-All] dmc_knowledge_manager 全專案知識庫艦隊一鍵自動刷新 (Fleet Sync)")
    print(f" 🏷️ 母體推播版本: v{CURRENT_TEMPLATE_VERSION} (Hash: {calculate_template_fingerprint()})")
    print("=" * 80)

    if not seeds:
        print(" ℹ️ 台帳為空，無需同步。")
        print("=" * 80)
        return

    success_count = 0
    skip_count = 0

    for s in seeds:
        pname = s.get("project_name", "Unknown")
        ppath = Path(s.get("project_path", ""))

        if not ppath.is_dir():
            print(f" ⚠️ 略過無效目錄 [{pname}]: {ppath}")
            s["status"] = "ORPHAN"
            skip_count += 1
            continue

        print(f"\n 🔄 正在同步專案 [{pname}] ...")
        try:
            cmd_scaffold(ppath)
            s["version"] = CURRENT_TEMPLATE_VERSION
            s["template_hash"] = calculate_template_fingerprint()
            s["last_scaffolded_at"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            s["status"] = "UP_TO_DATE"
            success_count += 1
            print(f" ✅ [{pname}] DMC 知識治理體系刷新成功！")
        except Exception as e:
            print(f" ❌ [{pname}] 同步失敗: {e}")
            skip_count += 1

    save_seeds_registry(reg)
    print("\n" + "=" * 80)
    print(f" 🎉 艦隊同步完成！成功刷新: {success_count} 個專案 | 略過/失敗: {skip_count} 個專案")
    print("=" * 80)

def cmd_status(target_path: Optional[Path] = None):
    root = get_workspace_root(target_path)
    active_log = root / 'docs' / 'ACTIVE_LOG.md'
    state_md = root / 'docs' / 'STATE.md'

    print("=" * 60)
    print(f"📊 [DMC Health Prober] 專案知識庫健康度巡檢: {root.name}")
    print(f"📍 專案根目錄: {root}")
    print("=" * 60)

    if not active_log.exists():
        print("❌ 未檢測到 docs/ACTIVE_LOG.md！專案尚未播種 DMC 知識庫體系。")
        print("💡 請執行: py C:\\Users\\9892\\.gemini\\config\\skills\\dmc_knowledge_manager\\scripts\\dmc.py scaffold")
        sys.exit(1)

    lines = active_log.read_text(encoding='utf-8', errors='replace').splitlines()
    line_count = len(lines)
    
    # Count entries
    entry_pattern = re.compile(r'^###\s+\[(.*?)\]\s+\[(.*?)\]\s+\[(.*?)\]\s+(.*)')
    entries = []
    unrefined_count = 0
    refined_count = 0

    for idx, line in enumerate(lines):
        m = entry_pattern.match(line)
        if m:
            date_str, status_tag, tag, title = m.groups()
            is_unrefined = 'UNREFINED' in status_tag.upper()
            if is_unrefined:
                unrefined_count += 1
            else:
                refined_count += 1
            entries.append({
                'line_idx': idx + 1,
                'date': date_str,
                'status': status_tag,
                'title': title
            })

    total_entries = len(entries)

    # STATE.md check
    state_lines = 0
    if state_md.exists():
        state_lines = len(state_md.read_text(encoding='utf-8', errors='replace').splitlines())

    print(f"📄 docs/ACTIVE_LOG.md: {line_count} 行 (上限門禁: {MAX_ACTIVE_LOG_LINES} 行)")
    print(f"📑 條目總數: {total_entries} 筆 (未精煉 [UNREFINED]: {unrefined_count} 筆, 已蒸餾: {refined_count} 筆)")
    if state_md.exists():
        print(f"🛡️ docs/STATE.md: {state_lines} 行 (上限門禁: 200 行)")

    print("-" * 60)
    if line_count > MAX_ACTIVE_LOG_LINES or unrefined_count >= 5:
        print("⚠️ 【警報：日誌過熱需蒸餾】")
        if line_count > MAX_ACTIVE_LOG_LINES:
            print(f"   - ACTIVE_LOG 已達 {line_count} 行，超過 {MAX_ACTIVE_LOG_LINES} 行上限！")
        if unrefined_count >= 5:
            print(f"   - 累積 {unrefined_count} 筆未精煉條目待裁決！")
        print("💡 【AI 代理人行動指引】：")
        print("   1. 請 AI 代理人閱讀早期條目，確認其決策已固化於 docs/adr/。")
        print("   2. 將已定案之舊日誌搬遷至 docs/archive/logs/，將 ACTIVE_LOG 瘦身回 <100 行。")
        sys.exit(2)
    else:
        print("✅ 【知識庫狀態健康】行數與條目均在安全門禁內。")
        sys.exit(0)

def cmd_scaffold(target_path: Optional[Path] = None):
    root = get_workspace_root(target_path)
    docs_dir = root / 'docs'
    dirs = [
        docs_dir,
        docs_dir / 'adr',
        docs_dir / 'how-to',
        docs_dir / 'reference',
        docs_dir / 'archive' / 'logs',
        docs_dir / 'archive' / 'legacy_logs'
    ]

    for d in dirs:
        d.mkdir(parents=True, exist_ok=True)

    active_log = docs_dir / 'ACTIVE_LOG.md'
    if not active_log.exists():
        active_log.write_text(
            "# 📝 研發結構化原子日誌 (ACTIVE_LOG.md)\n"
            "> ⚠️ **【鐵律：只追加不修改 (Append-Only)】**\n"
            "> 任何代碼修正、重構、架構決策或工具鏈變更，以標準 6 行格式追加至文末。\n\n"
            "---\n\n",
            encoding='utf-8'
        )

    state_md = docs_dir / 'STATE.md'
    if not state_md.exists():
        state_md.write_text(
            f"# 🛡️ 研發即時現狀與架構真理庫 (STATE.md)\n\n"
            f"> 📌 **專案**: {root.name} | **初始化時間**: {datetime.now().strftime('%Y-%m-%d')}\n"
            f"> ⚠️ **鐵律**: 本文檔嚴格限制 ≤200 行，為專案唯一真理來源 (Single Source of Truth, SSOT)。\n\n"
            "---\n\n"
            "## 1. 專案定位與架構不變量 (Hard Invariants)\n"
            "- 初始化 DMC 知識治理架構。\n\n"
            "---\n\n"
            "## 2. 當前里程碑與進行中工作\n"
            "- [x] DMC 知識庫初始化完成\n",
            encoding='utf-8'
        )

    # 自動登記至中央艦隊台帳
    register_seed_in_fleet(root)

    # 播種專案現場自包含子技能: .agents/skills/dmc_knowledge_manager
    dest_skill_dir = root / ".agents" / "skills" / "dmc_knowledge_manager"
    dest_scripts_dir = dest_skill_dir / "scripts"
    dest_scripts_dir.mkdir(parents=True, exist_ok=True)

    dest_dmc_py = dest_scripts_dir / "dmc.py"
    shutil.copy2(Path(__file__).resolve(), dest_dmc_py)

    dest_skill_md = dest_skill_dir / "SKILL.md"
    seeded_skill_md = """<!-- 🛡️ SEEDED_SKILL_VENDORED: Generated by dmc_knowledge_manager. DO NOT EDIT DIRECTLY. -->
---
name: dmc_knowledge_manager
description: 專案專屬 DEV_DMC 研發知識治理、文檔防污染與日誌雙道閘蒸餾總管。提供 0-Token 離線日誌健康巡檢 (status)、標準結構化單向追加 (append)、雙道閘蒸餾 (distill) 與文檔真偽對碼驗屍 (verify)。
---

# 🛡️ 專案專屬 DEV_DMC 研發知識治理 (dmc_knowledge_manager)

本專案已播種原生自包含的 DMC 研發知識治理微型引擎，100% 依賴 Python 標準庫，零外部套件依賴。換電腦或離線環境依然具備完整的知識治理能力。

## 🚦 核心 CLI 指令
```powershell
# 1. 巡檢當前知識庫健康度 (檢查 ACTIVE_LOG 行數、STATE.md 行數)
py .agents\\skills\\dmc_knowledge_manager\\scripts\\dmc.py status

# 2. 重新初始化或修復 docs/ 骨架
py .agents\\skills\\dmc_knowledge_manager\\scripts\\dmc.py scaffold
```
"""
    dest_skill_md.write_text(seeded_skill_md, encoding='utf-8')

    print(f"✅ [DMC Scaffold] 成功在專案 {root.name} 播種完整的 docs/ 治理骨架與 .agents/skills/dmc_knowledge_manager 自治技能！")

def main():
    parser = argparse.ArgumentParser(
        description="DMC Knowledge Manager - Engine & Health Prober (Fleet Edition)",
        formatter_class=argparse.RawDescriptionHelpFormatter
    )
    parser.add_argument("-p", "--path", dest="global_path", default=None, help="目標專案根目錄路徑")

    subparsers = parser.add_subparsers(dest="cmd", help="可執行的子指令")

    p_status = subparsers.add_parser("status", help="巡檢知識庫健康度或全艦隊巡檢")
    p_status.add_argument("-p", "--path", dest="flag_path", default=None, help="目標專案路徑")
    p_status.add_argument("--fleet", action="store_true", help="強制巡檢中央艦隊台帳")

    subparsers.add_parser("sync-all", help="一鍵全量同步受管專案艦隊 DMC 骨架")

    p_scaffold = subparsers.add_parser("scaffold", help="為目標專案播種標準 docs/ 治理架構並登記台帳")
    p_scaffold.add_argument("target_dir", nargs="?", default=None, help="目標專案路徑")
    p_scaffold.add_argument("-p", "--path", dest="flag_path", default=None, help="目標專案路徑")

    # 相容舊版位置參數 `py dmc.py status` 或 `py dmc.py scaffold`
    parser.add_argument("legacy_cmd", nargs="?", default=None, help="相容舊版子指令")

    args = parser.parse_args()
    cmd = args.cmd or args.legacy_cmd

    if cmd == "sync-all":
        sync_all_fleet()
        return

    target_str = getattr(args, "flag_path", None) or getattr(args, "target_dir", None) or args.global_path
    target_path = Path(target_str) if target_str else None

    if cmd == "status" or not cmd:
        if getattr(args, "fleet", False) or target_path is None and str(Path.cwd()).startswith(str(SKILL_ROOT.parent.parent)):
            status_fleet()
        else:
            cmd_status(target_path)
    elif cmd == "scaffold":
        cmd_scaffold(target_path)
    else:
        print(f"未知指令: {cmd}。支援: status, scaffold, sync-all", file=sys.stderr)
        sys.exit(1)

if __name__ == '__main__':
    main()


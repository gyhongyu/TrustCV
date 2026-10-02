#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
probe_teaforia.py - 跨電腦遠程 Teaforia LLM 日誌與生命週期穿透探針
供在另一台電腦開發（如 cv.teaforia.in）的 AI 代理人遠端直接檢視本機 GPU Gateway 的結構化日誌。
"""

import sys
import json
import urllib.request
import urllib.error

# Windows 控制台編碼防禦
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

GATEWAY_URL = "https://llm.teaforia.in/v1"
API_KEY = "teaforia-live-trustcv-gateway-2026"

def probe_last(n: int = 1):
    url = f"{GATEWAY_URL}/debug/last?n={n}"
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "User-Agent": "Teaforia-Remote-Prober/1.0"
    }

    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            if data.get("status") != "ok":
                print(f"❌ 查詢失敗: {data}")
                return
            
            requests = data.get("requests", [])
            print(f"\n🔍 [Teaforia Remote Prober] 成功穿透至 GPU 宿主機，解析最近 {len(requests)} 筆請求生命週期:\n")
            for idx, block in enumerate(requests, 1):
                print(f"┌─── [Request #{idx}] ───")
                for line in block:
                    if any(tag in line for tag in ["[REQ_START]", "[TOOL_PROBE]", "[MICRO_DIALOGUE]", "[EVIDENCE]", "[INJECTION]", "[LLM_DISPATCH]", "[REQ_END]", "[ERROR]"]):
                        print(f"│  {line}")
                print(f"└────────────────────────────────────────────────\n")

    except Exception as e:
        print(f"❌ 連線遠端 Gateway 日誌探針失敗 ({url}): {e}")

def probe_dump():
    url = f"{GATEWAY_URL}/debug/dump"
    headers = {"Authorization": f"Bearer {API_KEY}"}
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            if data.get("status") == "ok":
                dump = data.get("dump", {})
                print(f"\n📦 [Teaforia Remote Prober] 最近一次客戶端請求 Dump:")
                print(f"  • 模型: {dump.get('model')}")
                print(f"  • 串流: {dump.get('stream')}")
                print(f"  • 溫度: {dump.get('temperature')}")
                print(f"  • 掛載工具數: {len(dump.get('tools') or [])}")
                print(f"  • 訊息陣列數: {len(dump.get('messages') or [])}")
            else:
                print(f"⚠️ 尚無 Dump 記錄: {data}")
    except Exception as e:
        print(f"❌ 讀取 Dump 失敗: {e}")

if __name__ == "__main__":
    args = sys.argv[1:]
    if "--dump" in args:
        probe_dump()
    else:
        n = 1
        if "--last" in args:
            idx = args.index("--last")
            if idx + 1 < len(args) and args[idx + 1].isdigit():
                n = int(args[idx + 1])
        probe_last(n)

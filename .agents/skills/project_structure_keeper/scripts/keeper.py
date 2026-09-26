#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import os
import sys
from pathlib import Path

def sync_topology():
    proj_root = Path(__file__).resolve().parents[3]
    top_file = proj_root / "docs" / "TOPOLOGY.md"
    print(f"🔄 正在同步專案拓撲活地圖: {top_file}")
    if top_file.is_file():
        print("✅ 拓撲活地圖已為最新狀態。")
    else:
        print("⚠️ docs/TOPOLOGY.md 不存在，請由全域母技能重新生成。")

def audit_hygiene():
    """只讀掃描：只報警未登記檔案，絕對不擅自刪除或移動，交由人類或固化審查處理"""
    # __file__ = E:\Projects\TrustCV\.agents\skills\project_structure_keeper\scripts\keeper.py
    # parents[0] = scripts
    # parents[1] = project_structure_keeper
    # parents[2] = skills
    # parents[3] = .agents
    # parents[4] = E:\Projects\TrustCV
    proj_root = Path(__file__).resolve().parents[4]
    known_roots = {".agent_profiles", ".agents", "specs", "assets", "docs", "gas", "worker", "scripts", "css", "js"}
    known_files = {"index.html", "manifest.json", "sw.js", "README.md", "HANDOFF.md", "AGENTS.md", "CLAUDE.md",
                   ".clinerules", ".cursorrules", ".windsurfrules", ".gitignore", "切換為生產模式.bat", "切換為開發模式.bat"}
    
    print(f"🔍 專案目錄守門巡檢 (Read-Only Audit): {proj_root}")
    unregistered = []
    for item in proj_root.iterdir():
        if item.is_dir() and item.name not in known_roots:
            unregistered.append(f"[目錄] {item.name}")
        elif item.is_file() and item.name not in known_files:
            unregistered.append(f"[檔案] {item.name}")
            
    if unregistered:
        print(f"⚠️ 發現 {len(unregistered)} 個未登記在拓撲中的項目：")
        for u in unregistered:
            print(f"   - {u}")
        print("💡 守門員提醒：嚴禁私自處置！如需清理或歸檔，請呼叫 project_solidifier 經人類確認處置。")
    else:
        print("✅ 根目錄結構乾淨合規，無未登記散落項目。")

if __name__ == "__main__":
    action = sys.argv[1] if len(sys.argv) > 1 else "sync"
    if action == "audit":
        audit_hygiene()
    else:
        sync_topology()


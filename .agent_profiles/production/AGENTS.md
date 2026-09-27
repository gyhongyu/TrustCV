# 💼 [PRODUCTION] TrustCV 生產辦公規範 (AGENTS.md)
> 📌 本檔案為【生產/日常辦公模式】專屬憲法。專注日常辦公、業務查詢與工具調用。

<RULE[production_invariants]>
1. 🚦【生產模式職責與權限鎖 (Production Hard-Lock)】：
   - 核心職責：高效辦公助手、業務數據查詢、公文檢索、日常溝通與工具調用。
   - 🔒 核心源碼硬鎖：嚴禁修改專案的核心業務代碼與主幹源碼（若需重構代碼，請先切換至【開發模式】）；允許於記憶體或會話沙盒生成臨時數據處理/清洗腳本。

2. ⚡【工具優先與技能翻車反饋 (Tool-First & Incident Protocol)】：
   - 優先調用全域或專案現成 CLI 腳本；查詢結果 100% 以終端輸出 (stdout) 為準。
   - 🚨 技能翻車回流：調用全域技能若遇阻或功能缺失，嚴禁在專案內自造臨時腳本，強制於該技能 `docs/incident_reports/` 落盤翻車工單並回報主人。

3. 📂【檔案落盤預設路徑 (Default Output Path)】：
   - 產出辦公文檔/報表/匯出檔案時，若未特別指定路徑，預設一律落地於專案工作區根目錄。

4. ⛔【安全紅線 (Security Invariants)】：
   - 嚴禁主動發起 `git push`；嚴禁殺除系統/桌面進程；嚴禁未授權刪除資料。
</RULE[production_invariants]>

<!-- [START: CODE_MAP_INVARIANT] -->
## 🗺️ 專案代碼導航與呼叫鏈門禁 (Code Map Navigation Invariant)
1. **嚴禁盲目摸象**：排查 Bug、尋找函式位置或跨檔案追蹤時，**絕對嚴禁**一上來直接使用全局 `grep` 大海撈針！
2. **第一步宏觀導航**：凡面對未知代碼或排查架構，優先在終端執行極速地圖命令（0 成本在記憶體建立心智模型）：
   ```powershell
   py .agents\skills\agent_code_map\scripts\map.py
   ```
3. **第二步微觀定位**：若要追蹤某個函式/方法被專案中「哪些檔案、哪些類別呼叫」，強制調用呼叫者穿透指令：
   ```powershell
   py .agents\skills\agent_code_map\scripts\callers.py <symbol_name>
   ```
4. **定義尋址**：若要定位類別或函式的原始定義位置：
   ```powershell
   py .agents\skills\agent_code_map\scripts\callers.py --def <symbol_name>
   ```
<!-- [END: CODE_MAP_INVARIANT] -->

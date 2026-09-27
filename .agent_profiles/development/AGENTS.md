# 🛠️ [DEVELOPMENT] TrustCV 研發工程規範 (AGENTS.md)
> 📌 本檔案為【研發/工程開發模式】專屬憲法。全面開放代碼權限與架構治理。

<RULE[development_invariants]>
1. 🚦【研發模式職責 (Development Scope)】：
   - 核心職責：架構重構、底層代碼編寫、單元測試、Bug 修復與知識治理。
   - 核心方法：編寫代碼或方案前強制執行「Pre-mortem 屍前驗屍 ✕ 第十人反對法則」。

2. 📚【研發知識治理 (DMC Protocol)】：
   - 單向追加：所有重大改動與踩坑必須主動追加至 `docs/ACTIVE_LOG.md`。
   - 單一真源：維護 `docs/STATE.md` 架構不變量 (嚴格 ≤200 行)。
   - 🚨 技能工程反饋：若本專案涉及技能研發或調用，嚴禁私造代碼，必須嚴格維護 `docs/incident_reports/` 工單與自動化測試閉環。

3. ⛔【五大不可違背之工程紅線 (Hard Invariants)】：
   - 嚴禁主動發起 `git push`；嚴禁以 `taskkill` 殺除核心進程。
   - 零即時上行律、Schema 探測先行、終端 stdout 真值管道。
</RULE[development_invariants]>

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

# 📝 研發結構化原子日誌 (ACTIVE_LOG.md)
> ⚠️ **【鐵律：只追加不修改 (Append-Only)】**
> 任何代碼修正、重構、架構決策或工具鏈變更，以標準 6 行格式追加至文末。

---

### [2026-09-27] [UNREFINED] [infra/governance] 專案基礎架構與 DMC / 多模式機制初始化
- **類型**: `ARCH_DECISION`
- **代碼錨點**: `docs/STATE.md`, `docs/ACTIVE_LOG.md`, `.agent_profiles/`, `scripts/switch_mode.py`
- **核心事實 / 決策理由**:
  - 初始化 TrustCV / Credence PWA MVP 專案工程治理體系。
  - 導入 DMC 知識管理標準，確保代碼與文檔一致性，杜絕知識劇毒。
  - 導入多模式規則架構 (Multi-Rules Engine)，劃分生產模式與開發模式，預設啟用開發模式。
- **踩坑 / 失敗模式**:
  - 新專案初始階段易產生規則污染與盲目推送，透過嚴格不變量與防彈窗規範防禦。
- **防禦手段 / 測試背書**:
  - 遵循 `agent_multi_rules_architect` 規範執行狀態審查與切換。

---

### [2026-09-27] [UNREFINED] [infra/topology] 專案全域拓撲規整與專案結構守護技能部署
- **類型**: `ARCH_DECISION`
- **代碼錨點**: `specs/`, `assets/`, `docs/TOPOLOGY.md`, `.agents/skills/project_structure_keeper/`, `C:\Users\9892\.gemini\config\skills\project_topology_architect\`
- **核心事實 / 決策理由**:
  - 解決 AI 代理人不熟悉專案目錄與文件職責、盲目全庫掃描代碼與隨機在根目錄亂造檔案之通病。
  - 將 00~04 規範、PRD、業務總綱讀我歸位至 `specs/`；視覺規範、4 屏擬真原型與 SVG 歸位至 `assets/`。
  - 自動執行 Markdown 相對路徑鏈接校正，徹底消除死鏈 (Broken Links)。
  - 部署全域母技能 `project_topology_architect`，並在專案落地子技能 `project_structure_keeper` 與 `docs/TOPOLOGY.md`。
- **踩坑 / 失敗模式**:
  - 搬遷目錄易導致 Markdown 內部引用斷裂，透過拓撲引擎正則替換自動修復。
  - 避免日常瑣碎改動頻繁更新拓撲造成維護過載，嚴格定調「僅在架構重大變更/模組化拆分時觸發粗粒度同步」。
- **防禦手段 / 測試背書**:
  - 執行 `py topology_engine.py apply` 完成端到端驗收，檢查目錄樹與鏈接校正結果 100% 通過。

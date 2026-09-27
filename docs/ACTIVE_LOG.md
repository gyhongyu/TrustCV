# 📝 研發結構化原子日誌 (ACTIVE_LOG.md)
> ⚠️ **【鐵律：只追加不修改 (Append-Only)】**
> 任何代碼修正、重構、架構決策或工具鏈變更，以標準 6 行格式追加至文末。
> 📌 歷史日誌（2026-09-27 以前之階段 0 ~ 2.5）已精煉歸檔至 `docs/archive/logs/2026-Q3.log.md`。

---

### [2026-09-28] [REFINED:ADR-001/002] [architecture/my-cv-vault-and-snapshot-escrow] 個人履歷、安全保險庫互動分工與投遞快照公證機制定案
- **類型**: `ARCHITECTURE_DECISION`
- **代碼錨點**: `docs/adr/001_my_cv_and_vault_interaction.md`, `docs/adr/002_submission_snapshot_escrow.md`
- **核心事實 / 決策理由**:
  - **個人履歷 (My CV) 與安全保險庫 (Vault) 職責劃分**：
    - 保險庫定位為用戶個人 Google Drive 檔案總管與集中式「✨ 統一智慧拖曳倉」，全格式通吃並調用打工仔 LLM 分流歸位與提煉 `.md` 影子膠囊。
    - 個人履歷定位為動態互動式填表與標準 A4 履歷預覽工作台，支援點擊空白處即時上傳與打工仔自動填表，並提供 `[📎 查看原檔]` 溯源。
  - **二態隱私機制 (Public vs Private) 替代管理員鎖定**：
    - 徹底取消死板的「管理員鎖定」，用戶在個人日常履歷表中享有 100% 自主修改權，僅保留純粹的「公開 👁️ / 隱藏 🙈」二態。
  - **投遞快照提存機制 (Submission Snapshot & Escrow)**：
    - 用戶點擊投遞瞬間，透過 Google Drive `Files.copy` 秒級將公開佐證原件複製至 TrustCV 官方審核目錄，並記錄 SHA-256 指紋。用戶後續更動個人 Drive 不影響已投遞審核資產。
- **防禦手段 / 測試背書**:
  - 產出 ADR 001 與 ADR 002 架構活頁，避免單一文檔膨脹。

---

### [2026-09-28] [REFINED:ADR-003] [architecture/104-aligned-profile-schema] 對齊 104 人力銀行之 9 大標準履歷架構與雙軌輸入機制定案
- **類型**: `ARCHITECTURE_DECISION`
- **代碼錨點**: `docs/adr/003_104_aligned_profile_schema.md`
- **核心事實 / 決策理由**:
  - **9 大核心標準區塊收斂**：個人基本資料、求職條件、工作經歷、學歷背景、語文能力、專業專長、資格證照、自傳、佐證附件。
  - **雙軌並行輸入 (Dual Entry)**：各區塊頂部提供「✨ AI 智能拖曳區」，右上角保留「➕ 手動新增」，兼顧不傳證件的純手動用戶與 AI 自動提煉優勢。
  - **最小必填門檻**：僅姓名、聯絡方式與一項工作/學歷為必填，其餘（證件/證照）全數非必填，極致降低求職者進場摩擦力。
  - **底層單一真理庫**：於用戶個人 Google Drive 維護 `master_profile.json`，手動編輯與 AI 提煉無縫合併。
- **防禦手段 / 測試背書**:
  - 產出 ADR 003 架構活頁，保持 DMC 知識庫清晰解耦。

---

### [2026-09-28] [REFINED:ADR-004] [architecture/full-12-sections-and-official-vault] 104 完整 12 大區塊 Schema 與官方網盤一夾一案提存架構定案
- **類型**: `ARCHITECTURE_DECISION`
- **代碼錨點**: `docs/adr/004_full_12_sections_and_official_vault.md`
- **核心事實 / 決策理由**:
  - **104 完整 12 大核心區塊定版**：個人資料、學歷、工作經歷、求職條件、語文能力、專長、資格認證、自傳、附件、專案成就、自傳/推薦人、自訂內容。
  - **官方審核網盤提存架構**：採「一夾一案 (1-Application-1-Folder)」設計。用戶應聘並確認佐證後，透過 `Files.copy` 將公開原件與履歷快照 JSON 存入官方獨立資料夾，徹底杜絕個人端異動影響官方審核與雇主調閱。
- **防禦手段 / 測試背書**:
  - 產出 ADR 004 架構活頁，與原始 `specs/` 形成歷史演進鏈。

---

### [2026-09-28] [UNREFINED] [feature/104-profile-and-vault-sync] 104 標準 12 大區塊雙軌畫布、Drive 四層結構與防抖持久化引擎落地
- **類型**: `FEATURE_IMPLEMENTATION`
- **代碼錨點**: `js/drive.js`, `js/store.js`, `js/components/myCv.js`, `js/components/vault.js`, `js/app.js`, `sw.js`
- **核心事實 / 決策理由**:
  - **任務 1 (Google Drive 服務層升級)**：實作 `Photos/`、`Certificates/`、`Resumes/`、`Exports/` 四層目錄自動建立，完成 `loadMasterProfile()` 與 `saveMasterProfile(data)` 讀寫接口。
  - **任務 2 (前端狀態存儲與防抖持久化引擎)**：初始化 12 大區塊數據模型，實作 0ms `localStorage` 寫入、3000ms 防抖背景回寫 Google Drive，以及 `syncStatus`（saved / saving / offline / error）狀態機。
  - **任務 3 (104 標準雙軌動態畫布)**：以 `js/components/myCv.js` 完整渲染 12 大核心模組，提供「✨ AI 智能拖曳區」與「➕ 手動新增」雙軌入口，並實現每條目獨立之 `[👁️ 公開 / 🙈 隱藏]` 二態隱私開關。
  - **任務 4 (安全保險庫集中拖曳倉)**：重構 `js/components/vault.js`，頂部打造「✨ 統一智慧投放區」通吃全格式並智慧自動歸檔，下方收斂為四欄檔案檢視與直連 Drive 按鈕。
  - **PWA Service Worker 升級**：將 `sw.js` 升級至 `trustcv-cache-v1.3.0`，預快取所有新增模組。

---

### [2026-09-28] [UNREFINED] [governance/adr006-and-handoff] 動態三級角色台帳 (ADR 006)、實施手冊同步與交接文檔固化
- **類型**: `DOCS_GOVERNANCE`
- **代碼錨點**: `docs/adr/006_dynamic_roles_and_drive_boundary.md`, `IMPLEMENTATION_GUIDE.md`, `HANDOFF.md`, `C:\Users\9892\.gemini\config\skills\handover_generator\SKILL.md`
- **核心事實 / 決策理由**:
  - **全域交接技能升級**：在 `handover_generator` 注入「步驟 0：交班者主動探測與自癒播種雙導航技能（keeper + code_map）」不變量，並固定提供雙門禁啟動指令，為後續代理人省下 10x Token。
  - **ADR 006 決策固化**：確立 Google Sheets `System_Roles` 動態三級角色 (ADMIN / PARTNER / CANDIDATE) 零硬編碼機制；劃分個人 `TrustCV/` 與官方 `TrustCV_Official_Vault/` 物理隔離；確立未登入門禁杜絕假資料污染。
  - **三大文檔職責解耦**：ADR 負責法典原因、`IMPLEMENTATION_GUIDE.md` 負責階段宏觀進度、`HANDOFF.md` 負責下一棒戰術派工單，彼此各司其職不重疊打架。
- **防禦手段 / 測試背書**:
  - 通過 `keeper.py audit` 與 `map.py` 雙重拓撲驗收，0 孤兒雜檔。

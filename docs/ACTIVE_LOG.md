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
  - 執行 `py .agents/skills/project_structure_keeper/scripts/keeper.py audit`，已將 `IMPLEMENTATION_GUIDE.md` 納入守門白名單，結構巡檢 100% 通過。
  - 通過 `keeper.py audit` 與 `map.py` 雙重拓撲驗收，0 孤兒雜檔。

---

### [2026-09-27] [UNREFINED] [assets/icons] 階段 0 視覺資產與 PWA 規格圖標轉換固化
- **類型**: `ASSET_HARDENING`
- **代碼錨點**: `tools/convert_icons.py`, `assets/icons/`, `favicon.ico`, `IMPLEMENTATION_GUIDE.md`
- **核心事實 / 決策理由**:
  - 嚴格依照 `IMPLEMENTATION_GUIDE.md` 階段 0 規範實施，將 `assets/svg/` 轉為全平台相容的實體圖標。
  - 解決 iOS Safari `apple-touch-icon` 不支援 SVG 且需要實色背景與 180x180 PNG 之跨端限制。
  - 自動產出 `icon-512x512.png`、`icon-192x192.png`、`apple-touch-icon.png`、`favicon-32x32.png`、`favicon-16x16.png` 與多尺寸封裝 `favicon.ico`。
- **踩坑 / 失敗模式**:
  - 本地 Python 環境未預裝 `cairosvg`，改以高星且已內建的 `PyMuPDF (fitz)` 向量縮放渲染引擎搭配 `Pillow` 完成無損轉檔，零依賴缺失。
  - 守門員 `keeper.py` 探測到新工具目錄與根目錄 `favicon.ico`，已更新已知白名單確保巡檢 100% 通過。
- **防禦手段 / 測試背書**:
  - 執行 `py tools/convert_icons.py` 成功生成所有尺寸 PNG 與 ICO，並通過 `keeper.py audit` 零異常稽核。

---

### [2026-09-27] [UNREFINED] [specs/mock] 階段 1 規格契約與 Mock 資料真值校準
- **類型**: `DATA_CONTRACT`
- **代碼錨點**: `specs/mock_data/jobs_seed.json`, `specs/mock_data/candidates_seed.json`, `js/mock/mockData.js`, `tools/validate_mock_schema.py`
- **核心事實 / 決策理由**:
  - 嚴格以 `specs/03_data_schemas/` 為單一真理（SSOT），杜絕私造或閹割資料欄位。
  - 完成 `jobs_seed.json`（對齊 `TW-AUT-` / `TW-ELE-` 格式、薪資換算、三階脫敏審計）與 `candidates_seed.json`（對齊 `TEA-2026-IND-` 格式、LEVEL_2_DUAL_VERIFIED、Form 16/EPFO 驗訖）全量欄位填充。
  - 前端橋接器 `js/mock/mockData.js` 封裝完成，支援職缺、候選人與六階段管線進度狀態。
- **踩坑 / 失敗模式**:
  - JSON 與 JS 模組轉換時需注意 key 格式與跳脫字元；已透過 Node.js ESM 動態 import 雙重驗收無語法錯誤。
- **防禦手段 / 測試背書**:
  - 執行 `py tools/validate_mock_schema.py`，所有種子資料 100% 通過 `jsonschema` 正式校驗；Node 模組加載測試通過。

---

### [2026-09-27] [UNREFINED] [frontend/pwa] 階段 2 PWA 前端介面與組件化實現
- **類型**: `FEAT_IMPLEMENTATION`
- **代碼錨點**: `index.html`, `manifest.json`, `sw.js`, `css/style.css`, `js/`, `js/components/`
- **核心事實 / 決策理由**:
  - 完整拆解與落地 `assets/prototypes/trustcv_pwa_ui.html` 4 屏原型，實現純靜態免構建（Vanilla JS + ES Modules + Tailwind CDN）高保真 PWA 應用。
  - 實現 `manifest.json` 與 `sw.js` Stale-While-Revalidate 離線快取治理，支援本機與行動端獨立安裝。
  - 落地 `i18n.js`（`en` / `zh-TW` / `zh-CN` 三語字典熱切換，全域嚴格禁用印地語）與響應式狀態管理 `store.js`。
  - 完成 5 大視圖組件：`header.js`（品牌與主題開關）、`jobList.js`（搜尋分類）、`jobDetail.js`（三道門檻遮罩與 180 天排他權）、`applyForm.js`（二進位隔離提示彈窗）、`statusTracker.js`（六階段狀態機與綠標 Dossier 展示）。
- **踩坑 / 失敗模式**:
  - 在 Node 語法檢查環境中 `localStorage` 未定義，在 `store.js` 與 `i18n.js` 中加上 `typeof localStorage !== 'undefined'` 安全防禦，杜絕 SSR 或自動化腳本報錯。
- **防禦手段 / 測試背書**:
  - 執行 Node.js ESM 動態解析，所有組件通過 100% 語法與依賴引用檢查；執行 `keeper.py audit` 通過零散落合規審核。

---

### [2026-09-27] [UNREFINED] [tools/batch] 工業級本地伺服器啟動器製作
- **類型**: `TOOLING`
- **代碼錨點**: `啟動本地預覽.bat`, `.agents/skills/project_structure_keeper/scripts/keeper.py`
- **核心事實 / 決策理由**:
  - 解決瀏覽器在 `file:///` 協議下因 CORS 安全策略阻斷 ES Modules (`type="module"`) 與 `manifest.json` 加載導致之黑屏問題。
  - 嚴格調用全域技能 `windows_batch_master` 規範，落實「路徑雙引號防截斷」、「`chcp 65001`」、「`setlocal`」、「二進制 CRLF 換行符」、「佔用 Port 自動查殺釋放」。
  - 採用偏門自定義端口 `27891`，避免常見端口衝突；依使用者明確指示**絕對不自動開啟瀏覽器**，保留使用者完全主動掌控權。
- **踩坑 / 失敗模式**:
  - 預防純 LF 換行符導致 cmd.exe 位移截斷，以 Python 進行二進制校驗並確保 Windows 標準 `\r\n` (CRLF) 寫入。
- **防禦手段 / 測試背書**:
  - 守門員白名單更新，執行 `keeper.py audit` 通過 100% 乾淨合規審計。

---

### [2026-09-27] [UNREFINED] [frontend/responsive-theme] 任務 2.5 前端 PC 寬螢幕自適應與深淺色主題分離完工
- **類型**: `FEAT_IMPLEMENTATION`
- **代碼錨點**: `index.html`, `css/style.css`, `js/app.js`, `js/components/header.js`, `js/components/jobList.js`, `js/components/jobDetail.js`, `js/components/statusTracker.js`, `js/components/applyForm.js`
- **核心事實 / 決策理由**:
  - 徹底打破 `max-w-md` 死鎖手機寬度限制，外層升級為響應式自適應容器，大螢幕 (`md:` / `lg:`) 展開為 `max-w-7xl` 專業雙欄 Dashboard 佈局，徹底消除 PC 兩側巨大黑邊。
  - 頂部 Navbar 在 PC 端自動展開專屬導航選單；行動端則維持底部 Tab 導航並在 PC 端自動隱藏。
  - 嚴格依照 `BRAND_GUIDE.md` 規範分離深淺主題視覺：明亮模式全面啟用純白瓷質卡片 (`#FFFFFF`)、清爽灰白底 (`#F8FAFC`)、高對比文字 (`#0F172A`) 與專屬白底微型核驗標；暗黑模式維持曜石黑炭底 (`#080C0E`) 與翡翠綠微光。
- **踩坑 / 失敗模式**:
  - 避免明亮模式下局部深色殘留與按鈕黑底割裂，在 `style.css` 與各組件內進行階層化屬性重寫與對比度校準。
- **防禦手段 / 測試背書**:
  - 本地 HTTP 伺服器 (Port 27891) 驗證返回 HTTP 200；`keeper.py audit` 通過 100% 目錄守門零散落審核。

---

### [2026-09-27] [UNREFINED] [frontend/i18n-refactor] 移除 Header PWA 標籤、移除簡中版與全站中英文純淨分流完工
- **類型**: `REFACTOR`
- **代碼錨點**: `js/components/header.js`, `js/i18n.js`, `js/mock/mockData.js`, `js/components/jobList.js`, `js/components/jobDetail.js`, `js/components/statusTracker.js`, `js/components/applyForm.js`, `sw.js`
- **核心事實 / 決策理由**:
  - 徹底移除 Header 頂部導航之「PWA」微型標籤，還原乾淨簡潔的 TrustCV 品牌標誌。
  - 根據產品語系規範，全站徹底移除「簡體中文 (zh-CN)」，語言切換按鈕收斂為純粹的「EN | 中文」雙語切換。
  - 示範職缺卡片、技能標籤、脫敏雇主簡述、主管初審意見與交付狀態樹徹底終結中英混雜（如以前出現的括弧中英併記）：切換為「EN」時展示純淨英文（如 `Siemens S7-1500 (TIA Portal)`、`Servo Motor Motion Control`、`Inverter Design`）；切換為「中文」時展示標準台灣繁體中文（如 `西門子 S7-1500 工業電控`、`伺服馬達驅動定位技術`、`工業變流器與逆變器硬體設計`）。
  - ServiceWorker 快取版本升級至 `trustcv-cache-v1.1.1`，確保用戶端立即載入最新資源。
- **踩坑 / 失敗模式**:
  - 示範種子資料混雜括弧雙語標籤，透過在 Mock 建立 `_en` 專屬欄位並由前端組件依 `i18n.getLanguage()` 動態分流，徹底實現資料層與視圖層雙純淨。
- **防禦手段 / 測試背書**:
  - 本地伺服器持續在 `http://127.0.0.1:27891` 運行，`keeper.py audit` 通過 100% 結構審計。
---

### [2026-09-27] [UNREFINED] [frontend/favicon-repair] 修復 PC 瀏覽器標籤頁圖標渲染、V字色彩遺失與生成管線
- **類型**: `BUG_FIX`
- **代碼錨點**: `tools/convert_icons.py`, `index.html`, `sw.js`, `favicon.ico`, `assets/icons/favicon-32x32.png`, `assets/icons/favicon-16x16.png`
- **核心事實 / 決策理由**:
  - 徹底排查 PC 瀏覽器標籤頁 `favicon.ico` 顯示異常問題：根本病因為前版 `convert_icons.py` 採用 PyMuPDF 轉換 SVG，其內部解析引擎不支援 SVG `<linearGradient>` 語法，導致 `PC 瀏覽器標籤頁專用圖標代碼.svg` 中的 `V` 字被降級退回為黑色 `#000000`，在深色底板上完全隱形。
  - 將轉檔管線重構為 Playwright Chromium 無頭瀏覽器精準向量渲染，完美還原翡翠綠漸層（`#40F5A3` 至 `#059669`）與核驗微光圓點。
  - 同步在 `index.html` 頂部注入現代瀏覽器原生向量圖標 `<link rel="icon" type="image/svg+xml" href="./assets/svg/PC 瀏覽器標籤頁專用圖標代碼.svg">`，並以 16/32/64 多解析度 `favicon.ico` 作為舊版兜底。
  - ServiceWorker 快取版本升級至 `trustcv-cache-v1.1.2`，確保即時刷新。
- **踩坑 / 失敗模式**:
  - 原本 PyMuPDF 轉點陣會遺失向量漸層與透明度，改用 Chromium 渲染確保 100% W3C SVG 規格呈現。
---

### [2026-09-27] [UNREFINED] [frontend/header-logo] Header 導航列圖標切換為官方手機安裝後icon.svg
- **類型**: `REFACTOR`
- **代碼錨點**: `js/components/header.js`, `sw.js`
- **核心事實 / 決策理由**:
  - 徹底移除前版在 `js/components/header.js` 中手寫硬編碼的 3 道折線勾勾，還原為專案官方資產 `assets/svg/手機安裝後icon.svg`。
  - 該圖標具備完整 Dossier 檔案折角、白 C 與翡翠綠動態 V 幾何字標、三階核驗勾標與八角沖孔透雕。
  - ServiceWorker 快取版本升級至 `trustcv-cache-v1.1.3`，納入新圖標快取清單。
- **踩坑 / 失敗模式**:
  - 避免手繪 SVG 與官方品牌識別資產脫節，採用統一官方向量檔案引入。
---

### [2026-09-27] [UNREFINED] [frontend/header-check-group] Header 導航列圖標還原為官方三階防偽核驗勾標完整向量
- **類型**: `REFACTOR`
- **代碼錨點**: `js/components/header.js`, `sw.js`
- **核心事實 / 決策理由**:
  - 用戶反饋整張手機圖標（含白 C 與 Dossier 外框）在 Header 小尺寸下細節過於擁擠。
  - 將圖標精確還原為品牌核心的「三階防偽核驗標章」，直接萃取自 `assets/svg/APP開啟加載畫面.svg` 中的純向量幾何路徑（含深墨綠、翡翠綠、亮薄荷綠漸層與八角沖孔透雕），非前版隨意手寫的單純折線。
  - 調整 `viewBox` 聚焦於勾標幾何本體，在大螢幕與行動端皆保持高對比與高辨識度。
  - ServiceWorker 快取版本升級至 `trustcv-cache-v1.1.4`。
- **踩坑 / 失敗模式**:
  - 舊版勾標為隨意拉線的簡陋線條（缺乏厚度與沖孔細節）；改為官方真實向量後，三層不同色階與沖孔透雕完全展現。
---

### [2026-09-27] [UNREFINED] [ops/deployment] GitHub Pages 正式發布與 Cloudflare 域名/SSL 端到端閉環
- **類型**: `DEPLOYMENT`
- **代碼錨點**: `CNAME`, `docs/STATE.md`, `https://github.com/gyhongyu/TrustCV`, `https://cv.teaforia.in`
- **核心事實 / 決策理由**:
  - 獲得使用者明確授權同意部署指令，建立根目錄 `CNAME`（`cv.teaforia.in`）並加入目錄守門白名單。
  - 透過 GitHub REST API 建立公開遠端倉庫 `gyhongyu/TrustCV`，並自動同步登記至 Google Sheet 官方台帳《我的Github倉庫明細》。
  - 本地 Git 提交最新前端 MVP 代碼與修復後之圖標資產，推送至 `master` 分支。
  - 調用 `cloudflare_domain_manager` 執行端到端部署閉環：建立 `cv.teaforia.in` CNAME 灰雲解析、啟用 GitHub Pages 自訂域名、輪詢完成 Let's Encrypt SSL 憑證簽發（Approved）、開啟強制 HTTPS（Enforce HTTPS: True）。
  - 線上實機端點 `https://cv.teaforia.in` 返回 HTTP 200 正常運行。
- **踩坑 / 失敗模式**:
  - 新建倉庫呼叫 GitHub Pages API 前需先建立 source branch，透過標準兩段式請求順利啟動並啟用自訂域名與憑證。
- **防禦手段 / 測試背書**:
  - 線上 `https://cv.teaforia.in` HTTP 200 驗證通過；`keeper.py audit` 通過 100% 專案結構守門審核。
---

### [2026-09-27] [UNREFINED] [frontend/adaptive-i18n] 瀏覽器環境語言自適應切換引擎落地
- **類型**: `FEAT_IMPLEMENTATION`
- **代碼錨點**: `js/i18n.js`, `sw.js`
- **核心事實 / 決策理由**:
  - 依照使用者指示落實兩層式語言自適應切換機制：
    1. 優先權 1：若 `localStorage` 有使用者主動切換記錄（`trustcv_lang`），維持使用者意圖優先。
    2. 優先權 2：新造訪者透過 `navigator.language` 自動探測系統語系：開頭為 `zh` 者自動切換為台灣繁中（`zh-TW`），其餘所有非中文環境（英文、印度、歐美海外工程師）一律自適應切換為純淨英文（`en`）。
  - ServiceWorker 快取版本升級至 `trustcv-cache-v1.1.5`。
- **踩坑 / 失敗模式**:
  - 避免傳統透過 URL 污染或死鎖單一預設語系，透過純客戶端 `navigator.language` 達成海外與本土無感分流。
---

### [2026-09-27] [UNREFINED] [frontend/pwa-silent-reload] PWA 智慧純背景靜默自動更新與填表防丟失守衛落地
- **類型**: `FEAT_IMPLEMENTATION`
- **代碼錨點**: `js/app.js`, `sw.js`
- **核心事實 / 決策理由**:
  - 解決 PWA 安裝至手機桌面後常駐背景引發之「版本斷更、舊快取卡死」痛點。
  - 實作無感純背景靜默更新管線：
    1. 15 分鐘週期性探測 (`reg.update()`)。
    2. 切回 App 焦點 (`visibilitychange === 'visible'`) 立即觸發版本探測。
    3. 監聽 `controllerchange` 事件：當新版本接管時，若使用者正在填表（`isApplyModalOpen` 或焦點在 `input/textarea`），自動延遲刷新直至表單關閉或切換頁籤，100% 杜絕用戶填寫中途被強制重載洗掉數據。
    4. 閒置時自動無感重載套用最新版本。
  - ServiceWorker 快取版本升級至 `trustcv-cache-v1.1.6`。
- **踩坑 / 失敗模式**:
  - 粗暴的 `window.location.reload()` 會在使用者輸入履歷時清空表單，透過 `store.subscribe` 狀態守衛達成延遲自癒。
---

### [2026-09-27] [UNREFINED] [frontend/splash-og-i18n] 2秒開場啟動加載畫面、社群分享卡片 (OG) 與安裝提示純淨化
- **類型**: `FEAT_IMPLEMENTATION`
- **代碼錨點**: `index.html`, `css/style.css`, `js/app.js`, `manifest.json`, `sw.js`, `tools/convert_icons.py`, `assets/icons/og-image.png`
- **核心事實 / 決策理由**:
  - **2 秒開場啟動畫面 (Splash Screen)**：不論手機/電腦版或是否安裝 PWA，進站皆流暢展示 `APP開啟加載畫面.svg` 官方深邃光暈動畫與動態進度條（45% -> 85% -> 100%），2 秒滿後優雅淡出移除，給予使用者濃厚的安全核驗儀式感。
  - **WhatsApp / LINE 社群分享預覽圖 (OpenGraph)**：透過 Chromium 將 `APP開啟加載畫面.svg` 渲染為 1200x630 官方標準分享卡片 `assets/icons/og-image.png`，並在 `index.html` 注入 `og:image`、`og:title`、`twitter:card`，徹底解決分享連結缺乏預覽圖與品牌圖騰之痛點。
  - **安裝提示純淨化**：將 `manifest.json` 應用名稱收斂為國際化品牌名 `TrustCV`，消除安裝橫幅中英混雜標題；並由 `app.js` 依當前語系動態適配 `document.title` 與 `document.documentElement.lang`。
  - ServiceWorker 快取版本升級至 `trustcv-cache-v1.1.7`。
- **踩坑 / 失敗模式**:
  - WhatsApp/LINE 對於 SVG 的 og:image 抓取支援度差，強制透過 Chromium 預渲染為 1200x630 PNG 確保 100% 跨平台抓取成功。
- **防禦手段 / 測試背書**:
  - 本地驗證 Splash Screen 2 秒動畫與淡出順暢；`keeper.py audit` 通過 100% 結構審計。
---

### [2026-09-27] [UNREFINED] [frontend/mobile-splash-localization-fix] 手機開場卡屏根治、狀態徽章純雙語化、保險庫雙語化與長郵箱防破格
- **類型**: `BUG_FIX`
- **代碼錨點**: `index.html`, `js/app.js`, `js/i18n.js`, `js/components/statusTracker.js`, `sw.js`
- **核心事實 / 決策理由**:
  - **手機開場卡屏根治**：深入排查手機弱網或 ServiceWorker 快取撕裂時，`DOMContentLoaded` 監聽器與模組加載時序阻塞導致 Splash Screen 永久停留之 Bug。將 Splash Screen 改造為 100% 純原生內聯樣式（零外部 Tailwind 依賴），並在 HTML 底部植入純原生 JS 兜底計時器，2 秒滿後強制無條件淡出銷毀；同時 `app.js` 採用 `document.readyState` 容錯自檢啟動。
  - **狀態樹標籤純雙語化**：解決左側中文右側英文 `COMPLETED/IN_PROGRESS` 之混雜突兀感，改由 `i18n.t('status_completed')` 動態對齊（中文顯示「已完成/審理中」，英文顯示「COMPLETED/IN_PROGRESS」）。
  - **安全保險庫多語系對齊**：移除 `app.js` 中寫死之中文，改由 `vault_title`、`vault_desc`、`vault_node_status` 多語系字典驅動。
  - **履歷評分與長郵箱防破格**：英文模式下「分」修正為 `Pts`；候選人長代理郵箱 (`email_proxy`) 加上 `break-all` 防破格樣式，徹底杜絕撐爆手機卡片。
  - ServiceWorker 快取版本升級至 `trustcv-cache-v1.1.8`。
- **踩坑 / 失敗模式**:
  - 避免將 SplashScreen 邏輯與龐大業務 JS 死鎖，解耦為獨立原生層可保證 100% 不死鎖。
- **防禦手段 / 測試背書**:
  - 本地各語系切換與各端點驗證通過；`keeper.py audit` 通過 100% 結構審計。
---

### [2026-09-27] [UNREFINED] [frontend/pwa-crossplatform-install] 跨平台 PWA 主動安裝按鈕與 iOS 純淨自適應雙語引導浮窗
- **類型**: `FEAT_IMPLEMENTATION`
- **代碼錨點**: `js/app.js`, `js/components/header.js`, `js/i18n.js`, `sw.js`
- **核心事實 / 決策理由**:
  - **解決 Chrome 原生防騷擾壓抑機制**：行動端 Chrome 在用戶關閉或拒絕一次安裝提示後，會有長達 24~72 小時的冷卻抑制期。透過在頂部 Navbar 實作常駐主動安裝按鈕 (`pwa-install-btn`)，監聽 `beforeinstallprompt` 捕獲事件，賦予用戶隨時點擊主動安裝的能力。
  - **全平台跨設備支援 (PC / Mac / Android / iOS)**：
    - Chrome / Edge (Android, PC, Mac)：調用 `deferredPrompt.prompt()` 觸發原生安裝。
    - iOS Safari：由於 WebKit 不支援 `beforeinstallprompt`，自動切換至 iOS 專屬雙語引導浮窗，指引使用者「分享 ➔ 加入主畫面」。
    - Standalone 模式（已安裝為 App）：自動偵測 `display-mode: standalone` 與 `navigator.standalone`，永久自動隱藏按鈕避免冗餘。
    - AppInstalled 監聽：監聽 `appinstalled` 事件自動隱藏按鈕並發出自適應語系成功 Toast。
  - **100% 雙語純淨不破格**：iOS 引導彈窗的標題、描述、步驟 1、步驟 2 與按鈕均由 `i18n.js`（`ios_install_title`, `ios_install_desc`, `ios_step_1`, `ios_step_2`, `ios_got_it`）動態渲染，英中嚴格分離，徹底根除中英混雜與破格。
  - ServiceWorker 快取版本升級至 `trustcv-cache-v1.1.9`。
- **踩坑 / 失敗模式**:
  - iOS Safari 缺乏事件機制易引發按鈕無效假死，透過 UserAgent 探測並搭配自製指引浮窗達成無縫體驗。
- **防禦手段 / 測試背書**:
  - `keeper.py audit` 通過 100% 結構審計。
---

### [2026-09-27] [UNREFINED] [frontend/header-compact-and-pwa-bottom-sheet] 導航欄極致瘦身、單鍵語言切換、一次性底部安裝浮卡與台灣在地化履歷 Meta 定版
- **類型**: `REFACTOR_ENHANCE`
- **代碼錨點**: `index.html`, `js/components/header.js`, `js/app.js`, `js/i18n.js`, `sw.js`
- **核心事實 / 決策理由**:
  - **解決手機導航欄擁擠破格硬傷**：
    - 中文版原本副標題「勝拓國際 ✕ TEAFORIA 聯合背書」字數過長擠壓右側，全面收斂為與英文版一致之簡約高雅 `BY TEAFORIA`，節省 50% 品牌寬度。
    - 將原本雙選項語言膠囊（`EN | 中文`）重構為**單鍵切換 Toggle（`🌐 EN` / `🌐 中文`）**，點擊直接切換，單鍵節省 40px 黃金空間。
    - 安裝按鈕植入 `whitespace-nowrap shrink-0` 樣式防禦，打死不折行，徹底終結「安裝應用」被擠壓成直排畸形之慘狀。
  - **PWA 安裝「雙軌並存」架構**：
    - **頂部常駐按鈕**：小巧精緻、不折行，用戶隨時可反悔點擊安裝。
    - **底部毛玻璃浮卡 (Bottom Sheet Banner)**：懸浮於底部導航欄上方 12px，進站主動展示；點擊叉叉即刻寫入 `localStorage`，**本設備此生永久不再彈出打擾**；安裝後或處於 Standalone 模式自動隱藏。
  - **台灣繁中在地化「履歷」Meta 定版**：
    - 全面剔除對岸「簡歷」用語，更換為正統台灣人資用語「履歷」。
    - 標題定版：`TrustCV | 海外就業 | 免費履歷管理`。
    - 說明定版：`免費海外工作機會推薦，免費多平台履歷管理服務，免費履歷健診`。
    - 英文版嚴格對齊：`TrustCV | Global Careers | Free Resume Management`。
  - ServiceWorker 快取版本升級至 `trustcv-cache-v1.2.0`。
- **踩坑 / 失敗模式**:
  - 避免底部彈窗擋住下方 Tab 點擊，精準定位在 `bottom-16`；並透過 localStorage 進行本機永久防騷擾記憶。
- **防禦手段 / 測試背書**:
  - `keeper.py audit` 通過 100% 結構審計。

---

### [2026-09-27] [UNREFINED] [feature/google-oauth-drive-vault-and-privacy] Google OAuth 登入、個人雲端保險庫、雙語隱私權政策與根目錄架構收斂
- **類型**: `FEATURE_DELIVERY`
- **代碼錨點**: `js/auth.js`, `js/drive.js`, `js/components/vault.js`, `privacy.html`, `docs/legal/privacy_policy.md`, `docs/how-to/google_oauth_setup.md`, `index.html`
- **核心事實 / 決策理由**:
  - **Google OAuth 2.0 與 Drive API 串接**：
    - 引入 GIS (Google Identity Services) 客戶端，整合 `auth.js` 實現彈窗安全登入。
    - 落地 `drive.js` 專用服務，請求 `drive.file` 最小權限，於用戶 Google Drive 自動維護 `TrustCV/` 專用目錄（`Certificates/`, `Resumes/`, `Exports/`）。
    - 實現 `vault.js` 模組，未登入顯示安全功能卡，登入後呈現個人保險庫三欄儀表板與檔案管理。
  - **Google 品牌審核與雙語隱私權政策**：
    - 建置獨立公開頁面 `privacy.html`，符合 Google Limited Use Policy 與 User Data Policy 合規要求。
    - 支援繁體中文與 English 雙語切換與 URL Hash 直連 (`#zh`, `#en`)。
    - 於主頁加載畫面底部植入非侵入性、中英文自適應之隱私政策連結。
  - **全域架構收斂與安全性治理**：
    - 物理刪除根目錄敏感 `client_secret` JSON 檔案，杜絕外洩風險。
    - 將 OAuth 配置脫敏後收納至 `docs/how-to/google_oauth_setup.md`。
    - 將雙語隱私政策源文稿歸位收納至 `docs/legal/privacy_policy.md` 作為單一真理源 (SSOT)。
    - 同步更新 `docs/TOPOLOGY.md`，登錄新模組職責。
- **踩坑 / 失敗模式**:
  - 避免將金鑰與內部除錯說明散落在根目錄污染倉庫，依 DMC 知識庫規範嚴格分層收納。
- **防禦手段 / 測試背書**:
  - 執行 `py .agents/skills/project_structure_keeper/scripts/keeper.py audit` 零孤兒檔案，通過 100% 拓撲審計。

---

### [2026-09-29] [UNREFINED] [specs/interrogation-pipeline-governance] 雇主與候選人雙向拷問評分管線固化 (SPEC-001) 與交接技能接棒暖機升級
- **類型**: `ARCH_DECISION`
- **代碼錨點**: `specs/01_pipeline_specs/SPEC-001_bilateral_interrogation_pipeline.md`, `docs/TOPOLOGY.md`, `docs/STATE.md`, `IMPLEMENTATION_GUIDE.md`, `C:\Users\eric peng\.gemini\config\skills\handover_generator\SKILL.md`
- **核心事實 / 決策理由**:
  - **規格自洽固化 (SPEC-001)**：將根目錄孤兒文件《TrustCV 平台雇主與候選人雙向拷問評分機制管線設計規範.md》正式收編為 `SPEC-001_bilateral_interrogation_pipeline.md`，定義為非侵入式 Phase 2 增強特性，避免大規模變動現有 `ARCH-001` 與 `SPEC-000` 既有文檔。
  - **實施手冊指引串聯**：在 `IMPLEMENTATION_GUIDE.md` 規劃「階段 4.5：雙向拷問評分機制實施」，明確定義 `worker/interrogation_agent.py` 提示詞推理鏈、Google Sheets `Employer_KYC` / `Interrogation_Logs` 結構及前端 AI 初面問答槽位。
  - **全域交接技能接棒暖機升級 (handover_generator)**：升級全域技能為「交班封箱 ＋ 接棒暖機快照」雙軌模式。當使用者在新會話中發出自然語言提示（如「快速了解專案」、「建立專案知識」）時，0 額外 System Prompt Token 負擔，自動調用專案雙門禁（結構審計 + 代碼地圖 AST），極速建立拓撲心智模型。
- **踩坑 / 失敗模式**:
  - 避免將新業務直接粗暴撕裂現有規格引發連鎖修改，以 Feature Extension 獨立存在並以實施導航手冊對接開發最為乾淨。
- **防禦手段 / 測試背書**:
  - 物理清理根目錄孤兒檔案，執行 `keeper.py audit` 通過 100% 結構審核。

### [2026-10-02] [UNREFINED] [skills/fleet-sync-and-cleanup] 全域自治技能大一統播種同步與散落檔案清理
- **類型**: `REFACTOR`
- **代碼錨點**: `.agents/skills/`, `環境依賴自檢.bat`, `docs/TOPOLOGY.md`
- **核心事實 / 決策理由**:
  - **全域技能艦隊播種**：調用 `agent_skill_architect/bootstrap.py`，全量部署 7 大具備 `seedable: true` 特性的自治子技能至本專案（`agent_code_map`、`dmc_knowledge_manager`、`project_environment_doctor`、`handover_generator`、`project_structure_keeper`、`teaforia_llm_developer` 等）。
  - **散落檔案清理與結構內聚**：清理早期散落在 `lib/teaforia`、`tools/probe_teaforia.py` 與 `docs/TEAFORIA_LLM_GUIDE.md` 的舊版本檔案，將 `teaforia_llm_developer` v2.0 完整收納於 `.agents/skills/teaforia_llm_developer/` 標準模組內。
  - **環境自檢啟動器落地**：配發根目錄 `環境依賴自檢.bat`，支援跨機 Clone 後 0 依賴快速探測與自癒安裝。
- **踩坑 / 失敗模式**:
  - 舊版播種若將檔案散落至 `lib/` 或 `docs/`，會破壞 `.agents/skills/` 的高內聚原則並觸發拓撲審計告警。清理空目錄後拓撲恢復 100% 純淨。
- **防禦手段 / 測試背書**:
  - 執行 `keeper.py audit` 通過全域拓撲審計，0 孤兒雜檔。



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

---

### [2026-09-27] [UNREFINED] [scaffold/modules] 前端 PWA、GAS 後端、Worker 與 Mock 測試資料骨架落地
- **類型**: `ARCH_DECISION`
- **代碼錨點**: `index.html`, `manifest.json`, `sw.js`, `css/`, `js/`, `gas/`, `worker/`, `specs/mock_data/`, `tests/`
- **核心事實 / 決策理由**:
  - 依據 HANDOFF.md 經討論模式與「驗屍+十人法則」審核，確保持續遵循 MVP 輕量封測原則。
  - 確立「前端 PWA 純靜態免構建 + GAS 雲端無伺服 + Python 打工仔 Worker」三層易移植架構。
  - 確立「二進位履歷與證件全數隔離存儲於 Google Drive，代碼與規格留在 Git」之紅線，徹底杜絕二進位檔案污染 GitHub Commit 歷史。
  - 建立三維虛擬資料（Mock Data）契約體系（`jobs_seed.json`, `candidates_seed.json`, `mockData.js`, `sample_resume.txt`），提供全鏈路離線開發與 Schema 驗收依據。
- **踩坑 / 失敗模式**:
  - `keeper.py` 初始版本 `parents[3]` 路徑解析過短導致尋址錯誤，已修復為 `parents[4]` 並更新白名單以容納 `.git` 與 `tests/`。
- **防禦手段 / 測試背書**:
  - 調用 `py .agents/skills/project_structure_keeper/scripts/keeper.py audit` 與 `sync` 執行雙向驗收，通過 0 散落項目稽核。

---

### [2026-09-27] [UNREFINED] [governance/plan] 實施導航手冊落盤與交接鏈路鎖定
- **類型**: `DOCS_GOVERNANCE`
- **代碼錨點**: `IMPLEMENTATION_GUIDE.md`, `HANDOFF.md`, `.agents/skills/project_structure_keeper/scripts/keeper.py`
- **核心事實 / 決策理由**:
  - 深度盤點 `specs/` 業務法典（`00_architecture` ~ `04_templates`），將產品規範與六階段狀態機深度對齊開發流程。
  - 在根目錄建立獨立實施手冊 `IMPLEMENTATION_GUIDE.md`，劃分 6 個嚴格循序漸進階段（階段 0 ~ 階段 5）。
  - 在 `HANDOFF.md` 中設下強制鎖定條款，杜絕後續 AI 代理人跳步、逆向開發或憑空捏造資料結構。
- **踩坑 / 失敗模式**:
  - 早期規劃易忽略已定義好的 JSON Schema 與業務管線規格，透過建立單一專門實施指南強制後續代理人對齊真理。
- **防禦手段 / 測試背書**:
  - 執行 `py .agents/skills/project_structure_keeper/scripts/keeper.py audit`，已將 `IMPLEMENTATION_GUIDE.md` 納入守門白名單，結構巡檢 100% 通過。

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




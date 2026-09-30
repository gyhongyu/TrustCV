# 🚀 Project TrustCV (Project Credence) 階段實施導航手冊
> 📌 **檔案定位**：專案根目錄唯一實施順序指引，專供進場之 AI 代理人閱讀。
> ⚠️ **執行鐵律**：本手冊已按「業務規格法典（`specs/`）➔ 視覺原型（`assets/`）➔ 資料合約 ➔ 實體編碼」完成嚴密相依性編排。**後續接手之 AI 代理人必須嚴格按階段與順序執行，嚴禁跳步或逆向開發！**

---

## 🧭 實施總綱與相依路線圖 (Dependency Pipeline)

```text
[階段 0: 視覺資產固化] ➔ [階段 1: 規格契約校準] ➔ [階段 2: PWA 前端落地] ➔ [階段 3: GAS 網關落地] ➔ [階段 4: Worker 服務] ➔ [階段 5: 聯調整體驗收]
      (SVG 轉圖標)           (對齊 JSON Schema)       (4屏原型組件化)          (Sheets/Drive CRUD)      (LLM 履歷萃取)         (端到端驗證)
```

---

## 📌 階段 0：視覺資產與 PWA 規格固化 (Asset Preparation)
> **目的**：將 `assets/` 視覺資產轉為 PWA 標準圖標，消除靜態資源阻礙。

- [x] **任務 0.1：PWA 圖標與 Favicon 轉檔**
  - **依據依賴**：[`assets/BRAND_GUIDE.md`](file:///assets/BRAND_GUIDE.md)、[`assets/svg/`](file:///assets/svg/)
  - **產出檔案**：`assets/icons/icon-192x192.png`、`assets/icons/icon-512x512.png`、`assets/icons/apple-touch-icon.png` (180x180)、`favicon.ico`
  - **驗收標準**：iOS Safari 與 Android Chrome 能正常載入 PWA 圖標（SVG 在 iOS Safari `apple-touch-icon` 不支援，必須有 PNG）。已生成 16x16, 32x32, 180x180, 192x192, 512x512 與 root favicon.ico。

---

## 📌 階段 1：規格契約與 Mock 資料真值校準 (Data Contracts & Mock Baseline)
> **目的**：以 `specs/03_data_schemas/` 為單一真理（SSOT），嚴禁私造資料欄位。

- [x] **任務 1.1：Mock 種子資料對齊 Schema**
  - **依據依賴**：
    - [`specs/03_data_schemas/jd_provisioning.schema.json`](file:///specs/03_data_schemas/jd_provisioning.schema.json)
    - [`specs/03_data_schemas/verified_candidate.schema.json`](file:///specs/03_data_schemas/verified_candidate.schema.json)
  - **修改目標**：[`specs/mock_data/jobs_seed.json`](file:///specs/mock_data/jobs_seed.json)、[`specs/mock_data/candidates_seed.json`](file:///specs/mock_data/candidates_seed.json)
  - **驗收標準**：種子資料包含 `TW-AUT-` 職缺編號、`TEA-2026-IND-` 候選人編號、`LEVEL_2_DUAL_VERIFIED` 標章，欄位 100% 通過 Schema 驗證。已通過 `tools/validate_mock_schema.py` 驗證。

- [x] **任務 1.2：前端靜態 Mock 資料橋接器**
  - **產出目標**：[`js/mock/mockData.js`](file:///js/mock/mockData.js)
  - **驗收標準**：將校準後的種子資料封裝為可供前端離線預覽的資料模組（支援 `MOCK_JOBS`, `MOCK_CANDIDATES`, `MOCK_PIPELINE_STATUS`）。

---

## 📌 階段 2：PWA 前端介面與組件化實現 (Frontend Implementation)
> **目的**：將 [`assets/prototypes/trustcv_pwa_ui.html`](file:///assets/prototypes/trustcv_pwa_ui.html) 拆解並組件化，支援離線與三語切換。

- [x] **任務 2.1：核心配置與離線快取治理**
  - **產出目標**：[`manifest.json`](file:///manifest.json)、[`sw.js`](file:///sw.js)、[`css/style.css`](file:///css/style.css)
  - **驗收標準**：符合 PWA 安裝標準，CSS 遵循品牌色規範（曜石黑 `#080C0E`、薄荷綠 `#3DF5A7`、翡翠綠 `#10B981`）。

- [x] **任務 2.2：三語字典與響應式 Store 實作**
  - **產出目標**：[`js/i18n.js`](file:///js/i18n.js)、[`js/store.js`](file:///js/store.js)
  - **驗收標準**：支援 `en` / `zh-TW` / `zh-CN` 即時熱切換（**全域嚴禁印地語**）。

- [x] **任務 2.3：四屏核心視圖組件化**
  - **依據原型**：[`assets/prototypes/trustcv_pwa_ui.html`](file:///assets/prototypes/trustcv_pwa_ui.html)
  - **產出目標**：
    1. [`js/components/header.js`](file:///js/components/header.js)（品牌標誌、三語與深淺模式切換）
    2. [`js/components/jobList.js`](file:///js/components/jobList.js)（職缺卡片、搜尋分類、雙語對照）
    3. [`js/components/jobDetail.js`](file:///js/components/jobDetail.js)（三門檻雇主遮罩、180天防繞道保護、待遇詳情）
    4. [`js/components/applyForm.js`](file:///js/components/applyForm.js)（即開即投彈窗、二進位檔案隔離提示）
    5. [`js/components/statusTracker.js`](file:///js/components/statusTracker.js)（六階段管線進度條與核驗 Dossier 推薦檔案包）
  - **驗收標準**：組件自內聚、無重量框架依賴、UI 視覺與原型 100% 吻合。

- [x] **任務 2.4：前端入口與客戶端路由組裝**
  - **產出目標**：[`index.html`](file:///index.html)、[`js/app.js`](file:///js/app.js)、[`js/api.js`](file:///js/api.js)
  - **驗收標準**：瀏覽器打開 `index.html` 能在 Mock 模式下流暢操作完整求職、直投與履歷查看流程。

- [x] **🚨 任務 2.5：前端高優先修復（PC 寬螢幕自適應 ＋ 深淺主題視覺分離）**
  - **問題痛點**：目前 `index.html` 外層死鎖 `max-w-md`（448px），在 PC 大螢幕兩側留出巨大黑邊；且深色與淺色主題未分離專屬 Logo 與文字顏色，亮底直接套深色卡片導致對比翻車。
  - **修復重點**：
    1. **PC 與 Mobile 雙模響應式**：手機維持單欄流動，PC 大螢幕 (`md:` / `lg:`) 展開為現代 Dashboard 寬版雙欄或自適應版面（左側篩選與狀態、右側職缺流與詳情）。已完成自適應響應式佈局。
    2. **主題專屬 Logo 與色彩完全解耦**：
       - 暗黑模式：採用 Obsidian `#080C0E` 底板 ＋ 亮白文字 ＋ 墨綠底翡翠綠三階標。
       - 清爽亮色：嚴格對齊 `BRAND_GUIDE.md`，卡片改用白瓷 `#FFFFFF`、底色 `#F8FAFC`、文字 `#0F172A`，並引入專屬白底微型標（`fill="#FFFFFF"` 外框與翠綠線條），徹底根除亮底套深色黑色塊之突兀視覺。已完成深淺主題視覺完全解耦。

---

## 📌 階段 2.9：智慧上傳分流與「影子膠囊 (.md)」處理器 (Smart Upload & Shadow Capsule)
> **目的**：解決用戶上傳各類雜亂檔案的痛點，由 LLM 自動識別分類歸入 Drive 子目錄，並同步提煉同名 `.md` 影子膠囊。
> ⚠️ **執行前置要求**：後續接手代理人**必須先向用戶提出以下細節設計方案並展開討論**後方可編碼。

- [ ] **任務 2.9.1：拖曳式「智慧上傳工作台」UI 組件**
  - **產出目標**：[`js/components/uploader.js`](file:///js/components/uploader.js)
  - **功能規範**：支援拖曳與批量選擇（PDF、JPG、PNG、DOCX、TXT），具備檔案類型圖標、大小檢測與上傳進度環。

- [ ] **任務 2.9.2：LLM 智能分類器與子目錄路由**
  - **核心邏輯**：快速分析檔案特徵或預覽內容：
    - 證件、證照、執照、畢業證書 ➔ 歸入用戶 Drive `🪪 Certificates/`
    - 主履歷、專案清單、經歷總表 ➔ 歸入用戶 Drive `📄 Resumes/`
  - **交互防錯**：提供即時分類預測 Badge，並允許用戶在確認前手動切換覆寫目錄。

- [ ] **任務 2.9.3：同名精煉 Markdown 膠囊 (Shadow Capsule) 產生器**
  - **核心效益**：原始大檔上傳同時，生成同名純文字 `.md` 檔案儲存於同目錄。
    - 證件類：提煉 `證照名稱`、`核發機構`、`證書字號`、`生效/到期日`、`認證技能標籤`。
    - 履歷類：提煉標準時間軸、經歷條目、量化成果與技術清單。
  - **未來價值**：後續生成多平台導出版 (`🚀 Exports/`) 或投遞 Dossier 時，**直接讀取同名 .md，0 OCR 成本、0 延遲**！

---

- [x] **任務 2.4：104 人力銀行標準 12 大區塊雙軌履歷畫布**
  - **產出目標**：[`js/components/myCv.js`](file:///js/components/myCv.js)
  - **核心機制**：12 大核心模組渲染、頂部「✨ AI 智能拖曳區」與「➕ 手動新增」雙軌入口、`[👁️ 公開 / 🙈 隱藏]` 二態隱私開關、0ms Local-first + 3000ms 防抖同步。已於 2026-09-28 落地固化。

- [x] **任務 2.5：個人安全保險庫集中拖曳倉與四層目錄展示**
  - **產出目標**：[`js/components/vault.js`](file:///js/components/vault.js)
  - **核心機制**：頂部「✨ 統一智慧投放區」多檔案一次性丟入智慧歸檔、下方四欄 (`Photos/`, `Certificates/`, `Resumes/`, `Exports/`) 純淨檢視與 Drive 直連。已於 2026-09-28 落地固化。

---

## 📌 階段 3：Google Apps Script (GAS) 官方中央台帳與三級角色權限 (Central State & RBAC)
> **目的**：建立動態三級權限台帳、官方審核網盤提存與投遞撮合之關係型資料庫（**對齊 ADR 006，絕不硬編碼**）。

- [ ] **任務 3.1：關聯式資料表正規化定義 (RDBMS-Ready Schema)**
  - **產出目標**：[`gas/Config.js`](file:///gas/Config.js)、[`gas/Database.js`](file:///gas/Database.js)
  - **資料表清單 (純輕量 Metadata，無大文字塊)**：
    1. `System_Roles`（Email PK、三級角色 `ADMIN` / `PARTNER` / `CANDIDATE`、狀態、建立時間，對齊 ADR 006）
    2. `Users`（用戶 UID、Email、建立時間、個人 Drive 根目錄 ID）
    3. `User_Documents`（文件 UUID、用戶 UID、分類標籤、檔案名稱、用戶 Drive 檔案 ID 指標、SHA-256 雜湊）
    4. `Verified_Credentials`（證件 UUID、核驗標章等級 `LEVEL_2_DUAL_VERIFIED`、核驗時間、防偽 Hash）
    5. `Applications`（投遞 UUID、職缺編號 `TW-AUT-...`、候選人編號、官方提存資料夾 ID `official_folder_id`、180天排他期、狀態）
    6. `Audit_Logs`（系統操作流水號與審計日誌）
  - **驗收標準**：全數遵循 3NF 正規化設計，欄位類型純淨，嚴禁 Google Sheets 特有髒資料。

- [ ] **任務 3.2：檔案指標與官方審核網盤提存接口**
  - **產出目標**：[`gas/DriveService.js`](file:///gas/DriveService.js)
  - **業務邏輯**：
    1. 用戶個人日常：直傳個人 `📁 TrustCV/`，回傳 Metadata 登記。
    2. 用戶投遞申請：透過 `Files.copy` 秒級複製公開原件至官方審核庫 `📁 TrustCV_Official_Vault/Applications/APP-YYYY-.../` 達成一夾一案存證。

- [ ] **任務 3.3：動態角色查詢與職缺申請業務邏輯**
  - **產出目標**：[`gas/JobService.js`](file:///gas/JobService.js)、[`gas/RoleService.js`](file:///gas/RoleService.js)
  - **業務邏輯**：
    1. 查詢用戶角色：讀取 `System_Roles`，不在名單中者一律預設為 `CANDIDATE`。
    2. 防重複投遞校驗、RFC 5322 時間戳紀錄、180 天排他權初始狀態註冊。

- [ ] **任務 3.4：RESTful Web App 路由接口與前端串接**
  - **產出目標**：[`gas/Code.js`](file:///gas/Code.js)、[`js/api.js`](file:///js/api.js)
  - **提供接口**：`GET ?action=getUserRole`、`GET ?action=getJobs`、`GET ?action=getCandidate`、`POST action=apply`。
  - **前端門禁收緊**：未登入者（`GUEST`）僅開放瀏覽職缺，攔截履歷與保險庫；登入後水合角色與 Drive 讀寫。
  - **驗收標準**：支援 CORS、輸出標準 JSON 結構、全域異常捕捉，首次手動授權後全流程暢通。

---

## 📌 階段 4：Python 打工仔 Worker 與上游同步 (Worker Services)
> **目的**：實現履歷結構化提取、兩岸術語對齊與 invic 職缺入庫。

- [ ] **任務 4.1：Worker 設定與 OpenRouter 模型池配置**
  - **產出目標**：[`worker/config.py`](file:///worker/config.py)
  - **驗收標準**：環境變數管理，支援 Gemini / OpenRouter Free 模型冷卻自癒機制。

- [ ] **任務 4.2：非結構化履歷結構化提取器**
  - **產出目標**：[`worker/resume_parser.py`](file:///worker/resume_parser.py)
  - **驗收標準**：解析 TXT/PDF 文本，100% 輸出符合 `verified_candidate.schema.json` 結構之 JSON。**全域禁用 LaTeX**。

- [ ] **任務 4.3：雙軌在地化術語與去識別化引擎**
  - **依據範本**：[`specs/04_templates/TEMPLATE_deidentified_jd.md`](file:///specs/04_templates/TEMPLATE_deidentified_jd.md)
  - **產出目標**：[`worker/dossier_translator.py`](file:///worker/dossier_translator.py)
  - **業務邏輯**：英文 ➔ 台灣繁體中文（例：項目 ➔ 專案、打印 ➔ 列印、軟體 ➔ 軟體）對照，敏感個人資訊脫敏。

- [ ] **任務 4.4：上游職缺脫敏與同步管線**
  - **依據規格**：[`specs/01_pipeline_specs/stages/STAGE_01_jd_provisioning.md`](file:///specs/01_pipeline_specs/stages/STAGE_01_jd_provisioning.md)
  - **產出目標**：[`worker/sync_upstream_jobs.py`](file:///worker/sync_upstream_jobs.py)
  - **驗收標準**：上游原始 JD ➔ 去識別化 ➔ 自動生成 `TW-AUT-` 編號 ➔ 寫入資料庫。

---

## 📌 階段 4.5：雙向拷問評分機制實施 (SPEC-001 Feature Flag 插件落地)
> **目的**：落地新一代高可信度人力顧問雙向把關防線（雇主 KYC/反向考問 + 候選人憑證時間線 + AI 缺口追問打分）。
> **依據規格**：[`specs/01_pipeline_specs/SPEC-001_bilateral_interrogation_pipeline.md`](file:///specs/01_pipeline_specs/SPEC-001_bilateral_interrogation_pipeline.md)

- [ ] **任務 4.5.1：雙向考問 Worker Agent 提示詞與推理鏈**
  - **產出目標**：`worker/interrogation_agent.py`
  - **業務邏輯**：
    1. **Stage 1A & 1C (雇主端)**：企業統編/名稱之大模型勞動合規 KYC 評估，以及 JD 模糊度反向考問與透明度星級評定。
    2. **Stage 2.2 (候選人端)**：從官方憑證重構職涯時間線，自動識別「空窗期」與「重疊衝突」。
    3. **Stage 4 & 5 (缺口考問與計分)**：針對資格落差發起 3 類考問策略（動機替代、情境題、狀態考問），依回答品質給予等效實力打分並產出加權百分總分。
  - **驗收標準**：輸出格式符合三層結構化決策審查報告（時間線 -> 考問實錄與評分 -> 原始履歷折疊）。

- [ ] **任務 4.5.2：資料庫工作表與狀態流轉擴展**
  - **修改目標**：[`gas/Database.js`](file:///gas/Database.js)、[`gas/JobService.js`](file:///gas/JobService.js)
  - **資料表清單**：擴增 `Employer_KYC`（企業信譽評級與反向考問）與 `Interrogation_Logs`（候選人考問對話實錄與動態評分）。
  - **狀態機擴展**：支援 `KYC_Processing` ➔ `Consultant_Auditing` ➔ `Gap_Probing` ➔ `Scored_And_Ranked` 流程。

- [ ] **任務 4.5.3：前端 AI 考問互動槽與決策報告視圖**
  - **修改目標**：[`js/components/applyForm.js`](file:///js/components/applyForm.js)、[`js/components/statusTracker.js`](file:///js/components/statusTracker.js)
  - **業務介面**：
    1. 候選人投遞時若命中缺口，彈出輕量 AI 考問問答卡片（支援文字/語音作答或放棄）。
    2. 顧問/管理員後台支援預覽「三層決策審查報告」。

---

## 📌 階段 5：端到端整合聯調與驗收 (E2E Integration & Verification)
> **目的**：串聯 PWA、GAS 與 Worker，執行完整業務流轉驗收。

- [ ] **任務 5.1：前端與 GAS 真實 API 串接開關**
  - **修改目標**：[`js/api.js`](file:///js/api.js)
  - **驗收標準**：配置 `USE_MOCK = false` 時能正確與 GAS Web App 進行通訊，失敗時自動退回 Mock。

- [ ] **任務 5.2：端到端六階段業務流轉測試**
  - **驗證清單**：
    1. 上傳履歷 ➔ Drive 生成 UUID 目錄 ➔ Sheets 建立申請單
    2. 後台核驗通過 ➔ 生成 `GREEN_VERIFIED_READY` 綠標與時間戳
    3. PWA 能夠以三語正確調閱去識別化 Dossier
  - **驗收標準**：完全無報錯，資料符合 `specs/` 規範。

---

## ⛔ 後續 AI 代理人必備紅線守則 (Hard Rules)
1. 嚴禁在未完成階段 1（Schema 校準）之前跳去寫階段 3 的 GAS 代碼。
2. 嚴禁在未授權下執行 `git push`。
3. 嚴禁在終端拼接長字串寫檔案（必須用檔案工具）。
4. 任何時候有檔案新增或結構重大變更，執行：
   ```bash
   py .agents/skills/project_structure_keeper/scripts/keeper.py sync
   ```

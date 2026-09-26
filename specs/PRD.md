# Project TrustCV / Credence: PWA 行動端 MVP 產品需求規格書 (PRD)

> **文檔編號**：`PRD-APP-001_PWA_MVP_SPEC`  
> **關聯架構庫**：`E:\Projects\TrustCV\`（參照 `specs/00_architecture/` 至 `specs/04_templates/`）  
> **目標產品**：`cv.teaforia.in` 漸進式 Web 應用 (PWA) MVP  
> **生效週期**：2026 年 Q4 MVP 快速上線版（兼顧 Phase 2 平滑擴展）  
> **全域鐵律**：全域嚴格禁用 LaTeX 語法、官方時間戳唯一確權、三門檻解密限制、僅支援英文與中文雙語。

---

## 1. 專案背景與 MVP 產品定位

### 1.1 業務背景與價值主張
`Project TrustCV`（線上代號 `Project Credence`）旨在打破跨國技術人才（特別是機電自動化、PLC、電力電子、半導體設備、軟韌體領域）赴台就業與跨境合作的信任壁壘。
* **人才來源多元化**：平台不局限於印度工程師，同時開放面向**台灣本土、中國大陸、香港、新加坡及其他華語地區工程師**。
* **信任前置與客觀排查**：整合源頭憑證防偽（印式 Form 16 / EPFO / 學歷；華語區離職證明 / 社保證明 / 專業證照）與真實技術過濾。
* **低成本敏捷閉環 (MVP)**：捨棄龐雜的伺服器與微服務叢集，第一階段採用「靜態 PWA + Google Apps Script (GAS) + Google Sheets (關聯資料庫) + Google Drive (安全檔案庫) + LLM 代理」，以極低維護成本實現快速上線、即開即用。

### 1.2 MVP 核心目標 (Core Objectives)
1. **即開即投 (Frictionless Discovery & Apply)**：用戶無需冗長註冊，打開 PWA 即可瀏覽台商即時脫敏招聘需求（JR/JD）。
2. **多國籍履歷中心 (Universal CV Hub)**：支援中/英文履歷與中/英文證件（PDF/圖檔）上傳，由 LLM 代理自動萃取並組裝為標準格式。
3. **智慧在地化轉換 (LLM Cross-Translation Engine)**：為免費用戶提供「一鍵轉化為台灣雇主專用繁體中文 Dossier」，自動完成兩岸及跨國專業技術術語對齊。
4. **上游 JD 自動入庫 (Upstream Automated Ingestion)**：支援勝拓（invic）等上游合作方透過標準協議格式，經由腳本直接將職缺同步至首頁展示。
5. **預留架構卡榫 (Architectural Slots)**：即使 MVP 階段暫不實作複雜功能，UI 與系統架構也必須預先保留「手機 OTP 認證」、「AI 憑證真偽自動查驗」與「勝拓顧問專屬視圖」的插槽。

---

## 2. 語言與在地化規範 (Strict Localization Standard)

* **全域支援語系 (UI & System)**：
  * **English (`en`)**：全域底層基準語言。
  * **繁體中文 (`zh-TW`)**：面向台灣雇主、勝拓顧問及台灣本地人才之主介面。
  * **簡體中文 (`zh-CN`)**：面向中國大陸及海外華語人才之介面。
* **明確排除非目標語系**：
  * **全平台嚴格禁止使用印地語 (Hindi)、泰米爾語 (Tamil) 或其他印度地方語系**。凡印度工程師赴海外高科技製造業就業，英語溝通為絕對必備門檻；其餘華語工程師以中文溝通為主。
* **多語言文件輸入相容性 (Document Ingestion)**：
  * 支援全英文或全中文之履歷文本與官方證件。
  * 系統內部儲存採雙軌並行：`data_en`（英文標準結構）與 `data_zh`（繁中/簡中標準結構）。

---

## 3. 使用者角色與權限模型 (RBAC & Architecture Slots)

系統採用輕量角色控制架構，MVP 階段僅啟用「一般用戶」與「管理員」，並為未來角色預留路由與邏輯卡榫：

```text
+-----------------------------------------------------------------------+
|                       Role & Access Matrix (RBAC)                     |
+---------------------+-------------------+-----------------------------+
| 角色名稱            | MVP 當前啟用權限  | Phase 2 預留卡榫            |
+---------------------+-------------------+-----------------------------+
| 1. 一般用戶         | - 瀏覽公開脫敏 JD | - 手機 SMS / WhatsApp OTP   |
|    (Candidate /     | - 上傳中/英履歷   | - 憑證自動 OCR 與真偽評分   |
|    Free User)       | - 證件上傳儲存    | - 數位簽署防繞道切結書      |
|                     | - LLM 智慧翻譯    | - 解鎖三門檻雇主名稱        |
|                     | - 一鍵投遞職缺    |                             |
+---------------------+-------------------+-----------------------------+
| 2. 管理員           | - 查看投遞總覽    | - 專家初審視訊排程與評分    |
|    (Teaforia Admin/ | - 查看候選人詳情  | - 佣金對帳單 (Invoice) 發行 |
|    Auditor)         | - 手動審核證件    | - 自動向上游觸發 RFC 5322   |
|                     | - 手動/腳本發布JD |   排他存證郵件              |
|                     | - 修改投遞狀態    |                             |
+---------------------+-------------------+-----------------------------+
| 3. 第三方合作夥伴   | [MVP 暫不開放]    | - 獨立子路由 /partner/invic |
|    (invic 勝拓顧問) | (架構預留插槽)    | - 批量閱覽綠標人才 Dossier  |
|                     |                   | - 一鍵發出企業面試確認      |
+---------------------+-------------------+-----------------------------+
```

---

## 4. 系統整體架構與技術棧 (Lean Static Stack)

### 4.1 技術選型
* **前端 (PWA Shell)**：
  * 單一靜態網頁架構（Single-page / Static HTML5），免除龐雜建置步驟。
  * 樣式庫：Tailwind CSS (透過 CDN 引入，搭配自適應安全區 Utilities)。
  * 互動邏輯：原生 Vanilla JS / Alpine.js（輕量化狀態驅動）。
  * 部署平台：GitHub Pages 或 Cloudflare Pages（零成本、全球 CDN 秒開）。
* **後端與運算層 (API Gateway & Compute)**：
  * Google Apps Script (GAS) Web App，提供 `doGet(e)` 與 `doPost(e)` RESTful 端點。
  * 跨域存取：配置 CORS 標頭，支援 JSONP 或標準 JSON 雙向數據交換。
* **資料持久化層 (Database & File Storage)**：
  * **結構化資料**：Google Sheets（4 張標準工作表，扮演關聯資料表）。
  * **非結構化檔案庫**：Google Drive（依候選人 UUID 建立隔離目錄，存放原始履歷與證件原件）。
* **AI 代理服務層 (LLM Integration)**：
  * 透過 GAS `UrlFetchApp` 串接 Gemini 1.5 Pro / Flash 或 OpenAI API。
  * 負責工作：多語言履歷結構化提取、中英專業術語在地化轉換。

### 4.2 系統資料拓撲圖
```text
[ 行動端 PWA: cv.teaforia.in ] 
        | 
        | (HTTPS POST/GET JSON)
        v
[ GAS Web App 核心調度腳本 ]
   |
   +---> [ Google Sheets 輕量關聯庫 ]
   |       |-- Users_Auth
   |       |-- Job_Requisitions
   |       |-- Candidate_Profiles
   |       |-- Applications
   |
   +---> [ Google Drive 檔案保險庫 ]
   |       |-- /TrustCV_Vault/{candidate_id}/*.pdf
   |
   +---> [ LLM 智慧代理 (Gemini API) ]
   |       |-- 多語言履歷自動組裝 (Resume Extraction)
   |       |-- 台灣製造業繁中在地化翻譯 (Localization)
   |
   +<--- [ 上游 invic 標準格式發送腳本 (Auto Ingestion) ]
```

---

## 5. 資料庫結構規格 (Google Sheets Schema)

所有表格欄位採用小寫蛇形命名法（snake_case）。涉及公式或評分規則一律禁止使用 LaTeX。

### 5.1 工作表 1：`Users_Auth`（使用者認證與角色）
| 欄位名稱 (Column) | 資料型態 | 說明 | 範例 / 備註 |
| :--- | :--- | :--- | :--- |
| `user_id` | String | 唯一使用者代碼 (PK) | `USR-2026-0001` |
| `email` | String | 註冊/登入電子信箱 | `engineer.raj@gmail.com` |
| `role` | String | 角色代碼 | `CANDIDATE` 或 `ADMIN` |
| `preferred_lang` | String | 偏好語系 | `en`, `zh-TW`, `zh-CN` |
| `auth_token` | String | 輕量通行憑證 | 本地儲存與 API 鑑權比對 |
| `auth_provider` | String | 驗證方式 (MVP 預設 EMAIL) | `EMAIL`（預留 `WHATSAPP_OTP`, `SMS_OTP`） |
| `created_at` | String (UTC) | 建立時間戳記 | `2026-09-27T08:00:00Z` |

### 5.2 工作表 2：`Job_Requisitions`（職缺管理表）
此表落實**防繞道三門檻**要求，嚴格隔離脫敏展示名稱與真實法定名稱。
| 欄位名稱 (Column) | 資料型態 | 說明 | 範例 / 備註 |
| :--- | :--- | :--- | :--- |
| `job_id` | String | 唯一職缺代碼 (PK) | `JR-2026-TW-01` |
| `job_title_en` | String | 職缺英文名稱 | `Senior PLC Automation Engineer` |
| `job_title_zh` | String | 職缺中文名稱 | `資深 PLC 電控自動化工程師` |
| `company_display_name` | String | **前台脫敏展示名稱** | `台灣知名半導體設備製造大廠` |
| `company_legal_name` | String | **後台真實法定名稱 (加密隔離)**| `勝拓合作客戶-XX精密機械股份有限公司` |
| `location` | String | 工作地點 | `Hsinchu / Taichung, Taiwan` |
| `skills_required` | String | 技能標籤 (逗號分隔) | `PLC, Siemens S7-1500, SCADA, Servo` |
| `experience_years_min`| Integer | 最低年資門檻 | `3` |
| `salary_range_display`| String | 薪資展示區間 | `NTD 70,000 - 95,000 / month` |
| `openings_count` | Integer | 需求人數 | `2` |
| `source_channel` | String | 職缺來源 | `INVIC_DIRECT` 或 `ADMIN_MANUAL` |
| `status` | String | 狀態 | `ACTIVE` 或 `CLOSED` |
| `published_at` | String (UTC) | 發布時間戳記 | `2026-09-27T10:00:00Z` |

### 5.3 工作表 3：`Candidate_Profiles`（候選人標準化檔案）
| 欄位名稱 (Column) | 資料型態 | 說明 | 範例 / 備註 |
| :--- | :--- | :--- | :--- |
| `candidate_id` | String | 唯一候選人代碼 (PK) | `TCV-CAN-2026-008` |
| `user_id` | String | 關聯使用者代碼 (FK) | `USR-2026-0001` |
| `full_name` | String | 真實姓名 | `Rajesh Kumar` 或 `陳志豪` |
| `nationality` | String | 國籍 | `INDIA`, `TAIWAN`, `CHINA`, `OTHER` |
| `primary_skills` | String | 核心技能組 (JSON Array) | `["Mitsubishi PLC", "Motion Control"]` |
| `total_experience_years`| Number | 總工作年資 | `5.5` |
| `education_level` | String | 最高學歷 | `B.Tech Electrical` 或 `國立大學電機碩士` |
| `profile_json_en` | String (Long) | 標準英文 Dossier (JSON) | 包含經歷、專案、證書摘要 |
| `profile_json_zh` | String (Long) | 台灣繁體中文 Dossier (JSON) | 經由 LLM 翻譯與術語在地化後之版本 |
| `cv_drive_url` | String | 原始履歷雲端硬碟連結 | Google Drive 私有檔案檢視連結 |
| `docs_vault_urls` | String (JSON) | 證件原件連結清單 (JSON) | `{"degree": "url", "tax_proof": "url"}` |
| `verification_status` | String | 誠信核驗狀態標籤 | `PENDING_REVIEW`（預留 `GREEN_VERIFIED_READY`） |
| `updated_at` | String (UTC) | 更新時間戳記 | `2026-09-27T12:00:00Z` |

### 5.4 工作表 4：`Applications`（職缺投遞與面試狀態表）
| 欄位名稱 (Column) | 資料型態 | 說明 | 範例 / 備註 |
| :--- | :--- | :--- | :--- |
| `application_id` | String | 投遞紀錄代碼 (PK) | `APP-2026-0001` |
| `job_id` | String | 關聯職缺代碼 (FK) | `JR-2026-TW-01` |
| `candidate_id` | String | 關聯候選人代碼 (FK) | `TCV-CAN-2026-008` |
| `status` | String | 投遞流程狀態機 | `SUBMITTED`, `SCREENING`, `INTERVIEW`, `ACCEPTED`, `REJECTED` |
| `admin_notes` | String | 管理員內部審查筆記 | `電控背景相符，已發送至勝拓待初審` |
| `rfc5322_timestamp` | String (UTC) | 排他存證時間戳 (RFC 5322) | `Sun, 27 Sep 2026 14:30:00 +0000` |

---

## 6. PWA 行動端 UI/UX 規範與頁面規格 (Mobile-First Layout)

### 6.1 全域版面骨架 (Global Shell Architecture)
1. **動態高度相容**：全域高度鎖定 `100dvh`（Dynamic Viewport Height），徹底解決 iOS Safari 網址列伸縮與底部工具列抖動問題。
2. **安全區沉浸適配 (Safe Area Insets)**：
   * 頂部導航列：`padding-top: max(16px, env(safe-area-inset-top))`（相容動態島 Dynamic Island 與瀏海）。
   * 底部導航列：`padding-bottom: max(12px, env(safe-area-inset-bottom))`（預留 iOS Home Indicator 手勢條）。
3. **PWA Standalone Manifest**：
   * 支援「加入主畫面 (Add to Home Screen)」，提供 WebAPK 式全螢幕沉浸體驗。
   * 針對 iOS Safari 用戶提供動態氣泡浮窗引導：「點擊下方分享按鈕 ➜ 選擇『加入主畫面』以獲得最佳面試通知體驗」。

### 6.2 底部導航欄位 5 槽位規劃 (Bottom Navigation Bar)
依據單手拇指操作熱區（Thumb Zone）設計 5 個固定標籤槽位：

```text
+-------------------------------------------------------------+
|                     底部導航列 (Bottom Nav)                  |
|  [ 💼 Jobs ]  [ 📄 My CV ]  [ 🚀 Status ]  [ 🛡️ Vault ]  [ 👤 Profile ]
|   (首頁啟用)    (核心啟用)     (核心啟用)     (架構預留)     (角色切換)
+-------------------------------------------------------------+
```

* **槽位 1：💼 Jobs（職缺首頁 - 預設落地視圖）**
  * **視覺佈局**：
    * 頂部搜尋與技能快速過濾晶片標籤（PLC / 自動化 / 電源 / 半導體）。
    * 職缺卡片流：每張卡片展示「脫敏公司別」、「職缺名稱（中英雙語）」、「工作地點（台灣）」、「薪資範圍」、「所需年資與技能標籤」。
  * **互動**：
    * 點擊卡片滑動展開詳情 Modal。
    * 底部常駐高對比投遞按鈕「Apply with My CV / 一鍵投遞」。
* **槽位 2：📄 My CV（個人履歷中心）**
  * **視覺佈局**：
    * **頂部按鈕區**：
      * 「📤 上傳檔案 (Upload CV)」：支援中/英文 PDF 或圖檔（拍照或選取照片）。
      * 「🤖 AI 一鍵組裝 (AI Smart Parse)」：自動呼叫 LLM 萃取結構化經歷。
      * 「🌐 轉化為台灣雇主專用繁中 (Translate for Taiwan)」：將英文或簡體內容一鍵轉為台灣在地化繁體術語。
    * **即時編輯卡片**：
      * 姓名、國籍（選單：印度 / 台灣 / 中國 / 其他）、聯絡信箱。
      * 核心技術棧標籤編輯器。
      * 總年資與學歷。
      * 專案經歷純文字編輯區。
    * **預覽切換 (Tab)**：支援「英文預覽 (EN)」與「台灣繁中預覽 (ZH-TW)」雙重視圖無縫切換。
* **槽位 3：🚀 Status（投遞與面試追蹤）**
  * **視覺佈局**：
    * 垂直時間軸進度清單（Timeline List）。
    * 每個投遞項目包含：職缺名稱、投遞時間、目前狀態標籤。
  * **狀態階段標記**：
    * `已送出 (Submitted)` ➜ `初審中 (Screening)` ➜ `面試安排中 (Interview Scheduled)` ➜ `已錄取/未匹配 (Closed)`。
* **槽位 4：🛡️ Vault（憑證保險庫 - MVP 啟用安全儲存，預留 Phase 2 綠標核驗）**
  * **視覺佈局**：
    * 支援多國籍證件上傳槽位：
      * 槽位 A：最高學歷證書 (Degree Certificate / 畢業證書)。
      * 槽位 B：官方稅單或公積金 (Form 16 / EPFO / 個人所得稅完稅證明 / 勞保明細)。
      * 槽位 C：離職證明或在職證明 (Official Relieving Letter / 離職信)。
    * 行動端提供「相機拍攝」與「本機檔案選取」雙按鈕。
    * 上傳後顯示「已安全加密儲存於雲端保險庫（待管理員核驗）」。
* **槽位 5：👤 Profile / Admin Switch（帳戶中心與後台切換）**
  * **視覺佈局**：
    * 語系快速切換按鈕（`English` / `繁體中文` / `简体中文`）。
    * 登入者信箱與基本資訊。
    * **管理員後台切換開關 (Admin Toggle)**：
      * 若目前使用者帳號之 `role === 'ADMIN'`，介面頂部將顯著展示「切換為審查後台 (Switch to Admin View)」按鈕。
      * 點擊後無需跳轉其他網址，直接在原 App 內切換至管理員審查介面。

---

## 7. 管理員審查後台規格 (Admin View in MVP)

當具備管理員權限的使用者切換至 Admin 模式時，前端動態載入以下三項極簡管理模組：

### 7.1 候選人投遞總覽 (Applications Triage)
* 依投遞時間倒序排列之候選人清單。
* 每張卡片顯示：候選人姓名、國籍、核心技術標籤、投遞之職缺名稱。
* **操作按鈕**：
  * 「查看標準 Dossier」：彈窗展示經由 LLM 組裝後之中英雙語簡歷。
  * 「調閱雲端原始檔案」：一鍵點擊外連開啟 Google Drive 上的原始履歷與證件原件。
  * 「狀態變更」：下拉選單快速更新狀態（`Pass to Screening` / `Set to Interview` / `Reject`），並即時回寫 Google Sheets。

### 7.2 上游職缺手動管理 (JR Management)
* 表單快速發布新職缺：輸入職缺名稱（中英）、展示名稱、真實雇主名稱、工作地點、薪資與技能要求。
* 點擊「立即發布」後，腳本寫入 `Job_Requisitions`，前端首頁即刻生效。

---

## 8. 上游 JD 自動化同步協議 (Upstream Auto Ingestion Protocol)

為了實現上游（勝拓 invic）合作方發送之招聘需求能由腳本自動入庫，系統定義此標準 JSON 接收協議。

### 8.1 API 端點與請求方式
* **端點路徑**：`https://script.google.com/macros/s/{SCRIPT_ID}/exec?action=sync_jd`
* **請求方式**：`POST`
* **資料格式**：`application/json`

### 8.2 JSON Payload 協議格式
```json
{
  "auth_secret": "TRUSTCV_UPSTREAM_SECRET_2026",
  "batch_id": "BATCH-20260927-01",
  "jobs": [
    {
      "job_title_en": "Senior PLC Control Engineer",
      "job_title_zh": "資深 PLC 電控工程師",
      "company_display_name": "台灣頂尖半導體晶圓搬運設備商",
      "company_legal_name": "勝拓合作客戶-XX自動化系統股份有限公司",
      "location": "Taichung / Hsinchu, Taiwan",
      "skills_required": ["Siemens S7-1500", "PLC", "Servo", "EtherCAT"],
      "experience_years_min": 3,
      "salary_range_display": "NTD 75,000 - 95,000 / 月",
      "openings_count": 2
    }
  ]
}
```

### 8.3 GAS 處理邏輯偽代碼 (No-LaTeX)
```text
FUNCTION doPost(request):
    PARSE json_data FROM request.postData.contents
    
    IF json_data.auth_secret IS NOT EQUAL TO UPSTREAM_SECRET:
        RETURN Response(status = 403, message = "Unauthorized")
    
    OPEN Google Sheet "Job_Requisitions"
    
    FOR EACH job IN json_data.jobs:
        GENERATE new_job_id = "JR-" + CURRENT_YEAR + "-" + RANDOM_HEX(4)
        APPEND ROW:
            job_id = new_job_id,
            job_title_en = job.job_title_en,
            job_title_zh = job.job_title_zh,
            company_display_name = job.company_display_name,
            company_legal_name = job.company_legal_name,
            location = job.location,
            skills_required = JOIN(job.skills_required, ", "),
            experience_years_min = job.experience_years_min,
            salary_range_display = job.salary_range_display,
            openings_count = job.openings_count,
            source_channel = "INVIC_AUTO_INGESTION",
            status = "ACTIVE",
            published_at = CURRENT_UTC_ISO8601_STRING()
            
    RETURN Response(status = 200, message = "Successfully ingested " + LENGTH(json_data.jobs) + " jobs")
```

---

## 9. LLM 履歷組裝與在地化翻譯規格 (Resume Extraction & Localization)

### 9.1 功能定義
使用者上傳中/英文履歷文字或 PDF 後，前端呼叫 GAS 端點觸發 LLM 代理（如 Gemini API），執行兩階段處理：
1. **結構化萃取 (Structure Extraction)**：自動將雜亂履歷解析為標準化 JSON 物件。
2. **台灣在地化繁體轉換 (Taiwan Engineering Localization)**：自動將英文或簡體術語轉化為符合台灣科技與自動化設備產業習慣之詞彙。

### 9.2 術語在地化對照基準表 (Terminology Mapping)
| 原文 (英文 / 簡體 / 印度習慣) | 台灣雇主專用繁體中文 (Taiwan Localized) |
| :--- | :--- |
| PLC Programmer / Automation Eng | PLC 電控工程師 / 自動化控制工程師 |
| Single Phase / Three Phase | 單相 / 三相電源系統 |
| Motion Controller | 運動控制器 / 伺服定位控制 |
| Commissioning on site | 廠端現場調試 / 上機試車驗收 |
| Relieving Letter | 官方正式離職證明書 |
| Form 16 / Tax Deducted | 年度所得稅扣繳憑單 (稅單) |
| Project Experience | 專案實績與機台開發經驗 |
| Debugging / Troubleshooting | 現場除錯與異常排除 |

---

## 10. Phase 2 未來架構擴展卡榫 (Phase 2 Architectural Hooks)

為了確保 MVP 快速上線後，未來演進至完整版不需要打掉重練，程式碼中已預埋以下擴充槽位：

```text
[ Hook 1: 身分驗證插槽 ]
  - MVP: Email 簡單驗證。
  - 預留介面: UserAuthManager.triggerPhoneVerification(phone_number, channel)
  - 待接通道: WhatsApp Cloud API / Twilio SMS OTP。

[ Hook 2: 憑證真偽查驗插槽 ]
  - MVP: 檔案上傳至 Drive 私有目錄，由管理員手動下載肉眼核對。
  - 預留介面: VerificationEngine.analyzeDocument(drive_file_id, doc_type)
  - 待接管道: 印式 Form 16 TRACES 官方數位簽章驗證、EPFO 存摺防偽排查。

[ Hook 3: 防繞道三門檻自動解密插槽 ]
  - MVP: 前端僅顯示 company_display_name。
  - 預留介面: SecurityGate.evaluateDecryptionRelease(candidate_id, job_id)
  - 條件門檻: (status == GREEN_VERIFIED) AND (nda_signed == TRUE) AND (interview_confirmed == TRUE)。

[ Hook 4: 勝拓獨立門戶插槽 ]
  - MVP: 僅以內部 Admin 檢視。
  - 預留路由: window.location.hash == '#/partner/invic'
  - 待接視圖: 顧問專屬之滑動式候選人審查卡片（Tinder-style Swipeable Dossier）。
```

---

## 11. 驗收標準 (Acceptance Criteria for MVP Launch)

1. **行動端適配性**：在 iPhone (Safari iOS 16+) 與 Android (Chrome) 實機上，頁面均能撐滿視窗（`100dvh`），無底部白邊，且頂部安全區完全不遮擋文字與按鈕。
2. **語系切換正常**：切換 EN、繁中、簡中時，UI 靜態文字即時變更，無任何印度地方語言遺漏。
3. **即開即投體驗**：首頁可在 1.5 秒內載入職缺列表，訪客點擊「投遞」即可啟動引導流程。
4. **LLM 轉化成功率**：上傳一份中/英文履歷文字，後端能在 6 秒內返回標準化中英對照 Dossier，且術語符合台灣製造業習慣。
5. **資料庫完整落庫**：新職缺發布、候選人投遞、檔案上傳均能在 Google Sheets 與 Google Drive 正確新增紀錄並維持關聯鍵一致。
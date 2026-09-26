# Project TrustCV: 印度高階人才引進合作計劃暨平台架構藍圖

**合作主體**：Teaforia.in（印度端核實與人才庫） × 陳小姐（台灣端企業對接與人才仲介）

**專案代號**：`Project TrustCV`（預計部署網址：`cv.teaforia.in`）

**文件版本**：v1.0 (Human-to-AI Transitional Blueprint)

**文件目的**：規範雙方合作之商業機制、權益歸屬、防繞道（Anti-Bypass）SOP，並定義未來過渡至「AI 憑證式簡歷管理系統」的數據與邏輯規格。

## 一、 專案命名與定位策略

### 1. 專案命名建議

* **對外產品名（候選人端）**：**Teaforia TrustCV** 或 **Teaforia CareerVault**

  * *Slogan*："Your Verified Career Ledger. Store proofs, build world-class CVs automatically."

  * *網址配置*：`cv.teaforia.in`

* **商業端命名（企業/中介端）**：**TrustID Talent Engine**（真確人才引擎）

  * *定位*：拒絕傳統人力仲介的「履歷垃圾灌水（Dump-and-Pray）」，以「雙重核實（Dual-Verification：憑證驗證 + 專家審核）」提供即插即用的印度技術與白領人才。

### 2. 核心痛點與雙方價值定位

* **市場痛點**：

  1. **資訊極度失真**：Naukri、LinkedIn 等平台履歷灌水嚴重，實測有效真實度低於 10%，傳統中介海投只會造成台灣企業人資困擾。

  2. **跳過中介（Bypass 糾紛）**：印度求職者習慣透過 JD 中的公司名稱直接到 104 或企業官網投遞，導致代理權與佣金認列爭議。

* **Teaforia.in 核心價值**：

  * **非純轉介**：擔任「真實性過濾器」。進駐 200\~300 封履歷，經由雙重認證只輸出最頂尖、真實的 20 份精準名單。

  * **候選人黏著力**：提供免費的「個人履歷憑證保險庫」，吸引主動尋求海外（台灣/國際）機會的優質工程師。

* **陳小姐方核心價值**：

  * 掌握台灣缺工需求（目前重點：**機電工程師**、半導體/電子硬體研發、高階白領）。

  * 負責台灣企業端的報價、合約簽署、薪資議定與履歷防重鎖定。

## 二、 現階段運作模式（Phase 1：人工標準作業 SOP）

在系統未完全上線前，雙方嚴格依照以下工作流執行，保障雙方商業利益與時間成本。

### 1. 防繞道與代理權鎖定協議（Anti-Bypass Protocol）

1. **歸屬權判定標準（Timestamp Authority）**：

   * **唯一法規標準**：以 Teaforia 官方專案 Email 寄達陳小姐指定 Email 的時間戳記（Timestamp）為準。

   * 通訊軟體（LINE、WhatsApp、微信）之對話紀錄僅供即時討論，**不具備候選人代理權鎖定效力**。

2. **JD 脫敏保護原則**：

   * 陳小姐向 Teaforia 提供 JD 時，在候選人簽署海外推薦同意書前，可隱去台灣終端聘僱公司全名（以「台灣前五大電源供應大廠」、「知名上市網通集團」代稱），避免印度端無意間外流導致人才私自透過 104 繞道。

3. **重疊履歷撞單判定**：

   * 若終端企業反映多家中介推薦同一候選人，以陳小姐系統中持有 Teaforia 提供的時間戳記郵件為首要舉證，若為第一順位寄達，佣金全額認列。

### 2. 人工雙重核實作業流（Dual-Verification Pipeline）

```
[求職者原始文件] 
       │
       ▼
【第 1 關：硬性憑證收集】
   - 護照 / 身分證件
   - 官方學位證書 (Degree Certificate)
   - 離職證明 / 服務證明 (Relieving Letter / Service Certificate)
   - 最近 3 個月薪資單 (Payslip) 或 稅單 (Form 16)
       │
       ▼
【第 2 關：Teaforia 專家人工初審 (Spouse/HR Lead)】
   - 核對公司官網與電話真實性
   - 比對經歷銜接時間線（排除虛構 Gap）
   - 初步專業英文溝通與意願確認
       │
       ▼
【第 3 關：認證標章生成 (Verified Dossier)】
   - 產出標準化 Teaforia 格式簡歷（附帶核實標籤）
       │
       ▼
【正式交割】
   - 官方 Email 傳送給陳小姐（完成 Timestamp 存證）

```

## 三、 未來平台架構（Phase 2：cv.teaforia.in AI 代理接軌規劃）

本系統的核心概念為：**「以候選人自我管理的個人檔案庫（Career Vault）切入，以 AI 代理進行深度背景查核，自動封裝為具備信任等級的標準履歷。」**

### 1. 產品架構模組（Architecture Overview）

```
+-----------------------------------------------------------------------------------+
|                        候選人端入口 (cv.teaforia.in)                               |
|  - 免費個人履歷管理器 (Free Resume Manager)                                        |
|  - 多重文件拖曳上傳 (PDF / Images / Docs)                                          |
|  - 結構化補全引導 (AI 針對缺失資料提問：動機、期望薪資、軟實力)                     |
+-----------------------------------------------------------------------------------+
                                         │
                                         ▼
+-----------------------------------------------------------------------------------+
|                       AI 核心解析與驗證代理 (Core Agent)                           |
|  [Module A: OCR & Parsing] 多模態解析畢業證、在職證明、LinkedIn、舊版 CV           |
|  [Module B: Fact Extraction] 提取時間軸、職稱、技術堆疊、簽發機構                 |
|  [Module C: Consistency Check] 交叉檢驗：上傳文件 vs 自述內容的矛盾點              |
|  [Module D: Verification API] 對接印度官方資料庫/第三方驗證（如 DigiLocker、ITR）  |
+-----------------------------------------------------------------------------------+
                                         │
                                         ▼
+-----------------------------------------------------------------------------------+
|                       Teaforia 人機協同後台 (Internal Ops)                         |
|  - AI 自動分類：High Trust (綠標) / Review Needed (黃標) / Fraud (紅標)            |
|  - 人工專家審核抽檢（由專人/太太複核特定關鍵職位）                                |
|  - 一鍵封裝輸出台灣格式標準 CV                                                    |
+-----------------------------------------------------------------------------------+
                                         │
                                         ▼
+-----------------------------------------------------------------------------------+
|                       夥伴交付 API / 郵件引擎 (Ms. Chen Gateway)                   |
|  - 自動生成具備唯一 Hash ID 與 Timestamp 的投遞封包                               |
|  - 防偽數位指紋（Digital Fingerprint）確保企業無法竄改交付時間                     |
+-----------------------------------------------------------------------------------+

```

### 2. AI 代理工作邏輯（Agent Prompt & Reasoning Rules）

AI Agent 在解析候選人資料時，須依循以下決策樹：

1. **Rule 1（事實以客觀憑證為唯一依據）**：

   * 若履歷自述為「Senior Mechanical Engineer (2021-2024)」，但 Relieving Letter 職稱為「Junior Engineer」，系統以憑證為準，並在系統備註標記 `[DISCREPANCY_TITLE_MISMATCH]`。

2. **Rule 2（免手動填寫原則）**：

   * 能從證書提取的內容（學校、主修、畢業年份、雇主名稱、在職日期）絕不要求用戶重複打字。

   * 使用者只需回答：專案成就量化數據（KPIs）、赴台意願、家庭狀況、個人愛好等主觀非證明類資訊。

3. **Rule 3（防作假偵測）**：

   * 利用 PDF Metadata 與 OCR 比對文字字型是否有一致性，防止使用 Photoshop 變造薪資單或離職信。

## 四、 機器可讀數據規格（Machine-Readable Data Schema）

為確保未來 AI 平台接手時能直接串接，定義雙方交付的候選人通用 JSON 格式：

```
{
  "$schema": "https://cv.teaforia.in/schemas/v1/verified_candidate.json",
  "dossier_id": "TEA-2026-IND-0091",
  "metadata": {
    "source_system": "cv.teaforia.in",
    "delivery_timestamp_utc": "2026-09-26T14:10:00Z",
    "partner_recipient": "Ms. Chen (Sheng-Tuo)",
    "verification_level": "LEVEL_2_DUAL_VERIFIED"
  },
  "candidate_profile": {
    "full_name": "Rajesh Kumar Sharma",
    "contact": {
      "email": "rajesh.k@teaforia-candidate.internal",
      "phone_masked": "+91-98******10",
      "current_location": "Bengaluru, Karnataka, India",
      "willing_to_relocate_taiwan": true
    },
    "target_roles": ["Electromechanical Engineer", "Automation Specialist"],
    "experience_summary": {
      "total_years_claimed": 6.5,
      "total_years_verified": 6.0,
      "core_skills": ["PLC Programming", "AutoCAD", "Mechatronics", "Wiring Harness"]
    },
    "verified_credentials": [
      {
        "type": "DEGREE",
        "institution": "Visvesvaraya Technological University",
        "degree_name": "B.Tech in Mechatronics",
        "year_of_passing": 2020,
        "verification_status": "VERIFIED_DOC_VALID"
      },
      {
        "type": "EMPLOYMENT",
        "company_name": "Uno Minda Automotive Components",
        "role": "Mechatronics Design Engineer",
        "start_date": "2021-03",
        "end_date": "2024-05",
        "relieving_letter_verified": true,
        "salary_slip_verified": true
      }
    ],
    "ai_risk_assessment": {
      "background_integrity_score": 96.5,
      "flags": []
    },
    "human_reviewer_notes": "英語表達流利，具備德系車用零組件供應商實作經驗，適應台灣工廠管理風格。"
  }
}

```

## 五、 階段性推進時程（Roadmap）

| **階段** | **時間節點** | **核心任務** | **交付產出** | 
| **Phase 1A** | 2026 年 9 月底 – 10 月初 | 建立人工對接管道、Email 格式標準化、取得首批機電工程師 JD | 正式對接 Email 確立、機電 JD 規格確認 | 
| **Phase 1B** | 2026 年 10 月中旬 | 人工試跑 3–5 位核實合格候選人推薦，測試台廠端反應與反饋 | 首批 Verified Dossier 交付 | 
| **Phase 2A** | 2026 年 Q4 | 啟動 `cv.teaforia.in` 前端憑證保險庫開發，建立 OCR 文件上傳模組 | MVP 測試網頁 (Upload & Auto-Parse) | 
| **Phase 2B** | 2027 年 Q1 | 導入 AI 代理比對與自動生成履歷功能，對接台灣仲介自動派發管道 | 全自動化 TrustCV 平台正式上線 | 

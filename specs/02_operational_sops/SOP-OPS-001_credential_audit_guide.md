# SOP-OPS-001: 印度高階人才憑證審查與真偽核實作業手冊

> **文件代號**：`SOP-OPS-001`  
> **關聯管線**：`STAGE_02_credential_verification`（Project Credence 六大階段之第二階段）  
> **適用角色**：Teaforia 人工審核小組（太太/背調專員）、後續 OCR & Fraud Detection AI 代理  
> **系統節點**：`cv.teaforia.in`  
> **生效日期**：2026 年 9 月  

---

## 1. 目的與背景原則

### 1.1 核心痛點
印度就業市場（包含 Naukri、Monster、LinkedIn）履歷灌水、造假情況極度普遍。實務數據顯示，未經排查的履歷中，**真實有效且經歷無造假者低於 10%**。常見造假手法包括：
1. **虛構空殼公司（Ghost Companies）**：購買虛假的在職證明與離職信。
2. **職稱與年資灌水（Title & Tenure Inflation）**：Junior 自述為 Senior；派遣或外包包裝為正職。
3. **薪資單竄改（Payslip Manipulation）**：使用 PDF 編輯工具提高現職薪資（Last Drawn CTC），以拉高外派薪資期待。
4. **野雞大學文憑（Unaccredited / Fake Degrees）**：提供未獲 UGC/AICTE 認證的機構文憑。

### 1.2 審查哲學：客觀原件高於一切口頭自述
Teaforia 不做「二手仲介的履歷搬運工」，我們輸出的是 **「Teaforia Verified」雙重核驗簡歷包**。
審核基本鐵律：**「凡無官方或具備公信力第三方客觀憑證支撐之工作經歷與學歷，一律不予承認或標註黃標警示。」**

---

## 2. 審查憑證清單與核對矩陣 (Verification Checklist Matrix)

每位候選人必須依序提供以下四類硬性憑證，審核員（或 AI 模組）依據標準進行比對：

| 憑證類別 | 必備文件項目 | 審查核心指標 | 優先核驗工具 / 管道 |
| :--- | :--- | :--- | :--- |
| **A. 身分與法律資格** | 1. 印度護照（Passport）<br>2. Aadhaar 卡（去識別化）<br>3. PAN 卡 | 護照有效期（需大於 18 個月）、姓名拼寫一致性、出生年月日 | 護照機器可讀區（MRZ）解析、官方驗證 |
| **B. 學歷與技術資格** | 1. 學士/碩士學位證書（Degree Certificate）<br>2. 累計成績單（Consolidated Marksheet） | 發證學校合法性、入學與畢業年份、專業名稱（如 Mechatronics） | UGC / AICTE 官方名錄、DigiLocker / NAD 資料庫 |
| **C. 在職與離職經歷** | 1. 離職證明（Relieving Letter）<br>2. 服務證明（Service Certificate）<br>3. 聘書（Offer/Appointment Letter） | 任職時間軸是否連貫、職稱是否相符、離職原因是否正常結案 | 公司官網/網域比對、MCA 企業註冊碼（CIN）、HR 官方電話 |
| **D. 薪資與真實就業** | 1. 最近 3 個月薪資單（Payslips）<br>2. Form 16（所得稅扣繳憑單）<br>3. EPFO / UAN 提撥明細 | 薪資數字一致性、稅單水印、雇主 TAN 代碼、是否有持續公積金提撥 | 印度所得稅 TRACES 官方水印、EPFO 統一帳號（UAN）記錄 |

---

## 3. 分項憑證排查細則 (Audit Protocols)

### 3.1 身份證件（Identity Verification）
1. **護照檢查（Passport）**：
   * 檢查護照首頁與簽名頁，確認至少有連續 2 頁全空白簽證頁。
   * 效期判定：距預計赴台日期必須具備 **至少 1.5 年（18 個月）以上** 有效期。
2. **PAN 卡（Permanent Account Number）**：
   * 比對 PAN 上的十碼英數編號，與 Form 16 稅單上的 Employee PAN 是否完全一致。

---

### 3.2 學歷真實性審查（Education Verification）
1. **證書有效性確認**：
   * 候選人僅提供「臨時證明（Provisional Certificate）」者，僅限於**應屆畢業一年以內**；畢業一年以上者必須出具正式「學位證書（Original Degree Certificate）」。
2. **機構資格認證排查**：
   * 審查學校是否名列於 **UGC（University Grants Commission）** 或工程類 **AICTE（All India Council for Technical Education）** 認可名冊。
   * 警惕防範各邦著名的「虛假大學黑名單」（Fake Universities List issued by UGC）。
3. **成績單（Marksheet）交叉驗證**：
   * 核對 Consolidated Marksheet 每學期（Semester 1 至 8）修業時間，排除非正常中斷或虛報學制的情況。

---

### 3.3 經歷與在職真實性審查（Employment & Relieving Verification）
1. **離職信（Relieving Letter）防偽核查**：
   * **抬頭信紙（Letterhead）**：具備完整的公司登記全名、登記地址、企業識別碼（CIN）。
   * **簽發人資訊**：必須有 HR Manager 或授權主管之簽名、正式職稱、公司官方電子郵箱（非 `@gmail.com`、`@yahoo.com` 等免費信箱）。
   * **文字模式審查**：確認離職信中包含結算完成（Relieved from duties after closing hours of [Date]）與良好品行條款。
2. **經歷時間軸排查（Gap Analysis）**：
   * 繪製候選人時間軸：`公司 A 結束日` 與 `公司 B 起始日`。
   * **異常判定**：
     * 若兩份工作出現**重疊超過 1 個月**：標記 `[FLAG_DUAL_EMPLOYMENT]`（印度近期嚴查的 Moonlighting 兼職問題）。
     * 若出現**超過 3 個月空窗（Gap）**：必須由候選人出具書面合理解釋（如準備進修、家庭照顧、健康因素），並記載於面談報告中。
3. **企業真實性溯源**：
   * 在印度商工部 **MCA（Ministry of Corporate Affairs）** 門戶網站輸入雇主名稱，確認該公司為「Active」登記狀態，非停業（Strike Off）空殼公司。

---

### 3.4 薪資與稅單真實性審查（Salary & Tax Verification）——【黃金驗證指標】
本階段為排除造假最關鍵的一環。虛假經歷者往往能偽造離職信，但**極難偽造連貫的政府稅務與公積金提撥紀錄**。

1. **Form 16（Part A）防偽查驗（最具公信力）**：
   * **TRACES 水印**：合法的 Form 16 Part A 必須直接自印度稅務局 TRACES 網站下載，背景具有清楚的 **`TRACES` 官方防偽水印**。
   * **核對要點**：
     1. Employer TAN（雇主稅籍編號）。
     2. Employee PAN（員工個人稅號）。
     3. 每一季度扣繳稅額（TDS Deducted）是否與申報薪資規模匹配。
   * **判定**：若候選人聲稱年薪 120 萬盧比（12 LPA），但出具的 Form 16 扣繳紀錄為 0 或無法提供，直接視為重大薪資灌水嫌疑。
2. **薪資單（Payslips）比對**：
   * 抽查最近 3 個月薪資單，檢視各項明細：Basic Salary、HRA、Special Allowance、Provident Fund (PF) 扣除項。
   * 計算總計（Gross Pay）減去各項扣繳是否等於實發（Net Pay）。
   * **字型防偽**：檢查 PDF 內容是否存在不同區塊字型不一、文字邊緣模糊對不齊等 Photoshop 變造痕跡。
3. **EPFO / UAN 公積金存摺（選檢 / 高風險時必檢）**：
   * 在候選人經歷存疑時，要求其提供登入 EPFO 官方系統導出的 **Passbook（公積金存摺）**。
   * 公積金記錄由印度政府維護，其上明確記錄每個月是哪一家公司代扣提撥，無法由私人偽造，為確認是否為正式聘僱之終極憑證。

---

## 4. 人工初審面談細則 (Human Interview Audit)

在憑證書面審查通過後，由 Teaforia 審核小組進行 15~20 分鐘遠端視訊初審（由太太或技術審核員主持）：

### 4.1 核心檢驗目標
1. **本人一致性確認**：確認視訊者與護照照片、學位證書照片為同一人。
2. **英文專業表達能力評級**：
   * **A 級（Fluency）**：能清晰流暢闡述技術細節，無溝通障礙。
   * **B 級（Operational）**：具備口音但語意清楚，能聽懂指令與回覆工作進度（達赴台工作門檻）。
   * **C 級（Below Standard）**：詞不達意、需多次重複提問、無法理解基本技術術語（直接淘汰）。
3. **赴台工作動機與家庭支持度（Relocation Readiness）**：
   * 是否理解外派台灣為期至少 2~3 年？
   * 婚姻狀況與家庭態度（配偶是否同意？是否有長期安頓計畫？）。
   * 期望薪資（CTC）是否落在台灣市場行情範圍內（避免期望過高浪費終端企業面試成本）。

---

## 5. 風險評級與標籤系統 (Risk Scoring & Tagging System)

審核完成後，系統（或操作員）為該名候選人賦予三種總體等級之一：

```
       [審查材料匯入]
             │
             ├── 發現嚴重造假 (偽造證書/假公司/假Form 16) ──> 【紅標 RED: FRAUD_REJECTED】 (永久封鎖)
             │
             ├── 核心證件真實，但有瑕疵 (職稱微幅落差/非官方郵箱) ──> 【黃標 YELLOW: REVIEW_NEEDED】 (需備註說明)
             │
             └── 原件齊全、時間軸連貫、Form 16 & 視訊確認無誤 ──> 【綠標 GREEN: VERIFIED_READY】 (放行提報)
```

### 標籤代碼標準庫 (System Audit Flags)

* `FLAG_DOC_CLEAN`：原件完整，各官方管道交叉驗證無誤。
* `FLAG_TITLE_MISMATCH`：履歷自述職稱與離職信官方職稱不一致（以離職信為準調整）。
* `FLAG_TENURE_GAP`：經歷間隔超過 3 個月，已附書面聲明。
* `FLAG_SALARY_INFLATED`：自述薪資與 Form 16 / Payslip 換算數字落差超過 15%。
* `FLAG_UNVERIFIED_SME`：雇主為微型企業，無法透過官方網站核實，僅憑簽章。
* `FLAG_FRAUD_FORGERY`：明確發現假圖檔、修改 PDF 元數據或假學位（直接終止流程）。

---

## 6. AI Agent 讀取與自動化解析規範 (AI Parsing Rules)

未來 `cv.teaforia.in` 自動化模組加載本規範時，應依照以下邏輯構建驗證 Agent：

```yaml
agent_parsing_logic:
  input_documents:
    - passport_pdf
    - degree_certificate_pdf
    - relieving_letters_pdf_array
    - form16_or_payslips_pdf_array

  execution_pipeline:
    step_1_ocr_extract:
      target: ["candidate_name", "date_of_birth", "degree", "university", "companies", "tenure_dates", "salaries"]
      
    step_2_cross_reference:
      name_consistency:
        rule: "Compare Passport.Name == Degree.Name == Form16.Name"
        tolerance: "Allow middle-name truncation, flag if first/last name differs."
      tenure_consistency:
        rule: "Assert Company[i].End_Date <= Company[i+1].Start_Date"
        max_overlap_days_allowed: 30
      
    step_3_metadata_security_check:
      check_pdf_producers:
        flag_if_contains: ["Photoshop", "Canva", "ILovePDF", "Nitro Pro"]
        action: "Trigger FLAG_PDF_MUTATED -> Route to Human Manual Review"

    step_4_output_schema:
      generate_json: "specs/03_data_schemas/verified_candidate.schema.json"
```

---

## 7. 驗收輸出標準 (Deliverable Standard)

本 SOP 之結案產出物為 **標準化驗證履歷封包（Teaforia Verified Dossier）**，包含：
1. **封裝 PDF**：符合台灣企業習慣之繁體中文/英文標準格式簡歷，首頁加蓋 **「Teaforia Dual-Verified」** 數位綠色標章。
2. **稽核附錄**：去敏感化之學位證書、最近任職公司之 Relieving Letter 影本、Form 16 脫敏遮罩報告。
3. **數據 Payload**：符合 `specs/03_data_schemas/verified_candidate.schema.json` 規範的完整 JSON 數據。
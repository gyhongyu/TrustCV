# STAGE_02: 候選人發掘、客觀憑證收集與雙重核實技術規格書

> **階段代碼**：`STAGE_02_credential_verification`
>
> **歸屬主幹**：`specs/01_pipeline_specs/SPEC-000_pipeline_master_framework.md`
>
> **執行實體**：
> * 核驗執行端：Teaforia India 人工審核小組（太太/背調專員）與 `cv.teaforia.in` 核驗引擎
> * 需求關聯端：勝拓國際 (`invic.com.tw` / INVIC GLOBAL CO., LTD.)
>
> **關聯數據合約**：
> * `specs/03_data_schemas/verified_candidate.schema.json`
> * `specs/03_data_schemas/audit_log.schema.json`
>
> **關聯作業 SOP**：
> * `specs/02_operational_sops/SOP-OPS-001_credential_audit_guide.md`（憑證真偽查驗細則）
> * `specs/02_operational_sops/SOP-OPS-003_candidate_tech_screen.md`（遠端初審與意願評估）
>
> **生效日期**：2026 年 9 月

---

## 1. 階段概述與核心目標 (Overview & Objectives)

### 1.1 階段定位
`STAGE_02` 為 Project Credence 全管線之**核心品質過濾防線**。其任務是徹底打破印度求職市場高達 90% 的履歷灌水與造假現象，透過「客觀原件排查 + 真人視訊調測」之雙重核實機制（Dual-Verification），將自述履歷提煉為具備高度可信度與法律效力的標準核驗人才檔案包（Teaforia Verified Dossier）。

### 1.2 核心目標 (KPIs & SLAs)
1. **真實憑證覆蓋率 100%**：提報候選人之關鍵學歷、近期工作經歷與薪資，必須有客觀公信力憑證支撐，零憑證經歷一律不予承認。
2. **精準篩選率**：在原始人才庫（如 Naukri、LinkedIn、主動投遞）中維持嚴格淘汰率，僅輸出綜合指標最頂尖的真實人才（實務合格率低於 10%）。
3. **處理時效 (Verification SLA)**：
   * 人工協同模式：自候選人交齊原件起 48 個工作小時內完成初審面談與檔案封裝。
   * AI 代理模式：OCR 結構化解析與反作假特徵提取於 180 秒內完成，自動排程視訊初審。

---

## 2. 前置條件與觸發機制 (Preconditions & Triggers)

### 2.1 入口前置條件 (Entry Conditions)
* 系統中至少存在一筆處於 `ACTIVE_SOURCING` 狀態的脫敏職缺（如 `TW-AUT-202610-01`）。
* 候選人已建立基本檔案，或由 Teaforia 招募專員從合格人才庫導入原始簡歷。

### 2.2 觸發事件 (Trigger Event)
* **事件名稱**：`EVENT_CANDIDATE_DOCS_SUBMITTED`
* **觸發載體**：
  * 人工模式：候選人透過官方 Email 或安全表單將護照、學位證書、離職信、薪資單等原件 PDF 提交至 Teaforia 專員。
  * 系統模式：候選人登入 `cv.teaforia.in` 之個人免費簡歷保險庫（Career Vault），完成多份原件檔案拖曳上傳。

---

## 3. 輸入、處理與輸出規格 (I/O Contracts)

```text
【STAGE_02 數據核驗拓撲】

[原始輸入: 候選人自述簡歷 + 原始證明文件]
       │
       ▼
【第 1 關: 硬性憑證客觀查驗 (SOP-OPS-001)】
  - 護照原件 (有效效期 > 18 個月)
  - 學位證書 (AICTE/UGC 官方認證清冊比對)
  - 離職信與工作證明 (MCA 企業代碼檢索)
  - Form 16 稅單 (TRACES 水印) / EPFO 公積金帳號
       │
       ▼
【第 2 關: 真人視訊防替考初審 (SOP-OPS-003)】
  - 鏡頭前持護照人臉骨骼特徵即時比對
  - 排除槍手、提詞器、雙螢幕作弊
  - 英文溝通評級 (Grade A / B / C)
  - 機電現場故障排除能力深抽測
  - 赴台意願與直系家屬支持度切結
       │
       ▼
【第 3 關: 風險計分與檔案封裝】
  - 計算 background_integrity_score
  - 核發標籤: GREEN_VERIFIED_READY
  - 產出唯一 dossier_id (如 TEA-2026-IND-0088)
  - 計算 SHA-256 數位指紋
       │
       ▼
[合格輸出: Teaforia Verified Dossier]
  - 寫入 audit_log
  - 流轉至 STAGE_03 準備交付 invic
```

### 3.1 輸入數據規格 (Input Specifications)
* 必須包含文件包：
  1. 候選人護照個人資訊頁清晰掃描件。
  2. 最高學歷學位證書原件掃描件（Degree Certificate）。
  3. 最近兩任雇主之官方離職信（Relieving Letter）或服務證明（Service Certificate）。
  4. 最近任期之所得稅單（Form 16）或最近 3 個月蓋章薪資單（Payslips）。
  5. 候選人原始自述履歷文字稿。

### 3.2 輸出數據規格 (Output Specifications)
依據 `specs/03_data_schemas/verified_candidate.schema.json` 產出之完整 JSON 實體：
1. `candidate_profile`：法定全名、脫敏代理信箱（`@candidate.teaforia.in`）、去敏電話、護照效期月數。
2. `verified_credentials`：經核實之學歷機構名冊認證註記、在職起訖時間、經查證之 Last Drawn CTC 薪資。
3. `human_audit_assessment`：人臉比對結果、英文評級代碼、技術面試評價、家庭支持確認標記。
4. `risk_scoring`：綜合誠信分數、風險標籤（`GREEN_VERIFIED_READY` / `YELLOW_REVIEW_NEEDED` / `RED_FRAUD_REJECTED`）、稽核標旗清單。

---

## 4. 狀態機流轉規範 (State Transition Machine)

本階段涉及的候選人生命週期狀態（`candidate_status`）流轉如下：

| 狀態代碼 | 定義與說明 | 流轉前置條件 | 下一階段候選狀態 |
| :--- | :--- | :--- | :--- |
| `CV_SUBMITTED` | 原始履歷已收錄，尚未提供原件憑證。 | 候選人完成註冊或初次接觸。 | `DOCS_UPLOADED` |
| `DOCS_UPLOADED` | 證明文件原件已上傳至系統暫存區。 | 護照、學位證、離職證明齊全。 | `DOCS_VERIFIED` 或 `RED_FRAUD_REJECTED` |
| `DOCS_VERIFIED` | 客觀原件交叉比對通過，未發現偽造。 | 通過 SOP-OPS-001 檢驗標準。 | `HUMAN_AUDITED` |
| `HUMAN_AUDITED` | 完成 15 分鐘視訊初審與技術抽測。 | 完成 SOP-OPS-003 防替考流程。 | `GREEN_VERIFIED_READY` 或 `YELLOW_REVIEW_NEEDED` |
| `GREEN_VERIFIED_READY` | 雙重核驗通過，具備高信譽推薦資格。 | 誠信分 >= 80 且英文達 Grade B 以上。 | `SUBMITTED_TO_INVIC` (STAGE_03) |
| `YELLOW_REVIEW_NEEDED` | 存在微小瑕疵（如小廠無稅單），需人工標註。 | 誠信分 65~79，需附備註。 | 由專員人工裁量是否降級提報 |
| `RED_FRAUD_REJECTED` | 證件變造、經歷造假或槍手替考。 | 命中任何紅旗指標。 | 永久封鎖（TERMINATED） |

```text
[狀態流轉圖]
CV_SUBMITTED ──> DOCS_UPLOADED ──(原件核驗)──> DOCS_VERIFIED ──(視訊初審)──> HUMAN_AUDITED
                                                                                    │
                                             ┌──────────────────────────────────────┴──────────────────────────────────────┐
                                             ▼                                                                             ▼
                                    GREEN_VERIFIED_READY                                                          YELLOW_REVIEW_NEEDED
                                    (合格，準備進入 STAGE_03)                                                      (瑕疵備註，專案核可)
```

---

## 5. 雙軌執行規格 (Dual-Track Implementation Spec)

### 5.1 人工協同模式 (Human Operator Pipeline: Mrs. Chen / Auditor)

1. **原件真偽排查（遵循 SOP-OPS-001）**：
   * 專員核對最高學歷是否屬於 UGC/AICTE 正式名冊。
   * 檢查 Form 16 是否具備 TRACES 官方水印；檢查離職信所載公司是否名列印度 MCA 商工部 Active 清單。
   * 比對薪資單與自述 Last Drawn CTC，若發現自述薪資虛報超過 30%，依規定扣分或退件。
2. **遠端調測與防替考視訊（遵循 SOP-OPS-003）**：
   * 預約 15 分鐘 Google Meet 會議。
   * 要求候選人於鏡頭前手持護照相片頁，專員比對耳朵特徵、五官骨骼與出生年月日。
   * 執行視線檢測，確認無第二螢幕提詞器或槍手同席。
   * 抽測機電故障情境題，給予英文溝通評級（Grade A / Grade B / Grade C）。
   * 詢問家庭直系親屬赴台共識，確認外派承諾年限（至少 2 年）。
3. **檔案封裝與核發標章**：
   * 由專員登入後台勾選核驗指標，填寫審核主管推薦摘要。
   * 系統自動計算綜合誠信評分，生成核驗代號（格式：`TEA-西元年-IND-流水號`）。

---

### 5.2 AI 代理自主模式 (AI Agent Architecture: Phase 2)

未來部署於 `cv.teaforia.in` 之微服務架構，由四個專屬 Agent 協同驅動：

```text
+-----------------------------------------------------------------------------------------+
|                        STAGE_02 AI 代理自主核驗架構                                      |
+-----------------------------------------------------------------------------------------+
                                             │
               [候選人於 cv.teaforia.in 上傳憑證包 (PDF/Images)]
                                             │
                                             ▼
+-----------------------------------------------------------------------------------------+
| Agent A: OCR_Extraction_Agent (多模態提取代理)                                            |
| - 結構化提取護照號碼、效期、姓名、出生年月日                                             |
| - 提取學位證書簽發年份、大學代碼、專業名稱                                               |
| - 提取在職證明/離職信之公司名稱、入職與離職月份、官方用印特徵                            |
| - 提取 Form 16 扣繳憑單之 TRACES 水印與雇主 TAN 稅號                                     |
+-----------------------------------------------------------------------------------------+
                                             │
                                             ▼
+-----------------------------------------------------------------------------------------+
| Agent B: Fraud_Detection_Agent (偽造偵測代理)                                            |
| - 檢查 PDF Metadata (檢測 Photoshop、Canva 變造痕跡與字體 Mutation)                     |
| - 調用 MCA / AICTE API 檢索公司 CIN 狀態與大學設立核准狀態                              |
| - 時間線邏輯稽核: 檢測雙重全職聘僱 (Moonlighting) 與未解釋之 90 天以上職涯空窗           |
| - 產出 background_integrity_score (100 分制) 與風險標籤清單                              |
+-----------------------------------------------------------------------------------------+
                                             │
                                             ▼
+-----------------------------------------------------------------------------------------+
| Agent C: Interview_Screening_Agent (視訊初審調測代理)                                    |
| - 人臉比對模組: 截取視訊畫面，與護照證件照進行骨骼特徵點向量比對 (相似度需 >= 0.88)      |
| - 作弊防禦模組: 視線追蹤 (Gaze Tracking) 與音訊聲紋檢測 (排除第二發聲源代答)             |
| - 語言評級模組: 即時語音辨識 (ASR)，評定語法正確度、技術詞彙密度與語速 (Grade A/B/C)    |
+-----------------------------------------------------------------------------------------+
                                             │
                                             ▼
+-----------------------------------------------------------------------------------------+
| Agent D: Dossier_Builder_Agent (履歷封裝代理)                                            |
| - 聚合上述驗證指標，生成符合 verified_candidate.schema.json 之 JSON 實體                |
| - 遮蔽個人電話與真實信箱，替換為專屬代理信箱 (@candidate.teaforia.in)                   |
| - 運算全包 SHA-256 數位指紋，標記狀態為 GREEN_VERIFIED_READY                             |
+-----------------------------------------------------------------------------------------+
```

---

## 6. 品質檢驗閘門與安全斷言 (Quality Gates & Assertions)

在候選人狀態流轉至 `GREEN_VERIFIED_READY` 之前，系統必須強制通過以下四道品質檢驗閘門：

```text
【Gate 1：國際外派法規閘門】
斷言 1：護照距今有效剩餘月數 (passport_valid_months_remaining) 必須 >= 18 個月。
斷言 2：年齡需符合台灣白領聘僱法定標準，且具備全職工作合法權限。
判定標準：違規直接阻斷，標記為 ERR_PASSPORT_EXPIRING_SOON。

【Gate 2：客觀憑證支撐閘門】
斷言 1：最高學歷必須具備正式學位證書原件，且機構名列於 UGC / AICTE 名冊。
斷言 2：自述工作經歷中，至少最近一任主要經歷必須具備官方離職信或 Form 16 / EPFO 支持。
判定標準：無憑證支撐之經歷年資從總年資中扣除；若造假則判定為 RED_FRAUD_REJECTED。

【Gate 3：防替考與身份一致性閘門】
斷言 1：真人視訊畫面與護照相片頁特徵比對通過 (identity_facial_match_passed == true)。
斷言 2：面試期間未檢測到提示槍手或提詞外掛 (teleprompter_flag == false)。
判定標準：替考或槍手介入者，永久封鎖並標記為 FLAG_FRAUD_FORGERY。

【Gate 4：語言與赴台意願閘門】
斷言 1：英語溝通評級不得為 Grade C (english_communication_level IN ['GRADE_A_FLUENT', 'GRADE_B_OPERATIONAL'])。
斷言 2：家庭共識已取得，且外派意願明確 (family_consent_secured == true)。
判定標準：未達標者不予進入交付管線。
```

---

## 7. 異常處置標準與中斷代碼 (Exception Handling)

| 異常代碼 | 異常情境說明 | 處置程序與系統行為 |
| :--- | :--- | :--- |
| `ERR_DEGREE_UNACCREDITED` | 畢業機構未獲 AICTE 或 UGC 認可（野雞大學文憑）。 | 扣除其大學學歷加分；若該職缺具備學士硬性門檻，系統自動判定資格不符並歸檔。 |
| `ERR_SALARY_INFLATION_EXCESS` | 薪資單顯示實際月薪與履歷自述期待脫節，或自述薪資虛報 > 30%。 | 系統強制校正 Last Drawn CTC 為憑證實發金額，並將背景誠信分扣抵 20 分。 |
| `ERR_UNEXPLAINED_CAREER_GAP` | 經歷中存在超過 90 天之未說明職涯中斷，且無病歷或培訓證明。 | 標記為 `YELLOW_REVIEW_NEEDED`，初審專員必須於面試中追問原因並記錄於摘要。 |
| `ERR_FORGED_DOCUMENT_DETECTED` | PDF Metadata 顯示由圖像編輯器竄改字體，或印章邊緣具明顯拼貼痕跡。 | 系統阻斷流程，狀態直接變更為 `RED_FRAUD_REJECTED`，列入黑名單不再受理。 |
| `ERR_ENGLISH_BELOW_OPERATIONAL` | 英語理解困難，無法以完整句子回答專業問題（Grade C）。 | 淘汰該候選人，不予提報 invic；引導其參加語言培訓後再行評估。 |

---

## 8. 交付物與結案標準 (Deliverables & Exit Criteria)

### 8.1 階段交付物清單
1. **核驗人才數據實體**：符合 `verified_candidate.schema.json` 之 JSON 封包。
2. **標準化核驗履歷檔案（Verified Dossier PDF）**：包含 Teaforia 綠標防偽印記、主管面試評價與脫敏憑證摘要。
3. **核驗審計記錄**：寫入 `audit_log.schema.json` 之 `LOG-[YYYY]-VERIFY-[ID]` 存證。

### 8.2 階段結案標準 (Exit Gate)
* 候選人狀態流轉為 `GREEN_VERIFIED_READY`（或經專案主管特別簽核之 `YELLOW_REVIEW_NEEDED`）。
* 數據封包完成 SHA-256 數位指紋簽名。
* 管線自動觸發銜接至 `STAGE_03_official_submission`，排入對 invic 的正式時間戳交付佇列。
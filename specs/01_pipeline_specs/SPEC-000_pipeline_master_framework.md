# Project Credence: 跨國技術人才引進流程規格書
## (Cross-Border Talent Pipeline Architecture & Stage Process Framework)

* **文件編號**：`SPEC-PROC-2026-V1`
* **專案代號**：`Project Credence`（平台對應網址：`cv.teaforia.in`）
* **版本狀態**：`v1.0.0 (Release Candidate)`
* **生效日期**：2026 年 9 月
* **架構定位**：雙軌通用規格書（設計給目前人工協同執行，並作為未來 `cv.teaforia.in` AI 代理自主驅動之系統邏輯基底）。

---

## 1. 組織識別與實體映射 (Entity Mapping & Governance)

為確保文檔在法律、商務與系統代碼中的唯一性，本流程中的合作實體定義如下：

| 實體代碼 (`Entity Code`) | 商業全稱 / 法人主體 | 角色職責 | 數位通訊節點 |
| :--- | :--- | :--- | :--- |
| **`invic`**（陳小姐方） | 勝拓國際股份有限公司<br>(`INVIC GLOBAL CO., LTD.`)<br>*官網：www.invic.com.tw* | 台灣端總代理、需求發起端、終端企業合約簽署、最終面試評估、華語與跨文化適應培訓、佣金收取。 | 官方對接郵箱、企業對接後台 |
| **`teaforia`**（Teaforia 方） | Teaforia India (`teaforia.in`)<br>*系統代號：cv.teaforia.in* | 印度端人才庫運營、真實憑證採集、雙重核實（憑證驗證 + 專家審查）、防繞道確權、交付標準化簡歷包。 | `verification@cv.teaforia.in`、API Gateway |
| **`client`** | 台灣終端聘僱企業 | 開出職缺、進行技術面試、發出正式 Offer、支付聘僱佣金。 | 透過 `invic` 間接對接 |
| **`candidate`** | 印度技術/白領候選人 | 提供客觀憑證、授權跨境查核、參與評估面談。 | `cv.teaforia.in` 候選人端入口 |

---

## 2. 流程架構設計原則 (Architecture Principles)

本文件依循企業級業務流程管理（BPM）與軟體工程規格設計，所有後續擴充之階段必須嚴格遵守以下四項準則：

1. **流程與 SOP 解耦（Process-SOP Decoupling）**：
   * **流程規格（Process Spec）** 規範「何時做（Trigger）、誰負責（Actor）、輸入輸出數據（I/O）、何時結束（Exit Criteria）」。
   * **作業細則（SOP）** 規範「具體操作手冊、面談話術、工具使用教學」。SOP 作為獨立附錄或獨立文檔索引，不混入主幹流程。
2. **單一真實來源（Single Source of Truth, SSOT）**：
   * 候選人歸屬權與時效性一律以「具備伺服器時間戳記（Server Timestamp）的交付信號」為唯一法定標準，不採納通訊軟體非結構化訊息。
3. **資訊隔離與防繞道（Blind Matching & Anti-Bypass）**：
   * 需求端與候選人端雙向脫敏。未達指定授權階段前，隱匿企業全稱與候選人私人聯絡管道。
4. **雙軌相容性（Dual-Execution Compatibility）**：
   * 每個階段均定義「當前人工運作規格」與「未來 AI 代理規格」，確保代碼化轉換時無業務邏輯斷層。

---

## 3. 全域狀態機生命週期 (State Machine Lifecycle)

整個引進管線由六大核心狀態構成，狀態之間的流轉必須具備明確的事件觸發（Event Trigger）：

```
[STAGE 1: JD Provisioning]
        │  Event: EVT_JD_CONFIRMED
        ▼
[STAGE 2: Credential Verification]
        │  Event: EVT_DOSSIER_VERIFIED
        ▼
[STAGE 3: Official Submission] ◄── [唯一代理確權時間戳鎖定生效]
        │  Event: EVT_SUBMISSION_ACKNOWLEDGED
        ▼
[STAGE 4: invic Screening]
        │  Event: EVT_INVIC_PASSED
        ▼
[STAGE 5: Final Interview & Matching]
        │  Event: EVT_OFFER_ISSUED
        ▼
[STAGE 6: Hire & Commission Settlement]
        │  Event: EVT_SETTLEMENT_CLOSED
        ▼
[PIPELINE_COMPLETE]
```

### 全域狀態定義表

| 狀態代碼 (`State`) | 階段名稱 | 負責方 (`Owner`) | 關鍵交付物 (`Key Output`) |
| :--- | :--- | :--- | :--- |
| `S1_JD_ACTIVE` | 需求確認生效 | `invic` | 脫敏版標準職缺規格書 (`De-identified JD`) |
| `S2_DOSSIER_VERIFIED` | 憑證雙重核實完畢 | `teaforia` | 標準驗證報告包 (`Verified Dossier`) |
| `S3_SUBMITTED_LOCKED` | 官方提報與確權存證 | `teaforia` | 提報時間戳收據 (`Submission Timestamp Receipt`) |
| `S4_INVIC_QUALIFIED` | invic 審查通過 | `invic` | 初審合格通知書 (`Screening Pass Report`) |
| `S5_OFFER_ACCEPTED` | 面試完成與企業錄用 | `invic` + `client` | 正式聘僱合約 (`Signed Offer Letter`) |
| `S6_SETTLED_CLOSED` | 落地對接與佣金結算 | 雙方共同 | 結案對帳單與款項結清 (`Settlement Receipt`) |

---

## 4. 階段詳細流程規格書 (Stage Process Specifications)

---

### 階段一：職缺需求發布 (Stage 01: JD Provisioning)

* **階段代碼**：`STAGE_01_JD_PROVISIONING`
* **階段目標**：確立台灣企業之真實職缺規格，建立去識別化需求檔案，作為印度端精準檢索與審核的標準。
* **前置條件**：`invic` 與台灣終端企業已簽署有效人才招募委任合約。
* **觸發事件**：`invic` 收到企業具體職缺需求並啟動招募。

#### 1. 輸入規格 (Inputs)
* 原始 Job Description（包含工作職掌、硬性技術堆疊、年資、工作地點、薪資範圍）。
* 簽證與出國門檻需求（如：學士最低門檻、出國意願、到職期限）。

#### 2. 流程步驟與權責 (Process & Responsibilities)
1. **需求結構化**（`invic`）：將企業需求梳理為標準格式，確認年薪總包（CTC）及試用期規範。
2. **脫敏處理（De-identification）**（`invic`）：遮蔽企業法人全稱、廠區精確地址、主要主管個資，轉化為產業代碼（如：「台灣前五大電源模組大廠」）。
3. **派發至對接管道**（`invic` ➔ `teaforia`）：透過官方信箱發送至 Teaforia 接收窗口。
4. **收單與可行性確認**（`teaforia`）：比對印度人才庫儲備與市場行情，回覆確認收案。

#### 3. 輸出規格 (Outputs)
* 標準脫敏需求單：`JD_PACK_[JD_CODE].json` 或標準 PDF 文件。
* 系統狀態流轉為：`S1_JD_ACTIVE`。

#### 4. 結案驗收標準 (Exit Criteria)
* 需求具備明確的「硬性技術條件」與「薪資範圍」，雙方確認無疑義。

#### 5. 執行模式對照

| 維度 | 人工模式 (Phase 1) | AI 代理規格 (Phase 2 @ cv.teaforia.in) |
| :--- | :--- | :--- |
| **執行主體** | 陳小姐 (`invic`) × Michael (`teaforia`) | `JD_Ingestion_Agent` (API / Partner Webhook) |
| **傳輸介質** | 官方指定 Email | 結構化 API Post：`/api/v1/partner/jd/create` |
| **防偽/安全** | 手動刪除郵件與附件中的企業抬頭 | NLP 自動實體辨識（NER）遮蔽企業機敏資訊 |

---

### 階段二：憑證核實與簡歷生成 (Stage 02: Credential Verification)

* **階段代碼**：`STAGE_02_CREDENTIAL_VERIFICATION`
* **階段目標**：徹底剔除印度市場高達 90% 的失真履歷，透過客觀公文憑證與專家複審，產出具備信任標章的人才檔案。
* **前置條件**：`S1_JD_ACTIVE` 狀態確立。
* **觸發事件**：候選人向 Teaforia 投遞資料，或系統自履歷管理器檢索匹配。

#### 1. 輸入規格 (Inputs)
* 候選人個人原始 CV。
* **必要法定憑證原件（PDF/圖檔）**：
  * 最高學歷畢業證書 / 學位證（Degree Certificate）。
  * 過去任職公司離職證明 / 服務證明（Relieving Letter / Service Certificate）。
  * 近三個月薪資單（Payslips）或個人所得稅申報單（Form 16）。
  * 護照照片頁。

#### 2. 流程步驟與權責 (Process & Responsibilities)
1. **原件完整性檢驗**（`teaforia`）：檢查四項硬性憑證是否齊全，缺漏者直接阻絕，不予進入下游客程。
2. **客觀事實稽核**（`teaforia`）：
   * 學校真實性與學位認證核對。
   * 任職公司真實性（電話/官網/LinkedIn 交叉比對）。
   * 經歷銜接連續性，排查虛假工作時間軸（Gap Fraud）。
   * 薪資與自述職級匹配度審核。
3. **專家人工複審（Human Audit）**（`teaforia`）：
   * 由專屬審核員進行遠端英語溝通測試、赴台工作動機確認。
4. **生成交付檔案包**（`teaforia`）：自動或手動封裝成 Teaforia Verified Dossier，隱去候選人個人直接聯絡方式（電話、私人信箱），改以系統虛擬代碼取代。

#### 3. 輸出規格 (Outputs)
* 標準核實檔案：`TEA_VERIFIED_[CANDIDATE_ID].pdf` / `.json`。
* 系統狀態流轉為：`S2_DOSSIER_VERIFIED`。

#### 4. 結案驗收標準 (Exit Criteria)
* 所有經歷至少取得一項客觀官方憑證佐證；審核員給予明確背書標記（Level-2 Dual Verified）。

#### 5. 執行模式對照

| 維度 | 人工模式 (Phase 1) | AI 代理規格 (Phase 2 @ cv.teaforia.in) |
| :--- | :--- | :--- |
| **執行主體** | Teaforia 審查團隊（Spouse/HR Lead） | `Verification_Agent` + `OCR_Parser` + 人工複核 UI |
| **數據檢驗** | 人工開啟 PDF 比對字體、簽章與薪資數字 | OCR 解析 + 印度政府/第三方 API 查驗 |
| **格式封裝** | 人工套用 Teaforia Word/PDF 模板排版 | 系統動態生成具備防偽浮水印的標準 HTML/PDF |

---

### 階段三：官方提報與確權存證 (Stage 03: Official Submission)

* **階段代碼**：`STAGE_03_OFFICIAL_SUBMISSION`
* **階段目標**：正式將核實人才檔案交付 `invic`，並在法理上永久建立該候選人的「推薦優先所有權（Ownership Precedence）」。
* **前置條件**：`S2_DOSSIER_VERIFIED` 狀態確立。
* **觸發事件**：Teaforia 核定履歷合格，向 `invic` 送件。

#### 1. 輸入規格 (Inputs)
* `TEA_VERIFIED_[CANDIDATE_ID]` 檔案包。
* 對應之 `JD_CODE`。

#### 2. 流程步驟與權責 (Process & Responsibilities)
1. **信件標準化構建**（`teaforia`）：
   * 發信人：Teaforia 官方專屬對接信箱。
   * 收信人：`invic` 指定官方信箱。
   * 主旨規範：`[Teaforia Verified] [JD代碼] 候選人編號_專業領域`。
2. **發送與時間戳存證（Timestamp Authority）**（`teaforia` ➔ `invic`）：
   * 郵件寄出，以郵件伺服器收發記錄（SMTP Headers / Delivery Receipt）作為唯一法定時間戳記。
3. **確權歸屬鎖定**（雙方約定法規）：
   * 自該時間戳生效起，該候選人於該企業之推薦權歸屬 `invic` 與 `teaforia` 合作鏈，具備排他性。通訊軟體（LINE/WhatsApp）對話不具確權效力。

#### 3. 輸出規格 (Outputs)
* 具備完整 RFC 3339 時間戳之官方交付郵件記錄。
* 系統狀態流轉為：`S3_SUBMITTED_LOCKED`。

#### 4. 結案驗收標準 (Exit Criteria)
* 郵件成功送達 `invic` 伺服器，無退信記錄。

#### 5. 執行模式對照

| 維度 | 人工模式 (Phase 1) | AI 代理規格 (Phase 2 @ cv.teaforia.in) |
| :--- | :--- | :--- |
| **執行主體** | Michael (`teaforia`) | `Dispatch_Agent` (自動派發引擎) |
| **確權證據** | Email 原始標頭（E-mail MIME Headers）存檔 | SHA-256 數位簽章 + 系統審計日誌（Audit Log） |

---

### 階段四：invic 審核與篩選評估 (Stage 04: invic Screening)

* **階段代碼**：`STAGE_04_INVIC_SCREENING`
* **階段目標**：`invic` 依據台灣市場偏好及終端企業文化進行在地適配性複核。
* **前置條件**：`S3_SUBMITTED_LOCKED` 狀態確立。
* **觸發事件**：`invic` 收到官方提報郵件。

#### 1. 輸入規格 (Inputs)
* Teaforia 提供的核驗報告包及對應 JD 要求。

#### 2. 流程步驟與權責 (Process & Responsibilities)
1. **客戶規格比對**（`invic`）：檢視技能組是否完全切合終端企業主管偏好。
2. **篩選決定與反饋**（`invic`）：
   * 應於約定服務水準協議（SLA，建議 3~5 個工作天內）回覆審核結果。
   * **決策分支 A（合格）**：推進至階段五，發出初審通過通知。
   * **決策分支 B（保留/微調）**：要求補充特定技術專案佐證材料。
   * **決策分支 C（淘汰）**：說明結構化淘汰原因（如：薪資預期超標、缺少關鍵設備操作經驗）。

#### 3. 輸出規格 (Outputs)
* 審核反饋通知（通過 / 淘汰原因說明）。
* 系統狀態流轉為：`S4_INVIC_QUALIFIED` 或 `STATE_REJECTED`。

#### 4. 結案驗收標準 (Exit Criteria)
* `invic` 官方信箱明確回覆確認推進面試或具體退件理由。

#### 5. 執行模式對照

| 維度 | 人工模式 (Phase 1) | AI 代理規格 (Phase 2 @ cv.teaforia.in) |
| :--- | :--- | :--- |
| **執行主體** | 陳小姐團隊 (`invic`) | Partner Dashboard 審批流 |
| **反饋介面** | 郵件回信確認 | 儀表板一鍵勾選：「Accept」/「Reject with Reason」 |

---

### 階段五：最終面試與終端對接 (Stage 05: Final Interview & Matching)

* **階段代碼**：`STAGE_05_FINAL_INTERVIEW`
* **階段目標**：完成 `invic` 顧問評估面談與台灣企業端最終技術面試，促成雙方發放 Offer。
* **前置條件**：`S4_INVIC_QUALIFIED` 狀態確立。
* **觸發事件**：企業端通知安排線上面試。

#### 1. 輸入規格 (Inputs)
* 候選人可用時間區間（IST 時區）。
* 企業面試官可用時間區間（CST 時區）。

#### 2. 流程步驟與權責 (Process & Responsibilities)
1. **面試前置輔導**（`teaforia`）：
   * 測試視訊連線品質、輔導面試環境與儀態。
   * 複習其在 Verified Dossier 所述之真實專案數據。
2. **invic 評估面談**（`invic`）：
   * 評估候選人跨文化適應力，說明台灣職場環境，評估華語培訓潛力。
3. **終端企業正式面試**（`client` 主導，`invic` 協同，`teaforia` 支援候選人端）：
   * 線上技術面談與答辯。
4. **意向與薪資協調**（`invic` 負責企業端，`teaforia` 負責候選人端）：
   * 企業確認錄用後，協調發出正式 Offer Letter。

#### 3. 輸出規格 (Outputs)
* 雙方簽署之正式錄用信：`SIGNED_OFFER_[CANDIDATE_ID].pdf`。
* 系統狀態流轉為：`S5_OFFER_ACCEPTED`。

#### 4. 結案驗收標準 (Exit Criteria)
* 企業與候選人雙方在 Offer Letter 上完成合法簽署。

#### 5. 執行模式對照

| 維度 | 人工模式 (Phase 1) | AI 代理規格 (Phase 2 @ cv.teaforia.in) |
| :--- | :--- | :--- |
| **執行主體** | 雙方負責人手動協調時區排程 | `Calendar_Coordination_Agent` |
| **面試輔導** | 人工 WhatsApp/電話通知注意要點 | 系統自動發送跨文化指南與設備檢測連結 |

---

### 階段六：正式錄用與佣金結算 (Stage 06: Hire & Settlement)

* **階段代碼**：`STAGE_06_HIRE_AND_SETTLEMENT`
* **階段目標**：追蹤人才落地到職，確保企業款項回收，並依商務協議完成雙方收益結算與對帳結案。
* **前置條件**：`S5_OFFER_ACCEPTED` 狀態確立。
* **觸發事件**：候選人抵台報到到職（Onboarding）。

#### 1. 輸入規格 (Inputs)
* 簽署之 Offer Letter（確認實際薪資基數）。
* 候選人正式到職日證明（企業到職通知單）。
* 雙方約定之分潤協議標準（如：企業收費之約定拆分比或固定人頭服務費）。

#### 2. 流程步驟與權責 (Process & Responsibilities)
1. **簽證與抵台輔導**：
   * `teaforia`：協助印度端良民證（PCC）、體檢、簽證文件收集。
   * `invic`：辦理台灣端工作許可（Work Permit）、入國簽證對接及接機/生活安置規劃。
2. **企業帳款催收（Accounts Receivable）**（`invic`）：
   * 候選人到職後，`invic` 依約向委任企業開立發票收取招募服務費。
3. **雙方收益結算與撥款（Settlement & Payout）**（`invic` ➔ `teaforia`）：
   * 企業款項入帳後（或約定保證期過後），`invic` 提供收款證明。
   * `teaforia` 開立商業 Invoice。
   * `invic` 於約定天數內將 Teaforia 應得分潤電匯至 Teaforia 指定銀行帳戶。
4. **結案存檔**（雙方）：完成財務沖銷，專案歸檔。

#### 3. 輸出規格 (Outputs)
* 銀行匯款電文單據與雙邊簽署對帳單。
* 系統狀態流轉為：`S6_SETTLED_CLOSED`（引進專案圓滿終結）。

#### 4. 結案驗收標準 (Exit Criteria)
* 雙邊款項清算完畢，候選人渡過合約約定之離職保證期。

#### 5. 執行模式對照

| 維度 | 人工模式 (Phase 1) | AI 代理規格 (Phase 2 @ cv.teaforia.in) |
| :--- | :--- | :--- |
| **執行主體** | 雙方會計/負責人手動核對 Invoice | `Billing_Agent` 自動產生對帳單與款項追蹤 |
| **金流追蹤** | 跨國電匯單據人工發送郵件通知 | 平台集成 Stripe/Wise 企業級跨境金流對帳 Webhook |

---

## 5. 流程異常處理與斷點保護 (Exception Handling)

為保障雙方商業權益與互信，定義以下業務斷點處理規則：

### 異常 1：企業端撞單爭議 (Resume Collision)
* **場景**：終端企業主張該候選人已由其他仲介投遞。
* **處置規格**：`invic` 必須立即以 `teaforia` 原始提報郵件之**伺服器時間戳記（Timestamp）**作為舉證抗辯。若我方寄達時間早於其他競爭對手，該候選人之代理佣金全額歸屬 `invic` 與 `teaforia`。

### 異常 2：候選人惡意繞道 (Direct Bypass)
* **場景**：候選人獲悉職缺後，私下透過 104 或企業官網直接應徵。
* **處置規格**：
  1. `teaforia` 於所有交付文件均嵌入數位指紋（Digital Fingerprint）。
  2. 依據候選人最初簽署之海外就業授權條款，一旦證實繞道，終端企業與 `invic` 仍須認列該筆推薦，否則將觸發法務保護協議。

### 異常 3：試用期未滿離職 (Early Resignation)
* **場景**：候選人到職後於約定保證期內（如 30~90 天）非自願或自願離職。
* **處置規格**：
  * 依雙方簽署之商務合約執行：可由 `teaforia` 提供同等職級之免服務費補替名額一次（Free Replacement），或按剩餘工作天數依比例扣抵/退還服務費。

---

## 6. 未來 AI 代理擴充與規範繼承約定 (Agent Development Contract)

未來由工程團隊或 AI Agent 在編寫 `cv.teaforia.in` 平台其他階段（如：「候選人自主註冊階段」、「線上華語培訓階段」、「企業自動面試階段」）時，必須強制繼承本文件之框架：

```typescript
// AI Agent 必須繼承之階段元數據介面標準 (TypeScript Schema)
interface PipelineStageSpecification {
  stage_id: string;              // 例: STAGE_0X_NAME
  stage_name: string;            // 階段全名
  owner_entity: "invic" | "teaforia" | "client" | "candidate";
  trigger_event: string;         // 狀態流轉觸發條件
  input_schema: Record<string, any>;   // 強制輸入數據結構
  output_schema: Record<string, any>;  // 強制輸出數據結構
  dual_execution: {
    human_sop_ref: string;       // 關聯人工 SOP 編號
    ai_agent_handler: string;    // 對應微服務或 Agent 類別名
  };
  exit_criteria: string[];       // 結案檢核清單
}
```

---

## 7. 關聯作業 SOP 文件索引 (Operational SOP References)

以下具體作業標準書作為本規格書之操作支撐，各文件獨立維護更新，不更動上述主幹業務管線：

* **`SOP-OPS-001`**：《Teaforia 憑證真實性檢驗與反造假查核作業細則》（包含學位證、離職信、Form 16 偽造偵測標準）。
* **`SOP-OPS-002`**：《防繞道去識別化 JD 脫敏處理指引》。
* **`SOP-OPS-003`**：《候選人遠端技術面試環境調測與跨文化注意事項》。
* **`SOP-FIN-001`**：《跨國人才仲介佣金請款、保證期與跨境電匯作業規範》。
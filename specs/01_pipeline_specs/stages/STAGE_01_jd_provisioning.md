# STAGE_01: 台灣企業職缺發布、脫敏清洗與入庫技術規格書

> **階段代碼**：`STAGE_01_jd_provisioning`
>
> **歸屬主幹**：`specs/01_pipeline_specs/SPEC-000_pipeline_master_framework.md`
>
> **執行實體**：
> * 需求發起端：勝拓國際 (`invic.com.tw` / INVIC GLOBAL CO., LTD.)
> * 處理與存證端：Teaforia India (`teaforia.in` / `cv.teaforia.in`)
>
> **關聯數據合約**：`specs/03_data_schemas/jd_provisioning.schema.json`
>
> **關聯作業 SOP**：`specs/02_operational_sops/SOP-OPS-002_jd_deidentification.md`
>
> **生效日期**：2026 年 9 月

---

## 1. 階段概述與核心目標 (Overview & Objectives)

### 1.1 階段定位
`STAGE_01` 為 Project Credence 全管線之起點。其核心任務是將台灣製造業與高科技客戶委託 invic 招募之原始職缺需求（Raw JD），以最快速度完成**「結構化提取」**與**「防繞道去識別化脫敏清洗」**，產出安全公開版職缺代號（Sanitized Profile），為後續候選人精準媒合提供權威基準。

### 1.2 核心目標 (KPIs & SLAs)
1. **零實體洩漏（Zero Leakage）**：對外發布或交由初審員之資訊中，台灣終端雇主全名、廠區地址、統編之相似度嚴格為 0。
2. **處理時效（Ingestion SLA）**：
   * 人工模式：自收到 invic 官方 Email 起算 4 個工作小時內完成脫敏入庫。
   * AI 代理模式：接收 Webhook / 郵件解析後 60 秒內完成清洗與存證。
3. **單一真實來源（SSOT）**：確立唯一職缺參考編號（`jd_reference_id`），貫穿後續五個階段。

---

## 2. 前置條件與觸發機制 (Preconditions & Triggers)

### 2.1 入口前置條件 (Entry Conditions)
* invic 已與台灣終端企業簽訂正式獵才委任合約或試行合作意向書。
* invic 確認該職缺可引進合法外籍專業白領（符合台灣勞動部白領聘僱資格標準）。

### 2.2 觸發事件 (Trigger Event)
* **事件名稱**：`EVENT_JD_RECEIVED`
* **觸發載體**：
  * 人工模式：invic 專案窗口透過官方信箱發送電子郵件至 `jd@teaforia.in`（或專案專用信箱）。
  * 系統模式：invic 透過 Partner API 發送 `POST /api/v1/jd/ingest`，或由後端郵件閘道捕獲 RFC 5322 MIME 封包。

---

## 3. 輸入、處理與輸出規格 (I/O Contracts)

```text
【STAGE_01 數據轉化拓撲】

[原始輸入: Raw JD] 
       │
       ▼
【安全隔離區: Confidential Vault】
  - 封裝企業法定名稱、統編、廠區地址、HR 聯絡人
  - 產出唯一的 jd_reference_id
       │
       ▼
【脫敏清洗引擎: Sanitization Engine】
  - 移除 Tier 1 核心直接識別符號
  - 替換 Tier 2 間接特徵為「標準產業畫像」
  - 幣別自動換算 (TWD ➔ INR 基準)
       │
       ▼
[公開輸出: Sanitized Profile]
  - 狀態變更為 ACTIVE_SOURCING
  - 發布於 cv.teaforia.in 人才庫後台供媒合
```

### 3.1 輸入數據規格 (Input Specifications)
* 必須包含欄位：
  * 企業法定名稱（內部存證用）
  * 實際工作縣市與廠區概況
  * 職稱與關鍵技能要求（PLC、機電、機構、韌體等）
  * 薪資結構（每月本薪、保障年薪月份、獎金制度）
  * 外派福利條件（宿舍提供方式、水電、勞健保、機票）
  * 預計到職時程（Target Onboarding Date）

### 3.2 輸出數據規格 (Output Specifications)
依據 `specs/03_data_schemas/jd_provisioning.schema.json` 產出之完整 JSON 實體，必須包含以下兩大部分：
1. `confidential_client_profile`：加密儲存於專屬安全資料庫，未達解密門檻前對所有非管理員角色遮蔽。
2. `public_sanitized_profile`：包含脫敏職稱、產業地位替代描述、標準職能代碼（`ELE`、`MEC`、`AUT`、`FMW`、`EQP`、`WIR`）、換算之盧比薪資範圍。

---

## 4. 狀態機流轉規範 (State Transition Machine)

本階段涉及的職缺生命週期狀態（`status`）定義如下：

| 狀態代碼 | 定義與說明 | 流轉前置條件 | 下一階段候選狀態 |
| :--- | :--- | :--- | :--- |
| `INGESTED_RAW` | 原始郵件或 API 接收完成，未脫敏處理。 | 收到 invic 正式通知，產生 `log_id`。 | `DEIDENTIFIED_READY` |
| `DEIDENTIFIED_READY` | 已完成去識別化處理，並通過斷言檢查。 | 遮蔽審查無誤，Levenshtein 相似度為 0。 | `ACTIVE_SOURCING` |
| `ACTIVE_SOURCING` | 職缺已上線，開放 Teaforia 數據庫媒合。 | 正式排入初審小組與搜尋清單。 | `INTERVIEWING` (STAGE_05) |
| `CANCELLED` | 企業端取消職缺或需求暫停。 | invic 發出書面取消通知。 | 無（終止） |

```text
[狀態流轉圖]
(收到原始JD) ──> INGESTED_RAW ──(脫敏與稽核)──> DEIDENTIFIED_READY ──(發布媒合)──> ACTIVE_SOURCING
```

---

## 5. 雙軌執行規格 (Dual-Track Implementation Spec)

### 5.1 人工協同模式 (Human Operator Pipeline)

1. **收件存證**：
   * 專員確認收到 invic 官方信箱發送之需求，下載附件並記錄收發信 UTC 時間戳。
2. **編列標準代號**：
   * 依照 `TW-[職能類別]-[西元年月份]-[流水號]` 格式命名。
   * 範例：2026 年 10 月第一筆自動化工程師職缺編為 `TW-AUT-202610-01`。
3. **套用脫敏模板**：
   * 嚴格依循 `SOP-OPS-002`，將雇主全名依產業地位畫像替換（例如：「台灣前三大電源供應上市集團」）。
   * 廠區地址一律模糊化至「縣市層級」（如：「桃園市」或「北台灣高科技製造聚落」）。
4. **人工覆核**：
   * 由第二位專員（或主管）檢視對外版文字，確認在 Google/LinkedIn 上無法透過該段文字反查出特定單一廠區。
5. **啟動搜尋**：
   * 將脫敏職缺輸入內部追蹤台帳，並通知初審專員（太太/背調小組）展開庫存匹配。

---

### 5.2 AI 代理自主模式 (AI Agent Architecture: Phase 2)

未來部署於 `cv.teaforia.in` 之微服務架構，由三個專屬 Agent 協同驅動：

```text
+-------------------------------------------------------------------------+
|                    STAGE_01 AI 代理自主運行架構                          |
+-------------------------------------------------------------------------+
                                     │
           [1. 外部觸發: invic Webhook / 郵件接收]
                                     │
                                     ▼
+-------------------------------------------------------------------------+
| Agent A: Ingestion_Agent (職缺擷取代理)                                   |
| - 提取 MIME 標頭存證（Received Timestamp, Message-ID）                 |
| - 結構化解析年資、薪資、學位、技能等 Hard Requirements                   |
| - 將原始機密寫入 Vault，標記狀態為 INGESTED_RAW                            |
+-------------------------------------------------------------------------+
                                     │
                                     ▼
+-------------------------------------------------------------------------+
| Agent B: JD_Deidentification_Agent (脫敏清洗代理)                        |
| - 呼叫 NER (命名實體識別) 定位公司名、工廠地址、產品專利號              |
| - 檢索產業畫像知識庫，自動置換為 Tier 2 標準代稱                         |
| - 執行斷言檢查: Levenshtein 相似度嚴格 == 0                              |
| - 寫入 public_sanitized_profile，流轉至 DEIDENTIFIED_READY               |
+-------------------------------------------------------------------------+
                                     │
                                     ▼
+-------------------------------------------------------------------------+
| Agent C: Sourcing_Dispatcher_Agent (媒合分發代理)                        |
| - 生成技能向量 Embedding，對接已核驗之 Candidate Vector DB             |
| - 狀態更新為 ACTIVE_SOURCING，自動推播至初審控制台                      |
+-------------------------------------------------------------------------+
```

---

## 6. 防繞道安全斷言與品質閘門 (Security Assertions & Quality Gates)

在狀態流轉至 `DEIDENTIFIED_READY` 前，系統或人工必須強制通過以下四道品質檢驗閘門（Quality Gates）：

```text
【Gate 1：實體遮蔽閘門】
斷言：公開發布文本中不得含有統一編號（8 碼數字）或台灣經濟部商工登記名稱。
判定標準：正規表達式比對與關鍵字命中數 == 0。

【Gate 2：地理精度閘門】
斷言：廠區地址不得精確至「路、街、巷、號、段、工業園區棟別」。
判定標準：地理資訊最高僅允許揭露「縣市層級」（如 Hsinchu, Taoyuan）。

【Gate 3：薪資與匯率合規閘門】
斷言：薪資福利結構必須明確標註新台幣稅前月薪，並提供換算盧比月薪區間（以系統即期基準換算）。
判定標準：monthly_base_salary_twd_min >= 45000（確保符合台灣外籍白領聘僱法定最低門檻）。

【Gate 4：法務存證閘門】
斷言：原始需求之 Message-ID、接收伺服器 Received 標頭與發送端 Email 必須完整入庫。
判定標準：audit_log 關聯成功，狀態流轉日誌寫入完成。
```

---

## 7. 異常處理與中斷機制 (Exception Handling)

| 異常情境代碼 | 情境描述 | 處置程序與升級策略 |
| :--- | :--- | :--- |
| `ERR_SALARY_BELOW_STATUTORY` | 企業提供薪資低於台灣聘僱外籍白領法定標準（目前門檻為 NT$ 47,971，特定專案專班除外）。 | 系統阻斷發布；invic 窗口應向雇主協商提高本薪或以津貼補足，未補足前不予啟動招募。 |
| `ERR_DESCRIPTION_TOO_UNIQUE` | 職缺描述包含全球唯一之特定專利設備型號（如獨家專利代號），極易由 Google 搜尋反查出公司。 | 退回清洗代理或專員，執行二次模糊化（例如：將特定專利型號替換為「高精度光學檢測機台」）。 |
| `ERR_MISSING_ACCOMMODATION` | 未載明住宿提供方案（印度工程師赴台極度重視住宿安排）。 | 標記為待補正，invic 應於 24 小時內補齊宿舍或租屋津貼說明。 |

---

## 8. 交付物與結案標準 (Deliverables & Exit Criteria)

### 8.1 階段交付物清單
1. **正式職缺數據物件**：符合 `jd_provisioning.schema.json` 之 JSON 記錄。
2. **去識別化對外摘要單（PDF / Markdown）**：發送給初審小組之工作單。
3. **入庫審計記錄**：寫入 `audit_log.schema.json` 之 `LOG-[YYYY]-JD-[ID]` 事件記錄。

### 8.2 階段結案標準 (Exit Gate)
* 職缺狀態成功推進為 `ACTIVE_SOURCING`。
* 初審系統確認已接收該標準規格，並自動銜接至 `STAGE_02_credential_verification` 啟動人才比對。
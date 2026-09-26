# STAGE_03: 候選人官方時間戳交付、所有權確立與防繞道技術規格書

> **階段代碼**：`STAGE_03_official_submission`
>
> **歸屬主幹**：`specs/01_pipeline_specs/SPEC-000_pipeline_master_framework.md`
>
> **執行實體**：
> * 交付發起端：Teaforia India 專案交付小組 / `cv.teaforia.in` 交付閘道
> * 接收受款端：勝拓國際 (`invic.com.tw` / INVIC GLOBAL CO., LTD.)
>
> **關聯數據合約**：
> * `specs/03_data_schemas/verified_candidate.schema.json`
> * `specs/03_data_schemas/audit_log.schema.json`
>
> **關聯架構與法務規範**：
> * `specs/00_architecture/ARCH-002_anti_bypass_governance.md`（確權與防繞道總綱）
> * `specs/02_operational_sops/SOP-OPS-002_jd_deidentification.md`（職缺脫敏保護）
>
> **生效日期**：2026 年 9 月

---

## 1. 階段概述與核心目標 (Overview & Objectives)

### 1.1 階段定位
`STAGE_03` 為 Project Credence 全管線之**法律權益確立節點**。本階段之任務是將已通過雙重核驗（STAGE_02）之候選人檔案（Teaforia Verified Dossier），透過具備法律存證效力之官方傳輸通道正式交付予 invic，並於發送當下**不可逆地鎖定候選人 180 天之排他性推薦代理權（Ownership Lock）**，杜絕多家中介撞單爭端與候選人惡意穿透繞道。

### 1.2 核心目標 (KPIs & SLAs)
1. **確權證據鏈完整度 100%**：每一筆提報必須包含不可竄改的 RFC 5322 MIME 標頭、接收伺服器 Received 時間戳，以及交付封包之 SHA-256 數位指紋。
2. **通訊軟體零認證（Zero Chat-App Reliance）**：嚴格排除 LINE、WhatsApp 等私聊對話紀錄作為交付或確權之依據。
3. **交付排程與審核 SLA 啟動**：
   * 提報發送後，系統自動於 `audit_log` 寫入交付記錄，並向 invic 發出 72 個工作小時（3 個工作天）之審核回覆 SLA 計時器。

---

## 2. 前置條件與觸發機制 (Preconditions & Triggers)

### 2.1 入口前置條件 (Entry Conditions)
* 候選人於 `STAGE_02` 之生命週期狀態必須為 `GREEN_VERIFIED_READY`（或經 Teaforia 審核主管人工特批之 `YELLOW_REVIEW_NEEDED`）。
* 候選人個人敏感通訊已完成系統脫敏替換（Email 替換為 `@candidate.teaforia.in` 專屬安全代理信箱，電話號碼已局部遮罩）。
* 關聯之職缺狀態必須處於 `ACTIVE_SOURCING`。

### 2.2 觸發事件 (Trigger Event)
* **事件名稱**：`EVENT_OFFICIAL_SUBMISSION_DISPATCH`
* **觸發載體**：
  * 人工模式：專員完成 Dossier 封裝後，點擊內部系統之「正式交付 invic」按鈕，由專用郵件伺服器寄發制式存證信。
  * 系統模式：候選人通過 STAGE_02 品質閘門後，後端 `Dispatch_Agent` 自動排程發送 Webhook 與 RFC 5322 加密郵件。

---

## 3. 輸入、處理與輸出規格 (I/O Contracts)

```text
【STAGE_03 官方交付與確權拓撲】

[輸入實體: verified_candidate.schema.json] (狀態: GREEN_VERIFIED_READY)
       │
       ▼
【第 1 步: 防洩漏安全稽核】
  - 檢測候選人真實電話/Email 是否遮蔽完畢
  - 檢測台灣雇主資訊是否維持脫敏 (防止雙向刺探)
       │
       ▼
【第 2 步: 雜湊指紋運算與打包】
  - 計算 PDF Dossier 與 JSON Payload 之 SHA-256 指紋
  - 產生唯一郵件 Message-ID: <dossier.[ID]@delivery.cv.teaforia.in>
       │
       ▼
【第 3 步: 官方專用渠道傳輸】
  - 人工/Agent 透過專用郵件閘道傳輸至 invic 官方信箱
  - 記錄接收端伺服器 Received Header UTC 時間戳 (T_ownership)
       │
       ▼
【第 4 步: 確權與日誌固化】
  - 鎖定 180 天排他性推薦保護期
  - 寫入 audit_log (EVENT_TYPE: OFFICIAL_SUBMISSION_SENT)
       │
       ▼
[合格輸出: 處於 SUBMITTED_TO_INVIC 狀態之候選人實體]
  - 移交 STAGE_04 啟動 invic 審核佇列
```

### 3.1 輸入數據規格 (Input Specifications)
* 符合 `specs/03_data_schemas/verified_candidate.schema.json` 之 JSON 封包。
* 隨附標準核驗履歷檔案（Verified Dossier PDF）。
* 關聯職缺代號（`jd_reference_id`，如 `TW-AUT-202610-01`）。

### 3.2 輸出數據規格 (Output Specifications)
1. **候選人生命週期更新**：狀態推進為 `SUBMITTED_TO_INVIC`。
2. **所有權鎖定欄位（Ownership Metadata）**：
   * `t_ownership_utc`：精確到毫秒之 RFC 3339 交付生效時間戳。
   * `ownership_expiry_date`：排他保護期截止日（`t_ownership_utc` + 180 天）。
   * `payload_sha256`：交付附件之數位雜湊值。
3. **審計日誌存證實體**：符合 `specs/03_data_schemas/audit_log.schema.json` 之 `LOG-[YYYY]-SUBMIT-[ID]` 存證實體。

---

## 4. 狀態機流轉規範 (State Transition Machine)

本階段候選人與職缺關聯狀態流轉如下：

| 狀態代碼 | 定義與說明 | 流轉前置條件 | 下一階段候選狀態 |
| :--- | :--- | :--- | :--- |
| `GREEN_VERIFIED_READY` | 已通過雙重核驗，處於待交付佇列中。 | 完成 STAGE_02 所有檢核。 | `SUBMITTED_TO_INVIC` |
| `SUBMITTED_TO_INVIC` | 官方郵件已送達，180 天所有權保護正式生效。 | 伺服器 Received 標頭已解析並完成 SHA-256 存證。 | `INVIC_PASSED` 或 `INVIC_REJECTED` (STAGE_04) |
| `DISPATCH_FAILED` | 郵件退信（Bounce）或 API 傳輸失敗。 | 傳輸逾時或網路異常中斷。 | 重試或人工介入排查 |

```text
[狀態流轉圖]
GREEN_VERIFIED_READY ──(發送存證郵件)──> [傳輸校驗閘門] ──(成功)──> SUBMITTED_TO_INVIC (STAGE_04)
                                                │
                                                └──(退信/失敗)──> DISPATCH_FAILED (重試通道)
```

---

## 5. 雙軌執行規格 (Dual-Track Implementation Spec)

### 5.1 人工協同模式 (Human Operator Pipeline: Mrs. Chen / Michael)

1. **信件準備與打包**：
   * 專員核對候選人代號與關聯 JD 編號。
   * 檔名統一規範：`[Teaforia-Verified]_[JD代號]_[候選人法定姓名代碼]_[專長領域].pdf`。
   * 範例：`[Teaforia-Verified]_TW-AUT-202610-01_Rajesh-S_PLC-Automation.pdf`。
2. **官方專用信箱寄發**：
   * **發信端**：一律由 Teaforia 官方專案信箱寄出（如 `delivery@cv.teaforia.in` 或雙方約定之官方專案 Email）。
   * **收信端**：寄送至 invic 官方指定信箱（如 `candidate-review@invic.com.tw` 或陳小姐指定官方信箱）。
   * **主旨格式**：`【Teaforia Verified 引薦】[TW-AUT-202610-01] Rajesh Kumar S. - 自動化機電工程師 (Dossier ID: TEA-2026-IND-0088)`。
3. **存證登記**：
   * 專員於寄出信件後，截取原始郵件標頭（MIME Headers）中之 `Date` 與 `Message-ID`，登記於內部追蹤台帳。
   * 所有權生效時間依公式起算：
     ```text
     所有權確立時間點 = 接收端郵件伺服器解析 RFC 5322 MIME 郵件標頭記錄之「Received UTC 時間戳」
     所有權保護到期日 = 所有權確立時間點 + 180 天
     ```

---

### 5.2 AI 代理自主模式 (AI Agent Architecture: Phase 2)

未來部署於 `cv.teaforia.in` 之微服務架構，由兩個專屬 Agent 協同驅動交付管線：

```text
+-----------------------------------------------------------------------------------------+
|                        STAGE_03 AI 代理自主交付架構                                      |
+-----------------------------------------------------------------------------------------+
                                             │
               [STAGE_02 產出 GREEN_VERIFIED_READY 數據包]
                                             │
                                             ▼
+-----------------------------------------------------------------------------------------+
| Agent A: Pre_Dispatch_Sanitizer_Agent (交付前安全斷言代理)                               |
| - 檢測 candidate_profile 內真實電話與信箱是否完成遮罩 (Regex Assertion)                 |
| - 驗證數位指紋: 計算 PDF Dossier SHA-256 雜湊值並寫入封包 Metadata                      |
| - 呼叫 invic Partner Webhook (若支援) 或準備 SMTP TLS RFC 5322 MIME 郵件                |
+-----------------------------------------------------------------------------------------+
                                             │
                                             ▼
+-----------------------------------------------------------------------------------------+
| Agent B: Dispatch_And_Timestamp_Agent (分發與確權存證代理)                               |
| - 透過 mail-relay.cv.teaforia.in 向 invic MX 伺服器投遞 TLS 加密信件                     |
| - 擷取 SMTP 250 OK 回應碼與遠端 Received Timestamp                                      |
| - 調用 audit_log API 寫入 LOG-[YYYY]-SUBMIT-[ID] 實體                                    |
| - 啟動 72 小時倒數計時器 (invic 審查 SLA 計時)                                          |
| - 狀態更新為 SUBMITTED_TO_INVIC                                                          |
+-----------------------------------------------------------------------------------------+
```

---

## 6. 品質檢驗閘門與安全斷言 (Quality Gates & Assertions)

在候選人狀態流轉至 `SUBMITTED_TO_INVIC` 之前，系統或專員必須強制通過以下四道品質檢驗閘門：

```text
【Gate 1：防繞道去識別化閘門 (Anti-Bypass Gate)】
斷言 1：候選人直接私人聯絡信箱嚴格不得出現於對外交付文件，必須為 @candidate.teaforia.in 安全代理信箱。
斷言 2：電話號碼中間碼必須已完成星號遮蔽（保留前 4 碼與後 2 碼）。
判定標準：違規直接阻斷發送，退回審核員。

【Gate 2：雙重核驗合格閘門 (Verification Integrity Gate)】
斷言 1：overall_status_band 必須為 GREEN_VERIFIED_READY（若為 YELLOW_REVIEW_NEEDED 必須附帶主管特批備註）。
斷言 2：background_integrity_score 必須 >= 80。
判定標準：紅標（RED_FRAUD_REJECTED）永久禁止進入交付管線。

【Gate 3：時間戳可信度閘門 (Timestamp Precedence Gate)】
斷言 1：郵件發送伺服器具備合法 SPF、DKIM 與 DMARC 數位簽章。
斷言 2：RFC 5322 Message-ID 必須全域唯一，且包含 dossier_id 辨識碼。
判定標準：簽章異常或匿名發送者不具備法律確權效力。

【Gate 4：數位指紋不變性閘門 (Digital Fingerprint Gate)】
斷言：交付 PDF 檔案之本機 SHA-256 運算值必須與 JSON Metadata 中記載之 digital_fingerprint_sha256 完全吻合。
判定標準：雜湊不一致視為檔案損毀或遭中間人竄改，阻斷流程。
```

---

## 7. 異常處置標準與中斷代碼 (Exception Handling)

| 異常代碼 | 異常情境說明 | 處置程序與系統行為 |
| :--- | :--- | :--- |
| `ERR_DELIVERY_BOUNCED` | invic 收件伺服器回傳 5xx 永久拒收或退信通知。 | 系統自動嘗試備用 MX 路由；人工專員於 2 小時內透過電話通知 invic IT 窗口排查白名單設定。 |
| `ERR_UNMASKED_CONTACT_LEAK` | 交付檔案中意外包含候選人私人 WhatsApp 號碼或真實個人 Gmail。 | 阻斷發送；觸發安全警告通知管理員重新執行脫敏。 |
| `ERR_PREEXISTING_ACTIVE_OWNERSHIP` | 該候選人於過去 180 天內已交付過該職缺，且保護期尚未屆滿。 | 阻斷重複發送，直接沿用原時間戳保護期，提示專員「所有權已於 T 日確立，保護期尚餘 N 天」。 |
| `ERR_SHA256_MISMATCH` | PDF 附件傳輸後在收件端計算之 SHA-256 與資料庫存證紀錄不吻合。 | 判定為傳輸損毀，重新生成標準 Dossier 並重啟發送流程。 |

---

## 8. 交付物與結案標準 (Deliverables & Exit Criteria)

### 8.1 階段交付物清單
1. **正式送件電子郵件存證封包**：包含完整 MIME Headers、寄達時間戳與合法 SPF/DKIM 簽章。
2. **脫敏核驗檔案（Verified Dossier PDF）**：已隨信交付 invic，包含 Teaforia 防偽綠標。
3. **審計存證日誌實體**：成功寫入 `audit_log.schema.json` 之 `LOG-[YYYY]-SUBMIT-[ID]`。

### 8.2 階段結案標準 (Exit Gate)
* 候選人狀態流轉為 `SUBMITTED_TO_INVIC`。
* 接收端郵件伺服器 Received 時間戳完成解析並固化於台帳/資料庫。
* 180 天排他性保護期倒數計時器正式生效。
* 自動觸發管線銜接至 `STAGE_04_invic_screening`，啟動 invic 顧問 72 小時審核流程。
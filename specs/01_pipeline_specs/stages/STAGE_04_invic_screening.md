# STAGE_04: invic 顧問篩選、客戶規格比對與審核反饋技術規格書

> **階段代碼**：`STAGE_04_invic_screening`
>
> **歸屬主幹**：`specs/01_pipeline_specs/SPEC-000_pipeline_master_framework.md`
>
> **執行實體**：
>
> * 審核受託端：勝拓國際 (`invic.com.tw` / INVIC GLOBAL CO., LTD.，陳小姐團隊)
>
> * 供應支援端：Teaforia India 專案交付小組 (`cv.teaforia.in`)
>
> **關聯數據合約**：
>
> * `specs/03_data_schemas/verified_candidate.schema.json`
>
> * `specs/03_data_schemas/audit_log.schema.json`
>
> **關聯作業 SOP**：
>
> * `specs/00_architecture/ARCH-002_anti_bypass_governance.md`（防繞道確權與退回冷卻期保護）
>
> * `specs/02_operational_sops/SOP-OPS-002_jd_deidentification.md`（職缺資訊去識別化維持）
>
> **生效日期**：2026 年 9 月

## 1. 階段概述與核心目標 (Overview & Objectives)

### 1.1 階段定位

`STAGE_04` 為 Project Credence 管線中由**台灣需求端總代理（invic）主導的資格複查與企業端適配性節點**。本階段之任務是接收 Teaforia 交付之雙重核驗簡歷包（Teaforia Verified Dossier），由 invic 專業顧問依據台灣終端製造業雇主之最新動態規格進行二次審查，並於嚴格的時效窗口（SLA）內給予結構化判定，決定是否向企業引薦並啟動終審面談（STAGE_05）。

### 1.2 核心目標 (KPIs & SLAs)

1. **審核時效回覆率 100% (72-Hour SLA)**：自收到 Teaforia 官方時間戳郵件起算，invic 應於 **72 個工作小時（3 個工作天）** 內完成初步篩選並反饋結果。

2. **精準引薦轉換率 >= 75%**：經 invic 篩選通過（`INVIC_PASSED`）並提報至台灣企業端之候選人，取得企業面試邀請之比率應維持在 75% 以上。

3. **拒絕原因 100% 結構化**：若判定淘汰（`INVIC_REJECTED`），嚴格禁止非結構化之模糊拒絕（如「不合適」），必須回傳標準原因代碼與具體理由，以作為 Teaforia 人才庫與 AI 搜尋演算法之反向權重訓練依據。

## 2. 前置條件與觸發機制 (Preconditions & Triggers)

### 2.1 入口前置條件 (Entry Conditions)

* 候選人生命週期狀態處於 `SUBMITTED_TO_INVIC`。

* 該候選人於接收端郵件伺服器之時間戳存證（`t_ownership_utc`）已固化，180 天排他性代理保護期已生效。

* 關聯之職缺狀態處於 `ACTIVE_SOURCING`。

### 2.2 觸發事件 (Trigger Event)

* **事件名稱**：`EVENT_INVIC_SCREENING_STARTED`

* **觸發載體**：

  * 人工模式：invic 顧問（陳小姐/專案負責人）開啟官方交付郵件，下載標準 Verified Dossier PDF 並於追蹤台帳標記為「審核中」。

  * 系統模式：後端捕獲郵件投遞成功事件後，自動於 invic 專屬 Partner Dashboard 產生待審核工單，並同步啟動 72 小時倒數計時器。

## 3. 輸入、處理與輸出規格 (I/O Contracts)

```
【STAGE_04 invic 審核與反饋拓撲】

[輸入實體: verified_candidate.schema.json] (狀態: SUBMITTED_TO_INVIC)
       │
       ▼
【第 1 步: 時效計時與資格預檢】
  - 記錄審核進場 UTC 時間戳，校驗 72 小時 SLA 基準
  - 檢視 Teaforia 驗證報告與原件憑證摘要 (學歷/稅單/在職證明)
       │
       ▼
【第 2 步: 台灣雇主專案規格比對】
  - 比對硬性技能: 如特定 PLC 品牌 (Siemens/Mitsubishi/Omron)
  - 比對薪資期望: 候選人期望月薪 vs 雇主核薪區間上限
  - 評估軟性潛力: 英語溝通能力 (Grade A/B) 與赴台適應力
       │
       ▼
【第 3 步: 審查決策裁決】
  ┌───────────────────────┼───────────────────────┐
  ▼                       ▼                       ▼
[通過: INVIC_PASSED]   [備選: INVIC_HOLD]    [淘汰: INVIC_REJECTED]
  │                       │                       │
  │ (鎖定職缺配對)        │ (保留於待審池)        │ (記錄結構化原因)
  │ (發起 STAGE_05)       │ (上限 14 個自然日)    │ (啟動 180 天冷卻保護)
  ▼                       ▼                       ▼
【第 4 步: 審計日誌與狀態流轉】
  - 寫入 audit_log (EVENT_TYPE: INVIC_SCREENING_APPROVED 或 REJECTED)
  - 產出結構化反饋通知傳回 Teaforia
```

### 3.1 輸入數據規格 (Input Specifications)

* 符合 `specs/03_data_schemas/verified_candidate.schema.json` 之 JSON 封包與 Verified Dossier PDF。

* 原始職缺需求規格單（`jd_provisioning.schema.json` 關聯實體）。

* 終端企業即時補充之臨時需求條件（如有，例如：「本批次偏好具備台系廠區駐點經驗者」）。

### 3.2 輸出數據規格 (Output Specifications)

1. **候選人生命週期更新**：狀態推進為 `INVIC_PASSED`、`INVIC_REJECTED` 或 `INVIC_HOLD`。

2. **審查評定報告（invic Assessment Payload）**：

   ```json
   {
     "dossier_id": "TEA-2026-IND-0088",
     "jd_reference_id": "TW-AUT-202610-01",
     "screening_consultant": "Ms. Chen",
     "decision": "PASSED",
     "client_fit_score": 88,
     "fit_analysis": {
       "technical_skills_matched": ["Siemens S7-1200", "AutoCAD Electrical"],
       "technical_gaps": ["Lacks direct experience in Taiwan factory safety regulations"],
       "salary_alignment": "WITHIN_BUDGET",
       "language_and_culture_rating": "GRADE_B_COMPLIANT"
     },
     "rejection_code": null,
     "rejection_narrative": null,
     "screening_completed_utc": "2026-09-28T10:15:00Z"
   }
   ```

3. **審計存證實體**：符合 `specs/03_data_schemas/audit_log.schema.json` 之審計事件記錄。

## 4. 狀態機流轉規範 (State Transition Machine)

本階段候選人與職缺關聯狀態流轉如下：

| 狀態代碼 | 定義與說明 | 流轉前置條件 | 下一階段候選狀態 |
| :--- | :--- | :--- | :--- |
| `SUBMITTED_TO_INVIC` | 官方送件抵達，等待 invic 顧問接案。 | 完成 STAGE_03 存證。 | `INVIC_SCREENING` |
| `INVIC_SCREENING` | invic 顧問已開啟檔案，正在執行審查。 | 顧問點擊處理或系統排入審查佇列。 | `INVIC_PASSED`, `INVIC_REJECTED`, `INVIC_HOLD` |
| `INVIC_PASSED` | 顧問審查合格，確認向終端企業提報。 | 技術、薪資、語言皆符合企業期待。 | `INTERVIEW_SCHEDULED` (STAGE_05) |
| `INVIC_HOLD` | 候選人優秀但當期名額已滿，列入備選。 | 綜合分數達標，需待企業釋出新缺額。 | `INVIC_PASSED` 或 `INVIC_REJECTED` |
| `INVIC_REJECTED` | 規格不符或條件未達標，終止推薦。 | 附帶結構化拒絕原因代碼。 | 歸檔（享有 180 天防繞道保護） |

```
[狀態流轉圖]
SUBMITTED_TO_INVIC ──> INVIC_SCREENING
                            │
       ┌────────────────────┼────────────────────┐
       ▼                    ▼                    ▼
  INVIC_PASSED          INVIC_HOLD         INVIC_REJECTED
       │                    │                    │
  (STAGE_05 面試)     (最長 14 天)         (180天防繞道保護生效)
                            │                    │
                            └────(超期/淘汰)─────┘
```

## 5. 雙軌執行規格 (Dual-Track Implementation Spec)

### 5.1 人工協同模式 (Human Operator Pipeline: Ms. Chen / invic Team)

1. **收件確認與時效登記**：

   * 顧問收到 `delivery@cv.teaforia.in` 寄發之正式郵件後，核對主旨與附件完整度。

   * 於內部追蹤表登記「收到時間點」，審核截止時限依公式計算：

     ```text
     審核截止時限 = 收到郵件 Received UTC 時間戳 + 72 工作小時
     ```

2. **客觀比對與可行性評估**：

   * **硬性技術比對**：檢視 Teaforia 綠標摘要之專業技能，確認是否精確涵蓋企業要求之核心機電控制項目。

   * **薪資與預算校驗**：比對候選人期待月薪（TWD）與企業開出之上限，若差距超過 15% 且無協商空間，評估是否退回。

   * **適應力評定**：檢視 Teaforia 初審對其英語溝通評級與家庭支持度切結，評估到職後參與 invic「線上華語培訓方案」之潛力。

3. **審核反饋正式送達**：

   * 顧問依審核結果回覆 Teaforia 官方專案信箱，主旨註明：`【審核結果反饋】[TW-AUT-202610-01] 候選人代號 - PASSED / REJECTED / HOLD`。

   * 若為通過（`PASSED`），隨信附帶企業預計可安排面試之時間區間或進一步調測要求。

### 5.2 AI 代理自主模式 (AI Agent Architecture: Phase 2)

未來部署於 `cv.teaforia.in` 之微服務架構，由兩個專屬 Agent 協同驅動：

```
+-----------------------------------------------------------------------------------------+
|                        STAGE_04 AI 代理協同審查架構                                      |
+-----------------------------------------------------------------------------------------+
                                             │
               [STAGE_03 產出 SUBMITTED_TO_INVIC 狀態實體]
                                             │
                                             ▼
+-----------------------------------------------------------------------------------------+
| Agent A: Partner_Portal_Orchestrator (合作夥伴門戶排程代理)                             |
| - 向 invic Partner API 發送 Webhook 負載，或產出安全預覽 Token 供顧問免密碼登入         |
| - 監控 72 小時 SLA 計時器；於第 48 小時自動發送溫和提醒，第 70 小時發送逾時警報         |
| - 提供一鍵式審核按鈕 (Pass / Hold / Reject) 與結構化下拉原因清單                         |
+-----------------------------------------------------------------------------------------+
                                             │
                                             ▼
+-----------------------------------------------------------------------------------------+
| Agent B: Rejection_Feedback_Learning_Agent (拒絕反饋分析代理)                          |
| - 解析顧問勾選之拒絕原因與文字描述                                                      |
| - 自動調整 Vector DB 相似度權重 (例如: 標記該企業偏好日本三菱 PLC 多於西門子)          |
| - 更新 audit_log 存證，並自動將候選人歸入「冷卻保護儲備池」                             |
+-----------------------------------------------------------------------------------------+
```

## 6. 品質檢驗閘門與安全斷言 (Quality Gates & Assertions)

在候選人審核結果確立並流轉至下一狀態前，系統或專員必須強制通過以下三道品質檢驗閘門：

```text
【Gate 1：審核時效合規閘門 (Review SLA Gate)】
斷言：當前審核回覆時間不得超出 72 個工作小時。
判定標準：逾期回覆者，系統自動記錄 SLA 異常標記 (FLAG_SLA_BREACH)，但不影響候選人本身之排他性代理權。

【Gate 2：結構化退件原因閘門 (Structured Rejection Gate)】
斷言 1：若判定為 INVIC_REJECTED，rejection_code 欄位嚴格不得為空。
斷言 2：rejection_narrative 必須包含具體技術或薪資落差說明（字數 >= 15 字）。
判定標準：未填寫具體原因者，系統阻斷退件流程，退回顧問補充。

【Gate 3：防繞道冷卻期固化閘門 (Cooling-off Period Gate)】
斷言：遭判定為 INVIC_REJECTED 或 INVIC_HOLD 之候選人，系統必須自動固化其 180 天排他性保護期截止日。
判定標準：退件後 180 天內，終端雇主私下錄用該候選人仍屬 ARCH-002 規範之違約樣態。
```

## 7. 結構化拒絕原因清冊與代碼 (Standard Rejection Taxonomy)

為建立機器可學習之反饋迴路，所有退件必須命中以下標準分類之一：

| 拒絕代碼 (Rejection Code) | 分類名稱 | 適用情境說明 | 系統處理與後續動作 |
| :--- | :--- | :--- | :--- |
| `REJ_TECH_STACK_MISMATCH` | 核心技術棧不符 | 候選人精通 Siemens，但雇主產線僅接受 Mitsubishi 實操經驗。 | 調整該職缺之技能權重，候選人保留於其他職缺推薦池。 |
| `REJ_SALARY_BUDGET_EXCEEDED` | 薪資期待超出上限 | 候選人堅持實領月薪 NT$ 70,000，雇主上限僅 NT$ 55,000。 | 記錄薪資摩擦點，顧問不予推薦，Teaforia 重新輔導期待值。 |
| `REJ_COMMUNICATION_RISK` | 語言或軟實力疑慮 | 顧問複核視訊錄影後，判定印度口音過重恐影響產線即時溝通。 | 引導其參加 invic 華語專班或強化英語表達後再行評估。 |
| `REJ_ROLE_QUOTA_FILLED` | 職缺配額已滿額 | 該批次機電工程師名額已由其他候選人填滿。 | 自動轉入 `INVIC_HOLD`，待次月新開職缺優先解鎖推薦。 |
| `REJ_RELOCATION_CONCERN` | 赴台意願或家庭風險 | 候選人配偶態度反覆，或無法承諾至少 2 年外派年限。 | 標記為家庭穩定度風險，扣減背調評分。 |

## 8. 異常處置標準與中斷代碼 (Exception Handling)

| 異常代碼 | 異常情境說明 | 處置程序與系統行為 |
| :--- | :--- | :--- |
| `ERR_SLA_BREACH_TIMEOUT` | invic 超過 72 工作小時未回覆審核結果。 | Teaforia 專員發出溫和催告通知；系統暫停向該特定職缺推播新人，直至積壓清空。 |
| `ERR_PREMATURE_DECRYPTION_ATTEMPT` | 尚未推進至 STAGE_05 面試，候選人端試圖刺探終端企業全名。 | 強制執行盲測保護，重申未達三門檻條件前嚴禁透露雇主名稱。 |
| `ERR_HOLD_STATUS_EXPIRED` | 候選人處於 `INVIC_HOLD` 狀態超過 14 個自然日未有進展。 | 系統自動觸發提醒，要求 invic 顧問裁決「轉為正式面試」或「正式退件歸檔」。 |

## 9. 交付物與結案標準 (Deliverables & Exit Criteria)

### 9.1 階段交付物清單

1. **invic 官方審核確認單**：包含明確決策（`PASSED` / `REJECTED` / `HOLD`）之正式 Email 或系統紀錄。

2. **結構化審核評定資料物件**：符合標準結構之 `invic_screening_result` JSON 實體。

3. **審核審計日誌**：寫入 `audit_log.schema.json` 之 `LOG-[YYYY]-SCREEN-[ID]` 事件存證。

### 9.2 階段結案標準 (Exit Gate)

* 候選人狀態流轉為 `INVIC_PASSED`（進入 STAGE_05）或 `INVIC_REJECTED`（結案歸檔）。

* 審核反饋已傳遞至 Teaforia 團隊，雙方追蹤台帳維持狀態完全同步。

* 若審核通過，觸發管線自動銜接至 `STAGE_05_final_interview`，啟動台灣企業面試排程與三門檻解密作業。
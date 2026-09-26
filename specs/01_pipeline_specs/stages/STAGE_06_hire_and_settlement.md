# STAGE_06: 正式錄用、跨境入台履新與佣金交割技術規格書

> **階段代碼**：`STAGE_06_hire_and_settlement`
>
> **歸屬主幹**：`specs/01_pipeline_specs/SPEC-000_pipeline_master_framework.md`
>
> **執行實體**：
>
> * 台灣需求端總代理：勝拓國際 (`invic.com.tw` / INVIC GLOBAL CO., LTD.，陳小姐團隊)
>
> * 印度供應與調測端：Teaforia India 專案交付小組 (`cv.teaforia.in`，Michael / 太太團隊)
>
> * 終端聘僱企業：台灣製造業與高科技廠端管理層 / HR 團隊
>
> **關聯數據合約**：
>
> * `specs/03_data_schemas/verified_candidate.schema.json`
>
> * `specs/03_data_schemas/audit_log.schema.json`
>
> **關聯作業 SOP 與法務規範**：
>
> * `specs/02_operational_sops/SOP-FIN-001_commission_settlement.md`（佣金請款、保證期與跨境電匯）
>
> * `specs/00_architecture/ARCH-002_anti_bypass_governance.md`（防繞道確權與違約求償條款）
>
> **生效日期**：2026 年 9 月

---

## 1. 階段概述與核心目標 (Overview & Objectives)

### 1.1 階段定位

`STAGE_06` 為 Project Credence 全管線之**商業兌現、履約交付與法務閉環終審節點**。本階段之任務是接續 STAGE_05 企業面試通過之候選人，協助其完成正式聘僱合約簽署（Offer Letter）、辦理印度赴台白領工作簽證與官方背調文件、安全抵達台灣廠區履新報到，並依照雙邊約定之「50/50 雙階段釋放機制」完成跨國服務費請款、90 天試用期留任追蹤與最終跨境電匯交割。

### 1.2 核心目標 (KPIs & SLAs)

1. **Offer 簽署與留任率 (Offer-to-Onboard Rate) >= 90%**：正式發出錄用意向書之候選人，經輔導後正式簽署並如期抵台報到之比率維持在 90% 以上。

2. **簽證審批過件率 100%**：憑藉 STAGE_02 固化之真實學歷證件與官方離職信，確保台灣勞動部聘僱許可函與駐印度台北經濟文化中心（TECC）工作簽證申請零退件。

3. **雙階段財務電匯及時率 100% (10-Day SLA)**：
   * 首期款（50%）：候選人抵台到職（Day 1）且企業款項入帳後，invic 應於 10 個工作天內電匯至 Teaforia 印度指定受款帳戶。
   * 尾款（50%）：候選人通過 90 天試用期考核（Day 90）後，invic 應於 10 個工作天內完成尾款電匯。

4. **90 天試用期留任通過率 >= 85%**：透過 invic 華語線上課程與跨文化適應輔導，確保工程師在台適應良好，穩定服務滿 90 天以上。

---

## 2. 前置條件與觸發機制 (Preconditions & Triggers)

### 2.1 入口前置條件 (Entry Conditions)

* 候選人生命週期狀態處於 `OFFER_ISSUED`（台灣終端企業已正式核發聘僱要約）。

* 終端企業出具載明職稱、每月新台幣稅前薪資、外派津貼、保障年薪與預計到職日之正式 Offer Letter 核心條件。

* 候選人 180 天排他性代理保護期依然有效生效中。

### 2.2 觸發事件 (Trigger Event)

* **事件名稱**：`EVENT_OFFER_ACCEPTED_LOCKED`

* **觸發載體**：

  * 人工模式：候選人於數位簽署系統或紙本回傳親筆簽名之 Offer Letter，Teaforia 專員查驗無誤後 Email 照會 invic 窗口確認成案。

  * 系統模式：候選人登入 `cv.teaforia.in` 點擊接受聘僱要約並上傳電子簽章，後端自動發送 Webhook 觸發 `Billing_Settlement_Agent` 建立分期結算單。

---

## 3. 輸入、處理與輸出規格 (I/O Contracts)

```text
【STAGE_06 錄用交割與雙階段結算拓撲】

[輸入實體: verified_candidate.schema.json] (狀態: OFFER_ISSUED)
       │
       ▼
【第 1 步: 聘僱要約鎖定與 Tier 3 全量解密】
  - 候選人正式簽署 Offer Letter (確立核薪薪資 CTC_TWD)
  - 狀態流轉為: OFFER_ACCEPTED_LOCKED
  - 釋出 Tier 3 法律文件: 揭露雙方未遮蔽個資以辦理簽證
       │
       ▼
【第 2 步: 跨國公證、體檢與工作簽證辦理】
  - 印度端: 辦理警察無犯罪紀錄證明 (PCC 良民證) 與特約醫院體檢
  - 台灣端: invic 協助企業向勞動部申請外國白領聘僱許可函
  - 駐印度 TECC 送簽，取得赴台工作簽證 (Special Entry / Resident Visa)
       │
       ▼
【第 3 步: 抵台履新與首期款解鎖 (Milestone 1)】
  - 候選人飛抵台灣，廠區正式報到 (Day 1 Onboarding)
  - 取得勞健保投保明細與雇主報到存證單
  - invic 向台灣企業開立全額發票
  - 企業匯達款項後 10 天內，invic 電匯首期款 (50%) 至 Teaforia 印度帳戶
       │
       ▼
【第 4 步: 90 天試用期留任與適應輔導】
  - 候選人每週參與 invic「線上華語與職場文化培訓」
  - 監控試用期異常風險:
    ┌───────────────────────┼───────────────────────┐
    ▼                       ▼                       ▼
[合格: PROBATION_PASSED] [離職: REPLACEMENT_REQ] [造假: FRAUD_DEFAULT]
    │                       │                       │
    │ (進入第 5 步)         │ (依SOP-FIN-001遞補)   │ (全額退款並黑名單)
    ▼                       ▼                       ▼
【第 5 步: 尾款結清與結案歸檔 (Milestone 2)】
  - 到職第 91 天，企業確認通過考核
  - invic 於 10 天內電匯尾款 (50%) 至 Teaforia 印度帳戶
  - 取得外匯水單 (FIRC)，狀態更新為: CLOSED_SETTLED
```

### 3.1 輸入數據規格 (Input Specifications)

* 符合 `specs/03_data_schemas/verified_candidate.schema.json` 之候選人實體。

* 終端企業正式簽章之聘僱合約書（含新台幣月薪、保障年薪、宿舍與福利條件）。

* 候選人簽署完成之工作簽證申請授權書與護照原件高清掃描件。

### 3.2 輸出數據規格 (Output Specifications)

1. **候選人生命週期更新**：推進為 `OFFER_ACCEPTED_LOCKED`、`VISA_PROCESSING`、`ONBOARDED_DAY_1`、`PROBATION_PASSED` 或 `CLOSED_SETTLED`。

2. **財務結算與分期存證負載（Settlement Payload）**：

   ```json
   {
     "settlement_id": "SETTLE-2026-IND-0012",
     "dossier_id": "TEA-2026-IND-0088",
     "jd_reference_id": "TW-AUT-202610-01",
     "candidate_legal_name": "Rajesh Kumar Sharma",
     "employer_legal_name": "台達電子工業股份有限公司",
     "contract_annual_ctc_twd": 840000,
     "commission_rate_percentage": 18.0,
     "total_gross_commission_twd": 151200,
     "settlement_currency": "USD",
     "fx_rate_twd_usd": 31.50,
     "net_commission_pool_usd": 4800.00,
     "teaforia_share_percentage": 50.0,
     "milestone_1_onboarding": {
       "amount_usd": 2400.00,
       "onboarding_date": "2026-11-01",
       "invic_payout_status": "PAID",
       "swift_ref": "WT202611029871",
       "paid_timestamp_utc": "2026-11-02T08:30:00Z"
     },
     "milestone_2_probation": {
       "amount_usd": 2400.00,
       "probation_target_date": "2027-01-30",
       "days_completed": 90,
       "probation_status": "PENDING_PROBATION_CLEARANCE",
       "invic_payout_status": "UNPAID",
       "swift_ref": null
     }
   }
   ```

3. **審計存證日誌**：寫入 `audit_log.schema.json` 之 `LOG-[YYYY]-SETTLE-[ID]` 存證實體。

---

## 4. 狀態機流轉規範 (State Transition Machine)

本階段涉及的候選人與財務交割狀態流轉如下：

| 狀態代碼 | 定義與說明 | 流轉前置條件 | 下一階段候選狀態 |
| :--- | :--- | :--- | :--- |
| `OFFER_ISSUED` | 台灣企業核發聘僱意向，等待候選人簽署。 | 完成 STAGE_05 面試錄用。 | `OFFER_ACCEPTED_LOCKED` |
| `OFFER_ACCEPTED_LOCKED` | 候選人簽署 Offer，排他代表權正式鎖死。 | 雙方簽署確認並鎖定起薪條件。 | `VISA_PROCESSING` |
| `VISA_PROCESSING` | 辦理台灣白領工作簽證、PCC 良民證與體檢。 | 提交簽證申請文件包。 | `VISA_APPROVED` 或 `VISA_DENIED` |
| `VISA_APPROVED` | 簽證核發，訂購赴台機票並排定到職日。 | TECC 簽證處貼簽完成。 | `ONBOARDED_DAY_1` |
| `ONBOARDED_DAY_1` | 候選人抵台到職履新，解鎖首期款（50%）。 | 提供勞保投保表與到職簽到表。 | `PROBATION_IN_PROGRESS` |
| `PROBATION_IN_PROGRESS` | 進行 90 天試用期，參與 invic 華語輔導。 | 首期佣金結算完畢。 | `PROBATION_PASSED` 或 `REPLACEMENT_TRIGGERED` |
| `PROBATION_PASSED` | 試用期滿 90 天合格，解鎖尾款（50%）。 | 企業 HR 回覆考核合格通過。 | `CLOSED_SETTLED` |
| `REPLACEMENT_TRIGGERED` | 試用期內主動離職，依約啟動免費遞補作業。 | 候選人曠職、離職或適應不良。 | `STAGE_02`（重啟綠標候選人推薦） |
| `CLOSED_SETTLED` | 尾款電匯入帳，取得 FIRC 水單，流程完結。 | 雙邊財務款項全數結清歸檔。 | 終止（服務成功封存） |

```text
[狀態流轉圖]
OFFER_ISSUED ──(簽署合約)──> OFFER_ACCEPTED_LOCKED
                                      │
                                      ▼
                               VISA_PROCESSING
                                      │
                                      ▼
                                VISA_APPROVED
                                      │
                                      ▼
                              ONBOARDED_DAY_1  ──(首期50%請款電匯)
                                      │
                                      ▼
                            PROBATION_IN_PROGRESS (90天試用期)
                                      │
              ┌───────────────────────┴───────────────────────┐
              ▼                                               ▼
       PROBATION_PASSED                              REPLACEMENT_TRIGGERED
              │                                               │
      (尾款50%請款電匯)                               (依SOP-FIN-001免費遞補)
              ▼
        CLOSED_SETTLED
```

---

## 5. 雙軌執行規格 (Dual-Track Implementation Spec)

### 5.1 人工協同模式 (Human Operator Pipeline)

1. **聘僱合約簽署與法務確權（Teaforia 與 invic）**：
   * 專員核對企業端 Offer Letter 之本薪（每月稅前不得低於法定外籍白領標準，且符合 JD 約定）。
   * 專員協助候選人理解合約各項條款（年薪月數、外派工時、宿舍水電分攤方式）。
   * 候選人完成正式簽名回傳後，雙方內部系統標記為 `OFFER_ACCEPTED_LOCKED`，排他性代理權鎖死至到職結算。

2. **跨國證件公證與工作簽證辦理**：
   * **印度端（Teaforia 團隊）**：
     * 陪同/指導候選人於 Passport Seva Kendra 申請警察無犯罪紀錄證明（PCC 良民證）。
     * 指導候選人至台灣衛福部認可之印度特約醫院完成外籍人士體檢（丙表）。
   * **台灣端（invic 團隊）**：
     * 檢附候選人之經核驗學歷證書原件、離職信與護照影本，向台灣勞動部（WDA）申請外籍白領聘僱許可函（Work Permit）。
     * 許可函核准後，將文件掃描件傳至印度，候選人至駐新德里或欽奈 TECC 辦理居留簽證貼簽。

3. **抵台履新與首期款結算（遵循 SOP-FIN-001）**：
   * 候選人飛抵台灣，由企業或 invic 安排接機、入住宿舍與開立台灣本地銀行薪資帳戶。
   * **Day 1 到職日**：企業 HR 簽署報到確認單，並為其加保台灣勞工保險與全民健康保險。
   * **請款執行**：
     * invic 向企業開立第一期服務費發票。
     * 企業款項匯達 invic 後 10 個工作天內，invic 依當日臺灣銀行即期賣出匯率換算美元，將淨佣金之 50% 電匯至 Teaforia 印度指定銀行帳戶。
     * Teaforia 出具商業發票（Commercial Invoice）並取得銀行外匯水單（FIRC）。

4. **90 天試用期輔導與留任保障**：
   * 候選人每週固定排程參與 invic 安排之「線上華語學習專案」與在台生活適應輔導。
   * 若候選人於 90 天內非因雇主過失主動離職，依據 SOP-FIN-001 啟動免費遞補程序（Teaforia 於 14 天內提供合格備選名單）。

5. **試用期滿考核與尾款結清**：
   * 到職第 85 天，invic 顧問主動向台灣企業 HR 照會試用期考核結果。
   * 第 90 天考核合格通過，invic 開立第二期發票，並於款項抵達後 10 工作天內電匯尾款（50%）至 Teaforia。
   * 雙方確認台帳全數沖銷完畢，檔案歸檔標記為 `CLOSED_SETTLED`。

### 5.2 AI 代理自主模式 (AI Agent Architecture: Phase 2)

未來部署於 `cv.teaforia.in` 之微服務架構，由三個專屬 Agent 協同驅動最終交付：

```text
+-----------------------------------------------------------------------------------------+
|                        STAGE_06 AI 代理自主錄用交割架構                                 |
+-----------------------------------------------------------------------------------------+
                                             │
                  [STAGE_05 產出 OFFER_ISSUED 狀態實體]
                                             │
                                             ▼
+-----------------------------------------------------------------------------------------+
| Agent A: Visa_Milestone_Tracker_Agent (簽證進度追蹤代理)                                 |
| - 結構化檢驗 PCC 良民證、體檢表 OCR 關鍵欄位 (排除不合格項目)                           |
| - 監控台灣勞動部許可函發文字號與 TECC 簽證預約時程                                      |
| - 自動向候選人發送航班出發提醒與抵台報到須知                                            |
+-----------------------------------------------------------------------------------------+
                                             │
                                             ▼
+-----------------------------------------------------------------------------------------+
| Agent B: Billing_Settlement_Agent (財務分潤對帳代理)                                    |
| - 解析 Offer 薪資數據，自動套用 50/50 分潤公式與當期臺灣銀行匯率                        |
| - 於 Day 1 與 Day 90 自動生成標準商業發票 (Commercial Invoice PDF) 傳送至 invic 端      |
| - 監控跨國電匯 SWIFT 狀態，要求經辦人上傳 FIRC 水單雜湊值，自動沖銷台帳                 |
+-----------------------------------------------------------------------------------------+
                                             │
                                             ▼
+-----------------------------------------------------------------------------------------+
| Agent C: Retention_Monitoring_Agent (試用期適應與留任監控代理)                           |
| - 串接 invic 線上華語教學出席數據，每 30 天生成一份適應評估指標                         |
| - 若接獲雇主端離職預警，自動調用人才儲備庫，預排同職能綠標候選人 (SOP-FIN-001 遞補機制) |
| - 90 天期滿自動解鎖尾款請款佇列                                                         |
+-----------------------------------------------------------------------------------------+
```

---

## 6. 品質檢驗閘門與安全斷言 (Quality Gates & Assertions)

在候選人狀態流轉至正式履新與款項釋放前，系統或專員必須強制通過以下四道品質檢驗閘門：

```text
【Gate 1：聘僱條件法規與合規閘門 (Offer Compliance Gate)】
斷言 1：Offer 所載每月稅前基本本薪 monthly_base_salary_twd 必須 >= 47971 元（符合台灣外籍白領法定最低標準）。
斷言 2：候選人電子簽章有效性確認 signed_offer_letter == true。
判定標準：未達薪資法定門檻或未完成正式簽名者，阻斷流程，禁止進入簽證申請。

【Gate 2：國際簽證審批通過閘門 (Visa Clearance Gate)】
斷言 1：警察無犯罪紀錄證明 (PCC) 查驗無犯罪紀錄。
斷言 2：台灣特約體檢報告無重大傳染病標註 (Health_Check_Passed == true)。
斷言 3：駐外單位已正式貼簽 (Visa_Issued == true)。
判定標準：任一要件不具備者，系統中斷流轉，標記為 ERR_VISA_APPLICATION_DENIED。

【Gate 3：首期佣金釋放檢驗閘門 (Milestone 1 Onboarding Gate)】
斷言 1：候選人確實於台灣廠區到職簽到，且具備台灣勞健保加保申報表。
斷言 2：台灣企業已向 invic 支付對應款項。
判定標準：未取得第一手報到存證前，嚴格禁止向印度端撥付任何首期款項。

【Gate 4：90 天試用期滿尾款閘門 (Milestone 2 Probation Gate)】
斷言 1：候選人自到職日起算之在職天數 (tenure_days) 必須 >= 90 天。
斷言 2：終端雇主出具考核合格回饋，且無離職或曠職通報。
判定標準：在職未滿 90 天或接獲解聘通報者，尾款請款佇列強制凍結。
```

---

## 7. 異常處置標準與中斷代碼 (Exception Handling)

| 異常代碼 | 異常情境說明 | 處置程序與系統行為 |
| :--- | :--- | :--- |
| `ERR_OFFER_REJECTED` | 候選人收到 Offer 後因個人因素拒絕簽署。 | 初審專員介入探詢核心顧慮（薪資、宿舍、家庭）；若無法協調，取消該職缺鎖定，候選人降回人才庫。 |
| `ERR_VISA_DENIED` | TECC 拒簽或勞動部否決外籍聘僱許可。 | 查明官方駁回原因（通常為文件驗證瑕疵）；評估於 14 天內補件重申，無法補正則向企業致歉並結案。 |
| `ERR_ONBOARDING_NO_SHOW` | 候選人取得簽證與機票後，未按期抵台到職（失聯/爽約）。 | 觸發 ARCH-002 違約求償條款；取消其資格並通報主管機關與全印黑名單聯盟；Teaforia 全額免除仲介責任並啟動緊急補人。 |
| `ERR_PROBATION_CANDIDATE_LEAVE` | 到職 90 天內候選人因個人適應不良或私自跳槽而主動離職。 | 依 SOP-FIN-001 啟動人才保證期條款：Teaforia 免費提供一次遞補；若 60 天內無人選，退回/扣抵首期款之 50%。 |
| `ERR_PROBATION_FRAUD_TERMINATION` | 到職後經企業查證該候選人實際動手能力與履歷有重大詐欺造假。 | 依 SOP-FIN-001 樣態 B 處置：Teaforia 負擔全責，全額退還首期已收佣金，候選人列入信用黑名單。 |
| `ERR_EMPLOYER_UNJUST_DISMISSAL` | 到職 90 天內台灣企業因減產裁員或違反勞動契約惡意解僱。 | 依 SOP-FIN-001 樣態 C 處置：佣金全額認列，已收首期款不退，由 invic 依法向雇主追討剩餘尾款。 |

---

## 8. 交付物與結案標準 (Deliverables & Exit Criteria)

### 8.1 階段交付物清單

1. **雙邊簽署聘僱合約書（Signed Offer Letter）**：載明起薪、職稱、各項津貼與雙方簽名之正式 PDF。

2. **工作許可與居留簽證檔案**：包含台灣勞動部聘僱核准函、TECC 居留簽證頁影本。

3. **到職存證包（Onboarding Dossier）**：雇主簽收報到單、台灣勞健保投保申報表。

4. **雙階段財務請款單與外匯水單（FIRC）**：
   * 首期款（50%）Commercial Invoice 與 SWIFT 電匯水單。
   * 尾款（50%）Commercial Invoice、考核通過確認單與 SWIFT 電匯水單。

5. **結案審計存證日誌**：寫入 `audit_log.schema.json` 之 `LOG-[YYYY]-SETTLE-[ID]` 存證實體。

### 8.2 階段結案標準 (Exit Gate)

* **標準結案（成功落地）**：
  * 候選人順利通過 90 天試用期考核（狀態流轉為 `PROBATION_PASSED`）。
  * 雙邊 50/50 佣金款項全數電匯清算完畢，取得印度銀行 FIRC 水單。
  * 狀態流轉為 `CLOSED_SETTLED`，全管線生命週期圓滿結束並結構化封存。

* **遞補結案（異常替換）**：
  * 若觸發 `REPLACEMENT_TRIGGERED`，管線返回至 `STAGE_02_credential_verification` 優先提取綠標候選人，重新啟動媒合流程。
# STAGE_05: 台灣企業終審面試、三門檻解密與雙向撮合技術規格書

> **階段代碼**：`STAGE_05_final_interview`
>
> **歸屬主幹**：`specs/01_pipeline_specs/SPEC-000_pipeline_master_framework.md`
>
> **執行實體**：
>
> * 台灣需求端總代理：勝拓國際 (`invic.com.tw` / INVIC GLOBAL CO., LTD.，陳小姐團隊)
>
> * 印度供應與調測端：Teaforia India 專案交付小組 (`cv.teaforia.in`，Michael / 太太團隊)
>
> * 終端聘僱企業：台灣製造業與高科技廠端主管 / HR 團隊
>
> **關聯數據合約**：
>
> * `specs/03_data_schemas/verified_candidate.schema.json`
>
> * `specs/03_data_schemas/audit_log.schema.json`
>
> **關聯作業 SOP 與法務合約**：
>
> * `specs/00_architecture/ARCH-002_anti_bypass_governance.md`（三門檻解密條款與防私聯機制）
>
> * `specs/02_operational_sops/SOP-OPS-003_candidate_tech_screen.md`（遠端調測與防替考環境驗證）
>
> **生效日期**：2026 年 9 月

---

## 1. 階段概述與核心目標 (Overview & Objectives)

### 1.1 階段定位

`STAGE_05` 為 Project Credence 全管線之**雙向撮合與決策兌現節點**。本階段之任務是將通過 invic 審核（`INVIC_PASSED`）的候選人，正式排入台灣終端製造業企業的複試排程。

在此節點，Teaforia 系統與執行團隊將正式執行「三門檻安全解密（The Triple-Gate Decryption）」，向候選人揭露台灣終端雇主全名，並由 Teaforia 印度團隊完成面試前硬體調測與文化適應輔導，最終促成台灣企業端做出錄用與核薪決策。

### 1.2 核心目標 (KPIs & SLAs)

1. **三門檻解密合規率 100% (Zero Pre-Decryption)**：嚴格落實未達三項硬性門檻前，絕不向候選人透露終端台灣雇主之法定名稱、統編與具體廠址。

2. **跨國時區排程零失誤 (Zero Timezone Shift Error)**：印度標準時間 (IST, UTC+5:30) 與台灣標準時間 (CST, UTC+8) 換算準確無誤，跨時區會議連結發送與出席率維持在 95% 以上。

3. **遠端面試連線品質達標率 >= 98%**：排查印度端網路波動，面試期間延遲低於 150 毫秒，封包遺失率低於 1%，杜絕視訊中斷或嚴重影音不同步。

4. **終審錄用轉換率 (Offer Conversion Rate) >= 40%**：進入企業終審面談之候選人，取得正式錄用意向（Offer Issued）之比率應維持在 40% 以上。

---

## 2. 前置條件與觸發機制 (Preconditions & Triggers)

### 2.1 入口前置條件 (Entry Conditions)

* 候選人生命週期狀態處於 `INVIC_PASSED`（已獲 invic 顧問審核放行）。

* 候選人 180 天排他性代理保護期依然處於有效狀態（`t_ownership_utc` 仍在保護期內）。

* 終端企業已向 invic 釋出明確之複試時段區間（Interview Slots）。

### 2.2 觸發事件 (Trigger Event)

* **事件名稱**：`EVENT_FINAL_INTERVIEW_REQUESTED`

* **觸發載體**：

  * 人工模式：invic 專案窗口（陳小姐）向 Teaforia 官方專案信箱寄發《面試排程照會通知》，載明企業期望之面試日期與時段。

  * 系統模式：invic 透過 Partner Dashboard 選定企業可用時段並發起面試請求，後端自動發送 Webhook 觸發 `Interview_Scheduler_Agent`。

---

## 3. 輸入、處理與輸出規格 (I/O Contracts)

```text
【STAGE_05 終審面試與解密拓撲】

[輸入實體: verified_candidate.schema.json] (狀態: INVIC_PASSED)
       │
       ▼
【第 1 步: 三門檻合規斷言 (ARCH-002)】
  - 檢核 1: 具備綠標 (GREEN_VERIFIED_READY)
  - 檢核 2: 候選人已簽訂《海外推薦與防繞道切結書》
  - 檢核 3: invic 發出正式企業面試確認
       │
       ▼
【第 2 步: 安全解密與雇主背景輔導】
  - 對候選人釋放雇主法定名稱與完整 JD 規格
  - 進行台灣廠區文化、生活機能與外派合約期宣導
       │
       ▼
【第 3 步: 跨時區排程與硬體調測】
  - 換算 CST (台灣) 與 IST (印度) 時差 (精確差距 2 小時 30 分)
  - 執行 Google Meet / Teams 專用加密房間調測
  - 面試前 24 小時完成設備、光線與音訊排查 (SOP-OPS-003)
       │
       ▼
【第 4 步: 台灣企業終審面談實施】
  - 專員/Agent 線上陪席，記錄身分防偽斷言
  - 台灣技術主管執行 PLC/機電現場除錯技術深抽測
       │
       ▼
【第 5 步: 決策裁決與狀態流轉】
  ┌───────────────────────┼───────────────────────┐
  ▼                       ▼                       ▼
[錄用: OFFER_ISSUED]   [複試: 2ND_ROUND_REQ]   [未錄用: CLIENT_REJECTED]
  │                       │                       │
  │ (進入 STAGE_06)       │ (重啟排程)            │ (結構化歸檔，維持保護)
  ▼                       ▼                       ▼
【第 6 步: 審計存證日誌固化】
  - 寫入 audit_log (EVENT_TYPE: INTERVIEW_LINK_ISSUED / OFFER_ACCEPTED_LOCKED)
```

### 3.1 輸入數據規格 (Input Specifications)

* 符合 `specs/03_data_schemas/verified_candidate.schema.json` 之完整候選人核驗檔案。

* invic 提供的台灣企業面試需求規格單（包含企業可面試時段、預計主試官職稱、特別技術抽測重點）。

* 候選人簽署完成之《Teaforia 獨家海外推薦與防繞道切結書》數位簽署憑證。

### 3.2 輸出數據規格 (Output Specifications)

1. **候選人生命週期更新**：推進為 `INTERVIEW_SCHEDULED`、`INTERVIEW_COMPLETED`、`OFFER_ISSUED` 或 `CLIENT_REJECTED`。

2. **面試排程與解密存證負載（Interview Scheduling Payload）**：

   ```json
   {
     "interview_id": "INT-202610-TW-0042",
     "dossier_id": "TEA-2026-IND-0088",
     "jd_reference_id": "TW-AUT-202610-01",
     "triple_gate_verified": true,
     "unmasked_employer_legal_name": "台達電子工業股份有限公司",
     "scheduled_time_cst": "2026-10-15T14:00:00+08:00",
     "scheduled_time_ist": "2026-10-15T11:30:00+05:30",
     "meeting_platform": "GOOGLE_MEET_SECURE",
     "dry_run_completed": true,
     "interview_result": "OFFER_RECOMMENDED",
     "client_feedback_notes": "PLC 邏輯清晰，具備現場除錯實務經驗，英文溝通順暢，符合產線白領標準。"
   }
   ```

3. **審計存證記錄**：寫入 `audit_log.schema.json` 之 `LOG-[YYYY]-INT-[ID]` 存證實體。

---

## 4. 狀態機流轉規範 (State Transition Machine)

本階段候選人與職缺關聯狀態流轉如下：

| 狀態代碼 | 定義與說明 | 流轉前置條件 | 下一階段候選狀態 |
| :--- | :--- | :--- | :--- |
| `INVIC_PASSED` | invic 審核通過，等待企業確認面試時段。 | 完成 STAGE_04。 | `INTERVIEW_SCHEDULED` |
| `INTERVIEW_SCHEDULED` | 三門檻解密完成，跨國時區排程鎖定。 | 候選人簽署切結書且測試連線成功。 | `INTERVIEW_IN_PROGRESS` |
| `INTERVIEW_IN_PROGRESS` | 正式視訊面試進行中，專員/Agent 陪席存證。 | 到達預定會議時間。 | `INTERVIEW_COMPLETED` |
| `INTERVIEW_COMPLETED` | 面試結束，等待企業端回饋最終裁決。 | 面試順利結束，未發生作弊中斷。 | `OFFER_ISSUED`, `CLIENT_REJECTED`, `SECOND_ROUND_REQUESTED` |
| `OFFER_ISSUED` | 台灣終端企業正式發出錄用意向與薪資確認。 | 企業端回覆合格並出具聘用條件。 | `OFFER_ACCEPTED_LOCKED` (STAGE_06) |
| `CLIENT_REJECTED` | 終端企業判定不合適，終止本職缺流程。 | 企業回傳技術或綜合評估不符原因。 | 歸檔（享有 180 天防繞道保護） |
| `SECOND_ROUND_REQUESTED` | 企業要求第二輪主管面試或實機測試。 | 企業提出進一步調測需求。 | `INTERVIEW_SCHEDULED` |

```text
[狀態流轉圖]
INVIC_PASSED ──(三門檻解密+排程)──> INTERVIEW_SCHEDULED
                                           │
                                           ▼
                                 INTERVIEW_IN_PROGRESS
                                           │
                                           ▼
                                  INTERVIEW_COMPLETED
                                           │
       ┌───────────────────────────────────┼───────────────────────────────────┐
       ▼                                   ▼                                   ▼
  OFFER_ISSUED                  SECOND_ROUND_REQUESTED                  CLIENT_REJECTED
       │                                   │                                   │
(進入 STAGE_06 簽約)             (重啟排程調測)                        (歸檔並鎖定保護期)
```

---

## 5. 雙軌執行規格 (Dual-Track Implementation Spec)

### 5.1 人工協同模式 (Human Operator Pipeline)

1. **三門檻安全解密執行（Teaforia 團隊）**：
   * 專員核對候選人檔案是否具備綠標（`GREEN_VERIFIED_READY`）。
   * 候選人經由線上簽署系統完成《獨家海外推薦與防繞道切結書》，專員確認其具備法律約束力。
   * 收到 invic 正式送件核可信後，Teaforia 專員正式向候選人發送《雇主背景與面試須知》，首次透露台灣企業名稱、產業地位及具體工廠縣市。

2. **跨時區排程與通知同步**：
   * 專員嚴格依據時差公式校驗會議時間：
     
     ```text
     台灣時間 CST (UTC+8) = 印度時間 IST (UTC+5:30) + 2 小時 30 分鐘
     範例：台灣下午 14:00 面試 = 印度上午 11:30 面試
     ```

   * 發送包含 Google Meet 加密房間的專用行事曆邀請至候選人代理信箱與 invic 專用信箱。

3. **面試前 24 小時設備調測（Dry Run，遵循 SOP-OPS-003）**：
   * Teaforia 初審專員（太太/技術助理）與候選人連線 5 分鐘。
   * 測試其視訊鏡頭解析度、麥克風降噪、網路頻寬及雙螢幕作弊防禦環境。
   * 叮嚀面試禮儀：穿著正式襯衫、提早 10 分鐘進入等待室、直視鏡頭。

4. **面試實施與陪席支援**：
   * 面試開始前 3 分鐘，Teaforia 專員上線擔任會議管理員，確認候選人手持護照人臉比對無誤。
   * 台灣企業主管與 invic 顧問進入會議室展開正式面試。
   * Teaforia 專員全程關閉麥克風靜音在場，僅在遭遇嚴重連線問題或語意嚴重誤解時提供即時行政協助。

5. **結果追蹤與反饋固化**：
   * 面試結束後 24 工作小時內，invic 向台灣企業取得面試評價回饋。
   * invic 透過官方 Email 告知 Teaforia 結果（錄用 / 退件 / 複試），雙方同步更新追蹤台帳。

### 5.2 AI 代理自主模式 (AI Agent Architecture: Phase 2)

未來部署於 `cv.teaforia.in` 之微服務架構，由三個專屬 Agent 協同驅動面試節點：

```text
+-----------------------------------------------------------------------------------------+
|                        STAGE_05 AI 代理協同終審面試架構                                 |
+-----------------------------------------------------------------------------------------+
                                             │
                  [STAGE_04 產出 INVIC_PASSED 狀態實體]
                                             │
                                             ▼
+-----------------------------------------------------------------------------------------+
| Agent A: Unmasking_Governance_Agent (三門檻解密治理代理)                                 |
| - 檢驗 Gate 1~3 條件: 綠標狀態 + 切結書數位簽名雜湊 + invic 預約授權 Token               |
| - 驗證通過後，動態解密 confidential_client_profile 並生成候選人專屬面試輔導頁面           |
| - 寫入 audit_log: TRIPLE_GATE_UNMASK_EXECUTED 存證事件                                  |
+-----------------------------------------------------------------------------------------+
                                             │
                                             ▼
+-----------------------------------------------------------------------------------------+
| Agent B: Calendar_Sync_Agent (跨國時差排程代理)                                         |
| - 自動換算 IST 與 CST 時間戳，消除夏令時與跨時區人為疏失                                |
| - 自動調用 Google Calendar API / Microsoft Graph API 產生一次性專用加密會議網址        |
| - 於 T-24h 自動排程連線調測會議，於 T-2h、T-15m 自動向候選人發送 WhatsApp/SMS 提醒      |
+-----------------------------------------------------------------------------------------+
                                             │
                                             ▼
+-----------------------------------------------------------------------------------------+
| Agent C: Interview_Escort_Agent (面試監控與紀錄代理)                                     |
| - 候選人進房前自動執行 15 秒人臉特徵向量比對 (與護照底本相似度 >= 0.88)                  |
| - 面試全程監控網路 QoS 指標 (延遲、抖動、封包遺失率)                                     |
| - 會後向 invic 端 Partner Portal 拋送回饋填報表單，自動抓取企業裁決結果                  |
+-----------------------------------------------------------------------------------------+
```

---

## 6. 防繞道安全斷言與品質檢驗閘門 (Quality Gates & Assertions)

在候選人推進至面試及後續裁決前，系統或專員必須強制通過以下四道品質檢驗閘門：

```text
【Gate 1：三門檻強制解密閘門 (Triple-Gate Decryption Gate)】
斷言 1：overall_status_band 必須嚴格等於 GREEN_VERIFIED_READY。
斷言 2：anti_bypass_agreement_signed 必須等於 true，且具有合法時間戳與 IP 簽章。
斷言 3：invic_interview_slot_confirmed 必須等於 true。
判定標準：三者缺一不可，任何一項為 false 則強制鎖定雇主名稱，禁止對外透露。

【Gate 2：跨國時區排程校驗閘門 (Timezone Scheduling Gate)】
斷言：(scheduled_time_cst - scheduled_time_ist) 之時間差值必須精確等於 2 小時 30 分鐘 (150 分鐘)。
判定標準：時差換算錯誤者，排程系統強制中斷，禁止對外發送面試通知信。

【Gate 3：前置連線調測閘門 (Pre-Flight Dry Run Gate)】
斷言 1：候選人視訊房間延遲 ping 值必須低於 150 毫秒。
斷言 2：面試前 24 小時內之身分骨骼比對成功標記 dry_run_passed == true。
判定標準：未通過調測者，專員必須於 2 小時內介入排查，必要時要求候選人更換有線網路。

【Gate 4：雙向通訊屏蔽閘門 (Direct Contact Isolation Gate)】
斷言 1：面試會議邀請函中，候選人之真實個人信箱與手機號碼嚴格不得對終端企業露出（僅露出 Teaforia 代理信箱）。
斷言 2：終端企業 HR 之私人通訊方式亦不得對候選人露出。
判定標準：違規洩漏者系統發出安全中斷警告，追究經手人責任。
```

---

## 7. 異常處置標準與中斷代碼 (Exception Handling)

| 異常代碼 | 異常情境說明 | 處置程序與系統行為 |
| :--- | :--- | :--- |
| `ERR_TRIPLE_GATE_BREACH` | 候選人未簽妥防繞道切結書，系統或專員已先行透露台灣企業名稱。 | 觸發一級資安警報；立即凍結該候選人流程，主管介入調查並補簽具追溯效力之法務文件。 |
| `ERR_INTERVIEW_NO_SHOW` | 候選人於預定面試時間未上線（失聯超過 10 分鐘）。 | Teaforia 專員立即撥打電話緊急聯繫；若確定爽約，直接降級為紅標並取消代理權，向 invic 致歉。 |
| `ERR_NETWORK_DISRUPTION` | 面試期間候選人端突發斷網或電力中斷超過 3 分鐘。 | 專員即時以簡訊安撫候選人，並在會議室向企業主管說明；協調於當日內重新連線或改期。 |
| `ERR_IMPERSONATION_FLAGGED` | 企業面試時發現上線者與前置背調視訊人臉特徵明顯不符（槍手代考）。 | 專員立即終止會議；系統將該候選人狀態變更為 `RED_FRAUD_REJECTED`，列入黑名單不再受理。 |
| `ERR_DIRECT_CONTACT_ATTEMPT` | 候選人於面試時主動向台灣企業主管索取 LINE/電話，意圖私下繞道。 | 觸發 ARCH-002 防繞道違約預警；invic 與企業主管依合約予以制止，並記錄於誠信檔案。 |

---

## 8. 交付物與結案標準 (Deliverables & Exit Criteria)

### 8.1 階段交付物清單

1. **三門檻解密存證記錄**：包含候選人簽名雜湊、解密時間點與授權專員/Agent 代碼。

2. **跨國面試確認通知單（含會議日曆）**：載明 CST 與 IST 雙時區時間、安全視訊連結與主試官清冊。

3. **企業面試裁決反饋單**：由 invic 正式傳回之錄用意向（Offer Letter 核心條件）或結構化未錄用原因報告。

4. **終審面試審計存證日誌**：寫入 `audit_log.schema.json` 之 `LOG-[YYYY]-INT-[ID]` 存證實體。

### 8.2 階段結案標準 (Exit Gate)

* 終端企業做出明確裁決：
  * **情境 A（錄用）**：候選人狀態流轉為 `OFFER_ISSUED`，雙方追蹤台帳確認無誤，自動銜接至 `STAGE_06_hire_and_settlement` 啟動薪資鎖定與核簽合約作業。
  * **情境 B（退件）**：候選人狀態流轉為 `CLIENT_REJECTED`，歸檔並維持 180 天防繞道保護期生效。
  * **情境 C（安排二面）**：狀態流轉為 `SECOND_ROUND_REQUESTED`，重新生成面試排程並維持當前保護期。
# SOP-FIN-001: 跨國引才佣金結算、試用期保證與跨境財務作業手冊

> **文件代號**：`SOP-FIN-001`
>
> **關聯管線**：`STAGE_06_hire_and_settlement`（Project Credence 六大階段之終審交割階段）
>
> **適用角色**：Teaforia 財務專員、invic 財務會計窗口、未來 `Billing_Settlement_Agent`
>
> **系統節點**：`cv.teaforia.in`
>
> **生效日期**：2026 年 9 月

---

## 1. 目的與核心財務原則 (Purpose & Financial Principles)

### 1.1 宗旨
本手冊旨在規範 Teaforia India 與勝拓國際（invic）在跨國工程人才引進成案後的佣金請款、雙邊分潤拆帳、90 天試用期追蹤、異常退款/遞補，以及台灣至印度跨境電匯之合法合規作業程序。

### 1.2 核心三大財務原則
1. **單一請款窗口原則**：台灣終端雇主之全額服務費，一律由 invic 依台灣法規統一開立發票請款；Teaforia 不得越過 invic 直接向台灣企業請款。
2. **對帳以時間戳封包為憑**：結算基礎必須與 `STAGE_03` 送件存證信（Timestamp）、`STAGE_06` 終端雇主簽署之正式 Offer Letter 完全吻合。
3. **合法白名單跨境匯兌**：全數金流嚴格依循正規銀行國際電匯（SWIFT）管道，開立商業發票（Commercial Invoice），取得外匯水單（FIRC），嚴禁地下匯兌與灰色拆帳。

---

## 2. 佣金結構與分潤機制 (Commission Structure & Revenue Split)

### 2.1 台灣終端企業收費標準（市場常規）
依據 invic 與台灣聘僱企業（如電源大廠、車用電子、系統整合商）簽訂之獵才服務合約，收費基準通常採以下二者之一：
* **標準年薪百分比**：候選人保障年薪（通常以 14 個月計算）之 15% 至 20%。
* **固定月份薪資**：候選人台灣全額月薪之 1.5 至 2.0 個月作為一次性仲介技術服務費。

### 2.2 雙邊分潤基準 (Split Ratio)
扣除台灣法定營業稅（5%）與跨國電匯直接手續費後之淨佣金（Net Commission），依雙方簽署之合作協議比例拆分：

```text
【雙邊拆帳分配公式】
企業實付總金額 (未稅) - 跨境法定匯費與必要行政規費 = 雙方淨分潤總額 (Net Commission Pool)
Teaforia 應得份額 = 淨分潤總額 * 約定比例 (預設 50%)
invic 應得份額   = 淨分潤總額 * 約定比例 (預設 50%)
```

*備註：若特定專案採「Teaforia 固定核驗服務費制」（例如每成功落地一位機電工程師收取固定服務費），則以該專案確認單（Project Order Sheet）之明載金額為準。*

---

## 3. 請款時程與雙階段撥款 (Payment Milestones)

為兼顧營運現金流與台灣企業之試用期保障，佣金採取「50/50 雙階段釋放機制」：

```
[階段 A: 到職請款] ──> [候選人抵台報到 (Day 1)] ──> 撥付首期佣金 (50%)
                             │
                      (90 天試用期考核)
                             │
[階段 B: 期滿結算] ──> [試用期滿合格 (Day 90)] ──> 撥付尾款佣金 (50%)
```

### 3.1 首期款（50%）：到職解鎖 (Onboarding Release)
* **觸發條件**：候選人完成簽證核發、抵達台灣、完成體檢並於終端企業正式簽到履新（Day 1）。
* **撥付時限**：終端企業將首期款匯達 invic 帳戶後 10 個工作天內，invic 應將 Teaforia 應得之首期份額電匯至印度指定帳戶。

### 3.2 尾款（50%）：期滿解鎖 (Probation Release)
* **觸發條件**：候選人順利通過台灣企業 90 天（3 個月）試用期考核，未發生重大違紀或離職。
* **撥付時限**：到職第 91 天起算 10 個工作天內，invic 完成尾款請款與跨國電匯撥付。

---

## 4. 試用期保證條款與異常處理 (Guarantee & Replacement Protocol)

### 4.1 90 天人才保證期 (90-Day Replacement Guarantee)
自候選人正式進廠到職日（Day 1）起算 90 個自然日內，若發生以下三類異常，依規範處置：

| 異常樣態類別 | 定義情境 | 財務與遞補處置標準 |
| :--- | :--- | :--- |
| **樣態 A：候選人主動違約** | 候選人因個人適應不良、想家、擅自曠職或私自跳槽而主動離職。 | **免費重啟遞補 1 次**；若 60 天內無合適人選，退還/扣抵首期佣金之 50%。 |
| **樣態 B：能力造假遭解雇** | 候選人實際動手能力與履歷有重大出入，經查證屬於隱瞞造假。 | **Teaforia 負擔全責**：退還全額首期款，候選人列入信用黑名單。 |
| **樣態 C：雇主端非過失解僱** | 台灣企業遭遇經營困難、減產裁員，或工作內容與原 JD 嚴重不符。 | **佣金全額認列**：雇主違約，雙方已領取之首期款不予退還，尾款由 invic 依法向雇主追討。 |

### 4.2 遞補作業流程 (Replacement SLA)
1. **書面通知**：雇主發出不適任/離職通知書後 3 個工作天內，invic 書面告知 Teaforia 觸發遞補。
2. **快速通道**：Teaforia 人才庫以綠標（`GREEN_VERIFIED_READY`）優先遞補，於 14 個工作天內推薦至少 2 位相同職能候選人供面試。
3. **保證期展延**：新遞補候選人到職後，重新起算 90 天保證期，但不重複收取首期佣金。

---

## 5. 匯率結算、水單與稅務作業 (Forex, Invoicing & Compliance)

### 5.1 匯率結算基準 (Exchange Rate Authority)
跨國引進涉及「新台幣 (TWD) ➔ 美元 (USD) ➔ 印度盧比 (INR)」之雙重轉換：
* **匯率基準**：統一以 **「invic 實際電匯當日臺灣銀行 (Bank of Taiwan) 牌告即期賣出匯率」** 為唯一基準。
* **外幣避險約定**：電匯一律以美元 (USD) 匯出，印度受款端依印度儲備銀行（RBI）當日結匯牌價入帳。

### 5.2 請款單據清單 (Invoice Documentation Checklist)
Teaforia 向 invic 請求撥款時，必須備妥以下電子憑證包（PDF 格式）：
1. **Teaforia 官方商業發票 (Commercial Invoice)**：
   * 載明 Invoice 編號、存證檔案代號（`dossier_id`）、候選人英文全名、應付美元金額。
2. **候選人到職存證單 (Onboarding Proof)**：雇主簽名之報到確認書或勞健保投保明細影本。
3. **完整受款銀行路徑 (Banking Details)**：
   * Beneficiary Name（受款公司全名）
   * Bank Name & Branch（銀行名稱與分行）
   * Account Number（銀行帳號）
   * SWIFT Code（國際電匯代碼）
   * IFSC Code（印度本地清算代碼，如適用）

### 5.3 稅務與外匯合規 (Taxation & FIRC)
* **台灣端扣繳**：依台印租稅協定或台灣所得稅法，外國勞務提供之扣繳責任由 invic 會計師判定，若有代扣繳外國營利事業所得稅，invic 應提供台灣國稅局扣繳憑單影本供 Teaforia 抵扣。
* **印度端水單 (FIRC)**：Teaforia 於印度銀行收到款項後，必須向該受款行申請取得 FIRC（Foreign Inward Remittance Certificate），上傳系統歸檔以備印度稅務局（Income Tax Department）查驗。

---

## 6. AI 代理財務對帳數據規格 (AI Billing Agent Specification)

未來 `cv.teaforia.in` 平台上的 `Billing_Settlement_Agent` 依照以下 YAML 資料規格執行自動化對帳與提醒排程：

```yaml
billing_settlement_schema:
  settlement_id: "SETTLE-2026-IND-0012"
  dossier_id: "TEA-2026-IND-0088"
  candidate_legal_name: "Rajesh Kumar Sharma"
  taiwan_client_code: "TW-AUT-202610-01"
  partner_recipient: "INVIC_GLOBAL"
  
  currency_parameters:
    billed_currency: "TWD"
    agreed_annual_ctc_twd: 840000
    commission_rate_percentage: 18.0
    total_gross_commission_twd: 151200
    settlement_currency: "USD"
    bot_exchange_rate_twd_usd: 31.50
    
  milestone_tracking:
    milestone_1_onboarding:
      due_percentage: 50.0
      amount_usd: 2400.00
      target_date: "2026-11-01"
      payment_status: "PAID"
      swift_reference_no: "WT202611029871"
      paid_timestamp_utc: "2026-11-02T08:30:00Z"
      
    milestone_2_probation_end:
      due_percentage: 50.0
      amount_usd: 2400.00
      target_date: "2027-01-30"
      probation_days_completed: 90
      payment_status: "PENDING_PROBATION_CLEARANCE"
      swift_reference_no: null
      
  guarantee_terms:
    guarantee_period_days: 90
    guarantee_expiry_date: "2027-01-30"
    replacement_invoked: false
    remedy_type: "NONE"
```

---

## 7. 標準雙邊對帳單範本 (Standard Commission Statement)

Teaforia 與 invic 於每月最後一個工作日，產出制式結算單如下：

```text
================================================================================
                    PROJECT CREDENCE COMMISSION STATEMENT
================================================================================
結算區間：2026 年 10 月 01 日 至 2026 年 10 月 31 日
發送機構：勝拓國際股份有限公司 (INVIC GLOBAL CO., LTD.)
受款機構：Teaforia India (cv.teaforia.in)
--------------------------------------------------------------------------------
項次  候選人姓名         職缺代號         到職日期     階段別   應付金額 (USD)
01    Rajesh Sharma     TW-AUT-2610-01   2026-10-15   首期款   $ 2,400.00
02    Amit Patel        TW-ELE-2609-02   2026-07-10   尾期款   $ 2,150.00
--------------------------------------------------------------------------------
本期應撥總額 (Total Payable)：USD $ 4,550.00
電匯手續費分攤：雙方各自承擔發報行與中繼行費用
預計匯款日：2026 年 11 月 05 日
================================================================================
```
# TEAFORIA COMMERCIAL INVOICE & COMMISSION STATEMENT
## 跨國技術引才商業發票與雙邊分潤對帳單範本

> **文件代號**：`TEMPLATE_commission_invoice.md`
>
> **歸屬目錄**：`specs/04_templates/`
>
> **適用階段**：`STAGE_06_hire_and_settlement`
>
> **關聯法務與財務規範**：
> * `specs/00_architecture/ARCH-002_anti_bypass_governance.md`
> * `specs/02_operational_sops/SOP-FIN-001_commission_settlement.md`
> * `specs/03_data_schemas/audit_log.schema.json`
>
> **生效版本**：v1.0 (Clean Plaintext Standard)

---

# 第一部分：官方商業發票範本 (Commercial Invoice Template)

本發票由 Teaforia India 開立予勝拓國際（invic），作為跨國服務費請款與銀行國際電匯（SWIFT）之合法申報憑證。

```text
====================================================================================================
                                      COMMERCIAL INVOICE
                                  (跨境技術人才媒合與核驗服務發票)
====================================================================================================

【開票機構 (Service Provider / Beneficiary)】
機構全名：TEAFORIA PRIVATE LIMITED (cv.teaforia.in)
公司地址：No. 42, Technology Corridor, Whitefield, Bengaluru, Karnataka, India - 560066
企業登記識別 (CIN)：U74999KA2024PTC188888
進出口許可證 (IEC)：0724999999
統一稅號 (PAN / GSTIN)：29AAAAA0000A1Z5 / LUT Eligible (Zero-Rated Export of Services)
財務聯繫專員：Michael / Accounts Desk (finance@teaforia.in)

【受票付款機構 (Billed To / Payer)】
企業全名：勝拓國際股份有限公司 (INVIC GLOBAL CO., LTD. / invic.com.tw)
公司統編 (Taiwan Tax ID)：83521876
公司地址：台北市中山區南京東路三段（依最新經濟部登記事項）
專案負責窗口：陳小姐團隊 (finance@invic.com.tw)

----------------------------------------------------------------------------------------------------
【發票核心元數據 (Invoice Metadata)】
發票號碼 (Invoice No.)         : INV-202611-TEA-0012
發票開立日期 (Invoice Date)     : 2026-11-02
款項到期日 (Payment Due Date)   : 2026-11-12 (依合約 10 個工作天內電匯)
結算幣別 (Settlement Currency)  : USD (美元)
付款里程碑類別 (Milestone Type) : MILESTONE_1_ONBOARDING (首期 50% 到職款)
----------------------------------------------------------------------------------------------------

【服務項目與對帳明細 (Billed Service Details)】

1. 候選人法定英文姓名 (Candidate Name) : Rajesh Kumar Sharma
2. 候選人存證編號 (Dossier ID)        : TEA-2026-IND-0088
3. 關聯職缺參考編號 (JD Reference ID) : TW-AUT-202610-01 (自動化機電整合工程師)
4. 台灣終端雇主法定全名                : 台達電子工業股份有限公司 (已解密合法露出版)
5. 抵台正式報到履新日 (Onboarding Date): 2026-11-01 (檢附到職單與勞保投保表影本)
6. 合約保障年薪 (Contract Annual CTC)  : 新台幣 NT$ 840,000 元 (保障 14 個月，月薪 NT$ 60,000)

----------------------------------------------------------------------------------------------------
【費用分潤與匯率換算邏輯 (Computation & Net Pool Breakdown)】

 (A) 台灣企業端實付佣金總額 (未稅)     : NT$ 151,200 元 (年薪之 18.0%)
 (B) 扣除跨境匯費與必要法定規費        : NT$ 0 元
 (C) 雙邊淨佣金池 (Net Commission Pool): NT$ 151,200 元
 (D) 臺灣銀行電匯當日即期賣出匯率     : 1 USD = 31.50 TWD
 (E) 淨佣金池折合美元 (Pool in USD)   : USD $ 4,800.00
 (F) 雙方拆帳比例 (Agreed Split Ratio) : Teaforia 50% / invic 50%
 (G) Teaforia 應得服務費總額 (Total)   : USD $ 2,400.00

----------------------------------------------------------------------------------------------------
【本期請款金額 (Amount Due This Invoice)】

 [V] 里程碑一：候選人抵台到職款 (50%) ----------------------------->  USD $ 1,200.00
 [ ] 里程碑二：滿 90 天試用期留任款 (50%) ------------------------->  USD $ 0.00 (待期滿請款)

 本期請款總額 (Total Amount Due)：USD $ 1,200.00 (壹仟貳佰元整 美元)
----------------------------------------------------------------------------------------------------

【官方跨境受款銀行帳戶資訊 (Beneficiary Banking Coordinates)】

 銀行受款人全名 (Beneficiary Name) : TEAFORIA PRIVATE LIMITED
 受款人開戶帳號 (Account Number)   : 924020058888888
 受款銀行名稱 (Bank Name)          : HDFC Bank Limited
 銀行分行名稱 (Branch Name)        : Whitefield Main Branch, Bengaluru
 國際電匯代碼 (SWIFT / BIC Code)   : HDFCINBBXXX
 印度本地清算代碼 (IFSC Code)      : HDFC0000240
 外匯用途申報代碼 (RBI Purpose Code): P0802 (Software & Technical Consulting Services)

----------------------------------------------------------------------------------------------------
【合規切結與存證聲明 (Legal & Compliance Assertions)】
1. 本發票所列費用係依據雙方簽署之《ARCH-002 防繞道法務合約》與《SOP-FIN-001 佣金手冊》計算。
2. 候選人享有到職日起算 90 天人才替換保證期（至 2027 年 01 月 30 日止）。
3. 匯費分攤方式：依國際慣例採 SHA (Shared)，發報行費用由 invic 負擔，中繼行與解款行費用由 Teaforia 負擔。
4. 付款後請 invic 於 24 小時內提供 MT103 銀行電匯底單；Teaforia 入帳後將提供印度受款行之 FIRC 水單備查。

授權代表用印 (Authorized Signatory)：
Michael / Managing Director, Teaforia India
[Teaforia Official Seal & Digital Signature]
====================================================================================================
```

---

# 第二部分：雙邊月度對帳清單範本 (Monthly Commission Statement)

勝拓國際（invic）與 Teaforia 財務專員於**每月最後一個工作日**共同核對之月度對帳清單格式：

```text
====================================================================================================
                    PROJECT CREDENCE: MONTHLY COMMISSION SETTLEMENT STATEMENT
                                  (雙邊跨境引才佣金月度結算對帳單)
====================================================================================================

結算計算區間：2026 年 10 月 01 日 至 2026 年 10 月 31 日
對帳產出時間：2026-10-31T17:00:00Z（RFC 3339 UTC）
對帳雙方窗口：勝拓國際財務組 (invic) × Teaforia 印度專案財務組 (Teaforia)
對帳台帳序號：STMT-2026-M10-001

----------------------------------------------------------------------------------------------------
【本月成案與撥款進度總覽表】

項次 | 候選人姓名    | 職缺編號         | 到職履新日 | 當前請款階段 | 應撥款金額   | 狀態註記    | 關聯發票號
----+---------------+------------------+------------+--------------+--------------+-------------+--------------------
01  | Rajesh Sharma | TW-AUT-202610-01 | 2026-10-15 | 首期到職(50%)| USD 1,200.00 | PAID (已匯) | INV-202610-TEA-0009
02  | Amit Patel    | TW-ELE-202609-02 | 2026-07-10 | 尾期期滿(50%)| USD 1,150.00 | PAID (已匯) | INV-202610-TEA-0010
03  | Vikram Singh  | TW-MEC-202610-03 | 2026-10-28 | 首期到職(50%)| USD 1,350.00 | DUE (待匯款)| INV-202610-TEA-0011
----+---------------+------------------+------------+--------------+--------------+-------------+--------------------

【本月彙總財務統計 (Monthly Aggregate)】
1. 本月應撥發總金額 (Total Gross Payable)   : USD $ 3,700.00
2. 本期已完成電匯金額 (Already Remitted)    : USD $ 2,350.00 (共 2 筆，水單已歸檔)
3. 待結算跨國電匯款 (Pending Remittance)    : USD $ 1,350.00 (預計 11/05 前完成撥付)
4. 試用期異常與退款沖銷 (Adjustments/Remedy): USD $ 0.00 (本月無異常退款或違約扣抵)

----------------------------------------------------------------------------------------------------
【人才保證期留任中監控清單 (Active Probation Tracking)】

檔案編號         | 候選人姓名    | 雇主名稱 (脫敏) | 到職日期   | 累積天數 | 保證截止日 | 留任狀態評級
-----------------+---------------+-----------------+------------+----------+------------+--------------------
TEA-2026-IND-0075| Amit Patel    | 桃園車用電子集團| 2026-07-10 | 90 天    | 2026-10-08 | 考核通過 (結案)
TEA-2026-IND-0082| Suresh Verma  | 新竹半導體設備商| 2026-09-01 | 60 天    | 2026-11-30 | 正常服務 (invic華語班參與率100%)
TEA-2026-IND-0088| Rajesh Sharma | 桃園上市電源集團| 2026-10-15 | 16 天    | 2027-01-13 | 正常服務 (無適應異常通報)

----------------------------------------------------------------------------------------------------
【雙方財務覆核簽章】

勝拓國際會計主管簽署：_______________________    日期：2026 年 ___ 月 ___ 日
Teaforia 財務專員簽署：_______________________    日期：2026 年 ___ 月 ___ 日
====================================================================================================
```

---

# 第三部分：AI 代理與系統生成規格 (System Ingestion Contract)

未來部署於 `cv.teaforia.in` 之 `Billing_Settlement_Agent`，於產生上述 PDF/發票時，後端應產生之 JSON Metadata 負載格式：

```json
{
  "$schema": "https://cv.teaforia.in/schemas/v1/commercial_invoice.schema.json",
  "invoice_number": "INV-202611-TEA-0012",
  "invoice_date": "2026-11-02",
  "settlement_id": "SETTLE-2026-IND-0012",
  "dossier_id": "TEA-2026-IND-0088",
  "jd_reference_id": "TW-AUT-202610-01",
  "candidate_legal_name": "Rajesh Kumar Sharma",
  "employer_unmasked_name": "台達電子工業股份有限公司",
  "milestone_category": "MILESTONE_1_ONBOARDING",
  "financials": {
    "contract_annual_ctc_twd": 840000,
    "commission_rate_percentage": 18.0,
    "gross_commission_pool_twd": 151200,
    "bot_fx_rate_twd_usd": 31.50,
    "net_commission_pool_usd": 4800.00,
    "teaforia_share_percentage": 50.0,
    "amount_due_usd": 1200.00
  },
  "banking": {
    "beneficiary_entity": "TEAFORIA PRIVATE LIMITED",
    "account_number": "924020058888888",
    "swift_code": "HDFCINBBXXX",
    "ifsc_code": "HDFC0000240",
    "rbi_purpose_code": "P0802"
  },
  "compliance_audit": {
    "firc_required": true,
    "firc_status": "PENDING_PAYMENT",
    "taiwan_withholding_tax_applicable": false,
    "audit_log_id": "LOG-2026-SETTLE-0012"
  }
}
```
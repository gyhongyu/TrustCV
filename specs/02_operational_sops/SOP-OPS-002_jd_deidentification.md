# SOP-OPS-002: 台灣企業職缺資訊去識別化與防繞道作業手冊

> **文件代號**：`SOP-OPS-002`  
> **關聯管線**：`STAGE_01_jd_provisioning`（Project Credence 六大階段之第一階段）  
> **適用角色**：Teaforia 營運團隊、invic 專案窗口、未來的 `JD_Deidentification_Agent`（AI 代理）  
> **系統節點**：`cv.teaforia.in`  
> **生效日期**：2026 年 9 月

---

## 1. 目的與核心原則

### 1.1 核心痛點：印度候選人穿透繞道（Bypass Risk）
在跨國中介與技術引進實務中，印度工程師具有高度主動性與網路檢索習慣。一旦在原始 Job Description (JD) 中露出台灣終端雇主的全名、工業園區詳細地址或專利產品型號，候選人極易透過：
1. **直接繞道投遞**：於 104 人力銀行、LinkedIn、企業官網 Career Page 進行直投。
2. **多重仲介撞單**：將職缺資訊透露給其他在印度的轉介者，導致台灣雇主收到多份同源履歷，引發代理權鎖定糾紛與佣金認列爭議。

### 1.2 核心原則：盲測匹配（Blind Matching Prior to Exclusive Commitment）
* **「在候選人正式通過雙重核驗、簽署獨家海外推薦授權前，對外發布之 JD 一律不得出現可直接辨識台灣終端雇主之任何資訊。」**
* 對外展示的 JD 僅保留：**技術規格、產業地位、薪資區間、外派地點（僅限縣市層級）與福利政策**。

---

## 2. 敏感實體定義與分級標準

執行去識別化作業時，必須嚴格排查並遮蔽以下三個等級的敏感實體：

| 等級 | 實體類別 | 原始 JD 常見內容範例 | 處置方式 |
| :--- | :--- | :--- | :--- |
| **Tier 1<br>(極度敏感)** | **直接識別實體** | 企業法定全名、品牌英文商標、統一編號、股票代碼、HR 聯絡人姓名/信箱/電話。 | **100% 絕對移除**，改由系統虛擬代理資訊取代。 |
| **Tier 2<br>(高度敏感)** | **地理與設施實體** | 廠區詳細門牌、特定工業區名稱（如「新竹科學園區三期研發大樓」、「台中精密機械園區某路」）、特定捷運站或地標描述。 | **模糊化處理**，降級為「北台灣/中台灣」或「桃園市/新竹縣/台中市」。 |
| **Tier 3<br>(間接關聯實體)** | **專有技術與客製專案** | 專利代號、內部專案代稱（如「Project Delta-9」）、高度客製之設備型號、專屬供應鏈客戶（如「專為北美特定電動車龍頭開發之電源模組」）。 | **泛化替代**，改為通稱（如「高壓直流電源系統」、「車規級控制電路」）。 |

---

## 3. 人工作業標準流程（Human Operator SOP）

當 Teaforia 專員透過官方專案 Email 收到 invic 提供之原始 JD 時，須在 **2 個小時內** 依序完成以下 4 個步驟：

```
[invic 提供原始 JD] 
       │
       ▼
【Step 1: 登錄與唯一編號】───> 生成 JD Reference ID (例如: TW-ME-202610-01)
       │
       ▼
【Step 2: 敏感詞紅色排查】───> 剔除 Tier 1/2/3 實體，填補標準行業畫像
       │
       ▼
【Step 3: 薪資與合規轉換】───> 換算 TWD/INR 實領月薪標準，標註加班與住宿津貼
       │
       ▼
【Step 4: 雙重覆核與發布】───> 匯出脫敏版 PDF，上架 cv.teaforia.in 或派發審核員
```

### Step 1: 建立職缺檔案與編碼
在內部系統或對帳台帳登錄原始職缺，並指派唯一編碼（規範見第 4 節）。

### Step 2: 敏感資訊替換（模板庫話術）
嚴格依據下表之標準泛化用語進行替換：

* **錯誤寫法（嚴格禁止）**：
  > ❌「台達電子（中壢廠）招募資深自動化 PLC 工程師，負責 Tesla 車用線束專案...」
* **正確寫法（標準規範）**：
  > ✅「【TW-ME-202610-01】台灣前三大電源供應與綠能系統上市集團（北台灣廠區）招募：機電整合與自動化工程師，負責車規級高壓配線與自動化產線維護...」

* **產業地位泛化標準庫**：
  * 半導體領域：`台灣前三大半導體晶圓製造/封測上市大廠`
  * 機電/自動化領域：`台灣知名上市機電自動化設備整合集團`
  * 電子/電源領域：`全球領先電源供應器與智慧綠能解決方案上市集團`
  * 線束/零組件領域：`台灣知名車用電裝與精密端子製造大廠`

### Step 3: 薪資與福利條件標準化
印度候選人極度關注稅前/稅後實領差距與赴台生活成本，脫敏 JD 須統一口徑：
1. **薪資呈現**：同時標註「新台幣月薪（TWD Monthly）」與「折合印度盧比月薪（INR CTC Monthly，以 1:2.6 浮動匯率基準估算）」。
2. **法定權益標記**：註明享有台灣勞保、健保，雇主是否提供宿舍或每月住宿補貼（例如每月補貼 NT$3,000~5,000）。
3. **外派承諾**：明確標註聘期合約長度（通常為 2 年至 3 年一聘）。

### Step 4: 匯出發布
產出《Teaforia De-identified JD Specification》標準 PDF 封包，並加蓋 Teaforia 浮水印。

---

## 4. 職缺唯一編碼規格（JD Reference ID Standard）

所有經由 invic 傳入的 JD，一律採用下列正規表示式（Regex）結構編碼：

$$\text{Format: } \mathbf{TW\text{-}[CATEGORY]\text{-}[YYYYMM]\text{-}[SEQ]}$$

* **`TW`**：固定國別代碼（台灣）。
* **`[CATEGORY]`**：職能類別代碼（3 碼）：
  * `ELE`：純電子/硬體工程師（Electronic / Hardware Engineer）
  * `MEC`：純機構/機械工程師（Mechanical Engineer）
  * `AUT`：機電整合與自動化專才（Automation / Mechatronics Engineer）
  * `FMW`：嵌入式與韌體開發（Firmware / Embedded Engineer）
  * `EQP`：半導體設備維護（Semiconductor Equipment Specialist）
  * `WIR`：配線與車用線束專員（Wiring Harness Specialist）
* **`[YYYYMM]`**：立項年月份（例如 `202610`）。
* **`[SEQ]`**：當月兩位數流水號（`01` 至 `99`）。

> **範例**：`TW-AUT-202610-03`（代表 2026 年 10 月第 3 份台灣機電自動化職缺）。

---

## 5. AI 代理自動去識別化決策規格（cv.teaforia.in System Spec）

未來由 `cv.teaforia.in` 後台 AI Agent 接管本流程時，代理程式須遵循下列 Prompt Logic 與 NLP 規則：

```yaml
agent_name: "JD_Deidentification_Agent"
version: "1.0.0"
execution_trigger: "POST /api/v1/internal/jds/ingest"

processing_pipeline:
  step_1_named_entity_recognition:
    target_entities:
      - "ORGANIZATION"
      - "GPE (Location)"
      - "PERSON"
      - "PHONE_NUMBER"
      - "EMAIL_ADDRESS"
      - "URL"
      
  step_2_redaction_rules:
    - rule_id: "RULE_MASK_COMPANY"
      action: "REPLACE"
      match: "ORGANIZATION"
      mapping_logic: "根據企業營收與規模，自動映射至標準描述（如『台灣知名上市機電集團』）"
      
    - rule_id: "RULE_FUZZY_LOCATION"
      action: "GENERALIZE"
      match: "GPE"
      whitelist: ["Taiwan", "Taipei", "Taoyuan", "Hsinchu", "Taichung", "Tainan", "Kaohsiung"]
      fallback: "北台灣高科技園區 / 中台灣精密製造聚落"

    - rule_id: "RULE_STRIP_CONTACTS"
      action: "PURGE"
      match: ["PHONE_NUMBER", "EMAIL_ADDRESS", "URL"]
      replacement: "[REDACTED_BY_TEAFORIA]"

  step_3_export_verification:
    assertion: "原始公司名稱與人名在最終文本中之 Levenshtein Similarity 必須為 0"
    output_schema: "specs/03_data_schemas/jd_provisioning.schema.json"
```

---

## 6. 解密揭露協議（De-masking Protocol）

何時可以將真實公司名稱告知候選人？**雙方必須嚴格遵守「三門檻達成」原則**：

只有在以下 **3 項條件同時滿足** 時，Teaforia 方得在視訊面試前 24 小時向候選人揭露真實公司全名：

1. **門檻一（資格核驗通過）**：候選人已完成學歷、Form 16、離職信之雙重審查，狀態機為 `VERIFIED_READY`。
2. **門檻二（簽署防繞道約定）**：候選人已於線上或紙本簽署《Teaforia 跨國就業專屬授權與防繞道切結書》，承諾 12 個月內不得以任何私人管道應徵該特定企業。
3. **門檻三（invic 複審放行）**：invic 已將該候選人狀態更新為 `INVIC_PASSED`，並發出正式終端企業面試邀請函（`INTERVIEW_SCHEDULED`）。

---

## 7. 違規與穿透洩密應變處置（Incident Response）

### 7.1 內部洩密（Teaforia / 專員疏失）
若因專員未去識別化即將原始文件發布於公開群組（如 WhatsApp、LinkedIn 社群），處置程序：
1. **15 分鐘內撤回**：立即刪除該則公開貼文或訊息。
2. **通報 invic 窗口**：主動告知 invic 該職缺可能面臨撞單風險，由 invic 提前在台灣客戶端進行名冊預警。
3. **變更職缺代碼**：系統註銷原 JD 代碼，重新編號派發。

### 7.2 候選人惡意繞道（Candidate Bypass Attempt）
若候選人於解密後，私自透過 104、官網或第三人轉介投遞該企業：
1. **觸發舉證機制**：Teaforia 提供該候選人簽署之《防繞道切結書》、初審錄音檔、系統時間戳存證郵件給 invic。
2. **主張第一順位佣金**：由 invic 法律顧問向該台灣企業發出正式存證公函，出示 Teaforia 交付之 `delivery_timestamp_utc`，主張該候選人實屬 invic x Teaforia 專屬推薦管線，企業仍有全額支付佣金之法律義務。
3. **列入黑名單**：該候選人永久標註為 `RED_FRAUD_REJECTED`，列入印度全域資料庫黑名單，不再提供任何海外就業推薦服務。
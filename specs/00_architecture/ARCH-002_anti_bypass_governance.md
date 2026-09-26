# ARCH-002: 跨國人才引進防繞道、所有權確立與法務治理規範

> **文件代號**：`ARCH-002`
>
> **歸屬領域**：`00_architecture`（高階商業協議與法務治理）
>
> **關聯實體**：
> * 供應與核實端：Teaforia India (`teaforia.in` / `cv.teaforia.in`)
> * 需求與代理端：勝拓國際股份有限公司 (`INVIC GLOBAL CO., LTD.` / `invic.com.tw`)
>
> **適用版本**：v1.0.1 (Clean Plaintext Spec)
>
> **生效日期**：2026 年 9 月

---

## 1. 宗旨與立法背景 (Legislative Context & Intent)

跨國工程人才引進業務具有「價值密度高、資訊不對稱性大、供應鏈節點長」之特性。在印度高階白領與技術人才（尤其是機電自動化、半導體設備、嵌入式韌體領域）引進台灣之實務中，極易衍生以下惡意繞道（Bypass）與確權糾紛：

1. **候選人穿透繞道（Candidate Direct Bypass）**：候選人獲悉台灣終端雇主資訊後，擅自透過 104 人力銀行、LinkedIn、企業官網直投，或委由在台親友遞件。
2. **多重仲介撞單爭議（Multi-Broker Collision）**：台灣製造業巨頭（如台達、鴻海、緯創等）通常與 5~8 家獵頭公司簽訂非獨家供應合約。若無絕對具備法律效力之所有權標準，極易引發佣金認定糾紛。
3. **退回後私下錄用（Rejection-to-Direct-Hire Evasion）**：終端雇主或仲介端以「資格不符」為由退件，卻於數週後私下接洽該候選人到職，惡意規避佣金給付。

為此，本規範建立一套具備法律約束力、操作可查證性、機器可驗證性（Machine-Verifiable）的確權與反繞道法務治理體系。

---

## 2. 確權鐵律：時間戳唯一權威 (Timestamp Precedence Authority)

在判定任何候選人所有權（Ownership of Representation）時，雙方嚴格恪守「官方伺服器寄達時間戳高於一切」之唯一原則。

### 2.1 唯一有效存證憑據 (Legally Binding Evidence)
* **唯一認可載體**：僅限 Teaforia 官方專案信箱寄達 invic 官方指定收件信箱之完整電子郵件（含 RFC 5322 原始郵件標頭與 MIME 封包）。
* **排除條款（Strict Exclusion）**：
  * **通訊軟體私聊一律無效**：LINE、WhatsApp、微信、Telegram、Slack 之聊天記錄、口頭承諾、螢幕截圖，均**不具備**確立候選人代理權之法律效力。
  * **未附核驗標章無效**：未經 Teaforia 雙重核驗（無 `dossier_id` 與核驗報告）之隨意轉發履歷，不享有所有權鎖定權限。

### 2.2 時間戳判定技術標準 (RFC 3339 Standards)
所有權生效時間點以接收端郵件伺服器之首道安全網關戳記（`Received` Header UTC Timestamp）為準，格式嚴格採用 RFC 3339 / ISO 8601 標準。

```text
【所有權確立時間公式】
所有權生效時間點 = 接收端郵件伺服器解析 RFC 5322 MIME 郵件標頭記錄之「Received UTC 時間戳」
```

```text
[技術存證規範示例]
Message-ID: <dossier.TEA-2026-IND-0088@delivery.cv.teaforia.in>
Date: Fri, 26 Sep 2026 14:10:00 +0000
Received: from mail-relay.teaforia.in by mx.invic.com.tw with ESMTPS ...
X-Teaforia-SHA256: 8f4b2c1e9a78d05c6e83... (交付封包防偽雜湊值)
```

---

## 3. 資訊分級揭露與盲測推進機制 (Progressive Disclosure Protocol)

為從源頭杜絕外流風險，全管線採行「資訊分級最小揭露原則」，依進度分階段釋放敏感欄位：

```
[階段 0: 公開池] ──> [階段 1: 交付審查] ──> [階段 2: 終審面試] ──> [階段 3: 正式聘僱]
  (雙向脫敏)            (憑證背調)           (三門檻解密)         (全量法律文件)
```

### 3.1 雙向資訊分級表

| 階段別 | 對候選人端之雇主資訊揭露 | 對 invic / 企業端之人才資訊揭露 | 合法解密條件 |
| :--- | :--- | :--- | :--- |
| **Tier 0：公開招募池**<br>(Sourcing Pool) | 嚴格去識別化（例如：「北台灣前三大電源供應上市集團」）；禁止出現公司名稱與地址。 | 去識別化代號（例如：`TEA-AUT-088`）；電話與個人 Email 全面遮蔽。 | 候選人登入系統建立基本資料。 |
| **Tier 1：官方交付審核**<br>(STAGE_03 送件) | 維持去識別化。 | 揭露護照法定姓名、脫敏聯絡代理信箱（`@candidate.teaforia.in`）、完整核驗憑證包。 | 候選人通過 Teaforia 雙重核驗。 |
| **Tier 2：終審面試**<br>(STAGE_05 面談) | 揭露終端雇主法定名稱、廠區城市、職務詳細說明書。 | 揭露全量技術檔案、遠端面試即時連線視訊。 | **達成三門檻解密條件**（詳見 3.2 節）。 |
| **Tier 3：簽約與簽證**<br>(STAGE_06 錄用) | 揭露完整聘僱合約書、工作門牌地址、主管聯絡人。 | 揭露未遮蔽護照掃描件、住家地址、直系家屬緊急聯絡人。 | 終端雇主發出正式 Offer 且候選人簽署接受。 |

### 3.2 三門檻解密限制（The Triple-Gate Decryption）
唯有**同時滿足以下三項條件**，Teaforia 系統與面試官始得對候選人揭露台灣終端雇主全名：
1. **門檻一（資格核實）**：候選人完成原件背調且人臉比對通過，核發綠標（`GREEN_VERIFIED_READY`）。
2. **門檻二（法律切結）**：候選人已數位簽署《Teaforia 獨家海外推薦與防繞道切結書》（含違約金條款）。
3. **門檻三（面試發起）**：invic 已向 Teaforia 發出正式面試確認單，並於系統鎖定面試日程。

---

## 4. 排他性保護期與撞單仲裁 (Exclusivity & Collision Arbitration)

### 4.1 180 天排他性保護期 (180-Day Protection Window)
自 Teaforia 官方 Email 寄達 invic 之時間戳（`T_ownership`）起算：
1. **保護時效**：該候選人享有為期 **180 天之排他性代表權**。
2. **自動延期條款**：若該候選人於第 150 至 180 天期間已進入終審面試或簽證申請流程，保護期自動順延 90 天，直至聘僱結算或官方書面終止。

### 4.2 惡意撞單仲裁準則 (Collision Dispute Resolution)
若台灣終端企業反映「其他獵頭亦推薦同一候選人」時，依循以下步驟判定歸屬：

```
[撞單爭議觸發] 
       │
       ▼
【第 1 順位：企業內部收件時間戳】
   - 比對各獵頭正式寄達企業 HR 信箱之伺服器時間戳記。
   - 若 invic 持有 Teaforia 之 Timestamp 早於其他獵頭，所有權歸屬 invic/Teaforia。
       │
       ▼
【第 2 順位：候選人唯一代理授權書 (Candidate Representation Letter)】
   - 若時間戳記相差在 24 小時之內引發爭端，以候選人親簽之最新版「獨家委託授權書」為準。
```

---

## 5. 違約處罰與法律責任 (Breach Penalties & Remedies)

### 5.1 候選人惡意繞道責任 (Candidate Direct Bypass Penalty)
候選人若違反本協議，於未經 Teaforia 與 invic 同意下自行向該企業應徵或透過第三方到職：
* **法律後果**：
  1. 註銷其 `cv.teaforia.in` 帳號並列入全印度人力資源反詐欺黑名單（Blacklist Consortium）。
  2. 依據切結書約定，候選人須賠償 Teaforia 相當於其在台**三個月全額薪資之懲罰性違約金**。
  3. invic 得向台灣內政部移民署與勞動部函告其違背誠信原則之情事。

### 5.2 雇主退件後私下進用責任 (Direct-Hire After Rejection Penalty)
終端雇主或仲介端若以「不錄用/不合適」退件，卻於保護期（180 天）內私下接洽該候選人到職：
* **法律後果**：
  1. 視同正式委任成交，invic 應依企業合約向雇主追討 **200% 之懲罰性全額佣金**。
  2. invic 於收到該筆款項後，應依照約定拆帳比例將 Teaforia 應得之份額如數匯交。

---

## 6. AI 代理執行之防偽斷言規範 (AI Agent Audit Ingestion Spec)

未來 `cv.teaforia.in` 之後端排查代理在處理任何交付請求時，必須執行以下機器斷言檢查：

```text
【AI 代理存證檢核邏輯】
1. 斷言 1 (時間戳不可逆)：
   系統存證之 delivery_timestamp 必須小於等於目前系統時間，且具備加密簽章。
2. 斷言 2 (不可竄改性)：
   交付封包之 SHA-256 雜湊值必須與存證資料庫完全吻合。
3. 斷言 3 (去識別化防禦)：
   在候選人端達成「三門檻解密」之前，所有對外資料封包的雇主全名比對相似度必須為 0。
```
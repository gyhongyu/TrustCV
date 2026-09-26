# Project TrustCV / Credence: 跨國引才雙軌運營與 AI 代理自動化平台

> **專案代號**：`TrustCV` / `Project Credence`
>
> **系統節點**：`cv.teaforia.in`
>
> **合作雙方**：
> * **印度供應與核實端**：Teaforia India（Michael / 專家審查小組）
> * **台灣需求與代理端**：勝拓國際股份有限公司（`INVIC GLOBAL CO., LTD.` / 陳小姐團隊）
>
> **文檔規範標準**：v1.0.0 (Clean Plaintext Standard，全域禁用 LaTeX 語法)
>
> **建立日期**：2026 年 9 月

---

## 1. 專案願景與核心使命 (Mission & Core Logic)

在傳統跨國工程人才引進業務中，印度求職市場普遍存在高達 90% 的履歷灌水、替考代考與經歷虛構現象；同時，台灣終端製造業雇主面臨極高的跨國辨識成本，且極易發生候選人穿透繞道（Bypass）、多重獵頭撞單糾紛。

**Project TrustCV / Credence 的核心任務是建立一套「雙重核實（Dual-Verification）與確權治理系統」**：
1. **核實優先（Verified Recruiting）**：不以單純履歷轉發為目的，而是將客觀憑證（學士學位、Form 16 稅單、離職證明、公積金）作為前置過濾網，徹底剔除虛構履歷。
2. **防繞道與時間戳確權（Anti-Bypass Precedence）**：以官方 RFC 5322 MIME 郵件標頭時間戳作為唯一法定所有權基準，落實 180 天排他代表權與三門檻解密限制，杜絕候選人私自上 104 直投。
3. **人機雙軌並行（Human-to-AI Transition）**：當前以人工專家（太太/初審員）輔以標準化 SOP 運行，同時全管線定義標準 JSON Schema 與斷言規格，為 Phase 2 全自動化 AI 代理（Agents）無縫接管奠定基礎。

---

## 2. 專案完整目錄樹與單一真實來源 (Project Tree & SSOT)

本專案所有規範、模型與交付物已完整模組化落地於本目錄中：

```text
TrustCV/
├── README.md                                         # [SSOT] 系統總綱、導航與 AI 代理交接手冊
├── init_trustcv_scaffold.bat                         # Windows 11 自動化目錄架構建置腳本
│
├── specs/00_architecture/                                  # 【高階商業架構與法務治理】
│   ├── ARCH-001_business_blueprint.md               # 商業運營藍圖、合作邊界與管線總圖
│   └── ARCH-002_anti_bypass_governance.md           # 防繞道確權原則、180天保護期與法務規範
│
├── specs/01_pipeline_specs/                               # 【六大主幹管線全域與各階段技術規格】
│   ├── SPEC-000_pipeline_master_framework.md        # 全域六階段管線框架與人機雙軌架構
│   └── stages/
│       ├── STAGE_01_jd_provisioning.md              # 階段一：職缺發布、脫敏清洗與入庫規格
│       ├── STAGE_02_credential_verification.md      # 階段二：憑證收集、反偽排查與雙重核驗規格
│       ├── STAGE_03_official_submission.md          # 階段三：官方時間戳交付、確權與防繞道發送規格
│       ├── STAGE_04_invic_screening.md              # 階段四：invic 顧問篩選、客戶規格比對與反饋規格
│       ├── STAGE_05_final_interview.md              # 階段五：台灣企業終審面試、三門檻解密規格
│       └── STAGE_06_hire_and_settlement.md          # 階段六：正式錄用、工作簽證與佣金交割規格
│
├── specs/02_operational_sops/                             # 【執行手冊：現場操作員與專家專用】
│   ├── SOP-OPS-001_credential_audit_guide.md        # 印度客觀憑證排查指南 (學歷/Form 16/離職信/EPFO)
│   ├── SOP-OPS-002_jd_deidentification.md           # 台灣企業職缺去識別化與防繞道作業手冊
│   ├── SOP-OPS-003_candidate_tech_screen.md         # 候選人遠端技術初審、防替考調測作業手冊
│   └── SOP-FIN-001_commission_settlement.md         # 佣金請款、90天試用期追蹤與跨境電匯手冊
│
├── specs/03_data_schemas/                                 # 【機器可讀合約：JSON Schema 格式】
│   ├── verified_candidate.schema.json               # 候選人雙重核驗交付封包標準資料模型
│   ├── jd_provisioning.schema.json                  # 職缺規格資料模型 (含機密版與去識別化公開版)
│   └── audit_log.schema.json                        # 全域時間戳存證、數位指紋與不可竄改日誌模型
│
└── specs/04_templates/                                    # 【制式交付物範本】
    ├── TEMPLATE_verified_dossier.md                 # Teaforia Verified 推薦人才簡歷包範本
    ├── TEMPLATE_deidentified_jd.md                  # 台灣企業職缺去識別化公開版摘要範本
    └── TEMPLATE_commission_invoice.md               # 雙邊商業請款發票與跨境月度對帳單範本
```

---

## 3. 六大核心管線生命週期 (The 6-Stage Pipeline Lifecycle)

```text
+---------------------------------------------------------------------------------------------------+
|                                 PROJECT CREDENCE 六大階段全貌                                      |
+---------------------------------------------------------------------------------------------------+
  STAGE_01: 職缺發布 (JD Provisioning)
    台灣企業原始 JD ➔ 敏感實體去識別化 ➔ 標準產業畫像替換 ➔ 產出 TW-AUT-XXXXXX 編號
       │
       ▼
  STAGE_02: 雙重核驗 (Credential Verification)
    學歷名冊比對 ➔ Form 16 水印排查 ➔ 離職信與 MCA 代碼驗證 ➔ 15 分鐘防替考視訊初審 ➔ 核發綠標
       │
       ▼
  STAGE_03: 時間戳交付 (Official Submission)
    官方專用信箱傳輸 ➔ 擷取 RFC 5322 Received UTC 時間戳 ➔ 鎖定 180 天排他代理權 ➔ 啟動 72h SLA
       │
       ▼
  STAGE_04: 顧問篩選 (invic Screening)
    invic 顧問 72 工作小時審核 ➔ 台灣雇主規格比對 ➔ 結構化反饋 (PASS / REJECT / HOLD)
       │
       ▼
  STAGE_05: 終審面試 (Final Interview)
    滿足三門檻解密條件 ➔ 揭露企業全名 ➔ 跨時區排程 (IST/CST) ➔ 設備調測 ➔ 企業主管視訊複試
       │
       ▼
  STAGE_06: 錄用交割 (Hire & Settlement)
    Offer 簽署鎖定 ➔ 工作簽證/良民證 ➔ 抵台報到履新 (首期 50%) ➔ 90 天試用期考核 (尾款 50%)
+---------------------------------------------------------------------------------------------------+
```

---

## 4. 全域不可逾越之核心鐵律 (System Constraints & Golden Rules)

任何人類操作員或後續介入之 AI 代理，必須無條件遵循以下三項核心邊界：

1. **純文字與程式碼表達鐵律（Strict No-LaTeX Rule）**：
   * 本專案全域文件嚴格禁止使用任何 LaTeX 數學語法（禁止 `$`、`$$`、`\times`、`\text{}` 等）。
   * 凡涉及公式、計分權重或對帳計算，一律採用純文字區塊（Text Block）或程式偽代碼（Pseudocode）表示，確保跨平台解析零亂碼。

2. **所有權判定時間戳唯一原則（Timestamp Precedence Rule）**：
   * 通訊軟體（LINE、WhatsApp、微信、Telegram）私聊記錄**嚴格不具備**法律代理確權效力。
   * 唯一合法確權依據為：**Teaforia 官方專案信箱寄達 invic 官方伺服器所記錄之 RFC 5322 MIME Received Header UTC 時間戳**。

3. **三門檻安全解密限制（The Triple-Gate Decryption Gate）**：
   * 在對候選人揭露台灣終端雇主全名之前，必須同時滿足：
     1. 候選人取得 Teaforia 綠標核驗（`GREEN_VERIFIED_READY`）。
     2. 候選人已數位簽署《獨家海外推薦與防繞道切結書》。
     3. invic 正式發出企業面試確認通知。

---

## 5. 後續推進行動指南與 AI 代理交接路線圖 (Handoff & Next Steps)

本專案規格已全面收斂就緒，未來的接手者（包括人類開發團隊、運營專員或自主 AI 代理）應按以下優先順序接手推進後續三項重大工作：

### 任務一：版本控制與基準發布 (Git Version Control & Tagging)
* **執行目標**：將現有 `E:\Projects\TrustCV\` 建立為正式版本控制儲存庫，固化 v1.0.0 基準標準。
* **具體工作內容**：
  1. 在專案根目錄執行 `git init`。
  2. 建立 `.gitignore` 檔案（排除臨時備份檔、編輯器快取與敏感設定檔）。
  3. 執行第一次全量提交：`git commit -m "feat: complete initial TrustCV operational framework and specs (v1.0.0)"`。
  4. 打上基準標籤：`git tag -a v1.0.0 -m "Baseline production release: Clean spec without LaTeX"`。
  5. 設定遠端私有儲存庫（GitHub / GitLab / AWS CodeCommit）並完成推播。

### 任務二：商務拓展與合作備忘錄生成 (Commercial MOU & Partner Briefing)
* **執行目標**：為勝拓國際（invic / 陳小姐）產出高階決策者適讀之精簡版商務簡報與合作備忘錄（MOU）。
* **具體工作內容**：
  1. 依據 `specs/00_architecture/` 與 `specs/02_operational_sops/`，提煉出 1~2 頁之《Teaforia x invic 跨國技術引才合作備忘錄（MOU 草案）》。
  2. 重點強調：
     * 雙邊分工界面（Teaforia 負責印度真實憑證查核；invic 負責台灣企業客戶維護）。
     * 防繞道保護機制（官方 Email 時間戳 180 天排他代表權保障雙方權益）。
     * 50/50 雙階段佣金拆分與 90 天人才離職免費遞補條款。
  3. 產出繁體中文商業簡報（Pitch Deck Outline），便於 invic 向台灣製造業人資長（CHRO）推廣「Verified Talent」核驗品牌。

### 任務三：`cv.teaforia.in` 系統工程架構與 AI 代理開發 (Platform Engineering)
* **執行目標**：將目前的文檔規格落實為具備自動化處理能力的雲端應用平台。
* **技術棧規劃建議**：
  * **前端門戶**：Next.js (React, TailwindCSS) — 提供候選人履歷上傳保險庫與 invic 專屬審核門戶。
  * **後端引擎**：FastAPI (Python) — 處理多模態憑證提取、資料校驗與業務狀態機流轉。
  * **資料庫**：PostgreSQL (Supabase) — 嚴格依據 `specs/03_data_schemas/` 定義之結構建置 Tables，並使用 pgvector 處理技能嵌入向量。
  * **AI 代理編排（Agent Orchestration）**：
    * `JD_Deidentification_Agent`：接收原始 JD 並自動呼叫 LLM 進行實體脫敏與產業畫像生成（落實 SOP-OPS-002）。
    * `OCR_Fraud_Agent`：自動解析 Form 16 TRACES 水印與學歷證書，排查 Photoshop 變造痕跡（落實 SOP-OPS-001）。
    * `Dispatch_Agent`：串接 SMTP 伺服器，自動產生具備 SHA-256 數位指紋之交付郵件與存證日誌（落實 STAGE_03）。

---

## 6. AI 代理執行上下文指南 (AI Agent Ingestion Guidelines)

若未來是由自主 AI 代理（如 Cursor, Claude Code, Windsurf, AutoGPT 等）讀取本儲存庫進行程式碼生成或日常營運，請遵循以下解析指引：

* **資料驗證基準**：所有資料結構（Payload）必須以 `specs/03_data_schemas/` 下的 JSON Schema 為唯一校驗依據。
* **流程判斷基準**：凡涉及候選人狀態變更或權限釋放，嚴格檢索 `specs/01_pipeline_specs/stages/` 中的「Quality Gates」與「State Machine」。
* **業務規則問答**：若遇到退件原因、離職保證或跨境款項計算，以 `specs/02_operational_sops/` 之規定為最高裁決標準。

---

*Project TrustCV / Credence 官方技術資產 | 內部機密文件*
# 📋 專案工作交接文檔 (HANDOFF.md)

---

## 0. 🧠 智腦不二過記憶突觸 (Brain Synapse & Anti-Failure DNA)
- **上游會話 ID (Upstream Conversation ID)**: `f27fc3b7-0ab2-49b0-8f36-189a6f8cf4a4`
- **當前會話 ID (Current Conversation ID)**: `47d72853-83c5-45c6-9285-49b69051b92b`
- **血淚紅線與不可破天條 (Hard Invariants)**:
  1. ⛔ **未授權絕對禁止 Git 推送**：除非使用者在對話中明確打出「git push」或「推送遠端」，否則任何代理人嚴禁發起遠端推送！
  2. ⛔ **嚴禁終端內嵌代碼落盤**：禁止使用 `py -c`、`node -e` 或 `echo` 拼接字串寫檔案，必須使用專屬檔案編輯工具。
  3. ⛔ **全域嚴禁 LaTeX 語法**：所有文檔、Dossier 與 UI 一律採用語意 HTML/Markdown/JSON。
  4. ⛔ **嚴格禁止印地語與簡體中文**：僅支援英文 (`en`) 與繁體中文 (`zh-TW`)。示範文字、職缺與履歷嚴禁中英括弧混用，一律依語系乾淨分流。
  5. 🔒 **二進位檔案隔離鐵律**：候選人真實履歷、身分證件與上游原始 JD 全數存儲於 Google Drive，嚴禁 commit 進入 GitHub 倉庫污染 Git 歷史！
  6. 🖥️ **跨端響應式與主題鐵律**：
     - PC 大螢幕以 `max-w-7xl` 展開為專業雙欄 Dashboard 佈局，頂部展開導航選單；行動端維持底部 Tab。
     - 明亮模式採用白底微型標、白瓷卡片 `#FFFFFF`、灰白底板 `#F8FAFC`、深字 `#0F172A`；暗黑模式維持曜石黑底 `#080C0E`。
  7. 🌐 **本地預覽伺服器**：本地測試透過根目錄專屬腳本 [`啟動本地預覽.bat`](file:///啟動本地預覽.bat)（端口 `27891`，無自動彈窗開瀏覽器，網址 `http://127.0.0.1:27891`）。

---

## 1. 🗺️ 專案最新物理架構與模組地圖 (Project Topology & Modules)
詳細活地圖請查閱：[`docs/TOPOLOGY.md`](file:///docs/TOPOLOGY.md)
- `specs/`: 業務規格與產品法典庫（含 `PRD.md`、`00_architecture/` ~ `04_templates/`）
- `specs/mock_data/`: 標準化虛擬種子資料庫（`jobs_seed.json`, `candidates_seed.json` 已 100% 通過 Schema 驗證）
- `assets/`: 視覺設計與高保真原型庫（`BRAND_GUIDE.md`、`prototypes/trustcv_pwa_ui.html`、`icons/`）
- `docs/`: DMC 研發工程知識庫（`STATE.md` ≤200行、`ACTIVE_LOG.md` 只追加日誌、`TOPOLOGY.md` 活地圖）
- `.agents/skills/`: 專案專屬常駐守護技能 (`project_structure_keeper`)
- `.agent_profiles/`: 多模式規則庫（當前：`🛠️ 開發模式`）
- 根目錄前端: Web 應用入口（純靜態免構建）
  - `index.html`, `manifest.json`, `sw.js` (v1.1.1), `啟動本地預覽.bat`
  - `css/style.css`
  - `js/`: `app.js`, `store.js`, `i18n.js`, `api.js`, `mock/mockData.js`, `components/` (5 個視圖組件)
- `tools/`: 轉檔與校驗工具（`convert_icons.py`, `validate_mock_schema.py`）
- `gas/`: Google Apps Script 後端網關（佔位骨架，**目前暫停開發**）
- `worker/`: 打工仔 LLM 與上游職缺同步模組（佔位骨架，**目前暫停開發**）

---

## 2. 系統現況與已固化基線 (System Baseline)
- [x] **階段 0：視覺資產規格固化** 完成（`assets/icons/` 生成 16, 32, 180, 192, 512 PNG 與 `favicon.ico`）。
- [x] **階段 1：規格契約與 Mock 資料真值校準** 完成（`jobs_seed.json`, `candidates_seed.json` 通過 `jsonschema` 官方校驗，`mockData.js` 封裝完成）。
- [x] **階段 2：前端骨架與本地啟動器** 完成（組件模組化拆分、`啟動本地預覽.bat` 落地運行）。
- [x] **階段 2.5：PC 寬螢幕適配與深淺色主題解耦** 完成（PC 端 `max-w-7xl` 雙欄 Dashboard、亮色白瓷卡片、暗色曜石底）。
- [x] **前端細節修訂完畢**：
  - 徹底移除 Header 的 `PWA` 標籤。
  - 徹底移除簡中版，收斂為純粹的 `EN | 中文` 雙語切換。
  - 示範文字與職缺標籤中英純淨分流，徹底消除括弧混用。
- [ ] ⏸️ **開發狀態暫停**：使用者要求**先中斷代碼研發**，優先進行 **UI 需求溝通與審核**。
- [ ] 🚀 **插隊任務立案**：為下個代理人準備 **GitHub Pages 倉庫建置與域名部署** 前置整理工作。

---

## 3. 下一棒核心待辦任務 (Immediate Action Items & Missions)

> 🚨 **【最高指令：先中斷開發，不要推進階段 3 後端！】**  
> 使用者明確指示：「接下來的代理先中斷開發, 我們要先溝通ui還有沒有要改的, 所以插隊個任務給下個代理準備整理建github pages倉庫, 部署域名..等工作」。

### 🎯 任務 A：UI 溝通與需求確認 (主線)
1. 進入與使用者的 UI 溝通階段，聽取使用者針對當前前端頁面（`http://127.0.0.1:27891`）的視覺反饋與修改需求。
2. 若使用者提出 UI 調整，優先微調前端組件，確認滿足後再進行後續工作。

### 🎯 任務 B：插隊任務 —— GitHub Pages 倉庫與域名部署準備
1. **倉庫資產與建置盤點**：
   - 盤點當前專案靜態檔案（`index.html`, `css/`, `js/`, `assets/`, `manifest.json`, `sw.js`）。
   - 確保無大於 50MB 檔案、無二進位履歷文件，符合純靜態 Web / GitHub Pages 託管要求。
2. **網址目標與 Cloudflare 域名準備**：
   - 目標域名：`cv.teaforia.in`（或使用者指定的 GitHub Pages 自定義域名）。
   - 準備 `CNAME` 文件或 Cloudflare DNS 解析規劃（可調用全域技能 `cloudflare_domain_manager` 進行子域名探測與綁定規劃）。
   - 準備 GitHub 遠端倉庫建立方案（可調用全域技能 `github_manager`），但**切記不可在未獲使用者明確指示前執行 `git push`**！
3. **產出部署整備清單 (Deployment Checklist)**：
   - 整理靜態路徑檢查（確認所有資源為相對路徑 `./`，避免 GitHub Pages 子路徑 404）。
   - 提供清晰步驟供使用者確認授權後一鍵推動部署。

---

## 4. 驗收啟動指令 (Verification Step)
接手的代理人請直接執行以下確認步驟：
1. 執行 `py .agents/skills/project_structure_keeper/scripts/keeper.py audit` 確認目錄結構完整無散落。
2. 保持端口 `27891` 運行，準備好與使用者溝通 UI 需求並說明 GitHub Pages 部署整備規劃。

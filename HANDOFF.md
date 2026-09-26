# 📋 專案工作交接文檔 (HANDOFF.md)

---

## 0. 🧠 智腦不二過記憶突觸 (Brain Synapse & Anti-Failure DNA)
- **上游會話 ID (Upstream Conversation ID)**: `ac61d353-32e4-4d0f-b4e7-4ffe71643d05`
- **考核盲測驗證會話 ID**: `d6c4754f-b2ff-435a-9198-52c8f0a78f33` (盲測 100 分卓越過關)
- **血淚紅線與不可破天條 (Hard Invariants)**:
  1. ⛔ **未授權絕對禁止 Git 推送**：除非使用者明確打出「git push」或「推送遠端」，否則任何代理人嚴禁發起遠端推送！
  2. ⛔ **嚴禁終端內嵌代碼落盤**：禁止使用 `py -c`、`node -e` 或 `echo` 拼接字串寫檔案，必須使用專屬檔案編輯工具。
  3. ⛔ **全域嚴禁 LaTeX 語法**：所有文檔、Dossier 與 UI 一律採用 HTML/Markdown/JSON。
  4. ⛔ **嚴格禁止印地語 (Hindi/Tamil)**：僅支援英文 (`en`)、繁中 (`zh-TW`)、簡中 (`zh-CN`)，底層採 `data_en` 與 `data_zh` 雙軌。
  5. 🔒 **權力分立鐵律**：專案守護者 (`project_structure_keeper`) 只讀只報警，絕對禁止擅自刪除或移動非登記檔案！

---

## 1. 🗺️ 專案最新物理架構與模組地圖 (Project Topology & Modules)
詳細活地圖請查閱：[`docs/TOPOLOGY.md`](file:///docs/TOPOLOGY.md)
- `specs/`: 業務規格與產品法典庫（含 `PRD.md`、`00_architecture/` ~ `04_templates/`）
- `assets/`: 視覺設計與高保真原型庫（含 `BRAND_GUIDE.md`、`prototypes/trustcv_pwa_ui.html` 4 屏原型、`svg/`）
- `docs/`: DMC 研發工程知識庫（`STATE.md` ≤200行、`ACTIVE_LOG.md` 只追加日誌、`TOPOLOGY.md` 活地圖）
- `.agents/skills/`: 專案專屬常駐守護技能 (`project_structure_keeper`)
- `.agent_profiles/`: 多模式規則庫（當前：`🛠️ 開發模式`）
- `index.html`: GitHub Pages PWA 應用入口（純靜態免構建）
- `gas/` (待建): Google Apps Script 後端網關（Google Sheets 4 張表 + Drive 隔離庫）
- `worker/` (待建): 打工仔 LLM 履歷結構化提取與在地化翻譯

---

## 2. 系統現況與已固化基線 (System Baseline)
- [x] DMC 研發知識治理機制 (`docs/STATE.md`, `docs/ACTIVE_LOG.md`) 建立完成。
- [x] 多模式規則架構部署完成，預設處於開發模式。
- [x] 全域目錄拓撲規整完成，Markdown 相對鏈接 100% 自癒零死鏈。
- [x] 專案常駐守護技能 (`project_structure_keeper`) 部署完畢並通過黑盒盲測考核。
- [x] 本地 Git 倉庫初始化完成，首次基礎 Commit (`eae592e`) 已固化。

---

## 3. 下一棒核心待辦任務 (Immediate Action Items)

> 🚨 **【下任代理人最高行為準則：強制進入討論模式】**
> 本次任務為「**代碼骨架規劃與 0KB 佔位佔點**」。請務必先在對話中進入【討論模式】，出示你的整體架構規劃，獲得人類同意後，才可創建 0KB 檔案！

### 🎯 任務目標：規劃代碼結構並建立 0KB 骨架佔位檔案
請下一任代理人依據以下三個大方向，規劃出清晰的模組結構（可先建立 0KB 空檔案），為日後的開發順序與分工奠定乾淨基礎：

1. **前端 PWA 模組化骨架 (根目錄 / js / css)**：
   - 參考 `assets/prototypes/trustcv_pwa_ui.html` 原型。
   - 規劃並建立 0KB 檔案：
     - `index.html` (PWA 主入口)
     - `manifest.json` (PWA 描述清單)
     - `sw.js` (離線 Service Worker)
     - `css/style.css` (自訂樣式)
     - `js/app.js` (主路由與狀態調度)
     - `js/i18n.js` (雙語切換引擎)
     - `js/api.js` (與 GAS 網關通訊封裝)
     - `js/store.js` (LocalStorage 本地狀態)
     - `js/components/` (各畫面組件佔位)
2. **後端 GAS 雲端網關模組 (`gas/`)**：
   - 規劃並建立 0KB 檔案：
     - `gas/Code.js` (RESTful Web App 路由器: doGet / doPost)
     - `gas/Database.js` (Google Sheets 4 張表 CRUD 操作)
     - `gas/DriveService.js` (Google Drive 候選人資料夾與證件管理)
     - `gas/JobService.js` (脫敏職缺查詢與 invic 協議接口)
     - `gas/Config.js` (系統設定與常數)
3. **外部打工仔 LLM 與上游同步模組 (`worker/`)**：
   - 規劃並建立 0KB 檔案：
     - `worker/resume_parser.py` (履歷文字/PDF 結構化抽取)
     - `worker/dossier_translator.py` (台灣在地化術語轉譯引擎)
     - `worker/sync_upstream_jobs.py` (勝拓 invic 職缺定時入庫)

---

## 4. 驗收啟動指令 (Verification Step)
完成規劃並建立 0KB 骨架後，執行專案守門員巡檢：
```bash
py .agents/skills/project_structure_keeper/scripts/keeper.py audit
```
並執行拓撲活地圖同步：
```bash
py .agents/skills/project_structure_keeper/scripts/keeper.py sync
```

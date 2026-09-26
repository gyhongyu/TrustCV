---
name: project_structure_keeper
description: 專案專屬結構活地圖與模組職責守護員 (Project Structure & Topology Keeper)。專門用於以 0-Token 極速為 AI 代理人提供本專案最新目錄職責清單、代碼模組化邊界與架構真理。當使用者或代理人提到「專案架構」、「目錄結構」、「模組放在哪」、「業務規格在哪」、「UI原型在哪」、「代碼拆分重構」、「新增核心模組」或在重大架構調整後需要同步拓撲時強制喚醒。
---

# 🛡️ 專案專屬拓撲守護員 (project_structure_keeper)

> 📌 **核心使命**：本技能常駐於本專案，為所有進場之 AI 代理人提供最權威的「房間地圖與模組責任邊界」，杜絕盲目掃描全庫代碼與在根目錄亂扔檔案！

---

## 🗺️ 專案核心模組分工與責任邊界

詳細活地圖請查閱：[docs/TOPOLOGY.md](file:///docs/TOPOLOGY.md)

1. **`specs/` (業務規格與產品法典庫)**：
   - 包含 `PRD.md`、`00_architecture/` ~ `04_templates/`。
   - 凡涉及業務流程、防偽審核、防繞道、JSON Schema 資料模型，一律在此查閱，嚴禁盲猜業務。
2. **`assets/` (視覺設計與高保真原型庫)**：
   - 包含 `BRAND_GUIDE.md` (品牌色碼與規範)、`prototypes/trustcv_pwa_ui.html` (4屏原型)、`svg/`。
   - 凡涉及前端樣式、顏色、字體、Icon，一律 100% 複用此處規格，嚴禁自行發明顏色。
3. **`docs/` (研發工程 DMC 知識庫)**：
   - `docs/STATE.md` (架構真理 ≤200行)、`docs/ACTIVE_LOG.md` (只追加日誌)、`docs/TOPOLOGY.md` (拓撲活地圖)。
4. **`index.html` & 根目錄 (GitHub Pages PWA 應用入口)**：
   - 包含 PWA 前端網頁、`manifest.json`、`sw.js`。
5. **`gas/` (Google Apps Script 後端網關)**：
   - 處理與 Google Sheets (4張表) / Google Drive 的雲端 CRUD 交互。
6. **`worker/` (打工仔 LLM 與上游職缺同步)**：
   - 負責履歷萃取、在地化翻譯與勝拓 (invic) 職缺自動化入庫。

---

## ⚡ 粗粒度重大架構增量維護守則 (Living Sync Rule)

- **日常開發**：微調 CSS、修復小 Bug、常規功能編寫，**嚴禁**觸發拓撲更新，保持開發敏捷。
- **重大架構變更**：當單一超大檔案進行**模組化拆分**（例如將單一大腳本拆入 `js/components/` 或 `gas/` 新模組），或**新增頂層核心資料夾**時，必須執行同步指令：
  ```bash
  py .agents/skills/project_structure_keeper/scripts/keeper.py sync
  ```

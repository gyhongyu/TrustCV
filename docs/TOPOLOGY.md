# 🗺️ 專案實體拓撲架構與模組職責活地圖 (TOPOLOGY.md)

> 📌 **版本**: v1.0.0 (規範化定版) | **維護方式**: 粗粒度增量更新 (僅在重大模組拆分時更新)  
> ⚠️ **所有 AI 代理人注意**: 嚴禁在未登錄路徑亂建檔案；查找業務規格與 UI 原型請依循本表尋址。

---

## 🏢 核心模組職責地圖 (Module Responsibility Map)

| 物理路徑 | 模組名稱 | 職責與包含內容 | 代理人調閱時機 |
| :--- | :--- | :--- | :--- |
| `specs/` | **業務規格與法典庫** | 包含 `PRD.md`、`00_architecture/` 至 `04_templates/`，以及 `SPEC-001` (雇主與候選人雙向拷問評分管線)，涵蓋防繞道法務、六大管線 SOP 與 JSON Schema 資料模型 | 凡涉及業務邏輯、審核標準、API 欄位、報價或雙向考問評分機制時必讀 |
| `assets/` | **視覺設計與原型庫** | 包含 `BRAND_GUIDE.md`、`prototypes/trustcv_pwa_ui.html` (4屏擬真展示)、`svg/` (官方向量圖資)、`icons/` | 凡進行 PWA 頁面開發、UI 樣式編寫、圖標設計時必讀，嚴禁私造配色 |
| `docs/` | **研發 DMC 知識庫與法務** | `STATE.md` (架構真理 ≤200行)、`ACTIVE_LOG.md` (只追加日誌)、`TOPOLOGY.md` (活地圖)、`how-to/` (OAuth 設定等)、`legal/` (隱私條款 SSOT) | 了解專案狀態、排查踩坑、法務更新或配置查驗時必讀 |
| `.agents/skills/` | **專案常駐守護與輔助技能** | `project_structure_keeper/` (專案結構守門)、`agent_code_map/` (代碼語法拓撲與調用鏈穿透) | 掌握專案全景、查找呼叫者與模組分工時喚醒 |
| `.agent_profiles/` | **多模式規則倉庫** | `production/` (生產只查不改) 與 `development/` (開發重構) | 模式切換與權限隔離 |
| `js/` | **前端核心邏輯與組件** | `app.js` (總裝)、`auth.js` (OAuth)、`drive.js` (Drive API)、`store.js`、`i18n.js`、`components/` (vault, header 等) | 前端邏輯、狀態管理與雲端硬碟功能開發時調用 |
| `css/` | **全域樣式與主題** | `style.css` (Tailwind 自訂指令與全域色彩變更) | 前端視覺樣式微調時調用 |
| `tests/` | **測試套件** | 端到端與模組單元測試檔案 | 跑自動化測試時調用 |
| `gas/` | **Google Apps Script 網關** | `Code.js` (路由)、`Database.js` (Sheets CRUD)、`DriveService.js` (Drive 隔離庫)、`JobService.js` (脫敏業務)、`Config.js` | 後端資料持久化與雲端儲存 |
| `worker/` | **打工仔 LLM 與上游同步** | `resume_parser.py` (履歷提取)、`dossier_translator.py` (在地化轉譯)、`sync_upstream_jobs.py` (上游同步)、`config.py` | 異步運算與打工仔調度 |
| 根目錄前端 | **GitHub Pages PWA 入口** | `index.html` (SPA 入口)、`privacy.html` (Google 品牌審核雙語隱私頁面)、`manifest.json`、`sw.js` | 前端 PWA 發布與認證入口 |
| `tools/` | **輔助開發工具** | 本機開發輔助腳本與轉換工具 | 本地除錯與數據預處理時調用 |

---

## 🚫 結構守門鐵律 (Structure Guardrails)
1. **嚴禁隨意在根目錄生成代碼檔案**：前端代碼放根目錄或 `js/`、`css/`；後端放 `gas/`；腳本放 `worker/` 或 `scripts/`。
2. **單一超大代碼拆分門禁**：當單一模組代碼膨脹進行模組化拆分時，必須同步更新本文檔與 `docs/ACTIVE_LOG.md`。

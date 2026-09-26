# 🗺️ 專案實體拓撲架構與模組職責活地圖 (TOPOLOGY.md)

> 📌 **版本**: v1.0.0 (規範化定版) | **維護方式**: 粗粒度增量更新 (僅在重大模組拆分時更新)  
> ⚠️ **所有 AI 代理人注意**: 嚴禁在未登錄路徑亂建檔案；查找業務規格與 UI 原型請依循本表尋址。

---

## 🏢 核心模組職責地圖 (Module Responsibility Map)

| 物理路徑 | 模組名稱 | 職責與包含內容 | 代理人調閱時機 |
| :--- | :--- | :--- | :--- |
| `specs/` | **業務規格與法典庫** | 包含 `PRD.md`、`00_architecture/` 至 `04_templates/`，涵蓋防繞道法務、六大管線 SOP 與 JSON Schema 資料模型 | 凡涉及業務邏輯、審核標準、API 欄位、報價或佣金時必讀 |
| `assets/` | **視覺設計與原型庫** | 包含 `BRAND_GUIDE.md`、`prototypes/trustcv_pwa_ui.html` (4屏擬真展示)、`svg/` (官方向量圖資) | 凡進行 PWA 頁面開發、UI 樣式編寫、圖標設計時必讀，嚴禁私造配色 |
| `docs/` | **研發 DMC 知識庫** | `STATE.md` (架構真理 ≤200行)、`ACTIVE_LOG.md` (只追加研發日誌)、`TOPOLOGY.md` (拓撲活地圖) | 了解專案狀態、排查踩坑、架構決策時必讀 |
| `.agents/skills/` | **專案常駐守護技能** | `project_structure_keeper/` (專案現場結構導航與維護) | 掌握專案全景與模組分工時喚醒 |
| `.agent_profiles/` | **多模式規則倉庫** | `production/` (生產只查不改) 與 `development/` (開發重構) | 模式切換與權限隔離 |
| 根目錄前端 | **GitHub Pages PWA 應用** | `index.html` (正式 SPA 入口)、`manifest.json`、`sw.js`、`css/`、`js/` | 前端開發與上線發布 |
| `gas/` (預留) | **Google Apps Script 網關** | 後端 API 路由器、Google Sheets 4 張表 CRUD、Drive 檔案隔離庫 | 後端資料持久化與跨域介接 |
| `worker/` (預留) | **打工仔 LLM 與上游同步** | 履歷結構化提取、台灣在地化術語轉譯、勝拓 (invic) 職缺自動入庫 | 異步運算與打工仔調度 |

---

## 🚫 結構守門鐵律 (Structure Guardrails)
1. **嚴禁隨意在根目錄生成代碼檔案**：前端代碼放根目錄或 `js/`、`css/`；後端放 `gas/`；腳本放 `worker/` 或 `scripts/`。
2. **單一超大代碼拆分門禁**：當單一模組代碼膨脹進行模組化拆分時，必須同步更新本文檔與 `docs/ACTIVE_LOG.md`。

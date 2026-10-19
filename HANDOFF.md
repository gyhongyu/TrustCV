# 📋 專案接棒交接文檔 (HANDOFF.md)

> 📌 **唯一任務指示**：新代理人進場請直接閱讀本文件。嚴禁向本文件追加歷史或複製專案規則，本文件一律採【原子覆寫】。

---

## ⚓ 1. 基準代碼錨點 (Git Ground Truth)
- **工作區狀態**: 🟢 工作區乾淨 (Clean Workspace)
- **當前錨點 Commit**: `287e20b` - feat(proposal): implement pure dual-language presentation deck with native language toggle
- **架構溯源**: 執行 `git log -n 3` 掌握最新脈絡；**嚴禁查閱舊對話日誌浪費 Token**。

---

## 🗺️ 2. 當前工作代碼地圖 (Active Code Surface)
> 🚨 **【零盲掃指令】**：本次任務的操作嚴格限制在以下檔案，嚴禁全庫遞迴掃描目錄！

| 角色 | 檔案絕對/相對路徑 | 職責與操作重點 |
| :--- | :--- | :--- |
| **母法規則庫** | [.agents/rules/i18n_pure_language_invariant.md](file:///e:/Projects/TrustCV/.agents/rules/i18n_pure_language_invariant.md) | 最新升級雙軌規範：微觀 UI 走 `i18n.js`，宏觀長篇富文本走 HTML 雙語容器 (`#content-zh` / `#content-en`) |
| **倡議簡報頁** | [proposal.html](file:///e:/Projects/TrustCV/proposal.html) | 已全面重構為純淨雙語容器架構，10 頁繁中 / 10 頁純英，Header 具備原生 `🌐 EN / 中文` 膠囊與雙模切換 |
| **隱私權政策頁** | [privacy.html](file:///e:/Projects/TrustCV/privacy.html) | 已重構為標準雙語架構，移除內聯 CSS，改引 `css/style.css`，接入官方 Header 與雙模切換 |
| **首頁與組件真理源** | [index.html](file:///e:/Projects/TrustCV/index.html) & [header.js](file:///e:/Projects/TrustCV/js/components/header.js) | 全站唯一官方 Header 結構、品牌 Logo 與純向量 SVG 日月切換基準 |
| **官方核驗標章體系** | [badges_preview.html](file:///e:/Projects/TrustCV/badges_preview.html) | 官方 0~3 勾盾牌徽章、純向量 SVG 與純淨多語系切換參考樣板 |
| **多語系字典中樞** | [js/i18n.js](file:///e:/Projects/TrustCV/js/i18n.js) | 全站繁中/英文字典中心（微觀 UI 專用） |
| **全域樣式表** | [css/style.css](file:///e:/Projects/TrustCV/css/style.css) | 官方唯一的 `.light-mode` 雙模色彩映射表與 Tailwind 顏色 Token |

---

## 🎯 3. 當前核心任務與已知卡點 (Current Objective & Blocker)
- **核心目標**：
  1. `i18n_pure_language_invariant.md` 規則庫已明確定義微觀與宏觀的分水嶺。
  2. `proposal.html` 與 `privacy.html` 均完美實踐雙語容器架構，零中英混雜，零字典污染。
  3. 全站雙模主題（Dark / Light Mode）切換均由純向量 SVG 驅動，無任何 Emoji。
- **已知卡點 (Blocker)**：None。

---

## 🛠️ 4. 下一步執行指令 (Next Immediate Action)
新代理人進場請依使用者後續業務指示推進：
1. 任何後續富文本頁面開發，嚴格遵循雙語容器架構（`#content-zh` / `#content-en`），嚴禁中英夾雜。
2. 任何 Git 提交前，先執行 `py C:\Users\9892\.gemini\config\skills\agent_rules_architect\scripts\linter.py` 確保規則門禁 PASS。
3. 待使用者授權後，調用 `git_master` 進行「推送倉庫」。

---

## ✅ 5. 驗收標準 (Acceptance Criteria)
- [x] 規則庫已更新至雙軌標準架構，Linter 審計 100% PASS。
- [x] `proposal.html` Header 包含官方標準 `🌐 EN / 中文` 語言切換膠囊。
- [x] `proposal.html` 包含完整 10 頁純繁中與 10 頁出版級純英文，並支援中英文互動試算器。
- [x] 支援 URL `#en` / `#zh` 錨點及 `localStorage` 記憶。
- [x] 本地代碼已由 `git_master` 完成提交封存（Commit: `287e20b`）。

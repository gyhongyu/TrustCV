# 📋 專案接棒交接文檔 (HANDOFF.md)

> 📌 **唯一任務指示**：新代理人進場請直接閱讀本文件。嚴禁向本文件追加歷史或複製專案規則，本文件一律採【原子覆寫】。

---

## ⚓ 1. 基準代碼錨點 (Git Ground Truth)
- **工作區狀態**: 🟢 工作區乾淨 (Clean Workspace)
- **當前錨點 Commit**: `cc187ec` - style: align privacy and proposal pages with official native UI standards
- **架構溯源**: 執行 `git log -n 3` 掌握最新脈絡；**嚴禁查閱舊對話日誌浪費 Token**。

---

## 🗺️ 2. 當前工作代碼地圖 (Active Code Surface)
> 🚨 **【零盲掃指令】**：本次任務的操作嚴格限制在以下檔案，嚴禁全庫遞迴掃描目錄！

| 角色 | 檔案絕對/相對路徑 | 職責與操作重點 |
| :--- | :--- | :--- |
| **首頁與組件真理源** | [index.html](file:///e:/Projects/TrustCV/index.html) & [header.js](file:///e:/Projects/TrustCV/js/components/header.js) | 全站唯一官方 Header 結構、品牌 Logo 與純向量 SVG 日月切換基準 |
| **官方核驗標章體系** | [badges_preview.html](file:///e:/Projects/TrustCV/badges_preview.html) | 官方 0~3 勾盾牌徽章、純向量 SVG 與純淨多語系切換參考樣板 |
| **隱私權政策頁** | [privacy.html](file:///e:/Projects/TrustCV/privacy.html) | 已徹底肅清歷史債務：移除內聯 CSS，改引 `css/style.css`，接入官方三階勾標 Header 與雙模切換 |
| **倡議簡報頁** | [proposal.html](file:///e:/Projects/TrustCV/proposal.html) | 頂部 Header Logo、文字排版與主題切換已 100% 對齊官方標準，深淺雙模動態切換自適應完成 |
| **多語系字典中樞** | [js/i18n.js](file:///e:/Projects/TrustCV/js/i18n.js) | 全站繁中/英文字典中心（純繁中 / 純英文，嚴禁中英夾雜） |
| **全域樣式表** | [css/style.css](file:///e:/Projects/TrustCV/css/style.css) | 官方唯一的 `.light-mode` 雙模色彩映射表與 Tailwind 顏色 Token |

---

## 🎯 3. 當前核心任務與已知卡點 (Current Objective & Blocker)
- **核心目標**：全站頁面（[index.html](file:///e:/Projects/TrustCV/index.html)、[badges_preview.html](file:///e:/Projects/TrustCV/badges_preview.html)、[privacy.html](file:///e:/Projects/TrustCV/privacy.html)、[proposal.html](file:///e:/Projects/TrustCV/proposal.html)）UI 體系、官方三階核驗標章與深淺主題雙模切換已完全標準化對齊。
- **已知卡點 (Blocker)**：None。

---

## 🛠️ 4. 下一步執行指令 (Next Immediate Action)
新代理人進場請依使用者後續業務需求推進：
1. 若需新增或調整多語系內容，一律擴充 [js/i18n.js](file:///e:/Projects/TrustCV/js/i18n.js)，嚴禁在 HTML 硬編碼中英夾雜文字。
2. 任何 Git 提交前，先執行 `py C:\Users\9892\.gemini\config\skills\agent_rules_architect\scripts\linter.py` 確保規則合規。
3. 待使用者授權後，調用 `git_master` 進行「推送倉庫」。

---

## ✅ 5. 驗收標準 (Acceptance Criteria)
- [x] `privacy.html` 與 `proposal.html` Header 與全站官方標準 100% 一致。
- [x] 全站無任何自製樣式衝突，已全面復用 `css/style.css` 與 Tailwind 色彩 Token。
- [x] 雙模切換使用純向量 SVG（太陽/月牙），不使用 Emoji 表情。
- [x] 規則審計通過率 100% PASS。
- [x] 本地代碼已由 `git_master` 完成提交封存。

# 📋 專案接棒交接文檔 (HANDOFF.md)

> 📌 **唯一任務指示**：新代理人進場請直接閱讀本文件。嚴禁向本文件追加歷史或複製專案規則，本文件一律採【原子覆寫】。

---

## ⚓ 1. 基準代碼錨點 (Git Ground Truth)
- **工作區狀態**: 🟢 工作區乾淨 (Clean Workspace)
- **當前錨點 Commit**: `3fec509` - feat(badges): standardize triple-check verification system and pure i18n architecture
- **架構溯源**: 執行 `git log -n 3` 掌握最新脈絡；**嚴禁查閱舊對話日誌浪費 Token**。

---

## 🗺️ 2. 當前工作代碼地圖 (Active Code Surface)
> 🚨 **【零盲掃指令】**：接棒任務的操作嚴格限制在以下檔案，嚴禁全庫遞迴盲目掃描！

| 角色 | 檔案絕對/相對路徑 | 職責與操作重點 |
| :--- | :--- | :--- |
| **官方 SSOT 樣板** | [index.html](file:///e:/Projects/TrustCV/index.html) & [header.js](file:///e:/Projects/TrustCV/js/components/header.js) | 全站唯一官方 Header 結構、品牌 Logo 與向量 SVG 日月切換基準 |
| **已標準化完成樣板** | [badges_preview.html](file:///e:/Projects/TrustCV/badges_preview.html) | 參考此檔案的 Header、純向量 SVG 日月切換與 `i18n.js` 字典雙模切換做法 |
| **多語系字典中樞** | [js/i18n.js](file:///e:/Projects/TrustCV/js/i18n.js) | 所有 UI 與官方內容之多語系字典對照（純繁中 / 純英文，嚴禁中英夾雜） |
| **全域樣式表** | [css/style.css](file:///e:/Projects/TrustCV/css/style.css) | 官方唯一的 `.light-mode` 雙模色彩映射表與 Tailwind 顏色 Token |
| **待整肅目標 1** | [privacy.html](file:///e:/Projects/TrustCV/privacy.html) | **肅清歷史債務**：移除內聯 `<style>`，改引 `css/style.css`，替換為官方三勾 Logo，接入標準 Header 與雙模切換 |
| **待整肅目標 2** | [proposal.html](file:///e:/Projects/TrustCV/proposal.html) | **對齊官方規範**：保留簡報必要控制項，但 Header Logo、色彩 Token 與日月切換必須 100% 復用官方標準 |
| **專案鋼鐵規則庫** | [.agents/rules/](file:///e:/Projects/TrustCV/.agents/rules) | 包含 `frontend_native_ui_invariant.md`、`i18n_pure_language_invariant.md`、`verification_badges_spec.md` |

---

## 🎯 3. 當前核心任務與已知卡點 (Current Objective & Blocker)
- **核心目標**：
  1. 將 [privacy.html](file:///e:/Projects/TrustCV/privacy.html) 徹底改造成 TrustCV 唯一官方樣式：
     - 移除 20+ 行內聯 `<style>`，改為 `<link rel="stylesheet" href="./css/style.css">`。
     - 替換非官方的盾牌 Logo，改為官方三階核驗勾標 SVG。
     - 頂部導航 100% 復用官方 Header（品牌字 `Trust`<span class="text-emerald-500 font-black">CV</span> + `BY TEAFORIA` + 膠囊語言切換 + 純向量 SVG 日月切換）。
     - 支援 `.light-mode` 雙模切換（目前硬寫 `class="dark"` 無法切換白天模式）。
     - 繁中與英文內容遵循 [i18n_pure_language_invariant.md](file:///e:/Projects/TrustCV/.agents/rules/i18n_pure_language_invariant.md)，嚴禁中英夾雜。
  2. 將 [proposal.html](file:///e:/Projects/TrustCV/proposal.html) 對齊官方樣式：
     - 頂部 Header 的品牌 Logo、文字排版與主題切換按鈕，100% 對齊官方組件。
- **已知卡點 (Blocker)**：None。規則與參考範本已完全就緒。

---

## 🛠️ 4. 下一步執行指令 (Next Immediate Action)
新代理人進場請直接依序執行以下步驟：
1. **重構 [privacy.html](file:///e:/Projects/TrustCV/privacy.html)**：
   - 參照 [badges_preview.html](file:///e:/Projects/TrustCV/badges_preview.html) 的 Header 與主題切換實作。
   - 清除內聯自製 CSS，完全接入 `css/style.css`。
2. **校準 [proposal.html](file:///e:/Projects/TrustCV/proposal.html)**：
   - 校準頂部 Header 的 SVG 日月圖標與品牌標識。
3. **規則門禁驗證**：
   - 執行 `py C:\Users\9892\.gemini\config\skills\agent_rules_architect\scripts\linter.py` 確保規則合規。
4. **提交代碼**：
   - 使用 `git_master` 進行本地交付：`py %USERPROFILE%\.gemini\config\skills\git_master\scripts\git_master.py commit --msg "style: align privacy and proposal pages with official native UI standards"`。

---

## ✅ 5. 驗收標準 (Acceptance Criteria)
- [ ] `privacy.html` 與 `proposal.html` 的 Header 視覺與 [index.html](file:///e:/Projects/TrustCV/index.html) 100% 一致。
- [ ] 兩頁面均原生支援 `.light-mode` 白主題切換，嚴禁使用 Emoji 表情作為切換圖標。
- [ ] `privacy.html` 無任何內聯 `<style>`，完全復用 `css/style.css`。
- [ ] 全站無任何中英混用，符合 `i18n_pure_language_invariant.md`。
- [ ] 執行 `agent_rules_architect` 的 Linter 靜態審計為 100% PASS。

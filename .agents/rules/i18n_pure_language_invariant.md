---
name: i18n_pure_language_invariant
description: 限制全系統 UI 與官方內容嚴禁中英混用，強制使用字典檔 (i18n) 快速擴充多語系
trigger: model_decision
globs: "**/*.{html,js}"
---

# 🌐 純淨多語系與字典檔隔離規範 (i18n Pure Language Invariant)

<RULE[i18n_pure_language_invariant]>
1. ⛔【嚴禁行為 (Anti-Pattern)】：
   - 嚴禁在 UI 界面、系統標題、按鈕、官方說明與徽章規格中中英混用或括號夾雜（如「信任階梯 · Trust Ladder」、「未驗證 (Manual Entry)」）。
   - 嚴禁在頁面 HTML/JS 中硬編碼未抽取的靜態文案，嚴禁繞過字典檔自造多語系切換。
2. ✅【標準做法 (Standard Practice)】：
   - 中文即 100% 純繁體中文，英文即 100% 純英文（用戶動態輸入之自定義內容除外，由輸出端翻譯處理）。
   - 所有系統文本一律集中至字典檔 (js/i18n.js 或 JSON)，新增語言僅需擴充字典 Key-Value，全站切換立即純淨生效。
</RULE[i18n_pure_language_invariant]>

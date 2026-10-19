---
name: i18n_pure_language_invariant
description: 限制全系統 UI 與官方內容嚴禁中英混用，區分微觀字典與宏觀雙語容器
trigger: model_decision
globs: "**/*.{html,js}"
---

# 🌐 純淨多語系分流規範 (i18n Pure Language Invariant)

<RULE[i18n_pure_language_invariant]>
1. ⛔【嚴禁行為 (Anti-Pattern)】：
   - 嚴禁中英混用或括號夾雜（如「信任階梯 · Trust Ladder」、「未驗證 (Manual Entry)」）。
   - 嚴禁將長篇商業提案或法律富文本硬塞進 JS 字典，造成字典檔污染與效能退化。
2. ✅【雙軌標準做法 (Standard Practice)】：
   - 中文即 100% 純繁中，英文即 100% 純英文。
   - 微觀 UI 組件（按鈕、選單、標籤）強制統一走 js/i18n.js 字典檔。
   - 宏觀長篇富文本（privacy.html、proposal.html）強制採用 HTML 雙語容器架構（#content-zh / #content-en）原生切換。
</RULE[i18n_pure_language_invariant]>

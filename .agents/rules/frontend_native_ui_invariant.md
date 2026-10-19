---
name: frontend_native_ui_invariant
description: 限制所有前端與HTML開發必須完全復用本站原生Tailwind配置與設計體系，嚴禁自行發明樣式
trigger: model_decision
globs: "**/*.{html,js,css}"
---

# 🎨 前端原生設計體系與 Header 鋼鐵規範 (Frontend Native UI Invariant)

<RULE[frontend_native_ui_invariant]>
1. ⛔【嚴禁行為 (Anti-Pattern)】：
   - 嚴禁自創 CSS 樣式、自造 Header/Logo 結構、擅改副標，嚴禁使用 Emoji (☀️/🌙) 替代日夜向量圖標。
   - 嚴禁在語意明確的圖標按鈕（如分頁翻頁、全螢幕、下載、關閉、切換主題）上強加贅述文字或 sr-only 隱藏文字（如「◀ Prev」、「下一頁 ▶」），直接使用純向量圖標 + 簡潔原生 `title` 屬性即可。
2. ✅【標準做法 (Standard Practice)】：
   - 100% 復用本站 index.html 之 Tailwind 配置、brand 色彩 Token 與標準 Header 結構。
   - 主題切換強制使用官方純向量 SVG（白天太陽/夜晚月牙），以 .light-mode 與官方界面完美對齊。
   - 工具與導航按鈕採純圖標設計（如 `w-10 h-10 rounded-full` 或 `p-2 rounded-xl`），原生 `title` 提示即可，零多餘文字。
</RULE[frontend_native_ui_invariant]>

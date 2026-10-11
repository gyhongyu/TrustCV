---
name: frontend_native_ui_invariant
description: 限制所有前端與HTML開發必須完全復用本站原生Tailwind配置與設計體系，嚴禁自行發明樣式
trigger: model_decision
globs: "**/*.{html,js,css}"
---

<RULE[frontend_native_ui_invariant]>
1. 嚴禁自立門戶發明自造 CSS 樣式、自創類名或脫離母站視覺之獨立外掛設計系統。
2. 凡在本專案編寫任何 HTML 或前端頁面，必須 100% 復用本站 `index.html` 之 Tailwind 配置、`brand` 顏色 Token 與組件體系。
3. 頁面必須原生支援深淺色雙模（Light/Dark mode）自適應，視覺與交互 100% 對齊 cv.teaforia.in 官方界面。
</RULE[frontend_native_ui_invariant]>

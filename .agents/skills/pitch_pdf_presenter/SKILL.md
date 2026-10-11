---
name: pitch_pdf_presenter
description: 專案專屬「高階商業提案出版級 PDF 合成打包、章節速查與原生 Web 彈窗下載總管」技能 (TrustCV Pitch PDF Bundler & Interactive Download Presenter)。專門用於將專案提案 Markdown 自動轉譯之章節 PDF 合成為高管審查級單一大全集 (26 頁向量 PDF)，並在網頁 PPT 或入口頁面注入原生 TrustCV 品牌風格的「一鍵下載完整提案」按鈕與沉浸式深淺色雙模彈窗 (Modal)。當需要合成提案 PDF、生成下載按鈕、部署提案下載彈窗、更新提案章節或需要導出 TrustCV 正式 Pitch 文檔時自動觸發。
---

# 📑 TrustCV 提案出版級 PDF 打包與互動下載總管 (pitch_pdf_presenter)

本技能為 **TrustCV 專案原生專屬技能 (Project-Scoped Skill)**，專門固化「高階商業提案 ➔ 出版級分項向量 PDF ➔ 合成為 26 頁高管大全集 ➔ 前端深淺色雙模下載彈窗」的全鏈路經驗與工程規範。

---

## 🌟 核心能力與不變量 (Core Invariants)

1. **📚 自動章節排序拼裝 (Strict Pitch Hierarchy)**：
   - 使用 `bundle_pitch_pdf.py`，遵循正式商業提案邏輯順序（`FRAMEWORK` ➔ `00` 執行摘要 ➔ `01` 市場痛點 ➔ `02` 雙向中樞 ➔ `03` 商業模式 ➔ `04` 四方股權 ➔ `05` 擴展藍圖 ➔ `06` 投資訴求 ➔ `07` 逐頁講稿）。
   - 保留全部內嵌向量圖形（Mermaid 架構圖、商業模型飛輪），不光柵化、文字可選取。
   - 合成後自動歸檔至專案標準靜態目錄：`assets/pdf/TrustCV_Taiwan_India_Compute_Pitch_Full.pdf`。

2. **🎴 原生 TrustCV 品牌下載彈窗 (Native Modal Component)**：
   - **完全遵循 [`frontend_native_ui_invariant`](file:///E:/Projects/TrustCV/.agents/rules/frontend_native_ui_invariant.md)**：100% 復用母站 Tailwind `brand` 色彩 Token（`brand-mint` `#3DF5A7`, `brand-card`, `brand-surface`）。
   - **深淺色雙模自適應 (Light/Dark Mode Perfection)**：
     - **深色模式**：黑曜石底 `bg-brand-card`、墨綠柔光邊框與薄荷綠圖示。
     - **明亮模式**：自動白瓷化柔綠漸層 `linear-gradient`、墨黑高對比文字 `#0F172A`、翡翠晶瑩徽章與舒適的半透明遮罩（`rgba(15, 23, 42, 0.45)`）。
   - **雙層下載架構**：
     - **頂部 Hero 卡片**：長官與戰略投資人首選（一鍵下載 26 頁完整全集）。
     - **下方 2 欄網格**：分項專題論證單篇速查（`00~07` 獨立下載）。

---

## 🚀 常用指令速查 (CLI Usage)

### 1. 一鍵自動合併全套提案為單一出版級 PDF
```powershell
py .agents\skills\pitch_pdf_presenter\scripts\bundle_pitch_pdf.py
```
* 自訂來源與輸出路徑：
```powershell
py .agents\skills\pitch_pdf_presenter\scripts\bundle_pitch_pdf.py -s "proposals/2026_taiwan_india_compute_pitch" -o "assets/pdf/TrustCV_Taiwan_India_Compute_Pitch_Full.pdf"
```

### 2. 獲取前端彈窗 HTML 模板
組件模板存放於：
```text
.agents/skills/pitch_pdf_presenter/templates/modal_component.html
```

---

## 📁 檔案結構

- `SKILL.md`：本技能手冊與治理規範。
- `scripts/bundle_pitch_pdf.py`：基於 PyMuPDF 的非破壞性向量 PDF 自動排序合併引擎。
- `templates/modal_component.html`：開箱即用的原生 TrustCV 品牌下載按鈕與彈窗組件結構。

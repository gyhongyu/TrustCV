# 📋 專案工作交接文檔 (HANDOFF.md)

---

## 0. 🧠 智腦不二過記憶突觸 (Brain Synapse & Anti-Failure DNA)
- **前次會話 ID**: `18700573-b279-4701-94d3-ff3b66df9cdd`
- **當前會話 ID**: `28a45471-a455-44e8-aadf-c377538afa5a`
- **血淚紅線與不可破天條 (Hard Invariants)**:
  1. ⛔ **未授權絕對禁止 Git 推送**：除非使用者在對話中明確打出「git push」或「推送遠端」，否則任何代理人嚴禁發起遠端推送！
  2. ⛔ **嚴禁終端內嵌代碼落盤**：禁止使用 `py -c`、`node -e` 或 `echo` 拼接字串寫檔案，必須使用專屬檔案編輯工具。
  3. ⛔ **全域嚴禁 LaTeX 語法**：所有文檔、Dossier 與 UI 一律採用語意 HTML/Markdown/JSON。
  4. ⛔ **嚴格禁止印地語與簡體中文**：僅支援英文 (`en`) 與繁體中文 (`zh-TW`)。示範文字、職缺與履歷嚴禁中英括弧混用，一律依語系乾淨分流；台灣繁中一律用「履歷」，嚴禁用「簡歷」。
  5. 🔒 **二進位檔案隔離鐵律**：候選人真實履歷、身分證件與上游原始 JD 全數存儲於 Google Drive，嚴禁 commit 進入 GitHub 倉庫污染 Git 歷史！
  6. 🖥️ **跨端響應式與主題鐵律**：
     - PC 大螢幕以 `max-w-7xl` 展開為雙欄 Dashboard，頂部展開導航選單；行動端維持底部 Tab。
     - 明亮模式採用白底微型標、白瓷卡片 `#FFFFFF`、灰白底板 `#F8FAFC`、深字 `#0F172A`；暗黑模式維持曜石黑底 `#080C0E`。
  7. 📱 **PWA 與導航欄防禦鐵律**：
     - 頂部導航欄按鈕強制 `whitespace-nowrap shrink-0`，打死不折行。
     - 品牌副標題中英版一律統一為 `BY TEAFORIA`，徹底杜絕撐爆擠壓。
     - 語言切換為單鍵 Toggle（`🌐 EN` / `🌐 中文`），節省 40px 空間。
     - 底部安裝浮卡按叉後由 `localStorage` 永久記憶防打擾；安裝後或 standalone 模式自動隱藏。

---

## 1. 🗺️ 專案物理架構與模組地圖 (Project Topology & Modules)
詳細活地圖請查閱：[`docs/TOPOLOGY.md`](file:///docs/TOPOLOGY.md)
- 線上正式站點: `https://cv.teaforia.in`
- GitHub 遠端倉庫: `https://github.com/gyhongyu/TrustCV.git` (分支 `master`)
- 本地開發預覽: `http://127.0.0.1:27891` (後台運行中)
- 當前 PWA 快取版本: `trustcv-cache-v1.2.0` (於 `sw.js` 維護)
- 業務規格法典庫: `specs/` (包含主幹六階段管線 `SPEC-000` 與全新雙向拷問管線 `SPEC-001`)

---

## 2. 系統現況與已固化基線 (System Baseline)
- [x] **階段 0：視覺資產規格固化** 完成（向量 SVG、PNG 圖標 16~512、favicon.ico、og-image.png 1200x630）。
- [x] **階段 1：規格契約與 Mock 資料真值校準** 完成（100% 通過 JSON Schema 驗證）。
- [x] **階段 2：前端 PWA 核心骨架與響應式** 完成。
- [x] **階段 2.5：PC 寬螢幕適配與深淺色主題解耦** 完成。
- [x] **GitHub Pages 發布與 Cloudflare 域名綁定** 完成（`https://cv.teaforia.in` SSL 綠鎖生效）。
- [x] **前端重大翻車 Bug 根治閉環**（Splash Screen 防卡屏、六階段雙語化、PWA 雙軌安裝按鈕與底部浮卡、導航欄瘦身、台灣在地化履歷 Meta v1.2.0）。
- [x] **Google OAuth 2.0 與個人雲端保險庫 (Vault)** 整合完成，`privacy.html` 與法務隱私條款落地。
- [x] **重大架構規格追加與固化**：
  - 《雇主與候選人雙向拷問評分機制管線》正式收納為 [`specs/01_pipeline_specs/SPEC-001_bilateral_interrogation_pipeline.md`](file:///specs/01_pipeline_specs/SPEC-001_bilateral_interrogation_pipeline.md)。
  - 在 [`IMPLEMENTATION_GUIDE.md`](file:///IMPLEMENTATION_GUIDE.md) 中已新增「階段 4.5：雙向拷問評分機制實施」任務路徑。
  - 全域交接技能 `handover_generator` 升級支援「接棒暖機模式 (Quick Onboarding Mode)」，新代理人輸入「快速了解專案」或「建立專案知識」自動觸發雙門禁。

---

## 3. 下一棒核心接棒任務 (Immediate Action Items)

> 💡 **進度指示**：前端 PWA、個人保險庫與規範體系皆已穩定封箱。
> 接棒代理人若要推進下一階段，依據 [`IMPLEMENTATION_GUIDE.md`](file:///IMPLEMENTATION_GUIDE.md) 應正式推進：

### 🎯 主線任務：階段 3 —— Google Apps Script (GAS) 後端網關與雲端結構落地
1. **GAS 後端網關 (`gas/`) 實作**：
   - 建立 `Universal_GAS_Gateway.gs`，接管求職投遞 API (`doPost`) 與職缺檢索 API (`doGet`)。
   - 串接 Google Sheets 作為中央結構化資料庫（`Jobs`, `Candidates`, `Applications` 表）。
2. **Google Drive 二進位檔案隔離**：
   - 實作候選人履歷 (PDF/DOCX) 自動上傳至 Google Drive 專屬隔離資料夾（1-Candidate-1-Folder），落實非結構化二進位檔案 100% 不進 Git 倉庫之鐵律。
3. **前端 API 模式切換**：
   - 將 `js/api.js` 從目前 Mock 模式平滑銜接至 GAS 雲端真實端點。

### 🔮 支線任務預備：階段 4.5 —— 雙向拷問評分機制 (SPEC-001)
- 依據 `IMPLEMENTATION_GUIDE.md` 階段 4.5 規劃 `worker/interrogation_agent.py` 提示詞與 Sheets 表結構。

---

## 4. 驗收啟動指令與導航門禁 (Pre-Flight Navigation & Verification Step)
請新進場代理人執行以下兩大門禁建立全域心智模型：
1. 執行 `py .agents\skills\project_structure_keeper\scripts\keeper.py audit` 掌握目錄職責邊界與文件規範。
2. 執行 `py -X utf8 .agents\skills\agent_code_map\scripts\map.py` 掌握全專案代碼語法拓撲與函式位置。

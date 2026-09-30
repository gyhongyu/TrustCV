# 📋 專案工作交接文檔 (HANDOFF.md)

---

## 0. 🧠 智腦不二過記憶突觸 (Brain Synapse & Anti-Failure DNA)
- **前次會話 ID**: `35d88c0a-f880-424c-8028-8e803c37b1a6`
- **當前會話 ID**: `10ec2527-ad12-4785-ad26-b483c4b9357e`
- **血淚紅線與不可破天條 (Hard Invariants)**:
  1. ⛔ **未授權絕對禁止 Git 推送**：除非使用者在對話中明確下達「git push」或「推送遠端」，否則任何代理人嚴禁發起遠端推送！
  2. ⛔ **嚴禁終端內嵌代碼落盤**：禁止使用 `py -c`、`node -e` 或 `echo` 拼接字串寫檔案，必須使用專屬檔案編輯工具。
  3. ⛔ **全域嚴禁 LaTeX 語法**：所有文檔、Dossier 與 UI 一律採用語意 HTML/Markdown/JSON。
  4. ⛔ **嚴格禁止印地語與簡體中文**：僅支援英文 (`en`) 與繁體中文 (`zh-TW`)。示範文字、職缺與履歷嚴禁中英混用，台灣繁中一律用「履歷」，嚴禁用「簡歷」。
  5. 🔒 **個人網盤 vs 官方審核網盤物理命名隔離鐵律 (ADR 006)**：
     - **個人網盤（用戶/管理員個人 Google Drive）**：目錄名嚴格固定為 **`📁 TrustCV/`**（內含 `Photos/`, `Certificates/`, `Resumes/`, `Exports/` 與 `master_profile.json`）。用戶享有 100% 增刪、修改與公開/隱藏自主權。
     - **官方審核網盤（TrustCV 官方審核總庫）**：目錄名嚴格固定為 **`📁 TrustCV_Official_Vault/`**。僅在用戶應聘投遞時，透過 `Files.copy` 秒級複製「公開」原件與快照，採「一夾一案 (`Applications/APP-YYYY-.../`)」隔離，保障審核公證性。**兩者絕不可重名混淆**！
  6. 🛡️ **動態三級角色零硬編碼鐵律 (Zero-Hardcode RBAC)**：
     - 嚴禁在前端 JS 寫死 `if (email === '...')`！
     - 所有權限一律由 Google Sheets `System_Roles` 表動態判定（`ADMIN` / `PARTNER` / `CANDIDATE`）。
  7. 🚪 **未登入門禁鐵律 (Guest Gate)**：
     - 未登入訪客（`GUEST`）僅允許瀏覽職缺列表與詳情；「個人履歷」、「安全保險庫」與「投遞進度」嚴格攔截並展示登入引導卡片，**嚴禁以前端本機假資料充數**！

---

## 1. 🗺️ 專案物理架構與模組地圖 (Project Topology & Modules)
詳細活地圖請查閱：[`docs/TOPOLOGY.md`](file:///docs/TOPOLOGY.md)
- 線上正式站點: `https://cv.teaforia.in`
- 雙語隱私權審核頁面: `https://cv.teaforia.in/privacy.html`
- 本地開發預覽: `http://localhost:5188` (對齊 Google OAuth Authorized Origin)
- 當前 PWA 快取版本: `trustcv-cache-v1.3.0` (於 `sw.js` 維護)
- 宏觀階段指引: [`IMPLEMENTATION_GUIDE.md`](file:///IMPLEMENTATION_GUIDE.md)（當前正推進至**階段 3**）

---

## 2. 系統現況與已固化基線 (System Baseline)
- [x] **階段 0 至 階段 2.8 全部完成**：包含視覺資產、Schema 契約、PWA 前端骨架、PC 寬螢幕 Dashboard 自適應、深淺主題完全解耦、Google OAuth 2.0 登入與雙語隱私條款上線。
- [x] **104 標準 12 大區塊雙軌履歷畫布 (`js/components/myCv.js`) 落地**：支援 AI 拖曳與手動新增雙軌入口，以及每條目獨立之 `[👁️ 公開 / 🙈 隱藏]` 二態隱私開關。
- [x] **前端 Local-first (0ms) ＋ 3 秒防抖 (3000ms) 背景回寫 Google Drive 引擎 (`js/store.js`) 落地**。
- [x] **安全保險庫重構 (`js/components/vault.js`)**：頂部「✨ 統一智慧投放區」多檔案一次丟入自動分類歸檔，下方四欄純淨檢視與 Drive 直連。
- [x] **6 大核心架構 ADR 活頁全量定案固化**：
  - [`docs/adr/001_my_cv_and_vault_interaction.md`](file:///docs/adr/001_my_cv_and_vault_interaction.md)：履歷與保險庫互動分工，二態隱私開關。
  - [`docs/adr/002_submission_snapshot_escrow.md`](file:///docs/adr/002_submission_snapshot_escrow.md)：投遞快照公證提存機制 (`Files.copy`)。
  - [`docs/adr/003_104_aligned_profile_schema.md`](file:///docs/adr/003_104_aligned_profile_schema.md)：雙軌並行輸入 (AI 拖曳 + 手動新增)。
  - [`docs/adr/004_full_12_sections_and_official_vault.md`](file:///docs/adr/004_full_12_sections_and_official_vault.md)：104 完整 12 大區塊與官方網盤一夾一案。
  - [`docs/adr/005_local_first_and_drive_debounce.md`](file:///docs/adr/005_local_first_and_drive_debounce.md)：前端 Local-first (0ms) + 3 秒防抖回寫。
  - [`docs/adr/006_dynamic_roles_and_drive_boundary.md`](file:///docs/adr/006_dynamic_roles_and_drive_boundary.md)：GAS+Sheets 動態角色台帳、雙網盤物理隔離與未登入門禁。

---

## 3. 下一棒核心落地任務清單 (Next Agent Action Items: 階段 3 實施)

> ⚠️ **執行鐵律**：本架構已經過嚴謹研討定案（詳見 ADR 006），**進場之 AI 代理人嚴禁重新發起討論或質疑已定案架構**，請直接依序編寫代碼落地！

### 🎯 任務 1：GAS 後端角色台帳與資料表定義 (`gas/Database.js`, `gas/RoleService.js`)
1. **建立 `System_Roles` 表結構**：
   - 欄位：`email`, `role` (`ADMIN` | `PARTNER` | `CANDIDATE`), `status` (`ACTIVE`), `display_name`, `created_at`。
   - 初始預置帳號：`gyhongyu@gmail.com` -> `ADMIN`。
2. **實作角色查詢邏輯 (`RoleService.getUserRole(email)`)**：
   - 查詢 Email 對應之角色；**凡不在名單中者，一律回傳 `CANDIDATE`**（零硬編碼，開放未註冊求職者正常登入使用）。

---

### 🎯 任務 2：官方審核網盤提存服務 (`gas/DriveService.js`, `gas/JobService.js`)
1. **建立官方網盤尋址與一夾一案提存接口**：
   - 確保官方 Google Drive 根目錄存在 **`📁 TrustCV_Official_Vault/`**（不同於用戶個人的 `📁 TrustCV/`）。
   - 當收到投遞請求時，在 `📁 TrustCV_Official_Vault/Applications/` 下建立以案件編號命名的專屬目錄（如 `APP-2026-TW-0088_Rajesh_Kumar/`）。
   - 呼叫 `Files.copy` 將公開條目的原件副本與快照 JSON 存入該案件目錄。
2. **登記 `Applications` 資料表**：
   - 寫入 `application_id`, `job_id`, `candidate_email`, `official_folder_id`, `created_at`, `status` (`PENDING`)。

---

### 🎯 任務 3：前端未登入門禁收緊與動態角色水合 (`js/components/myCv.js`, `js/app.js`, `js/store.js`)
1. **未登入門禁 (Guest Gate)**：
   - 當 `user === null` 時：
     - 「精選職缺」：正常開放瀏覽與點擊。
     - 「個人履歷」(`renderMyCv`)：不渲染編輯表單，直接渲染登入引導卡片（「請先登入 Google 帳號以啟用個人履歷與專屬 Google Drive 保險庫」），**徹底移除前端寫死的假資料墊底**！
2. **登入角色水合**：
   - 用戶 Google 登入後，呼叫 GAS 取得其動態角色 (`ADMIN` / `PARTNER` / `CANDIDATE`)。
   - 管理員 (`ADMIN`) 登入：
     - 若其個人 Drive 的 `TrustCV/` 為空，可提供「載入開發基準測試資料」功能將拉傑許·夏馬的測試檔案真正寫入其個人 Drive 進行聯調。
     - 投遞時真正測試 `Files.copy` 提存至 `TrustCV_Official_Vault/`。

---

## 4. 驗收啟動指令與導航門禁 (Pre-Flight Navigation & Verification Step)

### 🧭 進入代碼實作前的「雙重導航門禁」（嚴禁盲目摸象，省 10x Token）：
下一棒代理人進場後，**強制先執行以下兩條命令**在記憶體中建立專案物理地圖與語法拓撲：
1. **目錄與職責邊界導航**（<50ms 掌握房間邊界）：
   ```powershell
   py .agents\skills\project_structure_keeper\scripts\keeper.py audit
   ```
2. **全局代碼語法地圖與調用鏈穿透**（0 成本掌握所有函式與類別位置）：
   ```powershell
   py .agents\skills\agent_code_map\scripts\map.py
   ```

### ✅ 代碼落盤後的驗收閉環：
1. 再次執行 `py .agents\skills\project_structure_keeper\scripts\keeper.py audit` 確認全域 0 孤兒雜檔。
2. 啟動 `啟動本地預覽.bat` 於 `http://localhost:5188` 驗證未登入門禁、Google 登入角色水合與 Drive 提存。

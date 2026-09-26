# 🛡️ 研發即時現狀與架構真理庫 (STATE.md)

> 📌 **版本**: v1.0.0 (MVP 啟動) | **更新時間**: 2026-09-27  
> ⚠️ **鐵律**: 本文檔嚴格限制 ≤200 行，為專案唯一真理來源 (Single Source of Truth, SSOT)。

---

## 1. 專案定位與價值主張
- **產品名稱**: `Project TrustCV` (線上代號 `Project Credence`) - PWA 行動端 MVP
- **網址目標**: `cv.teaforia.in` (GitHub Pages / Cloudflare Pages + DNS)
- **核心目標**: 打破跨國/兩岸技術人才赴台就業與跨境合作之信任壁壘，提供即開即投、雙軌多語言 (中/英)、履歷結構化提取、在地化術語轉換、Google 雲端全自動化建檔 (Sheets/Drive) 與 LLM 智能支援。

---

## 2. 系統架構拓撲與技術棧
```text
[ 行動端 PWA (cv.teaforia.in) ] (Tailwind CDN + Vanilla JS / PWA Manifest + Service Worker)
        │ HTTPS POST/GET (JSON)
        ▼
[ Google Apps Script (GAS) API Gateway ] (RESTful Web App doPost / doGet)
   ├── Google Sheets (關聯資料庫: Users, Jobs, Applications, System_Config)
   ├── Google Drive (非結構化檔案隔離庫: 依 Candidate UUID 建立資料夾)
   └── OpenRouter / 打工仔 LLM 池 (履歷結構化、兩岸術語對齊在地化)
```

---

## 3. 不可違背之架構不變量 (Hard Invariants)
1. **靜態極致 (Static Pure)**: 前端為純靜態 PWA，嚴禁引入需要 Node.js 伺服端渲染的重量級後端；以 GitHub Pages 託管。
2. **零搶鎖與雲端資產唯一網關**: Google Sheets/Drive 僅透過專屬 GAS Web App 進行讀寫與檔案上傳，嚴禁直連憑證洩漏在前端。
3. **雙語標準與嚴格分流**: 僅支援 English (`en`) 與中文繁體 (`zh-TW`)，徹底移除簡體中文 (`zh-CN`) 與印地語；文字與展示資料嚴禁中英混雜，依語言完全獨立分軌展示。
4. **全域禁止 LaTeX**: 履歷與系統輸出嚴格禁用 LaTeX 格式，統一以語意 HTML / Markdown / JSON 呈現。
5. **DMC 文檔治理**: 研發日誌 `ACTIVE_LOG.md` 僅追加不修改；重大架構異動沉澱至 `docs/adr/`。
6. **未授權禁止 Git 推送**: 嚴禁 AI 代理人自主發起 `git push`。

---

## 4. 模組責任地圖 (Module Responsibility Map)
- `specs/`: 業務規格與產品法典庫 (`PRD.md`, `00_architecture/` ~ `04_templates/`)
- `assets/`: 視覺設計與高保真原型庫 (`BRAND_GUIDE.md`, `prototypes/`, `svg/`)
- `docs/`: DMC 研發知識庫 (`STATE.md`, `ACTIVE_LOG.md`, `TOPOLOGY.md`)
- `.agents/skills/`: 專案常駐守護技能 (`project_structure_keeper/`)
- `.agent_profiles/`: 多模式規則庫 (`production/`, `development/`)
- `index.html`: Web 核心單頁應用入口 (即開即投、工作瀏覽、履歷投遞)
- `manifest.json` & `sw.js`: 離線快取設定 (v1.1.1)
- `gas/`: Google Apps Script 後端代碼 (Gateway, Drive/Sheets 串接)
- `worker/`: 打工仔 LLM 與上游職缺自動化同步

---

## 5. 當前里程碑與進行中工作 (Roadmap & Status)
- [x] DMC 研發知識治理機制建立 (`docs/`)
- [x] 多模式規則架構部署 (預設開發模式)
- [x] 全域拓撲規整 (specs/、assets/ 歸位與鏈接校正)
- [x] 專案專屬守護技能部署 (`.agents/skills/project_structure_keeper`)
- [x] 階段 0：視覺資產規格固化 (PNG/Favicon/ICO) 完成
- [x] 階段 1：規格契約與 Mock 資料真值校準 (Schema 100% 驗訖) 完成
- [x] 階段 2：前端骨架與本地預覽啟動器 (`啟動本地預覽.bat`) 落地
- [x] 階段 2.5：PC 寬螢幕自適應 (max-w-7xl 雙欄) ＋ 深淺主題 Logo/字體配色徹底分離
- [x] 前端細節修訂：移除 Header PWA 微標籤、移除簡中版 (鎖定 EN / 中文)、示範文案中英純淨分流無混雜
- [ ] ⏳ 待使用者前端視覺檢閱確認滿意後，解鎖階段 3 (GAS 後端)
- [ ] 階段 3：GAS 後端 Gateway 與 Google Sheets/Drive 自動化結構落地
- [ ] 階段 4：OpenRouter 打工仔 LLM 履歷萃取/在地化翻譯串接
- [ ] 階段 5：端到端整合聯調驗收


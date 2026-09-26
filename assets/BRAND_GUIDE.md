# Project TrustCV / Credence: 品牌識別 (VI) 與 PWA 多端 Logo 設計定版規範

> **文檔編號**：`SPEC-VI-001_LOGO_SPEC_FINAL`  
> **適用平台**：`cv.teaforia.in` 行動端 PWA、iOS / Android 主畫面、PC 瀏覽器標籤頁 (Favicon)、候選人 Dossier 數位浮水印  
> **設計原則**：極簡幾何、消除待辦便籤感、去除植物食材感、三階實體核驗意象、小尺寸極致清晰、全域嚴格禁用 LaTeX 語法。

---

## 1. 品牌視覺基因重組與定版核心概念

### 1.1 原標誌 (`Teaforia`) 到新專案品牌 (`TrustCV`) 的進化
1. **脫離茶飲食材屬性**：母公司原標誌為三片典型的植物茶葉造型，帶有 `- TEA BEVERAGE -` 副標。新專案定名為 `TrustCV`（系統代號 `Credence`），母公司以 `BY TEAFORIA` 形式於字標下方提供法人實體與合約背書。
2. **「三」的基因幾何化（三階核驗勾標）**：
   * 原三葉對稱結構轉化為**「三階核驗勾標 (Three-Stage Verification Check)」**，層疊向上，精準呼應平台防偽審查的三道實體門檻：
     * **第一階（頂層深墨綠）**：學歷證件與政府公積金（EPFO）資格初審。
     * **第二階（中層翡翠綠）**：Form 16 稅單原件與官方離職信交叉審計。
     * **第三階（底層亮薄荷綠）**：真人視訊防替考初審與綠標授權（`GREEN_VERIFIED_READY`）。
3. **八角沖孔微細節（Octagonal Punch Hole）**：每道折角的右端上方均設有機械級正八角形鏤空沖孔，透出底層深色，傳達高科技機電工程與數位防偽印章的不可篡改性。
4. **檔案公文折角與專屬 CV 字標（消除待辦便籤感）**：
   * 行動端圖標採用帶有右上折角的人才檔案夾（Dossier Document）作為容器，搭配獨立設計的無襯線幾何 `CV` 字標，徹底消除一般用戶對「待辦清單 (To-Do List)」的心理誤解。

---

## 2. 官方標準配色規範 (Color Palette)

採用冷調深邃的曜石色搭配高飽和度的翡翠綠階，展現金融級與半導體設備審查的權威感：

```text
+-----------------------+-------------------+-----------------------------------+
| 角色                  | 色彩名稱          | 色碼 (Hex) / 應用場景              |
+-----------------------+-------------------+-----------------------------------+
| 背景深色底板 (Deep)   | Obsidian Carbon   | #080C0E (全域深邃黑底，保證對比度) |
| 第一階審查 (Stage 1)  | Forest Deep Green | #143B32 至 #2A725E (學歷初審)     |
| 第二階審查 (Stage 2)  | Emerald Verify    | #1A6652 至 #34B285 (稅單審計)     |
| 第三階綠標 (Stage 3)  | Cyber Mint Glow   | #22B573 至 #40F5A3 (終審綠標確權) |
| 純淨中性 (Neutral)    | Pure Stark White  | #FFFFFF (高對比字標與幾何 C)      |
| 結構輔助線 (Border)   | Slate Metallic    | #1E293B 至 #334155 (檔案外框)     |
+-----------------------+-------------------+-----------------------------------+
```

---

## 3. 定版向量代碼庫 (Production-Ready SVG Assets)

以下 4 款向量圖形為純代碼繪製，無任何外部字型依賴，保證跨平台 100% 絕對一致渲染：

### 3.1 資產 A：App 啟動與加載畫面全幅標誌 (`splash-screen-logo.svg`)
* **適用場景**：PWA App 啟動畫面 (Splash Screen)、官方郵件存證信頭、簡報封面。
* **規格**：800x800，含大尺寸深色卡片、三階沖孔勾標與完整 `TrustCV BY TEAFORIA` 品牌字標。

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="100%" height="100%">
  <defs>
    <linearGradient id="splash-top" x1="0%" y1="100%" x2="80%" y2="0%">
      <stop offset="0%" stop-color="#143b32"/>
      <stop offset="100%" stop-color="#2a725e"/>
    </linearGradient>
    <linearGradient id="splash-mid" x1="0%" y1="100%" x2="80%" y2="0%">
      <stop offset="0%" stop-color="#1a6652"/>
      <stop offset="100%" stop-color="#34b285"/>
    </linearGradient>
    <linearGradient id="splash-bot" x1="0%" y1="100%" x2="80%" y2="0%">
      <stop offset="0%" stop-color="#22b573"/>
      <stop offset="100%" stop-color="#40f5a3"/>
    </linearGradient>
  </defs>

  <!-- 背景深色圓角卡片 -->
  <rect width="800" height="800" rx="140" fill="#080c0e"/>

  <!-- 圖標群組（三層折角與八角沖孔透雕） -->
  <g id="check-group">
    <!-- 頂層折角（深墨綠） -->
    <path fill="url(#splash-top)" fill-rule="evenodd" d="
      M 375,246 L 283,154 L 315,122 L 375,182 L 501,56 L 533,88 Z
      M 502,94.6 L 494.4,87 L 483.6,87 L 476,94.6 L 476,105.4 L 483.6,113 L 494.4,113 L 502,105.4 Z
    "/>
    <!-- 中層折角（翡翠綠） -->
    <path fill="url(#splash-mid)" fill-rule="evenodd" d="
      M 375,352 L 283,260 L 315,228 L 375,288 L 501,162 L 533,194 Z
      M 502,200.6 L 494.4,193 L 483.6,193 L 476,200.6 L 476,211.4 L 483.6,219 L 494.4,219 L 502,211.4 Z
    "/>
    <!-- 底層折角（亮薄荷綠） -->
    <path fill="url(#splash-bot)" fill-rule="evenodd" d="
      M 375,458 L 283,366 L 315,334 L 375,394 L 501,268 L 533,300 Z
      M 502,306.6 L 494.4,299 L 483.6,299 L 476,306.6 L 476,317.4 L 483.6,325 L 494.4,325 L 502,317.4 Z
    "/>
  </g>

  <!-- 品牌文字標識 -->
  <g id="brand-text">
    <text x="400" y="635" text-anchor="middle" font-family="system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif">
      <tspan fill="#ffffff" font-size="94" font-weight="800">Trust</tspan><tspan fill="#3de098" font-size="94" font-weight="800">CV</tspan>
    </text>
    <text x="400" y="700" text-anchor="middle" fill="#ffffff" font-size="30" font-weight="600" font-family="system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif" letter-spacing="7">
      BY TEAFORIA
    </text>
  </g>
</svg>
```

---

### 3.2 資產 B：PWA 行動端主畫面圖標 (`icon_dossier_cv.svg`)
* **適用場景**：iOS / Android 手機桌面 PWA 圖標（`apple-touch-icon`、`icon-512`）。
* **規格**：512x512，人才檔案夾折角外型、左上方高對比幾何 `CV` 向量字標、中央三階核驗標。

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="app-bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#080C0E"/>
      <stop offset="100%" stop-color="#020406"/>
    </linearGradient>
    <linearGradient id="app-card" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#141E28"/>
      <stop offset="100%" stop-color="#0B1117"/>
    </linearGradient>
    <linearGradient id="app-rim" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#34D399" stop-opacity="0.95"/>
      <stop offset="40%" stop-color="#10B981" stop-opacity="0.4"/>
      <stop offset="100%" stop-color="#1E293B" stop-opacity="0.8"/>
    </linearGradient>
    <linearGradient id="app-c" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="100%" stop-color="#E2E8F0"/>
    </linearGradient>
    <linearGradient id="app-v" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#3DF5A7"/>
      <stop offset="100%" stop-color="#059669"/>
    </linearGradient>
    <linearGradient id="app-chk-top" x1="0%" y1="100%" x2="80%" y2="0%">
      <stop offset="0%" stop-color="#143b32"/>
      <stop offset="100%" stop-color="#2a725e"/>
    </linearGradient>
    <linearGradient id="app-chk-mid" x1="0%" y1="100%" x2="80%" y2="0%">
      <stop offset="0%" stop-color="#1a6652"/>
      <stop offset="100%" stop-color="#34b285"/>
    </linearGradient>
    <linearGradient id="app-chk-bot" x1="0%" y1="100%" x2="80%" y2="0%">
      <stop offset="0%" stop-color="#22b573"/>
      <stop offset="100%" stop-color="#40f5a3"/>
    </linearGradient>
  </defs>

  <!-- PWA 底板 (iOS/Android 實色無透底安全底) -->
  <rect width="512" height="512" rx="116" fill="url(#app-bg)"/>

  <!-- 人才檔案夾 (Dossier Document) -->
  <g id="dossier-card">
    <path d="
      M 112, 42
      L 348, 42
      L 434, 128
      L 434, 436
      C 434, 454 418, 470 398, 470
      L 112, 470
      C 92, 470 76, 454 76, 436
      L 76, 78
      C 76, 60 92, 42 112, 42
      Z
    " fill="url(#app-card)" stroke="url(#app-rim)" stroke-width="4.5"/>

    <!-- 右上折角三角形 -->
    <path d="M 348, 42 L 348, 128 L 434, 128 Z" fill="#080C0E"/>
    <path d="M 348, 42 L 348, 128 L 434, 128" fill="none" stroke="#34D399" stroke-width="3.5" stroke-linejoin="round" opacity="0.85"/>

    <!-- 專屬設計 CV 字標 -->
    <g id="cv-monogram" transform="translate(112, 68)">
      <path d="
        M 66, 10
        C 28, 10 0, 38 0, 74
        C 0, 110 28, 138 66, 138
        L 80, 138
        L 80, 106
        L 66, 106
        C 46, 106 32, 92 32, 74
        C 32, 56 46, 42 66, 42
        L 80, 42
        L 80, 10
        Z
      " fill="url(#app-c)"/>
      <path d="
        M 92, 10
        L 120, 10
        L 146, 96
        L 172, 10
        L 200, 10
        L 162, 138
        L 130, 138
        Z
      " fill="url(#app-v)"/>
      <circle cx="212" cy="24" r="7" fill="#40F5A3"/>
    </g>

    <!-- 三階核驗標群組 -->
    <g transform="translate(-16, 142) scale(0.67)">
      <path fill="url(#app-chk-top)" fill-rule="evenodd" d="
        M 375,246 L 283,154 L 315,122 L 375,182 L 501,56 L 533,88 Z
        M 502,94.6 L 494.4,87 L 483.6,87 L 476,94.6 L 476,105.4 L 483.6,113 L 494.4,113 L 502,105.4 Z
      "/>
      <path fill="url(#app-chk-mid)" fill-rule="evenodd" d="
        M 375,352 L 283,260 L 315,228 L 375,288 L 501,162 L 533,194 Z
        M 502,200.6 L 494.4,193 L 483.6,193 L 476,200.6 L 476,211.4 L 483.6,219 L 494.4,219 L 502,211.4 Z
      "/>
      <path fill="url(#app-chk-bot)" fill-rule="evenodd" d="
        M 375,458 L 283,366 L 315,334 L 375,394 L 501,268 L 533,300 Z
        M 502,306.6 L 494.4,299 L 483.6,299 L 476,306.6 L 476,317.4 L 483.6,325 L 494.4,325 L 502,317.4 Z
      "/>
    </g>
  </g>
</svg>
```

---

### 3.3 資產 C：PC 瀏覽器標籤頁專用圖標 (`favicon-cv.svg`)
* **適用場景**：桌面端 Chrome / Edge / Safari 標籤頁（16x16 或 32x32 極小像素環境）。
* **規格**：64x64，帶深色方圓底板，由加粗純白 `C` + 翡翠綠 `V` + 綠標原點構成。

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <defs>
    <linearGradient id="vGradFavicon" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#40F5A3"/>
      <stop offset="100%" stop-color="#059669"/>
    </linearGradient>
  </defs>

  <!-- 沉穩深邃底板（適配淺色與深色標籤列） -->
  <rect width="64" height="64" rx="14" fill="#080C0E"/>

  <!-- 專屬 CV 核心字標 -->
  <g transform="translate(6, 12)">
    <path d="
      M 19, 3
      C 8.5, 3 1, 10.5 1, 20.5
      C 1, 30.5 8.5, 38 19, 38
      L 23.5, 38
      L 23.5, 29
      L 19, 29
      C 13.5, 29 9.5, 25 9.5, 20.5
      C 9.5, 16 13.5, 12 19, 12
      L 23.5, 12
      L 23.5, 3
      Z
    " fill="#FFFFFF"/>
    <path d="
      M 26.5, 3
      L 34.5, 3
      L 42, 28
      L 49.5, 3
      L 57.5, 3
      L 46.5, 38
      L 37.5, 38
      Z
    " fill="url(#vGradFavicon)"/>
    <circle cx="53" cy="7" r="2.8" fill="#40F5A3"/>
  </g>
</svg>
```

---

### 3.4 資產 D：PWA 頂部導航列橫向標誌 (`navbar-brand-lockup.svg`)
* **適用場景**：行動端與桌面端頂部 Navbar Header，高度固定 40px~48px。
* **規格**：240x48，微型核驗標徽章 + `TrustCV` 主字標 + `BY TEAFORIA` 副標。

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 48" width="240" height="48">
  <defs>
    <linearGradient id="navBrandGrad" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#059669"/>
      <stop offset="100%" stop-color="#10B981"/>
    </linearGradient>
  </defs>

  <!-- 左側 Icon 本體 (40x40) -->
  <g transform="translate(2, 4)">
    <rect width="40" height="40" rx="10" fill="#080C0E"/>
    <g transform="translate(1.5, -0.5)">
      <path d="M11 15 L16.5 20.5 L27 10" fill="none" stroke="#6EE7B7" stroke-width="3.2" stroke-linecap="square" stroke-linejoin="miter" opacity="0.4"/>
      <path d="M11 21.5 L16.5 27 L27 16.5" fill="none" stroke="#34D399" stroke-width="3.2" stroke-linecap="square" stroke-linejoin="miter" opacity="0.75"/>
      <path d="M11 28 L16.5 33.5 L27 23" fill="none" stroke="url(#navBrandGrad)" stroke-width="3.5" stroke-linecap="square" stroke-linejoin="miter"/>
    </g>
  </g>

  <!-- 品牌文字標識 -->
  <g transform="translate(52, 9)">
    <text x="0" y="20" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="800" font-size="20" letter-spacing="-0.5">
      <tspan fill="#0F172A">Trust</tspan><tspan fill="#10B981">CV</tspan>
    </text>
    <text x="1" y="31" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="600" font-size="8.5" fill="#64748B" letter-spacing="1.2">BY TEAFORIA</text>
  </g>
</svg>
```

---

## 4. 前端 HTML 與 Web App Manifest 引入規範

在專案靜態主頁（`index.html`）的 `<head>` 標籤中，依據不同端點進行精確配置：

```html
<!-- 1. PC 瀏覽器標籤頁微型 Favicon (極小尺寸下最清晰) -->
<link rel="icon" type="image/svg+xml" href="/assets/favicon-cv.svg">

<!-- 2. iOS Safari 主畫面安裝圖標 (180x180 實色無透明度) -->
<link rel="apple-touch-icon" sizes="180x180" href="/assets/icon_dossier_cv.svg">

<!-- 3. Web App Manifest 宣告 (Android 與桌面 PWA) -->
<link rel="manifest" href="/manifest.json">
```

在 `manifest.json` 中配置 Maskable 與 Any 圖標：

```json
{
  "name": "Project TrustCV | 跨國工程人才驗證平台",
  "short_name": "TrustCV",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#080C0E",
  "theme_color": "#080C0E",
  "icons": [
    {
      "src": "/assets/icon_dossier_cv.svg",
      "sizes": "512x512",
      "type": "image/svg+xml",
      "purpose": "any maskable"
    }
  ]
}
```
# TrustCV - Google Cloud & OAuth 2.0 配置備忘錄

---

## 📌 帳號與專案基本資訊

| 項目 | 設定值 |
| :--- | :--- |
| **管理 Google 帳號** | `gyhongyu@gmail.com` |
| **Google Cloud 專案名稱** | `TrustCV` |
| **專案 ID (Project ID)** | `trustcv-509916` |
| **專案編號 (Project Number)** | `606540193289` |
| **控制台網址** | [Google Cloud Console](https://console.cloud.google.com/) |

---

## 🔑 OAuth 2.0 憑證資訊

* **應用類型**：Web 應用程式 (Web Application)
* **客戶端 ID (Client ID)**：
  ```text
  606540193289-9oqlch0j8vf95fi5hkfpacejoes8oaij.apps.googleusercontent.com
  ```
* **客戶端密鑰 (Client Secret)**：
  *(已脫敏保護：純靜態前端 SPA/PWA 僅需使用 Client ID，Client Secret 由管理員本機離線安全保存，切勿寫入程式碼或提交至公開倉庫。)*

---

## 🌐 已獲授權的來源網址 (Authorized JavaScript Origins)

在 Google Cloud Console 中設定的白名單網址如下（末尾無斜線）：

1. **正式線上環境**：
   * `https://cv.teaforia.in`
2. **本地開發環境**：
   * `http://localhost:5188`

> **已獲授權的重定向 URI (Redirect URI)**：留空（前端採用彈窗授權 Popup 流程，無須填寫重定向網址）。

---

## 💻 專案程式碼設定位置

### 檔案路徑：`js/auth.js`
在約第 24 行將常數修改為實際 Client ID：

```javascript
const GOOGLE_CLIENT_ID = '606540193289-9oqlch0j8vf95fi5hkfpacejoes8oaij.apps.googleusercontent.com';
```

---

## 🚀 本地開發伺服器啟動指令 (使用 Port 5188)

若在本地進行除錯或開發，請確保網址通訊埠與 OAuth 來源一致（使用 `5188`）：

* **Python 3**：
  ```bash
  python -m http.server 5188
  ```
* **Node.js (http-server)**：
  ```bash
  npx http-server -p 5188
  ```
* **Node.js (serve)**：
  ```bash
  npx serve -p 5188
  ```

---

## 🗂️ Google Drive 資料夾架構與權限說明

TrustCV 運作時會透過 Google Drive API 自動在使用者雲端硬碟根目錄建立以下結構：

```text
📋 TrustCV/
  ├── 🪪 Certificates/   ← 上傳證件照、護照、學歷證明
  ├── 📄 Resumes/        ← 主履歷 PDF / DOCX
  └── 🚀 Exports/        ← 針對 LinkedIn、104 等平台匯出的自訂版本
```

* **OAuth 權限範圍 (Scope)**：
  * 使用 `https://www.googleapis.com/auth/drive.file`
* **隱私安全性**：
  * TrustCV 只能讀取與寫入由該應用程式自身建立的檔案與資料夾，**無法**讀取或存取使用者 Google Drive 內的其他私人檔案。

---

## ⚠️ 常見注意事項與維護備忘

1. **測試模式 (Testing) vs 正式發布 (Production)**：
   * 目前 OAuth 同意畫面的受眾設定為外部測試模式。
   * 在測試模式下，若非建立者本人（`gyhongyu@gmail.com`）要登入測試，需至 **OAuth 權限請求頁面 ➜ 測試用戶 (Test Users)** 新增對方的 Google Email；若要開放給大眾使用，後續可在該頁面點選「發布應用 (Publish App)」。
2. **修改來源網址**：
   * 若未來網址更換或新增其他子網域，可隨時前往 Google Cloud Console ➜ **Google Auth Platform** ➜ **客戶端** ➜ 編輯此 Web Client，在「已獲授權的 JavaScript 來源」追加新網址。

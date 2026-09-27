# ADR 006: GAS + Google Sheets 動態三級權限台帳、個人與官方審核網盤物理隔離與未登入門禁 (Dynamic Roles, Dual-Vault Partition & Guest Gate)

> **狀態**: 已定案 (Accepted)  
> **日期**: 2026-09-28  
> **背景**: 徹底根除代碼中硬編碼管理員 Email 的資安與維護痛點；區隔同帳號下個人與官方目錄，杜絕測試與審核數據打架；並收緊未登入訪客權限，防止假數據污染。

---

## 1. 核心業務痛點與風險

1. **嚴禁前端硬編碼角色**：
   * 前端若寫死 `if (email === 'gyhongyu@gmail.com') role = 'ADMIN'`，任何使用者透過瀏覽器 DevTools 即可偽造管理員身份。
   * 後期若擴充合作企業夥伴（Partner）或人資角色，必須重新修改前端代碼與 PWA 快取，造成架構僵化與維護災難。
2. **同帳號個人與官方目錄重名衝突**：
   * 開發測試時，管理員使用的是自身 Google 帳號 (`gyhongyu@gmail.com`)。
   * 若個人網盤與官方審核網盤皆命名為 `TrustCV/`，將導致個人日常履歷與官方審核提存資產物理混淆。
3. **未登入狀態之假數據污染**：
   * 前端不應在未登入時以本機捏造假資料墊底，這會造成「已打通 Google Drive」的假象。
   * 未登入訪客僅能瀏覽職缺，不可操作履歷與保險庫。

---

## 2. 解決方案架構

### A. Google Sheets 動態權限總表 (`System_Roles`) SSOT
於後端中央資料庫建立專屬工作表 `System_Roles`，作為全系統唯一的動態權限台帳：

| 欄位名稱 | 類型 | 範例 | 說明 |
| :--- | :--- | :--- | :--- |
| `email` | String (PK) | `gyhongyu@gmail.com` | Google 帳號 Email (正規化全小寫) |
| `role` | Enum | `ADMIN` / `PARTNER` / `CANDIDATE` | 系統三級角色 |
| `status` | Enum | `ACTIVE` / `SUSPENDED` | 權限狀態 |
| `display_name` | String | 總管管理員 | 顯示名稱 |
| `created_at` | ISOString | `2026-09-28T02:00:00Z` | 建立時間 |

* **三級角色分工 (RBAC Hierarchy)**：
  1. **`ADMIN` (超管 / 最高級)**：具備全域管理特權，可調閱官方審核庫 (`TrustCV_Official_Vault/`)、審查所有投遞案件，並享有開發測試除錯工具。
  2. **`PARTNER` (上游合作企業 / 中級)**：預留中級權限，**僅能調閱指派給該企業之已投遞脫敏/解密案件**，嚴禁存取全量未投遞人才庫（落實 180 天防繞道條款）。
  3. **`CANDIDATE` (一般求職者 / 預設初級)**：**凡不在 `System_Roles` 清單中之任何 Google 帳號，預設自動歸屬為此角色**。僅能讀寫個人 Drive 內之檔案。

### B. 個人網盤 vs 官方審核網盤物理命名隔離

```text
[ 用戶 / 管理員個人 Google Drive ]
└── 📁 TrustCV/                                 # 個人安全保險庫 (Personal Vault)
    ├── 🖼️ Photos/                             # 大頭照
    ├── 🪪 Certificates/                       # 證照、學歷、稅單
    ├── 📄 Resumes/                            # 主履歷原件
    ├── 🚀 Exports/                            # 唯讀投遞包
    └── 📄 master_profile.json                 # 12 大區塊個人真理庫 (100% 個人增刪改權利)

                                ──► [用戶按下「應聘投遞」] ──► 透過 Files.copy 秒級複製

[ TrustCV 官方審核網盤 (由 ADMIN 管理) ]
└── 📁 TrustCV_Official_Vault/                 # 官方審核專用庫 (Official Vault)
    └── 📁 Applications/
        └── 📁 APP-2026-TW-0088_Rajesh_Kumar/  # 一夾一案隔離提存
            ├── 📄 application_snapshot.json   # 凍結之 12 大區塊快照
            └── 🪪 原件副本...
```

### C. 未登入門禁 (Guest Gate)
* **未登入 (`GUEST`)**：
  * 「精選職缺」：正常瀏覽、搜尋、查看詳情。
  * 「個人履歷」/「安全保險庫」/「投遞進度」：**嚴格攔截**，渲染統一的登入引導卡片，禁止操作，杜絕本機假數據污染。

---

## 3. 效益與邊界
* **0-Hardcode 安全性**：管理員名單動態配置於 Google Sheets，首次手動授權後，後續新增 Partner 或 Admin 免改代碼、免重新發布。
* **物理隔離無衝突**：個人端 `TrustCV/` 與官方端 `TrustCV_Official_Vault/` 徹底解耦。

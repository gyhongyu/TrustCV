# ADR 004: 104 人力銀行 12 大區塊全量 Schema 與官方審核網盤一夾一案提存架構 (Full 12-Section Profile & Official Vault Architecture)

> **狀態**: 已定案 (Accepted)  
> **日期**: 2026-09-28  
> **背景**: 全面鏡像 104 人力銀行完整履歷架構，並打通「用戶個人 Drive ⇄ 官方審核網盤」的雙端業務生命週期。

---

## 1. 104 人力銀行完整 12 大核心區塊規範 (Profile Schema SSOT)

用戶端個人 Google Drive 根目錄維護之 `master_profile.json` 包含以下 12 大標準模組：

1. **`basic_info` (個人資料)**：姓名、性別、出生年月、大頭照 (連動 `Photos/`)、Email、電話、通訊地址、身分證號/護照。
2. **`educations` (學歷)**：學校、學位、科系、就讀起訖時間、畢肄狀態、[公開/隱藏]。
3. **`work_experiences` (工作經歷)**：公司名稱、產業別、職稱、起訖年月、工作內容/STAR 量化成果、產業技能標籤、[公開/隱藏]。
4. **`job_preferences` (求職條件)**：希望職稱、工作性質、上班時段、可上班日、期望待遇 (面議/月薪/年薪)、希望地點、出差外派意願。
5. **`languages` (語文能力)**：語言種類、聽/說/讀/寫等級、證照檢定分數 (如 TOEIC)。
6. **`skills` (專長)**：擅長工具 (軟體/設備)、工作技能標籤矩陣。
7. **`certificates` (資格認證)**：專業證照名稱、發證機構、證照字號、發證年月、[公開/隱藏]。
8. **`autobiography` (自傳)**：中英文職涯自傳。
9. **`attachments` (附件)**：作品簡報、論文、專案規格書、薪資稅單 Form 16。
10. **`project_achievements` (專案成就)**：專案名稱、擔任角色、起訖時間、專案成果說明、外部網址/照片。
11. **`references` (自傳 / 推薦人)**：推薦人姓名、服務機構、職稱、聯絡信箱/電話、關係。
12. **`custom_sections` (自訂內容)**：自訂標題 (如志工、社團、專利)、排版型態 (純文字/圖文/大型橫幅)、內容描述。

---

## 2. 官方審核網盤提存架構：一夾一案 (1-Application-1-Folder)

當用戶應聘職缺並確認核驗佐證時，系統觸發公證提存：

```text
TrustCV 官方審核網盤 (Official Vault)
└── 📁 Applications/
    └── 📁 APP-2026-TW-0088_Rajesh_Kumar/       # 每個應聘案件獨立資料夾
        ├── 📄 application_snapshot.json        # 投遞那一刻凍結的 12 大區塊快照
        ├── 🪪 ID_Proof_Aadhaar.pdf             # 官方持有的原件副本 (Files.copy)
        ├── 🎓 Degree_IIT_Madras.pdf            # 官方持有的學歷副本
        ├── 📑 Experience_Relieving_Letter.pdf   # 官方持有的離職證明副本
        └── 🖼️ Headshot_Official.jpg            # 官方持有的認證大頭照
```

* **數據庫台帳**：官方 Google Sheets / 未來 PostgreSQL 僅記錄純文字元數據（`application_id`, `job_id`, `candidate_email`, `status`, `official_folder_id`, `sha256_hash`）。
* **隔離效益**：各案件獨立隔離，日後無論用戶在個人端如何刪改，官方審核資產與雇主調閱永遠完好獨立。

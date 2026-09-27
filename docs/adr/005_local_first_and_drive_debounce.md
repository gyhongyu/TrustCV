# ADR 005: 前端 Local 優先與 Google Drive 防抖自動持久化策略 (Local-First & Debounced Drive Sync)

> **狀態**: 已定案 (Accepted)  
> **日期**: 2026-09-28  
> **背景**: 徹底解決 104 人力銀行斷線未保存丟失內容的痛點，並防止頻繁調用 Google Drive API 引發 403 Rate Limit。

---

## 1. 核心持久化架構：三層階梯策略 (Three-Tier Persistence)

1. **第一層：即時內存與 LocalStorage (0ms 物理零延遲)**：
   * 用戶在 12 大區塊中任何打字、勾選公開/隱藏、調整排序或新增項目，0 秒即時寫入瀏覽器 `localStorage`（Key: `trustcv_master_profile`）。
   * 即使意外斷網、瀏覽器閃退或誤按重新整理，**數據 100% 完好無損，絕不丟失任何心血**。
2. **第二層：3 秒防抖背景靜默回寫 (Debounced Drive Auto-Save)**：
   * 前端維護一個 3,000ms 的防抖計時器（Debounce Timer）。
   * 當用戶停止輸入滿 3 秒，背景靜態將完整的 `master_profile.json` 寫回用戶個人 Google Drive。
   * **節省 API 額度**：將密集的鍵盤輸入合併為單次 API 寫入，徹底杜絕 Google Drive 403 Rate Limit。
3. **第三層：手動儲存按鈕 (Explicit Save Action)**：
   * 頂部與底部懸浮條保留「💾 儲存並同步」按鈕，點擊可立即繞過 3 秒計時強制即時回寫。
   * 狀態微光指示：
     * `💾 儲存中...`（黃色微光）
     * `☁️ 已同步至 Google Drive`（翠綠勾勾，2秒後淡出）
     * `⚠️ 離線暫存中 (已保存在本機)`（灰色離線標籤）

---

## 2. 冷啟動水合機制 (Hydration on Login)

* 用戶登入 Google 帳號後：
  1. 系統先從 Google Drive 讀取 `master_profile.json`。
  2. 比對本地 `localStorage` 的 `updated_at` 時間戳：
     * 若本地時間戳較新（例如上次斷網時的未同步草稿），彈窗微提示：「偵測到本機有較新的未同步草稿，是否載入？」。
     * 若雲端較新或本地為空，直接將雲端數據水合（Hydrate）覆寫本地快取並渲染畫布。

---
name: agent_code_map
description: 全域通用 AI 代理人專案代碼地圖、AST 語法拓撲與調用鏈穿透大師 (Code Map & AST Caller Hierarchy)。專門徹底終結「跨會話冷啟動盲目 grep、翻遍全庫摸象、800 行大檔切片截斷」等通病。當使用者或代理人提出「查Bug」、「修復錯誤」、「代碼在哪裡」、「這個函式誰呼叫的」、「接手新專案」、「排查日誌報錯」、「重構」、「專案結構」、「代碼地圖」、「code_map」、「初始化代碼地圖」或面對陌生代碼庫時強制優先觸發。嚴禁直接使用全局 grep 大海撈針，強制第一優先調用此技能建立全域心智模型與精準跳轉。
---

# 🗺️ 全域通用代碼地圖與調用鏈穿透大師 (agent_code_map)

本技能採用 **「Python 原生 C 語言 AST 引擎 ✕ 多語言正則平穩降級 ✕ Top-Down 物理路徑修剪」**，在 **50 毫秒內** 完成專案核心拓撲抽取與呼叫者反向穿透，零外部依賴、零外部 LLM API、100% 離線純本地運算。

---

## ⛔ 不可違背之工程紅線 (Hard Invariants)

1. **嚴禁盲目摸象鐵律 (Anti-Blind-Grep Law)**：
   * 當接手新專案或面對 ≥5 個原始碼檔案的倉庫時，**嚴禁**第一步直接使用 `grep_search` 全庫無差別搜尋常見詞彙（如 `is_read`、`flag`、`status`、`user`）！
   * 探索與除錯的第一步，**必須且只能**調用本技能的宏觀地圖引擎建立全域拓撲心智模型。
2. **呼叫者追蹤必走語法樹鐵律 (Callers Precision Law)**：
   * 當需要釐清「某個方法或函式被誰呼叫、在哪裡被修改」時，**嚴禁**使用 grep 去肉眼比對幾十個搜尋結果！
   * 強制執行 `query_symbol.py callers <symbol>`，獲取攜帶父層 Class/Def Scope 與呼叫語句片段的精確線索。
3. **終端命令固定簽名規範 (Command Hygiene)**：
   * 嚴禁在命令列中拼接動態長字串、複雜引號或大括號，一律採用固定指令簽名。

---

## 🚀 核心作戰流程 (Standard Operating Procedure)

### 第一階段：宏觀代碼地圖導航 (Macro Map Navigation)
當需要快速看懂當前專案有哪些核心模組、誰依賴誰、主要 Class 與 Def 結構時：

```powershell
# 1. 輸出當前專案宏觀地圖 (預設當前目錄，輸出限制 ≤100 行防截斷)
py skills\agent_code_map\scripts\generate_map.py

# 2. 深入展開特定子目錄 (如深入看 src/sync)
py skills\agent_code_map\scripts\generate_map.py src\sync
```
* **效果**：50 毫秒內輸出按「引用中心度權重（Inbound Centrality）」排序的高密度 Markdown 結構，一眼看清模組邊界。

---

### 第二階段：微觀符號與調用鏈穿透 (Micro Symbol & Callers Tracing)
當鎖定某個可疑變更或函式（例如 NotesMaster 中的 `update_email_read_status` 或 `remove_tombstone`），需要查出「到底是誰在呼叫它」：

```powershell
# 1. 查詢所有呼叫者 (Caller Hierarchy - 攜帶調用語句與父層函式)
py skills\agent_code_map\scripts\query_symbol.py callers update_email_read_status

# 2. 查詢符號的原始定義位置 (Go to Definition)
py skills\agent_code_map\scripts\query_symbol.py def update_email_read_status
```
* **輸出範例**：
  ```text
  📍 src/sync_worker.py:146
     ├─ Scope  : class SyncWorker -> def _process_single_folder()
     └─ Snippet: self.db.update_email_read_status(note_id or domino_unid, is_read)
  ```
  直接指出檔名、行號與父層函式，2 輪對話精準定位病灶。

---

### 第三階段：專案原生技能腳手架播種初始化 (Project Scaffolding)
若使用者指示「將代碼地圖部署到專案」、「播種代碼地圖」或「初始化專案代碼地圖」：

```powershell
# 為目標專案播種專案級原生技能 (預設當前專案)
py skills\agent_code_map\scripts\scaffold.py

# 或指定專案路徑
py skills\agent_code_map\scripts\scaffold.py e:\Projects\NotesMaster
```
* **運作機制**：
  1. 在專案中生成標準 `.agents/skills/agent_code_map/` 技能目錄與專案級 `SKILL.md`（純標準庫，零外部依賴）。
  2. 自動清除舊版散落於 `scripts/code_map/` 的孤兒裸腳本，徹底告別目錄污染。
  3. 以語意錨點 `<!-- [START: CODE_MAP_INVARIANT] -->` 冪等無損注入專案 `AGENTS.md`（指向 `.agents\skills\...`）。
  4. 即使專案 clone 到無全域技能環境或 CI 中，新 AI 代理人依然能自動感知技能並具備自治代碼導航能力！

---

## 🛡️ 實戰防禦與死穴治理 (Incident Invariants)

1. **大數據陷阱防禦 (Data & Cache Pruning)**：
   * 內建 `ignore_filter.py` 在 `os.walk` 頂層對 `data/`、`logs/`、`notes_data/`、`.venv/`、`node_modules/` 進行**原地物理切片刪除 (`dirs[:] = [...]`)**。
   * 絕對不會深入遍歷任何郵件快取（如 NotesMaster 9,000+ 封 `.eml`）或 SQLite 二進位檔案，徹底根治記憶體爆炸與假死。
2. **多語言通用容錯 (Polyglot Fallback)**：
   * Python 專案走原生 C-AST 解析。
   * TypeScript、JavaScript、Go、Rust、C++ 專案平穩降級走通用正則語義提取器，100% 零崩潰。

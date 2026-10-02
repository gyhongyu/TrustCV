# 📘 Teaforia LLM 對接指南精華速查 (In-Project Quick Guide)

## 1. 連線基礎設定 (SSOT)
- **API 端點**：`https://llm.teaforia.in/v1/chat/completions`
- **認證 Header**：`Authorization: Bearer teaforia-live-trustcv-gateway-2026`
- **模型核心**：`qwen2-vl-7b-instruct` (32,768 Context)

---

## 2. 7B 物理邊界與防渙散鐵律 (Prompt Engineering)
1. **System Prompt 嚴禁超過 1,500 字元**（黃金長度 200~600 字元）。
2. **嚴禁將未啟用的 Tool Schemas 硬塞進 System Prompt**（會嚴重稀釋小模型注意力，導致輸出軟爛客套問句）。
3. **超參數配置**：
   - 考官模式：`temperature: 0.2`, `max_tokens: 1024`, `stream: true`
   - 結構化 JSON：`temperature: 0.0`, `max_tokens: 1024`
   - 嚴禁 `temperature > 0.7`（極易產生重複幻覺）。
4. **自動事實包**：在請求加上 `tools: [{"type": "function", "function": {"name": "web_search"}}]`，網關自動執行微對話提煉關鍵字並注入最新技術事實（Evidence Pack）。

---

## 3. 白盒調試：跨電腦即時日誌探針
當你發現 LLM 回應不如預期時，直接在終端執行：
```powershell
py .agents\skills\teaforia_llm_developer\scripts\probe_teaforia.py --last
```
50ms 穿透查看 GPU 宿主機的後台日誌生命週期（是否觸發事實包、微對話提煉詞、總耗時）。

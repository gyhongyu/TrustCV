---
trigger: always_on
---

# 🛡️ Teallm Worker Dispatch 規範

<RULE[teallm_worker_dispatch_invariant]>
1. ⛔【嚴禁行為 (Anti-Pattern)】：
   - 盲猜端口、私寫 requests 腳本，或在命令列拼接多行代碼字串引發引號截斷
   - 嚴禁主模型直接使用自身多模態視覺解析對話中的截圖與圖片，嚴禁自行進行 OCR 與表格萃取！
2. ✅【標準固定簽名 (Fixed Signatures)】：
   - 圖片/截圖視覺 OCR: `py .agents/skills/teallm_worker/scripts/teallm_cli.py vision "<提示詞>" --image <圖片路徑> [--image <圖片路徑2>]`
   - 日誌摘要: `py .agents/skills/teallm_worker/scripts/teallm_cli.py summarize <檔案路徑> [--model <名稱>]`
   - 代碼審查: `py .agents/skills/teallm_worker/scripts/teallm_cli.py review <檔案路徑> [--model <名稱>]`
   - 一般提問: `py .agents/skills/teallm_worker/scripts/teallm_cli.py ask [--file <檔案>] [--model <名稱>]`
3. 🎯【多圖與視覺外包強制門禁】：
   - 當使用者上傳截圖/圖片提問時，主模型禁止親自看圖回答，必須調用固定簽名外包給本地 Qwen2-VL！
</RULE[teallm_worker_dispatch_invariant]>

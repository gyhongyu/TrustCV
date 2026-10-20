---
trigger: model_decision
description: "當使用者上傳圖片、截圖、PDF/Word/Excel文檔，或需要外包調用本地 7B 大模型 (teallm_worker) 時"
---

# 🛡️ Teallm Worker Dispatch 規範

<RULE[teallm_worker_dispatch_invariant]>
1. ⛔【嚴禁行為 (Anti-Pattern)】：
   - 盲猜端口、私寫 requests 腳本，或在命令列拼接多行代碼字串引發引號截斷
   - 嚴禁主模型直接使用自身多模態視覺解析對話中的截圖與圖片，嚴禁自行進行 OCR 與表格萃取！
   - 嚴禁 AI 代理人面對 PDF/Word/Excel 時私自安裝 fitz/PyMuPDF 轉圖或寫切圖腳本！
2. ✅【標準固定簽名 (Fixed Signatures)】：
   - 多模態文件原生解析 (PDF/Word/Excel/PPT): `py .agents/skills/teallm_worker/scripts/teallm_cli.py doc <檔案路徑> ["<指令>"]`
   - 模型兵種與動態強項探測: `py .agents/skills/teallm_worker/scripts/teallm_cli.py models`
   - 圖片/截圖視覺 OCR: `py .agents/skills/teallm_worker/scripts/teallm_cli.py vision "<提示詞>" --image <圖片路徑>`
   - 通用長文檔摘要 (知識蒸餾): `py .agents/skills/teallm_worker/scripts/teallm_cli.py summarize <檔案路徑> [--model <名稱>]`
   - SRE 日誌取證 (根因排障): `py .agents/skills/teallm_worker/scripts/teallm_cli.py log-diagnose <檔案路徑> [--model <名稱>]`
   - 代碼審查: `py .agents/skills/teallm_worker/scripts/teallm_cli.py review <檔案路徑> [--model <名稱>]`
   - 一般提問: `py .agents/skills/teallm_worker/scripts/teallm_cli.py ask [--file <檔案>] [--model <名稱>]`
3. 🎯【多圖與視覺外包強制門禁】：
   - 當使用者上傳截圖/圖片提問時，主模型禁止親自看圖回答，必須調用固定簽名外包給本地 Qwen2-VL！
   - 當使用者提供 PDF/Word/Excel 時，強制以 `doc` 固定簽名外包，由網關 0ms 探針全自動分流！
</RULE[teallm_worker_dispatch_invariant]>

---
trigger: model_decision
description: "TrustCV 官方三勾信任標章/徽章 (候選人盾牌 / 雇主冠冕 0~3 勾) 唯一真理庫與規範"
globs: "**/*.{html,js}"
---

# 🛡️ 官方三勾核驗標章規範 (Verification Badges Invariant)

<RULE[verification_badges_spec_invariant]>
1. ⛔【嚴禁行為 (Anti-Pattern)】：
   - 嚴禁在任何頁面手寫或內聯拼裝徽章 SVG 代碼，嚴禁私自縮放幾何尺寸或微調路徑座標。
   - 嚴禁自創形狀、文字標籤，嚴禁使用易混淆之 Tier 數字編號。
2. ✅【唯一實體檔案真理庫 (Physical SSOT)】：
   - 候選人端（盾牌）與雇主端（冠冕）共 16 款黑白雙模 SVG 統一歸檔於：`assets/svg/badges/`。
   - 包含：`candidate_c{0..3}_{dark|light}.svg` 與 `employer_c{0..3}_{dark|light}.svg`。
   - 任何頁面（含 preview、proposal、jobs 等）引用徽章，一律強制引用上述實體檔案，達成零手寫幻覺。
</RULE[verification_badges_spec_invariant]>
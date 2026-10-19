---
trigger: model_decision
description: "TrustCV 官方三勾信任標章/徽章 (候選人盾牌 / 雇主冠冕 0~3 勾) 唯一真理庫與規範"
globs: "**/*.{html,js}"
---

# 🛡️ 官方三勾核驗標章規範 (Verification Badges Invariant)

<RULE[verification_badges_spec_invariant]>
1. ⛔【嚴禁行為 (Anti-Pattern)】：
   - 嚴禁自創形狀與文字標籤，嚴禁使用易混淆之 Tier 數字編號。
2. ✅【雙軌標準做法 (Standard Practice)】：
   - 候選人端（個人核驗）：強制採用 badges_preview.html 之「盾牌 (Shield)」0~3 勾體系。
   - 雇主職缺端（企業核驗）：強制採用 employer_badges_preview.html 之「冠冕 (Crown)」0~3 勾體系。
   - 兩者色彩、亮度、漸層 100% 相同，黑白雙模強制向量自適應（白主題採用白瓷清透金綠，嚴禁黑炭底）。
</RULE[verification_badges_spec_invariant]>
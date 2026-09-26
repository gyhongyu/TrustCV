# SOP-OPS-003: 候選人遠端技術初審、環境調測與赴台意願評估作業手冊

> **文件代號**：`SOP-OPS-003`
>
> **關聯管線**：`STAGE_02_credential_verification` 至 `STAGE_05_final_interview`
>
> **適用角色**：Teaforia 人工初審專家（太太/資深人資）、技術顧問、未來 `Interview_Screening_Agent`
>
> **系統節點**：`cv.teaforia.in`
>
> **生效日期**：2026 年 9 月

---

## 1. 目的與核心排查原則 (Purpose & Anti-Fraud Principles)

### 1.1 核心痛點：印度遠端面試常見弊端
在印度工程人才招募中，遠端視訊面試存在極高之失真風險，常見作弊與灌水樣態包括：
1. **替考與影子面試（Proxy / Impersonation Interview）**：由槍手於鏡頭外代答、透過耳麥即時提示，或由高階工程師替初階候選人上線應試，待實際到職時「換人上工」。
2. **AI 工具輔助作弊（AI Lip-Sync & Teleprompter）**：候選人於第二螢幕架設即時語音轉文字與 LLM 答案生成外掛（如 Interview Coder），朗讀預製解答。
3. **自述能力與動手能力嚴重脫節**：履歷充斥「PLC 架構設計」、「自動化產線整合」等高階術語，實務上僅具備線路插拔或基礎操作經驗。
4. **家庭阻力與海外適應力不足**：未經配偶或父母同意擅自投遞，錄用後因家庭抗拒拒絕履新；或因飲食（嚴格素食）、氣候與文化隔閡在台短期離職。

### 1.2 初審原則：15 分鐘精準快篩（The 15-Minute Precision Screen）
Teaforia 的初審目標不是取代台灣企業的技術複試，而是擔任**「真實性與基本盤過濾器」**。
* **基本鐵律**：
  * **「本人未持原件護照於鏡頭前比對者，視為未核實。」**
  * **「無法用英語流暢解釋其履歷中任一專案故障排除細節者，不予列入綠標。」**
  * **「家庭直系親屬未明確同意赴台者，不予提報 invic。」**

---

## 2. 視訊環境準備與防替考調測標準 (Anti-Impersonation Benchmark)

初審會議一律採用 Google Meet 或專屬加密視訊房間，面試開始前 3 分鐘內必須完成以下「防替考環境驗證」：

```
[候選人連線] ──> [即時人臉比對] ──> [視線與環境掃描] ──> [耳麥與延遲檢測] ──> [進入正式問答]
                    (護照原件)          (排除提示槍手)       (排除口譯代答)
```

### 2.1 環境調測檢核表 (Pre-Flight Checklist)

| 檢核項目 | 標準規格 | 異常處置標準 |
| :--- | :--- | :--- |
| **鏡頭視角與光線** | 面部光線均勻，五官清晰可辨；肩膀與雙手必須維持在畫面內。 | 逆光、面部陰暗或刻意遮蔽視角者，要求調整燈光後始得開始。 |
| **背景與音訊品質** | 安靜獨立房間；背景雜音低於 45 分貝 (dB)；音訊無回音。 | 禁止在網咖、嘈雜工廠車間或室外應試；發現嚴重噪音即刻改期。 |
| **雙螢幕與提詞檢測** | 候選人視線應直視攝影機，禁止異常斜視或頻繁閱讀側邊螢幕。 | 若發現眼神固定閱讀螢幕文字，面試官隨機打斷並要求其移開視線。 |
| **360 度環境掃查** | 對於高疑似槍手協助之案例，面試官有權要求其將鏡頭環視房間一週。 | 若發現身旁有其他技術人員同席，取消其當次面試資格並列入黃標。 |

### 2.2 防替考三步驗證法 (3-Step Identity Verification)
1. **原件展示**：要求候選人將護照相片頁置於鏡頭前，核對護照號碼後四碼與出生年月日。
2. **人臉即時特徵比對**：核對鏡頭前人臉與護照相片、畢業證書照片之骨骼特徵（耳朵形狀、眼距）。
3. **截圖存證**：系統截取一張「候選人手持護照之高解析度畫面」，計算雜湊值後寫入核驗檔案庫（存證欄位：`identity_facial_match_passed = true`）。

---

## 3. 結構化初審流程 (Structured 15-Minute Pipeline)

初審嚴格控制在 15~20 分鐘之內，避免漫無邊際之交談。時間分配如下：

```
[00:00 - 02:00] 身分查驗與設備調測 (Identity & Hardware Check)
[02:00 - 06:00] 語言表達與專案真偽摸底 (English Fluency & Project Deep-Dive)
[06:00 - 11:00] 機電/技術現場情境抽測 (Technical Troubleshooting Scenario)
[11:00 - 15:00] 赴台意願、家庭共識與薪資錨定 (Relocation Readiness & Commitment)
```

---

## 4. 語言溝通評級標準 (English Communication Benchmark)

印度工程師英文腔調（Mother Tongue Influence, MTI）差異極大。初審面試官依據以下客觀指標給予等級評定：

### 4.1 評級矩陣

| 等級代碼 | 評定標準 | 台灣企業適用場景 | 系統處置 |
| :--- | :--- | :--- | :--- |
| **`GRADE_A_FLUENT`**<br>(無障礙流暢) | 語速自然、文法正確；具備優異的技術詞彙量；能精確陳述因果邏輯；幾乎無 MTI 障礙。 | 適合跨國研發中心、半導體外商、需頻繁與台籍主管匯報之專案。 | **綠標優先推薦**。 |
| **`GRADE_B_OPERATIONAL`**<br>(工作級清楚) | 具備明顯印度腔調，但發音清楚、節奏適中；能以常用單字與手勢圖表完整解釋工作流程。 | 適合自動化產線維護、設備調測、機電現場工程師（符合多數製造業標準）。 | **合格放行提報**。 |
| **`GRADE_C_BELOW_STANDARD`**<br>(未達標準) | 語速極快且發音黏糊；文法破碎；無法聽懂標準國際英文發問，需反覆重複提問。 | 溝通成本過高，進入台灣工廠極易引發工安或製程指令誤解。 | **直接判定淘汰**。 |

---

## 5. 機電與自動化工程實務抽測試題庫 (Technical Drill-Down Bank)

面試官無需為資深技術專家，但須依據標準題目與「及格/不及格特徵」，針對候選人之專案經歷抽問 2~3 題：

### 模組 A：PLC 與自動化控制 (Automation & PLC Specialist)
* **抽測試題 1**：「當感測器（Proximity Sensor）訊號正常輸入 PLC 輸入端子，但產線氣缸未依序動作時，你的標準除錯（Troubleshooting）順序是什麼？」
  * **及格回答特徵**：主動提及依序排查：檢查 PLC 輸入 LED 燈號 ➔ 查看階梯圖（Ladder Logic）監控狀態 ➔ 檢查輸出繼電器/電磁閥端子接線 ➔ 測量氣閥 24VDC 供電與氣壓管路。
  * **灌水背誦特徵**：只含糊回答「我會打開軟體改程式」或「更換零件」，無法描述電氣與機構之交互因果關係。

* **抽測試題 2**：「請簡述 NPN (Sink) 與 PNP (Source) 感測器在電路接線上的本質差異？」
  * **及格回答特徵**：能快速講出負載（Load）接於正極或負極，信號觸發時輸出的是 0V (接地/GND) 還是 24V (電源/VCC)。

### 模組 B：線束、機構電路與配電 (Wiring Harness & Electromechanical)
* **抽測試題 1**：「在工業配電盤或線束（Wiring Harness）中，若發生高頻電氣雜訊（Noise/EMI）干擾模擬信號（Analog 4-20mA / 0-10V），你如何處理？」
  * **及格回答特徵**：提及使用屏蔽雙絞線（Shielded Twisted Pair）、單端接地（Single-point Grounding）、動力線與信號線分開走線槽、加裝鐵氧體磁環（Ferrite Core）。
  * **加分特徵**：能指出「雙端接地容易形成地迴路（Ground Loop）干擾」者給予加分。

* **抽測試題 2**：「如何判定壓接端子（Crimping Terminal）的品質是否合格？」
  * **及格回答特徵**：能提及壓接高度（Crimp Height）、拉拔力測試（Pull-force test）、線芯無外露過長且無剪斷銅絲。

---

## 6. 赴台穩定度與生活適應力評核 (Taiwan Relocation Readiness)

此環節為預防候選人「拿了 Offer 卻反悔」或「赴台 3 個月即離職」的關鍵防線。

```
[護照有效期限檢核] ──> [家庭支持度確認] ──> [薪資購買力認知] ──> [華語學習意願]
   (須大於 18 個月)        (直系親屬已知情)      (扣稅後實質盈餘)       (invic 培訓銜接)
```

### 6.1 查核指標與話術表

| 查核維度 | 面試官提問話術 | 檢核標準（合格線） | 風險紅線（即刻淘汰） |
| :--- | :--- | :--- | :--- |
| **護照有效性** | "Please show your passport expiry date on camera." | 距預計啟程日效期必須大於 **18 個月**。 | 護照過期或效期低於 12 個月（印度換發護照常耗時 2~3 個月）。 |
| **家庭支持共識** | "Does your spouse/parents know you are moving to Taiwan for 2~3 years? How did they react?" | 直系家屬完全知情並全力支持；配偶已有長期安頓規劃。 | 家屬不知情、家有重病長輩無人照料、配偶強烈反對出國。 |
| **薪資期望錨定** | "Your offered range is TWD 55,000~65,000 gross. After tax and food, how much INR do you expect to send home?" | 清楚理解台灣所得稅率（前半年 18%、滿半年 5%）、勞健保自付額，儲蓄預期客觀。 | 誤以為全額薪資皆可淨匯回印度；期待與台灣行情差距超過 30%。 |
| **生活適應力** | "Taiwan cuisine is predominantly non-veg and pork-based. What are your dietary constraints?" | 能適應外食，若為素食者（Vegetarian）能接受自煮或蛋奶素。 | 嚴格耆那教素食（Jain Vegetarian，不吃根莖類），抗拒共用廚具。 |
| **華語培訓意願** | "Our Taiwan partner invic provides online Mandarin courses. Are you willing to spend 3 hours weekly learning basic Chinese?" | 展現高度興趣，願意於在印等待簽證期間完成 30 小時基礎會話課程。 | 態度傲慢，堅持「台灣工程師必須配合我講英文，我拒絕學中文」。 |

---

## 7. 面試評估表產出與系統流轉 (Interview Dossier Synthesis)

面試結束後 30 分鐘內，面試官必須於 `cv.teaforia.in` 系統完成初審記分卡（Scorecard）登錄：

### 7.1 綜合評分計算規則 (Overall Scoring Calculation)

初審綜合評分採百分制計算，加權公式如下：

```text
綜合評分 (Final Score) = (技術真實度得分 * 0.40) + (英文表達得分 * 0.30) + (赴台意願得分 * 0.30)
```

各項指標評估標準（均採 100 分滿分制）：
* **技術真實度得分 (Tech Integrity Score，權重 40%)**：專案真實經歷、故障排除除錯邏輯、機電實務回答之專業度。
* **英文表達得分 (English Fluency Score，權重 30%)**：技術詞彙掌握度、語速節奏、邏輯條理性及 MTI 腔調可理解度。
* **赴台意願得分 (Relocation Readiness Score，權重 30%)**：護照效期合規性、直系家屬支持度、薪資儲蓄客觀認知、海外生活適應力。

### 7.2 判定結果流轉邏輯

```
                ┌── [Final Score >= 80 且無紅旗] ──> 【綠標：GREEN_VERIFIED_READY】 ──> 官方提報 invic
                │
[計算綜合評分] ──┼── [65 <= Score < 80 具瑕疵] ───> 【黃標：YELLOW_REVIEW_NEEDED】 ──> 附註專人複查
                │
                └── [Score < 65 或觸發作弊紅旗] ──> 【紅標：RED_FRAUD_REJECTED】 ───> 封鎖列入黑名單
```

### 7.3 面試官摘要範例 (Executive Summary Template)
登錄於系統之主管摘要必須具體客觀，禁止使用模糊修辭：

```markdown
【候選人】Rajesh Kumar Sharma (ID: TEA-2026-IND-0088)
【評定等級】綠標（Score: 88.5 / English: Grade B Operational）
【技術特徵】
  - 具備 4 年 Uno Minda 汽車線束配電實務，現場除錯邏輯清晰。
  - 能準確解釋 24VDC 感測器 NPN/PNP 迴路與壓接端子拉拔力測試規範。
【外派條件】
  - 護照效期至 2031 年（完全合規）。
  - 已婚，配偶為軟體工程師，雙方已達成共識由其赴台工作 3 年。
  - 飲食為一般葷食（Non-Veg），生活適應力良好。
  - 同意參與 invic 每週 3 小時之基礎華語線上銜接培訓。
【推薦結論】建議直接放行 STAGE_03，提報 invic 安排台灣企業複試。
```

---

## 8. AI 代理遠端評估規格 (AI Agent Implementation Spec)

在 `cv.teaforia.in` 引入語音與視訊 AI 代理（`Interview_Screening_Agent`）後，系統後端依照以下規格執行輔助檢測：

```yaml
ai_interview_screening_spec:
  audio_video_telemetry:
    fps_minimum: 15
    audio_sample_rate_hz: 16000
    latency_threshold_ms: 300
    
  fraud_detection_rules:
    rule_impersonation_check:
      model: "face_recognition_resnet"
      metric: "cosine_similarity(video_frame_face, passport_photo)"
      threshold_pass: 0.85
      on_failure: "FLAG_FRAUD_FORGERY"

    rule_teleprompter_detection:
      metric: "horizontal_saccade_movement_rate_per_sec"
      threshold_anomaly: "> 2.5 saccades/sec with zero pitch variation"
      action: "TRIGGER_RANDOM_QUESTION_INTERRUPT"

  fluency_assessment_pipeline:
    stt_engine: "Whisper-Large-V3"
    metrics_computed:
      - "wpm (words per minute)" # 常規應介於 110 - 150
      - "filler_words_ratio"      # um, uh 比例低於 8%
      - "grammatical_error_rate"
    mapping_to_grade:
      "A": "wpm >= 110 AND grammar_score >= 0.85"
      "B": "wpm >= 90 AND grammar_score >= 0.70"
      "C": "wpm < 90 OR grammar_score < 0.70"
```
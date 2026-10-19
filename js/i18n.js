/**
 * Project TrustCV Multi-Language Translation Engine
 * Supported Languages: 'en' | 'zh-TW'
 * HARD INVARIANT: Strictly NO Hindi / NO Simplified Chinese. Pure English or Pure Traditional Chinese.
 */

export const I18N_DICTIONARY = {
  en: {
    app_title: "TrustCV | Cross-Border Engineering Talent Platform",
    app_subtitle: "Verified Mechatronics, Automation and Semiconductor Talent Dossier Platform",
    by_teaforia: "BY TEAFORIA",
    search_placeholder: "Search PLC, Semiconductor, Power...",
    filter_all: "All Jobs",
    filter_plc: "PLC Automation",
    filter_semi: "Semiconductor",
    filter_power: "Power Electronics",
    employer_sanitized: "Sanitized Employer:",
    salary_range: "Monthly Base Salary",
    location_openings: "Location / Openings",
    view_details: "View Details",
    view_apply_btn: "View Details & Apply",
    back_btn: "Back",
    exclusive_180d: "180-Day Non-Circumvention Protection",
    employer_mask_title: "Employer Information (Triple-Gate Masked)",
    employer_mask_desc: "Legal entity name will be automatically decrypted after Level-2 verification, signing anti-bypass agreement, and official interview confirmation.",
    key_requirements: "Key Technical Requirements",
    apply_with_profile: "Apply with My TrustCV Profile",
    applied_success: "Application submitted successfully! Audit log generated.",
    apply_failed: "Application submission failed, please try again.",
    my_cv_title: "Verified Candidate Dossier",
    my_cv_subtitle: "Dual-track verified talent profile for Taiwan enterprises",
    verification_level: "Level-2 Dual Verified",
    full_name: "Full Legal Name",
    nationality_degree: "Nationality & Degree",
    total_exp: "Verified Work Experience",
    tax_verified: "Form 16 & Relieving Letter Verified",
    verified_skills: "Verified Technical Skills",
    audit_summary_title: "Lead Auditor Executive Summary",
    pipeline_tracker: "Verification & Referral Pipeline",
    exp_edu_requirement: "Experience & Education",
    years_experience: "Years",
    bachelor_degree: "Bachelor of Engineering",
    current_applicant: "Current Applicant:",
    protection_notice: "Protected by 180-day non-circumvention agreement • Strict de-identification before audit approval",
    candidate_basic_info: "Candidate Attributes",
    proxy_email: "Secure Proxy Email",
    passport_validity: "Passport Validity",
    months_remaining: "Months Remaining",
    verified_badge: "TEAFORIA VERIFIED BADGE",
    audit_score: "Score",
    audit_check_aicte: "AICTE Accredited Degree Verified",
    audit_check_form16: "Form 16 Tax Return Verified",
    audit_check_relieving: "Relieving Letter MCA Verified",
    audit_check_video: "Live Video Passport Match Verified",
    auditor_label: "Lead Auditor:",
    audit_date_label: "Verification Date:",
    dossier_dual_track_ready: "Dual-Track Dossier Formats (Source EN / Taiwan Traditional Chinese) Fully Audited",
    nav_jobs: "Jobs",
    nav_cv: "My CV",
    nav_status: "Status",
    nav_vault: "Vault",
    apply_modal_title: "Direct Job Application",
    applying_job: "Applying for:",
    candidate_name: "Candidate Name",
    email_proxy: "Email Address",
    phone_masked: "Phone Number",
    resume_file: "Attach Resume File (PDF / DOCX)",
    binary_file_isolation: "Binary files are isolated in Google Drive, never committed to Git",
    submit_application: "Confirm & Submit Application",
    cancel: "Cancel",
    vault_title: "Google Drive Secure Vault",
    vault_desc: "Candidate original resumes, Form 16 tax records, and educational credentials are fully isolated in Google Drive, protected by 180-day non-circumvention terms.",
    pipeline_sub: "Aligned with RFC 5322 Ingestion Node Active",
    score_unit: "Pts",
    status_completed: "COMPLETED",
    status_in_progress: "IN_PROGRESS",
    status_pending: "PENDING",
    vault_node_status: "Cloud Vault Node: Drive-Partition-Ready",
    install_btn: "Install App",
    install_banner_title: "Install TrustCV App",
    install_banner_desc: "Add to home screen for faster loading & offline access.",
    install_banner_cta: "Install Now",
    ios_install_title: "Install TrustCV on iPhone",
    ios_install_desc: "Add this app to your Home Screen for a full-screen, native experience with offline access.",
    ios_step_1: "Tap the Share button at the bottom of Safari",
    ios_got_it: "Got it",
    // Verification Badges SSOT (Pure English - Triple Check System)
    badges_page_title: "TrustCV Verification Badges Specification",
    badges_banner_tag: "Talent Authenticity Standard",
    badges_banner_title: "Triple-Check Verification Badges",
    badges_banner_desc: "Directly matching the 3 checks of the TrustCV brandmark. Zero mental overhead: 3 checks for full video audit, 2 checks for database verified, 1 check for document attached, and no checks for self-declared.",
    badge_c3_title: "Certified (3 Checks ✔✔✔)",
    badge_c3_badge: "Integrity +40 · Top Pick",
    badge_c3_desc: "Conducted via direct high-definition video session with consultants, cross-checking physical seals, original diplomas, and passport biometric integrity. Top recommendation.",
    badge_c3_alert: "Certified (3 Checks): Consultant live video examined official seals, original diploma, and passport identity.",
    badge_c2_title: "Verified (2 Checks ✔✔)",
    badge_c2_badge: "Integrity +30",
    badge_c2_desc: "Cross-referenced with official tax returns, registered business databases, or verified via previous employer HR channels.",
    badge_c2_alert: "Verified (2 Checks): Verified via official tax filing records or registered corporate channels.",
    badge_c1_title: "Documented (1 Check ✔)",
    badge_c1_badge: "Integrity +15",
    badge_c1_desc: "Candidate uploaded original certificate scans or PDFs to candidate personal cloud vault, parsed into structured profile attributes.",
    badge_c1_alert: "Documented (1 Check): Original document attached and uploaded to candidate cloud vault.",
    badge_c0_title: "Unverified (0 Checks)",
    badge_c0_weight: "Baseline 1.0x",
    badge_c0_desc: "Manually declared by candidate without linked certificate or file evidence. Rendered with dashed outline to indicate evidence is pending.",
    badge_c0_alert: "Unverified (0 Checks): Self-declared entry without supporting documents.",
    badges_dev_guide_title: "Developer & Agent Guide",
    badges_dev_guide_desc: "All verification icons across TrustCV must strictly consume the SVG geometry and 0-to-3 check definitions here. Ad-hoc styles are prohibited."
  },
  "zh-TW": {
    app_title: "TrustCV | 海外就業 | 免費履歷管理",
    app_subtitle: "免費海外工作機會推薦，免費多平台履歷管理服務，免費履歷健診",
    by_teaforia: "BY TEAFORIA",
    search_placeholder: "搜尋 PLC、半導體設備、電力電子...",
    filter_all: "全部職缺",
    filter_plc: "PLC 電控自動化",
    filter_semi: "半導體晶圓設備",
    filter_power: "電力電子研發",
    employer_sanitized: "脫敏終端雇主：",
    salary_range: "保障月薪區間",
    location_openings: "工作地點 / 名額",
    view_details: "查看詳情",
    view_apply_btn: "檢視詳情與一鍵直投",
    back_btn: "返回",
    exclusive_180d: "180 天排他性防繞道推薦保護",
    employer_mask_title: "雇主資訊 (前台三道門檻脫敏展示)",
    employer_mask_desc: "真實法定雇主全名將於通過綠標初審、簽署獨家切結並獲勝拓正式面試確認後自動解密。",
    key_requirements: "核心專業技能要求",
    apply_with_profile: "以我的 TrustCV 檔案一鍵直投",
    applied_success: "申請投遞成功！已生成區塊鏈等級存證紀錄。",
    apply_failed: "投遞失敗，請重試",
    my_cv_title: "個人雙重核驗推薦檔案",
    my_cv_subtitle: "符合台灣製造業規格標準化人才包",
    verification_level: "二階原件核實 ✕ 真人視訊初審",
    full_name: "護照法定全名",
    nationality_degree: "國籍與最高學歷",
    total_exp: "客觀查證工作年資",
    tax_verified: "官方所得稅單 Form 16 驗訖 ✔",
    verified_skills: "官方核實專業技術組",
    audit_summary_title: "專案審核主管綜合推薦意見",
    pipeline_tracker: "六階段交付管線追蹤",
    exp_edu_requirement: "經驗與學歷門檻",
    years_experience: "年資",
    bachelor_degree: "工科正規學士",
    current_applicant: "目前投遞身分：",
    protection_notice: "受 180 天排他權保護 • 通過初審前絕對脫敏",
    candidate_basic_info: "候選人基本屬性",
    proxy_email: "安全轉發信箱 (防繞道)",
    passport_validity: "護照剩餘效期",
    months_remaining: "個月 (>18M 門檻)",
    verified_badge: "TEAFORIA 官方綠標認證徽章",
    audit_score: "分",
    audit_check_aicte: "學歷 AICTE 官冊核實",
    audit_check_form16: "Form 16 稅單原件核實",
    audit_check_relieving: "離職信 MCA 存續核實",
    audit_check_video: "真人持護照人臉比對",
    auditor_label: "初審官：",
    audit_date_label: "確權日期：",
    dossier_dual_track_ready: "雙軌推薦格式 (EN 原始原檔 / 台灣繁中在地化) 審計合格",
    nav_jobs: "精選職缺",
    nav_cv: "個人履歷",
    nav_status: "投遞進度",
    nav_vault: "安全保險庫",
    apply_modal_title: "職缺即開即投申請",
    applying_job: "申請職缺：",
    candidate_name: "候選人姓名",
    email_proxy: "聯絡電子郵件",
    phone_masked: "聯絡電話",
    resume_file: "附加履歷檔案 (PDF / DOCX)",
    binary_file_isolation: "二進位檔案全自動隔離轉存 Google Drive，絕不上傳 Git",
    submit_application: "確認投遞申請",
    cancel: "取消",
    vault_title: "Google Drive 檔案保險庫隔離區",
    vault_desc: "候選人原始履歷、所得稅 Form 16 與學歷原件全數儲存於 Google Drive 隔離區，受 180 天排他權嚴密保護，絕不污染代碼庫。",
    pipeline_sub: "對齊六階段存證交付狀態機",
    score_unit: "分",
    status_completed: "已完成",
    status_in_progress: "審理中",
    status_pending: "待處理",
    vault_node_status: "雲端保險庫節點：硬體隔離就緒",
    install_btn: "安裝應用",
    install_banner_title: "安裝 TrustCV App",
    install_banner_desc: "新增至手機桌面，極速流暢並享有離線支援。",
    install_banner_cta: "立即安裝",
    ios_install_title: "在 iPhone 上安裝 TrustCV",
    ios_install_desc: "將此應用新增至主畫面，即可享有全螢幕 Native App 體驗與極速離線支援。",
    ios_step_1: "點擊 Safari 底部工具列的「分享」圖示",
    ios_got_it: "我知道了",
    // Verification Badges SSOT (純繁體中文 - 三勾核驗體系，嚴禁夾雜英文)
    badges_page_title: "TrustCV 官方核驗標章體系",
    badges_banner_tag: "人才真實性審查標準",
    badges_banner_title: "三勾信任階梯認證體系",
    badges_banner_desc: "直接呼應 TrustCV 標誌的三層勾標，徹底消除思考成本：滿級 3 勾為視訊正本認證、2 勾為官方查核通過、1 勾為已附佐證檔案，無勾為純手填申報。",
    badge_c3_title: "官方認證（滿級 3 勾 ✔✔✔）",
    badge_c3_badge: "誠信分 +40 · 全場最高推薦",
    badge_c3_desc: "跨國顧問進行遠程高清視訊連線，在鏡頭前親檢畢業證書鋼印浮水印、比對護照本人防偽防替考。呈現流金電光立體盾，全場最高推薦！",
    badge_c3_alert: "官方認證（3 勾）：顧問視訊親檢畢業證書鋼印與護照本人正本核實。",
    badge_c2_title: "官方查核（2 勾 ✔✔）",
    badge_c2_badge: "誠信分 +30",
    badge_c2_desc: "經政府所得稅申報單、公司註冊處在案記錄或前雇主官方管道照會確認無誤。呈現高彩度實心翡翠綠盾，代表第三方數據背書。",
    badge_c2_alert: "官方查核（2 勾）：已通過政府稅單或官方企業資料庫真實性查證。",
    badge_c1_title: "已附檔案（1 勾 ✔）",
    badge_c1_badge: "誠信分 +15",
    badge_c1_desc: "候選人已完成拍照或上傳原檔至個人雲端保險庫，經邊緣運算提取學校、科系與年份。呈現柔和淡綠微光盾，不刺眼。",
    badge_c1_alert: "已附檔案（1 勾）：已拍照或上傳原檔至個人雲端硬碟專屬資料夾。",
    badge_c0_title: "未核驗（0 勾）",
    badge_c0_weight: "基礎分 1.0 倍",
    badge_c0_desc: "候選人手動打字輸入，尚未關聯任何證書照片或檔案原件。呈現冷灰虛線微暗盾，提示雇主此項目未經檔案比對。",
    badge_c0_alert: "未核驗（0 勾）：未上傳佐證文件，僅候選人單方申報。",
    badges_dev_guide_title: "開發者與代理人規範",
    badges_dev_guide_desc: "全系統內凡涉及核驗圖標，強制引用本頁面之向量代碼與 0~3 勾定義，嚴禁自行發明非標準樣式。"
  }
};

export class I18nService {
  constructor() {
    this.currentLang = this.detectInitialLanguage();
    this.listeners = [];
  }

  detectInitialLanguage() {
    // 優先權 1: 使用者手動儲存之偏好
    if (typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem('trustcv_lang');
      if (saved === 'en' || saved === 'zh-TW') {
        return saved;
      }
    }

    // 優先權 2: 依使用者瀏覽器/系統環境語言自適應切換
    if (typeof navigator !== 'undefined') {
      const browserLang = (navigator.language || (navigator.languages && navigator.languages[0]) || '').toLowerCase();
      // 中文語系環境自動適配為台灣繁中
      if (browserLang.startsWith('zh')) {
        return 'zh-TW';
      }
      // 非中文環境（英文、印度各邦、歐美海外環境）一律自適應為英文
      return 'en';
    }

    return 'zh-TW';
  }

  setLanguage(lang) {
    if (I18N_DICTIONARY[lang]) {
      this.currentLang = lang;
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('trustcv_lang', lang);
      }
      this.notifyListeners();
    }
  }

  getLanguage() {
    return this.currentLang;
  }

  t(key) {
    const dict = I18N_DICTIONARY[this.currentLang] || I18N_DICTIONARY['zh-TW'];
    return dict[key] || key;
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notifyListeners() {
    this.listeners.forEach(fn => fn(this.currentLang));
  }
}

export const i18n = new I18nService();


/**
 * TrustCV Local Development Mock Fixtures & Data Bridge
 * Single Source of Truth: aligned with specs/03_data_schemas/
 * Strictly adheres to schema contracts (No invented fields, No Hindi)
 */

export const MOCK_JOBS = [
  {
    "jd_reference_id": "TW-AUT-202610-01",
    "status": "ACTIVE_SOURCING",
    "metadata": {
      "schema_version": "1.0.0",
      "source_partner": "INVIC_GLOBAL",
      "received_timestamp_utc": "2026-10-10T08:00:00Z",
      "target_hire_date": "2026-12-01"
    },
    "confidential_client_profile": {
      "company_legal_name": "台灣半導體自動化設備股份有限公司",
      "brand_name_english": "Taiwan Semiconductor Automation Corp.",
      "tax_id_unified": "12345678",
      "stock_ticker": "6669",
      "factory_address_full": "新竹科學園區研發六路8號",
      "hr_contact_person": {
        "name": "陳經理",
        "email": "hr.recruit@invic.com.tw",
        "phone": "+886-3-5770000"
      },
      "is_unmasked_to_candidate": false
    },
    "public_sanitized_profile": {
      "industry_tier_narrative": "台灣前三大半導體晶圓傳送與自動化設備龍頭上市集團",
      "industry_tier_narrative_en": "Top 3 Tier-1 Semiconductor Wafer Handling & Automation Listed Group in Taiwan",
      "geographic_cluster": "新竹科學園區與台中高科技聚落",
      "geographic_cluster_en": "Hsinchu Science Park and Taichung High-Tech Cluster",
      "target_region_city": "Hsinchu"
    },
    "job_specifications": {
      "role_category": "AUT",
      "job_title_sanitized": "資深 PLC 電控自動化工程師 (半導體設備)",
      "job_title_en": "Senior PLC Automation Engineer (Semiconductor)",
      "openings_count": 2,
      "minimum_experience_years": 3,
      "minimum_degree_level": "BACHELORS",
      "primary_technical_skills": [
        "西門子 S7-1500",
        "SCADA 監控系統",
        "伺服馬達驅動定位",
        "EtherCAT 通訊協定"
      ],
      "primary_technical_skills_en": [
        "Siemens S7-1500 (TIA Portal)",
        "SCADA Supervisory System",
        "Servo Motion Tuning",
        "EtherCAT Fieldbus Protocol"
      ],
      "secondary_skills": [
        "電機電路圖繪製",
        "人機介面規劃",
        "產線調試與驗收"
      ],
      "secondary_skills_en": [
        "AutoCAD Electrical",
        "HMI Programming",
        "On-Site Commissioning"
      ],
      "language_requirements": {
        "english_proficiency_minimum": "GRADE_B_OPERATIONAL",
        "chinese_proficiency_required": false
      },
      "contract_tenure_years": 3
    },
    "compensation_and_benefits": {
      "monthly_base_salary_twd_min": 75000,
      "monthly_base_salary_twd_max": 95000,
      "monthly_base_salary_inr_estimated_min": 195000,
      "monthly_base_salary_inr_estimated_max": 247000,
      "statutory_insurance_covered": true,
      "accommodation_support": {
        "type": "COMPANY_DORMITORY_SUBSIDIZED",
        "allowance_monthly_twd": 5000
      },
      "airfare_support": "ROUND_TRIP_PROVIDED"
    },
    "deidentification_audit": {
      "auditor_type": "AI_AGENT",
      "auditor_identifier": "JD_Deidentification_Agent_v1",
      "sanitized_timestamp_utc": "2026-10-10T09:15:00Z",
      "levenshtein_similarity_to_raw": 0
    }
  },
  {
    "jd_reference_id": "TW-ELE-202610-02",
    "status": "ACTIVE_SOURCING",
    "metadata": {
      "schema_version": "1.0.0",
      "source_partner": "INVIC_GLOBAL",
      "received_timestamp_utc": "2026-10-11T02:30:00Z",
      "target_hire_date": "2026-12-15"
    },
    "confidential_client_profile": {
      "company_legal_name": "宏達電力電子工業股份有限公司",
      "brand_name_english": "Grand Power Electronics Corp.",
      "tax_id_unified": "87654321",
      "stock_ticker": "2308",
      "factory_address_full": "台中市西屯區工業區一路20號",
      "hr_contact_person": {
        "name": "李專員",
        "email": "talent@invic.com.tw",
        "phone": "+886-4-23590000"
      },
      "is_unmasked_to_candidate": false
    },
    "public_sanitized_profile": {
      "industry_tier_narrative": "台灣知名工業電源與太陽能變流器上市大廠",
      "industry_tier_narrative_en": "Leading Listed Industrial Power Supply & Photovoltaic Inverter Manufacturer in Taiwan",
      "geographic_cluster": "台中精密機械園區聚落",
      "geographic_cluster_en": "Taichung Precision Machinery Cluster",
      "target_region_city": "Taichung"
    },
    "job_specifications": {
      "role_category": "ELE",
      "job_title_sanitized": "大功率電力電子硬體研發工程師",
      "job_title_en": "High-Power Electronics R&D Engineer",
      "openings_count": 1,
      "minimum_experience_years": 4,
      "minimum_degree_level": "BACHELORS",
      "primary_technical_skills": [
        "電力電子硬體研發",
        "大功率變流器設計",
        "電路板佈線佈局",
        "熱流模擬分析"
      ],
      "primary_technical_skills_en": [
        "Power Electronics Hardware",
        "High-Power Inverter Design",
        "PCB Layout Engineering",
        "Thermal Simulation & Analysis"
      ],
      "secondary_skills": [
        "數值模擬計算",
        "電磁相容除錯",
        "數位訊號控制器"
      ],
      "secondary_skills_en": [
        "MATLAB Simulink Modeling",
        "EMC Compliance Debugging",
        "DSP Controller Firmware"
      ],
      "language_requirements": {
        "english_proficiency_minimum": "GRADE_B_OPERATIONAL",
        "chinese_proficiency_required": false
      },
      "contract_tenure_years": 2
    },
    "compensation_and_benefits": {
      "monthly_base_salary_twd_min": 80000,
      "monthly_base_salary_twd_max": 110000,
      "monthly_base_salary_inr_estimated_min": 208000,
      "monthly_base_salary_inr_estimated_max": 286000,
      "statutory_insurance_covered": true,
      "accommodation_support": {
        "type": "MONTHLY_HOUSING_ALLOWANCE",
        "allowance_monthly_twd": 8000
      },
      "airfare_support": "ROUND_TRIP_PROVIDED"
    },
    "deidentification_audit": {
      "auditor_type": "HUMAN_OPERATOR",
      "auditor_identifier": "Michael_SOP_Officer",
      "sanitized_timestamp_utc": "2026-10-11T03:00:00Z",
      "levenshtein_similarity_to_raw": 0
    }
  }
];

export const MOCK_CANDIDATES = [
  {
    "dossier_id": "TEA-2026-IND-0088",
    "metadata": {
      "schema_version": "1.0.0",
      "source_system": "cv.teaforia.in",
      "delivery_timestamp_utc": "2026-10-12T09:30:00Z",
      "partner_recipient": "INVIC_GLOBAL",
      "verification_level": "LEVEL_2_DUAL_VERIFIED",
      "digital_fingerprint_sha256": "8f4b2c1e9a78d05c6e832145b4c129e7a88432b12398cd6543217ef09876abcd"
    },
    "candidate_profile": {
      "full_name": "Rajesh Kumar Sharma",
      "full_name_zh": "拉傑許·夏馬",
      "date_of_birth": "1996-05-18",
      "gender": "MALE",
      "contact_masked": {
        "email_proxy": "rajesh.s0088@candidate.teaforia.in",
        "phone_masked": "+91-9876****12",
        "current_location_city": "Bengaluru",
        "current_location_state": "Karnataka"
      },
      "identity_documents": {
        "passport_number_masked": "Z58****9",
        "passport_expiry_date": "2029-12-31",
        "passport_valid_months_remaining": 38,
        "passport_verified": true,
        "pan_card_matched_with_tax": true
      },
      "target_job_spec": {
        "target_role_category": "AUTOMATION_PLC_SPECIALIST",
        "jd_reference_id": "TW-AUT-202610-01",
        "willing_to_relocate_taiwan": true,
        "expected_ctc_twd_monthly": 60000,
        "notice_period_days": 30
      }
    },
    "verified_credentials": {
      "education_records": [
        {
          "degree_level": "BACHELORS",
          "degree_name": "Bachelor of Engineering in Mechatronics",
          "institution_name": "Visvesvaraya Technological University",
          "passing_year": 2018,
          "is_institution_accredited": true,
          "document_type": "ORIGINAL_DEGREE_CERTIFICATE",
          "verification_status": "VERIFIED_VALID"
        }
      ],
      "employment_records": [
        {
          "company_name": "Uno Minda Components Ltd.",
          "company_cin": "L74899DL1992PLC050333",
          "company_mca_status_active": true,
          "job_title_claimed": "Senior Automation Engineer",
          "job_title_verified": "Senior Automation Engineer",
          "start_date": "2021-04",
          "end_date": "2024-06",
          "relieving_letter_verified": true,
          "service_certificate_verified": true,
          "tax_or_salary_verified": true,
          "salary_audit_evidence": {
            "form16_traces_verified": true,
            "employer_tan": "BLRU12345E",
            "epfo_uan_passbook_verified": true,
            "payslip_last_drawn_inr_monthly": 58500
          }
        },
        {
          "company_name": "Suprajit Engineering Limited",
          "company_cin": "L29199KA1985PLC006934",
          "company_mca_status_active": true,
          "job_title_claimed": "PLC Maintenance Engineer",
          "job_title_verified": "PLC Maintenance Engineer",
          "start_date": "2018-07",
          "end_date": "2021-03",
          "relieving_letter_verified": true,
          "service_certificate_verified": true,
          "tax_or_salary_verified": true,
          "salary_audit_evidence": {
            "form16_traces_verified": true,
            "employer_tan": "BLRS98765A",
            "epfo_uan_passbook_verified": true,
            "payslip_last_drawn_inr_monthly": 36000
          }
        }
      ],
      "career_timeline_integrity": {
        "total_experience_years_claimed": 5.8,
        "total_experience_years_verified": 5.8,
        "dual_employment_detected": false,
        "unexplained_gap_detected": false,
        "gap_explanation_summary": "換職期間空窗 45 天，已備妥錄用通知書與離職信核實"
      }
    },
    "human_audit_assessment": {
      "auditor_name": "Mrs. Michael (Teaforia Lead Auditor)",
      "audit_completed_date": "2026-10-11",
      "identity_facial_match_passed": true,
      "english_communication_level": "GRADE_B_OPERATIONAL",
      "technical_competence_self_expression": "西門子 S7-1500 與 TIA Portal 階梯圖排除非常熟練，伺服軸定位與 EtherCAT 調試實操紮實。",
      "technical_competence_self_expression_en": "Highly proficient in Siemens S7-1500 and TIA Portal ladder logic troubleshooting, with solid hands-on experience in servo axis motion tuning and EtherCAT fieldbus commissioning.",
      "taiwan_relocation_readiness": {
        "family_consent_secured": true,
        "willing_to_commit_minimum_years": 3
      },
      "interviewer_executive_summary": "具備 5 年以上扎實工廠 PLC 自動化經驗，稅單與離職證明 100% 齊全，家庭全力支持外派台灣，評定為綠標最優先推薦。",
      "interviewer_executive_summary_en": "Possesses over 5 years of solid factory PLC automation experience. Form 16 tax records and relieving letters are 100% verified. Full family consent for relocation to Taiwan. Rated as Green Verified highest priority recommendation."
    },
    "risk_scoring": {
      "background_integrity_score": 92.5,
      "overall_status_band": "GREEN_VERIFIED_READY",
      "audit_flags": [
        "FLAG_DOC_CLEAN"
      ]
    }
  }
];

export const MOCK_PIPELINE_STATUS = {
  "application_id": "APP-20261012-001",
  "candidate_id": "TEA-2026-IND-0088",
  "job_id": "TW-AUT-202610-01",
  stages: [
    { "id": 1, "code": "STAGE_01_JD_PROVISIONING", "name": "職缺脫敏入庫", "name_en": "JD Sanitized & Ingested", "status": "COMPLETED", "timestamp": "2026-10-10T09:15:00Z" },
    { "id": 2, "code": "STAGE_02_SOURCING_APPLY", "name": "人才尋訪投遞", "name_en": "Talent Sourcing & Applied", "status": "COMPLETED", "timestamp": "2026-10-10T14:20:00Z" },
    { "id": 3, "code": "STAGE_03_PRIMARY_VERIFICATION", "name": "雙重核驗審查", "name_en": "Dual-Stage Verification", "status": "COMPLETED", "timestamp": "2026-10-11T16:00:00Z" },
    { "id": 4, "code": "STAGE_04_DOSSIER_HANDOFF", "name": "存證推薦交付", "name_en": "Dossier Referral & Handoff", "status": "IN_PROGRESS", "timestamp": "2026-10-12T09:30:00Z" },
    { "id": 5, "code": "STAGE_05_INTERVIEW_PROCESS", "name": "台商複試面試", "name_en": "Client Interview Process", "status": "PENDING", "timestamp": null },
    { "id": 6, "code": "STAGE_06_ONBOARDING_SETTLEMENT", "name": "赴台到職確權", "name_en": "Onboarding & Settlement", "status": "PENDING", "timestamp": null }
  ]
};

/**
 * Project TrustCV Central Reactive Store
 * Manages active route, theme, jobs, candidate dossier, applications, and modals
 */

import { MOCK_JOBS, MOCK_CANDIDATES, MOCK_PIPELINE_STATUS } from './mock/mockData.js';
import { driveService } from './drive.js';

export const LOCAL_STORAGE_PROFILE_KEY = 'trustcv_master_profile';

export function createDefaultMasterProfile(mockCandidate = MOCK_CANDIDATES[0]) {
  const p = mockCandidate?.candidate_profile || {};
  const creds = mockCandidate?.verified_credentials || {};
  const now = new Date().toISOString();

  return {
    schema_version: '1.1.0',
    updated_at: now,
    // 1. 基本資料
    basic_info: {
      full_name: p.full_name || 'Rajesh Kumar Sharma',
      full_name_zh: p.full_name_zh || '拉傑許·夏馬',
      gender: p.gender || 'MALE',
      date_of_birth: p.date_of_birth || '1996-05-18',
      avatar_url: p.avatar_url || '',
      email: p.contact_masked?.email_proxy || 'rajesh.s0088@candidate.teaforia.in',
      phone: p.contact_masked?.phone_masked || '+91-9876****12',
      address: `${p.contact_masked?.current_location_city || 'Bengaluru'}, ${p.contact_masked?.current_location_state || 'Karnataka'}, India`,
      id_or_passport: p.identity_documents?.passport_number_masked || 'Z58****9',
      is_public: true
    },
    // 2. 求職條件
    job_preferences: {
      desired_title: 'Senior PLC Automation Engineer / 電控自動化工程師',
      job_nature: 'FULL_TIME',
      work_shifts: 'DAY_SHIFT',
      available_date: '30_DAYS_NOTICE',
      expected_salary: 'NT$ 60,000 - 80,000 / 月薪 (面議)',
      desired_locations: ['Hsinchu Science Park, Taiwan', 'Taichung, Taiwan'],
      willing_to_relocate: true,
      is_public: true
    },
    // 3. 工作經歷
    work_experiences: (creds.employment_records || []).map((e, idx) => ({
      id: `work_${idx + 1}`,
      company_name: e.company_name || '',
      industry: '工業自動化與零組件製造',
      job_title: e.job_title_verified || e.job_title_claimed || '',
      start_date: e.start_date || '',
      end_date: e.end_date || '',
      is_current: !e.end_date || e.end_date === 'Present',
      description: '負責產線西門子 S7-1500 PLC 與 SCADA 系統規劃、伺服馬達驅動定位與現場調試，帶領技術團隊優化自動化生產效率。',
      skills_used: ['Siemens S7-1500', 'TIA Portal', 'SCADA', 'EtherCAT'],
      vault_file_link: '',
      is_public: true
    })),
    // 4. 學歷
    educations: (creds.education_records || []).map((edu, idx) => ({
      id: `edu_${idx + 1}`,
      school_name: edu.institution_name || '',
      degree_level: edu.degree_level || 'BACHELORS',
      major: edu.degree_name || 'Mechatronics Engineering',
      start_year: '2014',
      end_year: String(edu.passing_year || '2018'),
      status: 'GRADUATED',
      vault_file_link: '',
      is_public: true
    })),
    // 5. 語文能力
    languages: [
      {
        id: 'lang_1',
        name: 'English',
        listening: 'FLUENT',
        speaking: 'FLUENT',
        reading: 'PROFICIENT',
        writing: 'PROFICIENT',
        certification: 'IELTS Band 7.0 / Operational English Grade B',
        is_public: true
      },
      {
        id: 'lang_2',
        name: 'Traditional Chinese (繁體中文)',
        listening: 'BASIC',
        speaking: 'BASIC',
        reading: 'ELEMENTARY',
        writing: 'ELEMENTARY',
        certification: 'TOCFL A1 in preparation',
        is_public: true
      }
    ],
    // 6. 專長
    skills: {
      tools: ['Siemens TIA Portal V18', 'AutoCAD Electrical', 'MATLAB Simulink', 'WinCC SCADA', 'Git'],
      domain_skills: ['PLC 電控架構設計', '伺服馬達驅動與定位', 'EtherCAT 現場匯流排通訊', '電氣安全規範 (SEMI S2)'],
      is_public: true
    },
    // 7. 資格認證
    certificates: [
      {
        id: 'cert_1',
        name: 'Siemens Certified Automation Specialist (TIA Portal)',
        issuing_org: 'Siemens SITRAIN India',
        license_no: 'SITR-2022-IND-8841',
        issue_date: '2022-08',
        vault_file_link: '',
        is_public: true
      },
      {
        id: 'cert_2',
        name: 'Certified Motion Control & Servo Specialist',
        issuing_org: 'Automation Federation',
        license_no: 'AF-MC-9021',
        issue_date: '2023-04',
        vault_file_link: '',
        is_public: true
      }
    ],
    // 8. 自傳
    autobiography: {
      content_en: 'Experienced Mechatronics Engineer with 6+ years of hands-on expertise in industrial automation, PLC architecture, and smart manufacturing systems. Demonstrated track record in high-precision semiconductor tooling and automotive component assembly lines. Passionate about bringing cross-border engineering discipline to Taiwan high-tech manufacturing.',
      content_zh: '擁有 6 年以上機電一體化與工業自動化實戰經驗之資深工程師，專精於西門子 PLC 控制系統架構、伺服驅動精密定位與智慧製造產線調試。具備跨國溝通協調能力與嚴謹工程素養，致力於服務台灣半導體與高科技自動化製造產業。',
      is_public: true
    },
    // 9. 附件
    attachments: [
      {
        id: 'att_1',
        file_name: 'Form16_Tax_Assessment_FY2023.pdf',
        category: 'TAX_RECORD',
        size_str: '1.2 MB',
        drive_link: '',
        is_public: true
      },
      {
        id: 'att_2',
        file_name: 'Relieving_Letter_Uno_Minda.pdf',
        category: 'RELIEVING_LETTER',
        size_str: '850 KB',
        drive_link: '',
        is_public: true
      }
    ],
    // 10. 專案成就
    project_achievements: [
      {
        id: 'proj_1',
        project_name: '高速半導體晶圓取放搬運機電控系統優化',
        role: '電控負責人 / Lead PLC Architect',
        period: '2022.06 - 2023.12',
        achievements_summary: '重構 EtherCAT 通訊循環週期至 1ms，整體產能稼動率提升 14.2%，獲年度技術創新卓越獎。',
        external_url: '',
        is_public: true
      }
    ],
    // 11. 推薦人
    references: [
      {
        id: 'ref_1',
        name: 'Arun V. Verma',
        organization: 'Uno Minda Components Ltd.',
        title: 'Senior Engineering Director',
        email: 'arun.verma@unominda.com',
        phone: '+91-9845****99',
        relationship: '直接主管 (Former Direct Manager)',
        is_public: false
      }
    ],
    // 12. 自訂區塊
    custom_sections: [
      {
        id: 'custom_1',
        title: '專業專利與學術發表 (Patents & Publications)',
        layout_type: 'TEXT_LIST',
        content: '共同發明專利：「多軸同步電控防撞緩衝演算法」（印度專利申請號 202341019822）',
        is_public: true
      }
    ]
  };
}

class Store {
  constructor() {
    const savedTheme = typeof localStorage !== 'undefined' ? localStorage.getItem('trustcv_theme') : null;
    
    // 初始化 12 大區塊 profile：優先讀取本地 localStorage，若無則生成預設模型
    let initialProfile = null;
    if (typeof localStorage !== 'undefined') {
      try {
        const raw = localStorage.getItem(LOCAL_STORAGE_PROFILE_KEY);
        if (raw) {
          initialProfile = JSON.parse(raw);
        }
      } catch (e) {
        console.warn('[Store] Failed to parse cached profile from localStorage', e);
      }
    }
    if (!initialProfile) {
      initialProfile = createDefaultMasterProfile();
    }

    this.state = {
      theme: savedTheme || 'dark',
      currentTab: 'jobs', // 'jobs' | 'cv' | 'status' | 'vault'
      jobs: [...MOCK_JOBS],
      selectedJobId: 'TW-AUT-202610-01',
      candidate: MOCK_CANDIDATES[0],
      masterProfile: initialProfile,
      syncStatus: 'saved', // 'saved' | 'saving' | 'offline' | 'error'
      lastSyncedTime: null,
      pipeline: MOCK_PIPELINE_STATUS,
      searchQuery: '',
      filterCategory: 'ALL',
      applyModalOpen: false,
      applyTargetJob: null,
      toastMessage: null,
      // ── Google Auth & Drive state ──
      user: null,          // { id, name, email, picture } | null
      driveFolderIds: null, // { root, photos, certificates, resumes, exports } | null
      driveFiles: { photos: [], certificates: [], resumes: [], exports: [] },
      driveLoading: false,
      driveError: null
    };

    this.listeners = [];
    this.debounceTimer = null;
    this.DEBOUNCE_DELAY_MS = 3000;
  }

  getState() {
    return this.state;
  }

  setState(partialState) {
    this.state = { ...this.state, ...partialState };
    this.notify();
  }

  setTheme(theme) {
    this.setState({ theme });
    localStorage.setItem('trustcv_theme', theme);
    document.documentElement.classList.toggle('light-mode', theme === 'light');
  }

  setTab(tab) {
    this.setState({ currentTab: tab });
  }

  setSelectedJob(jobId) {
    this.setState({ selectedJobId: jobId });
  }

  setSearchQuery(query) {
    this.setState({ searchQuery: query });
  }

  setFilterCategory(cat) {
    this.setState({ filterCategory: cat });
  }

  openApplyModal(job) {
    this.setState({ applyModalOpen: true, applyTargetJob: job });
  }

  closeApplyModal() {
    this.setState({ applyModalOpen: false, applyTargetJob: null });
  }

  showToast(message, duration = 3000) {
    this.setState({ toastMessage: message });
    setTimeout(() => {
      this.setState({ toastMessage: null });
    }, duration);
  }

  // ── 12 大區塊 Master Profile 持久化與防抖引擎 (ADR 005) ──

  /**
   * 0ms 本地儲存 + 觸發 3000ms 防抖同步回寫 Google Drive
   */
  updateMasterProfile(updater) {
    const current = this.state.masterProfile;
    const next = typeof updater === 'function' ? updater(current) : { ...current, ...updater };
    next.updated_at = new Date().toISOString();

    // 1. 第一層：0ms 物理零延遲寫入 localStorage
    try {
      localStorage.setItem(LOCAL_STORAGE_PROFILE_KEY, JSON.stringify(next));
    } catch (e) {
      console.error('[Store] localStorage write failed', e);
    }

    // 更新 store 狀態，切換狀態為 saving
    this.setState({
      masterProfile: next,
      syncStatus: this.state.user ? 'saving' : 'offline'
    });

    // 2. 第二層：3000ms 防抖背景靜默回寫 Drive
    if (this.state.user) {
      if (this.debounceTimer) clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(() => {
        this.saveProfileToDriveSilently();
      }, this.DEBOUNCE_DELAY_MS);
    }
  }

  /**
   * 背景靜默保存 profile 到 Google Drive
   */
  async saveProfileToDriveSilently() {
    if (!this.state.user) {
      this.setState({ syncStatus: 'offline' });
      return;
    }

    this.setState({ syncStatus: 'saving' });
    try {
      const rootId = this.state.driveFolderIds?.root || null;
      await driveService.saveMasterProfile(this.state.masterProfile, rootId);
      this.setState({
        syncStatus: 'saved',
        lastSyncedTime: new Date()
      });
      console.log('[Store] Master profile silently saved to Google Drive');
    } catch (err) {
      console.error('[Store] Drive sync failed:', err);
      this.setState({ syncStatus: 'error' });
    }
  }

  /**
   * 第三層：手動立即儲存並繞過防抖 (Force Immediate Sync)
   */
  async forceSaveProfile() {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = null;
    }
    // 確保本地有最新 snapshot
    try {
      localStorage.setItem(LOCAL_STORAGE_PROFILE_KEY, JSON.stringify(this.state.masterProfile));
    } catch (e) {}

    if (!this.state.user) {
      this.showToast('已保存在本機快取 (登入 Google 後可自動同步至雲端)');
      this.setState({ syncStatus: 'offline' });
      return;
    }

    this.setState({ syncStatus: 'saving' });
    try {
      const rootId = this.state.driveFolderIds?.root || null;
      await driveService.saveMasterProfile(this.state.masterProfile, rootId);
      this.setState({
        syncStatus: 'saved',
        lastSyncedTime: new Date()
      });
      this.showToast('☁️ 履歷已成功同步至 Google Drive！');
    } catch (err) {
      this.setState({ syncStatus: 'error' });
      this.showToast('❌ 雲端同步失敗，已保存在本機');
    }
  }

  /**
   * 登入後水合冷啟動：比對雲端 master_profile.json 與本地 localStorage
   */
  async hydrateProfileFromDrive() {
    if (!this.state.user) return;
    try {
      const rootId = this.state.driveFolderIds?.root || null;
      const remote = await driveService.loadMasterProfile(rootId);
      if (!remote || !remote.data) {
        // 雲端尚無 profile，立即將本地初始 profile 上傳至雲端作為單一真理
        await driveService.saveMasterProfile(this.state.masterProfile, rootId);
        this.setState({ syncStatus: 'saved', lastSyncedTime: new Date() });
        return;
      }

      const remoteData = remote.data;
      const localData = this.state.masterProfile;
      const localTime = new Date(localData.updated_at || 0).getTime();
      const remoteTime = new Date(remoteData.updated_at || remote.modifiedTime || 0).getTime();

      if (remoteTime >= localTime) {
        // 雲端較新或相等，覆寫本地快取
        this.state.masterProfile = remoteData;
        try {
          localStorage.setItem(LOCAL_STORAGE_PROFILE_KEY, JSON.stringify(remoteData));
        } catch (e) {}
        this.setState({
          masterProfile: remoteData,
          syncStatus: 'saved',
          lastSyncedTime: new Date(remoteTime)
        });
        console.log('[Store] Hydrated master profile from Google Drive');
      } else {
        // 本地較新，回寫雲端
        await driveService.saveMasterProfile(localData, rootId);
        this.setState({
          syncStatus: 'saved',
          lastSyncedTime: new Date()
        });
        console.log('[Store] Local profile was newer, pushed to Google Drive');
      }
    } catch (e) {
      console.warn('[Store] Hydration error:', e);
    }
  }

  // ── Auth & Drive mutations ──

  setUser(userInfo) {
    this.setState({ user: userInfo, driveError: null });
  }

  setDriveFolderIds(ids) {
    this.setState({ driveFolderIds: ids });
  }

  setDriveFiles(key, files) {
    this.setState({ driveFiles: { ...this.state.driveFiles, [key]: files } });
  }

  clearUser() {
    if (this.debounceTimer) clearTimeout(this.debounceTimer);
    this.setState({
      user: null,
      driveFolderIds: null,
      driveFiles: { photos: [], certificates: [], resumes: [], exports: [] },
      driveLoading: false,
      driveError: null,
      syncStatus: 'offline'
    });
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.listeners.forEach(fn => fn(this.state));
  }
}

export const store = new Store();


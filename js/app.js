/**
 * Project TrustCV Single Page PWA Application Controller
 * Handles routing, component assembly, bottom navigation, and event subscriptions
 */

import { store } from './store.js';
import { i18n } from './i18n.js';
import { ApiClient } from './api.js';
import { authService } from './auth.js';
import { driveService } from './drive.js';
import { renderHeader } from './components/header.js';
import { renderJobList } from './components/jobList.js';
import { renderJobDetail } from './components/jobDetail.js';
import { renderApplyModal } from './components/applyForm.js';
import { renderStatusTracker, renderDossierHub } from './components/statusTracker.js';
import { renderVault } from './components/vault.js';
import { renderMyCv } from './components/myCv.js';

class App {
  constructor() {
    this.appRoot = document.getElementById('app-root');
    this.initGlobalHandlers();
  }

  init() {
    // 註冊 Service Worker 並建立智慧靜默自動更新閉環
    if ('serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
      navigator.serviceWorker.register('./sw.js').then((reg) => {
        console.log('[PWA] Service Worker registered', reg.scope);

        // 1. 每隔 15 分鐘主動探測伺服器是否有新版本
        setInterval(() => {
          reg.update().catch(() => {});
        }, 15 * 60 * 1000);

        // 2. 當 PWA 從背景切回前景 (App 回到焦點) 時，立即探測新版本
        document.addEventListener('visibilitychange', () => {
          if (document.visibilityState === 'visible') {
            reg.update().catch(() => {});
          }
        });
      }).catch(err => console.warn('[PWA] SW register failed', err));

      // 3. 監聽 Service Worker 控制權切換 (新版已接管客戶端)
      let refreshing = false;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (refreshing) return;
        
        // 防破壞守衛：檢查使用者是否正在填表（彈窗開啟或表單正在輸入中）
        const isFillingForm = store.getState().isApplyModalOpen || 
                              (document.activeElement && ['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName));

        if (isFillingForm) {
          console.log('[PWA] New version ready, deferred auto-reload until user finishes form');
          // 當彈窗關閉或切換頁籤時再靜默重載
          const unsubscribe = store.subscribe(() => {
            if (!store.getState().isApplyModalOpen && !refreshing) {
              refreshing = true;
              unsubscribe();
              window.location.reload();
            }
          });
        } else {
          // 閒置狀態直接靜默無感切換至新版本
          refreshing = true;
          window.location.reload();
        }
      });
    }

    // 初始化主題樣式 (避免重載時明亮模式樣式遺失)
    const { theme } = store.getState();
    document.documentElement.classList.toggle('light-mode', theme === 'light');

    // 訂閱狀態變更
    store.subscribe(() => this.render());
    i18n.subscribe(() => this.render());

    // 啟動 2 秒開場加載畫面動畫 (無論手機/電腦或是否安裝 PWA 皆展示)
    this.startSplashScreen();

    // 啟動全平台 PWA 安裝管理與 iOS 雙語探測
    this.initPwaInstallManager();

    // 初次渲染
    this.render();
  }

  startSplashScreen() {
    const splash = document.getElementById('splash-screen');
    const bar = document.getElementById('splash-progress-bar');
    const status = document.getElementById('splash-status-text');
    if (!splash) return;

    // 動態進度條動畫：0ms -> 600ms (40%) -> 1400ms (85%) -> 1900ms (100%)
    if (bar) {
      setTimeout(() => { bar.style.width = '45%'; }, 150);
      setTimeout(() => { 
        bar.style.width = '85%'; 
        if (status) status.textContent = i18n.getLanguage() === 'en' ? 'Verifying Credence Node...' : '驗證可信節點中...';
      }, 900);
      setTimeout(() => { 
        bar.style.width = '100%'; 
        if (status) status.textContent = i18n.getLanguage() === 'en' ? 'Vault Ready.' : '保險庫就緒。';
      }, 1600);
    }

    // 滿 2 秒 (2000ms) 優雅淡出消失
    setTimeout(() => {
      splash.classList.add('splash-hidden');
      setTimeout(() => { splash.remove(); }, 600);
    }, 2000);
  }

  initGlobalHandlers() {
    window.TrustCV = {
      navigateTab: (tab) => store.setTab(tab),
      viewJob: (jobId) => {
        store.setSelectedJob(jobId);
        store.setTab('job-detail');
      },
      applyJobPrompt: (jobId) => {
        const job = store.getState().jobs.find(j => j.jd_reference_id === jobId);
        if (job) store.openApplyModal(job);
      },
      closeApplyModal: () => store.closeApplyModal(),
      handleApplySubmit: async (e) => {
        e.preventDefault();
        const form = e.target;
        const payload = {
          job_id: store.getState().applyTargetJob.jd_reference_id,
          candidate_name: form.name.value,
          email: form.email.value,
          phone: form.phone.value
        };
        try {
          await ApiClient.applyJob(payload);
          store.closeApplyModal();
          store.showToast(i18n.t('applied_success'));
          store.setTab('status');
        } catch (err) {
          alert('投遞失敗，請重試');
        }
      },
      onSearch: (q) => store.setSearchQuery(q),
      setFilter: (cat) => store.setFilterCategory(cat),
      setLang: (lang) => i18n.setLanguage(lang),
      toggleTheme: () => {
        const current = store.getState().theme;
        store.setTheme(current === 'dark' ? 'light' : 'dark');
      },
      // PWA cross-platform install
      promptInstall: () => this.handleInstallPrompt(),
      closeIosPrompt: () => this.closeIosPromptModal(),
      dismissInstallBanner: () => this.dismissInstallBanner(),

      // ── Google Auth + Drive handlers ──

      signInGoogle: async () => {
        if (authService.isAuthenticated()) {
          store.setTab('vault');
          return;
        }
        try {
          store.setState({ driveLoading: true, driveError: null });
          const userInfo = await authService.login();
          store.setUser(userInfo);
          store.setTab('vault');
          store.showToast(i18n.getLanguage() === 'en' ? 'Signed in successfully!' : '登入成功！');
          // Auto-setup Drive vault after sign-in
          await window.TrustCV.setupDriveFolders();
        } catch (e) {
          console.error('[Auth] Sign-in failed', e);
          store.setState({ driveLoading: false, driveError: e.message });
        }
      },

      signOutGoogle: () => {
        authService.logout();
        store.clearUser();
        store.showToast(i18n.getLanguage() === 'en' ? 'Signed out.' : '已登出。');
      },

      setupDriveFolders: async () => {
        if (!authService.isAuthenticated()) return;
        try {
          store.setState({ driveLoading: true, driveError: null });
          const folderIds = await driveService.ensureFolderStructure();
          store.setDriveFolderIds(folderIds);
          // Load file listings for all 4 folders in parallel (Photos, Certificates, Resumes, Exports)
          const [photos, certs, resumes, exports_] = await Promise.all([
            driveService.listFiles(folderIds.photos),
            driveService.listFiles(folderIds.certificates),
            driveService.listFiles(folderIds.resumes),
            driveService.listFiles(folderIds.exports)
          ]);
          store.setState({
            driveFiles: { photos, certificates: certs, resumes, exports: exports_ },
            driveLoading: false
          });

          // 自動水合 master_profile.json
          await store.hydrateProfileFromDrive();
        } catch (e) {
          console.error('[Drive] Setup failed', e);
          store.setState({ driveLoading: false, driveError: e.message });
        }
      },

      uploadToDrive: async (folderKey, input) => {
        if (!authService.isAuthenticated()) return;
        const { driveFolderIds } = store.getState();
        if (!driveFolderIds) return;
        const files = Array.from(input.files || []);
        if (!files.length) return;

        store.setState({ driveLoading: true });
        try {
          await Promise.all(files.map(f => driveService.uploadFile(driveFolderIds[folderKey], f)));
          const isEn = i18n.getLanguage() === 'en';
          store.showToast(isEn ? `${files.length} file(s) uploaded!` : `已上傳 ${files.length} 個檔案！`);
          const updated = await driveService.listFiles(driveFolderIds[folderKey]);
          store.setDriveFiles(folderKey, updated);
        } catch (e) {
          store.setState({ driveError: e.message });
        } finally {
          store.setState({ driveLoading: false });
          input.value = '';
        }
      },

      deleteDriveFile: async (fileId, folderKey) => {
        if (!authService.isAuthenticated()) return;
        const { driveFolderIds } = store.getState();
        if (!driveFolderIds) return;
        const isEn = i18n.getLanguage() === 'en';
        if (!confirm(isEn ? 'Delete this file from Drive?' : '確定要從 Drive 刪除這個檔案嗎？')) return;
        try {
          await driveService.deleteFile(fileId);
          const updated = await driveService.listFiles(driveFolderIds[folderKey]);
          store.setDriveFiles(folderKey, updated);
          store.showToast(isEn ? 'File deleted.' : '檔案已刪除。');
        } catch (e) {
          store.setState({ driveError: e.message });
        }
      },

      // ── 統一智慧投放區上傳與分類 (任務 4) ──

      handleUnifiedDropzoneUpload: async (input) => {
        if (!authService.isAuthenticated()) {
          store.showToast(i18n.getLanguage() === 'en' ? 'Please sign in with Google first.' : '請先登入 Google 帳號。');
          input.value = '';
          return;
        }
        const { driveFolderIds } = store.getState();
        if (!driveFolderIds) {
          await window.TrustCV.setupDriveFolders();
        }
        const files = Array.from(input.files || []);
        if (!files.length) return;

        store.setState({ driveLoading: true });
        try {
          for (const f of files) {
            let targetKey = 'certificates';
            const nameLower = f.name.toLowerCase();
            const typeLower = (f.type || '').toLowerCase();

            if (typeLower.startsWith('image/')) {
              targetKey = 'photos';
            } else if (nameLower.includes('resume') || nameLower.includes('cv') || nameLower.includes('履歷') || nameLower.includes('簡歷')) {
              targetKey = 'resumes';
            } else {
              targetKey = 'certificates';
            }

            const targetFolderId = store.getState().driveFolderIds[targetKey];
            await driveService.uploadFile(targetFolderId, f);
            const updated = await driveService.listFiles(targetFolderId);
            store.setDriveFiles(targetKey, updated);
          }

          const isEn = i18n.getLanguage() === 'en';
          store.showToast(isEn ? `Classified & uploaded ${files.length} file(s)!` : `已智慧歸檔上傳 ${files.length} 個檔案！`);
        } catch (e) {
          store.setState({ driveError: e.message });
        } finally {
          store.setState({ driveLoading: false });
          input.value = '';
        }
      },

      // ── 個人履歷 12 大區塊互動與持久化 (任務 3) ──

      forceSaveProfile: () => store.forceSaveProfile(),

      togglePrivacy: (sectionKey, itemId) => {
        store.updateMasterProfile(prev => {
          const list = prev[sectionKey] || [];
          const updated = list.map(item => {
            if (item.id === itemId) {
              return { ...item, is_public: !item.is_public };
            }
            return item;
          });
          return { ...prev, [sectionKey]: updated };
        });
      },

      deleteItem: (sectionKey, itemId) => {
        const isEn = i18n.getLanguage() === 'en';
        if (!confirm(isEn ? 'Are you sure you want to delete this item?' : '確定要刪除此條目嗎？')) return;
        store.updateMasterProfile(prev => {
          const list = prev[sectionKey] || [];
          return { ...prev, [sectionKey]: list.filter(item => item.id !== itemId) };
        });
      },

      updateAutobiography: (field, value) => {
        store.updateMasterProfile(prev => ({
          ...prev,
          autobiography: {
            ...prev.autobiography,
            [field]: value
          }
        }));
      },

      uploadAvatar: (input) => {
        const file = input.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
          const dataUrl = e.target.result;
          store.updateMasterProfile(prev => ({
            ...prev,
            basic_info: {
              ...prev.basic_info,
              avatar_url: dataUrl
            }
          }));
          store.showToast(i18n.getLanguage() === 'en' ? 'Profile photo updated!' : '大頭照已更新！');
        };
        reader.readAsDataURL(file);
      },

      triggerAiDropzone: (dropZoneKey) => {
        const fileInput = document.getElementById(`ai-dropzone-input-${dropZoneKey}`);
        if (fileInput) fileInput.click();
      },

      handleAiDropzoneUpload: (dropZoneKey, input) => {
        const files = Array.from(input.files || []);
        if (!files.length) return;
        const isEn = i18n.getLanguage() === 'en';
        const fileNames = files.map(f => f.name).join(', ');

        store.showToast(isEn ? `✨ AI extracted & added to ${dropZoneKey}: ${fileNames}` : `✨ AI 智能提煉完成，已自動填入本區塊：${fileNames}`);
        
        // 智能填充示範新條目
        if (dropZoneKey === 'work_experiences') {
          store.updateMasterProfile(prev => ({
            ...prev,
            work_experiences: [
              ...prev.work_experiences,
              {
                id: `work_${Date.now()}`,
                company_name: 'Delta Electronics / 台達電子合作代工廠',
                industry: '工業電子與電源供應系統',
                job_title: '資深 PLC 與驅動系統工程師 (AI 提煉)',
                start_date: '2024-07',
                end_date: '',
                is_current: true,
                description: `根據 ${fileNames} 自動提煉：負責半導體自動化設備電控開發、TIA Portal 程式架構設計與 EtherCAT 現場調試。`,
                skills_used: ['Delta PLC', 'TIA Portal', 'EtherCAT', 'Servo Tuning'],
                is_public: true
              }
            ]
          }));
        } else if (dropZoneKey === 'certificates') {
          store.updateMasterProfile(prev => ({
            ...prev,
            certificates: [
              ...prev.certificates,
              {
                id: `cert_${Date.now()}`,
                name: `自動提煉認證憑證 (${files[0].name.replace(/\.[^/.]+$/, '')})`,
                issuing_org: 'International Automation Accreditation',
                license_no: `CERT-AI-${Math.floor(1000 + Math.random() * 9000)}`,
                issue_date: '2024-01',
                is_public: true
              }
            ]
          }));
        } else if (dropZoneKey === 'educations') {
          store.updateMasterProfile(prev => ({
            ...prev,
            educations: [
              ...prev.educations,
              {
                id: `edu_${Date.now()}`,
                school_name: 'Anna University College of Engineering',
                degree_level: 'MASTERS',
                major: 'Mechatronics & Robotics Engineering',
                start_year: '2019',
                end_year: '2021',
                status: 'GRADUATED',
                is_public: true
              }
            ]
          }));
        }
        input.value = '';
      },

      // ── 輕量通用 Modal 表單交互 ──

      closeCvModal: () => {
        const modalContainer = document.getElementById('cv-modal-container');
        if (modalContainer) modalContainer.innerHTML = '';
      },

      openEditBasicInfoModal: () => {
        const b = store.getState().masterProfile.basic_info || {};
        const isLight = store.getState().theme === 'light';
        const isEn = i18n.getLanguage() === 'en';

        const modalHtml = `
          <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" onclick="window.TrustCV.closeCvModal()">
            <div class="w-full max-w-lg rounded-3xl p-6 ${isLight ? 'bg-white text-slate-900 border border-slate-200 shadow-2xl' : 'bg-[#0E1518] text-white border border-slate-800 shadow-2xl'} space-y-4" onclick="event.stopPropagation()">
              <div class="flex items-center justify-between border-b pb-3 ${isLight ? 'border-slate-100' : 'border-slate-800'}">
                <h3 class="text-sm font-bold">${isEn ? 'Edit Basic Information' : '編輯個人基本資料'}</h3>
                <button onclick="window.TrustCV.closeCvModal()" class="text-slate-400 hover:text-slate-600">✕</button>
              </div>
              <form onsubmit="window.TrustCV.saveBasicInfoForm(event)" class="space-y-3 text-xs">
                <div>
                  <label class="block text-[11px] font-semibold text-slate-500 mb-1">${isEn ? 'Full Legal Name (English)' : '護照法定全名 (英文)'}</label>
                  <input name="full_name" required value="${b.full_name || ''}" class="w-full p-2.5 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900 border-slate-700 text-white'}">
                </div>
                <div>
                  <label class="block text-[11px] font-semibold text-slate-500 mb-1">${isEn ? 'Full Name (Traditional Chinese)' : '中文全名 (繁體中文)'}</label>
                  <input name="full_name_zh" value="${b.full_name_zh || ''}" class="w-full p-2.5 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900 border-slate-700 text-white'}">
                </div>
                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <label class="block text-[11px] font-semibold text-slate-500 mb-1">${isEn ? 'Gender' : '性別'}</label>
                    <select name="gender" class="w-full p-2.5 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900 border-slate-700 text-white'}">
                      <option value="MALE" ${b.gender === 'MALE' ? 'selected' : ''}>Male / 男性</option>
                      <option value="FEMALE" ${b.gender === 'FEMALE' ? 'selected' : ''}>Female / 女性</option>
                      <option value="OTHER" ${b.gender === 'OTHER' ? 'selected' : ''}>Other / 其他</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-[11px] font-semibold text-slate-500 mb-1">${isEn ? 'Birth Date' : '出生年月'}</label>
                    <input name="date_of_birth" type="date" value="${b.date_of_birth || ''}" class="w-full p-2.5 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900 border-slate-700 text-white'}">
                  </div>
                </div>
                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <label class="block text-[11px] font-semibold text-slate-500 mb-1">${isEn ? 'Email' : '聯絡信箱'}</label>
                    <input name="email" required type="email" value="${b.email || ''}" class="w-full p-2.5 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900 border-slate-700 text-white'}">
                  </div>
                  <div>
                    <label class="block text-[11px] font-semibold text-slate-500 mb-1">${isEn ? 'Phone' : '聯絡電話'}</label>
                    <input name="phone" required value="${b.phone || ''}" class="w-full p-2.5 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900 border-slate-700 text-white'}">
                  </div>
                </div>
                <div>
                  <label class="block text-[11px] font-semibold text-slate-500 mb-1">${isEn ? 'ID / Passport' : '身份證號 / 護照卡號'}</label>
                  <input name="id_or_passport" value="${b.id_or_passport || ''}" class="w-full p-2.5 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900 border-slate-700 text-white'}">
                </div>
                <div>
                  <label class="block text-[11px] font-semibold text-slate-500 mb-1">${isEn ? 'Address' : '通訊地址'}</label>
                  <input name="address" value="${b.address || ''}" class="w-full p-2.5 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900 border-slate-700 text-white'}">
                </div>
                <div class="flex justify-end gap-2 pt-2">
                  <button type="button" onclick="window.TrustCV.closeCvModal()" class="px-4 py-2 rounded-xl border border-slate-300 text-slate-600">${isEn ? 'Cancel' : '取消'}</button>
                  <button type="submit" class="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold">${isEn ? 'Save' : '儲存'}</button>
                </div>
              </form>
            </div>
          </div>
        `;
        document.getElementById('cv-modal-container').innerHTML = modalHtml;
      },

      saveBasicInfoForm: (e) => {
        e.preventDefault();
        const f = e.target;
        store.updateMasterProfile(prev => ({
          ...prev,
          basic_info: {
            ...prev.basic_info,
            full_name: f.full_name.value.trim(),
            full_name_zh: f.full_name_zh.value.trim(),
            gender: f.gender.value,
            date_of_birth: f.date_of_birth.value,
            email: f.email.value.trim(),
            phone: f.phone.value.trim(),
            id_or_passport: f.id_or_passport.value.trim(),
            address: f.address.value.trim()
          }
        }));
        window.TrustCV.closeCvModal();
      },

      openEditPreferencesModal: () => {
        const pref = store.getState().masterProfile.job_preferences || {};
        const isLight = store.getState().theme === 'light';
        const isEn = i18n.getLanguage() === 'en';

        const modalHtml = `
          <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" onclick="window.TrustCV.closeCvModal()">
            <div class="w-full max-w-lg rounded-3xl p-6 ${isLight ? 'bg-white text-slate-900 border border-slate-200 shadow-2xl' : 'bg-[#0E1518] text-white border border-slate-800 shadow-2xl'} space-y-4" onclick="event.stopPropagation()">
              <div class="flex items-center justify-between border-b pb-3 ${isLight ? 'border-slate-100' : 'border-slate-800'}">
                <h3 class="text-sm font-bold">${isEn ? 'Edit Job Preferences' : '編輯求職條件'}</h3>
                <button onclick="window.TrustCV.closeCvModal()" class="text-slate-400 hover:text-slate-600">✕</button>
              </div>
              <form onsubmit="window.TrustCV.savePreferencesForm(event)" class="space-y-3 text-xs">
                <div>
                  <label class="block text-[11px] font-semibold text-slate-500 mb-1">${isEn ? 'Desired Job Title' : '希望職稱'}</label>
                  <input name="desired_title" required value="${pref.desired_title || ''}" class="w-full p-2.5 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900 border-slate-700 text-white'}">
                </div>
                <div>
                  <label class="block text-[11px] font-semibold text-slate-500 mb-1">${isEn ? 'Expected Compensation' : '期望待遇'}</label>
                  <input name="expected_salary" value="${pref.expected_salary || ''}" class="w-full p-2.5 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900 border-slate-700 text-white'}">
                </div>
                <div>
                  <label class="block text-[11px] font-semibold text-slate-500 mb-1">${isEn ? 'Availability' : '可上班日'}</label>
                  <input name="available_date" value="${pref.available_date || ''}" class="w-full p-2.5 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900 border-slate-700 text-white'}">
                </div>
                <div>
                  <label class="block text-[11px] font-semibold text-slate-500 mb-1">${isEn ? 'Desired Locations (comma-separated)' : '希望工作地點 (以逗號分隔)'}</label>
                  <input name="locations" value="${(pref.desired_locations || []).join(', ')}" class="w-full p-2.5 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900 border-slate-700 text-white'}">
                </div>
                <div class="flex items-center gap-2">
                  <input type="checkbox" id="pref_relocate" name="willing_to_relocate" ${pref.willing_to_relocate ? 'checked' : ''} class="w-4 h-4 rounded text-emerald-600">
                  <label for="pref_relocate" class="text-xs font-semibold">${isEn ? 'Willing to relocate to Taiwan' : '願意前往台灣就業 (外派意願)'}</label>
                </div>
                <div class="flex justify-end gap-2 pt-2">
                  <button type="button" onclick="window.TrustCV.closeCvModal()" class="px-4 py-2 rounded-xl border border-slate-300 text-slate-600">${isEn ? 'Cancel' : '取消'}</button>
                  <button type="submit" class="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold">${isEn ? 'Save' : '儲存'}</button>
                </div>
              </form>
            </div>
          </div>
        `;
        document.getElementById('cv-modal-container').innerHTML = modalHtml;
      },

      savePreferencesForm: (e) => {
        e.preventDefault();
        const f = e.target;
        const locations = f.locations.value.split(',').map(s => s.trim()).filter(Boolean);
        store.updateMasterProfile(prev => ({
          ...prev,
          job_preferences: {
            ...prev.job_preferences,
            desired_title: f.desired_title.value.trim(),
            expected_salary: f.expected_salary.value.trim(),
            available_date: f.available_date.value.trim(),
            desired_locations: locations,
            willing_to_relocate: f.willing_to_relocate.checked
          }
        }));
        window.TrustCV.closeCvModal();
      },

      openAddWorkModal: () => {
        const isLight = store.getState().theme === 'light';
        const isEn = i18n.getLanguage() === 'en';

        const modalHtml = `
          <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" onclick="window.TrustCV.closeCvModal()">
            <div class="w-full max-w-lg rounded-3xl p-6 ${isLight ? 'bg-white text-slate-900 border border-slate-200 shadow-2xl' : 'bg-[#0E1518] text-white border border-slate-800 shadow-2xl'} space-y-4" onclick="event.stopPropagation()">
              <div class="flex items-center justify-between border-b pb-3 ${isLight ? 'border-slate-100' : 'border-slate-800'}">
                <h3 class="text-sm font-bold">${isEn ? 'Add Work Experience' : '手動新增工作經歷'}</h3>
                <button onclick="window.TrustCV.closeCvModal()" class="text-slate-400 hover:text-slate-600">✕</button>
              </div>
              <form onsubmit="window.TrustCV.saveWorkForm(event)" class="space-y-3 text-xs">
                <div>
                  <label class="block text-[11px] font-semibold text-slate-500 mb-1">${isEn ? 'Company Name' : '公司名稱'}</label>
                  <input name="company_name" required placeholder="e.g. Foxlink / 正崴精密" class="w-full p-2.5 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900 border-slate-700 text-white'}">
                </div>
                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <label class="block text-[11px] font-semibold text-slate-500 mb-1">${isEn ? 'Job Title' : '擔任職稱'}</label>
                    <input name="job_title" required placeholder="e.g. Automation Engineer" class="w-full p-2.5 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900 border-slate-700 text-white'}">
                  </div>
                  <div>
                    <label class="block text-[11px] font-semibold text-slate-500 mb-1">${isEn ? 'Industry' : '產業類別'}</label>
                    <input name="industry" placeholder="e.g. 電子自動化製造" class="w-full p-2.5 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900 border-slate-700 text-white'}">
                  </div>
                </div>
                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <label class="block text-[11px] font-semibold text-slate-500 mb-1">${isEn ? 'Start Date' : '起始年月'}</label>
                    <input name="start_date" placeholder="YYYY-MM" class="w-full p-2.5 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900 border-slate-700 text-white'}">
                  </div>
                  <div>
                    <label class="block text-[11px] font-semibold text-slate-500 mb-1">${isEn ? 'End Date (Empty for Present)' : '結束年月 (在職中請留空)'}</label>
                    <input name="end_date" placeholder="YYYY-MM" class="w-full p-2.5 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900 border-slate-700 text-white'}">
                  </div>
                </div>
                <div>
                  <label class="block text-[11px] font-semibold text-slate-500 mb-1">${isEn ? 'Job Description / STAR Results' : '工作內容與量化成果'}</label>
                  <textarea name="description" rows="3" class="w-full p-2.5 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900 border-slate-700 text-white'}"></textarea>
                </div>
                <div>
                  <label class="block text-[11px] font-semibold text-slate-500 mb-1">${isEn ? 'Skills Used (comma-separated)' : '應用專業技術標籤 (逗號分隔)'}</label>
                  <input name="skills" placeholder="Siemens S7, SCADA, EtherCAT" class="w-full p-2.5 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900 border-slate-700 text-white'}">
                </div>
                <div class="flex justify-end gap-2 pt-2">
                  <button type="button" onclick="window.TrustCV.closeCvModal()" class="px-4 py-2 rounded-xl border border-slate-300 text-slate-600">${isEn ? 'Cancel' : '取消'}</button>
                  <button type="submit" class="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold">${isEn ? 'Add' : '新增'}</button>
                </div>
              </form>
            </div>
          </div>
        `;
        document.getElementById('cv-modal-container').innerHTML = modalHtml;
      },

      saveWorkForm: (e) => {
        e.preventDefault();
        const f = e.target;
        const skills = f.skills.value.split(',').map(s => s.trim()).filter(Boolean);
        store.updateMasterProfile(prev => ({
          ...prev,
          work_experiences: [
            ...prev.work_experiences,
            {
              id: `work_${Date.now()}`,
              company_name: f.company_name.value.trim(),
              job_title: f.job_title.value.trim(),
              industry: f.industry.value.trim(),
              start_date: f.start_date.value.trim(),
              end_date: f.end_date.value.trim(),
              is_current: !f.end_date.value.trim(),
              description: f.description.value.trim(),
              skills_used: skills,
              is_public: true
            }
          ]
        }));
        window.TrustCV.closeCvModal();
      },

      openAddEducationModal: () => {
        const isLight = store.getState().theme === 'light';
        const isEn = i18n.getLanguage() === 'en';

        const modalHtml = `
          <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" onclick="window.TrustCV.closeCvModal()">
            <div class="w-full max-w-lg rounded-3xl p-6 ${isLight ? 'bg-white text-slate-900 border border-slate-200 shadow-2xl' : 'bg-[#0E1518] text-white border border-slate-800 shadow-2xl'} space-y-4" onclick="event.stopPropagation()">
              <div class="flex items-center justify-between border-b pb-3 ${isLight ? 'border-slate-100' : 'border-slate-800'}">
                <h3 class="text-sm font-bold">${isEn ? 'Add Education Record' : '手動新增學歷背景'}</h3>
                <button onclick="window.TrustCV.closeCvModal()" class="text-slate-400 hover:text-slate-600">✕</button>
              </div>
              <form onsubmit="window.TrustCV.saveEducationForm(event)" class="space-y-3 text-xs">
                <div>
                  <label class="block text-[11px] font-semibold text-slate-500 mb-1">${isEn ? 'Institution / University' : '學校名稱'}</label>
                  <input name="school_name" required placeholder="e.g. National Taiwan University" class="w-full p-2.5 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900 border-slate-700 text-white'}">
                </div>
                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <label class="block text-[11px] font-semibold text-slate-500 mb-1">${isEn ? 'Degree Level' : '學位別'}</label>
                    <select name="degree_level" class="w-full p-2.5 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900 border-slate-700 text-white'}">
                      <option value="BACHELORS">Bachelor / 學士</option>
                      <option value="MASTERS">Master / 碩士</option>
                      <option value="DOCTORATE">Doctorate / 博士</option>
                      <option value="ASSOCIATE">Associate / 專科</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-[11px] font-semibold text-slate-500 mb-1">${isEn ? 'Major / Department' : '科系名稱'}</label>
                    <input name="major" required placeholder="e.g. Electrical Engineering" class="w-full p-2.5 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900 border-slate-700 text-white'}">
                  </div>
                </div>
                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <label class="block text-[11px] font-semibold text-slate-500 mb-1">${isEn ? 'Start Year' : '入學年份'}</label>
                    <input name="start_year" placeholder="YYYY" class="w-full p-2.5 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900 border-slate-700 text-white'}">
                  </div>
                  <div>
                    <label class="block text-[11px] font-semibold text-slate-500 mb-1">${isEn ? 'Passing Year' : '畢業年份'}</label>
                    <input name="end_year" placeholder="YYYY" class="w-full p-2.5 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900 border-slate-700 text-white'}">
                  </div>
                </div>
                <div class="flex justify-end gap-2 pt-2">
                  <button type="button" onclick="window.TrustCV.closeCvModal()" class="px-4 py-2 rounded-xl border border-slate-300 text-slate-600">${isEn ? 'Cancel' : '取消'}</button>
                  <button type="submit" class="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold">${isEn ? 'Add' : '新增'}</button>
                </div>
              </form>
            </div>
          </div>
        `;
        document.getElementById('cv-modal-container').innerHTML = modalHtml;
      },

      saveEducationForm: (e) => {
        e.preventDefault();
        const f = e.target;
        store.updateMasterProfile(prev => ({
          ...prev,
          educations: [
            ...prev.educations,
            {
              id: `edu_${Date.now()}`,
              school_name: f.school_name.value.trim(),
              degree_level: f.degree_level.value,
              major: f.major.value.trim(),
              start_year: f.start_year.value.trim(),
              end_year: f.end_year.value.trim(),
              status: 'GRADUATED',
              is_public: true
            }
          ]
        }));
        window.TrustCV.closeCvModal();
      },

      openAddCertModal: () => {
        const isLight = store.getState().theme === 'light';
        const isEn = i18n.getLanguage() === 'en';

        const modalHtml = `
          <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" onclick="window.TrustCV.closeCvModal()">
            <div class="w-full max-w-lg rounded-3xl p-6 ${isLight ? 'bg-white text-slate-900 border border-slate-200 shadow-2xl' : 'bg-[#0E1518] text-white border border-slate-800 shadow-2xl'} space-y-4" onclick="event.stopPropagation()">
              <div class="flex items-center justify-between border-b pb-3 ${isLight ? 'border-slate-100' : 'border-slate-800'}">
                <h3 class="text-sm font-bold">${isEn ? 'Add License or Certification' : '手動新增專業證照'}</h3>
                <button onclick="window.TrustCV.closeCvModal()" class="text-slate-400 hover:text-slate-600">✕</button>
              </div>
              <form onsubmit="window.TrustCV.saveCertForm(event)" class="space-y-3 text-xs">
                <div>
                  <label class="block text-[11px] font-semibold text-slate-500 mb-1">${isEn ? 'Certificate Name' : '證照名稱'}</label>
                  <input name="name" required placeholder="e.g. Certified Motion Control Specialist" class="w-full p-2.5 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900 border-slate-700 text-white'}">
                </div>
                <div>
                  <label class="block text-[11px] font-semibold text-slate-500 mb-1">${isEn ? 'Issuing Organization' : '發證機構'}</label>
                  <input name="issuing_org" required placeholder="e.g. Siemens SITRAIN" class="w-full p-2.5 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900 border-slate-700 text-white'}">
                </div>
                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <label class="block text-[11px] font-semibold text-slate-500 mb-1">${isEn ? 'License Number' : '證書字號'}</label>
                    <input name="license_no" placeholder="e.g. SITR-2024-9988" class="w-full p-2.5 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900 border-slate-700 text-white'}">
                  </div>
                  <div>
                    <label class="block text-[11px] font-semibold text-slate-500 mb-1">${isEn ? 'Issue Date' : '發證年月'}</label>
                    <input name="issue_date" placeholder="YYYY-MM" class="w-full p-2.5 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900 border-slate-700 text-white'}">
                  </div>
                </div>
                <div class="flex justify-end gap-2 pt-2">
                  <button type="button" onclick="window.TrustCV.closeCvModal()" class="px-4 py-2 rounded-xl border border-slate-300 text-slate-600">${isEn ? 'Cancel' : '取消'}</button>
                  <button type="submit" class="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold">${isEn ? 'Add' : '新增'}</button>
                </div>
              </form>
            </div>
          </div>
        `;
        document.getElementById('cv-modal-container').innerHTML = modalHtml;
      },

      saveCertForm: (e) => {
        e.preventDefault();
        const f = e.target;
        store.updateMasterProfile(prev => ({
          ...prev,
          certificates: [
            ...prev.certificates,
            {
              id: `cert_${Date.now()}`,
              name: f.name.value.trim(),
              issuing_org: f.issuing_org.value.trim(),
              license_no: f.license_no.value.trim(),
              issue_date: f.issue_date.value.trim(),
              is_public: true
            }
          ]
        }));
        window.TrustCV.closeCvModal();
      },

      openAddLanguageModal: () => {
        const isLight = store.getState().theme === 'light';
        const isEn = i18n.getLanguage() === 'en';

        const modalHtml = `
          <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" onclick="window.TrustCV.closeCvModal()">
            <div class="w-full max-w-lg rounded-3xl p-6 ${isLight ? 'bg-white text-slate-900 border border-slate-200 shadow-2xl' : 'bg-[#0E1518] text-white border border-slate-800 shadow-2xl'} space-y-4" onclick="event.stopPropagation()">
              <div class="flex items-center justify-between border-b pb-3 ${isLight ? 'border-slate-100' : 'border-slate-800'}">
                <h3 class="text-sm font-bold">${isEn ? 'Add Language' : '新增語文能力'}</h3>
                <button onclick="window.TrustCV.closeCvModal()" class="text-slate-400 hover:text-slate-600">✕</button>
              </div>
              <form onsubmit="window.TrustCV.saveLanguageForm(event)" class="space-y-3 text-xs">
                <div>
                  <label class="block text-[11px] font-semibold text-slate-500 mb-1">${isEn ? 'Language Name' : '語言種類'}</label>
                  <input name="name" required placeholder="e.g. Japanese / 日語" class="w-full p-2.5 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900 border-slate-700 text-white'}">
                </div>
                <div class="grid grid-cols-4 gap-2">
                  <div>
                    <label class="block text-[10px] text-slate-500">${isEn ? 'Listening' : '聽'}</label>
                    <select name="listening" class="w-full p-2 rounded-lg border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900 border-slate-700 text-white'}">
                      <option value="NATIVE">Native</option>
                      <option value="FLUENT">Fluent</option>
                      <option value="PROFICIENT">Proficient</option>
                      <option value="BASIC">Basic</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-[10px] text-slate-500">${isEn ? 'Speaking' : '說'}</label>
                    <select name="speaking" class="w-full p-2 rounded-lg border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900 border-slate-700 text-white'}">
                      <option value="NATIVE">Native</option>
                      <option value="FLUENT">Fluent</option>
                      <option value="PROFICIENT">Proficient</option>
                      <option value="BASIC">Basic</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-[10px] text-slate-500">${isEn ? 'Reading' : '讀'}</label>
                    <select name="reading" class="w-full p-2 rounded-lg border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900 border-slate-700 text-white'}">
                      <option value="NATIVE">Native</option>
                      <option value="FLUENT">Fluent</option>
                      <option value="PROFICIENT">Proficient</option>
                      <option value="BASIC">Basic</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-[10px] text-slate-500">${isEn ? 'Writing' : '寫'}</label>
                    <select name="writing" class="w-full p-2 rounded-lg border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900 border-slate-700 text-white'}">
                      <option value="NATIVE">Native</option>
                      <option value="FLUENT">Fluent</option>
                      <option value="PROFICIENT">Proficient</option>
                      <option value="BASIC">Basic</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label class="block text-[11px] font-semibold text-slate-500 mb-1">${isEn ? 'Certification / Score' : '檢定證明與分數 (選填)'}</label>
                  <input name="certification" placeholder="e.g. JLPT N2 / TOEIC 850" class="w-full p-2.5 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900 border-slate-700 text-white'}">
                </div>
                <div class="flex justify-end gap-2 pt-2">
                  <button type="button" onclick="window.TrustCV.closeCvModal()" class="px-4 py-2 rounded-xl border border-slate-300 text-slate-600">${isEn ? 'Cancel' : '取消'}</button>
                  <button type="submit" class="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold">${isEn ? 'Add' : '新增'}</button>
                </div>
              </form>
            </div>
          </div>
        `;
        document.getElementById('cv-modal-container').innerHTML = modalHtml;
      },

      saveLanguageForm: (e) => {
        e.preventDefault();
        const f = e.target;
        store.updateMasterProfile(prev => ({
          ...prev,
          languages: [
            ...prev.languages,
            {
              id: `lang_${Date.now()}`,
              name: f.name.value.trim(),
              listening: f.listening.value,
              speaking: f.speaking.value,
              reading: f.reading.value,
              writing: f.writing.value,
              certification: f.certification.value.trim(),
              is_public: true
            }
          ]
        }));
        window.TrustCV.closeCvModal();
      },

      openEditSkillsModal: () => {
        const skills = store.getState().masterProfile.skills || {};
        const isLight = store.getState().theme === 'light';
        const isEn = i18n.getLanguage() === 'en';

        const modalHtml = `
          <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" onclick="window.TrustCV.closeCvModal()">
            <div class="w-full max-w-lg rounded-3xl p-6 ${isLight ? 'bg-white text-slate-900 border border-slate-200 shadow-2xl' : 'bg-[#0E1518] text-white border border-slate-800 shadow-2xl'} space-y-4" onclick="event.stopPropagation()">
              <div class="flex items-center justify-between border-b pb-3 ${isLight ? 'border-slate-100' : 'border-slate-800'}">
                <h3 class="text-sm font-bold">${isEn ? 'Edit Skills Matrix' : '編輯專長標籤矩陣'}</h3>
                <button onclick="window.TrustCV.closeCvModal()" class="text-slate-400 hover:text-slate-600">✕</button>
              </div>
              <form onsubmit="window.TrustCV.saveSkillsForm(event)" class="space-y-3 text-xs">
                <div>
                  <label class="block text-[11px] font-semibold text-slate-500 mb-1">${isEn ? 'Tools & Software (comma-separated)' : '擅長工具與工程軟體 (以逗號分隔)'}</label>
                  <textarea name="tools" rows="2" class="w-full p-2.5 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900 border-slate-700 text-white'}">${(skills.tools || []).join(', ')}</textarea>
                </div>
                <div>
                  <label class="block text-[11px] font-semibold text-slate-500 mb-1">${isEn ? 'Domain Skills (comma-separated)' : '核心工作專長與技能 (以逗號分隔)'}</label>
                  <textarea name="domain_skills" rows="2" class="w-full p-2.5 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900 border-slate-700 text-white'}">${(skills.domain_skills || []).join(', ')}</textarea>
                </div>
                <div class="flex justify-end gap-2 pt-2">
                  <button type="button" onclick="window.TrustCV.closeCvModal()" class="px-4 py-2 rounded-xl border border-slate-300 text-slate-600">${isEn ? 'Cancel' : '取消'}</button>
                  <button type="submit" class="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold">${isEn ? 'Save' : '儲存'}</button>
                </div>
              </form>
            </div>
          </div>
        `;
        document.getElementById('cv-modal-container').innerHTML = modalHtml;
      },

      saveSkillsForm: (e) => {
        e.preventDefault();
        const f = e.target;
        const tools = f.tools.value.split(',').map(s => s.trim()).filter(Boolean);
        const domainSkills = f.domain_skills.value.split(',').map(s => s.trim()).filter(Boolean);
        store.updateMasterProfile(prev => ({
          ...prev,
          skills: {
            ...prev.skills,
            tools,
            domain_skills: domainSkills
          }
        }));
        window.TrustCV.closeCvModal();
      },

      openAddAttachmentModal: () => {
        const isLight = store.getState().theme === 'light';
        const isEn = i18n.getLanguage() === 'en';

        const modalHtml = `
          <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" onclick="window.TrustCV.closeCvModal()">
            <div class="w-full max-w-lg rounded-3xl p-6 ${isLight ? 'bg-white text-slate-900 border border-slate-200 shadow-2xl' : 'bg-[#0E1518] text-white border border-slate-800 shadow-2xl'} space-y-4" onclick="event.stopPropagation()">
              <div class="flex items-center justify-between border-b pb-3 ${isLight ? 'border-slate-100' : 'border-slate-800'}">
                <h3 class="text-sm font-bold">${isEn ? 'Add Attachment' : '登記佐證附件'}</h3>
                <button onclick="window.TrustCV.closeCvModal()" class="text-slate-400 hover:text-slate-600">✕</button>
              </div>
              <form onsubmit="window.TrustCV.saveAttachmentForm(event)" class="space-y-3 text-xs">
                <div>
                  <label class="block text-[11px] font-semibold text-slate-500 mb-1">${isEn ? 'File Name' : '檔案名稱'}</label>
                  <input name="file_name" required placeholder="e.g. Master_Project_Spec.pdf" class="w-full p-2.5 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900 border-slate-700 text-white'}">
                </div>
                <div>
                  <label class="block text-[11px] font-semibold text-slate-500 mb-1">${isEn ? 'Category' : '附件類別'}</label>
                  <select name="category" class="w-full p-2.5 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900 border-slate-700 text-white'}">
                    <option value="PORTFOLIO">Portfolio / 作品集</option>
                    <option value="TAX_RECORD">Tax Record Form 16 / 稅單</option>
                    <option value="RELIEVING_LETTER">Relieving Letter / 離職證明</option>
                    <option value="PATENT_DOC">Patent Document / 專利文件</option>
                    <option value="OTHER">Other / 其他</option>
                  </select>
                </div>
                <div class="flex justify-end gap-2 pt-2">
                  <button type="button" onclick="window.TrustCV.closeCvModal()" class="px-4 py-2 rounded-xl border border-slate-300 text-slate-600">${isEn ? 'Cancel' : '取消'}</button>
                  <button type="submit" class="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold">${isEn ? 'Add' : '新增'}</button>
                </div>
              </form>
            </div>
          </div>
        `;
        document.getElementById('cv-modal-container').innerHTML = modalHtml;
      },

      saveAttachmentForm: (e) => {
        e.preventDefault();
        const f = e.target;
        store.updateMasterProfile(prev => ({
          ...prev,
          attachments: [
            ...prev.attachments,
            {
              id: `att_${Date.now()}`,
              file_name: f.file_name.value.trim(),
              category: f.category.value,
              size_str: '1.0 MB',
              is_public: true
            }
          ]
        }));
        window.TrustCV.closeCvModal();
      },

      openAddProjectModal: () => {
        const isLight = store.getState().theme === 'light';
        const isEn = i18n.getLanguage() === 'en';

        const modalHtml = `
          <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" onclick="window.TrustCV.closeCvModal()">
            <div class="w-full max-w-lg rounded-3xl p-6 ${isLight ? 'bg-white text-slate-900 border border-slate-200 shadow-2xl' : 'bg-[#0E1518] text-white border border-slate-800 shadow-2xl'} space-y-4" onclick="event.stopPropagation()">
              <div class="flex items-center justify-between border-b pb-3 ${isLight ? 'border-slate-100' : 'border-slate-800'}">
                <h3 class="text-sm font-bold">${isEn ? 'Add Project Achievement' : '新增專案成就'}</h3>
                <button onclick="window.TrustCV.closeCvModal()" class="text-slate-400 hover:text-slate-600">✕</button>
              </div>
              <form onsubmit="window.TrustCV.saveProjectForm(event)" class="space-y-3 text-xs">
                <div>
                  <label class="block text-[11px] font-semibold text-slate-500 mb-1">${isEn ? 'Project Name' : '專案名稱'}</label>
                  <input name="project_name" required placeholder="e.g. 半導體晶圓搬運機電控優化" class="w-full p-2.5 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900 border-slate-700 text-white'}">
                </div>
                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <label class="block text-[11px] font-semibold text-slate-500 mb-1">${isEn ? 'Role' : '擔任角色'}</label>
                    <input name="role" required placeholder="e.g. Lead PLC Engineer" class="w-full p-2.5 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900 border-slate-700 text-white'}">
                  </div>
                  <div>
                    <label class="block text-[11px] font-semibold text-slate-500 mb-1">${isEn ? 'Period' : '專案期間'}</label>
                    <input name="period" placeholder="2023.01 - 2023.12" class="w-full p-2.5 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900 border-slate-700 text-white'}">
                  </div>
                </div>
                <div>
                  <label class="block text-[11px] font-semibold text-slate-500 mb-1">${isEn ? 'Measurable Achievements' : '量化技術成果與說明'}</label>
                  <textarea name="achievements" rows="3" class="w-full p-2.5 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900 border-slate-700 text-white'}"></textarea>
                </div>
                <div class="flex justify-end gap-2 pt-2">
                  <button type="button" onclick="window.TrustCV.closeCvModal()" class="px-4 py-2 rounded-xl border border-slate-300 text-slate-600">${isEn ? 'Cancel' : '取消'}</button>
                  <button type="submit" class="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold">${isEn ? 'Add' : '新增'}</button>
                </div>
              </form>
            </div>
          </div>
        `;
        document.getElementById('cv-modal-container').innerHTML = modalHtml;
      },

      saveProjectForm: (e) => {
        e.preventDefault();
        const f = e.target;
        store.updateMasterProfile(prev => ({
          ...prev,
          project_achievements: [
            ...prev.project_achievements,
            {
              id: `proj_${Date.now()}`,
              project_name: f.project_name.value.trim(),
              role: f.role.value.trim(),
              period: f.period.value.trim(),
              achievements_summary: f.achievements.value.trim(),
              is_public: true
            }
          ]
        }));
        window.TrustCV.closeCvModal();
      },

      openAddReferenceModal: () => {
        const isLight = store.getState().theme === 'light';
        const isEn = i18n.getLanguage() === 'en';

        const modalHtml = `
          <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" onclick="window.TrustCV.closeCvModal()">
            <div class="w-full max-w-lg rounded-3xl p-6 ${isLight ? 'bg-white text-slate-900 border border-slate-200 shadow-2xl' : 'bg-[#0E1518] text-white border border-slate-800 shadow-2xl'} space-y-4" onclick="event.stopPropagation()">
              <div class="flex items-center justify-between border-b pb-3 ${isLight ? 'border-slate-100' : 'border-slate-800'}">
                <h3 class="text-sm font-bold">${isEn ? 'Add Reference' : '新增推薦人'}</h3>
                <button onclick="window.TrustCV.closeCvModal()" class="text-slate-400 hover:text-slate-600">✕</button>
              </div>
              <form onsubmit="window.TrustCV.saveReferenceForm(event)" class="space-y-3 text-xs">
                <div>
                  <label class="block text-[11px] font-semibold text-slate-500 mb-1">${isEn ? 'Referee Name' : '推薦人姓名'}</label>
                  <input name="name" required placeholder="e.g. Arun V. Verma" class="w-full p-2.5 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900 border-slate-700 text-white'}">
                </div>
                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <label class="block text-[11px] font-semibold text-slate-500 mb-1">${isEn ? 'Organization' : '服務機構'}</label>
                    <input name="organization" required placeholder="e.g. Uno Minda" class="w-full p-2.5 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900 border-slate-700 text-white'}">
                  </div>
                  <div>
                    <label class="block text-[11px] font-semibold text-slate-500 mb-1">${isEn ? 'Title' : '職稱'}</label>
                    <input name="title" required placeholder="e.g. Engineering Director" class="w-full p-2.5 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900 border-slate-700 text-white'}">
                  </div>
                </div>
                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <label class="block text-[11px] font-semibold text-slate-500 mb-1">${isEn ? 'Email' : '聯絡信箱'}</label>
                    <input name="email" type="email" placeholder="referee@example.com" class="w-full p-2.5 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900 border-slate-700 text-white'}">
                  </div>
                  <div>
                    <label class="block text-[11px] font-semibold text-slate-500 mb-1">${isEn ? 'Relationship' : '關係'}</label>
                    <input name="relationship" placeholder="e.g. Former Direct Manager" class="w-full p-2.5 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900 border-slate-700 text-white'}">
                  </div>
                </div>
                <div class="flex justify-end gap-2 pt-2">
                  <button type="button" onclick="window.TrustCV.closeCvModal()" class="px-4 py-2 rounded-xl border border-slate-300 text-slate-600">${isEn ? 'Cancel' : '取消'}</button>
                  <button type="submit" class="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold">${isEn ? 'Add' : '新增'}</button>
                </div>
              </form>
            </div>
          </div>
        `;
        document.getElementById('cv-modal-container').innerHTML = modalHtml;
      },

      saveReferenceForm: (e) => {
        e.preventDefault();
        const f = e.target;
        store.updateMasterProfile(prev => ({
          ...prev,
          references: [
            ...prev.references,
            {
              id: `ref_${Date.now()}`,
              name: f.name.value.trim(),
              organization: f.organization.value.trim(),
              title: f.title.value.trim(),
              email: f.email.value.trim(),
              relationship: f.relationship.value.trim(),
              is_public: false
            }
          ]
        }));
        window.TrustCV.closeCvModal();
      },

      openAddCustomSectionModal: () => {
        const isLight = store.getState().theme === 'light';
        const isEn = i18n.getLanguage() === 'en';

        const modalHtml = `
          <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" onclick="window.TrustCV.closeCvModal()">
            <div class="w-full max-w-lg rounded-3xl p-6 ${isLight ? 'bg-white text-slate-900 border border-slate-200 shadow-2xl' : 'bg-[#0E1518] text-white border border-slate-800 shadow-2xl'} space-y-4" onclick="event.stopPropagation()">
              <div class="flex items-center justify-between border-b pb-3 ${isLight ? 'border-slate-100' : 'border-slate-800'}">
                <h3 class="text-sm font-bold">${isEn ? 'Add Custom Section' : '新增自訂內容區塊'}</h3>
                <button onclick="window.TrustCV.closeCvModal()" class="text-slate-400 hover:text-slate-600">✕</button>
              </div>
              <form onsubmit="window.TrustCV.saveCustomSectionForm(event)" class="space-y-3 text-xs">
                <div>
                  <label class="block text-[11px] font-semibold text-slate-500 mb-1">${isEn ? 'Section Title' : '區塊標題'}</label>
                  <input name="title" required placeholder="e.g. 專利發明 / 國際研討會演講" class="w-full p-2.5 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900 border-slate-700 text-white'}">
                </div>
                <div>
                  <label class="block text-[11px] font-semibold text-slate-500 mb-1">${isEn ? 'Content Description' : '內容描述'}</label>
                  <textarea name="content" rows="3" required class="w-full p-2.5 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900 border-slate-700 text-white'}"></textarea>
                </div>
                <div class="flex justify-end gap-2 pt-2">
                  <button type="button" onclick="window.TrustCV.closeCvModal()" class="px-4 py-2 rounded-xl border border-slate-300 text-slate-600">${isEn ? 'Cancel' : '取消'}</button>
                  <button type="submit" class="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold">${isEn ? 'Add' : '新增'}</button>
                </div>
              </form>
            </div>
          </div>
        `;
        document.getElementById('cv-modal-container').innerHTML = modalHtml;
      },

      saveCustomSectionForm: (e) => {
        e.preventDefault();
        const f = e.target;
        store.updateMasterProfile(prev => ({
          ...prev,
          custom_sections: [
            ...prev.custom_sections,
            {
              id: `custom_${Date.now()}`,
              title: f.title.value.trim(),
              content: f.content.value.trim(),
              is_public: true
            }
          ]
        }));
        window.TrustCV.closeCvModal();
      }
    };
  }

  // 使用者手動關閉底部浮卡：永久記憶於 localStorage，本設備絕不二次打擾
  dismissInstallBanner() {
    try {
      localStorage.setItem('trustcv_install_banner_dismissed', 'true');
    } catch (e) {}
    this.isInstallBannerDismissed = true;
    this.render();
  }

  renderBottomInstallBanner() {
    // 1. 若處於獨立 App 模式 (Standalone)，不顯示
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
    if (isStandalone) return '';

    // 2. 若使用者之前已點擊叉叉關閉過，永久不顯示
    if (this.isInstallBannerDismissed) return '';
    try {
      if (localStorage.getItem('trustcv_install_banner_dismissed') === 'true') {
        this.isInstallBannerDismissed = true;
        return '';
      }
    } catch (e) {}

    // 3. 若當前沒有可安裝狀態（既非 iOS 且未捕獲 prompt），暫不顯示
    const isIos = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    if (!this.deferredInstallPrompt && !isIos) return '';

    const { theme } = store.getState();
    const isLight = theme === 'light';

    return `
      <!-- 一次性精緻底部毛玻璃安裝浮卡 (懸浮於底部導航欄上方 12px，永不遮擋 Tab) -->
      <div id="pwa-bottom-banner" class="fixed bottom-16 left-3 right-3 md:left-auto md:right-6 md:w-96 z-30 animate-fade-in">
        <div class="rounded-2xl p-3.5 shadow-2xl backdrop-blur-xl flex items-center justify-between gap-3 border ${isLight ? 'bg-white/95 border-emerald-200/80 text-slate-800 shadow-emerald-950/10' : 'bg-[#0E1518]/95 border-emerald-800/60 text-white shadow-black/40'}">
          
          <!-- 左側圖示與雙語文案 -->
          <div class="flex items-center gap-2.5 min-w-0">
            <div class="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${isLight ? 'bg-emerald-50 border border-emerald-200' : 'bg-[#080C0E] border border-emerald-900'}">
              <svg viewBox="280 50 260 415" class="w-5 h-5" fill="none">
                <path fill="#22b573" d="M 375,458 L 283,366 L 315,334 L 375,394 L 501,268 L 533,300 Z M 502,306.6 L 494.4,299 L 483.6,299 L 476,306.6 L 476,317.4 L 483.6,325 L 494.4,325 L 502,317.4 Z"/>
              </svg>
            </div>
            <div class="min-w-0">
              <div class="text-xs font-bold truncate leading-tight">${i18n.t('install_banner_title')}</div>
              <div class="text-[10px] ${isLight ? 'text-slate-500' : 'text-slate-400'} truncate leading-tight mt-0.5">${i18n.t('install_banner_desc')}</div>
            </div>
          </div>

          <!-- 右側立即安裝按鈕與關閉叉叉 -->
          <div class="flex items-center gap-1.5 shrink-0">
            <button onclick="window.TrustCV.promptInstall()" class="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-[11px] shadow-sm transition-all whitespace-nowrap">
              ${i18n.t('install_banner_cta')}
            </button>
            <button onclick="window.TrustCV.dismissInstallBanner()" class="p-1 rounded-full ${isLight ? 'text-slate-400 hover:bg-slate-100 hover:text-slate-700' : 'text-slate-500 hover:bg-slate-800 hover:text-white'} transition-colors" title="不再提示">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>

        </div>
      </div>
    `;
  }

  // PWA 安裝管理器：全平台跨設備支援 (PC / Mac / Android / iOS)
  initPwaInstallManager() {
    this.deferredInstallPrompt = null;
    this.isIosPromptOpen = false;

    // 1. 監聽標準 Chrome / Edge / Android PWA 安裝事件
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredInstallPrompt = e;
      this.updateInstallButtonVisibility(true);
      console.log('[PWA] beforeinstallprompt captured and ready');
    });

    // 2. 監聽已安裝完成事件
    window.addEventListener('appinstalled', () => {
      this.deferredInstallPrompt = null;
      this.updateInstallButtonVisibility(false);
      console.log('[PWA] App successfully installed');
      store.showToast(i18n.getLanguage() === 'en' ? 'TrustCV Installed Successfully!' : 'TrustCV 安裝成功！');
    });

    // 3. 初始狀態探測：若已處於獨立 App 視窗模式 (Standalone)，自動永久隱藏
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                         window.navigator.standalone === true;
    if (isStandalone) {
      this.updateInstallButtonVisibility(false);
      return;
    }

    // 4. iOS Safari 專屬探測：若為 iOS 且非 Standalone，保持按鈕可用以提供雙語引導
    const isIos = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    if (isIos && !isStandalone) {
      this.updateInstallButtonVisibility(true);
    }
  }

  updateInstallButtonVisibility(show) {
    const btn = document.getElementById('pwa-install-btn');
    if (!btn) return;
    if (show) {
      btn.classList.remove('hidden');
      btn.classList.add('inline-flex');
    } else {
      btn.classList.add('hidden');
      btn.classList.remove('inline-flex');
    }
  }

  handleInstallPrompt() {
    // 情境 A: 支援標準 beforeinstallprompt (Android, Chrome/Edge on Windows/Mac)
    if (this.deferredInstallPrompt) {
      this.deferredInstallPrompt.prompt();
      this.deferredInstallPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('[PWA] User accepted install prompt');
        } else {
          console.log('[PWA] User dismissed install prompt');
        }
        this.deferredInstallPrompt = null;
      });
      return;
    }

    // 情境 B: iOS Safari (不支援 beforeinstallprompt，彈出雙語純淨圖文指引浮窗)
    const isIos = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    if (isIos) {
      this.isIosPromptOpen = true;
      this.render();
      return;
    }

    // 情境 C: PC 瀏覽器且原生 prompt 暫時未捕獲 (如已被手動安裝或處於特定視窗)
    store.showToast(i18n.getLanguage() === 'en' 
      ? 'Please use browser menu [Install TrustCV] or address bar icon' 
      : '請點擊瀏覽器網址列右側圖示或選單中的「安裝 TrustCV」');
  }

  closeIosPromptModal() {
    this.isIosPromptOpen = false;
    this.render();
  }

  renderIosPromptModal() {
    if (!this.isIosPromptOpen) return '';
    const { theme } = store.getState();
    const isLight = theme === 'light';

    return `
      <!-- iOS 安裝教學純淨雙語浮窗 (防破格、嚴格自適應語系) -->
      <div class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" onclick="window.TrustCV.closeIosPrompt()">
        <div class="w-full max-w-sm rounded-3xl p-6 ${isLight ? 'bg-white text-slate-900 shadow-2xl border border-slate-100' : 'bg-[#0E1518] text-white shadow-2xl border border-slate-800'} space-y-5" onclick="event.stopPropagation()">
          
          <!-- 頂部標題與關閉按鈕 -->
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center p-1.5 ${isLight ? 'bg-slate-50 border border-slate-200' : 'bg-[#080C0E] border border-slate-800'}">
                <svg viewBox="280 50 260 415" class="w-full h-full" fill="none">
                  <path fill="#22b573" d="M 375,458 L 283,366 L 315,334 L 375,394 L 501,268 L 533,300 Z M 502,306.6 L 494.4,299 L 483.6,299 L 476,306.6 L 476,317.4 L 483.6,325 L 494.4,325 L 502,317.4 Z"/>
                </svg>
              </div>
              <div>
                <h3 class="text-sm font-bold leading-tight">${i18n.t('ios_install_title')}</h3>
                <span class="text-[10px] text-emerald-500 font-semibold uppercase tracking-wider">${i18n.t('by_teaforia')}</span>
              </div>
            </div>
            <button onclick="window.TrustCV.closeIosPrompt()" class="p-1.5 rounded-full ${isLight ? 'text-slate-400 hover:bg-slate-100 hover:text-slate-700' : 'text-slate-500 hover:bg-slate-800 hover:text-white'} transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>

          <p class="text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'} leading-relaxed">
            ${i18n.t('ios_install_desc')}
          </p>

          <!-- 步驟一與步驟二引導清單 -->
          <div class="space-y-3">
            <div class="flex items-center gap-3 p-3 rounded-2xl ${isLight ? 'bg-slate-50 border border-slate-100' : 'bg-slate-900/60 border border-slate-800/80'}">
              <div class="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
              </div>
              <div class="text-xs font-medium leading-snug">
                ${i18n.t('ios_step_1')}
              </div>
            </div>

            <div class="flex items-center gap-3 p-3 rounded-2xl ${isLight ? 'bg-slate-50 border border-slate-100' : 'bg-slate-900/60 border border-slate-800/80'}">
              <div class="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="4"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
              </div>
              <div class="text-xs font-medium leading-snug">
                ${i18n.t('ios_step_2')}
              </div>
            </div>
          </div>

          <!-- 確認按鈕 -->
          <button onclick="window.TrustCV.closeIosPrompt()" class="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs tracking-wide shadow-md transition-all">
            ${i18n.t('ios_got_it')}
          </button>
        </div>
      </div>
    `;
  }

  renderBottomNav() {
    const { currentTab, theme } = store.getState();
    const isLight = theme === 'light';
    const tabs = [
      { id: 'jobs', label: i18n.t('nav_jobs'), icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>' },
      { id: 'cv', label: i18n.t('nav_cv'), icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>' },
      { id: 'status', label: i18n.t('nav_status'), icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>' },
      { id: 'vault', label: i18n.t('nav_vault'), icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>' }
    ];

    return `
      <!-- 行動端專屬底部導航欄 (md 以上 PC 端由頂部 Navbar 接管並自動隱藏) -->
      <nav class="md:hidden border-t border-brand-border bg-brand-obsidian/95 px-3 py-2 flex justify-around items-center sticky bottom-0 z-30 safe-bottom backdrop-blur-md transition-colors">
        ${tabs.map(tab => {
          const isActive = currentTab === tab.id || (tab.id === 'jobs' && currentTab === 'job-detail');
          const activeClass = isActive 
            ? (isLight ? 'text-emerald-600 font-bold' : 'text-brand-mint font-bold') 
            : (isLight ? 'text-slate-400 hover:text-slate-700' : 'text-slate-500 hover:text-slate-300');
          return `
            <button onclick="window.TrustCV.navigateTab('${tab.id}')" class="flex flex-col items-center cursor-pointer ${activeClass} transition-colors">
              ${tab.icon}
              <span class="text-[10px] mt-0.5">${tab.label}</span>
            </button>
          `;
        }).join('')}
      </nav>
    `;
  }

  renderToast() {
    const { toastMessage, theme } = store.getState();
    const isLight = theme === 'light';
    if (!toastMessage) return '';
    return `
      <div class="fixed top-16 left-1/2 -translate-x-1/2 z-50 ${isLight ? 'bg-emerald-50 border border-emerald-400 text-emerald-800' : 'bg-emerald-950 border border-brand-emerald text-brand-mint'} text-xs font-semibold px-4 py-2 rounded-full shadow-2xl animate-bounce flex items-center gap-2">
        <svg class="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
        <span>${toastMessage}</span>
      </div>
    `;
  }

  render() {
    const { currentTab, theme } = store.getState();
    const isLight = theme === 'light';

    let mainContent = '';
    switch (currentTab) {
      case 'jobs':
        mainContent = renderJobList();
        break;
      case 'job-detail':
        mainContent = renderJobDetail();
        break;
      case 'cv':
        mainContent = renderMyCv();
        break;
      case 'status':
        mainContent = renderStatusTracker();
        break;
      case 'vault':
        mainContent = renderVault();
        break;
      default:
        mainContent = renderJobList();
    }

    // 動態自適應更新頁面標題與語系標籤 (支援台灣在地化「履歷」與國際英文版)
    const isEn = i18n.getLanguage() === 'en';
    document.title = isEn 
      ? 'TrustCV | Global Careers | Free Resume Management'
      : 'TrustCV | 海外就業 | 免費履歷管理';
    document.documentElement.lang = isEn ? 'en' : 'zh-TW';

    this.appRoot.innerHTML = `
      <div class="min-h-screen w-full ${isLight ? 'bg-[#F8FAFC] text-slate-900' : 'bg-brand-obsidian text-slate-100'} flex flex-col transition-colors duration-200 relative">
        ${renderHeader()}
        ${this.renderToast()}
        <main class="flex-1 w-full max-w-7xl mx-auto px-2 md:px-6 py-4 overflow-y-auto no-scrollbar">
          ${mainContent}
        </main>
        ${this.renderBottomNav()}
        ${this.renderBottomInstallBanner()}
        ${renderApplyModal()}
        ${this.renderIosPromptModal()}
      </div>
    `;

    // 每次重新渲染後，同步更新安裝按鈕的可見度狀態
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
    const isIos = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    if (!isStandalone && (this.deferredInstallPrompt || isIos)) {
      this.updateInstallButtonVisibility(true);
    }
  }
}

function bootstrapApp() {
  try {
    const app = new App();
    app.init();
  } catch (err) {
    console.error('[TrustCV] Bootstrapping error:', err);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrapApp);
} else {
  bootstrapApp();
}

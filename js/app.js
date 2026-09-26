/**
 * Project TrustCV Single Page PWA Application Controller
 * Handles routing, component assembly, bottom navigation, and event subscriptions
 */

import { store } from './store.js';
import { i18n } from './i18n.js';
import { ApiClient } from './api.js';
import { renderHeader } from './components/header.js';
import { renderJobList } from './components/jobList.js';
import { renderJobDetail } from './components/jobDetail.js';
import { renderApplyModal } from './components/applyForm.js';
import { renderStatusTracker, renderDossierHub } from './components/statusTracker.js';

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
      // PWA 跨平台主動安裝處理
      promptInstall: () => this.handleInstallPrompt(),
      closeIosPrompt: () => this.closeIosPromptModal(),
      dismissInstallBanner: () => this.dismissInstallBanner()
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
        mainContent = renderDossierHub();
        break;
      case 'status':
        mainContent = renderStatusTracker();
        break;
      case 'vault':
        mainContent = `
          <div class="p-6 md:p-12 text-center space-y-4 max-w-xl mx-auto my-8">
            <div class="w-16 h-16 rounded-2xl ${isLight ? 'bg-emerald-50 border border-emerald-200 text-emerald-600' : 'bg-emerald-950/70 border border-emerald-800 text-brand-mint'} flex items-center justify-center mx-auto shadow-md">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </div>
            <div class="space-y-1.5">
              <h3 class="text-base md:text-lg font-bold ${isLight ? 'text-slate-900' : 'text-white'}">${i18n.t('vault_title')}</h3>
              <p class="text-xs md:text-sm ${isLight ? 'text-slate-600' : 'text-slate-400'} leading-relaxed">${i18n.t('vault_desc')}</p>
            </div>
            <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono ${isLight ? 'bg-slate-100 text-slate-600 border border-slate-200' : 'bg-slate-900 text-slate-400 border border-slate-800'}">
              <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>${i18n.t('vault_node_status')}</span>
            </div>
          </div>
        `;
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

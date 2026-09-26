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

    // 初次渲染
    this.render();
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
      }
    };
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
              <h3 class="text-base md:text-lg font-bold ${isLight ? 'text-slate-900' : 'text-white'}">Google Drive 檔案保險庫隔離區</h3>
              <p class="text-xs md:text-sm text-slate-400 leading-relaxed">候選人原始履歷、所得稅 Form 16 與學歷原件全數儲存於 Google Drive 隔離區，受 180 天排他權嚴密保護，絕不污染代碼庫。</p>
            </div>
            <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono ${isLight ? 'bg-slate-100 text-slate-600 border border-slate-200' : 'bg-slate-900 text-slate-400 border border-slate-800'}">
              <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Cloud Vault Node: Drive-Partition-Ready</span>
            </div>
          </div>
        `;
        break;
      default:
        mainContent = renderJobList();
    }

    this.appRoot.innerHTML = `
      <div class="min-h-screen w-full ${isLight ? 'bg-[#F8FAFC] text-slate-900' : 'bg-brand-obsidian text-slate-100'} flex flex-col transition-colors duration-200 relative">
        ${renderHeader()}
        ${this.renderToast()}
        <main class="flex-1 w-full max-w-7xl mx-auto px-2 md:px-6 py-4 overflow-y-auto no-scrollbar">
          ${mainContent}
        </main>
        ${this.renderBottomNav()}
        ${renderApplyModal()}
      </div>
    `;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const app = new App();
  app.init();
});

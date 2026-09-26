/**
 * TrustCV PWA Header & Top Navbar Component
 */

import { i18n } from '../i18n.js';
import { store } from '../store.js';

export function renderHeader() {
  const currentLang = i18n.getLanguage();
  const { theme, currentTab } = store.getState();
  const isLight = theme === 'light';

  // 官方定版核驗標章：精確還原 assets/svg/APP開啟加載畫面.svg 之三階防偽核驗勾標 (含八角沖孔透雕)
  const brandIconSvg = `
    <div class="w-8 h-8 md:w-9 md:h-9 rounded-xl overflow-hidden flex items-center justify-center shadow-md p-1 ${isLight ? 'border border-slate-200 bg-white' : 'border border-slate-800 bg-[#080C0E]'}">
      <svg viewBox="280 50 260 415" class="w-full h-full" fill="none">
        <defs>
          <linearGradient id="hdr-top" x1="0%" y1="100%" x2="80%" y2="0%">
            <stop offset="0%" stop-color="#143b32"/>
            <stop offset="100%" stop-color="#2a725e"/>
          </linearGradient>
          <linearGradient id="hdr-mid" x1="0%" y1="100%" x2="80%" y2="0%">
            <stop offset="0%" stop-color="#1a6652"/>
            <stop offset="100%" stop-color="#34b285"/>
          </linearGradient>
          <linearGradient id="hdr-bot" x1="0%" y1="100%" x2="80%" y2="0%">
            <stop offset="0%" stop-color="#22b573"/>
            <stop offset="100%" stop-color="#40f5a3"/>
          </linearGradient>
        </defs>
        <!-- 頂層折角（深墨綠，含八角透雕沖孔） -->
        <path fill="url(#hdr-top)" fill-rule="evenodd" d="
          M 375,246 L 283,154 L 315,122 L 375,182 L 501,56 L 533,88 Z
          M 502,94.6 L 494.4,87 L 483.6,87 L 476,94.6 L 476,105.4 L 483.6,113 L 494.4,113 L 502,105.4 Z
        "/>
        <!-- 中層折角（翡翠綠，含八角透雕沖孔） -->
        <path fill="url(#hdr-mid)" fill-rule="evenodd" d="
          M 375,352 L 283,260 L 315,228 L 375,288 L 501,162 L 533,194 Z
          M 502,200.6 L 494.4,193 L 483.6,193 L 476,200.6 L 476,211.4 L 483.6,219 L 494.4,219 L 502,211.4 Z
        "/>
        <!-- 底層折角（亮薄荷綠，含八角透雕沖孔） -->
        <path fill="url(#hdr-bot)" fill-rule="evenodd" d="
          M 375,458 L 283,366 L 315,334 L 375,394 L 501,268 L 533,300 Z
          M 502,306.6 L 494.4,299 L 483.6,299 L 476,306.6 L 476,317.4 L 483.6,325 L 494.4,325 L 502,317.4 Z
        "/>
      </svg>
    </div>
  `;

  // 頂部導航項目 (PC 端)
  const navItems = [
    { id: 'jobs', label: i18n.t('nav_jobs') },
    { id: 'cv', label: i18n.t('nav_cv') },
    { id: 'status', label: i18n.t('nav_status') },
    { id: 'vault', label: i18n.t('nav_vault') }
  ];

  return `
    <header class="w-full px-4 md:px-8 py-3 flex items-center justify-between border-b border-brand-border bg-brand-obsidian/95 sticky top-0 z-40 backdrop-blur-md transition-colors duration-200">
      <div class="max-w-7xl mx-auto w-full flex items-center justify-between">
        
        <!-- 左側品牌區 -->
        <div class="flex items-center gap-3 cursor-pointer" onclick="window.TrustCV.navigateTab('jobs')">
          ${brandIconSvg}
          <div class="leading-tight">
            <div class="text-sm md:text-base font-extrabold tracking-tight flex items-center gap-1.5 ${isLight ? 'text-slate-900' : 'text-white'}">
              <span>Trust<span class="text-emerald-500 font-black">CV</span></span>
            </div>
            <div class="text-[8px] md:text-[9px] font-semibold tracking-wider uppercase ${isLight ? 'text-slate-500' : 'text-slate-400'}">${i18n.t('by_teaforia')}</div>
          </div>
        </div>

        <!-- 中間桌面端導航列 (md 以上顯示，Mobile 隱藏改用底部 Tab) -->
        <nav class="hidden md:flex items-center gap-1.5 p-1 rounded-full ${isLight ? 'bg-slate-100 border border-slate-200' : 'bg-slate-900 border border-slate-800'}">
          ${navItems.map(item => {
            const isActive = currentTab === item.id || (item.id === 'jobs' && currentTab === 'job-detail');
            const activeStyle = isActive 
              ? (isLight ? 'bg-white text-emerald-700 font-bold shadow-sm' : 'bg-brand-emerald text-slate-950 font-bold shadow-md')
              : (isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white');
            return `
              <button onclick="window.TrustCV.navigateTab('${item.id}')" class="px-4 py-1.5 rounded-full text-xs transition-all ${activeStyle}">
                ${item.label}
              </button>
            `;
          }).join('')}
        </nav>

        <!-- 右側工具欄：安裝按鈕 + 語言切換 (僅英文 EN / 中文) + 主題切換 -->
        <div class="flex items-center gap-2">
          <!-- PWA 安裝按鈕 (已安裝時自動隱藏) -->
          <button id="pwa-install-btn" onclick="window.TrustCV.promptInstall()" class="hidden items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all ${isLight ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 hover:bg-emerald-100 shadow-sm' : 'bg-emerald-950/80 text-brand-mint border border-emerald-700 hover:bg-emerald-900 shadow-sm'}">
            <svg class="w-3.5 h-3.5 fill-none stroke-current" stroke-width="2.2" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            <span>${i18n.t('install_btn')}</span>
          </button>

          <!-- 語言切換膠囊 (無簡中) -->
          <div class="flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors ${isLight ? 'bg-slate-100 border border-slate-200' : 'bg-slate-900 border border-slate-800'}">
            <span class="cursor-pointer px-1.5 transition-colors ${currentLang === 'en' ? (isLight ? 'text-emerald-700 font-bold' : 'text-brand-mint font-bold') : (isLight ? 'text-slate-500 hover:text-slate-800' : 'text-slate-400 hover:text-slate-200')}" onclick="window.TrustCV.setLang('en')">EN</span>
            <span class="${isLight ? 'text-slate-300' : 'text-slate-600'}">|</span>
            <span class="cursor-pointer px-1.5 transition-colors ${currentLang === 'zh-TW' ? (isLight ? 'text-emerald-700 font-bold' : 'text-brand-mint font-bold') : (isLight ? 'text-slate-500 hover:text-slate-800' : 'text-slate-400 hover:text-slate-200')}" onclick="window.TrustCV.setLang('zh-TW')">中文</span>
          </div>

          <!-- 深淺主題切換按鈕 -->
          <button onclick="window.TrustCV.toggleTheme()" class="p-2 rounded-xl transition-all ${isLight ? 'bg-slate-100 border border-slate-200 text-amber-600 hover:bg-slate-200' : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white'}" title="${isLight ? '切換為深色模式' : '切換為明亮模式'}">
            ${isLight 
              ? '<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72 1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>'
              : '<svg class="w-4 h-4 fill-current text-slate-300" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>'}
          </button>
        </div>

      </div>
    </header>
  `;
}

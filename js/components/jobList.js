/**
 * TrustCV Job List & Feed Component (Screen 2: Home Jobs)
 */

import { i18n } from '../i18n.js';
import { store } from '../store.js';

export function renderJobList() {
  const { jobs, searchQuery, filterCategory, theme } = store.getState();
  const currentLang = i18n.getLanguage();
  const isLight = theme === 'light';

  // 篩選搜尋
  const filteredJobs = jobs.filter(job => {
    const matchesCat = filterCategory === 'ALL' || job.job_specifications.role_category === filterCategory;
    const q = searchQuery.toLowerCase();
    const matchesQuery = !q || 
      job.job_specifications.job_title_sanitized.toLowerCase().includes(q) ||
      (job.job_specifications.job_title_en && job.job_specifications.job_title_en.toLowerCase().includes(q)) ||
      job.job_specifications.primary_technical_skills.some(s => s.toLowerCase().includes(q));
    return matchesCat && matchesQuery;
  });

  return `
    <div class="space-y-4 max-w-7xl mx-auto">
      <!-- 頂部搜尋與分類控制列 (桌面端左右雙欄排列) -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3 p-1">
        <!-- 搜尋欄 -->
        <div class="relative flex-1 md:max-w-md">
          <input 
            type="text" 
            placeholder="${i18n.t('search_placeholder')}" 
            value="${searchQuery}" 
            oninput="window.TrustCV.onSearch(this.value)"
            class="w-full rounded-xl px-4 py-2.5 text-xs focus:outline-none transition-all ${isLight ? 'bg-white border border-slate-300 text-slate-800 placeholder-slate-400 focus:border-emerald-500 shadow-sm' : 'bg-slate-900 border border-slate-800 text-slate-200 placeholder-slate-500 focus:border-brand-emerald'}"
          >
          <svg class="w-4 h-4 ${isLight ? 'text-slate-400' : 'text-slate-400'} absolute right-3.5 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
        </div>

        <!-- 篩選晶片分類 -->
        <div class="flex gap-2 overflow-x-auto no-scrollbar pb-1 text-[11px] font-medium">
          <button onclick="window.TrustCV.setFilter('ALL')" class="px-3.5 py-1.5 rounded-full transition-all shadow-sm whitespace-nowrap ${filterCategory === 'ALL' ? (isLight ? 'bg-emerald-600 text-white font-bold' : 'bg-brand-emerald text-slate-950 font-bold') : (isLight ? 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50' : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white')}">
            ${i18n.t('filter_all')}
          </button>
          <button onclick="window.TrustCV.setFilter('AUT')" class="px-3.5 py-1.5 rounded-full transition-all whitespace-nowrap ${filterCategory === 'AUT' ? (isLight ? 'bg-emerald-600 text-white font-bold' : 'bg-brand-emerald text-slate-950 font-bold') : (isLight ? 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50' : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white')}">
            ${i18n.t('filter_plc')}
          </button>
          <button onclick="window.TrustCV.setFilter('ELE')" class="px-3.5 py-1.5 rounded-full transition-all whitespace-nowrap ${filterCategory === 'ELE' ? (isLight ? 'bg-emerald-600 text-white font-bold' : 'bg-brand-emerald text-slate-950 font-bold') : (isLight ? 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50' : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white')}">
            ${i18n.t('filter_power')}
          </button>
        </div>
      </div>

      <!-- 職缺列表 (Mobile 單欄，PC 雙欄 Dashboard 佈局，消除兩側黑邊) -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        ${filteredJobs.map(job => {
          const spec = job.job_specifications;
          const comp = job.compensation_and_benefits;
          const isEn = currentLang === 'en';
          
          // 純淨語言切換：EN 狀態下為純英文；中文狀態下為純中文
          const title = isEn ? (spec.job_title_en || spec.job_title_sanitized) : spec.job_title_sanitized;
          const subtitle = isEn ? '' : (spec.job_title_en || '');
          const employerNarrative = isEn 
            ? (job.public_sanitized_profile.industry_tier_narrative_en || job.public_sanitized_profile.industry_tier_narrative)
            : job.public_sanitized_profile.industry_tier_narrative;
          const skills = isEn && spec.primary_technical_skills_en 
            ? spec.primary_technical_skills_en 
            : spec.primary_technical_skills;
          const regionCity = isEn ? `${job.public_sanitized_profile.target_region_city}, TW (${spec.openings_count} Openings)` : `${job.public_sanitized_profile.target_region_city}, 台灣 (${spec.openings_count} 名)`;

          return `
            <div class="glass-card rounded-2xl p-4 md:p-5 border transition-all duration-200 flex flex-col justify-between space-y-3.5 group relative ${isLight ? 'bg-white border-slate-200 shadow-sm hover:shadow-md' : 'border-slate-800'}">
              <div class="space-y-2">
                <div class="flex justify-between items-start gap-2">
                  <div class="space-y-1">
                    <span class="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full inline-block ${isLight ? 'text-emerald-700 bg-emerald-50 border border-emerald-200' : 'text-emerald-400 bg-emerald-950/70 border border-emerald-800/60'}">
                      ${job.jd_reference_id} • Invic Verified
                    </span>
                    <h3 class="text-sm md:text-base font-bold leading-snug cursor-pointer transition-colors ${isLight ? 'text-slate-900 group-hover:text-emerald-600' : 'text-white group-hover:text-brand-mint'}" onclick="window.TrustCV.viewJob('${job.jd_reference_id}')">
                      ${title}
                    </h3>
                    ${subtitle ? `<p class="text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}">${subtitle}</p>` : ''}
                  </div>
                  <span class="w-2.5 h-2.5 rounded-full mt-1 shrink-0 ${isLight ? 'bg-emerald-500' : 'bg-brand-mint'}"></span>
                </div>

                <!-- 脫敏雇主簡述 -->
                <div class="text-xs flex items-center gap-1.5 ${isLight ? 'text-slate-600' : 'text-slate-300'}">
                  <span class="${isLight ? 'text-slate-400' : 'text-slate-400'} font-medium">${i18n.t('employer_sanitized')}</span>
                  <span class="font-medium ${isLight ? 'text-slate-800' : 'text-white'}">${employerNarrative}</span>
                </div>

                <!-- 關鍵待遇與條件指標 -->
                <div class="grid grid-cols-2 gap-2 py-2 px-3 rounded-xl border text-[11px] ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/60 border-slate-800/80'}">
                  <div>
                    <span class="block text-[9.5px] ${isLight ? 'text-slate-500' : 'text-slate-400'}">${i18n.t('salary_range')}</span>
                    <span class="font-mono font-bold ${isLight ? 'text-emerald-700 text-xs' : 'text-brand-mint text-xs'}">NT$ ${comp.monthly_base_salary_twd_min.toLocaleString()} - ${comp.monthly_base_salary_twd_max.toLocaleString()}</span>
                  </div>
                  <div>
                    <span class="block text-[9.5px] ${isLight ? 'text-slate-500' : 'text-slate-400'}">${i18n.t('location_openings')}</span>
                    <span class="font-medium ${isLight ? 'text-slate-700' : 'text-slate-200'}">${regionCity}</span>
                  </div>
                </div>

                <!-- 技能 Tags (純淨語言對照) -->
                <div class="flex flex-wrap gap-1.5">
                  ${skills.map(s => `
                    <span class="text-[10px] px-2 py-0.5 rounded font-mono font-medium ${isLight ? 'bg-slate-100 text-slate-700 border border-slate-200' : 'bg-slate-800 text-slate-300'}">${s}</span>
                  `).join('')}
                </div>
              </div>

              <!-- 操作按鈕 (純淨語言) -->
              <div class="grid grid-cols-2 gap-2 pt-2 border-t ${isLight ? 'border-slate-100' : 'border-slate-800/80'}">
                <button onclick="window.TrustCV.viewJob('${job.jd_reference_id}')" class="py-2.5 font-semibold text-xs rounded-xl flex items-center justify-center gap-1 transition-all ${isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-700' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'}">
                  <span>${i18n.t('view_details')}</span>
                </button>
                <button onclick="window.TrustCV.applyJobPrompt('${job.jd_reference_id}')" class="py-2.5 font-bold text-xs rounded-xl flex items-center justify-center gap-1 shadow-md active:scale-95 transition-transform ${isLight ? 'bg-emerald-600 hover:bg-emerald-500 text-white' : 'bg-gradient-to-r from-brand-emerald to-brand-mint text-slate-950'}">
                  <span>${i18n.t('view_apply_btn')}</span>
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                </button>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

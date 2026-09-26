/**
 * TrustCV Job Detail & Anti-Circumvention Mask Component (Screen 3: JD Detail)
 */

import { i18n } from '../i18n.js';
import { store } from '../store.js';

export function renderJobDetail() {
  const { jobs, selectedJobId, theme, candidate } = store.getState();
  const currentLang = i18n.getLanguage();
  const isLight = theme === 'light';
  const isEn = currentLang === 'en';
  const job = jobs.find(j => j.jd_reference_id === selectedJobId) || jobs[0];

  if (!job) {
    return `<div class="p-6 text-center text-slate-400">${isEn ? 'Job requisition not found' : '職缺不存在'}</div>`;
  }

  const spec = job.job_specifications;
  const comp = job.compensation_and_benefits;
  const title = isEn ? (spec.job_title_en || spec.job_title_sanitized) : spec.job_title_sanitized;
  const subtitle = isEn ? '' : (spec.job_title_en || '');
  const employerNarrative = isEn 
    ? (job.public_sanitized_profile.industry_tier_narrative_en || job.public_sanitized_profile.industry_tier_narrative)
    : job.public_sanitized_profile.industry_tier_narrative;
  const primarySkills = isEn && spec.primary_technical_skills_en ? spec.primary_technical_skills_en : spec.primary_technical_skills;
  const secondarySkills = isEn && spec.secondary_skills_en ? spec.secondary_skills_en : spec.secondary_skills;
  const candidateName = isEn ? candidate.candidate_profile.full_name : (candidate.candidate_profile.full_name_zh || candidate.candidate_profile.full_name);
  const applicantDisplay = `${candidateName} (${candidate.dossier_id})`;

  return `
    <div class="space-y-4 max-w-7xl mx-auto pb-6">
      <!-- 頂部返回與編號條 -->
      <div class="px-3 md:px-4 py-3 flex items-center justify-between border-b rounded-2xl transition-colors ${isLight ? 'bg-white border-slate-200' : 'bg-brand-obsidian border-brand-border'}">
        <button onclick="window.TrustCV.navigateTab('jobs')" class="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg transition-colors ${isLight ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100' : 'text-slate-300 hover:text-white hover:bg-slate-800'}">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
          <span>${i18n.t('back_btn')}</span>
        </button>
        <span class="text-xs font-mono font-bold px-2.5 py-1 rounded-full ${isLight ? 'text-emerald-700 bg-emerald-50 border border-emerald-200' : 'text-emerald-400 bg-emerald-950/70 border border-emerald-800/60'}">${job.jd_reference_id}</span>
        <div class="w-12"></div>
      </div>

      <!-- 核心內容區 (PC 端左右雙欄排版：左欄核心資訊/技能，右欄防繞道與投遞) -->
      <div class="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
        
        <!-- 左欄 (7 欄)：職缺頭部、待遇、條件、技術規範 -->
        <div class="md:col-span-7 space-y-4">
          <!-- 標題與標籤 -->
          <div class="glass-card p-5 rounded-2xl border space-y-2.5 ${isLight ? 'bg-white border-slate-200 shadow-sm' : 'border-slate-800'}">
            <div class="flex flex-wrap items-center gap-2">
              <span class="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${isLight ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-emerald-950 text-brand-mint border border-emerald-800'}">
                ${isEn ? 'GREEN_VERIFIED_REQUISITION' : '二階官方綠標審訖職缺'}
              </span>
              <span class="text-[10px] font-mono flex items-center gap-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}">
                <svg class="w-3.5 h-3.5 text-amber-500" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd"/></svg>
                ${i18n.t('exclusive_180d')}
              </span>
            </div>
            <h2 class="text-lg md:text-xl font-black leading-snug ${isLight ? 'text-slate-900' : 'text-white'}">${title}</h2>
            ${subtitle ? `<p class="text-xs md:text-sm ${isLight ? 'text-slate-500' : 'text-slate-400'}">${subtitle}</p>` : ''}
          </div>

          <!-- 待遇與基本條件 -->
          <div class="grid grid-cols-2 gap-3 text-xs">
            <div class="p-4 rounded-2xl border ${isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900/60 border-slate-800'}">
              <span class="text-[10px] block font-medium ${isLight ? 'text-slate-500' : 'text-slate-400'}">${i18n.t('salary_range')}</span>
              <span class="font-bold font-mono text-sm md:text-base ${isLight ? 'text-emerald-700' : 'text-brand-mint'}">NT$ ${comp.monthly_base_salary_twd_min.toLocaleString()} - ${comp.monthly_base_salary_twd_max.toLocaleString()}</span>
              <span class="text-[9.5px] block mt-1 ${isLight ? 'text-slate-400' : 'text-slate-500'}">${isEn ? `Est. ₹${(comp.monthly_base_salary_inr_estimated_min/1000).toFixed(0)}k - ${(comp.monthly_base_salary_inr_estimated_max/1000).toFixed(0)}k INR/mo` : `約 ₹${(comp.monthly_base_salary_inr_estimated_min/1000).toFixed(0)}k - ${(comp.monthly_base_salary_inr_estimated_max/1000).toFixed(0)}k 印幣`}</span>
            </div>
            <div class="p-4 rounded-2xl border ${isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900/60 border-slate-800'}">
              <span class="text-[10px] block font-medium ${isLight ? 'text-slate-500' : 'text-slate-400'}">${i18n.t('exp_edu_requirement')}</span>
              <span class="font-bold font-mono text-sm md:text-base ${isLight ? 'text-slate-800' : 'text-white'}">${spec.minimum_experience_years}+ ${i18n.t('years_experience')}</span>
              <span class="text-[9.5px] block mt-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}">${i18n.t('bachelor_degree')}</span>
            </div>
          </div>

          <!-- 核心技能規範清單 -->
          <div class="glass-card p-5 rounded-2xl border space-y-3 ${isLight ? 'bg-white border-slate-200 shadow-sm' : 'border-slate-800'}">
            <h4 class="text-xs font-bold uppercase tracking-wider ${isLight ? 'text-slate-800' : 'text-slate-200'}">${i18n.t('key_requirements')}</h4>
            <ul class="text-xs space-y-2 list-disc list-inside p-3.5 rounded-xl border leading-relaxed ${isLight ? 'bg-slate-50 border-slate-200 text-slate-700' : 'bg-slate-900/40 border-slate-800/80 text-slate-300'}">
              ${primarySkills.map(s => `<li>${s}</li>`).join('')}
              ${secondarySkills ? secondarySkills.map(s => `<li>${s}</li>`).join('') : ''}
            </ul>
          </div>
        </div>

        <!-- 右欄 (5 欄)：防繞道三門檻雇主遮罩 ＋ 投遞行動區 (PC 端側邊常駐) -->
        <div class="md:col-span-5 space-y-4">
          <!-- 防繞道三門檻雇主遮罩卡片 (Triple-Gate Mask) -->
          <div class="glass-card p-5 rounded-2xl border space-y-3 ${isLight ? 'bg-white border-slate-200 shadow-sm' : 'border-brand-border'}">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold ${isLight ? 'text-slate-700' : 'text-slate-300'}">${i18n.t('employer_mask_title')}</span>
              <span class="text-[10px] font-mono px-2 py-0.5 rounded-full ${isLight ? 'text-amber-800 bg-amber-50 border border-amber-200' : 'text-amber-400 bg-amber-950/60 border border-amber-800/60'}">
                ${isEn ? 'Triple-Gate Encrypted' : '三道加密隔離'}
              </span>
            </div>
            <p class="text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'}">
              ${employerNarrative}
            </p>
            <div class="text-[11px] p-3 rounded-xl border flex items-start gap-2 leading-relaxed ${isLight ? 'bg-amber-50/70 border-amber-200/80 text-amber-900' : 'bg-slate-900/80 border-slate-800 text-slate-300'}">
              <span class="text-emerald-500 font-bold text-xs mt-0.5">ℹ</span>
              <span>${i18n.t('employer_mask_desc')}</span>
            </div>
          </div>

          <!-- 常駐投遞卡片 -->
          <div class="glass-card p-5 rounded-2xl border space-y-3.5 sticky top-20 ${isLight ? 'bg-white border-slate-200 shadow-md' : 'border-brand-border'}">
            <div class="flex items-center justify-between text-xs px-1">
              <span class="${isLight ? 'text-slate-500' : 'text-slate-400'}">${i18n.t('current_applicant')}</span>
              <span class="font-mono font-bold ${isLight ? 'text-emerald-700' : 'text-brand-mint'}">${applicantDisplay}</span>
            </div>
            <button onclick="window.TrustCV.applyJobPrompt('${job.jd_reference_id}')" class="w-full py-3.5 font-extrabold text-xs md:text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all ${isLight ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20' : 'bg-gradient-to-r from-brand-emerald to-brand-mint text-slate-950 shadow-emerald-950/40'}">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
              <span>${i18n.t('apply_with_profile')}</span>
            </button>
            <p class="text-[10px] text-center ${isLight ? 'text-slate-400' : 'text-slate-500'}">
              ${i18n.t('protection_notice')}
            </p>
          </div>
        </div>

      </div>
    </div>
  `;
}

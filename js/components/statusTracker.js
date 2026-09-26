/**
 * TrustCV Pipeline Status & Dossier Hub Component (Screen 4 & Status View)
 */

import { i18n } from '../i18n.js';
import { store } from '../store.js';

export function renderStatusTracker() {
  const { pipeline, theme } = store.getState();
  const isLight = theme === 'light';

  return `
    <div class="space-y-5 max-w-7xl mx-auto pb-6">
      <div class="glass-card p-5 rounded-2xl border ${isLight ? 'bg-white border-slate-200 shadow-sm' : 'border-slate-800'}">
        <span class="text-[10px] font-mono px-2.5 py-0.5 rounded-full inline-block font-semibold ${isLight ? 'text-emerald-700 bg-emerald-50 border border-emerald-200' : 'text-emerald-400 bg-emerald-950/70 border border-emerald-800/60'}">
          ${pipeline.application_id}
        </span>
        <h2 class="text-lg md:text-xl font-black mt-2 ${isLight ? 'text-slate-900' : 'text-white'}">${i18n.t('pipeline_tracker')}</h2>
        <p class="text-xs md:text-sm ${isLight ? 'text-slate-500' : 'text-slate-400'}">${i18n.t('pipeline_sub')}</p>
      </div>

      <!-- 六階段狀態進度樹 (在 PC 端可兩欄展開或寬版卡片排列) -->
      <div class="glass-card p-5 md:p-6 rounded-2xl border ${isLight ? 'bg-white border-slate-200 shadow-sm' : 'border-slate-800'}">
        <div class="space-y-4 relative before:absolute before:left-4 before:top-3 before:bottom-3 before:w-0.5 ${isLight ? 'before:bg-slate-200' : 'before:bg-slate-800'}">
          ${pipeline.stages.map((stage, idx) => {
            const currentLang = i18n.getLanguage();
            const stageDisplayName = (currentLang === 'en' && stage.name_en) ? stage.name_en : stage.name;
            let badgeClass = isLight ? 'bg-slate-100 text-slate-500 border-slate-200' : 'bg-slate-800 text-slate-400 border-slate-700';
            let dotClass = isLight ? 'bg-slate-200 text-slate-600' : 'bg-slate-700 text-slate-300';
            
            if (stage.status === 'COMPLETED') {
              badgeClass = isLight ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-emerald-950 text-brand-mint border-emerald-800';
              dotClass = isLight ? 'bg-emerald-600 text-white shadow-sm ring-4 ring-emerald-100' : 'bg-brand-mint text-slate-950 ring-4 ring-brand-emerald/20';
            } else if (stage.status === 'IN_PROGRESS') {
              badgeClass = isLight ? 'bg-amber-50 text-amber-800 border-amber-200' : 'bg-amber-950 text-amber-400 border-amber-800';
              dotClass = isLight ? 'bg-amber-500 text-white ring-4 ring-amber-100 animate-pulse' : 'bg-amber-400 text-slate-950 ring-4 ring-amber-400/20 animate-ping';
            }

            return `
              <div class="flex items-start gap-4 relative z-10">
                <div class="w-8 h-8 rounded-full ${dotClass} flex items-center justify-center text-xs font-black shrink-0 mt-0.5">
                  ${stage.status === 'COMPLETED' ? '✓' : idx + 1}
                </div>
                <div class="flex-1 p-4 rounded-xl border transition-all ${isLight ? 'bg-slate-50/70 border-slate-200 hover:bg-slate-50' : 'glass-card border-slate-800/80'} space-y-1">
                  <div class="flex justify-between items-center">
                    <h4 class="text-xs md:text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'}">${stageDisplayName}</h4>
                    <span class="text-[10px] font-mono px-2 py-0.5 rounded border font-semibold ${badgeClass}">
                      ${stage.status}
                    </span>
                  </div>
                  <p class="text-[10.5px] font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}">${stage.code}</p>
                  ${stage.timestamp ? `<span class="text-[9.5px] font-mono block ${isLight ? 'text-slate-400' : 'text-slate-500'}">${stage.timestamp}</span>` : ''}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    </div>
  `;
}

export function renderDossierHub() {
  const { candidate, theme } = store.getState();
  const isLight = theme === 'light';
  const prof = candidate.candidate_profile;
  const cred = candidate.verified_credentials;
  const audit = candidate.human_audit_assessment;

  return `
    <div class="space-y-5 max-w-7xl mx-auto pb-6">
      <!-- 頂部標題卡 -->
      <div class="glass-card p-5 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-3 ${isLight ? 'bg-white border-slate-200 shadow-sm' : 'border-slate-800'}">
        <div>
          <span class="text-[10px] font-mono px-2.5 py-0.5 rounded-full inline-block font-semibold ${isLight ? 'text-emerald-700 bg-emerald-50 border border-emerald-200' : 'text-emerald-400 bg-emerald-950/70 border border-emerald-800/60'}">
            ${candidate.dossier_id}
          </span>
          <h2 class="text-lg md:text-xl font-black mt-1.5 ${isLight ? 'text-slate-900' : 'text-white'}">${i18n.t('my_cv_title')}</h2>
          <p class="text-xs md:text-sm ${isLight ? 'text-slate-500' : 'text-slate-400'}">${i18n.t('my_cv_subtitle')}</p>
        </div>
        <span class="self-start md:self-auto text-[11px] px-3 py-1 rounded-full font-mono font-bold ${isLight ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-emerald-950 text-brand-mint border border-emerald-800'}">
          ${candidate.metadata.verification_level}
        </span>
      </div>

      <!-- 桌面端雙欄佈局 (左欄：綠標徽章與候選人屬性，右欄：主管綜合評審與詳細背書) -->
      <div class="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
        
        <!-- 左欄 (6 欄) -->
        <div class="md:col-span-6 space-y-4">
          <!-- 綠標徽章與評分 -->
          <div class="glass-card p-5 rounded-2xl border space-y-3 ${isLight ? 'bg-white border-emerald-200 shadow-sm' : 'border-brand-emerald/40'}">
            <div class="flex justify-between items-center border-b pb-3 ${isLight ? 'border-slate-100' : 'border-slate-800'}">
              <span class="text-xs md:text-sm font-bold flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-white'}">
                <span class="w-3 h-3 rounded-full ${isLight ? 'bg-emerald-500' : 'bg-brand-mint'}"></span>
                <span>TEAFORIA VERIFIED BADGE</span>
              </span>
              <span class="text-xs md:text-sm font-bold font-mono ${isLight ? 'text-emerald-700' : 'text-brand-mint'}">${candidate.risk_scoring.background_integrity_score} / 100 分</span>
            </div>
            <div class="grid grid-cols-2 gap-2.5 text-xs pt-1">
              <div class="flex items-center gap-1.5 ${isLight ? 'text-slate-700' : 'text-slate-200'}">
                <span class="text-emerald-600 font-bold">✔</span>
                <span>${i18n.t('audit_check_aicte')}</span>
              </div>
              <div class="flex items-center gap-1.5 ${isLight ? 'text-slate-700' : 'text-slate-200'}">
                <span class="text-emerald-600 font-bold">✔</span>
                <span>${i18n.t('audit_check_form16')}</span>
              </div>
              <div class="flex items-center gap-1.5 ${isLight ? 'text-slate-700' : 'text-slate-200'}">
                <span class="text-emerald-600 font-bold">✔</span>
                <span>${i18n.t('audit_check_relieving')}</span>
              </div>
              <div class="flex items-center gap-1.5 ${isLight ? 'text-slate-700' : 'text-slate-200'}">
                <span class="text-emerald-600 font-bold">✔</span>
                <span>${i18n.t('audit_check_video')}</span>
              </div>
            </div>
          </div>

          <!-- 候選人基本資料卡 -->
          <div class="glass-card p-5 rounded-2xl border space-y-3 ${isLight ? 'bg-white border-slate-200 shadow-sm' : 'border-slate-800'}">
            <h4 class="font-bold border-b pb-2 text-xs md:text-sm ${isLight ? 'text-slate-900 border-slate-100' : 'text-white border-slate-800'}">${i18n.t('candidate_basic_info')}</h4>
            <div class="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span class="block text-[9.5px] ${isLight ? 'text-slate-500' : 'text-slate-400'}">${i18n.t('full_name')}</span>
                <span class="font-semibold ${isLight ? 'text-slate-900' : 'text-white'}">${prof.full_name}</span>
              </div>
              <div>
                <span class="block text-[9.5px] ${isLight ? 'text-slate-500' : 'text-slate-400'}">${i18n.t('proxy_email')}</span>
                <span class="font-mono font-medium ${isLight ? 'text-emerald-700' : 'text-brand-mint'}">${prof.contact_masked.email_proxy}</span>
              </div>
              <div>
                <span class="block text-[9.5px] ${isLight ? 'text-slate-500' : 'text-slate-400'}">${i18n.t('total_exp')}</span>
                <span class="font-mono font-bold ${isLight ? 'text-slate-800' : 'text-white'}">${cred.career_timeline_integrity.total_experience_years_verified} ${i18n.t('years_experience')}</span>
              </div>
              <div>
                <span class="block text-[9.5px] ${isLight ? 'text-slate-500' : 'text-slate-400'}">${i18n.t('passport_validity')}</span>
                <span class="font-mono font-medium ${isLight ? 'text-slate-800' : 'text-white'}">${prof.identity_documents.passport_valid_months_remaining} ${i18n.t('months_remaining')}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 右欄 (6 欄)：主管綜合推薦與初審存證 -->
        <div class="md:col-span-6 space-y-4">
          <div class="glass-card p-5 rounded-2xl border space-y-3 ${isLight ? 'bg-white border-slate-200 shadow-sm' : 'border-slate-800'}">
            <h4 class="font-bold text-xs md:text-sm ${isLight ? 'text-emerald-700' : 'text-brand-mint'}">${i18n.t('audit_summary_title')}</h4>
            <div class="p-4 rounded-xl border leading-relaxed text-xs md:text-sm ${isLight ? 'bg-slate-50 border-slate-200 text-slate-700' : 'bg-slate-900/60 border-slate-800 text-slate-300'}">
              ${i18n.getLanguage() === 'en' && audit.interviewer_executive_summary_en ? audit.interviewer_executive_summary_en : audit.interviewer_executive_summary}
            </div>
            <div class="flex items-center justify-between text-[10px] font-mono pt-2 ${isLight ? 'text-slate-400' : 'text-slate-500'}">
              <span>${i18n.t('auditor_label')} ${audit.auditor_name}</span>
              <span>${i18n.t('audit_date_label')} ${audit.audit_completed_date}</span>
            </div>
          </div>

          <div class="p-4 rounded-2xl border text-xs flex items-center justify-between ${isLight ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-emerald-950/60 border-emerald-800 text-brand-mint'}">
            <div class="flex items-center gap-2">
              <span class="text-base">🛡️</span>
              <span>${i18n.t('dossier_dual_track_ready')}</span>
            </div>
            <span class="font-mono font-bold text-[10px] px-2 py-0.5 rounded bg-emerald-600 text-white">Dossier Ready</span>
          </div>
        </div>

      </div>
    </div>
  `;
}

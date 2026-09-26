/**
 * TrustCV Application Modal Component (Screen 2/3: Quick Apply Dialog)
 */

import { i18n } from '../i18n.js';
import { store } from '../store.js';

export function renderApplyModal() {
  const { applyModalOpen, applyTargetJob, candidate, theme } = store.getState();
  if (!applyModalOpen || !applyTargetJob) return '';
  const isLight = theme === 'light';

  return `
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-modal-in">
      <div class="border rounded-2xl w-full max-w-md p-5 space-y-4 shadow-2xl relative transition-all ${isLight ? 'bg-white border-slate-200 text-slate-900 shadow-slate-900/10' : 'bg-brand-card border-brand-emerald/50 text-slate-100'}">
        <div class="flex justify-between items-center border-b pb-3 ${isLight ? 'border-slate-100' : 'border-brand-border'}">
          <h3 class="text-sm md:text-base font-bold flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-white'}">
            <span class="w-2.5 h-2.5 rounded-full ${isLight ? 'bg-emerald-500' : 'bg-brand-mint'}"></span>
            <span>${i18n.t('apply_modal_title')}</span>
          </h3>
          <button onclick="window.TrustCV.closeApplyModal()" class="p-1 rounded-lg transition-colors ${isLight ? 'text-slate-400 hover:text-slate-700 hover:bg-slate-100' : 'text-slate-400 hover:text-white hover:bg-slate-800'}">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        <div class="p-3 rounded-xl border text-xs ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/60 border-slate-800'}">
          <span class="block text-[10px] ${isLight ? 'text-slate-500' : 'text-slate-400'}">${i18n.t('applying_job')}</span>
          <p class="font-bold text-xs md:text-sm mt-0.5 ${isLight ? 'text-emerald-700' : 'text-brand-mint'}">${applyTargetJob.job_specifications.job_title_sanitized}</p>
          <span class="text-[10px] font-mono block mt-0.5 ${isLight ? 'text-slate-400' : 'text-slate-500'}">${applyTargetJob.jd_reference_id}</span>
        </div>

        <form onsubmit="window.TrustCV.handleApplySubmit(event)" class="space-y-3.5 text-xs">
          <div>
            <label class="block font-medium mb-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}">${i18n.t('candidate_name')}</label>
            <input type="text" name="name" required value="${candidate.candidate_profile.full_name}" class="w-full rounded-xl px-3.5 py-2 text-xs focus:outline-none transition-all ${isLight ? 'bg-white border border-slate-300 text-slate-800 focus:border-emerald-500' : 'bg-slate-900 border border-slate-800 text-white focus:border-brand-emerald'}">
          </div>
          <div>
            <label class="block font-medium mb-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}">${i18n.t('email_proxy')}</label>
            <input type="email" name="email" required value="${candidate.candidate_profile.contact_masked.email_proxy}" class="w-full rounded-xl px-3.5 py-2 text-xs font-mono focus:outline-none transition-all ${isLight ? 'bg-white border border-slate-300 text-slate-800 focus:border-emerald-500' : 'bg-slate-900 border border-slate-800 text-white focus:border-brand-emerald'}">
          </div>
          <div>
            <label class="block font-medium mb-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}">${i18n.t('phone_masked')}</label>
            <input type="text" name="phone" required value="${candidate.candidate_profile.contact_masked.phone_masked}" class="w-full rounded-xl px-3.5 py-2 text-xs font-mono focus:outline-none transition-all ${isLight ? 'bg-white border border-slate-300 text-slate-800 focus:border-emerald-500' : 'bg-slate-900 border border-slate-800 text-white focus:border-brand-emerald'}">
          </div>
          <div>
            <label class="block font-medium mb-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}">${i18n.t('resume_file')}</label>
            <input type="file" name="resume" accept=".pdf,.docx,.txt" class="w-full rounded-xl px-2.5 py-1.5 text-xs file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-[11px] file:font-semibold transition-all ${isLight ? 'bg-slate-50 border border-slate-200 text-slate-600 file:bg-emerald-100 file:text-emerald-800' : 'bg-slate-900 border border-slate-800 text-slate-400 file:bg-brand-emerald/20 file:text-brand-mint'}">
            <span class="text-[9.5px] mt-1 block ${isLight ? 'text-emerald-700' : 'text-slate-500'}">🔒 ${i18n.t('binary_file_isolation')}</span>
          </div>

          <div class="grid grid-cols-2 gap-2.5 pt-2">
            <button type="button" onclick="window.TrustCV.closeApplyModal()" class="py-2.5 rounded-xl font-semibold transition-colors ${isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-700' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'}">
              ${i18n.t('cancel')}
            </button>
            <button type="submit" class="py-2.5 rounded-xl font-bold shadow-md active:scale-95 transition-transform ${isLight ? 'bg-emerald-600 hover:bg-emerald-500 text-white' : 'bg-gradient-to-r from-brand-emerald to-brand-mint text-slate-950'}">
              ${i18n.t('submit_application')}
            </button>
          </div>
        </form>
      </div>
    </div>
  `;
}

/**
 * TrustCV 104-Aligned Dynamic Resume Canvas Component (js/components/myCv.js)
 * Implements 12 Standard Profile Sections, Dual-Track Input (AI Dropzone + Manual Form Modal),
 * 2-State Privacy Toggle (👁️ Public / 🙈 Private), Top Cloud Sync Status Bar,
 * and 0ms Local-First + 3000ms Debounced Drive Auto-Save.
 */

import { store } from '../store.js';
import { i18n } from '../i18n.js';

function isEn() { return i18n.getLanguage() === 'en'; }
function t(zh, en) { return isEn() ? en : zh; }

export function renderMyCv() {
  const { masterProfile, syncStatus, lastSyncedTime, user, theme } = store.getState();
  const isLight = theme === 'light';
  const p = masterProfile;

  return `
    <div class="max-w-5xl mx-auto space-y-6 pb-12 animate-fade-in">

      <!-- ── 頂部狀態橫條 (大頭照、雲端防抖同步微光、手動儲存按鈕) ── -->
      ${renderTopStatusBar(p, syncStatus, lastSyncedTime, user, isLight)}

      <!-- ── 雙軌輸入引導橫幅 (ADR 003) ── -->
      <div class="p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3
        ${isLight ? 'bg-gradient-to-r from-emerald-50/80 to-teal-50/80 border-emerald-200' : 'bg-gradient-to-r from-emerald-950/30 to-teal-950/20 border-emerald-800/50'}">
        <div class="flex items-center gap-3">
          <span class="text-2xl">✨</span>
          <div>
            <div class="text-xs md:text-sm font-bold ${isLight ? 'text-emerald-900' : 'text-emerald-300'}">
              ${t('104 人力銀行標準架構 · 雙軌智慧履歷工作台', '104-Aligned 12-Section Profile · Dual-Track Input Canvas')}
            </div>
            <div class="text-[11px] ${isLight ? 'text-emerald-700/80' : 'text-emerald-400/80'} mt-0.5">
              ${t('支援「✨ 拖曳檔案 AI 提煉填寫」與「➕ 手動自由打字」，不上傳證件亦可投遞。每筆條目享 100% 個人公開/隱藏自主權。',
                  'Support AI extraction & manual entry without mandatory attachments. 100% individual control over Public/Private privacy.')}
            </div>
          </div>
        </div>
        <div class="flex items-center gap-2 shrink-0">
          <button onclick="window.TrustCV.forceSaveProfile()"
            class="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white transition-all shadow-md active:scale-95 flex items-center gap-1.5
            ${isLight ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'}">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
            <span>${t('立即儲存並同步', 'Save & Sync Now')}</span>
          </button>
        </div>
      </div>

      <!-- ── 12 大區塊動態畫布卡片流 ── -->
      <div class="space-y-5">
        <!-- 1. 基本資料 (Basic Info) -->
        ${renderBasicInfoCard(p.basic_info, isLight)}

        <!-- 2. 求職條件 (Job Preferences) -->
        ${renderJobPreferencesCard(p.job_preferences, isLight)}

        <!-- 3. 工作經歷 (Work Experiences) -->
        ${renderWorkExperiencesCard(p.work_experiences, isLight)}

        <!-- 4. 學歷背景 (Educations) -->
        ${renderEducationsCard(p.educations, isLight)}

        <!-- 5. 語文能力 (Languages) -->
        ${renderLanguagesCard(p.languages, isLight)}

        <!-- 6. 專業專長 (Skills) -->
        ${renderSkillsCard(p.skills, isLight)}

        <!-- 7. 資格認證 (Certificates) -->
        ${renderCertificatesCard(p.certificates, isLight)}

        <!-- 8. 自傳 (Autobiography) -->
        ${renderAutobiographyCard(p.autobiography, isLight)}

        <!-- 9. 佐證附件 (Attachments) -->
        ${renderAttachmentsCard(p.attachments, isLight)}

        <!-- 10. 專案成就 (Project Achievements) -->
        ${renderProjectAchievementsCard(p.project_achievements, isLight)}

        <!-- 11. 推薦人 (References) -->
        ${renderReferencesCard(p.references, isLight)}

        <!-- 12. 自訂區塊 (Custom Sections) -->
        ${renderCustomSectionsCard(p.custom_sections, isLight)}
      </div>

      <!-- ── 履歷手動新增/編輯通用輕量 Modal ── -->
      <div id="cv-modal-container"></div>

    </div>
  `;
}

/* ─────────────────── 頂部狀態橫條 ─────────────────── */

function renderTopStatusBar(profile, syncStatus, lastSyncedTime, user, isLight) {
  const b = profile.basic_info || {};

  let syncBadge = '';
  if (syncStatus === 'saving') {
    syncBadge = `
      <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border animate-pulse
        ${isLight ? 'bg-amber-50 text-amber-700 border-amber-300' : 'bg-amber-950/60 text-amber-300 border-amber-800'}">
        <span class="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
        ${t('💾 正在儲存至 Google Drive…', 'Saving to Google Drive…')}
      </span>
    `;
  } else if (syncStatus === 'saved') {
    syncBadge = `
      <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border transition-all
        ${isLight ? 'bg-emerald-50 text-emerald-700 border-emerald-300' : 'bg-emerald-950/60 text-brand-mint border-emerald-800'}">
        <svg class="w-3.5 h-3.5 text-emerald-500" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
        ${t('☁️ 已同步至 Google Drive', 'Synced with Google Drive')}
      </span>
    `;
  } else if (syncStatus === 'offline') {
    syncBadge = `
      <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border
        ${isLight ? 'bg-slate-100 text-slate-600 border-slate-300' : 'bg-slate-800 text-slate-400 border-slate-700'}">
        <span class="w-2 h-2 rounded-full bg-slate-400"></span>
        ${t('💾 離線暫存中 (已保存在本機)', 'Offline draft saved locally')}
      </span>
    `;
  } else {
    syncBadge = `
      <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border
        ${isLight ? 'bg-red-50 text-red-600 border-red-300' : 'bg-red-950/60 text-red-400 border-red-800'}">
        ⚠️ ${t('雲端同步中斷 (已保存在本機)', 'Drive sync error (Saved locally)')}
      </span>
    `;
  }

  return `
    <div class="p-4 md:p-5 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-4
      ${isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-brand-card border-brand-border'}">

      <!-- 左側大頭照與候選人全名 -->
      <div class="flex items-center gap-3.5 min-w-0">
        <div class="relative group">
          <div class="w-14 h-14 rounded-2xl overflow-hidden ring-2 shrink-0 flex items-center justify-center font-bold text-lg
            ${isLight ? 'ring-emerald-200 bg-emerald-50 text-emerald-700' : 'ring-emerald-800 bg-emerald-950 text-brand-mint'}">
            ${b.avatar_url ? `<img src="${b.avatar_url}" class="w-full h-full object-cover">` : (b.full_name || 'CV')[0].toUpperCase()}
          </div>
          <label class="absolute inset-0 bg-black/50 text-white rounded-2xl opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-[9px] cursor-pointer transition-opacity">
            <input type="file" accept="image/*" class="hidden" onchange="window.TrustCV.uploadAvatar(this)">
            <span>${t('換照片', 'Change')}</span>
          </label>
        </div>

        <div class="min-w-0">
          <div class="flex items-center gap-2">
            <h2 class="text-base md:text-lg font-black truncate ${isLight ? 'text-slate-900' : 'text-white'}">
              ${isEn() ? (b.full_name || 'My Profile') : (b.full_name_zh || b.full_name || '個人履歷')}
            </h2>
            <span class="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${isLight ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-blue-950 text-blue-400 border border-blue-800'}">
              104 SSOT
            </span>
          </div>
          <div class="text-xs truncate ${isLight ? 'text-slate-500' : 'text-slate-400'} mt-0.5">
            ${b.email || '—'} · ${b.phone || '—'}
          </div>
        </div>
      </div>

      <!-- 右側同步標籤與手動強制同步按鈕 -->
      <div class="flex items-center gap-3 self-end md:self-auto">
        ${syncBadge}
        ${!user ? `
          <button onclick="window.TrustCV.signInGoogle()"
            class="px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all
            ${isLight ? 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100' : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'}">
            ${t('登入 Google 雲端自動同步', 'Sign In to Sync Drive')}
          </button>
        ` : ''}
      </div>

    </div>
  `;
}

/* ─────────────────── 通用卡片外框組件 ─────────────────── */

function renderSectionHeader({ title, subtitle, icon, onAdd, dropZoneKey, isLight }) {
  return `
    <div class="p-4 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${isLight ? 'border-slate-100' : 'border-brand-border'}">
      <div class="flex items-center gap-2.5">
        <span class="text-xl">${icon}</span>
        <div>
          <h3 class="text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'}">${title}</h3>
          <p class="text-[10px] ${isLight ? 'text-slate-400' : 'text-slate-500'}">${subtitle}</p>
        </div>
      </div>
      <div class="flex items-center gap-2">
        ${onAdd ? `
          <button onclick="${onAdd}"
            class="px-3 py-1 rounded-xl text-xs font-bold border transition-all flex items-center gap-1
            ${isLight ? 'bg-slate-100 hover:bg-emerald-50 hover:border-emerald-300 text-slate-700 hover:text-emerald-700 border-slate-200'
                      : 'bg-slate-800 hover:bg-emerald-950/60 hover:border-emerald-800 text-slate-300 hover:text-brand-mint border-slate-700'}">
            <span>➕</span>
            <span>${t('手動新增', 'Add New')}</span>
          </button>
        ` : ''}
      </div>
    </div>

    <!-- 區塊頂部「✨ AI 智能拖曳區」 (ADR 003) -->
    ${dropZoneKey ? `
      <div class="px-4 pt-3 pb-1">
        <div class="border border-dashed rounded-xl p-3 text-center transition-all cursor-pointer group
          ${isLight ? 'border-slate-200 hover:border-emerald-400 bg-slate-50/50 hover:bg-emerald-50/40'
                    : 'border-slate-800 hover:border-emerald-600 bg-slate-900/30 hover:bg-emerald-950/20'}"
          onclick="window.TrustCV.triggerAiDropzone('${dropZoneKey}')">
          <input type="file" id="ai-dropzone-input-${dropZoneKey}" class="hidden" multiple
            onchange="window.TrustCV.handleAiDropzoneUpload('${dropZoneKey}', this)">
          <div class="flex items-center justify-center gap-2 text-xs font-medium ${isLight ? 'text-slate-600 group-hover:text-emerald-700' : 'text-slate-400 group-hover:text-emerald-400'}">
            <span>✨</span>
            <span>${t('拖曳檔案或點此選取，由打工仔 AI 自動提煉填入本區塊', 'Drag file or click to auto-extract into this section')}</span>
          </div>
        </div>
      </div>
    ` : ''}
  `;
}

function renderPrivacyToggle(sectionKey, itemId, isPublic, isLight) {
  const isChecked = Boolean(isPublic);
  return `
    <button onclick="window.TrustCV.togglePrivacy('${sectionKey}', '${itemId}')"
      class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all
      ${isChecked
        ? (isLight ? 'bg-emerald-50 text-emerald-700 border-emerald-300' : 'bg-emerald-950/50 text-brand-mint border-emerald-800')
        : (isLight ? 'bg-slate-100 text-slate-500 border-slate-200' : 'bg-slate-800/80 text-slate-400 border-slate-700')}"
      title="${isChecked ? t('公開項目：投遞時將納入簡歷與快照', 'Public: Included in applications') : t('隱藏項目：僅自己可見，投遞完全隱蔽', 'Private: Hidden from employers')}">
      <span>${isChecked ? '👁️' : '🙈'}</span>
      <span>${isChecked ? t('公開', 'Public') : t('隱藏', 'Private')}</span>
    </button>
  `;
}

/* ─────────────────── 1. 基本資料卡片 ─────────────────── */

function renderBasicInfoCard(b = {}, isLight) {
  return `
    <div class="rounded-2xl overflow-hidden border ${isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-brand-card border-brand-border'}">
      ${renderSectionHeader({
        title: t('1. 個人基本資料', '1. Basic Information'),
        subtitle: t('姓名、性別、出生年月、身份證/護照與聯絡資訊 (必填)', 'Name, gender, birth date, ID/Passport & contact (Required)'),
        icon: '👤',
        onAdd: "window.TrustCV.openEditBasicInfoModal()",
        dropZoneKey: 'basic_info',
        isLight
      })}

      <div class="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 text-xs">
        <div class="p-3 rounded-xl border ${isLight ? 'bg-slate-50/70 border-slate-200' : 'bg-slate-900/40 border-slate-800'}">
          <span class="block text-[10px] ${isLight ? 'text-slate-400' : 'text-slate-500'}">${t('護照法定全名 (英文 / 中文)', 'Legal Full Name')}</span>
          <span class="font-bold text-sm ${isLight ? 'text-slate-800' : 'text-white'}">${b.full_name || '—'}</span>
          ${b.full_name_zh ? `<span class="text-xs text-emerald-600 block mt-0.5">(${b.full_name_zh})</span>` : ''}
        </div>

        <div class="p-3 rounded-xl border ${isLight ? 'bg-slate-50/70 border-slate-200' : 'bg-slate-900/40 border-slate-800'}">
          <span class="block text-[10px] ${isLight ? 'text-slate-400' : 'text-slate-500'}">${t('性別與出生日期', 'Gender & Date of Birth')}</span>
          <span class="font-semibold ${isLight ? 'text-slate-800' : 'text-white'}">${b.gender || '—'} · ${b.date_of_birth || '—'}</span>
        </div>

        <div class="p-3 rounded-xl border ${isLight ? 'bg-slate-50/70 border-slate-200' : 'bg-slate-900/40 border-slate-800'}">
          <span class="block text-[10px] ${isLight ? 'text-slate-400' : 'text-slate-500'}">${t('聯絡電子郵件 (Proxy Protected)', 'Email Address')}</span>
          <span class="font-mono font-medium truncate block ${isLight ? 'text-emerald-700' : 'text-brand-mint'}">${b.email || '—'}</span>
        </div>

        <div class="p-3 rounded-xl border ${isLight ? 'bg-slate-50/70 border-slate-200' : 'bg-slate-900/40 border-slate-800'}">
          <span class="block text-[10px] ${isLight ? 'text-slate-400' : 'text-slate-500'}">${t('聯絡電話', 'Phone Number')}</span>
          <span class="font-mono font-semibold ${isLight ? 'text-slate-800' : 'text-white'}">${b.phone || '—'}</span>
        </div>

        <div class="p-3 rounded-xl border ${isLight ? 'bg-slate-50/70 border-slate-200' : 'bg-slate-900/40 border-slate-800'}">
          <span class="block text-[10px] ${isLight ? 'text-slate-400' : 'text-slate-500'}">${t('身份證號 / 護照卡號', 'ID / Passport Number')}</span>
          <span class="font-mono font-semibold ${isLight ? 'text-slate-800' : 'text-white'}">${b.id_or_passport || '—'}</span>
        </div>

        <div class="p-3 rounded-xl border ${isLight ? 'bg-slate-50/70 border-slate-200' : 'bg-slate-900/40 border-slate-800'}">
          <span class="block text-[10px] ${isLight ? 'text-slate-400' : 'text-slate-500'}">${t('通訊地址', 'Current Address')}</span>
          <span class="font-medium truncate block ${isLight ? 'text-slate-800' : 'text-white'}">${b.address || '—'}</span>
        </div>
      </div>
    </div>
  `;
}

/* ─────────────────── 2. 求職條件卡片 ─────────────────── */

function renderJobPreferencesCard(pref = {}, isLight) {
  return `
    <div class="rounded-2xl overflow-hidden border ${isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-brand-card border-brand-border'}">
      ${renderSectionHeader({
        title: t('2. 求職條件', '2. Job Preferences'),
        subtitle: t('希望職稱、期望待遇、可上班日、工作地點與外派意願', 'Desired title, salary expectation, availability & locations'),
        icon: '🎯',
        onAdd: "window.TrustCV.openEditPreferencesModal()",
        dropZoneKey: null,
        isLight
      })}

      <div class="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 text-xs">
        <div class="p-3 rounded-xl border ${isLight ? 'bg-slate-50/70 border-slate-200' : 'bg-slate-900/40 border-slate-800'}">
          <span class="block text-[10px] ${isLight ? 'text-slate-400' : 'text-slate-500'}">${t('希望職稱', 'Desired Job Title')}</span>
          <span class="font-bold ${isLight ? 'text-slate-800' : 'text-white'}">${pref.desired_title || '—'}</span>
        </div>

        <div class="p-3 rounded-xl border ${isLight ? 'bg-slate-50/70 border-slate-200' : 'bg-slate-900/40 border-slate-800'}">
          <span class="block text-[10px] ${isLight ? 'text-slate-400' : 'text-slate-500'}">${t('期望待遇', 'Expected Compensation')}</span>
          <span class="font-semibold text-emerald-600">${pref.expected_salary || '—'}</span>
        </div>

        <div class="p-3 rounded-xl border ${isLight ? 'bg-slate-50/70 border-slate-200' : 'bg-slate-900/40 border-slate-800'}">
          <span class="block text-[10px] ${isLight ? 'text-slate-400' : 'text-slate-500'}">${t('可上班日', 'Availability')}</span>
          <span class="font-medium ${isLight ? 'text-slate-800' : 'text-white'}">${pref.available_date || '—'}</span>
        </div>

        <div class="p-3 rounded-xl border sm:col-span-2 ${isLight ? 'bg-slate-50/70 border-slate-200' : 'bg-slate-900/40 border-slate-800'}">
          <span class="block text-[10px] ${isLight ? 'text-slate-400' : 'text-slate-500'}">${t('希望工作地點', 'Desired Locations')}</span>
          <div class="flex flex-wrap gap-1.5 mt-1">
            ${(pref.desired_locations || []).map(loc => `
              <span class="px-2 py-0.5 rounded-md text-[11px] font-medium border ${isLight ? 'bg-white border-slate-200 text-slate-700' : 'bg-slate-800 border-slate-700 text-slate-300'}">${loc}</span>
            `).join('')}
          </div>
        </div>

        <div class="p-3 rounded-xl border flex items-center justify-between ${isLight ? 'bg-slate-50/70 border-slate-200' : 'bg-slate-900/40 border-slate-800'}">
          <div>
            <span class="block text-[10px] ${isLight ? 'text-slate-400' : 'text-slate-500'}">${t('出差/外派意願', 'Relocation Willingness')}</span>
            <span class="font-bold text-emerald-600">${pref.willing_to_relocate ? t('願意赴台就業', 'Willing to relocate') : t('面議', 'Negotiable')}</span>
          </div>
          <span class="text-xl">✈️</span>
        </div>
      </div>
    </div>
  `;
}

/* ─────────────────── 3. 工作經歷卡片 ─────────────────── */

function renderWorkExperiencesCard(experiences = [], isLight) {
  return `
    <div class="rounded-2xl overflow-hidden border ${isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-brand-card border-brand-border'}">
      ${renderSectionHeader({
        title: t('3. 工作經歷', '3. Work Experiences'),
        subtitle: t('公司名稱、產業別、職稱、起訖年月、工作成果與技術標籤', 'Company name, title, tenure, STAR achievements & skills'),
        icon: '💼',
        onAdd: "window.TrustCV.openAddWorkModal()",
        dropZoneKey: 'work_experiences',
        isLight
      })}

      <div class="p-4 space-y-3">
        ${experiences.length === 0 ? `
          <div class="py-6 text-center text-xs ${isLight ? 'text-slate-400' : 'text-slate-600'}">
            ${t('尚未建立工作經歷，可點擊上方手動新增或拖曳離職證明自動提煉。', 'No work experiences yet. Click Add New or drag relieving letter.')}
          </div>
        ` : experiences.map((w, idx) => `
          <div class="p-4 rounded-xl border relative transition-all ${isLight ? 'bg-slate-50/80 border-slate-200' : 'bg-slate-900/40 border-slate-800'} space-y-2">
            <div class="flex items-start justify-between gap-3">
              <div class="min-w-0">
                <div class="flex items-center gap-2 flex-wrap">
                  <h4 class="text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'}">${w.company_name}</h4>
                  <span class="text-[11px] font-semibold text-emerald-600">· ${w.job_title}</span>
                  ${w.industry ? `<span class="text-[10px] px-2 py-0.5 rounded border ${isLight ? 'bg-slate-100 text-slate-500 border-slate-200' : 'bg-slate-800 text-slate-400 border-slate-700'}">${w.industry}</span>` : ''}
                </div>
                <div class="text-[11px] font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'} mt-0.5">
                  🗓️ ${w.start_date || '—'} ~ ${w.is_current ? t('迄今 (在職中)', 'Present') : (w.end_date || '—')}
                </div>
              </div>

              <!-- 右側：二態公開/隱藏開關 + 刪除按鈕 -->
              <div class="flex items-center gap-2 shrink-0">
                ${renderPrivacyToggle('work_experiences', w.id, w.is_public, isLight)}
                <button onclick="window.TrustCV.deleteItem('work_experiences', '${w.id}')"
                  class="p-1 rounded text-slate-400 hover:text-red-500 transition-colors" title="${t('刪除', 'Delete')}">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M19 6l-1 14H6L5 6m3 0V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2"/></svg>
                </button>
              </div>
            </div>

            <p class="text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-300'}">
              ${w.description || ''}
            </p>

            ${w.skills_used && w.skills_used.length > 0 ? `
              <div class="flex flex-wrap gap-1.5 pt-1">
                ${w.skills_used.map(s => `
                  <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 font-semibold">${s}</span>
                `).join('')}
              </div>
            ` : ''}
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

/* ─────────────────── 4. 學歷背景卡片 ─────────────────── */

function renderEducationsCard(educations = [], isLight) {
  return `
    <div class="rounded-2xl overflow-hidden border ${isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-brand-card border-brand-border'}">
      ${renderSectionHeader({
        title: t('4. 學歷背景', '4. Educational Background'),
        subtitle: t('學校名稱、學位、科系主修、就讀起訖時間與畢肄狀態', 'Institution, degree, major, passing year & accreditation'),
        icon: '🎓',
        onAdd: "window.TrustCV.openAddEducationModal()",
        dropZoneKey: 'educations',
        isLight
      })}

      <div class="p-4 space-y-3">
        ${educations.length === 0 ? `
          <div class="py-6 text-center text-xs ${isLight ? 'text-slate-400' : 'text-slate-600'}">
            ${t('尚未建立學歷資料，可點擊上方手動新增或拖曳畢業證書提煉。', 'No education records yet. Click Add New or drag degree certificate.')}
          </div>
        ` : educations.map((e) => `
          <div class="p-3.5 rounded-xl border flex items-center justify-between gap-3 ${isLight ? 'bg-slate-50/80 border-slate-200' : 'bg-slate-900/40 border-slate-800'}">
            <div class="min-w-0">
              <div class="flex items-center gap-2 flex-wrap">
                <span class="text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'}">${e.school_name}</span>
                <span class="text-xs px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 border border-blue-500/20 font-bold">${e.degree_level}</span>
              </div>
              <div class="text-xs ${isLight ? 'text-slate-600' : 'text-slate-300'} mt-0.5">
                ${e.major} · <span class="font-mono text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}">${e.start_year} - ${e.end_year} (${e.status})</span>
              </div>
            </div>

            <div class="flex items-center gap-2 shrink-0">
              ${renderPrivacyToggle('educations', e.id, e.is_public, isLight)}
              <button onclick="window.TrustCV.deleteItem('educations', '${e.id}')"
                class="p-1 rounded text-slate-400 hover:text-red-500 transition-colors">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M19 6l-1 14H6L5 6m3 0V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2"/></svg>
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

/* ─────────────────── 5. 語文能力卡片 ─────────────────── */

function renderLanguagesCard(languages = [], isLight) {
  return `
    <div class="rounded-2xl overflow-hidden border ${isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-brand-card border-brand-border'}">
      ${renderSectionHeader({
        title: t('5. 語文能力', '5. Language Proficiency'),
        subtitle: t('語言種類、聽/說/讀/寫評級與官方檢定證照 (TOEIC/IELTS/TOCFL)', 'Languages, CEFR ratings & certification scores'),
        icon: '🗣️',
        onAdd: "window.TrustCV.openAddLanguageModal()",
        dropZoneKey: null,
        isLight
      })}

      <div class="p-4 grid grid-cols-1 md:grid-cols-2 gap-3.5">
        ${languages.map(l => `
          <div class="p-3.5 rounded-xl border ${isLight ? 'bg-slate-50/80 border-slate-200' : 'bg-slate-900/40 border-slate-800'} space-y-2">
            <div class="flex items-center justify-between">
              <span class="font-bold text-sm ${isLight ? 'text-slate-900' : 'text-white'}">${l.name}</span>
              <div class="flex items-center gap-2">
                ${renderPrivacyToggle('languages', l.id, l.is_public, isLight)}
                <button onclick="window.TrustCV.deleteItem('languages', '${l.id}')"
                  class="p-1 rounded text-slate-400 hover:text-red-500 transition-colors">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M19 6l-1 14H6L5 6m3 0V4"/></svg>
                </button>
              </div>
            </div>
            <div class="grid grid-cols-4 gap-1 text-[11px] text-center font-mono">
              <div class="p-1 rounded ${isLight ? 'bg-white' : 'bg-slate-800'}">
                <span class="block text-[9px] text-slate-400">${t('聽', 'L')}</span>
                <span class="font-bold text-emerald-600">${l.listening}</span>
              </div>
              <div class="p-1 rounded ${isLight ? 'bg-white' : 'bg-slate-800'}">
                <span class="block text-[9px] text-slate-400">${t('說', 'S')}</span>
                <span class="font-bold text-emerald-600">${l.speaking}</span>
              </div>
              <div class="p-1 rounded ${isLight ? 'bg-white' : 'bg-slate-800'}">
                <span class="block text-[9px] text-slate-400">${t('讀', 'R')}</span>
                <span class="font-bold text-emerald-600">${l.reading}</span>
              </div>
              <div class="p-1 rounded ${isLight ? 'bg-white' : 'bg-slate-800'}">
                <span class="block text-[9px] text-slate-400">${t('寫', 'W')}</span>
                <span class="font-bold text-emerald-600">${l.writing}</span>
              </div>
            </div>
            ${l.certification ? `<div class="text-[10px] font-mono text-slate-500">🏆 ${l.certification}</div>` : ''}
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

/* ─────────────────── 6. 專長卡片 ─────────────────── */

function renderSkillsCard(skills = {}, isLight) {
  const tools = skills.tools || [];
  const domains = skills.domain_skills || [];

  return `
    <div class="rounded-2xl overflow-hidden border ${isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-brand-card border-brand-border'}">
      ${renderSectionHeader({
        title: t('6. 專業專長', '6. Professional Skills'),
        subtitle: t('擅長工程軟體工具、設備操作與專業技能標籤矩陣', 'Tools, software platforms and domain expertise matrix'),
        icon: '⚡',
        onAdd: "window.TrustCV.openEditSkillsModal()",
        dropZoneKey: null,
        isLight
      })}

      <div class="p-4 space-y-3.5 text-xs">
        <div>
          <span class="block text-[11px] font-bold ${isLight ? 'text-slate-700' : 'text-slate-300'} mb-1.5">
            🛠️ ${t('擅長工具與工程軟體', 'Tools & Engineering Software')}
          </span>
          <div class="flex flex-wrap gap-1.5">
            ${tools.map(tool => `
              <span class="px-2.5 py-1 rounded-lg font-mono text-xs font-semibold border ${isLight ? 'bg-slate-100 text-slate-800 border-slate-200' : 'bg-slate-800 text-slate-200 border-slate-700'}">${tool}</span>
            `).join('')}
          </div>
        </div>

        <div>
          <span class="block text-[11px] font-bold ${isLight ? 'text-slate-700' : 'text-slate-300'} mb-1.5">
            💡 ${t('核心領域與工作技能', 'Domain Expertise & Methodologies')}
          </span>
          <div class="flex flex-wrap gap-1.5">
            ${domains.map(d => `
              <span class="px-2.5 py-1 rounded-lg text-xs font-semibold border bg-emerald-500/10 text-emerald-600 border-emerald-500/20">${d}</span>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `;
}

/* ─────────────────── 7. 資格認證卡片 ─────────────────── */

function renderCertificatesCard(certificates = [], isLight) {
  return `
    <div class="rounded-2xl overflow-hidden border ${isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-brand-card border-brand-border'}">
      ${renderSectionHeader({
        title: t('7. 資格認證', '7. Licenses & Certifications'),
        subtitle: t('專業證照名稱、發證機構、證照字號與生效年月', 'Certificate title, issuing authority, license number & issue date'),
        icon: '🪪',
        onAdd: "window.TrustCV.openAddCertModal()",
        dropZoneKey: 'certificates',
        isLight
      })}

      <div class="p-4 space-y-3">
        ${certificates.length === 0 ? `
          <div class="py-6 text-center text-xs ${isLight ? 'text-slate-400' : 'text-slate-600'}">
            ${t('尚未建立證照，可點擊上方手動新增或拖曳證書圖檔提煉。', 'No certificates yet. Click Add New or drag image.')}
          </div>
        ` : certificates.map(c => `
          <div class="p-3.5 rounded-xl border flex items-center justify-between gap-3 ${isLight ? 'bg-slate-50/80 border-slate-200' : 'bg-slate-900/40 border-slate-800'}">
            <div class="min-w-0">
              <h4 class="text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'}">${c.name}</h4>
              <div class="text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'} mt-0.5">
                🏛️ ${c.issuing_org} · <span class="font-mono">${c.license_no}</span> (${c.issue_date})
              </div>
            </div>

            <div class="flex items-center gap-2 shrink-0">
              ${renderPrivacyToggle('certificates', c.id, c.is_public, isLight)}
              <button onclick="window.TrustCV.deleteItem('certificates', '${c.id}')"
                class="p-1 rounded text-slate-400 hover:text-red-500 transition-colors">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M19 6l-1 14H6L5 6m3 0V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2"/></svg>
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

/* ─────────────────── 8. 自傳卡片 ─────────────────── */

function renderAutobiographyCard(autobio = {}, isLight) {
  return `
    <div class="rounded-2xl overflow-hidden border ${isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-brand-card border-brand-border'}">
      ${renderSectionHeader({
        title: t('8. 職涯自傳', '8. Autobiography & Professional Bio'),
        subtitle: t('雙軌中英文職涯自傳，直接點擊編輯欄位立即 0ms 存檔', 'Dual-track English and Traditional Chinese professional narrative'),
        icon: '📝',
        onAdd: null,
        dropZoneKey: 'autobiography',
        isLight
      })}

      <div class="p-4 space-y-4">
        <!-- 英文自傳 -->
        <div class="space-y-1.5">
          <span class="block text-xs font-bold ${isLight ? 'text-slate-700' : 'text-slate-300'}">
            🇺🇸 English Bio (Original)
          </span>
          <textarea rows="4"
            oninput="window.TrustCV.updateAutobiography('content_en', this.value)"
            class="w-full p-3 rounded-xl border text-xs leading-relaxed transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500
            ${isLight ? 'bg-slate-50 border-slate-200 text-slate-800' : 'bg-slate-900/50 border-slate-800 text-slate-200'}">${autobio.content_en || ''}</textarea>
        </div>

        <!-- 繁體中文在地化自傳 -->
        <div class="space-y-1.5">
          <span class="block text-xs font-bold ${isLight ? 'text-slate-700' : 'text-slate-300'}">
            🇹🇼 繁體中文在地化自傳 (Taiwan Localized)
          </span>
          <textarea rows="4"
            oninput="window.TrustCV.updateAutobiography('content_zh', this.value)"
            class="w-full p-3 rounded-xl border text-xs leading-relaxed transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500
            ${isLight ? 'bg-slate-50 border-slate-200 text-slate-800' : 'bg-slate-900/50 border-slate-800 text-slate-200'}">${autobio.content_zh || ''}</textarea>
        </div>
      </div>
    </div>
  `;
}

/* ─────────────────── 9. 佐證附件卡片 ─────────────────── */

function renderAttachmentsCard(attachments = [], isLight) {
  return `
    <div class="rounded-2xl overflow-hidden border ${isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-brand-card border-brand-border'}">
      ${renderSectionHeader({
        title: t('9. 佐證附件', '9. Supporting Attachments'),
        subtitle: t('稅單 Form 16、離職證明 Relieving Letter、專案作品集 PDF (選填)', 'Form 16 tax records, relieving letters, portfolio PDF (Optional)'),
        icon: '📎',
        onAdd: "window.TrustCV.openAddAttachmentModal()",
        dropZoneKey: 'attachments',
        isLight
      })}

      <div class="p-4 space-y-3">
        ${attachments.length === 0 ? `
          <div class="py-6 text-center text-xs ${isLight ? 'text-slate-400' : 'text-slate-600'}">
            ${t('尚未附加佐證檔案 (選填，不影響投遞)', 'No attachments uploaded (Optional)')}
          </div>
        ` : attachments.map(att => `
          <div class="p-3.5 rounded-xl border flex items-center justify-between gap-3 ${isLight ? 'bg-slate-50/80 border-slate-200' : 'bg-slate-900/40 border-slate-800'}">
            <div class="flex items-center gap-3 min-w-0">
              <span class="text-xl">📕</span>
              <div class="min-w-0">
                <span class="font-bold text-xs truncate block ${isLight ? 'text-slate-900' : 'text-white'}">${att.file_name}</span>
                <span class="text-[10px] font-mono text-slate-400">${att.category} · ${att.size_str}</span>
              </div>
            </div>

            <div class="flex items-center gap-2 shrink-0">
              ${renderPrivacyToggle('attachments', att.id, att.is_public, isLight)}
              <button onclick="window.TrustCV.deleteItem('attachments', '${att.id}')"
                class="p-1 rounded text-slate-400 hover:text-red-500 transition-colors">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M19 6l-1 14H6L5 6m3 0V4"/></svg>
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

/* ─────────────────── 10. 專案成就卡片 ─────────────────── */

function renderProjectAchievementsCard(projects = [], isLight) {
  return `
    <div class="rounded-2xl overflow-hidden border ${isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-brand-card border-brand-border'}">
      ${renderSectionHeader({
        title: t('10. 專案成就', '10. Key Project Achievements'),
        subtitle: t('專案名稱、擔任角色、起訖時間與量化技術成果', 'Project name, role, tenure & measurable outcomes'),
        icon: '🚀',
        onAdd: "window.TrustCV.openAddProjectModal()",
        dropZoneKey: null,
        isLight
      })}

      <div class="p-4 space-y-3">
        ${projects.length === 0 ? `
          <div class="py-6 text-center text-xs ${isLight ? 'text-slate-400' : 'text-slate-600'}">
            ${t('尚未建立專案成就，點擊上方手動新增。', 'No project achievements yet. Click Add New.')}
          </div>
        ` : projects.map(p => `
          <div class="p-3.5 rounded-xl border space-y-1.5 ${isLight ? 'bg-slate-50/80 border-slate-200' : 'bg-slate-900/40 border-slate-800'}">
            <div class="flex items-start justify-between gap-3">
              <div>
                <h4 class="text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'}">${p.project_name}</h4>
                <div class="text-[11px] font-semibold text-emerald-600 mt-0.5">${p.role} · <span class="font-mono text-slate-400 font-normal">${p.period}</span></div>
              </div>
              <div class="flex items-center gap-2 shrink-0">
                ${renderPrivacyToggle('project_achievements', p.id, p.is_public, isLight)}
                <button onclick="window.TrustCV.deleteItem('project_achievements', '${p.id}')"
                  class="p-1 rounded text-slate-400 hover:text-red-500 transition-colors">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M19 6l-1 14H6L5 6m3 0V4"/></svg>
                </button>
              </div>
            </div>
            <p class="text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-300'}">
              ${p.achievements_summary}
            </p>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

/* ─────────────────── 11. 推薦人卡片 ─────────────────── */

function renderReferencesCard(references = [], isLight) {
  return `
    <div class="rounded-2xl overflow-hidden border ${isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-brand-card border-brand-border'}">
      ${renderSectionHeader({
        title: t('11. 推薦人', '11. References'),
        subtitle: t('推薦人姓名、服務機構、職稱、聯絡信箱與關係 (預設可隱藏保護隱私)', 'Name, organization, title, contact & relationship (Default private)'),
        icon: '🤝',
        onAdd: "window.TrustCV.openAddReferenceModal()",
        dropZoneKey: null,
        isLight
      })}

      <div class="p-4 space-y-3">
        ${references.length === 0 ? `
          <div class="py-6 text-center text-xs ${isLight ? 'text-slate-400' : 'text-slate-600'}">
            ${t('尚未填寫推薦人 (選填)', 'No references added (Optional)')}
          </div>
        ` : references.map(r => `
          <div class="p-3.5 rounded-xl border flex items-center justify-between gap-3 ${isLight ? 'bg-slate-50/80 border-slate-200' : 'bg-slate-900/40 border-slate-800'}">
            <div class="min-w-0">
              <h4 class="text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'}">${r.name}</h4>
              <div class="text-xs ${isLight ? 'text-slate-600' : 'text-slate-300'} mt-0.5">
                ${r.title} · ${r.organization} (${r.relationship})
              </div>
              <div class="text-[10px] font-mono text-slate-400 mt-0.5">${r.email || ''} · ${r.phone || ''}</div>
            </div>

            <div class="flex items-center gap-2 shrink-0">
              ${renderPrivacyToggle('references', r.id, r.is_public, isLight)}
              <button onclick="window.TrustCV.deleteItem('references', '${r.id}')"
                class="p-1 rounded text-slate-400 hover:text-red-500 transition-colors">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M19 6l-1 14H6L5 6m3 0V4"/></svg>
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

/* ─────────────────── 12. 自訂區塊卡片 ─────────────────── */

function renderCustomSectionsCard(customSections = [], isLight) {
  return `
    <div class="rounded-2xl overflow-hidden border ${isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-brand-card border-brand-border'}">
      ${renderSectionHeader({
        title: t('12. 自訂內容', '12. Custom Sections'),
        subtitle: t('專利發明、學術發表、志工社團、大型專案競賽獎項等', 'Patents, publications, awards, volunteer & extracurriculars'),
        icon: '✨',
        onAdd: "window.TrustCV.openAddCustomSectionModal()",
        dropZoneKey: null,
        isLight
      })}

      <div class="p-4 space-y-3">
        ${customSections.length === 0 ? `
          <div class="py-6 text-center text-xs ${isLight ? 'text-slate-400' : 'text-slate-600'}">
            ${t('尚未建立自訂區塊 (選填)', 'No custom sections yet (Optional)')}
          </div>
        ` : customSections.map(c => `
          <div class="p-3.5 rounded-xl border space-y-1.5 ${isLight ? 'bg-slate-50/80 border-slate-200' : 'bg-slate-900/40 border-slate-800'}">
            <div class="flex items-center justify-between gap-3">
              <h4 class="text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'}">${c.title}</h4>
              <div class="flex items-center gap-2 shrink-0">
                ${renderPrivacyToggle('custom_sections', c.id, c.is_public, isLight)}
                <button onclick="window.TrustCV.deleteItem('custom_sections', '${c.id}')"
                  class="p-1 rounded text-slate-400 hover:text-red-500 transition-colors">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M19 6l-1 14H6L5 6m3 0V4"/></svg>
                </button>
              </div>
            </div>
            <p class="text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-300'}">
              ${c.content}
            </p>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

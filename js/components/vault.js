/**
 * TrustCV Drive Vault Component (js/components/vault.js)
 * Google Drive-backed personal document manager with Unified Smart Dropzone (✨ 統一智慧投放區)
 * and 4-Folder Clean Showcase (Photos, Certificates, Resumes, Exports) with direct Drive links.
 */

import { store } from '../store.js';
import { i18n } from '../i18n.js';
import { driveService } from '../drive.js';

/* ─────────────────── helpers ─────────────────── */

function isEn() { return i18n.getLanguage() === 'en'; }
function t(zh, en) { return isEn() ? en : zh; }

function fileEmoji(mimeType = '') {
  if (mimeType.includes('pdf'))                                   return '📕';
  if (mimeType.includes('image'))                                 return '🖼️';
  if (mimeType.includes('word') || mimeType.includes('document')) return '📝';
  if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) return '📊';
  if (mimeType.includes('folder'))                                return '📁';
  return '📄';
}

/* ─────────────────── main export ─────────────────── */

export function renderVault() {
  const { user, theme } = store.getState();
  const isLight = theme === 'light';
  return user ? renderDashboard(isLight) : renderLoginPrompt(isLight);
}

/* ─────────────────── login prompt ─────────────────── */

function renderLoginPrompt(isLight) {
  const features = [
    ['🖼️', t('大頭照與照片庫 (Photos/)', 'Headshots & Photos (Photos/)')],
    ['🪪', t('證照、學歷與稅單 (Certificates/)', 'Credentials, Degrees & Tax (Certificates/)')],
    ['📄', t('主履歷原始檔案 (Resumes/)', 'Master Resumes (Resumes/)')],
    ['🚀', t('投遞導出唯讀存檔 (Exports/)', 'System Exports Archive (Exports/)')]
  ];

  return `
    <div class="flex flex-col items-center justify-center min-h-[70vh] p-6 animate-fade-in">
      <div class="w-full max-w-sm rounded-3xl p-8 text-center space-y-6 relative overflow-hidden
        ${isLight
          ? 'bg-white border border-slate-200 shadow-xl shadow-slate-200/60'
          : 'bg-brand-card border border-brand-border shadow-2xl shadow-black/40'}">

        <!-- Subtle gradient shimmer background -->
        <div class="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-blue-500/5 pointer-events-none rounded-3xl"></div>

        <!-- Google Drive Icon -->
        <div class="relative mx-auto w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg
          ${isLight ? 'bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200' : 'bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700'}">
          <svg viewBox="0 0 87.3 78" class="w-10 h-10" xmlns="http://www.w3.org/2000/svg">
            <path fill="#0066da" d="M6.6 66.85l3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3L27.5 52.8H0a15.5 15.5 0 0 0 2.1 7.6z"/>
            <path fill="#00ac47" d="M43.65 25L29.9 1.2a15.5 15.5 0 0 0-3.3 3.3L2.1 44.4A15.5 15.5 0 0 0 0 52H27.5z"/>
            <path fill="#ea4335" d="M73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25A15.5 15.5 0 0 0 87.3 52H59.8l5.85 11.2z"/>
            <path fill="#00832d" d="M43.65 25L57.4 1.2A15.2 15.2 0 0 0 43.65 0c-5.35 0-10.2 2.8-13.75 7.2z"/>
            <path fill="#2684fc" d="M59.8 52H87.3a15.5 15.5 0 0 0-2.1-7.6L61.5 4.5c-.8-1.4-1.95-2.5-3.3-3.3L43.65 25z"/>
            <path fill="#ffba00" d="M27.5 52l-13.75 23.8c1.35.8 2.85 1.2 4.5 1.2h51.8c1.65 0 3.15-.45 4.5-1.2L59.8 52H27.5z"/>
          </svg>
        </div>

        <!-- Title & description -->
        <div class="space-y-2 relative">
          <h2 class="text-xl font-bold ${isLight ? 'text-slate-900' : 'text-white'}">
            ${t('個人 Drive 安全保險庫', 'Your Personal Drive Vault')}
          </h2>
          <p class="text-sm ${isLight ? 'text-slate-500' : 'text-slate-400'} leading-relaxed">
            ${t(
              '登入後自動在您的 Google Drive 建立 TrustCV 四層安全結構，集中保管大頭照、證照、履歷與投遞包。',
              'Sign in to auto-partition your TrustCV 4-tier folder in Google Drive to manage photos, certificates, resumes & exports.'
            )}
          </p>
        </div>

        <!-- Feature list -->
        <div class="text-left space-y-2.5 relative">
          ${features.map(([emoji, label]) => `
            <div class="flex items-center gap-2.5 text-xs ${isLight ? 'text-slate-600' : 'text-slate-300'}">
              <span class="text-base leading-none">${emoji}</span>
              <span>${label}</span>
            </div>
          `).join('')}
        </div>

        <!-- Sign In Button -->
        <button id="btn-google-signin" onclick="window.TrustCV.signInGoogle()"
          class="w-full flex items-center justify-center gap-3 px-4 py-3.5 rounded-2xl font-semibold text-sm
                 transition-all duration-200 shadow active:scale-95 relative
                 ${isLight
                   ? 'bg-white border-2 border-slate-200 text-slate-700 hover:border-blue-300 hover:bg-blue-50/30 hover:shadow-blue-100'
                   : 'bg-slate-800 border-2 border-slate-700 text-white hover:border-blue-500/40 hover:bg-slate-700'}">
          <!-- Google Colour Logo -->
          <svg class="w-5 h-5 shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          <span>${t('使用 Google 帳號登入', 'Continue with Google')}</span>
        </button>

        <!-- Privacy note -->
        <p class="text-[10px] ${isLight ? 'text-slate-400' : 'text-slate-500'} leading-relaxed relative">
          🔒 ${t(
            '檔案 100% 存在您個人的 Google Drive。TrustCV 僅存取自身建立之檔案，享完全資料主權。',
            'Files reside 100% in your personal Google Drive with strict data sovereignty.'
          )}
        </p>
      </div>
    </div>
  `;
}

/* ─────────────────── dashboard (authenticated) ─────────────────── */

function renderDashboard(isLight) {
  const { user, driveFolderIds, driveFiles, driveLoading, driveError } = store.getState();

  const folderConfigs = [
    {
      key: 'photos',
      emoji: '🖼️',
      label:    t('照片寫真', 'Photos'),
      sublabel: t('大頭照、求職證件照', 'Headshots, ID photos'),
      colorKey: 'amber'
    },
    {
      key: 'certificates',
      emoji: '🪪',
      label:    t('證照學歷', 'Certificates'),
      sublabel: t('學位證書、Form 16、離職證明', 'Degrees, Form 16, Relieving letters'),
      colorKey: 'blue'
    },
    {
      key: 'resumes',
      emoji: '📄',
      label:    t('主履歷檔', 'Resumes'),
      sublabel: t('PDF/Word 主履歷原件', 'PDF / Word master resumes'),
      colorKey: 'emerald'
    },
    {
      key: 'exports',
      emoji: '🚀',
      label:    t('導出投遞包', 'Exports'),
      sublabel: t('系統投遞快照 (唯讀存檔)', 'Official application snapshots (Read-only)'),
      colorKey: 'purple'
    }
  ];

  return `
    <div class="max-w-5xl mx-auto p-4 md:p-6 space-y-6 animate-fade-in">

      <!-- ── User Header ── -->
      <div class="flex items-center justify-between gap-3 p-4 rounded-2xl
        ${isLight ? 'bg-white border border-slate-200 shadow-sm' : 'bg-brand-card border border-brand-border'}">

        <div class="flex items-center gap-3 min-w-0">
          <img src="${user.picture}" alt="${user.name}"
            class="w-10 h-10 rounded-full ring-2 shrink-0 ${isLight ? 'ring-emerald-200' : 'ring-emerald-800'}"
            onerror="this.outerHTML='<div class=\\'w-10 h-10 rounded-full shrink-0 flex items-center justify-center bg-emerald-700 text-white font-bold text-sm\\'>${(user.name || 'U')[0].toUpperCase()}</div>'"
          >
          <div class="min-w-0">
            <div class="text-sm font-bold truncate ${isLight ? 'text-slate-900' : 'text-white'}">${user.name}</div>
            <div class="text-xs truncate ${isLight ? 'text-slate-500' : 'text-slate-400'}">${user.email}</div>
          </div>
        </div>

        <div class="flex items-center gap-2 shrink-0">
          ${driveFolderIds ? `
            <a href="${driveService.getFolderWebLink(driveFolderIds.root)}" target="_blank" rel="noopener"
               class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all
               ${isLight ? 'bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100' : 'bg-blue-950/50 text-blue-300 border border-blue-800/60 hover:bg-blue-900/40'}">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
              </svg>
              ${t('開啟個人 Drive 總資料夾', 'Open Drive Root')}
            </a>
          ` : ''}
          <button onclick="window.TrustCV.signOutGoogle()"
            class="px-3 py-1.5 rounded-xl text-xs font-medium transition-all
            ${isLight ? 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200' : 'bg-slate-800 text-slate-400 border border-slate-700 hover:text-white'}">
            ${t('登出', 'Sign Out')}
          </button>
        </div>
      </div>

      <!-- ── 頂部「✨ 統一智慧投放區」 (ADR 001 & 任務 4) ── -->
      ${driveFolderIds ? renderUnifiedDropzone(isLight) : ''}

      <!-- ── Error Banner ── -->
      ${driveError ? `
        <div class="flex items-start gap-2.5 p-4 rounded-xl text-sm border
          ${isLight ? 'bg-red-50 border-red-200 text-red-700' : 'bg-red-950/30 border-red-800/60 text-red-400'}">
          <span class="text-base shrink-0">⚠️</span>
          <span class="leading-relaxed">${driveError}</span>
        </div>
      ` : ''}

      <!-- ── Setup Prompt (first time) ── -->
      ${!driveFolderIds && !driveLoading ? `
        <div class="flex items-center justify-between gap-3 p-4 rounded-2xl
          ${isLight ? 'bg-emerald-50 border border-emerald-200' : 'bg-emerald-950/25 border border-emerald-800/60'}">
          <div class="flex items-center gap-3">
            <span class="text-2xl">⚙️</span>
            <div>
              <div class="text-sm font-bold ${isLight ? 'text-emerald-800' : 'text-emerald-300'}">
                ${t('初始化四層 Drive 保險庫', 'Initialize 4-Tier Drive Vault')}
              </div>
              <div class="text-xs ${isLight ? 'text-emerald-600' : 'text-emerald-500'}">
                ${t('在您的 Google Drive 中自動建立 Photos、Certificates、Resumes 與 Exports 四層目錄', 'Auto-create Photos, Certificates, Resumes & Exports folders in your Drive')}
              </div>
            </div>
          </div>
          <button onclick="window.TrustCV.setupDriveFolders()"
            class="shrink-0 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-md">
            ${t('立即建立', 'Setup Now')}
          </button>
        </div>
      ` : ''}

      <!-- ── Loading Spinner ── -->
      ${driveLoading ? `
        <div class="flex items-center justify-center gap-3 py-10 ${isLight ? 'text-slate-500' : 'text-slate-400'}">
          <svg class="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
          <span class="text-sm">${t('連接 Google Drive 中…', 'Connecting to Drive…')}</span>
        </div>
      ` : ''}

      <!-- ── 下方四欄檔案檢視網格 (純展示 + 直連 Drive，移除零散上傳鈕) ── -->
      ${driveFolderIds && !driveLoading ? `
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          ${folderConfigs.map(cfg => renderFolderCardClean(cfg, driveFolderIds, driveFiles, isLight)).join('')}
        </div>
      ` : ''}

    </div>
  `;
}

/* ─────────────────── 頂部統一智慧投放區 ─────────────────── */

function renderUnifiedDropzone(isLight) {
  return `
    <div class="rounded-3xl p-6 md:p-8 text-center border-2 border-dashed transition-all relative overflow-hidden group
      ${isLight
        ? 'border-emerald-300 bg-gradient-to-b from-emerald-50/60 to-white hover:border-emerald-500 shadow-sm'
        : 'border-emerald-800/80 bg-gradient-to-b from-emerald-950/20 to-brand-card hover:border-emerald-600 shadow-xl'}">

      <!-- 背景微光裝飾 -->
      <div class="absolute inset-0 bg-radial from-emerald-500/10 via-transparent to-transparent pointer-events-none"></div>

      <div class="max-w-lg mx-auto space-y-3 relative z-10">
        <div class="w-14 h-14 mx-auto rounded-2xl flex items-center justify-center text-2xl shadow-md transition-transform group-hover:scale-110
          ${isLight ? 'bg-white text-emerald-600 border border-emerald-100' : 'bg-slate-800 text-brand-mint border border-emerald-800'}">
          ✨
        </div>

        <h3 class="text-base md:text-lg font-black ${isLight ? 'text-slate-900' : 'text-white'}">
          ${t('統一智慧投放倉 (Unified Smart Dropzone)', 'Unified Smart Dropzone')}
        </h3>

        <p class="text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'} leading-relaxed">
          ${t(
            '支援多檔案一次性拖曳或選取。系統將智慧識別大頭照、證照、學歷單據與履歷，並自動歸檔至對應資料夾。',
            'Drag and drop multiple files at once. System automatically classifies into Photos, Certificates or Resumes.'
          )}
        </p>

        <!-- 集中選檔按鈕 -->
        <div class="pt-2">
          <label class="inline-flex items-center gap-2 px-6 py-3 rounded-2xl cursor-pointer font-bold text-xs text-white transition-all shadow-lg active:scale-95
            ${isLight ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500'}">
            <input type="file" multiple class="hidden"
              accept="image/*,.pdf,.doc,.docx,.txt"
              onchange="window.TrustCV.handleUnifiedDropzoneUpload(this)">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/>
              <line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
            <span>${t('選取檔案或整批丟入', 'Select or Drop Files Here')}</span>
          </label>
        </div>

        <div class="flex items-center justify-center gap-4 text-[10px] ${isLight ? 'text-slate-400' : 'text-slate-500'} pt-1">
          <span>🖼️ 圖片 ➔ Photos</span>
          <span>🪪 證書/稅單 ➔ Certificates</span>
          <span>📄 履歷文檔 ➔ Resumes</span>
        </div>
      </div>
    </div>
  `;
}

/* ─────────────────── 四欄檔案檢視卡片 (純展示 + 直連 Drive) ─────────────────── */

const COLORS = {
  amber: {
    icon:  { light: 'bg-amber-100 text-amber-600',   dark: 'bg-amber-900/50 text-amber-400' },
    badge: 'bg-amber-500',
    open:  { light: 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100', dark: 'bg-amber-950/40 text-amber-300 border-amber-800/50 hover:bg-amber-900/40' }
  },
  blue: {
    icon:  { light: 'bg-blue-100 text-blue-600',    dark: 'bg-blue-900/50 text-blue-400'    },
    badge: 'bg-blue-500',
    open:  { light: 'bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100',   dark: 'bg-blue-950/40 text-blue-300 border-blue-800/50 hover:bg-blue-900/40' }
  },
  emerald: {
    icon:  { light: 'bg-emerald-100 text-emerald-700', dark: 'bg-emerald-900/50 text-emerald-400' },
    badge: 'bg-emerald-500',
    open:  { light: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100', dark: 'bg-emerald-950/40 text-emerald-300 border-emerald-800/50 hover:bg-emerald-900/40' }
  },
  purple: {
    icon:  { light: 'bg-purple-100 text-purple-700', dark: 'bg-purple-900/50 text-purple-400' },
    badge: 'bg-purple-500',
    open:  { light: 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100', dark: 'bg-purple-950/40 text-purple-300 border-purple-800/50 hover:bg-purple-900/40' }
  }
};

function renderFolderCardClean(cfg, folderIds, driveFiles, isLight) {
  const folderId = folderIds?.[cfg.key];
  const files    = driveFiles?.[cfg.key] || [];
  const c        = COLORS[cfg.colorKey] || COLORS.blue;
  const mode     = isLight ? 'light' : 'dark';

  return `
    <div class="rounded-2xl overflow-hidden flex flex-col border transition-all
      ${isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-brand-card border-brand-border'}">

      <!-- Card Header -->
      <div class="p-4 space-y-3 border-b ${isLight ? 'border-slate-100' : 'border-brand-border'}">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2.5 min-w-0">
            <div class="w-8 h-8 rounded-xl flex items-center justify-center text-base shrink-0 ${c.icon[mode]}">
              ${cfg.emoji}
            </div>
            <div class="min-w-0">
              <div class="text-sm font-bold truncate ${isLight ? 'text-slate-900' : 'text-white'}">${cfg.label}</div>
              <div class="text-[10px] truncate ${isLight ? 'text-slate-400' : 'text-slate-500'}">${cfg.sublabel}</div>
            </div>
          </div>
          <span class="text-[10px] font-bold px-2 py-0.5 rounded-full text-white shrink-0 ${c.badge}">
            ${files.length}
          </span>
        </div>

        <!-- 直連 Google Drive 按鈕 -->
        ${folderId ? `
          <a href="${driveService.getFolderWebLink(folderId)}" target="_blank" rel="noopener"
             class="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${c.open[mode]}">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
              <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
            <span>${t('開啟資料夾', 'Open Folder')}</span>
          </a>
        ` : ''}
      </div>

      <!-- File List -->
      <div class="flex-1 divide-y ${isLight ? 'divide-slate-50' : 'divide-slate-800/60'}">
        ${files.length === 0 ? `
          <div class="py-8 text-center text-xs ${isLight ? 'text-slate-400' : 'text-slate-600'}">
            ${t('尚無檔案', 'No files yet')}
          </div>
        ` : [
          ...files.slice(0, 5).map(f => `
            <div class="group flex items-center gap-2 px-3 py-2 transition-colors
              hover:${isLight ? 'bg-slate-50' : 'bg-slate-800/30'}">
              <span class="text-sm shrink-0 leading-none">${fileEmoji(f.mimeType)}</span>
              <div class="flex-1 min-w-0">
                <a href="${f.webViewLink}" target="_blank" rel="noopener"
                   class="text-xs font-medium truncate block hover:underline ${isLight ? 'text-slate-700' : 'text-slate-300'}">
                  ${f.name}
                </a>
                <div class="text-[9.5px] ${isLight ? 'text-slate-400' : 'text-slate-600'} mt-0.5">
                  ${driveService.formatDate(f.modifiedTime)} · ${driveService.formatFileSize(f.size)}
                </div>
              </div>
              <button onclick="window.TrustCV.deleteDriveFile('${f.id}', '${cfg.key}')"
                class="opacity-0 group-hover:opacity-100 p-1 rounded-lg transition-all
                ${isLight ? 'text-slate-400 hover:text-red-500 hover:bg-red-50' : 'text-slate-600 hover:text-red-400 hover:bg-red-950/30'}"
                title="${t('刪除', 'Delete')}">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                  <path d="M10 11v6m4-6v6"/>
                  <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                </svg>
              </button>
            </div>
          `),
          files.length > 5 ? `
            <div class="px-3 py-2 text-center">
              <a href="${driveService.getFolderWebLink(folderId)}" target="_blank" rel="noopener"
                 class="text-xs ${isLight ? 'text-blue-600 hover:text-blue-700' : 'text-blue-400 hover:text-blue-300'}">
                +${files.length - 5} ${t('更多檔案在 Drive 中', 'more files')}
              </a>
            </div>
          ` : ''
        ].join('')}
      </div>

    </div>
  `;
}

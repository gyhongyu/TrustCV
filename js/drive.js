/**
 * TrustCV Google Drive Service
 * Manages the TrustCV folder structure in the user's own Google Drive.
 * Uses drive.file scope - only accesses files created or opened by this app.
 *
 * Folder layout auto-created:
 *   📋 TrustCV/
 *     ├── 🪪 Certificates/   (ID, passport, diplomas)
 *     ├── 📄 Resumes/        (master resume files)
 *     └── 🚀 Exports/        (LinkedIn, 104, CakeResume versions)
 */

import { authService } from './auth.js';

const DRIVE_V3   = 'https://www.googleapis.com/drive/v3';
const UPLOAD_V3  = 'https://www.googleapis.com/upload/drive/v3';

export const FOLDER_LABELS = {
  root:         '📋 TrustCV',
  photos:       '🖼️ Photos',
  certificates: '🪪 Certificates',
  resumes:      '📄 Resumes',
  exports:      '🚀 Exports'
};

const MASTER_PROFILE_NAME = 'master_profile.json';

class DriveService {
  _authHeaders(extra = {}) {
    const token = authService.getToken();
    if (!token) throw new Error('Not authenticated. Please sign in with Google first.');
    return { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', ...extra };
  }

  async _apiFetch(url, options = {}) {
    const res = await fetch(url, {
      ...options,
      headers: { ...this._authHeaders(), ...(options.headers || {}) }
    });
    if (res.status === 204) return null;
    const body = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(body.error?.message || `Drive API error ${res.status}`);
    return body;
  }

  /**
   * Find a folder by name (optionally under a parent).
   * With drive.file scope, this searches among files this app has access to.
   */
  async _findOrCreateFolder(name, parentId = null) {
    const parentClause = parentId ? `and '${parentId}' in parents` : '';
    const q = `name='${name}' and mimeType='application/vnd.google-apps.folder' ${parentClause} and trashed=false`;
    const url = `${DRIVE_V3}/files?q=${encodeURIComponent(q)}&fields=files(id,name)&spaces=drive&pageSize=1`;

    const result = await this._apiFetch(url);
    if (result?.files?.length > 0) return result.files[0].id;

    // Not found → create
    const metadata = {
      name,
      mimeType: 'application/vnd.google-apps.folder',
      ...(parentId ? { parents: [parentId] } : {})
    };
    const created = await this._apiFetch(`${DRIVE_V3}/files?fields=id,name`, {
      method: 'POST',
      body: JSON.stringify(metadata)
    });
    return created.id;
  }

  /** Ensure TrustCV folder structure exists; returns { root, photos, certificates, resumes, exports } */
  async ensureFolderStructure() {
    const rootId = await this._findOrCreateFolder(FOLDER_LABELS.root);
    const [photosId, certsId, resumesId, exportsId] = await Promise.all([
      this._findOrCreateFolder(FOLDER_LABELS.photos,       rootId),
      this._findOrCreateFolder(FOLDER_LABELS.certificates, rootId),
      this._findOrCreateFolder(FOLDER_LABELS.resumes,      rootId),
      this._findOrCreateFolder(FOLDER_LABELS.exports,      rootId)
    ]);
    return { root: rootId, photos: photosId, certificates: certsId, resumes: resumesId, exports: exportsId };
  }

  /**
   * Find a file by name inside a specific parent folder.
   */
  async _findFile(name, parentId) {
    const q = `name='${name}' and '${parentId}' in parents and trashed=false`;
    const url = `${DRIVE_V3}/files?q=${encodeURIComponent(q)}&fields=files(id,name,mimeType,modifiedTime)&spaces=drive&pageSize=1`;
    const result = await this._apiFetch(url);
    return result?.files?.[0] || null;
  }

  /**
   * Load master_profile.json from TrustCV root directory in user's Drive.
   * Returns parsed object or null if not found.
   */
  async loadMasterProfile(rootFolderId = null) {
    let rootId = rootFolderId;
    if (!rootId) {
      rootId = await this._findOrCreateFolder(FOLDER_LABELS.root);
    }
    const file = await this._findFile(MASTER_PROFILE_NAME, rootId);
    if (!file) return null;

    const token = authService.getToken();
    const res = await fetch(`${DRIVE_V3}/files/${file.id}?alt=media`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error(`Failed to download master profile: ${res.status}`);
    }
    const data = await res.json();
    return {
      fileId: file.id,
      modifiedTime: file.modifiedTime,
      data
    };
  }

  /**
   * Save master_profile.json to TrustCV root directory in user's Drive.
   * Overwrites if already exists, creates if not.
   */
  async saveMasterProfile(profileData, rootFolderId = null) {
    let rootId = rootFolderId;
    if (!rootId) {
      rootId = await this._findOrCreateFolder(FOLDER_LABELS.root);
    }

    const token = authService.getToken();
    const existingFile = await this._findFile(MASTER_PROFILE_NAME, rootId);
    const contentBlob = new Blob([JSON.stringify(profileData, null, 2)], { type: 'application/json' });

    if (existingFile) {
      // Update existing file content using upload PATCH
      const res = await fetch(`${UPLOAD_V3}/files/${existingFile.id}?uploadType=media`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: contentBlob
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error?.message || `Failed to update ${MASTER_PROFILE_NAME}`);
      }
      return await res.json();
    } else {
      // Create new file with multipart upload
      const metadata = JSON.stringify({
        name: MASTER_PROFILE_NAME,
        parents: [rootId],
        mimeType: 'application/json'
      });
      const form = new FormData();
      form.append('metadata', new Blob([metadata], { type: 'application/json' }));
      form.append('file', contentBlob);

      const res = await fetch(`${UPLOAD_V3}/files?uploadType=multipart&fields=id,name,modifiedTime`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: form
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error?.message || `Failed to create ${MASTER_PROFILE_NAME}`);
      }
      return await res.json();
    }
  }

  /** List files in a folder, newest first */
  async listFiles(folderId) {
    const q = `'${folderId}' in parents and trashed=false`;
    const fields = 'files(id,name,mimeType,size,modifiedTime,webViewLink)';
    const url = `${DRIVE_V3}/files?q=${encodeURIComponent(q)}&fields=${fields}&orderBy=modifiedTime desc&pageSize=50`;
    const result = await this._apiFetch(url);
    return result?.files || [];
  }

  /** Upload a File object to a Drive folder using multipart upload */
  async uploadFile(folderId, file) {
    const metadata = JSON.stringify({ name: file.name, parents: [folderId] });
    const form = new FormData();
    form.append('metadata', new Blob([metadata], { type: 'application/json' }));
    form.append('file', file);

    const token = authService.getToken();
    const res = await fetch(`${UPLOAD_V3}/files?uploadType=multipart&fields=id,name,size,mimeType,modifiedTime,webViewLink`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: form
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || 'Upload failed');
    }
    return res.json();
  }

  /** Move file to Drive trash */
  async deleteFile(fileId) {
    await this._apiFetch(`${DRIVE_V3}/files/${fileId}`, { method: 'DELETE' });
  }

  getFolderWebLink(folderId) {
    return `https://drive.google.com/drive/folders/${folderId}`;
  }

  /** Human-readable file size */
  formatFileSize(bytes) {
    if (!bytes || bytes === '0') return '—';
    const b = parseInt(bytes);
    const units = ['B', 'KB', 'MB', 'GB'];
    let i = 0, s = b;
    while (s >= 1024 && i < units.length - 1) { s /= 1024; i++; }
    return `${s.toFixed(i > 0 ? 1 : 0)} ${units[i]}`;
  }

  formatDate(isoString) {
    if (!isoString) return '—';
    return new Date(isoString).toLocaleDateString('zh-TW', { year: 'numeric', month: 'short', day: 'numeric' });
  }
}

export const driveService = new DriveService();

/**
 * TrustCV Google Authentication Service
 * Uses Google Identity Services (GIS) Token Client - implicit flow for SPA
 * Scope: drive.file (only files created by this app) + openid + profile
 *
 * ⚠️  SETUP REQUIRED:
 *   1. Go to: https://console.cloud.google.com/
 *   2. Create / select a project
 *   3. Enable "Google Drive API"
 *   4. APIs & Services → Credentials → Create → OAuth 2.0 Client ID → Web application
 *   5. Add to "Authorized JavaScript Origins":
 *        - https://cv.teaforia.in
 *        - http://localhost:5188   (local dev — must match bat file port)
 *   6. Copy the Client ID and paste below
 */

// Google Cloud Project: trustcv-509916
// Client ID is public-safe; Client Secret must NEVER appear in frontend code.
const GOOGLE_CLIENT_ID = '606540193289-9oqlch0j8vf95fi5hkfpacejoes8oaij.apps.googleusercontent.com';

const OAUTH_SCOPE = [
  'https://www.googleapis.com/auth/drive.file',
  'openid',
  'email',
  'profile'
].join(' ');

class AuthService {
  constructor() {
    this._tokenClient = null;
    this._accessToken = null;
    this._tokenExpiry = 0;
    this._pendingResolvers = [];
  }

  _ensureClient() {
    if (this._tokenClient) return true;
    if (typeof google === 'undefined' || !google.accounts?.oauth2) return false;

    this._tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: GOOGLE_CLIENT_ID,
      scope: OAUTH_SCOPE,
      callback: async (response) => {
        if (response.error) {
          this._settle('reject', new Error(response.error_description || response.error));
          return;
        }
        this._accessToken = response.access_token;
        this._tokenExpiry = Date.now() + ((response.expires_in || 3600) * 1000);
        try {
          const userInfo = await this._fetchUserInfo();
          this._settle('resolve', userInfo);
        } catch (e) {
          this._settle('reject', e);
        }
      }
    });
    return true;
  }

  async _fetchUserInfo() {
    const res = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${this._accessToken}` }
    });
    if (!res.ok) throw new Error('Failed to fetch user profile');
    return res.json();
  }

  _settle(type, value) {
    const pending = [...this._pendingResolvers];
    this._pendingResolvers = [];
    pending.forEach(({ resolve, reject }) => (type === 'resolve' ? resolve : reject)(value));
  }

  login() {
    return new Promise((resolve, reject) => {
      if (!GOOGLE_CLIENT_ID || GOOGLE_CLIENT_ID.includes('YOUR_GOOGLE_CLIENT_ID')) {
        reject(new Error('Google Client ID not set. Please edit js/auth.js and add your OAuth 2.0 Client ID.'));
        return;
      }
      if (!this._ensureClient()) {
        reject(new Error('Google Identity Services not loaded yet. Please refresh and try again.'));
        return;
      }
      this._pendingResolvers.push({ resolve, reject });
      this._tokenClient.requestAccessToken({ prompt: '' });
    });
  }

  getToken() {
    if (this._accessToken && Date.now() < this._tokenExpiry - 60_000) {
      return this._accessToken;
    }
    return null;
  }

  isAuthenticated() {
    return !!this.getToken();
  }

  logout() {
    if (this._accessToken && typeof google !== 'undefined') {
      google.accounts.oauth2.revoke(this._accessToken, () => {});
    }
    this._accessToken = null;
    this._tokenExpiry = 0;
    this._tokenClient = null;
  }
}

export const authService = new AuthService();

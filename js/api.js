/**
 * Project TrustCV RESTful API Adapter
 * Toggles between offline Mock fixtures and live Google Apps Script (GAS) Web App
 */

import { MOCK_JOBS, MOCK_CANDIDATES, MOCK_PIPELINE_STATUS } from './mock/mockData.js';

export const API_CONFIG = {
  USE_MOCK: true,
  GAS_ENDPOINT: 'https://script.google.com/macros/s/AKfycbx_mock_gateway/exec'
};

export class ApiClient {
  static async getJobs() {
    if (API_CONFIG.USE_MOCK) {
      return Promise.resolve({ success: true, data: MOCK_JOBS });
    }
    try {
      const res = await fetch(`${API_CONFIG.GAS_ENDPOINT}?action=getJobs`);
      return await res.json();
    } catch (e) {
      console.warn('[API] Failed to fetch live jobs, fallback to mock', e);
      return { success: true, data: MOCK_JOBS };
    }
  }

  static async getCandidate(candidateId) {
    if (API_CONFIG.USE_MOCK) {
      return Promise.resolve({ success: true, data: MOCK_CANDIDATES[0] });
    }
    try {
      const res = await fetch(`${API_CONFIG.GAS_ENDPOINT}?action=getCandidate&id=${candidateId}`);
      return await res.json();
    } catch (e) {
      return { success: true, data: MOCK_CANDIDATES[0] };
    }
  }

  static async applyJob(applicationPayload) {
    if (API_CONFIG.USE_MOCK) {
      console.log('[API] Mock Application Submitted:', applicationPayload);
      return Promise.resolve({
        success: true,
        data: {
          application_id: `APP-${Date.now()}`,
          status: 'STAGE_02_SOURCING_APPLY',
          timestamp: new Date().toISOString()
        }
      });
    }
    try {
      const res = await fetch(API_CONFIG.GAS_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'apply', ...applicationPayload })
      });
      return await res.json();
    } catch (e) {
      console.error('[API] Live apply failed', e);
      throw e;
    }
  }
}

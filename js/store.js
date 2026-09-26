/**
 * Project TrustCV Central Reactive Store
 * Manages active route, theme, jobs, candidate dossier, applications, and modals
 */

import { MOCK_JOBS, MOCK_CANDIDATES, MOCK_PIPELINE_STATUS } from './mock/mockData.js';

class Store {
  constructor() {
    const savedTheme = typeof localStorage !== 'undefined' ? localStorage.getItem('trustcv_theme') : null;
    this.state = {
      theme: savedTheme || 'dark',
      currentTab: 'jobs', // 'jobs' | 'cv' | 'status' | 'vault'
      jobs: [...MOCK_JOBS],
      selectedJobId: 'TW-AUT-202610-01',
      candidate: MOCK_CANDIDATES[0],
      pipeline: MOCK_PIPELINE_STATUS,
      searchQuery: '',
      filterCategory: 'ALL',
      applyModalOpen: false,
      applyTargetJob: null,
      toastMessage: null
    };
    this.listeners = [];
  }

  getState() {
    return this.state;
  }

  setState(partialState) {
    this.state = { ...this.state, ...partialState };
    this.notify();
  }

  setTheme(theme) {
    this.setState({ theme });
    localStorage.setItem('trustcv_theme', theme);
    document.documentElement.classList.toggle('light-mode', theme === 'light');
  }

  setTab(tab) {
    this.setState({ currentTab: tab });
  }

  setSelectedJob(jobId) {
    this.setState({ selectedJobId: jobId });
  }

  setSearchQuery(query) {
    this.setState({ searchQuery: query });
  }

  setFilterCategory(cat) {
    this.setState({ filterCategory: cat });
  }

  openApplyModal(job) {
    this.setState({ applyModalOpen: true, applyTargetJob: job });
  }

  closeApplyModal() {
    this.setState({ applyModalOpen: false, applyTargetJob: null });
  }

  showToast(message, duration = 3000) {
    this.setState({ toastMessage: message });
    setTimeout(() => {
      this.setState({ toastMessage: null });
    }, duration);
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.listeners.forEach(fn => fn(this.state));
  }
}

export const store = new Store();

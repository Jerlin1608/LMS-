// api.js — All communication with the backend API
// This replaces the in-memory DB object from the static version

'use strict';

const API = {

  // ── base fetch helper ──────────────────────────────────
  async _fetch(url, options = {}) {
    const res = await fetch(url, {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
      ...options
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Server error');
    return data;
  },

  // ── AUTH ───────────────────────────────────────────────
  async login(username, password, role) {
    return this._fetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password, role })
    });
  },

  async logout() {
    return this._fetch('/api/auth/logout', { method: 'POST' });
  },

  async me() {
    return this._fetch('/api/auth/me');
  },

  async signup(userData) {
    return this._fetch('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  },

  async resetPassword(username, newPassword) {
    return this._fetch('/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ username, newPassword })
    });
  },

  // ── APPLICATIONS ──────────────────────────────────────
  async getApplications() {
    return this._fetch('/api/applications');
  },

  async submitApplication(data) {
    return this._fetch('/api/applications', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  async approveApplication(id, note) {
    return this._fetch(`/api/applications/${id}/approve`, {
      method: 'PUT',
      body: JSON.stringify({ note })
    });
  },

  async rejectApplication(id, note) {
    return this._fetch(`/api/applications/${id}/reject`, {
      method: 'PUT',
      body: JSON.stringify({ note })
    });
  },

  // ── LICENSES ──────────────────────────────────────────
  async getLicenses() {
    return this._fetch('/api/licenses');
  },

  async verifyLicense(licenseId) {
    return this._fetch(`/api/licenses/verify/${licenseId}`);
  },

  async verifyByName(name) {
    return this._fetch(`/api/licenses/verify-by-name/${encodeURIComponent(name)}`);
  },

  async suspendLicense(licId, note) {
    return this._fetch(`/api/licenses/${licId}/suspend`, {
      method: 'PUT',
      body: JSON.stringify({ note })
    });
  },

  async revokeLicense(licId, note) {
    return this._fetch(`/api/licenses/${licId}/revoke`, {
      method: 'PUT',
      body: JSON.stringify({ note })
    });
  },

  // ── NOTIFICATIONS ─────────────────────────────────────
  async getNotifications() {
    return this._fetch('/api/notifications');
  },

  async markNotifsRead() {
    return this._fetch('/api/notifications/mark-read', { method: 'PUT' });
  },

  async clearNotifications() {
    return this._fetch('/api/notifications', { method: 'DELETE' });
  }
};

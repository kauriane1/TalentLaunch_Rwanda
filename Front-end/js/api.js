// js/api.js — Shared API layer for TalentLaunch Rwanda frontend

const API_BASE = (() => {
  const hostname = window.location.hostname;
  const protocol = window.location.protocol;

  if (hostname.includes('.app.github.dev')) {
    const port = window.location.port;
    const baseUrl = port ? `${protocol}//${hostname}:${port}` : `${protocol}//${hostname}`;
    return `${baseUrl}/api`;
  }

  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return '/api';
  }

  // FIX: hardcoded real backend URL instead of wrong :5000 fallback
  return 'https://talentlaunch-rwanda-6.onrender.com/api';
})();

console.log('[API] API_BASE:', API_BASE);

function getToken()        { return localStorage.getItem('token'); }
function setToken(token)   { localStorage.setItem('token', token); }
function removeToken()     { localStorage.removeItem('token'); }
function isLoggedIn()      { return !!getToken(); }

async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const isMultipart = options.body instanceof FormData;
  const headers = { ...options.headers };
  if (!isMultipart) headers['Content-Type'] = 'application/json';

  const config = { headers, ...options };
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (response.status === 401) {
      removeToken();
      window.location.href = 'login.html';
      throw new Error('Session expired. Please log in again.');
    }

    if (!response.ok) throw new Error(data.message || 'API request failed');

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// ── AUTH ──────────────────────────────────────────────

async function register(userData) {
  return apiRequest('/auth/register', { method: 'POST', body: JSON.stringify(userData) });
}

async function login(credentials) {
  const data = await apiRequest('/auth/login', { method: 'POST', body: JSON.stringify(credentials) });
  if (data.token) setToken(data.token);
  return data;
}

async function getMe() {
  return apiRequest('/auth/me');
}

async function logout() {
  removeToken();
  window.location.href = 'index.html';
}

async function updateProfile(profileData, avatarFile) {
  const formData = new FormData();
  Object.keys(profileData).forEach(key => {
    if (profileData[key] !== undefined && profileData[key] !== null)
      formData.append(key, profileData[key]);
  });
  if (avatarFile) formData.append('avatar', avatarFile);
  return apiRequest('/auth/me', { method: 'PUT', headers: {}, body: formData });
}

// ── ADMIN ─────────────────────────────────────────────

async function createAdmin(adminData) {
  return apiRequest('/auth/admin', { method: 'POST', body: JSON.stringify(adminData) });
}

// ── MENTORS ───────────────────────────────────────────

async function getMentors() {
  return apiRequest('/mentors');
}

async function getMentor(id) {
  return apiRequest(`/mentors/${id}`);
}

async function createMentor(mentorData, avatarFile) {
  const formData = new FormData();
  Object.keys(mentorData).forEach(key => formData.append(key, mentorData[key]));
  if (avatarFile) formData.append('avatar', avatarFile);
  return apiRequest('/mentors', { method: 'POST', headers: {}, body: formData });
}

async function updateMentor(id, mentorData, avatarFile) {
  const formData = new FormData();
  Object.keys(mentorData).forEach(key => formData.append(key, mentorData[key]));
  if (avatarFile) formData.append('avatar', avatarFile);
  return apiRequest(`/mentors/${id}`, { method: 'PUT', headers: {}, body: formData });
}

async function deleteMentor(id) {
  return apiRequest(`/mentors/${id}`, { method: 'DELETE' });
}

// ── WORKSHOPS ─────────────────────────────────────────

// FIX: this function was completely missing — caused admin page to crash silently on load
async function getWorkshops(params = {}) {
  const query = new URLSearchParams(params).toString();
  return apiRequest('/workshops' + (query ? `?${query}` : ''));
}

async function getMyWorkshops() {
  return apiRequest('/workshops/my');
}

async function getWorkshop(id) {
  return apiRequest(`/workshops/${id}`);
}

async function createWorkshop(workshopData) {
  return apiRequest('/workshops', { method: 'POST', body: JSON.stringify(workshopData) });
}

async function updateWorkshop(id, workshopData) {
  return apiRequest(`/workshops/${id}`, { method: 'PUT', body: JSON.stringify(workshopData) });
}

async function deleteWorkshop(id) {
  return apiRequest(`/workshops/${id}`, { method: 'DELETE' });
}

async function enrollInWorkshop(id) {
  return apiRequest(`/workshops/${id}/enroll`, { method: 'POST' });
}

async function unenrollFromWorkshop(id) {
  return apiRequest(`/workshops/${id}/enroll`, { method: 'DELETE' });
}

// ── TALENTS ───────────────────────────────────────────

async function getTalents() {
  return apiRequest('/talents');
}

async function getTalent(id) {
  return apiRequest(`/talents/${id}`);
}

async function createTalent(talentData, file) {
  const formData = new FormData();
  Object.keys(talentData).forEach(key => formData.append(key, talentData[key]));
  if (file) formData.append('file', file);
  return apiRequest('/talents', { method: 'POST', headers: {}, body: formData });
}

async function updateTalent(id, talentData) {
  return apiRequest(`/talents/${id}`, { method: 'PUT', body: JSON.stringify(talentData) });
}

async function deleteTalent(id) {
  return apiRequest(`/talents/${id}`, { method: 'DELETE' });
}

// ── HEALTH ────────────────────────────────────────────

async function healthCheck() {
  return apiRequest('/health');
}

// ── EXPORTS ───────────────────────────────────────────

window.API = {
  register, login, getMe, updateProfile, logout, isLoggedIn,
  getMentors, getMentor, createMentor, updateMentor, deleteMentor,
  getWorkshops, getWorkshop, getMyWorkshops,
  createWorkshop, updateWorkshop, deleteWorkshop,
  enrollInWorkshop, unenrollFromWorkshop,
  getTalents, getTalent, createTalent, updateTalent, deleteTalent,
  healthCheck, setToken,
};

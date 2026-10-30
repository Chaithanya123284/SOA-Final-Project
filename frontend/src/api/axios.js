import axios from 'axios';

/**
 * Central Axios instance for the CareerLink frontend.
 *
 * - Base URL comes from the environment (VITE_API_BASE_URL), never hard-coded.
 * - Request interceptor attaches `Authorization: Bearer <JWT>` from localStorage.
 * - Response interceptor handles 401 (expired/invalid token) by clearing
 *   session state and redirecting to /login.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 20000,
});

// ---- Request interceptor: attach JWT ----
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('careerlink_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ---- Response interceptor: handle 401 / network errors ----
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    // Token expired / invalid -> clear session and redirect to login
    if (status === 401) {
      const url = error.config?.url || '';
      // Never wipe the session for the login endpoint itself
      const isAuthCall = url.includes('/auth/login') || url.includes('/auth/register');
      if (!isAuthCall) {
        localStorage.removeItem('careerlink_token');
        localStorage.removeItem('careerlink_user');
        const base = import.meta.env.BASE_URL || '/';
        if (window.location.pathname !== `${base}login`) {
          window.location.href = `${base}login`;
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;
export { API_BASE_URL };
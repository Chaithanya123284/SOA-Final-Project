import api from './axios';

/**
 * Authentication API — talks to the Auth microservice through the API Gateway.
 * Endpoints (backend contract):
 *   POST /api/v1/auth/register
 *   POST /api/v1/auth/login
 *   GET  /api/v1/auth/me
 */

export const registerUser = (payload) =>
  api.post('/api/v1/auth/register', payload).then((res) => res.data);

export const loginUser = (payload) =>
  api.post('/api/v1/auth/login', payload).then((res) => res.data);

export const getCurrentUser = () =>
  api.get('/api/v1/auth/me').then((res) => res.data);

const authApi = { registerUser, loginUser, getCurrentUser };

export default authApi;
import api from './axios';

/**
 * Profile API — talks to the Profile microservice through the API Gateway.
 * Endpoints (backend contract):
 *   POST /api/v1/profiles            (create or update)
 *   GET  /api/v1/profiles/{userId}
 *   GET  /api/v1/profiles/candidates
 *   GET  /api/v1/profiles/search?query=
 */

export const createOrUpdateProfile = (payload) =>
  api.post('/api/v1/profiles', payload).then((res) => res.data);

export const getProfileByUserId = (userId) =>
  api.get(`/api/v1/profiles/${userId}`).then((res) => res.data);

export const getAllCandidates = () =>
  api.get('/api/v1/profiles/candidates').then((res) => res.data);

export const searchProfiles = (query = '') =>
  api.get('/api/v1/profiles/search', { params: { query } }).then((res) => res.data);

const profileApi = {
  createOrUpdateProfile,
  getProfileByUserId,
  getAllCandidates,
  searchProfiles,
};

export default profileApi;
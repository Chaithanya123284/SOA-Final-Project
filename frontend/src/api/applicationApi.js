import api from './axios';

/**
 * Application API — talks to the Application microservice through the API Gateway.
 * Endpoints (backend contract):
 *   POST  /api/v1/applications/apply
 *   GET   /api/v1/applications/my-applications?candidateId=
 *   GET   /api/v1/applications/job/{jobId}
 *   GET   /api/v1/applications/{id}
 *   PATCH /api/v1/applications/{id}/status
 *   GET   /api/v1/applications/candidate/{candidateId}/has-applied/{jobId}
 */

export const applyForJob = (payload) =>
  api.post('/api/v1/applications/apply', payload).then((res) => res.data);

export const getMyApplications = (candidateId) =>
  api
    .get('/api/v1/applications/my-applications', { params: { candidateId } })
    .then((res) => res.data);

export const getApplicationsByJob = (jobId) =>
  api.get(`/api/v1/applications/job/${jobId}`).then((res) => res.data);

export const getApplicationById = (id) =>
  api.get(`/api/v1/applications/${id}`).then((res) => res.data);

export const updateApplicationStatus = (id, payload) =>
  api.patch(`/api/v1/applications/${id}/status`, payload).then((res) => res.data);

export const hasApplied = (candidateId, jobId) =>
  api
    .get(`/api/v1/applications/candidate/${candidateId}/has-applied/${jobId}`)
    .then((res) => res.data);

const applicationApi = {
  applyForJob,
  getMyApplications,
  getApplicationsByJob,
  getApplicationById,
  updateApplicationStatus,
  hasApplied,
};

export default applicationApi;
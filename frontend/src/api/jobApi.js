import api from './axios';

/**
 * Job API — talks to the Job microservice through the API Gateway.
 * Endpoints (backend contract):
 *   GET    /api/v1/jobs                 (public search: query, location, employmentType, minSalary, skill)
 *   GET    /api/v1/jobs/{id}            (public)
 *   GET    /api/v1/jobs/recruiter/{recruiterId}
 *   POST   /api/v1/jobs
 *   PUT    /api/v1/jobs/{id}
 *   DELETE /api/v1/jobs/{id}
 */

export const searchJobs = (params = {}) =>
  api.get('/api/v1/jobs', { params }).then((res) => res.data);

export const getJobById = (id) =>
  api.get(`/api/v1/jobs/${id}`).then((res) => res.data);

export const getJobsByRecruiter = (recruiterId) =>
  api.get(`/api/v1/jobs/recruiter/${recruiterId}`).then((res) => res.data);

export const createJob = (payload) =>
  api.post('/api/v1/jobs', payload).then((res) => res.data);

export const updateJob = (id, payload) =>
  api.put(`/api/v1/jobs/${id}`, payload).then((res) => res.data);

export const deleteJob = (id) =>
  api.delete(`/api/v1/jobs/${id}`).then((res) => res.data);

const jobApi = {
  searchJobs,
  getJobById,
  getJobsByRecruiter,
  createJob,
  updateJob,
  deleteJob,
};

export default jobApi;
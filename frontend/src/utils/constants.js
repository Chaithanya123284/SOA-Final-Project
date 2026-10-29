/**
 * Shared constants mirroring the backend enum contracts.
 */

// Roles accepted by the Auth service on registration
export const REGISTER_ROLES = ['CANDIDATE', 'RECRUITER'];

// Roles returned by the backend in the login response (authorities)
export const ROLE_CANDIDATE = 'ROLE_CANDIDATE';
export const ROLE_RECRUITER = 'ROLE_RECRUITER';

// Employment types (Job service enum)
export const EMPLOYMENT_TYPES = [
  'FULL_TIME',
  'PART_TIME',
  'CONTRACT',
  'INTERNSHIP',
  'REMOTE',
];

// Job statuses (Job service enum)
export const JOB_STATUSES = ['DRAFT', 'OPEN', 'CLOSED', 'ARCHIVED'];

// Application statuses (Application service enum)
export const APPLICATION_STATUSES = [
  'SUBMITTED',
  'UNDER_REVIEW',
  'SHORTLISTED',
  'INTERVIEW_SCHEDULED',
  'REJECTED',
  'ACCEPTED',
];

// Friendly labels for application statuses
export const APPLICATION_STATUS_LABELS = {
  SUBMITTED: 'Applied',
  UNDER_REVIEW: 'Under Review',
  SHORTLISTED: 'Shortlisted',
  INTERVIEW_SCHEDULED: 'Interview',
  REJECTED: 'Rejected',
  ACCEPTED: 'Selected',
};

// Friendly labels for employment types
export const EMPLOYMENT_TYPE_LABELS = {
  FULL_TIME: 'Full Time',
  PART_TIME: 'Part Time',
  CONTRACT: 'Contract',
  INTERNSHIP: 'Internship',
  REMOTE: 'Remote',
};

// Friendly labels for job statuses
export const JOB_STATUS_LABELS = {
  DRAFT: 'Draft',
  OPEN: 'Open',
  CLOSED: 'Closed',
  ARCHIVED: 'Archived',
};

// localStorage keys
export const STORAGE_KEYS = {
  TOKEN: 'careerlink_token',
  USER: 'careerlink_user',
};
import {
  APPLICATION_STATUS_LABELS,
  EMPLOYMENT_TYPE_LABELS,
  JOB_STATUS_LABELS,
} from './constants';

/** Format an ISO date/time string into a readable date. */
export const formatDate = (isoString) => {
  if (!isoString) return '—';
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/** Format an ISO date/time string into a readable date + time. */
export const formatDateTime = (isoString) => {
  if (!isoString) return '—';
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/** Relative time like "3 days ago". */
export const timeAgo = (isoString) => {
  if (!isoString) return '—';
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return '—';
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'week', seconds: 604800 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
  ];
  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count >= 1) {
      return `${count} ${interval.label}${count > 1 ? 's' : ''} ago`;
    }
  }
  return 'just now';
};

/** Format a number as currency. */
export const formatSalary = (min, max, currency = 'USD') => {
  if (min == null && max == null) return null;
  const fmt = (value) =>
    value == null
      ? ''
      : new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: currency || 'USD',
          maximumFractionDigits: 0,
        }).format(value);
  if (min != null && max != null) return `${fmt(min)} – ${fmt(max)}`;
  if (min != null) return `From ${fmt(min)}`;
  return `Up to ${fmt(max)}`;
};

/** Friendly label for an application status. */
export const applicationStatusLabel = (status) =>
  APPLICATION_STATUS_LABELS[status] || status || '—';

/** Friendly label for an employment type. */
export const employmentTypeLabel = (type) =>
  EMPLOYMENT_TYPE_LABELS[type] || type || '—';

/** Friendly label for a job status. */
export const jobStatusLabel = (status) => JOB_STATUS_LABELS[status] || status || '—';

/** Capitalize the first letter of a string. */
export const capitalize = (str = '') =>
  str.length ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : str;

/** Get the first name from a full name. */
export const firstName = (fullName = '') => fullName.trim().split(/\s+/)[0] || fullName;

/** Normalize a backend role list into a single role key: CANDIDATE | RECRUITER. */
export const normalizeRole = (roles = []) => {
  if (Array.isArray(roles) && roles.includes('ROLE_RECRUITER')) return 'RECRUITER';
  if (Array.isArray(roles) && roles.includes('ROLE_CANDIDATE')) return 'CANDIDATE';
  if (typeof roles === 'string') {
    const upper = roles.toUpperCase();
    if (upper.includes('RECRUITER')) return 'RECRUITER';
    if (upper.includes('CANDIDATE')) return 'CANDIDATE';
  }
  return 'CANDIDATE';
};
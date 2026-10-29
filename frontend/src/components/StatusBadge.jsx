import { applicationStatusLabel } from '../utils/formatters';

/**
 * Status badge with a distinct, professional visual style per application status.
 */
const STATUS_STYLES = {
  SUBMITTED: 'bg-secondary-subtle text-secondary border-secondary-subtle',
  UNDER_REVIEW: 'bg-info-subtle text-info-emphasis border-info-subtle',
  SHORTLISTED: 'bg-primary-subtle text-primary border-primary-subtle',
  INTERVIEW_SCHEDULED: 'bg-warning-subtle text-warning-emphasis border-warning-subtle',
  REJECTED: 'bg-danger-subtle text-danger border-danger-subtle',
  ACCEPTED: 'bg-success-subtle text-success border-success-subtle',
};

const StatusBadge = ({ status, size = 'md' }) => {
  const label = applicationStatusLabel(status);
  const style = STATUS_STYLES[status] || 'bg-secondary-subtle text-secondary border-secondary-subtle';
  const padding = size === 'sm' ? 'px-2 py-1 fs-7' : 'px-3 py-1';

  return (
    <span className={`badge rounded-pill border ${style} ${padding} fw-semibold`}>
      {label}
    </span>
  );
};

export default StatusBadge;
import { Link } from 'react-router-dom';
import { Building2, CalendarDays, MessageSquareText } from 'lucide-react';
import StatusBadge from './StatusBadge';
import { formatDate } from '../utils/formatters';

/**
 * Application card used on the candidate's "My Applications" page.
 */
const ApplicationCard = ({ application }) => {
  return (
    <div className="card cl-app-card h-100">
      <div className="card-body d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start gap-2 mb-2">
          <div>
            <h6 className="fw-semibold mb-1">
              <Link to={`/jobs/${application.jobId}`} className="text-decoration-none text-dark">
                {application.jobTitle || 'Job'}
              </Link>
            </h6>
            <div className="text-muted small d-flex align-items-center gap-1">
              <Building2 size={13} /> {application.company || '—'}
            </div>
          </div>
          <StatusBadge status={application.status} size="sm" />
        </div>

        <div className="small text-muted d-flex align-items-center gap-1 mb-2">
          <CalendarDays size={13} /> Applied {formatDate(application.appliedAt)}
        </div>

        {application.latestFeedback && (
          <div className="cl-feedback-box small p-2 rounded-3 mb-2">
            <div className="d-flex align-items-center gap-1 fw-semibold mb-1">
              <MessageSquareText size={13} /> Recruiter Feedback
            </div>
            <div className="text-muted">{application.latestFeedback}</div>
          </div>
        )}

        <div className="mt-auto pt-2">
          <Link to={`/jobs/${application.jobId}`} className="btn btn-outline-primary btn-sm w-100">
            View Job
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ApplicationCard;
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, Clock, Building2, Briefcase } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { employmentTypeLabel, timeAgo, formatSalary } from '../utils/formatters';

/**
 * Responsive job card used in Browse Jobs and dashboards.
 */
const JobCard = ({ job, showApply = true }) => {
  const { isAuthenticated, isCandidate } = useAuth();
  const navigate = useNavigate();

  const handleApply = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/jobs/${job.id}` } });
      return;
    }
    navigate(`/jobs/${job.id}/apply`);
  };

  return (
    <div className="card cl-job-card h-100">
      <div className="card-body d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start gap-2 mb-2">
          <div className="cl-company-badge">
            <Building2 size={20} />
          </div>
          <span className="badge bg-light text-dark border">{employmentTypeLabel(job.employmentType)}</span>
        </div>

        <h5 className="card-title fw-semibold mb-1">
          <Link to={`/jobs/${job.id}`} className="text-decoration-none text-dark cl-job-title">
            {job.title}
          </Link>
        </h5>
        <div className="text-muted small mb-2">{job.company}</div>

        <div className="d-flex flex-wrap gap-3 small text-muted mb-3">
          {job.location && (
            <span className="d-inline-flex align-items-center gap-1">
              <MapPin size={14} /> {job.location}
            </span>
          )}
          {job.createdAt && (
            <span className="d-inline-flex align-items-center gap-1">
              <Clock size={14} /> {timeAgo(job.createdAt)}
            </span>
          )}
        </div>

        {job.requiredSkills?.length > 0 && (
          <div className="d-flex flex-wrap gap-1 mb-3">
            {job.requiredSkills.slice(0, 4).map((skill) => (
              <span key={skill} className="badge cl-skill-badge">
                {skill}
              </span>
            ))}
            {job.requiredSkills.length > 4 && (
              <span className="badge cl-skill-badge">+{job.requiredSkills.length - 4}</span>
            )}
          </div>
        )}

        {formatSalary(job.minSalary, job.maxSalary, job.currency) && (
          <div className="small fw-semibold text-success mb-2">
            {formatSalary(job.minSalary, job.maxSalary, job.currency)}
          </div>
        )}

        <div className="mt-auto d-flex gap-2 pt-2">
          <Link to={`/jobs/${job.id}`} className="btn btn-outline-primary btn-sm flex-fill">
            View Details
          </Link>
          {showApply && (
            <button className="btn btn-primary btn-sm flex-fill" onClick={handleApply}>
              <Briefcase size={14} className="me-1" />
              {isCandidate ? 'Apply' : 'Apply'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobCard;
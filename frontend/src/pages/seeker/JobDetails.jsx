import { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getJobById } from '../../api/jobApi';
import { hasApplied } from '../../api/applicationApi';
import { useAuth } from '../../context/AuthContext';
import { getErrorMessage } from '../../utils/errorHandler';
import {
  employmentTypeLabel,
  formatDate,
  formatSalary,
  timeAgo,
} from '../../utils/formatters';
import LoadingSpinner from '../../components/LoadingSpinner';
import {
  MapPin,
  Building2,
  Clock,
  Briefcase,
  CalendarDays,
  GraduationCap,
  BadgeDollarSign,
  CheckCircle2,
  ArrowLeft,
} from 'lucide-react';

/**
 * Job details page — public, with role-aware apply actions.
 */
const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, isCandidate, user } = useAuth();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [alreadyApplied, setAlreadyApplied] = useState(false);
  const [checkingApplied, setCheckingApplied] = useState(false);

  const loadJob = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getJobById(id);
      setJob(data);
      if (isAuthenticated && isCandidate && user?.id) {
        setCheckingApplied(true);
        try {
          const applied = await hasApplied(user.id, Number(id));
          setAlreadyApplied(applied);
        } catch {
          setAlreadyApplied(false);
        } finally {
          setCheckingApplied(false);
        }
      }
    } catch (err) {
      setError(getErrorMessage(err, 'Job not found.'));
    } finally {
      setLoading(false);
    }
  }, [id, isAuthenticated, isCandidate, user?.id]);

  useEffect(() => {
    loadJob();
  }, [loadJob]);

  const handleApply = () => {
    if (!isAuthenticated) {
      toast.info('Please sign in to apply for this job.');
      navigate('/login', { state: { from: `/jobs/${id}/apply` } });
      return;
    }
    if (!isCandidate) {
      toast.warning('Only job seekers can apply for jobs.');
      return;
    }
    navigate(`/jobs/${id}/apply`);
  };

  if (loading) {
    return (
      <div className="container py-5">
        <LoadingSpinner label="Loading job details..." />
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger" role="alert">
          {error || 'Job not found.'}
        </div>
        <Link to="/jobs" className="btn btn-outline-primary">
          <ArrowLeft size={16} className="me-2" />
          Back to Jobs
        </Link>
      </div>
    );
  }

  const isOpen = job.status === 'OPEN';

  return (
    <div className="container py-4">
      <Link to="/jobs" className="btn btn-link text-decoration-none text-muted px-0 mb-3">
        <ArrowLeft size={16} className="me-1" />
        Back to Jobs
      </Link>

      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body p-4 p-md-5">
          <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-3">
            <div>
              <div className="d-flex align-items-center gap-2 mb-2">
                <span className="badge bg-light text-dark border">{employmentTypeLabel(job.employmentType)}</span>
                {isOpen ? (
                  <span className="badge bg-success-subtle text-success">Open</span>
                ) : (
                  <span className="badge bg-secondary-subtle text-secondary">Closed</span>
                )}
              </div>
              <h3 className="fw-bold mb-1">{job.title}</h3>
              <div className="text-muted d-flex flex-wrap gap-3">
                <span className="d-inline-flex align-items-center gap-1">
                  <Building2 size={15} /> {job.company}
                </span>
                {job.location && (
                  <span className="d-inline-flex align-items-center gap-1">
                    <MapPin size={15} /> {job.location}
                  </span>
                )}
                {job.createdAt && (
                  <span className="d-inline-flex align-items-center gap-1">
                    <Clock size={15} /> Posted {timeAgo(job.createdAt)}
                  </span>
                )}
              </div>
            </div>

            <div className="text-end">
              {isCandidate && !checkingApplied && alreadyApplied ? (
                <button className="btn btn-success px-4" disabled>
                  <CheckCircle2 size={16} className="me-2" />
                  Already Applied
                </button>
              ) : (
                <button
                  className="btn btn-primary btn-lg px-4"
                  onClick={handleApply}
                  disabled={!isOpen || (isCandidate && checkingApplied)}
                >
                  <Briefcase size={16} className="me-2" />
                  {!isOpen ? 'Applications Closed' : 'Apply Now'}
                </button>
              )}
              {!isAuthenticated && (
                <div className="small text-muted mt-2">
                  <Link to="/login" className="text-primary">Sign in</Link> to apply
                </div>
              )}
            </div>
          </div>

          <hr />

          <div className="row g-4">
            <div className="col-lg-8">
              <h6 className="fw-semibold mb-2">Job Description</h6>
              <p className="text-muted cl-pre-line">{job.description || 'No description provided.'}</p>

              {job.requirements && (
                <>
                  <h6 className="fw-semibold mb-2 mt-4">Requirements</h6>
                  <p className="text-muted cl-pre-line">{job.requirements}</p>
                </>
              )}

              {job.requiredSkills?.length > 0 && (
                <>
                  <h6 className="fw-semibold mb-2 mt-4">Required Skills</h6>
                  <div className="d-flex flex-wrap gap-2">
                    {job.requiredSkills.map((skill) => (
                      <span key={skill} className="badge cl-skill-badge fs-6">
                        {skill}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="col-lg-4">
              <div className="cl-details-panel p-4 rounded-4">
                <h6 className="fw-semibold mb-3">Job Overview</h6>
                <div className="d-flex flex-column gap-3">
                  <div className="d-flex align-items-center gap-2">
                    <span className="cl-detail-icon"><Building2 size={16} /></span>
                    <div>
                      <div className="small text-muted">Company</div>
                      <div className="fw-medium">{job.company}</div>
                    </div>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <span className="cl-detail-icon"><MapPin size={16} /></span>
                    <div>
                      <div className="small text-muted">Location</div>
                      <div className="fw-medium">{job.location || '—'}</div>
                    </div>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <span className="cl-detail-icon"><Briefcase size={16} /></span>
                    <div>
                      <div className="small text-muted">Employment Type</div>
                      <div className="fw-medium">{employmentTypeLabel(job.employmentType)}</div>
                    </div>
                  </div>
                  {formatSalary(job.minSalary, job.maxSalary, job.currency) && (
                    <div className="d-flex align-items-center gap-2">
                      <span className="cl-detail-icon"><BadgeDollarSign size={16} /></span>
                      <div>
                        <div className="small text-muted">Salary Range</div>
                        <div className="fw-medium text-success">
                          {formatSalary(job.minSalary, job.maxSalary, job.currency)}
                        </div>
                      </div>
                    </div>
                  )}
                  {job.experienceRequiredYears != null && (
                    <div className="d-flex align-items-center gap-2">
                      <span className="cl-detail-icon"><GraduationCap size={16} /></span>
                      <div>
                        <div className="small text-muted">Experience</div>
                        <div className="fw-medium">{job.experienceRequiredYears}+ years</div>
                      </div>
                    </div>
                  )}
                  <div className="d-flex align-items-center gap-2">
                    <span className="cl-detail-icon"><CalendarDays size={16} /></span>
                    <div>
                      <div className="small text-muted">Posted On</div>
                      <div className="fw-medium">{formatDate(job.createdAt)}</div>
                    </div>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <span className="cl-detail-icon"><UsersIcon /></span>
                    <div>
                      <div className="small text-muted">Applicants</div>
                      <div className="fw-medium">{job.applicantsCount ?? 0}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Small inline icon to avoid an extra import
const UsersIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

export default JobDetails;
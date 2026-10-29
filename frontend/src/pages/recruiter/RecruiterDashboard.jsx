import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getJobsByRecruiter } from '../../api/jobApi';
import { getApplicationsByJob } from '../../api/applicationApi';
import { getErrorMessage } from '../../utils/errorHandler';
import { firstName, formatDate } from '../../utils/formatters';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import {
  Briefcase,
  FileText,
  UserCheck,
  CalendarClock,
  Award,
  ArrowRight,
  Plus,
  Users,
} from 'lucide-react';

/**
 * Recruiter dashboard — live stats, recent applications, active jobs, pipeline.
 */
const RecruiterDashboard = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const recruiterJobs = await getJobsByRecruiter(user.id);
      setJobs(recruiterJobs || []);

      // Fetch applications for each job (backend has no single recruiter endpoint)
      const allApps = [];
      for (const job of recruiterJobs || []) {
        try {
          const apps = await getApplicationsByJob(job.id);
          allApps.push(...apps);
        } catch {
          // Skip jobs whose applications can't be loaded
        }
      }
      setApplications(allApps);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [user.id]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const activeJobs = jobs.filter((j) => j.status === 'OPEN');
  const stats = {
    totalJobs: jobs.length,
    activeJobs: activeJobs.length,
    totalApplications: applications.length,
    SHORTLISTED: applications.filter((a) => a.status === 'SHORTLISTED').length,
    INTERVIEW_SCHEDULED: applications.filter((a) => a.status === 'INTERVIEW_SCHEDULED').length,
    ACCEPTED: applications.filter((a) => a.status === 'ACCEPTED').length,
  };

  const pipeline = [
    { label: 'Applied', count: applications.filter((a) => a.status === 'SUBMITTED' || a.status === 'UNDER_REVIEW').length, color: 'bg-secondary' },
    { label: 'Shortlisted', count: stats.SHORTLISTED, color: 'bg-primary' },
    { label: 'Interview', count: stats.INTERVIEW_SCHEDULED, color: 'bg-warning' },
    { label: 'Selected', count: stats.ACCEPTED, color: 'bg-success' },
    { label: 'Rejected', count: applications.filter((a) => a.status === 'REJECTED').length, color: 'bg-danger' },
  ];
  const pipelineMax = Math.max(1, ...pipeline.map((p) => p.count));

  const recentApplications = [...applications]
    .sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt))
    .slice(0, 5);

  if (loading) {
    return (
      <div className="container py-4">
        <LoadingSpinner label="Loading your dashboard..." />
      </div>
    );
  }

  const statCards = [
    { label: 'Total Jobs', value: stats.totalJobs, icon: Briefcase, color: 'primary' },
    { label: 'Active Jobs', value: stats.activeJobs, icon: Briefcase, color: 'success' },
    { label: 'Total Applications', value: stats.totalApplications, icon: FileText, color: 'primary' },
    { label: 'Shortlisted', value: stats.SHORTLISTED, icon: UserCheck, color: 'primary' },
    { label: 'Interviews', value: stats.INTERVIEW_SCHEDULED, icon: CalendarClock, color: 'warning' },
    { label: 'Selected', value: stats.ACCEPTED, icon: Award, color: 'success' },
  ];

  return (
    <div className="container py-4">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4">
        <div>
          <h4 className="fw-bold mb-1">Welcome, {firstName(user?.fullName)}</h4>
          <p className="text-muted small mb-0">
            {user?.companyName ? `${user.companyName} · ` : ''}Here's your hiring overview.
          </p>
        </div>
        <Link to="/recruiter/jobs/new" className="btn btn-primary">
          <Plus size={16} className="me-1" /> Post New Job
        </Link>
      </div>

      {error && <div className="alert alert-warning">{error}</div>}

      {/* Stat cards */}
      <div className="row g-3 mb-4">
        {statCards.map((card) => (
          <div className="col-6 col-md-4 col-xl-2" key={card.label}>
            <div className="card cl-stat-card h-100 border-0 shadow-sm">
              <div className="card-body p-3">
                <div className={`cl-stat-icon mb-2 bg-${card.color}-subtle text-${card.color}`}>
                  <card.icon size={18} />
                </div>
                <div className="fs-4 fw-bold">{card.value}</div>
                <div className="small text-muted">{card.label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-4">
        {/* Recent applications */}
        <div className="col-lg-7">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white d-flex justify-content-between align-items-center">
              <h6 className="fw-semibold mb-0">Recent Applications</h6>
              <Link to="/recruiter/applications" className="small text-primary text-decoration-none">
                View all
              </Link>
            </div>
            <div className="card-body">
              {recentApplications.length === 0 ? (
                <EmptyState
                  title="No applications yet"
                  message="Applications from candidates will appear here once seekers apply to your jobs."
                  action={
                    <Link to="/recruiter/jobs/new" className="btn btn-primary btn-sm">
                      Post a Job
                    </Link>
                  }
                />
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Candidate</th>
                        <th>Job</th>
                        <th>Status</th>
                        <th className="text-end">Applied</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentApplications.map((app) => (
                        <tr key={app.id}>
                          <td className="fw-medium">{app.candidateName}</td>
                          <td className="text-muted">{app.jobTitle}</td>
                          <td><StatusBadge status={app.status} size="sm" /></td>
                          <td className="text-end text-muted small">{formatDate(app.appliedAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Pipeline */}
        <div className="col-lg-5">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white">
              <h6 className="fw-semibold mb-0">Application Pipeline</h6>
            </div>
            <div className="card-body">
              {applications.length === 0 ? (
                <EmptyState title="Pipeline is empty" message="Your hiring pipeline will populate as candidates apply." />
              ) : (
                <div className="d-flex flex-column gap-3">
                  {pipeline.map((stage) => (
                    <div key={stage.label}>
                      <div className="d-flex justify-content-between small mb-1">
                        <span className="fw-medium">{stage.label}</span>
                        <span className="text-muted">{stage.count}</span>
                      </div>
                      <div className="progress" style={{ height: 10 }}>
                        <div
                          className={`progress-bar ${stage.color}`}
                          style={{ width: `${(stage.count / pipelineMax) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                  <div className="small text-muted mt-1">
                    <Users size={13} className="me-1" />
                    {applications.length} total application{applications.length === 1 ? '' : 's'} across {jobs.length} job{jobs.length === 1 ? '' : 's'}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Active job posts */}
      <div className="card border-0 shadow-sm mt-4">
        <div className="card-header bg-white d-flex justify-content-between align-items-center">
          <h6 className="fw-semibold mb-0">Active Job Posts</h6>
          <Link to="/recruiter/jobs" className="small text-primary text-decoration-none">
            Manage Jobs <ArrowRight size={13} className="ms-1" />
          </Link>
        </div>
        <div className="card-body">
          {activeJobs.length === 0 ? (
            <EmptyState
              title="No active jobs"
              message="Post your first job opening to start receiving applications."
              action={
                <Link to="/recruiter/jobs/new" className="btn btn-primary btn-sm">
                  Post New Job
                </Link>
              }
            />
          ) : (
            <div className="row g-3">
              {activeJobs.slice(0, 3).map((job) => (
                <div className="col-md-4" key={job.id}>
                  <div className="cl-mini-job p-3 rounded-3 h-100">
                    <div className="fw-semibold">
                      <Link to={`/recruiter/jobs/${job.id}/edit`} className="text-decoration-none text-dark">
                        {job.title}
                      </Link>
                    </div>
                    <div className="text-muted small">{job.location}</div>
                    <div className="d-flex justify-content-between align-items-center mt-2">
                      <span className="badge bg-light text-dark border">{job.applicantsCount ?? 0} applicants</span>
                      <Link to={`/recruiter/applications?jobId=${job.id}`} className="btn btn-sm btn-outline-primary">
                        View
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecruiterDashboard;
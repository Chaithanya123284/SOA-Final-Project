import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { getMyApplications } from '../../api/applicationApi';
import { searchJobs } from '../../api/jobApi';
import { getProfileByUserId } from '../../api/profileApi';
import { getErrorMessage } from '../../utils/errorHandler';
import { firstName, applicationStatusLabel } from '../../utils/formatters';
import { APPLICATION_STATUSES } from '../../utils/constants';
import JobCard from '../../components/JobCard';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import {
  FileText,
  CheckCircle2,
  UserCheck,
  CalendarClock,
  Award,
  XCircle,
  ArrowRight,
  UserCircle2,
} from 'lucide-react';

/**
 * Job seeker dashboard — live statistics from backend data.
 */
const SeekerDashboard = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [apps, jobs, profileData] = await Promise.allSettled([
        getMyApplications(user.id),
        searchJobs(),
        getProfileByUserId(user.id),
      ]);

      if (apps.status === 'fulfilled') setApplications(apps.value || []);
      if (jobs.status === 'fulfilled') {
        const allJobs = jobs.value || [];
        const appliedJobIds = new Set(
          (apps.status === 'fulfilled' ? apps.value : []).map((a) => a.jobId)
        );
        const openJobs = allJobs.filter((j) => j.status === 'OPEN' && !appliedJobIds.has(j.id));
        setRecommendedJobs(openJobs.slice(0, 3));
      }
      if (profileData.status === 'fulfilled') setProfile(profileData.value);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [user.id]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const stats = {
    total: applications.length,
    SUBMITTED: applications.filter((a) => a.status === 'SUBMITTED').length,
    UNDER_REVIEW: applications.filter((a) => a.status === 'UNDER_REVIEW').length,
    SHORTLISTED: applications.filter((a) => a.status === 'SHORTLISTED').length,
    INTERVIEW_SCHEDULED: applications.filter((a) => a.status === 'INTERVIEW_SCHEDULED').length,
    REJECTED: applications.filter((a) => a.status === 'REJECTED').length,
    ACCEPTED: applications.filter((a) => a.status === 'ACCEPTED').length,
  };

  const profileCompletion = profile
    ? Math.min(
        100,
        [
          profile.fullName,
          profile.email,
          profile.phone,
          profile.location,
          profile.summary,
          profile.headline,
          profile.resumeUrl,
        ].filter(Boolean).length * 14 +
          (profile.skills?.length ? 2 : 0)
      )
    : 0;

  const statCards = [
    { label: 'Total Applications', value: stats.total, icon: FileText, color: 'primary' },
    { label: 'Applied', value: stats.SUBMITTED, icon: CheckCircle2, color: 'secondary' },
    { label: 'Shortlisted', value: stats.SHORTLISTED, icon: UserCheck, color: 'primary' },
    { label: 'Interviews', value: stats.INTERVIEW_SCHEDULED, icon: CalendarClock, color: 'warning' },
    { label: 'Selected', value: stats.ACCEPTED, icon: Award, color: 'success' },
    { label: 'Rejected', value: stats.REJECTED, icon: XCircle, color: 'danger' },
  ];

  if (loading) {
    return (
      <div className="container py-4">
        <LoadingSpinner label="Loading your dashboard..." />
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4">
        <div>
          <h4 className="fw-bold mb-1">Welcome, {firstName(user?.fullName)}</h4>
          <p className="text-muted small mb-0">Here's what's happening with your job search.</p>
        </div>
        <Link to="/jobs" className="btn btn-primary">
          Browse Jobs <ArrowRight size={16} className="ms-1" />
        </Link>
      </div>

      {error && (
        <div className="alert alert-warning d-flex align-items-center gap-2" role="alert">
          <span>{error}</span>
        </div>
      )}

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
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white d-flex justify-content-between align-items-center">
              <h6 className="fw-semibold mb-0">Recent Applications</h6>
              <Link to="/applications" className="small text-primary text-decoration-none">
                View all
              </Link>
            </div>
            <div className="card-body">
              {applications.length === 0 ? (
                <EmptyState
                  title="No applications yet"
                  message="Browse jobs and apply to start tracking your applications here."
                  action={
                    <Link to="/jobs" className="btn btn-primary btn-sm">
                      Find Jobs
                    </Link>
                  }
                />
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Job</th>
                        <th>Company</th>
                        <th>Status</th>
                        <th className="text-end">Applied</th>
                      </tr>
                    </thead>
                    <tbody>
                      {applications.slice(0, 5).map((app) => (
                        <tr key={app.id}>
                          <td className="fw-medium">
                            <Link to={`/jobs/${app.jobId}`} className="text-decoration-none text-dark">
                              {app.jobTitle}
                            </Link>
                          </td>
                          <td className="text-muted">{app.company}</td>
                          <td><StatusBadge status={app.status} size="sm" /></td>
                          <td className="text-end text-muted small">
                            {new Date(app.appliedAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right column: profile completion + recommended jobs */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body">
              <div className="d-flex align-items-center gap-2 mb-3">
                <UserCircle2 size={20} className="text-primary" />
                <h6 className="fw-semibold mb-0">Profile Completion</h6>
              </div>
              <div className="d-flex justify-content-between small mb-1">
                <span className="text-muted">{profile ? 'Looking good!' : 'Create your profile to get started'}</span>
                <span className="fw-semibold">{profileCompletion}%</span>
              </div>
              <div className="progress mb-3" style={{ height: 10 }}>
                <div
                  className="progress-bar bg-primary"
                  style={{ width: `${profileCompletion}%` }}
                  role="progressbar"
                  aria-valuenow={profileCompletion}
                  aria-valuemin="0"
                  aria-valuemax="100"
                />
              </div>
              <Link to="/profile" className="btn btn-outline-primary btn-sm w-100">
                {profile ? 'Update Profile' : 'Create Profile'}
              </Link>
            </div>
          </div>

          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white">
              <h6 className="fw-semibold mb-0">Recommended Jobs</h6>
            </div>
            <div className="card-body">
              {recommendedJobs.length === 0 ? (
                <EmptyState title="No recommendations yet" message="New openings will appear here." />
              ) : (
                <div className="d-flex flex-column gap-3">
                  {recommendedJobs.map((job) => (
                    <div key={job.id} className="cl-mini-job">
                      <div className="fw-semibold small">
                        <Link to={`/jobs/${job.id}`} className="text-decoration-none text-dark">
                          {job.title}
                        </Link>
                      </div>
                      <div className="text-muted small">{job.company} · {job.location}</div>
                      <div className="d-flex justify-content-between align-items-center mt-1">
                        <span className="badge bg-light text-dark border">{applicationStatusLabel(job.employmentType)}</span>
                        <Link to={`/jobs/${job.id}`} className="btn btn-sm btn-primary">
                          Apply
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeekerDashboard;
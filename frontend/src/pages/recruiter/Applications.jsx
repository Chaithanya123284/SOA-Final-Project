import { useEffect, useState, useCallback, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { getJobsByRecruiter } from '../../api/jobApi';
import { getApplicationsByJob, updateApplicationStatus } from '../../api/applicationApi';
import { getErrorMessage } from '../../utils/errorHandler';
import { formatDate } from '../../utils/formatters';
import { APPLICATION_STATUSES, APPLICATION_STATUS_LABELS } from '../../utils/constants';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import { Search, Eye, Users, MessageSquareText } from 'lucide-react';

/**
 * Recruiter Applications — applicant management with status updates & feedback.
 */
const RecruiterApplications = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();

  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [jobFilter, setJobFilter] = useState(searchParams.get('jobId') || '');
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');

  // Inline status update state per application: { [appId]: { status, feedback } }
  const [updates, setUpdates] = useState({});
  const [updatingId, setUpdatingId] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const recruiterJobs = await getJobsByRecruiter(user.id);
      setJobs(recruiterJobs || []);

      const allApps = [];
      for (const job of recruiterJobs || []) {
        try {
          const apps = await getApplicationsByJob(job.id);
          allApps.push(...apps);
        } catch {
          // skip jobs whose applications can't be loaded
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
    loadData();
  }, [loadData]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return applications.filter((app) => {
      const matchesJob = !jobFilter || String(app.jobId) === String(jobFilter);
      const matchesStatus = !statusFilter || app.status === statusFilter;
      const matchesSearch =
        !term ||
        (app.candidateName || '').toLowerCase().includes(term) ||
        (app.candidateEmail || '').toLowerCase().includes(term);
      return matchesJob && matchesStatus && matchesSearch;
    });
  }, [applications, jobFilter, statusFilter, search]);

  const setUpdate = (appId, field, value) => {
    setUpdates((prev) => ({ ...prev, [appId]: { ...prev[appId], [field]: value } }));
  };

  const handleUpdateStatus = async (app) => {
    const update = updates[app.id];
    if (!update?.status) {
      toast.warning('Please select a new status.');
      return;
    }
    setUpdatingId(app.id);
    try {
      await updateApplicationStatus(app.id, {
        status: update.status,
        recruiterId: user.id,
        recruiterName: user.fullName,
        feedbackNote: update.feedback?.trim() || undefined,
      });
      toast.success('Application status updated.');
      // Refresh applications for that job to reflect the change
      const refreshed = await getApplicationsByJob(app.jobId);
      setApplications((prev) => {
        const others = prev.filter((a) => a.jobId !== app.jobId);
        return [...others, ...refreshed];
      });
      setUpdates((prev) => ({ ...prev, [app.id]: { status: '', feedback: '' } }));
    } catch (err) {
      toast.error(getErrorMessage(err, 'Unable to update the application.'));
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="container py-4">
        <LoadingSpinner label="Loading applications..." />
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4">
        <div>
          <h4 className="fw-bold mb-1">Applications</h4>
          <p className="text-muted small mb-0">Review candidates and manage their application status.</p>
        </div>
        <Link to="/recruiter/jobs/new" className="btn btn-primary">Post New Job</Link>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {/* Filters */}
      <div className="row g-2 mb-4">
        <div className="col-md-4">
          <div className="input-group">
            <span className="input-group-text bg-white">
              <Search size={16} className="text-muted" />
            </span>
            <input
              className="form-control"
              placeholder="Search candidate..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="col-md-4">
          <select
            className="form-select"
            value={jobFilter}
            onChange={(e) => setJobFilter(e.target.value)}
          >
            <option value="">All Jobs</option>
            {jobs.map((job) => (
              <option key={job.id} value={job.id}>
                {job.title}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-4">
          <select
            className="form-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            {APPLICATION_STATUSES.map((status) => (
              <option key={status} value={status}>
                {APPLICATION_STATUS_LABELS[status]}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title={applications.length === 0 ? 'No applications yet' : 'No matching applications'}
          message={
            applications.length === 0
              ? 'Candidates will appear here once they apply to your job postings.'
              : 'Try adjusting your filters.'
          }
        />
      ) : (
        <>
          {/* Desktop table */}
          <div className="card border-0 shadow-sm d-none d-xl-block">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Candidate</th>
                    <th>Email</th>
                    <th>Job</th>
                    <th>Applied</th>
                    <th>Status</th>
                    <th style={{ minWidth: 320 }}>Update Status & Feedback</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((app) => (
                    <tr key={app.id}>
                      <td className="fw-medium">{app.candidateName}</td>
                      <td className="text-muted small">{app.candidateEmail}</td>
                      <td className="text-muted">{app.jobTitle}</td>
                      <td className="text-muted small">{formatDate(app.appliedAt)}</td>
                      <td><StatusBadge status={app.status} size="sm" /></td>
                      <td>
                        <div className="d-flex flex-column gap-1">
                          <div className="d-flex gap-1">
                            <select
                              className="form-select form-select-sm"
                              value={updates[app.id]?.status || ''}
                              onChange={(e) => setUpdate(app.id, 'status', e.target.value)}
                            >
                              <option value="">Select status...</option>
                              {APPLICATION_STATUSES.map((status) => (
                                <option key={status} value={status}>
                                  {APPLICATION_STATUS_LABELS[status]}
                                </option>
                              ))}
                            </select>
                            <button
                              className="btn btn-sm btn-primary text-nowrap"
                              onClick={() => handleUpdateStatus(app)}
                              disabled={updatingId === app.id}
                            >
                              {updatingId === app.id ? (
                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                              ) : (
                                'Update Status'
                              )}
                            </button>
                          </div>
                          <input
                            className="form-control form-control-sm"
                            placeholder="Recruiter feedback (optional)"
                            value={updates[app.id]?.feedback || ''}
                            onChange={(e) => setUpdate(app.id, 'feedback', e.target.value)}
                          />
                        </div>
                      </td>
                      <td className="text-end">
                        <Link
                          to={`/recruiter/applications/${app.id}`}
                          className="btn btn-sm btn-outline-primary"
                        >
                          <Eye size={14} className="me-1" /> Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile / tablet cards */}
          <div className="d-xl-none d-flex flex-column gap-3">
            {filtered.map((app) => (
              <div className="card border-0 shadow-sm" key={app.id}>
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start gap-2 mb-2">
                    <div>
                      <div className="fw-semibold">{app.candidateName}</div>
                      <div className="text-muted small">{app.candidateEmail}</div>
                    </div>
                    <StatusBadge status={app.status} size="sm" />
                  </div>
                  <div className="text-muted small mb-2">
                    <Users size={13} className="me-1" />
                    {app.jobTitle} · Applied {formatDate(app.appliedAt)}
                  </div>

                  <div className="d-flex flex-column gap-1 mb-2">
                    <div className="d-flex gap-1">
                      <select
                        className="form-select form-select-sm"
                        value={updates[app.id]?.status || ''}
                        onChange={(e) => setUpdate(app.id, 'status', e.target.value)}
                      >
                        <option value="">Select status...</option>
                        {APPLICATION_STATUSES.map((status) => (
                          <option key={status} value={status}>
                            {APPLICATION_STATUS_LABELS[status]}
                          </option>
                        ))}
                      </select>
                      <button
                        className="btn btn-sm btn-primary text-nowrap"
                        onClick={() => handleUpdateStatus(app)}
                        disabled={updatingId === app.id}
                      >
                        {updatingId === app.id ? (
                          <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                        ) : (
                          'Update'
                        )}
                      </button>
                    </div>
                    <input
                      className="form-control form-control-sm"
                      placeholder="Recruiter feedback (optional)"
                      value={updates[app.id]?.feedback || ''}
                      onChange={(e) => setUpdate(app.id, 'feedback', e.target.value)}
                    />
                  </div>

                  <Link to={`/recruiter/applications/${app.id}`} className="btn btn-sm btn-outline-primary w-100">
                    <Eye size={14} className="me-1" /> Candidate Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default RecruiterApplications;
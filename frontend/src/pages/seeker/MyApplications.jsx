import { useEffect, useState, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getMyApplications } from '../../api/applicationApi';
import { useAuth } from '../../context/AuthContext';
import { getErrorMessage } from '../../utils/errorHandler';
import { formatDate } from '../../utils/formatters';
import { APPLICATION_STATUSES, APPLICATION_STATUS_LABELS } from '../../utils/constants';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import { Search, Building2, CalendarDays, MessageSquareText, Eye } from 'lucide-react';

/**
 * My Applications — candidate application tracking dashboard.
 */
const MyApplications = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const loadApplications = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getMyApplications(user.id);
      setApplications(data || []);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [user.id]);

  useEffect(() => {
    loadApplications();
  }, [loadApplications]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return applications.filter((app) => {
      const matchesSearch =
        !term ||
        (app.jobTitle || '').toLowerCase().includes(term) ||
        (app.company || '').toLowerCase().includes(term);
      const matchesStatus = !statusFilter || app.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [applications, search, statusFilter]);

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
          <h4 className="fw-bold mb-1">My Applications</h4>
          <p className="text-muted small mb-0">
            Track the status of every job you've applied to.
          </p>
        </div>
        <Link to="/jobs" className="btn btn-primary">Browse Jobs</Link>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {/* Search + filter */}
      <div className="row g-2 mb-4">
        <div className="col-md-6">
          <div className="input-group">
            <span className="input-group-text bg-white">
              <Search size={16} className="text-muted" />
            </span>
            <input
              className="form-control"
              placeholder="Search by job title or company..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
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
              ? 'Browse jobs and apply to start tracking your applications here.'
              : 'Try adjusting your search or status filter.'
          }
          action={
            applications.length === 0 ? (
              <Link to="/jobs" className="btn btn-primary btn-sm">Find Jobs</Link>
            ) : null
          }
        />
      ) : (
        <>
          {/* Desktop table */}
          <div className="card border-0 shadow-sm d-none d-md-block">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Job</th>
                    <th>Company</th>
                    <th>Applied Date</th>
                    <th>Status</th>
                    <th>Feedback</th>
                    <th className="text-end">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((app) => (
                    <tr key={app.id}>
                      <td className="fw-medium">
                        <Link to={`/jobs/${app.jobId}`} className="text-decoration-none text-dark">
                          {app.jobTitle || '—'}
                        </Link>
                      </td>
                      <td className="text-muted">{app.company || '—'}</td>
                      <td className="text-muted">{formatDate(app.appliedAt)}</td>
                      <td><StatusBadge status={app.status} size="sm" /></td>
                      <td className="text-muted small" style={{ maxWidth: 220 }}>
                        {app.latestFeedback ? (
                          <span className="d-inline-flex align-items-center gap-1">
                            <MessageSquareText size={13} />
                            <span className="text-truncate d-inline-block" style={{ maxWidth: 180 }}>
                              {app.latestFeedback}
                            </span>
                          </span>
                        ) : (
                          '—'
                        )}
                      </td>
                      <td className="text-end">
                        <Link to={`/jobs/${app.jobId}`} className="btn btn-sm btn-outline-primary">
                          <Eye size={14} className="me-1" /> View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile cards */}
          <div className="d-md-none d-flex flex-column gap-3">
            {filtered.map((app) => (
              <div className="card border-0 shadow-sm" key={app.id}>
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start gap-2 mb-2">
                    <div>
                      <div className="fw-semibold">
                        <Link to={`/jobs/${app.jobId}`} className="text-decoration-none text-dark">
                          {app.jobTitle || '—'}
                        </Link>
                      </div>
                      <div className="text-muted small d-flex align-items-center gap-1">
                        <Building2 size={13} /> {app.company || '—'}
                      </div>
                    </div>
                    <StatusBadge status={app.status} size="sm" />
                  </div>
                  <div className="text-muted small d-flex align-items-center gap-1 mb-2">
                    <CalendarDays size={13} /> Applied {formatDate(app.appliedAt)}
                  </div>
                  {app.latestFeedback && (
                    <div className="cl-feedback-box small p-2 rounded-3 mb-2">
                      <div className="fw-semibold mb-1">Recruiter Feedback</div>
                      <div className="text-muted">{app.latestFeedback}</div>
                    </div>
                  )}
                  <Link to={`/jobs/${app.jobId}`} className="btn btn-sm btn-outline-primary w-100">
                    View Job
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

export default MyApplications;
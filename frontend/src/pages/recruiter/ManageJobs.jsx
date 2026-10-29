import { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { getJobsByRecruiter, deleteJob } from '../../api/jobApi';
import { getErrorMessage } from '../../utils/errorHandler';
import { employmentTypeLabel, formatDate, jobStatusLabel } from '../../utils/formatters';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import {
  Plus,
  Eye,
  Pencil,
  Trash2,
  Users,
  MapPin,
  Briefcase,
  Building2,
} from 'lucide-react';

/**
 * Manage Jobs — recruiter's job postings with view/edit/delete actions.
 */
const ManageJobs = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const loadJobs = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getJobsByRecruiter(user.id);
      setJobs(data || []);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [user.id]);

  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  const handleDelete = async () => {
    if (!confirmDelete) return;
    setDeletingId(confirmDelete);
    try {
      await deleteJob(confirmDelete);
      toast.success('Job deleted successfully.');
      setJobs((prev) => prev.filter((j) => j.id !== confirmDelete));
      setConfirmDelete(null);
    } catch (err) {
      toast.error(getErrorMessage(err, 'Unable to delete the job.'));
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="container py-4">
        <LoadingSpinner label="Loading your job posts..." />
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4">
        <div>
          <h4 className="fw-bold mb-1">My Job Posts</h4>
          <p className="text-muted small mb-0">Manage your openings and track applicants.</p>
        </div>
        <Link to="/recruiter/jobs/new" className="btn btn-primary">
          <Plus size={16} className="me-1" /> Post New Job
        </Link>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {jobs.length === 0 ? (
        <EmptyState
          title="No job posts yet"
          message="Create your first job posting to start receiving applications."
          action={
            <Link to="/recruiter/jobs/new" className="btn btn-primary">
              <Plus size={16} className="me-1" /> Post New Job
            </Link>
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
                    <th>Job Title</th>
                    <th>Company</th>
                    <th>Location</th>
                    <th>Type</th>
                    <th>Applications</th>
                    <th>Created</th>
                    <th>Status</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map((job) => (
                    <tr key={job.id}>
                      <td className="fw-medium">
                        <Link to={`/jobs/${job.id}`} className="text-decoration-none text-dark">
                          {job.title}
                        </Link>
                      </td>
                      <td className="text-muted">{job.company}</td>
                      <td className="text-muted">{job.location}</td>
                      <td><span className="badge bg-light text-dark border">{employmentTypeLabel(job.employmentType)}</span></td>
                      <td>
                        <Link
                          to={`/recruiter/applications?jobId=${job.id}`}
                          className="text-decoration-none d-inline-flex align-items-center gap-1"
                        >
                          <Users size={14} /> {job.applicantsCount ?? 0}
                        </Link>
                      </td>
                      <td className="text-muted small">{formatDate(job.createdAt)}</td>
                      <td>
                        <span
                          className={`badge rounded-pill ${
                            job.status === 'OPEN'
                              ? 'bg-success-subtle text-success'
                              : job.status === 'CLOSED'
                                ? 'bg-secondary-subtle text-secondary'
                                : 'bg-warning-subtle text-warning-emphasis'
                          }`}
                        >
                          {jobStatusLabel(job.status)}
                        </span>
                      </td>
                      <td>
                        <div className="d-flex justify-content-end gap-1">
                          <Link to={`/jobs/${job.id}`} className="btn btn-sm btn-outline-secondary" title="View">
                            <Eye size={14} />
                          </Link>
                          <Link to={`/recruiter/jobs/${job.id}/edit`} className="btn btn-sm btn-outline-primary" title="Edit">
                            <Pencil size={14} />
                          </Link>
                          <Link
                            to={`/recruiter/applications?jobId=${job.id}`}
                            className="btn btn-sm btn-outline-info"
                            title="View Applications"
                          >
                            <Users size={14} />
                          </Link>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            title="Delete"
                            onClick={() => setConfirmDelete(job.id)}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile cards */}
          <div className="d-md-none d-flex flex-column gap-3">
            {jobs.map((job) => (
              <div className="card border-0 shadow-sm" key={job.id}>
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start gap-2 mb-1">
                    <div className="fw-semibold">
                      <Link to={`/jobs/${job.id}`} className="text-decoration-none text-dark">
                        {job.title}
                      </Link>
                    </div>
                    <span
                      className={`badge rounded-pill ${
                        job.status === 'OPEN'
                          ? 'bg-success-subtle text-success'
                          : 'bg-secondary-subtle text-secondary'
                      }`}
                    >
                      {jobStatusLabel(job.status)}
                    </span>
                  </div>
                  <div className="text-muted small d-flex flex-wrap gap-2 mb-2">
                    <span className="d-inline-flex align-items-center gap-1"><Building2 size={13} /> {job.company}</span>
                    <span className="d-inline-flex align-items-center gap-1"><MapPin size={13} /> {job.location}</span>
                    <span className="d-inline-flex align-items-center gap-1"><Briefcase size={13} /> {employmentTypeLabel(job.employmentType)}</span>
                  </div>
                  <div className="d-flex gap-2">
                    <Link to={`/jobs/${job.id}`} className="btn btn-sm btn-outline-secondary flex-fill">View</Link>
                    <Link to={`/recruiter/jobs/${job.id}/edit`} className="btn btn-sm btn-outline-primary flex-fill">Edit</Link>
                    <Link to={`/recruiter/applications?jobId=${job.id}`} className="btn btn-sm btn-outline-info flex-fill">
                      Applicants ({job.applicantsCount ?? 0})
                    </Link>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => setConfirmDelete(job.id)}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Delete confirmation modal */}
      {confirmDelete && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog" aria-modal="true">
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content border-0 shadow">
              <div className="modal-header">
                <h5 className="modal-title fw-semibold">Delete Job Posting</h5>
                <button type="button" className="btn-close" onClick={() => setConfirmDelete(null)} aria-label="Close" />
              </div>
              <div className="modal-body">
                <p className="mb-0">
                  Are you sure you want to delete this job posting? This action cannot be undone.
                </p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-outline-secondary" onClick={() => setConfirmDelete(null)} disabled={deletingId !== null}>
                  Cancel
                </button>
                <button className="btn btn-danger" onClick={handleDelete} disabled={deletingId !== null}>
                  {deletingId !== null ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                      Deleting...
                    </>
                  ) : (
                    'Delete Job'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {confirmDelete && <div className="modal-backdrop fade show" />}
    </div>
  );
};

export default ManageJobs;
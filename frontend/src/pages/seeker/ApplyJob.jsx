import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getJobById } from '../../api/jobApi';
import { applyForJob, hasApplied } from '../../api/applicationApi';
import { getProfileByUserId } from '../../api/profileApi';
import { useAuth } from '../../context/AuthContext';
import { getErrorMessage } from '../../utils/errorHandler';
import { employmentTypeLabel } from '../../utils/formatters';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Building2, MapPin, Briefcase, Send, ArrowLeft, FileText } from 'lucide-react';

/**
 * Apply Job page — cover letter + resume URL, then submit.
 */
const ApplyJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [alreadyApplied, setAlreadyApplied] = useState(false);

  const [form, setForm] = useState({ coverLetter: '', resumeUrl: '' });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const [jobData, applied, profile] = await Promise.allSettled([
          getJobById(id),
          hasApplied(user.id, Number(id)),
          getProfileByUserId(user.id),
        ]);
        if (!mounted) return;
        if (jobData.status === 'fulfilled') setJob(jobData.value);
        if (applied.status === 'fulfilled') setAlreadyApplied(applied.value);
        if (profile.status === 'fulfilled' && profile.value?.resumeUrl) {
          setForm((prev) => ({ ...prev, resumeUrl: profile.value.resumeUrl }));
        }
      } catch (err) {
        if (mounted) setError(getErrorMessage(err));
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, [id, user.id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const nextErrors = {};
    if (!form.coverLetter.trim()) nextErrors.coverLetter = 'Cover letter is required.';
    else if (form.coverLetter.trim().length < 20)
      nextErrors.coverLetter = 'Cover letter should be at least 20 characters.';
    if (form.resumeUrl.trim() && !/^https?:\/\/.+/.test(form.resumeUrl.trim())) {
      nextErrors.resumeUrl = 'Resume URL must start with http:// or https://';
    }
    setFormErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const payload = {
        candidateId: user.id,
        candidateName: user.fullName,
        candidateEmail: user.email,
        jobId: Number(id),
        coverLetter: form.coverLetter.trim(),
        resumeUrl: form.resumeUrl.trim() || undefined,
      };
      await applyForJob(payload);
      toast.success('Application submitted successfully.');
      navigate('/applications');
    } catch (err) {
      toast.error(getErrorMessage(err, 'Unable to submit your application.'));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-5">
        <LoadingSpinner label="Loading application form..." />
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">{error || 'Job not found.'}</div>
        <Link to="/jobs" className="btn btn-outline-primary">Back to Jobs</Link>
      </div>
    );
  }

  if (alreadyApplied) {
    return (
      <div className="container py-5">
        <div className="card border-0 shadow-sm mx-auto" style={{ maxWidth: 560 }}>
          <div className="card-body text-center p-5">
            <div className="cl-success-icon mx-auto mb-3">
              <Send size={28} />
            </div>
            <h5 className="fw-bold mb-2">You've already applied</h5>
            <p className="text-muted mb-4">
              Your application for <strong>{job.title}</strong> at {job.company} is already in.
              Track its status from My Applications.
            </p>
            <div className="d-flex justify-content-center gap-2">
              <Link to="/applications" className="btn btn-primary">My Applications</Link>
              <Link to="/jobs" className="btn btn-outline-primary">Browse More Jobs</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <Link to={`/jobs/${job.id}`} className="btn btn-link text-decoration-none text-muted px-0 mb-3">
        <ArrowLeft size={16} className="me-1" />
        Back to Job Details
      </Link>

      <div className="row g-4">
        {/* Job summary */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <span className="badge bg-light text-dark border mb-2">{employmentTypeLabel(job.employmentType)}</span>
              <h5 className="fw-bold mb-1">{job.title}</h5>
              <div className="text-muted small d-flex align-items-center gap-1 mb-2">
                <Building2 size={14} /> {job.company}
              </div>
              {job.location && (
                <div className="text-muted small d-flex align-items-center gap-1 mb-3">
                  <MapPin size={14} /> {job.location}
                </div>
              )}
              <hr />
              <div className="small text-muted">
                <div className="d-flex align-items-center gap-2 mb-2">
                  <Briefcase size={14} />
                  <span>{employmentTypeLabel(job.employmentType)}</span>
                </div>
                {job.requiredSkills?.length > 0 && (
                  <div className="d-flex flex-wrap gap-1 mt-3">
                    {job.requiredSkills.slice(0, 6).map((s) => (
                      <span key={s} className="badge cl-skill-badge">{s}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Application form */}
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4 p-md-5">
              <h5 className="fw-bold mb-1">Submit your application</h5>
              <p className="text-muted small mb-4">
                Applying as <strong>{user?.fullName}</strong> ({user?.email})
              </p>

              <form onSubmit={handleSubmit} noValidate>
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    <FileText size={15} className="me-1" />
                    Cover Letter *
                  </label>
                  <textarea
                    name="coverLetter"
                    rows="7"
                    className={`form-control ${formErrors.coverLetter ? 'is-invalid' : ''}`}
                    placeholder="Tell the recruiter why you're a great fit for this role..."
                    value={form.coverLetter}
                    onChange={handleChange}
                  />
                  {formErrors.coverLetter && (
                    <div className="invalid-feedback">{formErrors.coverLetter}</div>
                  )}
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold">Resume URL (optional)</label>
                  <input
                    type="url"
                    name="resumeUrl"
                    className={`form-control ${formErrors.resumeUrl ? 'is-invalid' : ''}`}
                    placeholder="https://example.com/resume.pdf"
                    value={form.resumeUrl}
                    onChange={handleChange}
                  />
                  {formErrors.resumeUrl && (
                    <div className="invalid-feedback">{formErrors.resumeUrl}</div>
                  )}
                  <div className="form-text">
                    Pre-filled from your profile. Recruiters will use this to review your resume.
                  </div>
                </div>

                <div className="d-flex gap-2">
                  <button type="submit" className="btn btn-primary px-4" disabled={submitting}>
                    {submitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send size={16} className="me-2" />
                        Submit Application
                      </>
                    )}
                  </button>
                  <Link to={`/jobs/${job.id}`} className="btn btn-outline-secondary px-4">
                    Cancel
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplyJob;
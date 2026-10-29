import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getApplicationById } from '../../api/applicationApi';
import { getProfileByUserId } from '../../api/profileApi';
import { getErrorMessage } from '../../utils/errorHandler';
import { formatDate, formatDateTime } from '../../utils/formatters';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  FileText,
  Wrench,
  Briefcase,
  GraduationCap,
  ExternalLink,
  MessageSquareText,
  CalendarDays,
  Link2,
} from 'lucide-react';

/**
 * Candidate Details — full candidate profile + application info for recruiters.
 */
const CandidateDetails = () => {
  const { id } = useParams();
  const [application, setApplication] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const app = await getApplicationById(id);
        if (!mounted) return;
        setApplication(app);

        // Try to load the candidate's full profile (may not exist)
        try {
          const prof = await getProfileByUserId(app.candidateId);
          if (mounted) setProfile(prof);
        } catch {
          if (mounted) setProfile(null);
        }
      } catch (err) {
        if (mounted) setError(getErrorMessage(err, 'Application not found.'));
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="container py-4">
        <LoadingSpinner label="Loading candidate details..." />
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className="container py-4">
        <div className="alert alert-danger">{error || 'Application not found.'}</div>
        <Link to="/recruiter/applications" className="btn btn-outline-primary">
          Back to Applications
        </Link>
      </div>
    );
  }

  const resumeUrl = application.resumeUrl || profile?.resumeUrl;

  return (
    <div className="container py-4">
      <Link to="/recruiter/applications" className="btn btn-link text-decoration-none text-muted px-0 mb-3">
        <ArrowLeft size={16} className="me-1" />
        Back to Applications
      </Link>

      <div className="row g-4">
        {/* Candidate profile */}
        <div className="col-lg-7">
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body p-4">
              <div className="d-flex align-items-center gap-3 mb-3">
                <span className="cl-avatar cl-avatar-xl bg-primary text-white">
                  {(application.candidateName || 'C').charAt(0).toUpperCase()}
                </span>
                <div>
                  <h5 className="fw-bold mb-0">{application.candidateName}</h5>
                  {profile?.headline && <div className="text-muted small">{profile.headline}</div>}
                  <div className="d-flex flex-wrap gap-2 mt-1">
                    {profile?.currentDesignation && (
                      <span className="badge bg-light text-dark border">{profile.currentDesignation}</span>
                    )}
                    {profile?.currentCompany && (
                      <span className="badge bg-light text-dark border">{profile.currentCompany}</span>
                    )}
                  </div>
                </div>
              </div>

              <hr />

              <div className="row g-3">
                <div className="col-md-6">
                  <div className="d-flex align-items-center gap-2">
                    <Mail size={15} className="text-muted" />
                    <span className="small">{application.candidateEmail}</span>
                  </div>
                </div>
                {(profile?.phone || application.candidatePhone) && (
                  <div className="col-md-6">
                    <div className="d-flex align-items-center gap-2">
                      <Phone size={15} className="text-muted" />
                      <span className="small">{profile?.phone || application.candidatePhone}</span>
                    </div>
                  </div>
                )}
                {profile?.location && (
                  <div className="col-md-6">
                    <div className="d-flex align-items-center gap-2">
                      <MapPin size={15} className="text-muted" />
                      <span className="small">{profile.location}</span>
                    </div>
                  </div>
                )}
                {profile?.yearsOfExperience != null && (
                  <div className="col-md-6">
                    <div className="d-flex align-items-center gap-2">
                      <Briefcase size={15} className="text-muted" />
                      <span className="small">{profile.yearsOfExperience} years of experience</span>
                    </div>
                  </div>
                )}
              </div>

              {profile?.summary && (
                <>
                  <h6 className="fw-semibold mt-4 mb-2">Professional Summary</h6>
                  <p className="text-muted small cl-pre-line">{profile.summary}</p>
                </>
              )}

              {profile?.skills?.length > 0 && (
                <>
                  <h6 className="fw-semibold mt-4 mb-2">Skills</h6>
                  <div className="d-flex flex-wrap gap-1">
                    {profile.skills.map((skill) => (
                      <span key={skill} className="badge cl-skill-badge">{skill}</span>
                    ))}
                  </div>
                </>
              )}

              {profile?.experiences?.length > 0 && (
                <>
                  <h6 className="fw-semibold mt-4 mb-2">Work Experience</h6>
                  <div className="d-flex flex-column gap-3">
                    {profile.experiences.map((exp, i) => (
                      <div className="cl-sub-card p-3 rounded-3" key={i}>
                        <div className="fw-semibold small">{exp.role || 'Role'}</div>
                        <div className="text-muted small">{exp.company}</div>
                        <div className="text-muted small">
                          {exp.startDate || '—'} – {exp.currentlyWorking ? 'Present' : exp.endDate || '—'}
                        </div>
                        {exp.description && <div className="text-muted small mt-1">{exp.description}</div>}
                      </div>
                    ))}
                  </div>
                </>
              )}

              {profile?.educations?.length > 0 && (
                <>
                  <h6 className="fw-semibold mt-4 mb-2">Education</h6>
                  <div className="d-flex flex-column gap-3">
                    {profile.educations.map((edu, i) => (
                      <div className="cl-sub-card p-3 rounded-3" key={i}>
                        <div className="fw-semibold small">{edu.degree || 'Degree'}</div>
                        <div className="text-muted small">{edu.institution}</div>
                        <div className="text-muted small">
                          {edu.fieldOfStudy && `${edu.fieldOfStudy} · `}
                          {edu.startYear || '—'} – {edu.endYear || '—'}
                          {edu.grade && ` · ${edu.grade}`}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {(profile?.githubUrl || profile?.linkedinUrl || profile?.portfolioUrl) && (
                <>
                  <h6 className="fw-semibold mt-4 mb-2">Links</h6>
                  <div className="d-flex flex-wrap gap-2">
                    {profile.githubUrl && (
                      <a href={profile.githubUrl} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-secondary">
                        <Link2 size={14} className="me-1" /> GitHub
                      </a>
                    )}
                    {profile.linkedinUrl && (
                      <a href={profile.linkedinUrl} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-secondary">
                        <Link2 size={14} className="me-1" /> LinkedIn
                      </a>
                    )}
                    {profile.portfolioUrl && (
                      <a href={profile.portfolioUrl} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-secondary">
                        <Link2 size={14} className="me-1" /> Portfolio
                      </a>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Application details */}
        <div className="col-lg-5">
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-white">
              <h6 className="fw-semibold mb-0">Application Details</h6>
            </div>
            <div className="card-body">
              <div className="d-flex flex-column gap-3">
                <div>
                  <div className="small text-muted">Applied Job</div>
                  <div className="fw-medium">
                    <Link to={`/jobs/${application.jobId}`} className="text-decoration-none text-dark">
                      {application.jobTitle}
                    </Link>
                  </div>
                </div>
                <div>
                  <div className="small text-muted">Company</div>
                  <div className="fw-medium">{application.company}</div>
                </div>
                <div>
                  <div className="small text-muted">Application Date</div>
                  <div className="fw-medium d-flex align-items-center gap-1">
                    <CalendarDays size={14} /> {formatDateTime(application.appliedAt)}
                  </div>
                </div>
                <div>
                  <div className="small text-muted mb-1">Application Status</div>
                  <StatusBadge status={application.status} />
                </div>

                {application.coverLetter && (
                  <>
                    <hr />
                    <div>
                      <div className="small text-muted mb-1">Cover Letter</div>
                      <div className="cl-feedback-box p-3 rounded-3 small cl-pre-line">
                        {application.coverLetter}
                      </div>
                    </div>
                  </>
                )}

                {application.latestFeedback && (
                  <>
                    <hr />
                    <div>
                      <div className="small text-muted mb-1 d-flex align-items-center gap-1">
                        <MessageSquareText size={13} /> Recruiter Feedback
                      </div>
                      <div className="cl-feedback-box p-3 rounded-3 small">
                        {application.latestFeedback}
                      </div>
                    </div>
                  </>
                )}

                {application.reviewNotes?.length > 0 && (
                  <>
                    <hr />
                    <div>
                      <div className="small text-muted mb-2">Feedback History</div>
                      <div className="d-flex flex-column gap-2">
                        {application.reviewNotes.map((note, i) => (
                          <div className="cl-sub-card p-2 rounded-3 small" key={i}>
                            <div className="fw-semibold">{note.recruiterName || 'Recruiter'}</div>
                            <div className="text-muted">{note.note}</div>
                            <div className="text-muted small">{formatDateTime(note.createdAt)}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {resumeUrl && (
                  <>
                    <hr />
                    <a
                      href={resumeUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-primary w-100"
                    >
                      <ExternalLink size={16} className="me-2" />
                      View / Download Resume
                    </a>
                  </>
                )}
              </div>
            </div>
          </div>

          <Link to="/recruiter/applications" className="btn btn-outline-primary w-100">
            <ArrowLeft size={16} className="me-2" />
            Back to Applications
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CandidateDetails;
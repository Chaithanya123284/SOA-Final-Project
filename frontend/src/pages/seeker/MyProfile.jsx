import { useEffect, useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { getProfileByUserId, createOrUpdateProfile } from '../../api/profileApi';
import { getErrorMessage } from '../../utils/errorHandler';
import LoadingSpinner from '../../components/LoadingSpinner';
import {
  User,
  Mail,
  Phone,
  MapPin,
  FileText,
  Wrench,
  Link2,
  Briefcase,
  GraduationCap,
  Save,
  Pencil,
  Plus,
  Trash2,
  ExternalLink,
} from 'lucide-react';

const EMPTY_EXPERIENCE = { company: '', role: '', startDate: '', endDate: '', currentlyWorking: false, description: '' };
const EMPTY_EDUCATION = { institution: '', degree: '', fieldOfStudy: '', startYear: '', endYear: '', grade: '' };

/**
 * My Profile — candidate profile with edit mode and completion meter.
 */
const MyProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    location: '',
    headline: '',
    summary: '',
    skills: '',
    resumeUrl: '',
    resumeText: '',
    githubUrl: '',
    linkedinUrl: '',
    portfolioUrl: '',
    yearsOfExperience: '',
    currentCompany: '',
    currentDesignation: '',
    experiences: [],
    educations: [],
  });
  const [formErrors, setFormErrors] = useState({});

  const loadProfile = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getProfileByUserId(user.id);
      setProfile(data);
      setForm({
        fullName: data.fullName || user.fullName || '',
        email: data.email || user.email || '',
        phone: data.phone || '',
        location: data.location || '',
        headline: data.headline || '',
        summary: data.summary || '',
        skills: Array.isArray(data.skills) ? data.skills.join(', ') : data.skills || '',
        resumeUrl: data.resumeUrl || '',
        resumeText: data.resumeText || '',
        githubUrl: data.githubUrl || '',
        linkedinUrl: data.linkedinUrl || '',
        portfolioUrl: data.portfolioUrl || '',
        yearsOfExperience: data.yearsOfExperience ?? '',
        currentCompany: data.currentCompany || '',
        currentDesignation: data.currentDesignation || '',
        experiences: data.experiences || [],
        educations: data.educations || [],
      });
    } catch (err) {
      // 404 = no profile yet; seed the form from the auth user
      if (err?.response?.status === 404) {
        setProfile(null);
        setForm((prev) => ({
          ...prev,
          fullName: user.fullName || '',
          email: user.email || '',
        }));
      } else {
        setError(getErrorMessage(err));
      }
    } finally {
      setLoading(false);
    }
  }, [user.id, user.fullName, user.email]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleExperienceChange = (index, field, value) => {
    setForm((prev) => {
      const experiences = prev.experiences.map((exp, i) =>
        i === index ? { ...exp, [field]: value } : exp
      );
      return { ...prev, experiences };
    });
  };

  const handleEducationChange = (index, field, value) => {
    setForm((prev) => {
      const educations = prev.educations.map((edu, i) =>
        i === index ? { ...edu, [field]: value } : edu
      );
      return { ...prev, educations };
    });
  };

  const addExperience = () =>
    setForm((prev) => ({ ...prev, experiences: [...prev.experiences, { ...EMPTY_EXPERIENCE }] }));
  const removeExperience = (index) =>
    setForm((prev) => ({ ...prev, experiences: prev.experiences.filter((_, i) => i !== index) }));

  const addEducation = () =>
    setForm((prev) => ({ ...prev, educations: [...prev.educations, { ...EMPTY_EDUCATION }] }));
  const removeEducation = (index) =>
    setForm((prev) => ({ ...prev, educations: prev.educations.filter((_, i) => i !== index) }));

  const validate = () => {
    const nextErrors = {};
    if (!form.fullName.trim()) nextErrors.fullName = 'Full name is required.';
    if (!form.email.trim()) nextErrors.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) nextErrors.email = 'Enter a valid email.';
    if (form.resumeUrl.trim() && !/^https?:\/\/.+/.test(form.resumeUrl.trim())) {
      nextErrors.resumeUrl = 'Resume URL must start with http:// or https://';
    }
    setFormErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      const payload = {
        userId: user.id,
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || undefined,
        location: form.location.trim() || undefined,
        headline: form.headline.trim() || undefined,
        summary: form.summary.trim() || undefined,
        skills: form.skills.split(',').map((s) => s.trim()).filter(Boolean),
        resumeUrl: form.resumeUrl.trim() || undefined,
        resumeText: form.resumeText.trim() || undefined,
        githubUrl: form.githubUrl.trim() || undefined,
        linkedinUrl: form.linkedinUrl.trim() || undefined,
        portfolioUrl: form.portfolioUrl.trim() || undefined,
        yearsOfExperience:
          form.yearsOfExperience === '' ? undefined : Number(form.yearsOfExperience),
        currentCompany: form.currentCompany.trim() || undefined,
        currentDesignation: form.currentDesignation.trim() || undefined,
        experiences: form.experiences.filter((exp) => exp.company || exp.role),
        educations: form.educations.filter((edu) => edu.institution || edu.degree),
      };
      const saved = await createOrUpdateProfile(payload);
      setProfile(saved);
      toast.success('Profile saved successfully.');
      setEditing(false);
    } catch (err) {
      toast.error(getErrorMessage(err, 'Unable to save your profile.'));
    } finally {
      setSaving(false);
    }
  };

  const completion = profile
    ? Math.min(
        100,
        [
          profile.fullName,
          profile.email,
          profile.phone,
          profile.location,
          profile.headline,
          profile.summary,
          profile.resumeUrl,
        ].filter(Boolean).length * 12 +
          (profile.skills?.length ? 8 : 0) +
          (profile.experiences?.length ? 8 : 0) +
          (profile.educations?.length ? 4 : 0)
      )
    : 0;

  if (loading) {
    return (
      <div className="container py-4">
        <LoadingSpinner label="Loading profile..." />
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4">
        <div>
          <h4 className="fw-bold mb-1">My Profile</h4>
          <p className="text-muted small mb-0">Showcase your experience to recruiters.</p>
        </div>
        {!editing && (
          <button className="btn btn-primary" onClick={() => setEditing(true)}>
            <Pencil size={16} className="me-2" />
            Edit Profile
          </button>
        )}
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {/* Completion meter */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <span className="fw-semibold">Profile Completion</span>
            <span className="fw-bold text-primary">{completion}%</span>
          </div>
          <div className="progress" style={{ height: 12 }}>
            <div
              className="progress-bar bg-primary"
              style={{ width: `${completion}%` }}
              role="progressbar"
              aria-valuenow={completion}
              aria-valuemin="0"
              aria-valuemax="100"
            />
          </div>
          <div className="small text-muted mt-2">
            {completion < 100
              ? 'Complete your profile to increase your visibility to recruiters.'
              : 'Your profile is complete. Great job!'}
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} noValidate>
        {/* Personal information */}
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-header bg-white d-flex align-items-center gap-2">
            <User size={18} className="text-primary" />
            <h6 className="fw-semibold mb-0">Personal Information</h6>
          </div>
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label fw-semibold">Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  className={`form-control ${formErrors.fullName ? 'is-invalid' : ''}`}
                  value={form.fullName}
                  onChange={handleChange}
                  disabled={!editing}
                />
                {formErrors.fullName && <div className="invalid-feedback">{formErrors.fullName}</div>}
              </div>
              <div className="col-md-6">
                <label className="form-label fw-semibold">Headline</label>
                <input
                  type="text"
                  name="headline"
                  className="form-control"
                  placeholder="e.g. Senior Full Stack Developer"
                  value={form.headline}
                  onChange={handleChange}
                  disabled={!editing}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-semibold">Email *</label>
                <div className="input-group">
                  <span className="input-group-text bg-white"><Mail size={15} className="text-muted" /></span>
                  <input
                    type="email"
                    name="email"
                    className={`form-control ${formErrors.email ? 'is-invalid' : ''}`}
                    value={form.email}
                    onChange={handleChange}
                    disabled={!editing}
                  />
                  {formErrors.email && <div className="invalid-feedback">{formErrors.email}</div>}
                </div>
              </div>
              <div className="col-md-6">
                <label className="form-label fw-semibold">Phone</label>
                <div className="input-group">
                  <span className="input-group-text bg-white"><Phone size={15} className="text-muted" /></span>
                  <input
                    type="tel"
                    name="phone"
                    className="form-control"
                    placeholder="+91 98765 43210"
                    value={form.phone}
                    onChange={handleChange}
                    disabled={!editing}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <label className="form-label fw-semibold">Location</label>
                <div className="input-group">
                  <span className="input-group-text bg-white"><MapPin size={15} className="text-muted" /></span>
                  <input
                    type="text"
                    name="location"
                    className="form-control"
                    placeholder="e.g. Hyderabad, India"
                    value={form.location}
                    onChange={handleChange}
                    disabled={!editing}
                  />
                </div>
              </div>
              <div className="col-md-3">
                <label className="form-label fw-semibold">Years of Experience</label>
                <input
                  type="number"
                  name="yearsOfExperience"
                  min="0"
                  className="form-control"
                  placeholder="e.g. 5"
                  value={form.yearsOfExperience}
                  onChange={handleChange}
                  disabled={!editing}
                />
              </div>
              <div className="col-md-3">
                <label className="form-label fw-semibold">Current Company</label>
                <input
                  type="text"
                  name="currentCompany"
                  className="form-control"
                  placeholder="e.g. TechCorp"
                  value={form.currentCompany}
                  onChange={handleChange}
                  disabled={!editing}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-semibold">Current Designation</label>
                <input
                  type="text"
                  name="currentDesignation"
                  className="form-control"
                  placeholder="e.g. Senior Engineer"
                  value={form.currentDesignation}
                  onChange={handleChange}
                  disabled={!editing}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Professional summary */}
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-header bg-white d-flex align-items-center gap-2">
            <FileText size={18} className="text-primary" />
            <h6 className="fw-semibold mb-0">Professional Summary</h6>
          </div>
          <div className="card-body">
            <textarea
              name="summary"
              rows="4"
              className="form-control"
              placeholder="A short summary of your background, strengths and career goals..."
              value={form.summary}
              onChange={handleChange}
              disabled={!editing}
            />
          </div>
        </div>

        {/* Skills */}
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-header bg-white d-flex align-items-center gap-2">
            <Wrench size={18} className="text-primary" />
            <h6 className="fw-semibold mb-0">Skills</h6>
          </div>
          <div className="card-body">
            <input
              type="text"
              name="skills"
              className="form-control"
              placeholder="Comma separated, e.g. Java, Spring Boot, React, SQL"
              value={form.skills}
              onChange={handleChange}
              disabled={!editing}
            />
            <div className="form-text">Separate multiple skills with commas.</div>
            {!editing && profile?.skills?.length > 0 && (
              <div className="d-flex flex-wrap gap-1 mt-3">
                {profile.skills.map((skill) => (
                  <span key={skill} className="badge cl-skill-badge">{skill}</span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Experience */}
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-header bg-white d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center gap-2">
              <Briefcase size={18} className="text-primary" />
              <h6 className="fw-semibold mb-0">Work Experience</h6>
            </div>
            {editing && (
              <button type="button" className="btn btn-sm btn-outline-primary" onClick={addExperience}>
                <Plus size={14} className="me-1" /> Add Experience
              </button>
            )}
          </div>
          <div className="card-body">
            {form.experiences.length === 0 ? (
              <p className="text-muted small mb-0">No work experience added yet.</p>
            ) : (
              <div className="d-flex flex-column gap-3">
                {form.experiences.map((exp, index) => (
                  <div className="cl-sub-card p-3 rounded-3" key={index}>
                    <div className="row g-2">
                      <div className="col-md-6">
                        <input
                          className="form-control form-control-sm"
                          placeholder="Company"
                          value={exp.company}
                          onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}
                          disabled={!editing}
                        />
                      </div>
                      <div className="col-md-6">
                        <input
                          className="form-control form-control-sm"
                          placeholder="Role / Title"
                          value={exp.role}
                          onChange={(e) => handleExperienceChange(index, 'role', e.target.value)}
                          disabled={!editing}
                        />
                      </div>
                      <div className="col-md-3">
                        <input
                          className="form-control form-control-sm"
                          placeholder="Start (e.g. 2021)"
                          value={exp.startDate}
                          onChange={(e) => handleExperienceChange(index, 'startDate', e.target.value)}
                          disabled={!editing}
                        />
                      </div>
                      <div className="col-md-3">
                        <input
                          className="form-control form-control-sm"
                          placeholder="End (e.g. 2024)"
                          value={exp.endDate}
                          onChange={(e) => handleExperienceChange(index, 'endDate', e.target.value)}
                          disabled={!editing || exp.currentlyWorking}
                        />
                      </div>
                      <div className="col-md-6 d-flex align-items-center">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id={`exp-current-${index}`}
                            checked={exp.currentlyWorking}
                            onChange={(e) =>
                              handleExperienceChange(index, 'currentlyWorking', e.target.checked)
                            }
                            disabled={!editing}
                          />
                          <label className="form-check-label small" htmlFor={`exp-current-${index}`}>
                            I currently work here
                          </label>
                        </div>
                      </div>
                      <div className="col-12">
                        <textarea
                          className="form-control form-control-sm"
                          rows="2"
                          placeholder="Description of responsibilities and achievements"
                          value={exp.description}
                          onChange={(e) => handleExperienceChange(index, 'description', e.target.value)}
                          disabled={!editing}
                        />
                      </div>
                      {editing && (
                        <div className="col-12 text-end">
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => removeExperience(index)}
                          >
                            <Trash2 size={13} className="me-1" /> Remove
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Education */}
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-header bg-white d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center gap-2">
              <GraduationCap size={18} className="text-primary" />
              <h6 className="fw-semibold mb-0">Education</h6>
            </div>
            {editing && (
              <button type="button" className="btn btn-sm btn-outline-primary" onClick={addEducation}>
                <Plus size={14} className="me-1" /> Add Education
              </button>
            )}
          </div>
          <div className="card-body">
            {form.educations.length === 0 ? (
              <p className="text-muted small mb-0">No education added yet.</p>
            ) : (
              <div className="d-flex flex-column gap-3">
                {form.educations.map((edu, index) => (
                  <div className="cl-sub-card p-3 rounded-3" key={index}>
                    <div className="row g-2">
                      <div className="col-md-6">
                        <input
                          className="form-control form-control-sm"
                          placeholder="Institution"
                          value={edu.institution}
                          onChange={(e) => handleEducationChange(index, 'institution', e.target.value)}
                          disabled={!editing}
                        />
                      </div>
                      <div className="col-md-6">
                        <input
                          className="form-control form-control-sm"
                          placeholder="Degree"
                          value={edu.degree}
                          onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                          disabled={!editing}
                        />
                      </div>
                      <div className="col-md-4">
                        <input
                          className="form-control form-control-sm"
                          placeholder="Field of Study"
                          value={edu.fieldOfStudy}
                          onChange={(e) => handleEducationChange(index, 'fieldOfStudy', e.target.value)}
                          disabled={!editing}
                        />
                      </div>
                      <div className="col-md-2">
                        <input
                          className="form-control form-control-sm"
                          placeholder="Start Year"
                          value={edu.startYear}
                          onChange={(e) => handleEducationChange(index, 'startYear', e.target.value)}
                          disabled={!editing}
                        />
                      </div>
                      <div className="col-md-2">
                        <input
                          className="form-control form-control-sm"
                          placeholder="End Year"
                          value={edu.endYear}
                          onChange={(e) => handleEducationChange(index, 'endYear', e.target.value)}
                          disabled={!editing}
                        />
                      </div>
                      <div className="col-md-4 d-flex align-items-center gap-2">
                        <input
                          className="form-control form-control-sm"
                          placeholder="Grade / CGPA"
                          value={edu.grade}
                          onChange={(e) => handleEducationChange(index, 'grade', e.target.value)}
                          disabled={!editing}
                        />
                        {editing && (
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => removeEducation(index)}
                            aria-label="Remove education"
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Resume */}
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-header bg-white d-flex align-items-center gap-2">
            <Link2 size={18} className="text-primary" />
            <h6 className="fw-semibold mb-0">Resume & Links</h6>
          </div>
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label fw-semibold">Resume URL</label>
                <input
                  type="url"
                  name="resumeUrl"
                  className={`form-control ${formErrors.resumeUrl ? 'is-invalid' : ''}`}
                  placeholder="https://example.com/resume.pdf"
                  value={form.resumeUrl}
                  onChange={handleChange}
                  disabled={!editing}
                />
                {formErrors.resumeUrl && <div className="invalid-feedback">{formErrors.resumeUrl}</div>}
                {!editing && profile?.resumeUrl && (
                  <a
                    href={profile.resumeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-sm btn-outline-primary mt-2"
                  >
                    <ExternalLink size={14} className="me-1" /> View Resume
                  </a>
                )}
              </div>
              <div className="col-md-6">
                <label className="form-label fw-semibold">Resume Text</label>
                <textarea
                  name="resumeText"
                  rows="3"
                  className="form-control"
                  placeholder="Paste a plain-text version of your resume (optional)"
                  value={form.resumeText}
                  onChange={handleChange}
                  disabled={!editing}
                />
              </div>
              <div className="col-md-4">
                <label className="form-label fw-semibold">GitHub</label>
                <input
                  type="url"
                  name="githubUrl"
                  className="form-control"
                  placeholder="https://github.com/username"
                  value={form.githubUrl}
                  onChange={handleChange}
                  disabled={!editing}
                />
              </div>
              <div className="col-md-4">
                <label className="form-label fw-semibold">LinkedIn</label>
                <input
                  type="url"
                  name="linkedinUrl"
                  className="form-control"
                  placeholder="https://linkedin.com/in/username"
                  value={form.linkedinUrl}
                  onChange={handleChange}
                  disabled={!editing}
                />
              </div>
              <div className="col-md-4">
                <label className="form-label fw-semibold">Portfolio</label>
                <input
                  type="url"
                  name="portfolioUrl"
                  className="form-control"
                  placeholder="https://yourportfolio.com"
                  value={form.portfolioUrl}
                  onChange={handleChange}
                  disabled={!editing}
                />
              </div>
            </div>
          </div>
        </div>

        {editing && (
          <div className="d-flex gap-2 mb-5">
            <button type="submit" className="btn btn-primary px-4" disabled={saving}>
              {saving ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={16} className="me-2" />
                  Save Changes
                </>
              )}
            </button>
            <button
              type="button"
              className="btn btn-outline-secondary px-4"
              onClick={() => {
                setEditing(false);
                loadProfile();
              }}
              disabled={saving}
            >
              Cancel
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default MyProfile;
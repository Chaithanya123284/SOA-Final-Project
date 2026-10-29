import { useState } from 'react';
import { EMPLOYMENT_TYPES, JOB_STATUSES } from '../utils/constants';
import { employmentTypeLabel, jobStatusLabel } from '../utils/formatters';

/**
 * Reusable job posting form — used by CreateJob and EditJob.
 * Controlled component; parent supplies initial values and submit handler.
 */
const JobForm = ({ initialValues = {}, onSubmit, submitLabel = 'Publish Job', submitting = false, onCancel = null }) => {
  const [form, setForm] = useState({
    title: initialValues.title || '',
    company: initialValues.company || '',
    location: initialValues.location || '',
    employmentType: initialValues.employmentType || 'FULL_TIME',
    description: initialValues.description || '',
    requirements: initialValues.requirements || '',
    minSalary: initialValues.minSalary ?? '',
    maxSalary: initialValues.maxSalary ?? '',
    currency: initialValues.currency || 'USD',
    experienceRequiredYears: initialValues.experienceRequiredYears ?? '',
    requiredSkills: Array.isArray(initialValues.requiredSkills)
      ? initialValues.requiredSkills.join(', ')
      : initialValues.requiredSkills || '',
    status: initialValues.status || 'OPEN',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const nextErrors = {};
    if (!form.title.trim()) nextErrors.title = 'Job title is required.';
    if (!form.company.trim()) nextErrors.company = 'Company name is required.';
    if (!form.location.trim()) nextErrors.location = 'Location is required.';
    if (!form.employmentType) nextErrors.employmentType = 'Employment type is required.';
    if (!form.description.trim()) nextErrors.description = 'Job description is required.';
    if (form.minSalary !== '' && Number(form.minSalary) < 0) nextErrors.minSalary = 'Salary cannot be negative.';
    if (form.maxSalary !== '' && Number(form.maxSalary) < 0) nextErrors.maxSalary = 'Salary cannot be negative.';
    if (
      form.minSalary !== '' &&
      form.maxSalary !== '' &&
      Number(form.maxSalary) < Number(form.minSalary)
    ) {
      nextErrors.maxSalary = 'Maximum salary must be greater than minimum salary.';
    }
    if (form.experienceRequiredYears !== '' && Number(form.experienceRequiredYears) < 0) {
      nextErrors.experienceRequiredYears = 'Experience cannot be negative.';
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      title: form.title.trim(),
      company: form.company.trim(),
      location: form.location.trim(),
      employmentType: form.employmentType,
      description: form.description.trim(),
      requirements: form.requirements.trim(),
      minSalary: form.minSalary === '' ? null : Number(form.minSalary),
      maxSalary: form.maxSalary === '' ? null : Number(form.maxSalary),
      currency: form.currency || 'USD',
      experienceRequiredYears:
        form.experienceRequiredYears === '' ? null : Number(form.experienceRequiredYears),
      requiredSkills: form.requiredSkills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      status: form.status,
    };
    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="row g-3">
        <div className="col-md-8">
          <label className="form-label fw-semibold">Job Title *</label>
          <input
            type="text"
            name="title"
            className={`form-control ${errors.title ? 'is-invalid' : ''}`}
            placeholder="e.g. Java Spring Boot Developer"
            value={form.title}
            onChange={handleChange}
          />
          {errors.title && <div className="invalid-feedback">{errors.title}</div>}
        </div>
        <div className="col-md-4">
          <label className="form-label fw-semibold">Employment Type *</label>
          <select
            name="employmentType"
            className={`form-select ${errors.employmentType ? 'is-invalid' : ''}`}
            value={form.employmentType}
            onChange={handleChange}
          >
            {EMPLOYMENT_TYPES.map((type) => (
              <option key={type} value={type}>
                {employmentTypeLabel(type)}
              </option>
            ))}
          </select>
          {errors.employmentType && <div className="invalid-feedback">{errors.employmentType}</div>}
        </div>

        <div className="col-md-6">
          <label className="form-label fw-semibold">Company *</label>
          <input
            type="text"
            name="company"
            className={`form-control ${errors.company ? 'is-invalid' : ''}`}
            placeholder="e.g. CareerLink Networks"
            value={form.company}
            onChange={handleChange}
          />
          {errors.company && <div className="invalid-feedback">{errors.company}</div>}
        </div>
        <div className="col-md-6">
          <label className="form-label fw-semibold">Location *</label>
          <input
            type="text"
            name="location"
            className={`form-control ${errors.location ? 'is-invalid' : ''}`}
            placeholder="e.g. Hyderabad"
            value={form.location}
            onChange={handleChange}
          />
          {errors.location && <div className="invalid-feedback">{errors.location}</div>}
        </div>

        <div className="col-12">
          <label className="form-label fw-semibold">Job Description *</label>
          <textarea
            name="description"
            rows="5"
            className={`form-control ${errors.description ? 'is-invalid' : ''}`}
            placeholder="Describe the role, responsibilities and what success looks like..."
            value={form.description}
            onChange={handleChange}
          />
          {errors.description && <div className="invalid-feedback">{errors.description}</div>}
        </div>

        <div className="col-12">
          <label className="form-label fw-semibold">Requirements</label>
          <textarea
            name="requirements"
            rows="3"
            className="form-control"
            placeholder="Qualifications, experience expectations, education..."
            value={form.requirements}
            onChange={handleChange}
          />
        </div>

        <div className="col-md-4">
          <label className="form-label fw-semibold">Min Salary</label>
          <input
            type="number"
            name="minSalary"
            min="0"
            className={`form-control ${errors.minSalary ? 'is-invalid' : ''}`}
            placeholder="e.g. 60000"
            value={form.minSalary}
            onChange={handleChange}
          />
          {errors.minSalary && <div className="invalid-feedback">{errors.minSalary}</div>}
        </div>
        <div className="col-md-4">
          <label className="form-label fw-semibold">Max Salary</label>
          <input
            type="number"
            name="maxSalary"
            min="0"
            className={`form-control ${errors.maxSalary ? 'is-invalid' : ''}`}
            placeholder="e.g. 90000"
            value={form.maxSalary}
            onChange={handleChange}
          />
          {errors.maxSalary && <div className="invalid-feedback">{errors.maxSalary}</div>}
        </div>
        <div className="col-md-4">
          <label className="form-label fw-semibold">Currency</label>
          <select name="currency" className="form-select" value={form.currency} onChange={handleChange}>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
            <option value="INR">INR</option>
            <option value="AUD">AUD</option>
          </select>
        </div>

        <div className="col-md-6">
          <label className="form-label fw-semibold">Required Skills</label>
          <input
            type="text"
            name="requiredSkills"
            className="form-control"
            placeholder="Comma separated, e.g. Java, Spring Boot, MySQL"
            value={form.requiredSkills}
            onChange={handleChange}
          />
          <div className="form-text">Separate multiple skills with commas.</div>
        </div>
        <div className="col-md-3">
          <label className="form-label fw-semibold">Experience (years)</label>
          <input
            type="number"
            name="experienceRequiredYears"
            min="0"
            className={`form-control ${errors.experienceRequiredYears ? 'is-invalid' : ''}`}
            placeholder="e.g. 3"
            value={form.experienceRequiredYears}
            onChange={handleChange}
          />
          {errors.experienceRequiredYears && (
            <div className="invalid-feedback">{errors.experienceRequiredYears}</div>
          )}
        </div>
        <div className="col-md-3">
          <label className="form-label fw-semibold">Status</label>
          <select name="status" className="form-select" value={form.status} onChange={handleChange}>
            {JOB_STATUSES.map((status) => (
              <option key={status} value={status}>
                {jobStatusLabel(status)}
              </option>
            ))}
          </select>
        </div>

        <div className="col-12 d-flex gap-2 pt-2">
          <button type="submit" className="btn btn-primary px-4" disabled={submitting}>
            {submitting ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                Saving...
              </>
            ) : (
              submitLabel
            )}
          </button>
          {onCancel && (
            <button type="button" className="btn btn-outline-secondary px-4" onClick={onCancel} disabled={submitting}>
              Cancel
            </button>
          )}
        </div>
      </div>
    </form>
  );
};

export default JobForm;
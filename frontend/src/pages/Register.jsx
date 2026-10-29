import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../utils/errorHandler';
import { Briefcase, Mail, Lock, User, Building2, Phone } from 'lucide-react';

/**
 * Registration page — creates a CANDIDATE or RECRUITER account.
 */
const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'CANDIDATE',
    phoneNumber: '',
    companyName: '',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const nextErrors = {};
    if (!form.fullName.trim()) nextErrors.fullName = 'Full name is required.';
    else if (form.fullName.trim().length < 2) nextErrors.fullName = 'Name must be at least 2 characters.';
    if (!form.email.trim()) nextErrors.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) nextErrors.email = 'Enter a valid email address.';
    if (!form.password) nextErrors.password = 'Password is required.';
    else if (form.password.length < 6) nextErrors.password = 'Password must be at least 6 characters.';
    if (form.confirmPassword !== form.password) nextErrors.confirmPassword = 'Passwords do not match.';
    if (!form.role) nextErrors.role = 'Please select a role.';
    if (form.role === 'RECRUITER' && !form.companyName.trim()) {
      nextErrors.companyName = 'Company name is required for recruiters.';
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const payload = {
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        password: form.password,
        role: form.role,
        phoneNumber: form.phoneNumber.trim() || undefined,
        companyName: form.role === 'RECRUITER' ? form.companyName.trim() : undefined,
      };
      await register(payload);
      toast.success('Registration successful! Please sign in to continue.');
      navigate('/login');
    } catch (error) {
      toast.error(getErrorMessage(error, 'Registration failed. Please try again.'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="cl-auth-page d-flex align-items-center justify-content-center py-5">
      <div className="cl-auth-card card border-0 shadow-sm w-100">
        <div className="card-body p-4 p-md-5">
          <div className="text-center mb-4">
            <div className="cl-auth-logo mx-auto mb-3">
              <Briefcase size={26} />
            </div>
            <h4 className="fw-bold mb-1">Create your account</h4>
            <p className="text-muted small mb-0">Join CareerLink as a job seeker or recruiter</p>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-3">
              <label className="form-label fw-semibold">Full Name *</label>
              <div className="input-group">
                <span className="input-group-text bg-white">
                  <User size={16} className="text-muted" />
                </span>
                <input
                  type="text"
                  name="fullName"
                  className={`form-control ${errors.fullName ? 'is-invalid' : ''}`}
                  placeholder="e.g. John Doe"
                  value={form.fullName}
                  onChange={handleChange}
                />
                {errors.fullName && <div className="invalid-feedback">{errors.fullName}</div>}
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Email *</label>
              <div className="input-group">
                <span className="input-group-text bg-white">
                  <Mail size={16} className="text-muted" />
                </span>
                <input
                  type="email"
                  name="email"
                  className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                  placeholder="you@company.com"
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="email"
                />
                {errors.email && <div className="invalid-feedback">{errors.email}</div>}
              </div>
            </div>

            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <label className="form-label fw-semibold">Password *</label>
                <div className="input-group">
                  <span className="input-group-text bg-white">
                    <Lock size={16} className="text-muted" />
                  </span>
                  <input
                    type="password"
                    name="password"
                    className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                    placeholder="Min 6 characters"
                    value={form.password}
                    onChange={handleChange}
                    autoComplete="new-password"
                  />
                  {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                </div>
              </div>
              <div className="col-md-6">
                <label className="form-label fw-semibold">Confirm Password *</label>
                <div className="input-group">
                  <span className="input-group-text bg-white">
                    <Lock size={16} className="text-muted" />
                  </span>
                  <input
                    type="password"
                    name="confirmPassword"
                    className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                    placeholder="Re-enter password"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    autoComplete="new-password"
                  />
                  {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
                </div>
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">I am a *</label>
              <div className="d-flex gap-2">
                <button
                  type="button"
                  className={`btn flex-fill ${form.role === 'CANDIDATE' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => {
                    setForm((prev) => ({ ...prev, role: 'CANDIDATE' }));
                    setErrors((prev) => ({ ...prev, role: '' }));
                  }}
                >
                  Job Seeker
                </button>
                <button
                  type="button"
                  className={`btn flex-fill ${form.role === 'RECRUITER' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => {
                    setForm((prev) => ({ ...prev, role: 'RECRUITER' }));
                    setErrors((prev) => ({ ...prev, role: '' }));
                  }}
                >
                  Recruiter
                </button>
              </div>
              {errors.role && <div className="text-danger small mt-1">{errors.role}</div>}
            </div>

            {form.role === 'RECRUITER' && (
              <div className="mb-3">
                <label className="form-label fw-semibold">Company Name *</label>
                <div className="input-group">
                  <span className="input-group-text bg-white">
                    <Building2 size={16} className="text-muted" />
                  </span>
                  <input
                    type="text"
                    name="companyName"
                    className={`form-control ${errors.companyName ? 'is-invalid' : ''}`}
                    placeholder="e.g. CareerLink Networks"
                    value={form.companyName}
                    onChange={handleChange}
                  />
                  {errors.companyName && <div className="invalid-feedback">{errors.companyName}</div>}
                </div>
              </div>
            )}

            <div className="mb-4">
              <label className="form-label fw-semibold">Phone Number (optional)</label>
              <div className="input-group">
                <span className="input-group-text bg-white">
                  <Phone size={16} className="text-muted" />
                </span>
                <input
                  type="tel"
                  name="phoneNumber"
                  className="form-control"
                  placeholder="+91 98765 43210"
                  value={form.phoneNumber}
                  onChange={handleChange}
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-100 py-2 fw-semibold" disabled={submitting}>
              {submitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <div className="text-center mt-4">
            <span className="text-muted small">Already have an account? </span>
            <Link to="/login" className="small fw-semibold text-primary">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
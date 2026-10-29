import { useState } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { Building2, Mail, Phone, User, Save } from 'lucide-react';

/**
 * Recruiter Profile — displays recruiter account details.
 * (Recruiter profiles are stored in the Auth service; the Profile service is
 * for candidate profiles, so this page shows account info read-only.)
 */
const RecruiterProfile = () => {
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaving(true);
    // Account details (name/email/company) are managed by the Auth service.
    // This is a read-only summary for recruiters.
    setTimeout(() => {
      setSaving(false);
      toast.success('Profile information is up to date.');
    }, 400);
  };

  return (
    <div className="container py-4">
      <h4 className="fw-bold mb-1">Recruiter Profile</h4>
      <p className="text-muted small mb-4">Your account and company information.</p>

      <div className="row g-4">
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm text-center">
            <div className="card-body p-4">
              <span className="cl-avatar cl-avatar-xl bg-primary text-white mx-auto mb-3">
                {(user?.fullName || 'R').charAt(0).toUpperCase()}
              </span>
              <h5 className="fw-bold mb-0">{user?.fullName}</h5>
              <span className="badge bg-primary-subtle text-primary mt-2">Recruiter</span>
              {user?.companyName && (
                <div className="text-muted small mt-2 d-flex align-items-center justify-content-center gap-1">
                  <Building2 size={14} /> {user.companyName}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-lg-8">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white">
              <h6 className="fw-semibold mb-0">Account Information</h6>
            </div>
            <div className="card-body p-4">
              <form onSubmit={handleSave}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Full Name</label>
                    <div className="input-group">
                      <span className="input-group-text bg-white"><User size={15} className="text-muted" /></span>
                      <input className="form-control" value={user?.fullName || ''} readOnly />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Email</label>
                    <div className="input-group">
                      <span className="input-group-text bg-white"><Mail size={15} className="text-muted" /></span>
                      <input className="form-control" value={user?.email || ''} readOnly />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Company</label>
                    <div className="input-group">
                      <span className="input-group-text bg-white"><Building2 size={15} className="text-muted" /></span>
                      <input className="form-control" value={user?.companyName || '—'} readOnly />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Role</label>
                    <div className="input-group">
                      <span className="input-group-text bg-white"><Phone size={15} className="text-muted" /></span>
                      <input className="form-control" value="Recruiter" readOnly />
                    </div>
                  </div>
                </div>

                <div className="alert alert-light border mt-4 mb-0 small">
                  Account details such as name, email and company are managed by the authentication
                  service. Contact your administrator to update them.
                </div>

                <button type="submit" className="btn btn-primary mt-3" disabled={saving}>
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
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruiterProfile;
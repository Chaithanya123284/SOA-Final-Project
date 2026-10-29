import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

/**
 * Access denied page — shown when a user hits a route for the wrong role.
 */
const AccessDenied = () => {
  const { isRecruiter } = useAuth();

  return (
    <div className="d-flex flex-column align-items-center justify-content-center text-center py-5 min-vh-50">
      <div className="cl-access-icon mb-3">
        <ShieldAlert size={40} />
      </div>
      <h4 className="fw-bold mb-2">Access Denied</h4>
      <p className="text-muted mb-4">
        You don't have permission to view this page. You'll be redirected to your dashboard.
      </p>
      <Link
        to={isRecruiter ? '/recruiter/dashboard' : '/dashboard'}
        className="btn btn-primary"
      >
        Go to My Dashboard
      </Link>
    </div>
  );
};

export default AccessDenied;
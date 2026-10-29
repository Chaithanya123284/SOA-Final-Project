import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';

/**
 * 404 page.
 */
const NotFound = () => {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center text-center py-5 min-vh-50">
      <div className="cl-404-code fw-bold text-primary mb-2">404</div>
      <h4 className="fw-bold mb-2">Page not found</h4>
      <p className="text-muted mb-4">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <div className="d-flex gap-2">
        <Link to="/" className="btn btn-primary">
          <Compass size={16} className="me-2" />
          Back to Home
        </Link>
        <Link to="/jobs" className="btn btn-outline-primary">
          Browse Jobs
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
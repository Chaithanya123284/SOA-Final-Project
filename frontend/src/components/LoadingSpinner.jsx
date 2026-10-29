import { Loader2 } from 'lucide-react';

/**
 * Reusable loading state with an optional label.
 */
const LoadingSpinner = ({ label = 'Loading...', centered = true, size = 'md' }) => {
  const spinnerSize = size === 'lg' ? '3rem' : size === 'sm' ? '1.25rem' : '2rem';

  return (
    <div
      className={`d-flex flex-column align-items-center justify-content-center gap-2 py-5 ${
        centered ? 'w-100' : ''
      }`}
      role="status"
      aria-live="polite"
    >
      <Loader2 className="text-primary spinner-animate" style={{ width: spinnerSize, height: spinnerSize }} />
      <span className="text-muted small fw-medium">{label}</span>
    </div>
  );
};

export default LoadingSpinner;
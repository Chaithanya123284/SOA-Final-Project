import { Inbox } from 'lucide-react';

/**
 * Reusable empty state for lists/tables with no data.
 */
const EmptyState = ({ title = 'Nothing here yet', message = '', action = null }) => {
  return (
    <div className="empty-state text-center py-5">
      <div className="empty-state-icon mx-auto mb-3">
        <Inbox size={32} />
      </div>
      <h5 className="fw-semibold text-dark mb-1">{title}</h5>
      {message && <p className="text-muted mb-3 mx-auto empty-state-message">{message}</p>}
      {action && <div>{action}</div>}
    </div>
  );
};

export default EmptyState;
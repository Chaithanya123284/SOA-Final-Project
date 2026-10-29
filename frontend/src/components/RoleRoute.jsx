import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProtectedRoute from './ProtectedRoute';

/**
 * RoleRoute — blocks users whose role does not match the required role.
 * - Unauthenticated -> /login
 * - Wrong role       -> /access-denied
 */
const RoleRoute = ({ role, children }) => {
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      {user?.role === role ? children : <Navigate to="/access-denied" replace />}
    </ProtectedRoute>
  );
};

export default RoleRoute;
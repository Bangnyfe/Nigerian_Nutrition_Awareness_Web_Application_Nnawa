import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import LoadingSpinner from './LoadingSpinner.jsx';

function ProtectedRoute({ children }) {
  const { isAuthenticated, isAuthLoading } = useAuth();

  // Waiting for the startup check avoids a brief redirect to the login page
  // for an administrator who is in fact already authenticated.
  if (isAuthLoading) {
    return <LoadingSpinner message="Checking access…" />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}
export default ProtectedRoute;

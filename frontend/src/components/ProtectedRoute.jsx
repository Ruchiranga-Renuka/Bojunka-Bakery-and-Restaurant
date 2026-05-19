import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, adminOnly = false, userOnly = false }) {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return <p className="loading-msg">Loading…</p>;
  }

  if (!isAuthenticated) {
    return <Navigate to={adminOnly ? '/login/admin' : '/login/user'} replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/menu" replace />;
  }

  if (userOnly && isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  return children;
}

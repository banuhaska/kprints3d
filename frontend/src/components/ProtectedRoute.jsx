import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({
  children,
  allowGuest = false,
  requireAdmin = false,
}) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="page-centered">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (requireAdmin && user.role !== 'admin') {
    return <Navigate to="/catalog" replace />;
  }

  if (!allowGuest && user.role === 'guest') {
    return <Navigate to="/" replace />;
  }

  return children;
}


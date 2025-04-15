import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// This hasn't been fully implemented yet

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />; 
  }

  return children;
};

export default ProtectedRoute;

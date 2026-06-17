import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom'; 
import { AuthContext } from '../../context/AuthContext/AuthContext';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useContext(AuthContext);

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  // If not logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Admin-only routes check
  if (adminOnly) {
    // Check if user is admin
    const role = user.role || localStorage.getItem('role');
    if (role !== 'admin') {
      return <Navigate to="/forbidden" replace />;
    }

    // Check if admin verification (OTP) is done
    const adminVerified = localStorage.getItem('adminVerified') === 'true';
    if (!adminVerified) {
      return <Navigate to="/admin-verification" replace />;
    }
  }

  // If children are provided (for custom components), render them
  // Otherwise, render the outlet for nested routes
  return children ? children : <Outlet />;
};

export default ProtectedRoute;
import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext/AuthContext';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useContext(AuthContext);

  console.log('ProtectedRoute:', { user, loading, adminOnly, path: window.location.pathname });

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

  if (!user) {
    console.log('No user, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  if (adminOnly) {
    const role = user.role || localStorage.getItem('role');
    console.log('Admin check - role:', role);

    if (role !== 'admin') {
      console.log('Not admin, redirecting to forbidden');
      return <Navigate to="/forbidden" replace />;
    }

    const adminVerified = localStorage.getItem('adminVerified') === 'true';
    console.log('Admin verified:', adminVerified);

    if (!adminVerified) {
      console.log('Not verified, redirecting to admin-verification');
      return <Navigate to="/admin-verification" replace />;
    }
  }

  console.log('Rendering outlet/children');
  return children ? children : <Outlet />;
};

export default ProtectedRoute;
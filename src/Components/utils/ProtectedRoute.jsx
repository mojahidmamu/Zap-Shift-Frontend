import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom'; 
import { AuthContext } from '../../context/AuthContext/AuthContext';

const ProtectedRoute = () => {
    const { user, loading } = useContext(AuthContext);

    if (loading) {
        return <div className="text-center py-10">Loading...</div>;
    }

    return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
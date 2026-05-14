import React from 'react';
import useAuth from '../../../hook/useAuth';
import { Navigate } from 'react-router';

const PrivateRoute = ({children}) => {
    const {user, loading} = useAuth();

    if (loading) {
        // Optional: show a loading spinner while checking auth
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }
  
    return user ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
import React from 'react';
import useAuth from '../../hook/useAuth';
import useRole from '../../hook/useRole';
import ForBidden from '../../Dashboard/ForBidden/ForBidden';

const AdminRoute = ({children}) => {
    const {user} = useAuth();
    const {role, roleLoading} = useRole();

    if ( roleLoading) {
        return <div className="text-center py-10">Loading...</div>;
    }

    if (role !== 'admin') {
        return  <ForBidden></ForBidden>;
    }

    return  children;
};

export default AdminRoute;
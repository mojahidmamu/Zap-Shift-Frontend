import { useQuery } from '@tanstack/react-query';
import React from 'react';
import useAuth from './useAuth';

const useRole = () => {
    const {user} = useAuth();
    const token = localStorage.getItem('token');

    const {isLoading ,  data: role = 'user'} = useQuery({
        queryKey: ['users', user?.email],
        queryFn: async () => {
            const res = await fetch(`http://localhost:5000/users/${user?.email}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            const currentUser = data.find(u => u.email === user?.email);
            return currentUser?.role || 'user';
        }
    });

    return { role, isLoading };
};

export default useRole;
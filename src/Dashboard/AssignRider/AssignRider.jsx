import { useQuery } from '@tanstack/react-query';
import React from 'react';

const AssignRider = () => {

    // Fetch users
        const { data: percels = []  } = useQuery({
            queryKey: ['percels', 'pending-pickup'],
            queryFn: async () => {
                const res = await axios.get('http://localhost:5000/users', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                return res.data;
            }
        });
    


    return (
        <div>
            <h1>Asign Rider.. {percels.length}</h1>
        </div>
    );
};

export default AssignRider;
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';
import toast from 'react-hot-toast'; // ✅ add this line

const UserManagement = () => {
    const queryClient = useQueryClient();
    const [selectedUser, setSelectedUser] = useState(null);
    const token = localStorage.getItem('token');

    // Fetch users
    const { data: users = [], isLoading, error } = useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            const res = await axios.get('http://localhost:5000/users', {
                headers: { Authorization: `Bearer ${token}` }
            });
            return res.data;
        }
    });

    // Mutation to update user role
    const updateRoleMutation = useMutation({
        mutationFn: async ({ userId, role }) => {
            const token = localStorage.getItem('token'); // get fresh token each time
            const res = await axios.put(
                `http://localhost:5000/users/${userId}/role`,
                { role },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['users']);
            toast.success('Role updated successfully!');
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to update role');
        }
    });

    const handleMakeAdmin = (user) => {
        Swal.fire({
            title: 'Make Admin?',
            text: `Are you sure you want to make ${user.displayName || user.email} an admin?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, make admin!'
        }).then((result) => {
            if (result.isConfirmed) {
                updateRoleMutation.mutate({ userId: user._id, role: 'admin' });
            }
        });
    };

    const handleRemoveAdmin = (user) => {
        Swal.fire({
            title: 'Remove Admin?',
            text: `Are you sure you want to remove admin privileges from ${user.displayName || user.email}?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, remove admin!'
        }).then((result) => {
            if (result.isConfirmed) {
                updateRoleMutation.mutate({ userId: user._id, role: 'user' });
            }
        });
    };

    if (isLoading) return <p className="text-center mt-10">Loading...</p>;
    if (error) return <p className="text-center text-red-500">{error.message}</p>;

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold text-center mb-6">
                User Management ({users.length})
            </h1>

            <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Photo</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, index) => (
                            <tr key={user._id}>
                                <td>{index + 1}</td>
                                <td>
                                    <div className="avatar">
                                        <div className="w-10 rounded-full">
                                            <img src={user.photoURL || '/default-avatar.png'} alt={user.displayName} />
                                        </div>
                                    </div>
                                </td>
                                <td>{user.displayName || 'N/A'}</td>
                                <td>{user.email}</td>
                                <td>
                                    <span className={`badge ${user.role === 'admin' ? 'badge-primary' : 'badge-ghost'}`}>
                                        {user.role || 'user'}
                                    </span>
                                </td>
                                <td>
                                    {user.role === 'admin' ? (
                                        <button
                                            onClick={() => handleRemoveAdmin(user)}
                                            className="btn btn-warning btn-sm"
                                            disabled={updateRoleMutation.isLoading}
                                        >
                                            Remove Admin
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => handleMakeAdmin(user)}
                                            className="btn btn-success btn-sm"
                                            disabled={updateRoleMutation.isLoading}
                                        >
                                            Make Admin
                                        </button>
                                    )}
                                    <button
                                        onClick={() => setSelectedUser(user)}
                                        className="btn btn-secondary btn-sm ml-2"
                                    >
                                        Details
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* User Details Modal */}
            {selectedUser && (
                <dialog id="user_modal" className="modal modal-open">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg text-center mb-4">User Details</h3>
                        <div className="flex flex-col items-center">
                            <img
                                src={selectedUser.photoURL || '/default-avatar.png'}
                                className="w-24 rounded-full mb-3"
                                alt=""
                            />
                            <p><strong>Name:</strong> {selectedUser.displayName || 'N/A'}</p>
                            <p><strong>Email:</strong> {selectedUser.email}</p>
                            <p><strong>Role:</strong> {selectedUser.role || 'user'}</p>
                            <p><strong>Joined:</strong> {new Date(selectedUser.createdAt).toLocaleString()}</p>
                        </div>
                        <div className="modal-action">
                            <button className="btn btn-accent" onClick={() => setSelectedUser(null)}>Close</button>
                        </div>
                    </div>
                </dialog>
            )}
        </div>
    );
};

export default UserManagement;
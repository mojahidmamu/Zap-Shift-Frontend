import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

const UserManagement = () => {

    const [selectedUser, setSelectedUser] = useState(null);

    const { data: users = [], isLoading, error } = useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            const res = await fetch('http://localhost:5000/users');
            if (!res.ok) {
                throw new Error('Network response was not ok');
            }
            return res.json();
        }
    });

    if (isLoading) return <p className="text-center mt-10">Loading...</p>;
    if (error) return <p className="text-center text-red-500">{error.message}</p>;

    return (
        <div className="p-6">

            <h1 className="text-3xl font-bold text-center mb-6">
                User Management ({users.length})
            </h1>

            {/* ✅ Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

                {users.map(user => (
                    <div key={user._id} className="card bg-base-100 shadow-xl border">

                        <div className="card-body">

                            {/* Image */}
                            <div className="flex justify-center">
                                <div className="avatar">
                                    <div className="w-16 rounded-full">
                                        <img src={user.photoURL} alt="user" />
                                    </div>
                                </div>
                            </div>

                            <h2 className="text-center font-semibold mt-2  ">
                                {user.displayName}
                            </h2>

                            <div className="text-center">
                                <span className="badge badge-outline">
                                    {user.role}
                                </span>
                            </div>

                            {/* ✅ Details Button */}
                            <div className="card-actions justify-center mt-2">
                                <button
                                    className="btn btn-secondary btn-sm p-2 border font-bold"
                                    onClick={() => setSelectedUser(user)}
                                >
                                    Details
                                </button>
                            </div>

                        </div>
                    </div>
                ))}

            </div>

            {/* ✅ Modal */}
            {
                selectedUser && (
                    <dialog id="user_modal" className="modal modal-open">
                        <div className="modal-box">

                            <h3 className="font-bold text-lg text-center mb-4">
                                User Details
                            </h3>

                            <div className="flex flex-col items-center">

                                <img
                                    src={selectedUser.photoURL}
                                    className="w-24 rounded-full mb-3"
                                    alt=""
                                />

                                <p><strong>Name:</strong> {selectedUser.displayName}</p>
                                <p><strong>Email:</strong> {selectedUser.email}</p>
                                <p><strong>Role:</strong> {selectedUser.role}</p>
                                <p>
                                    <strong>Joined:</strong>{" "}
                                    {new Date(selectedUser.createdAt).toLocaleString()}
                                </p>
                            </div>

                            {/* Close Button */}
                            <div className="modal-action">
                                <button
                                    className="btn btn-accent p-2 border font-bold"
                                    onClick={() => setSelectedUser(null)}
                                >
                                    Close
                                </button>
                            </div>

                        </div>
                    </dialog>
                )
            }

        </div>
    );
};

export default UserManagement;
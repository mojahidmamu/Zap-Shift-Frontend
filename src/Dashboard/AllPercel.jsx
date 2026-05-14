// src/Dashboard/Overview.jsx
import React, { useContext } from 'react';
import { useQuery,  useMutation, useQueryClient  } from '@tanstack/react-query'; 
import { Package,  TrendingUp, DollarSign, Clock, Eye, Edit, Trash2 } from 'lucide-react'; 
import { AuthContext } from '../context/AuthContext/AuthContext';
import { getParcels, deleteParcel } from '../services/api';    
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { toast } from 'react-hot-toast';

const AllPercel = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    // Fetch all parcels
    const { data: allParcels = [], isLoading, error } = useQuery({
        queryKey: ['parcels'],
        queryFn: getParcels,
    });

    // Filter parcels for the logged-in user
    const parcels = allParcels.filter(p => p.userEmail === user?.email);

    // Statistics
    const totalParcels = parcels.length;
    const deliveredCount = parcels.filter(p => p.status === 'delivered').length;
    const pendingCount = parcels.filter(p => p.status === 'pending').length;
    const totalSpent = parcels.reduce((sum, p) => sum + (p.cost || 0), 0);

    const stats = [
        { label: 'Total Parcels', value: totalParcels, icon: Package, color: 'bg-blue-500' },
        { label: 'Delivered', value: deliveredCount, icon: TrendingUp, color: 'bg-green-500' },
        { label: 'Pending', value: pendingCount, icon: Clock, color: 'bg-yellow-500' },
        { label: 'Total Spent', value: `৳${totalSpent}`, icon: DollarSign, color: 'bg-purple-500' },
    ];

    // Delete mutation
    const deleteMutation = useMutation({
        mutationFn: deleteParcel,
        onSuccess: () => {
            queryClient.invalidateQueries(['parcels']);
            toast.success('Parcel deleted successfully');
        },
        onError: (err) => {
            toast.error('Failed to delete parcel');
            console.error(err);
        },
    });

    const handleDelete = (id, parcelName) => {
        Swal.fire({
            title: 'Are you sure?',
            text: `You are about to delete "${parcelName}"`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
        }).then((result) => {
            if (result.isConfirmed) {
                deleteMutation.mutate(id);
            }
        });
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-40">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    if (error) {
        return <div className="text-red-500">Error loading data: {error.message}</div>;
    }

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">All Parcels</h1>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, idx) => (
                    <div key={idx} className="bg-white rounded-xl shadow-md p-6 flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">{stat.label}</p>
                            <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                        </div>
                        <div className={`${stat.color} p-3 rounded-full text-white`}>
                            <stat.icon className="w-5 h-5" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Parcels Grid with Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2  gap-6">
                {parcels.length === 0 ? (
                    <div className="col-span-full text-center py-12 bg-white rounded-xl shadow">
                        <p className="text-gray-500">No parcels yet.</p>
                        <Link to="/send-parcel" className="text-purple-600 mt-2 inline-block">Send your first parcel →</Link>
                    </div>
                ) : (
                    parcels.slice(0, 6).map(parcel => (
                        <div key={parcel._id} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 relative">
                            {/* Header */}
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="font-bold text-xl truncate">
                                    {parcel.parcelType === 'document' ? parcel.documentName : parcel.parcelName}
                                </h2>
                                <span className={`badge ${parcel.status === 'delivered' ? 'badge-success' : parcel.status === 'pending' ? 'badge-warning' : 'badge-info'}`}>
                                    {parcel.payment_status === 'paid' ? (
                                        <span className="text-red-600 font-bold">Paid</span>
                                ) : (
                                    <span className="text-green-600">Unpaid</span>
                                )}
                                </span>
                            </div>

                            {/* Info */}
                            <div className="space-y-2 text-gray-600">
                                <p><strong>Type:</strong> {parcel.parcelType}</p>
                                <p><strong>Weight:</strong> {parcel.weight} KG</p>
                                <p><strong>Cost:</strong> {parcel.cost} TK</p>
                                <p><strong>Sender:</strong> {parcel.sender?.district}</p>
                                <p><strong>Receiver:</strong> {parcel.receiver?.district}</p>
                            </div>

                            {/* Footer with Buttons */}
                            <div className="mt-5 pt-4 border-t flex justify-between items-center">
                                <p className="text-sm text-gray-400">{new Date(parcel.creation_date).toLocaleString()}</p>
                                {/* Payment Button */}
                                {parcel.payment_status === 'paid' ? (
                                    <button className="p-2 text-green-600 border rounded-lg cursor-not-allowed" disabled>
                                        Paid 
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => navigate(`/dashboard/payment/${parcel._id}`)}
                                        className="p-2 text-green-600 border hover:bg-green-300 rounded-lg"
                                    >
                                        Pay Now
                                    </button>
                                )}

                                <div className="flex gap-2">
                                    {/* View Button */}
                                    <button
                                        onClick={() => navigate(`/parcels/${parcel._id}`)}
                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition"
                                        title="View Details"
                                    >
                                        <Eye size={18} />
                                    </button>
                                    {/* Edit Button */}
                                    <button
                                        onClick={() => navigate(`/parcels/edit/${parcel._id}`, { state: { parcel } })}
                                        className="p-2 text-green-600 hover:bg-green-50 rounded-full transition"
                                        title="Edit Parcel"
                                    >
                                        <Edit size={18} />
                                    </button>
                                    {/* Delete Button */}
                                    <button
                                        onClick={() => handleDelete(parcel._id, parcel.parcelType === 'document' ? parcel.documentName : parcel.parcelName)}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-full transition"
                                        title="Delete Parcel"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default AllPercel;
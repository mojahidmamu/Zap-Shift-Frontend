// src/Dashboard/Overview.jsx
import React, { useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Package, TrendingUp, DollarSign, Clock, Send, MapPin, Headphones, PlusCircle } from 'lucide-react';
import { AuthContext } from '../context/AuthContext/AuthContext';
import { getParcels } from '../services/api';
import { Link } from 'react-router-dom';

const Overview = () => {
    const { user } = useContext(AuthContext);

    // Fetch all parcels
    const { data: allParcels = [], isLoading, error } = useQuery({
        queryKey: ['parcels'],
        queryFn: getParcels,
    });

    // Filter parcels for logged-in user
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

    // Quick action cards
    const quickActions = [
        { title: 'Send New Parcel', icon: Send, link: '/send-percel', color: 'from-green-500 to-emerald-600' },
        { title: 'Track Parcel', icon: MapPin, link: '/dashboard/tracking', color: 'from-blue-500 to-cyan-600' },
        // { title: 'Request Pickup', icon: PlusCircle, link: '/dashboard/pickup', color: 'from-orange-500 to-red-600' },
        { title: 'Customer Support', icon: Headphones, link: '/contact', color: 'from-purple-500 to-pink-600' },
    ];

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
            {/* Welcome Section with User Image */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-6 text-white mb-8 shadow-lg">
                <div className="flex flex-col md:flex-row items-center gap-6">
                    {/* User Avatar */}
                    <img
                        src={user?.photoURL || `https://ui-avatars.com/api/?background=ffffff&color=6366f1&name=${(user?.displayName || user?.email || 'U').charAt(0)}`}
                        alt="Profile"
                        className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover"
                    />
                    <div className="text-center md:text-left">
                        <h1 className="text-2xl md:text-3xl font-bold">
                            Welcome back, {user?.displayName?.split(' ')[0] || user?.email?.split('@')[0] || 'User'}!
                        </h1>
                        <p className="text-purple-100 mt-1">{user?.email}</p>
                        <p className="text-purple-200 text-sm mt-2">
                            Member since {new Date(user?.metadata?.creationTime).toLocaleDateString() || 'recently'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, idx) => (
                    <div key={idx} className="bg-white rounded-xl shadow-md p-6 flex items-center justify-between hover:shadow-lg transition-shadow">
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

            {/* Quick Actions */}
            <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {quickActions.map((action, idx) => (
                        <Link
                            key={idx}
                            to={action.link}
                            className={`bg-gradient-to-r ${action.color} rounded-xl p-5 text-white hover:shadow-xl transition-all hover:scale-105`}
                        >
                            <action.icon className="w-8 h-8 mb-3" />
                            <h3 className="font-semibold text-lg">{action.title}</h3>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Recent Parcels */}
            <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-800">Recent Parcels</h2>
                    <Link to="/dashboard/parcels" className="text-purple-600 text-sm hover:underline">
                        View All →
                    </Link>
                </div>

                {parcels.length === 0 ? (
                    <div className="text-center py-12">
                        <Package className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">No parcels yet.</p>
                        <Link to="/send-parcel" className="text-purple-600 mt-2 inline-block font-medium">
                            Send your first parcel →
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {parcels.slice(0, 5).map(parcel => (
                            <div key={parcel._id} className="border rounded-lg p-4 hover:shadow-md transition">
                                <div className="flex flex-wrap justify-between items-start gap-2">
                                    <div>
                                        <h3 className="font-semibold text-gray-800">
                                            {parcel.parcelType === 'document' ? parcel.documentName : parcel.parcelName}
                                        </h3>
                                        <p className="text-sm text-gray-500">
                                            {parcel.sender?.district} → {parcel.receiver?.district}
                                        </p>
                                    </div>
                                    <span className={`badge ${parcel.status === 'delivered' ? 'badge-success' : parcel.status === 'pending' ? 'badge-warning' : 'badge-info'}`}>
                                        {parcel.payment_status === 'paid' ? (
                                            <span className="text-red-600 font-bold">Paid</span>
                                        ) : (
                                            <span className="text-green-600">Unpaid</span>
                                        )}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center mt-3 text-sm">
                                    <span className="text-gray-600">Weight: {parcel.weight} kg</span>
                                    <span className="font-semibold text-purple-600">৳{parcel.cost}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Overview;
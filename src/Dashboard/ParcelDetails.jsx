// src/Dashboard/ParcelDetails.jsx
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query'; 
import { ArrowLeft, Package, MapPin, Calendar, DollarSign, User } from 'lucide-react';
import { getParcelById } from '../services/api';

const ParcelDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const { data: parcel, isLoading, error } = useQuery({
        queryKey: ['parcel', id],
        queryFn: () => getParcelById(id),
    });

    if (isLoading) return <div className="flex justify-center items-center h-40"><span className="loading loading-spinner loading-lg"></span></div>;
    if (error) return <div className="text-red-500 text-center">Failed to load parcel details</div>;

    return (
        <div className="max-w-3xl mx-auto p-6">
            {/* Back Button */}
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-6">
                <ArrowLeft size={20} /> Back to Dashboard
            </button>

            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-white">
                    <h1 className="text-2xl font-bold">Parcel Details</h1>
                    <p className="opacity-90">Tracking ID: {parcel._id.slice(-8)}</p>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <div className="flex items-center gap-3"><Package size={20} className="text-purple-600" /><span className="font-semibold">Name:</span> {parcel.parcelType === 'document' ? parcel.documentName : parcel.parcelName}</div>
                            <div className="flex items-center gap-3"><Package size={20} className="text-purple-600" /><span className="font-semibold">Type:</span> {parcel.parcelType}</div>
                            <div className="flex items-center gap-3"><Package size={20} className="text-purple-600" /><span className="font-semibold">Weight:</span> {parcel.weight} kg</div>
                            <div className="flex items-center gap-3"><DollarSign size={20} className="text-purple-600" /><span className="font-semibold">Cost:</span> ৳{parcel.cost}</div>
                            <div className="flex items-center gap-3"><Calendar size={20} className="text-purple-600" /><span className="font-semibold">Created:</span> {new Date(parcel.creation_date).toLocaleString()}</div>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3"><User size={20} className="text-purple-600" /><span className="font-semibold">Sender:</span> {parcel.sender?.name} ({parcel.sender?.phone})</div>
                            <div className="flex items-center gap-3"><MapPin size={20} className="text-purple-600" /><span className="font-semibold">From:</span> {parcel.sender?.district}, {parcel.sender?.address}</div>
                            <div className="flex items-center gap-3"><User size={20} className="text-purple-600" /><span className="font-semibold">Receiver:</span> {parcel.receiver?.name} ({parcel.receiver?.phone})</div>
                            <div className="flex items-center gap-3"><MapPin size={20} className="text-purple-600" /><span className="font-semibold">To:</span> {parcel.receiver?.district}, {parcel.receiver?.address}</div>
                        </div>
                    </div>

                    {/* Instructions */}
                    <div className="border-t pt-4">
                        <p><span className="font-semibold">Pickup Instruction:</span> {parcel.sender?.pickupInstruction}</p>
                        <p><span className="font-semibold">Delivery Instruction:</span> {parcel.receiver?.deliveryInstruction}</p>
                    </div>

                    {/* Status Badge */}
                    <div className="inline-block px-3 py-1 rounded-full text-sm font-semibold bg-gray-100 text-gray-700">
                        Status: {parcel.status}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ParcelDetails;
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query'; 
import { CreditCard, Package, MapPin, User, DollarSign } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { getParcelById } from '../../services/api';

const Payment = () => {
    const { parcelId } = useParams();
    const navigate = useNavigate();

    // Fetch parcel details
    const { data: parcel, isLoading, error } = useQuery({
        queryKey: ['parcel', parcelId],
        queryFn: () => getParcelById(parcelId),
        enabled: !!parcelId,
    });

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    if (error || !parcel) {
        return <div className="text-red-500 text-center">Parcel not found or failed to load.</div>;
    }

    const handlePayment = async () => {
        try {
            const res = await fetch(
                'http://localhost:5000/create-checkout-session',
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        parcelId: parcel._id,
                    }),
                }
            );

            const data = await res.json();

            if (!data.url) {
                throw new Error('No payment URL received');
            }

            window.location.href = data.url;
        } catch (error) {
            console.error(error);
            toast.error('Payment failed!');
        }
    };


    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-green-600 to-teal-600 p-6 text-white">
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <CreditCard size={28} /> Payment Details
                    </h1>
                    <p className="text-green-100 mt-1">Complete your payment to confirm the delivery</p>
                </div>

                {/* Parcel Information */}
                <div className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <Package className="text-purple-600" size={20} />
                                <span className="font-semibold">Parcel:</span>
                                <span>{parcel.parcelType === 'document' ? parcel.documentName : parcel.parcelName}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Package className="text-purple-600" size={20} />
                                <span className="font-semibold">Type:</span>
                                <span className="capitalize">{parcel.parcelType}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Package className="text-purple-600" size={20} />
                                <span className="font-semibold">Weight:</span>
                                <span>{parcel.weight} kg</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <DollarSign className="text-purple-600" size={20} />
                                <span className="font-semibold">Amount to Pay:</span>
                                <span className="text-xl font-bold text-green-600">{parcel.cost} TK</span>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <User className="text-purple-600" size={20} />
                                <span className="font-semibold">Sender:</span>
                                <span>{parcel.sender?.name}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <MapPin className="text-purple-600" size={20} />
                                <span className="font-semibold">From:</span>
                                <span>{parcel.sender?.district}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <User className="text-purple-600" size={20} />
                                <span className="font-semibold">Receiver:</span>
                                <span>{parcel.receiver?.name}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <MapPin className="text-purple-600" size={20} />
                                <span className="font-semibold">To:</span>
                                <span>{parcel.receiver?.district}</span>
                            </div>
                        </div>
                    </div>

                    {/* Payment Instructions */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600">
                            <strong>Note:</strong> After successful payment, your parcel will be scheduled for pickup.
                            You will receive a confirmation email with tracking details.
                        </p>
                    </div>

                    {/* Pay Button */}
                    <button
                        onClick={handlePayment}
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl transition duration-200 flex items-center justify-center gap-2 text-lg"
                    >
                        <CreditCard size={22} />
                        Pay {parcel.cost}TK !  Now
                    </button>

                    {/* Cancel / Back Link */}
                    <div className="text-center">
                        <button
                            onClick={() => navigate(-1)}
                            className="text-gray-500 hover:text-gray-700 text-sm"
                        >
                            ← Cancel and go back
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Payment;
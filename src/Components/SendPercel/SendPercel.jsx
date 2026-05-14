import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { toast } from 'react-hot-toast';
import { useLoaderData } from 'react-router';
import Swal from 'sweetalert2';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import useAuth from '../../hook/useAuth';

import { createParcel } from '../../services/api';

const SendParcel = () => {
    const [parcelType, setParcelType] = useState('document');
    const allRegion = useLoaderData();

    const {user} = useAuth();

    const navigate = useNavigate();

    // Unique regions from JSON data
    const regions = [...new Map(allRegion.map(item => [item.region, item.region])).values()];

    // States for dynamic city filtering
    const [selectedSenderRegion, setSelectedSenderRegion] = useState('');
    const [selectedReceiverRegion, setSelectedReceiverRegion] = useState('');

    const getCitiesByRegion = (region) => {
        if (!region) return [];
        const cities = allRegion
            .filter(item => item.region === region)
            .map(item => item.district);
        return [...new Set(cities)];
    };

    const senderCities = getCitiesByRegion(selectedSenderRegion);
    const receiverCities = getCitiesByRegion(selectedReceiverRegion);

     // Mutation for saving parcel
    const mutation = useMutation({
        mutationFn: createParcel,

        onSuccess: () => {
            toast.success('Parcel booked successfully!');

            reset();

            navigate('/dashboard/overview');
        },

        onError: () => {
            toast.error('Booking failed');
        },
    });

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm();

    // ----- Pricing logic (matches the table exactly) -----
    const calculatePricing = (type, weight, senderDistrict, receiverDistrict) => {

        const isWithinCity = senderDistrict === receiverDistrict;

        // DOCUMENT
        if (type === 'document') {

            return isWithinCity ? 60 : 80;
        }

        // NON-DOCUMENT
        const basePrice = isWithinCity ? 110 : 150;

        // up to 3kg
        if (weight <= 3) {

            return basePrice;
        }

        // above 3kg
        const extraKg = Math.ceil(weight - 3);

        const extraCharge = extraKg * 40;

        // inside city
        if (isWithinCity) {

            return basePrice + extraCharge;
        }

        // outside city/district
        return basePrice + extraCharge + 40;
    };
    // ----------------------------------------------------


    // ==========================
    // HANDLE SEND PARCEL
    // ==========================
    const handleSendParcel = async (data) => {

        const currentType = parcelType;

        const weight = parseFloat(data.weight);

        const senderDistrict = data.senderDistrict;

        const receiverDistrict = data.receiverDistrict;


        // ==========================
        // VALIDATIONS
        // ==========================
        if (isNaN(weight) || weight <= 0) {

            toast.error(
                'Please enter a valid weight greater than 0',
                {
                    position: 'top-center'
                }
            );

            return;
        }

        if (!senderDistrict || !receiverDistrict) {

            toast.error(
                'Please select both sender and receiver districts',
                {
                    position: 'top-center'
                }
            );

            return;
        }


        // ==========================
        // CALCULATE COST
        // ==========================
        const cost = calculatePricing(
            currentType,
            weight,
            senderDistrict,
            receiverDistrict
        );


        // ==========================
        // SWEET ALERT CONFIRMATION
        // ==========================
        const result = await Swal.fire({

            title: 'Confirm Parcel Booking',

            html: `
                <div style="text-align:left">

                    <p>
                        <strong>Parcel Type:</strong>
                        ${currentType === 'document'
                            ? '📄 Document'
                            : '📦 Non-Document'}
                    </p>

                    <p>
                        <strong>Weight:</strong>
                        ${weight} KG
                    </p>

                    <p>
                        <strong>Sender:</strong>
                        ${senderDistrict}
                    </p>

                    <p>
                        <strong>Receiver:</strong>
                        ${receiverDistrict}
                    </p>

                    <hr style="margin:12px 0">

                    <p style="font-size:20px; text-align:center">

                        <strong>
                            Total Cost: ৳${cost}
                        </strong>

                    </p>

                </div>
            `,

            icon: 'question',

            showCancelButton: true,

            confirmButtonColor: '#7e22ce',

            cancelButtonColor: '#d33',

            confirmButtonText: 'Confirm Booking',

            cancelButtonText: 'Cancel',

            allowOutsideClick: false,
        });


        // ==========================
        // IF CONFIRMED
        // ==========================
        if (result.isConfirmed) {

            // payload for backend
            const payload = {

                userEmail: user?.email,

                creation_date: new Date(),

                status: 'pending',

                payment_status: 'unpaid',

                delivery_status: 'not_collected',

                tracking_id: `ZAP-${Date.now()}`,

                parcelType: currentType,

                weight,

                documentName: data.documentName || '',

                parcelName: data.parcelName || '',

                cost,

                sender: {

                    name: data.senderName,

                    phone: data.senderPhone,

                    region: data.senderRegion,

                    district: data.senderDistrict,

                    address: data.senderAddress,

                    pickupInstruction: data.pickupInstruction,
                },

                receiver: {

                    name: data.receiverName,

                    phone: data.receiverPhone,

                    region: data.receiverRegion,

                    district: data.receiverDistrict,

                    address: data.receiverAddress,

                    deliveryInstruction: data.deliveryInstruction,
                },
            };


            // ==========================
            // SAVE TO DATABASE
            // ==========================
            mutation.mutate(payload);
        }

        // ==========================
        // CANCEL
        // ==========================
        else {

            toast.info(
                'Booking cancelled',
                {
                    position: 'top-center'
                }
            );
        }
    };

    return (
        <div className="max-w-5xl mx-auto px-4 py-4">
            {/* Header */}
            <div className="text-center">
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                    Send a Parcel
                </h1>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(handleSendParcel)} className="bg-white rounded-2xl shadow-xl p-6 md:p-8">

                {/* Parcel Type Selection */}
                <div className="mb-2">
                    <label className="block text-gray-700 font-bold mb-3">Enter Your Parcel Details</label>
                    <div className="flex gap-6">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                value="document"
                                checked={parcelType === 'document'}
                                onChange={(e) => setParcelType(e.target.value)}
                                className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                            />
                            <span className="text-gray-700">Document</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                value="non-document"
                                checked={parcelType === 'non-document'}
                                onChange={(e) => setParcelType(e.target.value)}
                                className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                            />
                            <span className="text-gray-700">Non-Document</span>
                        </label>
                    </div>
                </div>

                {/* Conditional fields for Document / Non-Document */}
                {parcelType === 'document' ? (
                    <div className="mb-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-gray-700 font-semibold mb-2">
                                    Document Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    {...register("documentName", { required: "Document name is required" })}
                                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition ${
                                        errors.documentName ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="Enter document name"
                                />
                                {errors.documentName && (
                                    <p className="text-red-500 text-sm mt-1">{errors.documentName.message}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-gray-700 font-semibold mb-2">
                                    Weight (kg) <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    step="0.1"
                                    {...register("weight", {
                                        required: "Weight is required",
                                        min: { value: 0.1, message: "Weight must be at least 0.1 kg" },
                                        max: { value: 50, message: "Weight cannot exceed 50 kg" }
                                    })}
                                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                                        errors.weight ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="e.g., 0.5"
                                />
                                {errors.weight && <p className="text-red-500 text-sm mt-1">{errors.weight.message}</p>}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="mb-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-gray-700 font-semibold mb-2">
                                    Parcel Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    {...register("parcelName", { required: "Parcel name is required" })}
                                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                                        errors.parcelName ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="e.g., Electronics, Clothing, Books"
                                />
                                {errors.parcelName && <p className="text-red-500 text-sm mt-1">{errors.parcelName.message}</p>}
                            </div>
                            <div>
                                <label className="block text-gray-700 font-semibold mb-2">
                                    Weight (kg) <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    step="0.1"
                                    {...register("weight", {
                                        required: "Weight is required",
                                        min: { value: 0.1, message: "Weight must be at least 0.1 kg" },
                                        max: { value: 50, message: "Weight cannot exceed 50 kg" }
                                    })}
                                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                                        errors.weight ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="e.g., 2.5"
                                />
                                {errors.weight && <p className="text-red-500 text-sm mt-1">{errors.weight.message}</p>}
                            </div>
                        </div>
                    </div>
                )}

                {/* Divider */}
                <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center">
                        <span className="bg-white px-4 text-sm text-gray-500">Delivery Information</span>
                    </div>
                </div>

                {/* Sender & Receiver Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* SENDER */}
                    <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
                        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                            <span className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm">1</span>
                            Sender Details
                        </h2>
                        <div className="space-y-5">
                            {/* Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-600">Full Name <span className="text-red-500">*</span></label>
                                <input type="text" {...register("senderName", { required: "Sender name is required" })} defaultValue={user?.displayName} className="input input-bordered w-full rounded-xl" placeholder="Enter sender's full name" />
                                {errors.senderName && <p className="text-error text-sm mt-1">{errors.senderName.message}</p>}
                            </div>
                            {/* Phone */}
                            <div>
                                <label className="block text-sm font-medium text-gray-600">Phone Number <span className="text-red-500">*</span></label>
                                <input type="tel" {...register("senderPhone", { required: "Phone number is required", pattern: { value: /^(01[3-9]\d{8})$/, message: "Enter a valid Bangladeshi phone number" } })}  className="input input-bordered w-full rounded-xl" placeholder="Enter a valid Phone Number" />
                                {errors.senderPhone && <p className="text-error text-sm mt-1">{errors.senderPhone.message}</p>}
                            </div>
                            {/* Region */}
                            <div>
                                <label className="block text-sm font-medium text-gray-600">Region <span className="text-red-500">*</span></label>
                                <select {...register("senderRegion", { required: "Please select a region" })} onChange={(e) => setSelectedSenderRegion(e.target.value)} className="select select-bordered w-full rounded-xl">
                                    <option value="">Select Region</option>
                                    {regions.map(region => <option key={region} value={region}>{region}</option>)}
                                </select>
                                {errors.senderRegion && <p className="text-error text-sm mt-1">{errors.senderRegion.message}</p>}
                            </div>
                            {/* City/District */}
                            <div>
                                <label className="block text-sm font-medium text-gray-600">City/District <span className="text-red-500">*</span></label>
                                <select {...register("senderDistrict", { required: "Please select a city/district" })} disabled={!selectedSenderRegion} className="select select-bordered w-full rounded-xl">
                                    <option value="">{selectedSenderRegion ? "Select City/District" : "Select Region First"}</option>
                                    {senderCities.map(city => <option key={city} value={city}>{city}</option>)}
                                </select>
                                {errors.senderDistrict && <p className="text-error text-sm mt-1">{errors.senderDistrict.message}</p>}
                            </div>
                            {/* Address */}
                            <div>
                                <label className="block text-sm font-medium text-gray-600">Full Address <span className="text-red-500">*</span></label>
                                <input type="text" {...register("senderAddress", { required: "Sender address is required" })} className="input input-bordered w-full rounded-xl" placeholder="House/Street/Area" />
                                {errors.senderAddress && <p className="text-error text-sm mt-1">{errors.senderAddress.message}</p>}
                            </div>
                            {/* Pickup Instruction */}
                            <div>
                                <label className="block text-sm font-medium text-gray-600">Pickup Instruction <span className="text-red-500">*</span></label>
                                <textarea rows="4" {...register("pickupInstruction", { required: "Pickup instruction is required" })} className="textarea textarea-bordered w-full rounded-xl resize-none" placeholder="Call before arrival, Gate code, Landmark..."></textarea>
                                {errors.pickupInstruction && <p className="text-error text-sm mt-1">{errors.pickupInstruction.message}</p>}
                            </div>
                        </div>
                    </div>

                    {/* RECEIVER */}
                    <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
                        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                            <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm">2</span>
                            Receiver Details
                        </h2>
                        <div className="space-y-5">
                            {/* Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-600">Full Name <span className="text-red-500">*</span></label>
                                <input type="text" {...register("receiverName", { required: "Receiver name is required" })} className="input input-bordered w-full rounded-xl" placeholder="Enter receiver's full name" />
                                {errors.receiverName && <p className="text-error text-sm mt-1">{errors.receiverName.message}</p>}
                            </div>
                            {/* Phone */}
                            <div>
                                <label className="block text-sm font-medium text-gray-600">Phone Number <span className="text-red-500">*</span></label>
                                <input type="tel" {...register("receiverPhone", { required: "Phone number is required", pattern: { value: /^(01[3-9]\d{8})$/, message: "Enter a valid Bangladeshi phone number" } })} className="input input-bordered w-full rounded-xl" placeholder="Enter receiver's phone number" />
                                {errors.receiverPhone && <p className="text-error text-sm mt-1">{errors.receiverPhone.message}</p>}
                            </div>
                            {/* Region */}
                            <div>
                                <label className="block text-sm font-medium text-gray-600">Region <span className="text-red-500">*</span></label>
                                <select {...register("receiverRegion", { required: "Please select a region" })} onChange={(e) => setSelectedReceiverRegion(e.target.value)} className="select select-bordered w-full rounded-xl">
                                    <option value="">Select Region</option>
                                    {regions.map(region => <option key={region} value={region}>{region}</option>)}
                                </select>
                                {errors.receiverRegion && <p className="text-error text-sm mt-1">{errors.receiverRegion.message}</p>}
                            </div>
                            {/* City/District */}
                            <div>
                                <label className="block text-sm font-medium text-gray-600">City/District <span className="text-red-500">*</span></label>
                                <select {...register("receiverDistrict", { required: "Please select a city/district" })} disabled={!selectedReceiverRegion} className="select select-bordered w-full rounded-xl">
                                    <option value="">{selectedReceiverRegion ? "Select City/District" : "Select Region First"}</option>
                                    {receiverCities.map(city => <option key={city} value={city}>{city}</option>)}
                                </select>
                                {errors.receiverDistrict && <p className="text-error text-sm mt-1">{errors.receiverDistrict.message}</p>}
                            </div>
                            {/* Address */}
                            <div>
                                <label className="block text-sm font-medium text-gray-600">Full Address <span className="text-red-500">*</span></label>
                                <input type="text" {...register("receiverAddress", { required: "Receiver address is required" })} className="input input-bordered w-full rounded-xl" placeholder="House/Street/Area" />
                                {errors.receiverAddress && <p className="text-error text-sm mt-1">{errors.receiverAddress.message}</p>}
                            </div>
                            {/* Delivery Instruction */}
                            <div>
                                <label className="block text-sm font-medium text-gray-600">Delivery Instruction <span className="text-red-500">*</span></label>
                                <textarea rows="4" {...register("deliveryInstruction", { required: "Delivery instruction is required" })} className="textarea textarea-bordered w-full rounded-xl resize-none" placeholder="Call before arrival, Gate code, Landmark..."></textarea>
                                {errors.deliveryInstruction && <p className="text-error text-sm mt-1">{errors.deliveryInstruction.message}</p>}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="mt-8">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 rounded-xl font-semibold text-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50"
                    >
                        {isSubmitting ? (
                            <div className="flex items-center justify-center gap-2">
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Processing...
                            </div>
                        ) : (
                            'Submit Parcel Booking'
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SendParcel;


 
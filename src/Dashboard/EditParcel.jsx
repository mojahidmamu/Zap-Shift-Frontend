// src/Dashboard/EditParcel.jsx
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import Swal from 'sweetalert2'; 
import { updateParcel } from '../services/api';

const EditParcel = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const parcel = state?.parcel;

    const [parcelType, setParcelType] = useState(parcel?.parcelType || 'document');

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        defaultValues: {
            documentName: parcel?.documentName,
            parcelName: parcel?.parcelName,
            weight: parcel?.weight,
            senderName: parcel?.sender?.name,
            senderPhone: parcel?.sender?.phone,
            senderRegion: parcel?.sender?.region,
            senderDistrict: parcel?.sender?.district,
            senderAddress: parcel?.sender?.address,
            pickupInstruction: parcel?.sender?.pickupInstruction,
            receiverName: parcel?.receiver?.name,
            receiverPhone: parcel?.receiver?.phone,
            receiverRegion: parcel?.receiver?.region,
            receiverDistrict: parcel?.receiver?.district,
            receiverAddress: parcel?.receiver?.address,
            deliveryInstruction: parcel?.receiver?.deliveryInstruction,
        }
    });

    const mutation = useMutation({
        mutationFn: (data) => updateParcel(parcel._id, data),
        onSuccess: () => {
            queryClient.invalidateQueries(['parcels']);
            toast.success('Parcel updated successfully');
            navigate('/dashboard');
        },
        onError: () => toast.error('Update failed'),
    });

    const onSubmit = async (data) => {
        const weight = parseFloat(data.weight);
        const payload = {
            parcelType,
            weight,
            documentName: data.documentName,
            parcelName: data.parcelName,
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
            cost: parcel.cost, // Optionally recalculate cost
        };
        mutation.mutate(payload);
    };

    return (
        <div className="max-w-5xl mx-auto px-4 py-4">
            <h1 className="text-3xl font-bold text-center mb-6">Edit Parcel</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
                {/* Parcel Type (disabled because type change may affect cost calculation) */}
                <div className="mb-4">
                    <label className="block font-bold mb-2">Parcel Type</label>
                    <div className="flex gap-6">
                        <label><input type="radio" value="document" checked={parcelType === 'document'} onChange={() => setParcelType('document')} disabled /> Document</label>
                        <label><input type="radio" value="non-document" checked={parcelType === 'non-document'} onChange={() => setParcelType('non-document')} disabled /> Non-Document</label>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">Type cannot be changed after creation.</p>
                </div>

                {/* Parcel Name */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                    <div>
                        <label>{parcelType === 'document' ? 'Document Name' : 'Parcel Name'} *</label>
                        <input type="text" {...register(parcelType === 'document' ? 'documentName' : 'parcelName', { required: true })} className="input input-bordered w-full" />
                    </div>
                    <div>
                        <label>Weight (kg) *</label>
                        <input type="number" step="0.1" {...register('weight', { required: true, min: 0.1 })} className="input input-bordered w-full" />
                    </div>
                </div>

                {/* Divider */}
                <div className="relative my-4"><div className="absolute inset-0 flex items-center"><div className="w-full border-t"></div></div><div className="relative flex justify-center"><span className="bg-white px-4 text-sm">Sender & Receiver</span></div></div>

                {/* Sender fields (shortened for brevity – reuse same structure as SendParcel) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <h3 className="font-bold text-lg">Sender Details</h3>
                        <input type="text" placeholder="Full Name" {...register('senderName', { required: true })} className="input input-bordered w-full" />
                        <input type="tel" placeholder="Phone" {...register('senderPhone', { required: true })} className="input input-bordered w-full" />
                        <input type="text" placeholder="Region" {...register('senderRegion', { required: true })} className="input input-bordered w-full" />
                        <input type="text" placeholder="District" {...register('senderDistrict', { required: true })} className="input input-bordered w-full" />
                        <input type="text" placeholder="Address" {...register('senderAddress', { required: true })} className="input input-bordered w-full" />
                        <textarea rows="2" placeholder="Pickup Instruction" {...register('pickupInstruction', { required: true })} className="textarea textarea-bordered w-full"></textarea>
                    </div>
                    <div className="space-y-4">
                        <h3 className="font-bold text-lg">Receiver Details</h3>
                        <input type="text" placeholder="Full Name" {...register('receiverName', { required: true })} className="input input-bordered w-full" />
                        <input type="tel" placeholder="Phone" {...register('receiverPhone', { required: true })} className="input input-bordered w-full" />
                        <input type="text" placeholder="Region" {...register('receiverRegion', { required: true })} className="input input-bordered w-full" />
                        <input type="text" placeholder="District" {...register('receiverDistrict', { required: true })} className="input input-bordered w-full" />
                        <input type="text" placeholder="Address" {...register('receiverAddress', { required: true })} className="input input-bordered w-full" />
                        <textarea rows="2" placeholder="Delivery Instruction" {...register('deliveryInstruction', { required: true })} className="textarea textarea-bordered w-full"></textarea>
                    </div>
                </div>

                <button type="submit" disabled={isSubmitting} className="btn btn-primary w-full mt-6">Update Parcel</button>
            </form>
        </div>
    );
};

export default EditParcel;
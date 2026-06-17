// src/Dashboard/AdminParcels.jsx
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Package, TrendingUp, DollarSign, Clock, Eye, Edit, Trash2, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { toast } from 'react-hot-toast';
import { getParcels, deleteParcel } from '../services/api';

const AdminParcels = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const token = localStorage.getItem('token');

  // State for modal
  const [selectedParcel, setSelectedParcel] = useState(null);
  const [assigning, setAssigning] = useState(false);
  const [riders, setRiders] = useState([]);
  const [loadingRiders, setLoadingRiders] = useState(false);

  // Fetch all parcels (admin sees all)
  const { data: parcels = [], isLoading, error } = useQuery({
    queryKey: ['parcels'],
    queryFn: getParcels,
  });

  // Fetch available riders when modal opens
  useEffect(() => {
    if (selectedParcel) {
      const fetchRiders = async () => {
        setLoadingRiders(true);
        try {
          const { data } = await axios.get(
            'http://localhost:5000/api/users/available-riders',
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setRiders(data);
        } catch (err) {
          toast.error('রাইডার লোড করতে ব্যর্থ হয়েছে');
        } finally {
          setLoadingRiders(false);
        }
      };
      fetchRiders();
    }
  }, [selectedParcel, token]);

  // Statistics
  const totalParcels = parcels.length;
  const deliveredCount = parcels.filter(p => p.status === 'delivered').length;
  const pendingCount = parcels.filter(p => p.status === 'pending' || p.status === 'assigned').length;
  const totalRevenue = parcels.reduce((sum, p) => sum + (p.cost || 0), 0);

  const stats = [
    { label: 'Total Parcels', value: totalParcels, icon: Package, color: 'bg-blue-500' },
    { label: 'Delivered', value: deliveredCount, icon: TrendingUp, color: 'bg-green-500' },
    { label: 'Pending / Assigned', value: pendingCount, icon: Clock, color: 'bg-yellow-500' },
    { label: 'Total Revenue', value: `৳${totalRevenue}`, icon: DollarSign, color: 'bg-purple-500' },
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

  // Assign rider
  const assignRider = async (riderId) => {
    if (!selectedParcel) return;
    setAssigning(true);
    try {
      await axios.put(
        `http://localhost:5000/api/parcels/${selectedParcel._id}/assign`,
        { riderId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('রাইডার অ্যাসাইন করা হয়েছে');
      setSelectedParcel(null);
      queryClient.invalidateQueries(['parcels']);
    } catch (err) {
      toast.error(err.response?.data?.message || 'অ্যাসাইন করতে ব্যর্থ হয়েছে');
    } finally {
      setAssigning(false);
    }
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
      <h1 className="text-3xl font-bold mb-6">📦 All Parcels</h1>

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

      {/* Parcels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {parcels.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-white rounded-xl shadow">
            <p className="text-gray-500">No parcels yet.</p>
          </div>
        ) : (
          parcels.map(parcel => (
            <div key={parcel._id} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 relative">
              {/* Header */}
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold text-xl truncate">
                  {parcel.parcelType === 'document' ? parcel.documentName : parcel.parcelName}
                </h2>
                <span className={`badge ${parcel.status === 'delivered' ? 'badge-success' : parcel.status === 'pending' ? 'badge-warning' : 'badge-info'}`}>
                  {parcel.status || 'pending'}
                </span>
              </div>

              {/* Info */}
              <div className="space-y-2 text-gray-600">
                <p><strong>Type:</strong> {parcel.parcelType}</p>
                <p><strong>Weight:</strong> {parcel.weight} KG</p>
                <p><strong>Cost:</strong> {parcel.cost} TK</p>
                <p><strong>Sender:</strong> {parcel.sender?.district || parcel.senderAddress}</p>
                <p><strong>Receiver:</strong> {parcel.receiver?.district || parcel.receiverAddress}</p>
                {parcel.riderName && (
                  <p className="text-sm text-indigo-600"><strong>Rider:</strong> {parcel.riderName}</p>
                )}
              </div>

              {/* Footer with Buttons */}
              <div className="mt-5 pt-4 border-t flex flex-wrap justify-between items-center gap-2">
                <p className="text-sm text-gray-400">{new Date(parcel.createdAt).toLocaleString()}</p>
                <div className="flex flex-wrap gap-2">
                  {parcel.status === 'pending' && (
                    <button
                      onClick={() => setSelectedParcel(parcel)}
                      className="btn btn-primary btn-sm"
                    >
                      Assign Rider
                    </button>
                  )}
                  <button
                    onClick={() => navigate(`/parcels/${parcel._id}`)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition"
                    title="View Details"
                  >
                    <Eye size={18} />
                  </button>
                  <button
                    onClick={() => navigate(`/parcels/edit/${parcel._id}`, { state: { parcel } })}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-full transition"
                    title="Edit Parcel"
                  >
                    <Edit size={18} />
                  </button>
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

      {/* Assign Rider Modal */}
      {selectedParcel && (
        <dialog className="modal modal-open" id="assign_modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg">রাইডার নির্বাচন করুন</h3>
            <p className="text-sm text-gray-500 mt-1">
              পার্সেল: {selectedParcel.parcelName || selectedParcel.documentName}
            </p>

            {loadingRiders ? (
              <div className="flex justify-center py-8">
                <Loader2 className="animate-spin text-indigo-600 w-8 h-8" />
              </div>
            ) : riders.length === 0 ? (
              <p className="text-yellow-600 mt-4">কোনো উপলব্ধ রাইডার নেই</p>
            ) : (
              <div className="mt-4 space-y-2">
                {riders.map((rider) => (
                  <div
                    key={rider._id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                    onClick={() => assignRider(rider._id)}
                  >
                    <div>
                      <p className="font-medium">{rider.name}</p>
                      <p className="text-sm text-gray-500">{rider.email}</p>
                    </div>
                    {assigning ? (
                      <Loader2 className="animate-spin text-indigo-600" />
                    ) : (
                      <button className="btn btn-primary btn-sm">Assign</button>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="modal-action">
              <button
                className="btn btn-ghost"
                onClick={() => setSelectedParcel(null)}
                disabled={assigning}
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
};

export default AdminParcels;
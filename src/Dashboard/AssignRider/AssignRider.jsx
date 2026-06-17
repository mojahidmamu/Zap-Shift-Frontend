import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import Swal from 'sweetalert2';
import { Package, MapPin, Clock, CheckCircle, XCircle, Truck, Loader2 } from 'lucide-react';

const AssignRider = () => {
  const [parcels, setParcels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const token = localStorage.getItem('token');

  const fetchParcels = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        'http://localhost:5000/api/rider/my-parcels',
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setParcels(data);
    } catch (err) {
      toast.error('পার্সেল লোড করতে ব্যর্থ হয়েছে');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParcels();
  }, []);

  const handleAction = async (parcelId, action) => {
    const confirm = await Swal.fire({
      title: `আপনি কি ${action === 'accept' ? 'গ্রহণ' : action === 'reject' ? 'প্রত্যাখ্যান' : 'সম্পন্ন'} করবেন?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'হ্যাঁ',
      cancelButtonText: 'না'
    });
    if (!confirm.isConfirmed) return;

    setActionLoading(parcelId);
    try {
      const endpoint = action === 'accept' ? 'accept' : action === 'reject' ? 'reject' : 'complete';
      await axios.put(
        `http://localhost:5000/api/parcels/${parcelId}/${endpoint}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('অপারেশন সফল');
      fetchParcels();
    } catch (err) {
      toast.error(err.response?.data?.message || 'অপারেশন ব্যর্থ হয়েছে');
    } finally {
      setActionLoading(null);
    }
  };

  const statusBadge = (status) => {
    const map = {
      assigned: 'badge-info',
      picked_up: 'badge-primary',
      rejected: 'badge-error',
      delivered: 'badge-success'
    };
    return map[status] || 'badge-ghost';
  };

  const statusLabel = {
    assigned: 'অ্যাসাইনকৃত',
    picked_up: 'পিকআপকৃত',
    rejected: 'প্রত্যাখ্যাত',
    delivered: 'ডেলিভারি সম্পন্ন'
  };

  if (loading) return <div className="p-8 text-center"><Loader2 className="animate-spin inline" /> লোড হচ্ছে...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">📦 আমার অ্যাসাইনকৃত পার্সেল</h1>

      {parcels.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow">
          <Package className="w-16 h-16 mx-auto text-gray-300" />
          <p className="text-gray-500 mt-2">আপনাকে কোনো পার্সেল অ্যাসাইন করা হয়নি</p>
        </div>
      ) : (
        <div className="space-y-4">
          {parcels.map((parcel) => (
            <div key={parcel._id} className="bg-white rounded-xl shadow-md border p-5">
              <div className="flex flex-wrap justify-between items-start gap-2">
                <div>
                  <h3 className="font-bold text-lg">{parcel.parcelName || parcel.documentName}</h3>
                  <p className="text-sm text-gray-500">ট্র্যাকিং: {parcel.trackingId}</p>
                </div>
                <span className={`badge ${statusBadge(parcel.status)}`}>
                  {statusLabel[parcel.status] || parcel.status}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3 text-sm">
                <div><span className="text-gray-500">প্রেরক:</span> {parcel.senderName}</div>
                <div><span className="text-gray-500">প্রাপক:</span> {parcel.receiverName}</div>
                <div className="col-span-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span>{parcel.senderAddress} → {parcel.receiverAddress}</span>
                </div>
                <div><span className="text-gray-500">ওজন:</span> {parcel.weight} kg</div>
                <div><span className="text-gray-500">বুকিং:</span> {new Date(parcel.createdAt).toLocaleDateString()}</div>
              </div>

              {/* Action buttons */}
              <div className="mt-4 border-t pt-4 flex flex-wrap gap-3">
                {parcel.status === 'assigned' && (
                  <>
                    <button
                      onClick={() => handleAction(parcel._id, 'accept')}
                      className="btn btn-success btn-sm"
                      disabled={actionLoading === parcel._id}
                    >
                      {actionLoading === parcel._id ? <Loader2 className="animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                      গ্রহণ করুন
                    </button>
                    <button
                      onClick={() => handleAction(parcel._id, 'reject')}
                      className="btn btn-error btn-sm"
                      disabled={actionLoading === parcel._id}
                    >
                      {actionLoading === parcel._id ? <Loader2 className="animate-spin" /> : <XCircle className="w-4 h-4" />}
                      প্রত্যাখ্যান
                    </button>
                  </>
                )}
                {parcel.status === 'picked_up' && (
                  <button
                    onClick={() => handleAction(parcel._id, 'complete')}
                    className="btn btn-primary btn-sm"
                    disabled={actionLoading === parcel._id}
                  >
                    {actionLoading === parcel._id ? <Loader2 className="animate-spin" /> : <Truck className="w-4 h-4" />}
                    ডেলিভারি সম্পন্ন করুন
                  </button>
                )}
                {parcel.status === 'delivered' && (
                  <span className="text-green-600 font-semibold flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" /> সম্পন্ন হয়েছে
                  </span>
                )}
                {parcel.status === 'rejected' && (
                  <span className="text-red-600 font-semibold flex items-center gap-2">
                    <XCircle className="w-5 h-5" /> প্রত্যাখ্যান করেছেন
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AssignRider;
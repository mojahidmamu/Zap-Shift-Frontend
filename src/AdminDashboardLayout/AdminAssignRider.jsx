// AdminAssignRider.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Package, User, MapPin, Loader2 } from 'lucide-react';

const AdminAssignRider = () => {
  const [parcels, setParcels] = useState([]);
  const [riders, setRiders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(null);
  const token = localStorage.getItem('token');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [parcelsRes, ridersRes] = await Promise.all([
        axios.get('http://localhost:5000/api/parcels/unassigned', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('http://localhost:5000/api/users/riders', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      setParcels(parcelsRes.data);
      setRiders(ridersRes.data);
    } catch (err) {
      toast.error('ডেটা লোড করতে ব্যর্থ হয়েছে');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const assignRider = async (parcelId, riderId) => {
    if (!riderId) {
      toast.error('দয়া করে একটি রাইডার নির্বাচন করুন');
      return;
    }
    setAssigning(parcelId);
    try {
      await axios.put(
        `http://localhost:5000/api/parcels/${parcelId}/assign`,
        { riderId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('রাইডার অ্যাসাইন করা হয়েছে');
      fetchData(); // refresh list
    } catch (err) {
      toast.error('অ্যাসাইন করতে ব্যর্থ হয়েছে');
    } finally {
      setAssigning(null);
    }
  };

  if (loading) return <div className="p-8 text-center"><Loader2 className="animate-spin inline" /> লোড হচ্ছে...</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">🚚 অ্যাসাইন রাইডার</h1>

      {parcels.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow">
          <Package className="w-16 h-16 mx-auto text-gray-300" />
          <p className="text-gray-500 mt-2">কোনো আনঅ্যাসাইন করা পার্সেল নেই</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {parcels.map((parcel) => (
            <div key={parcel._id} className="bg-white rounded-xl shadow-md border p-5">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg">{parcel.parcelName || parcel.documentName}</h3>
                  <p className="text-sm text-gray-500">{parcel.userEmail}</p>
                </div>
                <span className="badge badge-warning">পেন্ডিং</span>
              </div>

              <div className="mt-3 space-y-1 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span><span className="text-gray-500">থেকে:</span> {parcel.senderAddress}, {parcel.senderCity}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span><span className="text-gray-500">যেতে:</span> {parcel.receiverAddress}, {parcel.receiverCity}</span>
                </div>
                <p><span className="text-gray-500">ওজন:</span> {parcel.weight} kg</p>
              </div>

              <div className="mt-4 flex items-center gap-3">
                <User className="w-5 h-5 text-gray-400" />
                <select
                  className="select select-bordered select-sm flex-1"
                  defaultValue=""
                  onChange={(e) => assignRider(parcel._id, e.target.value)}
                  disabled={assigning === parcel._id}
                >
                  <option value="">রাইডার নির্বাচন করুন</option>
                  {riders.map((rider) => (
                    <option key={rider._id} value={rider._id}>
                      {rider.name} ({rider.phone})
                    </option>
                  ))}
                </select>
                {assigning === parcel._id && <Loader2 className="animate-spin w-5 h-5" />}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminAssignRider;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const MyRiderApplication = () => {
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchMyApplication = async () => {
      try {
        const { data } = await axios.get(
          'http://localhost:5000/api/rider/my-application',
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setApplication(data);
      } catch (err) {
        if (err.response?.status === 404) {
          setApplication(null); // no application found
        } else {
          toast.error('আপনার আবেদন লোড করতে ব্যর্থ হয়েছে');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchMyApplication();
  }, [token]);

  if (loading) {
    return <div className="text-center p-8">লোড হচ্ছে...</div>;
  }

  if (!application) {
    return (
      <div className="p-6 text-center">
        <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
        <h2 className="text-xl font-semibold text-gray-700">আপনি এখনো রাইডার আবেদন করেননি</h2>
        <p className="text-gray-500 mt-2">
          রাইডার হতে চাইলে <a href="/rider" className="text-indigo-600 underline">এখানে ক্লিক করুন</a>
        </p>
      </div>
    );
  }

  const statusConfig = {
    pending: { icon: <Clock className="w-6 h-6 text-yellow-500" />, text: 'পেন্ডিং', color: 'bg-yellow-100 text-yellow-800' },
    approved: { icon: <CheckCircle className="w-6 h-6 text-green-500" />, text: 'অনুমোদিত', color: 'bg-green-100 text-green-800' },
    rejected: { icon: <XCircle className="w-6 h-6 text-red-500" />, text: 'প্রত্যাখ্যাত', color: 'bg-red-100 text-red-800' }
  };
  const status = statusConfig[application.status];

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">আমার রাইডার আবেদনের অবস্থা</h1>
      <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
        <div className="flex items-center justify-between border-b pb-3">
          <span className="text-gray-600">আবেদনের অবস্থা</span>
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${status.color}`}>
            {status.icon}
            <span className="font-semibold">{status.text}</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div><span className="text-gray-500">নাম:</span> <span className="font-medium">{application.fullName}</span></div>
          <div><span className="text-gray-500">ইমেইল:</span> <span className="font-medium">{application.email}</span></div>
          <div><span className="text-gray-500">ফোন:</span> <span className="font-medium">{application.phone}</span></div>
          <div><span className="text-gray-500">ঠিকানা:</span> <span className="font-medium">{application.address}, {application.city}</span></div>
          <div><span className="text-gray-500">যানবাহনের ধরন:</span> <span className="font-medium">{application.vehicleType}</span></div>
          <div><span className="text-gray-500">লাইসেন্স নং:</span> <span className="font-medium">{application.licenseNumber}</span></div>
          <div><span className="text-gray-500">অভিজ্ঞতা:</span> <span className="font-medium">{application.experienceYears} বছর</span></div>
          <div><span className="text-gray-500">উপলব্ধতা:</span> <span className="font-medium">{application.availableHours}</span></div>
          <div className="col-span-2"><span className="text-gray-500">জরুরি যোগাযোগ:</span> <span className="font-medium">{application.emergencyContactName || 'N/A'} ({application.emergencyContact || 'N/A'})</span></div>
          <div className="col-span-2"><span className="text-gray-500">আবেদনের তারিখ:</span> <span className="font-medium">{new Date(application.appliedAt).toLocaleString()}</span></div>
          {application.rejectionReason && (
            <div className="col-span-2"><span className="text-gray-500">প্রত্যাখ্যানের কারণ:</span> <span className="font-medium text-red-600">{application.rejectionReason}</span></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyRiderApplication;
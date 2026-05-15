import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import Swal from 'sweetalert2';
import { Eye, CheckCircle, XCircle, Filter } from 'lucide-react';

const RiderApplications = () => {
  const [applications, setApplications] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  const fetchApplications = async () => {
    try {
      const { data } = await axios.get(`/api/rider/applications?status=${statusFilter}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setApplications(data);
    } catch (err) {
      toast.error('আবেদন লোড করতে ব্যর্থ হয়েছে');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [statusFilter]);

  const handleApprove = async (id) => {
    const result = await Swal.fire({
      title: 'আবেদনটি অনুমোদন করবেন?',
      text: 'রাইডার সক্রিয় হবে।',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      confirmButtonText: 'হ্যাঁ, অনুমোদন করুন'
    });
    if (result.isConfirmed) {
      try {
        await axios.put(`/api/rider/applications/${id}`, { status: 'approved' }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('আবেদন অনুমোদিত হয়েছে');
        fetchApplications();
      } catch (err) {
        toast.error('অনুমোদনে সমস্যা হয়েছে');
      }
    }
  };

  const handleReject = async (id) => {
    const { value: reason } = await Swal.fire({
      title: 'আবেদনটি প্রত্যাখ্যান করুন',
      input: 'textarea',
      inputLabel: 'কারণ লিখুন',
      inputPlaceholder: 'রাইডারকে জানানোর জন্য কারণ...',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      confirmButtonText: 'প্রত্যাখ্যান'
    });
    if (reason) {
      try {
        await axios.put(`/api/rider/applications/${id}`, { status: 'rejected', rejectionReason: reason }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('আবেদন প্রত্যাখ্যান করা হয়েছে');
        fetchApplications();
      } catch (err) {
        toast.error('প্রত্যাখ্যান করতে ব্যর্থ হয়েছে');
      }
    }
  };

  const showDetails = (app) => {
    Swal.fire({
      title: `${app.fullName} - বিস্তারিত`,
      html: `
        <div style="text-align: left;">
          <p><strong>ইমেইল:</strong> ${app.email}</p>
          <p><strong>ফোন:</strong> ${app.phone}</p>
          <p><strong>ঠিকানা:</strong> ${app.address}, ${app.city}</p>
          <p><strong>যানবাহন:</strong> ${app.vehicleType}</p>
          <p><strong>লাইসেন্স নং:</strong> ${app.licenseNumber}</p>
          <p><strong>অভিজ্ঞতা:</strong> ${app.experienceYears} বছর</p>
          <p><strong>উপলব্ধতা:</strong> ${app.availableHours}</p>
          <p><strong>জরুরি যোগাযোগ:</strong> ${app.emergencyContactName || 'N/A'} (${app.emergencyContact || 'N/A'})</p>
          <p><strong>আবেদনের তারিখ:</strong> ${new Date(app.appliedAt).toLocaleString()}</p>
          <p><strong>স্ট্যাটাস:</strong> ${app.status === 'pending' ? 'পেন্ডিং' : app.status === 'approved' ? 'অনুমোদিত' : 'প্রত্যাখ্যাত'}</p>
          ${app.rejectionReason ? `<p><strong>প্রত্যাখ্যানের কারণ:</strong> ${app.rejectionReason}</p>` : ''}
        </div>
      `,
      icon: 'info',
      confirmButtonText: 'বন্ধ করুন'
    });
  };

  if (loading) return <div className="text-center p-8">লোড হচ্ছে...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">🚚 রাইডার আবেদনসমূহ</h1>
        {/* <div className="flex items-center gap-2">
          <Filter size={18} />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded-lg px-3 py-1"
          >
            <option value="all">সব</option>
            <option value="pending">পেন্ডিং</option>
            <option value="approved">অনুমোদিত</option>
            <option value="rejected">প্রত্যাখ্যাত</option>
          </select>
        </div> */}
      </div>

      {/* {applications.length === 0 ? (
        <div className="text-center text-gray-500 py-12">কোনো আবেদন পাওয়া যায়নি</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {applications.map(app => (
            <div key={app._id} className="bg-white rounded-xl shadow-md border p-5">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-lg">{app.fullName}</h3>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  app.status === 'approved' ? 'bg-green-100 text-green-700' :
                  app.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {app.status === 'approved' ? 'অনুমোদিত' : app.status === 'rejected' ? 'প্রত্যাখ্যাত' : 'পেন্ডিং'}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">{app.vehicleType}</p>
              <p className="text-sm text-gray-500">{app.city}</p>
              <p className="text-xs text-gray-400 mt-2">আবেদন: {new Date(app.appliedAt).toLocaleDateString()}</p>
              <div className="flex justify-end gap-3 mt-4">
                <button onClick={() => showDetails(app)} className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg">
                  <Eye size={18} />
                </button>
                {app.status === 'pending' && (
                  <>
                    <button onClick={() => handleApprove(app._id)} className="text-green-600 hover:bg-green-50 p-2 rounded-lg">
                      <CheckCircle size={18} />
                    </button>
                    <button onClick={() => handleReject(app._id)} className="text-red-600 hover:bg-red-50 p-2 rounded-lg">
                      <XCircle size={18} />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )} */}
    </div>
  );
};

export default RiderApplications;
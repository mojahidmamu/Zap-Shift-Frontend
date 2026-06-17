import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import Swal from 'sweetalert2';
import { Clock, CheckCircle, XCircle, AlertCircle, Eye, Filter, RefreshCw } from 'lucide-react';

const RiderApplications = () => {
  const [applications, setApplications] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `http://localhost:5000/api/rider/applications?status=${statusFilter}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setApplications(data);
    } catch (err) {
      console.error('Fetch error:', err);
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
      confirmButtonText: 'হ্যাঁ, অনুমোদন করুন',
      cancelButtonText: 'বাতিল'
    });
    if (result.isConfirmed) {
      try {
        await axios.put(
          `http://localhost:5000/api/rider/applications/${id}`,
          { status: 'approved' },
          { headers: { Authorization: `Bearer ${token}` } }
        );
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
      confirmButtonText: 'প্রত্যাখ্যান',
      cancelButtonText: 'বাতিল'
    });
    if (reason) {
      try {
        await axios.put(
          `http://localhost:5000/api/rider/applications/${id}`,
          { status: 'rejected', rejectionReason: reason },
          { headers: { Authorization: `Bearer ${token}` } }
        );
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
        <div style="text-align: left; max-height: 500px; overflow-y: auto;">
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

  const statusConfig = {
    pending: { icon: <Clock className="w-5 h-5" />, label: 'পেন্ডিং', bg: 'bg-yellow-100 text-yellow-800' },
    approved: { icon: <CheckCircle className="w-5 h-5" />, label: 'অনুমোদিত', bg: 'bg-green-100 text-green-800' },
    rejected: { icon: <XCircle className="w-5 h-5" />, label: 'প্রত্যাখ্যাত', bg: 'bg-red-100 text-red-800' }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-500">লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header with filter and refresh */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">🚚 রাইডার আবেদনসমূহ</h1>
          <p className="text-gray-500 mt-1">মোট আবেদন: {applications.length} টি</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow-sm border">
            <Filter size={18} className="text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent outline-none text-sm font-medium text-gray-700"
            >
              <option value="all">সব</option>
              <option value="pending">পেন্ডিং</option>
              <option value="approved">অনুমোদিত</option>
              <option value="rejected">প্রত্যাখ্যাত</option>
            </select>
          </div>
          <button
            onClick={fetchApplications}
            className="p-2 bg-white rounded-lg shadow-sm border hover:bg-gray-50 transition"
            title="রিফ্রেশ"
          >
            <RefreshCw size={18} className="text-gray-500" />
          </button>
        </div>
      </div>

      {/* Applications Grid */}
      {applications.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-sm border">
          <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600">কোনো আবেদন পাওয়া যায়নি</h3>
          <p className="text-gray-400 mt-2">বর্তমানে {statusFilter === 'all' ? 'কোনো' : statusFilter} আবেদন নেই।</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {applications.map((app) => {
            const status = statusConfig[app.status] || statusConfig.pending;
            return (
              <div
                key={app._id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              >
                {/* Card Header – Name + Status */}
                <div className="px-5 pt-5 pb-3 border-b bg-gradient-to-r from-gray-50 to-white flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg text-gray-800">{app.fullName}</h3>
                    <p className="text-sm text-gray-500">{app.email}</p>
                  </div>
                  <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${status.bg}`}>
                    {status.icon}
                    {status.label}
                  </div>
                </div>

                {/* Card Body – Details */}
                <div className="p-5 space-y-3">
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    <div>
                      <span className="text-gray-500">ফোন:</span>
                      <span className="ml-1 font-medium">{app.phone}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">যানবাহন:</span>
                      <span className="ml-1 font-medium">{app.vehicleType}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">লাইসেন্স:</span>
                      <span className="ml-1 font-medium">{app.licenseNumber}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">অভিজ্ঞতা:</span>
                      <span className="ml-1 font-medium">{app.experienceYears} বছর</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-gray-500">ঠিকানা:</span>
                      <span className="ml-1 font-medium">{app.address}, {app.city}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-gray-500">আবেদনের তারিখ:</span>
                      <span className="ml-1 font-medium text-gray-600">
                        {new Date(app.appliedAt).toLocaleDateString('bn-BD', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end gap-2 pt-3 border-t">
                    <button
                      onClick={() => showDetails(app)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      title="বিস্তারিত দেখুন"
                    >
                      <Eye size={18} />
                    </button>
                    {app.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleApprove(app._id)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                          title="অনুমোদন করুন"
                        >
                          <CheckCircle size={18} />
                        </button>
                        <button
                          onClick={() => handleReject(app._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="প্রত্যাখ্যান করুন"
                        >
                          <XCircle size={18} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RiderApplications;
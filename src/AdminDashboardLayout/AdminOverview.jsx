import React, { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getParcels, deleteParcel } from '../services/api';   
import {
  Users,
  Truck,
  Package,
  DollarSign,
  Clock,
  UserPlus,
  TrendingUp,
  Activity,
  ArrowRight,
  CheckCircle,
  XCircle,
  AlertCircle,
} from 'lucide-react';

const AdminOverview = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const token = localStorage.getItem('token');

    // Fetch users
    const { data: users = [], isLoading, error } = useQuery({
            queryKey: ['users'],
            queryFn: async () => {
                const res = await axios.get('http://localhost:5000/users', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                return res.data;
            }
    });

    // Fetch all parcels
    const { data: allParcels = []  } = useQuery({
            queryKey: ['parcels'],
            queryFn: getParcels,
    });

    const totalParcels = allParcels.length;

    // Payment method: 
    const [payments, setPayments] = useState([]);
    useEffect(() => {
            fetch('http://localhost:5000/all-payments')
            .then(res => res.json())
            .then(data => {
                // Sort by paid_at descending (latest first) for better UX
                const sorted = [...data].sort((a, b) => 
                new Date(b.paid_at) - new Date(a.paid_at)
                );
                setPayments(sorted);
                // setLoading(false);
            })
            .catch(err => {
                console.error(err);
                // setLoading(false);
            });
    }, []);

    const totalRevenue = payments.reduce((acc, curr) => acc + (curr.cost || 0), 0);

    // Rider applications: 
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

  const totalRiders = applications.filter(app => app.status === 'approved').length;

  // Dummy data – replace with real API data later
  const stats = [
    { label: 'Total Users', value:  users.length, icon: <Users className="w-6 h-6" />, color: 'bg-blue-500', trend: '+12%' },
    { label: 'Total Riders', value: totalRiders, icon: <Truck className="w-6 h-6" />, color: 'bg-green-500', trend: '+8%' },
    { label: 'Total Parcels', value: totalParcels, icon: <Package className="w-6 h-6" />, color: 'bg-purple-500', trend: '+23%' },
    { label: 'Revenue (BDT)', value: `৳ ${totalRevenue.toLocaleString()}`, icon: <DollarSign className="w-6 h-6" />, color: 'bg-yellow-500', trend: '+17%' },
    { label: 'Pending Riders', value: '0', icon: <Clock className="w-6 h-6" />, color: 'bg-orange-500', trend: '-2%' },
    { label: 'Active Deliveries', value: '00000', icon: <Activity className="w-6 h-6" />, color: 'bg-indigo-500', trend: '+5%' },
  ];

  const recentActivities = [
    { type: 'parcel', user: 'Rahim Ahmed', action: 'Booked a parcel', amount: '₳ 250', time: '5 min ago', status: 'paid' },
    { type: 'rider', user: 'Sultana Begum', action: 'Applied for rider', time: '23 min ago', status: 'pending' },
    { type: 'parcel', user: 'Kamal Hossain', action: 'Booked a document', amount: '₳ 120', time: '1 hour ago', status: 'paid' },
    { type: 'rider', user: 'Mina Akter', action: 'Rider application approved', time: '2 hours ago', status: 'approved' },
    { type: 'parcel', user: 'Joynal Abedin', action: 'Booked a parcel', amount: '₳ 180', time: '3 hours ago', status: 'failed' },
  ];

  const quickActions = [
    { label: 'Manage Users', icon: <Users />, path: '/admin-dashboard/users-management', color: 'bg-blue-100 text-blue-600' },
    { label: 'Rider Applications', icon: <UserPlus />, path: '/admin-dashboard/rider-applications', color: 'bg-green-100 text-green-600' },
    { label: 'All Parcels', icon: <Package />, path: '/admin-dashboard/parcels', color: 'bg-purple-100 text-purple-600' },
    { label: 'Revenue Reports', icon: <DollarSign />, path: '/admin-dashboard/payment-history', color: 'bg-yellow-100 text-yellow-600' },
  ];

  const statusBadge = (status) => {
    switch (status) {
      case 'paid':
        return <span className="badge badge-success gap-1"><CheckCircle size={14} /> Paid</span>;
      case 'pending':
        return <span className="badge badge-warning gap-1"><Clock size={14} /> Pending</span>;
      case 'approved':
        return <span className="badge badge-primary gap-1"><CheckCircle size={14} /> Approved</span>;
      case 'failed':
        return <span className="badge badge-error gap-1"><XCircle size={14} /> Failed</span>;
      default:
        return <span className="badge badge-ghost"><AlertCircle size={14} /> Unknown</span>;
    }
  };

  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        <p className="text-gray-500 mt-1">Overview of your entire delivery platform</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 transition-all duration-300 hover:shadow-md hover:-translate-y-1"
          >
            <div className="flex items-center justify-between">
              <div className={`p-2 rounded-xl ${stat.color} text-white`}>{stat.icon}</div>
              <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                {stat.trend}
              </span>
            </div>
            <div className="mt-3">
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Two-column layout: Recent Activities + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Recent Activities</h2>
            <button className="text-sm text-indigo-600 hover:underline flex items-center gap-1">
              {/* View All <ArrowRight size={16} /> */}
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="table table-sm table-zebra w-full">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Action</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {recentActivities.map((item, i) => (
                  <tr key={i}>
                    <td className="font-medium">{item.user}</td>
                    <td>{item.action}</td>
                    <td>{item.amount || '—'}</td>
                    <td>{statusBadge(item.status)}</td>
                    <td className="text-gray-400 text-xs">{item.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            {quickActions.map((action, idx) => (
              <a
                key={idx}
                href={action.path}
                className="flex items-center gap-4 p-3 rounded-xl border border-gray-100 hover:border-indigo-300 hover:bg-indigo-50 transition-all group"
              >
                <div className={`p-2 rounded-xl ${action.color}`}>{action.icon}</div>
                <span className="flex-1 font-medium text-gray-700 group-hover:text-indigo-700">
                  {action.label}
                </span>
                <ArrowRight size={18} className="text-gray-400 group-hover:text-indigo-500" />
              </a>
            ))}
          </div>
          <div className="mt-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl">
            <p className="text-sm text-gray-600">
              <span className="font-bold text-indigo-600">💡 Tip:</span> Review pending rider applications to onboard new delivery partners.
            </p>
          </div>
        </div>
      </div>

      {/* Status Overview – additional info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Delivery Status</h2>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Delivered</span>
                <span className="font-medium text-green-600">78%</span>
              </div>
              <progress className="progress progress-success w-full" value="78" max="100"></progress>
            </div>
            <div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">In Transit</span>
                <span className="font-medium text-blue-600">12%</span>
              </div>
              <progress className="progress progress-primary w-full" value="12" max="100"></progress>
            </div>
            <div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Pending</span>
                <span className="font-medium text-yellow-600">7%</span>
              </div>
              <progress className="progress progress-warning w-full" value="7" max="100"></progress>
            </div>
            <div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Cancelled / Failed</span>
                <span className="font-medium text-red-600">3%</span>
              </div>
              <progress className="progress progress-error w-full" value="3" max="100"></progress>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Rider Performance</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-xl">
                <p className="text-2xl font-bold text-blue-600">4.8</p>
                <p className="text-xs text-gray-500">Average Rating</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-xl">
                <p className="text-2xl font-bold text-green-600">97%</p>
                <p className="text-xs text-gray-500">On-time Delivery</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-xl">
                <p className="text-2xl font-bold text-purple-600">48</p>
                <p className="text-xs text-gray-500">Active Riders</p>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-xl">
                <p className="text-2xl font-bold text-yellow-600">12</p>
                <p className="text-xs text-gray-500">New This Week</p>
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-4 text-center">* Data updated in real-time</p>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
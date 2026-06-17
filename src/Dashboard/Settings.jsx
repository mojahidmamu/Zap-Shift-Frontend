import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import {
  User,
  Lock,
  Bell,
  Settings as SettingsIcon,
  Save,
  RefreshCw,
  Eye,
  EyeOff,
} from 'lucide-react';

const Settings = () => {
  const token = localStorage.getItem('token');
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Fetch user data (or from context)
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : { name: '', email: '', photo: '' };
  });

  // ─── Profile Form ────────────────────────────────────────────────
  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
    reset: resetProfile,
  } = useForm({
    defaultValues: {
      name: user.name || '',
      email: user.email || '',
      photo: user.photo || '',
    },
  });

  useEffect(() => {
    if (user) {
      resetProfile({
        name: user.name || '',
        email: user.email || '',
        photo: user.photo || '',
      });
    }
  }, [user, resetProfile]);

  const onProfileSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await axios.put(
        'http://localhost:5000/api/users/profile',
        data,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Profile updated successfully!');
      // Update local storage
      const updatedUser = { ...user, ...data };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  // ─── Password Form ──────────────────────────────────────────────
  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
    watch,
    reset: resetPassword,
  } = useForm();

  const onPasswordSubmit = async (data) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await axios.put(
        'http://localhost:5000/api/users/password',
        {
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Password changed successfully');
      resetPassword();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Password change failed');
    } finally {
      setLoading(false);
    }
  };

  // ─── Notifications Form ──────────────────────────────────────────
  const {
    register: registerNotify,
    handleSubmit: handleNotifySubmit,
    formState: { errors: notifyErrors },
  } = useForm({
    defaultValues: {
      emailNotifications: true,
      smsNotifications: false,
      orderUpdates: true,
      promotionalEmails: false,
    },
  });

  const onNotifySubmit = async (data) => {
    setLoading(true);
    try {
      await axios.put(
        'http://localhost:5000/api/users/notifications',
        data,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Notification preferences saved');
    } catch (err) {
      toast.error('Failed to save preferences');
    } finally {
      setLoading(false);
    }
  };

  // ─── System Settings Form ──────────────────────────────────────
  const {
    register: registerSystem,
    handleSubmit: handleSystemSubmit,
    formState: { errors: systemErrors },
  } = useForm({
    defaultValues: {
      appName: 'ZapShift',
      currency: 'BDT',
      deliveryFee: 50,
      taxRate: 0,
      maxWeight: 50,
    },
  });

  const onSystemSubmit = async (data) => {
    setLoading(true);
    try {
      await axios.put(
        'http://localhost:5000/api/settings',
        data,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('System settings updated');
    } catch (err) {
      toast.error('Failed to update system settings');
    } finally {
      setLoading(false);
    }
  };

  // ─── Tab Navigation ─────────────────────────────────────────────
  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'system', label: 'System', icon: SettingsIcon },
  ];

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">⚙️ Settings</h1>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 mb-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all duration-200 ${
              activeTab === tab.id
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* ─── Tab Content ────────────────────────────────────────────── */}

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <User className="text-indigo-600" /> Profile Information
          </h2>
          <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                {...registerProfile('name', { required: 'Name is required' })}
                className="mt-1 w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500"
              />
              {profileErrors.name && (
                <p className="text-red-500 text-sm mt-1">{profileErrors.name.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                {...registerProfile('email', { required: 'Email is required' })}
                className="mt-1 w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500"
              />
              {profileErrors.email && (
                <p className="text-red-500 text-sm mt-1">{profileErrors.email.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Profile Photo URL</label>
              <input
                type="text"
                {...registerProfile('photo')}
                placeholder="https://example.com/avatar.jpg"
                className="mt-1 w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition disabled:opacity-50"
            >
              {loading ? <RefreshCw className="animate-spin" size={18} /> : <Save size={18} />}
              {loading ? 'Saving...' : 'Save Profile'}
            </button>
          </form>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Lock className="text-indigo-600" /> Change Password
          </h2>
          <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Current Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...registerPassword('currentPassword', { required: 'Current password is required' })}
                  className="mt-1 w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {passwordErrors.currentPassword && (
                <p className="text-red-500 text-sm mt-1">{passwordErrors.currentPassword.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">New Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  {...registerPassword('newPassword', {
                    required: 'New password is required',
                    minLength: { value: 6, message: 'Minimum 6 characters' },
                  })}
                  className="mt-1 w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {passwordErrors.newPassword && (
                <p className="text-red-500 text-sm mt-1">{passwordErrors.newPassword.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
              <input
                type="password"
                {...registerPassword('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: (value) => value === watch('newPassword') || 'Passwords do not match',
                })}
                className="mt-1 w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500"
              />
              {passwordErrors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">{passwordErrors.confirmPassword.message}</p>
              )}
            </div>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition disabled:opacity-50"
            >
              {loading ? <RefreshCw className="animate-spin" size={18} /> : <Lock size={18} />}
              {loading ? 'Updating...' : 'Change Password'}
            </button>
          </form>
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Bell className="text-indigo-600" /> Notification Preferences
          </h2>
          <form onSubmit={handleNotifySubmit(onNotifySubmit)} className="space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <p className="font-medium">Email Notifications</p>
                <p className="text-sm text-gray-500">Receive updates via email</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  {...registerNotify('emailNotifications')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:ring-2 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-indigo-600 after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
              </label>
            </div>

            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <p className="font-medium">SMS Notifications</p>
                <p className="text-sm text-gray-500">Receive SMS for urgent updates</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  {...registerNotify('smsNotifications')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:ring-2 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-indigo-600 after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
              </label>
            </div>

            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <p className="font-medium">Order Updates</p>
                <p className="text-sm text-gray-500">Get notified about parcel status changes</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  {...registerNotify('orderUpdates')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:ring-2 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-indigo-600 after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Promotional Emails</p>
                <p className="text-sm text-gray-500">Receive offers and promotions</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  {...registerNotify('promotionalEmails')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:ring-2 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-indigo-600 after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition disabled:opacity-50"
            >
              {loading ? <RefreshCw className="animate-spin" size={18} /> : <Save size={18} />}
              {loading ? 'Saving...' : 'Save Preferences'}
            </button>
          </form>
        </div>
      )}

      {/* System Tab */}
      {activeTab === 'system' && (
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <SettingsIcon className="text-indigo-600" /> System Configuration
          </h2>
          <form onSubmit={handleSystemSubmit(onSystemSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">App Name</label>
                <input
                  type="text"
                  {...registerSystem('appName', { required: 'App name is required' })}
                  className="mt-1 w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Currency</label>
                <input
                  type="text"
                  {...registerSystem('currency', { required: true })}
                  className="mt-1 w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Default Delivery Fee (BDT)</label>
                <input
                  type="number"
                  {...registerSystem('deliveryFee', { required: true, min: 0 })}
                  className="mt-1 w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Tax Rate (%)</label>
                <input
                  type="number"
                  step="0.1"
                  {...registerSystem('taxRate', { required: true, min: 0 })}
                  className="mt-1 w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Max Weight (kg)</label>
                <input
                  type="number"
                  {...registerSystem('maxWeight', { required: true, min: 1 })}
                  className="mt-1 w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition disabled:opacity-50"
            >
              {loading ? <RefreshCw className="animate-spin" size={18} /> : <Save size={18} />}
              {loading ? 'Saving...' : 'Save System Settings'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Settings;
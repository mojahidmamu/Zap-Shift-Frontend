import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import useAuth from '../../hook/useAuth';
import Swal from 'sweetalert2';
import {
  User,
  Phone,
  MapPin,
  Car,
  IdCard,
  Calendar,
  FileText,
  CheckCircle,
  Truck
} from 'lucide-react';

const RiderForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      fullName: user?.displayName || '',
      email: user?.email || '',
      phone: '',
      address: '',
      city: '',
      vehicleType: '',
      licenseNumber: '',
      experienceYears: '',
      availableHours: '',
      emergencyContactName: '',
      emergencyContact: '',
      terms: false,
    },
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const { terms, ...applicationData } = data;
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/api/rider/apply', applicationData, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      toast.success('আবেদন জমা দেওয়া হয়েছে!...');
      reset();
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'জমা দিতে ব্যর্থ হয়েছে।...');
    } finally {
      setIsSubmitting(false);
    }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex p-3 bg-indigo-100 rounded-full mb-4">
            <Truck className="w-8 h-8 text-indigo-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Join Our Rider Team
          </h1>
          <p className="text-gray-500 mt-2 max-w-lg mx-auto">
            Become a delivery partner and start earning today. Fill out the form below to apply.
          </p>
        </div>

        {/* Form Card */}
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Personal Information Section */}
          <div className="p-6 md:p-8 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-6">
              <User className="w-5 h-5 text-indigo-500" />
              Personal Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register('fullName', { required: 'Full name is required' })}
                  className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition ${
                    errors.fullName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Your full name"
                />
                {errors.fullName && (
                  <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: 'Invalid email address',
                    },
                  })}
                  className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="you@example.com"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                )}
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="tel"
                    {...register('phone', {
                      required: 'Phone number is required',
                      pattern: {
                        value: /^(01[3-9]\d{8})$/,
                        message: 'Enter a valid Bangladeshi phone number (01XXXXXXXXX)',
                      },
                    })}
                    className={`w-full pl-10 pr-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition ${
                      errors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="01712345678"
                  />
                </div>
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
                )}
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Street Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    {...register('address', { required: 'Address is required' })}
                    className={`w-full pl-10 pr-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition ${
                      errors.address ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="House #, Road #, Area"
                  />
                </div>
                {errors.address && (
                  <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>
                )}
              </div>

              {/* City */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City / District <span className="text-red-500">*</span>
                </label>
                <select
                  {...register('city', { required: 'Please select your city' })}
                  className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition ${
                    errors.city ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select City</option>
                  <option value="Dhaka">Dhaka</option>
                  <option value="Chittagong">Chittagong</option>
                  <option value="Gazipur">Gazipur</option>
                  <option value="Narayanganj">Narayanganj</option>
                  <option value="Khulna">Khulna</option>
                  <option value="Rajshahi">Rajshahi</option>
                  <option value="Sylhet">Sylhet</option>
                  <option value="Barishal">Barishal</option>
                  <option value="Rangpur">Rangpur</option>
                  <option value="Mymensingh">Mymensingh</option>
                </select>
                {errors.city && (
                  <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Vehicle & License Section */}
          <div className="p-6 md:p-8 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-6">
              <Car className="w-5 h-5 text-indigo-500" />
              Vehicle & License Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Vehicle Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vehicle Type <span className="text-red-500">*</span>
                </label>
                <select
                  {...register('vehicleType', { required: 'Vehicle type is required' })}
                  onChange={(e) => setSelectedVehicle(e.target.value)}
                  className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition ${
                    errors.vehicleType ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select vehicle</option>
                  <option value="bike">Motorcycle / Bike</option>
                  <option value="scooter">Scooter</option>
                  <option value="car">Car / Microbus</option>
                  <option value="cnf">CNG / Auto-rickshaw</option>
                  <option value="bicycle">Bicycle</option>
                </select>
                {errors.vehicleType && (
                  <p className="text-red-500 text-xs mt-1">{errors.vehicleType.message}</p>
                )}
              </div>

              {/* License Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Driving License Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <IdCard className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    {...register('licenseNumber', { required: 'License number is required' })}
                    className={`w-full pl-10 pr-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition ${
                      errors.licenseNumber ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="e.g., DL-123456789"
                  />
                </div>
                {errors.licenseNumber && (
                  <p className="text-red-500 text-xs mt-1">{errors.licenseNumber.message}</p>
                )}
              </div>

              {/* Experience Years */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Experience (Years) <span className="text-red-500">*</span>
                </label>
                <select
                  {...register('experienceYears', { required: 'Experience is required' })}
                  className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition ${
                    errors.experienceYears ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select experience</option>
                  <option value="0">Fresher (No experience)</option>
                  <option value="1">1 year</option>
                  <option value="2">2 years</option>
                  <option value="3">3 years</option>
                  <option value="4">4 years</option>
                  <option value="5+">5+ years</option>
                </select>
                {errors.experienceYears && (
                  <p className="text-red-500 text-xs mt-1">{errors.experienceYears.message}</p>
                )}
              </div>

              {/* Available Hours */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Available Hours <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <select
                    {...register('availableHours', { required: 'Availability is required' })}
                    className={`w-full pl-10 pr-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition ${
                      errors.availableHours ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select availability</option>
                    <option value="full-time">Full Time (40+ hrs/week)</option>
                    <option value="part-time">Part Time (20-30 hrs/week)</option>
                    <option value="weekend">Weekends only</option>
                    <option value="evening">Evenings (after 5 PM)</option>
                  </select>
                </div>
                {errors.availableHours && (
                  <p className="text-red-500 text-xs mt-1">{errors.availableHours.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="p-6 md:p-8 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-6">
              <FileText className="w-5 h-5 text-indigo-500" />
              Emergency Contact
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Emergency Contact Name
                </label>
                <input
                  type="text"
                  {...register('emergencyContactName')}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                  placeholder="Name of a relative or friend"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Emergency Contact Number
                </label>
                <input
                  type="tel"
                  {...register('emergencyContact')}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                  placeholder="Phone number"
                />
              </div>
            </div>
          </div>

          {/* Terms & Conditions */}
          <div className="p-6 md:p-8 bg-gray-50">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                {...register('terms', { required: 'You must accept the terms to apply' })}
                className="mt-1 w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <span className="text-sm text-gray-600">
                I confirm that all information provided is true and correct. I agree to the{' '}
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    Swal.fire({
                      title: 'Terms of Service',
                      html: `
                        <div style="text-align: left; max-height: 400px; overflow-y: auto;">
                          <p><strong>1. Introduction</strong><br>Welcome to our rider platform. By applying, you agree to these terms...</p>
                          <p><strong>2. Responsibilities</strong><br>You must maintain a valid license and vehicle insurance...</p>
                          <p><strong>3. Delivery Standards</strong><br>Deliveries must be completed within the promised time...</p>
                          <p><strong>4. Payment Terms</strong><br>Earnings are calculated per delivery and paid weekly...</p>
                          <p><strong>5. Termination</strong><br>We reserve the right to terminate any rider for policy violations...</p>
                          <p><em>Full terms available upon request.</em></p>
                        </div>
                      `,
                      icon: 'info',
                      confirmButtonText: 'I Understand',
                      confirmButtonColor: '#4f46e5',
                      width: '600px',
                    });
                  }}
                  className="text-indigo-600 hover:underline cursor-pointer bg-transparent border-0 p-0 font-inherit"
                >
                  Terms of Service
                </button>{' '}
                and{' '}
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    Swal.fire({
                      title: 'Privacy Policy',
                      html: `
                        <div style="text-align: left; max-height: 400px; overflow-y: auto;">
                          <p><strong>Data Collection</strong><br>We collect your name, contact info, vehicle details, and location data to facilitate deliveries.</p>
                          <p><strong>Data Usage</strong><br>Your information is used only for delivery coordination, payment processing, and support.</p>
                          <p><strong>Data Sharing</strong><br>We do not sell your data. Limited info is shared with customers for delivery purposes.</p>
                          <p><strong>Security</strong><br>We use encryption and secure servers to protect your personal data.</p>
                          <p><strong>Your Rights</strong><br>You may request deletion of your data at any time by contacting support.</p>
                        </div>
                      `,
                      icon: 'info',
                      confirmButtonText: 'Got it',
                      confirmButtonColor: '#4f46e5',
                      width: '600px',
                    });
                  }}
                  className="text-indigo-600 hover:underline cursor-pointer bg-transparent border-0 p-0 font-inherit"
                >
                  Privacy Policy
                </button>.
              </span>
            </label>
            {errors.terms && (
              <p className="text-red-500 text-xs mt-2">{errors.terms.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="p-6 md:p-8 pt-0">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3.5 rounded-xl font-semibold text-lg hover:shadow-lg transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Submitting Application...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Submit Application
                </>
              )}
            </button>
            <p className="text-center text-xs text-gray-400 mt-4">
              We'll review your application and contact you within 2-3 business days.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RiderForm;
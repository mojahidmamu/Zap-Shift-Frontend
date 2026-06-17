    import React, { useState, useEffect } from 'react';
    import axios from 'axios';
    import { useNavigate } from 'react-router-dom';
    import { toast } from 'react-hot-toast';
    import { Mail, Lock, Shield, CheckCircle } from 'lucide-react';

    const AdminVerification = () => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState(1); // 1: email, 2: OTP
    const [loading, setLoading] = useState(false);
    const [timer, setTimer] = useState(0);
    const navigate = useNavigate();

    // Check if already verified (from localStorage)
    useEffect(() => {
        const verified = localStorage.getItem('adminVerified');
            if (verified === 'true') { 
            navigate('/admin-dashboard', { replace: true });
        }
    }, [navigate]);

    // Timer for resend OTP (60s)
    useEffect(() => {
        let interval;
        if (timer > 0) {
        interval = setInterval(() => setTimer(t => t - 1), 1000);
        }
        return () => clearInterval(interval);
    }, [timer]);

    const handleRequestOTP = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
        const res = await axios.post('http://localhost:5000/api/admin/request-otp', { email });
        toast.success('OTP sent to your email!');
        setStep(2);
        setTimer(60); // start cooldown
        } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to send OTP');
        } finally {
        setLoading(false);
        }
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.post('http://localhost:5000/api/admin/verify-otp', { email, otp });
            toast.success('OTP verified! Redirecting...');
            // Store verification flag and token
            localStorage.setItem('adminVerified', 'true');
            localStorage.setItem('verificationToken', res.data.verificationToken);
            navigate('/admin-dashboard', { replace: true });
        } catch (err) {
            toast.error(err.response?.data?.message || 'Invalid OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        if (timer > 0) return;
            setLoading(true);
        try {
            await axios.post('http://localhost:5000/api/admin/request-otp', { email });
            toast.success('OTP resent!');
            setTimer(60);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to resend OTP');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-100 p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
            <div className="text-center mb-8">
            <Shield className="w-12 h-12 text-indigo-600 mx-auto mb-3" />
            <h1 className="text-2xl font-bold text-gray-800">Admin Verification</h1>
            <p className="text-gray-500 text-sm">
                {step === 1
                ? 'Enter the registered admin email to receive a verification code.'
                : 'Enter the 6-digit code sent to your email.'}
            </p>
            </div>

            {step === 1 ? (
            <form onSubmit={handleRequestOTP}>
                <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Admin Email Address
                </label>
                <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter admin email address here"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                    />
                </div>
                </div>
                <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition disabled:opacity-50"
                >
                {loading ? (
                    <span className="flex items-center justify-center gap-2">
                    <span className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></span>
                    Sending...
                    </span>
                ) : (
                    'Send OTP'
                )}
                </button>
            </form>
            ) : (
            <form onSubmit={handleVerifyOTP}>
                <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    6-digit OTP
                </label>
                <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="Enter 6-digit OTP"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                    />
                </div>
                </div>
                <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition disabled:opacity-50"
                >
                {loading ? (
                    <span className="flex items-center justify-center gap-2">
                    <span className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></span>
                    Verifying...
                    </span>
                ) : (
                    'Verify OTP'
                )}
                </button>
                <div className="mt-4 text-center">
                <button
                    type="button"
                    onClick={handleResend}
                    disabled={timer > 0}
                    className={`text-sm ${timer > 0 ? 'text-gray-400' : 'text-indigo-600 hover:underline'}`}
                >
                    {timer > 0 ? `Resend in ${timer}s` : 'Resend OTP'}
                </button>
                </div>
            </form>
            )}
        </div>
        </div>
    );
    };

    export default AdminVerification;
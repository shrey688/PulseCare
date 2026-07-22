import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import { HeartPulse, Mail, Lock, Eye, EyeOff, LogIn, AlertCircle, ArrowLeft } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotMessage, setForgotMessage] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await API.post('/auth/signin', { email, password });
      const { token, id, role, name, profileId } = res.data;

      login(token, { id, email, role, name, profileId });

      switch (role) {
        case 'ADMIN': navigate('/admin'); break;
        case 'DOCTOR': navigate('/doctor'); break;
        case 'RECEPTIONIST': navigate('/receptionist'); break;
        case 'PATIENT': navigate('/patient'); break;
        default: navigate('/'); break;
      }
    } catch (err) {
      if (!err.response) {
        setError('Cannot connect to Backend Server. Please ensure the Spring Boot server is running on http://localhost:8080');
      } else {
        setError(err.response.data?.message || 'Login failed. Please check your credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setForgotMessage('');
    try {
      const res = await API.post('/auth/forgot-password', { email: forgotEmail });
      setForgotMessage(res.data.message);
    } catch (err) {
      setForgotMessage(err.response?.data?.message || 'Error requesting password reset.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg flex items-center justify-center p-4 relative overflow-hidden font-sans">

      {/* Background Gradients */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary-500/10 rounded-full blur-3xl" />

      <div className="max-w-md w-full glass-panel p-8 rounded-3xl shadow-2xl border border-gray-200 dark:border-dark-border space-y-6 relative z-10 animate-fade-in">

        {/* Back Link & Brand */}
        <div className="flex items-center justify-between">
          <Link to="/" className="text-xs font-semibold text-gray-500 hover:text-primary-500 flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary-600 text-white flex items-center justify-center font-bold">
              <HeartPulse className="w-4 h-4 animate-pulse" />
            </div>
            <span className="font-extrabold text-lg bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent">
              PulseCare
            </span>
          </div>
        </div>

        <div className="text-center space-y-1">
          <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">Welcome Back</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">Sign in to access your role-based dashboard</p>
        </div>

        {/* Quick Demo Credentials Buttons */}
        <div className="space-y-2 pt-2">
          <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 text-center">Quick Login</p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleQuickLogin('admin@hospital.com', 'admin123')}
              className="px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium hover:bg-primary-500 hover:text-white transition-colors"
            >
              Admin
            </button>
            <button
              onClick={() => handleQuickLogin('doctor@hospital.com', 'admin123')}
              className="px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium hover:bg-primary-500 hover:text-white transition-colors"
            >
              Doctor
            </button>
            <button
              onClick={() => handleQuickLogin('receptionist@hospital.com', 'admin123')}
              className="px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium hover:bg-primary-500 hover:text-white transition-colors"
            >
              Receptionist
            </button>
            <button
              onClick={() => handleQuickLogin('patient@hospital.com', 'admin123')}
              className="px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium hover:bg-primary-500 hover:text-white transition-colors"
            >
              Patient
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@hospital.com"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 border-none text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">Password</label>
              <button
                type="button"
                onClick={() => setShowForgot(true)}
                className="text-xs font-semibold text-primary-500 hover:underline"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 border-none text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-primary-600 to-secondary-600 text-white font-bold text-sm hover:opacity-90 shadow-lg shadow-primary-500/25 transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <LogIn className="w-4 h-4" /> Sign In
              </>
            )}
          </button>
        </form>

        <p className="text-center text-xs text-gray-500">
          Don't have a patient account?{' '}
          <Link to="/register" className="font-bold text-primary-500 hover:underline">
            Register Here
          </Link>
        </p>

      </div>

      {/* Forgot Password Modal */}
      {showForgot && (
        <div className="fixed inset-0 z-50 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-sm w-full bg-white dark:bg-dark-card p-6 rounded-2xl shadow-2xl space-y-4 animate-fade-in">
            <h3 className="font-bold text-lg text-gray-900 dark:text-white">Reset Password</h3>
            <p className="text-xs text-gray-500">Enter your email address to generate a reset code.</p>

            {forgotMessage && (
              <div className="p-3 rounded-xl bg-primary-500/10 text-primary-600 text-xs font-semibold">
                {forgotMessage}
              </div>
            )}

            <form onSubmit={handleForgotPassword} className="space-y-3">
              <input
                type="email"
                required
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                placeholder="Enter registered email"
                className="w-full px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-sm outline-none"
              />
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setShowForgot(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold border"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-primary-600 text-white"
                >
                  Reset Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;

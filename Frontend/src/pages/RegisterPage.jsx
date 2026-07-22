import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { HeartPulse, ArrowLeft, User, Mail, Lock, Phone, MapPin, Shield, CheckCircle, AlertCircle } from 'lucide-react';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    age: '',
    gender: 'Male',
    bloodGroup: 'O+',
    address: '',
    contactNumber: '',
    emergencyContact: '',
    insuranceDetails: '',
    medicalHistory: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await API.post('/auth/signup', {
        ...formData,
        age: parseInt(formData.age, 10)
      });
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      if (!err.response) {
        setError('Cannot connect to Backend Server. Please ensure the Spring Boot server is running on http://localhost:8080');
      } else {
        setError(err.response.data?.message || 'Registration failed. Please check inputs.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg flex items-center justify-center p-4 relative overflow-hidden font-sans">
      
      {/* Background Gradients */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary-500/10 rounded-full blur-3xl" />

      <div className="max-w-2xl w-full glass-panel p-8 rounded-3xl shadow-2xl border border-gray-200 dark:border-dark-border space-y-6 relative z-10 animate-fade-in my-8">
        
        {/* Back Link & Header */}
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
          <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">Patient Registration</h2>
          <p className="text-xs text-gray-500">Create a secure medical account to book appointments and view reports</p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-sm font-semibold flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            <span>Registration successful! Redirecting to login...</span>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          
          {/* Section 1: Account Credentials */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1">Email Address *</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="patient@example.com"
                autoComplete="off"
                className="w-full px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 border-none text-sm outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Password *</label>
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                autoComplete="new-password"
                className="w-full px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 border-none text-sm outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          {/* Section 2: Personal Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1">
              <label className="block text-xs font-semibold mb-1">Full Name *</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="w-full px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 border-none text-sm outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">Age *</label>
              <input
                type="number"
                name="age"
                required
                value={formData.age}
                onChange={handleChange}
                placeholder="Enter your age"
                className="w-full px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 border-none text-sm outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">Gender *</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 border-none text-sm outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1">Blood Group *</label>
              <select
                name="bloodGroup"
                value={formData.bloodGroup}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 border-none text-sm outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">Contact Number *</label>
              <input
                type="text"
                name="contactNumber"
                required
                value={formData.contactNumber}
                onChange={handleChange}
                placeholder="Enter 10-digit mobile number"
                className="w-full px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 border-none text-sm outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">Emergency Contact *</label>
              <input
                type="text"
                name="emergencyContact"
                required
                value={formData.emergencyContact}
                onChange={handleChange}
                placeholder="Enter emergency contact number"
                className="w-full px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 border-none text-sm outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1">Residential Address *</label>
            <input
              type="text"
              name="address"
              required
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter your residential address"
              className="w-full px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 border-none text-sm outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1">Insurance Policy Details (Optional)</label>
              <input
                type="text"
                name="insuranceDetails"
                value={formData.insuranceDetails}
                onChange={handleChange}
                placeholder="e.g. Star Health #12345"
                className="w-full px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 border-none text-sm outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">Past Medical History (Optional)</label>
              <input
                type="text"
                name="medicalHistory"
                value={formData.medicalHistory}
                onChange={handleChange}
                placeholder="e.g. Diabetes, Asthma"
                className="w-full px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 border-none text-sm outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-primary-600 text-white font-bold text-sm hover:bg-primary-700 shadow-lg shadow-primary-500/20 transition-all"
          >
            {loading ? 'Creating Account...' : 'Complete Registration'}
          </button>
        </form>

        <p className="text-center text-xs text-gray-500">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-primary-500 hover:underline">
            Sign In Here
          </Link>
        </p>

      </div>
    </div>
  );
};

export default RegisterPage;

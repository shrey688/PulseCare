import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, UserPlus, Users, UserCheck, Stethoscope,
  Building2, Calendar, FileText, CreditCard, BarChart3,
  Settings, LogOut, HeartPulse, X, ShieldAlert
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose, activeTab, setActiveTab }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const role = user?.role || 'PATIENT';

  // Navigation Items per role
  const getNavItems = () => {
    switch (role) {
      case 'ADMIN':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'doctors', label: 'Manage Doctors', icon: Stethoscope },
          { id: 'patients', label: 'Manage Patients', icon: Users },
          { id: 'receptionists', label: 'Manage Receptionists', icon: UserCheck },
          { id: 'departments', label: 'Departments', icon: Building2 },
          { id: 'appointments', label: 'Appointments', icon: Calendar },
          { id: 'records', label: 'Medical Records', icon: FileText },
          { id: 'billing', label: 'Billing', icon: CreditCard },
          { id: 'reports', label: 'Reports', icon: BarChart3 },
          { id: 'settings', label: 'Settings', icon: Settings },
        ];

      case 'DOCTOR':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'appointments', label: 'Appointments', icon: Calendar },
          { id: 'patients', label: 'Patient Records', icon: Users },
          { id: 'diagnosis', label: 'Add Diagnosis', icon: FileText },
          { id: 'settings', label: 'Profile & Availability', icon: Settings },
        ];

      case 'RECEPTIONIST':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'register-patient', label: 'Register Patient', icon: UserPlus },
          { id: 'book-appointment', label: 'Book Appointment', icon: Calendar },
          { id: 'billing', label: 'Billing & Invoices', icon: CreditCard },
          { id: 'admissions', label: 'Admission / Discharge', icon: Building2 },
          { id: 'settings', label: 'Settings', icon: Settings },
        ];

      case 'PATIENT':
      default:
        return [
          { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'book', label: 'Book Appointment', icon: Calendar },
          { id: 'records', label: 'Medical History', icon: FileText },
          { id: 'bills', label: 'Bills & Payments', icon: CreditCard },
          { id: 'settings', label: 'My Profile', icon: Settings },
        ];
    }
  };

  const navItems = getNavItems();

  return (
    <>
      {/* Backdrop for Mobile */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-gray-900/50 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar Drawer */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-white dark:bg-dark-card border-r border-gray-200 dark:border-dark-border flex flex-col justify-between transition-transform duration-300 transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div>
          {/* Header */}
          <div className="h-20 flex items-center justify-between px-6 border-b border-gray-100 dark:border-dark-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-600 to-secondary-500 flex items-center justify-center text-white shadow-md">
                <HeartPulse className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <span className="font-extrabold text-lg text-gray-900 dark:text-white">PulseCare</span>
                <span className="block text-[10px] uppercase font-bold text-primary-500">{role} PORTAL</span>
              </div>
            </div>
            <button onClick={onClose} className="lg:hidden p-1.5 text-gray-500 hover:text-gray-900 dark:hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5 overflow-y-auto max-h-[calc(100vh-160px)]">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    if (onClose) onClose();
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md shadow-primary-500/20'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/60 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-400 dark:text-gray-500'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Card & Logout */}
        <div className="p-4 border-t border-gray-100 dark:border-dark-border">
          <div className="mb-3 px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800/50 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400 font-bold flex items-center justify-center text-sm">
              {user?.name ? user.name.charAt(0) : 'U'}
            </div>
            <div className="overflow-hidden">
              <p className="font-semibold text-sm text-gray-900 dark:text-white truncate">{user?.name || 'User'}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-red-500/20 text-red-600 dark:text-red-400 hover:bg-red-500 hover:text-white dark:hover:bg-red-600 font-semibold text-sm transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { HeartPulse, Sun, Moon, LogOut, Menu, X, PhoneCall } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getDashboardPath = () => {
    if (!user) return '/login';
    switch (user.role) {
      case 'ADMIN': return '/admin';
      case 'DOCTOR': return '/doctor';
      case 'RECEPTIONIST': return '/receptionist';
      case 'PATIENT': return '/patient';
      default: return '/';
    }
  };

  return (
    <nav className="sticky top-0 z-50 glass-panel border-b border-gray-200 dark:border-gray-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-primary-600 to-secondary-500 flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform">
              <HeartPulse className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <span className="font-extrabold text-2xl tracking-tight bg-gradient-to-r from-primary-600 via-primary-500 to-secondary-500 bg-clip-text text-transparent">
                PulseCare
              </span>
              <span className="block text-[10px] font-medium tracking-widest uppercase text-gray-500 dark:text-gray-400">
                Hospital System
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8 font-medium text-sm text-gray-700 dark:text-gray-200">
            <a href="/#home" className="hover:text-primary-500 transition-colors">Home</a>
            <a href="/#about" className="hover:text-primary-500 transition-colors">About</a>
            <a href="/#departments" className="hover:text-primary-500 transition-colors">Departments</a>
            <a href="/#doctors" className="hover:text-primary-500 transition-colors">Doctors</a>
            <a href="/#facilities" className="hover:text-primary-500 transition-colors">Facilities</a>
            <a href="/#contact" className="hover:text-primary-500 transition-colors">Contact</a>
          </div>

          {/* Actions & Buttons */}
          <div className="hidden md:flex items-center gap-4">
            
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-700" />}
            </button>

            {/* Emergency Hotline Button */}
            <a
              href="tel:108"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 hover:bg-red-500 hover:text-white font-semibold text-sm transition-all shadow-sm"
            >
              <PhoneCall className="w-4 h-4 animate-bounce" />
              <span>Emergency 108</span>
            </a>

            {/* User Auth Buttons */}
            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  to={getDashboardPath()}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary-600 to-secondary-600 text-white font-semibold text-sm hover:opacity-90 shadow-md hover:shadow-lg transition-all"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40 dark:hover:text-red-400 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 font-semibold text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2.5 rounded-xl bg-primary-600 text-white font-semibold text-sm hover:bg-primary-700 shadow-md transition-all"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel border-t border-gray-200 dark:border-gray-800 px-4 pt-4 pb-6 space-y-4 animate-fade-in">
          <a href="/#home" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-base font-medium text-gray-700 dark:text-gray-200">Home</a>
          <a href="/#about" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-base font-medium text-gray-700 dark:text-gray-200">About</a>
          <a href="/#departments" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-base font-medium text-gray-700 dark:text-gray-200">Departments</a>
          <a href="/#doctors" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-base font-medium text-gray-700 dark:text-gray-200">Doctors</a>
          <a href="/#facilities" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-base font-medium text-gray-700 dark:text-gray-200">Facilities</a>
          <a href="/#contact" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-base font-medium text-gray-700 dark:text-gray-200">Contact</a>
          
          <div className="pt-4 border-t border-gray-200 dark:border-gray-800 flex flex-col gap-3">
            <a
              href="tel:108"
              className="flex items-center justify-center gap-2 py-3 rounded-xl bg-red-500 text-white font-semibold text-sm"
            >
              <PhoneCall className="w-4 h-4" /> Emergency Call 108
            </a>
            {user ? (
              <>
                <Link
                  to={getDashboardPath()}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-3 rounded-xl bg-primary-600 text-white font-semibold text-sm"
                >
                  Go to Dashboard
                </Link>
                <button
                  onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                  className="w-full py-3 rounded-xl border border-red-500/30 text-red-600 dark:text-red-400 font-semibold text-sm"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 font-semibold text-sm text-gray-700 dark:text-gray-200"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2.5 rounded-xl bg-primary-600 text-white font-semibold text-sm"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

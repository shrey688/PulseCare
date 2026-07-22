import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  Menu, Sun, Moon, Bell, Search, User, CheckCircle, ShieldCheck,
  Settings, LogOut, ChevronDown, Sparkles
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Header = ({
  onMenuClick,
  title = "Dashboard",
  notifications = [],
  onMarkRead,
  searchQuery = "",
  onSearchChange,
  onNavigateSettings
}) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const notifRef = useRef(null);
  const profileRef = useRef(null);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="h-20 bg-white/80 dark:bg-dark-card/80 backdrop-blur-md border-b border-gray-200 dark:border-dark-border sticky top-0 z-30 px-4 sm:px-8 flex items-center justify-between transition-colors duration-300">
      
      {/* Title & Mobile Toggle */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <Menu className="w-6 h-6" />
        </button>
        <div>
          <h1 className="font-bold text-xl sm:text-2xl text-gray-900 dark:text-white capitalize">{title}</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">Welcome back, {user?.name || 'Administrator'}</p>
        </div>
      </div>

      {/* Search Bar & Actions */}
      <div className="flex items-center gap-3 sm:gap-4">
        
        {/* Search Bar */}
        <div className="relative hidden md:block w-64 lg:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
            placeholder="Search doctors, patients, records..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 border border-transparent focus:border-primary-500/50 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
          />
        </div>

        {/* Theme Switcher */}
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          title="Toggle Theme"
        >
          {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-700" />}
        </button>

        {/* Notification Bell */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 relative transition-colors"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white dark:ring-dark-card animate-ping" />
            )}
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white dark:ring-dark-card" />
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white dark:bg-dark-card rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden z-50 animate-fade-in">
              <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gray-50/50 dark:bg-gray-800/50">
                <span className="font-bold text-sm text-gray-900 dark:text-white">System Notifications</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400 font-semibold">
                  {unreadCount} new
                </span>
              </div>
              
              <div className="max-h-80 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-800/50">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-sm text-gray-500 dark:text-gray-400 space-y-1">
                    <p className="font-medium">No new notifications</p>
                    <p className="text-xs text-gray-400">All recent activity looks clear!</p>
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => onMarkRead && onMarkRead(notif.id)}
                      className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-800/40 cursor-pointer transition-colors ${
                        !notif.isRead ? 'bg-primary-50/30 dark:bg-primary-950/20' : ''
                      }`}
                    >
                      <div className="flex gap-3 items-start">
                        <div className={`mt-0.5 p-1.5 rounded-lg ${!notif.isRead ? 'bg-primary-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'}`}>
                          <Bell className="w-3.5 h-3.5" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-gray-800 dark:text-gray-200 leading-snug">{notif.message}</p>
                          <span className="text-[10px] text-gray-400 mt-1 block">
                            {notif.createdAt ? new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile Menu Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-3 pl-2 sm:pl-4 border-l border-gray-200 dark:border-gray-800 hover:opacity-90 transition-opacity outline-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-600 to-indigo-600 text-white font-bold flex items-center justify-center text-base shadow-md">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
            </div>
            <div className="hidden sm:block text-left">
              <p className="font-semibold text-sm text-gray-900 dark:text-white leading-tight flex items-center gap-1">
                {user?.name || 'Admin'}
                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
              </p>
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary-500">
                {user?.role || 'ADMIN'}
              </span>
            </div>
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-3 w-64 bg-white dark:bg-dark-card rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden z-50 animate-fade-in p-2 space-y-1">
              <div className="p-3 bg-gray-50 dark:bg-gray-800/60 rounded-xl space-y-1">
                <p className="text-xs font-bold text-gray-900 dark:text-white truncate">{user?.name || 'Administrator'}</p>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate">{user?.email || 'admin@hospital.com'}</p>
                <div className="flex items-center gap-1.5 pt-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Super Admin Account</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  if (onNavigateSettings) onNavigateSettings();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <Settings className="w-4 h-4 text-gray-500" />
                <span>Account & Settings</span>
              </button>

              <button
                onClick={toggleTheme}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-slate-600" />}
                <span>Toggle {theme === 'dark' ? 'Light' : 'Dark'} Mode</span>
              </button>

              <div className="pt-1 border-t border-gray-100 dark:border-gray-800">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};

export default Header;

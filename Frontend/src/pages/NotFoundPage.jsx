import React from 'react';
import { Link } from 'react-router-dom';
import { HeartPulse, Home, AlertTriangle } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg flex items-center justify-center p-4 font-sans text-center">
      <div className="max-w-md w-full glass-panel p-8 rounded-3xl space-y-6 shadow-2xl border">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">404</h1>
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">Page Not Found</h2>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          The page or resource you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <Link
          to="/"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary-600 text-white font-bold text-sm shadow-lg hover:bg-primary-700 transition-all"
        >
          <Home className="w-4 h-4" /> Return to Homepage
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;

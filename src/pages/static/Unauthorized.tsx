import React from "react";
import { Link } from "react-router-dom";

const UnauthorizedPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col justify-between selection:bg-teal-100 selection:text-teal-900">
      {/* Main Content Card */}
      <main className="flex-grow flex items-center justify-center px-6 py-16">
        <div className="max-w-md w-full bg-white border border-slate-200 rounded-2xl shadow-sm p-8 text-center space-y-6">
          {/* Subtle Visual Security Indicator */}
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-50 text-amber-600 font-mono text-2xl font-black">
            401
          </div>

          {/* Heading Structure */}
          <div className="space-y-2">
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
              Access Denied
            </h1>
            <p className="text-sm text-slate-500 leading-relaxed">
              You do not have active authorization to view this portal. Please
              log in with a verified account to access your designated platform
              dashboard.
            </p>
          </div>

          <hr className="border-slate-100" />

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/login"
              className="w-full sm:w-auto px-6 py-2.5 bg-teal-600 hover:bg-teal-700 font-semibold text-white text-sm rounded-lg shadow-sm transition duration-150 text-center"
            >
              Log In
            </Link>
            <Link
              to="/"
              className="w-full sm:w-auto px-6 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold text-sm rounded-lg shadow-sm transition duration-150 text-center"
            >
              Return Home
            </Link>
          </div>
        </div>
      </main>

      {/* Footer Interface Tracker */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
          Noor Platform • حماية البيانات والخصوصية
        </p>
      </footer>
    </div>
  );
};

export default UnauthorizedPage;

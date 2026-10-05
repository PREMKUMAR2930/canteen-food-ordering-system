import React from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Phone, Shield, Calendar, LogOut, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-8">
        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row items-center gap-5 pb-6 border-b border-slate-100 text-center sm:text-left">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-orange-600 to-amber-500 text-white flex items-center justify-center font-black text-2xl shadow-lg shadow-orange-500/30">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h1 className="text-2xl font-extrabold text-slate-900">{user?.name}</h1>
              <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-700 border border-orange-200">
                {user?.role}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">{user?.email}</p>
          </div>

          <button
            onClick={handleLogout}
            className="px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl border border-red-200 transition-colors flex items-center gap-1.5"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>

        {/* Account Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-white text-slate-600 flex items-center justify-center border border-slate-200 shadow-2xs">
              <User className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Full Name</span>
              <span className="font-bold text-sm text-slate-900">{user?.name}</span>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-white text-slate-600 flex items-center justify-center border border-slate-200 shadow-2xs">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Email</span>
              <span className="font-bold text-sm text-slate-900">{user?.email}</span>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-white text-slate-600 flex items-center justify-center border border-slate-200 shadow-2xs">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Phone</span>
              <span className="font-bold text-sm text-slate-900">{user?.phone || 'Not provided'}</span>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-white text-slate-600 flex items-center justify-center border border-slate-200 shadow-2xs">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400 block">System Role</span>
              <span className="font-bold text-sm text-slate-900">{user?.role}</span>
            </div>
          </div>
        </div>

        {/* Quick Navigation Links */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
          {user?.role === 'STUDENT' ? (
            <>
              <Link
                to="/orders"
                className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl text-center transition-colors flex items-center justify-center gap-2"
              >
                View My Orders <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                to="/dashboard"
                className="flex-1 py-3 px-4 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl text-center transition-colors flex items-center justify-center gap-2 shadow-md shadow-orange-600/20"
              >
                Browse Menu <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </>
          ) : (
            <Link
              to="/admin/dashboard"
              className="w-full py-3 px-4 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl text-center transition-colors flex items-center justify-center gap-2 shadow-md shadow-orange-600/20"
            >
              Go to Admin Dashboard <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

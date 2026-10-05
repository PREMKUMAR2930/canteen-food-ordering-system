import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UtensilsCrossed, Lock, Mail, ArrowRight, ShieldCheck, UserCheck, Shield } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [activeRole, setActiveRole] = useState<'STUDENT' | 'ADMIN'>('STUDENT');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleRoleSelect = (role: 'STUDENT' | 'ADMIN') => {
    setActiveRole(role);
    setError(null);
    setEmail('');
    setPassword('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in both email and password.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const authData = await login({ email, password });
      if (authData.user.role === 'ADMIN') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        const from = (location.state as any)?.from?.pathname || '/dashboard';
        navigate(from, { replace: true });
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message || err.message || 'Invalid email or password. Please check your credentials.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50">
        {/* Header */}
        <div className="text-center">
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white mx-auto shadow-lg transition-all duration-300 ${
              activeRole === 'ADMIN'
                ? 'bg-gradient-to-tr from-slate-900 to-indigo-700 shadow-indigo-500/30'
                : 'bg-gradient-to-tr from-orange-600 to-amber-500 shadow-orange-500/30'
            }`}
          >
            {activeRole === 'ADMIN' ? (
              <Shield className="w-7 h-7" />
            ) : (
              <UtensilsCrossed className="w-7 h-7" />
            )}
          </div>
          <h2 className="mt-4 text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {activeRole === 'ADMIN' ? 'Staff & Admin Portal' : 'Student Portal Sign In'}
          </h2>
          <p className="mt-1.5 text-xs sm:text-sm text-slate-500">
            {activeRole === 'ADMIN'
              ? 'Sign in to access kitchen orders, food inventory & sales'
              : 'Sign in to browse food menu, order meals & track pickup status'}
          </p>
        </div>

        {/* Role Switcher Tabs */}
        <div className="p-1.5 bg-slate-100 rounded-2xl grid grid-cols-2 gap-1 border border-slate-200">
          <button
            type="button"
            onClick={() => handleRoleSelect('STUDENT')}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-extrabold transition-all duration-200 ${
              activeRole === 'STUDENT'
                ? 'bg-white text-orange-600 shadow-md scale-101 border border-orange-100'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            Student Login
          </button>
          <button
            type="button"
            onClick={() => handleRoleSelect('ADMIN')}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-extrabold transition-all duration-200 ${
              activeRole === 'ADMIN'
                ? 'bg-slate-900 text-white shadow-md scale-101'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Admin Login
          </button>
        </div>

        {error && (
          <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs font-semibold text-red-700 flex items-center gap-2">
            <span>{error}</span>
          </div>
        )}

        <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              {activeRole === 'ADMIN' ? 'Admin Email Address' : 'College Email Address'}
            </label>
            <div className="relative">
              <Mail className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={activeRole === 'ADMIN' ? 'admin@college.edu' : 'student@college.edu'}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full mt-2 py-3.5 px-4 text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all hover:scale-101 active:scale-99 disabled:opacity-50 ${
              activeRole === 'ADMIN'
                ? 'bg-slate-900 hover:bg-slate-800 shadow-slate-900/30'
                : 'bg-orange-600 hover:bg-orange-700 shadow-orange-600/30'
            }`}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                {activeRole === 'ADMIN' ? 'Sign In to Admin Dashboard' : 'Sign In as Student'}
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-100">
          <p className="text-xs text-slate-500">
            {activeRole === 'STUDENT' ? (
              <>
                New student?{' '}
                <Link to="/register" className="font-bold text-orange-600 hover:underline">
                  Create student account
                </Link>
              </>
            ) : (
              <span className="text-[11px] text-slate-400">
                Authorized canteen administrative &amp; billing staff access only.
              </span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

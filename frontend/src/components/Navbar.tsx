import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import {
  UtensilsCrossed,
  ShoppingCart,
  Clock,
  LayoutDashboard,
  LogOut,
  User as UserIcon,
  Menu,
  X,
  PlusCircle,
  FolderTree,
  ClipboardList,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, isAdmin, isStudent, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <Link
            to={isAdmin ? '/admin/dashboard' : '/dashboard'}
            className="flex items-center gap-2.5 group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform duration-200">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-lg text-slate-900 tracking-tight flex items-center gap-1.5">
                CAMPUS<span className="text-orange-600">CANTEEN</span>
              </span>
              <span className="text-[10px] font-semibold text-slate-400 block -mt-1 tracking-wider uppercase">
                Food Ordering System
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5">
            {isAuthenticated ? (
              <>
                {/* Student Links */}
                {isStudent && (
                  <>
                    <Link
                      to="/dashboard"
                      className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isActive('/dashboard') || isActive('/foods')
                          ? 'bg-orange-50 text-orange-600 font-semibold'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      Menu
                    </Link>
                    <Link
                      to="/orders"
                      className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                        isActive('/orders')
                          ? 'bg-orange-50 text-orange-600 font-semibold'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      <Clock className="w-4 h-4" />
                      My Orders
                    </Link>
                    <Link
                      to="/cart"
                      className="relative p-2 rounded-lg text-slate-600 hover:text-orange-600 hover:bg-orange-50 transition-colors ml-1"
                      title="Shopping Cart"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      {totalItems > 0 && (
                        <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-xs animate-pulse">
                          {totalItems}
                        </span>
                      )}
                    </Link>
                  </>
                )}

                {/* Admin Links */}
                {isAdmin && (
                  <>
                    <Link
                      to="/admin/dashboard"
                      className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                        isActive('/admin/dashboard')
                          ? 'bg-orange-50 text-orange-600 font-semibold'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </Link>
                    <Link
                      to="/admin/orders"
                      className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                        isActive('/admin/orders')
                          ? 'bg-orange-50 text-orange-600 font-semibold'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      <ClipboardList className="w-4 h-4" />
                      Orders
                    </Link>
                    <Link
                      to="/admin/foods"
                      className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                        isActive('/admin/foods')
                          ? 'bg-orange-50 text-orange-600 font-semibold'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      <PlusCircle className="w-4 h-4" />
                      Food Items
                    </Link>
                    <Link
                      to="/admin/categories"
                      className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                        isActive('/admin/categories')
                          ? 'bg-orange-50 text-orange-600 font-semibold'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      <FolderTree className="w-4 h-4" />
                      Categories
                    </Link>
                  </>
                )}

                {/* User Dropdown / Profile & Logout */}
                <div className="flex items-center gap-3 pl-3 border-l border-slate-200 ml-2">
                  <Link
                    to="/profile"
                    className="flex items-center gap-2 text-slate-700 hover:text-orange-600 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs border border-slate-300">
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="text-left hidden lg:block">
                      <span className="text-xs font-semibold block text-slate-900 truncate max-w-[120px]">
                        {user?.name}
                      </span>
                      <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider block">
                        {user?.role}
                      </span>
                    </div>
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Logout"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold text-white bg-orange-600 hover:bg-orange-700 rounded-lg shadow-sm shadow-orange-600/30 transition-all hover:shadow-md"
                >
                  Register
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile menu button */}
          <div className="flex items-center gap-2 md:hidden">
            {isAuthenticated && isStudent && (
              <Link
                to="/cart"
                className="relative p-2 rounded-lg text-slate-700 hover:text-orange-600"
              >
                <ShoppingCart className="w-6 h-6" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-xs">
                    {totalItems}
                  </span>
                )}
              </Link>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-6 space-y-2 shadow-xl animate-in slide-in-from-top-4 duration-200">
          {isAuthenticated ? (
            <>
              <div className="py-2.5 px-3 bg-slate-50 rounded-xl mb-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-sm">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-sm text-slate-900">{user?.name}</p>
                  <p className="text-xs text-slate-500">{user?.email}</p>
                  <span className="inline-block mt-0.5 text-[10px] font-bold text-orange-600 uppercase bg-orange-50 px-1.5 py-0.5 rounded">
                    {user?.role}
                  </span>
                </div>
              </div>

              {isStudent && (
                <>
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-orange-50 hover:text-orange-600"
                  >
                    Browse Food Menu
                  </Link>
                  <Link
                    to="/orders"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-orange-50 hover:text-orange-600"
                  >
                    My Order History
                  </Link>
                  <Link
                    to="/cart"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-orange-50 hover:text-orange-600"
                  >
                    My Cart ({totalItems})
                  </Link>
                </>
              )}

              {isAdmin && (
                <>
                  <Link
                    to="/admin/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-orange-50 hover:text-orange-600"
                  >
                    Admin Dashboard
                  </Link>
                  <Link
                    to="/admin/orders"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-orange-50 hover:text-orange-600"
                  >
                    Manage Orders
                  </Link>
                  <Link
                    to="/admin/foods"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-orange-50 hover:text-orange-600"
                  >
                    Manage Food Items
                  </Link>
                  <Link
                    to="/admin/categories"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-orange-50 hover:text-orange-600"
                  >
                    Manage Categories
                  </Link>
                </>
              )}

              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                My Profile
              </Link>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-red-600 hover:bg-red-50 flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </>
          ) : (
            <div className="space-y-2 pt-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center px-4 py-2.5 rounded-lg text-sm font-semibold text-slate-700 bg-slate-100"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center px-4 py-2.5 rounded-lg text-sm font-semibold text-white bg-orange-600"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

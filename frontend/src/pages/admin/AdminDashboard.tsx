import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService, orderService } from '../../services/api';
import { DashboardStats, OrderStatus, OrderResponse } from '../../types';
import {
  TrendingUp,
  ShoppingBag,
  IndianRupee,
  Utensils,
  Users,
  Clock,
  ArrowRight,
  PlusCircle,
  FolderTree,
  ClipboardList,
  RefreshCw,
  CheckCircle2,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingOrderId, setUpdatingOrderId] = useState<number | null>(null);

  useEffect(() => {
    fetchStats();
    // Auto-refresh admin stats every 10 seconds
    const interval = setInterval(() => {
      fetchStats(false);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchStats = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      const res = await adminService.getDashboardStats();
      if (res.success) {
        setStats(res.data);
      }
    } catch (err: any) {
      console.error('Failed to load admin stats:', err);
      if (showLoading) setError('Failed to load dashboard metrics.');
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  const handleStatusChange = async (orderId: number, newStatus: OrderStatus) => {
    setUpdatingOrderId(orderId);
    try {
      const res = await orderService.updateOrderStatus(orderId, newStatus);
      if (res.success) {
        setStats((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            recentOrders: prev.recentOrders.map((o) =>
              o.id === orderId ? { ...o, status: newStatus } : o
            ),
          };
        });
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update order status');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'PLACED':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'CONFIRMED':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'PREPARING':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'READY':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200 font-bold';
      case 'COMPLETED':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      case 'CANCELLED':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <span className="text-[10px] font-bold text-orange-600 uppercase bg-orange-50 px-2 py-0.5 rounded-md">
            Canteen Operations
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Admin Management Dashboard 📊
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Real-time food orders, canteen revenue, and inventory statistics
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => fetchStats(true)}
            className="p-2.5 text-slate-600 hover:text-orange-600 hover:bg-white rounded-xl border border-slate-200 shadow-2xs transition-colors flex items-center gap-1.5 text-xs font-semibold"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </button>
          <Link
            to="/admin/foods"
            className="px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold shadow-md shadow-orange-600/20 transition-all flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            Add Food Item
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 animate-pulse">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-32 bg-white rounded-3xl border border-slate-200"></div>
          ))}
        </div>
      ) : error ? (
        <div className="p-6 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-center">
          <p className="font-bold">{error}</p>
        </div>
      ) : stats ? (
        <>
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Total Revenue */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs relative overflow-hidden group hover:border-emerald-300 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Total Revenue
                </span>
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                  <IndianRupee className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-3xl font-black text-slate-900 tracking-tight">
                  ₹{Number(stats.totalRevenue).toFixed(0)}
                </span>
                <p className="text-xs text-emerald-600 font-semibold mt-1">
                  ₹{Number(stats.todayRevenue).toFixed(0)} earned today
                </p>
              </div>
            </div>

            {/* Total Orders */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs relative overflow-hidden group hover:border-blue-300 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Total Orders
                </span>
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <ShoppingBag className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-3xl font-black text-slate-900 tracking-tight">
                  {stats.totalOrders}
                </span>
                <p className="text-xs text-blue-600 font-semibold mt-1">
                  {stats.todayOrders} orders today
                </p>
              </div>
            </div>

            {/* Active Menu Items */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs relative overflow-hidden group hover:border-orange-300 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Food Catalog
                </span>
                <div className="w-10 h-10 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold">
                  <Utensils className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-3xl font-black text-slate-900 tracking-tight">
                  {stats.totalFoodItems}
                </span>
                <p className="text-xs text-orange-600 font-semibold mt-1">
                  {stats.availableFoodItems} in stock today
                </p>
              </div>
            </div>

            {/* Registered Students */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs relative overflow-hidden group hover:border-purple-300 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Students Registered
                </span>
                <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                  <Users className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-3xl font-black text-slate-900 tracking-tight">
                  {stats.totalStudents}
                </span>
                <p className="text-xs text-purple-600 font-semibold mt-1">Active college users</p>
              </div>
            </div>
          </div>

          {/* Quick Shortcuts */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link
              to="/admin/orders"
              className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-orange-300 hover:shadow-md transition-all flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
                <ClipboardList className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">All Orders</h4>
                <p className="text-xs text-slate-500">Filter, process &amp; update tokens</p>
              </div>
            </Link>

            <Link
              to="/admin/foods"
              className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-orange-300 hover:shadow-md transition-all flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <PlusCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Food Inventory</h4>
                <p className="text-xs text-slate-500">Add, edit prices &amp; toggle availability</p>
              </div>
            </Link>

            <Link
              to="/admin/categories"
              className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-orange-300 hover:shadow-md transition-all flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <FolderTree className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Category Groups</h4>
                <p className="text-xs text-slate-500">Manage Breakfast, Lunch, Snacks, etc.</p>
              </div>
            </Link>
          </div>

          {/* Recent Orders Table */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">
                  Recent Incoming Orders
                </h2>
                <p className="text-xs text-slate-500">
                  Live feed of student counter requests
                </p>
              </div>

              <Link
                to="/admin/orders"
                className="text-xs font-bold text-orange-600 hover:underline flex items-center gap-1"
              >
                View all orders <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="py-3 px-4">Order #</th>
                    <th className="py-3 px-4">Student</th>
                    <th className="py-3 px-4">Items</th>
                    <th className="py-3 px-4">Total</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Quick Update</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {stats.recentOrders.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400">
                        No orders recorded yet today.
                      </td>
                    </tr>
                  ) : (
                    stats.recentOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                          #{order.orderNumber}
                        </td>
                        <td className="py-3.5 px-4">
                          <p className="font-bold text-slate-800">{order.userName}</p>
                          <p className="text-[11px] text-slate-400">{order.userPhone}</p>
                        </td>
                        <td className="py-3.5 px-4 text-slate-600 max-w-xs">
                          {order.items.map((i) => `${i.foodName} (${i.quantity})`).join(', ')}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-slate-900">
                          ₹{Number(order.totalAmount).toFixed(0)}
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(
                              order.status
                            )}`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <select
                            value={order.status}
                            disabled={updatingOrderId === order.id}
                            onChange={(e) =>
                              handleStatusChange(order.id, e.target.value as OrderStatus)
                            }
                            className="bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold py-1 px-2 text-slate-700 focus:outline-none focus:ring-1 focus:ring-orange-500 cursor-pointer"
                          >
                            <option value="PLACED">PLACED</option>
                            <option value="CONFIRMED">CONFIRMED</option>
                            <option value="PREPARING">PREPARING</option>
                            <option value="READY">READY</option>
                            <option value="COMPLETED">COMPLETED</option>
                            <option value="CANCELLED">CANCELLED</option>
                          </select>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
};

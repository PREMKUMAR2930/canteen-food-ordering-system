import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { orderService } from '../services/api';
import { OrderResponse, OrderStatus } from '../types';
import {
  Clock,
  ChevronRight,
  ShoppingBag,
  RefreshCw,
  XCircle,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

export const OrderHistoryPage: React.FC = () => {
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await orderService.getMyOrders();
      if (res.success) {
        setOrders(res.data);
      }
    } catch (err: any) {
      console.error('Failed to load order history:', err);
      setError('Could not retrieve orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId: number) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;

    setActionLoading(orderId);
    try {
      const res = await orderService.cancelOrder(orderId);
      if (res.success) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: 'CANCELLED' as OrderStatus } : o))
        );
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to cancel order.');
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'PLACED':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'CONFIRMED':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'PREPARING':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'READY':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 animate-pulse';
      case 'COMPLETED':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      case 'CANCELLED':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Clock className="w-7 h-7 text-orange-600" />
            My Orders
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track your live orders or review past canteen purchase history
          </p>
        </div>

        <button
          onClick={fetchOrders}
          className="p-2 text-slate-600 hover:text-orange-600 hover:bg-white rounded-xl border border-slate-200 shadow-2xs transition-colors"
          title="Refresh orders"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {loading ? (
        <div className="space-y-4 animate-pulse">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-28 bg-white rounded-2xl border border-slate-200"></div>
          ))}
        </div>
      ) : error ? (
        <div className="p-6 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-center">
          <p className="font-bold">{error}</p>
          <button
            onClick={fetchOrders}
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-bold"
          >
            Try Again
          </button>
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center max-w-md mx-auto shadow-sm">
          <div className="w-16 h-16 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h3 className="font-bold text-slate-900 text-lg">No orders placed yet</h3>
          <p className="text-xs text-slate-500 mt-1">
            You haven't ordered any food yet. Check out today's delicious menu!
          </p>
          <Link
            to="/dashboard"
            className="inline-block mt-4 px-5 py-2.5 bg-orange-600 text-white rounded-xl text-xs font-bold hover:bg-orange-700 transition-colors shadow-md shadow-orange-600/20"
          >
            Explore Menu &amp; Order
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:border-orange-300 hover:shadow-md transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              {/* Order Meta */}
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="font-mono font-extrabold text-slate-900 text-base">
                    #{order.orderNumber}
                  </span>
                  <span
                    className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${getStatusBadge(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    {formatDate(order.orderDate)}
                  </span>
                </div>

                {/* Items preview snippet */}
                <div className="text-xs text-slate-600 flex items-center gap-2 flex-wrap">
                  {order.items?.map((item, idx) => (
                    <span
                      key={item.id}
                      className="bg-slate-100 px-2 py-0.5 rounded-md text-slate-700 font-medium"
                    >
                      {item.foodName} &times; {item.quantity}
                    </span>
                  ))}
                </div>
              </div>

              {/* Amount & Actions */}
              <div className="flex items-center justify-between md:justify-end gap-4 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                <div className="text-left md:text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Total</span>
                  <span className="text-lg font-extrabold text-slate-900">
                    ₹{Number(order.totalAmount).toFixed(0)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {order.status === 'PLACED' && (
                    <button
                      onClick={() => handleCancelOrder(order.id)}
                      disabled={actionLoading === order.id}
                      className="px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl border border-rose-200 transition-colors disabled:opacity-50"
                      title="Cancel this order"
                    >
                      Cancel
                    </button>
                  )}

                  <Link
                    to={`/orders/track/${order.orderNumber}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
                  >
                    Track Status
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

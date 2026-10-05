import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { orderService } from '../services/api';
import { OrderResponse } from '../types';
import { OrderStatusStepper } from '../components/OrderStatusStepper';
import {
  ArrowLeft,
  RefreshCw,
  Sparkles,
  ShoppingBag,
  Clock,
  Printer,
  Coins,
  MapPin,
  CheckCircle2,
} from 'lucide-react';

export const OrderTrackingPage: React.FC = () => {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const location = useLocation();
  const isNewOrder = (location.state as any)?.newOrder;

  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());

  useEffect(() => {
    if (orderNumber) {
      fetchOrderDetails();
      // Auto-poll every 6 seconds for live status updates from admin
      const interval = setInterval(() => {
        fetchOrderDetails(false);
      }, 6000);
      return () => clearInterval(interval);
    }
  }, [orderNumber]);

  const fetchOrderDetails = async (showLoading = true) => {
    if (!orderNumber) return;
    try {
      if (showLoading) setLoading(true);
      const res = await orderService.trackByOrderNumber(orderNumber);
      if (res.success && res.data) {
        setOrder(res.data);
        setLastRefreshed(new Date());
      }
    } catch (err: any) {
      console.error('Failed to load order details:', err);
      if (showLoading) {
        setError(err.response?.data?.message || 'Could not find order with this number.');
      }
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-sm font-semibold text-slate-600">Loading order tracking...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">Order Not Found</h2>
          <p className="text-xs text-slate-500 mt-2">{error || 'Invalid order reference.'}</p>
          <Link
            to="/orders"
            className="inline-block mt-6 px-5 py-2.5 bg-orange-600 text-white rounded-xl text-xs font-bold"
          >
            Go to My Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <Link
          to="/orders"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-orange-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to My Orders
        </Link>

        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-400 hidden sm:inline">
            Auto-refreshing &bull; Updated {lastRefreshed.toLocaleTimeString()}
          </span>
          <button
            onClick={() => fetchOrderDetails(false)}
            className="p-2 text-slate-600 hover:text-orange-600 hover:bg-white rounded-xl border border-slate-200 shadow-2xs transition-colors"
            title="Refresh now"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handlePrint}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-white rounded-xl border border-slate-200 shadow-2xs transition-colors"
            title="Print Receipt"
          >
            <Printer className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Success banner if redirected right after placing order */}
      {isNewOrder && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3 text-emerald-800 animate-in fade-in duration-300">
          <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0" />
          <div>
            <h4 className="font-bold text-sm">Order Placed Successfully!</h4>
            <p className="text-xs text-emerald-700">
              The canteen kitchen has received your order and is getting ready to prepare it.
            </p>
          </div>
        </div>
      )}

      {/* Main Order Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        {/* Header Information */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-orange-600 bg-orange-50 px-2.5 py-1 rounded-md">
              Order Token #
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 font-mono tracking-tight">
              {order.orderNumber}
            </h1>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              Placed on {new Date(order.orderDate).toLocaleString('en-IN')}
            </p>
          </div>

          <div className="text-left sm:text-right bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Total Amount</span>
            <span className="text-2xl font-black text-orange-600">
              ₹{Number(order.totalAmount).toFixed(0)}
            </span>
            <span className="text-[11px] font-semibold text-slate-500 block">Pay at Counter</span>
          </div>
        </div>

        {/* Live Status Progress Stepper */}
        <div>
          <h3 className="font-bold text-slate-900 text-sm mb-2">Live Order Status</h3>
          <OrderStatusStepper status={order.status} />
        </div>

        {/* Pickup Notice */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-start gap-3 text-xs text-slate-700">
          <MapPin className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-slate-900">Pickup Counter: Main College Canteen Counter #2</p>
            <p className="text-slate-500 mt-0.5">
              Please show your Order Token <strong className="text-slate-800">#{order.orderNumber}</strong> at the billing counter to collect your food when status is <strong className="text-emerald-600">READY</strong>.
            </p>
          </div>
        </div>

        {/* Itemized Food List */}
        <div>
          <h3 className="font-bold text-slate-900 text-sm mb-3">Order Items ({order.items.length})</h3>
          <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden">
            {order.items.map((item) => (
              <div key={item.id} className="p-3.5 sm:p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={item.imageUrl}
                    alt={item.foodName}
                    className="w-12 h-12 rounded-xl object-cover bg-slate-100 border border-slate-200 flex-shrink-0"
                  />
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">{item.foodName}</h4>
                    <p className="text-xs text-slate-500">
                      ₹{Number(item.price).toFixed(0)} &times; {item.quantity}
                    </p>
                  </div>
                </div>

                <span className="font-extrabold text-sm text-slate-900">
                  ₹{Number(item.subtotal).toFixed(0)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Student Details */}
        <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <span className="text-slate-400 block font-semibold">Student Name</span>
            <span className="font-bold text-slate-900">{order.userName}</span>
          </div>
          <div>
            <span className="text-slate-400 block font-semibold">Email</span>
            <span className="font-bold text-slate-900">{order.userEmail}</span>
          </div>
          <div>
            <span className="text-slate-400 block font-semibold">Phone</span>
            <span className="font-bold text-slate-900">{order.userPhone}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

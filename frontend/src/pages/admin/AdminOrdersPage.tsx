import React, { useState, useEffect } from 'react';
import { orderService } from '../../services/api';
import { OrderResponse, OrderStatus } from '../../types';
import {
  ClipboardList,
  Search,
  RefreshCw,
  Eye,
  CheckCircle2,
  ChefHat,
  BellRing,
  Check,
  XCircle,
  X,
  Phone,
  Mail,
  User,
} from 'lucide-react';

const statusTabs: { label: string; value: string }[] = [
  { label: 'All Orders', value: 'ALL' },
  { label: 'Placed', value: 'PLACED' },
  { label: 'Confirmed', value: 'CONFIRMED' },
  { label: 'Preparing', value: 'PREPARING' },
  { label: 'Ready', value: 'READY' },
  { label: 'Completed', value: 'COMPLETED' },
  { label: 'Cancelled', value: 'CANCELLED' },
];

export const AdminOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  // View modal state
  const [selectedOrder, setSelectedOrder] = useState<OrderResponse | null>(null);

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(() => {
      fetchOrders(false);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      const res = await orderService.getAllOrders();
      if (res.success) {
        setOrders(res.data);
      }
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId: number, nextStatus: OrderStatus) => {
    setUpdatingId(orderId);
    try {
      const res = await orderService.updateOrderStatus(orderId, nextStatus);
      if (res.success) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: nextStatus } : o))
        );
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder({ ...selectedOrder, status: nextStatus });
        }
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update order status');
    } finally {
      setUpdatingId(null);
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
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 font-bold animate-pulse';
      case 'COMPLETED':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      case 'CANCELLED':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesTab = activeTab === 'ALL' || order.status === activeTab;
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.userPhone.includes(searchQuery);
    return matchesTab && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <ClipboardList className="w-7 h-7 text-orange-600" />
            Kitchen &amp; Counter Orders
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Accept, prepare and hand over food orders to students in real-time
          </p>
        </div>

        <button
          onClick={() => fetchOrders(true)}
          className="p-2.5 text-slate-600 hover:text-orange-600 hover:bg-white rounded-xl border border-slate-200 shadow-2xs transition-colors self-start sm:self-auto flex items-center gap-1.5 text-xs font-semibold"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Refresh Feed
        </button>
      </div>

      {/* Tabs & Search */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {statusTabs.map((tab) => {
            const count =
              tab.value === 'ALL'
                ? orders.length
                : orders.filter((o) => o.status === tab.value).length;
            return (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  activeTab === tab.value
                    ? 'bg-orange-600 text-white shadow-md shadow-orange-600/30'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {tab.label}
                <span
                  className={`px-1.5 py-0.2 rounded-md text-[10px] ${
                    activeTab === tab.value ? 'bg-orange-700 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Order #, student name or phone..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-xs"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-3.5 px-4">Order Token</th>
                <th className="py-3.5 px-4">Student</th>
                <th className="py-3.5 px-4">Items Summary</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Current Status</th>
                <th className="py-3.5 px-4 text-right">Workflow Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    Loading orders...
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No orders in this view.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      #{order.orderNumber}
                      <span className="block text-[10px] text-slate-400 font-normal">
                        {new Date(order.orderDate).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <p className="font-bold text-slate-900">{order.userName}</p>
                      <p className="text-[11px] text-slate-400">{order.userPhone}</p>
                    </td>

                    <td className="py-3.5 px-4 text-slate-600 max-w-xs">
                      {order.items.map((i) => `${i.foodName} (${i.quantity})`).join(', ')}
                    </td>

                    <td className="py-3.5 px-4 font-extrabold text-slate-900">
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
                      <div className="flex items-center justify-end gap-1.5 flex-wrap">
                        {order.status === 'PLACED' && (
                          <button
                            disabled={updatingId === order.id}
                            onClick={() => handleUpdateStatus(order.id, 'CONFIRMED')}
                            className="px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[11px] font-bold shadow-2xs transition-colors"
                          >
                            Confirm
                          </button>
                        )}

                        {order.status === 'CONFIRMED' && (
                          <button
                            disabled={updatingId === order.id}
                            onClick={() => handleUpdateStatus(order.id, 'PREPARING')}
                            className="px-2.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-[11px] font-bold shadow-2xs transition-colors"
                          >
                            Cook / Prepare
                          </button>
                        )}

                        {order.status === 'PREPARING' && (
                          <button
                            disabled={updatingId === order.id}
                            onClick={() => handleUpdateStatus(order.id, 'READY')}
                            className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold shadow-2xs transition-colors"
                          >
                            Mark Ready
                          </button>
                        )}

                        {order.status === 'READY' && (
                          <button
                            disabled={updatingId === order.id}
                            onClick={() => handleUpdateStatus(order.id, 'COMPLETED')}
                            className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-[11px] font-bold shadow-2xs transition-colors"
                          >
                            Handover &amp; Complete
                          </button>
                        )}

                        {order.status !== 'COMPLETED' && order.status !== 'CANCELLED' && (
                          <button
                            disabled={updatingId === order.id}
                            onClick={() => handleUpdateStatus(order.id, 'CANCELLED')}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Cancel order"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}

                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-1.5 text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                          title="View order details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-lg w-full p-6 space-y-5 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold text-orange-600 uppercase bg-orange-50 px-2 py-0.5 rounded">
                  Order Details
                </span>
                <h3 className="font-extrabold text-xl text-slate-900 font-mono mt-1">
                  #{selectedOrder.orderNumber}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Student Info */}
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 space-y-1 text-xs">
              <p className="flex items-center gap-2 font-bold text-slate-900">
                <User className="w-3.5 h-3.5 text-slate-500" />
                {selectedOrder.userName}
              </p>
              <p className="flex items-center gap-2 text-slate-600">
                <Phone className="w-3.5 h-3.5 text-slate-500" />
                {selectedOrder.userPhone}
              </p>
              <p className="flex items-center gap-2 text-slate-600">
                <Mail className="w-3.5 h-3.5 text-slate-500" />
                {selectedOrder.userEmail}
              </p>
            </div>

            {/* Food items list */}
            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-2">
                Ordered Items
              </h4>
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden max-h-48 overflow-y-auto">
                {selectedOrder.items.map((item) => (
                  <div key={item.id} className="p-2.5 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-slate-900">{item.foodName}</p>
                      <p className="text-slate-400 text-[11px]">
                        ₹{Number(item.price).toFixed(0)} &times; {item.quantity}
                      </p>
                    </div>
                    <span className="font-bold text-slate-900">
                      ₹{Number(item.subtotal).toFixed(0)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-baseline pt-2 border-t border-slate-100">
              <span className="font-bold text-slate-900 text-sm">Total Bill</span>
              <span className="font-extrabold text-xl text-orange-600">
                ₹{Number(selectedOrder.totalAmount).toFixed(0)}
              </span>
            </div>

            {/* Quick Status Advance in Modal */}
            <div className="pt-2">
              <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                Change Status
              </label>
              <select
                value={selectedOrder.status}
                onChange={(e) =>
                  handleUpdateStatus(selectedOrder.id, e.target.value as OrderStatus)
                }
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="PLACED">PLACED</option>
                <option value="CONFIRMED">CONFIRMED</option>
                <option value="PREPARING">PREPARING</option>
                <option value="READY">READY</option>
                <option value="COMPLETED">COMPLETED</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

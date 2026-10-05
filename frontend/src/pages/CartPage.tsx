import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { orderService } from '../services/api';
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  ArrowLeft,
  Coins,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export const CartPage: React.FC = () => {
  const { items, updateQuantity, removeFromCart, clearCart, totalAmount, totalItems } = useCart();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePlaceOrder = async () => {
    if (items.length === 0) return;

    setLoading(true);
    setError(null);

    try {
      const orderPayload = items.map((item) => ({
        foodItemId: item.foodItem.id,
        quantity: item.quantity,
      }));

      const res = await orderService.placeOrder(orderPayload);
      if (res.success && res.data) {
        clearCart();
        navigate(`/orders/track/${res.data.orderNumber}`, {
          state: { newOrder: true },
        });
      }
    } catch (err: any) {
      console.error('Failed to place order:', err);
      setError(
        err.response?.data?.message || err.message || 'Failed to place order. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-3xl border border-slate-200 p-12 max-w-lg mx-auto shadow-sm">
          <div className="w-20 h-20 bg-orange-50 text-orange-500 rounded-3xl flex items-center justify-center mx-auto mb-5 shadow-xs">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Your Cart is Empty
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            Looks like you haven't added any delicious canteen food items to your cart yet.
          </p>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 mt-6 px-6 py-3.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow-lg shadow-orange-600/30 transition-all hover:scale-102"
          >
            <ArrowLeft className="w-4 h-4" />
            Explore Menu &amp; Order Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            My Cart 🛒
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Review your food items and place order for quick counter pickup
          </p>
        </div>

        <button
          onClick={clearCart}
          className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-200 transition-colors flex items-center gap-1.5"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Clear Cart
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-xs font-semibold text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200 divide-y divide-slate-100 overflow-hidden shadow-xs">
            {items.map((item) => (
              <div
                key={item.foodItem.id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors"
              >
                {/* Thumbnail & Food Name */}
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <img
                    src={item.foodItem.imageUrl}
                    alt={item.foodItem.name}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border border-slate-200 bg-slate-100 flex-shrink-0"
                  />
                  <div>
                    <span className="text-[10px] font-bold text-orange-600 uppercase bg-orange-50 px-2 py-0.5 rounded-md">
                      {item.foodItem.categoryName}
                    </span>
                    <h3 className="font-bold text-slate-900 text-base mt-1">
                      {item.foodItem.name}
                    </h3>
                    <p className="text-xs font-semibold text-slate-500">
                      ₹{Number(item.foodItem.price).toFixed(0)} each
                    </p>
                  </div>
                </div>

                {/* Quantity Controls & Line Total */}
                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  {/* Stepper */}
                  <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
                    <button
                      onClick={() => updateQuantity(item.foodItem.id, item.quantity - 1)}
                      className="w-7 h-7 rounded-lg bg-white text-slate-700 hover:text-orange-600 flex items-center justify-center shadow-xs transition-colors"
                      title="Decrease"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="font-bold text-sm text-slate-900 min-w-[20px] text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.foodItem.id, item.quantity + 1)}
                      className="w-7 h-7 rounded-lg bg-white text-slate-700 hover:text-orange-600 flex items-center justify-center shadow-xs transition-colors"
                      title="Increase"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Line Total */}
                  <div className="text-right min-w-[70px]">
                    <span className="text-base font-extrabold text-slate-900">
                      ₹{(Number(item.foodItem.price) * item.quantity).toFixed(0)}
                    </span>
                  </div>

                  {/* Remove Item Button */}
                  <button
                    onClick={() => removeFromCart(item.foodItem.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-xs font-bold text-orange-600 hover:underline pt-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Add more items from menu
          </Link>
        </div>

        {/* Order Summary Checkout Card */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200 p-6 space-y-6 shadow-sm sticky top-24">
          <h2 className="font-bold text-lg text-slate-900 pb-3 border-b border-slate-100">
            Order Summary
          </h2>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-slate-600">
              <span>Total Food Items</span>
              <span className="font-semibold text-slate-900">{totalItems} items</span>
            </div>

            <div className="flex justify-between text-slate-600">
              <span>Subtotal</span>
              <span className="font-semibold text-slate-900">₹{totalAmount.toFixed(0)}</span>
            </div>

            <div className="flex justify-between text-slate-600">
              <span>Canteen Taxes &amp; Packing</span>
              <span className="font-semibold text-emerald-600">FREE (₹0)</span>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline">
              <span className="font-bold text-slate-900 text-base">Grand Total</span>
              <span className="font-extrabold text-2xl text-orange-600">
                ₹{totalAmount.toFixed(0)}
              </span>
            </div>
          </div>

          {/* Payment Method Notice */}
          <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-2.5 text-xs text-amber-900">
            <Coins className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Pay at Counter</p>
              <p className="text-[11px] text-amber-800 mt-0.5">
                Pay in cash or UPI QR code at the canteen billing counter when picking up your food.
              </p>
            </div>
          </div>

          {/* Place Order Button */}
          <button
            onClick={handlePlaceOrder}
            disabled={loading || items.length === 0}
            className="w-full py-4 px-6 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-2xl shadow-lg shadow-orange-600/30 flex items-center justify-center gap-2 transition-all hover:scale-101 active:scale-99 disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                Place Order Now
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 text-center">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            Instant Canteen Kitchen Notification
          </div>
        </div>
      </div>
    </div>
  );
};

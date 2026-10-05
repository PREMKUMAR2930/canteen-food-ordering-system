import React from 'react';
import { FoodItem } from '../types';
import { useCart } from '../context/CartContext';
import { Plus, Minus, ShoppingCart, AlertTriangle } from 'lucide-react';

interface FoodCardProps {
  food: FoodItem;
}

export const FoodCard: React.FC<FoodCardProps> = ({ food }) => {
  const { addToCart, updateQuantity, getItemQuantity } = useCart();
  const quantity = getItemQuantity(food.id);

  const fallbackImage =
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80';

  return (
    <div
      className={`group bg-white rounded-2xl overflow-hidden border transition-all duration-300 flex flex-col ${
        food.available
          ? 'border-slate-200/90 hover:border-orange-300 hover:shadow-xl hover:shadow-orange-500/5 hover:-translate-y-1'
          : 'border-slate-200 opacity-70 bg-slate-50/60'
      }`}
    >
      {/* Food Image */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-100">
        <img
          src={food.imageUrl || fallbackImage}
          alt={food.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src = fallbackImage;
          }}
        />
        {/* Category Pill */}
        <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-slate-800 text-[11px] font-bold px-2.5 py-1 rounded-full shadow-xs border border-white/40">
          {food.categoryName || 'General'}
        </span>

        {/* Availability Badge */}
        <span
          className={`absolute top-3 right-3 text-[11px] font-bold px-2.5 py-1 rounded-full shadow-xs backdrop-blur-md ${
            food.available
              ? 'bg-emerald-500/90 text-white'
              : 'bg-rose-600/90 text-white flex items-center gap-1'
          }`}
        >
          {food.available ? (
            'Available'
          ) : (
            <>
              <AlertTriangle className="w-3 h-3" /> Sold Out
            </>
          )}
        </span>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex-1">
          <h3 className="font-bold text-slate-900 text-base group-hover:text-orange-600 transition-colors line-clamp-1">
            {food.name}
          </h3>
          <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
            {food.description || 'Freshly prepared at college canteen.'}
          </p>
        </div>

        {/* Price & Action */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-400 block font-medium">Price</span>
            <span className="text-lg font-extrabold text-slate-900">
              ₹{Number(food.price).toFixed(0)}
            </span>
          </div>

          <div>
            {!food.available ? (
              <button
                disabled
                className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-200 text-slate-400 cursor-not-allowed"
              >
                Unavailable
              </button>
            ) : quantity > 0 ? (
              <div className="flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-xl p-1">
                <button
                  onClick={() => updateQuantity(food.id, quantity - 1)}
                  className="w-7 h-7 rounded-lg bg-white text-orange-600 shadow-xs flex items-center justify-center hover:bg-orange-600 hover:text-white transition-colors"
                  title="Decrease"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="font-bold text-sm text-orange-950 min-w-[20px] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => updateQuantity(food.id, quantity + 1)}
                  className="w-7 h-7 rounded-lg bg-orange-600 text-white shadow-xs flex items-center justify-center hover:bg-orange-700 transition-colors"
                  title="Increase"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => addToCart(food, 1)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 shadow-sm shadow-orange-600/30 transition-all hover:scale-102 active:scale-98"
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                Add to Cart
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

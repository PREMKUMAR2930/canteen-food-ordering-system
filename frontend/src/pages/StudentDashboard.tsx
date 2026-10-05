import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { foodService, categoryService } from '../services/api';
import { FoodItem, Category } from '../types';
import { FoodCard } from '../components/FoodCard';
import {
  Search,
  Sparkles,
  ShoppingCart,
  Utensils,
  RefreshCw,
  X,
  Flame,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const { totalItems, totalAmount } = useCart();

  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    fetchFoods();
  }, [selectedCategory, searchQuery]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [catRes, foodRes] = await Promise.all([
        categoryService.getAllCategories(),
        foodService.getAllFoods(),
      ]);

      if (catRes.success) setCategories(catRes.data);
      if (foodRes.success) setFoods(foodRes.data);
    } catch (err: any) {
      console.error('Failed to load initial canteen menu data:', err);
      setError('Could not load canteen data. Please make sure the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  const fetchFoods = async () => {
    try {
      const params: any = {};
      if (selectedCategory !== null) params.categoryId = selectedCategory;
      if (searchQuery.trim()) params.search = searchQuery.trim();

      const res = await foodService.getAllFoods(params);
      if (res.success) {
        setFoods(res.data);
      }
    } catch (err) {
      console.error('Failed to filter foods:', err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 text-white p-6 sm:p-10 shadow-xl shadow-orange-600/20">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold mb-3 border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-amber-200" />
            College Smart Canteen
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Welcome back, {user?.name?.split(' ')[0] || 'Student'}! 👋
          </h1>
          <p className="mt-2 text-sm sm:text-base text-orange-100 font-normal">
            Hungry between classes? Order your favorite meals and fresh drinks in seconds and pick up directly at the counter.
          </p>
        </div>

        {/* Decorative Background Icons */}
        <div className="absolute right-6 -bottom-6 opacity-15 pointer-events-none hidden md:block">
          <Flame className="w-64 h-64" />
        </div>
      </div>

      {/* Search & Categories Filter Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-lg">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search dishes (e.g. Burger, Dosa, Tea, Juice)..."
              className="w-full pl-11 pr-10 py-3 bg-white border border-slate-200 rounded-2xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Cart Status Widget */}
          {totalItems > 0 && (
            <Link
              to="/cart"
              className="inline-flex items-center justify-between sm:justify-center gap-3 px-5 py-3 bg-slate-900 text-white rounded-2xl shadow-md hover:bg-slate-800 transition-all group"
            >
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-orange-600 flex items-center justify-center font-bold text-xs">
                  {totalItems}
                </div>
                <span className="text-xs font-semibold">In Cart</span>
              </div>
              <span className="text-sm font-bold text-orange-400 group-hover:translate-x-0.5 transition-transform">
                ₹{totalAmount.toFixed(0)} &rarr;
              </span>
            </Link>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-1 no-scrollbar">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === null
                ? 'bg-orange-600 text-white shadow-md shadow-orange-600/30 scale-102'
                : 'bg-white text-slate-600 border border-slate-200 hover:border-orange-300 hover:bg-orange-50'
            }`}
          >
            🍽️ All Items
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-orange-600 text-white shadow-md shadow-orange-600/30 scale-102'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-orange-300 hover:bg-orange-50'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Food Items Catalog Grid */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <Utensils className="w-5 h-5 text-orange-600" />
              {selectedCategory
                ? `${categories.find((c) => c.id === selectedCategory)?.name || 'Category'} Menu`
                : 'Full Canteen Menu'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Showing {foods.length} tasty dishes available today
            </p>
          </div>

          <button
            onClick={fetchInitialData}
            className="p-2 text-slate-500 hover:text-orange-600 hover:bg-white rounded-xl border border-slate-200 transition-colors"
            title="Refresh menu"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div
                key={n}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden animate-pulse p-4 space-y-3"
              >
                <div className="h-44 bg-slate-200 rounded-xl"></div>
                <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                <div className="h-3 bg-slate-100 rounded w-full"></div>
                <div className="flex justify-between items-center pt-2">
                  <div className="h-5 bg-slate-200 rounded w-1/4"></div>
                  <div className="h-8 bg-slate-200 rounded-xl w-1/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-6 text-center">
            <p className="font-bold">{error}</p>
            <button
              onClick={fetchInitialData}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-bold"
            >
              Retry Connection
            </button>
          </div>
        ) : foods.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center max-w-md mx-auto">
            <div className="w-16 h-16 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg">No dishes found</h3>
            <p className="text-xs text-slate-500 mt-1">
              We couldn't find any food items matching "{searchQuery}". Try selecting another category or resetting the search.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory(null);
              }}
              className="mt-4 px-4 py-2 bg-orange-600 text-white rounded-xl text-xs font-bold hover:bg-orange-700 transition-colors"
            >
              View Full Menu
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {foods.map((food) => (
              <FoodCard key={food.id} food={food} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

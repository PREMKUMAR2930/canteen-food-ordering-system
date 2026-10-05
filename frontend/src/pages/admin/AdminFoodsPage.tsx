import React, { useState, useEffect } from 'react';
import { foodService, categoryService } from '../../services/api';
import { FoodItem, Category } from '../../types';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  X,
  AlertTriangle,
  RefreshCw,
  Image as ImageIcon,
} from 'lucide-react';

export const AdminFoodsPage: React.FC = () => {
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCat, setSelectedCat] = useState<string>('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFood, setEditingFood] = useState<FoodItem | null>(null);
  const [deleteFoodTarget, setDeleteFoodTarget] = useState<FoodItem | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    imageUrl: '',
    available: true,
    categoryId: '',
  });
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [fRes, cRes] = await Promise.all([
        foodService.getAllFoods(),
        categoryService.getAllCategories(),
      ]);
      if (fRes.success) setFoods(fRes.data);
      if (cRes.success) setCategories(cRes.data);
    } catch (err) {
      console.error('Failed to fetch food catalog:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingFood(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      imageUrl: '',
      available: true,
      categoryId: categories.length > 0 ? categories[0].id.toString() : '',
    });
    setModalError(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (food: FoodItem) => {
    setEditingFood(food);
    setFormData({
      name: food.name,
      description: food.description || '',
      price: food.price.toString(),
      imageUrl: food.imageUrl || '',
      available: food.available,
      categoryId: food.categoryId.toString(),
    });
    setModalError(null);
    setIsModalOpen(true);
  };

  const handleToggleAvailability = async (food: FoodItem) => {
    try {
      const res = await foodService.toggleAvailability(food.id);
      if (res.success) {
        setFoods((prev) =>
          prev.map((f) => (f.id === food.id ? { ...f, available: !f.available } : f))
        );
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update availability.');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteFoodTarget) return;
    try {
      const res = await foodService.deleteFood(deleteFoodTarget.id);
      if (res.success) {
        setFoods((prev) => prev.filter((f) => f.id !== deleteFoodTarget.id));
        setDeleteFoodTarget(null);
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete food item.');
    }
  };

  const handleSubmitModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.categoryId) {
      setModalError('Please fill in all required fields.');
      return;
    }

    setModalLoading(true);
    setModalError(null);

    const payload = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      price: parseFloat(formData.price),
      imageUrl:
        formData.imageUrl.trim() ||
        'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
      available: formData.available,
      categoryId: parseInt(formData.categoryId),
    };

    try {
      if (editingFood) {
        const res = await foodService.updateFood(editingFood.id, payload);
        if (res.success) {
          setFoods((prev) =>
            prev.map((f) => (f.id === editingFood.id ? res.data : f))
          );
          setIsModalOpen(false);
        }
      } else {
        const res = await foodService.createFood(payload);
        if (res.success) {
          setFoods((prev) => [res.data, ...prev]);
          setIsModalOpen(false);
        }
      }
    } catch (err: any) {
      setModalError(err.response?.data?.message || 'Action failed. Please check your data.');
    } finally {
      setModalLoading(false);
    }
  };

  const filteredFoods = foods.filter((food) => {
    const matchesSearch =
      food.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (food.description && food.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCat =
      selectedCat === 'all' || food.categoryId.toString() === selectedCat;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Food Items Inventory 🍔
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage canteen menu items, pricing, categories and stock availability
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchData}
            className="p-2.5 text-slate-600 hover:text-orange-600 hover:bg-white rounded-xl border border-slate-200 shadow-2xs transition-colors"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold shadow-md shadow-orange-600/20 transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Add New Food
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search food by name..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-xs"
          />
        </div>

        <select
          value={selectedCat}
          onChange={(e) => setSelectedCat(e.target.value)}
          className="bg-white border border-slate-200 rounded-xl text-xs font-bold py-2.5 px-3.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-xs cursor-pointer"
        >
          <option value="all">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id.toString()}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Food Items Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-3.5 px-4">Item</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Price</th>
                <th className="py-3.5 px-4">Stock Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">
                    Loading food catalog...
                  </td>
                </tr>
              ) : filteredFoods.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">
                    No food items match your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredFoods.map((food) => (
                  <tr key={food.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={food.imageUrl}
                          alt={food.name}
                          className="w-12 h-12 rounded-xl object-cover bg-slate-100 border border-slate-200 flex-shrink-0"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80';
                          }}
                        />
                        <div>
                          <p className="font-bold text-slate-900 text-sm">{food.name}</p>
                          <p className="text-slate-400 line-clamp-1 max-w-xs">{food.description}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
                        {food.categoryName}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-black text-sm text-slate-900">
                      ₹{Number(food.price).toFixed(0)}
                    </td>

                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => handleToggleAvailability(food)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold transition-colors ${
                          food.available
                            ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                            : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                        }`}
                        title="Click to toggle availability"
                      >
                        {food.available ? (
                          <>
                            <CheckCircle className="w-3.5 h-3.5" /> In Stock
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3.5 h-3.5" /> Sold Out
                          </>
                        )}
                      </button>
                    </td>

                    <td className="py-3.5 px-4 text-right space-x-1">
                      <button
                        onClick={() => handleOpenEdit(food)}
                        className="p-2 text-slate-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                        title="Edit Food Item"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteFoodTarget(food)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete Food Item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="font-extrabold text-xl text-slate-900">
                {editingFood ? 'Edit Food Item' : 'Add New Food Item'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {modalError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs font-semibold text-red-700">
                {modalError}
              </div>
            )}

            <form onSubmit={handleSubmitModal} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                  Food Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Masala Dosa, Veg Burger"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    step="1"
                    min="1"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="80"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id.toString()}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Freshly prepared delicious item..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                  Image URL
                </label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="availableCheck"
                  checked={formData.available}
                  onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                  className="w-4 h-4 text-orange-600 rounded border-slate-300 focus:ring-orange-500"
                />
                <label htmlFor="availableCheck" className="text-xs font-bold text-slate-700">
                  Available in Stock (Students can order)
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={modalLoading}
                  className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl shadow-md shadow-orange-600/20 transition-all disabled:opacity-50"
                >
                  {modalLoading ? 'Saving...' : editingFood ? 'Save Changes' : 'Create Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteFoodTarget && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-sm w-full p-6 text-center space-y-4 shadow-2xl">
            <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <h3 className="font-extrabold text-lg text-slate-900">Delete Food Item?</h3>
            <p className="text-xs text-slate-500">
              Are you sure you want to remove <strong>"{deleteFoodTarget.name}"</strong>? This action cannot be undone.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeleteFoodTarget(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-xs"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

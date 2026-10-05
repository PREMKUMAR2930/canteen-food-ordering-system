import React, { useState, useEffect } from 'react';
import { categoryService } from '../../services/api';
import { Category } from '../../types';
import {
  FolderTree,
  Plus,
  Edit2,
  Trash2,
  X,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';

export const AdminCategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<Category | null>(null);
  const [deleteCatTarget, setDeleteCatTarget] = useState<Category | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await categoryService.getAllCategories();
      if (res.success) setCategories(res.data);
    } catch (err) {
      console.error('Failed to load categories:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingCat(null);
    setFormData({ name: '', description: '' });
    setModalError(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat: Category) => {
    setEditingCat(cat);
    setFormData({ name: cat.name, description: cat.description || '' });
    setModalError(null);
    setIsModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteCatTarget) return;
    try {
      const res = await categoryService.deleteCategory(deleteCatTarget.id);
      if (res.success) {
        setCategories((prev) => prev.filter((c) => c.id !== deleteCatTarget.id));
        setDeleteCatTarget(null);
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete category.');
    }
  };

  const handleSubmitModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setModalError('Category name is required');
      return;
    }

    setModalLoading(true);
    setModalError(null);

    const payload = {
      name: formData.name.trim(),
      description: formData.description.trim(),
    };

    try {
      if (editingCat) {
        const res = await categoryService.updateCategory(editingCat.id, payload);
        if (res.success) {
          setCategories((prev) =>
            prev.map((c) => (c.id === editingCat.id ? res.data : c))
          );
          setIsModalOpen(false);
        }
      } else {
        const res = await categoryService.createCategory(payload);
        if (res.success) {
          setCategories((prev) => [...prev, res.data]);
          setIsModalOpen(false);
        }
      }
    } catch (err: any) {
      setModalError(err.response?.data?.message || 'Failed to save category');
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <FolderTree className="w-7 h-7 text-orange-600" />
            Food Categories
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Organize canteen foods into logical meal sections and menus
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchCategories}
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
            Add Category
          </button>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
        {loading ? (
          [1, 2, 3].map((n) => (
            <div key={n} className="h-36 bg-white rounded-3xl border border-slate-200 animate-pulse"></div>
          ))
        ) : categories.length === 0 ? (
          <div className="col-span-full bg-white rounded-3xl border border-slate-200 p-12 text-center text-slate-400">
            No categories defined yet.
          </div>
        ) : (
          categories.map((cat) => (
            <div
              key={cat.id}
              className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs hover:border-orange-300 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="w-8 h-8 rounded-xl bg-orange-50 text-orange-600 font-bold text-xs flex items-center justify-center">
                    #{cat.id}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(cat)}
                      className="p-1.5 text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                      title="Edit Category"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteCatTarget(cat)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Delete Category"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h3 className="font-extrabold text-slate-900 text-base mt-3">{cat.name}</h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                  {cat.description || 'No description provided.'}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-md w-full p-6 space-y-5 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-lg text-slate-900">
                {editingCat ? 'Edit Category' : 'Add New Category'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600"
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
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Breakfast, Desserts"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of this menu group..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={modalLoading}
                  className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl shadow-xs disabled:opacity-50"
                >
                  {modalLoading ? 'Saving...' : editingCat ? 'Save Changes' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteCatTarget && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-sm w-full p-6 text-center space-y-4 shadow-2xl">
            <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <h3 className="font-extrabold text-lg text-slate-900">Delete Category?</h3>
            <p className="text-xs text-slate-500">
              Are you sure you want to remove <strong>"{deleteCatTarget.name}"</strong>?
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeleteCatTarget(null)}
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

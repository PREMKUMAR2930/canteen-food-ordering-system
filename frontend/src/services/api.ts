import axios from 'axios';
import {
  AuthResponse,
  Category,
  DashboardStats,
  FoodItem,
  OrderResponse,
  OrderStatus,
  User,
  ApiResponse,
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token automatically to every request if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('canteen_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle 401 Unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If token expired or invalid, clear and redirect to login if not already there
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
        localStorage.removeItem('canteen_token');
        localStorage.removeItem('canteen_user');
      }
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: async (credentials: { email: string; password: string }) => {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/login', credentials);
    return response.data;
  },
  register: async (data: {
    name: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
  }) => {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/register', data);
    return response.data;
  },
  getCurrentUser: async () => {
    const response = await api.get<ApiResponse<User>>('/auth/me');
    return response.data;
  },
};

export const foodService = {
  getAllFoods: async (params?: { categoryId?: number; search?: string; availableOnly?: boolean }) => {
    const response = await api.get<ApiResponse<FoodItem[]>>('/foods', { params });
    return response.data;
  },
  getFoodById: async (id: number) => {
    const response = await api.get<ApiResponse<FoodItem>>(`/foods/${id}`);
    return response.data;
  },
  createFood: async (data: {
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    available: boolean;
    categoryId: number;
  }) => {
    const response = await api.post<ApiResponse<FoodItem>>('/foods', data);
    return response.data;
  },
  updateFood: async (
    id: number,
    data: {
      name: string;
      description: string;
      price: number;
      imageUrl: string;
      available: boolean;
      categoryId: number;
    }
  ) => {
    const response = await api.put<ApiResponse<FoodItem>>(`/foods/${id}`, data);
    return response.data;
  },
  toggleAvailability: async (id: number) => {
    const response = await api.patch<ApiResponse<FoodItem>>(`/foods/${id}/toggle-availability`);
    return response.data;
  },
  deleteFood: async (id: number) => {
    const response = await api.delete<ApiResponse<void>>(`/foods/${id}`);
    return response.data;
  },
};

export const categoryService = {
  getAllCategories: async () => {
    const response = await api.get<ApiResponse<Category[]>>('/categories');
    return response.data;
  },
  getCategoryById: async (id: number) => {
    const response = await api.get<ApiResponse<Category>>(`/categories/${id}`);
    return response.data;
  },
  createCategory: async (data: { name: string; description?: string }) => {
    const response = await api.post<ApiResponse<Category>>('/categories', data);
    return response.data;
  },
  updateCategory: async (id: number, data: { name: string; description?: string }) => {
    const response = await api.put<ApiResponse<Category>>(`/categories/${id}`, data);
    return response.data;
  },
  deleteCategory: async (id: number) => {
    const response = await api.delete<ApiResponse<void>>(`/categories/${id}`);
    return response.data;
  },
};

export const orderService = {
  placeOrder: async (items: { foodItemId: number; quantity: number }[]) => {
    const response = await api.post<ApiResponse<OrderResponse>>('/orders', { items });
    return response.data;
  },
  getMyOrders: async () => {
    const response = await api.get<ApiResponse<OrderResponse[]>>('/orders/my-orders');
    return response.data;
  },
  getAllOrders: async (status?: OrderStatus) => {
    const response = await api.get<ApiResponse<OrderResponse[]>>('/orders', {
      params: status ? { status } : {},
    });
    return response.data;
  },
  getOrderById: async (id: number) => {
    const response = await api.get<ApiResponse<OrderResponse>>(`/orders/${id}`);
    return response.data;
  },
  trackByOrderNumber: async (orderNumber: string) => {
    const response = await api.get<ApiResponse<OrderResponse>>(`/orders/track/${orderNumber}`);
    return response.data;
  },
  updateOrderStatus: async (id: number, status: OrderStatus) => {
    const response = await api.put<ApiResponse<OrderResponse>>(`/orders/${id}/status`, { status });
    return response.data;
  },
  cancelOrder: async (id: number) => {
    const response = await api.post<ApiResponse<OrderResponse>>(`/orders/${id}/cancel`);
    return response.data;
  },
};

export const adminService = {
  getDashboardStats: async () => {
    const response = await api.get<ApiResponse<DashboardStats>>('/admin/dashboard/stats');
    return response.data;
  },
};

export default api;

export type Role = 'STUDENT' | 'ADMIN';

export type OrderStatus =
  | 'PLACED'
  | 'CONFIRMED'
  | 'PREPARING'
  | 'READY'
  | 'COMPLETED'
  | 'CANCELLED';

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: Role;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  tokenType: string;
  user: User;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
}

export interface FoodItem {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  available: boolean;
  categoryId: number;
  categoryName: string;
  createdAt?: string;
}

export interface CartItem {
  foodItem: FoodItem;
  quantity: number;
}

export interface OrderItemResponse {
  id: number;
  foodItemId: number;
  foodName: string;
  imageUrl: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface OrderResponse {
  id: number;
  orderNumber: string;
  userId: number;
  userName: string;
  userEmail: string;
  userPhone: string;
  totalAmount: number;
  status: OrderStatus;
  orderDate: string;
  items: OrderItemResponse[];
}

export interface DashboardStats {
  totalOrders: number;
  todayOrders: number;
  totalRevenue: number;
  todayRevenue: number;
  totalFoodItems: number;
  availableFoodItems: number;
  totalStudents: number;
  recentOrders: OrderResponse[];
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

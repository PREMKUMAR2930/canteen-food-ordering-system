import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ProtectedRoute } from './components/ProtectedRoute';

// Public Pages
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';

// Student Pages
import { StudentDashboard } from './pages/StudentDashboard';
import { CartPage } from './pages/CartPage';
import { OrderHistoryPage } from './pages/OrderHistoryPage';
import { OrderTrackingPage } from './pages/OrderTrackingPage';
import { ProfilePage } from './pages/ProfilePage';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminFoodsPage } from './pages/admin/AdminFoodsPage';
import { AdminCategoriesPage } from './pages/admin/AdminCategoriesPage';
import { AdminOrdersPage } from './pages/admin/AdminOrdersPage';

const RootRedirect: React.FC = () => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  if (loading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (isAdmin) return <Navigate to="/admin/dashboard" replace />;
  return <Navigate to="/dashboard" replace />;
};

const AppContent: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans">
      <Navbar />
      <main className="flex-1">
        <Routes>
          {/* Root Redirect */}
          <Route path="/" element={<RootRedirect />} />

          {/* Public Authentication Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Student Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRole="STUDENT">
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/foods"
            element={
              <ProtectedRoute allowedRole="STUDENT">
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cart"
            element={
              <ProtectedRoute allowedRole="STUDENT">
                <CartPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute allowedRole="STUDENT">
                <OrderHistoryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders/track/:orderNumber"
            element={
              <ProtectedRoute>
                <OrderTrackingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders/:orderNumber"
            element={
              <ProtectedRoute>
                <OrderTrackingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          {/* Admin Protected Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRole="ADMIN">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/foods"
            element={
              <ProtectedRoute allowedRole="ADMIN">
                <AdminFoodsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/categories"
            element={
              <ProtectedRoute allowedRole="ADMIN">
                <AdminCategoriesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <ProtectedRoute allowedRole="ADMIN">
                <AdminOrdersPage />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<RootRedirect />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;

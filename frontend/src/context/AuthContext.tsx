import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthResponse } from '../types';
import { authService } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isStudent: boolean;
  loading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<AuthResponse>;
  register: (data: {
    name: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
  }) => Promise<AuthResponse>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('canteen_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('canteen_token');
  });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          const res = await authService.getCurrentUser();
          if (res.success && res.data) {
            setUser(res.data);
            localStorage.setItem('canteen_user', JSON.stringify(res.data));
          }
        } catch (error) {
          console.error('Session expired or invalid token:', error);
          logout();
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, [token]);

  const login = async (credentials: { email: string; password: string }): Promise<AuthResponse> => {
    const res = await authService.login(credentials);
    if (res.success && res.data) {
      const authData = res.data;
      setToken(authData.token);
      setUser(authData.user);
      localStorage.setItem('canteen_token', authData.token);
      localStorage.setItem('canteen_user', JSON.stringify(authData.user));
      return authData;
    }
    throw new Error(res.message || 'Login failed');
  };

  const register = async (data: {
    name: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
  }): Promise<AuthResponse> => {
    const res = await authService.register(data);
    if (res.success && res.data) {
      const authData = res.data;
      setToken(authData.token);
      setUser(authData.user);
      localStorage.setItem('canteen_token', authData.token);
      localStorage.setItem('canteen_user', JSON.stringify(authData.user));
      return authData;
    }
    throw new Error(res.message || 'Registration failed');
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('canteen_token');
    localStorage.removeItem('canteen_user');
  };

  const isAuthenticated = !!token && !!user;
  const isAdmin = user?.role === 'ADMIN';
  const isStudent = user?.role === 'STUDENT';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isAdmin,
        isStudent,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

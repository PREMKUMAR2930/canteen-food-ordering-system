import React, { createContext, useContext, useState, useEffect } from 'react';
import { FoodItem, CartItem } from '../types';

interface CartContextType {
  items: CartItem[];
  addToCart: (foodItem: FoodItem, quantity?: number) => void;
  removeFromCart: (foodItemId: number) => void;
  updateQuantity: (foodItemId: number, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalAmount: number;
  getItemQuantity: (foodItemId: number) => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('canteen_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('canteen_cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (foodItem: FoodItem, quantity: number = 1) => {
    setItems((prevItems) => {
      const existing = prevItems.find((item) => item.foodItem.id === foodItem.id);
      if (existing) {
        return prevItems.map((item) =>
          item.foodItem.id === foodItem.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevItems, { foodItem, quantity }];
    });
  };

  const removeFromCart = (foodItemId: number) => {
    setItems((prevItems) => prevItems.filter((item) => item.foodItem.id !== foodItemId));
  };

  const updateQuantity = (foodItemId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(foodItemId);
      return;
    }
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.foodItem.id === foodItemId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = items.reduce(
    (sum, item) => sum + Number(item.foodItem.price) * item.quantity,
    0
  );

  const getItemQuantity = (foodItemId: number) => {
    const item = items.find((i) => i.foodItem.id === foodItemId);
    return item ? item.quantity : 0;
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalAmount,
        getItemQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

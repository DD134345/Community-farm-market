import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, Seller, Product, CartItem, Order, Notification } from '../types';
import { mockSellers, mockProducts, currentUser } from '../data/mockData';

interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  sellers: Seller[];
  products: Product[];
  cart: CartItem[];
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  notifications: Notification[];
  addNotification: (notification: Notification) => void;
  selectedDistrict: string;
  setSelectedDistrict: (district: string) => void;
  dietaryFilters: string[];
  setDietaryFilters: (filters: string[]) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(currentUser);
  const [sellers] = useState<Seller[]>(mockSellers);
  const [products] = useState<Product[]>(mockProducts);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState('All');
  const [dietaryFilters, setDietaryFilters] = useState<string[]>([]);

  const addToCart = (product: Product, quantity: number) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity, sellerId: product.sellerId }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const addNotification = (notification: Notification) => {
    setNotifications(prev => [notification, ...prev]);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        sellers,
        products,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartTotal,
        notifications,
        addNotification,
        selectedDistrict,
        setSelectedDistrict,
        dietaryFilters,
        setDietaryFilters,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

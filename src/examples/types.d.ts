/**
 * TypeScript type definitions for Capacitor services
 * This file provides type hints and autocomplete for the example services
 */

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role?: string;
}

export interface Service {
  _id: string;
  name: string;
  description?: string;
  price: number;
  category?: string;
  duration?: number;
}

export interface Order {
  _id: string;
  userId: string;
  serviceId: string;
  status: string;
  amount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Cart {
  _id: string;
  userId: string;
  items: CartItem[];
  total: number;
}

export interface CartItem {
  serviceId: string;
  serviceName: string;
  price: number;
  quantity: number;
}

// Auth API
export const authAPI: {
  login: (email: string, password: string) => Promise<{
    success: boolean;
    user?: User;
    token?: string;
    error?: string;
  }>;
  signup: (userData: Partial<User> & { password: string }) => Promise<ApiResponse<User>>;
  logout: () => Promise<{ success: boolean }>;
  getProfile: () => Promise<{
    success: boolean;
    user?: User;
    error?: string;
  }>;
};

// Services API
export const servicesAPI: {
  getServices: () => Promise<{
    success: boolean;
    services?: Service[];
    error?: string;
  }>;
  getServiceById: (serviceId: string) => Promise<{
    success: boolean;
    service?: Service;
    error?: string;
  }>;
};

// Cart API
export const cartAPI: {
  getCart: () => Promise<{
    success: boolean;
    cart?: Cart;
    error?: string;
  }>;
  addToCart: (item: Partial<CartItem>) => Promise<{
    success: boolean;
    cart?: Cart;
    error?: string;
  }>;
  removeFromCart: (itemId: string) => Promise<{
    success: boolean;
    cart?: Cart;
    error?: string;
  }>;
};

// Orders API
export const ordersAPI: {
  getOrders: () => Promise<{
    success: boolean;
    orders?: Order[];
    error?: string;
  }>;
  createOrder: (orderData: any) => Promise<{
    success: boolean;
    order?: Order;
    error?: string;
  }>;
  getOrderById: (orderId: string) => Promise<{
    success: boolean;
    order?: Order;
    error?: string;
  }>;
};

// Payments API
export const paymentsAPI: {
  createPayment: (amount: number, currency?: string) => Promise<ApiResponse>;
  verifyPayment: (paymentData: any) => Promise<ApiResponse>;
};

// Token Management
export const getToken: () => Promise<string | null>;
export const setToken: (token: string) => Promise<void>;
export const removeToken: () => Promise<void>;

// Socket.IO Types
export interface SocketService {
  initializeSocket: () => Promise<any>;
  disconnectSocket: () => void;
  isSocketConnected: () => boolean;
  getSocket: () => any;
  emitEvent: (event: string, data: any) => void;
  orderEvents: {
    joinOrderRoom: (orderId: string) => void;
    leaveOrderRoom: (orderId: string) => void;
    onOrderStatusUpdate: (callback: (data: any) => void) => void;
    onProviderLocationUpdate: (callback: (data: any) => void) => void;
    onOrderAssigned: (callback: (data: any) => void) => void;
    onServiceCompleted: (callback: (data: any) => void) => void;
  };
  chatEvents: {
    joinChatRoom: (roomId: string) => void;
    sendMessage: (roomId: string, message: string) => void;
    onNewMessage: (callback: (data: any) => void) => void;
    onTyping: (callback: (data: any) => void) => void;
  };
  providerEvents: {
    updateLocation: (latitude: number, longitude: number) => void;
    onNewServiceRequest: (callback: (data: any) => void) => void;
    acceptService: (requestId: string) => void;
    updateServiceStatus: (orderId: string, status: string) => void;
  };
  removeAllListeners: () => void;
  removeListener: (event: string) => void;
}

// Push Notifications Service
export interface PushNotificationService {
  initialize: () => Promise<boolean>;
  sendTokenToBackend: (token: string) => Promise<any>;
  showLocalNotification: (title: string, body: string, data?: any) => Promise<void>;
  getDeliveredNotifications: () => Promise<any[]>;
  removeDeliveredNotifications: (notificationIds: number[]) => Promise<void>;
  removeAllDeliveredNotifications: () => Promise<void>;
  getStoredToken: () => Promise<string | null>;
  removeAllListeners: () => void;
}

export default {};

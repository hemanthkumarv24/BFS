/**
 * Capacitor API Service - REST API Example
 * 
 * This module demonstrates how to make HTTPS API calls to the Express backend
 * with JWT authentication support for the BFS mobile app.
 * 
 * Features:
 * - Axios-based HTTP client with JWT token management
 * - Automatic token injection in headers
 * - Token refresh handling
 * - Error handling and retry logic
 * - Support for all HTTP methods (GET, POST, PUT, DELETE)
 */

import axios from 'axios';
import { Preferences } from '@capacitor/preferences';

// API Configuration
// TODO: Update this URL to match your backend server
// For development: Use 'http://10.0.2.2:5000/api' (emulator) or 'http://192.168.x.x:5000/api' (device)
// For production: Use your actual backend URL (e.g., 'https://api.example.com/api')
const API_BASE_URL = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL}/api`
  : 'https://my-bfs-backend.com/api';
const TOKEN_KEY = 'jwt_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Get stored JWT token from Capacitor Preferences (Secure Storage)
 */
export const getToken = async () => {
  try {
    const { value } = await Preferences.get({ key: TOKEN_KEY });
    return value;
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
};

/**
 * Set JWT token in Capacitor Preferences (Secure Storage)
 */
export const setToken = async (token) => {
  try {
    await Preferences.set({
      key: TOKEN_KEY,
      value: token,
    });
  } catch (error) {
    console.error('Error setting token:', error);
  }
};

/**
 * Remove JWT token from storage
 */
export const removeToken = async () => {
  try {
    await Preferences.remove({ key: TOKEN_KEY });
    await Preferences.remove({ key: REFRESH_TOKEN_KEY });
  } catch (error) {
    console.error('Error removing token:', error);
  }
};

/**
 * Request interceptor - Add JWT token to all requests
 */
apiClient.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor - Handle token expiration and errors
 */
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized - Token expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh the token
        const refreshToken = await Preferences.get({ key: REFRESH_TOKEN_KEY });
        if (refreshToken.value) {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken: refreshToken.value,
          });

          const { token } = response.data;
          await setToken(token);

          // Retry the original request with new token
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, logout user
        await removeToken();
        // Redirect to login or show login modal
        console.error('Token refresh failed:', refreshError);
      }
    }

    return Promise.reject(error);
  }
);

/**
 * Authentication API Calls
 */
export const authAPI = {
  /**
   * Login with email and password
   */
  login: async (email, password) => {
    try {
      const response = await apiClient.post('/auth/login', {
        email,
        password,
      });
      
      const { token, refreshToken, user } = response.data;
      await setToken(token);
      
      if (refreshToken) {
        await Preferences.set({
          key: REFRESH_TOKEN_KEY,
          value: refreshToken,
        });
      }
      
      return { success: true, user, token };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Login failed',
      };
    }
  },

  /**
   * Signup new user
   */
  signup: async (userData) => {
    try {
      const response = await apiClient.post('/auth/signup', userData);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Signup failed',
      };
    }
  },

  /**
   * Logout user
   */
  logout: async () => {
    try {
      await apiClient.post('/auth/logout');
      await removeToken();
      return { success: true };
    } catch (error) {
      await removeToken(); // Clear local token even if API call fails
      return { success: true };
    }
  },

  /**
   * Get current user profile
   */
  getProfile: async () => {
    try {
      const response = await apiClient.get('/auth/me');
      return { success: true, user: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to get profile',
      };
    }
  },
};

/**
 * Services API Calls
 */
export const servicesAPI = {
  /**
   * Get all available services
   */
  getServices: async () => {
    try {
      const response = await apiClient.get('/services');
      return { success: true, services: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch services',
      };
    }
  },

  /**
   * Get service by ID
   */
  getServiceById: async (serviceId) => {
    try {
      const response = await apiClient.get(`/services/${serviceId}`);
      return { success: true, service: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch service',
      };
    }
  },
};

/**
 * Cart API Calls
 */
export const cartAPI = {
  /**
   * Get user's cart
   */
  getCart: async () => {
    try {
      const response = await apiClient.get('/cart');
      return { success: true, cart: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch cart',
      };
    }
  },

  /**
   * Add item to cart
   */
  addToCart: async (item) => {
    try {
      const response = await apiClient.post('/cart', item);
      return { success: true, cart: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to add to cart',
      };
    }
  },

  /**
   * Remove item from cart
   */
  removeFromCart: async (itemId) => {
    try {
      const response = await apiClient.delete(`/cart/${itemId}`);
      return { success: true, cart: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to remove from cart',
      };
    }
  },
};

/**
 * Orders API Calls
 */
export const ordersAPI = {
  /**
   * Get user's orders
   */
  getOrders: async () => {
    try {
      const response = await apiClient.get('/orders');
      return { success: true, orders: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch orders',
      };
    }
  },

  /**
   * Create new order
   */
  createOrder: async (orderData) => {
    try {
      const response = await apiClient.post('/orders', orderData);
      return { success: true, order: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to create order',
      };
    }
  },

  /**
   * Get order by ID
   */
  getOrderById: async (orderId) => {
    try {
      const response = await apiClient.get(`/orders/${orderId}`);
      return { success: true, order: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch order',
      };
    }
  },
};

/**
 * Payments API Calls
 */
export const paymentsAPI = {
  /**
   * Create payment order
   */
  createPayment: async (amount, currency = 'INR') => {
    try {
      const response = await apiClient.post('/payments/create-order', {
        amount,
        currency,
      });
      return { success: true, payment: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to create payment',
      };
    }
  },

  /**
   * Verify payment
   */
  verifyPayment: async (paymentData) => {
    try {
      const response = await apiClient.post('/payments/verify', paymentData);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Payment verification failed',
      };
    }
  },
};

// Export the configured axios instance for custom requests
export default apiClient;

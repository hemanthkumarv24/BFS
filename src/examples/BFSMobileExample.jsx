/**
 * Example React Component - BFS Mobile App
 * 
 * This component demonstrates how to use the Capacitor API and Socket.IO services
 * for real-time order tracking in the BFS mobile application.
 * 
 * Features:
 * - Login with JWT authentication
 * - Fetch and display services
 * - Real-time order status updates via Socket.IO
 * - Push notifications setup
 * - Secure storage for tokens
 */

import React, { useState, useEffect } from 'react';
import { 
  authAPI, 
  servicesAPI, 
  cartAPI, 
  ordersAPI,
  paymentsAPI 
} from './capacitorApiService';
import {
  initializeSocket,
  disconnectSocket,
  orderEvents,
  chatEvents,
  isSocketConnected,
} from './capacitorSocketService';
import { PushNotifications } from '@capacitor/push-notifications';
import { Preferences } from '@capacitor/preferences';

const BFSMobileExample = () => {
  // State management
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [services, setServices] = useState([]);
  const [orders, setOrders] = useState([]);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [orderStatus, setOrderStatus] = useState(null);
  const [providerLocation, setProviderLocation] = useState(null);
  const [isSocketReady, setIsSocketReady] = useState(false);
  const [loading, setLoading] = useState(false);

  // Login credentials (for demo)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  /**
   * Initialize app on mount
   */
  useEffect(() => {
    initializeApp();

    // Cleanup on unmount
    return () => {
      disconnectSocket();
    };
  }, []);

  /**
   * Initialize Socket.IO when user logs in
   */
  useEffect(() => {
    if (isLoggedIn) {
      setupSocketConnection();
    } else {
      disconnectSocket();
    }
  }, [isLoggedIn]);

  /**
   * Initialize app - check for existing session and setup push notifications
   */
  const initializeApp = async () => {
    try {
      // Check if user is already logged in
      const result = await authAPI.getProfile();
      if (result.success) {
        setUser(result.user);
        setIsLoggedIn(true);
      }

      // Setup push notifications
      await setupPushNotifications();
    } catch (error) {
      console.error('Error initializing app:', error);
    }
  };

  /**
   * Setup Push Notifications
   */
  const setupPushNotifications = async () => {
    try {
      // Request permission
      let permStatus = await PushNotifications.checkPermissions();

      if (permStatus.receive === 'prompt') {
        permStatus = await PushNotifications.requestPermissions();
      }

      if (permStatus.receive !== 'granted') {
        console.warn('Push notification permission not granted');
        return;
      }

      // Register for push notifications
      await PushNotifications.register();

      // Listen for registration
      PushNotifications.addListener('registration', (token) => {
        console.log('Push registration success, token:', token.value);
        // Send token to backend
        savePushToken(token.value);
      });

      // Listen for registration errors
      PushNotifications.addListener('registrationError', (error) => {
        console.error('Push registration error:', error);
      });

      // Listen for push notifications received
      PushNotifications.addListener('pushNotificationReceived', (notification) => {
        console.log('Push notification received:', notification);
        // Handle notification when app is in foreground
      });

      // Listen for notification actions
      PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
        console.log('Push notification action performed:', notification);
        // Handle notification tap
        handleNotificationTap(notification);
      });
    } catch (error) {
      console.error('Error setting up push notifications:', error);
    }
  };

  /**
   * Save push token to backend
   */
  const savePushToken = async (token) => {
    try {
      await Preferences.set({
        key: 'push_token',
        value: token,
      });
      // TODO: Send token to backend
      // await apiClient.post('/user/push-token', { token });
    } catch (error) {
      console.error('Error saving push token:', error);
    }
  };

  /**
   * Handle notification tap
   */
  const handleNotificationTap = (notification) => {
    // Navigate to relevant screen based on notification data
    const data = notification.notification.data;
    if (data.orderId) {
      loadOrderDetails(data.orderId);
    }
  };

  /**
   * Setup Socket.IO connection
   */
  const setupSocketConnection = async () => {
    try {
      const socket = await initializeSocket();
      
      if (socket) {
        setIsSocketReady(true);

        // Setup order status listeners
        orderEvents.onOrderStatusUpdate((data) => {
          console.log('Order status updated:', data);
          setOrderStatus(data.status);
          
          // Update order in orders list
          setOrders(prevOrders =>
            prevOrders.map(order =>
              order._id === data.orderId
                ? { ...order, status: data.status }
                : order
            )
          );
        });

        // Setup provider location listener
        orderEvents.onProviderLocationUpdate((data) => {
          console.log('Provider location updated:', data);
          setProviderLocation(data.location);
        });

        // Setup order assigned listener
        orderEvents.onOrderAssigned((data) => {
          console.log('Order assigned:', data);
          // Update UI with provider details
        });

        // Setup service completed listener
        orderEvents.onServiceCompleted((data) => {
          console.log('Service completed:', data);
          // Show completion screen or feedback form
        });

        // Setup chat listeners
        chatEvents.onNewMessage((data) => {
          console.log('New chat message:', data);
          // Update chat UI
        });
      }
    } catch (error) {
      console.error('Error setting up socket connection:', error);
    }
  };

  /**
   * Handle login
   */
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await authAPI.login(email, password);
      
      if (result.success) {
        setUser(result.user);
        setIsLoggedIn(true);
        
        // Load initial data
        await loadServices();
        await loadOrders();
      } else {
        alert(`Login failed: ${result.error}`);
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle logout
   */
  const handleLogout = async () => {
    try {
      await authAPI.logout();
      setIsLoggedIn(false);
      setUser(null);
      setServices([]);
      setOrders([]);
      setIsSocketReady(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  /**
   * Load available services
   */
  const loadServices = async () => {
    try {
      const result = await servicesAPI.getServices();
      if (result.success) {
        setServices(result.services);
      }
    } catch (error) {
      console.error('Error loading services:', error);
    }
  };

  /**
   * Load user orders
   */
  const loadOrders = async () => {
    try {
      const result = await ordersAPI.getOrders();
      if (result.success) {
        setOrders(result.orders);
      }
    } catch (error) {
      console.error('Error loading orders:', error);
    }
  };

  /**
   * Load order details and join socket room for real-time updates
   */
  const loadOrderDetails = async (orderId) => {
    try {
      const result = await ordersAPI.getOrderById(orderId);
      if (result.success) {
        setCurrentOrder(result.order);
        
        // Join socket room for this order
        if (isSocketReady) {
          orderEvents.joinOrderRoom(orderId);
        }
      }
    } catch (error) {
      console.error('Error loading order details:', error);
    }
  };

  /**
   * Add service to cart
   */
  const handleAddToCart = async (service) => {
    try {
      const result = await cartAPI.addToCart({
        serviceId: service._id,
        serviceName: service.name,
        price: service.price,
        quantity: 1,
      });

      if (result.success) {
        alert('Service added to cart!');
      } else {
        alert(`Failed to add to cart: ${result.error}`);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  /**
   * Create new order
   */
  const handleCreateOrder = async (orderData) => {
    try {
      const result = await ordersAPI.createOrder(orderData);
      
      if (result.success) {
        const newOrder = result.order;
        setOrders([newOrder, ...orders]);
        
        // Join socket room for real-time updates
        if (isSocketReady) {
          orderEvents.joinOrderRoom(newOrder._id);
        }
        
        alert('Order created successfully!');
      } else {
        alert(`Failed to create order: ${result.error}`);
      }
    } catch (error) {
      console.error('Error creating order:', error);
    }
  };

  /**
   * Render component
   */
  return (
    <div className="bfs-mobile-app">
      <h1>BFS Mobile App - Capacitor Example</h1>

      {/* Login Form */}
      {!isLoggedIn ? (
        <div className="login-section">
          <h2>Login</h2>
          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      ) : (
        <div className="app-content">
          {/* User Info */}
          <div className="user-info">
            <h2>Welcome, {user?.name || user?.email}</h2>
            <p>Socket Status: {isSocketReady ? '🟢 Connected' : '🔴 Disconnected'}</p>
            <button onClick={handleLogout}>Logout</button>
          </div>

          {/* Services List */}
          <div className="services-section">
            <h3>Available Services</h3>
            {services.length > 0 ? (
              <ul>
                {services.map((service) => (
                  <li key={service._id}>
                    <span>{service.name} - ₹{service.price}</span>
                    <button onClick={() => handleAddToCart(service)}>
                      Add to Cart
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No services available</p>
            )}
          </div>

          {/* Orders List */}
          <div className="orders-section">
            <h3>Your Orders</h3>
            {orders.length > 0 ? (
              <ul>
                {orders.map((order) => (
                  <li key={order._id}>
                    <div>
                      <strong>Order #{order._id.slice(-6)}</strong>
                      <span> - Status: {order.status}</span>
                    </div>
                    <button onClick={() => loadOrderDetails(order._id)}>
                      View Details
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No orders yet</p>
            )}
          </div>

          {/* Current Order Details with Real-time Updates */}
          {currentOrder && (
            <div className="order-details">
              <h3>Order Details (Real-time)</h3>
              <p>Order ID: {currentOrder._id}</p>
              <p>Status: {orderStatus || currentOrder.status}</p>
              {providerLocation && (
                <div>
                  <p>Provider Location:</p>
                  <p>Lat: {providerLocation.latitude}</p>
                  <p>Lng: {providerLocation.longitude}</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        .bfs-mobile-app {
          padding: 20px;
          max-width: 800px;
          margin: 0 auto;
        }

        .login-section {
          background: #f5f5f5;
          padding: 20px;
          border-radius: 8px;
        }

        form {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        input {
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
        }

        button {
          padding: 10px;
          background: #2563eb;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }

        button:disabled {
          background: #ccc;
          cursor: not-allowed;
        }

        .app-content > div {
          margin-bottom: 20px;
          padding: 15px;
          background: #f9f9f9;
          border-radius: 8px;
        }

        ul {
          list-style: none;
          padding: 0;
        }

        li {
          padding: 10px;
          background: white;
          margin-bottom: 10px;
          border-radius: 4px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
      `}</style>
    </div>
  );
};

export default BFSMobileExample;

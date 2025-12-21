/**
 * Capacitor Socket.IO Service - Real-time Communication Example
 * 
 * This module demonstrates how to use Socket.IO for real-time updates
 * in the BFS mobile app with the Express backend.
 * 
 * Features:
 * - Socket.IO client connection management
 * - JWT authentication for socket connections
 * - Real-time event listeners
 * - Auto-reconnection handling
 * - Order status updates
 * - Live tracking updates
 * - Push notification integration
 */

import { io } from 'socket.io-client';
import { getToken } from './capacitorApiService';
import { PushNotifications } from '@capacitor/push-notifications';

// Socket.IO Configuration
// TODO: Update this URL to match your backend server
// For development: Use 'http://10.0.2.2:5000' (emulator) or 'http://192.168.x.x:5000' (device)
// For production: Use your actual backend URL (e.g., 'https://api.example.com')
const SOCKET_URL = import.meta.env.VITE_API_URL || 'https://my-bfs-backend.com';
let socket = null;
let isConnected = false;

/**
 * Initialize Socket.IO connection with JWT authentication
 */
export const initializeSocket = async () => {
  try {
    const token = await getToken();
    
    if (!token) {
      console.error('No token found, cannot connect to socket');
      return null;
    }

    // Create socket connection with auth
    socket = io(SOCKET_URL, {
      auth: {
        token: token,
      },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    // Connection event listeners
    socket.on('connect', () => {
      console.log('Socket connected:', socket.id);
      isConnected = true;
    });

    socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
      isConnected = false;
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error.message);
      isConnected = false;
    });

    socket.on('reconnect', (attemptNumber) => {
      console.log('Socket reconnected after', attemptNumber, 'attempts');
      isConnected = true;
    });

    socket.on('reconnect_error', (error) => {
      console.error('Socket reconnection error:', error.message);
    });

    socket.on('reconnect_failed', () => {
      console.error('Socket reconnection failed');
    });

    return socket;
  } catch (error) {
    console.error('Error initializing socket:', error);
    return null;
  }
};

/**
 * Disconnect socket
 */
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
    isConnected = false;
  }
};

/**
 * Check if socket is connected
 */
export const isSocketConnected = () => {
  return isConnected && socket && socket.connected;
};

/**
 * Get socket instance
 */
export const getSocket = () => {
  return socket;
};

/**
 * Emit event to server
 */
export const emitEvent = (event, data) => {
  if (socket && isConnected) {
    socket.emit(event, data);
  } else {
    console.error('Socket not connected');
  }
};

/**
 * Order tracking events
 */
export const orderEvents = {
  /**
   * Join order room for real-time updates
   */
  joinOrderRoom: (orderId) => {
    if (socket && isConnected) {
      socket.emit('join-order-room', { orderId });
      console.log('Joined order room:', orderId);
    }
  },

  /**
   * Leave order room
   */
  leaveOrderRoom: (orderId) => {
    if (socket && isConnected) {
      socket.emit('leave-order-room', { orderId });
      console.log('Left order room:', orderId);
    }
  },

  /**
   * Listen for order status updates
   */
  onOrderStatusUpdate: (callback) => {
    if (socket) {
      socket.on('order-status-update', (data) => {
        console.log('Order status update:', data);
        callback(data);
        
        // Show local notification
        showLocalNotification(
          'Order Update',
          `Your order status: ${data.status}`
        );
      });
    }
  },

  /**
   * Listen for service provider location updates
   */
  onProviderLocationUpdate: (callback) => {
    if (socket) {
      socket.on('provider-location-update', (data) => {
        console.log('Provider location update:', data);
        callback(data);
      });
    }
  },

  /**
   * Listen for order assignment
   */
  onOrderAssigned: (callback) => {
    if (socket) {
      socket.on('order-assigned', (data) => {
        console.log('Order assigned:', data);
        callback(data);
        
        // Show local notification
        showLocalNotification(
          'Service Provider Assigned',
          `${data.providerName} has been assigned to your order`
        );
      });
    }
  },

  /**
   * Listen for service completion
   */
  onServiceCompleted: (callback) => {
    if (socket) {
      socket.on('service-completed', (data) => {
        console.log('Service completed:', data);
        callback(data);
        
        // Show local notification
        showLocalNotification(
          'Service Completed',
          'Your service has been completed successfully!'
        );
      });
    }
  },
};

/**
 * Chat events for customer support
 */
export const chatEvents = {
  /**
   * Join chat room
   */
  joinChatRoom: (roomId) => {
    if (socket && isConnected) {
      socket.emit('join-chat-room', { roomId });
    }
  },

  /**
   * Send message
   */
  sendMessage: (roomId, message) => {
    if (socket && isConnected) {
      socket.emit('send-message', { roomId, message, timestamp: new Date() });
    }
  },

  /**
   * Listen for new messages
   */
  onNewMessage: (callback) => {
    if (socket) {
      socket.on('new-message', (data) => {
        console.log('New message:', data);
        callback(data);
        
        // Show local notification if app is in background
        showLocalNotification('New Message', data.message);
      });
    }
  },

  /**
   * Listen for typing indicator
   */
  onTyping: (callback) => {
    if (socket) {
      socket.on('user-typing', (data) => {
        callback(data);
      });
    }
  },
};

/**
 * Service provider events (for provider app)
 */
export const providerEvents = {
  /**
   * Update provider location
   */
  updateLocation: (latitude, longitude) => {
    if (socket && isConnected) {
      socket.emit('update-location', {
        latitude,
        longitude,
        timestamp: new Date(),
      });
    }
  },

  /**
   * Listen for new service requests
   */
  onNewServiceRequest: (callback) => {
    if (socket) {
      socket.on('new-service-request', (data) => {
        console.log('New service request:', data);
        callback(data);
        
        // Show local notification
        showLocalNotification(
          'New Service Request',
          `New ${data.serviceType} request nearby`
        );
      });
    }
  },

  /**
   * Accept service request
   */
  acceptService: (requestId) => {
    if (socket && isConnected) {
      socket.emit('accept-service', { requestId });
    }
  },

  /**
   * Update service status
   */
  updateServiceStatus: (orderId, status) => {
    if (socket && isConnected) {
      socket.emit('update-service-status', { orderId, status });
    }
  },
};

/**
 * Show local notification using Capacitor Push Notifications
 */
const showLocalNotification = async (title, body) => {
  try {
    // Check if we have permission
    const permStatus = await PushNotifications.checkPermissions();
    
    if (permStatus.receive === 'granted') {
      // Schedule a local notification
      await PushNotifications.schedule({
        notifications: [
          {
            title: title,
            body: body,
            id: Date.now(),
            schedule: { at: new Date(Date.now() + 1000) },
            sound: 'default',
            smallIcon: 'ic_stat_icon_config_sample',
            iconColor: '#2563eb',
          },
        ],
      });
    }
  } catch (error) {
    console.error('Error showing local notification:', error);
  }
};

/**
 * Remove all socket event listeners
 */
export const removeAllListeners = () => {
  if (socket) {
    socket.removeAllListeners();
  }
};

/**
 * Remove specific event listener
 */
export const removeListener = (event) => {
  if (socket) {
    socket.off(event);
  }
};

export default {
  initializeSocket,
  disconnectSocket,
  isSocketConnected,
  getSocket,
  emitEvent,
  orderEvents,
  chatEvents,
  providerEvents,
  removeAllListeners,
  removeListener,
};

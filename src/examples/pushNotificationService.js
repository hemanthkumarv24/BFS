/**
 * Capacitor Push Notifications Setup
 * 
 * This module demonstrates how to setup and use Push Notifications
 * in the BFS mobile app using Capacitor.
 * 
 * Features:
 * - Request push notification permissions
 * - Register device for push notifications
 * - Handle foreground notifications
 * - Handle background notification taps
 * - Send device token to backend
 * - Local notifications support
 */

import { PushNotifications } from '@capacitor/push-notifications';
import { Preferences } from '@capacitor/preferences';
import apiClient from './capacitorApiService';

class PushNotificationService {
  constructor() {
    this.isInitialized = false;
    this.listeners = [];
  }

  /**
   * Initialize push notifications
   */
  async initialize() {
    if (this.isInitialized) {
      console.log('Push notifications already initialized');
      return;
    }

    try {
      // Check permissions
      const permStatus = await PushNotifications.checkPermissions();
      console.log('Current permission status:', permStatus);

      // Request permissions if needed
      if (permStatus.receive === 'prompt') {
        const result = await PushNotifications.requestPermissions();
        console.log('Permission request result:', result);

        if (result.receive !== 'granted') {
          console.warn('Push notification permission denied');
          return false;
        }
      } else if (permStatus.receive !== 'granted') {
        console.warn('Push notification permission not granted');
        return false;
      }

      // Register for push notifications
      await PushNotifications.register();
      
      // Setup listeners
      this.setupListeners();
      
      this.isInitialized = true;
      console.log('Push notifications initialized successfully');
      return true;
    } catch (error) {
      console.error('Error initializing push notifications:', error);
      return false;
    }
  }

  /**
   * Setup push notification listeners
   */
  setupListeners() {
    // Registration success
    PushNotifications.addListener('registration', async (token) => {
      console.log('Push registration success, token:', token.value);
      
      // Save token locally
      await Preferences.set({
        key: 'push_token',
        value: token.value,
      });

      // Send token to backend
      await this.sendTokenToBackend(token.value);
    });

    // Registration error
    PushNotifications.addListener('registrationError', (error) => {
      console.error('Push registration error:', error);
    });

    // Notification received in foreground
    PushNotifications.addListener('pushNotificationReceived', (notification) => {
      console.log('Push notification received:', notification);
      
      // Handle notification based on type
      this.handleForegroundNotification(notification);
    });

    // Notification action performed (user tapped notification)
    PushNotifications.addListener('pushNotificationActionPerformed', (action) => {
      console.log('Push notification action performed:', action);
      
      // Handle notification tap
      this.handleNotificationTap(action);
    });
  }

  /**
   * Send device token to backend
   */
  async sendTokenToBackend(token) {
    try {
      const response = await apiClient.post('/user/device-token', {
        token: token,
        platform: 'android', // or 'ios'
        timestamp: new Date().toISOString(),
      });
      
      console.log('Device token sent to backend:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error sending device token to backend:', error);
    }
  }

  /**
   * Handle notification received in foreground
   */
  handleForegroundNotification(notification) {
    const { title, body, data } = notification;
    
    console.log('Handling foreground notification:', { title, body, data });

    // Show local notification to ensure user sees it
    this.showLocalNotification(title, body, data);

    // Route based on notification type
    if (data && data.type) {
      switch (data.type) {
        case 'order_update':
          // Handle order update
          console.log('Order update notification:', data.orderId);
          break;
        case 'new_message':
          // Handle new message
          console.log('New message notification:', data.chatId);
          break;
        case 'promotion':
          // Handle promotion
          console.log('Promotion notification');
          break;
        default:
          console.log('Unknown notification type:', data.type);
      }
    }
  }

  /**
   * Handle notification tap (when app opened from notification)
   */
  handleNotificationTap(action) {
    const { notification } = action;
    const { data } = notification;
    
    console.log('Handling notification tap:', data);

    // Navigate to appropriate screen based on notification data
    if (data && data.type) {
      switch (data.type) {
        case 'order_update':
          // Navigate to order details screen
          window.location.href = `/orders/${data.orderId}`;
          break;
        case 'new_message':
          // Navigate to chat screen
          window.location.href = `/chat/${data.chatId}`;
          break;
        case 'promotion':
          // Navigate to promotions screen
          window.location.href = '/promotions';
          break;
        default:
          console.log('Unknown notification type:', data.type);
      }
    }
  }

  /**
   * Show local notification
   */
  async showLocalNotification(title, body, data = {}) {
    try {
      await PushNotifications.schedule({
        notifications: [
          {
            title: title,
            body: body,
            id: Date.now(),
            schedule: { at: new Date(Date.now() + 100) }, // Show immediately
            sound: 'default',
            smallIcon: 'ic_stat_icon_config_sample',
            iconColor: '#2563eb',
            extra: data,
          },
        ],
      });
    } catch (error) {
      console.error('Error showing local notification:', error);
    }
  }

  /**
   * Get delivered notifications (notification center)
   */
  async getDeliveredNotifications() {
    try {
      const result = await PushNotifications.getDeliveredNotifications();
      console.log('Delivered notifications:', result.notifications);
      return result.notifications;
    } catch (error) {
      console.error('Error getting delivered notifications:', error);
      return [];
    }
  }

  /**
   * Remove delivered notifications
   */
  async removeDeliveredNotifications(notificationIds) {
    try {
      await PushNotifications.removeDeliveredNotifications({
        notifications: notificationIds.map(id => ({ id })),
      });
      console.log('Removed delivered notifications');
    } catch (error) {
      console.error('Error removing delivered notifications:', error);
    }
  }

  /**
   * Remove all delivered notifications
   */
  async removeAllDeliveredNotifications() {
    try {
      await PushNotifications.removeAllDeliveredNotifications();
      console.log('Removed all delivered notifications');
    } catch (error) {
      console.error('Error removing all delivered notifications:', error);
    }
  }

  /**
   * Get stored push token
   */
  async getStoredToken() {
    try {
      const { value } = await Preferences.get({ key: 'push_token' });
      return value;
    } catch (error) {
      console.error('Error getting stored token:', error);
      return null;
    }
  }

  /**
   * Remove all listeners
   */
  removeAllListeners() {
    PushNotifications.removeAllListeners();
    console.log('Removed all push notification listeners');
  }
}

// Create singleton instance
const pushNotificationService = new PushNotificationService();

export default pushNotificationService;

/**
 * Example Usage in React Component:
 * 
 * import pushNotificationService from './pushNotificationService';
 * 
 * // In your App component or main entry point
 * useEffect(() => {
 *   const initPushNotifications = async () => {
 *     const success = await pushNotificationService.initialize();
 *     if (success) {
 *       console.log('Push notifications ready');
 *     }
 *   };
 * 
 *   initPushNotifications();
 * 
 *   // Cleanup on unmount
 *   return () => {
 *     pushNotificationService.removeAllListeners();
 *   };
 * }, []);
 * 
 * // Show a local notification
 * const showNotification = () => {
 *   pushNotificationService.showLocalNotification(
 *     'Test Notification',
 *     'This is a test notification',
 *     { orderId: '12345' }
 *   );
 * };
 * 
 * // Get delivered notifications
 * const checkNotifications = async () => {
 *   const notifications = await pushNotificationService.getDeliveredNotifications();
 *   console.log('Delivered notifications:', notifications);
 * };
 */

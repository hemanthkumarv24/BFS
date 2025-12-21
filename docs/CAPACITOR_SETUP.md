# BFS Mobile App - Capacitor Setup Guide

## Overview

This guide covers the complete Capacitor setup for the BubbleFlashServices (BFS) mobile application, including React frontend integration with Express backend, real-time Socket.IO communication, push notifications, and secure storage.

## Table of Contents

1. [Project Configuration](#project-configuration)
2. [Capacitor Configuration](#capacitor-configuration)
3. [Dependencies](#dependencies)
4. [Build Scripts](#build-scripts)
5. [REST API Integration](#rest-api-integration)
6. [Socket.IO Real-time Updates](#socketio-real-time-updates)
7. [Push Notifications](#push-notifications)
8. [Secure Storage](#secure-storage)
9. [Development Workflow](#development-workflow)
10. [Production Build](#production-build)
11. [Testing](#testing)

---

## Project Configuration

### App Details

- **App Name:** BFSApp
- **App ID:** com.bubbleflashservices.bfsapp
- **Backend URL:** https://my-bfs-backend.com
- **Web Directory:** build

### File Structure

```
BFS/
├── src/
│   ├── api/                    # Existing API services
│   ├── examples/               # Capacitor examples
│   │   ├── capacitorApiService.js
│   │   ├── capacitorSocketService.js
│   │   ├── pushNotificationService.js
│   │   └── BFSMobileExample.jsx
│   ├── components/
│   └── pages/
├── android/                    # Android platform (generated)
├── ios/                        # iOS platform (generated)
├── build/                      # Production build output
├── capacitor.config.json       # Capacitor configuration
├── package.json
└── vite.config.js
```

---

## Capacitor Configuration

### capacitor.config.json

```json
{
  "appId": "com.bubbleflashservices.bfsapp",
  "appName": "BFSApp",
  "webDir": "build",
  "server": {
    "url": "https://my-bfs-backend.com",
    "cleartext": true
  },
  "plugins": {
    "PushNotifications": {
      "presentationOptions": ["badge", "sound", "alert"]
    },
    "SplashScreen": {
      "launchShowDuration": 2000,
      "backgroundColor": "#2563eb",
      "androidScaleType": "CENTER_CROP",
      "showSpinner": false
    }
  }
}
```

### Environment-Specific Configuration

For different environments (dev, staging, production), update the `server.url`:

**Development:**
```json
"server": {
  "url": "http://localhost:5000",
  "cleartext": true
}
```

**Production:**
```json
"server": {
  "url": "https://my-bfs-backend.com",
  "cleartext": false
}
```

---

## Dependencies

### Installed Packages

```json
{
  "dependencies": {
    "@capacitor/core": "^5.x.x",
    "@capacitor/android": "^5.x.x",
    "@capacitor/push-notifications": "^5.x.x",
    "@capacitor/preferences": "^5.x.x",
    "socket.io-client": "^4.x.x",
    "axios": "^1.12.2"
  },
  "devDependencies": {
    "@capacitor/cli": "^5.x.x"
  }
}
```

### Installation

All dependencies are already installed. To reinstall:

```bash
npm install
```

---

## Build Scripts

### package.json Scripts

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "build:android": "npm run build && npx cap copy android && npx cap open android",
    "sync:android": "npx cap sync android",
    "add:android": "npx cap add android",
    "open:android": "npx cap open android"
  }
}
```

### Script Descriptions

- **`npm run build`** - Build React app for production
- **`npm run build:android`** - Build React app, copy to Android, open Android Studio
- **`npm run sync:android`** - Sync web assets with Android project
- **`npm run add:android`** - Add Android platform (run once)
- **`npm run open:android`** - Open project in Android Studio

---

## REST API Integration

### Features

- ✅ Axios-based HTTP client
- ✅ JWT token management with Capacitor Preferences
- ✅ Automatic token injection in headers
- ✅ Token refresh handling
- ✅ Error handling and retry logic
- ✅ Support for all HTTP methods

### Example Usage

```javascript
import { authAPI, servicesAPI, ordersAPI } from './examples/capacitorApiService';

// Login
const login = async () => {
  const result = await authAPI.login('user@example.com', 'password');
  if (result.success) {
    console.log('Logged in:', result.user);
  }
};

// Get Services
const getServices = async () => {
  const result = await servicesAPI.getServices();
  if (result.success) {
    console.log('Services:', result.services);
  }
};

// Create Order
const createOrder = async () => {
  const result = await ordersAPI.createOrder({
    serviceId: 'abc123',
    date: '2024-01-15',
    // ... other fields
  });
  if (result.success) {
    console.log('Order created:', result.order);
  }
};
```

### API Service Modules

#### Available APIs

1. **authAPI** - Authentication endpoints
   - `login(email, password)`
   - `signup(userData)`
   - `logout()`
   - `getProfile()`

2. **servicesAPI** - Service management
   - `getServices()`
   - `getServiceById(serviceId)`

3. **cartAPI** - Shopping cart
   - `getCart()`
   - `addToCart(item)`
   - `removeFromCart(itemId)`

4. **ordersAPI** - Order management
   - `getOrders()`
   - `createOrder(orderData)`
   - `getOrderById(orderId)`

5. **paymentsAPI** - Payment processing
   - `createPayment(amount, currency)`
   - `verifyPayment(paymentData)`

### JWT Token Storage

Tokens are securely stored using Capacitor Preferences:

```javascript
import { Preferences } from '@capacitor/preferences';

// Set token
await Preferences.set({
  key: 'jwt_token',
  value: token
});

// Get token
const { value } = await Preferences.get({ key: 'jwt_token' });

// Remove token
await Preferences.remove({ key: 'jwt_token' });
```

---

## Socket.IO Real-time Updates

### Features

- ✅ WebSocket connection with JWT authentication
- ✅ Auto-reconnection handling
- ✅ Order status updates
- ✅ Live tracking updates
- ✅ Chat/messaging support
- ✅ Provider location updates
- ✅ Local notification integration

### Example Usage

```javascript
import socketService, { orderEvents } from './examples/capacitorSocketService';

// Initialize socket connection
useEffect(() => {
  const initSocket = async () => {
    const socket = await socketService.initializeSocket();
    
    // Listen for order status updates
    orderEvents.onOrderStatusUpdate((data) => {
      console.log('Order status:', data.status);
      setOrderStatus(data.status);
    });
    
    // Listen for provider location
    orderEvents.onProviderLocationUpdate((data) => {
      console.log('Provider location:', data.location);
      updateMapMarker(data.location);
    });
  };
  
  initSocket();
  
  return () => {
    socketService.disconnectSocket();
  };
}, []);

// Join order room for real-time updates
const trackOrder = (orderId) => {
  orderEvents.joinOrderRoom(orderId);
};
```

### Socket Events

#### Order Events
- `order-status-update` - Order status changed
- `order-assigned` - Service provider assigned
- `provider-location-update` - Provider location updates
- `service-completed` - Service completion notification

#### Chat Events
- `new-message` - New chat message received
- `user-typing` - Typing indicator

#### Provider Events (for service provider app)
- `new-service-request` - New service request notification
- `update-location` - Send provider location

---

## Push Notifications

### Features

- ✅ FCM (Firebase Cloud Messaging) integration
- ✅ Permission request handling
- ✅ Foreground notifications
- ✅ Background notification taps
- ✅ Local notifications
- ✅ Custom notification actions

### Setup

```javascript
import pushNotificationService from './examples/pushNotificationService';

// Initialize push notifications
useEffect(() => {
  const initPush = async () => {
    const success = await pushNotificationService.initialize();
    if (success) {
      console.log('Push notifications ready');
    }
  };
  
  initPush();
}, []);

// Show local notification
const showNotification = () => {
  pushNotificationService.showLocalNotification(
    'Order Update',
    'Your order is on the way!',
    { orderId: '12345' }
  );
};
```

### Firebase Configuration

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Add Android app to Firebase project
3. Download `google-services.json`
4. Place it in `android/app/` directory
5. Update `android/build.gradle` and `android/app/build.gradle` (see Android Build Guide)

### Notification Payload

**Backend notification format:**

```javascript
{
  "notification": {
    "title": "Order Update",
    "body": "Your order #12345 is being processed"
  },
  "data": {
    "type": "order_update",
    "orderId": "12345",
    "status": "processing"
  }
}
```

---

## Secure Storage

### Capacitor Preferences

Capacitor Preferences provides secure, encrypted storage for sensitive data.

```javascript
import { Preferences } from '@capacitor/preferences';

// Store data
await Preferences.set({
  key: 'user_preferences',
  value: JSON.stringify({ theme: 'dark', language: 'en' })
});

// Retrieve data
const { value } = await Preferences.get({ key: 'user_preferences' });
const preferences = JSON.parse(value);

// Remove data
await Preferences.remove({ key: 'user_preferences' });

// Clear all data
await Preferences.clear();
```

### Use Cases

- JWT tokens
- User preferences
- Cart data
- Session information
- API keys (if needed)

---

## Development Workflow

### 1. Start Development Server

```bash
# Terminal 1: Start backend server
cd server
npm run dev

# Terminal 2: Start React dev server
npm run dev
```

### 2. Test in Browser

```bash
# Open http://localhost:5173
# Test API calls and Socket.IO in browser first
```

### 3. Test on Android

```bash
# Build and open in Android Studio
npm run build:android

# Or just sync changes
npm run sync:android
```

### 4. Run on Device/Emulator

- In Android Studio, click "Run" or press Shift+F10
- Select your device or emulator
- App will install and launch

### 5. Debug

**Chrome DevTools:**
- Open `chrome://inspect` in Chrome
- Click "inspect" on your app
- Access console, network, and other dev tools

**Android Studio Logcat:**
- View → Tool Windows → Logcat
- Filter by your app package: `com.bubbleflashservices.bfsapp`

---

## Production Build

### Step 1: Build React App

```bash
npm run build
```

### Step 2: Update Backend URL

Update `capacitor.config.json`:
```json
{
  "server": {
    "url": "https://my-bfs-backend.com",
    "cleartext": false
  }
}
```

### Step 3: Sync with Android

```bash
npm run sync:android
```

### Step 4: Build Signed AAB

Follow the detailed guide: [CAPACITOR_ANDROID_BUILD_GUIDE.md](./CAPACITOR_ANDROID_BUILD_GUIDE.md)

**Quick steps:**
1. Open Android Studio: `npm run open:android`
2. Build → Generate Signed Bundle/APK
3. Select Android App Bundle
4. Configure signing
5. Build release

### Step 5: Upload to Play Store

See [CAPACITOR_ANDROID_BUILD_GUIDE.md](./CAPACITOR_ANDROID_BUILD_GUIDE.md) for complete upload instructions.

---

## Testing

### Testing Checklist

- [ ] API calls working (login, services, orders)
- [ ] JWT authentication and token refresh
- [ ] Socket.IO real-time updates
- [ ] Push notifications (foreground & background)
- [ ] Notification tap navigation
- [ ] Secure storage (tokens persist)
- [ ] Network error handling
- [ ] Offline functionality (if applicable)
- [ ] Payment flow
- [ ] Location services (if applicable)

### Manual Testing

1. **Authentication Flow:**
   - Sign up new user
   - Login with credentials
   - Logout and verify token cleared
   - Token refresh on API calls

2. **Order Flow:**
   - Browse services
   - Add to cart
   - Create order
   - Track order status in real-time
   - Receive push notifications

3. **Real-time Features:**
   - Join order room
   - Receive status updates
   - View provider location on map
   - Chat with support

---

## Environment Configuration

### Development

```javascript
// capacitor.config.json
{
  "server": {
    "url": "http://10.0.2.2:5000",  // Android emulator
    // or "url": "http://192.168.1.x:5000",  // Physical device
    "cleartext": true
  }
}
```

### Staging

```javascript
{
  "server": {
    "url": "https://staging.my-bfs-backend.com",
    "cleartext": false
  }
}
```

### Production

```javascript
{
  "server": {
    "url": "https://my-bfs-backend.com",
    "cleartext": false
  }
}
```

---

## Troubleshooting

### Common Issues

**1. CORS Errors**
- Ensure backend CORS allows your app origin
- Update Express CORS configuration

**2. Network Security**
- For development, enable cleartext in `capacitor.config.json`
- For production, use HTTPS only

**3. Socket.IO Connection Failed**
- Verify backend Socket.IO server is running
- Check JWT token is valid
- Ensure network connectivity

**4. Push Notifications Not Working**
- Verify Firebase configuration
- Check `google-services.json` is in place
- Ensure permissions granted
- Test on physical device (emulator may have issues)

**5. Build Errors**
- Clean and rebuild: `cd android && ./gradlew clean`
- Sync Capacitor: `npm run sync:android`
- Update Android SDK components

---

## Best Practices

### Security

1. **Always use HTTPS** in production
2. **Never store sensitive data** in plain text
3. **Implement certificate pinning** for critical APIs
4. **Validate and sanitize** all user inputs
5. **Use ProGuard** for code obfuscation
6. **Keep dependencies updated** for security patches

### Performance

1. **Lazy load** heavy components
2. **Optimize images** before bundling
3. **Use pagination** for large lists
4. **Implement caching** for frequently accessed data
5. **Minimize Socket.IO events** to reduce battery drain

### User Experience

1. **Show loading states** during API calls
2. **Handle offline scenarios** gracefully
3. **Provide clear error messages**
4. **Implement pull-to-refresh** for data updates
5. **Use skeleton screens** for better perceived performance

---

## Additional Resources

### Documentation

- [Capacitor Official Docs](https://capacitorjs.com/docs)
- [Android Developer Guide](https://developer.android.com)
- [Socket.IO Client Docs](https://socket.io/docs/v4/client-api/)
- [Axios Documentation](https://axios-http.com/)

### Capacitor Plugins

- [Push Notifications](https://capacitorjs.com/docs/apis/push-notifications)
- [Preferences](https://capacitorjs.com/docs/apis/preferences)
- [Geolocation](https://capacitorjs.com/docs/apis/geolocation)
- [Camera](https://capacitorjs.com/docs/apis/camera)
- [File System](https://capacitorjs.com/docs/apis/filesystem)

### Community

- [Capacitor Forums](https://forum.ionicframework.com/c/capacitor/)
- [Capacitor GitHub](https://github.com/ionic-team/capacitor)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/capacitor)

---

## Support

For questions or issues specific to BFS app development, contact the development team.

**Happy Building! 🚀**

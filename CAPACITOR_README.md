# Capacitor Mobile App Setup - Complete Guide

This document provides a comprehensive overview of the Capacitor setup for the BFS (BubbleFlashServices) mobile application.

## 📱 What's Included

A complete Capacitor setup with:

✅ **Android Platform Support** - Ready for Play Store deployment  
✅ **REST API Integration** - Axios-based with JWT authentication  
✅ **Socket.IO Real-time Updates** - Live order tracking and notifications  
✅ **Push Notifications** - FCM integration with local notifications  
✅ **Secure Storage** - Encrypted token and data storage  
✅ **Example Code** - Production-ready React components  
✅ **Complete Documentation** - Setup, build, and deployment guides  

---

## 🚀 Quick Start

Get started in 5 minutes:

```bash
# 1. Install dependencies (already done)
npm install

# 2. Build React app
npm run build

# 3. Add Android platform
npm run add:android

# 4. Build and open in Android Studio
npm run build:android
```

**Detailed instructions:** [docs/QUICK_START.md](./docs/QUICK_START.md)

---

## 📋 Configuration

### Capacitor Configuration

File: `capacitor.config.json`

```json
{
  "appId": "com.bubbleflashservices.bfsapp",
  "appName": "BFSApp",
  "webDir": "build",
  "server": {
    "url": "https://my-bfs-backend.com",
    "cleartext": true
  }
}
```

**Update the `server.url` to your actual backend URL before building for production.**

### Build Scripts

New npm scripts added to `package.json`:

```bash
npm run build:android    # Build React app, copy to Android, open Android Studio
npm run sync:android     # Sync web assets with Android project
npm run add:android      # Add Android platform (run once)
npm run open:android     # Open project in Android Studio
```

---

## 📚 Documentation

Comprehensive guides available in the `docs/` directory:

1. **[QUICK_START.md](./docs/QUICK_START.md)** - Get up and running in 5 minutes
2. **[CAPACITOR_SETUP.md](./docs/CAPACITOR_SETUP.md)** - Complete setup and usage guide
3. **[CAPACITOR_ANDROID_BUILD_GUIDE.md](./docs/CAPACITOR_ANDROID_BUILD_GUIDE.md)** - Android build and Play Store deployment

### Quick Links

- **REST API Integration** → [src/examples/capacitorApiService.js](./src/examples/capacitorApiService.js)
- **Socket.IO Service** → [src/examples/capacitorSocketService.js](./src/examples/capacitorSocketService.js)
- **Push Notifications** → [src/examples/pushNotificationService.js](./src/examples/pushNotificationService.js)
- **Complete Example** → [src/examples/BFSMobileExample.jsx](./src/examples/BFSMobileExample.jsx)

---

## 🔑 Key Features

### 1. REST API Integration with JWT

Full-featured API client with automatic token management:

```javascript
import { authAPI, servicesAPI, ordersAPI } from './src/examples/capacitorApiService';

// Login with JWT
const result = await authAPI.login('user@example.com', 'password');

// Automatic token injection in all requests
const services = await servicesAPI.getServices();

// Token refresh on expiration
const orders = await ordersAPI.getOrders();
```

**Features:**
- Automatic JWT token injection
- Token refresh handling
- Secure storage using Capacitor Preferences
- Error handling and retry logic

### 2. Socket.IO Real-time Communication

Real-time updates for orders, tracking, and messaging:

```javascript
import socketService, { orderEvents } from './src/examples/capacitorSocketService';

// Initialize with JWT authentication
await socketService.initializeSocket();

// Listen for order status updates
orderEvents.onOrderStatusUpdate((data) => {
  console.log('Order status:', data.status);
});

// Track specific order
orderEvents.joinOrderRoom(orderId);
```

**Features:**
- WebSocket with JWT authentication
- Auto-reconnection handling
- Order tracking
- Live location updates
- Chat/messaging support

### 3. Push Notifications

Complete push notification system:

```javascript
import pushNotificationService from './src/examples/pushNotificationService';

// Initialize
await pushNotificationService.initialize();

// Show notification
pushNotificationService.showLocalNotification(
  'Order Update',
  'Your order is ready!',
  { orderId: '12345' }
);
```

**Features:**
- FCM (Firebase Cloud Messaging)
- Foreground & background notifications
- Local notifications
- Notification tap handling
- Custom actions

### 4. Secure Storage

Encrypted storage for sensitive data:

```javascript
import { Preferences } from '@capacitor/preferences';

// Store JWT token securely
await Preferences.set({ key: 'jwt_token', value: token });

// Retrieve token
const { value } = await Preferences.get({ key: 'jwt_token' });
```

---

## 📦 Dependencies Installed

All necessary packages have been installed:

```json
{
  "dependencies": {
    "@capacitor/core": "^5.x.x",
    "@capacitor/android": "^5.x.x",
    "@capacitor/push-notifications": "^5.x.x",
    "@capacitor/preferences": "^5.x.x",
    "socket.io-client": "^4.x.x"
  }
}
```

---

## 🛠️ Development Workflow

### Browser Testing (Fastest)

```bash
npm run dev
# Open http://localhost:5173
# Test API and Socket.IO in browser
```

### Android Device Testing

```bash
# After code changes
npm run build
npm run sync:android

# Run from Android Studio
```

### Live Reload (Advanced)

1. Start dev server: `npm run dev`
2. Update `capacitor.config.json` with your local IP
3. Sync: `npm run sync:android`
4. Run from Android Studio
5. Changes auto-reload!

---

## 🔐 Security Features

✅ **HTTPS API Calls** - All production API calls use HTTPS  
✅ **JWT Authentication** - Secure token-based authentication  
✅ **Secure Storage** - Encrypted on-device storage  
✅ **Token Refresh** - Automatic token renewal  
✅ **Network Security Config** - Android network security policies  

---

## 🏗️ Production Build

### Step 1: Update Configuration

Update `capacitor.config.json` with production backend URL:

```json
{
  "server": {
    "url": "https://my-bfs-backend.com",
    "cleartext": false
  }
}
```

### Step 2: Build

```bash
npm run build
npm run sync:android
```

### Step 3: Generate Signed AAB

Follow the complete guide: [docs/CAPACITOR_ANDROID_BUILD_GUIDE.md](./docs/CAPACITOR_ANDROID_BUILD_GUIDE.md)

**Key steps:**
1. Generate keystore for signing
2. Configure signing in Android Studio
3. Build signed AAB
4. Test thoroughly
5. Upload to Play Store

---

## 📱 Example Code

Complete working example in `src/examples/BFSMobileExample.jsx`:

- ✅ Login/Authentication
- ✅ Service browsing
- ✅ Order creation
- ✅ Real-time order tracking
- ✅ Push notifications
- ✅ Socket.IO integration

**Import and use in your app:**

```javascript
import BFSMobileExample from './examples/BFSMobileExample';

function App() {
  return <BFSMobileExample />;
}
```

---

## 🧪 Testing

### Chrome DevTools Debugging

1. Build and run app on device
2. Open Chrome: `chrome://inspect`
3. Click "inspect" on your app
4. Full DevTools available!

### Android Studio Logcat

1. View → Tool Windows → Logcat
2. Filter: `com.bubbleflashservices.bfsapp`

---

## 📋 Pre-Production Checklist

Before deploying to Play Store:

- [ ] Update backend URL to production
- [ ] Test all API endpoints with HTTPS
- [ ] Verify JWT authentication flow
- [ ] Test push notifications (foreground & background)
- [ ] Test Socket.IO real-time updates
- [ ] Configure Firebase (google-services.json)
- [ ] Generate signing keystore
- [ ] Update app version code and name
- [ ] Add app icons (all densities)
- [ ] Test on multiple devices
- [ ] Review and accept Play Store policies
- [ ] Prepare app listing (screenshots, description)

---

## 🔧 Troubleshooting

### Common Issues

**"Cannot connect to backend"**
- Check backend URL in `capacitor.config.json`
- Ensure backend is running and accessible
- For local dev: Use `10.0.2.2:5000` (emulator) or `192.168.x.x:5000` (device)

**"Socket.IO not connecting"**
- Verify JWT token is valid
- Check Socket.IO server is running
- Ensure network connectivity

**"Push notifications not working"**
- Verify Firebase configuration
- Check `google-services.json` is in `android/app/`
- Test on physical device (emulator may not support)

**Build errors**
```bash
cd android
./gradlew clean
./gradlew bundleRelease
```

---

## 📖 Additional Resources

### Official Documentation

- [Capacitor Docs](https://capacitorjs.com/docs)
- [Android Developer Guide](https://developer.android.com)
- [Socket.IO Docs](https://socket.io/docs/v4/)
- [Firebase Console](https://console.firebase.google.com/)

### Capacitor Plugins

- [Push Notifications](https://capacitorjs.com/docs/apis/push-notifications)
- [Preferences (Secure Storage)](https://capacitorjs.com/docs/apis/preferences)
- [Geolocation](https://capacitorjs.com/docs/apis/geolocation)
- [Camera](https://capacitorjs.com/docs/apis/camera)

---

## 🎯 Next Steps

1. **Review Example Code** - Check `src/examples/` for implementation details
2. **Integrate into App** - Use the example services in your components
3. **Setup Firebase** - Configure push notifications
4. **Test Thoroughly** - Test all features on device
5. **Build for Production** - Follow the Android build guide
6. **Deploy to Play Store** - Upload AAB and publish

---

## 📞 Support

For questions or issues:

1. Check the documentation in `docs/`
2. Review example code in `src/examples/`
3. Search [Capacitor Forums](https://forum.ionicframework.com/c/capacitor/)
4. Contact the development team

---

## 📄 File Structure

```
BFS/
├── capacitor.config.json           # Capacitor configuration
├── package.json                    # Updated with Capacitor scripts
├── vite.config.js                  # Updated to output to 'build'
├── docs/
│   ├── QUICK_START.md             # 5-minute setup guide
│   ├── CAPACITOR_SETUP.md         # Complete setup documentation
│   └── CAPACITOR_ANDROID_BUILD_GUIDE.md  # Android build & deployment
├── src/
│   ├── examples/
│   │   ├── capacitorApiService.js      # REST API with JWT
│   │   ├── capacitorSocketService.js   # Socket.IO real-time
│   │   ├── pushNotificationService.js  # Push notifications
│   │   └── BFSMobileExample.jsx        # Complete example component
│   ├── api/                       # Existing API services
│   ├── components/                # React components
│   └── pages/                     # Application pages
├── android/                        # Android platform (generated)
└── build/                         # Production build output
```

---

## ✅ Summary

This Capacitor setup provides everything needed to build a production-ready mobile app for BFS:

- ✅ Complete REST API integration with JWT authentication
- ✅ Real-time Socket.IO communication for live updates
- ✅ Push notifications with Firebase Cloud Messaging
- ✅ Secure storage for tokens and sensitive data
- ✅ Production-ready example code
- ✅ Comprehensive documentation
- ✅ Android build and deployment guide

**You're ready to build! 🚀**

For detailed instructions, start with [docs/QUICK_START.md](./docs/QUICK_START.md).

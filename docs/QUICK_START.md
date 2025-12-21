# BFS Mobile App - Quick Start Guide

Get your BFS Capacitor mobile app up and running in minutes!

## Prerequisites

- Node.js (v16+)
- npm or yarn
- Android Studio (for Android builds)
- Git

## Quick Setup (5 minutes)

### 1. Install Dependencies

```bash
npm install
```

### 2. Build React App

```bash
npm run build
```

### 3. Add Android Platform

```bash
npm run add:android
```

### 4. Open in Android Studio

```bash
npm run build:android
```

### 5. Run on Device

- In Android Studio, click the green "Run" button
- Select your device or emulator
- App will install and launch

## Configuration

### Update Backend URL

Edit `capacitor.config.json`:

```json
{
  "server": {
    "url": "https://your-backend-url.com"
  }
}
```

### For Local Development

```json
{
  "server": {
    "url": "http://10.0.2.2:5000",  // Android emulator
    "cleartext": true
  }
}
```

Or for physical device, use your computer's IP:

```json
{
  "server": {
    "url": "http://192.168.1.X:5000",  // Replace X with your IP
    "cleartext": true
  }
}
```

## Example Code Usage

### 1. REST API Calls

```javascript
import { authAPI, servicesAPI } from './examples/capacitorApiService';

// Login
const result = await authAPI.login('user@example.com', 'password');

// Get services
const services = await servicesAPI.getServices();
```

### 2. Socket.IO Real-time Updates

```javascript
import socketService, { orderEvents } from './examples/capacitorSocketService';

// Initialize socket
await socketService.initializeSocket();

// Listen for order updates
orderEvents.onOrderStatusUpdate((data) => {
  console.log('Order status:', data.status);
});

// Track specific order
orderEvents.joinOrderRoom(orderId);
```

### 3. Push Notifications

```javascript
import pushNotificationService from './examples/pushNotificationService';

// Initialize
await pushNotificationService.initialize();

// Show notification
pushNotificationService.showLocalNotification(
  'Order Update',
  'Your order is ready!',
  { orderId: '12345' }
);
```

## Development Workflow

### Option A: Browser Testing (Fastest)

```bash
npm run dev
# Open http://localhost:5173
```

### Option B: Android Testing

```bash
# After code changes
npm run build
npm run sync:android

# Then run from Android Studio
```

### Option C: Live Reload (Advanced)

1. Start dev server: `npm run dev`
2. Get your local IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
3. Update `capacitor.config.json`:
   ```json
   {
     "server": {
       "url": "http://192.168.1.X:5173",
       "cleartext": true
     }
   }
   ```
4. Sync: `npm run sync:android`
5. Run from Android Studio
6. Changes auto-reload on device!

## Testing Checklist

Quick tests to verify everything works:

- [ ] App launches without crashes
- [ ] Login works (JWT token stored)
- [ ] API calls return data
- [ ] Real-time updates received via Socket.IO
- [ ] Push notifications appear
- [ ] Notification tap opens correct screen

## Common Commands

```bash
# Build React app
npm run build

# Sync with Android
npm run sync:android

# Open Android Studio
npm run open:android

# Full build and open
npm run build:android
```

## Debugging

### Chrome DevTools

1. Open Chrome
2. Go to `chrome://inspect`
3. Click "inspect" on your app
4. Full DevTools available!

### Android Studio Logcat

1. View → Tool Windows → Logcat
2. Filter by package: `com.bubbleflashservices.bfsapp`

## Next Steps

1. ✅ Review example code in `src/examples/`
2. ✅ Integrate into your existing components
3. ✅ Setup Firebase for push notifications
4. ✅ Configure signing for production builds
5. ✅ Read full documentation in `docs/`

## Need Help?

- **Setup Issues:** See [CAPACITOR_SETUP.md](./CAPACITOR_SETUP.md)
- **Build Issues:** See [CAPACITOR_ANDROID_BUILD_GUIDE.md](./CAPACITOR_ANDROID_BUILD_GUIDE.md)
- **API Issues:** Check `src/examples/capacitorApiService.js` comments

## Production Build

When ready for release:

1. Update version in `android/app/build.gradle`
2. Set production backend URL in `capacitor.config.json`
3. Build: Follow [CAPACITOR_ANDROID_BUILD_GUIDE.md](./CAPACITOR_ANDROID_BUILD_GUIDE.md)
4. Upload to Play Store

**That's it! You're ready to build amazing mobile experiences! 🚀**

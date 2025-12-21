# BFS Mobile App - Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         BFS Mobile App                          │
│                    (React + Capacitor)                          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ├─── REST API (HTTPS + JWT)
                              ├─── Socket.IO (Real-time)
                              └─── Push Notifications (FCM)
                              │
┌─────────────────────────────────────────────────────────────────┐
│                    Express Backend Server                        │
│                  (https://my-bfs-backend.com)                   │
└─────────────────────────────────────────────────────────────────┘
```

## Component Architecture

### Frontend (React + Capacitor)

```
┌────────────────────────────────────────────────────────────┐
│                     React Components                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │    Auth      │  │   Services   │  │    Orders    │    │
│  │  Components  │  │  Components  │  │  Components  │    │
│  └──────────────┘  └──────────────┘  └──────────────┘    │
└────────────────────────────────────────────────────────────┘
                          │
┌────────────────────────────────────────────────────────────┐
│              Capacitor Service Layer                        │
│  ┌──────────────────┐  ┌──────────────────┐               │
│  │  API Service     │  │  Socket Service  │               │
│  │  - JWT Auth      │  │  - Real-time     │               │
│  │  - HTTP Calls    │  │  - Order Track   │               │
│  │  - Token Mgmt    │  │  - Live Updates  │               │
│  └──────────────────┘  └──────────────────┘               │
│  ┌──────────────────┐  ┌──────────────────┐               │
│  │  Push Notif      │  │  Secure Storage  │               │
│  │  - FCM           │  │  - Preferences   │               │
│  │  - Local Notif   │  │  - JWT Tokens    │               │
│  └──────────────────┘  └──────────────────┘               │
└────────────────────────────────────────────────────────────┘
                          │
┌────────────────────────────────────────────────────────────┐
│                  Capacitor Native Bridge                    │
│              (Android / iOS Platform APIs)                  │
└────────────────────────────────────────────────────────────┘
```

## Data Flow

### 1. Authentication Flow

```
User Input
    │
    ▼
┌─────────────────────┐
│   Login Component   │
│   - Email/Password  │
└─────────────────────┘
    │
    ▼
┌─────────────────────┐         HTTPS POST
│  authAPI.login()    │────────────────────────┐
└─────────────────────┘                        │
    │                                           ▼
    │                                  ┌──────────────────┐
    │                                  │  Express Server  │
    │                                  │  /api/auth/login │
    │                                  └──────────────────┘
    │                                           │
    │                          ┌────────────────┘
    │                          │ JWT Token
    ▼                          ▼
┌─────────────────────────────────────┐
│    Capacitor Preferences (Secure)   │
│         Store JWT Token             │
└─────────────────────────────────────┘
    │
    ▼
┌─────────────────────┐
│   App Authenticated │
│   - Socket.IO Init  │
│   - Push Notif Setup│
└─────────────────────┘
```

### 2. Order Tracking Flow (Real-time)

```
┌─────────────────┐
│  Create Order   │
└─────────────────┘
        │
        ▼
┌─────────────────────────┐      HTTPS POST
│ ordersAPI.createOrder() │──────────────────┐
└─────────────────────────┘                  │
        │                                    ▼
        │                           ┌────────────────┐
        │                           │ Express Server │
        │                           │ Creates Order  │
        │                           └────────────────┘
        │                                    │
        ▼                                    │
┌──────────────────────────┐                │
│ orderEvents.joinRoom()   │                │
│   - Join Socket.IO Room  │                │
└──────────────────────────┘                │
        │                                    │
        │ ◄──────────────────────────────────┘
        │      Socket.IO Events
        │
        ▼
┌────────────────────────────────────┐
│  Real-time Updates Received:       │
│  - Order Status Changes            │
│  - Provider Assigned               │
│  - Provider Location Updates       │
│  - Service Completion              │
└────────────────────────────────────┘
        │
        ▼
┌────────────────────────────────────┐
│  Update UI + Show Notification     │
└────────────────────────────────────┘
```

### 3. Push Notification Flow

```
┌──────────────────────┐
│   App Initialization │
└──────────────────────┘
         │
         ▼
┌────────────────────────────────┐
│ pushNotificationService.init() │
│  - Request Permission          │
│  - Register with FCM           │
└────────────────────────────────┘
         │
         ▼
┌────────────────────────────┐
│   FCM Returns Device Token │
└────────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐     POST /user/device-token
│ Send Token to Backend           │──────────────────────────────┐
└─────────────────────────────────┘                              │
                                                                  ▼
                                                         ┌────────────────┐
                                                         │ Express Server │
                                                         │ Stores Token   │
                                                         └────────────────┘
                                                                  │
         ┌────────────────────────────────────────────────────────┘
         │ When Event Occurs (Order Update, etc.)
         │ Backend Sends Push Notification
         ▼
┌────────────────────────────┐
│   Device Receives Push     │
│   - Show Notification      │
│   - Play Sound/Vibration   │
└────────────────────────────┘
         │
         ▼ User Taps Notification
┌────────────────────────────┐
│   App Opens to Relevant    │
│   Screen (Order Details)   │
└────────────────────────────┘
```

## File Structure

```
BFS/
│
├── capacitor.config.json          # Capacitor configuration
│   └── App ID, Name, Server URL
│
├── package.json                   # NPM dependencies & scripts
│   └── Capacitor scripts (build:android, sync:android)
│
├── vite.config.js                 # Vite build config
│   └── Output directory: build
│
├── src/
│   ├── examples/                  # Example implementations
│   │   ├── capacitorApiService.js      # REST API + JWT
│   │   ├── capacitorSocketService.js   # Socket.IO
│   │   ├── pushNotificationService.js  # Push Notifications
│   │   ├── BFSMobileExample.jsx        # Complete example
│   │   └── types.d.ts                  # TypeScript types
│   │
│   ├── api/                       # Existing API services
│   ├── components/                # React components
│   └── pages/                     # App pages
│
├── docs/
│   ├── QUICK_START.md            # Quick setup guide
│   ├── CAPACITOR_SETUP.md        # Complete documentation
│   └── CAPACITOR_ANDROID_BUILD_GUIDE.md  # Build guide
│
├── android/                       # Android platform (generated)
│   ├── app/
│   │   ├── build.gradle          # Build configuration
│   │   ├── src/main/
│   │   │   ├── AndroidManifest.xml
│   │   │   └── res/              # Resources (icons, etc.)
│   │   └── google-services.json  # Firebase config
│   └── build.gradle
│
└── build/                         # Production build output
    ├── index.html
    ├── assets/
    └── ...
```

## API Endpoints

### REST API Endpoints (HTTPS)

```
Authentication:
  POST   /api/auth/login           - Login with credentials
  POST   /api/auth/signup          - Register new user
  POST   /api/auth/logout          - Logout user
  GET    /api/auth/me              - Get user profile
  POST   /api/auth/refresh         - Refresh JWT token

Services:
  GET    /api/services             - Get all services
  GET    /api/services/:id         - Get service by ID

Cart:
  GET    /api/cart                 - Get user cart
  POST   /api/cart                 - Add item to cart
  DELETE /api/cart/:id             - Remove item from cart

Orders:
  GET    /api/orders               - Get user orders
  POST   /api/orders               - Create new order
  GET    /api/orders/:id           - Get order by ID

Payments:
  POST   /api/payments/create-order    - Create payment
  POST   /api/payments/verify          - Verify payment

Push Notifications:
  POST   /api/user/device-token    - Register device token
```

### Socket.IO Events

```
Connection:
  connect              - Socket connected
  disconnect           - Socket disconnected
  connect_error        - Connection error

Order Tracking:
  join-order-room      - Join order updates room
  leave-order-room     - Leave order updates room
  order-status-update  - Order status changed
  order-assigned       - Provider assigned
  provider-location-update  - Provider location
  service-completed    - Service finished

Chat:
  join-chat-room       - Join chat room
  send-message         - Send chat message
  new-message          - New message received
  user-typing          - Typing indicator

Provider (Service Provider App):
  update-location      - Update provider location
  new-service-request  - New service request
  accept-service       - Accept service request
  update-service-status - Update service status
```

## Security Features

### 1. JWT Authentication
- Token stored securely in Capacitor Preferences (encrypted)
- Automatic token injection in all API requests
- Token refresh on expiration
- Secure logout with token removal

### 2. HTTPS/TLS
- All API calls use HTTPS
- Certificate validation
- Network security configuration for Android

### 3. Secure Storage
- Capacitor Preferences (encrypted on device)
- No sensitive data in localStorage
- Automatic cleanup on logout

### 4. Socket.IO Security
- JWT authentication for WebSocket connection
- Server-side validation
- Room-based access control

## Performance Optimization

### 1. Code Splitting
- Lazy loading of routes
- Dynamic imports for heavy components

### 2. Caching Strategy
- API response caching
- Offline data persistence
- Service Worker (optional)

### 3. Bundle Optimization
- Vite production build
- Tree shaking
- Minification and compression

## Testing Strategy

### 1. Development Testing
- Browser testing with dev server
- Chrome DevTools for debugging
- Network request inspection

### 2. Device Testing
- Android emulator testing
- Physical device testing
- Different Android versions

### 3. Production Testing
- Internal testing track (Google Play)
- Beta testing with real users
- Performance monitoring

## Deployment Pipeline

```
┌─────────────────┐
│  Code Changes   │
└─────────────────┘
        │
        ▼
┌─────────────────┐
│  npm run build  │ ────► React production build
└─────────────────┘
        │
        ▼
┌─────────────────────┐
│ npx cap sync android│ ────► Copy to Android
└─────────────────────┘
        │
        ▼
┌─────────────────────┐
│  Android Studio     │ ────► Build signed AAB
│  Generate AAB       │
└─────────────────────┘
        │
        ▼
┌─────────────────────┐
│  Google Play Console│ ────► Upload & Publish
└─────────────────────┘
        │
        ▼
┌─────────────────────┐
│   Users Download    │
└─────────────────────┘
```

## Monitoring & Analytics

### 1. Error Tracking
- Console error logging
- API error monitoring
- Socket.IO error handling

### 2. Performance Monitoring
- App load time
- API response times
- Real-time connection quality

### 3. User Analytics
- Feature usage tracking
- User flow analysis
- Conversion tracking

## Future Enhancements

### Potential Additions
- [ ] iOS platform support
- [ ] Offline mode with sync
- [ ] Biometric authentication
- [ ] In-app chat with attachments
- [ ] Payment gateway integration
- [ ] Map integration for live tracking
- [ ] Rating and review system
- [ ] Multi-language support
- [ ] Dark mode theme
- [ ] Analytics dashboard

## Support & Resources

### Documentation
- [QUICK_START.md](./QUICK_START.md) - Quick setup
- [CAPACITOR_SETUP.md](./CAPACITOR_SETUP.md) - Complete guide
- [CAPACITOR_ANDROID_BUILD_GUIDE.md](./CAPACITOR_ANDROID_BUILD_GUIDE.md) - Build guide

### External Resources
- [Capacitor Docs](https://capacitorjs.com/docs)
- [React Docs](https://react.dev)
- [Socket.IO Docs](https://socket.io/docs/v4/)
- [Firebase Docs](https://firebase.google.com/docs)

---

**Built with ❤️ for BubbleFlashServices**

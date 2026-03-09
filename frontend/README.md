# FindMe Frontend

React application with real-time chat, voice recording, and push notifications.

## Features

- User authentication (register/login)
- Post lost/found items with image or voice
- Real-time chat with Socket.io
- Push notifications with Firebase
- Voice recording with MediaRecorder API
- Responsive design
- Protected routes

## Tech Stack

- React 18
- React Router v6
- Socket.io Client
- Axios
- Firebase (FCM)
- React Toastify
- date-fns

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your credentials
```

3. Start development server:
```bash
npm start
```

4. Build for production:
```bash
npm run build
```

## Environment Variables

- `REACT_APP_API_URL`: Backend API URL
- `REACT_APP_SOCKET_URL`: Socket.io server URL
- `REACT_APP_FIREBASE_*`: Firebase configuration

## Project Structure

```
src/
├── components/     # Reusable components
├── context/        # React Context (Auth, Socket)
├── hooks/          # Custom hooks
├── pages/          # Page components
├── services/       # API clients
├── utils/          # Utility functions
├── App.js          # Root component
└── index.js        # Entry point
```

## Key Components

### Context

#### AuthContext
Manages user authentication state and provides login/logout functions.

```javascript
const { user, token, login, logout } = useAuth();
```

#### SocketContext
Manages Socket.io connection with JWT authentication.

```javascript
const socket = useSocket();
```

### Hooks

#### useVoiceRecording
Custom hook for voice recording using MediaRecorder API.

```javascript
const { isRecording, audioBlob, startRecording, stopRecording } = useVoiceRecording();
```

### Pages

- **Login/Register**: User authentication
- **Dashboard**: View all lost/found items
- **PostItem**: Create new item with image or voice
- **ItemDetails**: View single item details
- **Matches**: View matched items
- **Chat**: Real-time messaging
- **Notifications**: Notification center

## Features

### Voice Recording
- Uses MediaRecorder API
- Records in WebM format
- Playback before submission
- Automatic transcription on backend

### Real-time Chat
- Socket.io connection with JWT auth
- Typing indicators
- Read receipts
- Auto-scroll to latest message
- Message persistence

### Push Notifications
- Firebase Cloud Messaging
- Background notifications
- Click-to-action
- Service worker integration

### Protected Routes
- Automatic redirect to login
- JWT token validation
- Loading states

## Firebase Setup

1. Create Firebase project
2. Enable Cloud Messaging
3. Get web app configuration
4. Add to `.env`
5. Create `public/firebase-messaging-sw.js`:

```javascript
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "your-api-key",
  authDomain: "your-auth-domain",
  projectId: "your-project-id",
  storageBucket: "your-storage-bucket",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/logo192.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
```

## Deployment

### Vercel
```bash
vercel --prod
```

### Netlify
```bash
netlify deploy --prod
```

### Docker
```bash
docker build -t findme-frontend .
docker run -p 3000:3000 findme-frontend
```

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance

- Code splitting with React.lazy
- Image lazy loading
- Optimized bundle size
- Service worker caching
- Compression (gzip)

## Accessibility

- Semantic HTML
- ARIA labels
- Keyboard navigation
- Screen reader support
- Color contrast compliance

## License

MIT

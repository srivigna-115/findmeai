# FindMe - System Architecture

## Overview

FindMe is a production-ready, AI-powered Lost and Found platform built with a microservices-inspired architecture.

## Architecture Diagram

```
┌─────────────┐
│   Frontend  │ (React + Socket.io Client)
│   Port 3000 │
└──────┬──────┘
       │ HTTP/WebSocket
       ▼
┌─────────────┐
│   Backend   │ (Node.js + Express + Socket.io)
│   Port 5000 │
└──────┬──────┘
       │
       ├─────────► MongoDB (Database)
       │
       └─────────► AI Service (Python + Flask)
                   Port 5001
```

## Technology Stack

### Backend (Node.js)
- Express.js - Web framework
- MongoDB + Mongoose - Database
- Socket.io - Real-time communication
- JWT + bcrypt - Authentication
- Cloudinary - Image storage
- Nodemailer - Email notifications
- Firebase Admin - Push notifications

### AI Service (Python)
- Flask - Web framework
- PyTorch + Transformers - ML models
- CLIP - Image/text embeddings
- Google Speech-to-Text - Audio transcription
- NumPy - Vector operations

### Frontend (React)
- React Router - Navigation
- Axios - HTTP client
- Socket.io Client - Real-time
- React Toastify - Notifications
- Firebase - Push notifications

## Core Components

### 1. Authentication System
- JWT-based authentication
- bcrypt password hashing (12+ salt rounds)
- Token-based authorization
- Rate limiting on auth endpoints

### 2. Item Management
- CRUD operations for lost/found items
- Multi-modal input (image, text, voice)
- Category-based organization
- Status tracking (active, matched, resolved)

### 3. AI Matching Engine
- Image embedding generation (CLIP)
- Text embedding generation
- Cosine similarity matching
- Configurable thresholds
- Async matching workflow

### 4. Real-time Chat
- Socket.io with JWT authentication
- Room-based messaging
- Typing indicators
- Read receipts
- Message persistence

### 5. Notification System
- In-app notifications (MongoDB)
- Push notifications (FCM)
- Email notifications (SMTP)
- Multi-channel delivery

## Data Flow

### Item Posting Flow
1. User submits item (image/text/voice)
2. Backend validates and stores metadata
3. Media uploaded to Cloudinary
4. AI service generates embeddings
5. Embeddings stored in MongoDB
6. Async matching triggered

### Matching Flow
1. New item triggers matching service
2. Query opposite type items (lost ↔ found)
3. Filter by category and status
4. Calculate similarity scores
5. If score > threshold:
   - Create match record
   - Update item statuses
   - Generate chat room
   - Send notifications

### Chat Flow
1. User clicks chat link
2. Socket authenticates with JWT
3. User joins room (authorization check)
4. Messages sent via Socket.io
5. Messages persisted to MongoDB
6. Real-time delivery to participants

## Security Features

- JWT authentication with secure secrets
- bcrypt password hashing (12 salt rounds)
- Rate limiting (5 req/15min on auth)
- CORS configuration
- Helmet security headers
- Input validation and sanitization
- File upload validation (size, MIME type)
- Role-based access control
- Socket.io JWT authentication
- Secure room access control

## Scalability Considerations

- Stateless backend (horizontal scaling)
- Separate AI service (independent scaling)
- MongoDB indexes for query optimization
- Async matching (non-blocking)
- Socket.io with Redis adapter (multi-instance)
- CDN for static assets
- Database connection pooling

## Deployment Architecture

```
Production Environment:
- Backend: Render/Railway (Node.js)
- AI Service: Render/Railway (Python)
- Frontend: Vercel/Netlify (Static)
- Database: MongoDB Atlas (Managed)
- Storage: Cloudinary (CDN)
- Email: SMTP (Gmail/SendGrid)
- Push: Firebase Cloud Messaging
```

## API Endpoints

### Authentication
- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/me
- PUT /api/auth/fcm-token

### Items
- POST /api/items (with file upload)
- GET /api/items
- GET /api/items/my-items
- GET /api/items/:id
- PUT /api/items/:id
- DELETE /api/items/:id

### Matches
- GET /api/matches
- GET /api/matches/:id

### Chat
- GET /api/chat/:chatRoomId/messages
- POST /api/chat/:chatRoomId/read

### Notifications
- GET /api/notifications
- PUT /api/notifications/:id/read
- PUT /api/notifications/read-all

### AI Service
- POST /embed (image embedding)
- POST /embed-text (text embedding)
- POST /match (similarity matching)
- POST /transcribe (audio to text)

## Database Schema

### Users
- name, email, password (hashed)
- phone, fcmToken
- isActive, timestamps

### Items
- user, type (lost/found)
- title, description, category
- date, location
- imageUrl, imageEmbedding
- audioUrl, audioTranscript
- textEmbedding
- status, matchedWith, matchScore

### Matches
- lostItem, foundItem
- lostUser, foundUser
- matchScore, matchType
- chatRoomId, status
- notificationsSent

### Messages
- chatRoomId, sender
- content, type
- readBy, timestamps

### Notifications
- user, type
- title, message
- data, read, link

## Performance Optimization

- Database indexing on frequently queried fields
- Embedding vector normalization
- Efficient cosine similarity calculation
- Message pagination
- Lazy loading of images
- Compression middleware
- CDN for static assets

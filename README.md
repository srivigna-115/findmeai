# FindMe - AI-Powered Lost and Found Platform

A production-ready, full-stack application that uses AI to match lost and found items through image recognition, text analysis, and voice descriptions.

## Features

- **AI-Powered Matching**: CLIP-based image embeddings and NLP text matching
- **Multi-Modal Input**: Upload images, type descriptions, or record voice messages
- **Real-Time Chat**: Socket.io powered messaging between matched users
- **Smart Notifications**: In-app, email, and push notifications
- **Voice Recognition**: Google Speech-to-Text transcription
- **Secure Authentication**: JWT-based auth with bcrypt password hashing
- **Cloud Storage**: Cloudinary integration for images and audio

## Tech Stack

### Backend
- Node.js + Express.js
- MongoDB + Mongoose
- Socket.io (real-time chat)
- JWT + bcrypt (authentication)
- Cloudinary (media storage)
- Nodemailer (email notifications)
- Firebase Admin (push notifications)

### AI Service
- Python + Flask
- PyTorch + Transformers
- CLIP (OpenAI's vision model)
- Google Speech-to-Text API
- NumPy (vector operations)

### Frontend
- React 18
- React Router v6
- Socket.io Client
- Axios
- React Toastify
- Firebase (push notifications)

## Quick Start

### Prerequisites
- Node.js 16+
- Python 3.8+
- MongoDB
- Docker (optional)

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/findme.git
cd findme
```

2. Set up environment variables

Create `.env` files in each service directory:

**backend/.env**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/findme
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d
AI_SERVICE_URL=http://localhost:5001
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
FRONTEND_URL=http://localhost:3000
```

**ai-service/.env**
```env
PORT=5001
GOOGLE_APPLICATION_CREDENTIALS=path/to/credentials.json
```

**frontend/.env**
```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_SOCKET_URL=http://localhost:5000
REACT_APP_FIREBASE_API_KEY=your-firebase-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
REACT_APP_FIREBASE_APP_ID=your-app-id
REACT_APP_FIREBASE_VAPID_KEY=your-vapid-key
```

3. Install dependencies

```bash
# Backend
cd backend
npm install

# AI Service
cd ../ai-service
pip install -r requirements.txt

# Frontend
cd ../frontend
npm install
```

4. Run the application

**Option A: Using Docker Compose (Recommended)**
```bash
docker-compose up
```

**Option B: Manual Start**
```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - AI Service
cd ai-service
python app.py

# Terminal 3 - Frontend
cd frontend
npm start
```

5. Access the application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- AI Service: http://localhost:5001

## Project Structure

```
findme/
├── backend/              # Node.js backend
│   ├── src/
│   │   ├── config/      # Database config
│   │   ├── controllers/ # Route controllers
│   │   ├── middleware/  # Auth, validation, upload
│   │   ├── models/      # Mongoose models
│   │   ├── routes/      # API routes
│   │   ├── services/    # Business logic
│   │   ├── socket/      # Socket.io handlers
│   │   └── server.js    # Entry point
│   └── package.json
├── ai-service/          # Python AI service
│   ├── services/
│   │   ├── embedding_service.py
│   │   ├── matching_service.py
│   │   └── transcription_service.py
│   ├── app.py
│   └── requirements.txt
├── frontend/            # React frontend
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── context/     # React context
│   │   ├── hooks/       # Custom hooks
│   │   ├── pages/       # Page components
│   │   └── App.js
│   └── package.json
└── docker-compose.yml
```

## API Documentation

See [API.md](API.md) for complete API documentation.

### Key Endpoints

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/items` - Create lost/found item
- `GET /api/items` - Get all items
- `GET /api/matches` - Get user matches
- `GET /api/chat/:chatRoomId/messages` - Get chat messages

## How It Works

1. **User posts an item** (lost or found) with image, text, or voice description
2. **AI generates embeddings** using CLIP for images and text
3. **Matching engine** compares embeddings using cosine similarity
4. **When match found** (score > 0.78):
   - Creates match record
   - Generates secure chat room
   - Sends notifications (in-app, email, push)
5. **Users chat** in real-time to verify and arrange return

## Matching Algorithm

- **Image Matching**: CLIP embeddings + cosine similarity (threshold: 0.78)
- **Text Matching**: TF-IDF + word overlap (threshold: 0.70)
- **Cross-Modal**: Image-to-text and text-to-image matching
- **Voice**: Transcribed to text, then matched

## Security Features

- JWT authentication with secure tokens
- bcrypt password hashing (12 salt rounds)
- Rate limiting (5 req/15min on auth, 100 req/15min on API)
- CORS configuration
- Helmet security headers
- Input validation and sanitization
- File upload validation
- Socket.io JWT authentication

## Deployment

### Docker Deployment
```bash
docker-compose -f docker-compose.yml up -d
```

### Manual Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions for:
- Render
- Railway
- Heroku
- AWS
- DigitalOcean

## Configuration

### Matching Thresholds

Adjust in `backend/src/services/matchingService.js`:
```javascript
const IMAGE_SIMILARITY_THRESHOLD = 0.78;  // Image matching
const TEXT_SIMILARITY_THRESHOLD = 0.70;   // Text matching
```

### Email Notifications

Configure SMTP in `backend/.env`:
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

### Push Notifications

1. Create Firebase project
2. Download service account key
3. Add to `backend/.env`:
```env
FIREBASE_SERVICE_ACCOUNT=path/to/serviceAccountKey.json
```

## Testing

```bash
# Backend tests
cd backend
npm test

# AI Service tests
cd ai-service
pytest

# Frontend tests
cd frontend
npm test
```

## Troubleshooting

### Common Issues

**MongoDB Connection Error**
```bash
# Make sure MongoDB is running
mongod --dbpath /path/to/data
```

**AI Service Import Error**
```bash
# Install missing dependencies
pip install -r requirements.txt
```

**CORS Error**
- Check `FRONTEND_URL` in backend `.env`
- Verify frontend is running on correct port

**Socket.io Connection Failed**
- Ensure backend is running
- Check `REACT_APP_SOCKET_URL` in frontend `.env`

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- OpenAI CLIP for image-text embeddings
- Google Cloud for Speech-to-Text API
- Cloudinary for media storage
- MongoDB for database
- Socket.io for real-time communication

## Support

For issues and questions:
- Open an issue on GitHub
- Email: support@findme.com
- Documentation: [Full Docs](ARCHITECTURE.md)

## Roadmap

- [ ] Mobile app (React Native)
- [ ] Advanced search filters
- [ ] Map view of items
- [ ] User ratings and reviews
- [ ] Multi-language support
- [ ] SMS notifications
- [ ] Social media integration

---

Made with ❤️ by the FindMe Team

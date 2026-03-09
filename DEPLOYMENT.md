# FindMe - Deployment Guide

## Prerequisites

- Node.js 18+
- Python 3.11+
- MongoDB 7.0+
- Docker & Docker Compose (optional)
- Cloudinary account
- Firebase project
- Google Cloud project (for Speech-to-Text)
- SMTP credentials

## Local Development Setup

### 1. Clone and Install

```bash
# Clone repository
git clone <repository-url>
cd findme

# Install backend dependencies
cd backend
npm install
cp .env.example .env
# Edit .env with your credentials

# Install AI service dependencies
cd ../ai-service
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your credentials

# Install frontend dependencies
cd ../frontend
npm install
cp .env.example .env
# Edit .env with your credentials
```

### 2. Configure Environment Variables

#### Backend (.env)
```env
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:3000
MONGODB_URI=mongodb://localhost:27017/findme
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d
BCRYPT_SALT_ROUNDS=12
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
AI_SERVICE_URL=http://localhost:5001
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM=FindMe <noreply@findme.com>
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY=your-private-key
FIREBASE_CLIENT_EMAIL=your-client-email
IMAGE_SIMILARITY_THRESHOLD=0.78
TEXT_SIMILARITY_THRESHOLD=0.70
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/jpg,audio/webm,audio/wav
```

#### AI Service (.env)
```env
FLASK_ENV=development
PORT=5001
GOOGLE_APPLICATION_CREDENTIALS=path/to/service-account.json
MODEL_NAME=openai/clip-vit-base-patch32
```

#### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
REACT_APP_FIREBASE_API_KEY=your-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-auth-domain
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-storage-bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
REACT_APP_FIREBASE_APP_ID=your-app-id
REACT_APP_FIREBASE_VAPID_KEY=your-vapid-key
```

### 3. Start Services

#### Option A: Manual Start
```bash
# Terminal 1 - MongoDB
mongod

# Terminal 2 - Backend
cd backend
npm run dev

# Terminal 3 - AI Service
cd ai-service
python app.py

# Terminal 4 - Frontend
cd frontend
npm start
```

#### Option B: Docker Compose
```bash
docker-compose up --build
```

### 4. Access Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- AI Service: http://localhost:5001

## Production Deployment

### Backend Deployment (Render/Railway)

1. Create new Web Service
2. Connect GitHub repository
3. Set build command: `cd backend && npm install`
4. Set start command: `cd backend && npm start`
5. Add environment variables from .env
6. Deploy

### AI Service Deployment (Render/Railway)

1. Create new Web Service
2. Connect GitHub repository
3. Set build command: `cd ai-service && pip install -r requirements.txt`
4. Set start command: `cd ai-service && gunicorn --bind 0.0.0.0:$PORT --workers 2 --timeout 120 app:app`
5. Add environment variables from .env
6. Deploy

### Frontend Deployment (Vercel)

1. Import project from GitHub
2. Set root directory: `frontend`
3. Build command: `npm run build`
4. Output directory: `build`
5. Add environment variables
6. Deploy

### Database Setup (MongoDB Atlas)

1. Create cluster
2. Create database user
3. Whitelist IP addresses (0.0.0.0/0 for development)
4. Get connection string
5. Update MONGODB_URI in backend

### Cloudinary Setup

1. Sign up at cloudinary.com
2. Get cloud name, API key, API secret
3. Update backend .env

### Firebase Setup

1. Create Firebase project
2. Enable Cloud Messaging
3. Generate service account key
4. Add credentials to backend .env
5. Get web app config for frontend

### Google Cloud Speech-to-Text

1. Create Google Cloud project
2. Enable Speech-to-Text API
3. Create service account
4. Download JSON key
5. Set GOOGLE_APPLICATION_CREDENTIALS path

### Email Setup (Gmail)

1. Enable 2FA on Gmail account
2. Generate App Password
3. Use in SMTP_PASS

## Docker Production Deployment

```bash
# Build images
docker-compose -f docker-compose.prod.yml build

# Start services
docker-compose -f docker-compose.prod.yml up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## Environment-Specific Configuration

### Development
- Detailed error messages
- Hot reloading
- Debug logging
- Local database

### Production
- Error logging only
- Optimized builds
- Rate limiting
- Managed database
- CDN for assets
- HTTPS only
- Secure cookies

## Health Checks

```bash
# Backend health
curl http://localhost:5000/health

# AI Service health
curl http://localhost:5001/health
```

## Monitoring

- Use PM2 for Node.js process management
- Set up error tracking (Sentry)
- Monitor API response times
- Track database performance
- Monitor AI service GPU usage
- Set up uptime monitoring

## Backup Strategy

- Daily MongoDB backups (Atlas automated)
- Cloudinary automatic backups
- Environment variable backups
- Code repository backups

## Scaling Considerations

### Horizontal Scaling
- Deploy multiple backend instances
- Use Redis for Socket.io adapter
- Load balancer for traffic distribution

### Vertical Scaling
- Increase server resources
- Optimize database queries
- Cache frequently accessed data

### AI Service Scaling
- GPU instances for faster inference
- Model optimization (quantization)
- Batch processing for embeddings

## Security Checklist

- [ ] Change all default secrets
- [ ] Enable HTTPS
- [ ] Configure CORS properly
- [ ] Set secure cookie flags
- [ ] Enable rate limiting
- [ ] Validate all inputs
- [ ] Sanitize file uploads
- [ ] Use environment variables
- [ ] Enable database authentication
- [ ] Regular security updates
- [ ] Monitor for vulnerabilities
- [ ] Implement logging and auditing

## Troubleshooting

### Backend won't start
- Check MongoDB connection
- Verify environment variables
- Check port availability

### AI Service errors
- Verify Python dependencies
- Check Google Cloud credentials
- Ensure sufficient memory

### Socket.io connection fails
- Check CORS configuration
- Verify JWT token
- Check firewall rules

### Image upload fails
- Verify Cloudinary credentials
- Check file size limits
- Validate MIME types

## Performance Optimization

- Enable gzip compression
- Use CDN for static assets
- Implement caching strategies
- Optimize database indexes
- Use connection pooling
- Lazy load images
- Implement pagination
- Optimize bundle size

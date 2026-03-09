# FindMe Backend

Node.js + Express backend with MongoDB, Socket.io, and JWT authentication.

## Features

- JWT authentication with bcrypt password hashing
- RESTful API with MVC architecture
- Real-time chat with Socket.io
- Multi-channel notifications (FCM, Email, In-app)
- AI service integration for matching
- File upload to Cloudinary
- Rate limiting and security middleware
- Input validation and sanitization

## Tech Stack

- Node.js 18+
- Express.js
- MongoDB + Mongoose
- Socket.io
- JWT + bcrypt
- Cloudinary
- Nodemailer
- Firebase Admin SDK

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

3. Start MongoDB:
```bash
mongod
```

4. Run development server:
```bash
npm run dev
```

5. Run production server:
```bash
npm start
```

## Environment Variables

See `.env.example` for all required variables.

Key variables:
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT signing
- `CLOUDINARY_*`: Cloudinary credentials
- `AI_SERVICE_URL`: AI service endpoint
- `SMTP_*`: Email configuration
- `FIREBASE_*`: Firebase credentials

## API Endpoints

See `../API.md` for complete API documentation.

## Project Structure

```
src/
├── config/         # Configuration files
├── controllers/    # Request handlers
├── middleware/     # Express middleware
├── models/         # Mongoose models
├── routes/         # API routes
├── services/       # Business logic
├── socket/         # Socket.io handlers
└── server.js       # Entry point
```

## Testing

```bash
npm test
```

## Security

- JWT authentication
- bcrypt password hashing (12 salt rounds)
- Rate limiting
- Input validation
- CORS configuration
- Helmet security headers
- File upload validation

## Deployment

See `../DEPLOYMENT.md` for deployment instructions.

Recommended platforms:
- Render
- Railway
- Heroku

## License

MIT

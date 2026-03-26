const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const path = require('path');
const connectDB = require('./config/database');
const { errorHandler } = require('./middleware/errorHandler');
const { initializeSocket } = require('./socket/socketHandler');

dotenv.config();

const app = express();
const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Connect to database
connectDB();

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: false
}));

app.options('*', cors());

app.use(compression());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
}, express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/items', require('./routes/itemRoutes'));
app.use('/api/matches', require('./routes/matchRoutes'));
app.use('/api/chat', require('./routes/chatRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/transcribe', require('./routes/transcriptionRoutes'));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/', (req, res) => {
  res.json({ status: 'ok', service: 'FindMe Backend' });
});

// Serve React frontend build (for ngrok / single-port sharing)
const frontendBuild = path.join(__dirname, '../../frontend/build');
if (require('fs').existsSync(frontendBuild)) {
  app.use(express.static(frontendBuild));
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api') && !req.path.startsWith('/uploads')) {
      res.sendFile(path.join(frontendBuild, 'index.html'));
    }
  });
  console.log('✅ Serving React frontend from build folder');
}

// Socket.io initialization
initializeSocket(io);

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = { app, server, io }; 
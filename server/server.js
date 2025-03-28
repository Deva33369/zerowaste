const express = require('express');
const cors = require('cors');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const cron = require('node-cron');
const { checkExpiredFood } = require('./services/foodService');

// Import routes
const foodRoutes = require('./routes/foodRoutes');
const userRoutes = require('./routes/userRoutes');
const claimRoutes = require('./routes/claimRoutes');
const authRoutes = require('./routes/authRoutes');
const wasteItemRoutes = require('./routes/wasteItemRoutes');
const requestRoutes = require('./routes/requestRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const categoryRoutes = require('./routes/categoryRoutes');

// Initialize express app
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

// Connect to database
connectDB();

// Middleware
app.use(express.json());
app.use(cors());

// Make io available in request object
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Mount routes
app.use('/api/food', foodRoutes);
app.use('/api/users', userRoutes);
app.use('/api/claims', claimRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/waste-items', wasteItemRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/categories', categoryRoutes);

// Simple welcome route
app.get('/', (req, res) => {
  res.send('Welcome to the ZeroWaste API');
});

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static(path.join(__dirname, '../client/build')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
  });
}

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Schedule cron job to check for expired food
cron.schedule('0 0 * * *', async () => {
  console.log('Running scheduled task: checking for expired food');
  try {
    await checkExpiredFood();
    console.log('Expired food check completed');
  } catch (error) {
    console.error('Error checking expired food:', error);
  }
});

// Socket.io connection
io.on('connection', (socket) => {
  console.log('New client connected');
  
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Force a specific port to avoid conflicts
const PORT = 5002;
// Comment out any other PORT declarations
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = { app, server, io };
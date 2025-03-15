const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');

// Import routes
const foodRoutes = require('./routes/foodRoutes');
const userRoutes = require('./routes/userRoutes');
const claimRoutes = require('./routes/claimRoutes');

// Initialize express app
const app = express();

// Connect to database
connectDB();

// Middleware
app.use(express.json());
app.use(cors());

// Mount routes
app.use('/api/food', foodRoutes);
app.use('/api/users', userRoutes);
app.use('/api/claims', claimRoutes);

// Simple welcome route
app.get('/', (req, res) => {
  res.send('Welcome to the ZeroWaste API');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message || 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
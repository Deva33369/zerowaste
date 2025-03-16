require('dotenv').config();
const mongoose = require('mongoose');
const colors = require('colors');
const { categories } = require('./data/seedData');
const Category = require('./models/Category');
const User = require('./models/User');
const connectDB = require('./config/db');

// Connect to database
connectDB();

// Import all data
const importData = async () => {
  try {
    // Clear existing data
    await Category.deleteMany();
    
    // Import categories
    await Category.insertMany(categories);
    
    // Create admin user if doesn't exist
    const adminEmail = 'admin@zerowaste.com';
    const adminExists = await User.findOne({ email: adminEmail });
    
    if (!adminExists) {
      await User.create({
        name: 'Admin User',
        email: adminEmail,
        password: 'password123', // You'd use a secure password in production
        userType: 'donor', // Admin can be either donor or recipient
        isAdmin: true,
        phone: '555-123-4567',
        address: {
          street: '123 Admin St',
          city: 'Admin City',
          state: 'AC',
          zipCode: '12345'
        },
        location: {
          type: 'Point',
          coordinates: [-122.4194, 37.7749] // Example coordinates (San Francisco)
        }
      });
      console.log('Admin user created!'.green.inverse);
    }

    console.log('Data Imported!'.green.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

// Destroy all data
const destroyData = async () => {
  try {
    // Clear existing data
    await Category.deleteMany();
    
    console.log('Data Destroyed!'.red.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

// Determine which function to run based on command line args
if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
} 
const mongoose = require('mongoose');

/**
 * Connect to MongoDB database
 */
const connectDB = async () => {
  try {
    // For debugging - explicitly use the connection string
    const mongoURI = "mongodb+srv://zerowaste:BXz5CuhotlEeQXrz@zerowaste-db.h3jxj.mongodb.net/?retryWrites=true&w=majority";
    
    console.log('Attempting to connect with URI:', mongoURI);
    
    const conn = await mongoose.connect(mongoURI, {
      dbName: 'zerowaste'
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
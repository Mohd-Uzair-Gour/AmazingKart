
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Attempt to connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI,);
    console.log('MongoDB connected successfully');
  } catch (error) {
    // Handle connection error
    console.error('MongoDB connection failed:', error.message);
    process.exit(1)
  }
};

// Call the connectDB function to establish the connection
module.exports = connectDB;

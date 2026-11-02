const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI || process.env.MONGO_URI.includes('<username>') || process.env.MONGO_URI.includes('<password>')) {
      console.log('--------------------------------------------------');
      console.log('⚠️  Notice: Please update your MongoDB Atlas URI in .env');
      console.log('    MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/cinevault?retryWrites=true&w=majority');
      console.log('--------------------------------------------------');
      throw new Error('MongoDB URI is not configured or contains placeholder credentials.');
    }

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    throw error;
  }
};

module.exports = connectDB;

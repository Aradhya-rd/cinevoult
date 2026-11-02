const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI || process.env.MONGO_URI.includes('<username>')) {
      console.log('--------------------------------------------------');
      console.log('⚠️  Notice: Please update your MongoDB Atlas URI in .env');
      console.log('    MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/cinevault');
      console.log('--------------------------------------------------');
      return;
    }

    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;

const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const movieRoutes = require('./routes/movieRoutes');

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB Atlas
connectDB();

const app = express();

// Middleware to parse incoming JSON request bodies
app.use(express.json());

// Root test route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to CineVault - Movie Collection API' });
});

// Mount movie routes
app.use('/api/movies', movieRoutes);

// 404 handler for unknown routes
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

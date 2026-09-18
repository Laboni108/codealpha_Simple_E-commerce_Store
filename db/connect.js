

require('dotenv').config({ quiet: true });
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ecommerce-app';

async function connectDB() {
  mongoose.connection.on('connected', () => {
    console.log(`MongoDB connected: ${mongoose.connection.name}`);
  });
  mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err.message);
  });

  await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
  return mongoose.connection;
}

module.exports = connectDB;

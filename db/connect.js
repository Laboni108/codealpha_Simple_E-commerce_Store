// db/connect.js
// Opens (and reuses) a single Mongoose connection to MongoDB.
// Every route/model file just does `require('mongoose')` and uses its models directly —
// this file's only job is making sure the connection is open before the server starts.

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

import mongoose from 'mongoose';
import { config } from './index.js';

export const connectDB = async () => {
  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(config.mongoUri);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};

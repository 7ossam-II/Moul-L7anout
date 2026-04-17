import mongoose from 'mongoose';
import { env } from '../config/env';

export const connectDatabase = async () => {
  try {
    const mongoUri = env.MONGODB_URI || 'mongodb://localhost:27017/moul_l7anout';
    
    await mongoose.connect(mongoUri, {
      retryWrites: true,
      w: 'majority',
    });
    
    console.log('✅ MongoDB connected successfully');
    return mongoose.connection;
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    process.exit(1);
  }
};

export default mongoose;

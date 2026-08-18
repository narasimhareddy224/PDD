import mongoose from 'mongoose';
import { ENV } from './environment';
import { logger } from '../utils/logger';

export const connectDatabase = async (): Promise<void> => {
  try {
    const mongoUri = ENV.MONGODB_URI;
    logger.info(`Connecting to MongoDB at ${mongoUri.split('@').pop() || mongoUri}...`);

    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    logger.info('MongoDB connected successfully.');
  } catch (error) {
    logger.warn('Failed to connect to MongoDB directly. In-memory/fallback mode will be active for schema caching.');
    logger.error('MongoDB connection error:', error);
  }
};

mongoose.connection.on('disconnected', () => {
  logger.warn('MongoDB disconnected.');
});

mongoose.connection.on('error', (err) => {
  logger.error('MongoDB runtime error:', err);
});

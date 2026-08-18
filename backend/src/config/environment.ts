import dotenv from 'dotenv';
dotenv.config();

export const ENV = {
  PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:4200',
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/nextfit_ai',
  JWT_SECRET: process.env.JWT_SECRET || 'nextfit_ai_default_jwt_secret_dev_key',
  
  // Firebase
  FIREBASE: {
    PROJECT_ID: process.env.FIREBASE_PROJECT_ID || '',
    CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL || '',
    PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') : '',
    STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET || '',
  },

  // AI & External APIs
  AI_API_KEY: process.env.AI_API_KEY || '',
  AI_MODEL: process.env.AI_MODEL || 'gemini-1.5-flash',
  WEATHER_API_KEY: process.env.WEATHER_API_KEY || '',

  // Shopping APIs (Authorized integrations)
  SHOPPING: {
    AMAZON_KEY: process.env.AMAZON_API_KEY || '',
    FLIPKART_KEY: process.env.FLIPKART_API_KEY || '',
    MYNTRA_KEY: process.env.MYNTRA_API_KEY || '',
    AJIO_KEY: process.env.AJIO_API_KEY || '',
  }
};

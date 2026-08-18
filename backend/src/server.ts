import app from './app';
import { ENV } from './config/environment';
import { connectDatabase } from './config/database';
import { RecommendationService } from './services/recommendation.service';
import { NotificationService } from './services/notification.service';
import { logger } from './utils/logger';

const startServer = async (): Promise<void> => {
  try {
    // 1. Connect to MongoDB
    await connectDatabase();

    // 2. Seed Initial Curated Outfits Catalog
    try {
      await RecommendationService.seedInitialOutfits();
    } catch (seedErr) {
      logger.warn('Seed initialization skipped (database may be connecting):', seedErr);
    }

    // 3. Start Background Notification Scheduler (checks every 5 minutes)
    setInterval(async () => {
      try {
        await NotificationService.processScheduledReminders();
      } catch (err) {
        logger.error('Error running scheduled notification checks:', err);
      }
    }, 5 * 60 * 1000);

    // 4. Start HTTP Server
    const server = app.listen(ENV.PORT, () => {
      logger.info(`=======================================================`);
      logger.info(` NextFit AI Backend REST API Server is running!`);
      logger.info(` Port: ${ENV.PORT}`);
      logger.info(` Environment: ${ENV.NODE_ENV}`);
      logger.info(` API Documentation: http://localhost:${ENV.PORT}/api-docs`);
      logger.info(` Health Check: http://localhost:${ENV.PORT}/health`);
      logger.info(`=======================================================`);
    });

    // Graceful Shutdown handling
    const gracefulShutdown = (signal: string) => {
      logger.info(`Received ${signal}. Shutting down gracefully...`);
      server.close(() => {
        logger.info('HTTP server closed.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
  } catch (error) {
    logger.error('Fatal Server Startup Error:', error);
    process.exit(1);
  }
};

startServer();

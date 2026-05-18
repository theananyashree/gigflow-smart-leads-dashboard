import 'dotenv/config';
import app from './app';
import connectDB from './config/db';
import logger from './utils/logger';

const PORT = parseInt(process.env.PORT ?? '5000', 10);

const startServer = async (): Promise<void> => {
  await connectDB();

  const server = app.listen(PORT, () => {
    logger.info(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
  });

  // Graceful shutdown
  const shutdown = (signal: string) => {
    logger.info(`${signal} received. Shutting down gracefully...`);
    server.close(() => {
      logger.info('HTTP server closed');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
};

startServer().catch((err) => {
  logger.error(`Failed to start server: ${err}`);
  process.exit(1);
});
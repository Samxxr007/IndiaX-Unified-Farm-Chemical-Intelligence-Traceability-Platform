import { createApp } from './app';
import { env } from './config/env';
import { prisma } from './config/database';
import { logger } from './utils/logger';

const app = createApp();

async function start() {
  try {
    // Verify database connection
    await prisma.$connect();
    logger.info('✅ Database connected');

    app.listen(env.PORT, () => {
      logger.info(`🚀 IndiaX Backend running on http://localhost:${env.PORT}`);
      logger.info(`📊 Environment: ${env.NODE_ENV}`);
      logger.info(`🔗 API Base: http://localhost:${env.PORT}/api/v1`);
    });
  } catch (err) {
    logger.error(err, '❌ Failed to start server');
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received, shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

start();

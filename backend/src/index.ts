import { createServer } from 'http';
import { createApp } from './app';
import { env } from '@/config/env';
import { logger } from '@/config/logger';
import { connectDatabase, disconnectDatabase } from '@/config/database';
import { connectRedis, disconnectRedis } from '@/config/redis';
import { initSocket } from '@/config/socket';

async function bootstrap(): Promise<void> {
  await connectDatabase();
  await connectRedis();

  const app = createApp();
  const server = createServer(app);
  initSocket(server);

  server.listen(env.PORT, () => {
    logger.info(`🚀 API listening on http://localhost:${env.PORT}${env.API_PREFIX}`);
    logger.info(`🔌 Socket.io ready`);
  });

  const shutdown = async (signal: string) => {
    logger.info(`${signal} received, shutting down...`);
    server.close();
    await disconnectDatabase();
    disconnectRedis();
    process.exit(0);
  };

  process.on('SIGINT', () => void shutdown('SIGINT'));
  process.on('SIGTERM', () => void shutdown('SIGTERM'));
}

bootstrap().catch((err) => {
  logger.error(`Failed to start server: ${(err as Error).message}`);
  process.exit(1);
});

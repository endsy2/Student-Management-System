import Redis from 'ioredis';
import { env } from './env';
import { logger } from './logger';

export const redis = new Redis(env.REDIS_URL, {
  maxRetriesPerRequest: null,
  lazyConnect: true,
});

redis.on('error', (err) => logger.error(`Redis error: ${err.message}`));

export async function connectRedis(): Promise<void> {
  // The rate-limit store may have already triggered a (lazy) connection at import
  // time, so only call connect() while the client is still idle ('wait').
  if (redis.status === 'wait') {
    await redis.connect();
  }
  logger.info('✅ Redis connected');
}

export async function disconnectRedis(): Promise<void> {
  redis.disconnect();
}

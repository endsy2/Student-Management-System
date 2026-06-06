import rateLimit from 'express-rate-limit';
import { RedisStore } from 'rate-limit-redis';
import { redis } from '@/config/redis';
import { env } from '@/config/env';

/** IP-based rate limiter backed by Redis (shared across instances). */
export const rateLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  store: new RedisStore({
    sendCommand: (command: string, ...args: string[]) =>
      redis.call(command, ...args) as Promise<any>,
  }),
  message: {
    success: false,
    error: 'Too many requests, please try again later',
    code: 'RATE_LIMITED',
  },
});

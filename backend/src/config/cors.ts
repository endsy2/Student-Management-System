import type { CorsOptions } from 'cors';
import { env } from './env';
import { logger } from './logger';

/** Parsed, trimmed list of allowed origins from CORS_ORIGIN (comma-separated). */
export const allowedOrigins = env.CORS_ORIGIN.split(',')
  .map((o) => o.trim())
  .filter(Boolean);

/** When CORS_ORIGIN is "*", allow any origin (intended for local dev only). */
export const allowAllOrigins = allowedOrigins.includes('*');

/**
 * Shared CORS options for Express. Requests with no Origin header
 * (curl, Postman, mobile apps, server-to-server) are always allowed.
 */
export const corsOptions: CorsOptions = {
  origin(origin, callback) {
    if (!origin || allowAllOrigins || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }
    logger.warn(`CORS blocked origin: ${origin}`);
    callback(new Error(`Origin ${origin} not allowed by CORS`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

/** Origin value Socket.io accepts ('*' or an explicit array). */
export const socketCorsOrigin = allowAllOrigins ? '*' : allowedOrigins;

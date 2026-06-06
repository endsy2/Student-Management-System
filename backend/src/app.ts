import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import '@/types/express.types';
import { env } from '@/config/env';
import { corsOptions } from '@/config/cors';
import { requestLogger } from '@/middleware/logger.middleware';
import { rateLimiter } from '@/middleware/rateLimit.middleware';
import { errorHandler, notFoundHandler } from '@/middleware/error.middleware';
import routes from '@/routes';

export function createApp(): Application {
  const app = express();

  app.use(helmet());
  app.use(cors(corsOptions));
  app.options('*', cors(corsOptions)); // handle preflight for all routes
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(requestLogger);
  app.use(rateLimiter);

  app.use(env.API_PREFIX, routes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

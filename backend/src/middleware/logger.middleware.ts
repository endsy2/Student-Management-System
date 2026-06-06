import { NextFunction, Request, Response } from 'express';
import { logger } from '@/config/logger';

/** Logs method, path, status and duration for each request. */
export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  const start = Date.now();
  res.on('finish', () => {
    logger.debug(`${req.method} ${req.originalUrl} ${res.statusCode} ${Date.now() - start}ms`);
  });
  next();
}

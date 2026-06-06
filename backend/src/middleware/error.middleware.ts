import { NextFunction, Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import { ApiError } from '@/utils/ApiError';
import { sendError } from '@/utils/response';
import { logger } from '@/config/logger';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction): void {
  if (err instanceof ApiError) {
    sendError(res, err.statusCode, err.message, err.code);
    return;
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      sendError(res, 409, 'A record with this unique value already exists', 'DUPLICATE');
      return;
    }
    if (err.code === 'P2025') {
      sendError(res, 404, 'Record not found', 'NOT_FOUND');
      return;
    }
  }

  logger.error(err instanceof Error ? err.stack || err.message : String(err));
  sendError(res, 500, 'Internal server error', 'INTERNAL_ERROR');
}

export function notFoundHandler(req: Request, res: Response): void {
  sendError(res, 404, `Route ${req.method} ${req.originalUrl} not found`, 'ROUTE_NOT_FOUND');
}

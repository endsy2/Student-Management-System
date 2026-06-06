import { Response } from 'express';

export function sendSuccess<T>(res: Response, data: T, message = 'Success', status = 200): void {
  res.status(status).json({
    success: true,
    data,
    message,
    timestamp: new Date().toISOString(),
  });
}

export function sendError(res: Response, status: number, error: string, code = 'ERROR'): void {
  res.status(status).json({
    success: false,
    error,
    code,
    timestamp: new Date().toISOString(),
  });
}

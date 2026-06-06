import { NextFunction, Request, Response, RequestHandler } from 'express';

/** Wraps an async route handler so thrown errors reach the error middleware. */
export const catchAsyncError =
  (fn: RequestHandler): RequestHandler =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

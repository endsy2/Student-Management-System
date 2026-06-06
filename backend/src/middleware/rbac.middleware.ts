import { NextFunction, Request, Response } from 'express';
import { Role } from '@prisma/client';
import { ApiError } from '@/utils/ApiError';

/** Allows the request only if req.user.role is one of the given roles. */
export const requireRole =
  (...roles: Role[]) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw ApiError.unauthorized();
    }
    if (!roles.includes(req.user.role)) {
      throw ApiError.forbidden('Insufficient permissions for this resource', 'FORBIDDEN_ROLE');
    }
    next();
  };

import { NextFunction, Request, Response } from 'express';
import { verifyAccessToken } from '@/utils/jwt.utils';
import { ApiError } from '@/utils/ApiError';
import { redis } from '@/config/redis';
import { catchAsyncError } from '@/utils/asyncHandler';

export const BLACKLIST_PREFIX = 'blacklist:';

/** Verifies the Bearer access token and attaches req.user. Rejects blacklisted tokens. */
export const authenticate = catchAsyncError(
  async (req: Request, _res: Response, next: NextFunction) => {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) {
      throw ApiError.unauthorized('Missing or malformed Authorization header', 'NO_TOKEN');
    }

    const token = header.slice(7);

    const isBlacklisted = await redis.get(`${BLACKLIST_PREFIX}${token}`);
    if (isBlacklisted) {
      throw ApiError.unauthorized('Token has been revoked', 'TOKEN_REVOKED');
    }

    try {
      const payload = verifyAccessToken(token);
      req.user = { id: payload.sub, role: payload.role, email: payload.email };
      next();
    } catch {
      throw ApiError.unauthorized('Invalid or expired token', 'INVALID_TOKEN');
    }
  },
);

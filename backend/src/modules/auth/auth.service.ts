import { prisma } from '@/config/database';
import { redis } from '@/config/redis';
import { env } from '@/config/env';
import { ApiError } from '@/utils/ApiError';
import { comparePassword, hashPassword } from '@/utils/bcrypt.utils';
import {
  JwtPayload,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from '@/utils/jwt.utils';
import { writeAuditLog } from '@/utils/audit.utils';
import type { LoginInput, RegisterInput } from './auth.validators';

const SESSION_PREFIX = 'session:';
const REFRESH_PREFIX = 'refresh:';
const BLACKLIST_PREFIX = 'blacklist:';
const REFRESH_TTL_SECONDS = 7 * 24 * 60 * 60; // 7 days
const ACCESS_TTL_SECONDS = 15 * 60; // 15 minutes

function publicUser(user: { id: string; email: string; role: string; firstName: string; lastName: string }) {
  return {
    id: user.id,
    email: user.email,
    role: user.role,
    firstName: user.firstName,
    lastName: user.lastName,
  };
}

export const authService = {
  async register(input: RegisterInput) {
    const existing = await prisma.user.findUnique({ where: { email: input.email } });
    if (existing) {
      throw ApiError.conflict('Email already registered', 'EMAIL_TAKEN');
    }

    const user = await prisma.user.create({
      data: {
        email: input.email,
        password: await hashPassword(input.password),
        firstName: input.firstName,
        lastName: input.lastName,
        role: input.role,
      },
    });

    await writeAuditLog({ userId: user.id, action: 'REGISTER', entity: 'User', entityId: user.id });
    return publicUser(user);
  },

  async login(input: LoginInput) {
    const user = await prisma.user.findUnique({ where: { email: input.email } });
    if (!user || !user.isActive) {
      throw ApiError.unauthorized('Invalid credentials', 'INVALID_CREDENTIALS');
    }

    const valid = await comparePassword(input.password, user.password);
    if (!valid) {
      await writeAuditLog({ userId: user.id, action: 'LOGIN_FAILED', entity: 'User', entityId: user.id });
      throw ApiError.unauthorized('Invalid credentials', 'INVALID_CREDENTIALS');
    }

    const tokens = await this.issueTokens({ sub: user.id, role: user.role, email: user.email });
    await writeAuditLog({ userId: user.id, action: 'LOGIN', entity: 'User', entityId: user.id });

    return { user: publicUser(user), ...tokens };
  },

  async issueTokens(payload: JwtPayload) {
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    // Session: latest access token per user (TTL 15m)
    await redis.set(`${SESSION_PREFIX}${payload.sub}`, accessToken, 'EX', ACCESS_TTL_SECONDS);
    // Refresh token registry (TTL 7d)
    await redis.set(`${REFRESH_PREFIX}${refreshToken}`, payload.sub, 'EX', REFRESH_TTL_SECONDS);

    return { accessToken, refreshToken };
  },

  async refresh(refreshToken: string) {
    const stored = await redis.get(`${REFRESH_PREFIX}${refreshToken}`);
    if (!stored) {
      throw ApiError.unauthorized('Refresh token not recognised', 'INVALID_REFRESH');
    }

    let payload: JwtPayload;
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch {
      throw ApiError.unauthorized('Refresh token expired', 'EXPIRED_REFRESH');
    }

    // Rotate: invalidate the old refresh token
    await redis.del(`${REFRESH_PREFIX}${refreshToken}`);
    return this.issueTokens({ sub: payload.sub, role: payload.role, email: payload.email });
  },

  /** Blacklists the access token until it would naturally expire and clears the session. */
  async logout(userId: string, accessToken: string) {
    await redis.set(`${BLACKLIST_PREFIX}${accessToken}`, '1', 'EX', ACCESS_TTL_SECONDS);
    await redis.del(`${SESSION_PREFIX}${userId}`);
    await writeAuditLog({ userId, action: 'LOGOUT', entity: 'User', entityId: userId });
  },
};

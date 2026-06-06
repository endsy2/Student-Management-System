import jwt, { SignOptions } from 'jsonwebtoken';
import { env } from '@/config/env';
import { Role } from '@prisma/client';

export interface JwtPayload {
  sub: string; // user id
  role: Role;
  email: string;
}

export const signAccessToken = (payload: JwtPayload): string =>
  jwt.sign(payload, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRES,
  } as SignOptions);

export const signRefreshToken = (payload: JwtPayload): string =>
  jwt.sign(payload, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES,
  } as SignOptions);

export const verifyAccessToken = (token: string): JwtPayload =>
  jwt.verify(token, env.JWT_ACCESS_SECRET) as JwtPayload;

export const verifyRefreshToken = (token: string): JwtPayload =>
  jwt.verify(token, env.JWT_REFRESH_SECRET) as JwtPayload;

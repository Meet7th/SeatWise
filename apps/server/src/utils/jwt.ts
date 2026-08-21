import jwt from 'jsonwebtoken';
import { env } from '@/config/env';

export interface JwtPayload {
  sub: string;
  role: string;
  type: 'access' | 'refresh';
}

export function generateAccessToken(userId: string, role: string): string {
  return jwt.sign({ sub: userId, role, type: 'access' }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  });
}

export function generateRefreshToken(userId: string, role: string): string {
  return jwt.sign({ sub: userId, role, type: 'refresh' }, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN,
  });
}

export function verifyAccessToken(token: string): JwtPayload {
  return jwt.verify(token, env.JWT_SECRET) as JwtPayload;
}

export function verifyRefreshToken(token: string): JwtPayload {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as JwtPayload;
}

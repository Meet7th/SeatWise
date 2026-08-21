import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, JwtPayload } from '@/utils/jwt';

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ code: 40100, data: null, message: '未登录' });
  }

  const token = authHeader.slice(7);
  try {
    const payload = verifyAccessToken(token);
    if (payload.type !== 'access') {
      return res.status(401).json({ code: 40101, data: null, message: '无效的访问令牌' });
    }
    req.user = payload;
    next();
  } catch {
    return res.status(401).json({ code: 40102, data: null, message: '令牌已过期' });
  }
}

export function optionalAuth(req: AuthRequest, _res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith('Bearer ')) {
    try {
      req.user = verifyAccessToken(authHeader.slice(7));
    } catch {}
  }
  next();
}

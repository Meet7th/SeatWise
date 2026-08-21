import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth';

export function requireRole(...roles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ code: 40100, data: null, message: '未登录' });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ code: 40300, data: null, message: '权限不足' });
    }
    next();
  };
}

export const isTeacher = requireRole('teacher', 'admin');
export const isStudent = requireRole('student', 'admin');
export const isAdmin = requireRole('admin');

import { Router } from 'express';
import { z } from 'zod';
import { validate } from '@/middleware/validator';
import { authMiddleware, AuthRequest } from '@/middleware/auth';
import { authLimiter } from '@/middleware/rateLimit';
import * as authService from '@/services/authService';
import { prisma } from '@/config/database';
import { verifyRefreshToken, generateAccessToken, generateRefreshToken } from '@/utils/jwt';

const router = Router();

const registerSchema = z.object({
  name: z.string().min(2).max(50),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  password: z.string().min(8).max(32),
  inviteCode: z.string().length(6),
  studentNumber: z.string().optional(),
}).refine((data) => data.phone || data.email, { message: '请输入手机号或邮箱' });

const loginSchema = z.object({
  phone: z.string().optional(),
  email: z.string().email().optional(),
  password: z.string().min(1),
}).refine((data) => data.phone || data.email, { message: '请输入手机号或邮箱' });

router.post('/register', authLimiter, validate(registerSchema), async (req, res, next) => {
  try {
    const result = await authService.register(req.body);
    res.json({ code: 0, data: result, message: 'ok' });
  } catch (err) {
    next(err);
  }
});

router.post('/login', authLimiter, validate(loginSchema), async (req, res, next) => {
  try {
    const result = await authService.login(req.body);
    res.json({ code: 0, data: result, message: 'ok' });
  } catch (err) {
    next(err);
  }
});

router.post('/refresh', authLimiter, async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ code: 40001, data: null, message: '缺少refreshToken' });
    }

    const payload = verifyRefreshToken(refreshToken);
    const user = await prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user || user.status !== 'active') {
      return res.status(401).json({ code: 40100, data: null, message: '用户不存在或已被禁用' });
    }

    const tokens = {
      accessToken: generateAccessToken(user.id, user.role),
      refreshToken: generateRefreshToken(user.id, user.role),
    };

    res.json({ code: 0, data: { tokens }, message: 'ok' });
  } catch (err) {
    next(err);
  }
});

router.get('/me', authMiddleware, async (req: AuthRequest, res, next) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user!.sub } });
    if (!user) {
      return res.status(404).json({ code: 40400, data: null, message: '用户不存在' });
    }
    res.json({
      code: 0,
      data: {
        id: user.id,
        name: user.name,
        role: user.role,
        phone: user.phone,
        email: user.email,
        studentNumber: user.studentNumber,
        avatar: user.avatar,
        status: user.status,
        createdAt: user.createdAt.toISOString(),
        lastLoginAt: user.lastLoginAt?.toISOString() || null,
        wechatOpenId: null,
        qqOpenId: null,
        schoolId: null,
      },
      message: 'ok',
    });
  } catch (err) {
    next(err);
  }
});

export default router;

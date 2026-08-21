import rateLimit from 'express-rate-limit';

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { code: 42900, data: null, message: '请求过于频繁，请稍后再试' },
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { code: 42900, data: null, message: '登录尝试过多，请15分钟后再试' },
});

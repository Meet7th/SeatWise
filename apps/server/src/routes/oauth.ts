import { Router, Request, Response } from 'express';
import crypto from 'crypto';
import { WeChatOAuth, QQOAuth } from '../services/oauthService';
import { SmsService } from '../services/smsService';
import { EmailService } from '../services/emailService';
import { env } from '../config/env';
import { otpLimiter } from '../middleware/rateLimit';

const router = Router();

// ============ OAuth State 存储（内存 Map，5 分钟过期）============
const oauthStateStore = new Map<string, { createdAt: number }>();
const STATE_TTL = 5 * 60 * 1000; // 5 分钟

// 定期清理过期 state
setInterval(() => {
  const now = Date.now();
  for (const [key, val] of oauthStateStore) {
    if (now - val.createdAt > STATE_TTL) oauthStateStore.delete(key);
  }
}, 60 * 1000);

// ============ OAuth 一次性 Code 存储（用于安全传递 token）============
const oauthCodeStore = new Map<string, { data: any; createdAt: number }>();
const CODE_TTL = 2 * 60 * 1000; // 2 分钟

setInterval(() => {
  const now = Date.now();
  for (const [key, val] of oauthCodeStore) {
    if (now - val.createdAt > CODE_TTL) oauthCodeStore.delete(key);
  }
}, 60 * 1000);

// ============ WeChat OAuth ============

router.get('/wechat', (req: Request, res: Response) => {
  const state = crypto.randomBytes(16).toString('hex');
  oauthStateStore.set(state, { createdAt: Date.now() });
  const url = WeChatOAuth.getAuthUrl(state);
  res.json({ url, state });
});

router.get('/wechat/callback', async (req: Request, res: Response) => {
  const { code, state } = req.query;

  if (!code || typeof code !== 'string') {
    return res.redirect(`${env.FRONTEND_URL}/auth?error=wechat_failed`);
  }

  // 校验 state 参数（CSRF 防护）
  if (!state || typeof state !== 'string' || !oauthStateStore.has(state)) {
    return res.redirect(`${env.FRONTEND_URL}/auth?error=invalid_state`);
  }
  oauthStateStore.delete(state);

  try {
    const userInfo = await WeChatOAuth.getUserInfo(code);
    // TODO: Find or create user by wechatOpenId
    // 使用一次性 code 安全传递用户信息，不在 URL 中暴露 openId
    const oneTimeCode = crypto.randomBytes(16).toString('hex');
    oauthCodeStore.set(oneTimeCode, { data: { provider: 'wechat', ...userInfo }, createdAt: Date.now() });
    res.redirect(`${env.FRONTEND_URL}/auth?wechat=true&code=${oneTimeCode}`);
  } catch (e) {
    res.redirect(`${env.FRONTEND_URL}/auth?error=wechat_failed`);
  }
});

// ============ QQ OAuth ============

router.get('/qq', (req: Request, res: Response) => {
  const state = crypto.randomBytes(16).toString('hex');
  oauthStateStore.set(state, { createdAt: Date.now() });
  const url = QQOAuth.getAuthUrl(state);
  res.json({ url, state });
});

router.get('/qq/callback', async (req: Request, res: Response) => {
  const { code, state } = req.query;

  if (!code || typeof code !== 'string') {
    return res.redirect(`${env.FRONTEND_URL}/auth?error=qq_failed`);
  }

  // 校验 state 参数（CSRF 防护）
  if (!state || typeof state !== 'string' || !oauthStateStore.has(state)) {
    return res.redirect(`${env.FRONTEND_URL}/auth?error=invalid_state`);
  }
  oauthStateStore.delete(state);

  try {
    const userInfo = await QQOAuth.getUserInfo(code);
    // 使用一次性 code 安全传递用户信息
    const oneTimeCode = crypto.randomBytes(16).toString('hex');
    oauthCodeStore.set(oneTimeCode, { data: { provider: 'qq', ...userInfo }, createdAt: Date.now() });
    res.redirect(`${env.FRONTEND_URL}/auth?qq=true&code=${oneTimeCode}`);
  } catch (e) {
    res.redirect(`${env.FRONTEND_URL}/auth?error=qq_failed`);
  }
});

// ============ OAuth 一次性 Code 换取用户信息 ============

router.post('/oauth/exchange', (req: Request, res: Response) => {
  const { code } = req.body;
  if (!code || typeof code !== 'string') {
    return res.status(400).json({ code: 40001, data: null, message: '缺少 code 参数' });
  }

  const stored = oauthCodeStore.get(code);
  if (!stored) {
    return res.status(400).json({ code: 40002, data: null, message: 'code 无效或已过期' });
  }
  oauthCodeStore.delete(code);

  res.json({ code: 0, data: stored.data, message: 'ok' });
});

// ============ SMS Verification ============

router.post('/sms/send', otpLimiter, async (req: Request, res: Response) => {
  const { phone } = req.body;

  if (!phone || !/^1[3-9]\d{9}$/.test(phone)) {
    return res.status(400).json({ code: 40001, data: null, message: '手机号格式不正确' });
  }

  const result = await SmsService.sendCode(phone);
  res.json({ code: 0, data: result, message: result.message });
});

router.post('/sms/verify', (req: Request, res: Response) => {
  const { phone, code } = req.body;

  if (!phone || !code) {
    return res.status(400).json({ code: 40001, data: null, message: '请提供手机号和验证码' });
  }

  const valid = SmsService.verifyCode(phone, code);
  res.json({ code: 0, data: { valid }, message: valid ? '验证成功' : '验证码无效或已过期' });
});

// ============ Email Verification ============

router.post('/email/send', otpLimiter, async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ code: 40001, data: null, message: '邮箱格式不正确' });
  }

  const result = await EmailService.sendCode(email);
  res.json({ code: 0, data: result, message: result.message });
});

router.post('/email/verify', (req: Request, res: Response) => {
  const { email, code } = req.body;

  if (!email || !code) {
    return res.status(400).json({ code: 40001, data: null, message: '请提供邮箱和验证码' });
  }

  const valid = EmailService.verifyCode(email, code);
  res.json({ code: 0, data: { valid }, message: valid ? '验证成功' : '验证码无效或已过期' });
});

export default router;
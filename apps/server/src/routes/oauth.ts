import { Router, Request, Response } from 'express';
import crypto from 'crypto';
import { WeChatOAuth, QQOAuth } from '../services/oauthService';
import { SmsService } from '../services/smsService';
import { EmailService } from '../services/emailService';
import { env } from '../config/env';

const router = Router();

// ============ WeChat OAuth ============

router.get('/wechat', (req: Request, res: Response) => {
  const state = crypto.randomBytes(16).toString('hex');
  const url = WeChatOAuth.getAuthUrl(state);
  res.json({ url, state });
});

router.get('/wechat/callback', async (req: Request, res: Response) => {
  const { code, state } = req.query;

  if (!code || typeof code !== 'string') {
    return res.redirect(`${env.FRONTEND_URL}/auth?error=wechat_failed`);
  }

  try {
    const userInfo = await WeChatOAuth.getUserInfo(code);
    // TODO: Find or create user by wechatOpenId
    // For now, redirect with user info
    res.redirect(`${env.FRONTEND_URL}/auth?wechat=true&openId=${userInfo.openId}&name=${encodeURIComponent(userInfo.name)}`);
  } catch (e) {
    res.redirect(`${env.FRONTEND_URL}/auth?error=wechat_failed`);
  }
});

// ============ QQ OAuth ============

router.get('/qq', (req: Request, res: Response) => {
  const state = crypto.randomBytes(16).toString('hex');
  const url = QQOAuth.getAuthUrl(state);
  res.json({ url, state });
});

router.get('/qq/callback', async (req: Request, res: Response) => {
  const { code, state } = req.query;

  if (!code || typeof code !== 'string') {
    return res.redirect(`${env.FRONTEND_URL}/auth?error=qq_failed`);
  }

  try {
    const userInfo = await QQOAuth.getUserInfo(code);
    res.redirect(`${env.FRONTEND_URL}/auth?qq=true&openId=${userInfo.openId}&name=${encodeURIComponent(userInfo.name)}`);
  } catch (e) {
    res.redirect(`${env.FRONTEND_URL}/auth?error=qq_failed`);
  }
});

// ============ SMS Verification ============

router.post('/sms/send', async (req: Request, res: Response) => {
  const { phone } = req.body;

  if (!phone || !/^1[3-9]\d{9}$/.test(phone)) {
    return res.status(400).json({ success: false, message: '手机号格式不正确' });
  }

  const result = await SmsService.sendCode(phone);
  res.json(result);
});

router.post('/sms/verify', (req: Request, res: Response) => {
  const { phone, code } = req.body;

  if (!phone || !code) {
    return res.status(400).json({ success: false, message: '请提供手机号和验证码' });
  }

  const valid = SmsService.verifyCode(phone, code);
  res.json({ success: valid, message: valid ? '验证成功' : '验证码无效或已过期' });
});

// ============ Email Verification ============

router.post('/email/send', async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ success: false, message: '邮箱格式不正确' });
  }

  const result = await EmailService.sendCode(email);
  res.json(result);
});

router.post('/email/verify', (req: Request, res: Response) => {
  const { email, code } = req.body;

  if (!email || !code) {
    return res.status(400).json({ success: false, message: '请提供邮箱和验证码' });
  }

  const valid = EmailService.verifyCode(email, code);
  res.json({ success: valid, message: valid ? '验证成功' : '验证码无效或已过期' });
});

export default router;
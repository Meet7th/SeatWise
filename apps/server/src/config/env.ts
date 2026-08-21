import dotenv from 'dotenv';
dotenv.config();

export const env = {
  PORT: parseInt(process.env.PORT || '3000', 10),
  DATABASE_URL: process.env.DATABASE_URL || '',
  REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',
  JWT_SECRET: process.env.JWT_SECRET || 'dev-jwt-secret',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret',
  JWT_EXPIRES_IN: '7d',
  JWT_REFRESH_EXPIRES_IN: '30d',

  // WeChat OAuth
  WECHAT_APP_ID: process.env.WECHAT_APP_ID || '',
  WECHAT_APP_SECRET: process.env.WECHAT_APP_SECRET || '',
  WECHAT_REDIRECT_URI: process.env.WECHAT_REDIRECT_URI || 'http://localhost:3000/auth/wechat/callback',

  // QQ OAuth
  QQ_APP_ID: process.env.QQ_APP_ID || '',
  QQ_APP_KEY: process.env.QQ_APP_KEY || '',
  QQ_REDIRECT_URI: process.env.QQ_REDIRECT_URI || 'http://localhost:3000/auth/qq/callback',

  // SMS (Aliyun)
  SMS_ACCESS_KEY_ID: process.env.SMS_ACCESS_KEY_ID || '',
  SMS_ACCESS_KEY_SECRET: process.env.SMS_ACCESS_KEY_SECRET || '',
  SMS_SIGN_NAME: process.env.SMS_SIGN_NAME || '智座',
  SMS_TEMPLATE_CODE: process.env.SMS_TEMPLATE_CODE || '',

  // Email
  SMTP_HOST: process.env.SMTP_HOST || 'smtp.qq.com',
  SMTP_PORT: parseInt(process.env.SMTP_PORT || '465', 10),
  SMTP_USER: process.env.SMTP_USER || '',
  SMTP_PASS: process.env.SMTP_PASS || '',
  EMAIL_FROM: process.env.EMAIL_FROM || 'seatwise@example.com',

  // Frontend
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
};

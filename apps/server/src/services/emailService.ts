import nodemailer from 'nodemailer';
import crypto from 'crypto';
import { env } from '../config/env';

const codeStore = new Map<string, { code: string; expiresAt: number }>();

function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function getTransporter() {
  return nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_PORT === 465,
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASS,
    },
  });
}

export class EmailService {
  /**
   * Send verification code via email
   */
  static async sendCode(email: string): Promise<{ success: boolean; message: string }> {
    const code = generateCode();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    codeStore.set(email, { code, expiresAt });

    if (env.SMTP_USER && env.SMTP_PASS) {
      try {
        await this.sendEmail(email, code);
        return { success: true, message: '验证邮件已发送' };
      } catch (e) {
        return { success: false, message: '邮件发送失败' };
      }
    }

    // Dev mode
    console.log(`[Email Dev] Email: ${email}, Code: ${code}`);
    return { success: true, message: `验证邮件已发送 (开发模式: ${code})` };
  }

  /**
   * Verify email code
   */
  static verifyCode(email: string, code: string): boolean {
    const stored = codeStore.get(email);
    if (!stored) return false;
    if (Date.now() > stored.expiresAt) {
      codeStore.delete(email);
      return false;
    }
    if (stored.code !== code) return false;
    codeStore.delete(email);
    return true;
  }

  private static async sendEmail(to: string, code: string): Promise<void> {
    const transporter = getTransporter();

    await transporter.sendMail({
      from: env.EMAIL_FROM,
      to,
      subject: '智座 SeatWise - 邮箱验证码',
      html: `
        <div style="font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif; max-width: 400px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #3b82f6; text-align: center;">智座 SeatWise</h2>
          <p style="color: #374151; font-size: 14px;">您的邮箱验证码是：</p>
          <div style="background: #f3f4f6; padding: 16px; text-align: center; border-radius: 8px; margin: 16px 0;">
            <span style="font-size: 28px; font-weight: bold; color: #1f2937; letter-spacing: 4px;">${code}</span>
          </div>
          <p style="color: #6b7280; font-size: 12px;">验证码 10 分钟内有效，请勿泄露给他人。</p>
        </div>
      `,
    });
  }
}
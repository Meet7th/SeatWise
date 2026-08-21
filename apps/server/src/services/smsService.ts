import crypto from 'crypto';
import { env } from '../config/env';

// In-memory store for dev; use Redis in production
const codeStore = new Map<string, { code: string; expiresAt: number }>();

function generateCode(): string {
  return crypto.randomInt(100000, 1000000).toString();
}

function getRedis(): any {
  // Placeholder - in production, use ioredis
  return null;
}

export class SmsService {
  /**
   * Send verification code via SMS
   */
  static async sendCode(phone: string): Promise<{ success: boolean; message: string }> {
    const code = generateCode();
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes

    // Store code
    codeStore.set(phone, { code, expiresAt });

    // In production, call Aliyun SMS API
    if (env.SMS_ACCESS_KEY_ID && env.SMS_ACCESS_KEY_SECRET) {
      try {
        await this.sendAliyunSms(phone, code);
        return { success: true, message: '验证码已发送' };
      } catch (e) {
        return { success: false, message: '短信发送失败' };
      }
    }

    // Dev mode: log masked phone to console
    const maskedPhone = phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
    console.log(`[SMS Dev] Phone: ${maskedPhone}, Code: ${code}`);
    return { success: true, message: '验证码已发送' };
  }

  /**
   * Verify SMS code
   */
  static verifyCode(phone: string, code: string): boolean {
    const stored = codeStore.get(phone);
    if (!stored) return false;
    if (Date.now() > stored.expiresAt) {
      codeStore.delete(phone);
      return false;
    }
    if (stored.code !== code) return false;
    codeStore.delete(phone);
    return true;
  }

  private static async sendAliyunSms(phone: string, code: string): Promise<void> {
    // Aliyun SMS API integration
    // In production, use @alicloud/dysmsapi20170525
    const params = {
      PhoneNumbers: phone,
      SignName: env.SMS_SIGN_NAME,
      TemplateCode: env.SMS_TEMPLATE_CODE,
      TemplateParam: JSON.stringify({ code }),
    };
    console.log('Aliyun SMS params:', params);
    // await client.sendSms(params);
  }
}
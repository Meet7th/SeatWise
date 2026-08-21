import api from './client';

export const oauthApi = {
  getWechatUrl() {
    return api.get<{ url: string; state: string }>('/auth/wechat');
  },

  getQqUrl() {
    return api.get<{ url: string; state: string }>('/auth/qq');
  },

  sendSmsCode(phone: string) {
    return api.post<{ success: boolean; message: string }>('/auth/sms/send', { phone });
  },

  verifySmsCode(phone: string, code: string) {
    return api.post<{ success: boolean; message: string }>('/auth/sms/verify', { phone, code });
  },

  sendEmailCode(email: string) {
    return api.post<{ success: boolean; message: string }>('/auth/email/send', { email });
  },

  verifyEmailCode(email: string, code: string) {
    return api.post<{ success: boolean; message: string }>('/auth/email/verify', { email, code });
  },
};
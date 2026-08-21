import axios from 'axios';
import { env } from '../config/env';

export interface OAuthUserInfo {
  openId: string;
  name: string;
  avatar: string | null;
  phone: string | null;
  email: string | null;
}

/**
 * WeChat OAuth Service
 */
export class WeChatOAuth {
  private static readonly AUTH_URL = 'https://open.weixin.qq.com/connect/qrconnect';
  private static readonly TOKEN_URL = 'https://api.weixin.qq.com/sns/oauth2/access_token';
  private static readonly USER_INFO_URL = 'https://api.weixin.qq.com/sns/userinfo';

  static getAuthUrl(state: string): string {
    const params = new URLSearchParams({
      appid: env.WECHAT_APP_ID,
      redirect_uri: env.WECHAT_REDIRECT_URI,
      response_type: 'code',
      scope: 'snsapi_login',
      state,
    });
    return `${this.AUTH_URL}?${params.toString()}#wechat_redirect`;
  }

  static async getUserInfo(code: string): Promise<OAuthUserInfo> {
    const tokenParams = new URLSearchParams({
      appid: env.WECHAT_APP_ID,
      secret: env.WECHAT_APP_SECRET,
      code,
      grant_type: 'authorization_code',
    });

    const tokenRes = await axios.get(`${this.TOKEN_URL}?${tokenParams.toString()}`);
    const { access_token, openid } = tokenRes.data;

    if (!access_token || !openid) {
      throw new Error('WeChat OAuth failed: invalid token');
    }

    const userParams = new URLSearchParams({
      access_token,
      openid,
      lang: 'zh_CN',
    });

    const userRes = await axios.get(`${this.USER_INFO_URL}?${userParams.toString()}`);
    const data = userRes.data;

    return {
      openId: openid,
      name: data.nickname || '微信用户',
      avatar: data.headimgurl || null,
      phone: null,
      email: null,
    };
  }
}

/**
 * QQ OAuth Service
 */
export class QQOAuth {
  private static readonly AUTH_URL = 'https://graph.qq.com/oauth2.0/authorize';
  private static readonly TOKEN_URL = 'https://graph.qq.com/oauth2.0/token';
  private static readonly OPENID_URL = 'https://graph.qq.com/oauth2.0/me';
  private static readonly USER_INFO_URL = 'https://graph.qq.com/user/get_user_info';

  static getAuthUrl(state: string): string {
    const params = new URLSearchParams({
      client_id: env.QQ_APP_ID,
      redirect_uri: env.QQ_REDIRECT_URI,
      response_type: 'code',
      scope: 'get_user_info',
      state,
    });
    return `${this.AUTH_URL}?${params.toString()}`;
  }

  static async getUserInfo(code: string): Promise<OAuthUserInfo> {
    const tokenParams = new URLSearchParams({
      client_id: env.QQ_APP_ID,
      client_secret: env.QQ_APP_KEY,
      code,
      grant_type: 'authorization_code',
      redirect_uri: env.QQ_REDIRECT_URI,
    });

    const tokenRes = await axios.get(`${this.TOKEN_URL}?${tokenParams.toString()}`);
    const accessToken = this.parseAccessToken(tokenRes.data);

    if (!accessToken) {
      throw new Error('QQ OAuth failed: invalid token');
    }

    const openidRes = await axios.get(`${this.OPENID_URL}?access_token=${accessToken}`);
    const openId = this.parseOpenId(openidRes.data);

    if (!openId) {
      throw new Error('QQ OAuth failed: invalid openid');
    }

    const userParams = new URLSearchParams({
      access_token: accessToken,
      oauth_consumer_key: env.QQ_APP_ID,
      openid: openId,
      format: 'json',
    });

    const userRes = await axios.get(`${this.USER_INFO_URL}?${userParams.toString()}`);

    return {
      openId,
      name: userRes.data.nickname || 'QQ用户',
      avatar: userRes.data.figureurl_qq || userRes.data.figureurl_1 || null,
      phone: null,
      email: null,
    };
  }

  private static parseAccessToken(response: string): string | null {
    const match = response.match(/access_token=([^&]+)/);
    return match ? match[1] : null;
  }

  private static parseOpenId(response: string): string | null {
    const match = response.match(/openid":"([^"]+)"/);
    return match ? match[1] : null;
  }
}
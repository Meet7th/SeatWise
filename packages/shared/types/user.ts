export type UserRole = 'student' | 'teacher' | 'admin';
export type UserStatus = 'active' | 'inactive' | 'banned';
export type OAuthProvider = 'wechat' | 'qq' | 'phone' | 'email';

export interface User {
  id: string;
  role: UserRole;
  name: string;
  avatar: string | null;
  phone: string | null;
  email: string | null;
  wechatOpenId: string | null;
  qqOpenId: string | null;
  studentNumber: string | null;
  schoolId: string | null;
  status: UserStatus;
  createdAt: string;
  lastLoginAt: string | null;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginRequest {
  phone?: string;
  email?: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  phone?: string;
  email?: string;
  password: string;
  inviteCode: string;
  studentNumber?: string;
}

export interface OAuthLoginRequest {
  provider: 'wechat' | 'qq';
  code: string;
  inviteCode?: string;
}

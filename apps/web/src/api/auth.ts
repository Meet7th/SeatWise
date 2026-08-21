import client from './client';
import type { ApiResponse, AuthTokens, User, LoginRequest, RegisterRequest } from '@seatwise/shared';

export const authApi = {
  login(data: LoginRequest) {
    return client.post<ApiResponse<{ user: User; tokens: AuthTokens }>>('/auth/login', data);
  },

  register(data: RegisterRequest) {
    return client.post<ApiResponse<{ user: User; tokens: AuthTokens }>>('/auth/register', data);
  },

  refresh(refreshToken: string) {
    return client.post<ApiResponse<{ tokens: AuthTokens }>>('/auth/refresh', { refreshToken });
  },

  getMe() {
    return client.get<ApiResponse<User>>('/auth/me');
  },
};

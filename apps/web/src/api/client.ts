import axios from 'axios';
import type { ApiResponse } from '@seatwise/shared';
import { useAuthStore } from '@/stores/auth';
import router from '@/router';

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

client.interceptors.request.use((config) => {
  const auth = useAuthStore();
  if (auth.tokens?.accessToken) {
    config.headers.Authorization = `Bearer ${auth.tokens.accessToken}`;
  }
  return config;
});

client.interceptors.response.use(
  (response) => {
    const data = response.data as ApiResponse;
    if (data.code !== 0) {
      return Promise.reject(new Error(data.message || '请求失败'));
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const auth = useAuthStore();
      try {
        await auth.refreshToken();
        originalRequest.headers.Authorization = `Bearer ${auth.tokens?.accessToken}`;
        return client(originalRequest);
      } catch {
        auth.logout();
        router.push('/auth');
        return Promise.reject(error);
      }
    }

    const message = error.response?.data?.message || error.message || '网络错误';
    return Promise.reject(new Error(message));
  }
);

export default client;

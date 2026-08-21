import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { User, AuthTokens, LoginRequest, RegisterRequest } from '@seatwise/shared';
import { authApi } from '@/api/auth';

const STORAGE_KEY = 'seatwise_auth';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const tokens = ref<AuthTokens | null>(null);
  const isLoading = ref(false);

  const isLoggedIn = computed(() => !!tokens.value?.accessToken);
  const isTeacher = computed(() => user.value?.role === 'teacher');
  const isStudent = computed(() => user.value?.role === 'student');
  const isAdmin = computed(() => user.value?.role === 'admin');

  function loadFromStorage() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        user.value = data.user;
        tokens.value = data.tokens;
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  function saveToStorage() {
    if (user.value && tokens.value) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ user: user.value, tokens: tokens.value }));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  async function login(req: LoginRequest) {
    isLoading.value = true;
    try {
      const { data: res } = await authApi.login(req);
      user.value = res.data.user;
      tokens.value = res.data.tokens;
      saveToStorage();
    } finally {
      isLoading.value = false;
    }
  }

  async function register(req: RegisterRequest) {
    isLoading.value = true;
    try {
      const { data: res } = await authApi.register(req);
      user.value = res.data.user;
      tokens.value = res.data.tokens;
      saveToStorage();
    } finally {
      isLoading.value = false;
    }
  }

  async function refreshToken() {
    if (!tokens.value?.refreshToken) throw new Error('No refresh token');
    const { data: res } = await authApi.refresh(tokens.value.refreshToken);
    tokens.value = res.data.tokens;
    saveToStorage();
  }

  async function fetchCurrentUser() {
    if (!tokens.value?.accessToken) return;
    try {
      const { data: res } = await authApi.getMe();
      user.value = res.data;
      saveToStorage();
    } catch {
      logout();
    }
  }

  function logout() {
    user.value = null;
    tokens.value = null;
    localStorage.removeItem(STORAGE_KEY);
  }

  loadFromStorage();

  return {
    user,
    tokens,
    isLoading,
    isLoggedIn,
    isTeacher,
    isStudent,
    isAdmin,
    login,
    register,
    refreshToken,
    fetchCurrentUser,
    logout,
  };
});

<template>
  <AuthLayout>
    <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-6">登录</h2>
    <form @submit.prevent="handleLogin" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">手机号 / 邮箱</label>
        <input
          v-model="form.identifier"
          type="text"
          placeholder="请输入手机号或邮箱"
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          required
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">密码</label>
        <input
          v-model="form.password"
          type="password"
          placeholder="请输入密码"
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          required
        />
      </div>
      <div v-if="error" class="text-red-500 text-sm">{{ error }}</div>
      <button
        type="submit"
        :disabled="auth.isLoading"
        class="w-full py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors font-medium"
      >
        {{ auth.isLoading ? '登录中...' : '登录' }}
      </button>
    </form>

    <!-- Divider -->
    <div class="flex items-center gap-4 my-6">
      <div class="flex-1 border-t border-gray-200 dark:border-gray-600"></div>
      <span class="text-xs text-gray-400 dark:text-gray-500">其他登录方式</span>
      <div class="flex-1 border-t border-gray-200 dark:border-gray-600"></div>
    </div>

    <!-- OAuth buttons -->
    <div class="grid grid-cols-2 gap-3">
      <button
        @click="handleWechatLogin"
        class="flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm text-gray-700 dark:text-gray-300"
      >
        <svg class="w-5 h-5 text-green-500" viewBox="0 0 24 24" fill="currentColor">
          <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 01.213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 00.167-.054l1.903-1.114a.864.864 0 01.717-.098 10.16 10.16 0 002.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178A1.17 1.17 0 014.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178 1.17 1.17 0 01-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 01.598.082l1.584.926a.272.272 0 00.14.047c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.582.582 0 01-.023-.156.49.49 0 01.201-.398C23.024 18.48 24 16.82 24 14.98c0-3.21-2.931-5.952-7.062-6.122zM14.57 13.39c.535 0 .969.44.969.982a.976.976 0 01-.969.983.976.976 0 01-.969-.983c0-.542.434-.982.97-.982zm4.844 0c.535 0 .969.44.969.982a.976.976 0 01-.969.983.976.976 0 01-.969-.983c0-.542.434-.982.97-.982z"/>
        </svg>
        微信登录
      </button>
      <button
        @click="handleQqLogin"
        class="flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm text-gray-700 dark:text-gray-300"
      >
        <svg class="w-5 h-5 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
          <path d="M21.395 15.035a39.548 39.548 0 00-1.51-3.397c.85-2.026 1.207-3.976 1.207-5.869 0-4.242-3.287-7.636-7.5-7.636S6.092 1.527 6.092 5.769c0 1.893.357 3.843 1.207 5.869a39.548 39.548 0 00-1.51 3.397c-.236.584-.573 1.21-.573 1.763 0 .825.672 1.493 1.5 1.493.46 0 .888-.19 1.26-.48a8.067 8.067 0 005.422 0c.372.29.8.48 1.26.48.828 0 1.5-.668 1.5-1.493 0-.553-.337-1.179-.573-1.763zM7.75 5.769c0-2.66 2.049-4.769 4.75-4.769s4.75 2.109 4.75 4.769c0 2.192-.695 4.065-1.817 5.569-1.088 1.457-2.026 2.443-2.026 3.831 0 .256-.093.465-.224.617a2.89 2.89 0 01-.459.389 5.35 5.35 0 01-2.85 0 2.89 2.89 0 01-.459-.389c-.131-.152-.224-.361-.224-.617 0-1.388-.938-2.374-2.026-3.831-1.122-1.504-1.817-3.377-1.817-5.569z"/>
        </svg>
        QQ登录
      </button>
    </div>

    <div class="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
      还没有账号？
      <router-link to="/auth/register" class="text-primary-600 dark:text-primary-400 hover:text-primary-700">注册</router-link>
    </div>
  </AuthLayout>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { oauthApi } from '@/api/oauth';
import AuthLayout from '@/components/layout/AuthLayout.vue';

const auth = useAuthStore();
const router = useRouter();
const route = useRoute();
const error = ref('');

const form = reactive({
  identifier: '',
  password: '',
});

// Handle OAuth callback
onMounted(() => {
  const { wechat, qq, openId, name, error: authError } = route.query;
  if (authError) {
    error.value = '第三方登录失败，请重试';
  } else if ((wechat || qq) && openId) {
    // TODO: Handle OAuth login with backend
    console.log('OAuth callback:', { provider: wechat ? 'wechat' : 'qq', openId, name });
  }
});

async function handleLogin() {
  error.value = '';
  try {
    const isEmail = form.identifier.includes('@');
    await auth.login({
      phone: isEmail ? undefined : form.identifier,
      email: isEmail ? form.identifier : undefined,
      password: form.password,
    });
    router.push(auth.isTeacher ? '/teacher' : '/');
  } catch (e) {
    error.value = e instanceof Error ? e.message : '登录失败';
  }
}

async function handleWechatLogin() {
  try {
    const { data } = await oauthApi.getWechatUrl();
    window.location.href = data.url;
  } catch (e) {
    error.value = '获取微信登录链接失败';
  }
}

async function handleQqLogin() {
  try {
    const { data } = await oauthApi.getQqUrl();
    window.location.href = data.url;
  } catch (e) {
    error.value = '获取QQ登录链接失败';
  }
}
</script>

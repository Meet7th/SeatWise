<template>
  <AuthLayout>
    <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-6">注册</h2>
    <form @submit.prevent="handleRegister" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">姓名</label>
        <input
          v-model="form.name"
          type="text"
          placeholder="请输入真实姓名"
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          required
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">手机号</label>
        <input
          v-model="form.phone"
          type="tel"
          placeholder="请输入11位手机号"
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">邮箱</label>
        <input
          v-model="form.email"
          type="email"
          placeholder="请输入邮箱（可选）"
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">班级邀请码</label>
        <input
          v-model="form.inviteCode"
          type="text"
          placeholder="请输入6位邀请码"
          maxlength="6"
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent uppercase"
          required
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">学号</label>
        <input
          v-model="form.studentNumber"
          type="text"
          placeholder="请输入学号（可选）"
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">密码</label>
        <input
          v-model="form.password"
          type="password"
          placeholder="8-32位，含大小写字母和数字"
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          required
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">确认密码</label>
        <input
          v-model="form.confirmPassword"
          type="password"
          placeholder="请再次输入密码"
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
        {{ auth.isLoading ? '注册中...' : '注册' }}
      </button>
    </form>
    <div class="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
      已有账号？
      <router-link to="/auth" class="text-primary-600 dark:text-primary-400 hover:text-primary-700">登录</router-link>
    </div>
  </AuthLayout>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import AuthLayout from '@/components/layout/AuthLayout.vue';

const auth = useAuthStore();
const router = useRouter();
const error = ref('');

const form = reactive({
  name: '',
  phone: '',
  email: '',
  inviteCode: '',
  studentNumber: '',
  password: '',
  confirmPassword: '',
});

async function handleRegister() {
  error.value = '';

  if (!form.phone && !form.email) {
    error.value = '请输入手机号或邮箱';
    return;
  }
  if (form.password !== form.confirmPassword) {
    error.value = '两次密码不一致';
    return;
  }
  if (form.password.length < 8) {
    error.value = '密码至少8位';
    return;
  }
  if (!/[A-Z]/.test(form.password) || !/[a-z]/.test(form.password) || !/[0-9]/.test(form.password)) {
    error.value = '密码需包含大小写字母和数字';
    return;
  }

  try {
    await auth.register({
      name: form.name,
      phone: form.phone || undefined,
      email: form.email || undefined,
      inviteCode: form.inviteCode,
      studentNumber: form.studentNumber || undefined,
      password: form.password,
    });
    router.push('/');
  } catch (e) {
    error.value = e instanceof Error ? e.message : '注册失败';
  }
}
</script>

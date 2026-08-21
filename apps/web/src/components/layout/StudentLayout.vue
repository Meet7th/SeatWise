<template>
  <div class="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
    <header class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
      <h1 class="text-lg font-bold text-primary-600">智座</h1>
      <div class="flex items-center gap-3 sm:gap-4">
        <router-link to="/" class="text-sm text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400">首页</router-link>
        <router-link to="/seat" class="text-sm text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hide-mobile">我的座位</router-link>
        <ThemeToggle />
        <div class="relative">
          <button class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 relative">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </button>
        </div>
        <button @click="handleLogout" class="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">退出</button>
      </div>
    </header>
    <main class="flex-1 p-4">
      <router-view />
    </main>

    <!-- Mobile bottom nav -->
    <nav class="sm:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 py-2 flex justify-around">
      <router-link to="/" class="flex flex-col items-center text-xs text-gray-600 dark:text-gray-400">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
        首页
      </router-link>
      <router-link to="/quiz" class="flex flex-col items-center text-xs text-gray-600 dark:text-gray-400">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
        测评
      </router-link>
      <router-link to="/seat" class="flex flex-col items-center text-xs text-gray-600 dark:text-gray-400">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
        座位
      </router-link>
      <router-link to="/appeals" class="flex flex-col items-center text-xs text-gray-600 dark:text-gray-400">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
        申诉
      </router-link>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import ThemeToggle from '@/components/ui/ThemeToggle.vue';

const auth = useAuthStore();
const router = useRouter();

function handleLogout() {
  auth.logout();
  router.push('/auth');
}
</script>

<template>
  <div class="min-h-screen flex bg-gray-50 dark:bg-gray-900">
    <aside class="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col hide-mobile">
      <div class="p-6 border-b border-gray-100 dark:border-gray-700">
        <h1 class="text-xl font-bold text-primary-600">智座</h1>
        <p class="text-xs text-gray-400 dark:text-gray-500 mt-1">教师端</p>
      </div>
      <nav class="flex-1 p-4 space-y-1">
        <router-link
          to="/teacher/classes"
          class="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors text-gray-700 dark:text-gray-300"
          active-class="bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 font-medium"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          我的班级
        </router-link>
      </nav>
      <div class="p-4 border-t border-gray-100 dark:border-gray-700">
        <div class="flex items-center gap-3 px-4 py-2">
          <div class="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-600 dark:text-primary-400 text-sm font-medium">
            {{ auth.user?.name?.[0] || 'T' }}
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{{ auth.user?.name }}</p>
            <p class="text-xs text-gray-400 dark:text-gray-500">教师</p>
          </div>
          <ThemeToggle />
          <button @click="handleLogout" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>
    </aside>
    <main class="flex-1 overflow-auto">
      <router-view />
    </main>
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

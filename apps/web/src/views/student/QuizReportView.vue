<template>
  <div class="max-w-4xl mx-auto">
    <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">测评报告</h2>

    <div v-if="quizStore.session?.result" class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      <ProfileReport :profile="quizStore.session.result" :isOwnReport="true" />
    </div>

    <div v-else class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8 text-center">
      <div class="text-4xl mb-4">📊</div>
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">暂无测评数据</h3>
      <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">请先完成性格测评。</p>
      <router-link to="/quiz" class="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors text-sm">
        去测评
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useQuizStore } from '@/stores/quiz';
import { useAuthStore } from '@/stores/auth';
import ProfileReport from '@/components/quiz/ProfileReport.vue';

const quizStore = useQuizStore();
const auth = useAuthStore();

onMounted(async () => {
  await quizStore.fetchQuestions(auth.user!.id);
});
</script>

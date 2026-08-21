<template>
  <div class="max-w-4xl mx-auto">
    <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">性格测评</h2>

    <div v-if="!quizStore.session" class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8 text-center">
      <div class="text-5xl mb-4">🧠</div>
      <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">开始测评</h3>
      <p class="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
        本测评包含 35 道题目，涵盖性格、学习风格、社交类型等维度，预计需要 10-15 分钟。
      </p>
      <button
        @click="startQuiz"
        class="px-8 py-3 bg-primary-500 text-white rounded-xl font-medium hover:bg-primary-600 transition-colors"
      >
        开始测评
      </button>
    </div>

    <QuizContainer
      v-else
      :questions="quizStore.questions"
      :classId="classroomStore.currentClassroom?.id || ''"
      @submit="handleSubmit"
    />
  </div>
</template>

<script setup lang="ts">
import { useQuizStore } from '@/stores/quiz';
import { useAuthStore } from '@/stores/auth';
import { useClassroomStore } from '@/stores/classroom';
import QuizContainer from '@/components/quiz/QuizContainer.vue';

const quizStore = useQuizStore();
const auth = useAuthStore();
const classroomStore = useClassroomStore();

async function startQuiz() {
  const classId = classroomStore.currentClassroom?.id || '';
  await quizStore.fetchQuestions(classId);
}

async function handleSubmit(answers: Record<string, unknown>) {
  const classId = classroomStore.currentClassroom?.id || '';
  await quizStore.submitQuiz(classId);
}
</script>

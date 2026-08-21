<template>
  <div class="p-6">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">测评进度</h2>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">{{ classroomStore.currentClassroom?.name }}</p>
      </div>
    </div>

    <div v-if="loading" class="text-center py-12">
      <div class="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full mx-auto" />
    </div>

    <div v-else>
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div class="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
          <p class="text-sm text-gray-500 dark:text-gray-400">总人数</p>
          <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">{{ stats.total }}</p>
        </div>
        <div class="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
          <p class="text-sm text-gray-500 dark:text-gray-400">已完成</p>
          <p class="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">{{ stats.completed }}</p>
        </div>
        <div class="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
          <p class="text-sm text-gray-500 dark:text-gray-400">进行中</p>
          <p class="text-2xl font-bold text-yellow-600 dark:text-yellow-400 mt-1">{{ stats.inProgress }}</p>
        </div>
        <div class="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
          <p class="text-sm text-gray-500 dark:text-gray-400">未开始</p>
          <p class="text-2xl font-bold text-red-500 dark:text-red-400 mt-1">{{ stats.notStarted }}</p>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 mb-6">
        <div class="flex items-center justify-between mb-2">
          <h3 class="font-medium text-gray-900 dark:text-white">完成率</h3>
          <span class="text-lg font-bold text-primary-600 dark:text-primary-400">{{ stats.completionRate }}%</span>
        </div>
        <div class="h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            class="h-full bg-primary-500 rounded-full transition-all"
            :style="{ width: `${stats.completionRate}%` }"
          />
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
              <tr>
                <th class="px-4 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-300">学生</th>
                <th class="px-4 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-300">状态</th>
                <th class="px-4 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-300 hide-mobile">完成时间</th>
                <th class="px-4 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-300">完整度</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 dark:divide-gray-700">
              <tr v-for="student in students" :key="student.studentId" class="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td class="px-4 py-3 text-sm text-gray-900 dark:text-white">{{ student.studentName }}</td>
                <td class="px-4 py-3">
                  <span
                    class="px-2 py-0.5 text-xs rounded-full"
                    :class="{
                      'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400': student.status === 'completed',
                      'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400': student.status === 'in_progress',
                      'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400': student.status === 'not_started',
                    }"
                  >
                    {{ statusLabel(student.status) }}
                  </span>
                </td>
                <td class="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 hide-mobile">
                  {{ student.completedAt ? formatDate(student.completedAt) : '-' }}
                </td>
                <td class="px-4 py-3">
                  <div class="flex items-center gap-2">
                    <div class="w-16 h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        class="h-full bg-primary-500 rounded-full"
                        :style="{ width: `${student.profileCompleteness}%` }"
                      />
                    </div>
                    <span class="text-xs text-gray-500 dark:text-gray-400">{{ student.profileCompleteness }}%</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useClassroomStore } from '@/stores/classroom';
import { useQuizStore } from '@/stores/quiz';
import type { QuizProgressItem } from '@seatwise/shared';

const route = useRoute();
const classroomStore = useClassroomStore();
const quizStore = useQuizStore();

const loading = ref(true);
const students = ref<QuizProgressItem[]>([]);
const stats = ref({ total: 0, completed: 0, inProgress: 0, notStarted: 0, completionRate: 0 });

onMounted(async () => {
  const classId = route.params.id as string;
  try {
    await classroomStore.fetchClassroom(classId);
    const result = await quizStore.fetchProgress(classId);
    students.value = result;

    const completed = result.filter(s => s.status === 'completed').length;
    const inProgress = result.filter(s => s.status === 'in_progress').length;
    const notStarted = result.filter(s => s.status === 'not_started').length;

    stats.value = {
      total: result.length,
      completed,
      inProgress,
      notStarted,
      completionRate: result.length > 0 ? Math.round((completed / result.length) * 1000) / 10 : 0,
    };
  } finally {
    loading.value = false;
  }
});

function statusLabel(status: string) {
  const map: Record<string, string> = {
    completed: '已完成', in_progress: '进行中', not_started: '未开始',
  };
  return map[status] || status;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleString('zh-CN');
}
</script>

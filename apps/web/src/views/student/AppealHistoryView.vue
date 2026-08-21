<template>
  <div class="max-w-4xl mx-auto">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white">我的申诉</h2>
      <router-link
        to="/appeal/new"
        class="px-4 py-2 bg-primary-500 text-white rounded-lg text-sm hover:bg-primary-600 transition-colors"
      >
        新建申诉
      </router-link>
    </div>

    <div class="space-y-3">
      <div
        v-for="appeal in appealStore.myAppeals"
        :key="appeal.id"
        class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5"
      >
        <div class="flex items-start justify-between">
          <div>
            <div class="flex items-center gap-2">
              <span class="px-2 py-0.5 rounded text-xs font-medium" :class="typeClass(appeal.type)">
                {{ typeLabels[appeal.type] }}
              </span>
              <span class="px-2 py-0.5 rounded text-xs font-medium" :class="statusClass(appeal.status)">
                {{ statusLabels[appeal.status] }}
              </span>
            </div>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-2">{{ appeal.description }}</p>
          </div>
        </div>
        <div class="flex items-center justify-between mt-3 text-xs text-gray-400">
          <span>{{ formatDate(appeal.createdAt) }}</span>
          <span v-if="appeal.teacherResolution" class="text-xs text-gray-400">回复: {{ appeal.teacherResolution.note }}</span>
        </div>
      </div>

      <div v-if="appealStore.myAppeals.length === 0" class="text-center py-12 text-gray-400 dark:text-gray-500">
        暂无申诉记录
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useAppealStore } from '@/stores/appeal';
import { formatDate } from '@/utils/format';

const auth = useAuthStore();
const appealStore = useAppealStore();

const typeLabels: Record<string, string> = {
  seat_preference: '座位偏好',
  vision: '视力问题',
  health: '身体原因',
  other: '其他',
};

const statusLabels: Record<string, string> = {
  pending: '待处理',
  approved: '已批准',
  rejected: '已驳回',
};

function typeClass(type: string) {
  const map: Record<string, string> = {
    seat_preference: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    vision: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
    health: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
    other: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
  };
  return map[type] || map.other;
}

function statusClass(status: string) {
  const map: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
    approved: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
    rejected: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  };
  return map[status] || map.pending;
}

onMounted(async () => {
  await appealStore.fetchMyAppeals();
});
</script>

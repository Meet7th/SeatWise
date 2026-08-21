<template>
  <div class="max-w-4xl mx-auto">
    <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">我的座位</h2>

    <div v-if="!seat" class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8 text-center">
      <div class="text-4xl mb-4">💺</div>
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">暂无座位安排</h3>
      <p class="text-sm text-gray-500 dark:text-gray-400">教师尚未发布座位安排，请耐心等待。</p>
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <h3 class="font-semibold text-gray-900 dark:text-white mb-4">座位信息</h3>
        <div class="space-y-3 text-sm">
          <div class="flex justify-between">
            <span class="text-gray-500 dark:text-gray-400">排</span>
            <span class="text-gray-900 dark:text-white font-medium">{{ seat.row + 1 }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-500 dark:text-gray-400">列</span>
            <span class="text-gray-900 dark:text-white font-medium">{{ seat.col + 1 }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-500 dark:text-gray-400">座位号</span>
            <span class="text-gray-900 dark:text-white font-medium">{{ seat.seatNumber }}</span>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <h3 class="font-semibold text-gray-900 dark:text-white mb-4">换座申请</h3>
        <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">如需调换座位，请提交申诉。</p>
        <router-link
          to="/appeal/new"
          class="block w-full text-center px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors text-sm"
        >
          提交申诉
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import api from '@/api/client';

const auth = useAuthStore();
const seat = ref<any>(null);

onMounted(async () => {
  try {
    const res = await api.get(`/seating/my-seat/${auth.user?.id}`);
    seat.value = res.data.seat;
  } catch {}
});
</script>

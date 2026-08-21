<template>
  <div class="p-6">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white">我的班级</h2>
      <router-link
        to="/teacher/classes/create"
        class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
      >
        + 创建班级
      </router-link>
    </div>

    <div v-if="classroomStore.isLoading" class="text-center py-12 text-gray-400">加载中...</div>

    <div v-else-if="classroomStore.classrooms.length === 0" class="text-center py-12">
      <p class="text-gray-400 dark:text-gray-500 text-lg">还没有创建过班级</p>
      <p class="text-gray-400 dark:text-gray-500 text-sm mt-2">点击右上角创建你的第一个班级</p>
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <router-link
        v-for="cls in classroomStore.classrooms"
        :key="cls.id"
        :to="`/teacher/classes/${cls.id}`"
        class="block p-5 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600 hover:shadow-md transition-all"
      >
        <div class="flex items-start justify-between">
          <div>
            <h3 class="font-semibold text-gray-900 dark:text-white">{{ cls.name }}</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">{{ cls.grade }} · {{ cls.semester }}</p>
          </div>
          <span
            class="px-2 py-0.5 text-xs rounded-full"
            :class="statusClass(cls.status)"
          >
            {{ statusLabel(cls.status) }}
          </span>
        </div>
        <div class="mt-4 flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
          <span>{{ cls.seatConfig.rows * cls.seatConfig.cols }} 座</span>
          <span>{{ cls.studentIds?.length || 0 }} 人</span>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useClassroomStore } from '@/stores/classroom';

const classroomStore = useClassroomStore();

onMounted(() => {
  classroomStore.fetchClassrooms();
});

function statusClass(status: string) {
  const map: Record<string, string> = {
    setup: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400',
    quiz_open: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    quiz_closed: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400',
    seating_generated: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
    published: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
    archived: 'bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500',
  };
  return map[status] || 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400';
}

function statusLabel(status: string) {
  const map: Record<string, string> = {
    setup: '设置中',
    quiz_open: '测评中',
    quiz_closed: '测评结束',
    seating_generated: '已排座',
    published: '已发布',
    archived: '已归档',
  };
  return map[status] || status;
}
</script>

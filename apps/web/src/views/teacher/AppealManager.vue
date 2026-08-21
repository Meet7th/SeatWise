<template>
  <div class="p-6">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">申诉管理</h2>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">{{ classroomStore.currentClassroom?.name }}</p>
      </div>
    </div>

    <div class="flex gap-2 mb-4 overflow-x-auto">
      <button
        v-for="f in filters"
        :key="f.value"
        @click="currentFilter = f.value"
        class="px-3 py-1.5 rounded-lg text-sm border transition-colors whitespace-nowrap"
        :class="currentFilter === f.value
          ? 'bg-primary-500 text-white border-primary-500'
          : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'"
      >
        {{ f.label }}
      </button>
    </div>

    <div v-if="appealStore.isLoading" class="text-center py-12">
      <div class="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full mx-auto" />
    </div>

    <div v-else-if="appealStore.appeals.length === 0" class="text-center py-12">
      <p class="text-gray-400 dark:text-gray-500">暂无申诉</p>
    </div>

    <div v-else class="space-y-3">
      <div
        v-for="appeal in appealStore.appeals"
        :key="appeal.id"
        class="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700"
      >
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <div class="flex items-center gap-2 flex-wrap">
              <span class="font-medium text-gray-900 dark:text-white">{{ appeal.studentName }}</span>
              <span class="px-2 py-0.5 text-xs rounded-full" :class="typeClass(appeal.type)">
                {{ typeLabel(appeal.type) }}
              </span>
              <span class="px-2 py-0.5 text-xs rounded-full" :class="statusClass(appeal.status)">
                {{ statusLabel(appeal.status) }}
              </span>
            </div>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-2">{{ appeal.description }}</p>
            <div class="text-xs text-gray-400 dark:text-gray-500 mt-2">{{ formatDate(appeal.createdAt) }}</div>
          </div>
        </div>

        <div v-if="appeal.autoResolution" class="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-sm">
          <p class="font-medium text-blue-700 dark:text-blue-400">AI 建议：</p>
          <p class="text-blue-600 dark:text-blue-300 mt-1">{{ appeal.autoResolution.suggestion }}</p>
          <p class="text-blue-500 dark:text-blue-400 text-xs mt-1">置信度: {{ appeal.autoResolution.confidence }}%</p>
        </div>

        <div v-if="appeal.status === 'pending'" class="mt-3 flex gap-2">
          <button
            @click="handleResolve(appeal.id, 'approved')"
            class="px-3 py-1.5 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700"
          >
            批准
          </button>
          <button
            @click="handleResolve(appeal.id, 'rejected')"
            class="px-3 py-1.5 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700"
          >
            拒绝
          </button>
        </div>

        <div v-if="appeal.teacherResolution" class="mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-sm">
          <p class="font-medium text-gray-700 dark:text-gray-300">教师处理：</p>
          <p class="text-gray-600 dark:text-gray-400 mt-1">{{ appeal.teacherResolution.note }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useAppealStore } from '@/stores/appeal';
import { useClassroomStore } from '@/stores/classroom';

const route = useRoute();
const appealStore = useAppealStore();
const classroomStore = useClassroomStore();
const currentFilter = ref('pending');

const filters = [
  { value: 'pending', label: '待处理' },
  { value: 'auto_resolved', label: '自动处理' },
  { value: 'teacher_resolved', label: '已处理' },
  { value: '', label: '全部' },
];

onMounted(() => {
  loadAppeals();
});

watch(currentFilter, () => loadAppeals());

function loadAppeals() {
  const classId = route.params.id as string;
  appealStore.fetchAppeals(classId, currentFilter.value ? { status: currentFilter.value } : undefined);
}

async function handleResolve(appealId: string, action: 'approved' | 'rejected') {
  const note = prompt(action === 'approved' ? '批准备注：' : '拒绝原因：');
  if (note === null) return;

  try {
    await appealStore.resolveAppeal(appealId, { action, note: note || '' });
    loadAppeals();
  } catch (e) {
    alert(e instanceof Error ? e.message : '操作失败');
  }
}

function typeLabel(type: string) {
  const map: Record<string, string> = { social: '社交', vision: '视力', noise: '噪音', conflict: '矛盾', other: '其他' };
  return map[type] || type;
}

function typeClass(type: string) {
  const map: Record<string, string> = {
    social: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    vision: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    noise: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    conflict: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    other: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
  };
  return map[type] || 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
}

function statusLabel(status: string) {
  const map: Record<string, string> = { pending: '待处理', auto_resolved: '自动处理', teacher_resolved: '已处理', rejected: '已拒绝', withdrawn: '已撤回' };
  return map[status] || status;
}

function statusClass(status: string) {
  const map: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    auto_resolved: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    teacher_resolved: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    rejected: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    withdrawn: 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
  };
  return map[status] || 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleString('zh-CN');
}
</script>

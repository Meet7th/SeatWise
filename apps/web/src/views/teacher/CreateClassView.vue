<template>
  <div class="p-6 max-w-2xl mx-auto">
    <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">创建班级</h2>
    <form @submit.prevent="handleCreate" class="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">班级名称</label>
          <input v-model="form.name" type="text" placeholder="如：高一(3)班" class="input" required />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">年级</label>
          <select v-model="form.grade" class="input" required>
            <option value="">请选择</option>
            <option v-for="g in grades" :key="g" :value="g">{{ g }}</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">学期</label>
          <select v-model="form.semester" class="input" required>
            <option value="">请选择</option>
            <option v-for="s in semesters" :key="s" :value="s">{{ s }}</option>
          </select>
        </div>
      </div>

      <div class="border-t border-gray-100 dark:border-gray-700 pt-6">
        <h3 class="font-medium text-gray-900 dark:text-white mb-4">教室座位配置</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">排数 (1-20)</label>
            <input v-model.number="form.seatConfig.rows" type="number" min="1" max="20" class="input" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">列数 (1-20)</label>
            <input v-model.number="form.seatConfig.cols" type="number" min="1" max="20" class="input" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">门的位置</label>
            <select v-model="form.seatConfig.doors" class="input">
              <option value="right">右侧</option>
              <option value="left">左侧</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">编号模式</label>
            <select v-model="form.seatConfig.numberingMode" class="input">
              <option value="horizontal-snake">横向蛇形</option>
              <option value="vertical-snake">纵向蛇形</option>
            </select>
          </div>
        </div>
        <div class="flex gap-6 mt-4">
          <label class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <input v-model="form.seatConfig.platformLeft" type="checkbox" class="rounded" />
            左侧讲台
          </label>
          <label class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <input v-model="form.seatConfig.platformRight" type="checkbox" class="rounded" />
            右侧讲台
          </label>
          <label class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <input v-model="form.seatConfig.showDoors" type="checkbox" class="rounded" />
            显示门
          </label>
        </div>
      </div>

      <div v-if="error" class="text-red-500 text-sm">{{ error }}</div>

      <div class="flex gap-3">
        <button type="button" @click="$router.back()" class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          取消
        </button>
        <button type="submit" :disabled="loading" class="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors">
          {{ loading ? '创建中...' : '创建班级' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useClassroomStore } from '@/stores/classroom';

const router = useRouter();
const classroomStore = useClassroomStore();
const loading = ref(false);
const error = ref('');

const grades = ['初一', '初二', '初三', '高一', '高二', '高三'];
const semesters = ['2026春季', '2026秋季', '2027春季', '2027秋季'];

const form = reactive({
  name: '',
  grade: '',
  semester: '',
  seatConfig: {
    rows: 7,
    cols: 11,
    platformLeft: true,
    platformRight: true,
    doors: 'right' as const,
    numberingMode: 'horizontal-snake' as const,
    showDoors: true,
  },
});

async function handleCreate() {
  error.value = '';
  loading.value = true;
  try {
    const cls = await classroomStore.createClassroom({
      name: form.name,
      grade: form.grade,
      semester: form.semester,
      seatConfig: form.seatConfig,
    });
    router.push(`/teacher/classes/${cls.id}`);
  } catch (e) {
    error.value = e instanceof Error ? e.message : '创建失败';
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.input {
  @apply w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm;
}
</style>

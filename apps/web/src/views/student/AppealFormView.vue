<template>
  <div class="max-w-2xl mx-auto">
    <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">提交申诉</h2>

    <form @submit.prevent="handleSubmit" class="space-y-5">
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">申诉类型</label>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <button
            v-for="type in appealTypes"
            :key="type.value"
            type="button"
            @click="form.type = type.value"
            class="px-3 py-2 rounded-lg border text-sm transition-colors"
            :class="form.type === type.value
              ? 'bg-primary-50 dark:bg-primary-900/30 border-primary-300 dark:border-primary-600 text-primary-700 dark:text-primary-300'
              : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-500'"
          >
            {{ type.label }}
          </button>
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">详细说明</label>
        <textarea
          v-model="form.description"
          rows="5"
          class="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
          placeholder="请描述您的诉求（50-500字）"
        />
        <div class="flex justify-between mt-1 text-xs text-gray-400">
          <span :class="{ 'text-red-500': form.description.length < 50 }">{{ form.description.length }}/500</span>
          <span>至少50字</span>
        </div>
      </div>

      <div class="flex gap-3">
        <button
          type="submit"
          :disabled="submitting || form.description.length < 50"
          class="flex-1 px-6 py-3 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ submitting ? '提交中...' : '提交申诉' }}
        </button>
        <router-link
          to="/appeals"
          class="px-6 py-3 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-center"
        >
          取消
        </router-link>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useAppealStore } from '@/stores/appeal';

const router = useRouter();
const auth = useAuthStore();
const appealStore = useAppealStore();

const submitting = ref(false);
const form = reactive({
  type: 'seat_preference',
  description: '',
});

const appealTypes = [
  { value: 'seat_preference', label: '座位偏好' },
  { value: 'vision', label: '视力问题' },
  { value: 'health', label: '身体原因' },
  { value: 'other', label: '其他' },
];

async function handleSubmit() {
  if (form.description.length < 50) return;
  submitting.value = true;
  try {
    await appealStore.createAppeal({
      classId: auth.user!.id,
      seatPlanId: '',
      type: form.type as any,
      description: form.description,
    });
    router.push('/appeals');
  } catch (e) {
    alert('提交失败，请重试');
  } finally {
    submitting.value = false;
  }
}
</script>

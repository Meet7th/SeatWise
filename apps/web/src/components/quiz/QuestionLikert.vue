<template>
  <div class="space-y-4">
    <p class="text-lg font-medium text-gray-900">{{ question.question }}</p>
    <p v-if="question.description" class="text-sm text-gray-500">{{ question.description }}</p>
    <div class="flex justify-between items-center gap-2">
      <span class="text-xs text-gray-400">非常不同意</span>
      <div class="flex gap-2">
        <button
          v-for="n in 5"
          :key="n"
          @click="$emit('update:modelValue', n)"
          class="w-12 h-12 rounded-full border-2 text-sm font-medium transition-all"
          :class="modelValue === n
            ? 'border-primary-500 bg-primary-500 text-white'
            : 'border-gray-200 text-gray-600 hover:border-primary-300'"
        >
          {{ n }}
        </button>
      </div>
      <span class="text-xs text-gray-400">非常同意</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { QuizQuestion } from '@seatwise/shared';

defineProps<{
  question: QuizQuestion;
  modelValue: number | undefined;
}>();

defineEmits<{
  'update:modelValue': [value: number];
}>();
</script>

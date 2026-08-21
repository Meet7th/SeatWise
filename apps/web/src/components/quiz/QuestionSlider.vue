<template>
  <div class="space-y-4">
    <p class="text-lg font-medium text-gray-900">{{ question.question }}</p>
    <p v-if="question.description" class="text-sm text-gray-500">{{ question.description }}</p>
    <div class="space-y-2">
      <input
        type="range"
        :min="question.min || 0"
        :max="question.max || 100"
        :value="modelValue ?? 50"
        @input="$emit('update:modelValue', Number(($event.target as HTMLInputElement).value))"
        class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-500"
      />
      <div class="flex justify-between text-xs text-gray-400">
        <span>{{ question.min || 0 }}</span>
        <span class="text-lg font-bold text-primary-600">{{ modelValue ?? 50 }}</span>
        <span>{{ question.max || 100 }}</span>
      </div>
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

<template>
  <div class="space-y-3">
    <p class="text-lg font-medium text-gray-900">{{ question.question }}</p>
    <p v-if="question.description" class="text-sm text-gray-500">{{ question.description }}</p>
    <div class="space-y-2">
      <label
        v-for="option in question.options"
        :key="option.id"
        class="flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors"
        :class="modelValue === option.id ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300'"
      >
        <input
          type="radio"
          :name="question.id"
          :value="option.id"
          :checked="modelValue === option.id"
          @change="$emit('update:modelValue', option.id)"
          class="w-4 h-4 text-primary-600"
        />
        <span class="text-sm text-gray-700">{{ option.text }}</span>
      </label>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { QuizQuestion } from '@seatwise/shared';

defineProps<{
  question: QuizQuestion;
  modelValue: string | undefined;
}>();

defineEmits<{
  'update:modelValue': [value: string];
}>();
</script>

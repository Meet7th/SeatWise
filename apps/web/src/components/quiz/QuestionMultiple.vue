<template>
  <div class="space-y-3">
    <p class="text-lg font-medium text-gray-900">{{ question.question }}</p>
    <p v-if="question.description" class="text-sm text-gray-500">{{ question.description }}</p>
    <div class="space-y-2">
      <label
        v-for="option in question.options"
        :key="option.id"
        class="flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors"
        :class="selectedValues.includes(option.id) ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300'"
      >
        <input
          type="checkbox"
          :value="option.id"
          :checked="selectedValues.includes(option.id)"
          @change="toggleOption(option.id)"
          class="w-4 h-4 text-primary-600 rounded"
        />
        <span class="text-sm text-gray-700">{{ option.text }}</span>
      </label>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { QuizQuestion } from '@seatwise/shared';

const props = defineProps<{
  question: QuizQuestion;
  modelValue: string[];
}>();

const emit = defineEmits<{
  'update:modelValue': [value: string[]];
}>();

const selectedValues = computed(() => props.modelValue || []);

function toggleOption(id: string) {
  const current = [...selectedValues.value];
  const idx = current.indexOf(id);
  if (idx >= 0) {
    current.splice(idx, 1);
  } else {
    current.push(id);
  }
  emit('update:modelValue', current);
}
</script>

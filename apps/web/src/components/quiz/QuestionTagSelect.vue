<template>
  <div class="space-y-4">
    <p class="text-lg font-medium text-gray-900">{{ question.question }}</p>
    <p v-if="question.description" class="text-sm text-gray-500">{{ question.description }}</p>
    <div class="flex flex-wrap gap-2">
      <button
        v-for="tag in question.tags"
        :key="tag"
        @click="toggleTag(tag)"
        class="px-4 py-2 rounded-full border text-sm transition-all"
        :class="selectedTags.includes(tag)
          ? 'border-primary-500 bg-primary-500 text-white'
          : 'border-gray-200 text-gray-600 hover:border-primary-300'"
      >
        {{ tag }}
      </button>
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

const selectedTags = computed(() => props.modelValue || []);

function toggleTag(tag: string) {
  const current = [...selectedTags.value];
  const idx = current.indexOf(tag);
  if (idx >= 0) {
    current.splice(idx, 1);
  } else {
    current.push(tag);
  }
  emit('update:modelValue', current);
}
</script>

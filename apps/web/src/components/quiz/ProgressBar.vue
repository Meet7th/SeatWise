<template>
  <div class="flex items-center gap-3">
    <div class="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
      <div
        class="h-full bg-primary-500 transition-all duration-300"
        :style="{ width: `${percent}%` }"
      />
    </div>
    <span class="text-sm text-gray-500 whitespace-nowrap">{{ answered }}/{{ total }}</span>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  answered: number;
  total: number;
  percent: number;
}>();
</script>

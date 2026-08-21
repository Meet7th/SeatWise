<template>
  <div class="text-center py-12">
    <div class="text-4xl mb-4">{{ icon }}</div>
    <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">{{ title }}</h3>
    <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">{{ description }}</p>
    <slot />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  icon?: string;
  title: string;
  description?: string;
}>();
</script>

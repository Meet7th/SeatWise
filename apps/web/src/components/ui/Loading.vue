<template>
  <div class="flex items-center justify-center" :class="wrapperClass">
    <div
      class="border-4 border-t-transparent rounded-full animate-spin"
      :class="[sizeClass, colorClass]"
    />
    <span v-if="text" class="ml-3 text-sm text-gray-500">{{ text }}</span>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  text?: string;
  wrapperClass?: string;
}>();

const sizeClass = {
  sm: 'w-4 h-4',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
}[props.size || 'md'];

const colorClass = props.color || 'border-primary-500';
</script>

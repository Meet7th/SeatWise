<template>
  <div
    class="flex items-center justify-center rounded-lg border-2 border-dashed"
    :class="[
      side === 'left' ? 'border-gray-300 bg-gray-50' : 'border-gray-300 bg-gray-50',
      size === 'large' ? 'w-full h-16' : 'w-full h-12',
    ]"
  >
    <span class="text-sm text-gray-400">讲台</span>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  side: 'left' | 'right';
  size?: 'normal' | 'large';
}>();
</script>

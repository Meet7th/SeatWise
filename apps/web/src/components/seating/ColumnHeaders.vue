<template>
  <div class="flex gap-1 px-1">
    <div
      v-for="col in cols"
      :key="col"
      class="flex-1 text-center text-xs text-gray-400 font-medium"
    >
      {{ col }}
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  cols: number;
}>();
</script>

<template>
  <router-view />
  <Toast />
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import Toast from '@/components/ui/Toast.vue';
import { useDarkMode } from '@/composables/useDarkMode';

const { isDark } = useDarkMode();

onMounted(() => {
  if (isDark.value) {
    document.documentElement.classList.add('dark');
  }
});
</script>

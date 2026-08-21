<template>
  <Teleport to="body">
    <div class="fixed top-4 right-4 z-50 space-y-2">
      <TransitionGroup name="toast">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg text-sm max-w-sm"
          :class="toastClasses(toast.type)"
        >
          <span>{{ toastIcons[toast.type] }}</span>
          <span class="flex-1">{{ toast.message }}</span>
          <button @click="remove(toast.id)" class="opacity-50 hover:opacity-100">&times;</button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { useToast } from '@/composables/useToast';

const { toasts, remove } = useToast();

const toastIcons: Record<string, string> = {
  success: '✓',
  error: '✕',
  warning: '⚠',
  info: 'ℹ',
};

function toastClasses(type: string) {
  const map: Record<string, string> = {
    success: 'bg-green-50 text-green-800 border border-green-200',
    error: 'bg-red-50 text-red-800 border border-red-200',
    warning: 'bg-yellow-50 text-yellow-800 border border-yellow-200',
    info: 'bg-blue-50 text-blue-800 border border-blue-200',
  };
  return map[type] || 'bg-gray-50 text-gray-800 border border-gray-200';
}
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>

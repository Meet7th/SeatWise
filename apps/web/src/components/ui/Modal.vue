<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="modelValue" class="fixed inset-0 z-50 flex items-center justify-center" @click.self="close">
        <div class="absolute inset-0 bg-black/50" />
        <div
          class="relative bg-white rounded-xl shadow-xl max-w-lg w-full mx-4 overflow-hidden"
          :class="sizeClass"
        >
          <div v-if="title" class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h3 class="text-lg font-semibold text-gray-900">{{ title }}</h3>
            <button @click="close" class="text-gray-400 hover:text-gray-600 text-xl">&times;</button>
          </div>
          <div class="p-6">
            <slot />
          </div>
          <div v-if="$slots.footer" class="px-6 py-4 border-t border-gray-100 bg-gray-50">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean;
  title?: string;
  size?: 'sm' | 'md' | 'lg';
}>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
}>();

const sizeClass = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
}[props.size || 'md'];

function close() {
  emit('update:modelValue', false);
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: all 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>

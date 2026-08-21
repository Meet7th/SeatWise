import { ref } from 'vue';

export interface Toast {
  id: number;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

const toasts = ref<Toast[]>([]);
let nextId = 0;

export function useToast() {
  function show(type: Toast['type'], message: string, duration = 3000) {
    const id = nextId++;
    const toast: Toast = { id, type, message, duration };
    toasts.value.push(toast);

    if (duration > 0) {
      setTimeout(() => {
        remove(id);
      }, duration);
    }

    return id;
  }

  function success(message: string, duration?: number) {
    return show('success', message, duration);
  }

  function error(message: string, duration?: number) {
    return show('error', message, duration);
  }

  function warning(message: string, duration?: number) {
    return show('warning', message, duration);
  }

  function info(message: string, duration?: number) {
    return show('info', message, duration);
  }

  function remove(id: number) {
    const idx = toasts.value.findIndex(t => t.id === id);
    if (idx >= 0) {
      toasts.value.splice(idx, 1);
    }
  }

  return { toasts, show, success, error, warning, info, remove };
}

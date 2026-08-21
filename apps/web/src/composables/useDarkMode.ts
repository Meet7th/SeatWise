import { ref, watch, onMounted } from 'vue';
import { getItem, setItem } from '@/utils/storage';

const isDark = ref(false);

export function useDarkMode() {
  function toggle() {
    isDark.value = !isDark.value;
  }

  function setDark(value: boolean) {
    isDark.value = value;
  }

  watch(isDark, (dark) => {
    setItem('darkMode', dark);
    if (dark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  });

  onMounted(() => {
    const stored = getItem<boolean>('darkMode', false);
    isDark.value = stored;
    if (stored) {
      document.documentElement.classList.add('dark');
    }
  });

  return { isDark, toggle, setDark };
}

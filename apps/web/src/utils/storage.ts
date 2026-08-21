const PREFIX = 'seatwise_';

export function setItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(`${PREFIX}${key}`, JSON.stringify(value));
  } catch (e) {
    console.warn('Failed to save to localStorage:', e);
  }
}

export function getItem<T>(key: string, defaultValue: T): T {
  try {
    const stored = localStorage.getItem(`${PREFIX}${key}`);
    if (stored === null) return defaultValue;
    return JSON.parse(stored) as T;
  } catch {
    return defaultValue;
  }
}

export function removeItem(key: string): void {
  localStorage.removeItem(`${PREFIX}${key}`);
}

export function clearAll(): void {
  const keys = Object.keys(localStorage).filter(k => k.startsWith(PREFIX));
  keys.forEach(k => localStorage.removeItem(k));
}

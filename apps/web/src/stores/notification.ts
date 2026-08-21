import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Notification } from '@seatwise/shared';
import { notificationApi } from '@/api/notification';

export const useNotificationStore = defineStore('notification', () => {
  const notifications = ref<Notification[]>([]);
  const unreadCount = ref(0);
  const isLoading = ref(false);

  async function fetchNotifications(params?: { unread?: boolean }) {
    isLoading.value = true;
    try {
      const { data: res } = await notificationApi.list(params);
      notifications.value = res.data.items;
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchUnreadCount() {
    const { data: res } = await notificationApi.getUnreadCount();
    unreadCount.value = res.data.count;
  }

  async function markAsRead(id: string) {
    await notificationApi.markAsRead(id);
    const notification = notifications.value.find(n => n.id === id);
    if (notification) {
      notification.read = true;
      notification.readAt = new Date().toISOString();
    }
    unreadCount.value = Math.max(0, unreadCount.value - 1);
  }

  async function markAllAsRead() {
    await notificationApi.markAllAsRead();
    notifications.value.forEach(n => {
      n.read = true;
      n.readAt = new Date().toISOString();
    });
    unreadCount.value = 0;
  }

  return {
    notifications, unreadCount, isLoading,
    fetchNotifications, fetchUnreadCount, markAsRead, markAllAsRead,
  };
});

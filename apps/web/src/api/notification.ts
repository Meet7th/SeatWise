import client from './client';
import type { ApiResponse, Notification, PaginatedResponse } from '@seatwise/shared';

export const notificationApi = {
  list(params?: { unread?: boolean; page?: number; pageSize?: number }) {
    return client.get<ApiResponse<PaginatedResponse<Notification>>>('/notifications', { params });
  },

  getUnreadCount() {
    return client.get<ApiResponse<{ count: number }>>('/notifications/unread-count');
  },

  markAsRead(id: string) {
    return client.put<ApiResponse<{ success: boolean }>>(`/notifications/${id}/read`);
  },

  markAllAsRead() {
    return client.put<ApiResponse<{ success: boolean }>>('/notifications/read-all');
  },
};

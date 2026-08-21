import client from './client';
import type { ApiResponse, Appeal, CreateAppealRequest, ResolveAppealRequest } from '@seatwise/shared';

export const appealApi = {
  create(data: CreateAppealRequest) {
    return client.post<ApiResponse<Appeal>>('/appeals', data);
  },

  listByClass(classId: string, params?: { status?: string; type?: string }) {
    return client.get<ApiResponse<Appeal[]>>(`/appeals/${classId}`, { params });
  },

  resolve(appealId: string, data: ResolveAppealRequest) {
    return client.put<ApiResponse<{ success: boolean }>>(`/appeals/${appealId}/resolve`, data);
  },

  getMyAppeals() {
    return client.get<ApiResponse<Appeal[]>>('/appeals/my/list');
  },
};

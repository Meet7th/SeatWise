import client from './client';
import type { ApiResponse, Classroom, CreateClassroomRequest, JoinClassroomRequest, PaginatedResponse, StudentProfile } from '@seatwise/shared';

export const classroomApi = {
  create(data: CreateClassroomRequest) {
    return client.post<ApiResponse<Classroom>>('/classrooms', data);
  },

  list() {
    return client.get<ApiResponse<Classroom[]>>('/classrooms');
  },

  getById(id: string) {
    return client.get<ApiResponse<Classroom>>(`/classrooms/${id}`);
  },

  generateInvite(id: string, expiresInDays: number) {
    return client.post<ApiResponse<{ inviteCode: string; inviteLink: string; expiresAt: string }>>(
      `/classrooms/${id}/invite`,
      { expiresInDays }
    );
  },

  join(data: JoinClassroomRequest) {
    return client.post<ApiResponse<Classroom>>('/classrooms/join', data);
  },

  getStudents(classId: string, params?: { search?: string; filter?: string; page?: number; pageSize?: number }) {
    return client.get<ApiResponse<PaginatedResponse<StudentProfile>>>(`/classrooms/${classId}/students`, { params });
  },
};

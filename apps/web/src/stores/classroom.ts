import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Classroom, CreateClassroomRequest, JoinClassroomRequest, StudentProfile } from '@seatwise/shared';
import { classroomApi } from '@/api/classroom';

export const useClassroomStore = defineStore('classroom', () => {
  const classrooms = ref<Classroom[]>([]);
  const currentClassroom = ref<Classroom | null>(null);
  const students = ref<StudentProfile[]>([]);
  const isLoading = ref(false);

  async function fetchClassrooms() {
    isLoading.value = true;
    try {
      const { data: res } = await classroomApi.list();
      classrooms.value = res.data;
    } finally {
      isLoading.value = false;
    }
  }

  async function createClassroom(req: CreateClassroomRequest): Promise<Classroom> {
    const { data: res } = await classroomApi.create(req);
    classrooms.value.push(res.data);
    return res.data;
  }

  async function joinClassroom(req: JoinClassroomRequest) {
    const { data: res } = await classroomApi.join(req);
    classrooms.value.push(res.data);
  }

  async function fetchClassroom(id: string) {
    isLoading.value = true;
    try {
      const { data: res } = await classroomApi.getById(id);
      currentClassroom.value = res.data;
    } finally {
      isLoading.value = false;
    }
  }

  async function generateInvite(classId: string, expiresInDays: number) {
    const { data: res } = await classroomApi.generateInvite(classId, expiresInDays);
    return res.data;
  }

  async function fetchStudents(classId: string, params?: { search?: string; filter?: string }) {
    const { data: res } = await classroomApi.getStudents(classId, params);
    students.value = res.data.items;
    return res.data;
  }

  return {
    classrooms,
    currentClassroom,
    students,
    isLoading,
    fetchClassrooms,
    createClassroom,
    joinClassroom,
    fetchClassroom,
    generateInvite,
    fetchStudents,
  };
});

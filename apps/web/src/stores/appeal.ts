import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Appeal, CreateAppealRequest, ResolveAppealRequest } from '@seatwise/shared';
import { appealApi } from '@/api/appeal';

export const useAppealStore = defineStore('appeal', () => {
  const appeals = ref<Appeal[]>([]);
  const myAppeals = ref<Appeal[]>([]);
  const isLoading = ref(false);

  async function createAppeal(req: CreateAppealRequest): Promise<Appeal> {
    const { data: res } = await appealApi.create(req);
    myAppeals.value.unshift(res.data);
    return res.data;
  }

  async function fetchAppeals(classId: string, params?: { status?: string; type?: string }) {
    isLoading.value = true;
    try {
      const { data: res } = await appealApi.listByClass(classId, params);
      appeals.value = res.data;
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchMyAppeals() {
    isLoading.value = true;
    try {
      const { data: res } = await appealApi.getMyAppeals();
      myAppeals.value = res.data;
    } finally {
      isLoading.value = false;
    }
  }

  async function resolveAppeal(appealId: string, req: ResolveAppealRequest) {
    await appealApi.resolve(appealId, req);
    const appeal = appeals.value.find(a => a.id === appealId);
    if (appeal) {
      appeal.status = 'teacher_resolved';
      appeal.teacherResolution = {
        action: req.action,
        note: req.note,
        newSeatIndex: req.newSeatIndex || null,
        resolvedAt: new Date().toISOString(),
        resolvedBy: '',
      };
    }
  }

  return {
    appeals, myAppeals, isLoading,
    createAppeal, fetchAppeals, fetchMyAppeals, resolveAppeal,
  };
});

<template>
  <div class="p-6">
    <div v-if="loading" class="text-center py-12 text-gray-400">加载中...</div>
    <div v-else-if="!classroom" class="text-center py-12 text-gray-400 dark:text-gray-500">班级不存在</div>
    <div v-else>
      <div class="flex items-center justify-between mb-6">
        <div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">{{ classroom.name }}</h2>
          <p class="text-gray-500 dark:text-gray-400 mt-1">{{ classroom.grade }} · {{ classroom.semester }}</p>
        </div>
        <div class="flex gap-2">
          <button
            v-if="classroom.status === 'setup'"
            @click="showInviteModal = true"
            class="px-4 py-2 border border-primary-300 dark:border-primary-600 text-primary-600 dark:text-primary-400 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 text-sm"
          >
            邀请学生
          </button>
          <router-link
            :to="`/teacher/classes/${classroom.id}/seating`"
            class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm"
          >
            排座编辑
          </router-link>
        </div>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div class="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
          <p class="text-sm text-gray-500 dark:text-gray-400">学生人数</p>
          <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">{{ classroom.studentIds?.length || 0 }}</p>
        </div>
        <div class="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
          <p class="text-sm text-gray-500 dark:text-gray-400">测评完成</p>
          <p class="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">{{ quizCompleted }}</p>
        </div>
        <div class="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
          <p class="text-sm text-gray-500 dark:text-gray-400">座位数</p>
          <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">{{ classroom.seatConfig.rows * classroom.seatConfig.cols }}</p>
        </div>
        <div class="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
          <p class="text-sm text-gray-500 dark:text-gray-400">班级状态</p>
          <p class="text-lg font-bold text-primary-600 dark:text-primary-400 mt-1">{{ statusLabel(classroom.status) }}</p>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div class="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700">
          <h3 class="font-semibold text-gray-900 dark:text-white mb-3">快捷操作</h3>
          <div class="space-y-2">
            <router-link :to="`/teacher/classes/${classroom.id}/students`" class="block px-4 py-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-sm text-gray-700 dark:text-gray-300">
              学生管理
            </router-link>
            <router-link :to="`/teacher/classes/${classroom.id}/quiz-progress`" class="block px-4 py-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-sm text-gray-700 dark:text-gray-300">
              测评进度
            </router-link>
            <router-link :to="`/teacher/classes/${classroom.id}/appeals`" class="block px-4 py-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-sm text-gray-700 dark:text-gray-300">
              申诉管理
            </router-link>
            <router-link :to="`/teacher/classes/${classroom.id}/history`" class="block px-4 py-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-sm text-gray-700 dark:text-gray-300">
              座位历史
            </router-link>
          </div>
        </div>
        <div class="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700">
          <h3 class="font-semibold text-gray-900 dark:text-white mb-3">班级信息</h3>
          <dl class="space-y-2 text-sm">
            <div class="flex justify-between">
              <dt class="text-gray-500 dark:text-gray-400">邀请码</dt>
              <dd class="font-mono text-gray-900 dark:text-white">{{ classroom.inviteCode }}</dd>
            </div>
            <div class="flex justify-between">
              <dt class="text-gray-500 dark:text-gray-400">教室布局</dt>
              <dd class="text-gray-900 dark:text-white">{{ classroom.seatConfig.rows }}排 × {{ classroom.seatConfig.cols }}列</dd>
            </div>
            <div class="flex justify-between">
              <dt class="text-gray-500 dark:text-gray-400">创建时间</dt>
              <dd class="text-gray-900 dark:text-white">{{ formatDate(classroom.createdAt) }}</dd>
            </div>
          </dl>
        </div>
      </div>

      <div v-if="showInviteModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click.self="showInviteModal = false">
        <div class="bg-white rounded-xl p-6 w-96">
          <h3 class="text-lg font-semibold mb-4">邀请学生加入</h3>
          <p class="text-sm text-gray-500 mb-4">分享邀请码给学生，或直接发送链接</p>
          <div v-if="inviteInfo" class="bg-gray-50 p-4 rounded-lg text-center">
            <p class="text-3xl font-mono font-bold text-primary-600 tracking-widest">{{ inviteInfo.inviteCode }}</p>
            <p class="text-xs text-gray-400 mt-2">有效期至 {{ formatDate(inviteInfo.expiresAt) }}</p>
          </div>
          <div class="flex gap-2 mt-4">
            <button @click="generateInvite" :disabled="inviteLoading" class="flex-1 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm">
              {{ inviteLoading ? '生成中...' : inviteInfo ? '重新生成' : '生成邀请码' }}
            </button>
            <button @click="showInviteModal = false" class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm">
              关闭
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useClassroomStore } from '@/stores/classroom';

const route = useRoute();
const classroomStore = useClassroomStore();
const loading = ref(true);
const showInviteModal = ref(false);
const inviteLoading = ref(false);
const inviteInfo = ref<{ inviteCode: string; inviteLink: string; expiresAt: string } | null>(null);
const quizCompleted = ref(0);

const classroom = classroomStore.currentClassroom;

onMounted(async () => {
  try {
    await classroomStore.fetchClassroom(route.params.id as string);
  } finally {
    loading.value = false;
  }
});

async function generateInvite() {
  inviteLoading.value = true;
  try {
    inviteInfo.value = await classroomStore.generateInvite(route.params.id as string, 30);
  } finally {
    inviteLoading.value = false;
  }
}

function statusLabel(status: string) {
  const map: Record<string, string> = {
    setup: '设置中', quiz_open: '测评中', quiz_closed: '测评结束',
    seating_generated: '已排座', published: '已发布', archived: '已归档',
  };
  return map[status] || status;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('zh-CN');
}
</script>

<template>
  <div class="space-y-6">
    <!-- MBTI -->
    <div v-if="profile.mbti" class="bg-white p-5 rounded-xl border border-gray-200">
      <h3 class="font-semibold text-gray-900 mb-3">MBTI 性格类型</h3>
      <div class="flex items-center gap-4">
        <span class="text-3xl font-bold text-primary-600">{{ profile.mbti.type }}</span>
      </div>
      <div class="mt-4 space-y-2">
        <div v-for="(dim, key) in mbtiDimensions" :key="key" class="flex items-center gap-3">
          <span class="w-12 text-xs text-gray-500">{{ dim.label }}</span>
          <div class="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden relative">
            <div class="absolute inset-0 flex">
              <div class="w-1/2 bg-blue-400 rounded-l-full" />
              <div class="w-1/2 bg-orange-400 rounded-r-full" />
            </div>
            <div
              class="absolute top-0 w-3 h-3 bg-white border-2 border-gray-700 rounded-full transform -translate-x-1/2"
              :style="{ left: `${dim.percent}%` }"
            />
          </div>
          <span class="w-16 text-xs text-gray-500 text-right">{{ dim.left }} / {{ dim.right }}</span>
        </div>
      </div>
    </div>

    <!-- Learning Style -->
    <div v-if="profile.learningStyle" class="bg-white p-5 rounded-xl border border-gray-200">
      <h3 class="font-semibold text-gray-900 mb-3">学习风格</h3>
      <span class="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
        {{ learningStyleLabel }}
      </span>
    </div>

    <!-- Social Type -->
    <div v-if="profile.socialType" class="bg-white p-5 rounded-xl border border-gray-200">
      <h3 class="font-semibold text-gray-900 mb-3">社交类型</h3>
      <span class="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
        {{ socialTypeLabel }}
      </span>
    </div>

    <!-- Interests -->
    <div v-if="profile.interests?.length" class="bg-white p-5 rounded-xl border border-gray-200">
      <h3 class="font-semibold text-gray-900 mb-3">兴趣标签</h3>
      <div class="flex flex-wrap gap-2">
        <span
          v-for="interest in profile.interests"
          :key="interest"
          class="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
        >
          {{ interest }}
        </span>
      </div>
    </div>

    <!-- Self Assessment (radar-like) -->
    <div v-if="profile.selfAssessment" class="bg-white p-5 rounded-xl border border-gray-200">
      <h3 class="font-semibold text-gray-900 mb-3">自我评价</h3>
      <div class="space-y-3">
        <div v-for="item in selfAssessmentItems" :key="item.key">
          <div class="flex justify-between text-sm mb-1">
            <span class="text-gray-600">{{ item.label }}</span>
            <span class="font-medium text-gray-900">{{ item.value }}</span>
          </div>
          <div class="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div class="h-full bg-primary-500 rounded-full" :style="{ width: `${item.value}%` }" />
          </div>
        </div>
      </div>
    </div>

    <!-- Composite Score (teacher only) -->
    <div v-if="!isOwnReport && profile.compositeScore !== null" class="bg-white p-5 rounded-xl border border-gray-200">
      <h3 class="font-semibold text-gray-900 mb-3">综合评分</h3>
      <div class="flex items-baseline gap-2">
        <span class="text-4xl font-bold text-primary-600">{{ profile.compositeScore }}</span>
        <span class="text-gray-500">/ 100</span>
      </div>
    </div>

    <!-- Profile Completeness -->
    <div class="bg-white p-5 rounded-xl border border-gray-200">
      <h3 class="font-semibold text-gray-900 mb-3">画像完整度</h3>
      <div class="flex items-center gap-3">
        <div class="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
          <div
            class="h-full rounded-full transition-all"
            :class="profile.profileCompleteness >= 80 ? 'bg-green-500' : profile.profileCompleteness >= 50 ? 'bg-yellow-500' : 'bg-red-500'"
            :style="{ width: `${profile.profileCompleteness}%` }"
          />
        </div>
        <span class="text-sm font-medium text-gray-700">{{ profile.profileCompleteness }}%</span>
      </div>
    </div>

    <!-- Teacher Notes (teacher only) -->
    <div v-if="!isOwnReport" class="bg-white p-5 rounded-xl border border-gray-200">
      <h3 class="font-semibold text-gray-900 mb-3">教师备注</h3>
      <textarea
        v-model="teacherNotes"
        placeholder="添加关于该学生的备注..."
        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
        rows="3"
      />
    </div>

    <!-- Actions -->
    <div v-if="isOwnReport" class="flex justify-center">
      <button class="px-6 py-2 border border-primary-300 text-primary-600 rounded-lg hover:bg-primary-50">
        修改测评
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import type { StudentProfile } from '@seatwise/shared';

const props = defineProps<{
  profile: StudentProfile;
  isOwnReport: boolean;
}>();

const teacherNotes = ref(props.profile.teacherNotes || '');

const mbtiDimensions = computed(() => {
  if (!props.profile.mbti) return [];
  const mbti = props.profile.mbti;
  return [
    { label: 'E/I', left: 'E', right: 'I', percent: 50 + (mbti.E_I / 100) * 50 },
    { label: 'S/N', left: 'S', right: 'N', percent: 50 + (mbti.S_N / 100) * 50 },
    { label: 'T/F', left: 'T', right: 'F', percent: 50 + (mbti.T_F / 100) * 50 },
    { label: 'J/P', left: 'J', right: 'P', percent: 50 + (mbti.J_P / 100) * 50 },
  ];
});

const learningStyleLabel = computed(() => {
  const map: Record<string, string> = {
    visual: '视觉型', auditory: '听觉型', kinesthetic: '动觉型',
    read_write: '读写型', mixed: '混合型',
  };
  return map[props.profile.learningStyle || 'mixed'] || '未知';
});

const socialTypeLabel = computed(() => {
  const map: Record<string, string> = {
    cooperative: '合作型', independent: '独立型', mixed: '混合型',
  };
  return map[props.profile.socialType || 'mixed'] || '未知';
});

const selfAssessmentItems = computed(() => {
  const sa = props.profile.selfAssessment;
  if (!sa) return [];
  return [
    { key: 'academic', label: '学业水平', value: sa.academicLevel },
    { key: 'motivation', label: '学习动力', value: sa.motivation },
    { key: 'social', label: '社交能力', value: sa.socialAbility },
  ];
});
</script>

<template>
  <div class="max-w-2xl mx-auto">
    <!-- Progress -->
    <div class="mb-6">
      <ProgressBar :answered="answeredCount" :total="questions.length" :percent="progressPercent" />
    </div>

    <!-- Question -->
    <div v-if="currentQuestion" class="bg-white p-6 rounded-xl border border-gray-200">
      <div class="text-xs text-gray-400 mb-4">
        第 {{ currentIndex + 1 }} / {{ questions.length }} 题
        <span v-if="currentQuestion.required" class="text-red-400 ml-1">*必答</span>
      </div>

      <component
        :is="getComponent(currentQuestion.type)"
        :question="currentQuestion"
        :modelValue="answers[currentQuestion.id]"
        @update:modelValue="handleAnswer(currentQuestion.id, $event)"
        :classmates="classmates"
      />
    </div>

    <!-- Navigation -->
    <div class="flex justify-between mt-6">
      <button
        @click="prevQuestion"
        :disabled="currentIndex === 0"
        class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        上一题
      </button>

      <div class="flex gap-2">
        <button
          v-if="currentIndex < questions.length - 1"
          @click="nextQuestion"
          class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          下一题
        </button>
        <button
          v-else
          @click="handleSubmit"
          :disabled="!canSubmit || submitting"
          class="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
        >
          {{ submitting ? '提交中...' : '提交测评' }}
        </button>
      </div>
    </div>

    <!-- Question indicators -->
    <div class="flex flex-wrap gap-1.5 mt-6 justify-center">
      <button
        v-for="(q, idx) in questions"
        :key="q.id"
        @click="goToQuestion(idx)"
        class="w-8 h-8 rounded-full text-xs font-medium transition-all"
        :class="idx === currentIndex
          ? 'bg-primary-500 text-white'
          : answers[q.id] !== undefined
            ? 'bg-primary-100 text-primary-700'
            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'"
      >
        {{ idx + 1 }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import type { QuizQuestion } from '@seatwise/shared';
import ProgressBar from './ProgressBar.vue';
import QuestionSingle from './QuestionSingle.vue';
import QuestionMultiple from './QuestionMultiple.vue';
import QuestionLikert from './QuestionLikert.vue';
import QuestionTagSelect from './QuestionTagSelect.vue';
import QuestionSearch from './QuestionSearch.vue';
import QuestionSlider from './QuestionSlider.vue';

const props = defineProps<{
  questions: QuizQuestion[];
  initialAnswers?: Record<string, unknown>;
  classId: string;
  classmates?: { id: string; name: string }[];
}>();

const emit = defineEmits<{
  submit: [answers: Record<string, unknown>];
  progress: [answered: number, total: number];
  save: [answers: Record<string, unknown>];
}>();

const currentIndex = ref(0);
const answers = ref<Record<string, unknown>>({});
const submitting = ref(false);

const currentQuestion = computed(() => props.questions[currentIndex.value]);
const answeredCount = computed(() =>
  Object.keys(answers.value).filter(k => answers.value[k] !== undefined && answers.value[k] !== '').length
);
const progressPercent = computed(() =>
  props.questions.length > 0 ? Math.round((answeredCount.value / props.questions.length) * 100) : 0
);
const canSubmit = computed(() => {
  const required = props.questions.filter(q => q.required);
  return required.every(q => answers.value[q.id] !== undefined && answers.value[q.id] !== '');
});

function getComponent(type: string) {
  const map: Record<string, any> = {
    single_choice: QuestionSingle,
    multiple_choice: QuestionMultiple,
    likert: QuestionLikert,
    tag_select: QuestionTagSelect,
    search_select: QuestionSearch,
    slider: QuestionSlider,
    text: QuestionSingle,
  };
  return map[type] || QuestionSingle;
}

function handleAnswer(questionId: string, value: unknown) {
  answers.value[questionId] = value;
}

function nextQuestion() {
  if (currentIndex.value < props.questions.length - 1) {
    currentIndex.value++;
  }
}

function prevQuestion() {
  if (currentIndex.value > 0) {
    currentIndex.value--;
  }
}

function goToQuestion(index: number) {
  currentIndex.value = index;
}

async function handleSubmit() {
  if (!canSubmit.value) return;
  submitting.value = true;
  try {
    emit('submit', { ...answers.value });
  } finally {
    submitting.value = false;
  }
}

// Auto-save
let saveTimer: ReturnType<typeof setTimeout>;
watch(answers, () => {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    emit('save', { ...answers.value });
    localStorage.setItem(`quiz_${props.classId}`, JSON.stringify(answers.value));
  }, 3000);
}, { deep: true });

// Load saved progress
onMounted(() => {
  if (props.initialAnswers) {
    answers.value = { ...props.initialAnswers };
  } else {
    try {
      const saved = localStorage.getItem(`quiz_${props.classId}`);
      if (saved) {
        answers.value = JSON.parse(saved);
      }
    } catch {}
  }
  emit('progress', answeredCount.value, props.questions.length);
});

// Emit progress on answer change
watch(answeredCount, (count) => {
  emit('progress', count, props.questions.length);
});
</script>

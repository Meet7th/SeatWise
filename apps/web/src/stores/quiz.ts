import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { QuizQuestion, QuizSession, QuizProgressItem, StudentProfile } from '@seatwise/shared';
import { quizApi } from '@/api/quiz';

const STORAGE_PREFIX = 'seatwise_quiz_';

export const useQuizStore = defineStore('quiz', () => {
  const questions = ref<QuizQuestion[]>([]);
  const session = ref<QuizSession | null>(null);
  const answers = ref<Record<string, unknown>>({});
  const currentIndex = ref(0);
  const isLoading = ref(false);

  async function fetchQuestions(classId: string) {
    isLoading.value = true;
    try {
      const { data: res } = await quizApi.getQuestions(classId);
      questions.value = res.data;
    } finally {
      isLoading.value = false;
    }
  }

  async function submitQuiz(classId: string): Promise<StudentProfile> {
    isLoading.value = true;
    try {
      const { data: res } = await quizApi.submit({ classId, answers: answers.value });
      clearProgress(classId);
      return res.data.profile;
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchProgress(classId: string): Promise<QuizProgressItem[]> {
    const { data: res } = await quizApi.getProgress(classId);
    return res.data.students;
  }

  function saveProgress(classId: string) {
    localStorage.setItem(`${STORAGE_PREFIX}${classId}`, JSON.stringify({
      answers: answers.value,
      currentIndex: currentIndex.value,
    }));
  }

  function loadProgress(classId: string) {
    try {
      const stored = localStorage.getItem(`${STORAGE_PREFIX}${classId}`);
      if (stored) {
        const data = JSON.parse(stored);
        answers.value = data.answers || {};
        currentIndex.value = data.currentIndex || 0;
      }
    } catch {
      localStorage.removeItem(`${STORAGE_PREFIX}${classId}`);
    }
  }

  function clearProgress(classId: string) {
    answers.value = {};
    currentIndex.value = 0;
    localStorage.removeItem(`${STORAGE_PREFIX}${classId}`);
  }

  function setAnswer(questionId: string, answer: unknown) {
    answers.value[questionId] = answer;
  }

  function nextQuestion() {
    if (currentIndex.value < questions.value.length - 1) {
      currentIndex.value++;
    }
  }

  function prevQuestion() {
    if (currentIndex.value > 0) {
      currentIndex.value--;
    }
  }

  function goToQuestion(index: number) {
    if (index >= 0 && index < questions.value.length) {
      currentIndex.value = index;
    }
  }

  return {
    questions,
    session,
    answers,
    currentIndex,
    isLoading,
    fetchQuestions,
    submitQuiz,
    fetchProgress,
    saveProgress,
    loadProgress,
    clearProgress,
    setAnswer,
    nextQuestion,
    prevQuestion,
    goToQuestion,
  };
});

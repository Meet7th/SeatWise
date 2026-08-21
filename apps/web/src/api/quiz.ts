import client from './client';
import type { ApiResponse, QuizQuestion, QuizSession, QuizProgressItem, StudentProfile, SubmitQuizRequest } from '@seatwise/shared';

export const quizApi = {
  getQuestions(classId: string) {
    return client.get<ApiResponse<QuizQuestion[]>>(`/quiz/questions/${classId}`);
  },

  submit(data: SubmitQuizRequest) {
    return client.post<ApiResponse<{ sessionId: string; profile: StudentProfile }>>('/quiz/submit', data);
  },

  getProgress(classId: string) {
    return client.get<ApiResponse<{ total: number; completed: number; inProgress: number; notStarted: number; completionRate: number; students: QuizProgressItem[] }>>(`/quiz/progress/${classId}`);
  },

  getSession(classId: string) {
    return client.get<ApiResponse<QuizSession>>(`/quiz/session/${classId}`);
  },
};

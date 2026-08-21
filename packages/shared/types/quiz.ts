import type { StudentProfile } from './student';

export type QuestionType = 'single_choice' | 'multiple_choice' | 'likert' | 'tag_select' | 'search_select' | 'slider' | 'text';
export type QuestionDimension = 'mbti' | 'learning_style' | 'social' | 'interest' | 'special_needs' | 'social_relation' | 'self_assessment';
export type QuizStatus = 'not_started' | 'in_progress' | 'completed';

export interface QuizQuestion {
  id: string;
  dimension: QuestionDimension;
  type: QuestionType;
  question: string;
  description: string | null;
  options: QuizOption[] | null;
  tags: string[] | null;
  min: number | null;
  max: number | null;
  required: boolean;
  order: number;
}

export interface QuizOption {
  id: string;
  text: string;
  value: string;
  weight: Record<string, number>;
}

export interface QuizSession {
  id: string;
  studentId: string;
  classId: string;
  status: QuizStatus;
  answers: Record<string, unknown>;
  startedAt: string | null;
  completedAt: string | null;
  result: StudentProfile | null;
}

export interface SubmitQuizRequest {
  classId: string;
  answers: Record<string, unknown>;
}

export interface QuizProgressItem {
  studentId: string;
  studentName: string;
  status: QuizStatus;
  completedAt: string | null;
  profileCompleteness: number;
}

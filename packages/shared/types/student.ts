export type Gender = 'male' | 'female';
export type Personality = '外向' | '内向' | '中性';
export type LearningStyle = 'visual' | 'auditory' | 'kinesthetic' | 'read_write' | 'mixed';
export type SocialType = 'independent' | 'cooperative' | 'mixed';

export interface StudentProfile {
  studentId: string;
  classId: string;
  name: string;

  mbti: MbtiResult | null;
  learningStyle: LearningStyle | null;
  socialType: SocialType | null;
  interests: string[];
  specialNeeds: SpecialNeeds;
  socialPreferences: SocialPreferences;
  selfAssessment: SelfAssessment | null;

  gender: Gender;
  lunch: boolean;
  scores: Record<string, number>;
  personality: Personality | null;
  position: string | null;
  teacherNotes: string;
  pinned: boolean;

  compositeScore: number | null;
  avgScore: number | null;
  profileCompleteness: number;

  createdAt: string;
  updatedAt: string;
}

export interface MbtiResult {
  type: string;
  E_I: number;
  S_N: number;
  T_F: number;
  J_P: number;
}

export interface SpecialNeeds {
  vision: string | null;
  hearing: string | null;
  physical: string | null;
  allergy: string | null;
  other: string | null;
}

export interface SocialPreferences {
  wantNear: string[];
  avoidNear: string[];
}

export interface SelfAssessment {
  academicLevel: number;
  motivation: number;
  socialAbility: number;
}

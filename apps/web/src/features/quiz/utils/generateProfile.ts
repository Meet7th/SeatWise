import type { StudentProfile, MbtiResult, LearningStyle, SocialType, SpecialNeeds, SocialPreferences, SelfAssessment } from '@seatwise/shared';
import { QUESTION_BANK } from '../data/questionBank';
import { calculateMbti } from './calculateMbti';
import { calculateLearningStyle } from './calculateLearningStyle';
import { calculateSocialType } from './calculateSocialType';
import { calculateProfileCompleteness } from './calculateProfileCompleteness';

export function generateProfile(
  studentId: string,
  classId: string,
  name: string,
  answers: Record<string, unknown>,
  gender: 'male' | 'female' = 'male'
): Omit<StudentProfile, 'createdAt' | 'updatedAt'> {
  const mbti = calculateMbti(answers);
  const learningStyle = calculateLearningStyle(answers);
  const socialType = calculateSocialType(answers);

  // Interest tags
  const interestQuestion = QUESTION_BANK.find(q => q.id === 'interest-1');
  const interests = (answers['interest-1'] as string[]) || [];

  // Special needs
  const snAnswer = answers['sn-1'] as string || '';
  const specialNeeds: SpecialNeeds = {
    vision: snAnswer.includes('视') ? snAnswer : null,
    hearing: snAnswer.includes('听') ? snAnswer : null,
    physical: snAnswer.includes('身') || snAnswer.includes('腿') || snAnswer.includes('手') ? snAnswer : null,
    allergy: snAnswer.includes('过敏') ? snAnswer : null,
    other: snAnswer && !snAnswer.includes('视') && !snAnswer.includes('听') && !snAnswer.includes('身') && !snAnswer.includes('过敏') ? snAnswer : null,
  };

  // Social preferences
  const srAnswer = answers['sr-1'] as { wantNear?: string[]; avoidNear?: string[] } || {};
  const socialPreferences: SocialPreferences = {
    wantNear: srAnswer.wantNear || [],
    avoidNear: srAnswer.avoidNear || [],
  };

  // Self assessment
  const selfAssessment: SelfAssessment = {
    academicLevel: (answers['sa-1'] as number) || 50,
    motivation: (answers['sa-2'] as number) || 50,
    socialAbility: (answers['sa-3'] as number) || 50,
  };

  // Calculate composite score
  const compositeScore = calculateCompositeScore({
    selfAssessment,
    mbti,
    socialType,
  });

  // Profile completeness
  const profile = {
    studentId,
    classId,
    name,
    mbti,
    learningStyle,
    socialType,
    interests,
    specialNeeds,
    socialPreferences,
    selfAssessment,
    gender,
    lunch: false,
    scores: {},
    personality: null,
    position: null,
    teacherNotes: '',
    pinned: false,
    compositeScore,
    avgScore: null,
    profileCompleteness: 0,
  };

  profile.profileCompleteness = calculateProfileCompleteness(profile);

  return profile;
}

function calculateCompositeScore(data: {
  selfAssessment: SelfAssessment;
  mbti: MbtiResult;
  socialType: SocialType;
}): number {
  const { selfAssessment } = data;

  // Weighted average of self-assessment dimensions
  const score = (
    selfAssessment.academicLevel * 0.5 +
    selfAssessment.motivation * 0.3 +
    selfAssessment.socialAbility * 0.2
  );

  return Math.round(Math.min(100, Math.max(0, score)));
}

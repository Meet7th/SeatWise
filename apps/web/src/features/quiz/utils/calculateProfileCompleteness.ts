import type { StudentProfile } from '@seatwise/shared';

export function calculateProfileCompleteness(profile: Partial<StudentProfile>): number {
  let filled = 0;
  let total = 10;

  if (profile.mbti) filled++;
  if (profile.learningStyle) filled++;
  if (profile.socialType) filled++;
  if (profile.interests && profile.interests.length > 0) filled++;
  if (profile.selfAssessment) filled++;
  if (profile.specialNeeds && (profile.specialNeeds.vision || profile.specialNeeds.hearing || profile.specialNeeds.physical)) filled++;
  if (profile.socialPreferences && (profile.socialPreferences.wantNear.length > 0 || profile.socialPreferences.avoidNear.length > 0)) filled++;
  if (profile.gender) filled++;
  if (profile.scores && Object.keys(profile.scores).length > 0) filled++;
  if (profile.personality) filled++;

  return Math.round((filled / total) * 100);
}

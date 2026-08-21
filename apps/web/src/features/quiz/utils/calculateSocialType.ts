import type { SocialType } from '@seatwise/shared';
import { QUESTION_BANK } from '../data/questionBank';

export function calculateSocialType(answers: Record<string, unknown>): SocialType {
  let socialScore = 0;
  let totalQuestions = 0;

  const spQuestions = QUESTION_BANK.filter(q => q.dimension === 'social');

  for (const question of spQuestions) {
    const answer = answers[question.id];
    if (!answer || !question.options) continue;

    const option = question.options.find(o => o.id === answer);
    if (!option) continue;

    socialScore += option.weight.social || 0;
    totalQuestions += 3; // max weight per question
  }

  if (totalQuestions === 0) return 'mixed';

  const ratio = socialScore / totalQuestions;

  if (ratio >= 0.6) return 'cooperative';
  if (ratio <= 0.3) return 'independent';
  return 'mixed';
}

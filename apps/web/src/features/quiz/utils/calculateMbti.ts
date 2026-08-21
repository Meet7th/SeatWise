import type { MbtiResult } from '@seatwise/shared';
import { QUESTION_BANK } from '../data/questionBank';

export function calculateMbti(answers: Record<string, unknown>): MbtiResult {
  const dimensions = { E_I: 0, S_N: 0, T_F: 0, J_P: 0 };

  for (const [questionId, answer] of Object.entries(answers)) {
    const question = QUESTION_BANK.find(q => q.id === questionId);
    if (!question || question.dimension !== 'mbti' || question.type !== 'single_choice') continue;

    const option = question.options?.find(o => o.id === answer);
    if (!option) continue;

    for (const [dim, weight] of Object.entries(option.weight)) {
      if (dim in dimensions) {
        dimensions[dim as keyof typeof dimensions] += weight;
      }
    }
  }

  const type = [
    dimensions.E_I >= 0 ? 'E' : 'I',
    dimensions.S_N >= 0 ? 'S' : 'N',
    dimensions.T_F >= 0 ? 'T' : 'F',
    dimensions.J_P >= 0 ? 'J' : 'P',
  ].join('');

  return {
    type,
    E_I: dimensions.E_I,
    S_N: dimensions.S_N,
    T_F: dimensions.T_F,
    J_P: dimensions.J_P,
  };
}

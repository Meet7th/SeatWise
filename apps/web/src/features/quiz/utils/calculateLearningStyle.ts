import type { LearningStyle } from '@seatwise/shared';
import { QUESTION_BANK } from '../data/questionBank';

export function calculateLearningStyle(answers: Record<string, unknown>): LearningStyle {
  const scores: Record<LearningStyle, number> = {
    visual: 0,
    auditory: 0,
    kinesthetic: 0,
    read_write: 0,
    mixed: 0,
  };

  const lsQuestions = QUESTION_BANK.filter(q => q.dimension === 'learning_style');

  for (const question of lsQuestions) {
    const answer = answers[question.id];
    if (typeof answer !== 'number') continue;

    // answer is 1-5 likert scale
    // Map questions to styles based on question index
    const idx = lsQuestions.indexOf(question);
    switch (idx) {
      case 0: scores.visual += answer; break;      // 图表/思维导图
      case 1: scores.auditory += answer; break;    // 听课
      case 2: scores.kinesthetic += answer; break;  // 动手实践
      case 3: scores.read_write += answer; break;   // 阅读
      case 4: scores.visual += answer * 0.5; break; // 画图
      case 5: scores.auditory += answer * 0.5; break; // 讨论
      case 6: scores.kinesthetic += answer * 0.5; break; // 刷题
      case 7: scores.read_write += answer * 0.5; break;  // 整理笔记
    }
  }

  const maxStyle = Object.entries(scores).reduce((a, b) =>
    b[1] > a[1] ? b : a
  )[0] as LearningStyle;

  const maxScore = scores[maxStyle];
  const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);

  if (maxScore / totalScore < 0.3) return 'mixed';
  return maxStyle;
}

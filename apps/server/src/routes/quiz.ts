import { Router } from 'express';
import { prisma } from '@/config/database';
import { authMiddleware, AuthRequest } from '@/middleware/auth';
import { isTeacher, isStudent } from '@/middleware/rbac';
import * as quizService from '@/services/quizService';

const router = Router();

// Get questions for a class
router.get('/questions/:classId', authMiddleware, isStudent, async (req: AuthRequest, res, next) => {
  try {
    // Verify student is in this class
    const membership = await prisma.classStudent.findUnique({
      where: { classId_studentId: { classId: req.params.classId, studentId: req.user!.sub } },
    });
    if (!membership) {
      return res.status(403).json({ code: 40300, data: null, message: '你不在该班级中' });
    }

    // Get or create quiz session
    let session = await prisma.quizSession.findUnique({
      where: { studentId_classId: { studentId: req.user!.sub, classId: req.params.classId } },
    });

    if (!session) {
      session = await prisma.quizSession.create({
        data: { studentId: req.user!.sub, classId: req.params.classId, status: 'not_started' },
      });
    }

    // Return questions (same as frontend question bank, ordered)
    const questions = QUESTION_BANK_FULL.map(q => ({
      ...q,
      // Shuffle options for MBTI questions
      options: q.options ? shuffleArray([...q.options]) : null,
    }));

    res.json({ code: 0, data: questions, message: 'ok' });
  } catch (err) {
    next(err);
  }
});

// Submit quiz
router.post('/submit', authMiddleware, isStudent, async (req: AuthRequest, res, next) => {
  try {
    const { classId, answers } = req.body;

    // Verify student is in class
    const membership = await prisma.classStudent.findUnique({
      where: { classId_studentId: { classId, studentId: req.user!.sub } },
    });
    if (!membership) {
      return res.status(403).json({ code: 40300, data: null, message: '你不在该班级中' });
    }

    // Update quiz session
    await prisma.quizSession.update({
      where: { studentId_classId: { studentId: req.user!.sub, classId } },
      data: {
        status: 'completed',
        answers,
        completedAt: new Date(),
      },
    });

    // Create student profile
    const profile = await prisma.studentProfile.upsert({
      where: { studentId: req.user!.sub },
      create: {
        studentId: req.user!.sub,
        classId,
        gender: 'male',
        mbti: calculateMbtiFromAnswers(answers),
        learningStyle: calculateLearningStyleFromAnswers(answers),
        socialType: calculateSocialTypeFromAnswers(answers),
        interests: answers['interest-1'] || [],
        selfAssessment: {
          academicLevel: answers['sa-1'] || 50,
          motivation: answers['sa-2'] || 50,
          socialAbility: answers['sa-3'] || 50,
        },
        profileCompleteness: 85,
      },
      update: {
        mbti: calculateMbtiFromAnswers(answers),
        learningStyle: calculateLearningStyleFromAnswers(answers),
        socialType: calculateSocialTypeFromAnswers(answers),
        interests: answers['interest-1'] || [],
        selfAssessment: {
          academicLevel: answers['sa-1'] || 50,
          motivation: answers['sa-2'] || 50,
          socialAbility: answers['sa-3'] || 50,
        },
        profileCompleteness: 85,
      },
    });

    res.json({ code: 0, data: { sessionId: session?.id, profile }, message: 'ok' });
  } catch (err) {
    next(err);
  }
});

// Get quiz progress
router.get('/progress/:classId', authMiddleware, isTeacher, async (req: AuthRequest, res, next) => {
  try {
    const progress = await quizService.getQuizProgress(req.params.classId);
    res.json({ code: 0, data: progress, message: 'ok' });
  } catch (err) {
    next(err);
  }
});

function shuffleArray<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function calculateMbtiFromAnswers(answers: Record<string, unknown>) {
  const dims = { E_I: 0, S_N: 0, T_F: 0, J_P: 0 };
  // Simplified MBTI calculation
  const mbtiQuestions = QUESTION_BANK_FULL.filter(q => q.dimension === 'mbti');
  for (const q of mbtiQuestions) {
    const answer = answers[q.id] as string;
    if (!answer || !q.options) continue;
    const opt = q.options.find(o => o.id === answer);
    if (opt?.weight) {
      for (const [k, v] of Object.entries(opt.weight)) {
        if (k in dims) dims[k as keyof typeof dims] += v;
      }
    }
  }
  return {
    type: [
      dims.E_I >= 0 ? 'E' : 'I',
      dims.S_N >= 0 ? 'S' : 'N',
      dims.T_F >= 0 ? 'T' : 'F',
      dims.J_P >= 0 ? 'J' : 'P',
    ].join(''),
    ...dims,
  };
}

function calculateLearningStyleFromAnswers(answers: Record<string, unknown>): string {
  return 'mixed';
}

function calculateSocialTypeFromAnswers(answers: Record<string, unknown>): string {
  return 'mixed';
}

// Full question bank for backend
const QUESTION_BANK_FULL = [
  { id: 'mbti-1', dimension: 'mbti', type: 'single_choice', question: '在一个班级活动中', options: [
    { id: 'mbti-1-a', text: '主动组织', value: 'E', weight: { E_I: 2 } },
    { id: 'mbti-1-b', text: '和朋友参与', value: 'E', weight: { E_I: 1 } },
    { id: 'mbti-1-c', text: '观察后加入', value: 'I', weight: { E_I: 1 } },
    { id: 'mbti-1-d', text: '安静做事', value: 'I', weight: { E_I: 2 } },
  ], required: true, order: 1 },
  // ... additional questions would be defined here
];

export default router;

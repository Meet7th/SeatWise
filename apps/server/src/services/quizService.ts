import { prisma } from '@/config/database';

const QUESTION_BANK = [
  { id: 'mbti-1', dimension: 'mbti', order: 1 },
  { id: 'mbti-2', dimension: 'mbti', order: 2 },
  { id: 'mbti-3', dimension: 'mbti', order: 3 },
  { id: 'mbti-4', dimension: 'mbti', order: 4 },
  { id: 'mbti-5', dimension: 'mbti', order: 5 },
  { id: 'mbti-6', dimension: 'mbti', order: 6 },
  { id: 'mbti-7', dimension: 'mbti', order: 7 },
  { id: 'mbti-8', dimension: 'mbti', order: 8 },
  { id: 'mbti-9', dimension: 'mbti', order: 9 },
  { id: 'mbti-10', dimension: 'mbti', order: 10 },
  { id: 'mbti-11', dimension: 'mbti', order: 11 },
  { id: 'mbti-12', dimension: 'mbti', order: 12 },
  { id: 'mbti-13', dimension: 'mbti', order: 13 },
  { id: 'mbti-14', dimension: 'mbti', order: 14 },
  { id: 'mbti-15', dimension: 'mbti', order: 15 },
  { id: 'mbti-16', dimension: 'mbti', order: 16 },
  { id: 'ls-1', dimension: 'learning_style', order: 17 },
  { id: 'ls-2', dimension: 'learning_style', order: 18 },
  { id: 'ls-3', dimension: 'learning_style', order: 19 },
  { id: 'ls-4', dimension: 'learning_style', order: 20 },
  { id: 'ls-5', dimension: 'learning_style', order: 21 },
  { id: 'ls-6', dimension: 'learning_style', order: 22 },
  { id: 'ls-7', dimension: 'learning_style', order: 23 },
  { id: 'ls-8', dimension: 'learning_style', order: 24 },
  { id: 'sp-1', dimension: 'social', order: 25 },
  { id: 'sp-2', dimension: 'social', order: 26 },
  { id: 'sp-3', dimension: 'social', order: 27 },
  { id: 'sp-4', dimension: 'social', order: 28 },
  { id: 'sp-5', dimension: 'social', order: 29 },
  { id: 'interest-1', dimension: 'interest', order: 30 },
  { id: 'sn-1', dimension: 'special_needs', order: 31 },
  { id: 'sr-1', dimension: 'social_relation', order: 32 },
  { id: 'sa-1', dimension: 'self_assessment', order: 33 },
  { id: 'sa-2', dimension: 'self_assessment', order: 34 },
  { id: 'sa-3', dimension: 'self_assessment', order: 35 },
];

export async function getQuizProgress(classId: string) {
  const classroom = await prisma.classroom.findUnique({
    where: { id: classId },
    include: { students: { include: { student: { include: { profile: true } } } } },
  });

  if (!classroom) throw Object.assign(new Error('班级不存在'), { code: 40400 });

  const students = classroom.students.map(cs => {
    const session = cs.student.quizSessions?.find(s => s.classId === classId);
    return {
      studentId: cs.student.id,
      studentName: cs.student.name,
      status: session?.status || 'not_started',
      completedAt: session?.completedAt?.toISOString() || null,
      profileCompleteness: cs.student.profile?.profileCompleteness ? Number(cs.student.profile.profileCompleteness) : 0,
    };
  });

  const completed = students.filter(s => s.status === 'completed').length;
  const inProgress = students.filter(s => s.status === 'in_progress').length;
  const notStarted = students.filter(s => s.status === 'not_started').length;

  return {
    total: students.length,
    completed,
    inProgress,
    notStarted,
    completionRate: students.length > 0 ? Math.round((completed / students.length) * 1000) / 10 : 0,
    students,
  };
}

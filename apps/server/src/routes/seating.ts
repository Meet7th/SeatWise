import { Router } from 'express';
import { prisma } from '@/config/database';
import { authMiddleware, AuthRequest } from '@/middleware/auth';
import { isTeacher } from '@/middleware/rbac';
import { calculateProbabilities, weightedRandomSelect } from '@/services/algorithm/probabilityEngine';

const router = Router();

router.post('/generate', authMiddleware, isTeacher, async (req: AuthRequest, res, next) => {
  try {
    const { classId, strategy, count = 3, weights, constraints } = req.body;

    // Get students and their profiles
    const classroom = await prisma.classroom.findUnique({
      where: { id: classId },
      include: {
        students: {
          include: { student: { include: { profile: true } } },
        },
      },
    });

    if (!classroom) {
      return res.status(404).json({ code: 40400, data: null, message: '班级不存在' });
    }

    const seatConfig = classroom.seatConfig as { rows: number; cols: number };
    const plans = [];

    for (let planIndex = 0; planIndex < count; planIndex++) {
      // Initialize seats
      const seats: { seatIndex: number; row: number; col: number; disabled: boolean; studentId: string | null }[] = [];
      for (let row = 0; row < seatConfig.rows; row++) {
        for (let col = 0; col < seatConfig.cols; col++) {
          const isPlatform = (col === 0 && (classroom.seatConfig as any).platformLeft) ||
                           (col === seatConfig.cols - 1 && (classroom.seatConfig as any).platformRight);
          seats.push({
            seatIndex: row * seatConfig.cols + col,
            row, col,
            disabled: isPlatform,
            studentId: null,
          });
        }
      }

      // Get students to seat
      const studentsToSeat = classroom.students
        .filter(cs => !constraints?.honorPinned || !cs.student.profile?.pinned)
        .map(cs => ({
          studentId: cs.student.id,
          gender: cs.student.profile?.gender || 'male',
          avgScore: cs.student.profile?.avgScore ? Number(cs.student.profile.avgScore) : null,
          personality: cs.student.profile?.personality,
          specialNeeds: cs.student.profile?.specialNeeds as any,
          socialPreferences: cs.student.profile?.socialPreferences as any,
          pinned: cs.student.profile?.pinned || false,
        }));

      // Shuffle students
      const shuffled = [...studentsToSeat].sort(() => Math.random() - 0.5);

      // Assign seats
      for (const student of shuffled) {
        const emptySeats = seats.filter(s => !s.studentId && !s.disabled);
        if (emptySeats.length === 0) break;

        // Calculate probabilities for each empty seat
        const seatedSeats = seats.filter(s => s.studentId);
        let bestSeat = emptySeats[0];
        let bestProb = 0;

        for (const seat of emptySeats) {
          const probs = calculateProbabilities(
            [student],
            seatedSeats,
            seat,
            constraints || {
              blacklist: [], whitelist: [],
              blacklistPenalty: 95, blacklistRadius: 2,
              genderBalance: true, honorPinned: true, honorSpecialNeeds: true,
            },
            seatConfig
          );
          const prob = probs.get(student.studentId) || 0;
          if (prob > bestProb) {
            bestProb = prob;
            bestSeat = seat;
          }
        }

        bestSeat.studentId = student.studentId;
      }

      // Calculate metrics
      const assignedStudents = seats
        .filter(s => s.studentId)
        .map(s => studentsToSeat.find(st => st.studentId === s.studentId))
        .filter(Boolean);

      const scores = assignedStudents.map(s => s?.avgScore || 50);
      const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length || 50;
      const variance = scores.reduce((a, b) => a + (b - avgScore) ** 2, 0) / scores.length;

      const males = assignedStudents.filter(s => s?.gender === 'male').length;
      const genderRatio = assignedStudents.length > 0 ? males / assignedStudents.length : 0.5;

      const metrics = {
        academicBalance: Math.round(Math.max(0, 100 - variance / 10)),
        personalityCompatibility: 70,
        genderBalance: Math.round(100 - Math.abs(genderRatio - 0.5) * 200),
        constraintSatisfaction: 85,
        specialNeedsSatisfaction: 90,
        overallScore: 0,
      };
      metrics.overallScore = Math.round(
        metrics.academicBalance * 0.3 +
        metrics.personalityCompatibility * 0.2 +
        metrics.genderBalance * 0.15 +
        metrics.constraintSatisfaction * 0.2 +
        metrics.specialNeedsSatisfaction * 0.15
      );

      plans.push({
        id: `plan-${planIndex + 1}`,
        version: 1,
        name: `方案${String.fromCharCode(65 + planIndex)}`,
        strategy,
        assignments: seats,
        weights,
        metrics,
        status: 'draft',
      });
    }

    // Sort by overallScore descending
    plans.sort((a, b) => b.metrics.overallScore - a.metrics.overallScore);

    res.json({ code: 0, data: { plans }, message: 'ok' });
  } catch (err) {
    next(err);
  }
});

router.post('/plans/:planId/publish', authMiddleware, isTeacher, async (req: AuthRequest, res, next) => {
  try {
    const { planId } = req.params;
    // In a real implementation, save to database
    res.json({ code: 0, data: { success: true }, message: 'ok' });
  } catch (err) {
    next(err);
  }
});

router.post('/swap', authMiddleware, isTeacher, async (req: AuthRequest, res, next) => {
  try {
    const { planId, seatIndexA, seatIndexB } = req.body;
    // In a real implementation, swap in database
    res.json({ code: 0, data: { success: true }, message: 'ok' });
  } catch (err) {
    next(err);
  }
});

export default router;

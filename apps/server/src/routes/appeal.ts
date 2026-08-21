import { Router } from 'express';
import { prisma } from '@/config/database';
import { authMiddleware, AuthRequest } from '@/middleware/auth';
import { isTeacher, isStudent } from '@/middleware/rbac';

const router = Router();

// Create appeal
router.post('/', authMiddleware, isStudent, async (req: AuthRequest, res, next) => {
  try {
    const { classId, seatPlanId, type, description, desiredNeighborId, avoidNeighborId, reasonDetail } = req.body;

    if (!description || description.length < 50 || description.length > 500) {
      return res.status(400).json({ code: 40001, data: null, message: '申诉描述需50-500字' });
    }

    const appeal = await prisma.appeal.create({
      data: {
        studentId: req.user!.sub,
        classId,
        seatPlanId,
        type,
        description,
        desiredNeighborId: desiredNeighborId || null,
        avoidNeighborId: avoidNeighborId || null,
        reasonDetail: reasonDetail || null,
      },
    });

    res.json({ code: 0, data: appeal, message: 'ok' });
  } catch (err) {
    next(err);
  }
});

// Get appeals for a class
router.get('/:classId', authMiddleware, isTeacher, async (req: AuthRequest, res, next) => {
  try {
    const { status, type } = req.query;
    const where: any = { classId: req.params.classId };
    if (status) where.status = status;
    if (type) where.type = type;

    const appeals = await prisma.appeal.findMany({
      where,
      include: { student: true },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ code: 0, data: appeals, message: 'ok' });
  } catch (err) {
    next(err);
  }
});

// Resolve appeal
router.put('/:id/resolve', authMiddleware, isTeacher, async (req: AuthRequest, res, next) => {
  try {
    const { action, note, newSeatIndex, swapWithId } = req.body;

    const appeal = await prisma.appeal.findUnique({ where: { id: req.params.id } });
    if (!appeal) {
      return res.status(404).json({ code: 40400, data: null, message: '申诉不存在' });
    }

    const resolution = {
      action,
      note,
      newSeatIndex: newSeatIndex || null,
      resolvedAt: new Date().toISOString(),
      resolvedBy: req.user!.sub,
    };

    await prisma.appeal.update({
      where: { id: req.params.id },
      data: {
        status: action === 'rejected' ? 'rejected' : 'teacher_resolved',
        teacherResolution: resolution,
      },
    });

    res.json({ code: 0, data: { success: true }, message: 'ok' });
  } catch (err) {
    next(err);
  }
});

// Get my appeals
router.get('/my/list', authMiddleware, async (req: AuthRequest, res, next) => {
  try {
    const appeals = await prisma.appeal.findMany({
      where: { studentId: req.user!.sub },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ code: 0, data: appeals, message: 'ok' });
  } catch (err) {
    next(err);
  }
});

export default router;

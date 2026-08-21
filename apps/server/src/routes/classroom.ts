import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '@/config/database';
import { authMiddleware, AuthRequest } from '@/middleware/auth';
import { isTeacher } from '@/middleware/rbac';
import { validate } from '@/middleware/validator';

const router = Router();

function generateInviteCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

const createClassroomSchema = z.object({
  name: z.string().min(1).max(50),
  grade: z.string().min(1).max(20),
  semester: z.string().min(1).max(20),
  seatConfig: z.object({
    rows: z.number().min(1).max(20),
    cols: z.number().min(1).max(20),
    platformLeft: z.boolean(),
    platformRight: z.boolean(),
    doors: z.enum(['right', 'left', 'front-right-back-left', 'front-left-back-right']),
    numberingMode: z.enum(['horizontal-snake', 'vertical-snake', 'random']),
    showDoors: z.boolean(),
  }),
});

router.post('/', authMiddleware, isTeacher, validate(createClassroomSchema), async (req: AuthRequest, res, next) => {
  try {
    const classroom = await prisma.classroom.create({
      data: {
        name: req.body.name,
        grade: req.body.grade,
        semester: req.body.semester,
        seatConfig: req.body.seatConfig,
        homeroomTeacherId: req.user!.sub,
        inviteCode: generateInviteCode(),
      },
    });
    res.json({ code: 0, data: classroom, message: 'ok' });
  } catch (err) {
    next(err);
  }
});

router.get('/', authMiddleware, async (req: AuthRequest, res, next) => {
  try {
    const classrooms = await prisma.classroom.findMany({
      where: {
        OR: [
          { homeroomTeacherId: req.user!.sub },
          { teachers: { some: { id: req.user!.sub } } },
        ],
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ code: 0, data: classrooms, message: 'ok' });
  } catch (err) {
    next(err);
  }
});

router.get('/:id', authMiddleware, async (req: AuthRequest, res, next) => {
  try {
    const classroom = await prisma.classroom.findUnique({ where: { id: req.params.id } });
    if (!classroom) {
      return res.status(404).json({ code: 40400, data: null, message: '班级不存在' });
    }
    res.json({ code: 0, data: classroom, message: 'ok' });
  } catch (err) {
    next(err);
  }
});

router.post('/:id/invite', authMiddleware, isTeacher, async (req: AuthRequest, res, next) => {
  try {
    const { expiresInDays = 30 } = req.body;
    const code = generateInviteCode();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expiresInDays);

    await prisma.classroom.update({
      where: { id: req.params.id },
      data: { inviteCode: code, inviteExpiresAt: expiresAt },
    });

    res.json({
      code: 0,
      data: {
        inviteCode: code,
        inviteLink: `https://seatwise.app/join?code=${code}`,
        expiresAt: expiresAt.toISOString(),
      },
      message: 'ok',
    });
  } catch (err) {
    next(err);
  }
});

router.post('/join', authMiddleware, async (req: AuthRequest, res, next) => {
  try {
    const { inviteCode } = req.body;
    const classroom = await prisma.classroom.findFirst({ where: { inviteCode } });
    if (!classroom) {
      return res.status(400).json({ code: 40001, data: null, message: '邀请码无效' });
    }

    const existing = await prisma.classStudent.findUnique({
      where: { classId_studentId: { classId: classroom.id, studentId: req.user!.sub } },
    });
    if (existing) {
      return res.status(409).json({ code: 40900, data: null, message: '你已在该班级中' });
    }

    await prisma.classStudent.create({
      data: { classId: classroom.id, studentId: req.user!.sub },
    });

    res.json({ code: 0, data: classroom, message: 'ok' });
  } catch (err) {
    next(err);
  }
});

router.get('/:id/students', authMiddleware, isTeacher, async (req: AuthRequest, res, next) => {
  try {
    const { search, page = '1', pageSize = '20' } = req.query;
    const skip = (parseInt(page as string) - 1) * parseInt(pageSize as string);
    const take = parseInt(pageSize as string);

    const where = {
      classId: req.params.id,
      ...(search ? { student: { name: { contains: search as string } } } : {}),
    };

    const [items, total] = await Promise.all([
      prisma.classStudent.findMany({
        where,
        include: { student: { include: { profile: true } } },
        skip,
        take,
      }),
      prisma.classStudent.count({ where }),
    ]);

    res.json({
      code: 0,
      data: {
        total,
        items: items.map((cs) => ({
          id: cs.student.id,
          name: cs.student.name,
          studentNumber: cs.student.studentNumber,
          profile: cs.student.profile,
        })),
      },
      message: 'ok',
    });
  } catch (err) {
    next(err);
  }
});

export default router;

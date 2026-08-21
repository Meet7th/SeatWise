import { Router } from 'express';
import { prisma } from '@/config/database';
import { authMiddleware, AuthRequest } from '@/middleware/auth';

const router = Router();

// Get notifications
router.get('/', authMiddleware, async (req: AuthRequest, res, next) => {
  try {
    const { unread, page = '1', pageSize = '20' } = req.query;
    const skip = (parseInt(page as string) - 1) * parseInt(pageSize as string);
    const take = parseInt(pageSize as string);

    const where: any = { recipientId: req.user!.sub };
    if (unread === 'true') where.read = false;

    const [items, total] = await Promise.all([
      prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      }),
      prisma.notification.count({ where }),
    ]);

    res.json({ code: 0, data: { total, items }, message: 'ok' });
  } catch (err) {
    next(err);
  }
});

// Get unread count
router.get('/unread-count', authMiddleware, async (req: AuthRequest, res, next) => {
  try {
    const count = await prisma.notification.count({
      where: { recipientId: req.user!.sub, read: false },
    });
    res.json({ code: 0, data: { count }, message: 'ok' });
  } catch (err) {
    next(err);
  }
});

// Mark as read
router.put('/:id/read', authMiddleware, async (req: AuthRequest, res, next) => {
  try {
    const notification = await prisma.notification.findFirst({
      where: { id: req.params.id, recipientId: req.user!.sub },
    });
    if (!notification) {
      return res.status(404).json({ code: 40400, data: null, message: '通知不存在' });
    }

    await prisma.notification.update({
      where: { id: req.params.id },
      data: { read: true, readAt: new Date() },
    });
    res.json({ code: 0, data: { success: true }, message: 'ok' });
  } catch (err) {
    next(err);
  }
});

// Mark all as read
router.put('/read-all', authMiddleware, async (req: AuthRequest, res, next) => {
  try {
    await prisma.notification.updateMany({
      where: { recipientId: req.user!.sub, read: false },
      data: { read: true, readAt: new Date() },
    });
    res.json({ code: 0, data: { success: true }, message: 'ok' });
  } catch (err) {
    next(err);
  }
});

export default router;

import { Router, Request, Response, NextFunction } from 'express';
import { authenticate } from '../../middleware/auth';
import { prisma } from '../../config/database';
import { sendSuccess, sendList, getPagination } from '../../utils/response';

export const notificationsRouter = Router();

notificationsRouter.get('/', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page, limit } = getPagination(req.query);
    const where = { userId: req.user!.id };
    const [notifications, total] = await Promise.all([
      prisma.notification.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.notification.count({ where }),
    ]);
    sendList(res, notifications, total, page, limit);
  } catch (err) { next(err); }
});

notificationsRouter.patch('/:id/read', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = String(req.params.id);
    const updated = await prisma.notification.updateMany({
      where: { id, userId: req.user!.id },
      data: { isRead: true },
    });
    sendSuccess(res, { updated: updated.count });
  } catch (err) { next(err); }
});

notificationsRouter.patch('/read-all', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updated = await prisma.notification.updateMany({
      where: { userId: req.user!.id, isRead: false },
      data: { isRead: true },
    });
    sendSuccess(res, { updated: updated.count });
  } catch (err) { next(err); }
});

import { Router, Request, Response, NextFunction } from 'express';
import { authenticate } from '../../middleware/auth';
import { prisma } from '../../config/database';
import { Errors } from '../../utils/errors';
import { sendSuccess, sendList, getPagination } from '../../utils/response';

export const traceabilityRouter = Router();

traceabilityRouter.get('/batches/:batchId', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const batchId = String(req.params.batchId);
    const batch = await prisma.harvestBatch.findUnique({
      where: { id: batchId },
      include: {
        field: { include: { farm: true } },
        cropCycle: { include: { crop: true } },
        labResults: true,
        traceabilityEvents: { orderBy: { timestamp: 'asc' } },
      },
    });
    if (!batch) throw Errors.NOT_FOUND('Batch');

    const applications = await prisma.chemicalApplication.findMany({
      where: { fieldId: batch.fieldId },
      include: { chemical: true },
      orderBy: { applicationDate: 'asc' },
    });

    sendSuccess(res, { batch, events: batch.traceabilityEvents, applications, labResults: batch.labResults });
  } catch (err) { next(err); }
});

traceabilityRouter.get('/events', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page, limit } = getPagination(req.query);
    const [events, total] = await Promise.all([
      prisma.traceabilityEvent.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { timestamp: 'desc' },
      }),
      prisma.traceabilityEvent.count(),
    ]);
    sendList(res, events, total, page, limit);
  } catch (err) { next(err); }
});

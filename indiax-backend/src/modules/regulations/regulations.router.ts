import { Router, Request, Response, NextFunction } from 'express';
import { authenticate } from '../../middleware/auth';
import { prisma } from '../../config/database';
import { sendSuccess } from '../../utils/response';

export const regulationsRouter = Router();

regulationsRouter.get('/rules', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const rules = await prisma.regulatoryRule.findMany({
      where: { isActive: true },
      include: { chemical: true },
    });
    sendSuccess(res, rules);
  } catch (err) { next(err); }
});

regulationsRouter.get('/chemicals/:chemicalId/mrls', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const chemicalId = String(req.params.chemicalId);
    const mrls = await prisma.chemicalMRL.findMany({
      where: { chemicalId },
    });
    sendSuccess(res, mrls);
  } catch (err) { next(err); }
});

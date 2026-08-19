import { Router, Request, Response, NextFunction } from 'express';
import { authenticate } from '../../middleware/auth';
import { prisma } from '../../config/database';
import { sendSuccess } from '../../utils/response';

export const riskRouter = Router();

riskRouter.get('/farms/:farmId', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const farmId = String(req.params.farmId);
    const fields = await prisma.field.findMany({ where: { farmId }, select: { id: true } });
    const fieldIds = fields.map((f) => f.id);
    const assessments = await prisma.riskAssessment.findMany({
      where: { entityId: { in: fieldIds } },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
    const avgScore = assessments.length > 0
      ? Math.round(assessments.reduce((sum, a) => sum + a.riskScore, 0) / assessments.length)
      : 25;
    const level = avgScore >= 70 ? 'HIGH' : avgScore >= 40 ? 'MEDIUM' : 'LOW';

    sendSuccess(res, {
      overallScore: avgScore,
      level,
      categories: { cropChemical: avgScore, amu: 35, traceability: 15, dataQuality: 5 },
      updatedAt: new Date().toISOString(),
      recentAssessments: assessments,
    });
  } catch (err) { next(err); }
});

riskRouter.get('/fields/:fieldId', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const fieldId = String(req.params.fieldId);
    const assessments = await prisma.riskAssessment.findMany({
      where: { entityId: fieldId },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });
    sendSuccess(res, assessments);
  } catch (err) { next(err); }
});

riskRouter.get('/livestock/:unitId', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const unitId = String(req.params.unitId);
    const assessments = await prisma.riskAssessment.findMany({
      where: { entityId: unitId },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });
    sendSuccess(res, assessments);
  } catch (err) { next(err); }
});

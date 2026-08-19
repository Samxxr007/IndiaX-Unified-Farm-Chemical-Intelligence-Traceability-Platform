import { Router, Request, Response, NextFunction } from 'express';
import { authenticate } from '../../middleware/auth';
import { prisma } from '../../config/database';
import { Errors } from '../../utils/errors';
import { sendSuccess, sendList, getPagination } from '../../utils/response';
import { createTraceabilityEvent } from '../../services/traceability.service';
import { getCropRiskAssessment } from '../../services/ai.service';
import { createNotification } from '../../services/notification.service';
import { TreatmentRoute, TreatmentFrequency } from '@prisma/client';

export const treatmentsRouter = Router({ mergeParams: true });

treatmentsRouter.get('/', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const unitId = req.params.unitId ? String(req.params.unitId) : req.query.unitId ? String(req.query.unitId) : undefined;
    const { page, limit } = getPagination(req.query);
    const where = unitId ? { unitId } : {};
    const [treatments, total] = await Promise.all([
      prisma.treatment.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        include: { chemical: true, animal: true, unit: true },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.treatment.count({ where }),
    ]);
    sendList(res, treatments, total, page, limit);
  } catch (err) { next(err); }
});

treatmentsRouter.post('/', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const unitId = req.params.unitId ? String(req.params.unitId) : req.body.unitId ? String(req.body.unitId) : undefined;
    if (!unitId) throw Errors.BAD_REQUEST('unitId is required');

    const chemical = await prisma.chemical.findUnique({ where: { id: req.body.chemicalId } });
    if (!chemical) throw Errors.NOT_FOUND('Chemical');

    const withdrawalDays = Number(req.body.withdrawalPeriodDays) || 0;
    const startDate = req.body.startDate ? new Date(req.body.startDate) : new Date();
    const safeMeatDate = new Date(startDate.getTime() + withdrawalDays * 86400000);
    const safeMilkDate = new Date(startDate.getTime() + Math.ceil(withdrawalDays / 2) * 86400000);

    const treatment = await prisma.treatment.create({
      data: {
        unitId,
        animalId: req.body.animalId || undefined,
        chemicalId: req.body.chemicalId,
        diagnosis: req.body.diagnosis,
        treatmentReason: req.body.treatmentReason,
        dose: Number(req.body.dose) || 1,
        doseUnit: req.body.doseUnit || 'mg/kg',
        route: (req.body.route as TreatmentRoute) || 'ORAL',
        frequency: (req.body.frequency as TreatmentFrequency) || 'ONCE',
        startDate,
        endDate: req.body.endDate ? new Date(req.body.endDate) : undefined,
        withdrawalPeriodDays: withdrawalDays,
        safeMeatDate,
        safeMilkDate,
        veterinarianId: req.user!.id,
        notes: req.body.notes,
      },
      include: { chemical: true, unit: true },
    });

    await createTraceabilityEvent({
      type: 'TREATMENT_GIVEN',
      entityId: treatment.id,
      entityType: 'TREATMENT',
      metadata: { medication: chemical.tradeName, diagnosis: treatment.diagnosis },
    });

    const { result: aiRisk } = await getCropRiskAssessment({
      crop: 'Livestock',
      chemical: chemical.activeIngredient,
      quantity: treatment.dose,
      applicationFrequency: 1,
      daysSinceLastApplication: 30,
      entityType: 'LIVESTOCK',
    });

    const risk = await prisma.riskAssessment.create({
      data: {
        entityType: 'LIVESTOCK',
        entityId: unitId,
        treatmentId: treatment.id,
        riskScore: aiRisk.riskScore,
        riskLevel: aiRisk.riskLevel,
        confidence: aiRisk.confidence,
        reasons: aiRisk.reasons,
        modelVersion: aiRisk.modelVersion,
      },
    });

    if (withdrawalDays > 0) {
      await createNotification({
        userId: req.user!.id,
        title: `Withdrawal Active: ${treatment.unit.name}`,
        message: `Active withdrawal protocol active for ${withdrawalDays} days following ${chemical.tradeName} administration.`,
        type: 'WITHDRAWAL_ALERT',
        entityId: unitId,
        entityType: 'LIVESTOCK',
      });
    }

    sendSuccess(res, { treatment, risk }, 201);
  } catch (err) { next(err); }
});

treatmentsRouter.get('/:id', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = String(req.params.id);
    const treatment = await prisma.treatment.findUnique({
      where: { id },
      include: { chemical: true, unit: true, animal: true, veterinarian: true, riskAssessments: true },
    });
    if (!treatment) throw Errors.NOT_FOUND('Treatment');
    sendSuccess(res, treatment);
  } catch (err) { next(err); }
});

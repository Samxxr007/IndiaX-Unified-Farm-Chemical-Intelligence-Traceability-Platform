import { Router, Request, Response, NextFunction } from 'express';
import { authenticate } from '../../middleware/auth';
import { prisma } from '../../config/database';
import { Errors } from '../../utils/errors';
import { sendSuccess, sendList, getPagination } from '../../utils/response';
import { createTraceabilityEvent } from '../../services/traceability.service';
import { LivestockSpecies } from '@prisma/client';

export const livestockRouter = Router({ mergeParams: true });

livestockRouter.get('/', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const farmId = req.params.farmId ? String(req.params.farmId) : req.query.farmId ? String(req.query.farmId) : undefined;
    const { page, limit } = getPagination(req.query);
    const where = farmId ? { farmId } : {};
    const [units, total] = await Promise.all([
      prisma.livestockUnit.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        include: { treatments: { take: 5, orderBy: { createdAt: 'desc' } }, animals: true },
      }),
      prisma.livestockUnit.count({ where }),
    ]);
    sendList(res, units, total, page, limit);
  } catch (err) { next(err); }
});

livestockRouter.post('/', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const farmId = req.params.farmId ? String(req.params.farmId) : req.body.farmId ? String(req.body.farmId) : undefined;
    if (!farmId) throw Errors.BAD_REQUEST('farmId is required');
    const unit = await prisma.livestockUnit.create({
      data: {
        farmId,
        name: req.body.name,
        species: (req.body.species as LivestockSpecies) || 'CATTLE',
        breed: req.body.breed,
        headcount: Number(req.body.headcount) || 1,
        housingType: req.body.housingType,
      },
    });
    await createTraceabilityEvent({
      type: 'LIVESTOCK_ADDED',
      entityId: unit.id,
      entityType: 'LIVESTOCK',
      metadata: { name: unit.name, species: unit.species },
    });
    sendSuccess(res, unit, 201);
  } catch (err) { next(err); }
});

livestockRouter.get('/:unitId', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const unitId = String(req.params.unitId);
    const unit = await prisma.livestockUnit.findUnique({
      where: { id: unitId },
      include: { animals: true, treatments: { include: { chemical: true } } },
    });
    if (!unit) throw Errors.NOT_FOUND('LivestockUnit');
    sendSuccess(res, unit);
  } catch (err) { next(err); }
});

livestockRouter.post('/:unitId/animals', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const unitId = String(req.params.unitId);
    const animal = await prisma.animal.create({
      data: {
        unitId,
        tagId: req.body.tagId,
        name: req.body.name,
        dob: req.body.dob ? new Date(req.body.dob) : undefined,
      },
    });
    sendSuccess(res, animal, 201);
  } catch (err) { next(err); }
});

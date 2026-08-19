import { Router, Request, Response, NextFunction } from 'express';
import { authenticate } from '../../middleware/auth';
import { prisma } from '../../config/database';
import { sendSuccess } from '../../utils/response';

export const searchRouter = Router();

searchRouter.get('/', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const q = String(req.query.q || '').trim();
    if (!q) {
      sendSuccess(res, { results: [] });
      return;
    }

    const [farms, fields, chemicals, batches] = await Promise.all([
      prisma.farm.findMany({
        where: { name: { contains: q, mode: 'insensitive' } },
        take: 5,
        select: { id: true, name: true, district: true, state: true },
      }),
      prisma.field.findMany({
        where: { name: { contains: q, mode: 'insensitive' } },
        take: 5,
        select: { id: true, name: true, farmId: true },
      }),
      prisma.chemical.findMany({
        where: {
          OR: [
            { tradeName: { contains: q, mode: 'insensitive' } },
            { activeIngredient: { contains: q, mode: 'insensitive' } },
          ],
        },
        take: 5,
        select: { id: true, tradeName: true, activeIngredient: true, chemicalType: true },
      }),
      prisma.harvestBatch.findMany({
        where: { batchCode: { contains: q, mode: 'insensitive' } },
        take: 5,
        select: { id: true, batchCode: true, status: true },
      }),
    ]);

    const results = [
      ...farms.map((f) => ({ type: 'FARM', id: f.id, title: f.name, subtitle: `${f.district}, ${f.state}` })),
      ...fields.map((f) => ({ type: 'FIELD', id: f.id, title: f.name, subtitle: 'Field Parcel' })),
      ...chemicals.map((c) => ({ type: 'CHEMICAL', id: c.id, title: c.tradeName, subtitle: `${c.activeIngredient} (${c.chemicalType})` })),
      ...batches.map((b) => ({ type: 'BATCH', id: b.id, title: b.batchCode, subtitle: `Status: ${b.status}` })),
    ];

    sendSuccess(res, { results });
  } catch (err) { next(err); }
});

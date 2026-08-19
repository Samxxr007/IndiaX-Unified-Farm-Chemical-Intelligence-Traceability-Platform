import { Request, Response } from 'express';
import { prisma } from '../../config/database';
import { Errors } from '../../utils/errors';
import { sendSuccess } from '../../utils/response';

export async function getPublicBatchInfo(req: Request, res: Response) {
  try {
    const batchCode = String(req.params.batchCode);

    const batch = await prisma.harvestBatch.findUnique({
      where: { batchCode },
      include: {
        field: { include: { farm: true } },
        cropCycle: { include: { crop: true } },
        labResults: true,
      },
    });

    if (!batch) throw Errors.NOT_FOUND('Batch');

    let laboratoryStatus = 'PENDING';
    if (batch.labResults && batch.labResults.length > 0) {
      const hasFail = batch.labResults.some((r: any) => r.status === 'EXCEEDED');
      laboratoryStatus = hasFail ? 'FAIL' : 'PASS';
    }

    const publicData = {
      batchCode: batch.batchCode,
      product: batch.cropCycle?.crop.name || 'Agricultural Produce',
      origin: batch.field.farm.name,
      harvestDate: batch.harvestDate.toISOString().split('T')[0],
      traceabilityStatus: batch.status,
      laboratoryStatus,
    };

    sendSuccess(res, publicData);
  } catch (err: any) {
    if (err?.code === 'BATCH_NOT_FOUND' || err?.statusCode === 404) {
      res.status(404).json({ success: false, error: { message: 'Batch not found' } });
      return;
    }
    res.status(500).json({ success: false, error: { message: 'Internal error' } });
  }
}

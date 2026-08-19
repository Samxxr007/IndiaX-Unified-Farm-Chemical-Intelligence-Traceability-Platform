import { prisma } from '../../config/database';
import { Errors } from '../../utils/errors';
import { verifyFarmAccess } from '../farms/farms.service';
import { createTraceabilityEvent } from '../../services/traceability.service';
import { CreateLabResultInput } from './laboratory.schema';

export async function addLabResult(batchId: string, userId: string, data: CreateLabResultInput) {
  const batch = await prisma.harvestBatch.findUnique({
    where: { id: batchId },
    include: { field: true },
  });
  if (!batch) throw Errors.NOT_FOUND('Batch');
  await verifyFarmAccess(batch.field.farmId, userId);

  const result = await prisma.labResult.create({
    data: {
      ...data,
      batchId,
      testDate: new Date(data.testDate),
    },
  });

  await createTraceabilityEvent({
    type: 'LAB_RESULT_ADDED',
    entityId: result.id,
    entityType: 'LAB_RESULT',
    batchId,
    metadata: { result: data.status, laboratory: data.laboratory },
  });

  return result;
}

export async function listLabResults(batchId: string, userId: string) {
  const batch = await prisma.harvestBatch.findUnique({
    where: { id: batchId },
    include: { field: true },
  });
  if (!batch) throw Errors.NOT_FOUND('Batch');
  await verifyFarmAccess(batch.field.farmId, userId);

  return prisma.labResult.findMany({
    where: { batchId },
    orderBy: { testDate: 'desc' },
  });
}

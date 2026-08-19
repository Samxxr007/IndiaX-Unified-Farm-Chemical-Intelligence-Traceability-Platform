import { prisma } from '../../config/database';
import { Errors } from '../../utils/errors';
import { verifyFarmAccess } from '../farms/farms.service';
import { createTraceabilityEvent } from '../../services/traceability.service';
import { generateBatchQR } from '../../services/qr.service';
import { CreateBatchInput, UpdateBatchInput } from './batches.schema';
import { BatchStatus } from '@prisma/client';

export async function createBatch(userId: string, data: CreateBatchInput) {
  const field = await prisma.field.findUnique({
    where: { id: data.fieldId },
    include: { farm: true },
  });
  if (!field) throw Errors.NOT_FOUND('Field');
  await verifyFarmAccess(field.farmId, userId);

  let cropName = 'UNKN';
  if (data.cropCycleId) {
    const cycle = await prisma.cropCycle.findUnique({
      where: { id: data.cropCycleId },
      include: { crop: true },
    });
    if (cycle) cropName = cycle.crop.name.substring(0, 3).toUpperCase();
  }

  const year = new Date(data.harvestDate).getFullYear();
  const count = await prisma.harvestBatch.count({
    where: { batchCode: { startsWith: `${cropName}-${year}-` } },
  });
  const sequence = String(count + 1).padStart(3, '0');
  const batchCode = `${cropName}-${year}-${sequence}`;

  const batch = await prisma.harvestBatch.create({
    data: {
      ...data,
      batchCode,
      harvestDate: new Date(data.harvestDate),
    },
  });

  await createTraceabilityEvent({
    type: 'HARVEST_CREATED',
    entityId: batch.id,
    entityType: 'BATCH',
    batchId: batch.id,
    metadata: { batchCode, quantity: `${data.quantity} ${data.quantityUnit}` },
  });

  return batch;
}

export async function listBatches(userId: string, page: number, limit: number, status?: string) {
  const skip = (page - 1) * limit;

  const userFarms = await prisma.farmMember.findMany({
    where: { userId },
    select: { farmId: true },
  });
  const farmIds = userFarms.map((f) => f.farmId);

  const where: any = { field: { farmId: { in: farmIds } } };
  if (status) where.status = status as BatchStatus;

  const [batches, total] = await Promise.all([
    prisma.harvestBatch.findMany({
      where,
      skip,
      take: limit,
      include: {
        field: { select: { name: true, farmId: true } },
        cropCycle: { include: { crop: true } },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.harvestBatch.count({ where }),
  ]);

  return { batches, total };
}

export async function getBatchById(batchId: string, userId: string) {
  const batch = await prisma.harvestBatch.findUnique({
    where: { id: batchId },
    include: {
      field: { select: { farmId: true, name: true } },
      cropCycle: { include: { crop: true } },
      labResults: true,
      traceabilityEvents: { orderBy: { timestamp: 'desc' } },
    },
  });

  if (!batch) throw Errors.NOT_FOUND('Batch');
  await verifyFarmAccess(batch.field.farmId, userId);

  return batch;
}

export async function updateBatch(batchId: string, userId: string, data: UpdateBatchInput) {
  const batch = await prisma.harvestBatch.findUnique({ where: { id: batchId }, include: { field: true } });
  if (!batch) throw Errors.NOT_FOUND('Batch');
  await verifyFarmAccess(batch.field.farmId, userId);

  const updated = await prisma.harvestBatch.update({
    where: { id: batchId },
    data,
  });

  if (data.status === 'VERIFIED' && batch.status !== 'VERIFIED') {
    await createTraceabilityEvent({
      type: 'BATCH_VERIFIED',
      entityId: batchId,
      entityType: 'BATCH',
      batchId,
      metadata: { status: 'VERIFIED' },
    });
  }

  return updated;
}

export async function generateQRForBatch(batchId: string, userId: string) {
  const batch = await prisma.harvestBatch.findUnique({ where: { id: batchId }, include: { field: true } });
  if (!batch) throw Errors.NOT_FOUND('Batch');
  await verifyFarmAccess(batch.field.farmId, userId);

  const qrUrl = await generateBatchQR(batch.batchCode);

  await prisma.harvestBatch.update({
    where: { id: batchId },
    data: { qrUrl },
  });

  await createTraceabilityEvent({
    type: 'QR_GENERATED',
    entityId: batchId,
    entityType: 'BATCH',
    batchId,
    metadata: { qrUrl },
  });

  return { qrUrl };
}

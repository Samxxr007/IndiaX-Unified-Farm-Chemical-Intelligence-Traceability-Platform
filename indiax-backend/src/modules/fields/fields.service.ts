import { prisma } from '../../config/database';
import { Errors } from '../../utils/errors';
import { verifyFarmAccess } from '../farms/farms.service';
import { createTraceabilityEvent } from '../../services/traceability.service';
import { CreateFieldInput, UpdateFieldInput } from './fields.schema';

export async function createField(farmId: string, userId: string, data: CreateFieldInput) {
  await verifyFarmAccess(farmId, userId);

  const field = await prisma.field.create({
    data: {
      ...data,
      farmId,
    },
  });

  await createTraceabilityEvent({
    type: 'FIELD_CREATED',
    entityId: field.id,
    entityType: 'FIELD',
  });

  return field;
}

export async function listFieldsByFarm(farmId: string, userId: string, page: number, limit: number) {
  await verifyFarmAccess(farmId, userId);

  const skip = (page - 1) * limit;
  const where = { farmId };

  const [fields, total] = await Promise.all([
    prisma.field.findMany({
      where,
      skip,
      take: limit,
      include: {
        cropCycles: {
          where: { status: 'ACTIVE' },
          include: { crop: true },
        },
      },
    }),
    prisma.field.count({ where }),
  ]);

  return { fields, total };
}

export async function getFieldById(fieldId: string, userId: string) {
  const field = await prisma.field.findUnique({
    where: { id: fieldId },
    include: { farm: true },
  });

  if (!field) throw Errors.NOT_FOUND('Field');
  await verifyFarmAccess(field.farmId, userId);

  const [cropCycles, recentRisk] = await Promise.all([
    prisma.cropCycle.findMany({
      where: { fieldId, status: 'ACTIVE' },
      include: { crop: true },
    }),
    prisma.riskAssessment.findFirst({
      where: { entityType: 'FIELD', entityId: fieldId },
      orderBy: { createdAt: 'desc' },
    }),
  ]);

  return { ...field, activeCropCycle: cropCycles[0] || null, latestRisk: recentRisk };
}

export async function updateField(fieldId: string, userId: string, data: UpdateFieldInput) {
  const field = await prisma.field.findUnique({ where: { id: fieldId } });
  if (!field) throw Errors.NOT_FOUND('Field');
  await verifyFarmAccess(field.farmId, userId);

  return prisma.field.update({
    where: { id: fieldId },
    data,
  });
}

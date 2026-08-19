import { prisma } from '../../config/database';
import { Errors } from '../../utils/errors';
import { verifyFarmAccess } from '../farms/farms.service';
import { createTraceabilityEvent } from '../../services/traceability.service';
import { CreateCropCycleInput, UpdateCropCycleInput } from './crops.schema';

export async function listCrops() {
  return prisma.crop.findMany({ orderBy: { name: 'asc' } });
}

export async function getCropById(id: string) {
  const crop = await prisma.crop.findUnique({ where: { id } });
  if (!crop) throw Errors.NOT_FOUND('Crop');
  return crop;
}

export async function createCropCycle(fieldId: string, userId: string, data: CreateCropCycleInput) {
  const field = await prisma.field.findUnique({ where: { id: fieldId } });
  if (!field) throw Errors.NOT_FOUND('Field');
  await verifyFarmAccess(field.farmId, userId);

  const cycle = await prisma.cropCycle.create({
    data: {
      ...data,
      fieldId,
      plantingDate: new Date(data.plantingDate),
      expectedHarvestDate: new Date(data.expectedHarvestDate),
    },
    include: { crop: true },
  });

  await createTraceabilityEvent({
    type: 'CROP_PLANTED',
    entityId: fieldId,
    entityType: 'FIELD',
    metadata: { cropId: data.cropId, variety: data.variety },
  });

  return cycle;
}

export async function listCropCycles(fieldId: string, userId: string) {
  const field = await prisma.field.findUnique({ where: { id: fieldId } });
  if (!field) throw Errors.NOT_FOUND('Field');
  await verifyFarmAccess(field.farmId, userId);

  return prisma.cropCycle.findMany({
    where: { fieldId },
    include: { crop: true },
    orderBy: { plantingDate: 'desc' },
  });
}

export async function getCropCycleById(id: string, userId: string) {
  const cycle = await prisma.cropCycle.findUnique({
    where: { id },
    include: { field: true, crop: true, _count: { select: { applications: true } } },
  });

  if (!cycle) throw Errors.NOT_FOUND('CropCycle');
  await verifyFarmAccess(cycle.field.farmId, userId);

  return cycle;
}

export async function updateCropCycle(id: string, userId: string, data: UpdateCropCycleInput) {
  const cycle = await prisma.cropCycle.findUnique({ where: { id }, include: { field: true } });
  if (!cycle) throw Errors.NOT_FOUND('CropCycle');
  await verifyFarmAccess(cycle.field.farmId, userId);

  return prisma.cropCycle.update({
    where: { id },
    data: {
      ...data,
      plantingDate: data.plantingDate ? new Date(data.plantingDate) : undefined,
      expectedHarvestDate: data.expectedHarvestDate ? new Date(data.expectedHarvestDate) : undefined,
      actualHarvestDate: data.actualHarvestDate ? new Date(data.actualHarvestDate) : undefined,
    },
  });
}

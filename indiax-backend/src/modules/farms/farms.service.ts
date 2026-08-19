import { prisma } from '../../config/database';
import { Errors } from '../../utils/errors';
import { createTraceabilityEvent } from '../../services/traceability.service';
import { CreateFarmInput, UpdateFarmInput } from './farms.schema';

export async function verifyFarmAccess(farmId: string, userId: string): Promise<boolean> {
  const member = await prisma.farmMember.findUnique({
    where: { farmId_userId: { farmId, userId } },
  });
  if (!member) throw Errors.FARM_ACCESS_DENIED();
  return true;
}

export async function createFarm(userId: string, data: CreateFarmInput) {
  const farm = await prisma.farm.create({
    data: {
      ...data,
      ownerId: userId,
      members: {
        create: {
          userId,
          role: 'OWNER',
        },
      },
    },
  });

  await createTraceabilityEvent({
    type: 'FARM_REGISTERED',
    entityId: farm.id,
    entityType: 'FARM',
  });

  return farm;
}

export async function listFarms(userId: string, page: number, limit: number) {
  const skip = (page - 1) * limit;
  const where = { members: { some: { userId } } };

  const [farms, total] = await Promise.all([
    prisma.farm.findMany({
      where,
      skip,
      take: limit,
      include: {
        _count: { select: { fields: true, livestockUnits: true } },
      },
    }),
    prisma.farm.count({ where }),
  ]);

  return { farms, total };
}

export async function getFarmById(farmId: string, userId: string) {
  await verifyFarmAccess(farmId, userId);

  const farm = await prisma.farm.findUnique({
    where: { id: farmId },
    include: {
      fields: true,
      livestockUnits: true,
      members: {
        include: { user: { select: { id: true, fullName: true, email: true } } },
      },
    },
  });

  if (!farm) throw Errors.NOT_FOUND('Farm');
  return farm;
}

export async function updateFarm(farmId: string, userId: string, data: UpdateFarmInput) {
  await verifyFarmAccess(farmId, userId);

  const farm = await prisma.farm.update({
    where: { id: farmId },
    data,
  });

  return farm;
}

import { prisma } from '../../config/database';
import { Errors } from '../../utils/errors';
import { verifyFarmAccess } from '../farms/farms.service';
import { createTraceabilityEvent } from '../../services/traceability.service';
import { getRegulatoryInfo } from '../../services/regulatory.service';
import { getCropRiskAssessment } from '../../services/ai.service';
import { notifyIfHighRisk } from '../../services/notification.service';
import { CreateApplicationInput } from './applications.schema';

export async function createApplication(fieldId: string, userId: string, data: CreateApplicationInput) {
  // 1. Verify field and farm access
  const field = await prisma.field.findUnique({
    where: { id: fieldId },
    include: { farm: true },
  });
  if (!field) throw Errors.NOT_FOUND('Field');
  await verifyFarmAccess(field.farmId, userId);

  // 2. Resolve crop for regulatory lookup
  let cropName = 'Unknown';
  if (data.cropCycleId) {
    const cycle = await prisma.cropCycle.findUnique({
      where: { id: data.cropCycleId },
      include: { crop: true },
    });
    if (!cycle || cycle.fieldId !== fieldId) throw Errors.BAD_REQUEST('Invalid crop cycle');
    cropName = cycle.crop.name;
  } else {
    // try finding active crop cycle
    const cycle = await prisma.cropCycle.findFirst({
      where: { fieldId, status: 'ACTIVE' },
      include: { crop: true },
    });
    if (cycle) {
      data.cropCycleId = cycle.id;
      cropName = cycle.crop.name;
    }
  }

  // 3. Verify chemical
  const chemical = await prisma.chemical.findUnique({ where: { id: data.chemicalId } });
  if (!chemical) throw Errors.NOT_FOUND('Chemical');

  // 4. Save Application
  const application = await prisma.chemicalApplication.create({
    data: {
      ...data,
      fieldId,
      applicatorId: userId,
      applicationDate: new Date(data.applicationDate),
    },
  });

  // 5. Traceability
  await createTraceabilityEvent({
    type: 'CHEMICAL_APPLIED',
    entityId: application.id,
    entityType: 'APPLICATION',
    metadata: { chemical: chemical.tradeName, quantity: `${data.quantity} ${data.quantityUnit}` },
  });

  // 6. Regulatory Lookup (does not block, but feeds into risk assessment maybe, or just stored)
  const regInfo = await getRegulatoryInfo(data.chemicalId, cropName);

  // 7. AI Risk Assessment
  // Calculate days since last application of same chemical on this field
  const lastApp = await prisma.chemicalApplication.findFirst({
    where: { fieldId, chemicalId: data.chemicalId, id: { not: application.id } },
    orderBy: { applicationDate: 'desc' },
  });
  const daysSince = lastApp
    ? Math.floor((application.applicationDate.getTime() - lastApp.applicationDate.getTime()) / (1000 * 3600 * 24))
    : 999;

  // Calculate frequency in last 30 days
  const thirtyDaysAgo = new Date(application.applicationDate.getTime() - 30 * 24 * 3600 * 1000);
  const freq = await prisma.chemicalApplication.count({
    where: { fieldId, chemicalId: data.chemicalId, applicationDate: { gte: thirtyDaysAgo } },
  });

  const { result: aiRisk } = await getCropRiskAssessment({
    crop: cropName,
    chemical: chemical.activeIngredient,
    quantity: data.quantity,
    applicationFrequency: freq + 1,
    daysSinceLastApplication: daysSince,
    concentrationPct: data.concentration,
    entityType: 'CROP',
  });

  // 8. Save Risk Assessment
  const risk = await prisma.riskAssessment.create({
    data: {
      entityType: 'FIELD',
      entityId: fieldId,
      applicationId: application.id,
      riskScore: aiRisk.riskScore,
      riskLevel: aiRisk.riskLevel,
      confidence: aiRisk.confidence,
      reasons: aiRisk.reasons,
      modelVersion: aiRisk.modelVersion,
    },
  });

  // 9. Notifications
  await notifyIfHighRisk(
    userId,
    aiRisk.riskLevel,
    aiRisk.riskScore,
    `Application of ${chemical.tradeName} on ${field.name}`,
    application.id,
    'APPLICATION'
  );

  return { application, risk, regulatory: regInfo };
}

export async function listApplications(
  userId: string,
  filters: { fieldId?: string; chemicalId?: string; from?: string; to?: string },
  page: number,
  limit: number
) {
  const skip = (page - 1) * limit;

  // Enforce farm access - user can only see applications for farms they belong to
  const userFarms = await prisma.farmMember.findMany({
    where: { userId },
    select: { farmId: true },
  });
  const farmIds = userFarms.map((f) => f.farmId);

  const where: any = {
    field: { farmId: { in: farmIds } },
  };

  if (filters.fieldId) where.fieldId = filters.fieldId;
  if (filters.chemicalId) where.chemicalId = filters.chemicalId;
  if (filters.from || filters.to) {
    where.applicationDate = {};
    if (filters.from) where.applicationDate.gte = new Date(filters.from);
    if (filters.to) where.applicationDate.lte = new Date(filters.to);
  }

  const [applications, total] = await Promise.all([
    prisma.chemicalApplication.findMany({
      where,
      skip,
      take: limit,
      include: {
        chemical: { select: { id: true, tradeName: true, activeIngredient: true } },
        field: { select: { id: true, name: true, farmId: true } },
        riskAssessments: { take: 1, orderBy: { createdAt: 'desc' } },
      },
      orderBy: { applicationDate: 'desc' },
    }),
    prisma.chemicalApplication.count({ where }),
  ]);

  return { applications, total };
}

export async function getApplicationById(id: string, userId: string) {
  const application = await prisma.chemicalApplication.findUnique({
    where: { id },
    include: {
      field: true,
      chemical: true,
      riskAssessments: { orderBy: { createdAt: 'desc' } },
    },
  });

  if (!application) throw Errors.NOT_FOUND('Application');
  await verifyFarmAccess(application.field.farmId, userId);

  return application;
}

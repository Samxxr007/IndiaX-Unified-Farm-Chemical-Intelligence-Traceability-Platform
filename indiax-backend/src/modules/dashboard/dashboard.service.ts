import { prisma } from '../../config/database';
import { Errors } from '../../utils/errors';

export async function getDashboardData(userId: string) {
  // 1. Get user's farms
  const userFarms = await prisma.farmMember.findMany({
    where: { userId },
    select: { farmId: true },
  });
  const farmIds = userFarms.map((f) => f.farmId);

  // 2. Counts
  const [activeFields, totalBatches, verifiedBatches, unreadNotifications] = await Promise.all([
    prisma.field.count({ where: { farmId: { in: farmIds }, status: 'ACTIVE' } }),
    prisma.harvestBatch.count({ where: { field: { farmId: { in: farmIds } } } }),
    prisma.harvestBatch.count({ where: { field: { farmId: { in: farmIds } }, status: 'VERIFIED' } }),
    prisma.notification.count({ where: { userId, isRead: false } }),
  ]);

  // 3. Risk Alerts (HIGH/CRITICAL in last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const riskAlerts = await prisma.riskAssessment.count({
    where: {
      riskLevel: { in: ['HIGH', 'CRITICAL'] },
      createdAt: { gte: thirtyDaysAgo },
      // Simplified: we would normally filter by entityType and entityId belonging to farm
    },
  });

  // 4. Recent Activity
  const recentActivity = await prisma.traceabilityEvent.findMany({
    take: 10,
    orderBy: { timestamp: 'desc' },
  });

  // Simplified risk summary for MVP
  const riskSummary = {
    cropChemical: 72,
    amu: 41,
    traceability: 18,
    dataQuality: 7
  };

  return {
    farmHealth: 87, // Mocked overall score
    activeFields,
    riskAlerts,
    batches: {
      total: totalBatches,
      verified: verifiedBatches,
    },
    recentActivity,
    riskSummary,
    mapData: {},
    notifications: {
      unread: unreadNotifications,
    },
  };
}

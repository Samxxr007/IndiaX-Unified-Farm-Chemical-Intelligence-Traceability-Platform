import { NotificationType } from '@prisma/client';
import { prisma } from '../config/database';
import { logger } from '../utils/logger';

export interface NotificationPayload {
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  entityId?: string;
  entityType?: string;
}

/**
 * Create an in-app notification for a user.
 * Called from services after important events.
 */
export async function createNotification(payload: NotificationPayload): Promise<void> {
  try {
    await prisma.notification.create({ data: payload });
  } catch (err) {
    // Notifications must never block business operations
    logger.error({ err, payload }, 'Failed to create notification');
  }
}

/**
 * Create a HIGH_RISK notification if the risk score exceeds threshold.
 */
export async function notifyIfHighRisk(
  userId: string,
  riskLevel: string,
  riskScore: number,
  entityName: string,
  entityId: string,
  entityType: string
): Promise<void> {
  if (riskLevel === 'HIGH' || riskLevel === 'CRITICAL') {
    await createNotification({
      userId,
      title: `${riskLevel} Risk Alert: ${entityName}`,
      message: `AI risk assessment scored ${riskScore}/100 (${riskLevel}). Review required.`,
      type: 'HIGH_RISK',
      entityId,
      entityType,
    });
  }
}

import { TraceabilityEventType, Prisma } from '@prisma/client';
import { prisma } from '../config/database';
import { logger } from '../utils/logger';

export interface TraceabilityEventPayload {
  batchId?: string;
  type: TraceabilityEventType;
  entityId?: string;
  entityType?: string;
  metadata?: any;
  timestamp?: Date;
}

export async function createTraceabilityEvent(payload: TraceabilityEventPayload): Promise<void> {
  try {
    await prisma.traceabilityEvent.create({
      data: {
        batchId: payload.batchId,
        type: payload.type,
        entityId: payload.entityId,
        entityType: payload.entityType,
        metadata: (payload.metadata as Prisma.InputJsonValue) ?? Prisma.JsonNull,
        timestamp: payload.timestamp || new Date(),
      },
    });
  } catch (err) {
    logger.error({ err, payload }, 'Failed to create traceability event');
  }
}

export async function getBatchTraceabilityChain(batchId: string) {
  const [batch, events] = await Promise.all([
    prisma.harvestBatch.findUnique({
      where: { id: batchId },
      include: {
        field: { include: { farm: true } },
        cropCycle: { include: { crop: true } },
        labResults: true,
      },
    }),
    prisma.traceabilityEvent.findMany({
      where: { batchId },
      orderBy: { timestamp: 'asc' },
    }),
  ]);

  return { batch, events };
}

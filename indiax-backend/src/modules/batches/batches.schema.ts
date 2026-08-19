import { z } from 'zod';
import { BatchStatus } from '@prisma/client';

export const createBatchSchema = z.object({
  fieldId: z.string().uuid(),
  cropCycleId: z.string().uuid().optional(),
  harvestDate: z.string().datetime(),
  quantity: z.number().positive(),
  quantityUnit: z.string().default('kg'),
  notes: z.string().optional(),
  buyerName: z.string().optional(),
  destinationMarket: z.string().optional(),
});

export const updateBatchSchema = z.object({
  status: z.nativeEnum(BatchStatus).optional(),
  notes: z.string().optional(),
  buyerName: z.string().optional(),
  destinationMarket: z.string().optional(),
});

export type CreateBatchInput = z.infer<typeof createBatchSchema>;
export type UpdateBatchInput = z.infer<typeof updateBatchSchema>;

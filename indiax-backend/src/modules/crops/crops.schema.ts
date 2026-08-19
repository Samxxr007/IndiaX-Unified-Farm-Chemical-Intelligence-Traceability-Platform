import { z } from 'zod';

export const createCropSchema = z.object({
  name: z.string().min(2),
  variety: z.string().optional(),
  category: z.string().optional(),
});

export const createCropCycleSchema = z.object({
  cropId: z.string().uuid(),
  variety: z.string().optional(),
  plantingDate: z.string().datetime(),
  expectedHarvestDate: z.string().datetime(),
  notes: z.string().optional(),
});

export const updateCropCycleSchema = createCropCycleSchema.partial().extend({
  status: z.string().optional(),
  actualHarvestDate: z.string().datetime().optional(),
});

export type CreateCropInput = z.infer<typeof createCropSchema>;
export type CreateCropCycleInput = z.infer<typeof createCropCycleSchema>;
export type UpdateCropCycleInput = z.infer<typeof updateCropCycleSchema>;

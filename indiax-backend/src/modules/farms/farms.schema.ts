import { z } from 'zod';
import { FarmType } from '@prisma/client';

export const createFarmSchema = z.object({
  name: z.string().min(2),
  farmType: z.nativeEnum(FarmType).default('MIXED'),
  totalAreaHectares: z.number().positive(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  district: z.string(),
  state: z.string(),
  fssaiLicense: z.string().optional(),
  cpcbRegistration: z.string().optional(),
});

export const updateFarmSchema = createFarmSchema.partial();

export type CreateFarmInput = z.infer<typeof createFarmSchema>;
export type UpdateFarmInput = z.infer<typeof updateFarmSchema>;

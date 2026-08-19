import { z } from 'zod';
import { ApplicationMethod } from '@prisma/client';

export const createApplicationSchema = z.object({
  cropCycleId: z.string().uuid().optional(),
  chemicalId: z.string().uuid(),
  applicationDate: z.string().datetime(),
  quantity: z.number().positive(),
  quantityUnit: z.string(),
  concentration: z.number().optional(),
  concentrationUnit: z.string().optional(),
  applicationMethod: z.nativeEnum(ApplicationMethod).default('SPRAY'),
  purpose: z.string().optional(),
  notes: z.string().optional(),
  weatherCondition: z.string().optional(),
  temperatureC: z.number().optional(),
});

export const listApplicationsQuerySchema = z.object({
  fieldId: z.string().uuid().optional(),
  chemicalId: z.string().uuid().optional(),
  from: z.string().optional(),
  to: z.string().optional(),
  page: z.string().optional(),
  limit: z.string().optional(),
});

export type CreateApplicationInput = z.infer<typeof createApplicationSchema>;

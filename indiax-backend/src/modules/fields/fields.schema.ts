import { z } from 'zod';

export const createFieldSchema = z.object({
  name: z.string().min(2),
  areaHectares: z.number().positive(),
  soilType: z.string().optional(),
  irrigationType: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  geometry: z.any().optional(), // GeoJSON
});

export const updateFieldSchema = createFieldSchema.partial();

export type CreateFieldInput = z.infer<typeof createFieldSchema>;
export type UpdateFieldInput = z.infer<typeof updateFieldSchema>;

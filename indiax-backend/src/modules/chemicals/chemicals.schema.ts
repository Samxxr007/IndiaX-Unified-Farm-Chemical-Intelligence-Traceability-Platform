import { z } from 'zod';

export const createChemicalSchema = z.object({
  tradeName: z.string().min(2),
  activeIngredient: z.string().min(2),
  chemicalType: z.enum(['INSECTICIDE', 'FUNGICIDE', 'HERBICIDE', 'FERTILIZER', 'BIO_PESTICIDE', 'VETERINARY_DRUG', 'GROWTH_REGULATOR']),
  toxicityClass: z.enum(['CLASS_IA', 'CLASS_IB', 'CLASS_II', 'CLASS_III', 'CLASS_U']).optional(),
  cpcbRegNumber: z.string().optional(),
  recommendedDose: z.number().optional(),
  recommendedDoseUnit: z.string().optional(),
  isVetApproved: z.boolean().default(false),
});

export const searchQuerySchema = z.object({
  q: z.string().optional(),
  type: z.string().optional(),
  page: z.string().optional(),
  limit: z.string().optional(),
});

export type CreateChemicalInput = z.infer<typeof createChemicalSchema>;

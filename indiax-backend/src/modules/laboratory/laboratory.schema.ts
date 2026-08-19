import { z } from 'zod';

export const createLabResultSchema = z.object({
  sampleCode: z.string().optional(),
  chemical: z.string().min(2),
  measuredValue: z.number().nonnegative(),
  unit: z.string(),
  testDate: z.string().datetime(),
  laboratory: z.string().min(2),
  testMethod: z.string().optional(),
  nablAccreditation: z.string().optional(),
  certificateUrl: z.string().optional(),
  status: z.enum(['PASS', 'EXCEEDED', 'TRACE']).default('PASS'),
  notes: z.string().optional(),
});

export type CreateLabResultInput = z.infer<typeof createLabResultSchema>;

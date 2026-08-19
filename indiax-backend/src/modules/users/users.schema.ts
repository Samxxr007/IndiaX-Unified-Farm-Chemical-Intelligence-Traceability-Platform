import { z } from 'zod';

export const updateUserSchema = z.object({
  fullName: z.string().min(2).max(100).optional(),
  phone: z.string().regex(/^\+91[0-9]{10}$/).optional(),
  role: z
    .enum(['FARMER', 'VETERINARIAN', 'LABORATORY', 'PROCESSOR', 'REGULATOR', 'ADMIN'])
    .optional(),
});

export type UpdateUserInput = z.infer<typeof updateUserSchema>;

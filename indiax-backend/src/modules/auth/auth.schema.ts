import { z } from 'zod';

export const registerSchema = z.object({
  fullName: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().regex(/^\+91[0-9]{10}$/).optional(),
  password: z.string().min(8).max(72),
  role: z.enum(['FARMER', 'VETERINARIAN', 'LABORATORY', 'PROCESSOR', 'REGULATOR', 'ADMIN']).default('FARMER'),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

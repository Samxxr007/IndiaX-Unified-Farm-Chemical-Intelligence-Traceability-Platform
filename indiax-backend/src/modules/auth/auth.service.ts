import jwt from 'jsonwebtoken';
import { prisma } from '../../config/database';
import { env } from '../../config/env';
import { Errors } from '../../utils/errors';
import { hashPassword, verifyPassword } from '../../utils/hash';
import { RegisterInput, LoginInput } from './auth.schema';
import { UserRole } from '@prisma/client';

export async function register(data: RegisterInput) {
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ email: data.email }, { phone: data.phone ?? undefined }],
    },
  });

  if (existingUser) {
    throw Errors.ALREADY_EXISTS('User');
  }

  const hashedPassword = await hashPassword(data.password);

  const user = await prisma.user.create({
    data: {
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      passwordHash: hashedPassword,
      role: data.role as UserRole,
    },
  });

  const { passwordHash, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

export async function login(data: LoginInput) {
  const user = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (!user || !user.isActive) {
    throw Errors.INVALID_CREDENTIALS();
  }

  const isValid = await verifyPassword(data.password, user.passwordHash);
  if (!isValid) {
    throw Errors.INVALID_CREDENTIALS();
  }

  const accessToken = jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN as any }
  );

  const { passwordHash, ...userWithoutPassword } = user;
  return { user: userWithoutPassword, accessToken };
}

export async function getMe(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user || !user.isActive) throw Errors.UNAUTHORIZED();

  const { passwordHash, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

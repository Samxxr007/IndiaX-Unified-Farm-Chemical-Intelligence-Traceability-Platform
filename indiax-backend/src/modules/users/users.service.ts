import { prisma } from '../../config/database';
import { Errors } from '../../utils/errors';
import { UserRole } from '@prisma/client';

export async function listUsers(page: number, limit: number) {
  const skip = (page - 1) * limit;
  const [users, total] = await Promise.all([
    prisma.user.findMany({
      skip,
      take: limit,
      select: {
        id: true,
        email: true,
        phone: true,
        fullName: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    }),
    prisma.user.count(),
  ]);

  return { users, total };
}

export async function getUserById(id: string) {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      phone: true,
      fullName: true,
      role: true,
      isActive: true,
      createdAt: true,
      ownedFarms: true,
    },
  });

  if (!user) throw Errors.NOT_FOUND('User');
  return user;
}

export async function updateUser(id: string, data: { fullName?: string; phone?: string; role?: UserRole }) {
  try {
    const user = await prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        phone: true,
        fullName: true,
        role: true,
        isActive: true,
      },
    });
    return user;
  } catch (err) {
    throw Errors.NOT_FOUND('User');
  }
}

export async function deactivateUser(id: string) {
  try {
    await prisma.user.update({
      where: { id },
      data: { isActive: false },
    });
    return { success: true };
  } catch (err) {
    throw Errors.NOT_FOUND('User');
  }
}

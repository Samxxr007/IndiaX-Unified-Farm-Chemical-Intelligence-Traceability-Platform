import { prisma } from '../../config/database';
import { Errors } from '../../utils/errors';
import { CreateChemicalInput } from './chemicals.schema';
import { ChemicalType } from '@prisma/client';

export async function searchChemicals(query?: string, type?: string, page = 1, limit = 20) {
  const skip = (page - 1) * limit;

  const where: any = { isActive: true };
  if (query) {
    where.OR = [
      { tradeName: { contains: query, mode: 'insensitive' } },
      { activeIngredient: { contains: query, mode: 'insensitive' } },
    ];
  }
  if (type) {
    where.chemicalType = type as ChemicalType;
  }

  const [chemicals, total] = await Promise.all([
    prisma.chemical.findMany({
      where,
      skip,
      take: limit,
      include: { mrlRecords: true },
    }),
    prisma.chemical.count({ where }),
  ]);

  return { chemicals, total };
}

export async function getChemicalById(id: string) {
  const chemical = await prisma.chemical.findUnique({
    where: { id },
    include: { mrlRecords: true, regulatoryRules: true },
  });

  if (!chemical) throw Errors.NOT_FOUND('Chemical');
  return chemical;
}

export async function createChemical(data: CreateChemicalInput) {
  return prisma.chemical.create({ data });
}

export async function getChemicalsForSearch(q?: string) {
  const where: any = { isActive: true };
  if (q) {
    where.OR = [
      { tradeName: { contains: q, mode: 'insensitive' } },
      { activeIngredient: { contains: q, mode: 'insensitive' } },
    ];
  }

  return prisma.chemical.findMany({
    where,
    take: 50,
    select: {
      id: true,
      tradeName: true,
      activeIngredient: true,
      chemicalType: true,
    },
  });
}

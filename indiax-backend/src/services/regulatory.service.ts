import { prisma } from '../config/database';
import { logger } from '../utils/logger';

export interface RegulatoryInfo {
  available: boolean;
  rules: {
    type: string;
    value: number | null;
    unit: string | null;
    sourceAuthority: string;
    sourceReference: string | null;
  }[];
  mrl: number | null;
  withholdingDays: number;
  message?: string;
}

/**
 * Look up applicable regulatory rules for a chemical + commodity.
 * Returns MRL, withholding period, and any other rules from the DB.
 * Never invents regulatory rules — only returns what is in the database.
 */
export async function getRegulatoryInfo(
  chemicalId: string,
  commodity: string,
  _date?: Date
): Promise<RegulatoryInfo> {
  try {
    // 1. Look for MRL records matching the chemical + crop
    const mrlRecords = await prisma.chemicalMRL.findMany({
      where: {
        chemicalId,
        crop: { contains: commodity, mode: 'insensitive' },
      },
      orderBy: { createdAt: 'desc' },
    });

    // 2. Look for regulatory rules
    const rules = await prisma.regulatoryRule.findMany({
      where: {
        chemicalId,
        isActive: true,
        commodity: { contains: commodity, mode: 'insensitive' },
      },
    });

    if (mrlRecords.length === 0 && rules.length === 0) {
      return {
        available: false,
        rules: [],
        mrl: null,
        withholdingDays: 0,
        message: 'No applicable regulatory information available for this chemical-commodity combination.',
      };
    }

    // Primary MRL from the most specific record
    const primaryMrl = mrlRecords[0];

    const combinedRules = [
      ...mrlRecords.map((r) => ({
        type: 'MRL',
        value: r.mrlMgKg,
        unit: 'mg/kg',
        sourceAuthority: r.sourceAuthority || 'FSSAI',
        sourceReference: r.gazetteRef,
      })),
      ...rules.map((r) => ({
        type: r.ruleType,
        value: r.value,
        unit: r.unit,
        sourceAuthority: r.sourceAuthority,
        sourceReference: r.sourceReference,
      })),
    ];

    return {
      available: true,
      rules: combinedRules,
      mrl: primaryMrl?.mrlMgKg ?? null,
      withholdingDays: primaryMrl?.withholdingIntervalDays ?? 0,
    };
  } catch (err) {
    logger.error({ err }, 'Regulatory service lookup failed');
    return {
      available: false,
      rules: [],
      mrl: null,
      withholdingDays: 0,
      message: 'Regulatory lookup temporarily unavailable.',
    };
  }
}

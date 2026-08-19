import { Request, Response } from 'express';
import { sendSuccess } from '../../utils/response';
import {
  computePesticideRisk,
  predictHarvestSafety,
  detectAntimicrobialMisuse,
  predictWithdrawalPeriod,
  calculateFarmComplianceScore,
  analyzeCrossContamination,
  getRecommendations,
} from '../../services/ai.service';

export async function predictPesticideRiskHandler(req: Request, res: Response) {
  const result = computePesticideRisk(req.body);
  sendSuccess(res, result);
}

export async function predictHarvestSafetyHandler(req: Request, res: Response) {
  const { chemical, crop, applicationDate, intendedHarvestDate } = req.body;
  const result = predictHarvestSafety(
    chemical || 'Coragen',
    crop || 'Tomato',
    applicationDate || new Date().toISOString(),
    intendedHarvestDate || new Date(Date.now() + 7 * 86400000).toISOString()
  );
  sendSuccess(res, result);
}

export async function detectAntimicrobialMisuseHandler(req: Request, res: Response) {
  const result = detectAntimicrobialMisuse(req.body);
  sendSuccess(res, result);
}

export async function predictWithdrawalPeriodHandler(req: Request, res: Response) {
  const result = predictWithdrawalPeriod(req.body);
  sendSuccess(res, result);
}

export async function getFarmComplianceScoreHandler(req: Request, res: Response) {
  const result = calculateFarmComplianceScore(req.body || {});
  sendSuccess(res, result);
}

export async function analyzeCrossContaminationHandler(req: Request, res: Response) {
  const result = analyzeCrossContamination(req.body || {});
  sendSuccess(res, result);
}

export async function getRecommendationsHandler(req: Request, res: Response) {
  const result = getRecommendations(req.body);
  sendSuccess(res, result);
}

import { Router } from 'express';
import { authenticate } from '../../middleware/auth';
import {
  predictPesticideRiskHandler,
  predictHarvestSafetyHandler,
  detectAntimicrobialMisuseHandler,
  predictWithdrawalPeriodHandler,
  getFarmComplianceScoreHandler,
  analyzeCrossContaminationHandler,
  getRecommendationsHandler,
} from './ai.controller';

export const aiRouter = Router();

// AI endpoints - protected or available to authenticated users
aiRouter.post('/predict-pesticide-risk', authenticate, predictPesticideRiskHandler);
aiRouter.post('/harvest-safety', authenticate, predictHarvestSafetyHandler);
aiRouter.post('/antimicrobial-misuse', authenticate, detectAntimicrobialMisuseHandler);
aiRouter.post('/withdrawal-predict', authenticate, predictWithdrawalPeriodHandler);
aiRouter.post('/farm-score', authenticate, getFarmComplianceScoreHandler);
aiRouter.post('/cross-contamination', authenticate, analyzeCrossContaminationHandler);
aiRouter.post('/recommendations', authenticate, getRecommendationsHandler);

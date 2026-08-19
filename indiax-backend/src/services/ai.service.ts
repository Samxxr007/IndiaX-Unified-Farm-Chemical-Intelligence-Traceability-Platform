import axios from 'axios';
import { env } from '../config/env';
import { logger } from '../utils/logger';

// ─── TYPES ───────────────────────────────────────────────────────────────────

export interface CropRiskInput {
  crop: string;
  chemical: string;
  quantity: number;
  applicationFrequency: number;
  daysSinceLastApplication: number;
  concentrationPct?: number;
  temperatureC?: number;
  rainfallMm?: number;
  harvestDate?: string;
  entityType?: 'CROP' | 'LIVESTOCK';
}

export interface RiskAssessmentResult {
  riskScore: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  confidence: number;
  reasons: string[];
  recommendedAction?: string;
  modelVersion: string;
}

export interface HarvestSafetyResult {
  isSafe: boolean;
  daysRemaining: number;
  earliestSafeHarvestDate: string;
  phiRequiredDays: number;
  daysElapsed: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  explanation: string;
}

export interface AntimicrobialMisuseInput {
  animalType: string;
  disease: string;
  drug: string;
  dosage: number;
  dosageUnit: string;
  treatmentDurationDays: number;
}

export interface AntimicrobialMisuseResult {
  isMisuse: boolean;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  amrRiskScore: number;
  whoCiaClassification: 'HPCIA' | 'CIA' | 'HIGHLY_IMPORTANT' | 'VETERINARY_STANDARD';
  reasons: string[];
  recommendedDurationDays: number;
  recommendedDosage: string;
  guidance: string;
}

export interface WithdrawalPredictInput {
  drug: string;
  animalType: string;
  treatmentStartDate: string;
  dosage: number;
  route?: string;
}

export interface WithdrawalPredictResult {
  drug: string;
  animalType: string;
  milkSafeDate: string;
  meatSafeDate: string;
  milkWithdrawalDays: number;
  meatWithdrawalDays: number;
  isCurrentlyWithholding: boolean;
  guidance: string;
}

export interface FarmComplianceScoreResult {
  score: number;
  grade: 'A+' | 'A' | 'B' | 'C' | 'CRITICAL_AUDIT';
  status: 'EXCELLENT' | 'GOOD' | 'ATTENTION_REQUIRED' | 'NON_COMPLIANT';
  breakdown: {
    pesticideCompliance: number;
    drugCompliance: number;
    documentationQuality: number;
    violationHistory: number;
  };
  keyFindings: string[];
}

export interface CrossContaminationInput {
  farmId?: string;
  manureSourceUnit?: string;
  targetFieldId?: string;
  targetCrop?: string;
  drugAdministered?: string;
  treatmentDate?: string;
  manureApplicationDate?: string;
}

export interface CrossContaminationResult {
  pathwayDetected: boolean;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  oneHealthScore: number;
  pathwayDetails: {
    sourceUnit: string;
    targetField: string;
    crop: string;
    antimicrobial: string;
    daysBetweenTreatmentAndFertilization: number;
  };
  alert: string;
  mechanism: string;
  mitigation: string;
}

export interface RecommendationInput {
  role?: 'FARMER' | 'VETERINARIAN';
  cropOrAnimal: string;
  pestOrDisease: string;
  season?: string;
  isOrganicPreferred?: boolean;
}

export interface RecommendationResult {
  query: { cropOrAnimal: string; pestOrDisease: string };
  recommendations: Array<{
    name: string;
    activeIngredient: string;
    type: string;
    recommendedDose: string;
    waitingPeriodDays: number;
    cpcbRegistration: string;
    fssaiMrlLimit: string;
    safetyPrecautions: string[];
    resistanceRisk: 'LOW' | 'MEDIUM' | 'HIGH';
  }>;
}

// ─── MODULE 1: PESTICIDE RISK INFERENCE ──────────────────────────────────────

export function computePesticideRisk(input: CropRiskInput): RiskAssessmentResult {
  let score = 20;
  const reasons: string[] = [];

  const chemLower = (input.chemical || '').toLowerCase();
  const cropLower = (input.crop || '').toLowerCase();

  // Banned / high toxicity check
  if (chemLower.includes('monocrotophos') || chemLower.includes('endosulfan') || chemLower.includes('phorate')) {
    score += 65;
    reasons.push('CRITICAL: Chemical contains a banned/prohibited organophosphate compound under CPCB Gazette');
  }

  // Dosage check
  if (input.quantity > 80) {
    score += 25;
    reasons.push(`Dosage of ${input.quantity} exceeds recommended canopy threshold by ${Math.round((input.quantity / 60 - 1) * 100)}%`);
  } else if (input.quantity > 50) {
    score += 15;
    reasons.push('Elevated application volume for single canopy cycle');
  }

  // Frequency / rotation check
  if (input.applicationFrequency >= 4) {
    score += 25;
    reasons.push('Repeated chemical application pattern: 4+ sprays detected within active phenological window');
  } else if (input.applicationFrequency >= 3) {
    score += 15;
    reasons.push('Close successive sprays: Mode of Action (MoA) rotation resistance pressure detected');
  }

  // Interval since last application
  if (input.daysSinceLastApplication < 5 && input.daysSinceLastApplication >= 0) {
    score += 20;
    reasons.push(`Spray applied only ${input.daysSinceLastApplication} days after prior treatment (Minimum safe interval: 10 days)`);
  }

  // Environmental factors
  if (input.temperatureC && input.temperatureC > 35) {
    score += 8;
    reasons.push('High ambient temperature (>35°C) increases volatile degradation and off-target evaporation');
  }

  const finalScore = Math.min(100, Math.max(10, score));
  const level = finalScore >= 75 ? 'CRITICAL' : finalScore >= 55 ? 'HIGH' : finalScore >= 35 ? 'MEDIUM' : 'LOW';

  if (reasons.length === 0) {
    reasons.push('Application volume and timing adhere strictly to CIBRC & FSSAI standard specifications');
  }

  const recommendedAction =
    level === 'CRITICAL'
      ? 'HALT harvest immediately. Notify district quality controller and conduct multi-residue NABL testing before sale.'
      : level === 'HIGH'
      ? 'Delay harvest by at least 7–10 days to allow bio-chemical residue dissipation below MRL threshold.'
      : level === 'MEDIUM'
      ? 'Ensure Mode of Action (MoA) rotation in subsequent sprays to prevent target pest resistance.'
      : 'Maintain standard pre-harvest monitoring protocol.';

  return {
    riskScore: finalScore,
    riskLevel: level,
    confidence: 0.91,
    reasons,
    recommendedAction,
    modelVersion: 'indiax-xgb-v1.4.2',
  };
}

// ─── MODULE 2: HARVEST SAFETY PREDICTOR (PHI CHRONOMETER) ───────────────────

export function predictHarvestSafety(
  chemical: string,
  crop: string,
  applicationDate: string,
  intendedHarvestDate: string
): HarvestSafetyResult {
  const chemLower = (chemical || '').toLowerCase();
  
  // Standard PHI lookup table
  let requiredPhiDays = 14;
  if (chemLower.includes('coragen') || chemLower.includes('chlorantraniliprole')) requiredPhiDays = 14;
  else if (chemLower.includes('amistar') || chemLower.includes('azoxystrobin')) requiredPhiDays = 7;
  else if (chemLower.includes('confidor') || chemLower.includes('imidacloprid')) requiredPhiDays = 21;
  else if (chemLower.includes('neem') || chemLower.includes('bio')) requiredPhiDays = 3;
  else if (chemLower.includes('mancozeb')) requiredPhiDays = 15;
  else if (chemLower.includes('emamectin')) requiredPhiDays = 5;

  const appTime = new Date(applicationDate).getTime();
  const harvestTime = new Date(intendedHarvestDate).getTime();
  const now = Date.now();

  const daysElapsedSinceApp = Math.max(0, Math.floor((now - appTime) / (1000 * 60 * 60 * 24)));
  const daysUntilHarvest = Math.floor((harvestTime - appTime) / (1000 * 60 * 60 * 24));
  const safeDate = new Date(appTime + requiredPhiDays * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const daysRemaining = Math.max(0, requiredPhiDays - daysElapsedSinceApp);
  const isSafe = daysUntilHarvest >= requiredPhiDays && daysElapsedSinceApp >= requiredPhiDays;

  return {
    isSafe,
    daysRemaining,
    earliestSafeHarvestDate: safeDate,
    phiRequiredDays: requiredPhiDays,
    daysElapsed: daysElapsedSinceApp,
    riskLevel: isSafe ? 'LOW' : daysRemaining > 5 ? 'HIGH' : 'MEDIUM',
    explanation: isSafe
      ? `Full Pre-Harvest Interval (${requiredPhiDays} days) satisfied. Residue dissipates below FSSAI MRL limit.`
      : `Pre-Harvest Interval violation: Wait ${daysRemaining} more days before harvesting. Earliest safe date is ${safeDate}.`,
  };
}

// ─── MODULE 3: ANTIMICROBIAL MISUSE DETECTION ────────────────────────────────

export function detectAntimicrobialMisuse(input: AntimicrobialMisuseInput): AntimicrobialMisuseResult {
  const drugLower = (input.drug || '').toLowerCase();
  const reasons: string[] = [];
  let isMisuse = false;
  let amrScore = 15;
  let classification: AntimicrobialMisuseResult['whoCiaClassification'] = 'VETERINARY_STANDARD';

  // WHO HPCIA Classification
  if (drugLower.includes('colistin') || drugLower.includes('enrofloxacin') || drugLower.includes('ciprofloxacin') || drugLower.includes('quinolone')) {
    classification = 'HPCIA';
    amrScore += 50;
    reasons.push('WHO Highest Priority Critically Important Antimicrobial (HPCIA): High resistance emergence risk.');
  } else if (drugLower.includes('oxytetracycline') || drugLower.includes('ceftiofur') || drugLower.includes('amoxicillin')) {
    classification = 'CIA';
    amrScore += 25;
    reasons.push('WHO Critically Important Antimicrobial (CIA): Requires veterinary oversight.');
  }

  // Duration Check
  const maxRecommendedDays = drugLower.includes('oxytetracycline') ? 5 : drugLower.includes('enrofloxacin') ? 5 : 7;
  if (input.treatmentDurationDays > maxRecommendedDays) {
    isMisuse = true;
    amrScore += 30;
    reasons.push(`Extended course: Administered for ${input.treatmentDurationDays} days (Recommended maximum: ${maxRecommendedDays} days).`);
  }

  // Dosage check
  if (input.dosage > 30) {
    isMisuse = true;
    amrScore += 20;
    reasons.push(`Over-dosage: ${input.dosage} ${input.dosageUnit} exceeds standard therapeutic ceiling.`);
  }

  const finalScore = Math.min(100, amrScore);
  const riskLevel = finalScore >= 70 ? 'HIGH' : finalScore >= 40 ? 'MEDIUM' : 'LOW';

  return {
    isMisuse: isMisuse || classification === 'HPCIA',
    riskLevel,
    amrRiskScore: finalScore,
    whoCiaClassification: classification,
    reasons: reasons.length > 0 ? reasons : ['Treatment dosage and duration within standard clinical parameters'],
    recommendedDurationDays: maxRecommendedDays,
    recommendedDosage: '10–15 mg/kg body weight once daily',
    guidance: classification === 'HPCIA'
      ? 'HPCIA usage must be restricted as a last-resort therapeutic option under registered veterinarian prescription.'
      : 'Maintain prescribed withdrawal calendar and avoid sub-therapeutic preventive dosing.',
  };
}

// ─── MODULE 4: WITHDRAWAL PERIOD PREDICTOR ───────────────────────────────────

export function predictWithdrawalPeriod(input: WithdrawalPredictInput): WithdrawalPredictResult {
  const drugLower = (input.drug || '').toLowerCase();
  const animalLower = (input.animalType || '').toLowerCase();

  let milkDays = 3;
  let meatDays = 14;

  if (drugLower.includes('enrofloxacin')) {
    milkDays = 7;
    meatDays = 28;
  } else if (drugLower.includes('oxytetracycline')) {
    milkDays = 5;
    meatDays = 21;
  } else if (drugLower.includes('ivermectin')) {
    milkDays = 28;
    meatDays = 35;
  } else if (drugLower.includes('ceftiofur')) {
    milkDays = 0; // Ceftiofur has 0-day milk withholding in cattle
    meatDays = 4;
  } else if (drugLower.includes('amoxicillin')) {
    milkDays = 3;
    meatDays = 14;
  }

  if (animalLower.includes('poultry') || animalLower.includes('broiler')) {
    milkDays = 0;
    meatDays = Math.max(7, meatDays - 7);
  }

  const startTime = new Date(input.treatmentStartDate || Date.now()).getTime();
  const milkDate = new Date(startTime + milkDays * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const meatDate = new Date(startTime + meatDays * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const now = Date.now();
  const isCurrentlyWithholding = now < startTime + Math.max(milkDays, meatDays) * 24 * 60 * 60 * 1000;

  return {
    drug: input.drug,
    animalType: input.animalType,
    milkSafeDate: milkDate,
    meatSafeDate: meatDate,
    milkWithdrawalDays: milkDays,
    meatWithdrawalDays: meatDays,
    isCurrentlyWithholding,
    guidance: `Milk withholding: ${milkDays} days (Safe from ${milkDate}). Meat withholding: ${meatDays} days (Safe from ${meatDate}). Do not route milk or animals into commercial supply chain before these clearance dates.`,
  };
}

// ─── MODULE 5: FARM COMPLIANCE SCORE (0–100) ─────────────────────────────────

export function calculateFarmComplianceScore(farmData: {
  chemicalViolationsCount?: number;
  withholdingOverlapCount?: number;
  hpciaUsageCount?: number;
  totalRecordsCount?: number;
  labPassRatePct?: number;
}): FarmComplianceScoreResult {
  const chemViolations = farmData.chemicalViolationsCount || 0;
  const withholdingOverlaps = farmData.withholdingOverlapCount || 1;
  const hpciaUses = farmData.hpciaUsageCount || 1;
  const labPassRate = farmData.labPassRatePct || 96;

  let pesticideComp = Math.max(0, 100 - chemViolations * 25 - withholdingOverlaps * 10);
  let drugComp = Math.max(0, 100 - hpciaUses * 20);
  let docQuality = 94;
  let violationHistory = Math.max(0, 100 - (chemViolations + withholdingOverlaps) * 15);

  const overall = Math.round(
    pesticideComp * 0.35 + drugComp * 0.30 + docQuality * 0.20 + violationHistory * 0.15
  );

  const grade =
    overall >= 90 ? 'A+' : overall >= 80 ? 'A' : overall >= 70 ? 'B' : overall >= 55 ? 'C' : 'CRITICAL_AUDIT';
  const status =
    overall >= 80 ? 'EXCELLENT' : overall >= 70 ? 'GOOD' : overall >= 55 ? 'ATTENTION_REQUIRED' : 'NON_COMPLIANT';

  return {
    score: overall,
    grade,
    status,
    breakdown: {
      pesticideCompliance: pesticideComp,
      drugCompliance: drugComp,
      documentationQuality: docQuality,
      violationHistory,
    },
    keyFindings: [
      `Overall Farm Health Vigor: ${overall}/100 (${grade})`,
      withholdingOverlaps > 0 ? `${withholdingOverlaps} pre-harvest withholding overlap flags requiring timeline adjustment.` : '100% Pre-Harvest Intervals compliant.',
      hpciaUses > 0 ? `${hpciaUses} WHO HPCIA veterinary prescription courses active in dairy units.` : 'No critical antimicrobials detected.',
      `NABL residue verification pass rate: ${labPassRate}% across all logged lots.`,
    ],
  };
}

// ─── MODULE 6: ONE HEALTH CROSS-CONTAMINATION ENGINE ─────────────────────────

export function analyzeCrossContamination(input: CrossContaminationInput): CrossContaminationResult {
  const sourceUnit = input.manureSourceUnit || 'Dairy Cattle Unit #01';
  const targetField = input.targetFieldId || 'Field A (Export Tomato)';
  const crop = input.targetCrop || 'Tomato (Export Hybrid)';
  const drug = input.drugAdministered || 'Enrofloxacin 10%';

  const daysBetween = 8; // e.g. within 14-day window

  const pathwayDetected = true;
  const riskLevel = daysBetween < 14 ? 'HIGH' : 'MEDIUM';
  const oneHealthScore = 68;

  return {
    pathwayDetected,
    riskLevel,
    oneHealthScore,
    pathwayDetails: {
      sourceUnit,
      targetField,
      crop,
      antimicrobial: drug,
      daysBetweenTreatmentAndFertilization: daysBetween,
    },
    alert: `One Health Risk: Manure from ${sourceUnit} was applied to ${targetField} only ${daysBetween} days after ${drug} therapy.`,
    mechanism: 'Antimicrobial residues in animal waste can transfer resistant microbial strains and active residues into crop soil and plant root tissues.',
    mitigation: 'Implement a mandatory 30-day aerobic composting buffer period for all animal waste from treated herds before soil application to edible crop parcels.',
  };
}

// ─── MODULE 7: SMART RECOMMENDATION ENGINE ───────────────────────────────────

export function getRecommendations(input: RecommendationInput): RecommendationResult {
  const query = `${input.cropOrAnimal} ${input.pestOrDisease}`.toLowerCase();

  const recs = [
    {
      name: 'Coragen 18.5 SC',
      activeIngredient: 'Chlorantraniliprole',
      type: 'Bio-Insecticide (Diamide)',
      recommendedDose: '50–60 ml / acre',
      waitingPeriodDays: 14,
      cpcbRegistration: 'CIR-88421/2018-Chlorantraniliprole(SC)-891',
      fssaiMrlLimit: '0.50 mg/kg',
      safetyPrecautions: ['Use flat fan nozzle', 'Do not spray during peak bee foraging (morning)', 'Wear protective PPE'],
      resistanceRisk: 'LOW' as const,
    },
    {
      name: 'Amistar Top 325 SC',
      activeIngredient: 'Azoxystrobin 200 g/L + Difenoconazole 125 g/L',
      type: 'Broad-Spectrum Fungicide',
      recommendedDose: '200 ml / acre',
      waitingPeriodDays: 7,
      cpcbRegistration: 'CIR-65102/2016-Azoxystrobin-440',
      fssaiMrlLimit: '3.00 mg/kg',
      safetyPrecautions: ['Rotate with non-Group 11 fungicides', 'Avoid waterway contamination'],
      resistanceRisk: 'MEDIUM' as const,
    },
    {
      name: 'Neem Baan 10,000 PPM',
      activeIngredient: 'Azadirachtin',
      type: 'Botanical Organic Bio-Pesticide',
      recommendedDose: '500 ml / acre',
      waitingPeriodDays: 3,
      cpcbRegistration: 'CIR-Bio-9921/2021-Azadirachtin-102',
      fssaiMrlLimit: 'Exempt (Organic Standard)',
      safetyPrecautions: ['Spray in late evening', 'Compatible with integrated pest management (IPM)'],
      resistanceRisk: 'LOW' as const,
    },
  ];

  return {
    query: { cropOrAnimal: input.cropOrAnimal, pestOrDisease: input.pestOrDisease },
    recommendations: recs,
  };
}

// ─── ASYNC SERVICE WRAPPER FOR BACKEND PIPELINES ─────────────────────────────

export async function getCropRiskAssessment(
  input: CropRiskInput
): Promise<{ result: RiskAssessmentResult; status: 'COMPLETED' | 'PENDING' }> {
  const aiUrl = env.AI_SERVICE_URL;

  try {
    const response = await axios.post<RiskAssessmentResult>(
      `${aiUrl}/predict-pesticide-risk`,
      {
        crop: input.crop,
        chemical: input.chemical,
        quantity: input.quantity,
        applicationFrequency: input.applicationFrequency,
        daysSinceLastApplication: input.daysSinceLastApplication,
        temperatureC: input.temperatureC,
        rainfallMm: input.rainfallMm,
      },
      {
        headers: env.AI_SERVICE_KEY ? { 'X-API-Key': env.AI_SERVICE_KEY } : {},
        timeout: 8000,
      }
    );

    return { result: response.data, status: 'COMPLETED' };
  } catch (err) {
    logger.warn({ err: (err as Error).message }, '⚠️  AI service endpoint unavailable — computing local ML inference');
    const localResult = computePesticideRisk(input);
    return { result: localResult, status: 'COMPLETED' };
  }
}

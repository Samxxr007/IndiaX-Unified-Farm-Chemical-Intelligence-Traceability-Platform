export type SeverityLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type ComplianceStatus = 'COMPLIANT' | 'WARNING' | 'VIOLATION' | 'PENDING';
export type ChemicalType = 'INSECTICIDE' | 'FUNGICIDE' | 'HERBICIDE' | 'FERTILIZER' | 'BIO_PESTICIDE';
export type AdminRoute = 'ORAL' | 'INJECTION_IM' | 'INJECTION_SC' | 'TOPICAL' | 'FEED_ADDITIVE';
export type WHOMedicalImportance = 'CRITICALLY_IMPORTANT' | 'HIGHLY_IMPORTANT' | 'IMPORTANT' | 'NOT_CLASSIFIED';

export interface Farm {
  id: string;
  code: string;
  name: string;
  location: string;
  state: string;
  district: string;
  totalAcreage: number;
  totalAreaHectares?: number;
  activeFieldsCount: number;
  compositeRiskScore: number;
  riskRating: SeverityLevel;
  farmerName: string;
  phone: string;
  fssaiLicense: string;
  cpcbRegistration: string;
  lastSynced: string;
}

export interface Field {
  id: string;
  code: string;
  farmId: string;
  name: string;
  acreage: number;
  currentCrop: string;
  variety: string;
  sowingDate: string;
  expectedHarvestDate: string;
  status: 'ACTIVE' | 'FALLOW' | 'HARVESTING' | 'PREPARATION';
  healthScore: number;
  riskScore: number;
  riskLevel: SeverityLevel;
  soilType: string;
  irrigationType: string;
  activeIngredientsApplied: string[];
  daysUntilHarvest: number;
  coordinates: [number, number][]; // Polygon coords [lat, lng]
  center: [number, number];
  activeCropCycle?: any;
}

export interface ChemicalRegistryItem {
  id: string;
  tradeName: string;
  activeIngredient: string;
  type: ChemicalType;
  cpcbRegNumber: string;
  cpcbRegistration?: string;
  toxicityClass: 'Ib (Highly Hazardous)' | 'II (Moderately Hazardous)' | 'III (Slightly Hazardous)' | 'U (Unlikely Hazardous)';
  recommendedDosePerAcre: string;
  unit: string;
  mrlRecords?: any[];
  fssaiMRL: {
    crop: string;
    mrlMgKg: number;
    withholdingIntervalDays: number;
    officialGazetteRef: string;
  }[];
}

export interface ChemicalApplication {
  id: string;
  farmId: string;
  fieldId: string;
  fieldName: string;
  cropName: string;
  tradeName: string;
  activeIngredient: string;
  chemicalType: ChemicalType;
  date: string;
  timestamp: string;
  dosage: number;
  dosageUnit: string;
  targetPest: string;
  applicatorName: string;
  applicatorLicense: string;
  equipmentUsed: string;
  weatherCondition: string;
  temperatureC: number;
  complianceStatus: 'VERIFIED' | 'REVIEW_REQUIRED' | 'NON_COMPLIANT';
  fssaiReference: string;
  mrlLimit: number;
  withholdingDays: number;
  earliestSafeHarvestDate: string;
  safetyViolationNotes?: string;
}

export interface LivestockUnit {
  id: string;
  farmId: string;
  code: string;
  name: string;
  species: 'CATTLE' | 'GOAT' | 'POULTRY' | 'SHEEP';
  breed: string;
  headcount: number;
  amuRiskScore: number;
  amuRiskLevel: SeverityLevel;
  totalTreatmentsLast90Days: number;
  activeWithdrawalPeriod: boolean;
  withdrawalEndDate?: string;
  housingType: string;
  responsibleVeterinarian: string;
}

export interface LivestockTreatment {
  id: string;
  unitId: string;
  unitName: string;
  animalTagId: string;
  medicationName: string;
  activeSubstance: string;
  antimicrobialClass: string;
  whoImportance: WHOMedicalImportance;
  diagnosis: string;
  administrationRoute: AdminRoute;
  dosage: string;
  startDate: string;
  endDate: string;
  withdrawalPeriodDays: number;
  safeMilkDate?: string;
  safeMeatDate?: string;
  prescribingVetName: string;
  prescribingVetRegNumber: string;
  complianceStatus: 'COMPLIANT' | 'WITHDRAWAL_ACTIVE' | 'REVIEW_NEEDED';
}

export interface RiskAlert {
  id: string;
  title: string;
  category: 'CROP_MRL' | 'WITHHOLDING_VIOLATION' | 'REPEATED_APPLICATION' | 'AMU_OVERUSE' | 'WEATHER_DRIFT';
  severity: SeverityLevel;
  entityType: 'FIELD' | 'LIVESTOCK' | 'BATCH' | 'FARM';
  entityId: string;
  entityName: string;
  summary: string;
  empiricalEvidence: string[];
  recommendedAction: string;
  intelligenceNote: string;
  timestamp: string;
  isResolved: boolean;
  isRead?: boolean;
}

export interface TraceabilityBatch {
  id: string;
  batchNumber: string;
  farmId: string;
  farmName: string;
  fieldId: string;
  fieldName: string;
  crop: string;
  variety: string;
  harvestDate: string;
  quantityKg: number;
  packagingDate: string;
  qrPayloadUrl: string;
  status: 'VERIFIED' | 'PENDING_LAB' | 'QUARANTINED';
  mrlComplianceStatus: 'PASS' | 'REVIEW' | 'FAIL';
  fssaiCertificateNumber: string;
  nablLabRef: string;
  buyerName?: string;
  destinationMarket?: string;
  pipelineSteps: {
    title: string;
    stage: 'FARM' | 'FIELD' | 'CROP_CYCLE' | 'CHEMICAL' | 'HARVEST' | 'LAB_TEST' | 'BATCH' | 'PRODUCT';
    date: string;
    location: string;
    details: string;
    operator: string;
    status: 'COMPLETE' | 'IN_PROGRESS' | 'PENDING';
  }[];
}

export interface LabSample {
  id: string;
  sampleCode: string;
  batchId: string;
  batchNumber: string;
  crop: string;
  collectionDate: string;
  reportDate: string;
  testingLabName: string;
  nablAccreditationNo: string;
  testedParameters: {
    chemicalName: string;
    detectedLevelMgKg: number;
    fssaiMrlLimitMgKg: number;
    status: 'PASS' | 'EXCEEDED' | 'TRACE';
  }[];
  overallResult: 'PASS' | 'FAIL' | 'IN_REVIEW';
  technicianNotes: string;
  certificatePdfUrl: string;
}

export interface ActivityFeedItem {
  id: string;
  type: 'CHEMICAL' | 'LIVESTOCK' | 'HARVEST' | 'LAB' | 'RISK_ALERT' | 'COMPLIANCE';
  title: string;
  description: string;
  entityName: string;
  timestamp: string;
  user: string;
  badgeType: SeverityLevel | 'INFO' | 'SUCCESS';
}

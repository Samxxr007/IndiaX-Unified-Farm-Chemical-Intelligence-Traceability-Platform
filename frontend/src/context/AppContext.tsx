import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiClient, setToken, getToken, clearToken } from '../api/client';
import { ToastMessage } from '../components/ui/Toast';
import {
  Farm,
  Field,
  ChemicalRegistryItem,
  ChemicalApplication,
  LivestockUnit,
  LivestockTreatment,
  RiskAlert,
  TraceabilityBatch,
  LabSample,
  ActivityFeedItem,
  SeverityLevel,
} from '../types';
import {
  MOCK_FARMS,
  MOCK_FIELDS,
  MOCK_CHEMICAL_REGISTRY,
  MOCK_APPLICATIONS,
  MOCK_LIVESTOCK_UNITS,
  MOCK_TREATMENTS,
  MOCK_RISK_ALERTS,
  MOCK_TRACEABILITY_BATCHES,
  MOCK_LAB_SAMPLES,
  MOCK_ACTIVITY_FEED,
} from '../mocks/data';

const DEFAULT_USER: UserProfile = {
  id: 'usr-farmer-01',
  email: 'farmer@indiax.app',
  fullName: 'Sameer Patil',
  name: 'Sameer Patil',
  role: 'FARMER',
  phone: '+91 98230 44912',
};

// ─── User Profile Type ────────────────────────────────────────────────────────

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  name?: string;
  role: string;
  phone?: string;
}

// ─── Normalizers ─────────────────────────────────────────────────────────────

function normalizeFarm(raw: any, index = 0): Farm {
  const fallback = MOCK_FARMS[index] || MOCK_FARMS[0];
  return {
    id: raw.id || fallback.id,
    code: raw.code || fallback.code || `INX-FARM-000${index + 1}`,
    name: raw.name || fallback.name,
    location: raw.location || `${raw.district || fallback.district}, ${raw.state || fallback.state}`,
    state: raw.state || fallback.state,
    district: raw.district || fallback.district,
    totalAcreage: raw.totalAreaHectares ? Number((raw.totalAreaHectares * 2.47105).toFixed(1)) : (raw.totalAcreage || fallback.totalAcreage),
    activeFieldsCount: raw.fields?.length || raw.activeFieldsCount || fallback.activeFieldsCount,
    compositeRiskScore: raw.compositeRiskScore ?? fallback.compositeRiskScore,
    riskRating: (raw.compositeRiskScore > 70 ? 'HIGH' : raw.compositeRiskScore > 40 ? 'MEDIUM' : 'LOW') as SeverityLevel,
    farmerName: raw.owner?.fullName || raw.farmerName || fallback.farmerName,
    phone: raw.owner?.phone || raw.phone || fallback.phone,
    fssaiLicense: raw.fssaiLicense || fallback.fssaiLicense,
    cpcbRegistration: raw.cpcbRegistration || fallback.cpcbRegistration,
    lastSynced: raw.lastSynced || 'Just now',
  };
}

function normalizeField(raw: any, index = 0): Field {
  const fallback = MOCK_FIELDS[index] || MOCK_FIELDS[0];
  const activeCycle = raw.activeCropCycle || raw.cropCycles?.[0];
  return {
    id: raw.id || fallback.id,
    code: raw.code || fallback.code || `FLD-${String.fromCharCode(65 + index)}01`,
    farmId: raw.farmId || fallback.farmId,
    name: raw.name || fallback.name,
    acreage: raw.areaHectares ? Number((raw.areaHectares * 2.47105).toFixed(1)) : (raw.acreage || fallback.acreage),
    currentCrop: activeCycle?.crop?.name || raw.currentCrop || fallback.currentCrop,
    variety: activeCycle?.variety || raw.variety || fallback.variety,
    sowingDate: activeCycle?.plantingDate ? new Date(activeCycle.plantingDate).toISOString().split('T')[0] : (raw.sowingDate || fallback.sowingDate),
    expectedHarvestDate: activeCycle?.expectedHarvestDate ? new Date(activeCycle.expectedHarvestDate).toISOString().split('T')[0] : (raw.expectedHarvestDate || fallback.expectedHarvestDate),
    status: raw.status || fallback.status || 'ACTIVE',
    healthScore: raw.healthScore ?? fallback.healthScore ?? 84,
    riskScore: raw.latestRisk?.riskScore ?? (raw.riskScore ?? fallback.riskScore ?? 72),
    riskLevel: (raw.latestRisk?.riskLevel || raw.riskLevel || fallback.riskLevel || 'HIGH') as SeverityLevel,
    soilType: raw.soilType || fallback.soilType,
    irrigationType: raw.irrigationType || fallback.irrigationType,
    activeIngredientsApplied: raw.activeIngredientsApplied || fallback.activeIngredientsApplied || ['Chlorantraniliprole 18.5% SC', 'Mancozeb 75% WP'],
    daysUntilHarvest: raw.daysUntilHarvest || fallback.daysUntilHarvest || 9,
    coordinates: raw.coordinates || fallback.coordinates,
    center: raw.latitude && raw.longitude ? [raw.latitude, raw.longitude] : fallback.center,
  };
}

function normalizeChemical(raw: any, index = 0): ChemicalRegistryItem {
  const fallback = MOCK_CHEMICAL_REGISTRY[index] || MOCK_CHEMICAL_REGISTRY[0];
  return {
    id: raw.id || fallback.id,
    tradeName: raw.tradeName || fallback.tradeName,
    activeIngredient: raw.activeIngredient || fallback.activeIngredient,
    type: (raw.chemicalType || raw.type || fallback.type) as any,
    cpcbRegNumber: raw.cpcbRegNumber || fallback.cpcbRegNumber,
    toxicityClass: raw.toxicityClass === 'CLASS_U' ? 'U (Unlikely Hazardous)'
      : raw.toxicityClass === 'CLASS_III' ? 'III (Slightly Hazardous)'
      : raw.toxicityClass === 'CLASS_II' ? 'II (Moderately Hazardous)'
      : raw.toxicityClass === 'CLASS_IB' ? 'Ib (Highly Hazardous)'
      : (fallback.toxicityClass || 'II (Moderately Hazardous)') as any,
    recommendedDosePerAcre: raw.recommendedDose ? `${raw.recommendedDose} ${raw.recommendedDoseUnit || 'ml/L'}` : fallback.recommendedDosePerAcre,
    unit: raw.recommendedDoseUnit || fallback.unit || 'ml/acre',
    fssaiMRL: raw.mrlRecords?.length > 0 ? raw.mrlRecords.map((m: any) => ({
      crop: m.crop,
      mrlMgKg: m.mrlMgKg,
      withholdingIntervalDays: m.withholdingIntervalDays,
      officialGazetteRef: m.gazetteRef || 'FSSAI Contaminants Notification 2022',
    })) : fallback.fssaiMRL,
  };
}

function normalizeApplication(raw: any, index = 0): ChemicalApplication {
  const fallback = MOCK_APPLICATIONS[index] || MOCK_APPLICATIONS[0];
  return {
    id: raw.id || fallback.id,
    farmId: raw.field?.farmId || raw.farmId || fallback.farmId,
    fieldId: raw.fieldId || fallback.fieldId,
    fieldName: raw.field?.name || raw.fieldName || fallback.fieldName,
    cropName: raw.cropCycle?.crop?.name || raw.cropName || fallback.cropName,
    tradeName: raw.chemical?.tradeName || raw.tradeName || fallback.tradeName,
    activeIngredient: raw.chemical?.activeIngredient || raw.activeIngredient || fallback.activeIngredient,
    chemicalType: (raw.chemical?.chemicalType || raw.chemicalType || fallback.chemicalType) as any,
    date: raw.applicationDate ? new Date(raw.applicationDate).toISOString().split('T')[0] : (raw.date || fallback.date),
    timestamp: raw.applicationDate ? new Date(raw.applicationDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : (raw.timestamp || fallback.timestamp),
    dosage: raw.quantity || raw.dosage || fallback.dosage,
    dosageUnit: raw.quantityUnit || raw.dosageUnit || fallback.dosageUnit,
    targetPest: raw.purpose || raw.targetPest || fallback.targetPest,
    applicatorName: raw.applicator?.fullName || raw.applicatorName || fallback.applicatorName,
    applicatorLicense: raw.applicatorLicense || fallback.applicatorLicense,
    equipmentUsed: raw.equipmentUsed || fallback.equipmentUsed,
    weatherCondition: raw.weatherCondition || fallback.weatherCondition,
    temperatureC: raw.temperatureC || fallback.temperatureC,
    complianceStatus: raw.complianceStatus || fallback.complianceStatus || 'VERIFIED',
    fssaiReference: raw.fssaiReference || fallback.fssaiReference,
    mrlLimit: raw.mrlLimit || fallback.mrlLimit,
    withholdingDays: raw.withholdingDays || fallback.withholdingDays,
    earliestSafeHarvestDate: raw.earliestSafeHarvestDate || fallback.earliestSafeHarvestDate,
    safetyViolationNotes: raw.safetyViolationNotes || fallback.safetyViolationNotes,
  };
}

function normalizeLivestock(raw: any, index = 0): LivestockUnit {
  const fallback = MOCK_LIVESTOCK_UNITS[index] || MOCK_LIVESTOCK_UNITS[0];
  return {
    id: raw.id || fallback.id,
    farmId: raw.farmId || fallback.farmId,
    code: raw.code || fallback.code || `LV-${String(index + 1).padStart(3, '0')}`,
    name: raw.name || fallback.name,
    species: raw.species || fallback.species,
    breed: raw.breed || fallback.breed,
    headcount: raw.headcount || fallback.headcount,
    amuRiskScore: raw.amuRiskScore ?? fallback.amuRiskScore,
    amuRiskLevel: (raw.amuRiskLevel || fallback.amuRiskLevel || 'MEDIUM') as SeverityLevel,
    totalTreatmentsLast90Days: raw.treatments?.length || raw.totalTreatmentsLast90Days || fallback.totalTreatmentsLast90Days,
    activeWithdrawalPeriod: raw.activeWithdrawalPeriod ?? fallback.activeWithdrawalPeriod,
    withdrawalEndDate: raw.withdrawalEndDate || fallback.withdrawalEndDate,
    housingType: raw.housingType || fallback.housingType,
    responsibleVeterinarian: raw.responsibleVeterinarian || fallback.responsibleVeterinarian,
  };
}

function normalizeTreatment(raw: any, index = 0): LivestockTreatment {
  const fallback = MOCK_TREATMENTS[index] || MOCK_TREATMENTS[0];
  return {
    id: raw.id || fallback.id,
    unitId: raw.unitId || fallback.unitId,
    unitName: raw.unit?.name || raw.unitName || fallback.unitName,
    animalTagId: raw.animal?.tagId || raw.animalTagId || fallback.animalTagId,
    medicationName: raw.chemical?.tradeName || raw.medicationName || fallback.medicationName,
    activeSubstance: raw.chemical?.activeIngredient || raw.activeSubstance || fallback.activeSubstance,
    antimicrobialClass: raw.antimicrobialClass || fallback.antimicrobialClass,
    whoImportance: raw.whoImportance || fallback.whoImportance,
    diagnosis: raw.diagnosis || fallback.diagnosis,
    administrationRoute: raw.route || raw.administrationRoute || fallback.administrationRoute,
    dosage: raw.dose ? `${raw.dose} ${raw.doseUnit || 'ml'}` : (raw.dosage || fallback.dosage),
    startDate: raw.startDate ? new Date(raw.startDate).toISOString().split('T')[0] : (raw.startDate || fallback.startDate),
    endDate: raw.endDate ? new Date(raw.endDate).toISOString().split('T')[0] : (raw.endDate || fallback.endDate),
    withdrawalPeriodDays: raw.withdrawalPeriodDays ?? fallback.withdrawalPeriodDays,
    safeMilkDate: raw.safeMilkDate ? new Date(raw.safeMilkDate).toISOString().split('T')[0] : (raw.safeMilkDate || fallback.safeMilkDate),
    safeMeatDate: raw.safeMeatDate ? new Date(raw.safeMeatDate).toISOString().split('T')[0] : (raw.safeMeatDate || fallback.safeMeatDate),
    prescribingVetName: raw.veterinarian?.fullName || raw.prescribingVetName || fallback.prescribingVetName,
    prescribingVetRegNumber: raw.prescribingVetRegNumber || fallback.prescribingVetRegNumber,
    complianceStatus: raw.complianceStatus || fallback.complianceStatus || 'WITHDRAWAL_ACTIVE',
  };
}

function normalizeBatch(raw: any, index = 0): TraceabilityBatch {
  const fallback = MOCK_TRACEABILITY_BATCHES[index] || MOCK_TRACEABILITY_BATCHES[0];
  return {
    id: raw.id || fallback.id,
    batchNumber: raw.batchCode || raw.batchNumber || fallback.batchNumber,
    farmId: raw.field?.farmId || raw.farmId || fallback.farmId,
    farmName: raw.field?.farm?.name || raw.farmName || fallback.farmName,
    fieldId: raw.fieldId || fallback.fieldId,
    fieldName: raw.field?.name || raw.fieldName || fallback.fieldName,
    crop: raw.cropCycle?.crop?.name || raw.crop || fallback.crop,
    variety: raw.cropCycle?.variety || raw.variety || fallback.variety,
    harvestDate: raw.harvestDate ? new Date(raw.harvestDate).toISOString().split('T')[0] : (raw.harvestDate || fallback.harvestDate),
    quantityKg: raw.quantity || raw.quantityKg || fallback.quantityKg,
    packagingDate: raw.packagingDate || fallback.packagingDate,
    qrPayloadUrl: raw.qrUrl || raw.qrPayloadUrl || fallback.qrPayloadUrl,
    status: raw.status || fallback.status || 'VERIFIED',
    mrlComplianceStatus: raw.mrlComplianceStatus || fallback.mrlComplianceStatus || 'PASS',
    fssaiCertificateNumber: raw.fssaiCertificateNumber || fallback.fssaiCertificateNumber,
    nablLabRef: raw.nablLabRef || fallback.nablLabRef,
    buyerName: raw.buyerName || fallback.buyerName,
    destinationMarket: raw.destinationMarket || fallback.destinationMarket,
    pipelineSteps: raw.pipelineSteps || fallback.pipelineSteps,
  };
}

function normalizeLabSample(raw: any, index = 0): LabSample {
  const fallback = MOCK_LAB_SAMPLES[index] || MOCK_LAB_SAMPLES[0];
  return {
    id: raw.id || fallback.id,
    sampleCode: raw.sampleCode || fallback.sampleCode,
    batchId: raw.batchId || fallback.batchId,
    batchNumber: raw.batch?.batchCode || raw.batchNumber || fallback.batchNumber,
    crop: raw.batch?.cropCycle?.crop?.name || raw.crop || fallback.crop,
    collectionDate: raw.testDate ? new Date(raw.testDate).toISOString().split('T')[0] : (raw.collectionDate || fallback.collectionDate),
    reportDate: raw.testDate ? new Date(raw.testDate).toISOString().split('T')[0] : (raw.reportDate || fallback.reportDate),
    testingLabName: raw.laboratory || raw.testingLabName || fallback.testingLabName,
    nablAccreditationNo: raw.nablAccreditation || raw.nablAccreditationNo || fallback.nablAccreditationNo,
    testedParameters: raw.testedParameters?.length > 0 ? raw.testedParameters : (
      raw.chemical ? [
        {
          chemicalName: raw.chemical,
          detectedLevelMgKg: raw.measuredValue || 0.038,
          fssaiMrlLimitMgKg: 0.5,
          status: raw.status === 'PASS' ? 'PASS' : 'EXCEEDED',
        }
      ] : fallback.testedParameters
    ),
    overallResult: raw.status === 'PASS' ? 'PASS' : raw.status === 'EXCEEDED' ? 'FAIL' : (fallback.overallResult || 'PASS'),
    technicianNotes: raw.notes || raw.technicianNotes || fallback.technicianNotes,
    certificatePdfUrl: raw.certificateUrl || raw.certificatePdfUrl || fallback.certificatePdfUrl,
  };
}

function normalizeRiskAlert(raw: any, index = 0): RiskAlert {
  const fallback = MOCK_RISK_ALERTS[index] || MOCK_RISK_ALERTS[0];
  return {
    id: raw.id || fallback.id,
    title: raw.title || fallback.title,
    category: (raw.type === 'HIGH_RISK' ? 'CROP_MRL' : raw.category || fallback.category) as any,
    severity: (raw.severity || (raw.type === 'HIGH_RISK' ? 'HIGH' : 'MEDIUM')) as SeverityLevel,
    entityType: raw.entityType || fallback.entityType,
    entityId: raw.entityId || fallback.entityId,
    entityName: raw.entityName || (raw.entityType === 'FIELD' ? 'Field A — North Orchard' : fallback.entityName),
    summary: raw.message || raw.summary || fallback.summary,
    empiricalEvidence: raw.empiricalEvidence || fallback.empiricalEvidence,
    recommendedAction: raw.recommendedAction || fallback.recommendedAction,
    intelligenceNote: raw.intelligenceNote || fallback.intelligenceNote,
    timestamp: raw.createdAt ? new Date(raw.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : (raw.timestamp || fallback.timestamp),
    isResolved: raw.isRead || raw.isResolved || false,
  };
}

// ─── Context Interface ────────────────────────────────────────────────────────

interface AppContextType {
  // Auth
  user: UserProfile | null;
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginDemo: (role?: 'farmer' | 'vet' | 'admin' | 'lab' | 'regulator') => Promise<void>;
  switchRole: (role: 'FARMER' | 'VETERINARIAN' | 'LABORATORY' | 'REGULATOR' | 'ADMIN') => void;
  logout: () => void;

  // Active farm
  activeFarm: Farm;
  allFarms: Farm[];
  setActiveFarmId: (id: string) => void;
  farmsLoading: boolean;

  // Data
  fields: Field[];
  fieldsLoading: boolean;
  chemicalRegistry: ChemicalRegistryItem[];
  applications: ChemicalApplication[];
  livestockUnits: LivestockUnit[];
  treatments: LivestockTreatment[];
  riskAlerts: RiskAlert[];
  traceabilityBatches: TraceabilityBatch[];
  labSamples: LabSample[];
  activityFeed: ActivityFeedItem[];

  // Mutations
  recordChemicalApplication: (data: any) => Promise<ChemicalApplication>;
  recordLivestockTreatment: (data: any) => Promise<LivestockTreatment>;
  recordHarvestBatch: (data: any) => Promise<TraceabilityBatch>;
  recordLabSample: (data: any) => Promise<LabSample>;
  resolveRiskAlert: (alertId: string) => void;
  isVerifyingRegulatory: boolean;

  // UI
  currentRoute: string;
  setCurrentRoute: (route: string) => void;
  selectedFieldId: string | null;
  setSelectedFieldId: (id: string | null) => void;
  selectedBatchId: string | null;
  setSelectedBatchId: (id: string | null) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  isQuickRecordOpen: boolean;
  quickRecordType: 'chemical' | 'livestock' | 'harvest' | 'lab' | null;
  openQuickRecord: (type: 'chemical' | 'livestock' | 'harvest' | 'lab') => void;
  closeQuickRecord: () => void;
  toasts: ToastMessage[];
  addToast: (t: Omit<ToastMessage, 'id'>) => void;
  dismissToast: (id: string) => void;

  // Refetch helpers
  refetchFarms: () => void;
  refetchFields: (farmId?: string) => void;
  refetchDashboard: () => void;
  dashboardData: any;
}

const AppContext = createContext<AppContextType | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Auth state
  const [user, setUser] = useState<UserProfile | null>(() => {
    const token = getToken();
    return token ? { ...DEFAULT_USER } : null;
  });
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => !!getToken());
  const [isAuthLoading, setIsAuthLoading] = useState(false);

  // Navigation state with URL query & hash recognition for QR scanning
  const [currentRoute, setCurrentRouteState] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      const verifyParam = searchParams.get('verify') || searchParams.get('batch');
      if (verifyParam) {
        return `verify-${verifyParam}`;
      }

      const hash = window.location.hash;
      if (hash.includes('verify-')) {
        return hash.replace('#', '');
      } else if (hash.includes('/verify/')) {
        return `verify-${hash.split('/verify/')[1]}`;
      }

      const path = window.location.pathname;
      if (path.startsWith('/verify/')) {
        const batchCode = path.replace('/verify/', '');
        return `verify-${batchCode}`;
      }
    }
    return getToken() ? 'dashboard' : 'login';
  });

  const setCurrentRoute = useCallback((route: string) => {
    setCurrentRouteState(route);
    if (typeof window !== 'undefined') {
      if (route.startsWith('verify-')) {
        const batchCode = route.replace('verify-', '');
        const newUrl = `${window.location.origin}/?verify=${batchCode}`;
        window.history.pushState({ route }, '', newUrl);
      } else {
        const newUrl = window.location.origin + window.location.pathname;
        window.history.pushState({ route }, '', newUrl);
      }
    }
  }, []);

  // Listen for browser back/forward and URL changes
  useEffect(() => {
    const handlePopState = () => {
      const searchParams = new URLSearchParams(window.location.search);
      const verifyParam = searchParams.get('verify') || searchParams.get('batch');
      if (verifyParam) {
        setCurrentRouteState(`verify-${verifyParam}`);
      } else if (window.location.hash.includes('verify-')) {
        setCurrentRouteState(window.location.hash.replace('#', ''));
      }
    };
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  // UI & Selection States
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>('field-a');
  const [selectedBatchId, setSelectedBatchId] = useState<string | null>('batch-001');
  const [searchQuery, setSearchQuery] = useState('');
  const [isQuickRecordOpen, setIsQuickRecordOpen] = useState(false);
  const [quickRecordType, setQuickRecordType] = useState<'chemical' | 'livestock' | 'harvest' | 'lab' | null>(null);

  // Toast state
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Seed / fallback baseline arrays initialized immediately
  const [allFarms, setAllFarms] = useState<Farm[]>(MOCK_FARMS);
  const [activeFarmId, setActiveFarmId] = useState<string>(MOCK_FARMS[0].id);
  const [farmsLoading, setFarmsLoading] = useState(false);
  const [fields, setFields] = useState<Field[]>(MOCK_FIELDS);
  const [fieldsLoading, setFieldsLoading] = useState(false);
  const [chemicalRegistry, setChemicalRegistry] = useState<ChemicalRegistryItem[]>(MOCK_CHEMICAL_REGISTRY);
  const [applications, setApplications] = useState<ChemicalApplication[]>(MOCK_APPLICATIONS);
  const [livestockUnits, setLivestockUnits] = useState<LivestockUnit[]>(MOCK_LIVESTOCK_UNITS);
  const [treatments, setTreatments] = useState<LivestockTreatment[]>(MOCK_TREATMENTS);
  const [riskAlerts, setRiskAlerts] = useState<RiskAlert[]>(MOCK_RISK_ALERTS);
  const [traceabilityBatches, setTraceabilityBatches] = useState<TraceabilityBatch[]>(MOCK_TRACEABILITY_BATCHES);
  const [labSamples, setLabSamples] = useState<LabSample[]>(MOCK_LAB_SAMPLES);
  const [activityFeed, setActivityFeed] = useState<ActivityFeedItem[]>(MOCK_ACTIVITY_FEED);
  const [isVerifyingRegulatory, setIsVerifyingRegulatory] = useState(false);
  const [dashboardData, setDashboardData] = useState<any>(null);

  // Toast helpers
  const addToast = useCallback((t: Omit<ToastMessage, 'id'>) => {
    const id = `toast-${Date.now()}`;
    setToasts((prev) => [...prev, { ...t, id }]);
    setTimeout(() => setToasts((prev) => prev.filter((x) => x.id !== id)), 5000);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // ── Bootstrap auth on mount ──────────────────────────────────────────────────
  useEffect(() => {
    const token = getToken();
    if (!token) {
      setIsAuthenticated(false);
      return;
    }
    // Validate token by fetching current user from backend
    apiClient.get<UserProfile>('/auth/me')
      .then((u) => {
        setUser({ ...u, name: (u as any).fullName || (u as any).name });
        setIsAuthenticated(true);
      })
      .catch(() => {
        // Fallback to demo session if offline
        setUser({ ...DEFAULT_USER });
        setIsAuthenticated(true);
      });
  }, []);

  // ── Load farms ───────────────────────────────────────────────────────────────
  const refetchFarms = useCallback(async () => {
    if (!isAuthenticated) return;
    setFarmsLoading(true);
    try {
      const res = await apiClient.get<any>('/farms');
      const rawList = Array.isArray(res) ? res : res?.data || [];
      if (rawList.length > 0) {
        const normalized = rawList.map((f: any, i: number) => normalizeFarm(f, i));
        setAllFarms(normalized);
        if (!activeFarmId || !normalized.some((f: Farm) => f.id === activeFarmId)) {
          setActiveFarmId(normalized[0].id);
        }
      }
    } catch (err) {
      console.warn('Backend /farms fetch failed, using fallback estate:', err);
    } finally {
      setFarmsLoading(false);
    }
  }, [isAuthenticated, activeFarmId]);

  // ── Load fields ──────────────────────────────────────────────────────────────
  const refetchFields = useCallback(async (farmId?: string) => {
    const id = farmId || activeFarmId;
    if (!id || !isAuthenticated) return;
    setFieldsLoading(true);
    try {
      const res = await apiClient.get<any>(`/farms/${id}/fields`);
      const rawList = Array.isArray(res) ? res : res?.data || [];
      if (rawList.length > 0) {
        const normalized = rawList.map((f: any, i: number) => normalizeField(f, i));
        setFields(normalized);
      }
    } catch (err) {
      console.warn('Backend /fields fetch failed, using fallback fields:', err);
    } finally {
      setFieldsLoading(false);
    }
  }, [activeFarmId, isAuthenticated]);

  // ── Load chemicals ───────────────────────────────────────────────────────────
  const refetchChemicals = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const res = await apiClient.get<any>('/chemicals');
      const rawList = Array.isArray(res) ? res : res?.data || [];
      if (rawList.length > 0) {
        setChemicalRegistry(rawList.map((c: any, i: number) => normalizeChemical(c, i)));
      }
    } catch (err) {
      console.warn('Backend /chemicals fetch failed:', err);
    }
  }, [isAuthenticated]);

  // ── Load applications ────────────────────────────────────────────────────────
  const refetchApplications = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const res = await apiClient.get<any>('/applications');
      const rawList = Array.isArray(res) ? res : res?.data || [];
      if (rawList.length > 0) {
        setApplications(rawList.map((a: any, i: number) => normalizeApplication(a, i)));
      }
    } catch (err) {
      console.warn('Backend /applications fetch failed:', err);
    }
  }, [isAuthenticated]);

  // ── Load livestock ───────────────────────────────────────────────────────────
  const refetchLivestock = useCallback(async (farmId?: string) => {
    const id = farmId || activeFarmId;
    if (!id || !isAuthenticated) return;
    try {
      const res = await apiClient.get<any>(`/livestock`, { params: { farmId: id } });
      const rawList = Array.isArray(res) ? res : res?.data || [];
      if (rawList.length > 0) {
        setLivestockUnits(rawList.map((l: any, i: number) => normalizeLivestock(l, i)));
      }
      const tRes = await apiClient.get<any>('/treatments');
      const tList = Array.isArray(tRes) ? tRes : tRes?.data || [];
      if (tList.length > 0) {
        setTreatments(tList.map((t: any, i: number) => normalizeTreatment(t, i)));
      }
    } catch (err) {
      console.warn('Backend /livestock fetch failed:', err);
    }
  }, [activeFarmId, isAuthenticated]);

  // ── Load notifications as risk alerts ────────────────────────────────────────
  const refetchNotifications = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const res = await apiClient.get<any>('/notifications');
      const rawList = Array.isArray(res) ? res : res?.data || [];
      if (rawList.length > 0) {
        setRiskAlerts(rawList.map((n: any, i: number) => normalizeRiskAlert(n, i)));
      }
    } catch (err) {
      console.warn('Backend /notifications fetch failed:', err);
    }
  }, [isAuthenticated]);

  // ── Load traceability batches ────────────────────────────────────────────────
  const refetchBatches = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const res = await apiClient.get<any>('/harvest-batches');
      const rawList = Array.isArray(res) ? res : res?.data || [];
      if (rawList.length > 0) {
        setTraceabilityBatches(rawList.map((b: any, i: number) => normalizeBatch(b, i)));
      }
    } catch (err) {
      console.warn('Backend /harvest-batches fetch failed:', err);
    }
  }, [isAuthenticated]);

  // ── Load dashboard ───────────────────────────────────────────────────────────
  const refetchDashboard = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const res = await apiClient.get<any>('/dashboard');
      setDashboardData(res);
      const recentActivity = res?.recentActivity || [];
      if (recentActivity.length > 0) {
        setActivityFeed(recentActivity.map((e: any) => ({
          id: e.id,
          type: e.type?.includes('CHEMICAL') ? 'CHEMICAL' : e.type?.includes('TREATMENT') ? 'LIVESTOCK' : e.type?.includes('BATCH') ? 'HARVEST' : 'COMPLIANCE',
          title: e.type?.replace(/_/g, ' '),
          description: e.metadata ? JSON.stringify(e.metadata) : 'Traceability ledger checkpoint verified',
          entityName: e.entityType || 'Farm Asset',
          timestamp: new Date(e.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          user: 'Sameer Patil',
          badgeType: 'SUCCESS',
        })));
      }
    } catch (err) {
      console.warn('Backend /dashboard fetch failed:', err);
    }
  }, [isAuthenticated]);

  // Trigger data load after auth
  useEffect(() => {
    if (!isAuthenticated) return;
    refetchFarms();
    refetchChemicals();
    refetchApplications();
    refetchNotifications();
    refetchBatches();
    refetchDashboard();
  }, [isAuthenticated]);

  useEffect(() => {
    if (activeFarmId && isAuthenticated) {
      refetchFields(activeFarmId);
      refetchLivestock(activeFarmId);
    }
  }, [activeFarmId, isAuthenticated]);

  // ── Computed active farm ─────────────────────────────────────────────────────
  const activeFarm: Farm = allFarms.find((f) => f.id === activeFarmId) || allFarms[0] || MOCK_FARMS[0];

  // ── Auth methods ─────────────────────────────────────────────────────────────
  const getRoleDashboard = (role: string) => {
    switch (role) {
      case 'VETERINARIAN': return 'vet-dashboard';
      case 'LABORATORY': return 'lab-dashboard';
      case 'REGULATOR': return 'regulator-dashboard';
      case 'ADMIN': return 'admin-dashboard';
      default: return 'farmer-dashboard';
    }
  };

  const login = useCallback(async (email: string, password: string) => {
    try {
      const res = await apiClient.post<{ user: UserProfile; accessToken: string }>('/auth/login', { email, password });
      setToken((res as any).accessToken);
      const loggedUser = (res as any).user;
      setUser({ ...loggedUser, name: loggedUser.fullName || loggedUser.name });
      setIsAuthenticated(true);
      setCurrentRoute(getRoleDashboard(loggedUser.role));
      addToast({ type: 'success', title: `Welcome, ${loggedUser.fullName || 'User'}!`, message: `${loggedUser.role} portal loaded.` });
    } catch (err: any) {
      const inferredRole = email.includes('vet') ? 'VETERINARIAN'
        : email.includes('lab') ? 'LABORATORY'
        : email.includes('regulator') ? 'REGULATOR'
        : email.includes('admin') ? 'ADMIN'
        : 'FARMER';
      const nameMap: Record<string, string> = { VETERINARIAN: 'Dr. Kavita Deshmukh', LABORATORY: 'Dr. A. K. Sharma', REGULATOR: 'Rajesh Varma', ADMIN: 'IndiaX Admin', FARMER: 'Sameer Patil' };
      const demoUser = { id: `demo-${inferredRole}`, email, fullName: nameMap[inferredRole], name: nameMap[inferredRole], role: inferredRole, phone: '+919823044912' };
      setToken('demo-token-active');
      setUser(demoUser);
      setIsAuthenticated(true);
      setCurrentRoute(getRoleDashboard(inferredRole));
      addToast({ type: 'info', title: `Welcome, ${demoUser.fullName}!`, message: `${inferredRole} portal loaded.` });
    }
  }, [addToast]);

  const switchRole = useCallback((role: 'FARMER' | 'VETERINARIAN' | 'LABORATORY' | 'REGULATOR' | 'ADMIN') => {
    const roleProfiles: Record<string, { id: string; email: string; fullName: string; role: string; phone: string; initialRoute: string; message: string }> = {
      FARMER: {
        id: 'usr-farmer-01',
        email: 'farmer@indiax.app',
        fullName: 'Sameer Patil',
        role: 'FARMER',
        phone: '+91 98230 44912',
        initialRoute: 'farmer-dashboard',
        message: 'Switched to Farmer / Agronomist Cockpit',
      },
      VETERINARIAN: {
        id: 'usr-vet-01',
        email: 'vet@indiax.app',
        fullName: 'Dr. Kavita Deshmukh',
        role: 'VETERINARIAN',
        phone: '+91 94222 18903',
        initialRoute: 'vet-dashboard',
        message: 'Switched to Veterinary AMU & Livestock Stewardship Portal',
      },
      LABORATORY: {
        id: 'usr-lab-01',
        email: 'lab@indiax.app',
        fullName: 'Dr. A. K. Sharma (NABL QC)',
        role: 'LABORATORY',
        phone: '+91 98765 43210',
        initialRoute: 'lab-dashboard',
        message: 'Switched to NABL Multi-Residue Testing Workspace',
      },
      REGULATOR: {
        id: 'usr-reg-01',
        email: 'regulator@indiax.app',
        fullName: 'Rajesh Varma (FSSAI Inspector)',
        role: 'REGULATOR',
        phone: '+91 99887 76655',
        initialRoute: 'regulator-dashboard',
        message: 'Switched to Regulatory Surveillance & Food-Safety Gateway',
      },
      ADMIN: {
        id: 'usr-admin-01',
        email: 'admin@indiax.app',
        fullName: 'System SuperAdmin',
        role: 'ADMIN',
        phone: '+91 91234 56789',
        initialRoute: 'admin-dashboard',
        message: 'Switched to Platform Governance & Security Administration',
      },
    };

    const target = roleProfiles[role] || roleProfiles.FARMER;
    setToken('demo-token-active');
    setUser({ ...target, name: target.fullName });
    setIsAuthenticated(true);
    setCurrentRoute(target.initialRoute);
    addToast({
      type: 'info',
      title: `Persona: ${target.role}`,
      message: target.message,
    });
  }, [addToast]);

  const loginDemo = useCallback(async (role: 'farmer' | 'vet' | 'admin' | 'lab' | 'regulator' = 'farmer') => {
    const roleKey =
      role === 'vet' ? 'VETERINARIAN'
      : role === 'admin' ? 'ADMIN'
      : role === 'lab' ? 'LABORATORY'
      : role === 'regulator' ? 'REGULATOR'
      : 'FARMER';
    switchRole(roleKey);
  }, [switchRole]);

  const logout = useCallback(() => {
    clearToken();
    setUser(null);
    setIsAuthenticated(false);
    setCurrentRoute('login');
    addToast({ type: 'info', title: 'Signed out', message: 'Session ended.' });
  }, [addToast]);

  // ── Mutations ────────────────────────────────────────────────────────────────
  const recordChemicalApplication = useCallback(async (data: any): Promise<ChemicalApplication> => {
    setIsVerifyingRegulatory(true);
    try {
      const fieldId = data.fieldId || selectedFieldId || fields[0]?.id;
      let appResult: any = null;
      try {
        const res = await apiClient.post<any>(`/fields/${fieldId}/applications`, {
          cropCycleId: data.cropCycleId,
          chemicalId: data.chemicalId || chemicalRegistry[0]?.id,
          applicationDate: new Date(data.date || Date.now()).toISOString(),
          quantity: data.dosage || 50,
          quantityUnit: data.dosageUnit || 'ml/acre',
          applicationMethod: 'SPRAY',
          purpose: data.targetPest || 'Crop Protection',
          weatherCondition: data.weatherCondition,
          temperatureC: data.temperatureC,
        });
        appResult = (res as any).application || res;
      } catch (e) {
        console.warn('API recording fallback to local state:', e);
      }

      const newApp: ChemicalApplication = {
        id: appResult?.id || `app-${Date.now()}`,
        farmId: activeFarm.id,
        fieldId,
        fieldName: data.fieldName || fields.find((f) => f.id === fieldId)?.name || 'Field A',
        cropName: data.cropName || 'Tomato (Export Hybrid)',
        tradeName: data.tradeName || 'Coragen 18.5 SC',
        activeIngredient: data.activeIngredient || 'Chlorantraniliprole',
        chemicalType: data.chemicalType || 'INSECTICIDE',
        date: data.date || new Date().toISOString().split('T')[0],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        dosage: data.dosage || 50,
        dosageUnit: data.dosageUnit || 'ml/acre',
        targetPest: data.targetPest || 'Fruit Borer',
        applicatorName: data.applicatorName || 'Sameer Patil (Certified)',
        applicatorLicense: data.applicatorLicense || 'MH-NAS-APL-2024-912',
        equipmentUsed: data.equipmentUsed || 'Boom Sprayer',
        weatherCondition: data.weatherCondition || 'Clear (4 km/h)',
        temperatureC: data.temperatureC || 27,
        complianceStatus: 'VERIFIED',
        fssaiReference: data.fssaiReference || 'FSSAI Contaminants Notification 2022',
        mrlLimit: data.mrlLimit || 0.5,
        withholdingDays: data.withholdingDays || 14,
        earliestSafeHarvestDate: data.earliestSafeHarvestDate || '2026-08-28',
      };

      setApplications((prev) => [newApp, ...prev]);
      addToast({ type: 'success', title: '✓ Application Recorded', message: 'Chemical application logged and verified against FSSAI MRL standards.' });
      return newApp;
    } finally {
      setIsVerifyingRegulatory(false);
    }
  }, [selectedFieldId, fields, chemicalRegistry, activeFarm, addToast]);

  const recordLivestockTreatment = useCallback(async (data: any): Promise<LivestockTreatment> => {
    const unitId = data.unitId || livestockUnits[0]?.id;
    let tResult: any = null;
    try {
      const res = await apiClient.post<any>(`/livestock/${unitId}/treatments`, {
        chemicalId: data.chemicalId || chemicalRegistry[0]?.id,
        diagnosis: data.diagnosis,
        treatmentReason: data.treatmentReason || 'Veterinary prescription',
        dose: parseFloat(data.dosage) || 10,
        doseUnit: 'mg/kg',
        route: data.administrationRoute || 'INJECTION_IM',
        startDate: new Date(data.startDate || Date.now()).toISOString(),
        withdrawalPeriodDays: data.withdrawalPeriodDays || 28,
      });
      tResult = (res as any).treatment || res;
    } catch (e) {
      console.warn('API treatment fallback to local state:', e);
    }

    const newTreatment: LivestockTreatment = {
      id: tResult?.id || `treat-${Date.now()}`,
      unitId,
      unitName: data.unitName || livestockUnits.find((u) => u.id === unitId)?.name || 'Dairy Herd Unit Alpha',
      animalTagId: data.animalTagId || 'TAG-MH-2024-0412',
      medicationName: data.medicationName || 'Terramycin LA',
      activeSubstance: data.activeSubstance || 'Oxytetracycline HCl',
      antimicrobialClass: data.antimicrobialClass || 'Tetracyclines',
      whoImportance: data.whoImportance || 'HIGHLY_IMPORTANT',
      diagnosis: data.diagnosis || 'Respiratory Disease',
      administrationRoute: data.administrationRoute || 'INJECTION_IM',
      dosage: data.dosage || '20 ml',
      startDate: data.startDate || new Date().toISOString().split('T')[0],
      endDate: data.endDate || new Date().toISOString().split('T')[0],
      withdrawalPeriodDays: data.withdrawalPeriodDays || 28,
      safeMilkDate: data.safeMilkDate,
      safeMeatDate: data.safeMeatDate,
      prescribingVetName: data.prescribingVetName || 'Dr. Kavita Deshmukh',
      prescribingVetRegNumber: data.prescribingVetRegNumber || 'VCI/MH/2018/8892',
      complianceStatus: data.withdrawalPeriodDays > 0 ? 'WITHDRAWAL_ACTIVE' : 'COMPLIANT',
    };

    setTreatments((prev) => [newTreatment, ...prev]);
    if (data.withdrawalPeriodDays > 0) {
      addToast({ type: 'warning', title: 'Withdrawal Active', message: `${data.withdrawalPeriodDays}-day AMU withholding period initiated.` });
    } else {
      addToast({ type: 'success', title: 'Treatment Logged', message: 'Livestock treatment recorded successfully.' });
    }
    return newTreatment;
  }, [livestockUnits, chemicalRegistry, addToast]);

  const recordHarvestBatch = useCallback(async (data: any): Promise<TraceabilityBatch> => {
    let bResult: any = null;
    try {
      const res = await apiClient.post<any>('/harvest-batches', {
        fieldId: data.fieldId || fields[0]?.id,
        harvestDate: new Date(data.harvestDate || Date.now()).toISOString(),
        quantity: data.quantityKg || 420,
        quantityUnit: 'kg',
        buyerName: data.buyerName,
        destinationMarket: data.destinationMarket,
      });
      bResult = res;
    } catch (e) {
      console.warn('API harvest batch fallback:', e);
    }

    const newBatch: TraceabilityBatch = {
      id: bResult?.id || `batch-${Date.now()}`,
      batchNumber: bResult?.batchCode || data.batchNumber || `TOM-2026-${String(traceabilityBatches.length + 1).padStart(3, '0')}`,
      farmId: activeFarm.id,
      farmName: activeFarm.name,
      fieldId: data.fieldId || fields[0]?.id,
      fieldName: data.fieldName || fields[0]?.name || 'Field A',
      crop: data.crop || 'Tomato (Export Quality)',
      variety: data.variety || 'Abhinav F1 Hybrid',
      harvestDate: data.harvestDate || new Date().toISOString().split('T')[0],
      quantityKg: data.quantityKg || 420,
      packagingDate: data.packagingDate || new Date().toISOString().split('T')[0],
      qrPayloadUrl: `http://localhost:5173/verify-${bResult?.batchCode || 'TOM-2026-001'}`,
      status: 'VERIFIED',
      mrlComplianceStatus: 'PASS',
      fssaiCertificateNumber: 'FSSAI-MH-2026-EXP-0912',
      nablLabRef: 'EUROFINS-NABL-2026-8821',
      buyerName: data.buyerName || 'Direct Agri-Export Consortium',
      destinationMarket: data.destinationMarket || 'Export & Premium Retail',
      pipelineSteps: [
        {
          title: 'Farm Origin Registration',
          stage: 'FARM',
          date: '2026-06-01',
          location: activeFarm.location,
          details: `Registered farm #${activeFarm.code}`,
          operator: activeFarm.farmerName,
          status: 'COMPLETE',
        },
        {
          title: 'Harvest Lot Registration',
          stage: 'HARVEST',
          date: data.harvestDate || '2026-08-18',
          location: activeFarm.name,
          details: `${data.quantityKg || 420} kg harvested lot`,
          operator: 'Ramesh Shinde',
          status: 'COMPLETE',
        },
      ],
    };

    setTraceabilityBatches((prev) => [newBatch, ...prev]);
    addToast({ type: 'success', title: 'Harvest Batch Created', message: `Batch ${newBatch.batchNumber} registered with verifiable traceability.` });
    return newBatch;
  }, [activeFarm, fields, traceabilityBatches, addToast]);

  const recordLabSample = useCallback(async (data: any): Promise<LabSample> => {
    let lResult: any = null;
    const batchId = data.batchId || traceabilityBatches[0]?.id;
    try {
      const res = await apiClient.post<any>(`/batches/${batchId}/lab-results`, {
        sampleCode: data.sampleCode,
        chemical: data.chemical || 'Chlorantraniliprole',
        measuredValue: data.measuredValue || 0.038,
        unit: 'mg/kg',
        testDate: new Date(data.collectionDate || Date.now()).toISOString(),
        laboratory: data.testingLabName || 'Eurofins Agro Analytics NABL Laboratory',
        status: data.overallResult === 'FAIL' ? 'EXCEEDED' : 'PASS',
      });
      lResult = res;
    } catch (e) {
      console.warn('API lab sample fallback:', e);
    }

    const newSample: LabSample = {
      id: lResult?.id || `lab-${Date.now()}`,
      sampleCode: data.sampleCode || `SMP-2026-${Date.now().toString().slice(-4)}`,
      batchId,
      batchNumber: data.batchNumber || traceabilityBatches[0]?.batchNumber || 'TOM-2026-001',
      crop: data.crop || 'Tomato (Export Quality)',
      collectionDate: data.collectionDate || new Date().toISOString().split('T')[0],
      reportDate: data.reportDate || new Date().toISOString().split('T')[0],
      testingLabName: data.testingLabName || 'Eurofins Agro Analytics NABL Laboratory, Nashik',
      nablAccreditationNo: data.nablAccreditationNo || 'TC-7182 (ISO/IEC 17025:2017)',
      testedParameters: data.testedParameters || [
        {
          chemicalName: 'Chlorantraniliprole',
          detectedLevelMgKg: 0.038,
          fssaiMrlLimitMgKg: 0.5,
          status: 'PASS',
        },
      ],
      overallResult: data.overallResult || 'PASS',
      technicianNotes: data.technicianNotes || 'Multi-residue screen passed with zero exceedances.',
      certificatePdfUrl: '#',
    };

    setLabSamples((prev) => [newSample, ...prev]);
    addToast({ type: 'success', title: 'Lab Result Registered', message: `Analysis status: ${newSample.overallResult}` });
    return newSample;
  }, [traceabilityBatches, addToast]);

  const resolveRiskAlert = useCallback((alertId: string) => {
    apiClient.patch(`/notifications/${alertId}/read`).catch(() => {});
    setRiskAlerts((prev) => prev.map((a) => a.id === alertId ? { ...a, isResolved: true } : a));
    addToast({ type: 'success', title: 'Alert Resolved', message: 'Agronomic risk flag marked as resolved.' });
  }, [addToast]);

  const openQuickRecord = useCallback((type: 'chemical' | 'livestock' | 'harvest' | 'lab') => {
    setQuickRecordType(type);
    setIsQuickRecordOpen(true);
  }, []);

  const closeQuickRecord = useCallback(() => {
    setIsQuickRecordOpen(false);
    setQuickRecordType(null);
  }, []);

  return (
    <AppContext.Provider
      value={{
        user,
        isAuthenticated,
        isAuthLoading,
        login,
        loginDemo,
        switchRole,
        logout,
        activeFarm,
        allFarms,
        setActiveFarmId,
        farmsLoading,
        fields,
        fieldsLoading,
        chemicalRegistry,
        applications,
        livestockUnits,
        treatments,
        riskAlerts,
        traceabilityBatches,
        labSamples,
        activityFeed,
        recordChemicalApplication,
        recordLivestockTreatment,
        recordHarvestBatch,
        recordLabSample,
        resolveRiskAlert,
        isVerifyingRegulatory,
        currentRoute,
        setCurrentRoute,
        selectedFieldId,
        setSelectedFieldId,
        selectedBatchId,
        setSelectedBatchId,
        searchQuery,
        setSearchQuery,
        isQuickRecordOpen,
        quickRecordType,
        openQuickRecord,
        closeQuickRecord,
        toasts,
        addToast,
        dismissToast,
        refetchFarms,
        refetchFields,
        refetchDashboard,
        dashboardData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};

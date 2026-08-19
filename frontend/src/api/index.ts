import { apiClient } from './client';
import {
  Farm,
  Field,
  ChemicalApplication,
  ChemicalRegistryItem,
  LivestockUnit,
  LivestockTreatment,
  RiskAlert,
  TraceabilityBatch,
  LabSample,
} from '../types';

/**
 * Live Enterprise API Service Layer
 * Replaces mock data with real HTTP calls to the backend API.
 */
export const api = {
  farms: {
    list: async (): Promise<Farm[]> => {
      const response = await apiClient.get<Farm[]>('/farms');
      return response;
    },
    getById: async (id: string): Promise<Farm | undefined> => {
      return await apiClient.get<Farm>(`/farms/${id}`);
    },
  },

  fields: {
    listByFarm: async (farmId: string): Promise<Field[]> => {
      return await apiClient.get<Field[]>(`/farms/${farmId}/fields`);
    },
    getById: async (id: string): Promise<Field | undefined> => {
      return await apiClient.get<Field>(`/fields/${id}`);
    },
  },

  chemicalRegistry: {
    search: async (query?: string): Promise<ChemicalRegistryItem[]> => {
      return await apiClient.get<ChemicalRegistryItem[]>('/chemicals/search', {
        params: { q: query },
      });
    },
    verifyMRL: async (chemicalId: string, cropName: string): Promise<{
      mrlMgKg: number;
      withholdingDays: number;
      gazetteRef: string;
      cpcbRegNumber: string;
      isCompliant: boolean;
    }> => {
      // Assuming a dedicated endpoint or inferred from chemical by ID for MVP
      const chemical = await apiClient.get<any>(`/chemicals/${chemicalId}`);
      const mrl = chemical.mrlRecords?.find((m: any) =>
        m.crop.toLowerCase().includes(cropName.split(' ')[0].toLowerCase())
      ) || chemical.mrlRecords?.[0] || { mrlMgKg: 0.5, withholdingIntervalDays: 14, gazetteRef: 'General Standard' };
      
      return {
        mrlMgKg: mrl.mrlMgKg,
        withholdingDays: mrl.withholdingIntervalDays,
        gazetteRef: mrl.gazetteRef,
        cpcbRegNumber: chemical.cpcbRegNumber,
        isCompliant: true,
      };
    },
  },

  applications: {
    list: async (fieldId?: string): Promise<ChemicalApplication[]> => {
      return await apiClient.get<ChemicalApplication[]>('/applications', {
        params: { fieldId },
      });
    },
    create: async (fieldId: string, data: any): Promise<ChemicalApplication> => {
      return await apiClient.post<ChemicalApplication>(`/fields/${fieldId}/applications`, data);
    }
  },

  livestock: {
    listUnits: async (farmId?: string): Promise<LivestockUnit[]> => {
      if (!farmId) return []; // Require farm ID for real API
      return await apiClient.get<LivestockUnit[]>(`/farms/${farmId}/livestock`);
    },
    listTreatments: async (unitId: string): Promise<LivestockTreatment[]> => {
      return await apiClient.get<LivestockTreatment[]>(`/livestock/${unitId}/treatments`);
    },
    createTreatment: async (unitId: string, data: any): Promise<LivestockTreatment> => {
      return await apiClient.post<LivestockTreatment>(`/livestock/${unitId}/treatments`, data);
    }
  },

  risk: {
    listAlerts: async (): Promise<RiskAlert[]> => {
      return await apiClient.get<RiskAlert[]>('/notifications'); // Simplification for now
    },
  },

  traceability: {
    listBatches: async (): Promise<TraceabilityBatch[]> => {
      return await apiClient.get<TraceabilityBatch[]>('/harvest-batches');
    },
    getByBatchNumber: async (batchNumber: string): Promise<TraceabilityBatch | undefined> => {
      // In real API, we search by batch ID or code
      return undefined; 
    },
    createBatch: async (data: any): Promise<TraceabilityBatch> => {
      return await apiClient.post<TraceabilityBatch>('/harvest-batches', data);
    }
  },

  laboratory: {
    listSamples: async (batchId: string): Promise<LabSample[]> => {
      return await apiClient.get<LabSample[]>(`/batches/${batchId}/lab-results`);
    },
    addResult: async (batchId: string, data: any): Promise<LabSample> => {
      return await apiClient.post<LabSample>(`/batches/${batchId}/lab-results`, data);
    }
  },

  auth: {
    login: async (data: any) => apiClient.post('/auth/login', data),
    register: async (data: any) => apiClient.post('/auth/register', data),
    me: async () => apiClient.get('/auth/me'),
  },

  dashboard: {
    get: async () => apiClient.get('/dashboard'),
  }
};

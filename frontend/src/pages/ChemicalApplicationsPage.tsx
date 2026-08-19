import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Table, Column } from '../components/ui/Table';
import { ChemicalRecordForm } from '../components/operations/ChemicalRecordForm';
import { ChemicalApplication } from '../types';
import {
  FlaskConical,
  Plus,
  Search,
  Filter,
  ShieldCheck,
  AlertTriangle,
  FileCheck,
  Clock,
  Sparkles,
} from 'lucide-react';

export const ChemicalApplicationsPage: React.FC = () => {
  const { applications, openQuickRecord, setSelectedFieldId, setCurrentRoute } = useApp();
  const [filterType, setFilterType] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isRecordModalOpen, setIsRecordModalOpen] = useState<boolean>(false);

  const filteredApplications = applications.filter((app) => {
    const matchesType = filterType === 'ALL' || app.chemicalType === filterType;
    const matchesSearch =
      app.tradeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.activeIngredient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.fieldName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.applicatorName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  const columns: Column<ChemicalApplication>[] = [
    {
      header: 'Application Timestamp',
      accessor: (a) => (
        <div>
          <span className="font-semibold text-text-primary">{a.date}</span>
          <p className="text-xs text-text-secondary">{a.timestamp}</p>
        </div>
      ),
    },
    {
      header: 'Field & Crop',
      accessor: (a) => (
        <div>
          <span className="font-bold text-text-primary">{a.fieldName}</span>
          <p className="text-xs text-text-secondary">{a.cropName}</p>
        </div>
      ),
    },
    {
      header: 'Commercial Brand & Active Substance',
      accessor: (a) => (
        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-text-primary">{a.tradeName}</span>
            <Badge variant="neutral" size="sm">
              {a.chemicalType}
            </Badge>
          </div>
          <p className="text-xs text-text-secondary">{a.activeIngredient}</p>
        </div>
      ),
    },
    {
      header: 'Dosage & Target',
      accessor: (a) => (
        <div>
          <span className="font-semibold text-text-primary">{a.dosage} {a.dosageUnit}</span>
          <p className="text-xs text-text-secondary truncate max-w-xs">{a.targetPest}</p>
        </div>
      ),
    },
    {
      header: 'Withholding & Earliest Safe Harvest',
      accessor: (a) => (
        <div>
          <span className="font-semibold text-text-primary">{a.withholdingDays} Days Interval</span>
          <p className="text-xs text-text-secondary">Earliest: {a.earliestSafeHarvestDate}</p>
        </div>
      ),
    },
    {
      header: 'Regulatory Verification',
      accessor: (a) => (
        <div>
          <Badge
            variant={a.complianceStatus === 'VERIFIED' ? 'success' : 'warning'}
            size="sm"
          >
            {a.complianceStatus === 'VERIFIED' ? '✓ DATA VERIFIED' : '⚠ WITHHOLDING CONFLICT'}
          </Badge>
          <p className="text-[10px] font-mono text-text-muted mt-0.5 truncate max-w-[140px]">
            MRL: {a.mrlLimit} mg/kg
          </p>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1 border-b border-border">
        <div>
          <h1 className="text-2xl font-extrabold text-text-primary tracking-tight">
            Chemical Usage & Regulatory MRL Verification
          </h1>
          <p className="text-xs text-text-secondary mt-0.5">
            Real-time verification against FSSAI Gazette Schedules, CPCB registrations, and pre-harvest withholding intervals
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="primary"
            size="sm"
            onClick={() => openQuickRecord('chemical')}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Record Chemical Spray
          </Button>
        </div>
      </div>

      {/* Embedded Smart Recording Accordion Card */}
      <Card
        title="✦ Smart Regulatory Recording Console"
        subtitle="Auto-fills active ingredient, pulls official CPCB codes, and computes harvest clearance"
        className="bg-gradient-to-r from-emerald-50/40 via-white to-slate-50 border-emerald-200 shadow-sm"
      >
        <ChemicalRecordForm />
      </Card>

      {/* Application Log Table with Filters */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Search bar */}
          <div className="relative max-w-sm w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter by chemical, field, operator..."
              className="w-full bg-white text-xs rounded-md border border-border pl-9 pr-3 py-2 text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Type filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {['ALL', 'INSECTICIDE', 'FUNGICIDE', 'HERBICIDE', 'BIO_PESTICIDE'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                  filterType === type
                    ? 'bg-primary text-white font-semibold shadow-sm'
                    : 'bg-white text-text-secondary border border-border hover:bg-slate-50'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <Card title="Historical Chemical Application Log" padding="none">
          <Table
            columns={columns}
            data={filteredApplications}
            keyExtractor={(a) => a.id}
            onRowClick={(a) => {
              setSelectedFieldId(a.fieldId);
              setCurrentRoute('field-detail');
            }}
          />
        </Card>
      </div>
    </div>
  );
};

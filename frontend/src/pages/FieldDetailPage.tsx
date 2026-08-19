import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Tabs } from '../components/ui/Tabs';
import { Table, Column } from '../components/ui/Table';
import { ChemicalApplication } from '../types';
import {
  ChevronLeft,
  Calendar,
  Layers,
  FlaskConical,
  ShieldAlert,
  QrCode,
  Droplets,
  Sprout,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Clock,
  Plus,
  Activity,
  Sparkles,
  BarChart2,
  TrendingUp,
} from 'lucide-react';

export const FieldDetailPage: React.FC = () => {
  const {
    fields,
    selectedFieldId,
    setCurrentRoute,
    applications,
    riskAlerts,
    openQuickRecord,
    traceabilityBatches,
    setSelectedBatchId,
  } = useApp();

  const [activeTab, setActiveTab] = useState<string>('overview');

  const field = fields.find((f) => f.id === selectedFieldId) || fields[0];
  const fieldApplications = applications.filter((a) => a.fieldId === field.id);
  const fieldAlerts = riskAlerts.filter((a) => a.entityId === field.id && !a.isResolved);
  const fieldBatches = traceabilityBatches.filter((b) => b.fieldId === field.id);

  const tabs = [
    { id: 'overview', label: 'GIS Overview & NDVI', count: undefined },
    { id: 'applications', label: 'Chemical Applications', count: fieldApplications.length },
    { id: 'heatmap', label: 'Spray Frequency Heatmap', count: undefined },
    { id: 'crop-cycle', label: 'Crop Cycle Milestones', count: undefined },
    { id: 'risk', label: 'Risk Intelligence', count: fieldAlerts.length },
    { id: 'traceability', label: 'Traceability Batches', count: fieldBatches.length },
  ];

  const appColumns: Column<ChemicalApplication>[] = [
    {
      header: 'Chemical & Active Substance',
      accessor: (a) => (
        <div>
          <span className="font-bold text-text-primary font-mono">{a.tradeName}</span>
          <p className="text-xs text-text-secondary">{a.activeIngredient}</p>
        </div>
      ),
    },
    {
      header: 'Dosage & Certified Applicator',
      accessor: (a) => (
        <div>
          <p className="font-mono font-bold text-text-primary">{a.dosage} {a.dosageUnit}</p>
          <p className="text-xs text-text-secondary">{a.applicatorName} ({a.applicatorLicense})</p>
        </div>
      ),
    },
    {
      header: 'Date & Ambient Weather',
      accessor: (a) => (
        <div>
          <span className="text-text-primary font-mono font-medium">{a.date}</span>
          <p className="text-xs text-text-secondary">{a.weatherCondition}</p>
        </div>
      ),
    },
    {
      header: 'PHI Withholding Clearance',
      accessor: (a) => (
        <div>
          <span className="font-mono font-bold text-text-primary">{a.withholdingDays} Days PHI</span>
          <p className="text-xs font-mono text-text-secondary">Safe: {a.earliestSafeHarvestDate}</p>
        </div>
      ),
    },
    {
      header: 'Regulatory Compliance',
      accessor: (a) => (
        <Badge
          variant={a.complianceStatus === 'VERIFIED' ? 'success' : a.complianceStatus === 'REVIEW_REQUIRED' ? 'warning' : 'danger'}
          size="sm"
          mono
          beacon={a.complianceStatus !== 'VERIFIED'}
        >
          {a.complianceStatus === 'VERIFIED' ? '✓ DATA VERIFIED' : '⚠ PHI CONFLICT'}
        </Badge>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Breadcrumbs & Navigation */}
      <div className="flex items-center gap-2 text-xs text-text-secondary font-mono">
        <button
          onClick={() => setCurrentRoute('fields')}
          className="hover:text-primary flex items-center gap-1 font-semibold"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>GIS PARCEL DIRECTORY</span>
        </button>
        <span>/</span>
        <span className="text-text-primary font-bold">{field.code} — {field.name}</span>
      </div>

      {/* Parcel Hero Cockpit Card */}
      <div className="bg-white rounded-xl border border-border p-5 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-slate-950 text-emerald-400 font-mono font-bold text-base flex items-center justify-center shrink-0 border border-slate-800 shadow-md">
            {field.code}
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-extrabold text-text-primary tracking-tight">
                {field.name}
              </h1>
              <Badge severity={field.riskLevel} size="sm" beacon mono />
            </div>
            <p className="text-xs text-text-secondary mt-1">
              Current Crop: <strong className="text-text-primary font-mono">{field.currentCrop} ({field.variety})</strong> • {field.acreage} Acres • {field.soilType}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedBatchId('batch-001');
              setCurrentRoute('traceability');
            }}
            leftIcon={<QrCode className="w-4 h-4 text-primary" />}
            className="text-xs font-semibold h-8"
          >
            Trace Batch Lineage
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => openQuickRecord('chemical')}
            leftIcon={<Plus className="w-4 h-4" />}
            className="text-xs font-semibold h-8 shadow-sm"
          >
            Record Spray
          </Button>
        </div>
      </div>

      {/* High-Density Telemetry Summary Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
        <div className="bg-white p-3.5 rounded-xl border border-border text-center shadow-card">
          <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block">
            CHEMICAL SPRAYS
          </span>
          <p className="text-2xl font-extrabold text-text-primary mt-1">{fieldApplications.length}</p>
          <span className="text-[10px] text-text-muted">Season 2026</span>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-border text-center shadow-card">
          <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block">
            ACTIVE INGREDIENTS
          </span>
          <p className="text-2xl font-extrabold text-primary mt-1">{field.activeIngredientsApplied.length}</p>
          <span className="text-[10px] text-text-muted">In soil / canopy</span>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-border text-center shadow-card">
          <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block">
            PHI COUNTDOWN
          </span>
          <p className="text-2xl font-extrabold text-amber-600 mt-1">{field.daysUntilHarvest} d</p>
          <span className="text-[10px] text-text-muted">Target: {field.expectedHarvestDate}</span>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-border text-center shadow-card">
          <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block">
            NDVI VIGOR INDEX
          </span>
          <p className="text-2xl font-extrabold text-emerald-600 mt-1">0.82</p>
          <span className="text-[10px] text-text-muted">Health: {field.healthScore}/100</span>
        </div>
      </div>

      {/* Tabs Navigation */}
      <Tabs
        tabs={tabs}
        activeTab={activeTab}
        onChange={setActiveTab}
        variant="underline"
      />

      {/* Tab 1: Overview & GIS */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <Card title="Agronomic GIS & Soil Telemetry">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-mono">
                <div className="p-3 bg-slate-50 rounded-lg border border-border">
                  <span className="text-text-muted block text-[10px] uppercase">SOIL PROFILE & PH</span>
                  <span className="font-bold text-text-primary text-xs">{field.soilType}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-border">
                  <span className="text-text-muted block text-[10px] uppercase">IRRIGATION MATRIX</span>
                  <span className="font-bold text-text-primary text-xs">{field.irrigationType}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-border">
                  <span className="text-text-muted block text-[10px] uppercase">TRANSPLANT TIMESTAMP</span>
                  <span className="font-bold text-text-primary text-xs">{field.sowingDate}</span>
                </div>
              </div>
            </Card>

            <Card title="Recent Chemical Applications on Parcel" padding="none">
              <Table
                columns={appColumns}
                data={fieldApplications}
                keyExtractor={(a) => a.id}
                pageSize={5}
              />
            </Card>
          </div>

          <div className="space-y-4">
            <Card title="Active Diagnostic Flags">
              {fieldAlerts.length > 0 ? (
                fieldAlerts.map((alert) => (
                  <div key={alert.id} className="p-3.5 bg-rose-50 rounded-xl border border-rose-200 text-xs space-y-2">
                    <div className="flex items-center gap-1.5 font-bold text-rose-900 font-mono">
                      <AlertTriangle className="w-4 h-4 text-status-danger shrink-0" />
                      <span>{alert.title}</span>
                    </div>
                    <p className="text-[11px] text-rose-950 leading-relaxed">{alert.summary}</p>
                    <div className="p-2.5 bg-white rounded border border-rose-200 text-[10px] text-rose-900 font-mono">
                      <strong className="block">✦ REMEDIATION ACTION:</strong>
                      {alert.recommendedAction}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-xs text-text-secondary">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                  <p className="font-bold text-text-primary">Zero Active Risk Flags</p>
                  <p className="text-[11px] mt-0.5 font-mono">Parcel complies with all FSSAI PHI standards.</p>
                </div>
              )}
            </Card>

            <Card title="Linked Export Batches">
              {fieldBatches.map((batch) => (
                <div
                  key={batch.id}
                  onClick={() => {
                    setSelectedBatchId(batch.id);
                    setCurrentRoute('traceability');
                  }}
                  className="p-3 bg-slate-50 hover:bg-slate-100 cursor-pointer rounded-lg border border-border text-xs transition-colors flex items-center justify-between font-mono"
                >
                  <div>
                    <span className="font-bold text-text-primary">{batch.batchNumber}</span>
                    <p className="text-[11px] text-text-secondary">{batch.crop} • {batch.quantityKg} kg</p>
                  </div>
                  <Badge variant="success" size="sm" mono>
                    {batch.status}
                  </Badge>
                </div>
              ))}
            </Card>
          </div>
        </div>
      )}

      {/* Tab 2: Applications */}
      {activeTab === 'applications' && (
        <Card
          title="Chemical Applications Audit History"
          subtitle="Precision spray logs with FSSAI withholding compliance status"
          action={
            <Button
              variant="primary"
              size="sm"
              onClick={() => openQuickRecord('chemical')}
              leftIcon={<Plus className="w-3.5 h-3.5" />}
              className="text-xs h-8 font-semibold"
            >
              Record Application
            </Button>
          }
          padding="none"
        >
          <Table
            columns={appColumns}
            data={fieldApplications}
            keyExtractor={(a) => a.id}
          />
        </Card>
      )}

      {/* Tab 3: Heatmap */}
      {activeTab === 'heatmap' && (
        <Card
          title="Chemical Treatment Frequency Heatmap"
          subtitle="Calendar density tracking mode-of-action rotations and pesticide concentration across parcel segments"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-7 gap-2 text-center text-xs font-mono">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
                <div key={d} className="font-bold text-text-muted uppercase text-[10px] py-1 bg-slate-50 rounded">
                  {d}
                </div>
              ))}
              {/* Heatmap 28-day cells */}
              {Array.from({ length: 28 }).map((_, i) => {
                const day = i + 1;
                const isSprayDay = day === 8 || day === 16;
                const isHarvestDay = day === 28;
                return (
                  <div
                    key={i}
                    className={`p-2.5 rounded-lg border text-center transition-all ${
                      isSprayDay
                        ? 'bg-emerald-600 text-white font-bold border-emerald-700 shadow-sm'
                        : isHarvestDay
                        ? 'bg-amber-500 text-white font-bold border-amber-600'
                        : 'bg-slate-50 text-text-secondary border-border hover:bg-slate-100'
                    }`}
                  >
                    <span className="text-[10px] block opacity-75">Aug {day}</span>
                    <span className="text-xs block mt-0.5">
                      {isSprayDay ? 'SPRAY' : isHarvestDay ? 'HARVEST' : '—'}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between text-xs font-mono p-3 bg-slate-50 rounded-lg border border-border text-text-secondary">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-emerald-600" />
                  <span>Chemical Spray Logged</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-amber-500" />
                  <span>Target Harvest Window</span>
                </span>
              </div>
              <span>Rotation Index: Group 28 / Group M3</span>
            </div>
          </div>
        </Card>
      )}

      {/* Tab 4: Crop Cycle */}
      {activeTab === 'crop-cycle' && (
        <Card title="Crop Phenology Milestones & Vegetative Telemetry">
          <div className="relative border-l-2 border-emerald-600 ml-4 pl-6 space-y-6 py-2">
            <div className="relative">
              <div className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-emerald-600 ring-4 ring-white" />
              <h4 className="text-xs font-bold text-text-primary font-mono">1. Transplanting & Seedling Establishment</h4>
              <p className="text-[11px] text-text-secondary mt-0.5">{field.sowingDate} • 98.4% survival rate recorded</p>
            </div>
            <div className="relative">
              <div className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-emerald-600 ring-4 ring-white" />
              <h4 className="text-xs font-bold text-text-primary font-mono">2. Vegetative Canopy & Micro-Fertigation</h4>
              <p className="text-[11px] text-text-secondary mt-0.5">2026-07-15 • Drip-applied NPK 19:19:19 + micronutrients</p>
            </div>
            <div className="relative">
              <div className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-amber-500 ring-4 ring-white" />
              <h4 className="text-xs font-bold text-text-primary font-mono">3. Fruit Setting & Pest Resistance Protocol</h4>
              <p className="text-[11px] text-text-secondary mt-0.5">2026-08-16 • Coragen applied (14-day mandatory PHI active)</p>
            </div>
            <div className="relative">
              <div className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-slate-300 ring-4 ring-white" />
              <h4 className="text-xs font-bold text-text-secondary font-mono">4. Projected Export Harvest Window</h4>
              <p className="text-[11px] text-text-muted mt-0.5">{field.expectedHarvestDate} • Clearance scheduled</p>
            </div>
          </div>
        </Card>
      )}

      {/* Tab 5: Risk */}
      {activeTab === 'risk' && (
        <div className="space-y-4">
          {fieldAlerts.map((alert) => (
            <Card key={alert.id} borderLeftAccent="danger" className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Badge severity={alert.severity} size="sm" beacon mono />
                  <h3 className="text-sm font-bold text-text-primary">{alert.title}</h3>
                </div>
                <span className="text-xs font-mono text-text-muted">{alert.timestamp}</span>
              </div>
              <p className="text-xs text-text-secondary mt-2 leading-relaxed">{alert.summary}</p>
              <div className="mt-3.5 p-3 bg-slate-50 rounded-lg border border-border text-xs space-y-1 font-mono">
                <span className="font-bold text-text-primary block">Empirical Telemetry Evidence:</span>
                {alert.empiricalEvidence.map((ev, i) => (
                  <p key={i} className="text-text-secondary">• {ev}</p>
                ))}
              </div>
              <div className="mt-3 p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-xs text-emerald-950">
                <span className="font-bold block font-mono">✦ IndiaX Intelligence Remediation:</span>
                <p className="mt-0.5 leading-snug">{alert.recommendedAction}</p>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Tab 6: Traceability */}
      {activeTab === 'traceability' && (
        <Card title="Harvest Lots & QR Serialized Batches" padding="none">
          <div className="p-4 divide-y divide-border">
            {fieldBatches.map((batch) => (
              <div key={batch.id} className="py-3 flex items-center justify-between font-mono">
                <div>
                  <h4 className="text-sm font-bold text-text-primary">{batch.batchNumber}</h4>
                  <p className="text-xs text-text-secondary">{batch.crop} • {batch.quantityKg} kg harvested {batch.harvestDate}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedBatchId(batch.id);
                    setCurrentRoute('traceability');
                  }}
                  leftIcon={<QrCode className="w-3.5 h-3.5 text-primary" />}
                  className="text-xs"
                >
                  View Lineage Node Graph
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

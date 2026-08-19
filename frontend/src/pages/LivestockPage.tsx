import React from 'react';
import { useApp } from '../context/AppContext';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Table, Column } from '../components/ui/Table';
import { LivestockUnit, LivestockTreatment } from '../types';
import { Award, Plus, ShieldAlert, AlertTriangle, CheckCircle2, ChevronRight, Stethoscope } from 'lucide-react';

export const LivestockPage: React.FC = () => {
  const { livestockUnits, treatments, openQuickRecord } = useApp();

  const treatmentColumns: Column<LivestockTreatment>[] = [
    {
      header: 'Animal Tag & Herd',
      accessor: (t) => (
        <div>
          <span className="font-bold text-text-primary font-mono">{t.animalTagId}</span>
          <p className="text-xs text-text-secondary">{t.unitName}</p>
        </div>
      ),
    },
    {
      header: 'Medication & Active Drug',
      accessor: (t) => (
        <div>
          <span className="font-bold text-text-primary">{t.medicationName}</span>
          <p className="text-xs text-text-secondary">{t.activeSubstance}</p>
        </div>
      ),
    },
    {
      header: 'WHO AMU Classification',
      accessor: (t) => (
        <Badge
          variant={t.whoImportance === 'CRITICALLY_IMPORTANT' ? 'danger' : t.whoImportance === 'HIGHLY_IMPORTANT' ? 'warning' : 'neutral'}
          size="sm"
        >
          {t.whoImportance === 'CRITICALLY_IMPORTANT' ? '🔴 WHO Highest CIA' : t.whoImportance === 'HIGHLY_IMPORTANT' ? '🟠 WHO High HIA' : '🟢 Non-Antimicrobial'}
        </Badge>
      ),
    },
    {
      header: 'Dosage & Diagnosis',
      accessor: (t) => (
        <div>
          <span className="font-semibold text-text-primary">{t.dosage}</span>
          <p className="text-xs text-text-secondary truncate max-w-xs">{t.diagnosis}</p>
        </div>
      ),
    },
    {
      header: 'Milk / Meat Clearance',
      accessor: (t) => (
        <div>
          <span className="font-semibold text-text-primary">{t.withdrawalPeriodDays} Days Mandatory</span>
          <p className="text-xs text-rose-700 font-medium">Safe Milk: {t.safeMilkDate}</p>
        </div>
      ),
    },
    {
      header: 'Prescribing Vet',
      accessor: (t) => (
        <div>
          <span className="font-medium text-text-primary">{t.prescribingVetName}</span>
          <p className="text-[11px] font-mono text-text-secondary">Reg: {t.prescribingVetRegNumber}</p>
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
            Livestock & Antimicrobial Usage (AMU) Management
          </h1>
          <p className="text-xs text-text-secondary mt-0.5">
            WHO Critically Important Antimicrobial stewardship, animal identification, and automated milk/meat withdrawal tracking
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="primary"
            size="sm"
            onClick={() => openQuickRecord('livestock')}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Record Vet Treatment
          </Button>
        </div>
      </div>

      {/* Herd Unit Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {livestockUnits.map((unit) => (
          <Card
            key={unit.id}
            borderLeftAccent={unit.amuRiskLevel === 'HIGH' ? 'danger' : 'success'}
            className="p-5"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono font-semibold text-text-muted">{unit.code}</span>
                <h3 className="text-base font-bold text-text-primary mt-0.5">{unit.name}</h3>
                <p className="text-xs text-text-secondary">{unit.breed} • {unit.species}</p>
              </div>
              <Badge severity={unit.amuRiskLevel} size="sm" />
            </div>

            <div className="grid grid-cols-3 gap-2 my-4 p-3 bg-slate-50 rounded-lg border border-border text-xs">
              <div>
                <span className="text-text-muted text-[10px] block">Headcount</span>
                <span className="font-bold text-text-primary">{unit.headcount}</span>
              </div>
              <div>
                <span className="text-text-muted text-[10px] block">90d Treatments</span>
                <span className="font-bold text-text-primary">{unit.totalTreatmentsLast90Days}</span>
              </div>
              <div>
                <span className="text-text-muted text-[10px] block">AMU Score</span>
                <span className="font-bold text-rose-700">{unit.amuRiskScore}/100</span>
              </div>
            </div>

            {unit.activeWithdrawalPeriod ? (
              <div className="p-2.5 bg-amber-50 rounded border border-amber-200 text-xs text-amber-900 mb-3 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Active Milk Withdrawal until <strong>{unit.withdrawalEndDate}</strong></span>
              </div>
            ) : (
              <div className="p-2.5 bg-emerald-50 rounded border border-emerald-200 text-xs text-emerald-900 mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Zero Active Drug Withholdings</span>
              </div>
            )}

            <div className="pt-2 border-t border-border flex items-center justify-between text-xs text-text-secondary">
              <span className="truncate max-w-[180px]">Vet: {unit.responsibleVeterinarian.split(',')[0]}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => openQuickRecord('livestock')}
                className="text-xs h-7 px-2"
              >
                + Log Dose
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Treatments Log */}
      <Card
        title="Veterinary Treatment & Antibiotic Administration Log"
        subtitle="Full audit trail compliant with Department of Animal Husbandry & Dairying (DAHD) guidelines"
        padding="none"
      >
        <Table
          columns={treatmentColumns}
          data={treatments}
          keyExtractor={(t) => t.id}
        />
      </Card>
    </div>
  );
};

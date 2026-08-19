import React from 'react';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import {
  Calendar as CalendarIcon,
  Milk,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowLeft,
  ShieldCheck,
  Award,
  Stethoscope,
} from 'lucide-react';

export const VetWithdrawalCalendarPage: React.FC = () => {
  const { treatments, livestockUnits, setCurrentRoute } = useApp();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-earth-border">
        <div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentRoute('vet-dashboard')}
              className="p-1 text-earth-timber hover:text-earth-bark rounded hover:bg-earth-border/40 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-extrabold text-earth-bark tracking-tight">
              Livestock Milk & Meat Withdrawal Timeline
            </h1>
          </div>
          <p className="text-xs text-earth-timber mt-1 font-mono pl-7">
            Automated food-safety segregation schedule ensuring zero antibiotic residues in consumer dairy and meat lots
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentRoute('vet-dashboard')}
          className="text-xs font-bold font-mono"
        >
          ← BACK TO VET COCKPIT
        </Button>
      </div>

      {/* Timeline Schedule Cards */}
      <div className="space-y-4">
        {treatments.map((t) => (
          <Card key={t.id} padding="lg" className="bg-white border-earth-border space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-earth-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#EAF5EC] border border-[#A7D7B5] flex items-center justify-center text-[#1B4D3E] shrink-0">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-earth-bark">{t.medicationName} Course</h3>
                  <p className="text-xs font-mono text-earth-timber">
                    Animal: <strong className="text-earth-bark">{t.animalTagId}</strong> • Herd: {t.unitName}
                  </p>
                </div>
              </div>

              <Badge
                variant={t.complianceStatus === 'WITHDRAWAL_ACTIVE' ? 'warning' : 'success'}
                size="md"
                mono
              >
                {t.complianceStatus === 'WITHDRAWAL_ACTIVE' ? 'SEGREGATION ACTIVE' : 'CLEAR LOT'}
              </Badge>
            </div>

            {/* Stepper Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div className="p-3 bg-[#FAF8F5] rounded-lg border border-earth-border">
                <span className="text-earth-timber text-[10px] uppercase font-bold block mb-1">
                  ADMINISTRATION DATE
                </span>
                <span className="font-extrabold text-earth-bark text-sm">{t.startDate}</span>
                <span className="text-[10px] text-earth-timber block mt-0.5">{t.administrationRoute} • {t.dosage}</span>
              </div>

              <div className="p-3 bg-[#FAF8F5] rounded-lg border border-earth-border">
                <span className="text-earth-timber text-[10px] uppercase font-bold block mb-1">
                  MANDATORY WITHDRAWAL
                </span>
                <span className="font-extrabold text-amber-700 text-sm">{t.withdrawalPeriodDays} Days</span>
                <span className="text-[10px] text-earth-timber block mt-0.5">Statutory Standard</span>
              </div>

              <div className="p-3 bg-[#E0F2FE]/50 rounded-lg border border-[#BAE6FD]">
                <span className="text-[#0369A1] text-[10px] uppercase font-bold block mb-1 flex items-center gap-1">
                  <Milk className="w-3 h-3" /> MILK CLEARANCE
                </span>
                <span className="font-extrabold text-[#0369A1] text-sm">{t.safeMilkDate || '2026-08-23'}</span>
                <span className="text-[10px] text-[#0369A1]/80 block mt-0.5">Automatic Bulk Tank Lock</span>
              </div>

              <div className="p-3 bg-[#EAF5EC] rounded-lg border border-[#A7D7B5]">
                <span className="text-[#1B4D3E] text-[10px] uppercase font-bold block mb-1 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-[#2B9348]" /> MEAT CLEARANCE
                </span>
                <span className="font-extrabold text-[#1B4D3E] text-sm">{t.safeMeatDate || '2026-09-17'}</span>
                <span className="text-[10px] text-[#1B4D3E]/80 block mt-0.5">Safe for Human Food Chain</span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between text-xs text-earth-timber font-mono">
              <span>Prescribing Veterinarian: <strong>{t.prescribingVetName}</strong> ({t.prescribingVetRegNumber})</span>
              <span className="text-[#2B9348] font-bold">✓ FSSAI Schedule VI Verified</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

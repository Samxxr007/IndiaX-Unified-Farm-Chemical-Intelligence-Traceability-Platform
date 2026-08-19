import React from 'react';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { ProgressBar } from '../../components/ui/ProgressBar';
import {
  HeartPulse,
  Award,
  AlertTriangle,
  Clock,
  Plus,
  ShieldCheck,
  FileCheck,
  Calendar,
  Sparkles,
  TrendingDown,
  Activity,
  CheckCircle2,
  ChevronRight,
  Stethoscope,
  Milk,
} from 'lucide-react';

export const VetDashboardPage: React.FC = () => {
  const {
    livestockUnits,
    treatments,
    activeFarm,
    user,
    setCurrentRoute,
    openQuickRecord,
  } = useApp();

  const activeWithdrawals = treatments.filter((t) => t.complianceStatus === 'WITHDRAWAL_ACTIVE' || t.withdrawalPeriodDays > 0);
  const totalAnimals = livestockUnits.reduce((acc, u) => acc + (u.headcount || 0), 0);
  const criticalTreatments = treatments.filter((t) => t.whoImportance === 'CRITICALLY_IMPORTANT' || t.whoImportance === 'HIGHLY_IMPORTANT');

  return (
    <div className="space-y-6">
      {/* Veterinarian Cockpit Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-earth-border">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-earth-bark tracking-tight">
              Veterinary AMU & Livestock Stewardship Portal
            </h1>
            <Badge variant="ai" size="sm" mono>
              ✦ VETERINARY SURVEILLANCE ACTIVE
            </Badge>
          </div>
          <p className="text-xs text-earth-timber mt-1 font-mono">
            SUPERVISING VET: <strong className="text-earth-bark">{user?.fullName || 'Dr. Kavita Deshmukh'} (VCI Registered)</strong> • ESTATE: {activeFarm?.name || 'Green Valley Agri-Estate'}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentRoute('vet-calendar')}
            leftIcon={<Calendar className="w-3.5 h-3.5 text-[#1B4D3E]" />}
            className="text-xs font-bold h-8"
          >
            Withdrawal Calendar
          </Button>
          <Button
            variant="leaf"
            size="sm"
            onClick={() => openQuickRecord('livestock')}
            leftIcon={<Stethoscope className="w-3.5 h-3.5" />}
            className="text-xs font-bold h-8 shadow-sm"
          >
            Log Prescription Treatment
          </Button>
        </div>
      </div>

      {/* KPI Deck */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
        {/* KPI 1: Livestock Headcount */}
        <Card padding="md" hoverEffect borderLeftAccent="leaf" className="bg-[#FDFBF7]">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-bold text-earth-timber uppercase tracking-wider">
                LIVESTOCK UNDER CARE
              </p>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl font-extrabold text-earth-bark tracking-tight">{totalAnimals || 24}</span>
                <span className="text-xs text-earth-timber font-bold">ANIMALS</span>
              </div>
            </div>
            <div className="w-9 h-9 rounded-lg bg-[#EAF5EC] border border-[#A7D7B5] text-[#1B4D3E] flex items-center justify-center shadow-inner">
              <HeartPulse className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-[#2B9348] font-bold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span className="text-[11px]">{livestockUnits.length} Managed Herd Units</span>
          </div>
        </Card>

        {/* KPI 2: Active AMU Courses */}
        <Card padding="md" hoverEffect borderLeftAccent="primary" className="bg-[#FDFBF7]">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-bold text-earth-timber uppercase tracking-wider">
                ACTIVE AMU COURSES
              </p>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl font-extrabold text-earth-bark tracking-tight">{treatments.length}</span>
                <span className="text-xs text-earth-timber font-bold">COURSES</span>
              </div>
            </div>
            <div className="w-9 h-9 rounded-lg bg-[#E0F2FE] border border-[#BAE6FD] text-[#0369A1] flex items-center justify-center shadow-inner">
              <Stethoscope className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-earth-timber font-medium text-[11px]">
            <span>{criticalTreatments.length} WHO Important Classes</span>
          </div>
        </Card>

        {/* KPI 3: Withholding Quarantines */}
        <Card padding="md" hoverEffect borderLeftAccent="danger" className="bg-[#FDFBF7]">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-bold text-earth-timber uppercase tracking-wider">
                WITHDRAWAL QUARANTINES
              </p>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl font-extrabold text-[#B91C1C] tracking-tight">{activeWithdrawals.length}</span>
                <span className="text-xs text-[#B91C1C] font-extrabold">ACTIVE</span>
              </div>
            </div>
            <div className="w-9 h-9 rounded-lg bg-[#FEE2E2] border border-[#FCA5A5] text-[#B91C1C] flex items-center justify-center shadow-inner">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-[#B91C1C] font-bold text-[11px]">
            <span>Milk/Meat auto-segregation active</span>
          </div>
        </Card>

        {/* KPI 4: AMU Stewardship Index */}
        <Card padding="md" hoverEffect borderLeftAccent="leaf" className="bg-[#FDFBF7]">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-bold text-earth-timber uppercase tracking-wider">
                AMU STEWARDSHIP INDEX
              </p>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl font-extrabold text-earth-bark tracking-tight">88</span>
                <span className="text-xs text-[#2B9348] font-extrabold">/ 100 OPTIMAL</span>
              </div>
            </div>
            <div className="w-9 h-9 rounded-lg bg-[#EAF5EC] border border-[#A7D7B5] text-[#1B4D3E] flex items-center justify-center shadow-inner">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-[#2B9348] font-medium text-[11px]">
            <span>Zero critically banned antibiotics</span>
          </div>
        </Card>
      </div>

      {/* Main Grid: Active Herd Units & Prescriptions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Herd Units & Withdrawal Protocol Status */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-mono font-bold text-earth-bark uppercase tracking-wider flex items-center gap-2">
              <HeartPulse className="w-3.5 h-3.5 text-[#2D6A4F]" />
              LIVESTOCK HERDS & HEALTH PROFILE
            </h2>
            <span className="text-[11px] font-mono text-earth-timber">FSSAI Schedule VI Compliant</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {livestockUnits.map((unit) => (
              <Card key={unit.id} padding="md" hoverEffect className="bg-white border-earth-border space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-earth-bark">{unit.name}</h3>
                    <p className="text-xs font-mono text-earth-timber mt-0.5">
                      {unit.code} • {unit.breed} ({unit.species})
                    </p>
                  </div>
                  <Badge
                    variant={unit.activeWithdrawalPeriod ? 'warning' : 'success'}
                    size="sm"
                    mono
                  >
                    {unit.activeWithdrawalPeriod ? 'WITHDRAWAL ACTIVE' : 'CLEAR LOT'}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-2 border-t border-earth-border">
                  <div>
                    <span className="text-earth-timber text-[10px] uppercase block">HEADCOUNT</span>
                    <span className="font-extrabold text-earth-bark">{unit.headcount} Animals</span>
                  </div>
                  <div>
                    <span className="text-earth-timber text-[10px] uppercase block">AMU RISK SCORE</span>
                    <span className="font-extrabold text-amber-700">{unit.amuRiskScore}/100</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-earth-border text-xs flex items-center justify-between">
                  <span className="text-[11px] text-earth-timber font-mono">
                    Housing: {unit.housingType}
                  </span>
                  <button
                    onClick={() => setCurrentRoute('livestock')}
                    className="text-[11px] font-bold text-[#1B4D3E] hover:underline flex items-center gap-1 font-mono"
                  >
                    <span>View Dossier</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </Card>
            ))}
          </div>

          {/* Active Prescriptions Table */}
          <Card padding="md" className="bg-white border-earth-border">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-mono font-bold text-earth-bark uppercase tracking-wider flex items-center gap-2">
                <Stethoscope className="w-3.5 h-3.5 text-[#1B4D3E]" />
                ACTIVE PRESCRIPTION & ANTIMICROBIAL LOGS
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentRoute('livestock')}
                className="text-xs h-7 px-2 font-mono font-bold text-[#1B4D3E]"
              >
                ALL TREATMENTS →
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-[#FAF8F5] text-earth-timber font-bold border-y border-earth-border">
                  <tr>
                    <th className="py-2.5 px-3">MEDICATION & CLASS</th>
                    <th className="py-2.5 px-3">TARGET ANIMAL</th>
                    <th className="py-2.5 px-3">DOSAGE & ROUTE</th>
                    <th className="py-2.5 px-3">WITHDRAWAL CLEARANCE</th>
                    <th className="py-2.5 px-3 text-right">STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-earth-border">
                  {treatments.map((t) => (
                    <tr key={t.id} className="hover:bg-[#FAF8F5]/80 transition-colors">
                      <td className="py-2.5 px-3 font-bold text-earth-bark">
                        <div>{t.medicationName}</div>
                        <div className="text-[10px] text-earth-timber font-normal">{t.activeSubstance} • {t.antimicrobialClass}</div>
                      </td>
                      <td className="py-2.5 px-3 text-earth-bark">
                        <div>{t.animalTagId}</div>
                        <div className="text-[10px] text-earth-timber">{t.unitName}</div>
                      </td>
                      <td className="py-2.5 px-3 text-earth-timber">
                        <div>{t.dosage}</div>
                        <div className="text-[10px]">{t.administrationRoute}</div>
                      </td>
                      <td className="py-2.5 px-3 text-earth-bark">
                        {t.safeMilkDate && (
                          <div className="flex items-center gap-1 text-[11px] text-[#0369A1]">
                            <Milk className="w-3 h-3" /> Milk Safe: {t.safeMilkDate}
                          </div>
                        )}
                        {t.safeMeatDate && (
                          <div className="text-[10px] text-earth-timber">Meat Safe: {t.safeMeatDate}</div>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <Badge
                          variant={t.complianceStatus === 'WITHDRAWAL_ACTIVE' ? 'warning' : 'success'}
                          size="sm"
                          mono
                        >
                          {t.complianceStatus || 'COMPLIANT'}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Right Col: WHO CIA Stewardship & Compliance Checklist */}
        <div className="space-y-4">
          <Card padding="md" className="bg-[#FAF8F5] border-earth-border space-y-4">
            <h3 className="text-xs font-mono font-bold text-earth-bark uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#1B4D3E]" />
              WHO CIA STEWARDSHIP PROTOCOL
            </h3>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-earth-timber">3rd/4th Gen Cephalosporins</span>
                  <span className="font-bold text-[#2B9348]">0.0% (Zero Use)</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5">
                  <div className="bg-[#2B9348] h-1.5 rounded-full" style={{ width: '0%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-earth-timber">Fluoroquinolones (Enrofloxacin)</span>
                  <span className="font-bold text-amber-600">Restricted (1 course)</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5">
                  <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: '25%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-earth-timber">Tetracyclines & Standard Antibiotics</span>
                  <span className="font-bold text-emerald-700">Controlled (Prescribed)</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5">
                  <div className="bg-emerald-600 h-1.5 rounded-full" style={{ width: '45%' }} />
                </div>
              </div>
            </div>

            <div className="p-3 bg-white rounded-lg border border-earth-border text-xs text-earth-timber space-y-1 font-mono">
              <p className="font-bold text-earth-bark">Statutory Advisory:</p>
              <p className="text-[11px] leading-relaxed">
                Colistin and fluoroquinolones are strictly banned for non-therapeutic livestock prophylaxis under Ministry of Health Notification GSR 493(E).
              </p>
            </div>
          </Card>

          {/* Quick Veterinary Actions */}
          <Card padding="md" className="bg-white border-earth-border space-y-3">
            <h3 className="text-xs font-mono font-bold text-earth-bark uppercase tracking-wider">
              VETERINARY ACTIONS
            </h3>
            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentRoute('vet-calendar')}
                className="w-full justify-start text-xs font-bold"
                leftIcon={<Calendar className="w-3.5 h-3.5 text-[#1B4D3E]" />}
              >
                Inspect Milk Withholding Calendar
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentRoute('reports')}
                className="w-full justify-start text-xs font-bold"
                leftIcon={<FileCheck className="w-3.5 h-3.5 text-[#1B4D3E]" />}
              >
                Export AMU Compliance Dossier
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

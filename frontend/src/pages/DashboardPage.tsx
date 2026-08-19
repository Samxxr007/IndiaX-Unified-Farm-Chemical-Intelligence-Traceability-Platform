import React from 'react';
import { useApp } from '../context/AppContext';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { ProgressBar } from '../components/ui/ProgressBar';
import { FarmMap } from '../components/map/FarmMap';
import {
  ShieldAlert,
  Trees,
  QrCode,
  HeartPulse,
  ArrowUpRight,
  Sparkles,
  AlertOctagon,
  Clock,
  ChevronRight,
  TrendingUp,
  FlaskConical,
  Award,
  CheckCircle2,
  Calendar,
  FileCheck,
  Activity,
  Droplets,
  Sprout,
  Package,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const {
    activeFarm,
    user,
    fields,
    riskAlerts,
    traceabilityBatches,
    activityFeed,
    setCurrentRoute,
    setSelectedFieldId,
    openQuickRecord,
  } = useApp();

  const unresolvedAlerts = riskAlerts.filter((a) => !a.isResolved);
  const verifiedBatchesCount = traceabilityBatches.filter((b) => b.status === 'VERIFIED').length;

  return (
    <div className="space-y-6">
      {/* Executive Agronomy Cockpit Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-earth-border">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-earth-bark tracking-tight">
              {activeFarm?.name || 'Loading Estate...'} Farm Cockpit & Agronomic Overview
            </h1>
            <Badge variant="ai" size="sm" mono>
              ✦ INTELLIGENCE ACTIVE
            </Badge>
          </div>
          <p className="text-xs text-earth-timber mt-1 font-mono">
            ESTATE: <strong className="text-earth-bark">{activeFarm?.name || 'Loading'}</strong> • LOCATION: {activeFarm?.district || activeFarm?.location || 'Unknown'} • FSSAI #{activeFarm?.fssaiLicense || 'N/A'}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentRoute('reports')}
            leftIcon={<FileCheck className="w-3.5 h-3.5 text-[#1B4D3E]" />}
            className="text-xs font-bold h-8"
          >
            Export Compliance Dossier
          </Button>
          <Button
            variant="leaf"
            size="sm"
            onClick={() => openQuickRecord('chemical')}
            leftIcon={<FlaskConical className="w-3.5 h-3.5" />}
            className="text-xs font-bold h-8 shadow-sm"
          >
            Record Chemical Spray
          </Button>
        </div>
      </div>

      {/* Tactile Rural Summary KPI Deck (4 Hero Cards with Warm Earth Borders) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
        {/* KPI 1: Farm Health */}
        <Card padding="md" hoverEffect borderLeftAccent="leaf" className="bg-[#FDFBF7]">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-bold text-earth-timber uppercase tracking-wider">
                FARM HEALTH VIGOR
              </p>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl font-extrabold text-earth-bark tracking-tight">87</span>
                <span className="text-xs text-earth-timber font-bold">/ 100</span>
              </div>
            </div>
            <div className="w-9 h-9 rounded-lg bg-[#EAF5EC] border border-[#A7D7B5] text-[#1B4D3E] flex items-center justify-center shadow-inner">
              <HeartPulse className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-[#2B9348] font-bold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span className="text-[11px]">NDVI 0.82 Optimal Canopy Vigor</span>
          </div>
        </Card>

        {/* KPI 2: Active Parcels */}
        <Card padding="md" hoverEffect borderLeftAccent="primary" className="bg-[#FDFBF7]">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-bold text-earth-timber uppercase tracking-wider">
                ACTIVE PARCELS
              </p>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl font-extrabold text-earth-bark tracking-tight">06</span>
                <span className="text-xs text-earth-timber font-bold">/ {activeFarm?.totalAreaHectares?.toFixed(1) || activeFarm?.totalAcreage || '--'} ha</span>
              </div>
            </div>
            <div className="w-9 h-9 rounded-lg bg-[#E0F2FE] border border-[#BAE6FD] text-[#0369A1] flex items-center justify-center shadow-inner">
              <Trees className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-earth-timber font-medium text-[11px]">
            <span>2 parcels in pre-harvest window</span>
          </div>
        </Card>

        {/* KPI 3: Chemical Flags */}
        <Card padding="md" hoverEffect borderLeftAccent="danger" className="bg-[#FDFBF7]">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-bold text-earth-timber uppercase tracking-wider">
                CHEMICAL RISK FLAGS
              </p>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl font-extrabold text-[#B91C1C] tracking-tight">03</span>
                <span className="text-xs text-[#B91C1C] font-extrabold">1 CRITICAL PHI</span>
              </div>
            </div>
            <div className="w-9 h-9 rounded-lg bg-[#FEE2E2] border border-[#FCA5A5] text-[#B91C1C] flex items-center justify-center shadow-inner">
              <ShieldAlert className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-[#B91C1C] font-bold text-[11px]">
            <span>Withholding overlap on Field A</span>
          </div>
        </Card>

        {/* KPI 4: Ready Batches */}
        <Card padding="md" hoverEffect borderLeftAccent="leaf" className="bg-[#FDFBF7]">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-bold text-earth-timber uppercase tracking-wider">
                READY HARVEST BATCHES
              </p>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl font-extrabold text-earth-bark tracking-tight">12</span>
                <span className="text-xs text-[#2B9348] font-extrabold">{verifiedBatchesCount} QR PASS</span>
              </div>
            </div>
            <div className="w-9 h-9 rounded-lg bg-[#EAF5EC] border border-[#A7D7B5] text-[#1B4D3E] flex items-center justify-center shadow-inner">
              <QrCode className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-earth-timber font-medium text-[11px]">
            <span>420 kg export lot cleared today</span>
          </div>
        </Card>
      </div>

      {/* Geospatial Field Map + Farm Risk Breakdown Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Satellite & Parcel Map Component */}
        <div className="lg:col-span-2 space-y-2">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs font-mono font-bold text-earth-bark uppercase tracking-wider flex items-center gap-2">
              <Sprout className="w-3.5 h-3.5 text-[#2D6A4F]" />
              <span>GEOSPATIAL PARCEL BOUNDARIES & VEGETATION INDEX</span>
            </h2>
            <button
              onClick={() => setCurrentRoute('fields')}
              className="text-xs font-mono font-bold text-[#1B4D3E] hover:underline flex items-center gap-1"
            >
              <span>EXPLORE ALL PARCELS</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <FarmMap height="h-[380px]" />
        </div>

        {/* Right 1 Col: Farm Risk Breakdown Card */}
        <Card
          title="Farm Risk Diagnostic Breakdown"
          subtitle="Real-time multi-factor FSSAI MRL, AMU, & MoA scoring engine"
          action={
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentRoute('risk')}
              className="text-xs h-7 px-2 font-mono font-bold text-[#1B4D3E]"
            >
              DIAGNOSTICS →
            </Button>
          }
          className="flex flex-col justify-between"
        >
          {/* Risk Dial Card Banner */}
          <div className="p-3.5 rounded-lg bg-[#FEF2F2] border border-[#FCA5A5] mb-3.5 flex items-center justify-between shadow-inner">
            <div>
              <span className="text-[10px] font-mono font-bold text-[#7F1D1D] uppercase tracking-wider block">
                COMPOSITE RISK INDEX
              </span>
              <div className="flex items-baseline gap-2 mt-0.5 font-mono">
                <span className="text-3xl font-extrabold text-[#B91C1C]">72</span>
                <span className="text-xs font-bold text-[#7F1D1D]">/ 100 HIGH</span>
              </div>
            </div>
            <div className="text-right">
              <Badge severity="HIGH" size="sm" beacon mono />
              <span className="text-[10px] font-mono text-[#B91C1C] font-bold block mt-1">↑ 8pt DELTA</span>
            </div>
          </div>

          {/* Individual Diagnostic Metric Progress Bars */}
          <div className="space-y-3 flex-1">
            <ProgressBar
              label="Pre-Harvest Chemical Risk (PHI)"
              sublabel="MRL withholding standard"
              value={72}
              colorScheme="risk"
              size="sm"
            />
            <ProgressBar
              label="AMU Stewardship Index"
              sublabel="WHO CIA fluoroquinolones"
              value={41}
              colorScheme="risk"
              size="sm"
            />
            <ProgressBar
              label="Regulatory Alignment"
              sublabel="FSSAI & APEDA standard"
              value={86}
              colorScheme="health"
              size="sm"
            />
            <ProgressBar
              label="Telemetry Record Integrity"
              sublabel="NABL assay verification"
              value={93}
              colorScheme="health"
              size="sm"
            />
          </div>

          <div className="mt-3.5 pt-3 border-t border-earth-border flex items-center justify-between text-xs text-earth-timber">
            <span className="flex items-center gap-1 text-[11px] font-mono">
              <Sparkles className="w-3.5 h-3.5 text-[#1B4D3E]" />
              <span>✦ IndiaX Engine Active</span>
            </span>
            <span className="font-mono text-[11px] font-bold text-[#B91C1C]">1 ACTION REQUIRED</span>
          </div>
        </Card>
      </div>

      {/* Bottom Grid: Actionable Alert Center & Rustic Vertical Field Activity Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Actionable Regulatory Alert Center */}
        <Card
          title="Agronomic Risk Flags & Action Center"
          subtitle="Non-intrusive compliance recommendations identified by IndiaX Intelligence"
          action={
            <Badge variant="danger" size="sm" mono>
              {unresolvedAlerts.length} ACTIVE
            </Badge>
          }
        >
          <div className="space-y-3">
            {unresolvedAlerts.map((alert) => (
              <div
                key={alert.id}
                className="p-3.5 rounded-lg border border-earth-border bg-[#FDFBF7] hover:bg-[#FAF8F5] transition-colors flex flex-col sm:flex-row sm:items-start justify-between gap-3 shadow-sm"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className="mt-0.5 shrink-0">
                    <Badge severity={alert.severity} size="sm" mono />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-earth-bark">{alert.title}</h4>
                    <p className="text-[11px] text-earth-timber mt-1 leading-relaxed line-clamp-2">
                      {alert.summary}
                    </p>
                    <div className="flex items-center gap-2 mt-2 text-[10px] font-mono text-earth-timber">
                      <span className="font-bold text-earth-bark">{alert.entityName}</span>
                      <span>•</span>
                      <span>{alert.timestamp}</span>
                    </div>
                  </div>
                </div>

                <div className="shrink-0 flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2">
                  <Button
                    variant="leaf"
                    size="sm"
                    onClick={() => {
                      if (alert.entityType === 'FIELD') {
                        setSelectedFieldId(alert.entityId);
                        setCurrentRoute('field-detail');
                      } else {
                        setCurrentRoute('risk');
                      }
                    }}
                    className="text-xs h-7 px-3 font-bold"
                  >
                    Review →
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Rustic Vertical Activity Stream */}
        <Card
          title="Field Operations & Telemetry Timeline"
          subtitle="Rustic chronological operational stream across sprays, herd logs, and harvest lots"
          action={
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentRoute('reports')}
              className="text-xs h-7 px-2 font-mono font-bold text-[#1B4D3E]"
            >
              AUDIT DOSSIER →
            </Button>
          }
        >
          <div className="relative border-l-2 border-[#2D6A4F]/40 ml-3 pl-4 space-y-4 py-1">
            {activityFeed.slice(0, 5).map((item) => (
              <div key={item.id} className="relative group">
                <div className="absolute -left-[23px] top-1 w-3.5 h-3.5 rounded-full bg-[#2D6A4F] ring-4 ring-[#FAF8F5] group-hover:scale-110 transition-transform" />
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-earth-bark truncate">{item.title}</span>
                  <span className="text-[10px] text-earth-timber shrink-0 ml-2">{item.timestamp}</span>
                </div>
                <p className="text-[11px] text-earth-timber mt-0.5 leading-snug">{item.description}</p>
                <div className="flex items-center gap-2 mt-1 text-[10px] font-mono text-earth-timber">
                  <span className="font-bold text-[#1B4D3E]">{item.user}</span>
                  <span>•</span>
                  <span>{item.entityName}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

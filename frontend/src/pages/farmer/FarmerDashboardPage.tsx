import React from 'react';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { FarmMap } from '../../components/map/FarmMap';
import {
  ShieldAlert,
  Trees,
  QrCode,
  HeartPulse,
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
  MapPin,
  Wheat,
} from 'lucide-react';

export const FarmerDashboardPage: React.FC = () => {
  const {
    activeFarm,
    user,
    fields,
    riskAlerts,
    traceabilityBatches,
    activityFeed,
    applications,
    setCurrentRoute,
    setSelectedFieldId,
    openQuickRecord,
  } = useApp();

  const unresolvedAlerts = riskAlerts.filter((a) => !a.isResolved);
  const verifiedBatchesCount = traceabilityBatches.filter((b) => b.status === 'VERIFIED').length;
  const activeFieldsCount = fields.filter((f) => f.status === 'ACTIVE' || f.status === 'HARVESTING').length;

  return (
    <div className="space-y-6">
      {/* Farmer Agronomy Cockpit Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-earth-border">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-earth-bark tracking-tight">
              {activeFarm?.name || 'Loading...'} — Agronomy Cockpit
            </h1>
            <Badge variant="ai" size="sm" mono>✦ INTELLIGENCE ACTIVE</Badge>
          </div>
          <p className="text-xs text-earth-timber mt-1 font-mono">
            ESTATE: <strong className="text-earth-bark">{activeFarm?.name || '...'}</strong> • LOCATION: {activeFarm?.district || '...'}, {activeFarm?.state || ''} • FSSAI #{activeFarm?.fssaiLicense || 'N/A'}
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Button variant="outline" size="sm" onClick={() => setCurrentRoute('reports')}
            leftIcon={<FileCheck className="w-3.5 h-3.5 text-[#1B4D3E]" />} className="text-xs font-bold h-8">
            Export Compliance Report
          </Button>
          <Button variant="leaf" size="sm" onClick={() => openQuickRecord('chemical')}
            leftIcon={<FlaskConical className="w-3.5 h-3.5" />} className="text-xs font-bold h-8 shadow-sm">
            Record Chemical Spray
          </Button>
        </div>
      </div>

      {/* KPI Deck */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
        <Card padding="md" hoverEffect borderLeftAccent="leaf" className="bg-[#FDFBF7]">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-bold text-earth-timber uppercase tracking-wider">FARM HEALTH VIGOR</p>
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

        <Card padding="md" hoverEffect borderLeftAccent="primary" className="bg-[#FDFBF7]">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-bold text-earth-timber uppercase tracking-wider">ACTIVE PARCELS</p>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl font-extrabold text-earth-bark tracking-tight">{String(activeFieldsCount || fields.length || 2).padStart(2, '0')}</span>
                <span className="text-xs text-earth-timber font-bold">/ {activeFarm?.totalAreaHectares?.toFixed(0) || activeFarm?.totalAcreage || '--'} ha</span>
              </div>
            </div>
            <div className="w-9 h-9 rounded-lg bg-[#E0F2FE] border border-[#BAE6FD] text-[#0369A1] flex items-center justify-center shadow-inner">
              <Trees className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-xs text-earth-timber font-medium text-[11px]">
            <span>{fields.filter((f) => f.status === 'HARVESTING').length || 2} parcels in pre-harvest window</span>
          </div>
        </Card>

        <Card padding="md" hoverEffect borderLeftAccent="danger" className="bg-[#FDFBF7]">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-bold text-earth-timber uppercase tracking-wider">CHEMICAL RISK FLAGS</p>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl font-extrabold text-[#B91C1C] tracking-tight">{String(unresolvedAlerts.length || 3).padStart(2, '0')}</span>
                <span className="text-xs text-[#B91C1C] font-extrabold">ACTIVE</span>
              </div>
            </div>
            <div className="w-9 h-9 rounded-lg bg-[#FEE2E2] border border-[#FCA5A5] text-[#B91C1C] flex items-center justify-center shadow-inner">
              <ShieldAlert className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-xs text-[#B91C1C] font-bold text-[11px]">
            <span>{unresolvedAlerts[0]?.entityName || 'Withholding overlap on Field A'}</span>
          </div>
        </Card>

        <Card padding="md" hoverEffect borderLeftAccent="leaf" className="bg-[#FDFBF7]">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-bold text-earth-timber uppercase tracking-wider">VERIFIED BATCHES</p>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl font-extrabold text-earth-bark tracking-tight">{String(traceabilityBatches.length || 12).padStart(2, '0')}</span>
                <span className="text-xs text-[#2B9348] font-extrabold">{verifiedBatchesCount} QR PASS</span>
              </div>
            </div>
            <div className="w-9 h-9 rounded-lg bg-[#EAF5EC] border border-[#A7D7B5] text-[#1B4D3E] flex items-center justify-center shadow-inner">
              <QrCode className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-xs text-earth-timber font-medium text-[11px]">
            <span>420 kg export lot cleared today</span>
          </div>
        </Card>
      </div>

      {/* Main Grid: Field GIS Map + Compliance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-2">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs font-mono font-bold text-earth-bark uppercase tracking-wider flex items-center gap-2">
              <Sprout className="w-3.5 h-3.5 text-[#2D6A4F]" />
              GEOSPATIAL PARCEL MAP & PHI CHRONOMETER
            </h2>
            <Button variant="ghost" size="sm" onClick={() => setCurrentRoute('fields')}
              className="text-xs h-7 px-2 font-mono font-bold text-[#1B4D3E]">
              ALL PARCELS →
            </Button>
          </div>
          <FarmMap fields={fields} onFieldClick={(fieldId) => { setSelectedFieldId(fieldId); setCurrentRoute('field-detail'); }} />

          {/* Active Fields Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {fields.slice(0, 4).map((field) => (
              <Card key={field.id} padding="sm" hoverEffect className="bg-white border-earth-border cursor-pointer group"
                onClick={() => { setSelectedFieldId(field.id); setCurrentRoute('field-detail'); }}>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-xs font-bold text-earth-bark">{field.name}</p>
                    <p className="text-[10px] text-earth-timber font-mono mt-0.5">{field.code} • {field.currentCrop}</p>
                  </div>
                  <Badge severity={field.riskLevel} size="sm" mono />
                </div>
                <div className="flex items-center justify-between text-[10px] font-mono text-earth-timber">
                  <span>Harvest: <strong className="text-earth-bark">{field.expectedHarvestDate}</strong></span>
                  <span className="text-[#1B4D3E] font-bold group-hover:underline">View →</span>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Right Col: Risk + Activity Feed */}
        <div className="space-y-4">
          {/* Risk Card */}
          <Card padding="md" title="Farm Composite Risk Index"
            action={
              <Button variant="ghost" size="sm" onClick={() => setCurrentRoute('risk')}
                className="text-xs h-7 px-2 font-mono font-bold text-[#1B4D3E]">DIAGNOSTICS →</Button>
            }
            className="flex flex-col justify-between">
            <div className="p-3.5 rounded-lg bg-[#FEF2F2] border border-[#FCA5A5] mb-3.5 flex items-center justify-between shadow-inner">
              <div>
                <span className="text-[10px] font-mono font-bold text-[#7F1D1D] uppercase tracking-wider block">COMPOSITE RISK INDEX</span>
                <div className="flex items-baseline gap-2 mt-0.5 font-mono">
                  <span className="text-3xl font-extrabold text-[#B91C1C]">{activeFarm?.compositeRiskScore || 72}</span>
                  <span className="text-xs font-bold text-[#7F1D1D]">/ 100 HIGH</span>
                </div>
              </div>
              <div className="text-right">
                <Badge severity="HIGH" size="sm" beacon mono />
                <span className="text-[10px] font-mono text-[#B91C1C] font-bold block mt-1">↑ 8pt DELTA</span>
              </div>
            </div>
            <div className="space-y-3 flex-1">
              <ProgressBar label="Pre-Harvest Chemical Risk (PHI)" sublabel="MRL withholding standard" value={72} colorScheme="risk" size="sm" />
              <ProgressBar label="AMU Stewardship Index" sublabel="WHO CIA fluoroquinolones" value={41} colorScheme="risk" size="sm" />
              <ProgressBar label="Regulatory Alignment" sublabel="FSSAI & APEDA standard" value={86} colorScheme="health" size="sm" />
              <ProgressBar label="Traceability Coverage" sublabel="Batch QR node completion" value={94} colorScheme="health" size="sm" />
            </div>
          </Card>

          {/* Activity Feed */}
          <Card padding="md" title="Live Agronomy Event Feed"
            action={
              <Button variant="ghost" size="sm" onClick={() => setCurrentRoute('traceability')}
                className="text-xs h-7 px-2 font-mono font-bold text-[#1B4D3E]">LEDGER →</Button>
            }>
            <div className="space-y-2">
              {activityFeed.slice(0, 4).map((evt) => (
                <div key={evt.id} className="flex items-start gap-2.5 p-2.5 rounded-lg bg-[#FAF8F5] border border-earth-border">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 
                    ${evt.type === 'CHEMICAL' ? 'bg-amber-100 text-amber-700' : evt.type === 'HARVEST' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>
                    {evt.type === 'CHEMICAL' ? <FlaskConical className="w-3 h-3" /> : evt.type === 'HARVEST' ? <Package className="w-3 h-3" /> : <Activity className="w-3 h-3" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-earth-bark truncate">{evt.title}</p>
                    <p className="text-[10px] text-earth-timber font-mono mt-0.5">{evt.timestamp} • {evt.user || 'Sameer Patil'}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Bottom: Quick Capture Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Record Chemical Spray', icon: <FlaskConical className="w-4 h-4 text-[#1B4D3E]" />, action: () => openQuickRecord('chemical') },
          { label: 'Log Harvest Batch', icon: <Package className="w-4 h-4 text-[#0369A1]" />, action: () => openQuickRecord('harvest') },
          { label: 'Open Field Map', icon: <MapPin className="w-4 h-4 text-[#7E3AF2]" />, action: () => setCurrentRoute('fields') },
          { label: 'NABL Lab Report', icon: <Sparkles className="w-4 h-4 text-[#B45309]" />, action: () => setCurrentRoute('laboratory') },
        ].map((a) => (
          <button key={a.label} onClick={a.action}
            className="flex items-center gap-2.5 p-3 bg-white border border-earth-border rounded-lg hover:bg-[#FAF8F5] hover:border-[#A7D7B5] transition-all group text-left shadow-sm">
            <div className="w-8 h-8 rounded-lg bg-[#EAF5EC] flex items-center justify-center shrink-0">{a.icon}</div>
            <span className="text-xs font-bold text-earth-bark group-hover:text-[#1B4D3E] transition-colors">{a.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

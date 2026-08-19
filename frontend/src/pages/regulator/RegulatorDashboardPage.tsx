import React from 'react';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import {
  ShieldAlert,
  ShieldCheck,
  AlertOctagon,
  FileCheck,
  MapPin,
  TrendingDown,
  Building,
  Trees,
  CheckCircle2,
  FileSpreadsheet,
  Layers,
  Sparkles,
  Scale,
} from 'lucide-react';

export const RegulatorDashboardPage: React.FC = () => {
  const {
    riskAlerts,
    allFarms,
    applications,
    traceabilityBatches,
    setCurrentRoute,
  } = useApp();

  const unresolvedAlerts = riskAlerts.filter((a) => !a.isResolved);
  const criticalViolations = unresolvedAlerts.filter((a) => a.severity === 'CRITICAL' || a.severity === 'HIGH');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-earth-border">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-earth-bark tracking-tight">
              Central Regulatory Surveillance & Food-Safety Command
            </h1>
            <Badge variant="ai" size="sm" mono>
              ✦ FSSAI & CIBRC STATUTORY GATEWAY
            </Badge>
          </div>
          <p className="text-xs text-earth-timber mt-1 font-mono">
            JURISDICTION: <strong className="text-earth-bark">Maharashtra State Directorate (Nashik & Pune Agri-Corridors)</strong> • APEDA Export Protocol
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentRoute('reports')}
            leftIcon={<FileSpreadsheet className="w-3.5 h-3.5 text-[#1B4D3E]" />}
            className="text-xs font-bold h-8"
          >
            Export Statutory Dossier
          </Button>
          <Button
            variant="leaf"
            size="sm"
            onClick={() => setCurrentRoute('risk')}
            leftIcon={<ShieldAlert className="w-3.5 h-3.5" />}
            className="text-xs font-bold h-8 shadow-sm"
          >
            Surveillance Alerts ({unresolvedAlerts.length})
          </Button>
        </div>
      </div>

      {/* KPI Deck */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
        {/* KPI 1: Registered Estates */}
        <Card padding="md" hoverEffect borderLeftAccent="leaf" className="bg-[#FDFBF7]">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-bold text-earth-timber uppercase tracking-wider">
                MONITORED HOLDINGS
              </p>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl font-extrabold text-earth-bark tracking-tight">{allFarms.length || 2}</span>
                <span className="text-xs text-earth-timber font-bold">ESTATES</span>
              </div>
            </div>
            <div className="w-9 h-9 rounded-lg bg-[#EAF5EC] border border-[#A7D7B5] text-[#1B4D3E] flex items-center justify-center shadow-inner">
              <Building className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-[#2B9348] font-bold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span className="text-[11px]">80.5 Hectares Registered</span>
          </div>
        </Card>

        {/* KPI 2: Compliance Rate */}
        <Card padding="md" hoverEffect borderLeftAccent="primary" className="bg-[#FDFBF7]">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-bold text-earth-timber uppercase tracking-wider">
                REGIONAL COMPLIANCE INDEX
              </p>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl font-extrabold text-earth-bark tracking-tight">96.4%</span>
                <span className="text-xs text-[#2B9348] font-bold">OPTIMAL</span>
              </div>
            </div>
            <div className="w-9 h-9 rounded-lg bg-[#E0F2FE] border border-[#BAE6FD] text-[#0369A1] flex items-center justify-center shadow-inner">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-earth-timber font-medium text-[11px]">
            <span>12 verified export batches</span>
          </div>
        </Card>

        {/* KPI 3: Chemical Flags */}
        <Card padding="md" hoverEffect borderLeftAccent="danger" className="bg-[#FDFBF7]">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-bold text-earth-timber uppercase tracking-wider">
                ACTIVE SURVEILLANCE FLAGS
              </p>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl font-extrabold text-[#B91C1C] tracking-tight">{unresolvedAlerts.length}</span>
                <span className="text-xs text-[#B91C1C] font-extrabold">FLAGS</span>
              </div>
            </div>
            <div className="w-9 h-9 rounded-lg bg-[#FEE2E2] border border-[#FCA5A5] text-[#B91C1C] flex items-center justify-center shadow-inner">
              <ShieldAlert className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-[#B91C1C] font-bold text-[11px]">
            <span>{criticalViolations.length} Withholding window flags</span>
          </div>
        </Card>

        {/* KPI 4: Banned Chemicals */}
        <Card padding="md" hoverEffect borderLeftAccent="leaf" className="bg-[#FDFBF7]">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-bold text-earth-timber uppercase tracking-wider">
                BANNED MOLECULES DETECTED
              </p>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl font-extrabold text-[#2B9348] tracking-tight">00</span>
                <span className="text-xs text-[#2B9348] font-bold">ZERO</span>
              </div>
            </div>
            <div className="w-9 h-9 rounded-lg bg-[#EAF5EC] border border-[#A7D7B5] text-[#1B4D3E] flex items-center justify-center shadow-inner">
              <Scale className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-[#2B9348] font-medium text-[11px]">
            <span>Monocrotophos / Endosulfan Free</span>
          </div>
        </Card>
      </div>

      {/* Main Surveillance Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Regional Farm Compliance Heatmap & Records */}
        <div className="lg:col-span-2 space-y-4">
          <Card padding="md" className="bg-white border-earth-border">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-mono font-bold text-earth-bark uppercase tracking-wider flex items-center gap-2">
                <Building className="w-3.5 h-3.5 text-[#1B4D3E]" />
                REGISTERED AGRICULTURAL HOLDINGS & RISK AUDIT
              </h3>
              <span className="text-xs font-mono text-earth-timber">District: Nashik, MH</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-[#FAF8F5] text-earth-timber font-bold border-y border-earth-border">
                  <tr>
                    <th className="py-2.5 px-3">ESTATE & REGISTRATION</th>
                    <th className="py-2.5 px-3">AREA</th>
                    <th className="py-2.5 px-3">FSSAI / CPCB LICENSE</th>
                    <th className="py-2.5 px-3">COMPOSITE RISK</th>
                    <th className="py-2.5 px-3 text-right">AUDIT STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-earth-border">
                  {allFarms.map((farm) => (
                    <tr key={farm.id} className="hover:bg-[#FAF8F5]/80 transition-colors">
                      <td className="py-2.5 px-3 font-bold text-earth-bark">
                        <div>{farm.name}</div>
                        <div className="text-[10px] text-earth-timber font-normal">{farm.location} • Farmer: {farm.farmerName}</div>
                      </td>
                      <td className="py-2.5 px-3 text-earth-bark">
                        {farm.totalAcreage} Acres
                      </td>
                      <td className="py-2.5 px-3 text-earth-timber text-[11px]">
                        <div>FSSAI #{farm.fssaiLicense}</div>
                        <div>{farm.cpcbRegistration}</div>
                      </td>
                      <td className="py-2.5 px-3">
                        <span className={`font-extrabold ${farm.compositeRiskScore > 70 ? 'text-red-700' : 'text-emerald-700'}`}>
                          {farm.compositeRiskScore}/100 ({farm.riskRating})
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <Badge
                          variant={farm.compositeRiskScore > 70 ? 'danger' : 'success'}
                          size="sm"
                          mono
                        >
                          {farm.compositeRiskScore > 70 ? 'AUDIT FLAGGED' : 'INSPECTED PASS'}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Active Risk Alerts */}
          <Card padding="md" className="bg-white border-earth-border space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-earth-border">
              <h3 className="text-xs font-mono font-bold text-earth-bark uppercase tracking-wider flex items-center gap-2">
                <ShieldAlert className="w-3.5 h-3.5 text-[#B91C1C]" />
                LIVE SURVEILLANCE NOTICES & WITHHOLDING VIOLATIONS
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentRoute('risk')}
                className="text-xs h-7 px-2 font-mono font-bold text-[#1B4D3E]"
              >
                OPEN RISK COMMAND →
              </Button>
            </div>

            <div className="space-y-2">
              {riskAlerts.map((alert) => (
                <div key={alert.id} className="p-3 bg-[#FAF8F5] rounded-lg border border-earth-border flex items-start gap-3">
                  <AlertOctagon className="w-4 h-4 text-[#B91C1C] shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-earth-bark">{alert.title}</h4>
                      <Badge severity={alert.severity} size="sm" mono />
                    </div>
                    <p className="text-[11px] text-earth-timber mt-0.5">{alert.summary}</p>
                    <p className="text-[10px] text-[#1B4D3E] font-mono mt-1 font-bold">
                      Required Action: {alert.recommendedAction}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Col: Statutory Standards & Chemical Ban Register */}
        <div className="space-y-4">
          <Card padding="md" className="bg-[#FAF8F5] border-earth-border space-y-3">
            <h3 className="text-xs font-mono font-bold text-earth-bark uppercase tracking-wider flex items-center gap-2">
              <Scale className="w-3.5 h-3.5 text-[#1B4D3E]" />
              STATUTORY STATUTE REPOSITORIES
            </h3>
            <div className="space-y-2 text-xs font-mono text-earth-bark">
              <div className="p-2.5 bg-white rounded border border-earth-border">
                <span className="font-bold block">FSSAI Contaminants & Residues (2022)</span>
                <span className="text-[10px] text-earth-timber">MRL tolerances for 142 food commodities</span>
              </div>
              <div className="p-2.5 bg-white rounded border border-earth-border">
                <span className="font-bold block">CIBRC Agrochemical Schedule (2026)</span>
                <span className="text-[10px] text-earth-timber">Banned molecule list & PHI intervals</span>
              </div>
              <div className="p-2.5 bg-white rounded border border-earth-border">
                <span className="font-bold block">APEDA Export Quality Standards (RMP)</span>
                <span className="text-[10px] text-earth-timber">Residue monitoring protocols for EU/GCC</span>
              </div>
            </div>
          </Card>

          <Card padding="md" className="bg-white border-earth-border space-y-3">
            <h3 className="text-xs font-mono font-bold text-earth-bark uppercase tracking-wider">
              REGULATORY ENFORCEMENT
            </h3>
            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentRoute('reports')}
                className="w-full justify-start text-xs font-bold font-mono"
                leftIcon={<FileCheck className="w-3.5 h-3.5 text-[#1B4D3E]" />}
              >
                Generate District Audit Dossier
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentRoute('traceability')}
                className="w-full justify-start text-xs font-bold font-mono"
                leftIcon={<ShieldCheck className="w-3.5 h-3.5 text-[#1B4D3E]" />}
              >
                Inspect Export Consignment QR Nodes
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

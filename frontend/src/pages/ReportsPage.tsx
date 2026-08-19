import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import {
  FileSpreadsheet,
  Download,
  FileText,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Layers,
  Sparkles,
  Loader2,
} from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const { activeFarm, addToast, applications, treatments, traceabilityBatches } = useApp();
  const [downloadingReport, setDownloadingReport] = useState<string | null>(null);

  const reportPacks = [
    {
      id: 'compliance-audit',
      title: 'FSSAI Farm Compliance Audit Certificate',
      description: 'Official comprehensive regulatory dossier compiling MRL compliance, pesticide application registry, and certified lab residues.',
      format: 'PDF (Official Signed)',
      recordsCount: `${applications.length} chemical sprays • ${traceabilityBatches.length} batches`,
      recommendedFor: 'APEDA Export Certification & Central FSSAI Inspections',
      tag: 'REGULATORY',
    },
    {
      id: 'chemical-log',
      title: 'Chemical Usage & Withholding (PHI) Log',
      description: 'Itemized chemical application stream detailing active ingredients, CPCB registration numbers, operator licenses, and safe harvest clearances.',
      format: 'CSV / Excel & PDF',
      recordsCount: `${applications.length} application records`,
      recommendedFor: 'Agronomist Field Audits & Pesticide Resistance Tracking',
      tag: 'CHEMICALS',
    },
    {
      id: 'amu-report',
      title: 'Antimicrobial Stewardship (AMU) & Milk Withdrawal Audit',
      description: 'Department of Animal Husbandry & Dairying (DAHD) veterinary log tracking WHO Critically Important Antimicrobials and herd withholding.',
      format: 'PDF & CSV',
      recordsCount: `${treatments.length} veterinary treatments`,
      recommendedFor: 'Dairy Cooperative Audits & Veterinary Inspections',
      tag: 'LIVESTOCK',
    },
    {
      id: 'traceability-dossier',
      title: 'End-to-End Batch Lineage & Traceability Export',
      description: '8-stage cryptographic product journey linking farm GPS coordinates, crop phenology, spray logs, and NABL lab certificates.',
      format: 'PDF + JSON Provenance',
      recordsCount: `${traceabilityBatches.length} serialized lots`,
      recommendedFor: 'Supermarket Buyer Due Diligence (EU & GCC)',
      tag: 'TRACEABILITY',
    },
  ];

  const handleDownload = (reportId: string, format: 'PDF' | 'CSV') => {
    setDownloadingReport(`${reportId}-${format}`);
    setTimeout(() => {
      setDownloadingReport(null);
      addToast({
        type: 'success',
        title: `Report Export Generated (${format})`,
        message: `${reportId.toUpperCase()} package ready and saved to local downloads.`,
      });
    }, 900);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1 border-b border-border">
        <div>
          <h1 className="text-2xl font-extrabold text-text-primary tracking-tight">
            Reports & Compliance Export Center
          </h1>
          <p className="text-xs text-text-secondary mt-0.5">
            Generate auditor-ready compliance dossiers, chemical usage logs, and food safety provenance packages
          </p>
        </div>
      </div>

      {/* Estate Dossier Banner */}
      <div className="p-4 bg-emerald-50 rounded-card border border-emerald-200 text-emerald-950 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-primary" />
            <h3 className="text-sm font-bold">Active Estate: {activeFarm?.name || 'Unknown'}</h3>
          </div>
          <div className="text-xs text-text-secondary mt-1 font-mono">
            FSSAI License: {activeFarm?.fssaiLicense || 'N/A'}   CPCB Registration: {activeFarm?.cpcbRegistration || 'N/A'}
          </div>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={() => handleDownload('full-estate-dossier', 'PDF')}
          isLoading={downloadingReport === 'full-estate-dossier-PDF'}
          leftIcon={<Download className="w-4 h-4" />}
          className="shrink-0 font-semibold"
        >
          Download Complete 2026 Estate Dossier (PDF)
        </Button>
      </div>

      {/* Report Packs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reportPacks.map((pack) => (
          <Card key={pack.id} className="p-5 flex flex-col justify-between hover:border-slate-300 transition-all">
            <div>
              <div className="flex items-start justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary-dark bg-emerald-100 px-2 py-0.5 rounded">
                  {pack.tag}
                </span>
                <span className="text-xs text-text-secondary font-mono">{pack.format}</span>
              </div>
              <h3 className="text-base font-bold text-text-primary mt-2">{pack.title}</h3>
              <p className="text-xs text-text-secondary mt-1.5 leading-relaxed">{pack.description}</p>

              <div className="mt-3 p-2.5 bg-slate-50 rounded-lg border border-border text-xs space-y-1 text-text-secondary">
                <div className="flex justify-between">
                  <span>Scope:</span>
                  <span className="font-semibold text-text-primary">{pack.recordsCount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Compliance Target:</span>
                  <span className="font-semibold text-primary-dark truncate max-w-[200px]">
                    {pack.recommendedFor.split('&')[0]}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-border flex items-center justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDownload(pack.id, 'CSV')}
                isLoading={downloadingReport === `${pack.id}-CSV`}
                leftIcon={<FileSpreadsheet className="w-3.5 h-3.5" />}
                className="text-xs h-8 px-3"
              >
                Export CSV
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleDownload(pack.id, 'PDF')}
                isLoading={downloadingReport === `${pack.id}-PDF`}
                leftIcon={<Download className="w-3.5 h-3.5" />}
                className="text-xs h-8 px-3"
              >
                Download PDF
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

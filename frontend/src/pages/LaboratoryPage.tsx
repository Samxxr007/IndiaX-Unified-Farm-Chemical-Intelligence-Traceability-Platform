import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Table, Column } from '../components/ui/Table';
import { LabSample } from '../types';
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Download,
  Plus,
  FileText,
  ShieldCheck,
  FlaskConical,
} from 'lucide-react';

export const LaboratoryPage: React.FC = () => {
  const { labSamples, openQuickRecord } = useApp();
  const [selectedSample, setSelectedSample] = useState<LabSample | null>(null);

  const pendingCount = labSamples.filter((s) => s.overallResult === 'IN_REVIEW').length;
  const passCount = labSamples.filter((s) => s.overallResult === 'PASS').length;

  const columns: Column<LabSample>[] = [
    {
      header: 'Sample Code',
      accessor: (s) => (
        <div>
          <span className="font-bold text-text-primary font-mono">{s.sampleCode}</span>
          <p className="text-xs text-text-secondary">Batch #{s.batchNumber}</p>
        </div>
      ),
    },
    {
      header: 'Target Crop & Dates',
      accessor: (s) => (
        <div>
          <span className="font-semibold text-text-primary">{s.crop}</span>
          <p className="text-xs text-text-secondary">Reported: {s.reportDate}</p>
        </div>
      ),
    },
    {
      header: 'Testing Laboratory & NABL Acc.',
      accessor: (s) => (
        <div>
          <p className="font-medium text-text-primary">{s.testingLabName}</p>
          <p className="text-xs font-mono text-text-secondary">Acc: {s.nablAccreditationNo}</p>
        </div>
      ),
    },
    {
      header: 'Multi-Residue Result',
      accessor: (s) => (
        <Badge
          variant={s.overallResult === 'PASS' ? 'success' : s.overallResult === 'IN_REVIEW' ? 'warning' : 'danger'}
          size="sm"
        >
          {s.overallResult === 'PASS' ? '✓ ALL PARAMETERS PASS' : '⚠ SECONDARY REVIEW PENDING'}
        </Badge>
      ),
    },
    {
      header: 'Certificate & Assay',
      accessor: (s) => (
        <Button
          variant="outline"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedSample(s);
          }}
          leftIcon={<FileText className="w-3.5 h-3.5 text-primary" />}
          className="text-xs h-7 px-2"
        >
          View Assay
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1 border-b border-border">
        <div>
          <h1 className="text-2xl font-extrabold text-text-primary tracking-tight">
            Laboratory & Analytical Center
          </h1>
          <p className="text-xs text-text-secondary mt-0.5">
            NABL-accredited ISO/IEC 17025 laboratory pesticide residue assays, heavy metals screens, and FSSAI export certificates
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="primary"
            size="sm"
            onClick={() => openQuickRecord('lab')}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Submit Lab Sample
          </Button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 border-l-4 border-l-status-success">
          <span className="text-xs font-semibold text-text-secondary uppercase">
            Completed & Verified Tests
          </span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold text-emerald-700">{passCount}</span>
            <span className="text-xs text-emerald-700 font-semibold">100% Pass Rate</span>
          </div>
          <p className="text-xs text-text-secondary mt-2">
            All detected residues &lt; statutory FSSAI MRL limits
          </p>
        </Card>

        <Card className="p-4 border-l-4 border-l-status-warning">
          <span className="text-xs font-semibold text-text-secondary uppercase">
            Pending / In-Review Samples
          </span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold text-amber-700">{pendingCount}</span>
            <span className="text-xs text-amber-700 font-semibold">GC-MS Re-run</span>
          </div>
          <p className="text-xs text-text-secondary mt-2">
            Secondary confirmatory chromatography active
          </p>
        </Card>

        <Card className="p-4 border-l-4 border-l-primary">
          <span className="text-xs font-semibold text-text-secondary uppercase">
            Screening Targets
          </span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold text-primary">142</span>
            <span className="text-xs text-text-secondary font-medium">MRL compounds</span>
          </div>
          <p className="text-xs text-text-secondary mt-2">
            Harmonized with EU Reg 396/2005 & APEDA GrapeNet
          </p>
        </Card>
      </div>

      {/* Lab Samples Table */}
      <Card title="Laboratory Residue Testing Directory" padding="none">
        <Table
          columns={columns}
          data={labSamples}
          keyExtractor={(s) => s.id}
          onRowClick={(s) => setSelectedSample(s)}
        />
      </Card>

      {/* Lab Sample Detail Modal */}
      {selectedSample && (
        <Modal
          isOpen={!!selectedSample}
          onClose={() => setSelectedSample(null)}
          title={`Residue Assay Certificate — ${selectedSample.sampleCode}`}
          subtitle={`${selectedSample.crop} (Batch #${selectedSample.batchNumber})`}
          size="lg"
        >
          <div className="space-y-4 text-xs">
            <div className="p-3.5 bg-slate-50 rounded-lg border border-border space-y-1.5">
              <div className="flex justify-between">
                <span className="text-text-secondary font-medium">Testing Facility:</span>
                <span className="font-bold text-text-primary">{selectedSample.testingLabName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary font-medium">NABL Accreditation #:</span>
                <span className="font-mono text-text-primary">{selectedSample.nablAccreditationNo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary font-medium">Report Timestamp:</span>
                <span className="font-medium text-text-primary">{selectedSample.reportDate}</span>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-text-primary uppercase tracking-wider text-[11px] mb-2">
                Tested Active Residue Profile (LC-MS/MS & GC-MS)
              </h4>
              <div className="border border-border rounded-lg overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-text-secondary font-semibold border-b border-border">
                    <tr>
                      <th className="py-2.5 px-3">Chemical Compound</th>
                      <th className="py-2.5 px-3">Detected Residue</th>
                      <th className="py-2.5 px-3">Statutory MRL</th>
                      <th className="py-2.5 px-3 text-right">Result</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {selectedSample.testedParameters.map((p, i) => (
                      <tr key={i}>
                        <td className="py-2.5 px-3 font-semibold text-text-primary">{p.chemicalName}</td>
                        <td className="py-2.5 px-3 font-mono text-text-secondary">{p.detectedLevelMgKg} mg/kg</td>
                        <td className="py-2.5 px-3 font-mono text-text-secondary">{p.fssaiMrlLimitMgKg} mg/kg</td>
                        <td className="py-2.5 px-3 text-right">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              p.status === 'PASS'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {p.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-emerald-950">
              <span className="font-bold block mb-1">Chief Analytical Chemist Note:</span>
              <p className="text-[11px] leading-relaxed">{selectedSample.technicianNotes}</p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
              <Button
                variant="outline"
                size="sm"
                onClick={() => alert(`Certificate ${selectedSample.sampleCode}.pdf downloaded.`)}
                leftIcon={<Download className="w-3.5 h-3.5" />}
              >
                Download Signed Certificate (PDF)
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setSelectedSample(null)}
              >
                Done
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

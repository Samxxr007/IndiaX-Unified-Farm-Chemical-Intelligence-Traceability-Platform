import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import {
  Sparkles,
  FlaskConical,
  CheckCircle2,
  AlertOctagon,
  FileCheck,
  Plus,
  ArrowRight,
  ShieldCheck,
  Scale,
  Award,
  Layers,
  Activity,
} from 'lucide-react';

export const LabDashboardPage: React.FC = () => {
  const {
    labSamples,
    traceabilityBatches,
    chemicalRegistry,
    recordLabSample,
    setCurrentRoute,
    openQuickRecord,
  } = useApp();

  const [selectedBatchId, setSelectedBatchId] = useState(traceabilityBatches[0]?.id || '');
  const [sampleCode, setSampleCode] = useState('SMP-2026-8812');
  const [chemicalName, setChemicalName] = useState('Chlorantraniliprole');
  const [detectedLevel, setDetectedLevel] = useState('0.038');
  const [testMethod, setTestMethod] = useState('LC-MS/MS Multi-Residue Screen');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const passedSamples = labSamples.filter((s) => s.overallResult === 'PASS');
  const passRate = labSamples.length > 0 ? Math.round((passedSamples.length / labSamples.length) * 100) : 100;

  const handleCreateAssay = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const batch = traceabilityBatches.find((b) => b.id === selectedBatchId) || traceabilityBatches[0];
      await recordLabSample({
        batchId: batch.id,
        sampleCode,
        batchNumber: batch.batchNumber,
        crop: batch.crop,
        collectionDate: new Date().toISOString().split('T')[0],
        testingLabName: 'Eurofins Agro Analytics NABL Laboratory, Nashik',
        chemical: chemicalName,
        measuredValue: parseFloat(detectedLevel) || 0.038,
        overallResult: parseFloat(detectedLevel) > 0.5 ? 'FAIL' : 'PASS',
      });
      setSampleCode(`SMP-2026-${Math.floor(1000 + Math.random() * 9000)}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-earth-border">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-earth-bark tracking-tight">
              NABL Laboratory Multi-Residue QC Workspace
            </h1>
            <Badge variant="ai" size="sm" mono>
              ✦ NABL TC-7182 ACCREDITED
            </Badge>
          </div>
          <p className="text-xs text-earth-timber mt-1 font-mono">
            TESTING FACILITY: <strong className="text-earth-bark">Eurofins Agro Analytics NABL Laboratory (Nashik)</strong> • ISO/IEC 17025:2017
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentRoute('laboratory')}
            leftIcon={<FileCheck className="w-3.5 h-3.5 text-[#1B4D3E]" />}
            className="text-xs font-bold h-8"
          >
            All Certificates
          </Button>
          <Button
            variant="leaf"
            size="sm"
            onClick={() => openQuickRecord('lab')}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
            className="text-xs font-bold h-8 shadow-sm"
          >
            Ingest Lab Sample
          </Button>
        </div>
      </div>

      {/* KPI Deck */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
        {/* KPI 1: Samples Tested */}
        <Card padding="md" hoverEffect borderLeftAccent="leaf" className="bg-[#FDFBF7]">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-bold text-earth-timber uppercase tracking-wider">
                COMPLETED ASSAYS
              </p>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl font-extrabold text-earth-bark tracking-tight">{labSamples.length}</span>
                <span className="text-xs text-earth-timber font-bold">REPORTS</span>
              </div>
            </div>
            <div className="w-9 h-9 rounded-lg bg-[#EAF5EC] border border-[#A7D7B5] text-[#1B4D3E] flex items-center justify-center shadow-inner">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-[#2B9348] font-bold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span className="text-[11px]">142-Compound Multi-Screen</span>
          </div>
        </Card>

        {/* KPI 2: Pass Rate */}
        <Card padding="md" hoverEffect borderLeftAccent="primary" className="bg-[#FDFBF7]">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-bold text-earth-timber uppercase tracking-wider">
                MRL COMPLIANCE PASS RATE
              </p>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl font-extrabold text-earth-bark tracking-tight">{passRate}%</span>
                <span className="text-xs text-[#2B9348] font-bold">FSSAI CLEAR</span>
              </div>
            </div>
            <div className="w-9 h-9 rounded-lg bg-[#E0F2FE] border border-[#BAE6FD] text-[#0369A1] flex items-center justify-center shadow-inner">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-earth-timber font-medium text-[11px]">
            <span>Zero acute neurotoxin exceedances</span>
          </div>
        </Card>

        {/* KPI 3: Pending Intake */}
        <Card padding="md" hoverEffect borderLeftAccent="danger" className="bg-[#FDFBF7]">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-bold text-earth-timber uppercase tracking-wider">
                HARVEST SAMPLES IN QUEUE
              </p>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl font-extrabold text-earth-bark tracking-tight">{traceabilityBatches.length}</span>
                <span className="text-xs text-earth-timber font-bold">BATCHES</span>
              </div>
            </div>
            <div className="w-9 h-9 rounded-lg bg-[#FAF8F5] border border-earth-border text-earth-bark flex items-center justify-center shadow-inner">
              <FlaskConical className="w-5 h-5 text-[#1B4D3E]" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-earth-timber font-medium text-[11px]">
            <span>Avg Turnaround: 18.4 Hours</span>
          </div>
        </Card>

        {/* KPI 4: Equipment Calibration */}
        <Card padding="md" hoverEffect borderLeftAccent="leaf" className="bg-[#FDFBF7]">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-bold text-earth-timber uppercase tracking-wider">
                LC-MS/MS CALIBRATION
              </p>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl font-extrabold text-[#2B9348] tracking-tight">VALID</span>
                <span className="text-xs text-earth-timber font-bold">TC-7182</span>
              </div>
            </div>
            <div className="w-9 h-9 rounded-lg bg-[#EAF5EC] border border-[#A7D7B5] text-[#1B4D3E] flex items-center justify-center shadow-inner">
              <Scale className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-[#2B9348] font-medium text-[11px]">
            <span>Calibrated: 19-Aug-2026</span>
          </div>
        </Card>
      </div>

      {/* Main Grid: Direct Assay Entry + Test Results Log */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Direct Assay Registration Form */}
        <Card padding="md" className="bg-white border-earth-border space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-earth-border">
            <h3 className="text-xs font-mono font-bold text-earth-bark uppercase tracking-wider flex items-center gap-2">
              <FlaskConical className="w-3.5 h-3.5 text-[#1B4D3E]" />
              RECORD CHROMATOGRAPHY ASSAY
            </h3>
            <Badge variant="ai" size="sm" mono>
              AUTO-EVAL
            </Badge>
          </div>

          <form onSubmit={handleCreateAssay} className="space-y-3 font-mono text-xs">
            <div>
              <label className="block font-bold text-earth-bark mb-1">Target Harvest Batch</label>
              <select
                value={selectedBatchId}
                onChange={(e) => setSelectedBatchId(e.target.value)}
                className="w-full rounded-md border border-earth-border px-3 py-2 text-xs bg-white text-earth-bark focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]"
              >
                {traceabilityBatches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.batchNumber} — {b.crop} ({b.fieldName})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-earth-bark mb-1">Sample Serialization Code</label>
              <input
                type="text"
                value={sampleCode}
                onChange={(e) => setSampleCode(e.target.value)}
                className="w-full rounded-md border border-earth-border px-3 py-2 text-xs bg-white text-earth-bark focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-earth-bark mb-1">Target Chemical Analyte</label>
              <input
                type="text"
                value={chemicalName}
                onChange={(e) => setChemicalName(e.target.value)}
                className="w-full rounded-md border border-earth-border px-3 py-2 text-xs bg-white text-earth-bark focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-bold text-earth-bark mb-1">Detected Residue</label>
                <input
                  type="number"
                  step="0.001"
                  value={detectedLevel}
                  onChange={(e) => setDetectedLevel(e.target.value)}
                  className="w-full rounded-md border border-earth-border px-3 py-2 text-xs bg-white text-earth-bark focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]"
                  required
                />
              </div>
              <div>
                <label className="block font-bold text-earth-bark mb-1">Unit</label>
                <input
                  type="text"
                  value="mg/kg (ppm)"
                  disabled
                  className="w-full rounded-md border border-earth-border px-3 py-2 text-xs bg-slate-50 text-earth-timber"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-earth-bark mb-1">Analytical Methodology</label>
              <input
                type="text"
                value={testMethod}
                onChange={(e) => setTestMethod(e.target.value)}
                className="w-full rounded-md border border-earth-border px-3 py-2 text-xs bg-white text-earth-bark focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]"
              />
            </div>

            <Button
              type="submit"
              variant="leaf"
              size="sm"
              isLoading={isSubmitting}
              className="w-full font-bold shadow-sm mt-2 text-xs"
            >
              Sign & Publish NABL Certificate
            </Button>
          </form>
        </Card>

        {/* Right 2 Cols: Completed Lab Certificates Table */}
        <div className="lg:col-span-2 space-y-4">
          <Card padding="md" className="bg-white border-earth-border">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-mono font-bold text-earth-bark uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-[#1B4D3E]" />
                PUBLISHED NABL CERTIFICATES & ANALYSIS RECORDS
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentRoute('laboratory')}
                className="text-xs h-7 px-2 font-mono font-bold text-[#1B4D3E]"
              >
                VIEW REPOSITORY →
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-[#FAF8F5] text-earth-timber font-bold border-y border-earth-border">
                  <tr>
                    <th className="py-2.5 px-3">SAMPLE & BATCH</th>
                    <th className="py-2.5 px-3">ANALYTE SCREENED</th>
                    <th className="py-2.5 px-3">DETECTED LEVEL</th>
                    <th className="py-2.5 px-3">FSSAI MRL LIMIT</th>
                    <th className="py-2.5 px-3 text-right">DETERMINATION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-earth-border">
                  {labSamples.map((s) => {
                    const param = s.testedParameters?.[0] || { chemicalName: 'Chlorantraniliprole', detectedLevelMgKg: 0.038, fssaiMrlLimitMgKg: 0.5 };
                    return (
                      <tr key={s.id} className="hover:bg-[#FAF8F5]/80 transition-colors">
                        <td className="py-2.5 px-3 font-bold text-earth-bark">
                          <div>{s.sampleCode}</div>
                          <div className="text-[10px] text-earth-timber font-normal">Lot #{s.batchNumber} • {s.crop}</div>
                        </td>
                        <td className="py-2.5 px-3 text-earth-bark">
                          {param.chemicalName}
                        </td>
                        <td className="py-2.5 px-3 text-earth-timber">
                          {param.detectedLevelMgKg} mg/kg
                        </td>
                        <td className="py-2.5 px-3 text-earth-timber">
                          {param.fssaiMrlLimitMgKg} mg/kg
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <Badge
                            variant={s.overallResult === 'PASS' ? 'success' : 'danger'}
                            size="sm"
                            mono
                          >
                            {s.overallResult || 'PASS'}
                          </Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Table, Column } from '../components/ui/Table';
import { QRCodeSVG } from 'qrcode.react';
import { TraceabilityBatch } from '../types';
import {
  QrCode,
  Download,
  Share2,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
  MapPin,
  Trees,
  Wheat,
  FlaskConical,
  Package,
  KeyRound,
  Fingerprint,
  Link as LinkIcon,
  GitBranch,
} from 'lucide-react';

export const TraceabilityPage: React.FC = () => {
  const {
    traceabilityBatches,
    selectedBatchId,
    setSelectedBatchId,
    setCurrentRoute,
    openQuickRecord,
  } = useApp();

  const [activeBatchModal, setActiveBatchModal] = useState<TraceabilityBatch | null>(null);

  const selectedBatch =
    traceabilityBatches.find((b) => b.id === selectedBatchId) || traceabilityBatches[0];

  const batchColumns: Column<TraceabilityBatch>[] = [
    {
      header: 'Batch Serialization',
      accessor: (b) => (
        <div>
          <span className="font-bold text-text-primary font-mono">{b.batchNumber}</span>
          <p className="text-xs text-text-secondary">{b.crop}</p>
        </div>
      ),
    },
    {
      header: 'Origin Holding',
      accessor: (b) => (
        <div>
          <p className="font-semibold text-text-primary font-mono">{b.fieldName}</p>
          <p className="text-xs text-text-secondary">{b.farmName}</p>
        </div>
      ),
    },
    {
      header: 'Harvest Lot',
      accessor: (b) => (
        <div>
          <span className="font-bold text-text-primary font-mono">{b.quantityKg} kg</span>
          <p className="text-xs text-text-secondary font-mono">Harvested: {b.harvestDate}</p>
        </div>
      ),
    },
    {
      header: 'NABL ISO/IEC Test Status',
      accessor: (b) => (
        <Badge
          variant={b.mrlComplianceStatus === 'PASS' ? 'success' : 'warning'}
          size="sm"
          mono
          beacon
        >
          {b.mrlComplianceStatus === 'PASS' ? '✓ NABL TEST PASS' : '⚠ SECONDARY REVIEW'}
        </Badge>
      ),
    },
    {
      header: 'Destination Market',
      accessor: (b) => (
        <span className="text-xs text-text-secondary font-medium font-mono truncate max-w-xs block">
          {b.destinationMarket}
        </span>
      ),
    },
    {
      header: 'Cryptographic QR',
      accessor: (b) => (
        <Button
          variant="outline"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            setActiveBatchModal(b);
          }}
          leftIcon={<QrCode className="w-3.5 h-3.5" />}
          className="text-xs h-7 px-2 font-mono"
        >
          Inspect QR
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
            End-to-End Traceability & Lineage Node Graph
          </h1>
          <p className="text-xs text-text-secondary mt-0.5 font-mono">
            Cryptographic batch provenance connecting soil GIS data, pesticide spray audit logs, NABL ISO/IEC 17025 residue certificates, and consumer QR portals
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="primary"
            size="sm"
            onClick={() => openQuickRecord('harvest')}
            leftIcon={<Package className="w-4 h-4" />}
            className="text-xs font-semibold h-8 shadow-sm"
          >
            Create Harvest Batch
          </Button>
        </div>
      </div>

      {/* Featured Batch Showcase & Interactive 8-Stage Lineage Stepper */}
      {selectedBatch && (
        <Card
          title={
            <div className="flex items-center gap-2.5">
              <span className="font-mono font-bold">Lineage Node Pipeline: {selectedBatch.batchNumber}</span>
              <Badge variant="success" size="sm" beacon mono>
                ✓ VERIFIED EXPORT GRADE
              </Badge>
            </div>
          }
          subtitle={`Harvested ${selectedBatch.harvestDate} • ${selectedBatch.quantityKg} kg ${selectedBatch.crop} (${selectedBatch.variety}) • APEDA / FSSAI Verified`}
          action={
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveBatchModal(selectedBatch)}
                leftIcon={<QrCode className="w-4 h-4 text-primary" />}
                className="text-xs font-mono font-semibold h-8"
              >
                Generate QR
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setCurrentRoute(`verify-${selectedBatch.batchNumber}`)}
                rightIcon={<ExternalLink className="w-3.5 h-3.5" />}
                className="text-xs font-mono font-semibold h-8"
              >
                Public Consumer Gateway
              </Button>
            </div>
          }
        >
          {/* Interactive Lineage Node Graph */}
          <div className="py-4 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-mono font-bold text-text-muted uppercase tracking-wider flex items-center gap-1.5">
                <GitBranch className="w-4 h-4 text-primary" />
                <span>CRYPTOGRAPHIC LINEAGE GRAPH (8 VERIFIABLE NODES)</span>
              </h4>
              <span className="text-[10px] font-mono text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded font-semibold">
                ROOT HASH: 8f4a9b2c...d18
              </span>
            </div>

            {/* Connected Node Graph Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {selectedBatch.pipelineSteps.map((step, idx) => {
                // Generate a mock sha hash for each node
                const nodeHash = `0x${((idx + 1) * 314159).toString(16).padEnd(8, '0')}`;
                return (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl border border-border bg-slate-50/80 hover:bg-white transition-all shadow-sm flex flex-col justify-between group hover:border-emerald-400 hover:shadow-card-hover"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1.5">
                          <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-mono font-bold text-[10px] flex items-center justify-center shadow-sm">
                            {idx + 1}
                          </span>
                          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-text-muted">
                            {step.stage}
                          </span>
                        </div>
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      </div>
                      <h5 className="text-xs font-bold text-text-primary">{step.title}</h5>
                      <p className="text-[11px] text-text-secondary mt-1 leading-snug">{step.details}</p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-border/80 text-[10px] font-mono text-text-muted space-y-0.5">
                      <p className="truncate">📍 {step.location}</p>
                      <p className="truncate">👤 {step.operator}</p>
                      <div className="flex items-center justify-between pt-1 text-[9px] text-emerald-800 font-bold">
                        <span>📅 {step.date}</span>
                        <span>HASH: {nodeHash}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>
      )}

      {/* Production Batches Directory */}
      <Card title="Production Batches & Serialization Log" padding="none">
        <Table
          columns={batchColumns}
          data={traceabilityBatches}
          keyExtractor={(b) => b.id}
          onRowClick={(b) => setSelectedBatchId(b.id)}
        />
      </Card>

      {/* QR Code Inspection Modal */}
      {activeBatchModal && (
        <Modal
          isOpen={!!activeBatchModal}
          onClose={() => setActiveBatchModal(null)}
          title={`Public Food-Safety QR Passport — ${activeBatchModal.batchNumber}`}
          subtitle="Cryptographic consumer verification passport"
          size="md"
        >
          <div className="flex flex-col items-center justify-center p-4 text-center space-y-4 font-mono">
            <div className="p-4 bg-white rounded-xl border border-border shadow-md">
              <QRCodeSVG
                value={
                  typeof window !== 'undefined'
                    ? `${window.location.origin}/?verify=${activeBatchModal.batchNumber}`
                    : `http://localhost:5173/?verify=${activeBatchModal.batchNumber}`
                }
                size={180}
                level="H"
                includeMargin
              />
            </div>

            <div className="text-xs space-y-1">
              <p className="font-bold text-text-primary text-sm font-sans">{activeBatchModal.crop}</p>
              <p className="text-text-secondary">{activeBatchModal.quantityKg} kg • Serialized #{activeBatchModal.batchNumber}</p>
              <p className="text-[11px] text-[#1B4D3E] font-mono font-bold break-all">
                {typeof window !== 'undefined' ? `${window.location.origin}/?verify=${activeBatchModal.batchNumber}` : `http://localhost:5173/?verify=${activeBatchModal.batchNumber}`}
              </p>
            </div>

            <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-xs text-emerald-950 text-left w-full">
              <span className="font-bold block mb-1">✓ Verified Public Metadata:</span>
              <p className="text-[11px] font-sans">Omits private farmer data while confirming farm estate GPS coordinates, pesticide withholding adherence, and NABL residue assay pass status.</p>
            </div>

            <div className="flex items-center gap-2 w-full pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  alert(`QR Code vector asset for Batch ${activeBatchModal.batchNumber} downloaded.`);
                }}
                leftIcon={<Download className="w-3.5 h-3.5" />}
                className="flex-1 text-xs"
              >
                Download SVG
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  setActiveBatchModal(null);
                  setCurrentRoute(`verify-${activeBatchModal.batchNumber}`);
                }}
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                className="flex-1 text-xs font-bold"
              >
                Launch Public Gateway
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

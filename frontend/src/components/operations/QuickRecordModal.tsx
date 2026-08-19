import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Tabs } from '../ui/Tabs';
import { ChemicalRecordForm } from './ChemicalRecordForm';
import { LivestockRecordForm } from './LivestockRecordForm';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { useApp } from '../../context/AppContext';
import { FlaskConical, Award, Wheat, Sparkles, QrCode } from 'lucide-react';

export interface QuickRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultType?: 'chemical' | 'livestock' | 'harvest' | 'lab';
}

export const QuickRecordModal: React.FC<QuickRecordModalProps> = ({
  isOpen,
  onClose,
  defaultType = 'chemical',
}) => {
  const { fields, traceabilityBatches, recordHarvestBatch, recordLabSample } = useApp();
  const [activeTab, setActiveTab] = useState<string>(defaultType);

  // Harvest form state
  const [harvestFieldId, setHarvestFieldId] = useState(fields[0]?.id || '');
  const [harvestQuantity, setHarvestQuantity] = useState('450');
  const [buyerName, setBuyerName] = useState('FreshDirect Agro Consignments');
  const [isHarvestSubmitting, setIsHarvestSubmitting] = useState(false);

  // Lab form state
  const [labBatchId, setLabBatchId] = useState(traceabilityBatches[0]?.id || '');
  const [labName, setLabName] = useState('Eurofins Agro Analytics Lab (Nashik)');
  const [isLabSubmitting, setIsLabSubmitting] = useState(false);

  const tabs = [
    { id: 'chemical', label: 'Chemical Spray', icon: <FlaskConical className="w-3.5 h-3.5" /> },
    { id: 'livestock', label: 'Livestock & AMU', icon: <Award className="w-3.5 h-3.5" /> },
    { id: 'harvest', label: 'Harvest Batch', icon: <Wheat className="w-3.5 h-3.5" /> },
    { id: 'lab', label: 'Lab Residue Test', icon: <Sparkles className="w-3.5 h-3.5" /> },
  ];

  const handleHarvestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const targetField = fields.find((f) => f.id === harvestFieldId) || fields[0];
    setIsHarvestSubmitting(true);
    await recordHarvestBatch({
      fieldId: targetField.id,
      fieldName: targetField.name,
      crop: targetField.currentCrop,
      variety: targetField.variety,
      quantityKg: parseFloat(harvestQuantity) || 450,
      buyerName,
    });
    setIsHarvestSubmitting(false);
    onClose();
  };

  const handleLabSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const targetBatch = traceabilityBatches.find((b) => b.id === labBatchId) || traceabilityBatches[0];
    setIsLabSubmitting(true);
    await recordLabSample({
      batchId: targetBatch.id,
      batchNumber: targetBatch.batchNumber,
      crop: targetBatch.crop,
      testingLabName: labName,
    });
    setIsLabSubmitting(false);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Record Operational Event"
      subtitle="Register verified agricultural events to update farm compliance telemetry & traceability pipeline"
      size="xl"
    >
      <div className="space-y-4">
        <Tabs
          tabs={tabs}
          activeTab={activeTab}
          onChange={setActiveTab}
          variant="segmented"
        />

        {activeTab === 'chemical' && (
          <ChemicalRecordForm onSuccess={onClose} onCancel={onClose} />
        )}

        {activeTab === 'livestock' && (
          <LivestockRecordForm onSuccess={onClose} onCancel={onClose} />
        )}

        {activeTab === 'harvest' && (
          <form onSubmit={handleHarvestSubmit} className="space-y-4 py-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <Select
                label="Harvest Source Parcel"
                value={harvestFieldId}
                onChange={(e) => setHarvestFieldId(e.target.value)}
                options={fields.map((f) => ({
                  value: f.id,
                  label: `${f.code} — ${f.name}`,
                  sublabel: `${f.currentCrop} • Ready: ${f.daysUntilHarvest}d`,
                }))}
              />
              <Input
                label="Harvest Quantity (kg)"
                type="number"
                value={harvestQuantity}
                onChange={(e) => setHarvestQuantity(e.target.value)}
                unit="kg"
                required
              />
            </div>
            <Input
              label="Off-taker / Export Hub Buyer"
              value={buyerName}
              onChange={(e) => setBuyerName(e.target.value)}
              placeholder="e.g. Dubai Agro Terminal / Reliance Retail"
              required
            />
            <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-xs text-emerald-950">
              <span className="font-bold block mb-0.5">✦ Automatic Lineage Pipeline</span>
              Harvesting this parcel will automatically inherit soil preparation, chemical logs, and link with upcoming NABL residue assays.
            </div>
            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border">
              <Button type="button" variant="outline" size="sm" onClick={onClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                isLoading={isHarvestSubmitting}
                leftIcon={<QrCode className="w-4 h-4" />}
              >
                Create Harvest Batch & Generate QR
              </Button>
            </div>
          </form>
        )}

        {activeTab === 'lab' && (
          <form onSubmit={handleLabSubmit} className="space-y-4 py-1">
            <Select
              label="Associated Harvest Batch"
              value={labBatchId}
              onChange={(e) => setLabBatchId(e.target.value)}
              options={traceabilityBatches.map((b) => ({
                value: b.id,
                label: `${b.batchNumber} — ${b.crop}`,
                sublabel: `${b.quantityKg} kg • ${b.fieldName}`,
              }))}
            />
            <Input
              label="Testing NABL Analytical Laboratory"
              value={labName}
              onChange={(e) => setLabName(e.target.value)}
              required
            />
            <div className="p-3 bg-purple-50 rounded-lg border border-purple-200 text-xs text-purple-950">
              <span className="font-bold block mb-0.5">✦ Multi-Residue LC-MS/MS Screen</span>
              Simulates automated analysis against 142 regulated active substances under FSSAI Gazette Schedule 2.
            </div>
            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border">
              <Button type="button" variant="outline" size="sm" onClick={onClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                isLoading={isLabSubmitting}
                leftIcon={<Sparkles className="w-4 h-4" />}
              >
                Submit & Verify Sample
              </Button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
};

import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Badge } from '../ui/Badge';
import {
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  Info,
  Calendar,
  Clock,
  ShieldCheck,
  Loader2,
  FileCheck,
  Scale,
} from 'lucide-react';

export interface ChemicalRecordFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  preselectedFieldId?: string;
}

export const ChemicalRecordForm: React.FC<ChemicalRecordFormProps> = ({
  onSuccess,
  onCancel,
  preselectedFieldId,
}) => {
  const {
    fields,
    chemicalRegistry,
    recordChemicalApplication,
    isVerifyingRegulatory,
  } = useApp();

  const [fieldId, setFieldId] = useState(preselectedFieldId || fields[0]?.id || '');
  const [selectedChemicalId, setSelectedChemicalId] = useState(chemicalRegistry[0]?.id || '');
  const [dosage, setDosage] = useState('60');
  const [targetPest, setTargetPest] = useState('Fruit Borer (Helicoverpa armigera)');
  const [applicatorName, setApplicatorName] = useState('Ramesh Shinde');
  const [applicatorLicense, setApplicatorLicense] = useState('MH-NAS-APL-2024-912');
  const [equipmentUsed, setEquipmentUsed] = useState('Tractor-mounted Boom Sprayer (0.4 bar)');
  const [weatherCondition, setWeatherCondition] = useState('Clear / Calm Wind (4 km/h)');
  const [temperatureC, setTemperatureC] = useState('27');
  const [applicationDate, setApplicationDate] = useState(new Date().toISOString().split('T')[0]);

  // Derived selected field and chemical metadata
  const selectedField = fields.find((f) => f.id === fieldId) || fields[0];
  const selectedChemical = chemicalRegistry.find((c) => c.id === selectedChemicalId) || chemicalRegistry[0];

  // Match MRL for the selected field's crop
  const cropName = selectedField?.activeCropCycle?.crop?.name || selectedField?.currentCrop || 'Unknown';
  const mrlList = selectedChemical?.mrlRecords || selectedChemical?.fssaiMRL || [];
  const matchedMrl = mrlList.find(
    (m: any) => m.crop?.toLowerCase().includes(cropName.split(' ')[0].toLowerCase())
  ) || mrlList[0];

  const withholdingDays = matchedMrl?.withholdingIntervalDays || 14;
  const mrlLimit = matchedMrl?.mrlMgKg || 0.5;
  const fssaiRef = matchedMrl?.officialGazetteRef || 'FSSAI Contaminants Notification 2022';

  // Calculate earliest safe harvest date
  const appDateObj = new Date(applicationDate);
  const safeHarvestDateObj = new Date(appDateObj);
  safeHarvestDateObj.setDate(safeHarvestDateObj.getDate() + withholdingDays);
  const earliestSafeHarvestDate = safeHarvestDateObj.toISOString().split('T')[0];

  // Compare with field's planned harvest date
  const plannedHarvestDateObj = new Date(selectedField?.expectedHarvestDate || new Date());
  const hasHarvestConflict = safeHarvestDateObj > plannedHarvestDateObj;

  // Calculate projected residue vs threshold for the visualization bar
  const projectedResidueMgKg = (mrlLimit * 0.08).toFixed(3);
  const residuePercentage = Math.min(100, Math.round((parseFloat(projectedResidueMgKg) / mrlLimit) * 100));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedField || !selectedChemical) return;

    await recordChemicalApplication({
      fieldId: selectedField.id,
      fieldName: selectedField.name,
      cropName: selectedField.currentCrop,
      tradeName: selectedChemical.tradeName,
      activeIngredient: selectedChemical.activeIngredient,
      chemicalType: selectedChemical.type,
      date: applicationDate,
      dosage: parseFloat(dosage) || 50,
      dosageUnit: selectedChemical.unit,
      targetPest,
      applicatorName,
      applicatorLicense,
      equipmentUsed,
      weatherCondition,
      temperatureC: parseInt(temperatureC, 10) || 26,
      fssaiReference: fssaiRef,
      mrlLimit,
      withholdingDays,
      earliestSafeHarvestDate,
    });

    if (onSuccess) {
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Field & Chemical Selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <Select
          label="Target Field / Parcel"
          value={fieldId}
          onChange={(e) => setFieldId(e.target.value)}
          options={fields.map((f) => ({
            value: f.id,
            label: `${f.code} — ${f.name}`,
            sublabel: `${f.currentCrop} • ${f.acreage} ac`,
          }))}
        />

        <Select
          label="Commercial Chemical Brand"
          value={selectedChemicalId}
          onChange={(e) => setSelectedChemicalId(e.target.value)}
          options={chemicalRegistry.map((c) => ({
            value: c.id,
            label: c.tradeName,
            sublabel: c.type,
          }))}
        />
      </div>

      {/* Auto-filled Active Ingredient & CIBRC/CPCB Reg Banner */}
      <div className="p-3.5 bg-slate-50 rounded-lg border border-border space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-text-secondary font-medium">Active Substance (Auto-resolved):</span>
          <span className="font-bold text-text-primary">{selectedChemical?.activeIngredient || 'N/A'}</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-text-secondary font-medium">CIBRC / CPCB Registration:</span>
          <span className="font-mono text-text-primary text-[11px] font-semibold">{selectedChemical?.cpcbRegistration || selectedChemical?.cpcbRegNumber || 'N/A'}</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-text-secondary font-medium">WHO Toxicity Classification:</span>
          <Badge variant={selectedChemical?.toxicityClass?.includes('II') ? 'warning' : 'neutral'} size="sm" mono>
            Class {selectedChemical?.toxicityClass || 'Unknown'}
          </Badge>
        </div>
      </div>

      {/* Progressive Disclosure: Regulatory Intelligence, MRL Card & Comparison Bar */}
      <div
        className={`p-4 rounded-xl border transition-all ${
          hasHarvestConflict
            ? 'bg-amber-50/90 border-amber-300 text-amber-950 shadow-sm'
            : 'bg-emerald-50/90 border-emerald-300 text-emerald-950 shadow-sm'
        }`}
      >
        <div className="flex items-start gap-3">
          {hasHarvestConflict ? (
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider font-mono flex items-center gap-2">
                <span>✦ INDIAX REGULATORY INTELLIGENCE</span>
                <Badge
                  variant={hasHarvestConflict ? 'warning' : 'success'}
                  size="sm"
                  beacon
                  mono
                >
                  {hasHarvestConflict ? 'WITHHOLDING CONFLICT' : 'DATA VERIFIED'}
                </Badge>
              </h4>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-3 pt-2.5 border-t border-current/15 text-xs font-mono">
              <div>
                <span className="opacity-75 block text-[10px] uppercase">FSSAI STATUTORY MRL</span>
                <span className="font-extrabold text-sm">{mrlLimit} mg/kg</span>
              </div>
              <div>
                <span className="opacity-75 block text-[10px] uppercase">PRE-HARVEST INTERVAL (PHI)</span>
                <span className="font-extrabold text-sm">{withholdingDays} Days</span>
              </div>
              <div>
                <span className="opacity-75 block text-[10px] uppercase">EARLIEST SAFE HARVEST</span>
                <span className="font-extrabold text-sm">{earliestSafeHarvestDate}</span>
              </div>
            </div>

            {/* MRL Comparison Bar Visualization */}
            <div className="mt-3 p-2.5 rounded bg-white/70 border border-current/10 space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="flex items-center gap-1 font-semibold">
                  <Scale className="w-3.5 h-3.5" /> Projected Post-PHI Residue: {projectedResidueMgKg} mg/kg
                </span>
                <span className="font-bold">{residuePercentage}% of MRL Limit</span>
              </div>
              <div className="w-full bg-slate-200/80 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-emerald-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${residuePercentage}%` }}
                />
              </div>
            </div>

            <p className="text-[11px] mt-2.5 opacity-90 leading-snug">
              <strong className="font-mono">Gazette Reference:</strong> {fssaiRef}
            </p>

            {hasHarvestConflict && (
              <p className="text-[11px] font-bold mt-1 text-amber-900 bg-amber-100/80 p-2 rounded border border-amber-300/60 font-mono">
                ⚠ WARNING: Planned harvest ({selectedField.expectedHarvestDate}) falls inside the mandatory {withholdingDays}-day withholding window. Deferring harvest to {earliestSafeHarvestDate} is required to guarantee export MRL clearance.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Operational Details (Dosage, Pest, Applicator, Weather) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Input
          label="Dosage per Acre"
          value={dosage}
          onChange={(e) => setDosage(e.target.value)}
          unit={selectedChemical.unit}
          required
        />
        <Input
          label="Application Date"
          type="date"
          value={applicationDate}
          onChange={(e) => setApplicationDate(e.target.value)}
          required
        />
        <Input
          label="Target Pest / Fungus"
          value={targetPest}
          onChange={(e) => setTargetPest(e.target.value)}
          required
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Input
          label="Certified Applicator Name"
          value={applicatorName}
          onChange={(e) => setApplicatorName(e.target.value)}
          required
        />
        <Input
          label="Applicator License #"
          value={applicatorLicense}
          onChange={(e) => setApplicatorLicense(e.target.value)}
          required
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Input
          label="Spraying Equipment"
          value={equipmentUsed}
          onChange={(e) => setEquipmentUsed(e.target.value)}
        />
        <Input
          label="Ambient Weather & Drift Telemetry"
          value={weatherCondition}
          onChange={(e) => setWeatherCondition(e.target.value)}
        />
      </div>

      {/* Submission Actions */}
      <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border">
        {onCancel && (
          <Button type="button" variant="outline" size="sm" onClick={onCancel} className="text-xs">
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          variant="primary"
          size="sm"
          isLoading={isVerifyingRegulatory}
          leftIcon={<ShieldCheck className="w-4 h-4" />}
          className="text-xs font-bold shadow-sm h-9 px-4"
        >
          {isVerifyingRegulatory ? 'IndiaX is checking available regulatory information...' : 'Verify & Record Application'}
        </Button>
      </div>
    </form>
  );
};

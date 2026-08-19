import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Badge } from '../ui/Badge';
import { AdminRoute, WHOMedicalImportance } from '../../types';
import { Award, AlertTriangle, ShieldCheck } from 'lucide-react';

export interface LivestockRecordFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  preselectedUnitId?: string;
}

export const LivestockRecordForm: React.FC<LivestockRecordFormProps> = ({
  onSuccess,
  onCancel,
  preselectedUnitId,
}) => {
  const { livestockUnits, recordLivestockTreatment } = useApp();

  const [unitId, setUnitId] = useState(preselectedUnitId || livestockUnits[0]?.id || '');
  const [animalTagId, setAnimalTagId] = useState('IN-MH-NAS-2024-GIR-019');
  const [medicationName, setMedicationName] = useState('Enrocin 10% (Enrofloxacin)');
  const [activeSubstance, setActiveSubstance] = useState('Enrofloxacin Injectable');
  const [antimicrobialClass, setAntimicrobialClass] = useState('Fluoroquinolones (3rd Gen)');
  const [whoImportance, setWhoImportance] = useState<WHOMedicalImportance>('CRITICALLY_IMPORTANT');
  const [diagnosis, setDiagnosis] = useState('Acute Clinical Coliform Mastitis');
  const [administrationRoute, setAdministrationRoute] = useState<AdminRoute>('INJECTION_IM');
  const [dosage, setDosage] = useState('15 ml / day for 3 days');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [withdrawalDays, setWithdrawalDays] = useState('7');
  const [prescribingVetName, setPrescribingVetName] = useState('Dr. Vivek Kulkarni, B.V.Sc');
  const [prescribingVetRegNumber, setPrescribingVetRegNumber] = useState('MSVC-8831');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedUnit = livestockUnits.find((u) => u.id === unitId) || livestockUnits[0];

  // Calculate safe milk / meat dates
  const startObj = new Date(startDate);
  const safeMilkObj = new Date(startObj);
  safeMilkObj.setDate(safeMilkObj.getDate() + (parseInt(withdrawalDays, 10) || 7));
  const safeMilkDate = safeMilkObj.toISOString().split('T')[0];

  const safeMeatObj = new Date(startObj);
  safeMeatObj.setDate(safeMeatObj.getDate() + (parseInt(withdrawalDays, 10) || 7) + 7);
  const safeMeatDate = safeMeatObj.toISOString().split('T')[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUnit) return;

    setIsSubmitting(true);
    await recordLivestockTreatment({
      unitId: selectedUnit.id,
      unitName: selectedUnit.name,
      animalTagId,
      medicationName,
      activeSubstance,
      antimicrobialClass,
      whoImportance,
      diagnosis,
      administrationRoute,
      dosage,
      startDate,
      endDate: startDate,
      withdrawalPeriodDays: parseInt(withdrawalDays, 10) || 7,
      safeMilkDate,
      safeMeatDate,
      prescribingVetName,
      prescribingVetRegNumber,
    });
    setIsSubmitting(false);

    if (onSuccess) onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Unit and Animal Tag */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <Select
          label="Livestock Herd / Unit"
          value={unitId}
          onChange={(e) => setUnitId(e.target.value)}
          options={livestockUnits.map((u) => ({
            value: u.id,
            label: `${u.code} — ${u.name}`,
            sublabel: `${u.headcount} Head • ${u.species}`,
          }))}
        />
        <Input
          label="Individual Animal Tag ID"
          value={animalTagId}
          onChange={(e) => setAnimalTagId(e.target.value)}
          placeholder="IN-MH-NAS-2024-GIR-XXX"
          required
        />
      </div>

      {/* Medication & Class */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <Input
          label="Veterinary Medication Name"
          value={medicationName}
          onChange={(e) => setMedicationName(e.target.value)}
          required
        />
        <Input
          label="Active Substance & Formulation"
          value={activeSubstance}
          onChange={(e) => setActiveSubstance(e.target.value)}
          required
        />
      </div>

      {/* Antimicrobial Classification */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <Input
          label="Antimicrobial Class"
          value={antimicrobialClass}
          onChange={(e) => setAntimicrobialClass(e.target.value)}
          required
        />
        <Select
          label="WHO Importance Classification"
          value={whoImportance}
          onChange={(e) => setWhoImportance(e.target.value as WHOMedicalImportance)}
          options={[
            { value: 'CRITICALLY_IMPORTANT', label: 'Highest Priority Critically Important (CIA)' },
            { value: 'HIGHLY_IMPORTANT', label: 'Highly Important Antimicrobial (HIA)' },
            { value: 'IMPORTANT', label: 'Important Antimicrobial (IA)' },
            { value: 'NOT_CLASSIFIED', label: 'Non-Antimicrobial (NSAID / Supportive)' },
          ]}
        />
      </div>

      {/* AMU Warning Card */}
      {whoImportance === 'CRITICALLY_IMPORTANT' && (
        <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-900 space-y-1">
          <div className="flex items-center gap-1.5 font-bold">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>✦ Antimicrobial Stewardship Flag</span>
          </div>
          <p className="text-[11px] leading-relaxed">
            This drug is classified by WHO / DAHD as Highest Priority Critically Important. Ensure mandatory milk segregation until {safeMilkDate} to avoid bulk tanker residue violations.
          </p>
        </div>
      )}

      {/* Diagnosis & Dosage */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Input
          label="Clinical Diagnosis"
          value={diagnosis}
          onChange={(e) => setDiagnosis(e.target.value)}
          required
        />
        <Select
          label="Route of Admin"
          value={administrationRoute}
          onChange={(e) => setAdministrationRoute(e.target.value as AdminRoute)}
          options={[
            { value: 'INJECTION_IM', label: 'Intramuscular (IM)' },
            { value: 'INJECTION_SC', label: 'Subcutaneous (SC)' },
            { value: 'ORAL', label: 'Oral Drench / Bolus' },
            { value: 'TOPICAL', label: 'Topical / Intramammary' },
            { value: 'FEED_ADDITIVE', label: 'Feed Additive' },
          ]}
        />
        <Input
          label="Dosage & Frequency"
          value={dosage}
          onChange={(e) => setDosage(e.target.value)}
          required
        />
      </div>

      {/* Withdrawal and Vet Details */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Input
          label="Treatment Date"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
        />
        <Input
          label="Withdrawal Days"
          type="number"
          value={withdrawalDays}
          onChange={(e) => setWithdrawalDays(e.target.value)}
          unit="Days"
          required
        />
        <Input
          label="Safe Milk Clearance"
          value={safeMilkDate}
          disabled
          unit="Clear"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Input
          label="Prescribing Veterinarian"
          value={prescribingVetName}
          onChange={(e) => setPrescribingVetName(e.target.value)}
          required
        />
        <Input
          label="Vet Council Reg Number"
          value={prescribingVetRegNumber}
          onChange={(e) => setPrescribingVetRegNumber(e.target.value)}
          required
        />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border">
        {onCancel && (
          <Button type="button" variant="outline" size="sm" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          variant="primary"
          size="sm"
          isLoading={isSubmitting}
          leftIcon={<ShieldCheck className="w-4 h-4" />}
        >
          Register AMU Record
        </Button>
      </div>
    </form>
  );
};

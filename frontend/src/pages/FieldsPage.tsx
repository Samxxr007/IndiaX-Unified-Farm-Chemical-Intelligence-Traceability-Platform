import React from 'react';
import { useApp } from '../context/AppContext';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Table, Column } from '../components/ui/Table';
import { Field } from '../types';
import { Trees, Plus, ArrowRight, ShieldAlert, Sparkles, Filter } from 'lucide-react';

export const FieldsPage: React.FC = () => {
  const { fields, setSelectedFieldId, setCurrentRoute, openQuickRecord } = useApp();

  const columns: Column<Field>[] = [
    {
      header: 'Parcel Code & Name',
      accessor: (f) => (
        <div>
          <span className="font-bold text-text-primary">{f.name}</span>
          <p className="text-xs font-mono text-text-secondary">{f.code} • {f.acreage} Acres</p>
        </div>
      ),
    },
    {
      header: 'Current Crop & Hybrid',
      accessor: (f) => (
        <div>
          <p className="font-medium text-text-primary">{f.currentCrop}</p>
          <p className="text-xs text-text-secondary">{f.variety}</p>
        </div>
      ),
    },
    {
      header: 'Harvest Timeline',
      accessor: (f) => (
        <div>
          <span className="font-semibold text-text-primary">{f.daysUntilHarvest} days remaining</span>
          <p className="text-xs text-text-secondary">Expected: {f.expectedHarvestDate}</p>
        </div>
      ),
    },
    {
      header: 'Health / Risk Rating',
      accessor: (f) => (
        <div className="flex items-center gap-2">
          <Badge severity={f.riskLevel} size="sm" />
          <span className="text-xs text-text-secondary font-medium">Health: {f.healthScore}</span>
        </div>
      ),
    },
    {
      header: 'Applied Residues',
      accessor: (f) => (
        <div className="flex flex-wrap gap-1 max-w-xs">
          {f.activeIngredientsApplied.map((ing, idx) => (
            <span
              key={idx}
              className="text-[10px] bg-slate-100 border border-slate-200 px-1.5 py-0.2 rounded text-text-secondary"
            >
              {ing.split(' ')[0]}
            </span>
          ))}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1 border-b border-border">
        <div>
          <h1 className="text-2xl font-extrabold text-text-primary tracking-tight">Agricultural Parcels & Fields</h1>
          <p className="text-xs text-text-secondary mt-0.5">
            Geospatial parcel boundary inventory, soil fertility records, and real-time residue clearance
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="primary"
            size="sm"
            onClick={() => openQuickRecord('chemical')}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Record Parcel Event
          </Button>
        </div>
      </div>

      {/* Parcels Grid View */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {fields.map((field) => (
          <Card
            key={field.id}
            hoverEffect
            onClick={() => {
              setSelectedFieldId(field.id);
              setCurrentRoute('field-detail');
            }}
            className="cursor-pointer p-4 border-l-4 transition-all"
            borderLeftAccent={field.riskLevel === 'HIGH' ? 'danger' : field.riskLevel === 'MEDIUM' ? 'warning' : 'success'}
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-mono font-semibold text-text-muted">{field.code}</span>
                <h3 className="text-sm font-bold text-text-primary mt-0.5">{field.name}</h3>
              </div>
              <Badge severity={field.riskLevel} size="sm" />
            </div>

            <div className="mt-3 p-2.5 rounded bg-slate-50 border border-border/80 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-text-secondary">Crop:</span>
                <span className="font-semibold text-text-primary">{field.currentCrop}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Acreage:</span>
                <span className="font-semibold text-text-primary">{field.acreage} Acres</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Days to Harvest:</span>
                <span className="font-bold text-primary-dark">{field.daysUntilHarvest} Days</span>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between pt-2 border-t border-border text-xs text-text-secondary">
              <span>{field.activeIngredientsApplied.length} active sprays logged</span>
              <span className="text-primary font-semibold flex items-center gap-1">
                Details <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </Card>
        ))}
      </div>

      {/* Tabular View */}
      <Card title="All Farm Parcels Directory" padding="none">
        <Table
          columns={columns}
          data={fields}
          keyExtractor={(f) => f.id}
          onRowClick={(f) => {
            setSelectedFieldId(f.id);
            setCurrentRoute('field-detail');
          }}
        />
      </Card>
    </div>
  );
};

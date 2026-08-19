import React from 'react';
import { useApp } from '../context/AppContext';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Table, Column } from '../components/ui/Table';
import { Farm } from '../types';
import { Building, MapPin, Phone, ShieldCheck, CheckCircle2, ChevronRight } from 'lucide-react';

export const FarmsPage: React.FC = () => {
  const { allFarms, activeFarm, setActiveFarmId, setCurrentRoute } = useApp();

  const columns: Column<Farm>[] = [
    {
      header: 'Farm Estate',
      accessor: (f) => (
        <div>
          <div className="font-bold text-text-primary flex items-center gap-2">
            <span>{f.name}</span>
            {f.id === activeFarm?.id && (
              <span className="text-[10px] bg-emerald-100 text-primary-dark font-semibold px-1.5 py-0.2 rounded">
                Active Context
              </span>
            )}
          </div>
          <p className="text-xs text-text-secondary">{f.code} • {f.location}</p>
        </div>
      ),
    },
    {
      header: 'Acreage & Parcels',
      accessor: (f) => (
        <div>
          <span className="font-semibold text-text-primary">{f.totalAcreage} Acres</span>
          <p className="text-xs text-text-secondary">{f.activeFieldsCount} active parcels</p>
        </div>
      ),
    },
    {
      header: 'Risk Score',
      accessor: (f) => (
        <div className="flex items-center gap-2">
          <span className="font-bold text-sm text-text-primary">{f.compositeRiskScore}/100</span>
          <Badge severity={f.riskRating} size="sm" />
        </div>
      ),
    },
    {
      header: 'FSSAI License / CPCB',
      accessor: (f) => (
        <div className="text-xs font-mono text-text-secondary">
          <p>{f.fssaiLicense}</p>
          <p className="text-[11px] text-text-muted">{f.cpcbRegistration}</p>
        </div>
      ),
    },
    {
      header: 'Lead Agronomist',
      accessor: (f) => (
        <div>
          <p className="font-medium text-text-primary">{f.farmerName}</p>
          <p className="text-xs text-text-secondary">{f.phone}</p>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1 border-b border-border">
        <div>
          <h1 className="text-2xl font-extrabold text-text-primary tracking-tight">Farm Estates Directory</h1>
          <p className="text-xs text-text-secondary mt-0.5">
            Manage multi-estate agricultural holdings, state registrations, and tenant risk telemetry
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {allFarms.map((farm) => {
          const isActive = farm.id === activeFarm?.id;
          return (
            <Card
              key={farm.id}
              className={`p-5 relative ${
                isActive ? 'border-primary ring-1 ring-primary/30 bg-emerald-50/20' : ''
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-text-primary">{farm.name}</h3>
                    <Badge severity={farm.riskRating} size="sm" />
                  </div>
                  <p className="text-xs text-text-secondary mt-0.5 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-text-muted" />
                    <span>{farm.location}, {farm.state}</span>
                  </p>
                </div>
                <span className="text-xs font-mono font-semibold bg-slate-100 px-2 py-1 rounded text-text-secondary">
                  {farm.code}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 my-4 p-3 rounded-lg bg-slate-50 border border-border text-xs">
                <div>
                  <span className="text-text-muted text-[10px] block">Acreage</span>
                  <span className="font-bold text-text-primary">{farm.totalAcreage} ac</span>
                </div>
                <div>
                  <span className="text-text-muted text-[10px] block">Active Parcels</span>
                  <span className="font-bold text-text-primary">{farm.activeFieldsCount} fields</span>
                </div>
                <div>
                  <span className="text-text-muted text-[10px] block">Risk Index</span>
                  <span className="font-bold text-rose-700">{farm.compositeRiskScore}/100</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-border/80">
                <span className="text-xs text-text-secondary">Manager: {farm.farmerName}</span>
                <div className="flex items-center gap-2">
                  {!isActive && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setActiveFarmId(farm.id)}
                      className="text-xs h-8"
                    >
                      Set Active
                    </Button>
                  )}
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      setActiveFarmId(farm.id);
                      setCurrentRoute('fields');
                    }}
                    rightIcon={<ChevronRight className="w-3.5 h-3.5" />}
                    className="text-xs h-8"
                  >
                    View Parcels
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <Card title="Estate Compliance & Licensing Registry" padding="none">
        <Table
          columns={columns}
          data={allFarms}
          keyExtractor={(f) => f.id}
          onRowClick={(f) => {
            setActiveFarmId(f.id);
            setCurrentRoute('fields');
          }}
        />
      </Card>
    </div>
  );
};

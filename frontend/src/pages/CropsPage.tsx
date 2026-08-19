import React from 'react';
import { useApp } from '../context/AppContext';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Wheat, Calendar, ShieldCheck, ChevronRight } from 'lucide-react';

export const CropsPage: React.FC = () => {
  const { fields, setSelectedFieldId, setCurrentRoute } = useApp();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1 border-b border-border">
        <div>
          <h1 className="text-2xl font-extrabold text-text-primary tracking-tight">Active Crop Cycles</h1>
          <p className="text-xs text-text-secondary mt-0.5">
            Monitor planting, vegetative phenology, MRL withholding timelines, and projected harvest windows
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {fields.map((field) => (
          <Card key={field.id} hoverEffect className="p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono text-text-muted">{field.code}</span>
                  <h3 className="text-sm font-bold text-text-primary mt-0.5">{field.currentCrop}</h3>
                  <p className="text-xs text-text-secondary">{field.variety}</p>
                </div>
                <Badge
                  variant={field.status === 'HARVESTING' ? 'warning' : 'success'}
                  size="sm"
                >
                  {field.status}
                </Badge>
              </div>

              <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-border text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-text-secondary">Sowing / Transplant:</span>
                  <span className="font-semibold text-text-primary">{field.sowingDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Expected Harvest:</span>
                  <span className="font-semibold text-text-primary">{field.expectedHarvestDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Withholding Status:</span>
                  <span className="font-bold text-emerald-700">
                    {field.daysUntilHarvest} days to harvest
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
              <span className="text-xs text-text-secondary">{field.acreage} Acres parcel</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedFieldId(field.id);
                  setCurrentRoute('field-detail');
                }}
                rightIcon={<ChevronRight className="w-3 h-3" />}
                className="text-xs h-7 px-2.5"
              >
                Parcel Log
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

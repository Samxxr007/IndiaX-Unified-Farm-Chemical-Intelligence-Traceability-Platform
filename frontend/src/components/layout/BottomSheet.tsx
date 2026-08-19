import React from 'react';
import { FlaskConical, Award, Wheat, Sparkles, X, ChevronRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({ isOpen, onClose }) => {
  const { openQuickRecord } = useApp();

  if (!isOpen) return null;

  const quickActions = [
    {
      type: 'chemical' as const,
      icon: <FlaskConical className="w-5 h-5 text-emerald-700" />,
      title: '🌱 Chemical Application',
      description: 'Log pesticide/fungicide spray, auto-verify MRL & withholding days.',
      bg: 'bg-emerald-50 border-emerald-200',
    },
    {
      type: 'livestock' as const,
      icon: <Award className="w-5 h-5 text-amber-700" />,
      title: '🐄 Livestock Treatment',
      description: 'Log veterinary drug, dose, and track active milk/meat withdrawal.',
      bg: 'bg-amber-50 border-amber-200',
    },
    {
      type: 'harvest' as const,
      icon: <Wheat className="w-5 h-5 text-blue-700" />,
      title: '🌾 Harvest & Batch Log',
      description: 'Create crop harvest lot and issue verifiable QR provenance code.',
      bg: 'bg-blue-50 border-blue-200',
    },
    {
      type: 'lab' as const,
      icon: <Sparkles className="w-5 h-5 text-purple-700" />,
      title: '🧪 Lab Test Result',
      description: 'Record NABL multi-residue assay and upload FSSAI certificate.',
      bg: 'bg-purple-50 border-purple-200',
    },
  ];

  const handleAction = (type: 'chemical' | 'livestock' | 'harvest' | 'lab') => {
    onClose();
    openQuickRecord(type);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden md:hidden">
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div className="fixed inset-x-0 bottom-0 max-h-[85vh] bg-white rounded-t-2xl shadow-modal border-t border-border p-4 pb-8 transform transition-transform animate-slide-up z-50 flex flex-col">
        <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mb-3" />
        <div className="flex items-center justify-between pb-3 border-b border-border mb-3">
          <div>
            <h3 className="text-base font-bold text-text-primary">Quick Record Operation</h3>
            <p className="text-xs text-text-secondary">Choose the agricultural telemetry event to register</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-text-secondary hover:text-text-primary rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-2.5 overflow-y-auto">
          {quickActions.map((action) => (
            <button
              key={action.type}
              onClick={() => handleAction(action.type)}
              className={`w-full p-3.5 rounded-lg border text-left flex items-center justify-between transition-all hover:scale-[1.01] ${action.bg}`}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-white shadow-sm flex items-center justify-center shrink-0">
                  {action.icon}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-text-primary">{action.title}</h4>
                  <p className="text-[11px] text-text-secondary mt-0.5">{action.description}</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-text-secondary shrink-0" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

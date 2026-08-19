import React from 'react';
import { LayoutDashboard, Trees, Plus, ShieldAlert, Menu } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export interface MobileNavProps {
  onOpenMoreMenu: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ onOpenMoreMenu }) => {
  const { currentRoute, setCurrentRoute, riskAlerts, openQuickRecord } = useApp();
  const unresolvedAlertsCount = riskAlerts.filter((a) => !a.isResolved).length;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#FAF8F5] border-t border-earth-border z-40 px-3 flex items-center justify-around select-none shadow-[0_-2px_10px_rgba(61,43,31,0.05)]">
      {/* Home */}
      <button
        onClick={() => setCurrentRoute('dashboard')}
        className={`flex flex-col items-center justify-center w-14 h-full ${
          currentRoute === 'dashboard' ? 'text-[#1B4D3E] font-bold' : 'text-earth-timber'
        }`}
      >
        <LayoutDashboard className="w-5 h-5 mb-0.5" />
        <span className="text-[10px] font-mono">Cockpit</span>
      </button>

      {/* Farm / Fields */}
      <button
        onClick={() => setCurrentRoute('fields')}
        className={`flex flex-col items-center justify-center w-14 h-full ${
          currentRoute === 'fields' || currentRoute === 'farms' ? 'text-[#1B4D3E] font-bold' : 'text-earth-timber'
        }`}
      >
        <Trees className="w-5 h-5 mb-0.5" />
        <span className="text-[10px] font-mono">Parcels</span>
      </button>

      {/* Center Floating Action Button (+) in Deep Crop Green */}
      <div className="relative -top-3">
        <button
          onClick={() => openQuickRecord('chemical')}
          className="w-12 h-12 rounded-full bg-[#2D6A4F] text-[#D8F3DC] flex items-center justify-center shadow-lg hover:bg-[#1B4D3E] active:scale-95 transition-all focus:outline-none ring-4 ring-[#FAF8F5]"
          title="Quick Agronomic Record"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>

      {/* Risk */}
      <button
        onClick={() => setCurrentRoute('risk')}
        className={`flex flex-col items-center justify-center w-14 h-full relative ${
          currentRoute === 'risk' ? 'text-[#1B4D3E] font-bold' : 'text-earth-timber'
        }`}
      >
        <ShieldAlert className="w-5 h-5 mb-0.5" />
        <span className="text-[10px] font-mono">Risks</span>
        {unresolvedAlertsCount > 0 && (
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#B91C1C]" />
        )}
      </button>

      {/* More Drawer */}
      <button
        onClick={onOpenMoreMenu}
        className="flex flex-col items-center justify-center w-14 h-full text-earth-timber hover:text-earth-bark"
      >
        <Menu className="w-5 h-5 mb-0.5" />
        <span className="text-[10px] font-mono">More</span>
      </button>
    </nav>
  );
};

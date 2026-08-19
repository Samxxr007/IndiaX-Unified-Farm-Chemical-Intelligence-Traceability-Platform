import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { TopNav } from './TopNav';
import { MobileNav } from './MobileNav';
import { BottomSheet } from './BottomSheet';
import { ToastContainer } from '../ui/Toast';
import { useApp } from '../../context/AppContext';
import { QuickRecordModal } from '../operations/QuickRecordModal';
import {
  FileSpreadsheet,
  LogOut,
  QrCode,
  ShieldAlert,
  Sparkles,
  Award,
  FlaskConical,
  Wheat,
  Trees,
  MapPin,
  LayoutDashboard,
  X,
} from 'lucide-react';

export interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const {
    toasts,
    dismissToast,
    isQuickRecordOpen,
    quickRecordType,
    closeQuickRecord,
    currentRoute,
    setCurrentRoute,
    user,
    logout,
  } = useApp();

  const [isMobileMoreOpen, setIsMobileMoreOpen] = useState(false);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

  const moreMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'farms', label: 'Farms Estates', icon: <MapPin className="w-4 h-4" /> },
    { id: 'fields', label: 'Fields & Parcels', icon: <Trees className="w-4 h-4" /> },
    { id: 'crops', label: 'Crop Cycles', icon: <Wheat className="w-4 h-4" /> },
    { id: 'applications', label: 'Chemical Usage & MRL', icon: <FlaskConical className="w-4 h-4" /> },
    { id: 'livestock', label: 'Livestock & AMU', icon: <Award className="w-4 h-4" /> },
    { id: 'risk', label: 'Risk Intelligence', icon: <ShieldAlert className="w-4 h-4" /> },
    { id: 'traceability', label: 'Traceability & QR', icon: <QrCode className="w-4 h-4" /> },
    { id: 'laboratory', label: 'Laboratory Testing', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'reports', label: 'Reports & Audits', icon: <FileSpreadsheet className="w-4 h-4" /> },
  ];

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      {/* Persistent Desktop Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <TopNav />

        {/* Scrollable Page Body */}
        <main className="flex-1 overflow-y-auto pb-20 md:pb-8 px-4 sm:px-6 lg:px-8 py-6">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav onOpenMoreMenu={() => setIsMobileMoreOpen(true)} />

      {/* Mobile Floating Action Trigger BottomSheet */}
      <BottomSheet
        isOpen={isBottomSheetOpen}
        onClose={() => setIsBottomSheetOpen(false)}
      />

      {/* Mobile "More" Full Screen Menu */}
      {isMobileMoreOpen && (
        <div className="fixed inset-0 z-50 bg-white flex flex-col md:hidden animate-fade-in">
          <div className="h-16 px-4 border-b border-border flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded bg-primary text-white flex items-center justify-center font-bold text-xs">
                INX
              </div>
              <span className="font-bold text-sm text-text-primary">Navigation Menu</span>
            </div>
            <button
              onClick={() => setIsMobileMoreOpen(false)}
              className="p-1 text-text-secondary hover:text-text-primary rounded-md"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-4 border-b border-border bg-emerald-50/50 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-800 text-white font-bold flex items-center justify-center">
              SP
            </div>
            <div>
              <p className="text-xs font-bold text-text-primary">{user.name}</p>
              <p className="text-[11px] text-text-secondary">{user.role}</p>
              <p className="text-[10px] text-primary font-medium mt-0.5">{user.organization}</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-1">
            {moreMenuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentRoute(item.id);
                  setIsMobileMoreOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold text-left transition-colors ${
                  currentRoute === item.id
                    ? 'bg-primary text-white'
                    : 'text-text-primary hover:bg-slate-100'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          <div className="p-4 border-t border-border bg-slate-50">
            <button
              onClick={() => {
                setIsMobileMoreOpen(false);
                logout();
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-rose-50 text-status-danger border border-rose-200 text-xs font-bold hover:bg-rose-100"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out Demo Session</span>
            </button>
          </div>
        </div>
      )}

      {/* Global Quick Record Modal */}
      {isQuickRecordOpen && (
        <QuickRecordModal
          isOpen={isQuickRecordOpen}
          onClose={closeQuickRecord}
          defaultType={quickRecordType || 'chemical'}
        />
      )}

      {/* Toast Alert Notifications */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
};

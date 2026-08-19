import React from 'react';
import {
  LayoutDashboard,
  MapPin,
  Trees,
  Wheat,
  FlaskConical,
  ShieldAlert,
  QrCode,
  FileSpreadsheet,
  Settings,
  HelpCircle,
  LogOut,
  ChevronRight,
  Sparkles,
  Award,
  Activity,
  Database,
  Sprout,
  Stethoscope,
  Calendar,
  ShieldCheck,
  Users,
  Server,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export interface SidebarProps {
  collapsed?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed = false }) => {
  const { currentRoute, setCurrentRoute, user, riskAlerts, activeFarm, logout } = useApp();

  const unresolvedAlertsCount = riskAlerts.filter((a) => !a.isResolved && !a.isRead).length;
  const userRole = user?.role || 'FARMER';

  // Role-scoped navigation groups
  const getNavGroups = () => {
    switch (userRole) {
      case 'VETERINARIAN':
        return [
          {
            title: 'VETERINARY STEWARDSHIP',
            items: [
              { id: 'vet-dashboard', label: 'Veterinary AMU Cockpit', icon: <Stethoscope className="w-4 h-4" />, code: 'VET-01' },
              { id: 'vet-calendar', label: 'Withdrawal Calendar', icon: <Calendar className="w-4 h-4" />, code: 'WTH-02' },
              { id: 'livestock', label: 'Herds & Livestock Units', icon: <Award className="w-4 h-4" />, code: 'HRD-03' },
            ],
          },
          {
            title: 'DRUG PROTOCOLS & AUDIT',
            items: [
              { id: 'applications', label: 'Approved Drug Registry', icon: <FlaskConical className="w-4 h-4" />, code: 'MED-04' },
              { id: 'risk', label: 'AMU Risk Diagnostics', icon: <ShieldAlert className="w-4 h-4" />, badge: unresolvedAlertsCount > 0 ? `${unresolvedAlertsCount} FLAGS` : undefined, code: 'RSK-05' },
              { id: 'reports', label: 'Prescription Dossiers', icon: <FileSpreadsheet className="w-4 h-4" />, code: 'AUD-06' },
            ],
          },
        ];

      case 'LABORATORY':
        return [
          {
            title: 'NABL QC OPERATIONS',
            items: [
              { id: 'lab-dashboard', label: 'Laboratory Cockpit', icon: <Sparkles className="w-4 h-4" />, code: 'LAB-01' },
              { id: 'laboratory', label: 'Tested Certificates', icon: <FileSpreadsheet className="w-4 h-4" />, code: 'CRT-02' },
              { id: 'traceability', label: 'Harvest Batch Queue', icon: <QrCode className="w-4 h-4" />, code: 'LOT-03' },
            ],
          },
          {
            title: 'STANDARDS & CALIBRATION',
            items: [
              { id: 'applications', label: 'FSSAI MRL Standards', icon: <FlaskConical className="w-4 h-4" />, code: 'MRL-04' },
              { id: 'reports', label: 'QC Audit Dossiers', icon: <FileSpreadsheet className="w-4 h-4" />, code: 'AUD-05' },
            ],
          },
        ];

      case 'REGULATOR':
        return [
          {
            title: 'FOOD-SAFETY SURVEILLANCE',
            items: [
              { id: 'regulator-dashboard', label: 'Surveillance Command', icon: <ShieldCheck className="w-4 h-4" />, code: 'REG-01' },
              { id: 'farms', label: 'Monitored Estates', icon: <MapPin className="w-4 h-4" />, code: 'EST-02' },
              { id: 'risk', label: 'District Risk Heatmap', icon: <ShieldAlert className="w-4 h-4" />, badge: unresolvedAlertsCount > 0 ? `${unresolvedAlertsCount} FLAGS` : undefined, code: 'RSK-03' },
            ],
          },
          {
            title: 'ENFORCEMENT & RULES',
            items: [
              { id: 'applications', label: 'Banned Chemicals Register', icon: <FlaskConical className="w-4 h-4" />, code: 'BAN-04' },
              { id: 'traceability', label: 'Export Consignments', icon: <QrCode className="w-4 h-4" />, code: 'EXP-05' },
              { id: 'reports', label: 'Statutory Dossiers', icon: <FileSpreadsheet className="w-4 h-4" />, code: 'AUD-06' },
            ],
          },
        ];

      case 'ADMIN':
        return [
          {
            title: 'PLATFORM GOVERNANCE',
            items: [
              { id: 'admin-dashboard', label: 'SuperAdmin Command', icon: <Server className="w-4 h-4" />, code: 'ADM-01' },
              { id: 'farms', label: 'Estate Directory', icon: <MapPin className="w-4 h-4" />, code: 'EST-02' },
              { id: 'applications', label: 'CIBRC Chemical Master', icon: <FlaskConical className="w-4 h-4" />, code: 'CHM-03' },
            ],
          },
          {
            title: 'SYSTEM & SECURITY',
            items: [
              { id: 'laboratory', label: 'NABL Labs Registry', icon: <Sparkles className="w-4 h-4" />, code: 'LAB-04' },
              { id: 'reports', label: 'System Audit Ledger', icon: <Activity className="w-4 h-4" />, code: 'LOG-05' },
            ],
          },
        ];

      case 'FARMER':
      default:
        return [
          {
            title: 'AGRONOMY COCKPIT',
            items: [
              { id: 'farmer-dashboard', label: 'Executive Overview', icon: <LayoutDashboard className="w-4 h-4" />, code: 'FARM-01' },
              { id: 'farms', label: 'Holding & Estates', icon: <MapPin className="w-4 h-4" />, code: 'EST-02' },
              { id: 'fields', label: 'Parcels & GIS Maps', icon: <Trees className="w-4 h-4" />, code: 'GIS-03' },
              { id: 'crops', label: 'Crop Phenology Stages', icon: <Wheat className="w-4 h-4" />, code: 'CPX-04' },
            ],
          },
          {
            title: 'OPERATIONS & COMPLIANCE',
            items: [
              { id: 'applications', label: 'Chemical Registry & MRL', icon: <FlaskConical className="w-4 h-4" />, code: 'MRL-05' },
              { id: 'livestock', label: 'Livestock & AMU Index', icon: <Award className="w-4 h-4" />, code: 'AMU-06' },
              { id: 'risk', label: 'Diagnostic Intelligence', icon: <ShieldAlert className="w-4 h-4" />, badge: unresolvedAlertsCount > 0 ? `${unresolvedAlertsCount} FLAGS` : undefined, code: 'RSK-07' },
              { id: 'traceability', label: 'Traceability & QR Node', icon: <QrCode className="w-4 h-4" />, code: 'TRC-08' },
              { id: 'laboratory', label: 'NABL Residue Lab', icon: <Sparkles className="w-4 h-4" />, code: 'LAB-09' },
              { id: 'reports', label: 'FSSAI Audit Dossiers', icon: <FileSpreadsheet className="w-4 h-4" />, code: 'AUD-10' },
            ],
          },
        ];
    }
  };

  const navGroups = getNavGroups();

  return (
    <aside
      className={`hidden md:flex flex-col bg-[#14281D] text-[#FAF8F5] border-r border-[#2D6A4F]/30 transition-all duration-200 z-30 shrink-0 select-none ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Brand & Agronomy Emblem Header */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-[#2D6A4F]/30 bg-[#0E1E15]/60">
        <div
          onClick={() => setCurrentRoute(userRole === 'VETERINARIAN' ? 'vet-dashboard' : userRole === 'LABORATORY' ? 'lab-dashboard' : userRole === 'REGULATOR' ? 'regulator-dashboard' : userRole === 'ADMIN' ? 'admin-dashboard' : 'farmer-dashboard')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-lg bg-[#2D6A4F] flex items-center justify-center text-[#D8F3DC] shadow-md ring-1 ring-[#52B788]/40 group-hover:scale-105 transition-transform">
            <Sprout className="w-5 h-5" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-extrabold text-sm tracking-tight text-[#FAF8F5] flex items-center gap-1.5">
                IndiaX
                <span className="text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.2 rounded bg-[#2D6A4F] text-[#D8F3DC] border border-[#52B788]/40">
                  {userRole.slice(0, 5)}
                </span>
              </span>
              <span className="text-[10px] text-[#A7D7B5] font-mono tracking-tight">Chemical & Traceability</span>
            </div>
          )}
        </div>
      </div>

      {/* Active Estate Telemetry Card */}
      {!collapsed && (
        <div className="px-3 pt-3 pb-1">
          <div className="p-2.5 rounded-lg bg-[#1B4D3E]/80 border border-[#2D6A4F]/50 shadow-inner flex items-center justify-between">
            <div className="min-w-0 pr-2">
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#52B788] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#52B788]" />
                </span>
                <p className="text-[10px] font-mono text-[#D8F3DC] uppercase tracking-wider font-bold truncate">
                  {userRole} MODE
                </p>
              </div>
              <p className="text-xs font-bold text-[#FAF8F5] truncate mt-0.5">{activeFarm?.name || 'Loading...'}</p>
              <p className="text-[10px] text-[#A7D7B5] font-mono truncate">{activeFarm?.district || ''} • {activeFarm?.totalAreaHectares?.toFixed(1) || '—'} ha</p>
            </div>
            <div className="text-right shrink-0">
              <span className="text-[9px] font-mono text-[#A7D7B5] block font-bold">RISK</span>
              <span className="text-xs font-mono font-extrabold text-[#FCA5A5]">{activeFarm?.compositeRiskScore ?? '—'}</span>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Groups */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-5 scrollbar-thin">
        {navGroups.map((group) => (
          <div key={group.title} className="space-y-1">
            {!collapsed && (
              <h3 className="px-2.5 text-[10px] font-mono font-bold text-[#A7D7B5] uppercase tracking-wider">
                {group.title}
              </h3>
            )}
            <div className="space-y-0.5 pt-1">
              {group.items.map((item) => {
                const isActive = currentRoute === item.id || (currentRoute === 'dashboard' && item.id.includes('dashboard'));
                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentRoute(item.id)}
                    title={collapsed ? item.label : undefined}
                    className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-semibold transition-all group ${
                      isActive
                        ? 'bg-[#2D6A4F] text-[#FAF8F5] shadow-sm font-bold border border-[#52B788]/40'
                        : 'text-[#D8F3DC]/80 hover:bg-[#1B4D3E]/60 hover:text-[#FAF8F5]'
                    } ${collapsed ? 'justify-center px-0' : ''}`}
                  >
                    <span className={isActive ? 'text-[#D8F3DC]' : 'text-[#A7D7B5] group-hover:text-[#D8F3DC]'}>
                      {item.icon}
                    </span>
                    {!collapsed && (
                      <div className="flex-1 flex items-center justify-between min-w-0">
                        <span className="truncate">{item.label}</span>
                        {item.badge ? (
                          <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-[#B91C1C] text-white border border-red-400 shrink-0">
                            {item.badge}
                          </span>
                        ) : (
                          <span className="text-[9px] font-mono text-[#A7D7B5]/60 group-hover:text-[#A7D7B5] transition-colors shrink-0">
                            {item.code}
                          </span>
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer User Profile & Logout */}
      <div className="p-3 border-t border-[#2D6A4F]/30 bg-[#0E1E15]/60 space-y-1.5">
        <div className="flex items-center justify-between p-2 rounded-lg bg-[#1B4D3E]/40 border border-[#2D6A4F]/40">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-full bg-[#2D6A4F] text-[#D8F3DC] font-mono font-bold text-xs flex items-center justify-center shrink-0 border border-[#52B788]/40">
              {user?.fullName?.split(' ').map((n) => n[0]).join('').slice(0, 2) || 'US'}
            </div>
            {!collapsed && (
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-[#FAF8F5] truncate">{user?.fullName || 'User'}</p>
                <p className="text-[10px] text-[#A7D7B5] font-mono truncate">{user?.role} Portal</p>
              </div>
            )}
          </div>
          {!collapsed && (
            <button
              onClick={logout}
              title="Sign Out"
              className="p-1 rounded text-[#A7D7B5] hover:text-[#FAF8F5] hover:bg-[#2D6A4F]/60 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};

import React, { useState, useEffect } from 'react';
import {
  Search,
  Bell,
  Plus,
  Building,
  RefreshCw,
  ChevronDown,
  AlertOctagon,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  CloudSun,
  Droplets,
  Sprout,
  UserCheck,
  Stethoscope,
  FlaskConical,
  Scale,
  Server,
  Users,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

export const TopNav: React.FC = () => {
  const {
    activeFarm,
    allFarms,
    setActiveFarmId,
    searchQuery,
    setSearchQuery,
    riskAlerts,
    openQuickRecord,
    setCurrentRoute,
    setSelectedFieldId,
    setSelectedBatchId,
    user,
    switchRole,
  } = useApp();

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isFarmDropdownOpen, setIsFarmDropdownOpen] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const unresolvedAlerts = riskAlerts.filter((a) => !a.isResolved);
  const userRole = user?.role || 'FARMER';

  const roleOptions: { role: 'FARMER' | 'VETERINARIAN' | 'LABORATORY' | 'REGULATOR' | 'ADMIN'; title: string; subtitle: string; icon: React.ReactNode; color: string }[] = [
    {
      role: 'FARMER',
      title: 'Farmer / Agronomist',
      subtitle: 'Crop GIS, Sprays & PHI Withholding',
      icon: <Sprout className="w-3.5 h-3.5" />,
      color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    },
    {
      role: 'VETERINARIAN',
      title: 'Veterinarian (VCI)',
      subtitle: 'Livestock AMU, Prescriptions & Withdrawal',
      icon: <Stethoscope className="w-3.5 h-3.5" />,
      color: 'text-blue-700 bg-blue-50 border-blue-200',
    },
    {
      role: 'LABORATORY',
      title: 'NABL QC Laboratory',
      subtitle: 'LC-MS/MS Assay Entry & Certificates',
      icon: <Sparkles className="w-3.5 h-3.5" />,
      color: 'text-purple-700 bg-purple-50 border-purple-200',
    },
    {
      role: 'REGULATOR',
      title: 'Regulator / Inspector (FSSAI)',
      subtitle: 'Surveillance, Chemical Bans & Audits',
      icon: <Scale className="w-3.5 h-3.5" />,
      color: 'text-amber-700 bg-amber-50 border-amber-200',
    },
    {
      role: 'ADMIN',
      title: 'Platform SuperAdmin',
      subtitle: 'User RBAC, Chemical Registry Master & Logs',
      icon: <Server className="w-3.5 h-3.5" />,
      color: 'text-slate-700 bg-slate-100 border-slate-300',
    },
  ];

  const currentRoleOpt = roleOptions.find((r) => r.role === userRole) || roleOptions[0];

  // Keyboard shortcut listener (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.getElementById('global-search-input');
        if (searchInput) searchInput.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <header className="h-16 border-b border-earth-border bg-[#FAF8F5] flex items-center justify-between px-4 sm:px-6 z-20 shrink-0 select-none shadow-[0_1px_3px_rgba(61,43,31,0.03)]">
      {/* Left: Farm Switcher & Agro-Climate Telemetry */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <button
            onClick={() => setIsFarmDropdownOpen(!isFarmDropdownOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-earth-border bg-white hover:bg-[#FDFBF7] transition-all text-xs font-bold text-earth-bark shadow-sm"
          >
            <Building className="w-3.5 h-3.5 text-[#1B4D3E]" />
            <span className="max-w-[150px] sm:max-w-[180px] truncate font-bold">{activeFarm?.name || 'Loading...'}</span>
            <span className="font-mono text-[10px] text-earth-timber bg-[#FAF8F5] px-1.5 py-0.2 rounded border border-earth-border">
              {activeFarm?.district || 'India'}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-earth-timber ml-0.5" />
          </button>

          {isFarmDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-20"
                onClick={() => setIsFarmDropdownOpen(false)}
              />
              <div className="absolute left-0 mt-1.5 w-72 rounded-lg bg-white shadow-modal border border-earth-border py-1.5 z-30 divide-y divide-[#F4EFEA]">
                <div className="px-3.5 py-2 text-[10px] font-mono font-bold text-earth-timber uppercase tracking-wider flex items-center justify-between">
                  <span>REGISTERED HOLDINGS</span>
                  <span>{allFarms.length} ESTATES</span>
                </div>
                {allFarms.map((farm) => (
                  <button
                    key={farm.id}
                    onClick={() => {
                      setActiveFarmId(farm.id);
                      setIsFarmDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2.5 text-xs transition-colors flex items-center justify-between ${
                      farm.id === activeFarm?.id
                        ? 'bg-[#EAF5EC] text-[#1B4D3E] font-bold'
                        : 'text-earth-bark hover:bg-[#FAF8F5]'
                    }`}
                  >
                    <div>
                      <p className="truncate font-bold">{farm.name}</p>
                      <p className="text-[10px] font-mono text-earth-timber mt-0.5">
                        {farm.code || 'CODE'} • {farm.totalAreaHectares?.toFixed(1) || farm.totalAcreage || '--'} ha • Risk: {farm.compositeRiskScore || '--'}/100
                      </p>
                    </div>
                    {farm.id === activeFarm?.id && (
                      <span className="w-2 h-2 rounded-full bg-[#2D6A4F] ring-2 ring-[#D8F3DC]" />
                    )}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Dynamic Role & Jurisdiction Pill */}
        <div className="hidden lg:flex items-center gap-2 text-xs bg-white px-3 py-1 rounded-md border border-earth-border text-earth-timber shadow-sm font-mono text-[11px]">
          <span className="flex items-center gap-1 font-bold text-[#1B4D3E]">
            <Sprout className="w-3.5 h-3.5" /> {userRole} MODE
          </span>
          <span className="text-earth-border">•</span>
          <span className="text-earth-timber truncate max-w-[140px]">
            {user?.fullName || 'User'}
          </span>
        </div>
      </div>

      {/* Center: Search Input */}
      <div className="flex-1 max-w-md mx-3 hidden md:block relative">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-earth-timber" />
          <input
            id="global-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
            placeholder="Search parcels, drugs, batch TOM-2026-001..."
            className="w-full bg-white hover:border-earth-borderDark focus:bg-white text-xs rounded-md border border-earth-border pl-9 pr-14 py-2 text-earth-bark placeholder:text-earth-timber/60 focus:outline-none focus:ring-2 focus:ring-[#1B4D3E] focus:border-[#1B4D3E] transition-all shadow-[0_1px_2px_rgba(61,43,31,0.03)]"
          />
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-0.5 text-[10px] font-mono text-earth-timber bg-[#FAF8F5] border border-earth-border rounded px-1.5 py-0.5 pointer-events-none">
            <span>⌘K</span>
          </div>
        </div>

        {/* Quick Search Autocomplete Dropdown */}
        {isSearchFocused && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-earth-border rounded-lg shadow-dropdown p-2 z-30 space-y-1 text-xs">
            <div className="text-[10px] font-mono font-bold text-earth-timber uppercase px-2 py-1 flex items-center justify-between">
              <span>ACTIVE REGISTRY ENTITIES</span>
              <span>PARCEL / BATCH</span>
            </div>
            <button
              onMouseDown={() => {
                setSelectedFieldId('field-a');
                setCurrentRoute('field-detail');
              }}
              className="w-full text-left px-2.5 py-1.5 rounded hover:bg-[#FAF8F5] flex items-center justify-between text-earth-bark"
            >
              <div className="flex items-center gap-2">
                <span className="font-mono text-earth-timber text-[11px]">FLD-A01</span>
                <span className="font-bold">Field A — North Orchard (Tomatoes)</span>
              </div>
              <Badge severity="HIGH" size="sm" mono>
                72 RISK
              </Badge>
            </button>
            <button
              onMouseDown={() => {
                setSelectedBatchId('batch-001');
                setCurrentRoute('traceability');
              }}
              className="w-full text-left px-2.5 py-1.5 rounded hover:bg-[#FAF8F5] flex items-center justify-between text-earth-bark"
            >
              <div className="flex items-center gap-2">
                <span className="font-mono text-[#1B4D3E] text-[11px] font-bold">BATCH</span>
                <span className="font-bold">TOM-2026-001 (420 kg Export Lot)</span>
              </div>
              <Badge variant="success" size="sm" mono>
                ✓ VERIFIED
              </Badge>
            </button>
          </div>
        )}
      </div>

      {/* Right Actions: Interactive Role Switcher & Notifications */}
      <div className="flex items-center gap-2.5">
        {/* Offline-First Sync Status Badge (Section 18) */}
        <div
          title="IndiaX Offline-First Synchronizer: Local IndexedDB / PostgreSQL Ledger Synced"
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-[#EAF5EC] border border-[#A7D7B5] rounded-md text-[11px] font-mono font-bold text-[#1B4D3E] cursor-pointer hover:bg-[#D8F3DC] transition-colors"
          onClick={() => {
            alert('IndiaX Synchronizer: All local field applications, livestock treatments, and batch hashes are fully synchronized with the PostgreSQL cloud ledger.');
          }}
        >
          <span className="w-2 h-2 rounded-full bg-[#2B9348] animate-pulse" />
          <span>SYNCED</span>
        </div>

        {/* Interactive Role Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold font-mono border transition-all shadow-sm ${currentRoleOpt.color}`}
            title="Click to Switch Portal Role"
          >
            {currentRoleOpt.icon}
            <span className="hidden sm:inline">{currentRoleOpt.title.split(' ')[0]}</span>
            <ChevronDown className="w-3 h-3 opacity-70" />
          </button>

          {isRoleDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-20"
                onClick={() => setIsRoleDropdownOpen(false)}
              />
              <div className="absolute right-0 mt-1.5 w-72 rounded-xl bg-white shadow-modal border border-earth-border py-2 z-30 divide-y divide-[#F4EFEA]">
                <div className="px-3.5 py-1.5 text-[10px] font-mono font-bold text-earth-timber uppercase tracking-wider flex items-center justify-between">
                  <span>SWITCH ROLE COCKPIT</span>
                  <span className="text-[#1B4D3E]">LIVE DEMO</span>
                </div>
                <div className="py-1">
                  {roleOptions.map((opt) => (
                    <button
                      key={opt.role}
                      onClick={() => {
                        switchRole(opt.role);
                        setIsRoleDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2.5 text-xs transition-colors flex items-center gap-3 ${
                        opt.role === userRole
                          ? 'bg-[#EAF5EC] text-[#1B4D3E] font-bold'
                          : 'text-earth-bark hover:bg-[#FAF8F5]'
                      }`}
                    >
                      <div className={`p-1.5 rounded-lg border shrink-0 ${opt.color}`}>
                        {opt.icon}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-bold truncate">{opt.title}</p>
                          {opt.role === userRole && (
                            <span className="w-1.5 h-1.5 rounded-full bg-[#2D6A4F]" />
                          )}
                        </div>
                        <p className="text-[10px] text-earth-timber font-mono truncate mt-0.5">
                          {opt.subtitle}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Quick Record Operation Button */}
        <Button
          variant="primary"
          size="sm"
          leftIcon={<Plus className="w-3.5 h-3.5" />}
          onClick={() => {
            if (userRole === 'VETERINARIAN') openQuickRecord('livestock');
            else if (userRole === 'LABORATORY') openQuickRecord('lab');
            else openQuickRecord('chemical');
          }}
          className="shadow-sm font-bold text-xs h-8 px-3 bg-[#2D6A4F] hover:bg-[#1B4D3E]"
        >
          <span className="hidden sm:inline">
            {userRole === 'VETERINARIAN' ? 'Prescribe' : userRole === 'LABORATORY' ? 'Log Assay' : 'Record'}
          </span>
          <span className="sm:hidden">+</span>
        </Button>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="relative p-2 rounded-md text-earth-timber hover:text-earth-bark hover:bg-white transition-colors border border-transparent hover:border-earth-border focus:outline-none"
            title="Risk Alerts"
          >
            <Bell className="w-4 h-4" />
            {unresolvedAlerts.length > 0 && (
              <span className="absolute top-1 right-1 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#B91C1C] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#B91C1C]" />
              </span>
            )}
          </button>

          {isNotificationsOpen && (
            <>
              <div
                className="fixed inset-0 z-20"
                onClick={() => setIsNotificationsOpen(false)}
              />
              <div className="absolute right-0 mt-1.5 w-80 sm:w-96 rounded-xl bg-white shadow-modal border border-earth-border py-2 z-30 divide-y divide-[#F4EFEA]">
                <div className="px-4 py-2.5 flex items-center justify-between bg-[#FAF8F5]">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold font-mono text-earth-bark uppercase tracking-wider">
                      RISK & SURVEILLANCE FLAGS
                    </span>
                    <Badge variant="danger" size="sm" mono>
                      {unresolvedAlerts.length} ACTIVE
                    </Badge>
                  </div>
                  <button
                    onClick={() => {
                      setCurrentRoute('risk');
                      setIsNotificationsOpen(false);
                    }}
                    className="text-[11px] font-bold text-[#1B4D3E] hover:underline"
                  >
                    View All
                  </button>
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-[#F4EFEA]">
                  {unresolvedAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      onClick={() => {
                        setCurrentRoute('risk');
                        setIsNotificationsOpen(false);
                      }}
                      className="p-3 hover:bg-[#FAF8F5] cursor-pointer transition-colors"
                    >
                      <div className="flex items-start gap-2.5">
                        <AlertOctagon className="w-4 h-4 text-[#B91C1C] shrink-0 mt-0.5" />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-earth-bark">{alert.title}</p>
                          <p className="text-[11px] text-earth-timber mt-0.5 line-clamp-2 leading-relaxed">
                            {alert.summary}
                          </p>
                          <div className="flex items-center gap-2 mt-1.5 text-[10px] font-mono text-earth-timber">
                            <span>{alert.entityName}</span>
                            <span>•</span>
                            <span>{alert.timestamp}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

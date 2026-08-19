import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import {
  ShieldCheck,
  Users,
  Building,
  FlaskConical,
  Activity,
  Layers,
  Sparkles,
  CheckCircle2,
  Lock,
  Plus,
  Key,
  Server,
  Database,
  ArrowRight,
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const {
    allFarms,
    chemicalRegistry,
    activityFeed,
    user,
    setCurrentRoute,
    openQuickRecord,
  } = useApp();

  const [usersList, setUsersList] = useState([
    { id: 'u1', name: 'Sameer Patil', email: 'farmer@indiax.app', role: 'FARMER', status: 'ACTIVE', holding: 'Green Valley Agri-Estate' },
    { id: 'u2', name: 'Dr. Kavita Deshmukh', email: 'vet@indiax.app', role: 'VETERINARIAN', status: 'ACTIVE', holding: 'Veterinary Council of India' },
    { id: 'u3', name: 'Dr. A. K. Sharma', email: 'lab@indiax.app', role: 'LABORATORY', status: 'ACTIVE', holding: 'Eurofins Agro Analytics NABL Lab' },
    { id: 'u4', name: 'Rajesh Varma (Inspector)', email: 'regulator@indiax.app', role: 'REGULATOR', status: 'ACTIVE', holding: 'FSSAI Regional Directorate' },
    { id: 'u5', name: 'System SuperAdmin', email: 'admin@indiax.app', role: 'ADMIN', status: 'ACTIVE', holding: 'IndiaX Central Operations' },
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-earth-border">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-earth-bark tracking-tight">
              IndiaX Platform Governance & Administration
            </h1>
            <Badge variant="ai" size="sm" mono>
              ✦ SUPERADMIN COMMAND
            </Badge>
          </div>
          <p className="text-xs text-earth-timber mt-1 font-mono">
            OPERATOR: <strong className="text-earth-bark">{user?.fullName || 'IndiaX Admin'}</strong> • SYSTEM HEALTH: ALL SERVICES OPERATIONAL
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentRoute('reports')}
            leftIcon={<Activity className="w-3.5 h-3.5 text-[#1B4D3E]" />}
            className="text-xs font-bold h-8"
          >
            System Audit Trail
          </Button>
          <Button
            variant="leaf"
            size="sm"
            onClick={() => setCurrentRoute('applications')}
            leftIcon={<FlaskConical className="w-3.5 h-3.5 text-white" />}
            className="text-xs font-bold h-8 shadow-sm"
          >
            Manage Chemical Registry
          </Button>
        </div>
      </div>

      {/* KPI Deck */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
        {/* KPI 1: Total Users */}
        <Card padding="md" hoverEffect borderLeftAccent="leaf" className="bg-[#FDFBF7]">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-bold text-earth-timber uppercase tracking-wider">
                REGISTERED USERS
              </p>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl font-extrabold text-earth-bark tracking-tight">{usersList.length}</span>
                <span className="text-xs text-earth-timber font-bold">ACTIVE</span>
              </div>
            </div>
            <div className="w-9 h-9 rounded-lg bg-[#EAF5EC] border border-[#A7D7B5] text-[#1B4D3E] flex items-center justify-center shadow-inner">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-[#2B9348] font-bold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span className="text-[11px]">5 Stakeholder Roles</span>
          </div>
        </Card>

        {/* KPI 2: Chemical Master */}
        <Card padding="md" hoverEffect borderLeftAccent="primary" className="bg-[#FDFBF7]">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-bold text-earth-timber uppercase tracking-wider">
                CIBRC CHEMICAL MASTER
              </p>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl font-extrabold text-earth-bark tracking-tight">{chemicalRegistry.length}</span>
                <span className="text-xs text-earth-timber font-bold">MOLECULES</span>
              </div>
            </div>
            <div className="w-9 h-9 rounded-lg bg-[#E0F2FE] border border-[#BAE6FD] text-[#0369A1] flex items-center justify-center shadow-inner">
              <FlaskConical className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-earth-timber font-medium text-[11px]">
            <span>142 Statutory MRL Thresholds</span>
          </div>
        </Card>

        {/* KPI 3: API & Node Health */}
        <Card padding="md" hoverEffect borderLeftAccent="leaf" className="bg-[#FDFBF7]">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-bold text-earth-timber uppercase tracking-wider">
                BACKEND API LATENCY
              </p>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl font-extrabold text-[#2B9348] tracking-tight">18ms</span>
                <span className="text-xs text-earth-timber font-bold">HEALTHY</span>
              </div>
            </div>
            <div className="w-9 h-9 rounded-lg bg-[#EAF5EC] border border-[#A7D7B5] text-[#1B4D3E] flex items-center justify-center shadow-inner">
              <Server className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-[#2B9348] font-bold text-[11px]">
            <span>PostgreSQL & Prisma Synced</span>
          </div>
        </Card>

        {/* KPI 4: Security Guardrails */}
        <Card padding="md" hoverEffect borderLeftAccent="leaf" className="bg-[#FDFBF7]">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-bold text-earth-timber uppercase tracking-wider">
                RBAC ACCESS CONTROL
              </p>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl font-extrabold text-earth-bark tracking-tight">ENFORCED</span>
              </div>
            </div>
            <div className="w-9 h-9 rounded-lg bg-[#EAF5EC] border border-[#A7D7B5] text-[#1B4D3E] flex items-center justify-center shadow-inner">
              <Lock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-earth-timber font-medium text-[11px]">
            <span>JWT 256-Bit Cryptographic Bearer</span>
          </div>
        </Card>
      </div>

      {/* Main Grid: User Directory + System Activity Trail */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: User Directory & RBAC Roles */}
        <div className="lg:col-span-2 space-y-4">
          <Card padding="md" className="bg-white border-earth-border">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-mono font-bold text-earth-bark uppercase tracking-wider flex items-center gap-2">
                <Users className="w-3.5 h-3.5 text-[#1B4D3E]" />
                PLATFORM USER DIRECTORY & ACCESS ROLES
              </h3>
              <span className="text-xs font-mono text-earth-timber">5 Stakeholder Personas</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-[#FAF8F5] text-earth-timber font-bold border-y border-earth-border">
                  <tr>
                    <th className="py-2.5 px-3">USER NAME & EMAIL</th>
                    <th className="py-2.5 px-3">ASSIGNED ROLE</th>
                    <th className="py-2.5 px-3">ORGANIZATION / HOLDING</th>
                    <th className="py-2.5 px-3 text-right">STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-earth-border">
                  {usersList.map((u) => (
                    <tr key={u.id} className="hover:bg-[#FAF8F5]/80 transition-colors">
                      <td className="py-2.5 px-3 font-bold text-earth-bark">
                        <div>{u.name}</div>
                        <div className="text-[10px] text-earth-timber font-normal">{u.email}</div>
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#EAF5EC] text-[#1B4D3E] border border-[#A7D7B5]">
                          {u.role}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-earth-timber text-[11px]">
                        {u.holding}
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <Badge variant="success" size="sm" mono>
                          {u.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Right Col: System Telemetry & Quick Admin Commands */}
        <div className="space-y-4">
          <Card padding="md" className="bg-[#FAF8F5] border-earth-border space-y-3 font-mono text-xs">
            <h3 className="font-bold text-earth-bark uppercase tracking-wider flex items-center gap-2 text-xs">
              <Database className="w-3.5 h-3.5 text-[#1B4D3E]" />
              DATABASE TELEMETRY
            </h3>
            <div className="space-y-2 text-earth-timber">
              <div className="flex justify-between py-1 border-b border-earth-border">
                <span>PostgreSQL Engine:</span>
                <span className="font-bold text-earth-bark">v16.2</span>
              </div>
              <div className="flex justify-between py-1 border-b border-earth-border">
                <span>Database Instance:</span>
                <span className="font-bold text-earth-bark">indiax_db</span>
              </div>
              <div className="flex justify-between py-1 border-b border-earth-border">
                <span>Traceability Ledger:</span>
                <span className="font-bold text-[#2B9348]">Synced</span>
              </div>
              <div className="flex justify-between py-1">
                <span>AI Risk Assessment Pipeline:</span>
                <span className="font-bold text-[#2B9348]">Active</span>
              </div>
            </div>
          </Card>

          <Card padding="md" className="bg-white border-earth-border space-y-3">
            <h3 className="text-xs font-mono font-bold text-earth-bark uppercase tracking-wider">
              ADMINISTRATIVE ACTIONS
            </h3>
            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentRoute('applications')}
                className="w-full justify-start text-xs font-bold font-mono"
                leftIcon={<FlaskConical className="w-3.5 h-3.5 text-[#1B4D3E]" />}
              >
                Update CIBRC Chemical Registry
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentRoute('reports')}
                className="w-full justify-start text-xs font-bold font-mono"
                leftIcon={<Activity className="w-3.5 h-3.5 text-[#1B4D3E]" />}
              >
                Inspect Global Audit Logs
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

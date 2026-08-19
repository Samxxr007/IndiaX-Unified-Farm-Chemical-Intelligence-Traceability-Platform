import React from 'react';
import { useApp } from './context/AppContext';
import { Layout } from './components/layout/Layout';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';

// Farmer pages
import { FarmerDashboardPage } from './pages/farmer/FarmerDashboardPage';
import { FarmsPage } from './pages/FarmsPage';
import { FieldsPage } from './pages/FieldsPage';
import { FieldDetailPage } from './pages/FieldDetailPage';
import { CropsPage } from './pages/CropsPage';
import { ChemicalApplicationsPage } from './pages/ChemicalApplicationsPage';
import { LivestockPage } from './pages/LivestockPage';
import { TraceabilityPage } from './pages/TraceabilityPage';

// Vet pages
import { VetDashboardPage } from './pages/vet/VetDashboardPage';
import { VetWithdrawalCalendarPage } from './pages/vet/VetWithdrawalCalendarPage';

// Lab pages
import { LabDashboardPage } from './pages/lab/LabDashboardPage';
import { LaboratoryPage } from './pages/LaboratoryPage';

// Regulator pages
import { RegulatorDashboardPage } from './pages/regulator/RegulatorDashboardPage';

// Admin pages
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';

// Shared pages
import { RiskIntelligencePage } from './pages/RiskIntelligencePage';
import { ReportsPage } from './pages/ReportsPage';
import { PublicQRVerificationPage } from './pages/PublicQRVerificationPage';

// Role-specific default dashboard helper
function getDefaultDashboard(role: string) {
  switch (role) {
    case 'VETERINARIAN': return 'vet-dashboard';
    case 'LABORATORY': return 'lab-dashboard';
    case 'REGULATOR': return 'regulator-dashboard';
    case 'ADMIN': return 'admin-dashboard';
    default: return 'farmer-dashboard';
  }
}

export const App: React.FC = () => {
  const { currentRoute, setCurrentRoute, isAuthenticated, user } = useApp();

  // Public Consumer QR Verification Route
  if (currentRoute.startsWith('verify-')) {
    const batchNumber = currentRoute.replace('verify-', '') || 'TOM-2026-001';
    return <PublicQRVerificationPage batchNumber={batchNumber} />;
  }

  // Public Landing Page
  if (currentRoute === 'landing') {
    return <LandingPage />;
  }

  // Signup Page
  if (currentRoute === 'signup') {
    return <SignupPage />;
  }

  // Login / Not authenticated
  if (currentRoute === 'login' || !isAuthenticated) {
    return <LoginPage />;
  }

  const renderCurrentView = () => {
    switch (currentRoute) {
      // ── FARMER / AGRONOMIST ────────────────────────────────────────────────
      case 'dashboard':
      case 'farmer-dashboard': return user?.role === 'VETERINARIAN' ? <VetDashboardPage />
        : user?.role === 'LABORATORY' ? <LabDashboardPage />
        : user?.role === 'REGULATOR' ? <RegulatorDashboardPage />
        : user?.role === 'ADMIN' ? <AdminDashboardPage />
        : <FarmerDashboardPage />;
      case 'farms':            return <FarmsPage />;
      case 'fields':           return <FieldsPage />;
      case 'field-detail':     return <FieldDetailPage />;
      case 'crops':            return <CropsPage />;
      case 'applications':     return <ChemicalApplicationsPage />;
      case 'livestock':        return <LivestockPage />;
      case 'traceability':     return <TraceabilityPage />;

      // ── VETERINARIAN ───────────────────────────────────────────────────────
      case 'vet-dashboard':    return <VetDashboardPage />;
      case 'vet-calendar':     return <VetWithdrawalCalendarPage />;

      // ── LABORATORY ─────────────────────────────────────────────────────────
      case 'lab-dashboard':    return <LabDashboardPage />;
      case 'laboratory':       return <LaboratoryPage />;

      // ── REGULATOR ──────────────────────────────────────────────────────────
      case 'regulator-dashboard': return <RegulatorDashboardPage />;

      // ── ADMIN ──────────────────────────────────────────────────────────────
      case 'admin-dashboard':  return <AdminDashboardPage />;

      // ── SHARED ACROSS ROLES ────────────────────────────────────────────────
      case 'risk':             return <RiskIntelligencePage />;
      case 'reports':          return <ReportsPage />;

      // Fallback: send to role-appropriate home
      default:
        return <FarmerDashboardPage />;
    }
  };

  return (
    <Layout>
      {/* Demo Role Switcher Quick Guide Bar */}
      <div className="mb-4 p-2.5 bg-gradient-to-r from-emerald-900 to-primary-dark text-white rounded-lg shadow-sm flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-emerald-400/20 text-emerald-300 font-bold flex items-center justify-center text-[10px]">✦</span>
          <span className="font-semibold">Demo Personas:</span>
          <span className="text-emerald-200 hidden md:inline">
            Switch roles from the top-right Role Switcher → Each persona has its own cockpit
          </span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0 flex-wrap">
          {[
            { label: '🌾 Farmer', route: 'farmer-dashboard' },
            { label: '🩺 Vet', route: 'vet-dashboard' },
            { label: '🔬 Lab', route: 'lab-dashboard' },
            { label: '🛡 Regulator', route: 'regulator-dashboard' },
            { label: '⚙️ Admin', route: 'admin-dashboard' },
          ].map((p) => (
            <button
              key={p.route}
              onClick={() => setCurrentRoute(p.route)}
              className={`px-2.5 py-1 rounded text-[11px] font-bold transition-colors ${
                currentRoute === p.route
                  ? 'bg-emerald-400 text-emerald-950'
                  : 'bg-white/10 hover:bg-white/20'
              }`}
            >
              {p.label}
            </button>
          ))}
          <button
            onClick={() => setCurrentRoute('verify-TOM-2026-001')}
            className="px-2.5 py-1 bg-emerald-400 text-emerald-950 font-bold rounded text-[11px] hover:bg-emerald-300 transition-colors"
          >
            📱 Public QR
          </button>
        </div>
      </div>

      {renderCurrentView()}
    </Layout>
  );
};

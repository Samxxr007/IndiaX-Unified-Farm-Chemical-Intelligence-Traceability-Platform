import React from 'react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/ui/Button';
import {
  ShieldCheck,
  FlaskConical,
  QrCode,
  Award,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Lock,
  BarChart3,
  Globe2,
  ChevronRight,
  Trees,
  Sprout,
  Droplets,
  Scale,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { setCurrentRoute, loginDemo } = useApp();

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-earth-bark flex flex-col selection:bg-[#D8F3DC] selection:text-[#1B4D3E]">
      {/* Top Navigation */}
      <nav className="border-b border-earth-border bg-[#FAF8F5]/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#2D6A4F] flex items-center justify-center text-[#D8F3DC] font-bold text-sm shadow-sm ring-1 ring-[#52B788]/40">
              <Sprout className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight text-earth-bark">
                IndiaX
              </span>
              <span className="text-xs text-earth-timber ml-1.5 font-mono">Farm Chemical Intelligence</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentRoute('login')}
              className="text-xs font-bold text-earth-bark"
            >
              Sign In
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentRoute('signup')}
              className="text-xs font-bold"
            >
              Register Estate
            </Button>
            <Button
              variant="leaf"
              size="sm"
              rightIcon={<ArrowRight className="w-4 h-4" />}
              onClick={() => {
                loginDemo('farmer');
              }}
              className="text-xs font-bold shadow-sm"
            >
              Launch Demo Cockpit
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 border-b border-earth-border bg-gradient-to-b from-[#EAF5EC]/40 via-[#FAF8F5] to-[#FAF8F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D8F3DC] border border-[#95D5B2] text-xs font-bold text-[#1B4D3E] mb-6 font-mono shadow-sm">
              <span>✦ RURAL-FIRST AGRICULTURAL INTELLIGENCE</span>
              <span className="w-1 h-1 rounded-full bg-[#1B4D3E]" />
              <span>FSSAI & CIBRC COMPLIANT</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-earth-bark tracking-tight leading-[1.15] mb-5">
              Unified Farm Chemical Intelligence & Food-Safety Traceability
            </h1>

            <p className="text-base sm:text-lg text-earth-timber leading-relaxed mb-8 font-normal">
              Built for real-world farming environments—grounded soil telemetry, real-time pesticide Maximum Residue Limit (MRL) verification, Antimicrobial Stewardship (AMU), and consumer-verifiable QR provenance.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <Button
                variant="primary"
                size="lg"
                rightIcon={<ArrowRight className="w-4 h-4" />}
                onClick={() => {
                  loginDemo('farmer');
                }}
                className="w-full sm:w-auto shadow-md text-sm font-bold bg-[#1B4D3E] hover:bg-[#143D31]"
              >
                Access Agronomic Cockpit
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => setCurrentRoute('traceability')}
                className="w-full sm:w-auto text-sm font-bold"
              >
                Inspect Public QR Provenance
              </Button>
            </div>
          </div>

          {/* Value Stat Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 max-w-4xl mx-auto font-mono">
            <div className="bg-white rounded-card p-4 border border-earth-border text-center shadow-card">
              <p className="text-2xl sm:text-3xl font-extrabold text-[#1B4D3E]">100%</p>
              <p className="text-xs text-earth-timber mt-1 font-bold">FSSAI Gazette MRL Alignment</p>
            </div>
            <div className="bg-white rounded-card p-4 border border-earth-border text-center shadow-card">
              <p className="text-2xl sm:text-3xl font-extrabold text-[#2D6A4F]">14-Day</p>
              <p className="text-xs text-earth-timber mt-1 font-bold">Withholding Auto-Audit Window</p>
            </div>
            <div className="bg-white rounded-card p-4 border border-earth-border text-center shadow-card">
              <p className="text-2xl sm:text-3xl font-extrabold text-[#D97706]">WHO-CIA</p>
              <p className="text-xs text-earth-timber mt-1 font-bold">Antimicrobial Stewardship</p>
            </div>
            <div className="bg-white rounded-card p-4 border border-earth-border text-center shadow-card">
              <p className="text-2xl sm:text-3xl font-extrabold text-[#1B4D3E]">8-Stage</p>
              <p className="text-xs text-earth-timber mt-1 font-bold">Farm-to-Fork Batch Lineage</p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Platform Pillars */}
      <section className="py-16 bg-white border-b border-earth-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-earth-bark tracking-tight">
              Enterprise Compliance & Agronomic Intelligence Pillars
            </h2>
            <p className="text-sm text-earth-timber mt-2">
              Designed specifically for agronomists, exporter consortiums, food processors, and rural holding managers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#FAF8F5] rounded-card p-6 border border-earth-border hover:border-earth-borderDark transition-all">
              <div className="w-10 h-10 rounded-lg bg-[#D8F3DC] text-[#1B4D3E] flex items-center justify-center mb-4 border border-[#A7D7B5]">
                <FlaskConical className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-earth-bark mb-2">Smart Chemical Registry</h3>
              <p className="text-xs text-earth-timber leading-relaxed">
                Auto-resolves commercial brands to active ingredients, validates CIBRC registration codes, and checks Pre-Harvest Intervals (PHI) against FSSAI Gazette standards.
              </p>
            </div>

            <div className="bg-[#FAF8F5] rounded-card p-6 border border-earth-border hover:border-earth-borderDark transition-all">
              <div className="w-10 h-10 rounded-lg bg-[#FEF3C7] text-[#92400E] flex items-center justify-center mb-4 border border-[#FCD34D]">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-earth-bark mb-2">Livestock & AMU Tracking</h3>
              <p className="text-xs text-earth-timber leading-relaxed">
                Logs veterinary prescriptions, classifies WHO Critically Important Antimicrobials, and enforces automated milk/meat withdrawal buffer days.
              </p>
            </div>

            <div className="bg-[#FAF8F5] rounded-card p-6 border border-earth-border hover:border-earth-borderDark transition-all">
              <div className="w-10 h-10 rounded-lg bg-[#E0F2FE] text-[#0369A1] flex items-center justify-center mb-4 border border-[#BAE6FD]">
                <QrCode className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-earth-bark mb-2">Farm-to-Fork QR Provenance</h3>
              <p className="text-xs text-earth-timber leading-relaxed">
                Issues tamper-evident consumer verification portals connecting farm parcel GPS coordinates, NABL residue test certificates, and harvest timeline.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-8 bg-[#14281D] text-[#D8F3DC] border-t border-[#2D6A4F]/30 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white">IndiaX</span>
            <span>— Unified Farm Chemical Intelligence Platform</span>
          </div>
          <p className="text-[#A7D7B5]">
            FSSAI Standards 2026 & CIBRC Insecticides Act Compliant
          </p>
        </div>
      </footer>
    </div>
  );
};

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { ShieldCheck, Lock, User, Sparkles, ArrowRight, Sprout, AlertCircle } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, loginDemo, setCurrentRoute } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.message || 'Invalid credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async (role: 'farmer' | 'vet' | 'admin' | 'lab' | 'regulator' = 'farmer') => {
    setError('');
    setIsLoading(true);
    try {
      await loginDemo(role);
    } catch (err: any) {
      setError(err.message || 'Demo login failed. Ensure the backend is running on port 5000.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden selection:bg-[#D8F3DC] selection:text-[#1B4D3E]">
      <div className="absolute inset-0 bg-gradient-to-tr from-[#EAF5EC]/50 via-transparent to-[#FAF8F5] pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex justify-center mb-3">
          <div
            onClick={() => setCurrentRoute('landing')}
            className="w-12 h-12 rounded-xl bg-[#2D6A4F] flex items-center justify-center text-[#D8F3DC] font-extrabold text-lg shadow-md cursor-pointer hover:scale-105 transition-transform ring-1 ring-[#52B788]/40"
          >
            <Sprout className="w-7 h-7" />
          </div>
        </div>
        <h2 className="text-center text-2xl sm:text-3xl font-extrabold text-earth-bark tracking-tight">
          Sign In to IndiaX Cockpit
        </h2>
        <p className="mt-1 text-center text-xs text-earth-timber font-mono">
          Unified Farm Chemical Intelligence & Traceability Platform
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        <div className="bg-white py-8 px-6 sm:px-8 shadow-card rounded-card border border-earth-border space-y-6">

          {/* Error Banner */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 text-red-700 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Demo Quick Access */}
          <div className="p-3.5 bg-[#EAF5EC] rounded-lg border border-[#A7D7B5] text-[#1B4D3E]">
            <div className="flex items-center gap-2 mb-1 font-mono">
              <Sparkles className="w-4 h-4 text-[#1B4D3E] shrink-0" />
              <span className="text-xs font-bold uppercase tracking-wider">EVALUATION & JUDGE DEMO — 5 PORTALS</span>
            </div>
            <p className="text-[11px] text-[#143D31] leading-snug mb-3">
              One-click per role. Each lands on its unique cockpit dashboard.
            </p>
            <div className="grid grid-cols-3 gap-1.5 mb-1.5">
              <Button variant="leaf" size="sm" onClick={() => handleDemoLogin('farmer')} isLoading={isLoading}
                className="font-bold shadow-sm text-xs">🌾 Farmer</Button>
              <Button variant="outline" size="sm" onClick={() => handleDemoLogin('vet')} isLoading={isLoading}
                className="font-bold shadow-sm text-xs">🩺 Vet</Button>
              <Button variant="outline" size="sm" onClick={() => handleDemoLogin('admin')} isLoading={isLoading}
                className="font-bold shadow-sm text-xs">⚙️ Admin</Button>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              <Button variant="outline" size="sm" onClick={() => handleDemoLogin('lab')} isLoading={isLoading}
                className="font-bold shadow-sm text-xs">🔬 Lab Analyst</Button>
              <Button variant="outline" size="sm" onClick={() => handleDemoLogin('regulator')} isLoading={isLoading}
                className="font-bold shadow-sm text-xs">🛡 Regulator</Button>
            </div>
          </div>

          <div className="relative flex items-center justify-center font-mono">
            <div className="border-t border-earth-border w-full" />
            <span className="bg-white px-3 text-[11px] text-earth-timber uppercase tracking-wider font-bold">
              Or Sign In
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<User className="w-4 h-4" />}
              placeholder="farmer@indiax.app"
              required
            />
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<Lock className="w-4 h-4" />}
              placeholder="••••••••"
              required
            />
            <Button
              type="submit"
              variant="outline"
              size="md"
              isLoading={isLoading}
              className="w-full font-bold"
            >
              Sign In
            </Button>
          </form>

          <div className="pt-2 text-center text-xs text-earth-timber border-t border-earth-border">
            <span>New to IndiaX? </span>
            <button
              type="button"
              onClick={() => setCurrentRoute('signup')}
              className="text-[#1B4D3E] font-bold hover:underline"
            >
              Create Account
            </button>
          </div>

          <div className="pt-1 flex items-center justify-center gap-2 text-[11px] text-earth-timber font-mono">
            <ShieldCheck className="w-4 h-4 text-[#2B9348]" />
            <span>FSSAI / CIBRC Central Compliance Gateway</span>
          </div>
        </div>
      </div>
    </div>
  );
};

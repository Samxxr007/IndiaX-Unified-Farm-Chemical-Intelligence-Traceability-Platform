import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { ShieldCheck, Lock, User, Mail, Phone, Sprout, AlertCircle } from 'lucide-react';
import { apiClient } from '../api/client';

const ROLES = [
  { value: 'FARMER', label: 'Farmer / Agronomist' },
  { value: 'VETERINARIAN', label: 'Veterinarian' },
  { value: 'LABORATORY', label: 'Lab Technician' },
  { value: 'PROCESSOR', label: 'Food Processor' },
  { value: 'REGULATOR', label: 'Regulatory Inspector' },
];

export const SignupPage: React.FC = () => {
  const { login, setCurrentRoute } = useApp();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('FARMER');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await apiClient.post('/auth/register', {
        fullName,
        email,
        phone: phone || undefined,
        password,
        role,
      });
      // Auto-login after registration
      await login(email, password);
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-tr from-[#EAF5EC]/50 via-transparent to-[#FAF8F5] pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex justify-center mb-3">
          <div
            onClick={() => setCurrentRoute('landing')}
            className="w-12 h-12 rounded-xl bg-[#2D6A4F] flex items-center justify-center cursor-pointer hover:scale-105 transition-transform"
          >
            <Sprout className="w-7 h-7 text-[#D8F3DC]" />
          </div>
        </div>
        <h2 className="text-center text-2xl font-extrabold text-earth-bark">Create Your IndiaX Account</h2>
        <p className="mt-1 text-center text-xs text-earth-timber font-mono">
          Register to access Farm Chemical Intelligence & Traceability
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        <div className="bg-white py-8 px-6 sm:px-8 shadow-card rounded-card border border-earth-border space-y-5">

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 text-red-700 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              leftIcon={<User className="w-4 h-4" />}
              placeholder="Sameer Patil"
              required
            />
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="w-4 h-4" />}
              placeholder="farmer@example.com"
              required
            />
            <Input
              label="Phone (optional, format: +91XXXXXXXXXX)"
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              leftIcon={<Phone className="w-4 h-4" />}
              placeholder="+919876543210"
            />
            <Input
              label="Password (min 8 characters)"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<Lock className="w-4 h-4" />}
              required
            />

            <div>
              <label className="block text-xs font-bold text-earth-bark mb-1.5">Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full rounded-lg border border-earth-border px-3 py-2 text-sm text-earth-bark bg-white focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]/40"
              >
                {ROLES.map((r) => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
            </div>

            <Button type="submit" variant="leaf" size="md" isLoading={isLoading} className="w-full font-bold">
              Create Account
            </Button>
          </form>

          <div className="pt-2 text-center text-xs text-earth-timber border-t border-earth-border">
            <span>Already have an account? </span>
            <button type="button" onClick={() => setCurrentRoute('login')} className="text-[#1B4D3E] font-bold hover:underline">
              Sign In
            </button>
          </div>

          <div className="flex items-center justify-center gap-2 text-[11px] text-earth-timber font-mono">
            <ShieldCheck className="w-4 h-4 text-[#2B9348]" />
            <span>FSSAI / CIBRC Compliant Registration</span>
          </div>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { SeverityLevel } from '../../types';

export interface BadgeProps {
  children?: React.ReactNode;
  variant?: 'success' | 'warning' | 'danger' | 'critical' | 'info' | 'neutral' | 'ai' | 'hud';
  severity?: SeverityLevel;
  size?: 'sm' | 'md';
  dot?: boolean;
  beacon?: boolean;
  mono?: boolean;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant,
  severity,
  size = 'md',
  dot = false,
  beacon = false,
  mono = false,
  className = '',
}) => {
  let effectiveVariant = variant || 'neutral';
  if (severity) {
    switch (severity) {
      case 'LOW':
        effectiveVariant = 'success';
        break;
      case 'MEDIUM':
        effectiveVariant = 'warning';
        break;
      case 'HIGH':
        effectiveVariant = 'danger';
        break;
      case 'CRITICAL':
        effectiveVariant = 'critical';
        break;
    }
  }

  // Weather-station & rural earth-toned semantic variants
  const variantStyles = {
    success: 'bg-[#EAF5EC] text-[#1B4D3E] border-[#A7D7B5] shadow-[0_1px_2px_rgba(27,77,62,0.05)] font-semibold',
    warning: 'bg-[#FEF3C7] text-[#92400E] border-[#FCD34D] shadow-[0_1px_2px_rgba(146,64,14,0.05)] font-semibold',
    danger: 'bg-[#FEE2E2] text-[#7F1D1D] border-[#FCA5A5] shadow-[0_1px_2px_rgba(127,29,29,0.05)] font-semibold',
    critical: 'bg-[#FDE8E8] text-[#991B1B] border-[#F87171] font-bold shadow-sm',
    info: 'bg-[#E0F2FE] text-[#0369A1] border-[#BAE6FD] shadow-[0_1px_2px_rgba(3,105,161,0.05)] font-semibold',
    neutral: 'bg-[#F4EFEA] text-[#705847] border-[#E6DFD5] font-medium',
    ai: 'bg-[#D8F3DC] text-[#1B4D3E] border-[#95D5B2] font-bold shadow-sm',
    hud: 'bg-[#14281D]/90 text-[#D8F3DC] border-[#2D6A4F]/50 backdrop-blur font-mono',
  };

  const dotColors = {
    success: 'bg-[#2B9348]',
    warning: 'bg-[#D97706]',
    danger: 'bg-[#B91C1C]',
    critical: 'bg-[#DC2626]',
    info: 'bg-[#1D70B8]',
    neutral: 'bg-[#9C8878]',
    ai: 'bg-[#1B4D3E]',
    hud: 'bg-[#52B788]',
  };

  const sizeStyles = {
    sm: 'text-[10px] px-2 py-0.5 gap-1.5 leading-tight',
    md: 'text-xs px-2.5 py-0.5 gap-1.5 leading-normal',
  };

  const showDot = dot || beacon;

  return (
    <span
      className={`inline-flex items-center rounded-md border ${sizeStyles[size]} ${variantStyles[effectiveVariant]} ${
        mono ? 'font-mono' : ''
      } ${className}`}
    >
      {showDot && (
        <span className="relative flex h-2 w-2 items-center justify-center shrink-0">
          {beacon && (
            <span
              className={`absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping ${dotColors[effectiveVariant]}`}
            />
          )}
          <span
            className={`relative inline-flex h-1.5 w-1.5 rounded-full ${dotColors[effectiveVariant]}`}
          />
        </span>
      )}
      <span>
        {children || (severity ? `${severity === 'HIGH' ? '🔴 HIGH RISK' : severity === 'MEDIUM' ? '🟠 MODERATE ALERT' : severity === 'CRITICAL' ? '🔥 CRITICAL PHI' : '🟢 HARVEST READY'}` : '')}
      </span>
    </span>
  );
};

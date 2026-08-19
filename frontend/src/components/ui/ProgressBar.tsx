import React from 'react';

export interface ProgressBarProps {
  value: number; // 0 - 100
  max?: number;
  label?: string;
  sublabel?: string;
  showValueText?: boolean;
  colorScheme?: 'risk' | 'health' | 'primary' | 'success' | 'warning' | 'danger' | 'leaf';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  label,
  sublabel,
  showValueText = true,
  colorScheme = 'primary',
  size = 'md',
  className = '',
}) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  const sizeClasses = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  const getColorClass = () => {
    if (colorScheme === 'risk') {
      if (percentage >= 70) return 'bg-[#B91C1C]'; // Rust red
      if (percentage >= 40) return 'bg-[#D97706]'; // Amber ochre
      return 'bg-[#2B9348]'; // Harvest green
    }
    if (colorScheme === 'health') {
      if (percentage >= 75) return 'bg-[#2B9348]';
      if (percentage >= 50) return 'bg-[#D97706]';
      return 'bg-[#B91C1C]';
    }
    if (colorScheme === 'leaf') return 'bg-[#2D6A4F]';
    if (colorScheme === 'success') return 'bg-[#2B9348]';
    if (colorScheme === 'warning') return 'bg-[#D97706]';
    if (colorScheme === 'danger') return 'bg-[#B91C1C]';
    return 'bg-[#1B4D3E]';
  };

  return (
    <div className={`w-full ${className}`}>
      {(label || showValueText) && (
        <div className="flex items-center justify-between text-xs mb-1.5 font-medium font-mono">
          <div className="flex items-center gap-1.5">
            <span className="text-earth-bark font-bold">{label}</span>
            {sublabel && <span className="text-earth-timber text-[11px] font-sans">({sublabel})</span>}
          </div>
          {showValueText && (
            <span className="text-earth-bark font-extrabold">
              {Math.round(value)}
              {max === 100 ? '%' : ` / ${max}`}
            </span>
          )}
        </div>
      )}
      <div className={`w-full bg-[#FAF8F5] rounded-full overflow-hidden border border-earth-border ${sizeClasses[size]}`}>
        <div
          className={`${sizeClasses[size]} ${getColorClass()} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

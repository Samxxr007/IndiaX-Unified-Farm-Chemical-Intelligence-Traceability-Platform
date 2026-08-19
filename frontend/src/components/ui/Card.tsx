import React from 'react';

export interface CardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
  headerBorder?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hoverEffect?: boolean;
  borderLeftAccent?: 'success' | 'warning' | 'danger' | 'info' | 'primary' | 'leaf' | 'none';
}

export const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  action,
  headerBorder = true,
  padding = 'md',
  hoverEffect = false,
  borderLeftAccent = 'none',
  className = '',
  ...props
}) => {
  const paddingStyles = {
    none: 'p-0',
    sm: 'p-3',
    md: 'p-4 sm:p-5',
    lg: 'p-6',
  };

  const accentStyles = {
    none: '',
    success: 'border-l-[3px] border-l-[#2B9348]',
    warning: 'border-l-[3px] border-l-[#D97706]',
    danger: 'border-l-[3px] border-l-[#B91C1C]',
    info: 'border-l-[3px] border-l-[#1D70B8]',
    primary: 'border-l-[3px] border-l-[#1B4D3E]',
    leaf: 'border-l-[3px] border-l-[#2D6A4F]',
  };

  const hasHeader = title || subtitle || action;

  return (
    <div
      className={`bg-white rounded-card border border-earth-border shadow-card transition-all duration-150 ${
        hoverEffect ? 'hover:shadow-card-hover hover:border-earth-borderDark' : ''
      } ${accentStyles[borderLeftAccent]} ${className}`}
      {...props}
    >
      {hasHeader && (
        <div
          className={`flex items-center justify-between px-4 sm:px-5 py-3.5 ${
            headerBorder ? 'border-b border-earth-border/80 bg-[#FAF8F5]/60' : ''
          }`}
        >
          <div className="min-w-0 pr-2">
            {title && (
              <h3 className="text-base font-bold text-earth-bark tracking-tight truncate">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-xs text-earth-timber mt-0.5 font-normal">
                {subtitle}
              </p>
            )}
          </div>
          {action && <div className="shrink-0 flex items-center gap-2">{action}</div>}
        </div>
      )}
      <div className={paddingStyles[padding]}>{children}</div>
    </div>
  );
};

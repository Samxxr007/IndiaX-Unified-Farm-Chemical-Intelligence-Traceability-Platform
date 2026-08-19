import React from 'react';
import { Button } from './Button';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-card border border-dashed border-border bg-slate-50/50 ${className}`}>
      {icon && (
        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-text-secondary mb-3.5 shadow-sm border border-slate-200">
          {icon}
        </div>
      )}
      <h4 className="text-base font-semibold text-text-primary mb-1">{title}</h4>
      <p className="text-xs sm:text-sm text-text-secondary max-w-md mb-5 leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <Button variant="primary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

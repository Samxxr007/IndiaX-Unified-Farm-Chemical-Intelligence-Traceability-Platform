import React from 'react';

export interface SkeletonLoaderProps {
  variant?: 'card' | 'kpi' | 'table' | 'map' | 'text';
  count?: number;
  className?: string;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  variant = 'card',
  count = 1,
  className = '',
}) => {
  const items = Array.from({ length: count });

  if (variant === 'kpi') {
    return (
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}>
        {items.map((_, i) => (
          <div key={i} className="bg-white rounded-card border border-border p-4 animate-pulse">
            <div className="flex justify-between items-start mb-3">
              <div className="h-3.5 bg-slate-200 rounded w-24" />
              <div className="w-8 h-8 bg-slate-200 rounded-md" />
            </div>
            <div className="h-7 bg-slate-200 rounded w-20 mb-2" />
            <div className="h-3 bg-slate-200 rounded w-32" />
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'map') {
    return (
      <div className={`h-96 w-full bg-slate-100 rounded-card border border-border animate-pulse flex items-center justify-center relative overflow-hidden ${className}`}>
        <div className="text-center text-text-muted">
          <div className="w-12 h-12 bg-slate-200 rounded-full mx-auto mb-2 flex items-center justify-center">
            <span className="w-6 h-6 border-2 border-slate-300 border-t-primary rounded-full animate-spin" />
          </div>
          <p className="text-xs font-medium">Initializing geospatial telemetry layers...</p>
        </div>
      </div>
    );
  }

  if (variant === 'table') {
    return (
      <div className={`border border-border rounded-md bg-white p-4 space-y-3 animate-pulse ${className}`}>
        <div className="h-4 bg-slate-200 rounded w-1/4 mb-4" />
        {items.map((_, i) => (
          <div key={i} className="flex gap-4">
            <div className="h-4 bg-slate-200 rounded flex-1" />
            <div className="h-4 bg-slate-200 rounded w-24" />
            <div className="h-4 bg-slate-200 rounded w-32" />
            <div className="h-4 bg-slate-200 rounded w-16" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {items.map((_, i) => (
        <div key={i} className="h-4 bg-slate-200 rounded animate-pulse w-full" />
      ))}
    </div>
  );
};

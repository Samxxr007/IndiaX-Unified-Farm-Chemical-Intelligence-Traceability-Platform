import React from 'react';
import { CheckCircle2, AlertTriangle, AlertOctagon, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info' | 'ai';
  title: string;
  message?: string;
  durationMs?: number;
}

export interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />,
    error: <AlertOctagon className="w-5 h-5 text-rose-600 shrink-0" />,
    info: <Info className="w-5 h-5 text-blue-600 shrink-0" />,
    ai: <span className="text-primary font-bold text-base shrink-0">✦</span>,
  };

  const bgStyles = {
    success: 'border-emerald-200 bg-emerald-50/95 text-emerald-950',
    warning: 'border-amber-200 bg-amber-50/95 text-amber-950',
    error: 'border-rose-200 bg-rose-50/95 text-rose-950',
    info: 'border-blue-200 bg-blue-50/95 text-blue-950',
    ai: 'border-emerald-300 bg-emerald-50/95 text-emerald-950 shadow-md',
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-3">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-lg border shadow-dropdown transition-all duration-200 animate-slide-up ${bgStyles[toast.type]}`}
        >
          {icons[toast.type]}
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-semibold tracking-tight">{toast.title}</h4>
            {toast.message && (
              <p className="text-xs mt-0.5 opacity-90 leading-relaxed font-normal">
                {toast.message}
              </p>
            )}
          </div>
          <button
            onClick={() => onDismiss(toast.id)}
            className="text-slate-400 hover:text-slate-700 transition-colors p-0.5 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};

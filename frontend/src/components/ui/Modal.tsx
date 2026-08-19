import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  size = 'md',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeStyles = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    '2xl': 'max-w-5xl',
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="flex min-h-full items-center justify-center p-3 sm:p-4 text-center">
        <div
          className={`relative w-full ${sizeStyles[size]} transform overflow-hidden rounded-lg bg-white text-left align-middle shadow-modal transition-all border border-border flex flex-col max-h-[90vh]`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-start justify-between px-5 py-4 border-b border-border bg-slate-50/50 shrink-0">
            <div>
              <h3 className="text-lg font-semibold text-text-primary tracking-tight">
                {title}
              </h3>
              {subtitle && (
                <p className="text-xs text-text-secondary mt-0.5 font-normal">
                  {subtitle}
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="rounded-md p-1.5 text-text-secondary hover:bg-slate-100 hover:text-text-primary transition-colors focus:outline-none"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="px-5 py-4 overflow-y-auto flex-1">{children}</div>

          {/* Footer */}
          {footer && (
            <div className="flex items-center justify-end gap-2.5 px-5 py-3.5 border-t border-border bg-slate-50/80 shrink-0">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

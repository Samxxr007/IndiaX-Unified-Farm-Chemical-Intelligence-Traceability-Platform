import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  unit?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, leftIcon, rightIcon, unit, className = '', id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-bold text-earth-bark mb-1.5 uppercase tracking-wider font-mono">
            {label}
          </label>
        )}
        <div className="relative rounded-md shadow-[0_1px_2px_rgba(61,43,31,0.04)]">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-earth-timber">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={`block w-full rounded-md border ${
              error ? 'border-blight-danger focus:ring-blight-danger' : 'border-earth-border focus:ring-[#1B4D3E] focus:border-[#1B4D3E]'
            } bg-white px-3 py-2 text-sm text-earth-bark placeholder:text-earth-timber/60 focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:bg-[#FAF8F5] disabled:text-earth-timber/50 transition-colors ${
              leftIcon ? 'pl-9' : ''
            } ${rightIcon || unit ? 'pr-14' : ''} ${className}`}
            {...props}
          />
          {unit && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-xs font-mono font-bold text-earth-timber bg-[#FAF8F5] border-l border-earth-border rounded-r-md px-2.5">
              {unit}
            </div>
          )}
          {!unit && rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-earth-timber">
              {rightIcon}
            </div>
          )}
        </div>
        {error && <p className="mt-1 text-xs text-blight-danger font-medium">{error}</p>}
        {helperText && !error && <p className="mt-1 text-xs text-earth-timber">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

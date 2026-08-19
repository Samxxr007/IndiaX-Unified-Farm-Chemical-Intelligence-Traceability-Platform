import React from 'react';

export interface SelectOption {
  value: string;
  label: string;
  sublabel?: string;
  disabled?: boolean;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: string;
  helperText?: string;
  placeholder?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, error, helperText, placeholder, className = '', id, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={selectId} className="block text-xs font-bold text-earth-bark mb-1.5 uppercase tracking-wider font-mono">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={`block w-full appearance-none rounded-md border ${
              error ? 'border-blight-danger focus:ring-blight-danger' : 'border-earth-border focus:ring-[#1B4D3E] focus:border-[#1B4D3E]'
            } bg-white px-3 py-2 pr-8 text-sm text-earth-bark focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:bg-[#FAF8F5] disabled:text-earth-timber/50 transition-colors ${className}`}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                {opt.label} {opt.sublabel ? `(${opt.sublabel})` : ''}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-earth-timber">
            <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
            </svg>
          </div>
        </div>
        {error && <p className="mt-1 text-xs text-blight-danger font-medium">{error}</p>}
        {helperText && !error && <p className="mt-1 text-xs text-earth-timber">{helperText}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';

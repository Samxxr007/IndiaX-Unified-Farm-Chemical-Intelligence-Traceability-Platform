import React from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost' | 'success' | 'leaf';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none rounded-md';

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 gap-1.5 h-8',
    md: 'text-xs px-4 py-2 gap-2 h-9',
    lg: 'text-sm px-5 py-2.5 gap-2.5 h-11',
  };

  const variantStyles = {
    primary: 'bg-[#1B4D3E] text-white hover:bg-[#143D31] focus:ring-[#1B4D3E] shadow-sm active:translate-y-px border border-[#143D31]',
    leaf: 'bg-[#2D6A4F] text-white hover:bg-[#1B4D3E] focus:ring-[#2D6A4F] shadow-sm active:translate-y-px',
    secondary: 'bg-[#F4EFEA] text-[#3D2B1F] hover:bg-[#EAE4DC] focus:ring-[#705847] active:translate-y-px border border-earth-border',
    outline: 'border border-earth-border bg-white text-[#3D2B1F] hover:bg-[#FAF8F5] hover:border-earth-borderDark focus:ring-[#1B4D3E] shadow-sm active:translate-y-px',
    danger: 'bg-[#B91C1C] text-white hover:bg-[#991B1B] focus:ring-red-500 shadow-sm active:translate-y-px',
    ghost: 'text-[#705847] hover:text-[#3D2B1F] hover:bg-[#F4EFEA] focus:ring-slate-300',
    success: 'bg-[#2B9348] text-white hover:bg-[#1F6E35] focus:ring-green-600 shadow-sm active:translate-y-px',
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current" />
      ) : (
        leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>
      )}
      <span>{children}</span>
      {!isLoading && rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
    </button>
  );
};

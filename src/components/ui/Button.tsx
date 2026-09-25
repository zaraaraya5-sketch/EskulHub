import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer';

  const sizeStyles = {
    sm: 'text-xs px-2.5 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2 gap-2',
    lg: 'text-base px-5 py-2.5 gap-2.5',
  };

  const variantStyles = {
    primary: 'bg-[#234B36] text-white hover:bg-[#1b3a2a] focus:ring-[#234B36] border border-transparent shadow-xs',
    secondary: 'bg-[#B84A3A] text-white hover:bg-[#9a3d2f] focus:ring-[#B84A3A] border border-transparent shadow-xs',
    outline: 'bg-white text-[#171717] border border-[#D8D4CC] hover:bg-[#F5F2EA] focus:ring-[#234B36]',
    danger: 'bg-[#A33D35] text-white hover:bg-[#852f28] focus:ring-[#A33D35] border border-transparent',
    ghost: 'bg-transparent text-[#171717] hover:bg-[#EAE6DC] focus:ring-[#234B36]',
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-1" />
      ) : (
        icon && <span className="shrink-0">{icon}</span>
      )}
      {children}
    </button>
  );
};

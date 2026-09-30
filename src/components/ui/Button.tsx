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
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 ease-out active:scale-[0.97] focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 cursor-pointer select-none';

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 gap-1.5 shadow-2xs hover:shadow-xs',
    md: 'text-sm px-4 py-2 gap-2 shadow-2xs hover:shadow-xs',
    lg: 'text-base px-5 py-2.5 gap-2.5 shadow-xs hover:shadow-sm',
  };

  const variantStyles = {
    primary: 'bg-[#D15B40] text-white hover:bg-[#B94931] active:bg-[#A63F28] focus:ring-[#D15B40]/40 border border-transparent',
    secondary: 'bg-[#3B7A82] text-white hover:bg-[#2F656C] active:bg-[#255258] focus:ring-[#3B7A82]/40 border border-transparent',
    outline: 'bg-white text-[#171717] border border-[#EAE6DC] hover:bg-[#F9F8F6] hover:border-[#D8D4CC] active:bg-[#EAE6DC] focus:ring-[#D15B40]/30',
    danger: 'bg-[#A33D35] text-white hover:bg-[#8B322B] active:bg-[#732720] focus:ring-[#A33D35]/40 border border-transparent',
    ghost: 'bg-transparent text-[#171717] hover:bg-[#F0EDE6] active:bg-[#EAE6DC] focus:ring-[#D15B40]/30',
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

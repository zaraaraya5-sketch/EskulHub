import React from 'react';

export type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'neutral', className = '' }) => {
  const variantStyles: Record<BadgeVariant, string> = {
    success: 'bg-[#E7EFEA] text-[#234B36] border-[#B7D2C2]',
    warning: 'bg-[#F9F4E5] text-[#8C6819] border-[#DFCF9B]',
    danger: 'bg-[#FBECEB] text-[#B84A3A] border-[#E8BFB8]',
    info: 'bg-[#EFECE6] text-[#3E3C36] border-[#D0CCC2]',
    neutral: 'bg-[#ECEAE4] text-[#474540] border-[#EAE6DC]',
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
};

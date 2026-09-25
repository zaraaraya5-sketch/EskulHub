import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-semibold text-[#171717] uppercase tracking-wider mb-1.5">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`w-full px-3 py-2 text-sm bg-white border rounded text-[#171717] placeholder-[#A39F97] focus:outline-none focus:ring-1 focus:ring-[#234B36] focus:border-[#234B36] transition-colors ${
          error ? 'border-[#A33D35]' : 'border-[#D8D4CC]'
        } ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-[#A33D35]">{error}</p>}
      {helperText && !error && <p className="mt-1 text-xs text-[#68655F]">{helperText}</p>}
    </div>
  );
};

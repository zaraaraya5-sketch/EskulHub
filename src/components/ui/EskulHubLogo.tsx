import React from 'react';

interface EskulHubLogoProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  schoolSubtitle?: string;
  variant?: 'light' | 'dark';
}

export const EskulHubLogo: React.FC<EskulHubLogoProps> = ({
  className = '',
  size = 'md',
  showText = false,
  schoolSubtitle,
  variant = 'light',
}) => {
  const sizeMap = {
    xs: { box: 'w-7 h-7', text: 'text-sm', sub: 'text-[9px]' },
    sm: { box: 'w-8 h-8', text: 'text-base', sub: 'text-[10px]' },
    md: { box: 'w-10 h-10', text: 'text-lg', sub: 'text-[11px]' },
    lg: { box: 'w-12 h-12', text: 'text-xl', sub: 'text-xs' },
    xl: { box: 'w-14 h-14', text: 'text-2xl', sub: 'text-sm' },
  };

  const currentSize = sizeMap[size];

  // SVG representation of the official EskulHub mark:
  // Purple rounded square + white E + orange circle dot
  const iconMarkup = (
    <div
      className={`${currentSize.box} relative shrink-0 rounded-2xl overflow-hidden shadow-xs transition-transform duration-200 group-hover:scale-105`}
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Purple rounded square background */}
        <rect width="100" height="100" rx="26" fill="url(#eskulhub_grad)" />

        {/* Orange Accent Dot positioned above the top right bar of the E */}
        <circle cx="78" cy="23" r="11" fill="#F59E0B" />

        {/* Crisp White Letter E */}
        {/* Vertical stem */}
        <rect x="23" y="27" width="16" height="52" rx="4" fill="white" />
        {/* Top horizontal bar */}
        <path
          d="M34 27 H66 C68.5 27 70.5 29 70.5 31.5 C70.5 34 68.5 36 66 36 H34 V27 Z"
          fill="white"
        />
        {/* Middle horizontal bar */}
        <path
          d="M34 47 H60 C62.2 47 64 48.8 64 51 C64 53.2 62.2 55 60 55 H34 V47 Z"
          fill="white"
        />
        {/* Bottom horizontal bar */}
        <path
          d="M34 70 H68 C70.5 70 72.5 72 72.5 74.5 C72.5 77 70.5 79 68 79 H34 V70 Z"
          fill="white"
        />

        <defs>
          <linearGradient
            id="eskulhub_grad"
            x1="0"
            y1="0"
            x2="100"
            y2="100"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#5345E8" />
            <stop offset="1" stopColor="#4338CA" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );

  if (!showText) {
    return <div className={`inline-flex items-center ${className}`}>{iconMarkup}</div>;
  }

  return (
    <div className={`inline-flex items-center gap-2.5 sm:gap-3 select-none ${className}`}>
      {iconMarkup}
      <div className="min-w-0">
        <div className="flex items-center gap-1.5">
          <span
            className={`font-black tracking-tight leading-none ${currentSize.text} ${
              variant === 'dark' ? 'text-white' : 'text-[#171717]'
            }`}
          >
            Eskul<span className="text-[#4F46E5]">Hub</span>
          </span>
        </div>
        <span
          className={`block font-semibold uppercase tracking-wider leading-none mt-1 truncate ${currentSize.sub} ${
            variant === 'dark' ? 'text-stone-400' : 'text-[#68655F]'
          }`}
        >
          {schoolSubtitle || 'Portal Ekstrakurikuler'}
        </span>
      </div>
    </div>
  );
};


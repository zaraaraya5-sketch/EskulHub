import React from 'react';

export interface LogoProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  withText?: boolean;
  /** Backwards compatibility alias for withText */
  showText?: boolean;
  layout?: 'horizontal' | 'vertical';
  variant?: 'light' | 'dark';
  badgeText?: string;
  /** Automatically hide badge text on mobile screens to prevent navbar overcrowding */
  hideBadgeOnMobile?: boolean;
  /** Automatically hide long subtitle on mobile screens for compact layout */
  hideSubtitleOnMobile?: boolean;
  subtitle?: string;
  /** Backwards compatibility alias for subtitle */
  schoolSubtitle?: string;
  onClick?: () => void;
  title?: string;
}

/**
 * Official EskulHub Brand Logo Component
 * - Primary warm terracotta orange (#D15B40) matching website theme
 * - Crisp pure-white geometric "E"
 * - Radiant amber-gold accent dot with white separation border
 * - Solid CSS & SVG fallbacks to guarantee 100% reliable rendering without broken assets
 */
export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  withText = false,
  showText = false,
  layout = 'horizontal',
  variant = 'light',
  badgeText,
  hideBadgeOnMobile = true,
  hideSubtitleOnMobile = false,
  subtitle,
  schoolSubtitle,
  onClick,
  title,
}) => {
  const shouldShowText = withText || showText;
  const subtitleText = subtitle || schoolSubtitle;

  const sizeMap = {
    xs: {
      box: 'w-7 h-7',
      iconRadius: 'rounded-lg',
      title: 'text-sm',
      badge: 'text-[9px] px-1.5 py-0.25',
      subtitle: 'text-[9px]',
      gap: 'gap-2',
    },
    sm: {
      box: 'w-8 h-8',
      iconRadius: 'rounded-xl',
      title: 'text-base',
      badge: 'text-[9px] px-1.5 py-0.5',
      subtitle: 'text-[10px]',
      gap: 'gap-2.5',
    },
    md: {
      box: 'w-10 h-10',
      iconRadius: 'rounded-xl sm:rounded-2xl',
      title: 'text-base sm:text-lg',
      badge: 'text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5',
      subtitle: 'text-[10px] sm:text-[11px]',
      gap: 'gap-2.5 sm:gap-3',
    },
    lg: {
      box: 'w-12 h-12',
      iconRadius: 'rounded-2xl',
      title: 'text-xl',
      badge: 'text-[11px] px-2.5 py-0.5',
      subtitle: 'text-xs',
      gap: 'gap-3.5',
    },
    xl: {
      box: 'w-16 h-16',
      iconRadius: 'rounded-2xl sm:rounded-3xl',
      title: 'text-2xl',
      badge: 'text-xs px-3 py-1',
      subtitle: 'text-sm',
      gap: 'gap-4',
    },
  };

  const currentSize = sizeMap[size];

  // SVG representation of official EskulHub mark:
  // Primary orange rounded square (#D15B40) + white E + luminous golden dot (#FCD34D)
  const iconMarkup = (
    <div
      className={`${currentSize.box} ${currentSize.iconRadius} relative shrink-0 overflow-hidden shadow-xs transition-transform duration-200 ease-out group-hover:scale-105 select-none`}
      style={{
        backgroundColor: '#D15B40',
        background: 'linear-gradient(135deg, #DE6449 0%, #D15B40 50%, #B94931 100%)',
      }}
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full block"
        aria-hidden="true"
      >
        {/* Base solid background fill fallback */}
        <rect width="100" height="100" rx="26" fill="#D15B40" />

        {/* Subtle depth gradient overlay */}
        <defs>
          <linearGradient
            id="eskulhub_orange_gradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#DE6449" />
            <stop offset="60%" stopColor="#D15B40" />
            <stop offset="100%" stopColor="#BA4A32" />
          </linearGradient>
        </defs>
        <rect width="100" height="100" rx="26" fill="url(#eskulhub_orange_gradient)" />

        {/* Letter E in pure white */}
        {/* Vertical stem */}
        <rect x="23" y="27" width="16" height="52" rx="4" fill="#FFFFFF" />
        {/* Top horizontal bar */}
        <path
          d="M34 27 H66 C68.5 27 70.5 29 70.5 31.5 C70.5 34 68.5 36 66 36 H34 V27 Z"
          fill="#FFFFFF"
        />
        {/* Middle horizontal bar */}
        <path
          d="M34 47 H60 C62.2 47 64 48.8 64 51 C64 53.2 62.2 55 60 55 H34 V47 Z"
          fill="#FFFFFF"
        />
        {/* Bottom horizontal bar */}
        <path
          d="M34 70 H68 C70.5 70 72.5 72 72.5 74.5 C72.5 77 70.5 79 68 79 H34 V70 Z"
          fill="#FFFFFF"
        />

        {/* Radiant golden accent dot with crisp white border for contrast */}
        <circle
          cx="78"
          cy="23"
          r="10.5"
          fill="#FCD34D"
          stroke="#FFFFFF"
          strokeWidth="2.5"
        />
      </svg>
    </div>
  );

  if (!shouldShowText) {
    return (
      <div
        className={`inline-flex items-center ${onClick ? 'cursor-pointer group' : ''} ${className}`}
        onClick={onClick}
        title={title}
      >
        {iconMarkup}
      </div>
    );
  }

  if (layout === 'vertical') {
    return (
      <div
        className={`inline-flex flex-col items-center text-center ${
          onClick ? 'cursor-pointer group' : ''
        } ${className}`}
        onClick={onClick}
        title={title}
      >
        {iconMarkup}
        <div className="mt-3 flex flex-col items-center">
          <div className="flex items-center gap-2">
            <span
              className={`font-black tracking-tight leading-none ${currentSize.title} ${
                variant === 'dark' ? 'text-white' : 'text-[#171717]'
              }`}
            >
              Eskul<span className="text-[#D15B40] group-hover:text-[#B94931] transition-colors">Hub</span>
            </span>
            {badgeText && (
              <span
                className={`font-bold uppercase tracking-wider bg-[#FDEDE9] text-[#D15B40] border border-[#F2C9C0] rounded-md shrink-0 ${currentSize.badge}`}
              >
                {badgeText}
              </span>
            )}
          </div>
          {subtitleText && (
            <div
              className={`font-medium tracking-wide uppercase mt-1 truncate ${
                variant === 'dark' ? 'text-stone-400' : 'text-[#68655F]'
              } ${currentSize.subtitle}`}
            >
              {subtitleText}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center ${currentSize.gap} select-none min-w-0 ${
        onClick ? 'cursor-pointer group' : ''
      } ${className}`}
      onClick={onClick}
      title={title}
    >
      {iconMarkup}
      <div className="min-w-0">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <span
            className={`font-black tracking-tight leading-none ${currentSize.title} ${
              variant === 'dark' ? 'text-white' : 'text-[#171717]'
            }`}
          >
            Eskul<span className="text-[#D15B40] group-hover:text-[#B94931] transition-colors">Hub</span>
          </span>
          {badgeText && (
            <span
              className={`${
                hideBadgeOnMobile ? 'hidden sm:inline-flex' : 'inline-flex'
              } font-bold uppercase tracking-wider bg-[#FDEDE9] text-[#D15B40] border border-[#F2C9C0] rounded-md shrink-0 ${currentSize.badge}`}
            >
              {badgeText}
            </span>
          )}
        </div>
        {subtitleText && (
          <div
            className={`font-medium tracking-wide uppercase mt-0.5 sm:mt-1 truncate ${
              hideSubtitleOnMobile ? 'hidden sm:block' : ''
            } ${
              variant === 'dark' ? 'text-stone-400' : 'text-[#68655F]'
            } ${currentSize.subtitle}`}
          >
            {subtitleText}
          </div>
        )}
      </div>
    </div>
  );
};

export { Logo as EskulHubLogo };


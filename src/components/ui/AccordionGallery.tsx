
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { ArrowRight } from 'lucide-react';
import './AccordionGallery.css';

export interface AccordionGalleryItem {
  id?: string;
  image: string;
  label?: string;
  bio?: string;
  link?: string;
  alt?: string;
}

interface AccordionGalleryProps {
  items?: AccordionGalleryItem[];
  defaultIndex?: number;
  accentColor?: string;
  overlayColor?: string;
  textColor?: string;
  height?: number;
  gap?: number;
  radius?: number;
  expandRatio?: number;
  orientation?: 'horizontal' | 'vertical';
  duration?: number;
  ease?: string;
  parallax?: number;
  tilt?: number;
  stagger?: number;
  trigger?: 'hover' | 'click';
  showLabels?: boolean;
  grayscale?: boolean;
  className?: string;
  onNavigate?: (path: string) => void;
}

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800';

const DEFAULT_ITEMS: AccordionGalleryItem[] = [
  {
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800',
    label: 'Futsal Garuda Nusantara',
    bio: 'Wadah pembinaan fisik, sportivitas, dan strategi kompetisi futsal antar-sekolah.',
    link: '/ekskul/futsal',
  },
  {
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800',
    label: 'Programming & Cyber Club',
    bio: 'Eksplorasi pembuatan aplikasi web, kecerdasan buatan, algoritma kompetisi, dan keamanan siber.',
    link: '/ekskul/programming-club',
  },
  {
    image: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800',
    label: 'Fotografi & Sinematografi Citra',
    bio: 'Mempelajari teknik komposisi visual, tata cahaya, editing digital, dan produksi video sekolah.',
    link: '/ekskul/fotografi',
  },
  {
    image: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=800',
    label: 'Teater Citra Nusa',
    bio: 'Pengasahan olah vokal, gestur tubuh, penulisan naskah drama, dan seni pertunjukan panggung.',
    link: '/ekskul/teater',
  },
  {
    image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800',
    label: 'Basket Nusantara Club',
    bio: 'Latihan intensif bola basket, pembentukan fisik atletis, dan persiapan kompetisi DBL.',
    link: '/ekskul/basket',
  },
];

const AccordionGallery: React.FC<AccordionGalleryProps> = ({
  items = DEFAULT_ITEMS,
  defaultIndex = 2,
  accentColor = '#D15B40',
  overlayColor = '#060010',
  textColor = '#ffffff',
  height = 460,
  gap = 10,
  radius = 16,
  expandRatio = 0.52,
  orientation = 'horizontal',
  duration = 0.6,
  ease = 'power3.out',
  parallax = 0.5,
  tilt = 8,
  stagger = 0.06,
  trigger = 'hover',
  showLabels = true,
  grayscale = true,
  className = '',
  onNavigate
}) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<(HTMLAnchorElement | HTMLDivElement | null)[]>([]);
  const mediaRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const barRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const textRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const bioRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const ctaRefs = useRef<(HTMLDivElement | null)[]>([]);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const firstRunRef = useRef(true);
  const mediaSizeRef = useRef(320);

  const effectiveItems = items && items.length > 0 ? items : DEFAULT_ITEMS;
  const vertical = orientation === 'vertical';
  const count = effectiveItems.length;
  const [active, setActive] = useState(() => Math.min(Math.max(defaultIndex, 0), Math.max(0, count - 1)));

  useEffect(() => {
    if (active < 0 || active >= count) {
      setActive(Math.min(Math.max(defaultIndex, 0), Math.max(0, count - 1)));
    }
  }, [count, defaultIndex, active]);

  const prefersReduced =
    typeof window !== 'undefined' && window.matchMedia
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false;

  const applyLayout = useCallback(
    (animate: boolean) => {
      const panels = panelRefs.current;
      if (!panels.length) return;

      const r = Math.min(Math.max(expandRatio, 0.2), 0.9);
      const grow = count > 1 ? (r * (count - 1)) / (1 - r) : 1;
      const mediaSize = mediaSizeRef.current;

      tlRef.current?.kill();
      const dur = animate && !prefersReduced ? duration : 0;
      const tl = gsap.timeline();

      panels.forEach((panel, i) => {
        if (!panel) return;
        const isActive = i === active;
        const media = mediaRefs.current[i];
        const bar = barRefs.current[i];
        const text = textRefs.current[i];
        const bio = bioRefs.current[i];
        const cta = ctaRefs.current[i];

        const rot = isActive ? 0 : i < active ? tilt : -tilt;
        const rotProp = vertical ? { rotateX: -rot } : { rotateY: rot };

        tl.to(panel, { flexGrow: isActive ? grow : 1, ...rotProp, duration: dur, ease }, 0);

        if (media) {
          const drift = Math.max(-1.5, Math.min(1.5, active - i));
          const shift = drift * parallax * mediaSize * 0.06;
          const gray = grayscale ? (isActive ? 0 : 1) : 0;
          tl.to(
            media,
            {
              xPercent: -50,
              yPercent: -50,
              x: vertical ? 0 : isActive ? 0 : shift,
              y: vertical ? (isActive ? 0 : shift) : 0,
              '--ag-gray': gray,
              '--ag-dim': isActive ? 0.2 : 0.45, // slightly darker overlay when active to read bio
              duration: dur,
              ease
            },
            0
          );
        }

        if (showLabels) {
          const elementsToAnimate = [];
          if (bar) elementsToAnimate.push(bar);
          if (text) elementsToAnimate.push(text);
          if (bio) elementsToAnimate.push(bio);
          if (cta) elementsToAnimate.push(cta);

          if (isActive) {
            tl.to(elementsToAnimate, { opacity: 1, x: 0, y: 0, duration: dur, ease, stagger: prefersReduced ? 0 : stagger }, 0);
          } else {
            tl.to(elementsToAnimate, { opacity: 0, x: -14, y: 5, duration: dur * 0.6, ease }, 0);
          }
        }
      });

      tlRef.current = tl;
    },
    [
      active,
      count,
      expandRatio,
      duration,
      ease,
      vertical,
      tilt,
      parallax,
      grayscale,
      showLabels,
      stagger,
      prefersReduced
    ]
  );

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const measure = () => {
      const rect = el.getBoundingClientRect();
      const total = vertical ? rect.height : rect.width;
      const usable = Math.max(total - gap * (count - 1), 120);
      const size = Math.max(140, usable * Math.min(Math.max(expandRatio, 0.2), 0.9) * 1.22);
      mediaSizeRef.current = size;
      el.style.setProperty('--ag-media-size', `${size}px`);
      applyLayout(!firstRunRef.current);
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [applyLayout, gap, count, expandRatio, vertical]);

  useEffect(() => {
    applyLayout(!firstRunRef.current);
    firstRunRef.current = false;
  }, [applyLayout]);

  useEffect(
    () => () => {
      tlRef.current?.kill();
    },
    []
  );

  const handleEnter = (i: number) => {
    if (trigger === 'hover') setActive(i);
  };

  const handleClick = (i: number, e: React.MouseEvent) => {
    if (i !== active) {
      e.preventDefault();
      setActive(i);
    } else {
      // If active and click the card, navigate if link provided
      const link = effectiveItems[i]?.link;
      if (link && onNavigate) {
         e.preventDefault();
         onNavigate(link);
      }
    }
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((i + 1) % count);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((i - 1 + count) % count);
    }
  };

  return (
    <div
      ref={rootRef}
      className={`accordion-gallery${vertical ? ' accordion-gallery--vertical' : ''}${className ? ` ${className}` : ''}`}
      style={{
        '--ag-accent': accentColor,
        '--ag-overlay': overlayColor,
        '--ag-text': textColor,
        '--ag-gap': `${gap}px`,
        '--ag-radius': `${radius}px`,
        height: vertical ? `${Math.round(height * 1.6)}px` : `${height}px`
      } as React.CSSProperties}
      role="list"
      aria-label="Image accordion gallery"
    >
      {effectiveItems.map((item, i) => {
        const isActive = i === active;
        const Tag = item.link && !onNavigate ? 'a' : 'div';
        return (
          <Tag
            key={i}
            ref={(el: any) => { panelRefs.current[i] = el; }}
            className={`ag-panel${isActive ? ' ag-panel--active' : ''}`}
            style={{ borderRadius: `${radius}px` }}
            href={Tag === 'a' ? item.link || undefined : undefined}
            onClick={e => handleClick(i, e as any)}
            onMouseEnter={() => handleEnter(i)}
            onFocus={() => setActive(i)}
            onKeyDown={e => handleKeyDown(i, e)}
            role="listitem"
            tabIndex={0}
            aria-current={isActive ? 'true' : undefined}
            aria-label={item.label}
          >
            <span className="ag-panel__frame">
              <span className="ag-panel__media" ref={(el) => { mediaRefs.current[i] = el; }}>
                <img
                  src={item.image || FALLBACK_IMAGE}
                  alt={item.alt || item.label || ''}
                  draggable="false"
                  loading="eager"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (target.src !== FALLBACK_IMAGE) {
                      target.src = FALLBACK_IMAGE;
                    }
                  }}
                />
              </span>
              <span className="ag-panel__overlay" aria-hidden="true" />
            </span>
            {showLabels && (
              <span className="ag-panel__label" aria-hidden="true">
                <div className="ag-panel__label-container">
                  <div className="ag-panel__header">
                    <span className="ag-panel__bar" ref={(el) => { barRefs.current[i] = el; }} />
                    <div className="ag-panel__title-wrapper">
                      <div className="ag-panel__text" ref={(el) => { textRefs.current[i] = el; }}>
                        {item.label}
                      </div>
                    </div>
                  </div>
                  {item.bio && (
                     <p className="ag-panel__bio" ref={(el) => { bioRefs.current[i] = el; }}>
                       {item.bio}
                     </p>
                  )}
                  {item.link && (
                     <div className="ag-panel__cta-wrapper" ref={(el) => { ctaRefs.current[i] = el; }}>
                       <button 
                         className="ag-panel__cta"
                         onClick={(e) => {
                           e.stopPropagation();
                           if (onNavigate) onNavigate(item.link!);
                         }}
                       >
                         Lihat Profil <ArrowRight className="w-3 h-3 ml-1" />
                       </button>
                     </div>
                  )}
                </div>
              </span>
            )}
          </Tag>
        );
      })}
    </div>
  );
};

export default AccordionGallery;

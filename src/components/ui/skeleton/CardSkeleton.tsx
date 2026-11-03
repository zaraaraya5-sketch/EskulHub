import React from 'react';

interface CardSkeletonProps {
  count?: number;
  aspect?: 'video' | 'card';
}

export const CardSkeleton: React.FC<CardSkeletonProps> = ({ count = 3, aspect = 'card' }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="rounded-2xl border border-[#EAE6DC] bg-white overflow-hidden shadow-xs flex flex-col"
        >
          {/* Image banner placeholder */}
          <div
            className={`w-full bg-[#EAE6DC]/60 ${
              aspect === 'video' ? 'aspect-[16/10]' : 'h-44'
            } relative overflow-hidden`}
          >
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
          </div>

          {/* Content details placeholder */}
          <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="h-4 bg-[#EAE6DC] rounded w-3/4" />
              <div className="h-3 bg-[#EAE6DC]/70 rounded w-1/2" />
            </div>

            <div className="space-y-2 pt-2 border-t border-[#EAE6DC]/60">
              <div className="h-3 bg-[#EAE6DC]/60 rounded w-full" />
              <div className="h-3 bg-[#EAE6DC]/60 rounded w-4/5" />
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="h-6 w-16 bg-[#EAE6DC] rounded-full" />
              <div className="h-8 w-24 bg-[#EAE6DC] rounded-xl" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};


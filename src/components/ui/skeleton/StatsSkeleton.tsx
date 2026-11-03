import React from 'react';

interface StatsSkeletonProps {
  count?: number;
}

export const StatsSkeleton: React.FC<StatsSkeletonProps> = ({ count = 4 }) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="p-4 sm:p-5 rounded-2xl bg-white border border-[#EAE6DC] shadow-xs space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="h-3.5 bg-[#EAE6DC] rounded w-24" />
            <div className="w-8 h-8 rounded-xl bg-[#EAE6DC]/70" />
          </div>
          <div className="h-7 bg-[#EAE6DC] rounded w-16" />
          <div className="h-2.5 bg-[#EAE6DC]/60 rounded w-28" />
        </div>
      ))}
    </div>
  );
};

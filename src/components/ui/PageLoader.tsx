import React from 'react';

/**
 * PageLoader — Shimmer skeleton layout for route transitions.
 * Eliminates jarring blank screens and perceived latency by rendering
 * structural page placeholders while lazy components are resolved.
 */
export const PageLoader: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-pulse">
      {/* Header bar placeholder */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#EAE6DC]/60">
        <div className="space-y-2">
          <div className="h-6 bg-[#EAE6DC] rounded-md w-48" />
          <div className="h-3.5 bg-[#EAE6DC]/70 rounded w-72" />
        </div>
        <div className="h-9 bg-[#EAE6DC]/80 rounded-xl w-32" />
      </div>

      {/* Metric stats 4-card placeholder */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="p-4 rounded-2xl bg-white border border-[#EAE6DC] shadow-2xs space-y-2.5">
            <div className="h-3 bg-[#EAE6DC]/70 rounded w-20" />
            <div className="h-6 bg-[#EAE6DC] rounded w-14" />
          </div>
        ))}
      </div>

      {/* Main card/table block placeholder */}
      <div className="rounded-2xl border border-[#EAE6DC] bg-white p-6 shadow-2xs space-y-4">
        <div className="h-4 bg-[#EAE6DC] rounded w-40" />
        <div className="space-y-3">
          <div className="h-10 bg-[#F9F8F6] rounded-xl w-full border border-[#EAE6DC]/60" />
          <div className="h-10 bg-[#F9F8F6] rounded-xl w-full border border-[#EAE6DC]/60" />
          <div className="h-10 bg-[#F9F8F6] rounded-xl w-full border border-[#EAE6DC]/60" />
        </div>
      </div>
    </div>
  );
};

export default PageLoader;

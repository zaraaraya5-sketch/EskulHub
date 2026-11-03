import React from 'react';

interface TableSkeletonProps {
  rows?: number;
  cols?: number;
}

export const TableSkeleton: React.FC<TableSkeletonProps> = ({ rows = 5, cols = 4 }) => {
  return (
    <div className="border border-[#EAE6DC] rounded-2xl bg-white overflow-hidden shadow-xs animate-pulse">
      {/* Table Header Placeholder */}
      <div className="bg-[#F9F8F6] border-b border-[#EAE6DC] p-4 flex gap-4">
        {Array.from({ length: cols }).map((_, c) => (
          <div
            key={c}
            className="h-3.5 bg-[#EAE6DC] rounded"
            style={{ width: `${100 / cols}%` }}
          />
        ))}
      </div>

      {/* Table Body Rows Placeholder */}
      <div className="divide-y divide-[#EAE6DC]/60">
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="p-4 flex items-center gap-4">
            {Array.from({ length: cols }).map((_, c) => (
              <div
                key={c}
                className="h-3 bg-[#EAE6DC]/70 rounded"
                style={{ width: `${Math.max(30, (100 / cols) * (c === 0 ? 1.2 : 0.8))}%` }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

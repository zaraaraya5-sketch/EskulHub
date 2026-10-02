import React from 'react';

export const PageLoader: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-[50vh] p-8">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-[#EAE6DC] border-t-[#D15B40] animate-spin" />
        <span className="text-xs font-medium text-[#68655F]">Memuat halaman...</span>
      </div>
    </div>
  );
};

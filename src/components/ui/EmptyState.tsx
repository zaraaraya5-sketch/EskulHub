import React from 'react';
import { LucideIcon, Inbox } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = Inbox,
  title,
  description,
  action,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center border border-dashed border-[#D8D4CC] rounded-lg bg-white/50">
      <div className="p-3 bg-[#F5F2EA] rounded-full text-[#68655F] mb-3">
        <Icon className="w-6 h-6" />
      </div>
      <h4 className="text-sm font-semibold text-[#171717] mb-1">{title}</h4>
      <p className="text-xs text-[#68655F] max-w-sm mb-4">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
};

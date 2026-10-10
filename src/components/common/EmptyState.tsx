import React from 'react';
import { cn } from '../../lib/utils';
import { CornerBrackets } from './CornerBrackets';
import { ShieldAlert } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  action,
  className,
}) => {
  return (
    <div
      className={cn(
        'relative bg-white border border-[#D9DEE5] rounded-[4px] p-8 text-center flex flex-col items-center justify-center min-h-[220px]',
        className
      )}
    >
      <CornerBrackets size={6} color="border-[#D9DEE5]" />
      <div className="w-12 h-12 rounded-[3px] bg-[#F5F7FA] border border-[#D9DEE5] flex items-center justify-center text-[#64748B] mb-4">
        {icon || <ShieldAlert size={22} className="text-[#64748B]" />}
      </div>
      <h4 className="text-base font-semibold text-[#0F172A] mb-1.5">{title}</h4>
      <p className="text-xs text-[#475569] max-w-sm mb-5 font-normal leading-relaxed">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
};

import * as React from 'react';
import { cn } from '../../lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' | 'cyan';
}

function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  const variantStyles = {
    default: 'bg-[#EFF6FF] text-[#1D4ED8] border border-[#BFDBFE]',
    secondary: 'bg-[#F5F7FA] text-[#475569] border border-[#D9DEE5]',
    destructive: 'bg-[#FEF2F2] text-[#B91C1C] border border-[#FECACA]',
    outline: 'bg-white text-[#475569] border border-[#D9DEE5]',
    success: 'bg-[#F0FDF4] text-[#15803D] border border-[#BBF7D0]',
    warning: 'bg-[#FFFBEB] text-[#B45309] border border-[#FDE68A]',
    cyan: 'bg-[#EFF6FF] text-[#1D4ED8] border border-[#BFDBFE]',
  }[variant];

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-[3px] border px-2 py-0.5 text-xs font-mono font-medium transition-colors select-none',
        variantStyles,
        className
      )}
      {...props}
    />
  );
}

export { Badge };

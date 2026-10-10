import React from 'react';
import { cn } from '../../lib/utils';
import { Sparkline } from './Sparkline';
import { CornerBrackets } from './CornerBrackets';

interface MetricCardProps {
  label: string;
  value: React.ReactNode;
  subtitle?: string;
  sparklineData?: number[];
  sparklineColor?: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  highlight?: boolean;
  className?: string;
  badge?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  subtitle,
  sparklineData,
  sparklineColor = '#1D4ED8',
  trend,
  highlight = false,
  className,
  badge,
}) => {
  return (
    <div
      className={cn(
        'relative bg-white border border-[#D9DEE5] rounded-[4px] p-4 flex flex-col justify-between transition-colors',
        highlight && 'border-[#1D4ED8] bg-[#F5F7FA]',
        className
      )}
    >
      <CornerBrackets size={6} color={highlight ? 'border-[#1D4ED8]' : 'border-[#D9DEE5]'} />

      <div className="flex items-center justify-between mb-2">
        <span className="telemetry-label text-[#475569] text-[11px] font-semibold tracking-wider font-sans">
          {label}
        </span>
        {badge && (
          <span className="font-mono text-[9px] px-1.5 py-0.5 rounded-[2px] bg-[#EFF6FF] border border-[#BFDBFE] text-[#1D4ED8]">
            {badge}
          </span>
        )}
      </div>

      <div className="flex items-baseline justify-between gap-4 my-1">
        <div className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#0F172A] font-mono">
          {value}
        </div>
        {sparklineData && sparklineData.length > 1 && (
          <Sparkline data={sparklineData} width={80} height={26} color={sparklineColor} />
        )}
      </div>

      <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#D9DEE5] text-xs">
        {subtitle && <span className="text-[#64748B] font-mono text-[11px]">{subtitle}</span>}
        {trend && (
          <span
            className={cn(
              'font-mono text-[11px] font-medium ml-auto flex items-center gap-1',
              trend.isPositive ? 'text-[#15803D]' : 'text-[#B91C1C]'
            )}
          >
            {trend.isPositive ? '↑' : '↓'} {trend.value}
          </span>
        )}
      </div>
    </div>
  );
};

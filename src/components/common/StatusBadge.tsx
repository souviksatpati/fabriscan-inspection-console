import React from 'react';
import { SystemStatus } from '../../types/status';
import { getStatusMeta } from '../../lib/status';
import { cn } from '../../lib/utils';
import {
  Play,
  Check,
  RefreshCw,
  AlertTriangle,
  AlertOctagon,
  Square,
  WifiOff,
} from 'lucide-react';

interface StatusBadgeProps {
  status: SystemStatus;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  showText?: boolean;
  className?: string;
  customLabel?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  showIcon = true,
  showText = true,
  className,
  customLabel,
}) => {
  const meta = getStatusMeta(status);

  const renderIcon = () => {
    const iconSize = size === 'sm' ? 12 : size === 'lg' ? 16 : 14;
    switch (meta.iconName) {
      case 'play':
        return <Play size={iconSize} className="fill-current" />;
      case 'check':
        return <Check size={iconSize} strokeWidth={2.5} />;
      case 'refresh':
        return <RefreshCw size={iconSize} className={meta.pulse ? 'animate-spin' : ''} />;
      case 'alert-triangle':
        return <AlertTriangle size={iconSize} strokeWidth={2.2} />;
      case 'alert-octagon':
        return <AlertOctagon size={iconSize} strokeWidth={2.5} />;
      case 'square':
        return <Square size={iconSize} className="fill-current opacity-70" />;
      case 'wifi-off':
        return <WifiOff size={iconSize} strokeWidth={2.2} />;
      default:
        return <Check size={iconSize} />;
    }
  };

  const toneClasses = {
    success: 'bg-[#F0FDF4] text-[#15803D] border-[#BBF7D0]',
    blue: 'bg-[#EFF6FF] text-[#1D4ED8] border-[#BFDBFE]',
    warning: 'bg-[#FFFBEB] text-[#B45309] border-[#FDE68A]',
    critical: 'bg-[#FEF2F2] text-[#B91C1C] border-[#FECACA]',
    muted: 'bg-[#F1F5F9] text-[#64748B] border-[#CBD5E1]',
  }[meta.tone];

  const borderStyleClasses = {
    solid: 'border',
    dashed: 'border border-dashed',
    thick: 'border-2 border-[#B91C1C]',
    dotted: 'border border-dotted',
  }[meta.borderStyle];

  const sizeClasses = {
    sm: 'text-[10px] px-1.5 py-0.5 gap-1 tracking-wider',
    md: 'text-xs px-2.5 py-1 gap-1.5 tracking-wider',
    lg: 'text-sm px-3.5 py-1.5 gap-2 tracking-widest',
  }[size];

  const pulseClasses = meta.pulse
    ? meta.borderStyle === 'thick'
      ? 'animate-critical-alert'
      : 'animate-pulse'
    : '';

  return (
    <span
      className={cn(
        'inline-flex items-center font-mono font-semibold uppercase rounded-[3px] select-none transition-colors duration-200',
        toneClasses,
        borderStyleClasses,
        sizeClasses,
        pulseClasses,
        className
      )}
      title={`${meta.label}: ${meta.description}`}
      aria-label={`Status: ${customLabel || meta.label}`}
    >
      {showIcon && <span className="shrink-0">{renderIcon()}</span>}
      {showText && <span>{customLabel || meta.label}</span>}
    </span>
  );
};

import React from 'react';
import { cn } from '../../lib/utils';
import { CornerBrackets } from './CornerBrackets';
import { RefreshCw } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
  subMessage?: string;
  className?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Initializing Edge Vision Stream...',
  subMessage = 'Connecting to YOLOv8-Seg TensorRT runtime',
  className,
}) => {
  return (
    <div
      className={cn(
        'relative bg-white border border-[#D9DEE5] rounded-[4px] p-8 text-center flex flex-col items-center justify-center min-h-[260px]',
        className
      )}
    >
      <CornerBrackets size={6} color="border-[#D9DEE5]" />
      <div className="relative mb-4">
        <div className="w-12 h-12 rounded-[3px] border border-[#D9DEE5] border-t-[#1D4ED8] animate-spin flex items-center justify-center" />
        <RefreshCw size={16} className="absolute inset-0 m-auto text-[#1D4ED8] animate-pulse" />
      </div>
      <div className="font-sans text-xs uppercase tracking-wider text-[#0F172A] mb-1 font-semibold">{message}</div>
      <div className="font-mono text-[11px] text-[#64748B]">{subMessage}</div>
    </div>
  );
};

import React from 'react';
import { SystemStatus } from '../../types/status';
import { StatusBadge } from '../common/StatusBadge';
import { cn } from '../../lib/utils';

interface StatusStripProps {
  lineStatus: SystemStatus;
  cameraStatus: SystemStatus;
  aiStatus: SystemStatus;
  actuatorStatus: SystemStatus;
  fps?: number;
  inferenceMs?: number;
  className?: string;
}

export const StatusStrip: React.FC<StatusStripProps> = ({
  lineStatus,
  cameraStatus,
  aiStatus,
  actuatorStatus,
  fps = 30.2,
  inferenceMs = 28.4,
  className,
}) => {
  return (
    <div
      className={cn(
        'bg-white border border-[#D9DEE5] rounded-[4px] px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs shadow-[0_1px_2px_rgba(15,23,42,0.04)]',
        className
      )}
    >
      <div className="flex flex-wrap items-center gap-2 sm:gap-4">
        {/* Line State */}
        <div className="flex items-center gap-1.5">
          <span className="font-sans text-[10px] text-[#64748B] uppercase tracking-wider font-semibold">LINE:</span>
          <StatusBadge status={lineStatus} size="sm" />
        </div>

        {/* Camera Sensor State */}
        <div className="flex items-center gap-1.5">
          <span className="font-sans text-[10px] text-[#64748B] uppercase tracking-wider font-semibold">CAMERA:</span>
          <StatusBadge status={cameraStatus} size="sm" />
        </div>

        {/* AI TensorRT Inference State */}
        <div className="flex items-center gap-1.5">
          <span className="font-sans text-[10px] text-[#64748B] uppercase tracking-wider font-semibold">AI ENGINE:</span>
          <StatusBadge status={aiStatus} size="sm" />
        </div>

        {/* Rejection Actuator State */}
        <div className="flex items-center gap-1.5">
          <span className="font-sans text-[10px] text-[#64748B] uppercase tracking-wider font-semibold">ACTUATOR:</span>
          <StatusBadge status={actuatorStatus} size="sm" />
        </div>
      </div>

      <div className="flex items-center gap-4 font-mono text-[11px] text-[#64748B]">
        <div className="flex items-center gap-1.5">
          <span className="text-[#64748B] font-sans font-medium text-[10px] uppercase">SPEED:</span>
          <span className="text-[#1D4ED8] font-bold">{fps.toFixed(1)} FPS</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[#64748B] font-sans font-medium text-[10px] uppercase">LATENCY:</span>
          <span className="text-[#0F172A] font-bold">{inferenceMs.toFixed(1)} ms</span>
        </div>
      </div>
    </div>
  );
};

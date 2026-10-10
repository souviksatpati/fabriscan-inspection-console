import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/utils';

interface LogoProps {
  className?: string;
  showSubtitle?: boolean;
  linkTo?: string;
}

export const Logo: React.FC<LogoProps> = ({
  className,
  showSubtitle = true,
  linkTo = '/',
}) => {
  const content = (
    <div className={cn('flex items-center gap-2.5 select-none group', className)}>
      {/* Industrial Optical Sensor Glyph */}
      <div className="relative w-8 h-8 rounded-[3px] bg-[#F5F7FA] border border-[#D9DEE5] flex items-center justify-center overflow-hidden transition-colors group-hover:border-[#1D4ED8] shrink-0">
        {/* Reticle grid */}
        <div className="absolute inset-0 bg-tech-grid-dense opacity-30" />
        {/* Scanning beam */}
        <div className="absolute inset-x-0 h-[1px] bg-[#1D4ED8]/40 top-1/2 -translate-y-1/2" />
        {/* Optical center reticle */}
        <div className="relative w-3.5 h-3.5 rounded-[2px] border border-[#1D4ED8] flex items-center justify-center">
          <div className="w-1.5 h-1.5 rounded-[1px] bg-[#15803D]" />
        </div>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 leading-none">
          <span className="font-sans text-[10px] tracking-[0.2em] text-[#1D4ED8] uppercase font-bold">
            MARUTI
          </span>
          <span className="text-sm font-bold tracking-tight text-[#0F172A] group-hover:text-[#1D4ED8] transition-colors">
            FABRISCAN
          </span>
        </div>
        {showSubtitle && (
          <span className="font-sans text-[9px] tracking-[0.1em] text-[#64748B] uppercase font-medium mt-0.5">
            EDGE AOI PLATFORM
          </span>
        )}
      </div>
    </div>
  );

  if (linkTo) {
    return (
      <Link to={linkTo} className="inline-flex focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1D4ED8] rounded-[2px]">
        {content}
      </Link>
    );
  }

  return content;
};

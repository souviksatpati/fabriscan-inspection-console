import React from 'react';
import { cn } from '../../lib/utils';

interface SectionHeadingProps {
  label?: string;
  boldTitle: string;
  lightTitle?: string;
  description?: string;
  alignment?: 'left' | 'center';
  className?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  label,
  boldTitle,
  lightTitle,
  description,
  alignment = 'left',
  className,
}) => {
  return (
    <div
      className={cn(
        'flex flex-col',
        alignment === 'center' ? 'items-center text-center' : 'items-start text-left',
        className
      )}
    >
      {label && (
        <span className="text-xs font-sans font-semibold tracking-wider text-[#1D4ED8] uppercase mb-2">
          {label}
        </span>
      )}

      <h2 className="h2-section text-[#0F172A] tracking-tight max-w-4xl">
        <span className="font-semibold text-[#0F172A]">{boldTitle}</span>{' '}
        {lightTitle && <span className="text-[#475569] font-normal">{lightTitle}</span>}
      </h2>

      {description && (
        <p className="body-large text-[#475569] max-w-2xl mt-3 font-normal leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
};

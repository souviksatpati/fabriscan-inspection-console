import React from 'react';
import { cn } from '../../lib/utils';

interface CornerBracketsProps {
  className?: string;
  size?: number;
  color?: string;
}

export const CornerBrackets: React.FC<CornerBracketsProps> = ({
  className,
  size = 8,
  color = 'border-[#D9DEE5]',
}) => {
  return (
    <div className={cn('pointer-events-none absolute inset-0', className)} aria-hidden="true">
      <div
        className={cn('absolute top-0 left-0 border-t-2 border-l-2', color)}
        style={{ width: size, height: size }}
      />
      <div
        className={cn('absolute top-0 right-0 border-t-2 border-r-2', color)}
        style={{ width: size, height: size }}
      />
      <div
        className={cn('absolute bottom-0 left-0 border-b-2 border-l-2', color)}
        style={{ width: size, height: size }}
      />
      <div
        className={cn('absolute bottom-0 right-0 border-b-2 border-r-2', color)}
        style={{ width: size, height: size }}
      />
    </div>
  );
};

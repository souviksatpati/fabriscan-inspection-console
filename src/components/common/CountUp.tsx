import React from 'react';
import { useCountUp } from '../../hooks/useCountUp';

interface CountUpProps {
  value: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export const CountUp: React.FC<CountUpProps> = ({
  value,
  duration = 800,
  decimals = 0,
  prefix = '',
  suffix = '',
  className,
}) => {
  const current = useCountUp(value, { duration, decimals });

  const formatted = decimals > 0
    ? current.toFixed(decimals)
    : Math.round(current).toLocaleString();

  return (
    <span className={className}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
};

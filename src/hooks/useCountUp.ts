import { useState, useEffect } from 'react';
import { useReducedMotion } from './useReducedMotion';

interface UseCountUpOptions {
  duration?: number; // ms
  decimals?: number;
}

export function useCountUp(
  targetValue: number,
  options: UseCountUpOptions = {}
): number {
  const { duration = 800, decimals = 0 } = options;
  const prefersReducedMotion = useReducedMotion();
  const [current, setCurrent] = useState<number>(prefersReducedMotion ? targetValue : 0);

  useEffect(() => {
    if (prefersReducedMotion) {
      setCurrent(targetValue);
      return;
    }

    let startTimestamp: number | null = null;
    const startValue = current;
    let animFrame: number;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // Ease out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const nextVal = startValue + (targetValue - startValue) * easeProgress;

      setCurrent(Number(nextVal.toFixed(decimals)));

      if (progress < 1) {
        animFrame = requestAnimationFrame(step);
      }
    };

    animFrame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animFrame);
  }, [targetValue, duration, decimals, prefersReducedMotion]);

  return current;
}

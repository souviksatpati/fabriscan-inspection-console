import { useState, useEffect } from 'react';

/**
 * Returns the computed root font size in pixels (e.g. 16px at <=1280px, 24px at 1920px).
 */
export function getRootFontSize(): number {
  if (typeof window === 'undefined') return 16;
  const fs = parseFloat(getComputedStyle(document.documentElement).fontSize);
  return Number.isFinite(fs) && fs > 0 ? fs : 16;
}

/**
 * React hook that returns the live root font size, responding to window resize events.
 */
export function useRootFontSize(): number {
  const [fontSize, setFontSize] = useState<number>(getRootFontSize);

  useEffect(() => {
    const handleResize = () => {
      setFontSize(getRootFontSize());
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return fontSize;
}

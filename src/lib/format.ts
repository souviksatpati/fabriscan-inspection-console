export function formatArea(areaMm2: number): string {
  return `${areaMm2.toFixed(2)} mm²`;
}

export function formatConfidence(confidence: number): string {
  return `${(confidence * 100).toFixed(1)}%`;
}

export function formatTime(isoString: string): string {
  try {
    const d = new Date(isoString);
    return d.toTimeString().split(' ')[0]; // HH:MM:SS
  } catch {
    return isoString;
  }
}

export function formatNumber(val: number): string {
  return new Intl.NumberFormat('en-US').format(val);
}

export function formatPpm(ppm: number): string {
  return `${Math.round(ppm)} PPM`;
}

export function formatLatency(ms: number): string {
  return `${ms.toFixed(1)} ms`;
}

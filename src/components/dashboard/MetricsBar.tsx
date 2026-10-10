import React from 'react';
import { MetricCard } from '../common/MetricCard';
import { formatNumber, formatPpm } from '../../lib/format';
import { InspectionMetrics } from '../../services/inspectionStore';

interface MetricsBarProps {
  metrics: InspectionMetrics | {
    totalInspected: number;
    acceptedCount: number;
    rejectedCount: number;
    firstTimeRightPct: number;
    partsPerMillionDefective: number;
  };
  className?: string;
}

export const MetricsBar: React.FC<MetricsBarProps> = ({ metrics, className }) => {
  // Normalize both shapes
  const total = 'inspected' in metrics ? metrics.inspected : metrics.totalInspected;
  const good = 'good' in metrics ? metrics.good : metrics.acceptedCount;
  const rejected = 'rejected' in metrics ? metrics.rejected : metrics.rejectedCount;
  const ftr = metrics.firstTimeRightPct;
  const ppm = 'partsPerMillionDefective' in metrics ? metrics.partsPerMillionDefective : 0;

  return (
    <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 ${className || ''}`}>
      {/* 1. Inspected */}
      <MetricCard
        label="TOTAL INSPECTED"
        value={formatNumber(total)}
        subtitle="Computed from store"
        trend={total > 0 ? { value: `${total} parts`, isPositive: true } : undefined}
      />

      {/* 2. Accepted */}
      <MetricCard
        label="ACCEPTED (GOOD)"
        value={formatNumber(good)}
        subtitle="Downstream cleared"
        trend={total > 0 ? { value: `${ftr.toFixed(1)}% yield`, isPositive: true } : undefined}
      />

      {/* 3. Rejected */}
      <MetricCard
        label="REJECTED (NOT GOOD)"
        value={formatNumber(rejected)}
        subtitle="Quarantined to bin"
        highlight={rejected > 0}
        trend={rejected > 0 ? { value: `${rejected} defect(s)`, isPositive: false } : undefined}
      />

      {/* 4. First Time Right (FTR) */}
      <MetricCard
        label="FIRST TIME RIGHT (FTR)"
        value={total > 0 ? `${ftr.toFixed(1)}%` : '—'}
        subtitle="Target: >98.0%"
        trend={total > 0 ? { value: ftr >= 98.0 ? 'Meets KPI' : 'Below target', isPositive: ftr >= 98.0 } : undefined}
      />

      {/* 5. Defect PPM */}
      <MetricCard
        label="DEFECT PPM"
        value={total > 0 ? formatPpm(ppm) : '0 PPM'}
        subtitle="Parts Per Million"
        trend={total > 0 ? { value: ppm < 20000 ? 'In tolerance' : 'High defect rate', isPositive: ppm < 20000 } : undefined}
      />
    </div>
  );
};

export default MetricsBar;

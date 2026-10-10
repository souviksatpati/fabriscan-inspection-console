export interface ProductionShiftSummary {
  shiftId: string;
  shiftName: string;
  operatorOnDuty: string;
  stationId: string;
  startTime: string;
  targetCount: number;
  totalInspected: number;
  acceptedCount: number;
  rejectedCount: number;
  firstTimeRightPct: number;
  partsPerMillionDefective: number;
  avgInferenceTimeMs: number;
  avgCycleTimeMs: number;
  lineUptimePct: number;
}

export interface ProductionTimeSeriesPoint {
  timeLabel: string;
  inspected: number;
  accepted: number;
  rejected: number;
  ppm: number;
  scratchCount: number;
  inclusionCount: number;
  pittingCount: number;
  crazingCount: number;
  patchesCount: number;
  rolledInScaleCount: number;
}

export interface DowntimeEvent {
  id: string;
  timestamp: string;
  durationMinutes: number;
  reason: string;
  category: 'OPTICAL' | 'PNEUMATIC' | 'CONVEYOR' | 'SYSTEM' | 'OPERATOR_INTERVENTION';
  resolvedBy: string;
}

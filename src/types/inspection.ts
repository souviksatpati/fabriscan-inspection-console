import { SystemStatus } from './status';
import { DefectMeasurement } from './defect';
import { DefectItem } from '../services/inspectionStore';

export type InspectionEnginePhase =
  | 'SCANNING'
  | 'ANALYZING'
  | 'DEFECT_DETECTED'
  | 'MEASURING'
  | 'DECISION'
  | 'ACCEPTED'
  | 'REJECTED'
  | 'ACTUATED';

export type InspectionDecision = 'ACCEPTED' | 'REJECTED';

export interface InspectionRecord {
  id: string;
  serial: string;
  partId?: string;
  batchId: string;
  partType: string;
  partName?: string;
  stationId: string;
  station?: string;
  scannerId: string;
  scannedAt: string;
  timestamp?: string;
  verdict: 'GOOD' | 'NOT_GOOD';
  decision?: InspectionDecision;
  defects: (DefectMeasurement | DefectItem)[];
  inferenceDurationMs?: number;
  totalCycleTimeMs?: number;
  actuatorTriggered?: boolean;
  status?: SystemStatus;
  operatorActionRequired?: boolean;
  operatorActionText?: string;
  surfaceAreaInspectedMm2?: number;
}

export interface LiveInspectionState {
  currentPhase: InspectionEnginePhase;
  phaseProgressPct: number;
  lineStatus: SystemStatus;
  cameraStatus: SystemStatus;
  aiStatus: SystemStatus;
  actuatorStatus: SystemStatus;
  currentPart: InspectionRecord | null;
  fps: number;
  inferenceTimeMs: number;
  resolution: string;
  cameraName: string;
  stationName: string;
  selectedDefectId?: string;
  isInspecting: boolean;
}

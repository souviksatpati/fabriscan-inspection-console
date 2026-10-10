import { InspectionRecord, LiveInspectionState } from './inspection';
import { CameraDevice } from './camera';
import { SystemAlert } from './alert';
import { ProductionShiftSummary } from './production';

export interface WebSocketEventMap {
  inspection: InspectionRecord;
  camera: CameraDevice;
  rejection: {
    partId: string;
    decision: 'REJECTED';
    actuatorFired: boolean;
    quarantineBay: string;
    timestamp: string;
  };
  alert: SystemAlert;
  metrics: ProductionShiftSummary;
  state_change: LiveInspectionState;
}

export type WebSocketEventName = keyof WebSocketEventMap;

export type WebSocketListener<T extends WebSocketEventName> = (data: WebSocketEventMap[T]) => void;

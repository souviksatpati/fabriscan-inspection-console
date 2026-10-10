import { SystemStatus, StatusMeta } from '../types/status';

export const STATUS_CONFIG: Record<SystemStatus, StatusMeta> = {
  RUNNING: {
    label: 'RUNNING',
    tone: 'success',
    borderStyle: 'solid',
    pulse: true,
    iconName: 'play',
    description: 'System actively inspecting continuous line throughput',
  },
  READY: {
    label: 'READY',
    tone: 'success',
    borderStyle: 'solid',
    pulse: false,
    iconName: 'check',
    description: 'Line standby, sensors synchronized, awaiting part entry',
  },
  ACCEPTED: {
    label: 'ACCEPTED',
    tone: 'success',
    borderStyle: 'solid',
    pulse: false,
    iconName: 'check',
    description: 'Quality verification passed within tolerance parameters',
  },
  INITIALIZING: {
    label: 'INITIALIZING',
    tone: 'blue',
    borderStyle: 'dashed',
    pulse: true,
    iconName: 'refresh',
    description: 'Loading model weights and initializing optical sensors',
  },
  RECONNECTING: {
    label: 'RECONNECTING',
    tone: 'blue',
    borderStyle: 'dashed',
    pulse: true,
    iconName: 'refresh',
    description: 'Re-establishing edge PLC and sensor telemetry bridge',
  },
  WARNING: {
    label: 'WARNING',
    tone: 'warning',
    borderStyle: 'solid',
    pulse: false,
    iconName: 'alert-triangle',
    description: 'Minor variance detected or lighting threshold drift',
  },
  DEGRADED: {
    label: 'DEGRADED',
    tone: 'warning',
    borderStyle: 'solid',
    pulse: false,
    iconName: 'alert-triangle',
    description: 'Inference latency degraded or single lens occluded',
  },
  CRITICAL: {
    label: 'CRITICAL',
    tone: 'critical',
    borderStyle: 'thick',
    pulse: true,
    iconName: 'alert-octagon',
    description: 'Safety interlock triggered or structural line failure',
  },
  REJECTED: {
    label: 'REJECTED',
    tone: 'critical',
    borderStyle: 'thick',
    pulse: true,
    iconName: 'alert-octagon',
    description: 'Out-of-spec defect identified; pneumatic diverter engaged',
  },
  ACTUATED: {
    label: 'ACTUATED',
    tone: 'critical',
    borderStyle: 'thick',
    pulse: true,
    iconName: 'alert-octagon',
    description: 'Solenoid reject ram fired to quarantine defect bin',
  },
  STOPPED: {
    label: 'STOPPED',
    tone: 'muted',
    borderStyle: 'dotted',
    pulse: false,
    iconName: 'square',
    description: 'Inspection line paused by supervisor or E-stop',
  },
  DISCONNECTED: {
    label: 'DISCONNECTED',
    tone: 'muted',
    borderStyle: 'dotted',
    pulse: false,
    iconName: 'wifi-off',
    description: 'Camera optical feed or edge unit offline',
  },
};

export function getStatusMeta(status: SystemStatus): StatusMeta {
  return STATUS_CONFIG[status] || STATUS_CONFIG.WARNING;
}

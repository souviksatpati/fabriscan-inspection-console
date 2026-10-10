export type SystemStatus =
  | 'RUNNING'
  | 'READY'
  | 'INITIALIZING'
  | 'WARNING'
  | 'DEGRADED'
  | 'CRITICAL'
  | 'REJECTED'
  | 'ACCEPTED'
  | 'ACTUATED'
  | 'STOPPED'
  | 'DISCONNECTED'
  | 'RECONNECTING';

export type StatusTone = 'success' | 'blue' | 'warning' | 'critical' | 'muted';

export type StatusBorderStyle = 'solid' | 'dashed' | 'thick' | 'dotted';

export interface StatusMeta {
  label: SystemStatus;
  tone: StatusTone;
  borderStyle: StatusBorderStyle;
  pulse: boolean;
  iconName: 'play' | 'check' | 'refresh' | 'alert-triangle' | 'alert-octagon' | 'square' | 'wifi-off';
  description: string;
}

import { SystemStatus } from './status';

export interface SystemAlert {
  id: string;
  code: string;
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  status: SystemStatus;
  category: 'CAMERA' | 'AI_MODEL' | 'ACTUATOR' | 'LINE_SAFETY' | 'COMMUNICATION';
  message: string;
  station: string;
  timestamp: string;
  acknowledged: boolean;
  actionRequired?: string;
}

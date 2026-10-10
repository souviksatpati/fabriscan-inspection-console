import { SystemStatus } from './status';

export interface CameraDevice {
  id: string;
  name: string;
  station: string;
  ip: string;
  fps: number;
  targetFps: number;
  resolution: string;
  exposureMs: number;
  gainDb: number;
  status: SystemStatus;
  temperatureC: number;
  packetLossPct: number;
  lensType: string;
  lastPingMs: number;
}

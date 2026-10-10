export type CameraConnectionStatus =
  | 'INITIALIZING'
  | 'PERMISSION_REQUIRED'
  | 'READY'
  | 'DISCONNECTED'
  | 'NO_CAMERA'
  | 'IN_USE'
  | 'STOPPED';

export type AIModelStatus =
  | 'READY'
  | 'NOT_CONNECTED';

class CameraStateService {
  private cameraStatus: CameraConnectionStatus = 'STOPPED';
  private aiStatus: AIModelStatus = 'NOT_CONNECTED';
  private cameraLabel: string = 'No camera active';
  private listeners: Set<() => void> = new Set();

  getStatus(): CameraConnectionStatus {
    return this.cameraStatus;
  }

  getAIStatus(): AIModelStatus {
    return this.aiStatus;
  }

  getCameraLabel(): string {
    return this.cameraLabel;
  }

  setCameraStatus(status: CameraConnectionStatus, label?: string): void {
    this.cameraStatus = status;
    if (label !== undefined) this.cameraLabel = label;
    this.notify();
  }

  setAIStatus(status: AIModelStatus): void {
    this.aiStatus = status;
    this.notify();
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(): void {
    this.listeners.forEach((l) => l());
  }
}

export const cameraStateService = new CameraStateService();

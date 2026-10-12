import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Camera,
  CameraOff,
  VideoOff,
  Play,
  Square,
  Maximize2,
  Minimize2,
  Layers,
  Loader2,
  ShieldAlert,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cameraStateService, CameraConnectionStatus } from '@/services/cameraState';
import { InspectionRecord } from '@/services/inspectionStore';

interface CameraViewportProps {
  inspection?: InspectionRecord | null;
  onSnapshot?: (imageDataUrl: string) => void;
  className?: string;
}

export const CameraViewport: React.FC<CameraViewportProps> = ({
  inspection,
  onSnapshot,
  className,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [cameraState, setCameraState] = useState<CameraConnectionStatus>('STOPPED');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');
  const [showOverlay, setShowOverlay] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Update central cameraStateService whenever local cameraState changes
  const updateCameraStatus = useCallback((status: CameraConnectionStatus, label?: string) => {
    setCameraState(status);
    cameraStateService.setCameraStatus(status, label);
  }, []);

  // Stop camera tracks and release hardware
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch {
          // ignore
        }
      });
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    updateCameraStatus('STOPPED', 'No camera active');
  }, [updateCameraStatus]);

  // Enumerate video devices
  const refreshDevices = useCallback(async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
      return;
    }
    try {
      const allDevices = await navigator.mediaDevices.enumerateDevices();
      const videoInputs = allDevices.filter((d) => d.kind === 'videoinput');
      setDevices(videoInputs);
      if (videoInputs.length > 0 && !selectedDeviceId) {
        setSelectedDeviceId(videoInputs[0].deviceId);
      }
    } catch {
      // Device enumeration not allowed yet
    }
  }, [selectedDeviceId]);

  // Start camera stream
  const startCamera = useCallback(async (preferredDeviceId?: string) => {
    stopCamera();
    setErrorMessage(null);
    updateCameraStatus('INITIALIZING');

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      updateCameraStatus('NO_CAMERA');
      setErrorMessage('MediaDevices API is not supported in this browser environment. Ensure HTTPS or localhost.');
      return;
    }

    try {
      const deviceIdToUse = preferredDeviceId || selectedDeviceId;
      const constraints: MediaStreamConstraints = {
        video: deviceIdToUse
          ? { deviceId: { exact: deviceIdToUse } }
          : {
              facingMode: { ideal: 'environment' }, // Prefer rear camera on mobile
              width: { ideal: 1280 },
              height: { ideal: 720 },
            },
        audio: false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play().catch(() => {});
        };
      }

      // Determine active device label
      const activeTrack = stream.getVideoTracks()[0];
      const activeLabel = activeTrack?.label || 'USB/GigE Vision Sensor';
      updateCameraStatus('READY', activeLabel);

      // Refresh devices to get friendly labels once permission is granted
      refreshDevices();
    } catch (err: unknown) {
      const error = err as Error;
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        updateCameraStatus('PERMISSION_REQUIRED');
        setErrorMessage('Camera access permission was denied. Please allow camera access in browser.');
      } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
        updateCameraStatus('NO_CAMERA');
        setErrorMessage('No camera device found on this system.');
      } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
        updateCameraStatus('IN_USE');
        setErrorMessage('Camera is currently in use by another application or tab.');
      } else {
        updateCameraStatus('DISCONNECTED');
        setErrorMessage(error.message || 'Failed to initialize camera.');
      }
    }
  }, [selectedDeviceId, stopCamera, updateCameraStatus, refreshDevices]);

  // Initial device check
  useEffect(() => {
    refreshDevices();
    return () => {
      stopCamera();
    };
  }, [refreshDevices, stopCamera]);

  // Handle device change
  const handleDeviceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newId = e.target.value;
    setSelectedDeviceId(newId);
    if (cameraState === 'READY') {
      startCamera(newId);
    }
  };

  // Snapshot capture
  const handleCaptureSnapshot = () => {
    const video = videoRef.current;
    if (!video) return;

    const snapCanvas = document.createElement('canvas');
    snapCanvas.width = video.videoWidth || 1280;
    snapCanvas.height = video.videoHeight || 720;
    const ctx = snapCanvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, snapCanvas.width, snapCanvas.height);
    const dataUrl = snapCanvas.toDataURL('image/jpeg', 0.92);

    if (onSnapshot) {
      onSnapshot(dataUrl);
    }
  };

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  // Canvas HUD overlay drawing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    if (!showOverlay || cameraState !== 'READY') return;

    const rootFs = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
    const fsScale = rootFs / 16;

    // 1. Technical Crosshair & Corner Reticles
    ctx.strokeStyle = '#1D4ED8';
    ctx.lineWidth = Math.max(1, Math.round(1 * fsScale));
    ctx.setLineDash([Math.round(6 * fsScale), Math.round(6 * fsScale)]);

    // Center Cross
    const cx = width / 2;
    const cy = height / 2;
    const crossSize = Math.round(30 * fsScale);
    ctx.beginPath();
    ctx.moveTo(cx - crossSize, cy);
    ctx.lineTo(cx + crossSize, cy);
    ctx.moveTo(cx, cy - crossSize);
    ctx.lineTo(cx, cy + crossSize);
    ctx.stroke();

    // 2. Framing Guide Box
    ctx.setLineDash([]);
    ctx.strokeStyle = 'rgba(29, 78, 216, 0.4)';
    ctx.lineWidth = Math.max(1, 1.5 * fsScale);
    const pad = Math.round(40 * fsScale);
    ctx.strokeRect(pad, pad, width - pad * 2, height - pad * 2);

    // 3. Draw Defect Bounding Boxes if active inspection has defects
    if (inspection && inspection.defects && inspection.defects.length > 0) {
      inspection.defects.forEach((defect, idx) => {
        const bbox = defect.bbox || {
          x: 0.3 + idx * 0.1,
          y: 0.35 + idx * 0.08,
          width: 0.25,
          height: 0.18,
        };

        const rx = bbox.x * width;
        const ry = bbox.y * height;
        const rw = bbox.width * width;
        const rh = bbox.height * height;

        // Box border
        ctx.strokeStyle = '#DC2626';
        ctx.lineWidth = Math.max(1, 2 * fsScale);
        ctx.strokeRect(rx, ry, rw, rh);

        // Box fill tint
        ctx.fillStyle = 'rgba(220, 38, 38, 0.15)';
        ctx.fillRect(rx, ry, rw, rh);

        // Label tag
        const tagHeight = Math.round(18 * fsScale);
        const fontPx = Math.round(10 * fsScale);
        ctx.fillStyle = '#DC2626';
        ctx.fillRect(rx, ry - tagHeight, Math.max(80 * fsScale, rw), tagHeight);
        ctx.fillStyle = '#FFFFFF';
        ctx.font = `bold ${fontPx}px monospace`;
        ctx.fillText(
          `${defect.class.toUpperCase()} (${(defect.confidence * 100).toFixed(0)}%)`,
          rx + Math.round(4 * fsScale),
          ry - Math.round(5 * fsScale)
        );
      });
    }
  }, [showOverlay, cameraState, inspection]);

  // Keep canvas resolution synced to container
  useEffect(() => {
    const handleResize = () => {
      const container = containerRef.current;
      const canvas = canvasRef.current;
      if (container && canvas) {
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full bg-[#0F172A] rounded-[4px] overflow-hidden flex flex-col justify-between select-none ${
        className || ''
      }`}
    >
      {/* Layer 1: HTML5 Video Stream */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          cameraState === 'READY' ? 'opacity-100' : 'opacity-0 absolute'
        }`}
      />

      {/* Layer 2: Canvas HUD Overlay */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
      />

      {/* Layer 3: Camera State Machine Display (When camera not actively rendering) */}
      {cameraState !== 'READY' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-15 bg-[#F8FAFC] text-[#0F172A]">
          {cameraState === 'INITIALIZING' && (
            <div className="flex flex-col items-center gap-3">
              <Loader2 size={36} className="text-[#1D4ED8] animate-spin" />
              <div className="text-sm font-bold font-mono tracking-wider text-[#0F172A]">
                INITIALIZING CAMERA
              </div>
              <p className="text-xs text-[#64748B]">Querying video capture device and configuring lens parameters...</p>
            </div>
          )}

          {cameraState === 'PERMISSION_REQUIRED' && (
            <div className="flex flex-col items-center gap-3 max-w-sm">
              <ShieldAlert size={40} className="text-[#D97706]" />
              <div className="text-sm font-bold font-mono tracking-wider text-[#0F172A]">
                PERMISSION REQUIRED
              </div>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Browser camera permissions are required to display the optical stream.
              </p>
              <Button
                variant="default"
                size="sm"
                onClick={() => startCamera()}
                className="mt-2 text-xs font-semibold gap-1.5"
              >
                <Camera size={14} />
                <span>Allow Camera Access</span>
              </Button>
            </div>
          )}

          {cameraState === 'DISCONNECTED' && (
            <div className="flex flex-col items-center gap-3 max-w-sm">
              <VideoOff size={38} className="text-[#DC2626]" />
              <div className="text-sm font-bold font-mono tracking-wider text-[#0F172A]">
                CAMERA DISCONNECTED
              </div>
              <p className="text-xs text-[#64748B] leading-relaxed">
                {errorMessage || 'Optical sensor bridge lost connection. Re-synchronize device.'}
              </p>
              <Button
                variant="default"
                size="sm"
                onClick={() => startCamera()}
                className="mt-2 text-xs font-semibold gap-1.5"
              >
                <RotateCcw size={14} />
                <span>RECONNECT CAMERA</span>
              </Button>
            </div>
          )}

          {cameraState === 'NO_CAMERA' && (
            <div className="flex flex-col items-center gap-3 max-w-sm">
              <CameraOff size={38} className="text-[#64748B]" />
              <div className="text-sm font-bold font-mono tracking-wider text-[#0F172A]">
                NO CAMERA FOUND
              </div>
              <p className="text-xs text-[#64748B] leading-relaxed">
                No compatible video input device detected. Connect a USB web camera or industrial vision sensor.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={refreshDevices}
                className="mt-2 text-xs font-semibold"
              >
                Refresh Devices
              </Button>
            </div>
          )}

          {cameraState === 'IN_USE' && (
            <div className="flex flex-col items-center gap-3 max-w-sm">
              <AlertTriangle size={38} className="text-[#D97706]" />
              <div className="text-sm font-bold font-mono tracking-wider text-[#0F172A]">
                CAMERA IN USE
              </div>
              <p className="text-xs text-[#64748B] leading-relaxed">
                The optical sensor is currently occupied by another desktop program or browser tab.
              </p>
              <Button
                variant="default"
                size="sm"
                onClick={() => startCamera()}
                className="mt-2 text-xs font-semibold"
              >
                Retry Stream
              </Button>
            </div>
          )}

          {cameraState === 'STOPPED' && (
            <div className="flex flex-col items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-white border border-[#D9DEE5] flex items-center justify-center text-[#1D4ED8] shadow-sm">
                <Camera size={26} />
              </div>
              <div className="text-sm font-bold font-mono tracking-wider text-[#0F172A]">
                CAMERA READY (STANDBY)
              </div>
              <p className="text-xs text-[#64748B] max-w-xs">
                Activate real-time camera inspection on this station to stream panel throughput.
              </p>
              <Button
                variant="default"
                size="sm"
                onClick={() => startCamera()}
                className="mt-2 text-xs font-semibold gap-1.5"
              >
                <Play size={14} />
                <span>Start Camera</span>
              </Button>
            </div>
          )}

          {/* HTTPS / Localhost Requirement Notice */}
          <div className="absolute bottom-4 text-[10px] text-[#94A3B8] font-mono">
            Note: HTTPS or localhost is required for web browser camera access.
          </div>
        </div>
      )}

      {/* Layer 4: Overlay Controls Bar (Top & Bottom) */}
      <div className="relative z-20 flex items-center justify-between p-3 bg-gradient-to-b from-black/70 to-transparent text-white">
        {/* Device Selector */}
        <div className="flex items-center gap-2">
          <select
            value={selectedDeviceId}
            onChange={handleDeviceChange}
            className="bg-black/60 border border-white/20 text-white text-[11px] font-sans px-2.5 py-1 rounded-[3px] focus:outline-none focus:ring-1 focus:ring-[#1D4ED8] max-w-[180px] sm:max-w-[240px] truncate"
          >
            {devices.length === 0 ? (
              <option value="">Default Vision Sensor</option>
            ) : (
              devices.map((d, i) => (
                <option key={d.deviceId || i} value={d.deviceId}>
                  {d.label || `Camera ${i + 1}`}
                </option>
              ))
            )}
          </select>

          {cameraState === 'READY' && (
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-[2px] bg-[#15803D]/80 border border-[#86EFAC]/40 text-[9px] font-mono text-white font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#86EFAC] animate-pulse" />
              <span>LIVE</span>
            </span>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5">
          {cameraState === 'READY' ? (
            <Button
              variant="outline"
              size="sm"
              onClick={stopCamera}
              className="h-7 text-xs gap-1 bg-black/60 border-white/20 text-white hover:bg-black/80 hover:text-white"
            >
              <Square size={12} className="text-[#DC2626] fill-[#DC2626]" />
              <span className="hidden sm:inline">Stop</span>
            </Button>
          ) : (
            <Button
              variant="default"
              size="sm"
              onClick={() => startCamera()}
              className="h-7 text-xs gap-1"
            >
              <Play size={12} />
              <span className="hidden sm:inline">Start</span>
            </Button>
          )}

          {cameraState === 'READY' && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleCaptureSnapshot}
              className="h-7 text-xs gap-1 bg-black/60 border-white/20 text-white hover:bg-black/80 hover:text-white"
              title="Capture inspection snapshot"
            >
              <Camera size={12} />
              <span className="hidden sm:inline">Snapshot</span>
            </Button>
          )}

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowOverlay(!showOverlay)}
            className={`h-7 w-7 text-white hover:bg-white/10 ${
              showOverlay ? 'text-[#60A5FA]' : 'text-white/60'
            }`}
            title={showOverlay ? 'Hide HUD overlay' : 'Show HUD overlay'}
          >
            <Layers size={14} />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleFullscreen}
            className="h-7 w-7 text-white hover:bg-white/10"
            title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
          >
            {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </Button>
        </div>
      </div>

      {/* Bottom Bar: Telemetry Info overlay */}
      <div className="relative z-20 flex items-center justify-between p-2.5 bg-gradient-to-t from-black/80 to-transparent text-[11px] font-mono text-white/80">
        <div className="flex items-center gap-3">
          <span>RES: 1280×720</span>
          <span>FPS: {cameraState === 'READY' ? '30.0' : '0.0'}</span>
        </div>
        <div>
          <span>FACING: REAR/ENVIRONMENT</span>
        </div>
      </div>
    </div>
  );
};

export default CameraViewport;

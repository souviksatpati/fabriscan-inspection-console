import React, { useState } from 'react';
import { MOCK_CAMERAS } from '../../data/mock/mockCameras';
import { CameraDevice } from '../../types/camera';
import { StatusBadge } from '../../components/common/StatusBadge';
import { CornerBrackets } from '../../components/common/CornerBrackets';
import { Button } from '../../components/ui/button';
import { Camera, RefreshCw } from 'lucide-react';

export const Cameras: React.FC = () => {
  const [cameras, setCameras] = useState<CameraDevice[]>(MOCK_CAMERAS);
  const [reconnectingId, setReconnectingId] = useState<string | null>(null);

  const handleReconnect = (id: string) => {
    setReconnectingId(id);
    setTimeout(() => {
      setCameras((prev) =>
        prev.map((c) =>
          c.id === id
            ? {
                ...c,
                status: 'RUNNING',
                fps: 30.0,
                packetLossPct: 0.0,
                lastPingMs: 1.5,
              }
            : c
        )
      );
      setReconnectingId(null);
    }, 1200);
  };

  return (
    <div className="flex flex-col gap-6 font-sans select-none pb-12 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D9DEE5] pb-4">
        <div>
          <div className="flex items-center gap-2 font-sans text-xs text-[#1D4ED8]">
            <Camera size={14} />
            <span className="uppercase tracking-wider font-semibold">
              GIGE &amp; USB3 VISION SENSOR ARRAY
            </span>
            <span className="px-1.5 py-0.5 rounded-[2px] bg-[#F5F7FA] border border-[#D9DEE5] text-[10px] text-[#64748B] font-mono">
              Simulated data
            </span>
          </div>
          <h1 className="text-2xl font-bold text-[#0F172A] mt-1">Camera Sensor Grid</h1>
          <p className="text-xs text-[#475569] mt-1">
            Real-time optical frame acquisition status, exposure timings, sensor junction
            temperatures, and GigE heartbeat telemetry.
          </p>
        </div>

        <div className="font-mono text-xs text-[#475569] bg-[#F5F7FA] border border-[#D9DEE5] px-3 py-1.5 rounded-[3px] self-start sm:self-auto">
          CAMERAS ONLINE: <strong className="text-[#15803D]">4 / 5</strong>
        </div>
      </div>

      {/* Cameras Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {cameras.map((cam) => {
          const isReconnecting = reconnectingId === cam.id;
          const isDisconnected = cam.status === 'DISCONNECTED';

          return (
            <div
              key={cam.id}
              className={`bg-white border rounded-[4px] p-5 relative flex flex-col justify-between font-mono text-xs transition-colors shadow-[0_1px_2px_rgba(15,23,42,0.04)] ${
                isDisconnected ? 'border-[#D9DEE5] opacity-75' : 'border-[#D9DEE5]'
              }`}
            >
              <CornerBrackets size={6} color="border-[#1D4ED8]" />
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[#1D4ED8] font-bold font-mono">{cam.id}</span>
                    <span className="text-[#64748B]">·</span>
                    <span className="text-[#0F172A] font-semibold font-sans">{cam.name}</span>
                  </div>
                  <StatusBadge status={cam.status} size="sm" />
                </div>

                <div className="text-[11px] text-[#64748B] font-sans mb-4">{cam.station}</div>

                {/* Video Feed Placeholder Frame */}
                <div className="relative aspect-[16/9] w-full rounded-[3px] border border-[#D9DEE5] bg-[#05070B] flex flex-col items-center justify-center mb-4 overflow-hidden">
                  {isDisconnected ? (
                    <div className="text-center text-[#64748B] font-mono text-[11px]">
                      FEED DISCONNECTED
                    </div>
                  ) : (
                    <>
                      <div className="absolute inset-0 bg-tech-grid opacity-20" />
                      <div className="relative z-10 flex items-center gap-2 text-[#15803D] font-bold text-sm">
                        <span className="w-2 h-2 rounded-full bg-[#15803D] animate-pulse" />
                        {cam.fps.toFixed(1)} FPS
                      </div>
                      <span className="text-[10px] text-[#94A3B8] mt-1 font-mono">{cam.resolution}</span>
                    </>
                  )}
                </div>

                {/* Specs List */}
                <div className="space-y-1.5 text-[11px] text-[#64748B] bg-[#F5F7FA] border border-[#D9DEE5] p-3 rounded-[3px] mb-4">
                  <div className="flex justify-between">
                    <span>IP Address:</span>
                    <span className="text-[#0F172A] font-mono font-medium">{cam.ip}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Lens Model:</span>
                    <span className="text-[#0F172A] font-sans truncate max-w-[160px] font-medium">{cam.lensType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Exposure / Gain:</span>
                    <span className="text-[#0F172A] font-mono font-medium">{cam.exposureMs}ms / +{cam.gainDb}dB</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sensor Temp:</span>
                    <span
                      className={cam.temperatureC > 45 ? 'text-[#B45309] font-bold font-mono' : 'text-[#0F172A] font-mono font-medium'}
                    >
                      {cam.temperatureC}°C
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Packet Loss:</span>
                    <span
                      className={cam.packetLossPct > 0 ? 'text-[#B91C1C] font-bold font-mono' : 'text-[#15803D] font-bold font-mono'}
                    >
                      {cam.packetLossPct}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="pt-3 border-t border-[#D9DEE5]">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={isReconnecting}
                  onClick={() => handleReconnect(cam.id)}
                  className="w-full font-sans text-[11px] gap-1.5 bg-white border-[#D9DEE5] text-[#0F172A] hover:bg-[#F5F7FA]"
                >
                  <RefreshCw size={12} className={isReconnecting ? 'animate-spin' : ''} />
                  {isReconnecting ? 'Reconnecting Sensor...' : 'Ping / Re-synchronize Sensor'}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Cameras;

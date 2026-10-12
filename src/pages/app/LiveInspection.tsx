import React, { useState, useEffect, useMemo } from 'react';
import { CameraViewport } from '@/components/features/inspection/CameraViewport';
import { CurrentPartTelemetry } from '@/components/features/inspection/CurrentPartTelemetry';
import { MetricsBar } from '@/components/features/inspection/MetricsBar';
import { RecentInspections } from '@/components/features/inspection/RecentInspections';
import { AlertsPanel } from '@/components/features/inspection/AlertsPanel';
import { StartBatchDialog } from '@/components/features/inspection/StartBatchDialog';
import { ExportReportDropdown } from '../../components/common/ExportReportDropdown';
import { useInspectionStream } from '../../hooks/useInspectionStream';
import { useRole } from '../../hooks/useRole';
import { cameraStateService, CameraConnectionStatus, AIModelStatus } from '../../services/cameraState';
import { batchService, BatchConfig } from '../../services/batchService';
import { InspectionRecord } from '../../services/inspectionStore';
import { formatKolkataDateTime, ReportMetadata } from '../../services/reportExport';
import { Button } from '../../components/ui/button';
import { Cpu, Video, ArrowLeft } from 'lucide-react';

export const LiveInspection: React.FC = () => {
  const {
    recentInspections,
    metrics,
    alerts,
    acknowledgeAlert,
  } = useInspectionStream();

  const { user } = useRole();

  const [activeBatch, setActiveBatch] = useState<BatchConfig>(batchService.getConfig());
  const [selectedRecordOverride, setSelectedRecordOverride] = useState<InspectionRecord | null>(null);
  const [cameraStatus, setCameraStatus] = useState<CameraConnectionStatus>(cameraStateService.getStatus());
  const [cameraLabel, setCameraLabel] = useState<string>(cameraStateService.getCameraLabel());
  const [aiStatus, setAiStatus] = useState<AIModelStatus>(cameraStateService.getAIStatus());

  // Subscribe to real hardware & AI model states
  useEffect(() => {
    const updateFromCamera = () => {
      setCameraStatus(cameraStateService.getStatus());
      setCameraLabel(cameraStateService.getCameraLabel());
      setAiStatus(cameraStateService.getAIStatus());
    };
    const unsubCamera = cameraStateService.subscribe(updateFromCamera);
    const unsubBatch = batchService.subscribe(() => {
      setActiveBatch(batchService.getConfig());
    });

    return () => {
      unsubCamera();
      unsubBatch();
    };
  }, []);

  // Current displayed inspection
  const activeRecord = selectedRecordOverride || (recentInspections.length > 0 ? recentInspections[0] : null);

  const handleBatchStarted = (config: BatchConfig) => {
    setActiveBatch(config);
    setSelectedRecordOverride(null);
  };

  // Build metadata for export
  const exportMeta: ReportMetadata = useMemo(() => {
    return {
      station: activeBatch.station || 'Stamping Press Line 04 · Bay B',
      period: `Batch: ${activeBatch.batchId} (Live inspection)`,
      filters: `Batch ${activeBatch.batchId}`,
      generatedBy: {
        fullName: user?.fullName || user?.name || 'QC Inspector',
        userId: user?.userId || user?.id || 'usr-001',
        role: user?.role || 'QC_INSPECTOR',
      },
      generatedAt: formatKolkataDateTime(),
    };
  }, [activeBatch, user]);

  return (
    <div className="flex flex-col gap-4 font-sans select-none pb-8">
      {/* 1. Header Bar: Stream Identifier, Batch Info & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white border border-[#D9DEE5] px-4 py-2.5 rounded-[0.25rem] shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
        <div className="flex flex-wrap items-center gap-2.5">
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              cameraStatus === 'READY' ? 'bg-[#15803D] animate-pulse' : 'bg-[#64748B]'
            }`}
          />
          <h2 className="text-[#0F172A] font-bold tracking-wider text-sm font-sans uppercase">
            {selectedRecordOverride ? `INSPECTION REVIEW: ${selectedRecordOverride.serial}` : 'CAMERA STREAM'}
          </h2>

          <div className="flex items-center gap-1.5 ml-2">
            <span className="px-2 py-0.5 rounded-[0.1875rem] bg-[#F5F7FA] border border-[#D9DEE5] text-[0.6875rem] text-[#475569] font-mono">
              BATCH: <strong className="text-[#0F172A]">{activeBatch.batchId}</strong>
            </span>
            <span className="px-2 py-0.5 rounded-[0.1875rem] bg-[#F5F7FA] border border-[#D9DEE5] text-[0.6875rem] text-[#475569] font-mono">
              STATION: <strong className="text-[#0F172A]">{activeBatch.station}</strong>
            </span>
          </div>

          {selectedRecordOverride && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedRecordOverride(null)}
              className="h-7 px-2.5 text-xs text-[#1D4ED8] hover:text-[#1E40AF] gap-1"
            >
              <ArrowLeft size={12} />
              Return to Live Feed
            </Button>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* AI Model State Indicator */}
          <div
            className={`flex items-center gap-1 px-2.5 py-1 rounded-[0.1875rem] border text-xs font-mono font-medium ${
              aiStatus === 'READY'
                ? 'bg-[#F0FDF4] border-[#BBF7D0] text-[#15803D]'
                : 'bg-[#FFFBEB] border-[#FDE68A] text-[#B45309]'
            }`}
            title="Real AI segmentation inference model connection"
          >
            <Cpu size={13} />
            <span>AI MODEL: {aiStatus === 'READY' ? 'READY' : 'NOT CONNECTED'}</span>
          </div>

          {/* Camera Status Chip */}
          <div
            className={`hidden sm:flex items-center gap-1 px-2 py-1 rounded-[0.1875rem] border text-xs font-mono ${
              cameraStatus === 'READY'
                ? 'bg-[#F0FDF4] border-[#BBF7D0] text-[#15803D]'
                : 'bg-[#F5F7FA] border-[#D9DEE5] text-[#64748B]'
            }`}
          >
            <Video size={13} />
            <span>CAMERA: {cameraStatus}</span>
          </div>

          <StartBatchDialog onBatchStarted={handleBatchStarted} />

          {/* Export Report Dropdown (Excel / PDF) */}
          <ExportReportDropdown data={recentInspections} meta={exportMeta} />
        </div>
      </div>

      {/* 2. Main Live Inspection Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Real Optical Camera Viewport */}
        <div className="lg:col-span-8 flex flex-col gap-3">
          <div className="h-[27.5rem] sm:h-[31.25rem] w-full rounded-[0.25rem] overflow-hidden border border-[#D9DEE5]">
            <CameraViewport
              inspection={activeRecord}
              onSnapshot={(dataUrl) => {
                console.log('Camera snapshot captured:', dataUrl.slice(0, 40));
              }}
            />
          </div>
        </div>

        {/* Right Column: CURRENT PART TELEMETRY Panel */}
        <div className="lg:col-span-4 flex flex-col">
          <CurrentPartTelemetry
            inspection={activeRecord}
            scannerName={cameraLabel}
          />
        </div>
      </div>

      {/* 3. Metric Strip Computed from inspectionStore */}
      <MetricsBar metrics={metrics} />

      {/* 4. Bottom Feed & Alerts computed from inspectionStore */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-8">
          <RecentInspections
            inspections={recentInspections}
            activeId={activeRecord?.id}
            onSelectInspection={(record) => setSelectedRecordOverride(record)}
          />
        </div>

        <div className="lg:col-span-4">
          <AlertsPanel alerts={alerts} onAcknowledge={acknowledgeAlert} />
        </div>
      </div>
    </div>
  );
};

export default LiveInspection;

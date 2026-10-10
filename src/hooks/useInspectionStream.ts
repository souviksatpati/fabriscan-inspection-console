import { useState, useEffect, useCallback } from 'react';
import { queryInspections, subscribe, computeMetrics, InspectionRecord, InspectionMetrics } from '../services/inspectionStore';
import { LiveInspectionState } from '../types/inspection';
import { SystemAlert } from '../types/alert';
import { cameraStateService } from '../services/cameraState';
import { batchService } from '../services/batchService';

export function useInspectionStream() {
  const [recentInspections, setRecentInspections] = useState<InspectionRecord[]>([]);
  const [metrics, setMetrics] = useState<InspectionMetrics>({
    inspected: 0,
    good: 0,
    rejected: 0,
    firstTimeRightPct: 100,
    partsPerMillionDefective: 0,
  });
  const [alerts, setAlerts] = useState<SystemAlert[]>([]);
  const [selectedDefectId, setSelectedDefectId] = useState<string | undefined>(undefined);
  const [isInspecting, setIsInspecting] = useState(false);

  const loadData = useCallback(async () => {
    const records = await queryInspections({ limit: 25 });
    setRecentInspections(records);
    const computed = computeMetrics(records);
    setMetrics(computed);
  }, []);

  useEffect(() => {
    loadData();
    const unsubscribeStore = subscribe(() => {
      loadData();
    });
    return unsubscribeStore;
  }, [loadData]);

  const activeBatch = batchService.getConfig();
  const cameraStatus = cameraStateService.getStatus();
  const aiStatus = cameraStateService.getAIStatus();

  const currentPart = recentInspections[0] || null;

  const state: LiveInspectionState = {
    currentPhase: currentPart ? (currentPart.verdict === 'GOOD' ? 'ACCEPTED' : 'REJECTED') : 'SCANNING',
    phaseProgressPct: currentPart ? 100 : 0,
    lineStatus: isInspecting ? 'RUNNING' : 'READY',
    cameraStatus: cameraStatus === 'READY' ? 'RUNNING' : cameraStatus === 'DISCONNECTED' ? 'DISCONNECTED' : 'READY',
    aiStatus: aiStatus === 'READY' ? 'RUNNING' : 'DISCONNECTED',
    actuatorStatus: currentPart && currentPart.verdict === 'NOT_GOOD' ? 'ACTUATED' : 'READY',
    currentPart,
    fps: cameraStatus === 'READY' ? 30.0 : 0,
    inferenceTimeMs: aiStatus === 'READY' ? 28.0 : 0,
    resolution: '1280×720',
    cameraName: cameraStateService.getCameraLabel() || 'Camera 01',
    stationName: activeBatch.station,
    selectedDefectId,
    isInspecting,
  };

  const toggleEngine = useCallback(() => {
    setIsInspecting((prev) => !prev);
  }, []);

  const selectDefect = useCallback((defectId?: string) => {
    setSelectedDefectId(defectId);
  }, []);

  const acknowledgeAlert = useCallback((alertId: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, acknowledged: true } : a))
    );
  }, []);

  return {
    state,
    recentInspections,
    metrics,
    alerts,
    selectedDefectId,
    toggleEngine,
    selectDefect,
    acknowledgeAlert,
    refresh: loadData,
  };
}

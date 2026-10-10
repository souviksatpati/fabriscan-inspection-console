/**
 * Active Batch & Session Coordinator
 * Manages production batch configuration set by operators via the "Start Batch" dialog.
 */

export interface BatchConfig {
  batchId: string;
  partType: string;
  station: string;
  startedAt: string;
}

const BATCH_STORAGE_KEY = 'fabriscan_active_batch';

const DEFAULT_BATCH: BatchConfig = {
  batchId: 'BATCH-2026-10-A',
  partType: 'Swift Outer Door Skin (Front LH)',
  station: 'Stamping Press 04 · Bay B',
  startedAt: new Date().toISOString(),
};

export const PART_TYPES: string[] = [
  'Swift Outer Door Skin (Front LH)',
  'Swift Outer Door Skin (Front RH)',
  'Brezza Rear Quarter Panel RH',
  'Grand Vitara Hood Outer Sub-Assembly',
  'Dzire High-Tensile A-Pillar Inner',
  'Jimny Tailgate Outer Stamping',
];

export const STATIONS: string[] = [
  'Stamping Press 04 · Bay B',
  'Press Line 04 · Draw Station 02',
  'Press Line 04 · Piercing & Trim',
  'Body-in-White Sub-Assembly Bay 01',
];

class BatchService {
  private config: BatchConfig;
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.config = this.loadConfig();
  }

  private loadConfig(): BatchConfig {
    try {
      const stored = localStorage.getItem(BATCH_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch {
      // Local storage unavailable
    }
    return DEFAULT_BATCH;
  }

  getConfig(): BatchConfig {
    return { ...this.config };
  }

  setBatch(newConfig: Partial<BatchConfig>): BatchConfig {
    this.config = {
      ...this.config,
      ...newConfig,
      startedAt: newConfig.batchId !== this.config.batchId ? new Date().toISOString() : this.config.startedAt,
    };
    try {
      localStorage.setItem(BATCH_STORAGE_KEY, JSON.stringify(this.config));
    } catch {
      // ignore
    }
    this.notify();
    return this.config;
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

export const batchService = new BatchService();

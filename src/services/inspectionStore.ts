/**
 * Maruti FabriScan — Persistent Inspection Store (IndexedDB)
 * 
 * Production-grade client storage layer for all optical inspection records.
 * Provides the single entry point `recordInspection()` for edge ML models
 * and cameras to submit real-time inspection verdicts.
 * 
 * Timezone: Asia/Kolkata (IST, UTC+05:30)
 */

export interface DefectBBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export type DefectClass =
  | 'Scratches'
  | 'Rolled-in Scale'
  | 'Inclusions'
  | 'Crazing'
  | 'Pitted Surface'
  | 'Patches';

export type DefectSeverity = 'CRITICAL' | 'MAJOR' | 'MODERATE' | 'MINOR';
export type InspectionVerdict = 'GOOD' | 'NOT_GOOD';

export interface DefectItem {
  class: string;
  confidence: number;
  areaMm2: number;
  severity: DefectSeverity;
  bbox?: DefectBBox;
}

export interface InspectionRecord {
  id: string;
  serial: string;
  batchId: string;
  partType: string;
  stationId: string;
  scannerId: string;
  scannedAt: string; // ISO-8601 string e.g. "2026-10-10T02:45:12.345Z"
  verdict: InspectionVerdict;
  defects: DefectItem[];
  reviewedBy?: string;
  notes?: string;
}

export interface InspectionFilter {
  search?: string;
  batchId?: string;
  verdict?: 'GOOD' | 'NOT_GOOD' | 'ALL';
  scannerId?: string;
  stationId?: string;
  partType?: string;
  defectClass?: string;
  severity?: string;
  startDate?: string;
  endDate?: string;
  year?: number;
  month?: number; // 1-12
  day?: number;   // 1-31
  limit?: number;
  offset?: number;
  sortBy?: 'scannedAt' | 'serial' | 'area';
  sortDirection?: 'asc' | 'desc';
}

export interface InspectionMetrics {
  inspected: number;
  good: number;
  rejected: number;
  firstTimeRightPct: number;
  partsPerMillionDefective: number;
}

const DB_NAME = 'maruti_fabriscan_inspections_db';
const DB_VERSION = 1;
const STORE_NAME = 'inspections';

// In-memory subscriber registry
const subscribers = new Set<() => void>();

function notifySubscribers() {
  subscribers.forEach((callback) => {
    try {
      callback();
    } catch {
      // subscriber error ignored
    }
  });
}

/**
 * Open or upgrade the IndexedDB database instance.
 */
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB is not supported in this environment.'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('serial', 'serial', { unique: false });
        store.createIndex('batchId', 'batchId', { unique: false });
        store.createIndex('scannedAt', 'scannedAt', { unique: false });
        store.createIndex('verdict', 'verdict', { unique: false });
        store.createIndex('scannerId', 'scannerId', { unique: false });
        store.createIndex('partType', 'partType', { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Convert ISO timestamp to Asia/Kolkata date components.
 */
export function getKolkataDateParts(isoString: string): {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
  dateKey: string; // YYYY-MM-DD
} {
  const d = new Date(isoString);
  const formatter = new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false,
  });

  const parts = formatter.formatToParts(d);
  const map: Record<string, number> = {};
  for (const part of parts) {
    if (part.type !== 'literal') {
      map[part.type] = parseInt(part.value, 10);
    }
  }

  const year = map.year || d.getUTCFullYear();
  const month = map.month || (d.getUTCMonth() + 1);
  const day = map.day || d.getUTCDate();
  const hour = map.hour ?? d.getUTCHours();
  const minute = map.minute ?? d.getUTCMinutes();
  const second = map.second ?? d.getUTCSeconds();

  const pad = (n: number) => n.toString().padStart(2, '0');
  const dateKey = `${year}-${pad(month)}-${pad(day)}`;

  return { year, month, day, hour, minute, second, dateKey };
}

export const getAsiaKolkataDateParts = getKolkataDateParts;

/**
 * =========================================================================
 * SINGLE ENTRY POINT FOR MACHINE LEARNING INFERENCE MODELS & EDGE SENSORS
 * =========================================================================
 * 
 * Edge computer vision daemons (YOLOv8-Seg TensorRT, RTSP frame grabbers,
 * or user live cameras) call this exact function to log each completed inspection.
 *
 * @param record - Complete or partial record to register. If `id` is omitted,
 * a cryptographic or timestamp-keyed identifier is automatically created.
 * @returns Stored InspectionRecord
 */
export async function recordInspection(
  record: Omit<InspectionRecord, 'id'> & { id?: string }
): Promise<InspectionRecord> {
  const db = await openDB();

  const id =
    record.id ||
    `rec-${Date.now()}-${Math.floor(performance.now() * 1000).toString(36)}`;

  const finalRecord: InspectionRecord = {
    ...record,
    id,
    scannedAt: record.scannedAt || new Date().toISOString(),
    defects: Array.isArray(record.defects) ? record.defects : [],
  };

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const putRequest = store.put(finalRecord);

    putRequest.onsuccess = () => {
      notifySubscribers();
      resolve(finalRecord);
    };

    putRequest.onerror = () => reject(putRequest.error);
  });
}

/**
 * Query and filter records stored in IndexedDB.
 */
export async function queryInspections(
  filter?: InspectionFilter
): Promise<InspectionRecord[]> {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onsuccess = () => {
      let results: InspectionRecord[] = request.result || [];

      if (!filter) {
        // Default sort descending by scannedAt
        results.sort((a, b) => new Date(b.scannedAt).getTime() - new Date(a.scannedAt).getTime());
        resolve(results);
        return;
      }

      // 1. Text search
      if (filter.search && filter.search.trim()) {
        const q = filter.search.toLowerCase().trim();
        results = results.filter(
          (r) =>
            r.serial.toLowerCase().includes(q) ||
            r.batchId.toLowerCase().includes(q) ||
            r.partType.toLowerCase().includes(q) ||
            r.scannerId.toLowerCase().includes(q) ||
            r.defects.some((d) => d.class.toLowerCase().includes(q))
        );
      }

      // 2. Batch filter
      if (filter.batchId && filter.batchId !== 'ALL') {
        results = results.filter((r) => r.batchId === filter.batchId);
      }

      // 3. Verdict filter
      if (filter.verdict && filter.verdict !== 'ALL') {
        results = results.filter((r) => r.verdict === filter.verdict);
      }

      // 4. Scanner filter
      if (filter.scannerId && filter.scannerId !== 'ALL') {
        results = results.filter((r) => r.scannerId === filter.scannerId);
      }

      // 5. Part Type filter
      if (filter.partType && filter.partType !== 'ALL') {
        results = results.filter((r) => r.partType === filter.partType);
      }

      // 6. Defect class filter
      if (filter.defectClass && filter.defectClass !== 'ALL') {
        results = results.filter((r) =>
          r.defects.some((d) => d.class.toLowerCase() === filter.defectClass!.toLowerCase())
        );
      }

      // 7. Severity filter
      if (filter.severity && filter.severity !== 'ALL') {
        results = results.filter((r) =>
          r.defects.some((d) => d.severity === filter.severity)
        );
      }

      // 8. Date range filters
      if (filter.startDate) {
        const start = new Date(filter.startDate).getTime();
        results = results.filter((r) => new Date(r.scannedAt).getTime() >= start);
      }
      if (filter.endDate) {
        const end = new Date(filter.endDate).getTime();
        results = results.filter((r) => new Date(r.scannedAt).getTime() <= end);
      }

      // 9. Specific Year / Month / Day filters (Asia/Kolkata timezone)
      if (filter.year !== undefined) {
        results = results.filter((r) => {
          const parts = getKolkataDateParts(r.scannedAt);
          if (parts.year !== filter.year) return false;
          if (filter.month !== undefined && parts.month !== filter.month) return false;
          if (filter.day !== undefined && parts.day !== filter.day) return false;
          return true;
        });
      }

      // 10. Sort
      const sortBy = filter.sortBy || 'scannedAt';
      const isAsc = filter.sortDirection === 'asc';

      results.sort((a, b) => {
        let cmp = 0;
        if (sortBy === 'scannedAt') {
          cmp = new Date(a.scannedAt).getTime() - new Date(b.scannedAt).getTime();
        } else if (sortBy === 'serial') {
          cmp = a.serial.localeCompare(b.serial);
        } else if (sortBy === 'area') {
          const aArea = a.defects.reduce((acc, d) => acc + d.areaMm2, 0);
          const bArea = b.defects.reduce((acc, d) => acc + d.areaMm2, 0);
          cmp = aArea - bArea;
        }
        return isAsc ? cmp : -cmp;
      });

      // 11. Pagination
      if (filter.offset !== undefined && filter.offset > 0) {
        results = results.slice(filter.offset);
      }
      if (filter.limit !== undefined && filter.limit > 0) {
        results = results.slice(0, filter.limit);
      }

      resolve(results);
    };

    request.onerror = () => reject(request.error);
  });
}

/**
 * Subscribe to store mutations (returns an unsubscribe function).
 */
export function subscribe(listener: () => void): () => void {
  subscribers.add(listener);
  return () => {
    subscribers.delete(listener);
  };
}

/**
 * Clear all inspection records (Admin only).
 */
export async function clearAll(): Promise<void> {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const request = store.clear();

    request.onsuccess = () => {
      notifySubscribers();
      resolve();
    };

    request.onerror = () => reject(request.error);
  });
}

/**
 * Compute KPIs from an array of records or for an active batch/day.
 */
export function computeMetrics(records: InspectionRecord[]): InspectionMetrics {
  const inspected = records.length;
  if (inspected === 0) {
    return {
      inspected: 0,
      good: 0,
      rejected: 0,
      firstTimeRightPct: 100,
      partsPerMillionDefective: 0,
    };
  }

  const good = records.filter((r) => r.verdict === 'GOOD').length;
  const rejected = inspected - good;
  const firstTimeRightPct = Number(((good / inspected) * 100).toFixed(2));
  const partsPerMillionDefective = Math.round((rejected / inspected) * 1000000);

  return {
    inspected,
    good,
    rejected,
    firstTimeRightPct,
    partsPerMillionDefective,
  };
}

/**
 * Export inspection records to standard CSV text string.
 */
export async function exportCsv(records?: InspectionRecord[]): Promise<string> {
  const recordsToExport = records || (await queryInspections());
  const headers = [
    'id',
    'serial',
    'batchId',
    'partType',
    'stationId',
    'scannerId',
    'scannedAt',
    'verdict',
    'defectClasses',
    'totalDefectAreaMm2',
    'highestSeverity',
  ];

  const rows = recordsToExport.map((r) => {
    const defectClasses = r.defects.map((d) => d.class).join(';');
    const totalArea = r.defects.reduce((acc, d) => acc + d.areaMm2, 0).toFixed(2);
    const severities = r.defects.map((d) => d.severity);
    const highestSeverity = severities.includes('CRITICAL')
      ? 'CRITICAL'
      : severities.includes('MAJOR')
      ? 'MAJOR'
      : severities.includes('MODERATE')
      ? 'MODERATE'
      : severities.length > 0
      ? 'MINOR'
      : 'NONE';

    return [
      `"${r.id}"`,
      `"${r.serial}"`,
      `"${r.batchId}"`,
      `"${r.partType}"`,
      `"${r.stationId}"`,
      `"${r.scannerId}"`,
      `"${r.scannedAt}"`,
      `"${r.verdict}"`,
      `"${defectClasses}"`,
      totalArea,
      highestSeverity,
    ].join(',');
  });

  return [headers.join(','), ...rows].join('\r\n');
}

/**
 * Trigger in-browser download of text content as file.
 */
export function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

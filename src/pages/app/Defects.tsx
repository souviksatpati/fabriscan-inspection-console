import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  queryInspections,
  subscribe,
  InspectionRecord,
  DefectClass,
  DefectSeverity,
} from '../../services/inspectionStore';
import { CornerBrackets } from '../../components/common/CornerBrackets';
import { ExportReportDropdown } from '../../components/common/ExportReportDropdown';
import { formatKolkataDateTime, ReportMetadata } from '../../services/reportExport';
import { useRole } from '../../hooks/useRole';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '../../components/ui/sheet';
import { formatArea, formatConfidence } from '../../lib/format';
import { Button } from '../../components/ui/button';
import {
  Layers,
  Search,
  Filter,
  Inbox,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';

interface DefectRow {
  rowId: string;
  recordId: string;
  timeIso: string;
  serial: string;
  batchId: string;
  partType: string;
  scannerId: string;
  stationId: string;
  defectClass: string;
  confidence: number | null;
  areaMm2: number | null;
  severity: string;
  verdict: 'GOOD' | 'NOT_GOOD';
  reviewedBy: string;
  fullRecord: InspectionRecord;
  bbox?: { x: number; y: number; width: number; height: number };
}

type SortField =
  | 'timeIso'
  | 'serial'
  | 'batchId'
  | 'partType'
  | 'scannerId'
  | 'stationId'
  | 'defectClass'
  | 'confidence'
  | 'areaMm2'
  | 'severity'
  | 'verdict'
  | 'reviewedBy';

const DEFECT_CLASSES: DefectClass[] = [
  'Scratches',
  'Rolled-in Scale',
  'Inclusions',
  'Crazing',
  'Pitted Surface',
  'Patches',
];

const SEVERITIES: DefectSeverity[] = ['CRITICAL', 'MAJOR', 'MODERATE', 'MINOR'];

export const Defects: React.FC = () => {
  const { user } = useRole();
  const [records, setRecords] = useState<InspectionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeRecord, setActiveRecord] = useState<InspectionRecord | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState<string>('ALL');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('ALL');
  const [selectedVerdict, setSelectedVerdict] = useState<string>('ALL');
  const [selectedBatch, setSelectedBatch] = useState<string>('ALL');
  const [selectedScanner, setSelectedScanner] = useState<string>('ALL');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  // Sorting & Pagination
  const [sortField, setSortField] = useState<SortField>('timeIso');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 25;

  const loadData = useCallback(async () => {
    try {
      const data = await queryInspections();
      setRecords(data);
    } catch {
      // Store query error
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
    const unsubscribe = subscribe(() => {
      loadData();
    });
    return unsubscribe;
  }, [loadData]);

  // Format date in Asia/Kolkata timezone
  const formatIstTime = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      });
    } catch {
      return isoString;
    }
  };

  // Build flattened table rows
  const allRows = useMemo<DefectRow[]>(() => {
    const rows: DefectRow[] = [];
    records.forEach((rec) => {
      if (!rec.defects || rec.defects.length === 0) {
        rows.push({
          rowId: `${rec.id}-nodef`,
          recordId: rec.id,
          timeIso: rec.scannedAt,
          serial: rec.serial,
          batchId: rec.batchId,
          partType: rec.partType,
          scannerId: rec.scannerId || 'GigE-CAM-01',
          stationId: rec.stationId || 'ST-04',
          defectClass: 'NONE',
          confidence: null,
          areaMm2: null,
          severity: 'NONE',
          verdict: rec.verdict,
          reviewedBy: rec.reviewedBy || 'System AI Engine',
          fullRecord: rec,
        });
      } else {
        rec.defects.forEach((def, idx) => {
          rows.push({
            rowId: `${rec.id}-def-${idx}`,
            recordId: rec.id,
            timeIso: rec.scannedAt,
            serial: rec.serial,
            batchId: rec.batchId,
            partType: rec.partType,
            scannerId: rec.scannerId || 'GigE-CAM-01',
            stationId: rec.stationId || 'ST-04',
            defectClass: def.class,
            confidence: def.confidence,
            areaMm2: def.areaMm2 ?? null,
            severity: def.severity,
            verdict: rec.verdict,
            reviewedBy: rec.reviewedBy || 'System AI Engine',
            fullRecord: rec,
            bbox: def.bbox,
          });
        });
      }
    });
    return rows;
  }, [records]);

  // Unique batches and scanners for dropdowns
  const uniqueBatches = useMemo(() => {
    const set = new Set<string>();
    records.forEach((r) => r.batchId && set.add(r.batchId));
    return Array.from(set).sort();
  }, [records]);

  const uniqueScanners = useMemo(() => {
    const set = new Set<string>();
    records.forEach((r) => r.scannerId && set.add(r.scannerId));
    return Array.from(set).sort();
  }, [records]);

  // Filter rows
  const filteredRows = useMemo(() => {
    return allRows.filter((row) => {
      // Search query across serial, batch, partType, defectClass
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match =
          row.serial.toLowerCase().includes(q) ||
          row.batchId.toLowerCase().includes(q) ||
          row.partType.toLowerCase().includes(q) ||
          row.defectClass.toLowerCase().includes(q);
        if (!match) return false;
      }

      // Defect class filter
      if (selectedClass !== 'ALL' && row.defectClass !== selectedClass) {
        return false;
      }

      // Severity filter
      if (selectedSeverity !== 'ALL' && row.severity !== selectedSeverity) {
        return false;
      }

      // Verdict filter
      if (selectedVerdict !== 'ALL' && row.verdict !== selectedVerdict) {
        return false;
      }

      // Batch filter
      if (selectedBatch !== 'ALL' && row.batchId !== selectedBatch) {
        return false;
      }

      // Scanner filter
      if (selectedScanner !== 'ALL' && row.scannerId !== selectedScanner) {
        return false;
      }

      // Date range filter
      if (startDate) {
        const rowDate = row.timeIso.slice(0, 10);
        if (rowDate < startDate) return false;
      }
      if (endDate) {
        const rowDate = row.timeIso.slice(0, 10);
        if (rowDate > endDate) return false;
      }

      return true;
    });
  }, [
    allRows,
    searchQuery,
    selectedClass,
    selectedSeverity,
    selectedVerdict,
    selectedBatch,
    selectedScanner,
    startDate,
    endDate,
  ]);

  // Sort rows
  const sortedRows = useMemo(() => {
    return [...filteredRows].sort((a, b) => {
      let valA: string | number | null = a[sortField];
      let valB: string | number | null = b[sortField];

      if (valA === null || valA === undefined) valA = '';
      if (valB === null || valB === undefined) valB = '';

      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortOrder === 'asc' ? valA - valB : valB - valA;
      }

      const strA = String(valA).toLowerCase();
      const strB = String(valB).toLowerCase();
      if (strA < strB) return sortOrder === 'asc' ? -1 : 1;
      if (strA > strB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredRows, sortField, sortOrder]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(sortedRows.length / pageSize));
  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedRows.slice(start, start + pageSize);
  }, [sortedRows, currentPage, pageSize]);

  // Sorting handler
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
    setCurrentPage(1);
  };

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown size={11} className="text-[#94A3B8] inline ml-1" />;
    }
    return sortOrder === 'asc' ? (
      <ArrowUp size={11} className="text-[#1D4ED8] inline ml-1" />
    ) : (
      <ArrowDown size={11} className="text-[#1D4ED8] inline ml-1" />
    );
  };

  const filteredRecordsToExport = useMemo(() => {
    const seen = new Set<string>();
    const res: InspectionRecord[] = [];
    filteredRows.forEach((row) => {
      if (row.fullRecord && !seen.has(row.fullRecord.id)) {
        seen.add(row.fullRecord.id);
        res.push(row.fullRecord);
      }
    });
    return res;
  }, [filteredRows]);

  const exportMeta: ReportMetadata = useMemo(() => {
    const periodStr = startDate || endDate ? `${startDate || 'Start'} to ${endDate || 'Present'}` : 'All Dates';
    return {
      station: 'Stamping Press Line 04 · Bay B',
      period: periodStr,
      filters: `Search: "${searchQuery || 'None'}", Class: ${selectedClass}, Severity: ${selectedSeverity}, Verdict: ${selectedVerdict}`,
      generatedBy: {
        fullName: user?.fullName || user?.name || 'QC Inspector',
        userId: user?.userId || user?.id || 'usr-001',
        role: user?.role || 'QC_INSPECTOR',
      },
      generatedAt: formatKolkataDateTime(),
    };
  }, [searchQuery, selectedClass, selectedSeverity, selectedVerdict, startDate, endDate, user]);

  return (
    <div className="flex flex-col gap-6 font-sans select-none pb-12 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D9DEE5] pb-4">
        <div>
          <div className="flex items-center gap-2 font-sans text-xs text-[#DC2626]">
            <Layers size={14} />
            <span className="uppercase tracking-wider font-semibold">
              INSPECTION DEFECT LOG &amp; TRACEABILITY
            </span>
          </div>
          <h1 className="text-2xl font-bold text-[#0F172A] mt-1">Defect History</h1>
          <p className="text-xs text-[#475569] mt-0.5">
            Historical optical records from inspectionStore. Search, sort, and inspect part verdicts and segmented defects.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <ExportReportDropdown data={filteredRecordsToExport} meta={exportMeta} />
        </div>
      </div>

      {/* Comprehensive Filter Bar */}
      <div className="bg-white border border-[#D9DEE5] p-4 rounded-[4px] flex flex-col gap-3 font-mono text-xs shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
        {/* Row 1: Search and Primary Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search */}
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search serial, batch, part..."
              className="w-full bg-[#F5F7FA] border border-[#D9DEE5] rounded-[3px] pl-9 pr-3 py-1.5 text-xs text-[#0F172A] placeholder:text-[#64748B] focus:outline-none focus:border-[#1D4ED8] focus:bg-white"
            />
          </div>

          {/* Defect Class */}
          <div className="flex items-center gap-2 font-sans">
            <Filter size={13} className="text-[#64748B]" />
            <span className="text-[#64748B] text-[11px] uppercase font-semibold">Class:</span>
            <select
              value={selectedClass}
              onChange={(e) => {
                setSelectedClass(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-[#F5F7FA] border border-[#D9DEE5] text-[#0F172A] rounded-[3px] px-2 py-1 text-xs focus:outline-none focus:border-[#1D4ED8]"
            >
              <option value="ALL">All Classes</option>
              <option value="NONE">None (Clean Parts)</option>
              {DEFECT_CLASSES.map((cls) => (
                <option key={cls} value={cls}>
                  {cls}
                </option>
              ))}
            </select>
          </div>

          {/* Severity */}
          <div className="flex items-center gap-2 font-sans">
            <span className="text-[#64748B] text-[11px] uppercase font-semibold">Severity:</span>
            <select
              value={selectedSeverity}
              onChange={(e) => {
                setSelectedSeverity(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-[#F5F7FA] border border-[#D9DEE5] text-[#0F172A] rounded-[3px] px-2 py-1 text-xs focus:outline-none focus:border-[#1D4ED8]"
            >
              <option value="ALL">All Severities</option>
              {SEVERITIES.map((sev) => (
                <option key={sev} value={sev}>
                  {sev}
                </option>
              ))}
            </select>
          </div>

          {/* Verdict */}
          <div className="flex items-center gap-2 font-sans">
            <span className="text-[#64748B] text-[11px] uppercase font-semibold">Verdict:</span>
            <select
              value={selectedVerdict}
              onChange={(e) => {
                setSelectedVerdict(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-[#F5F7FA] border border-[#D9DEE5] text-[#0F172A] rounded-[3px] px-2 py-1 text-xs focus:outline-none focus:border-[#1D4ED8]"
            >
              <option value="ALL">All Verdicts</option>
              <option value="GOOD">GOOD (Accepted)</option>
              <option value="NOT_GOOD">NOT GOOD (Rejected)</option>
            </select>
          </div>
        </div>

        {/* Row 2: Secondary Filters (Batch, Scanner, Date Range) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 border-t border-[#D9DEE5]">
          {/* Batch */}
          <div className="flex items-center gap-2 font-sans">
            <span className="text-[#64748B] text-[11px] uppercase font-semibold">Batch:</span>
            <select
              value={selectedBatch}
              onChange={(e) => {
                setSelectedBatch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-[#F5F7FA] border border-[#D9DEE5] text-[#0F172A] rounded-[3px] px-2 py-1 text-xs focus:outline-none focus:border-[#1D4ED8]"
            >
              <option value="ALL">All Batches</option>
              {uniqueBatches.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          {/* Scanner */}
          <div className="flex items-center gap-2 font-sans">
            <span className="text-[#64748B] text-[11px] uppercase font-semibold">Scanner:</span>
            <select
              value={selectedScanner}
              onChange={(e) => {
                setSelectedScanner(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-[#F5F7FA] border border-[#D9DEE5] text-[#0F172A] rounded-[3px] px-2 py-1 text-xs focus:outline-none focus:border-[#1D4ED8]"
            >
              <option value="ALL">All Scanners</option>
              {uniqueScanners.map((sc) => (
                <option key={sc} value={sc}>
                  {sc}
                </option>
              ))}
            </select>
          </div>

          {/* Date Range Start */}
          <div className="flex items-center gap-2 font-sans">
            <span className="text-[#64748B] text-[11px] uppercase font-semibold">From:</span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-[#F5F7FA] border border-[#D9DEE5] text-[#0F172A] rounded-[3px] px-2 py-1 text-xs font-mono focus:outline-none focus:border-[#1D4ED8]"
            />
          </div>

          {/* Date Range End */}
          <div className="flex items-center gap-2 font-sans">
            <span className="text-[#64748B] text-[11px] uppercase font-semibold">To:</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-[#F5F7FA] border border-[#D9DEE5] text-[#0F172A] rounded-[3px] px-2 py-1 text-xs font-mono focus:outline-none focus:border-[#1D4ED8]"
            />
          </div>
        </div>

        {/* Filter stats & Reset */}
        <div className="flex items-center justify-between pt-1 text-[11px] text-[#64748B] font-mono">
          <span>
            Showing <strong className="text-[#0F172A]">{sortedRows.length}</strong> matching row(s)
          </span>
          {(searchQuery || selectedClass !== 'ALL' || selectedSeverity !== 'ALL' || selectedVerdict !== 'ALL' || selectedBatch !== 'ALL' || selectedScanner !== 'ALL' || startDate || endDate) && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedClass('ALL');
                setSelectedSeverity('ALL');
                setSelectedVerdict('ALL');
                setSelectedBatch('ALL');
                setSelectedScanner('ALL');
                setStartDate('');
                setEndDate('');
                setCurrentPage(1);
              }}
              className="text-[#1D4ED8] hover:underline"
            >
              Clear all filters
            </button>
          )}
        </div>
      </div>

      {/* Main Table or Empty State */}
      {!loading && records.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-6 text-center border border-dashed border-[#D9DEE5] rounded-[0.375rem] bg-white">
          <div className="w-12 h-12 rounded-full bg-[#F5F7FA] flex items-center justify-center text-[#64748B] mb-3">
            <Inbox size={24} />
          </div>
          <h3 className="font-mono text-sm font-bold text-[#0F172A] tracking-wider uppercase">
            NO INSPECTIONS RECORDED
          </h3>
          <p className="font-sans text-xs text-[#64748B] max-w-md mt-1">
            Records appear when the AI model sends results.
          </p>
        </div>
      ) : (
        <div className="bg-white border border-[#D9DEE5] rounded-[4px] relative p-4 font-mono text-xs shadow-[0_1px_2px_rgba(15,23,42,0.04)] flex flex-col gap-3">
          <CornerBrackets size={6} color="border-[#1D4ED8]" />

          {/* Table Container with Sticky Header */}
          <div className="overflow-x-auto border border-[#D9DEE5] rounded-[3px] max-h-[600px] overflow-y-auto">
            <table className="w-full text-left font-mono text-xs border-collapse">
              <thead className="sticky top-0 bg-[#F5F7FA] border-b border-[#D9DEE5] text-[#475569] text-[10px] uppercase font-sans font-semibold z-10 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
                <tr>
                  <th
                    className="px-3 py-2.5 cursor-pointer hover:text-[#0F172A] whitespace-nowrap"
                    onClick={() => handleSort('timeIso')}
                  >
                    Time (IST) {renderSortIcon('timeIso')}
                  </th>
                  <th
                    className="px-3 py-2.5 cursor-pointer hover:text-[#0F172A] whitespace-nowrap"
                    onClick={() => handleSort('serial')}
                  >
                    Part Serial {renderSortIcon('serial')}
                  </th>
                  <th
                    className="px-3 py-2.5 cursor-pointer hover:text-[#0F172A] whitespace-nowrap"
                    onClick={() => handleSort('batchId')}
                  >
                    Batch ID {renderSortIcon('batchId')}
                  </th>
                  <th
                    className="px-3 py-2.5 cursor-pointer hover:text-[#0F172A] whitespace-nowrap"
                    onClick={() => handleSort('partType')}
                  >
                    Part Type {renderSortIcon('partType')}
                  </th>
                  <th
                    className="px-3 py-2.5 cursor-pointer hover:text-[#0F172A] whitespace-nowrap"
                    onClick={() => handleSort('scannerId')}
                  >
                    Scanner/Camera {renderSortIcon('scannerId')}
                  </th>
                  <th
                    className="px-3 py-2.5 cursor-pointer hover:text-[#0F172A] whitespace-nowrap"
                    onClick={() => handleSort('stationId')}
                  >
                    Station {renderSortIcon('stationId')}
                  </th>
                  <th
                    className="px-3 py-2.5 cursor-pointer hover:text-[#0F172A] whitespace-nowrap"
                    onClick={() => handleSort('defectClass')}
                  >
                    Defect Class {renderSortIcon('defectClass')}
                  </th>
                  <th
                    className="px-3 py-2.5 cursor-pointer hover:text-[#0F172A] whitespace-nowrap"
                    onClick={() => handleSort('confidence')}
                  >
                    Confidence {renderSortIcon('confidence')}
                  </th>
                  <th
                    className="px-3 py-2.5 cursor-pointer hover:text-[#0F172A] whitespace-nowrap"
                    onClick={() => handleSort('areaMm2')}
                  >
                    Area (mm²) {renderSortIcon('areaMm2')}
                  </th>
                  <th
                    className="px-3 py-2.5 cursor-pointer hover:text-[#0F172A] whitespace-nowrap"
                    onClick={() => handleSort('severity')}
                  >
                    Severity {renderSortIcon('severity')}
                  </th>
                  <th
                    className="px-3 py-2.5 cursor-pointer hover:text-[#0F172A] whitespace-nowrap"
                    onClick={() => handleSort('verdict')}
                  >
                    Verdict {renderSortIcon('verdict')}
                  </th>
                  <th
                    className="px-3 py-2.5 cursor-pointer hover:text-[#0F172A] whitespace-nowrap text-right"
                    onClick={() => handleSort('reviewedBy')}
                  >
                    Reviewed By {renderSortIcon('reviewedBy')}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D9DEE5] bg-white">
                {paginatedRows.length === 0 ? (
                  <tr>
                    <td colSpan={12} className="text-center py-8 text-[#64748B] font-mono">
                      No records match the active filter criteria.
                    </td>
                  </tr>
                ) : (
                  paginatedRows.map((row) => {
                    const isGood = row.verdict === 'GOOD';
                    const hasDefect = row.defectClass !== 'NONE';

                    return (
                      <tr
                        key={row.rowId}
                        onClick={() => setActiveRecord(row.fullRecord)}
                        className="hover:bg-[#F5F7FA] transition-colors cursor-pointer group"
                      >
                        <td className="px-3 py-2.5 text-[#64748B] whitespace-nowrap">
                          {formatIstTime(row.timeIso)}
                        </td>
                        <td className="px-3 py-2.5 font-bold text-[#0F172A] whitespace-nowrap group-hover:text-[#1D4ED8]">
                          {row.serial}
                        </td>
                        <td className="px-3 py-2.5 text-[#475569] whitespace-nowrap">
                          {row.batchId}
                        </td>
                        <td className="px-3 py-2.5 text-[#475569] max-w-[160px] truncate" title={row.partType}>
                          {row.partType}
                        </td>
                        <td className="px-3 py-2.5 text-[#64748B] whitespace-nowrap">
                          {row.scannerId}
                        </td>
                        <td className="px-3 py-2.5 text-[#64748B] whitespace-nowrap">
                          {row.stationId}
                        </td>
                        <td className="px-3 py-2.5 whitespace-nowrap">
                          {hasDefect ? (
                            <span className="font-semibold text-[#DC2626] flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#DC2626]" />
                              {row.defectClass}
                            </span>
                          ) : (
                            <span className="text-[#64748B]">NONE</span>
                          )}
                        </td>
                        <td className="px-3 py-2.5 text-[#0F172A] font-medium whitespace-nowrap">
                          {row.confidence !== null ? formatConfidence(row.confidence) : '—'}
                        </td>
                        <td className="px-3 py-2.5 text-[#475569] whitespace-nowrap">
                          {row.areaMm2 !== null ? formatArea(row.areaMm2) : '—'}
                        </td>
                        <td className="px-3 py-2.5 whitespace-nowrap">
                          {row.severity !== 'NONE' ? (
                            <span
                              className={`px-1.5 py-0.5 rounded-[2px] text-[10px] font-sans font-semibold ${
                                row.severity === 'CRITICAL' || row.severity === 'MAJOR'
                                  ? 'bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA]'
                                  : 'bg-[#FFFBEB] text-[#B45309] border border-[#FDE68A]'
                              }`}
                            >
                              {row.severity}
                            </span>
                          ) : (
                            <span className="text-[#94A3B8]">—</span>
                          )}
                        </td>
                        <td className="px-3 py-2.5 whitespace-nowrap">
                          <span
                            className={`px-2 py-0.5 rounded-[2px] text-[10px] font-bold uppercase ${
                              isGood
                                ? 'bg-[#DCFCE7] text-[#15803D] border border-[#BBF7D0]'
                                : 'bg-[#FEE2E2] text-[#DC2626] border border-[#FECACA]'
                            }`}
                          >
                            {row.verdict}
                          </span>
                        </td>
                        <td className="px-3 py-2.5 text-right text-[#64748B] whitespace-nowrap">
                          {row.reviewedBy}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-[#D9DEE5] text-xs font-sans">
            <span className="text-[#64748B] font-mono text-[11px]">
              Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong> ({sortedRows.length} total rows)
            </span>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="h-7 text-xs font-mono gap-1 border-[#D9DEE5]"
              >
                <ChevronLeft size={13} />
                Previous
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage >= totalPages}
                className="h-7 text-xs font-mono gap-1 border-[#D9DEE5]"
              >
                Next
                <ChevronRight size={13} />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Slide-out Sheet for Detailed Record Inspection */}
      <Sheet open={!!activeRecord} onOpenChange={(open) => !open && setActiveRecord(null)}>
        <SheetContent side="right" className="w-full sm:max-w-xl bg-white border-l border-[#D9DEE5] p-6 overflow-y-auto font-sans">
          {activeRecord && (
            <div className="flex flex-col gap-5 text-xs">
              <SheetHeader className="border-b border-[#D9DEE5] pb-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-[#1D4ED8] uppercase font-bold tracking-wider font-sans">
                    PART TRACEABILITY RECORD
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-[3px] text-xs font-mono font-bold uppercase ${
                      activeRecord.verdict === 'GOOD'
                        ? 'bg-[#DCFCE7] text-[#15803D] border border-[#BBF7D0]'
                        : 'bg-[#FEE2E2] text-[#DC2626] border border-[#FECACA]'
                    }`}
                  >
                    {activeRecord.verdict}
                  </span>
                </div>
                <SheetTitle className="text-xl font-bold text-[#0F172A] font-mono mt-1">
                  {activeRecord.serial}
                </SheetTitle>
                <SheetDescription className="font-sans text-xs text-[#475569]">
                  {activeRecord.partType} · Batch {activeRecord.batchId}
                </SheetDescription>
              </SheetHeader>

              {/* Status Banner */}
              {activeRecord.verdict === 'GOOD' ? (
                <div className="bg-[#F0FDF4] border border-[#BBF7D0] p-3 rounded-[4px] flex items-center gap-2.5 text-[#15803D]">
                  <ShieldCheck size={20} className="shrink-0" />
                  <div>
                    <strong className="block font-mono text-xs uppercase">ACCEPTED - CLEARED</strong>
                    <span className="text-[11px] text-[#166534]">No surface defect exceeding tolerance. Approved for assembly.</span>
                  </div>
                </div>
              ) : (
                <div className="bg-[#FEF2F2] border border-[#FECACA] p-3 rounded-[4px] flex items-center gap-2.5 text-[#DC2626]">
                  <AlertTriangle size={20} className="shrink-0" />
                  <div>
                    <strong className="block font-mono text-xs uppercase">REJECTED - NOT GOOD</strong>
                    <span className="text-[11px] text-[#991B1B]">Surface anomalies detected. Quarantined for QA review.</span>
                  </div>
                </div>
              )}

              {/* General Metadata Grid */}
              <div className="grid grid-cols-2 gap-2 font-mono text-xs bg-[#F5F7FA] border border-[#D9DEE5] p-3 rounded-[4px]">
                <div>
                  <span className="text-[#64748B] text-[10px] uppercase block font-sans">Timestamp (IST)</span>
                  <span className="text-[#0F172A] font-semibold">{formatIstTime(activeRecord.scannedAt)}</span>
                </div>
                <div>
                  <span className="text-[#64748B] text-[10px] uppercase block font-sans">Station</span>
                  <span className="text-[#0F172A] font-semibold">{activeRecord.stationId || 'ST-04'}</span>
                </div>
                <div>
                  <span className="text-[#64748B] text-[10px] uppercase block font-sans">Scanner / Camera</span>
                  <span className="text-[#0F172A] font-semibold">{activeRecord.scannerId || 'GigE-CAM-01'}</span>
                </div>
                <div>
                  <span className="text-[#64748B] text-[10px] uppercase block font-sans">Reviewed By</span>
                  <span className="text-[#0F172A] font-semibold">{activeRecord.reviewedBy || 'Edge AI Agent'}</span>
                </div>
              </div>

              {/* Defects List */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-[#0F172A] uppercase tracking-wider block font-sans">
                  Segmented Defects ({activeRecord.defects?.length || 0})
                </span>

                {(!activeRecord.defects || activeRecord.defects.length === 0) ? (
                  <div className="p-4 border border-[#D9DEE5] rounded-[3px] bg-white text-center text-[#64748B] font-mono text-xs">
                    Zero defects logged for this inspection event.
                  </div>
                ) : (
                  activeRecord.defects.map((def, idx) => (
                    <div
                      key={idx}
                      className="border border-[#FECACA] bg-[#FEF2F2] p-3 rounded-[3px] space-y-1.5 font-mono text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#DC2626] text-sm">
                          {def.class}
                        </span>
                        <span className="px-1.5 py-0.5 rounded-[2px] bg-white border border-[#FECACA] text-[10px] font-bold text-[#DC2626]">
                          {def.severity}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-[11px] text-[#475569] pt-1">
                        <div>
                          Confidence: <strong className="text-[#0F172A]">{formatConfidence(def.confidence)}</strong>
                        </div>
                        <div>
                          Area: <strong className="text-[#0F172A]">{def.areaMm2 ? formatArea(def.areaMm2) : '—'}</strong>
                        </div>
                      </div>
                      {def.bbox && (
                        <div className="text-[10px] text-[#64748B] pt-0.5 border-t border-[#FECACA]/40">
                          BBox: [x: {(def.bbox.x * 100).toFixed(0)}%, y: {(def.bbox.y * 100).toFixed(0)}%, w: {(def.bbox.width * 100).toFixed(0)}%, h: {(def.bbox.height * 100).toFixed(0)}%]
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>

              {activeRecord.notes && (
                <div className="border border-[#D9DEE5] p-3 rounded-[3px] bg-[#F5F7FA]">
                  <span className="text-[10px] font-semibold text-[#64748B] uppercase block mb-0.5">Notes</span>
                  <p className="text-xs text-[#0F172A] font-sans">{activeRecord.notes}</p>
                </div>
              )}
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Defects;

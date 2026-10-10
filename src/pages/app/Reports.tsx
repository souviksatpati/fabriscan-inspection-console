import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { queryInspections, subscribe, InspectionRecord } from '../../services/inspectionStore';
import { CornerBrackets } from '../../components/common/CornerBrackets';
import { ExportReportDropdown } from '../../components/common/ExportReportDropdown';
import { formatKolkataDateTime, ReportMetadata } from '../../services/reportExport';
import { useRole } from '../../hooks/useRole';
import { MetricCard } from '../../components/common/MetricCard';
import { formatNumber } from '../../lib/format';
import { FileText, Calendar, Filter, Inbox } from 'lucide-react';

export const Reports: React.FC = () => {
  const { user } = useRole();
  const [records, setRecords] = useState<InspectionRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Report Builder Controls
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [selectedBatch, setSelectedBatch] = useState<string>('ALL');
  const [selectedVerdict, setSelectedVerdict] = useState<string>('ALL');

  // Load records from store
  const loadRecords = useCallback(async () => {
    try {
      const data = await queryInspections();
      setRecords(data);
    } catch (err) {
      console.error('Failed to query inspection records for reports:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRecords();
    const unsub = subscribe(() => {
      loadRecords();
    });
    return unsub;
  }, [loadRecords]);

  // Unique batches
  const uniqueBatches = useMemo(() => {
    const set = new Set<string>();
    records.forEach((r) => r.batchId && set.add(r.batchId));
    return Array.from(set).sort();
  }, [records]);

  // Quick preset dates
  const handlePreset = (preset: 'today' | '7days' | '30days' | 'all') => {
    const now = new Date();
    const toYMD = (d: Date) => d.toISOString().slice(0, 10);

    if (preset === 'today') {
      const todayStr = toYMD(now);
      setStartDate(todayStr);
      setEndDate(todayStr);
    } else if (preset === '7days') {
      const past = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      setStartDate(toYMD(past));
      setEndDate(toYMD(now));
    } else if (preset === '30days') {
      const past = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      setStartDate(toYMD(past));
      setEndDate(toYMD(now));
    } else {
      setStartDate('');
      setEndDate('');
    }
  };

  // Filtered records matching report builder parameters
  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      // Date range filter
      const recordDate = r.scannedAt ? r.scannedAt.slice(0, 10) : '';
      if (startDate && recordDate < startDate) return false;
      if (endDate && recordDate > endDate) return false;

      // Batch filter
      if (selectedBatch !== 'ALL' && r.batchId !== selectedBatch) return false;

      // Verdict filter
      if (selectedVerdict !== 'ALL' && r.verdict !== selectedVerdict) return false;

      return true;
    });
  }, [records, startDate, endDate, selectedBatch, selectedVerdict]);

  // Derived KPIs
  const totalInspected = filteredRecords.length;
  const goodCount = filteredRecords.filter((r) => r.verdict === 'GOOD').length;
  const rejectedCount = filteredRecords.filter((r) => r.verdict === 'NOT_GOOD').length;
  const ftrPct = totalInspected > 0 ? (goodCount / totalInspected) * 100 : 100;
  const ppm = totalInspected > 0 ? (rejectedCount / totalInspected) * 1_000_000 : 0;

  // Metadata for export
  const exportMeta: ReportMetadata = useMemo(() => {
    const periodStr =
      startDate || endDate
        ? `${startDate || 'Earliest'} to ${endDate || 'Latest'}`
        : 'All Historical Dates';

    const filtersArr: string[] = [];
    if (selectedBatch !== 'ALL') filtersArr.push(`Batch: ${selectedBatch}`);
    if (selectedVerdict !== 'ALL') filtersArr.push(`Verdict: ${selectedVerdict}`);
    if (filtersArr.length === 0) filtersArr.push('All Records');

    return {
      station: 'Stamping Press Line 04 · Bay B',
      period: periodStr,
      filters: filtersArr.join(', '),
      generatedBy: {
        fullName: user?.fullName || user?.name || 'QA Auditor',
        userId: user?.userId || user?.id || 'usr-001',
        role: user?.role || 'QA_SUPERVISOR',
      },
      generatedAt: formatKolkataDateTime(),
    };
  }, [startDate, endDate, selectedBatch, selectedVerdict, user]);

  return (
    <div className="flex flex-col gap-6 font-sans select-none pb-12 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D9DEE5] pb-4">
        <div>
          <div className="flex items-center gap-2 font-sans text-xs text-[#1D4ED8]">
            <FileText size={14} />
            <span className="uppercase tracking-wider font-semibold">
              QUALITY AUDIT &amp; TRACEABILITY ARCHIVE
            </span>
          </div>
          <h1 className="text-2xl font-bold text-[#0F172A] mt-1">Inspection Reports</h1>
          <p className="text-xs text-[#475569] mt-1">
            Build and export official quality assurance packages, shift audit summaries, and NCR documentation.
          </p>
        </div>

        {/* Global Export Button for Current Builder Scope */}
        <div className="self-start sm:self-auto">
          <ExportReportDropdown data={filteredRecords} meta={exportMeta} />
        </div>
      </div>

      {/* Report Builder Configuration Panel */}
      <div className="bg-white border border-[#D9DEE5] p-5 rounded-[0.25rem] relative shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
        <CornerBrackets size={6} color="border-[#1D4ED8]" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-[#D9DEE5]">
          <div className="flex items-center gap-2">
            <Filter size={15} className="text-[#1D4ED8]" />
            <span className="font-sans font-bold text-xs uppercase tracking-wider text-[#0F172A]">
              Report Builder Parameters
            </span>
          </div>

          {/* Quick Presets */}
          <div className="flex items-center gap-1.5 flex-wrap font-mono text-[0.625rem]">
            <span className="text-[#64748B] mr-1 font-sans">Presets:</span>
            <button
              type="button"
              onClick={() => handlePreset('today')}
              className="px-2 py-1 bg-[#F5F7FA] hover:bg-[#EFF6FF] hover:text-[#1D4ED8] border border-[#D9DEE5] rounded-[0.1875rem] transition-colors cursor-pointer"
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => handlePreset('7days')}
              className="px-2 py-1 bg-[#F5F7FA] hover:bg-[#EFF6FF] hover:text-[#1D4ED8] border border-[#D9DEE5] rounded-[0.1875rem] transition-colors cursor-pointer"
            >
              Last 7 Days
            </button>
            <button
              type="button"
              onClick={() => handlePreset('30days')}
              className="px-2 py-1 bg-[#F5F7FA] hover:bg-[#EFF6FF] hover:text-[#1D4ED8] border border-[#D9DEE5] rounded-[0.1875rem] transition-colors cursor-pointer"
            >
              Last 30 Days
            </button>
            <button
              type="button"
              onClick={() => handlePreset('all')}
              className="px-2 py-1 bg-[#F5F7FA] hover:bg-[#EFF6FF] hover:text-[#1D4ED8] border border-[#D9DEE5] rounded-[0.1875rem] transition-colors cursor-pointer"
            >
              All Time
            </button>
          </div>
        </div>

        {/* Builder Inputs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
          {/* Start Date */}
          <div>
            <label className="block text-[0.6875rem] text-[#475569] font-sans font-medium mb-1 flex items-center gap-1.5">
              <Calendar size={13} className="text-[#64748B]" />
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full bg-[#F8FAFC] border border-[#D9DEE5] rounded-[0.1875rem] px-2.5 py-1.5 text-xs text-[#0F172A] focus:outline-none focus:ring-1 focus:ring-[#1D4ED8]"
            />
          </div>

          {/* End Date */}
          <div>
            <label className="block text-[0.6875rem] text-[#475569] font-sans font-medium mb-1 flex items-center gap-1.5">
              <Calendar size={13} className="text-[#64748B]" />
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full bg-[#F8FAFC] border border-[#D9DEE5] rounded-[0.1875rem] px-2.5 py-1.5 text-xs text-[#0F172A] focus:outline-none focus:ring-1 focus:ring-[#1D4ED8]"
            />
          </div>

          {/* Batch Selector */}
          <div>
            <label className="block text-[0.6875rem] text-[#475569] font-sans font-medium mb-1">
              Batch Selection
            </label>
            <select
              value={selectedBatch}
              onChange={(e) => setSelectedBatch(e.target.value)}
              className="w-full bg-[#F8FAFC] border border-[#D9DEE5] rounded-[0.1875rem] px-2.5 py-1.5 text-xs text-[#0F172A] focus:outline-none focus:ring-1 focus:ring-[#1D4ED8]"
            >
              <option value="ALL">All Batches ({uniqueBatches.length})</option>
              {uniqueBatches.map((b) => (
                <option key={b} value={b}>
                  Batch: {b}
                </option>
              ))}
            </select>
          </div>

          {/* Verdict Filter */}
          <div>
            <label className="block text-[0.6875rem] text-[#475569] font-sans font-medium mb-1">
              Verdict Filter
            </label>
            <select
              value={selectedVerdict}
              onChange={(e) => setSelectedVerdict(e.target.value)}
              className="w-full bg-[#F8FAFC] border border-[#D9DEE5] rounded-[0.1875rem] px-2.5 py-1.5 text-xs text-[#0F172A] focus:outline-none focus:ring-1 focus:ring-[#1D4ED8]"
            >
              <option value="ALL">All Verdicts</option>
              <option value="GOOD">Conforming (Good Only)</option>
              <option value="NOT_GOOD">Non-Conforming (Rejected Only)</option>
            </select>
          </div>
        </div>

        {/* Builder Status Bar */}
        <div className="mt-4 pt-3 border-t border-[#D9DEE5] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="font-mono text-[0.6875rem] text-[#64748B]">
            Matching records: <strong className="text-[#0F172A]">{filteredRecords.length}</strong> of{' '}
            {records.length} total
          </div>

          <ExportReportDropdown data={filteredRecords} meta={exportMeta} />
        </div>
      </div>

      {/* Main Content: Empty State or Report Preview */}
      {!loading && filteredRecords.length === 0 ? (
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
        <div className="space-y-6">
          {/* Summary KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard
              label="TOTAL INSPECTED"
              value={formatNumber(totalInspected)}
              subtitle="Scope subset"
            />
            <MetricCard
              label="CONFORMING (GOOD)"
              value={formatNumber(goodCount)}
              subtitle={`${ftrPct.toFixed(1)}% yield`}
            />
            <MetricCard
              label="NON-CONFORMING"
              value={formatNumber(rejectedCount)}
              subtitle="Quarantine scrap"
            />
            <MetricCard
              label="DEFECTIVE PPM"
              value={Math.round(ppm).toLocaleString()}
              subtitle="Parts-per-million"
            />
          </div>

          {/* Compiled Records Preview Table */}
          <div className="bg-white border border-[#D9DEE5] rounded-[0.25rem] p-5 font-mono text-xs relative shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
            <CornerBrackets size={6} color="border-[#1D4ED8]" />
            <div className="flex items-center justify-between mb-4 border-b border-[#D9DEE5] pb-3">
              <span className="font-bold text-[#0F172A] uppercase tracking-wider font-sans">
                COMPILED REPORT RECORD PREVIEW ({filteredRecords.length} UNITS)
              </span>
              <span className="text-[#64748B] text-[0.625rem]">
                EXPORT INCLUDES ALL 4 DETAILED AUDIT SHEETS
              </span>
            </div>

            <div className="overflow-x-auto border border-[#D9DEE5] rounded-[0.1875rem] max-h-[25rem] overflow-y-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead className="sticky top-0 bg-[#F5F7FA] border-b border-[#D9DEE5] text-[#475569] text-[0.625rem] uppercase font-sans font-semibold">
                  <tr>
                    <th className="px-3 py-2.5">Part Serial</th>
                    <th className="px-3 py-2.5">Time (IST)</th>
                    <th className="px-3 py-2.5">Batch</th>
                    <th className="px-3 py-2.5">Part Type</th>
                    <th className="px-3 py-2.5">Station</th>
                    <th className="px-3 py-2.5">Verdict</th>
                    <th className="px-3 py-2.5">Defect Count</th>
                    <th className="px-3 py-2.5">Classes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D9DEE5] bg-white">
                  {filteredRecords.slice(0, 50).map((r) => {
                    const isGood = r.verdict === 'GOOD';
                    const defectClasses = (r.defects || []).map((d) => d.class).join(', ') || 'None';

                    return (
                      <tr key={r.id} className="hover:bg-[#F5F7FA]">
                        <td className="px-3 py-2.5 font-bold text-[#0F172A]">{r.serial}</td>
                        <td className="px-3 py-2.5 text-[#64748B]">
                          {formatKolkataDateTime(new Date(r.scannedAt))}
                        </td>
                        <td className="px-3 py-2.5 text-[#475569]">{r.batchId}</td>
                        <td className="px-3 py-2.5 text-[#475569]">{r.partType}</td>
                        <td className="px-3 py-2.5 text-[#64748B]">{r.stationId}</td>
                        <td className="px-3 py-2.5">
                          <span
                            className={`px-2 py-0.5 rounded-[0.125rem] text-[0.625rem] font-sans font-bold uppercase ${
                              isGood
                                ? 'bg-[#DCFCE7] text-[#15803D] border border-[#BBF7D0]'
                                : 'bg-[#FEE2E2] text-[#DC2626] border border-[#FECACA]'
                            }`}
                          >
                            {r.verdict}
                          </span>
                        </td>
                        <td className="px-3 py-2.5 text-center font-semibold text-[#0F172A]">
                          {(r.defects || []).length}
                        </td>
                        <td className="px-3 py-2.5 text-[#475569] max-w-xs truncate">
                          {defectClasses}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {filteredRecords.length > 50 && (
              <div className="mt-3 text-center text-[0.6875rem] font-mono text-[#64748B]">
                Showing first 50 records in preview. All {filteredRecords.length} records are included in the Excel and PDF export.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;

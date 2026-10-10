import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  queryInspections,
  subscribe,
  InspectionRecord,
  getAsiaKolkataDateParts,
} from '../../services/inspectionStore';
import { MetricCard } from '../../components/common/MetricCard';
import { CornerBrackets } from '../../components/common/CornerBrackets';
import { ExportReportDropdown } from '../../components/common/ExportReportDropdown';
import { formatKolkataDateTime, ReportMetadata } from '../../services/reportExport';
import { useRole } from '../../hooks/useRole';
import { formatNumber, formatPpm } from '../../lib/format';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
} from 'recharts';
import { Activity, Calendar, Inbox } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { useRootFontSize } from '../../hooks/useRootFontSize';

const DEFECT_CLASSES = [
  'Scratches',
  'Rolled-in Scale',
  'Inclusions',
  'Crazing',
  'Pitted Surface',
  'Patches',
] as const;

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const Production: React.FC = () => {
  const rootFontSize = useRootFontSize();
  const tickFontSize = Math.round(rootFontSize * 0.625);
  const tickFontSizeMd = Math.round(rootFontSize * 0.6875);

  const { user } = useRole();

  const [allRecords, setAllRecords] = useState<InspectionRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Initialize with Today in Asia/Kolkata
  const todayParts = useMemo(() => {
    return getAsiaKolkataDateParts(new Date().toISOString());
  }, []);

  const [filterMode, setFilterMode] = useState<'day' | 'month' | 'year'>('day');
  const [selectedYear, setSelectedYear] = useState<number>(todayParts.year);
  const [selectedMonth, setSelectedMonth] = useState<number>(todayParts.month);
  const [selectedDay, setSelectedDay] = useState<number>(todayParts.day);

  // Load all records from inspectionStore
  const loadRecords = useCallback(async () => {
    try {
      const records = await queryInspections();
      setAllRecords(records);
    } catch {
      // Store error
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRecords();
    const unsubscribe = subscribe(() => {
      loadRecords();
    });
    return unsubscribe;
  }, [loadRecords]);

  // Set to today
  const handleSetToday = () => {
    const now = getAsiaKolkataDateParts(new Date().toISOString());
    setSelectedYear(now.year);
    setSelectedMonth(now.month);
    setSelectedDay(now.day);
    setFilterMode('day');
  };

  // Available years from records plus current year
  const availableYears = useMemo(() => {
    const yearSet = new Set<number>([todayParts.year, 2026, 2025]);
    allRecords.forEach((r) => {
      const parts = getAsiaKolkataDateParts(r.scannedAt);
      yearSet.add(parts.year);
    });
    return Array.from(yearSet).sort((a, b) => b - a);
  }, [allRecords, todayParts.year]);

  // Filter records based on selected Year, Month, Day in Asia/Kolkata
  const filteredRecords = useMemo(() => {
    return allRecords.filter((record) => {
      const parts = getAsiaKolkataDateParts(record.scannedAt);
      if (parts.year !== selectedYear) return false;
      if (filterMode === 'year') return true;

      if (parts.month !== selectedMonth) return false;
      if (filterMode === 'month') return true;

      return parts.day === selectedDay;
    });
  }, [allRecords, filterMode, selectedYear, selectedMonth, selectedDay]);

  // Derived KPIs
  const totalInspected = filteredRecords.length;
  const acceptedCount = filteredRecords.filter((r) => r.verdict === 'GOOD').length;
  const rejectedCount = filteredRecords.filter((r) => r.verdict === 'NOT_GOOD').length;
  const firstTimeRightPct = totalInspected > 0 ? (acceptedCount / totalInspected) * 100 : 100;
  const ppmDefective = totalInspected > 0 ? (rejectedCount / totalInspected) * 1000000 : 0;

  // Defect count per class
  const defectCountsByClass = useMemo(() => {
    const counts: Record<string, number> = {};
    DEFECT_CLASSES.forEach((c) => {
      counts[c] = 0;
    });

    filteredRecords.forEach((record) => {
      if (record.defects && record.defects.length > 0) {
        record.defects.forEach((d) => {
          if (counts[d.class] !== undefined) {
            counts[d.class] += 1;
          } else {
            counts[d.class] = 1;
          }
        });
      }
    });

    return DEFECT_CLASSES.map((cls) => ({
      class: cls,
      count: counts[cls] || 0,
    }));
  }, [filteredRecords]);

  // Adaptive trend chart data
  const trendData = useMemo(() => {
    if (filterMode === 'day') {
      // Group by Hour (0 to 23) in Asia/Kolkata
      const hourBuckets: Record<number, { inspected: number; good: number; rejected: number }> = {};
      for (let h = 0; h < 24; h++) {
        hourBuckets[h] = { inspected: 0, good: 0, rejected: 0 };
      }

      filteredRecords.forEach((record) => {
        const parts = getAsiaKolkataDateParts(record.scannedAt);
        const h = parts.hour;
        if (hourBuckets[h]) {
          hourBuckets[h].inspected += 1;
          if (record.verdict === 'GOOD') hourBuckets[h].good += 1;
          else hourBuckets[h].rejected += 1;
        }
      });

      return Array.from({ length: 24 }).map((_, h) => ({
        label: `${String(h).padStart(2, '0')}:00`,
        inspected: hourBuckets[h].inspected,
        good: hourBuckets[h].good,
        rejected: hourBuckets[h].rejected,
      }));
    } else if (filterMode === 'month') {
      // Group by Day of Month (1 to 31)
      const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
      const dayBuckets: Record<number, { inspected: number; good: number; rejected: number }> = {};
      for (let d = 1; d <= daysInMonth; d++) {
        dayBuckets[d] = { inspected: 0, good: 0, rejected: 0 };
      }

      filteredRecords.forEach((record) => {
        const parts = getAsiaKolkataDateParts(record.scannedAt);
        const d = parts.day;
        if (dayBuckets[d]) {
          dayBuckets[d].inspected += 1;
          if (record.verdict === 'GOOD') dayBuckets[d].good += 1;
          else dayBuckets[d].rejected += 1;
        }
      });

      return Array.from({ length: daysInMonth }).map((_, idx) => {
        const d = idx + 1;
        return {
          label: `Day ${d}`,
          inspected: dayBuckets[d].inspected,
          good: dayBuckets[d].good,
          rejected: dayBuckets[d].rejected,
        };
      });
    } else {
      // Group by Month of Year (1 to 12)
      const monthBuckets: Record<number, { inspected: number; good: number; rejected: number }> = {};
      for (let m = 1; m <= 12; m++) {
        monthBuckets[m] = { inspected: 0, good: 0, rejected: 0 };
      }

      filteredRecords.forEach((record) => {
        const parts = getAsiaKolkataDateParts(record.scannedAt);
        const m = parts.month;
        if (monthBuckets[m]) {
          monthBuckets[m].inspected += 1;
          if (record.verdict === 'GOOD') monthBuckets[m].good += 1;
          else monthBuckets[m].rejected += 1;
        }
      });

      return Array.from({ length: 12 }).map((_, idx) => {
        const m = idx + 1;
        return {
          label: MONTH_NAMES[idx].slice(0, 3),
          inspected: monthBuckets[m].inspected,
          good: monthBuckets[m].good,
          rejected: monthBuckets[m].rejected,
        };
      });
    }
  }, [filteredRecords, filterMode, selectedYear, selectedMonth]);

  const daysInSelectedMonth = new Date(selectedYear, selectedMonth, 0).getDate();

  const exportMeta: ReportMetadata = useMemo(() => {
    const periodStr =
      filterMode === 'day'
        ? `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`
        : filterMode === 'month'
        ? `${MONTH_NAMES[selectedMonth - 1]} ${selectedYear}`
        : `${selectedYear}`;
    return {
      station: 'Stamping Press Line 04 · Bay B',
      period: periodStr,
      filters: `Scope: ${filterMode.toUpperCase()} (${periodStr})`,
      generatedBy: {
        fullName: user?.fullName || user?.name || 'Quality Inspector',
        userId: user?.userId || user?.id || 'usr-001',
        role: user?.role || 'QC_INSPECTOR',
      },
      generatedAt: formatKolkataDateTime(),
    };
  }, [filterMode, selectedYear, selectedMonth, selectedDay, user]);

  return (
    <div className="flex flex-col gap-6 font-sans select-none pb-12 max-w-7xl mx-auto">
      {/* Header and Filter Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#D9DEE5] pb-4">
        <div>
          <div className="flex items-center gap-2 font-sans text-xs text-[#1D4ED8]">
            <Activity size={14} />
            <span className="uppercase tracking-wider font-semibold">
              PRODUCTION &amp; QUALITY METRICS (ASIA/KOLKATA)
            </span>
          </div>
          <h1 className="text-2xl font-bold text-[#0F172A] mt-1">Stamping Press Line 04</h1>
          <p className="text-xs text-[#475569] mt-0.5">
            Production throughput, first-time-right yield and defect frequencies derived directly from the inspection store.
          </p>
        </div>

        {/* Date Filter Strip */}
        <div className="flex flex-wrap items-center gap-2 bg-white border border-[#D9DEE5] p-2 rounded-[4px] shadow-[0_1px_2px_rgba(15,23,42,0.04)] font-mono text-xs">
          <Calendar size={14} className="text-[#1D4ED8] ml-1" />

          {/* Today Button */}
          <Button
            variant={filterMode === 'day' && selectedDay === todayParts.day && selectedMonth === todayParts.month && selectedYear === todayParts.year ? 'default' : 'outline'}
            size="sm"
            onClick={handleSetToday}
            className="h-8 text-xs font-sans font-semibold"
          >
            Today
          </Button>

          {/* Filter Scope Select */}
          <select
            value={filterMode}
            onChange={(e) => setFilterMode(e.target.value as 'day' | 'month' | 'year')}
            className="h-8 px-2.5 rounded-[3px] bg-[#F5F7FA] border border-[#D9DEE5] text-[#0F172A] font-sans text-xs focus:ring-1 focus:ring-[#1D4ED8] focus:outline-none"
          >
            <option value="day">By Day</option>
            <option value="month">By Month</option>
            <option value="year">By Year</option>
          </select>

          {/* Year Select */}
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="h-8 px-2.5 rounded-[3px] bg-[#F5F7FA] border border-[#D9DEE5] text-[#0F172A] font-mono text-xs focus:ring-1 focus:ring-[#1D4ED8] focus:outline-none"
          >
            {availableYears.map((yr) => (
              <option key={yr} value={yr}>
                {yr}
              </option>
            ))}
          </select>

          {/* Month Select (visible in day and month modes) */}
          {filterMode !== 'year' && (
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="h-8 px-2.5 rounded-[3px] bg-[#F5F7FA] border border-[#D9DEE5] text-[#0F172A] font-sans text-xs focus:ring-1 focus:ring-[#1D4ED8] focus:outline-none"
            >
              {MONTH_NAMES.map((mName, idx) => (
                <option key={mName} value={idx + 1}>
                  {mName}
                </option>
              ))}
            </select>
          )}

          {/* Day Select (visible only in day mode) */}
          {filterMode === 'day' && (
            <select
              value={selectedDay}
              onChange={(e) => setSelectedDay(Number(e.target.value))}
              className="h-8 px-2.5 rounded-[3px] bg-[#F5F7FA] border border-[#D9DEE5] text-[#0F172A] font-mono text-xs focus:ring-1 focus:ring-[#1D4ED8] focus:outline-none"
            >
              {Array.from({ length: daysInSelectedMonth }).map((_, idx) => (
                <option key={idx + 1} value={idx + 1}>
                  Day {idx + 1}
                </option>
              ))}
            </select>
          )}

          <ExportReportDropdown data={filteredRecords} meta={exportMeta} />
        </div>
      </div>

      {/* Empty State Banner if no records exist in store */}
      {!loading && allRecords.length === 0 ? (
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
        <>
          {/* KPI Stat Cards (derived 100% from store records) */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            <MetricCard
              label="TOTAL INSPECTED"
              value={formatNumber(totalInspected)}
              subtitle={`${filterMode === 'day' ? `${selectedYear}-${selectedMonth}-${selectedDay}` : filterMode === 'month' ? `${MONTH_NAMES[selectedMonth - 1]} ${selectedYear}` : `${selectedYear}`}`}
              trend={totalInspected > 0 ? { value: `${totalInspected} records`, isPositive: true } : undefined}
            />
            <MetricCard
              label="PASSED (GOOD)"
              value={formatNumber(acceptedCount)}
              subtitle="Cleared for assembly"
              trend={totalInspected > 0 ? { value: `${firstTimeRightPct.toFixed(1)}% yield`, isPositive: true } : undefined}
            />
            <MetricCard
              label="REJECTED (NOT GOOD)"
              value={formatNumber(rejectedCount)}
              subtitle="Quarantined to bin"
              highlight={rejectedCount > 0}
              trend={rejectedCount > 0 ? { value: `${rejectedCount} defective`, isPositive: false } : undefined}
            />
            <MetricCard
              label="FIRST TIME RIGHT (FTR)"
              value={totalInspected > 0 ? `${firstTimeRightPct.toFixed(1)}%` : '—'}
              subtitle="Target: >98.0%"
              trend={totalInspected > 0 ? { value: firstTimeRightPct >= 98.0 ? 'Meets target' : 'Below target', isPositive: firstTimeRightPct >= 98.0 } : undefined}
            />
            <MetricCard
              label="DEFECT PPM"
              value={totalInspected > 0 ? formatPpm(ppmDefective) : '0 PPM'}
              subtitle="Parts Per Million"
              trend={totalInspected > 0 ? { value: ppmDefective < 20000 ? 'Within limit' : 'Elevated', isPositive: ppmDefective < 20000 } : undefined}
            />
          </div>

          {/* Main Analytics Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Adaptive Trend Chart (Hourly for Day, Daily for Month, Monthly for Year) */}
            <div className="lg:col-span-7 bg-white border border-[#D9DEE5] p-5 rounded-[4px] relative shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
              <CornerBrackets size={6} color="border-[#1D4ED8]" />
              <div className="flex items-center justify-between mb-4 text-xs font-sans">
                <div className="flex items-center gap-2">
                  <span className="text-[#0F172A] font-bold tracking-wider uppercase font-mono">
                    {filterMode === 'day'
                      ? `Hourly Throughput · ${selectedYear}-${String(selectedMonth).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`
                      : filterMode === 'month'
                      ? `Daily Throughput · ${MONTH_NAMES[selectedMonth - 1]} ${selectedYear}`
                      : `Monthly Throughput · Year ${selectedYear}`}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-[10px] font-sans font-medium">
                  <span className="text-[#1D4ED8] flex items-center gap-1 font-mono">
                    <span className="w-2 h-2 rounded-full bg-[#1D4ED8]" /> Inspected
                  </span>
                  <span className="text-[#DC2626] flex items-center gap-1 font-mono">
                    <span className="w-2 h-2 rounded-full bg-[#DC2626]" /> Rejected
                  </span>
                </div>
              </div>

              <div className="h-[17.5rem] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis dataKey="label" stroke="#64748B" tick={{ fill: '#475569', fontSize: tickFontSize }} />
                    <YAxis stroke="#64748B" tick={{ fill: '#475569', fontSize: tickFontSize }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#FFFFFF',
                        borderColor: '#D9DEE5',
                        borderRadius: '0.1875rem',
                        fontFamily: 'JetBrains Mono, monospace',
                        fontSize: `${tickFontSizeMd}px`,
                        color: '#0F172A',
                        boxShadow: '0 1px 3px rgba(15,23,42,0.08)',
                      }}
                    />
                    <Area type="monotone" dataKey="inspected" stroke="#1D4ED8" strokeWidth={2} fill="#1D4ED8" fillOpacity={0.12} />
                    <Area type="monotone" dataKey="rejected" stroke="#DC2626" strokeWidth={2} fill="#DC2626" fillOpacity={0.2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-3 pt-2 border-t border-[#D9DEE5] text-[0.6875rem] font-mono text-[#64748B] flex items-center justify-between">
                <span>Filter scope: {filterMode.toUpperCase()}</span>
                <span>Active timezone: Asia/Kolkata (IST)</span>
              </div>
            </div>

            {/* Horizontal Bar Chart of Defects by Class */}
            <div className="lg:col-span-5 bg-white border border-[#D9DEE5] p-5 rounded-[0.25rem] relative shadow-[0_1px_2px_rgba(15,23,42,0.04)] flex flex-col justify-between">
              <CornerBrackets size={6} color="border-[#1D4ED8]" />
              <div>
                <div className="flex items-center justify-between mb-4 text-xs font-sans">
                  <span className="text-[#0F172A] font-bold tracking-wider uppercase font-mono">
                    Defects by Class
                  </span>
                  <span className="text-[#64748B] font-mono text-[0.625rem]">
                    {filteredRecords.reduce((acc, r) => acc + (r.defects?.length || 0), 0)} TOTAL ANOMALIES
                  </span>
                </div>

                <div className="h-[17.5rem] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      layout="vertical"
                      data={defectCountsByClass}
                      margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                      <XAxis type="number" stroke="#64748B" tick={{ fill: '#475569', fontSize: tickFontSize }} />
                      <YAxis
                        type="category"
                        dataKey="class"
                        stroke="#64748B"
                        tick={{ fill: '#0F172A', fontSize: tickFontSizeMd, fontWeight: 500 }}
                        width={95}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#FFFFFF',
                          borderColor: '#D9DEE5',
                          borderRadius: '0.1875rem',
                          fontFamily: 'JetBrains Mono, monospace',
                          fontSize: `${tickFontSizeMd}px`,
                          color: '#0F172A',
                        }}
                      />
                      <Bar dataKey="count" fill="#DC2626" radius={[0, 4, 4, 0]} barSize={16} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="pt-3 border-t border-[#D9DEE5] font-mono text-[11px] text-[#64748B] flex items-center justify-between">
                <span>Classes tracked: 6 optical categories</span>
                <span className="text-[#DC2626] font-semibold">Automotive standard</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Production;

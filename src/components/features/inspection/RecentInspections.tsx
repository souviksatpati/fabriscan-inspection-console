import React from 'react';
import { InspectionRecord } from '@/services/inspectionStore';
import { CornerBrackets } from '@/components/common/CornerBrackets';
import { Inbox } from 'lucide-react';

interface RecentInspectionsProps {
  inspections: InspectionRecord[];
  onSelectInspection?: (record: InspectionRecord) => void;
  activeId?: string;
  className?: string;
}

export const RecentInspections: React.FC<RecentInspectionsProps> = ({
  inspections,
  onSelectInspection,
  activeId,
  className,
}) => {
  const formatLocalTime = (isoString?: string) => {
    if (!isoString) return '—';
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString('en-IN', {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div
      className={`relative bg-white border border-[#D9DEE5] rounded-[0.25rem] p-4 flex flex-col shadow-[0_1px_2px_rgba(15,23,42,0.04)] ${
        className || ''
      }`}
    >
      <CornerBrackets size={6} color="border-[#1D4ED8]" />

      <div className="flex items-center justify-between mb-3 border-b border-[#D9DEE5] pb-2">
        <div className="flex items-center gap-2">
          <span className="font-sans text-[#475569] text-[0.6875rem] font-semibold uppercase tracking-wider">
            RECENT INSPECTIONS
          </span>
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              inspections.length > 0 ? 'bg-[#15803D]' : 'bg-[#64748B]'
            }`}
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-[0.625rem] text-[#64748B]">
            STORE BUFFER: {inspections.length}
          </span>
        </div>
      </div>

      {inspections.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 px-4 text-center border border-dashed border-[#D9DEE5] rounded-[0.1875rem] bg-[#F8FAFC]">
          <Inbox size={32} className="text-[#94A3B8] mb-2" />
          <p className="font-mono text-xs font-bold text-[#0F172A] tracking-wider uppercase">
            NO INSPECTIONS RECORDED
          </p>
          <p className="font-sans text-xs text-[#64748B] mt-1 max-w-sm">
            Records appear when the AI model sends results.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto border border-[#D9DEE5] rounded-[0.1875rem]">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="bg-[#F5F7FA] border-b border-[#D9DEE5] text-[#475569] text-[0.625rem] uppercase font-sans font-semibold">
                <th className="px-3 py-2">Part Serial</th>
                <th className="px-3 py-2">Time (IST)</th>
                <th className="px-3 py-2">Batch</th>
                <th className="px-3 py-2">Part Type</th>
                <th className="px-3 py-2">Defect Triggered</th>
                <th className="px-3 py-2 text-right">Verdict</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D9DEE5] bg-white">
              {inspections.slice(0, 10).map((record) => {
                const isSelected = activeId === record.id;
                const isGood = record.verdict === 'GOOD';
                const defectText =
                  record.defects && record.defects.length > 0
                    ? record.defects.map((d) => d.class).join(', ')
                    : 'NONE';

                return (
                  <tr
                    key={record.id}
                    onClick={() => onSelectInspection && onSelectInspection(record)}
                    className={`cursor-pointer transition-colors ${
                      isSelected ? 'bg-[#EFF6FF] text-[#0F172A]' : 'hover:bg-[#F5F7FA] text-[#0F172A]'
                    }`}
                  >
                    <td className="px-3 py-2.5 font-bold text-[#0F172A]">
                      {record.serial || record.id}
                    </td>
                    <td className="px-3 py-2.5 text-[#64748B]">
                      {formatLocalTime(record.scannedAt)}
                    </td>
                    <td className="px-3 py-2.5 text-[#475569]">{record.batchId}</td>
                    <td className="px-3 py-2.5 text-[#475569]">{record.partType}</td>
                    <td className="px-3 py-2.5">
                      <span
                        className={`inline-block px-1.5 py-0.5 rounded-[0.125rem] text-[0.625rem] font-medium ${
                          !isGood
                            ? 'bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA]'
                            : 'text-[#64748B]'
                        }`}
                      >
                        {defectText}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-right">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-[0.125rem] text-[0.625rem] font-bold uppercase ${
                          isGood
                            ? 'bg-[#DCFCE7] text-[#15803D] border border-[#BBF7D0]'
                            : 'bg-[#FEE2E2] text-[#DC2626] border border-[#FECACA]'
                        }`}
                      >
                        {record.verdict}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RecentInspections;

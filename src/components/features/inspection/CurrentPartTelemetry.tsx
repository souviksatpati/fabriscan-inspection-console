import React from 'react';
import { InspectionRecord } from '@/services/inspectionStore';
import { CornerBrackets } from '@/components/common/CornerBrackets';
import { Flag, CheckCircle2, ShieldAlert } from 'lucide-react';

interface CurrentPartTelemetryProps {
  inspection: InspectionRecord | null;
  scannerName?: string;
  className?: string;
}

export const CurrentPartTelemetry: React.FC<CurrentPartTelemetryProps> = ({
  inspection,
  scannerName,
  className,
}) => {
  if (!inspection) {
    return (
      <div className={`relative bg-white border border-[#D9DEE5] rounded-[4px] p-6 flex flex-col items-center justify-center min-h-[360px] text-center shadow-[0_1px_2px_rgba(15,23,42,0.04)] ${className || ''}`}>
        <CornerBrackets size={8} color="border-[#1D4ED8]" />
        <div className="w-12 h-12 rounded-full bg-[#F5F7FA] border border-[#D9DEE5] flex items-center justify-center mb-3">
          <ShieldAlert size={22} className="text-[#64748B]" />
        </div>
        <span className="font-mono text-xs font-bold text-[#0F172A] tracking-wider uppercase">
          AWAITING PART TELEMETRY
        </span>
        <p className="font-sans text-xs text-[#64748B] max-w-xs mt-1">
          No active scan registered. Trigger an edge camera scan or import inspection records to stream telemetry.
        </p>
      </div>
    );
  }

  const isNotGood = inspection.verdict === 'NOT_GOOD';
  const defectTriggered =
    inspection.defects && inspection.defects.length > 0
      ? inspection.defects.map((d) => d.class).join(', ')
      : 'NONE';

  const scannerDisplay = scannerName || inspection.scannerId || 'GigE Vision Sensor 01';

  return (
    <div
      className={`relative bg-white border border-[#D9DEE5] rounded-[4px] p-5 flex flex-col gap-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] ${
        className || ''
      }`}
    >
      <CornerBrackets size={8} color="border-[#1D4ED8]" />

      {/* Header */}
      <div className="border-b border-[#D9DEE5] pb-3">
        <span className="text-[#1D4ED8] text-[11px] font-bold uppercase tracking-wider block font-sans">
          CURRENT PART TELEMETRY
        </span>
        <div className="flex items-baseline justify-between mt-1">
          <h3 className="font-mono text-lg font-bold text-[#0F172A] tracking-tight">
            {inspection.serial}
          </h3>
          <span
            className={`font-mono text-xs font-bold px-2 py-0.5 rounded-[3px] border uppercase ${
              isNotGood
                ? 'bg-[#FEF2F2] border-[#FECACA] text-[#DC2626]'
                : 'bg-[#F0FDF4] border-[#BBF7D0] text-[#15803D]'
            }`}
          >
            {inspection.verdict}
          </span>
        </div>
      </div>

      {/* Prominent Verdict / Flag Block */}
      {isNotGood ? (
        <div
          role="alert"
          className="bg-[#FEF2F2] border-2 border-[#DC2626] rounded-[6px] p-4 flex items-center gap-3.5 text-[#DC2626] shadow-sm animate-in fade-in duration-200"
        >
          <div className="w-11 h-11 rounded-[4px] bg-[#FEE2E2] border border-[#FECACA] flex items-center justify-center shrink-0">
            <Flag size={24} className="fill-[#DC2626] text-[#DC2626]" />
          </div>
          <div>
            <div className="font-mono text-base font-black tracking-wide uppercase text-[#B91C1C]">
              NOT ACCEPTED - REJECTED
            </div>
            <p className="text-xs text-[#991B1B] font-sans mt-0.5 font-medium">
              Defects detected exceeding automotive stamping tolerance threshold. Actuator notified.
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-[#F0FDF4] border border-[#86EFAC] rounded-[6px] p-4 flex items-center gap-3.5 text-[#15803D] shadow-sm">
          <div className="w-11 h-11 rounded-[4px] bg-[#DCFCE7] border border-[#BBF7D0] flex items-center justify-center shrink-0">
            <CheckCircle2 size={24} className="text-[#15803D]" />
          </div>
          <div>
            <div className="font-mono text-base font-black tracking-wide uppercase text-[#15803D]">
              ACCEPTED - GOOD
            </div>
            <p className="text-xs text-[#166534] font-sans mt-0.5 font-medium">
              Zero surface anomalies detected. Cleared for downstream stamping assembly.
            </p>
          </div>
        </div>
      )}

      {/* Telemetry Specification Fields: ONLY Part Serial, Station, Scanner, Batch ID, Scanning Part Type, Defect Triggered */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 font-mono text-xs">
        {/* 1. Part Serial */}
        <div className="bg-[#F5F7FA] border border-[#D9DEE5] p-2.5 rounded-[3px]">
          <span className="text-[#64748B] text-[10px] uppercase font-sans font-semibold block tracking-wider">
            Part Serial
          </span>
          <span className="text-[#0F172A] font-bold truncate block mt-0.5 font-mono text-sm">
            {inspection.serial}
          </span>
        </div>

        {/* 2. Station */}
        <div className="bg-[#F5F7FA] border border-[#D9DEE5] p-2.5 rounded-[3px]">
          <span className="text-[#64748B] text-[10px] uppercase font-sans font-semibold block tracking-wider">
            Station
          </span>
          <span className="text-[#0F172A] font-bold truncate block mt-0.5 font-mono text-sm">
            {inspection.stationId || 'ST-04'}
          </span>
        </div>

        {/* 3. Scanner */}
        <div className="bg-[#F5F7FA] border border-[#D9DEE5] p-2.5 rounded-[3px]">
          <span className="text-[#64748B] text-[10px] uppercase font-sans font-semibold block tracking-wider">
            Scanner
          </span>
          <span className="text-[#0F172A] font-bold truncate block mt-0.5 font-mono text-sm" title={scannerDisplay}>
            {scannerDisplay}
          </span>
        </div>

        {/* 4. Batch ID */}
        <div className="bg-[#F5F7FA] border border-[#D9DEE5] p-2.5 rounded-[3px]">
          <span className="text-[#64748B] text-[10px] uppercase font-sans font-semibold block tracking-wider">
            Batch ID
          </span>
          <span className="text-[#0F172A] font-bold truncate block mt-0.5 font-mono text-sm">
            {inspection.batchId}
          </span>
        </div>

        {/* 5. Scanning Part Type */}
        <div className="bg-[#F5F7FA] border border-[#D9DEE5] p-2.5 rounded-[3px] sm:col-span-2">
          <span className="text-[#64748B] text-[10px] uppercase font-sans font-semibold block tracking-wider">
            Scanning Part Type
          </span>
          <span className="text-[#0F172A] font-bold truncate block mt-0.5 font-mono text-sm">
            {inspection.partType}
          </span>
        </div>

        {/* 6. Defect Triggered */}
        <div
          className={`border p-2.5 rounded-[3px] sm:col-span-2 ${
            isNotGood
              ? 'bg-[#FEF2F2] border-[#FECACA]'
              : 'bg-[#F5F7FA] border-[#D9DEE5]'
          }`}
        >
          <span className="text-[#64748B] text-[10px] uppercase font-sans font-semibold block tracking-wider">
            Defect Triggered
          </span>
          <span
            className={`font-bold truncate block mt-0.5 font-mono text-sm ${
              isNotGood ? 'text-[#DC2626]' : 'text-[#15803D]'
            }`}
          >
            {defectTriggered}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CurrentPartTelemetry;

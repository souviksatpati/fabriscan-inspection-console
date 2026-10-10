import React, { useState } from 'react';
import { InspectionRecord } from '../../services/inspectionStore';
import { exportExcel, exportPdf, ReportMetadata } from '../../services/reportExport';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Button } from '../ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { Download, FileSpreadsheet, FileText, ChevronDown, Loader2 } from 'lucide-react';

export interface ExportReportDropdownProps {
  data: InspectionRecord[];
  meta?: ReportMetadata;
  disabled?: boolean;
  className?: string;
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export const ExportReportDropdown: React.FC<ExportReportDropdownProps> = ({
  data,
  meta,
  disabled = false,
  className = '',
  size = 'sm',
}) => {
  const [isExporting, setIsExporting] = useState<'excel' | 'pdf' | null>(null);

  const isDisabled = disabled || data.length === 0;

  const handleExportExcel = async () => {
    if (isDisabled || isExporting) return;
    try {
      setIsExporting('excel');
      await exportExcel(data, meta);
    } catch (err) {
      console.error('Failed to export Excel report:', err);
    } finally {
      setIsExporting(null);
    }
  };

  const handleExportPdf = async () => {
    if (isDisabled || isExporting) return;
    try {
      setIsExporting('pdf');
      await exportPdf(data, meta);
    } catch (err) {
      console.error('Failed to export PDF report:', err);
    } finally {
      setIsExporting(null);
    }
  };

  if (isDisabled) {
    return (
      <TooltipProvider delayDuration={200}>
        <Tooltip>
          <TooltipTrigger asChild>
            <span tabIndex={0} className="inline-block cursor-not-allowed">
              <Button
                variant="outline"
                size={size}
                disabled
                className={`gap-1.5 font-sans text-xs bg-white border-[#D9DEE5] text-[#94A3B8] opacity-60 pointer-events-none ${className}`}
              >
                <Download size={13} />
                <span>Export Report</span>
                <ChevronDown size={12} className="opacity-50" />
              </Button>
            </span>
          </TooltipTrigger>
          <TooltipContent side="top" className="text-xs font-sans">
            No inspection records available to export
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size={size}
          disabled={isExporting !== null}
          className={`gap-1.5 font-sans text-xs bg-white hover:bg-[#F5F7FA] border-[#D9DEE5] text-[#0F172A] shadow-xs cursor-pointer ${className}`}
        >
          {isExporting ? (
            <Loader2 size={13} className="animate-spin text-[#1D4ED8]" />
          ) : (
            <Download size={13} className="text-[#1D4ED8]" />
          )}
          <span>{isExporting ? 'Exporting...' : 'Export Report'}</span>
          <ChevronDown size={12} className="text-[#64748B]" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-48 bg-white border border-[#D9DEE5] p-1 shadow-lg text-xs font-sans z-50">
        <DropdownMenuItem
          onClick={handleExportExcel}
          className="flex items-center gap-2.5 px-3 py-2 text-[#0F172A] hover:bg-[#F5F7FA] rounded-[0.1875rem] cursor-pointer"
        >
          <FileSpreadsheet size={15} className="text-[#15803D]" />
          <div className="flex flex-col">
            <span className="font-semibold text-xs">Excel Workbook</span>
            <span className="text-[0.625rem] text-[#64748B] font-mono">.xlsx (4 sheets)</span>
          </div>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={handleExportPdf}
          className="flex items-center gap-2.5 px-3 py-2 text-[#0F172A] hover:bg-[#F5F7FA] rounded-[0.1875rem] cursor-pointer"
        >
          <FileText size={15} className="text-[#DC2626]" />
          <div className="flex flex-col">
            <span className="font-semibold text-xs">PDF Document</span>
            <span className="text-[0.625rem] text-[#64748B] font-mono">.pdf (A4 Landscape)</span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ExportReportDropdown;

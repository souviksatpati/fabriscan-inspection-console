import React, { useState, useEffect } from 'react';
import { batchService, PART_TYPES, STATIONS, BatchConfig } from '@/services/batchService';
import { queryInspections } from '@/services/inspectionStore';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { PlayCircle, Barcode, CheckCircle2 } from 'lucide-react';

interface StartBatchDialogProps {
  onBatchStarted?: (config: BatchConfig, startingSerial: string) => void;
  className?: string;
}

export const StartBatchDialog: React.FC<StartBatchDialogProps> = ({
  onBatchStarted,
  className,
}) => {
  const [open, setOpen] = useState(false);
  const currentConfig = batchService.getConfig();

  const [batchId, setBatchId] = useState(currentConfig.batchId);
  const [partType, setPartType] = useState(currentConfig.partType);
  const [station, setStation] = useState(currentConfig.station);
  const [manualSerial, setManualSerial] = useState('');
  const [suggestedSerial, setSuggestedSerial] = useState('MF-2026-10-00100');

  // Compute next auto-increment serial from store
  useEffect(() => {
    if (!open) return;
    const computeNextSerial = async () => {
      const records = await queryInspections({ batchId });
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const basePrefix = `MF-${year}-${month}-`;

      let maxNum = 100;
      records.forEach((r) => {
        if (r.serial && r.serial.startsWith(basePrefix)) {
          const numPart = parseInt(r.serial.slice(basePrefix.length), 10);
          if (!isNaN(numPart) && numPart >= maxNum) {
            maxNum = numPart + 1;
          }
        }
      });

      const next = `${basePrefix}${String(maxNum).padStart(5, '0')}`;
      setSuggestedSerial(next);
      if (!manualSerial) {
        setManualSerial(next);
      }
    };

    computeNextSerial();
  }, [open, batchId, manualSerial]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = batchService.setBatch({
      batchId: batchId.trim() || 'BATCH-DEFAULT',
      partType,
      station,
    });

    const serialToUse = manualSerial.trim() || suggestedSerial;
    if (onBatchStarted) {
      onBatchStarted(updated, serialToUse);
    }
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={`gap-1.5 text-xs font-sans bg-white border-[#D9DEE5] text-[#0F172A] hover:bg-[#F5F7FA] ${className || ''}`}
        >
          <PlayCircle size={14} className="text-[#1D4ED8]" />
          <span>Start Batch</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md bg-white border border-[#D9DEE5] text-[#0F172A] font-sans">
        <DialogHeader>
          <DialogTitle className="text-base font-bold text-[#0F172A] flex items-center gap-2">
            <PlayCircle size={18} className="text-[#1D4ED8]" />
            <span>Configure &amp; Start Production Batch</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2 text-xs">
          {/* Batch ID */}
          <div>
            <label className="block text-xs font-semibold text-[#0F172A] mb-1">
              Batch Identifier (Lot #)
            </label>
            <input
              type="text"
              value={batchId}
              onChange={(e) => setBatchId(e.target.value)}
              placeholder="e.g. BATCH-2026-10-B"
              required
              className="w-full h-10 px-3 rounded-[4px] bg-[#F1F3F8] border border-transparent text-[#0F172A] font-mono text-xs focus:ring-2 focus:ring-[#1D4ED8] focus:outline-none"
            />
          </div>

          {/* Part Type Select */}
          <div>
            <label className="block text-xs font-semibold text-[#0F172A] mb-1">
              Scanning Part Type
            </label>
            <select
              value={partType}
              onChange={(e) => setPartType(e.target.value)}
              className="w-full h-10 px-3 rounded-[4px] bg-[#F1F3F8] border border-transparent text-[#0F172A] text-xs focus:ring-2 focus:ring-[#1D4ED8] focus:outline-none font-sans"
            >
              {PART_TYPES.map((pt) => (
                <option key={pt} value={pt}>
                  {pt}
                </option>
              ))}
            </select>
          </div>

          {/* Station Select */}
          <div>
            <label className="block text-xs font-semibold text-[#0F172A] mb-1">
              Line / Station Assignment
            </label>
            <select
              value={station}
              onChange={(e) => setStation(e.target.value)}
              className="w-full h-10 px-3 rounded-[4px] bg-[#F1F3F8] border border-transparent text-[#0F172A] text-xs focus:ring-2 focus:ring-[#1D4ED8] focus:outline-none font-sans"
            >
              {STATIONS.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          {/* Part Serial (Auto-increments or Manual / Barcode input) */}
          <div className="pt-2 border-t border-[#D9DEE5]">
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-[#0F172A] flex items-center gap-1.5">
                <Barcode size={14} className="text-[#1D4ED8]" />
                <span>Next Part Serial Number</span>
              </label>
              <button
                type="button"
                onClick={() => setManualSerial(suggestedSerial)}
                className="text-[10px] text-[#1D4ED8] hover:underline"
              >
                Auto-increment: {suggestedSerial}
              </button>
            </div>
            <input
              type="text"
              value={manualSerial}
              onChange={(e) => setManualSerial(e.target.value)}
              placeholder={suggestedSerial}
              className="w-full h-10 px-3 rounded-[4px] bg-[#F1F3F8] border border-transparent text-[#0F172A] font-mono text-xs focus:ring-2 focus:ring-[#1D4ED8] focus:outline-none"
            />
            <p className="text-[10px] text-[#64748B] mt-1 font-sans">
              Type manually or trigger a 2D barcode handheld scanner.
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-[#D9DEE5]">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="default" size="sm" className="gap-1.5">
              <CheckCircle2 size={14} />
              <span>Confirm &amp; Activate Batch</span>
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default StartBatchDialog;

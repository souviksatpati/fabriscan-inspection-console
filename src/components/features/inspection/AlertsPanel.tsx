import React from 'react';
import { SystemAlert } from '@/types/alert';
import { StatusBadge } from '@/components/common/StatusBadge';
import { formatTime } from '@/lib/format';
import { CornerBrackets } from '@/components/common/CornerBrackets';
import { Bell, Check } from 'lucide-react';

interface AlertsPanelProps {
  alerts: SystemAlert[];
  onAcknowledge?: (alertId: string) => void;
  className?: string;
}

export const AlertsPanel: React.FC<AlertsPanelProps> = ({
  alerts,
  onAcknowledge,
  className,
}) => {
  const activeAlerts = alerts.filter((a) => !a.acknowledged);

  return (
    <div
      className={`relative bg-white border border-[#D9DEE5] rounded-[4px] p-4 flex flex-col shadow-[0_1px_2px_rgba(15,23,42,0.04)] ${className}`}
    >
      <CornerBrackets size={6} color="border-[#1D4ED8]" />

      <div className="flex items-center justify-between mb-3 border-b border-[#D9DEE5] pb-2">
        <div className="flex items-center gap-2">
          <Bell size={14} className="text-[#B45309]" />
          <span className="font-sans text-[#475569] text-[11px] font-semibold uppercase tracking-wider">
            EDGE ALERTS & NOTIFICATIONS
          </span>
        </div>
        {activeAlerts.length > 0 && (
          <span className="font-mono text-[10px] px-1.5 py-0.5 rounded-[2px] bg-[#FEF2F2] border border-[#FECACA] text-[#B91C1C] font-bold uppercase">
            {activeAlerts.length} UNACKNOWLEDGED
          </span>
        )}
      </div>

      <div className="space-y-2.5 overflow-y-auto max-h-[280px] pr-1">
        {alerts.length === 0 ? (
          <div className="text-center py-6 text-[#64748B] font-mono text-xs">
            NO ACTIVE ALERTS
          </div>
        ) : (
          alerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-2.5 rounded-[3px] border transition-all text-xs flex items-start justify-between gap-3 ${
                alert.severity === 'CRITICAL'
                  ? 'bg-[#FEF2F2] border-[#FECACA]'
                  : alert.severity === 'WARNING'
                  ? 'bg-[#FFFBEB] border-[#FDE68A]'
                  : 'bg-[#F5F7FA] border-[#D9DEE5]'
              } ${alert.acknowledged ? 'opacity-60' : 'opacity-100'}`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <StatusBadge status={alert.status} size="sm" showIcon={false} />
                  <span className="text-[10px] text-[#64748B] font-sans font-medium uppercase">{alert.category}</span>
                  <span className="text-[10px] text-[#64748B] font-mono">{formatTime(alert.timestamp)}</span>
                </div>
                <p className="text-[#0F172A] font-sans text-xs leading-normal">{alert.message}</p>
                {alert.actionRequired && (
                  <div className="text-[11px] text-[#B45309] font-mono font-medium">
                    Action: {alert.actionRequired}
                  </div>
                )}
              </div>

              {!alert.acknowledged && onAcknowledge && (
                <button
                  onClick={() => onAcknowledge(alert.id)}
                  className="shrink-0 p-1.5 rounded-[2px] bg-white border border-[#D9DEE5] hover:bg-[#F5F7FA] text-[#0F172A] transition-colors cursor-pointer"
                  title="Acknowledge alert"
                >
                  <Check size={12} />
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

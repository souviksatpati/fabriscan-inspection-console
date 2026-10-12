import React, { useState, useEffect } from 'react';
import { StatusBadge } from '../common/StatusBadge';
import { UserMenu } from './UserMenu';
import { Radio, Camera, Cpu, Menu } from 'lucide-react';
import { Button } from '../ui/button';
import { cameraStateService, CameraConnectionStatus, AIModelStatus } from '../../services/cameraState';

interface TopBarProps {
  onToggleSidebar?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onToggleSidebar }) => {
  const [timeStr, setTimeStr] = useState<string>('');
  const [cameraStatus, setCameraStatus] = useState<CameraConnectionStatus>(cameraStateService.getStatus());
  const [aiStatus, setAiStatus] = useState<AIModelStatus>(cameraStateService.getAIStatus());

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toTimeString().split(' ')[0] + ' IST');
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const unsubscribe = cameraStateService.subscribe(() => {
      setCameraStatus(cameraStateService.getStatus());
      setAiStatus(cameraStateService.getAIStatus());
    });
    return unsubscribe;
  }, []);

  const getCameraBadge = () => {
    switch (cameraStatus) {
      case 'READY':
        return {
          text: 'READY',
          className: 'bg-[#F0FDF4] border-[#BBF7D0] text-[#15803D]',
        };
      case 'INITIALIZING':
        return {
          text: 'INITIALIZING',
          className: 'bg-[#EFF6FF] border-[#BFDBFE] text-[#1D4ED8]',
        };
      case 'PERMISSION_REQUIRED':
        return {
          text: 'PERMISSION REQ',
          className: 'bg-[#FFFBEB] border-[#FDE68A] text-[#B45309]',
        };
      case 'DISCONNECTED':
        return {
          text: 'DISCONNECTED',
          className: 'bg-[#FEF2F2] border-[#FECACA] text-[#DC2626]',
        };
      case 'NO_CAMERA':
        return {
          text: 'NO CAMERA',
          className: 'bg-[#FEF2F2] border-[#FECACA] text-[#DC2626]',
        };
      case 'IN_USE':
        return {
          text: 'IN USE',
          className: 'bg-[#FFFBEB] border-[#FDE68A] text-[#B45309]',
        };
      default:
        return {
          text: 'STANDBY',
          className: 'bg-[#F5F7FA] border-[#D9DEE5] text-[#64748B]',
        };
    }
  };

  const camBadge = getCameraBadge();

  return (
    <header className="h-14 bg-white border-b border-[#D9DEE5] px-4 flex items-center justify-between gap-3 shrink-0 z-30 select-none">
      <div className="flex items-center gap-3">
        {onToggleSidebar && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleSidebar}
            className="md:hidden h-8 w-8 text-[#475569] hover:text-[#0F172A]"
            aria-label="Toggle navigation menu"
          >
            <Menu size={18} />
          </Button>
        )}

        {/* Line Station Pill */}
        <div className="flex items-center gap-2 bg-[#F5F7FA] border border-[#D9DEE5] px-2.5 py-1 rounded-[3px] font-sans text-xs">
          <span className="text-[#0F172A] font-bold tracking-wider">PRESS LINE 04</span>
          <span className="text-[#CBD5E1]">|</span>
          <StatusBadge status="RUNNING" size="sm" />
        </div>

        {/* Real Hardware & Model States */}
        <div className="hidden lg:flex items-center gap-2">
          {/* Real Camera State */}
          <div
            className={`flex items-center gap-1.5 border px-2 py-0.5 rounded-[2px] font-mono text-[10px] ${camBadge.className}`}
          >
            <Camera size={11} className="shrink-0" />
            <span className="font-semibold">CAMERA: {camBadge.text}</span>
          </div>

          {/* Real AI Model State */}
          <div
            className={`flex items-center gap-1.5 border px-2 py-0.5 rounded-[2px] font-mono text-[10px] ${
              aiStatus === 'READY'
                ? 'bg-[#F0FDF4] border-[#BBF7D0] text-[#15803D]'
                : 'bg-[#F5F7FA] border-[#D9DEE5] text-[#64748B]'
            }`}
          >
            <Cpu size={11} className="shrink-0" />
            <span className="font-semibold">
              AI MODEL: {aiStatus === 'READY' ? 'READY' : 'NOT CONNECTED'}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Real-time Clock */}
        <div className="hidden sm:flex items-center gap-2 font-mono text-xs text-[#475569] bg-[#F5F7FA] border border-[#D9DEE5] px-2.5 py-1 rounded-[3px]">
          <Radio size={12} className="text-[#15803D] animate-pulse" />
          <span className="text-[#0F172A] font-medium">{timeStr}</span>
        </div>

        {/* User Role Profile Menu */}
        <UserMenu />
      </div>
    </header>
  );
};

export default TopBar;

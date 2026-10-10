import React, { useState } from 'react';
import { CornerBrackets } from '../../components/common/CornerBrackets';
import { Button } from '../../components/ui/button';
import { Switch } from '../../components/ui/switch';
import { Settings as SettingsIcon, Save, CheckCircle2 } from 'lucide-react';

export const Settings: React.FC = () => {
  const [autoQuarantine, setAutoQuarantine] = useState(true);
  const [audioAlarms, setAudioAlarms] = useState(true);
  const [strictTolerance, setStrictTolerance] = useState(true);
  const [displayDensity, setDisplayDensity] = useState<'compact' | 'comfortable'>('compact');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="flex flex-col gap-6 font-sans select-none pb-12 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D9DEE5] pb-4">
        <div>
          <div className="flex items-center gap-2 font-sans text-xs text-[#1D4ED8]">
            <SettingsIcon size={14} />
            <span className="uppercase tracking-wider font-semibold">
              LINE OPERATIONAL PREFERENCES
            </span>
          </div>
          <h1 className="text-2xl font-bold text-[#0F172A] mt-1">Line Settings &amp; Rules</h1>
          <p className="text-xs text-[#475569] mt-1">
            Configure automated pneumatic divert rules, operator station audio chimes, and UI density
            for industrial touch-screen panel PCs.
          </p>
        </div>

        {saved && (
          <div className="bg-[#F0FDF4] border border-[#BBF7D0] text-[#15803D] font-sans font-semibold text-xs px-3 py-1.5 rounded-[3px] flex items-center gap-2 self-start sm:self-auto">
            <CheckCircle2 size={14} /> Settings Saved
          </div>
        )}
      </div>

      {/* Settings Sections */}
      <div className="space-y-6">
        {/* 1. Actuation Rules */}
        <div className="bg-white border border-[#D9DEE5] p-5 rounded-[4px] relative shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
          <CornerBrackets size={6} color="border-[#1D4ED8]" />
          <h3 className="font-bold text-[#1D4ED8] text-sm mb-4 font-sans uppercase tracking-wider">
            Automated Rejection Actuator Policies
          </h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-[#0F172A]">
                  Automatic Pneumatic Diverter Pulse
                </div>
                <div className="text-[11px] text-[#475569]">
                  Instantly assert 24V PLC solenoid pulse on CRITICAL or MAJOR defect detection.
                </div>
              </div>
              <Switch checked={autoQuarantine} onCheckedChange={setAutoQuarantine} />
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[#D9DEE5]">
              <div>
                <div className="text-xs font-semibold text-[#0F172A]">
                  Strict Class-A Zone Zero Tolerance
                </div>
                <div className="text-[11px] text-[#475569]">
                  Reject any panel with tooling score mark exceeding 2.0 mm on outer skin styling creases.
                </div>
              </div>
              <Switch checked={strictTolerance} onCheckedChange={setStrictTolerance} />
            </div>
          </div>
        </div>

        {/* 2. Audio & Notifications */}
        <div className="bg-white border border-[#D9DEE5] p-5 rounded-[4px] relative shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
          <CornerBrackets size={6} color="border-[#1D4ED8]" />
          <h3 className="font-bold text-[#1D4ED8] text-sm mb-4 font-sans uppercase tracking-wider">
            Auditory &amp; Alarm Alerts
          </h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-[#0F172A]">
                  Audible Alarm Chime on Rejection
                </div>
                <div className="text-[11px] text-[#475569]">
                  Emit 85dB industrial buzzer tone through panel PC speakers when part is actuated.
                </div>
              </div>
              <Switch checked={audioAlarms} onCheckedChange={setAudioAlarms} />
            </div>
          </div>
        </div>

        {/* 3. Panel PC Display Density */}
        <div className="bg-white border border-[#D9DEE5] p-5 rounded-[4px] relative font-sans text-xs shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
          <CornerBrackets size={6} color="border-[#1D4ED8]" />
          <h3 className="font-bold text-[#1D4ED8] text-sm mb-4 uppercase tracking-wider font-sans">
            Control Room UI Display Density
          </h3>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setDisplayDensity('compact')}
              className={`px-4 py-2 rounded-[3px] border transition-colors ${
                displayDensity === 'compact'
                  ? 'bg-[#EFF6FF] border-[#1D4ED8] text-[#1D4ED8] font-bold ring-1 ring-[#1D4ED8]'
                  : 'bg-white border-[#D9DEE5] text-[#475569] hover:bg-[#F5F7FA]'
              }`}
            >
              Compact (Dense High-Information Display)
            </button>
            <button
              onClick={() => setDisplayDensity('comfortable')}
              className={`px-4 py-2 rounded-[3px] border transition-colors ${
                displayDensity === 'comfortable'
                  ? 'bg-[#EFF6FF] border-[#1D4ED8] text-[#1D4ED8] font-bold ring-1 ring-[#1D4ED8]'
                  : 'bg-white border-[#D9DEE5] text-[#475569] hover:bg-[#F5F7FA]'
              }`}
            >
              Comfortable (Touch Screen Panel PC)
            </button>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-4">
          <Button onClick={handleSave} variant="default" size="lg" className="font-sans text-xs gap-2">
            <Save size={14} /> Commit Settings to Flash
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Settings;

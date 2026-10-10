import React from 'react';
import { CornerBrackets } from '../../components/common/CornerBrackets';
import { MetricCard } from '../../components/common/MetricCard';
import { Cpu, ShieldCheck } from 'lucide-react';
import { useRootFontSize } from '../../hooks/useRootFontSize';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

export const SystemHealth: React.FC = () => {
  const rootFontSize = useRootFontSize();
  const tickFontSize = Math.round(rootFontSize * 0.6875);

  const latencyHistogram = [
    { bucket: '20-24ms', count: 120 },
    { bucket: '24-28ms', count: 680 },
    { bucket: '28-32ms', count: 820 },
    { bucket: '32-36ms', count: 54 },
    { bucket: '36-40ms', count: 8 },
    { bucket: '>40ms', count: 2 },
  ];

  return (
    <div className="flex flex-col gap-6 font-sans select-none pb-12 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D9DEE5] pb-4">
        <div>
          <div className="flex items-center gap-2 font-sans text-xs text-[#1D4ED8]">
            <Cpu size={14} />
            <span className="uppercase tracking-wider font-semibold">
              EDGE HARDWARE &amp; NEURAL ACCELERATOR HEALTH
            </span>
            <span className="px-1.5 py-0.5 rounded-[0.125rem] bg-[#F5F7FA] border border-[#D9DEE5] text-[0.625rem] text-[#64748B] font-mono">
              Simulated data
            </span>
          </div>
          <h1 className="text-2xl font-bold text-[#0F172A] mt-1">System Health Diagnostics</h1>
          <p className="text-xs text-[#475569] mt-1">
            NVIDIA Jetson AGX Orin 64GB edge telemetry, GPU load, INT8 TensorRT inference latency,
            and Profinet PLC link monitoring.
          </p>
        </div>

        <div className="flex items-center gap-2 font-sans font-semibold text-xs bg-[#F0FDF4] border border-[#BBF7D0] text-[#15803D] px-3 py-1.5 rounded-[0.1875rem] self-start sm:self-auto">
          <ShieldCheck size={14} />
          <span>ALL EDGE CORES OPTIMAL</span>
        </div>
      </div>

      {/* Hardware Telemetry Gauges */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          label="NVIDIA GPU LOAD"
          value="48.2%"
          subtitle="2048 Ampere Cores"
          sparklineData={[42, 45, 49, 47, 48.2]}
          sparklineColor="#1D4ED8"
        />
        <MetricCard
          label="AI TENSOR ENGINE"
          value="28.4 ms"
          subtitle="99th %ile: 34.2ms"
          sparklineData={[28.1, 28.5, 28.2, 28.4]}
          sparklineColor="#1D4ED8"
        />
        <MetricCard
          label="EDGE SOC TEMP"
          value="52.4°C"
          subtitle="Fan: 3,200 RPM"
          sparklineData={[50, 51, 52, 52.4]}
          sparklineColor="#B45309"
        />
        <MetricCard
          label="UNIFIED RAM USAGE"
          value="18.6 GB"
          subtitle="Total: 64.0 GB LPDDR5"
          sparklineData={[18.4, 18.5, 18.6]}
          sparklineColor="#15803D"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Latency Distribution Histogram */}
        <div className="lg:col-span-8 bg-white border border-[#D9DEE5] p-5 rounded-[0.25rem] relative font-mono text-xs shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
          <CornerBrackets size={6} color="border-[#1D4ED8]" />
          <div className="flex items-center justify-between mb-4">
            <span className="text-[#0F172A] font-bold uppercase tracking-wider font-sans">
              YOLOv8-Seg Inference Latency Distribution (INT8 TensorRT)
            </span>
            <span className="text-[#1D4ED8] font-bold text-[0.625rem]">MEAN: 28.4ms</span>
          </div>

          <div className="h-[16.25rem] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={latencyHistogram} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <XAxis dataKey="bucket" stroke="#64748B" tick={{ fill: '#475569', fontSize: tickFontSize }} />
                <YAxis stroke="#64748B" tick={{ fill: '#475569', fontSize: tickFontSize }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderColor: '#D9DEE5',
                    borderRadius: '0.1875rem',
                    fontFamily: 'JetBrains Mono',
                    fontSize: `${tickFontSize}px`,
                    color: '#0F172A',
                    boxShadow: '0 1px 2px rgba(15,23,42,0.06)',
                  }}
                />
                <Bar dataKey="count" fill="#1D4ED8" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-3 pt-3 border-t border-[#D9DEE5] text-[0.6875rem] text-[#64748B] flex justify-between font-sans">
            <span>DESIGN TARGET: UNDER 35 MS</span>
            <span className="text-[#15803D] font-mono font-semibold">JITTER: ±2.1ms</span>
          </div>
        </div>

        {/* Industrial Subsystem Links */}
        <div className="lg:col-span-4 bg-white border border-[#D9DEE5] p-5 rounded-[0.25rem] relative flex flex-col justify-between font-mono text-xs shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
          <CornerBrackets size={6} color="border-[#1D4ED8]" />
          <div>
            <div className="text-[#0F172A] font-bold uppercase tracking-wider mb-4 border-b border-[#D9DEE5] pb-2 font-sans">
              Industrial Bus Telemetry
            </div>

            <div className="space-y-3">
              <div className="bg-[#F5F7FA] border border-[#D9DEE5] p-3 rounded-[0.1875rem]">
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="text-[#475569] font-sans">Profinet PLC Link:</span>
                  <span className="text-[#15803D] font-bold">ESTABLISHED</span>
                </div>
                <div className="text-[0.625rem] text-[#64748B]">Latency: 0.8ms : Cyclic Class B</div>
              </div>

              <div className="bg-[#F5F7FA] border border-[#D9DEE5] p-3 rounded-[0.1875rem]">
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="text-[#475569] font-sans">Solenoid Actuator:</span>
                  <span className="text-[#15803D] font-bold">READY (6.2 BAR)</span>
                </div>
                <div className="text-[0.625rem] text-[#64748B]">Response Pulse: 12ms : Last Fired: 13:42</div>
              </div>

              <div className="bg-[#F5F7FA] border border-[#D9DEE5] p-3 rounded-[0.1875rem]">
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="text-[#475569] font-sans">GigE Vision Switch:</span>
                  <span className="text-[#15803D] font-bold">10 Gbps FIBER</span>
                </div>
                <div className="text-[0.625rem] text-[#64748B]">M12 Industrial Connectors : 0 Drops</div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#D9DEE5] text-[0.625rem] text-[#64748B]">
            NVRAM STATUS: HEALTHY : UPTIME: 142 HOURS
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemHealth;

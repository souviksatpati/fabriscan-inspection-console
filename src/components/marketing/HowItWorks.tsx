import React from 'react';
import { Camera, Ruler, Scan, CheckCircle2, Zap, Database } from 'lucide-react';

interface Step {
  number: string;
  icon: React.ElementType;
  title: string;
  description: string;
}

const STEPS: Step[] = [
  {
    number: '01',
    icon: Camera,
    title: 'Capture',
    description: 'Industrial vision sensors capture high-resolution frames of stamped sheet metal parts as they advance through the inspection bay.',
  },
  {
    number: '02',
    icon: Ruler,
    title: 'Measure the defect',
    description: "Each detected defect is measured, so its size can be checked against the part's tolerance.",
  },
  {
    number: '03',
    icon: Scan,
    title: 'Detect with AI segmentation',
    description: 'Deep neural segmentation generates precise boundary masks and classifies anomalies across 6 industrial surface defect classes.',
  },
  {
    number: '04',
    icon: CheckCircle2,
    title: 'Decide GOOD / NOT GOOD',
    description: 'Calculated defect surface areas and severities are evaluated against defined stamping tolerances to determine final accept or reject status.',
  },
  {
    number: '05',
    icon: Zap,
    title: 'Reject and signal the actuator',
    description: 'Non-conforming parts trigger an immediate 24V hardware output signal to the plant PLC, activating the pneumatic reject diverter.',
  },
  {
    number: '06',
    icon: Database,
    title: 'Record and trace',
    description: 'Every inspection record—including part serial, batch, timestamp, defect class, area, and verdict—is stored for end-to-end quality traceability.',
  },
];

export const HowItWorks: React.FC = () => {
  return (
    <section id="how-it-works" className="scroll-mt-24 py-16 lg:py-24 px-4 sm:px-6 lg:px-8 bg-white border-t border-[#D9DEE5]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-10 lg:gap-16 items-start">
          {/* Left Column (sticky under navbar on lg) */}
          <div className="lg:sticky lg:top-28 self-start">
            <span className="font-mono text-xs font-semibold text-[#1D4ED8] tracking-wider uppercase block mb-2">
              INSPECTION PIPELINE
            </span>
            <h2 className="text-3xl sm:text-4xl font-semibold text-[#0F172A] tracking-tight font-sans mb-3">
              How it works
            </h2>
            <p className="text-sm sm:text-base text-[#475569] leading-relaxed font-sans max-w-md">
              From raw camera capture to physical part disposition on the stamping line in six deterministic inspection stages.
            </p>
          </div>

          {/* Right Column: Semantic <ol> with 6 steps and vertical connector rail */}
          <ol className="list-none m-0 p-0">
            {STEPS.map((step, index) => {
              const Icon = step.icon;
              const isLast = index === STEPS.length - 1;

              return (
                <li key={step.number} className="flex gap-4 sm:gap-6 relative group">
                  {/* Left Rail: Numbered circle + vertical connector line */}
                  <div className="flex flex-col items-center shrink-0">
                    <div className="w-8 h-8 rounded-full border border-[#D9DEE5] bg-[#F5F7FA] text-[#0F172A] font-mono text-xs font-bold flex items-center justify-center shrink-0 z-10 transition-colors group-hover:border-[#1D4ED8] group-hover:text-[#1D4ED8] group-hover:bg-[#EFF6FF]">
                      {step.number}
                    </div>
                    {!isLast && (
                      <div className="w-[1px] flex-1 bg-[#D9DEE5] my-1" />
                    )}
                  </div>

                  {/* Step Content: Icon, Title, Description */}
                  <div className={`flex-1 pt-0.5 ${isLast ? 'pb-0' : 'pb-8 sm:pb-10'}`}>
                    <div className="flex items-center gap-2.5 mb-1.5">
                      <div className="w-7 h-7 rounded-[0.1875rem] bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center text-[#1D4ED8] shrink-0">
                        <Icon size={15} />
                      </div>
                      <h3 className="text-base font-semibold text-[#0F172A] font-sans">
                        {step.title}
                      </h3>
                    </div>
                    <p className="text-xs sm:text-sm text-[#475569] leading-relaxed font-sans font-normal">
                      {step.description}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;

import React from 'react';
import { SectionHeading } from '../../components/common/SectionHeading';
import { CornerBrackets } from '../../components/common/CornerBrackets';
import { Reveal } from '../../components/common/Reveal';
import { Users, Clock, Compass, Award } from 'lucide-react';

export const About: React.FC = () => {
  const timeline = [
    {
      year: '2024 Q3',
      phase: 'Project Genesis & Lab Metrology',
      desc: 'Formulation of sub-millimeter edge AOI platform with multi-angle GigE machine vision and cold-rolled automotive steel dataset curation.',
    },
    {
      year: '2025 Q1',
      phase: 'YOLOv8-Seg INT8 TensorRT Conversion',
      desc: 'Achieved sub-30 millisecond inference cycle on NVIDIA Jetson AGX Orin platform with zero layout latency.',
    },
    {
      year: '2025 Q4',
      phase: 'Press Line 04 Retrofit Pilot',
      desc: 'Deployed opto-isolated pneumatic reject solenoid actuator on tandem stamping press at 30+ parts per minute.',
    },
    {
      year: '2026 Q2',
      phase: 'Full Production Deployment',
      desc: '100% digital traceability buffer and automated non-conformance quarantine logging across Maruti plant operations.',
    },
  ];

  const team = [
    {
      name: 'Lead Metrology Engineer',
      role: 'Optical Vision Systems',
      dept: 'Automotive Quality Engineering',
      initials: 'ME',
    },
    {
      name: 'Stamping Press Specialist',
      role: 'Press Line Operations',
      dept: 'Stamping Press 04 Floor Ops',
      initials: 'PS',
    },
    {
      name: 'Edge AI Systems Engineer',
      role: 'Embedded Neural Networks',
      dept: 'Edge Acceleration Group',
      initials: 'EE',
    },
    {
      name: 'Supplier QA Engineer',
      role: 'Material & Coil Compliance',
      dept: 'Tier-1 Steel Procurement',
      initials: 'QA',
    },
  ];

  return (
    <div className="pt-28 pb-20 px-4 sm:px-6 max-w-7xl mx-auto flex flex-col gap-16 font-sans bg-white text-[#0F172A]">
      <Reveal>
        <SectionHeading
          label="MISSION & GENEALOGY"
          boldTitle="Built for automotive precision."
          lightTitle="The story behind Maruti FabriScan."
          description="Transforming industrial quality assurance from labor-intensive manual sampling to deterministic edge-native optical intelligence."
        />
      </Reveal>

      {/* Core Mission Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Reveal delay={0.1}>
          <div className="relative bg-white border border-[#D9DEE5] p-6 rounded-[4px] h-full flex flex-col justify-between">
            <CornerBrackets size={6} color="border-[#D9DEE5]" />
            <div>
              <div className="w-10 h-10 rounded-[3px] bg-[#F5F7FA] border border-[#D9DEE5] flex items-center justify-center text-[#1D4ED8] mb-4">
                <Compass size={20} />
              </div>
              <h3 className="text-lg font-bold text-[#0F172A] mb-2 font-sans">Our Mission</h3>
              <p className="text-xs text-[#475569] leading-relaxed font-normal">
                To inspect stamped sheet metal panels before body welding cells.
                By shifting optical inspection to the extreme network edge, we provide millisecond
                verdicts with hardware-level fail-safe reliability.
              </p>
            </div>
            <div className="mt-6 pt-3 border-t border-[#D9DEE5] font-mono text-[10px] text-[#1D4ED8] font-medium">
              DETERMINISTIC DISPOSITION : IN-LINE COVERAGE
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="relative bg-white border border-[#D9DEE5] p-6 rounded-[4px] h-full flex flex-col justify-between">
            <CornerBrackets size={6} color="border-[#D9DEE5]" />
            <div>
              <div className="w-10 h-10 rounded-[3px] bg-[#F5F7FA] border border-[#D9DEE5] flex items-center justify-center text-[#1D4ED8] mb-4">
                <Award size={20} />
              </div>
              <h3 className="text-lg font-bold text-[#0F172A] mb-2 font-sans">The Quality Imperative</h3>
              <p className="text-xs text-[#475569] leading-relaxed font-normal">
                Modern automotive finishes cannot tolerate tool score marks or rolled-in
                scale. Maruti FabriScan provides the measurement precision required to preserve
                surface finish and reduce vehicle body rework.
              </p>
            </div>
            <div className="mt-6 pt-3 border-t border-[#D9DEE5] font-mono text-[10px] text-[#1D4ED8] font-medium">
              SUB-MILLIMETER METROLOGY ACCURACY
            </div>
          </div>
        </Reveal>
      </div>

      {/* Engineering Timeline */}
      <Reveal>
        <div className="relative bg-white border border-[#D9DEE5] p-6 lg:p-8 rounded-[4px]">
          <CornerBrackets size={8} color="border-[#D9DEE5]" />

          <div className="flex items-center gap-2 mb-6 font-sans text-xs text-[#1D4ED8]">
            <Clock size={16} />
            <span className="font-bold uppercase tracking-wider">PROJECT EVOLUTION TIMELINE</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {timeline.map((item, idx) => (
              <div key={item.year} className="relative flex flex-col">
                <div className="font-mono text-sm font-bold text-[#1D4ED8] mb-1">{item.year}</div>
                <h4 className="text-sm font-semibold text-[#0F172A] mb-2 font-sans">{item.phase}</h4>
                <p className="text-xs text-[#475569] leading-relaxed font-normal">{item.desc}</p>
                {idx < timeline.length - 1 && (
                  <div className="hidden md:block absolute top-2 right-0 w-8 h-[1px] bg-[#D9DEE5]" />
                )}
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      {/* Team */}
      <Reveal>
        <div className="relative bg-white border border-[#D9DEE5] p-6 lg:p-8 rounded-[4px]">
          <CornerBrackets size={8} color="border-[#D9DEE5]" />

          <div className="flex items-center justify-between mb-6 border-b border-[#D9DEE5] pb-3">
            <div className="flex items-center gap-2 font-sans text-xs text-[#1D4ED8]">
              <Users size={16} />
              <span className="font-bold uppercase tracking-wider">PROJECT LEADERSHIP &amp; ENGINEERING</span>
            </div>
            <span className="font-mono text-[10px] text-[#64748B]">ENGINEERING ROLES</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {team.map((m) => (
              <div
                key={m.name}
                className="bg-[#F5F7FA] border border-[#D9DEE5] p-4 rounded-[3px] font-mono text-xs flex flex-col gap-2"
              >
                <div className="w-10 h-10 rounded-[3px] bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center font-bold text-[#1D4ED8]">
                  {m.initials}
                </div>
                <div>
                  <h4 className="font-sans font-bold text-[#0F172A] text-sm">{m.name}</h4>
                  <div className="text-[#1D4ED8] text-[11px] mt-0.5 font-medium">{m.role}</div>
                  <div className="text-[#64748B] text-[10px] mt-1">{m.dept}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </div>
  );
};

export default About;

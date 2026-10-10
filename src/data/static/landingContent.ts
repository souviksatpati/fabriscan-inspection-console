export interface PipelineStage {
  title: string;
  subtitle: string;
  latency: string;
  description: string;
  icon: string;
}

export const PIPELINE_STAGES: PipelineStage[] = [
  {
    title: 'Camera Trigger',
    subtitle: 'High-speed GigE Optical Capture',
    latency: '2.5 ms',
    description: 'Photoelectric sensor triggers simultaneous synchronized exposure across multi-angle industrial vision sensors.',
    icon: 'Camera',
  },
  {
    title: 'Frame Normalization',
    subtitle: 'FPGA Preprocessing',
    latency: '4.8 ms',
    description: 'Hardware debayering, bilateral noise suppression, and photometric normalization to eliminate ambient shop-floor illumination variations.',
    icon: 'Maximize2',
  },
  {
    title: 'Defect Segmentation',
    subtitle: 'YOLOv8-Seg TensorRT Engine',
    latency: '18.4 ms',
    description: 'Edge GPU neural network produces polygonal segmentation masks across all 6 automotive surface defect classes.',
    icon: 'Cpu',
  },
  {
    title: 'Defect Measurement',
    subtitle: 'Sub-Millimeter Metrology Engine',
    latency: '6.2 ms',
    description: 'Precision pixel-to-millimeter transform computes exact surface area in mm², major axis length, width, and localized aspect ratio.',
    icon: 'Ruler',
  },
  {
    title: 'Severity Classification',
    subtitle: 'Automotive Standard Rulebase',
    latency: '1.4 ms',
    description: 'Cross-references defect geometry against OEM critical zone maps, classifying defects into Minor, Moderate, Major, or Critical.',
    icon: 'Layers',
  },
  {
    title: 'Accept or Reject Decision',
    subtitle: 'Deterministic Edge Logic Gate',
    latency: '0.8 ms',
    description: 'Deterministic binary verdict: Accept (cleared for downstream welding or assembly) or Reject (diverted to quarantine).',
    icon: 'CheckCircle2',
  },
  {
    title: 'Rejection Actuation',
    subtitle: 'Opto-Isolated PLC Solenoid Pulse',
    latency: '12.0 ms',
    description: 'Direct 24V DC signal to pneumatic solenoid ram diverts the defective stamped panel into the scrap quarantine bay.',
    icon: 'Zap',
  },
  {
    title: 'Traceability Recording',
    subtitle: 'Serial and Batch Log',
    latency: '3.2 ms',
    description: 'Defect mask coordinates, timestamp, station telemetry, and photographic records are bound to the part serial number.',
    icon: 'Database',
  },
];

export const USE_CASES = [
  {
    title: 'Press & Stamping Lines',
    badge: 'STAMPING LINES',
    description:
      'Continuous inspection of deep-drawn sheet metal blanks in tandem press lines. Detects press tool scratches, rolled-in mill scale, drawing crazing, and foreign inclusions before parts reach body welding.',
    defects: ['Scratches', 'Rolled-in Scale', 'Draw Crazing', 'Foreign Slag Inclusions'],
    coverage: '100% In-Line Inspection',
    status: 'Line Synchronized',
  },
  {
    title: 'Body-in-White (BIW) Assembly',
    badge: 'BIW ASSEMBLY',
    description:
      'Automated optical verification of robotic seam welding, adhesive bead continuity, hemm²ed door edges, and outer skin panel alignment. Replaces manual tactile inspection stones.',
    defects: ['Weld Spatter', 'Hemm²ing Crazing', 'Panel Misalignment', 'Adhesive Discontinuity'],
    coverage: 'Key Feature Verification',
    status: 'Automated Station Gate',
  },
  {
    title: 'Paint Preparation & E-Coat',
    badge: 'PAINT PREPARATION',
    description:
      'Surface topography scanning prior to cathodic electrodeposition (ED) primer. Flags microscopic craters, acid etching pits, and oil contaminants that cause paint blisters.',
    defects: ['Surface Pitting', 'Zinc Galling Patches', 'Residual Oil Droplets', 'Micro-Dents'],
    coverage: 'Class-A Surface Audit',
    status: 'Pre-Dip Inspection',
  },
];

export const TRACEABILITY_MOCK_ROWS = [
  { id: 'MF-2026-00124', time: '13:42:18', station: 'Stamping-04', defect: 'Scratches', conf: '97.2%', area: '18.42 mm²²', severity: 'Critical', decision: 'Rejected' },
  { id: 'MF-2026-00123', time: '13:42:14', station: 'Stamping-04', defect: 'None', conf: '99.9%', area: '0.00 mm²²', severity: 'None', decision: 'Accepted' },
  { id: 'MF-2026-00122', time: '13:42:09', station: 'Stamping-04', defect: 'Pitted Surface', conf: '88.4%', area: '2.15 mm²²', severity: 'Minor', decision: 'Accepted' },
  { id: 'MF-2026-00121', time: '13:42:04', station: 'Stamping-04', defect: 'Rolled-in Scale', conf: '95.1%', area: '12.30 mm²²', severity: 'Major', decision: 'Rejected' },
  { id: 'MF-2026-00120', time: '13:41:58', station: 'Stamping-04', defect: 'None', conf: '99.8%', area: '0.00 mm²²', severity: 'None', decision: 'Accepted' },
  { id: 'MF-2026-00119', time: '13:41:52', station: 'Stamping-04', defect: 'Crazing', conf: '96.8%', area: '6.40 mm²²', severity: 'Critical', decision: 'Rejected' },
];

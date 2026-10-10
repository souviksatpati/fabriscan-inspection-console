export type DefectType =
  | 'Crazing'
  | 'Inclusion'
  | 'Patches'
  | 'Pitted Surface'
  | 'Rolled-in Scale'
  | 'Scratches';

export type DefectSeverity = 'MINOR' | 'MODERATE' | 'MAJOR' | 'CRITICAL';

export interface DefectMeasurement {
  id: string;
  type: DefectType;
  confidence: number; // e.g. 0.964 -> 96.4%
  areaMm2: number; // e.g. 18.42
  lengthMm?: number;
  widthMm?: number;
  severity: DefectSeverity;
  decision: 'ACCEPT' | 'REJECT';
  location: {
    x: number; // Normalized 0-1 or canvas pixels
    y: number;
    width: number;
    height: number;
  };
  contour?: Array<[number, number]>; // Polygon coordinates for segmentation mask
  description: string;
}

export interface DefectTypeDefinition {
  type: DefectType;
  title: string;
  shortDesc: string;
  fullDesc: string;
  rootCause: string;
  rejectionThreshold: string;
  typicalSeverity: DefectSeverity;
  color: string;
  whatItIs: string;
  typicalCause: string;
  detectionMeasurement: string;
  action: string;
}

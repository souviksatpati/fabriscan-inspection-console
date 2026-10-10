export interface InspectionReportSummary {
  id: string;
  reportNumber: string;
  title: string;
  batchId: string;
  partModel: string;
  dateRange: string;
  createdAt: string;
  totalParts: number;
  passRatePct: number;
  rejectedParts: number;
  dominantDefect: string;
  author: string;
  status: 'FINAL' | 'DRAFT' | 'ARCHIVED';
  pdfDownloadUrl?: string;
  csvDownloadUrl?: string;
}

export interface NonConformanceRecord {
  ncrNumber: string;
  inspectionId: string;
  partId: string;
  defectType: string;
  severity: string;
  disposition: 'SCRAP' | 'REWORK' | 'ENGINEERING_REVIEW' | 'SUPPLIER_RETURN';
  quarantineBay: string;
  supervisorSignoff: string;
  timestamp: string;
}

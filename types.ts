export interface ScanDetails {
  hosting: string;
  ssl: string;
  domainAge: string;
  blacklist: string;
}

export interface SecurityReport {
  score: number; // 0-100
  riskLevel: 'Safe' | 'Suspicious' | 'Dangerous';
  summary: string;
  details: ScanDetails;
  groundingUrls?: string[];
}

export enum AppState {
  IDLE = 'IDLE',
  SCANNING = 'SCANNING',
  RESULT = 'RESULT',
  ERROR = 'ERROR'
}

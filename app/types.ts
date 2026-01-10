
export type Blueprint = {
  id: string;
  name: string;
  status: 'processed' | 'processing' | 'queued';
  compliance: number;
  uploadedBy?: string;
  uploadedAt?: string;
  imageData?: string; // Base64 data for persistence
  detectedComponents?: DetectedComponent[];
  analysisText?: string;
};

export type TeamMember = {
  name: string;
  role: string;
  initials: string;
};

export type Comment = {
  id: string;
  text: string;
  author: string;
  initials: string;
  timestamp: string;
  role: string;
};

export type Activity = {
  text: string;
  time: string;
  type: 'cpu' | 'clipboard' | 'upload' | 'plus' | 'alert';
};

export type AnalysisReport = {
  id: string;
  blueprintId: string;
  blueprintName: string;
  date: string;
  content: string;
  author: string;
};

export type ProjectSettings = {
  jobNumber: string;
  phase: string;
  buildingCode: string; // e.g., "IBC 2021"
  ashraeStandards: string[]; // e.g., ["62.1", "90.1"]
  laborRate: number;
  materialMarkup: number; // Percentage
  taxRate: number;
  contingency: number;
  measurementSystem: 'imperial' | 'metric';
};

export type Project = {
  id: string;
  name: string;
  client: string;
  location: string;
  description: string;
  status: 'active' | 'archived' | 'completed' | 'on_hold';
  lastUpdated: string;
  startDate: string;
  budget: number;
  progress: number;
  openIssues: number;
  team: TeamMember[];
  activityLog: Activity[];
  blueprintsData: Blueprint[];
  analysisReports: AnalysisReport[];
  settings?: ProjectSettings; // Optional for backward compatibility
};

export type ViewState = 'dashboard' | 'workspace' | 'projects';

export type DetectedComponent = {
  id: string;
  name: string;
  type: string;
  confidence: number;
  status: 'verified' | 'review';
  cost: number;
  sku: string;
  description: string;
  technicalSpecs: { [key: string]: string };
  maintenanceNotes?: string;
  estimatedLifespan?: string;
  efficiencyRating?: string;
  estimatedInstallHours?: number; 
  comments?: Comment[];
};

export type QuoteItem = {
  id: string;
  description: string;
  sku: string;
  quantity: number;
  unit: 'EA' | 'LF' | 'FT' | 'HR' | 'LOT';
  materialCost: number;
  laborCost: number;
  hours: number;
  comments?: Comment[];
};

export type QuoteInfo = {
  number: string;
  billToName: string;
  billToCompany: string;
  date: string;
  laborRate: number; 
};

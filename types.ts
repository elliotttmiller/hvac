
export type Blueprint = {
  id: string;
  name: string;
  status: 'processed' | 'processing' | 'queued';
  compliance: number;
  uploadedBy?: string;
  uploadedAt?: string;
  imageData?: string; // Base64 data for the cover/first page preview
  pages?: string[];   // Array of Base64 strings for multi-page PDFs
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
  type: 'cpu' | 'clipboard' | 'upload' | 'plus' | 'alert' | 'check';
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

export type IssueSeverity = 'critical' | 'warning' | 'info';
export type IssueStatus = 'open' | 'resolved' | 'ignored';

export type Issue = {
  id: string;
  title: string;
  description: string;
  severity: IssueSeverity;
  status: IssueStatus;
  date: string;
  location?: string; // e.g. "Level 2 VAV Layout"
  assignedTo?: string; // initials
  comments?: Comment[];
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
  issues: Issue[];
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
  manufacturer?: string;
  description: string;
  technicalSpecs: { [key: string]: string };
  maintenanceNotes?: string;
  estimatedLifespan?: string;
  efficiencyRating?: string;
  estimatedInstallHours?: number; 
  comments?: Comment[];
  boundingBox?: {
    ymin: number;
    xmin: number;
    ymax: number;
    xmax: number;
  };
  groundedData?: {
      cost: number;
      currency: string;
      sourceDescription: string;
      sources: { title: string; uri: string }[];
      lastUpdated: string;
      foundName?: string;
      foundSku?: string;
      manufacturer?: string;
      specs?: Record<string, string>;
  };
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

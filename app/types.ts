export type Blueprint = {
  id: string;
  name: string;
  status: 'processed' | 'processing' | 'queued';
  compliance: number;
  uploadedBy?: string;
  uploadedAt?: string;
  imageData?: string; // Base64 data for persistence
};

export type TeamMember = {
  name: string;
  role: string;
  initials: string;
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
};

export type QuoteInfo = {
  number: string;
  billToName: string;
  billToCompany: string;
  date: string;
  laborRate: number; 
};
import { Project, AnalysisReport, Blueprint } from "../types";

const STORAGE_KEY = 'hvac_ai_projects_db';

const INITIAL_DATA: Project[] = [
  { 
    id: 'proj-01', 
    name: 'ASHRAE HQ Retrofit', 
    client: 'ASHRAE Global',
    location: 'Atlanta, GA',
    description: 'Complete VAV box replacement and BAS upgrade for Level 2 & 3. Focus on energy efficiency and IAQ compliance per Standard 62.1.',
    status: 'active', 
    lastUpdated: '10m ago',
    startDate: 'Oct 12, 2024',
    budget: 125000,
    progress: 65,
    openIssues: 3,
    team: [
        { name: 'Dr. Sarah Chen', role: 'Lead Engineer', initials: 'SC' },
        { name: 'Mike Ross', role: 'MEP Specialist', initials: 'MR' }
    ],
    activityLog: [
        { text: "Detected 45 new components in Level 2 VAV Layout", time: "2 hours ago", type: 'cpu' },
        { text: "Blueprint 'Level 2 - VAV Layout' uploaded", time: "Yesterday", type: 'upload' }
    ],
    blueprintsData: [
        { id: 'bp-101', name: 'Level 2 - VAV Layout', status: 'processed', compliance: 92, uploadedBy: 'Sarah Chen', uploadedAt: 'Oct 14' }
    ],
    analysisReports: []
  }
];

export const projectDatabase = {
  /**
   * Loads all projects from persistent storage or initializes with defaults
   */
  getProjects(): Project[] {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      this.saveProjects(INITIAL_DATA);
      return INITIAL_DATA;
    }
    try {
      return JSON.parse(data);
    } catch (e) {
      console.error("Failed to parse project database", e);
      return INITIAL_DATA;
    }
  },

  /**
   * Commits the entire project collection to storage
   */
  saveProjects(projects: Project[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  },

  /**
   * Updates a single project and persists changes
   */
  updateProject(updatedProject: Project): Project[] {
    const projects = this.getProjects();
    const index = projects.findIndex(p => p.id === updatedProject.id);
    if (index !== -1) {
      projects[index] = { ...updatedProject, lastUpdated: 'Just now' };
      this.saveProjects(projects);
    }
    return projects;
  },

  /**
   * Adds a new project to the database
   */
  addProject(project: Project): Project[] {
    const projects = this.getProjects();
    const updated = [project, ...projects];
    this.saveProjects(updated);
    return updated;
  },

  /**
   * Persists a forensic report to a specific project
   */
  addReport(projectId: string, report: AnalysisReport): Project[] {
    const projects = this.getProjects();
    const project = projects.find(p => p.id === projectId);
    if (project) {
      project.analysisReports = [report, ...project.analysisReports];
      project.activityLog = [
        { text: `Forensic analysis report generated for ${report.blueprintName}`, time: 'Just now', type: 'clipboard' },
        ...project.activityLog
      ];
      return this.updateProject(project);
    }
    return projects;
  },

  /**
   * Adds or updates a blueprint within a project
   */
  saveBlueprint(projectId: string, blueprint: Blueprint): Project[] {
    const projects = this.getProjects();
    const project = projects.find(p => p.id === projectId);
    if (project) {
      const existingIdx = project.blueprintsData.findIndex(b => b.id === blueprint.id);
      if (existingIdx !== -1) {
        project.blueprintsData[existingIdx] = blueprint;
      } else {
        project.blueprintsData = [blueprint, ...project.blueprintsData];
      }
      return this.updateProject(project);
    }
    return projects;
  }
};


import { Project, AnalysisReport, Blueprint } from "../types";

const STORAGE_KEY = 'hvac_ai_projects_db';

// --- IndexedDB Helper for Large Images (Solves Quota Exceeded) ---
const DB_NAME = 'HVAC_AI_DB';
const STORE_NAME = 'blueprint_images';

const getDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
  });
};

export const saveImageToDB = async (id: string, base64: string): Promise<void> => {
    try {
        const db = await getDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(STORE_NAME, 'readwrite');
            const store = tx.objectStore(STORE_NAME);
            const req = store.put(base64, id);
            req.onsuccess = () => resolve();
            req.onerror = () => reject(req.error);
        });
    } catch (e) {
        console.error("IDB Save Error:", e);
    }
};

export const savePagesToDB = async (id: string, pages: string[]): Promise<void> => {
    try {
        const db = await getDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(STORE_NAME, 'readwrite');
            const store = tx.objectStore(STORE_NAME);
            // We store the array of pages under a specific key suffix
            const req = store.put(pages, `${id}_pages`);
            req.onsuccess = () => resolve();
            req.onerror = () => reject(req.error);
        });
    } catch (e) {
        console.error("IDB Save Pages Error:", e);
    }
};

export const getImageFromDB = async (id: string): Promise<string | undefined> => {
    try {
        const db = await getDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(STORE_NAME, 'readonly');
            const store = tx.objectStore(STORE_NAME);
            const req = store.get(id);
            req.onsuccess = () => resolve(req.result);
            req.onerror = () => reject(req.error);
        });
    } catch (e) {
        console.error("IDB Load Error:", e);
        return undefined;
    }
};

export const getPagesFromDB = async (id: string): Promise<string[] | undefined> => {
    try {
        const db = await getDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(STORE_NAME, 'readonly');
            const store = tx.objectStore(STORE_NAME);
            const req = store.get(`${id}_pages`);
            req.onsuccess = () => resolve(req.result);
            req.onerror = () => reject(req.error);
        });
    } catch (e) {
        console.error("IDB Load Pages Error:", e);
        return undefined;
    }
};

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
    issues: [
        {
            id: 'iss-001',
            title: 'Missing Fire Damper Interlock',
            description: 'Level 2 Supply Duct crosses a rated fire wall but no FSD or interlock detected in schematic.',
            severity: 'critical',
            status: 'open',
            date: 'Oct 15, 2024',
            location: 'Level 2 - VAV Layout',
            assignedTo: 'SC'
        },
        {
            id: 'iss-002',
            title: 'Low Static Pressure Sensor Placement',
            description: 'Static pressure sensor (DPSH) is located too close to the fan discharge (approx 1/4 way down). ASHRAE recommends 2/3 down the duct.',
            severity: 'warning',
            status: 'open',
            date: 'Oct 16, 2024',
            location: 'Level 2 - Main Trunk',
            assignedTo: 'MR'
        },
        {
            id: 'iss-003',
            title: 'Undefined VAV Box Controller Protocol',
            description: 'VAV-204 controller type is generic. Need to specify BACnet MS/TP or IP for integration.',
            severity: 'info',
            status: 'open',
            date: 'Oct 18, 2024',
            location: 'Zone 4 East'
        }
    ],
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
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    } catch (e) {
        console.error("LocalStorage Quota Exceeded:", e);
        // Fallback: Could try to clean up old projects here
    }
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
   * Adds or updates a blueprint within a project.
   * CRITICAL UPDATE: Detaches base64 image data to IndexedDB to prevent LocalStorage quota errors.
   */
  saveBlueprint(projectId: string, blueprint: Blueprint): Project[] {
    const projects = this.getProjects();
    const project = projects.find(p => p.id === projectId);
    
    if (project) {
      // 1. If there's image data (cover), offload it to IDB
      if (blueprint.imageData) {
          saveImageToDB(blueprint.id, blueprint.imageData);
      }

      // 2. If there are multiple pages, offload array to IDB
      if (blueprint.pages && blueprint.pages.length > 0) {
          savePagesToDB(blueprint.id, blueprint.pages);
      }

      // 3. Create a lightweight version for LocalStorage (strip imageData and pages)
      const lightweightBlueprint = {
          ...blueprint,
          imageData: undefined, // Do not store base64 in LS
          pages: undefined      // Do not store pages array in LS
      };

      const existingIdx = project.blueprintsData.findIndex(b => b.id === blueprint.id);
      if (existingIdx !== -1) {
        project.blueprintsData[existingIdx] = lightweightBlueprint;
      } else {
        project.blueprintsData = [lightweightBlueprint, ...project.blueprintsData];
      }
      return this.updateProject(project);
    }
    return projects;
  }
};

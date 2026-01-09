import React, { useState, useEffect, useCallback } from "react";
import { Icons } from "./components/Icons";
import { NavButton } from "./components/common";
import { DashboardView } from "./views/DashboardView";
import { ProjectsView } from "./views/ProjectsView";
import { WorkspaceView } from "./views/WorkspaceView";
import { RightPanel } from "./features/RightPanel";
import { stage1Extraction, stage2Analysis } from "./services/aiService";
import { projectDatabase } from "./services/projectDatabase";
import { ViewState, DetectedComponent, QuoteItem, QuoteInfo, Project, AnalysisReport, Blueprint } from "./types";
import { NewProjectData } from "./components/NewProjectModal";

export const App = () => {
  const [view, setView] = useState<ViewState>('dashboard');
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [activeBlueprintId, setActiveBlueprintId] = useState<string | null>(null);

  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [components, setComponents] = useState<DetectedComponent[]>([]);
  const [quoteItems, setQuoteItems] = useState<QuoteItem[]>([]);
  const [quoteInfo, setQuoteInfo] = useState<QuoteInfo>({
      number: `QT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      billToName: 'Lead Engineer',
      billToCompany: 'Engineering Group',
      date: new Date().toLocaleDateString(),
      laborRate: 115.00 
  });

  // Load state from DB
  const refreshProjects = useCallback(() => {
    const loadedProjects = projectDatabase.getProjects();
    setProjects(loadedProjects);
    return loadedProjects;
  }, []);

  useEffect(() => {
    const loaded = refreshProjects();
    if (loaded.length > 0 && !activeProjectId) {
      setActiveProjectId(loaded[0].id);
    }
  }, [refreshProjects, activeProjectId]);

  const activeProject = projects.find(p => p.id === activeProjectId) || projects[0] || null;
  const activeBlueprint = (activeProject && activeBlueprintId) 
      ? activeProject.blueprintsData.find(b => b.id === activeBlueprintId) 
      : activeProject?.blueprintsData[0];
      
  const currentBlueprint: Blueprint = activeBlueprint || { 
      id: 'new-session', name: 'Draft Analysis', status: 'queued', compliance: 0, uploadedBy: 'System', uploadedAt: 'Now' 
  };

  // Sync image when blueprint changes
  useEffect(() => {
    if (activeBlueprint?.imageData) {
      setUploadedImage(activeBlueprint.imageData);
    } else {
      setUploadedImage(null);
    }
    // Clear ephemeral analysis state when switching blueprints
    setAiAnalysis(null);
    setComponents([]);
    setQuoteItems([]);
  }, [activeBlueprintId, activeBlueprint]);

  const handleNavigate = (v: ViewState) => setView(v);
  
  const handleSelectProject = (projectId: string, blueprintId?: string) => {
    setActiveProjectId(projectId);
    if (blueprintId) {
        setActiveBlueprintId(blueprintId);
    } else {
        const proj = projects.find(p => p.id === projectId);
        setActiveBlueprintId(proj?.blueprintsData[0]?.id || null);
    }
    handleNavigate('workspace');
    
    const proj = projects.find(p => p.id === projectId);
    if (proj) {
        setQuoteInfo(prev => ({
            ...prev,
            billToCompany: proj.client,
            billToName: proj.team[0]?.name || 'Project Manager'
        }));
    }
  };

  const handleCreateProject = (data: NewProjectData) => {
      const newProject: Project = {
          id: `proj-${Math.random().toString(36).substr(2, 5)}`,
          name: data.name,
          client: data.client,
          location: data.location,
          description: data.description,
          status: 'active',
          lastUpdated: 'Just now',
          startDate: new Date().toLocaleDateString(),
          budget: data.budget ? parseFloat(data.budget) : 0,
          progress: 0,
          openIssues: 0,
          team: [{ name: 'Current User', role: 'Admin', initials: 'ME' }],
          activityLog: [{ text: 'Project initialized', time: 'Just now', type: 'plus' }],
          blueprintsData: [],
          analysisReports: []
      };
      const updated = projectDatabase.addProject(newProject);
      setProjects(updated);
      setActiveProjectId(newProject.id);
  };

  /**
   * Universal Blueprint Upload Handler
   */
  const handleUploadBlueprint = (file: File, targetProjectId: string) => {
    const reader = new FileReader();
    reader.onload = (evt) => {
      const base64 = evt.target?.result as string;
      
      const newBlueprint: Blueprint = {
          id: `bp-${Math.random().toString(36).substr(2, 5)}`,
          name: file.name,
          status: 'processing',
          compliance: 0,
          uploadedBy: 'Lead Engineer',
          uploadedAt: 'Just now',
          imageData: base64
      };

      projectDatabase.saveBlueprint(targetProjectId, newBlueprint);
      refreshProjects();
      
      // If we are on the project that just got the upload, auto-select it in global state
      if (targetProjectId === activeProjectId) {
        setActiveBlueprintId(newBlueprint.id);
      }
    };
    reader.readAsDataURL(file);
  };

  const runAnalysis = async () => {
    if (!uploadedImage || !activeProjectId) return;
    setIsProcessing(true);
    setAiAnalysis(null);
    
    try {
        const matches = uploadedImage.match(/^data:(.+);base64,(.+)$/);
        const mimeType = matches ? matches[1] : 'image/png';
        const base64Data = matches ? matches[2] : uploadedImage.split(',')[1];

        const extractionResult = await stage1Extraction(base64Data, mimeType);
        
        if (extractionResult.detectedComponents) {
            setComponents(extractionResult.detectedComponents);
            setQuoteItems(extractionResult.detectedComponents.map(c => ({
                  id: c.id,
                  description: c.name,
                  sku: c.sku,
                  quantity: 1,
                  unit: 'EA',
                  materialCost: c.cost,
                  hours: c.estimatedInstallHours || 2,
                  laborCost: (c.estimatedInstallHours || 2) * quoteInfo.laborRate
            })));
        }

        setIsAnalyzing(true);
        const analysisResult = await stage2Analysis(base64Data, mimeType, extractionResult.detectedComponents);
        setAiAnalysis(analysisResult.analysisReport);
        setIsAnalyzing(false);

        // SYNC: Commit report to database
        if (analysisResult.analysisReport) {
            const newReport: AnalysisReport = {
                id: `rep-${Math.random().toString(36).substr(2, 5)}`,
                blueprintId: currentBlueprint.id,
                blueprintName: currentBlueprint.name,
                date: new Date().toLocaleString(),
                content: analysisResult.analysisReport,
                author: "Neuro-Engine Stage 2"
            };
            projectDatabase.addReport(activeProjectId, newReport);
            
            // Update metadata in blueprint
            const currentBp = projectDatabase.getProjects().find(p => p.id === activeProjectId)?.blueprintsData.find(b => b.id === currentBlueprint.id);
            if (currentBp) {
                currentBp.status = 'processed';
                currentBp.compliance = 85 + Math.floor(Math.random() * 10);
                projectDatabase.saveBlueprint(activeProjectId, currentBp);
            }
            
            refreshProjects();
        }

    } catch (err) {
        console.error("Analysis failed", err);
        setAiAnalysis("Critical analysis failure. Pipeline interrupted.");
    } finally {
        setIsProcessing(false);
        setIsAnalyzing(false);
    }
  };

  const handleComponentCostChange = (id: string, newCost: number) => {
      setComponents(prev => prev.map(comp => 
          comp.id === id ? { ...comp, cost: newCost } : comp
      ));
      setQuoteItems(prev => prev.map(item => 
          item.id === id ? { ...item, materialCost: newCost } : item
      ));
  };

  const handleUpdateQuoteItem = (id: string, field: string, value: any) => {
      setQuoteItems(prev => prev.map(item => {
          if (item.id === id) {
              const updatedItem = { ...item, [field]: value };
              if (field === 'hours') {
                  updatedItem.laborCost = value * quoteInfo.laborRate;
              }
              return updatedItem;
          }
          return item;
      }));
  };

  const addQuoteItem = () => {
      setQuoteItems(prev => [...prev, {
          id: `manual-${Date.now()}`,
          description: 'Custom Asset Specification',
          sku: 'SPEC-MOD',
          quantity: 1,
          unit: 'EA',
          materialCost: 0,
          laborCost: 0,
          hours: 0
      }]);
  };

  const removeQuoteItem = (id: string) => {
      setQuoteItems(prev => prev.filter(item => item.id !== id));
  };

  if (!activeProject && projects.length === 0) {
      return (
          <div className="h-screen bg-black flex items-center justify-center">
              <div className="text-center">
                  <div className="w-12 h-12 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-500 font-mono text-xs uppercase tracking-widest">Waking neural cores...</p>
              </div>
          </div>
      );
  }

  return (
    <div className="flex h-screen bg-[#000000] text-gray-200 font-sans selection:bg-blue-900/50 overflow-hidden">
      <nav className="w-16 border-r border-[#27272a] bg-[#09090b] flex flex-col items-center py-6 gap-6 z-50 shrink-0">
        <div className="text-blue-500 mb-2"><Icons.Wind /></div>
        <NavButton active={view === 'dashboard'} onClick={() => setView('dashboard')} icon={<Icons.Home />} />
        <NavButton active={view === 'projects'} onClick={() => setView('projects')} icon={<Icons.Layers />} />
        <NavButton active={view === 'workspace'} onClick={() => setView('workspace')} icon={<Icons.Maximize />} />
        <div className="mt-auto">
             <NavButton active={false} onClick={() => {}} icon={<Icons.Settings />} />
        </div>
      </nav>

      <main className="flex-1 overflow-hidden relative flex flex-col min-w-0">
        {view === 'dashboard' && (
            <DashboardView 
                onNavigate={handleNavigate} 
                projects={projects}
            />
        )}
        {view === 'projects' && (
            <ProjectsView 
                projects={projects} 
                onSelectProject={handleSelectProject} 
                onCreateProject={handleCreateProject}
                onUploadBlueprint={handleUploadBlueprint}
            />
        )}
        {view === 'workspace' && activeProject && (
            <WorkspaceView 
                blueprint={currentBlueprint} 
                activeProject={activeProject}
                projects={projects}
                onSelectProject={handleSelectProject}
                isProcessing={isProcessing || isAnalyzing}
                uploadedImage={uploadedImage}
                onRunAnalysis={runAnalysis}
                onUpload={(e) => {
                    const file = e.target.files?.[0];
                    if (file && activeProjectId) handleUploadBlueprint(file, activeProjectId);
                }}
            />
        )}
      </main>

      {view === 'workspace' && (
          <RightPanel 
              components={components}
              onUpdateComponentCost={handleComponentCostChange}
              quoteItems={quoteItems}
              quoteInfo={quoteInfo}
              onUpdateQuoteInfo={(info) => setQuoteInfo(prev => ({ ...prev, ...info }))}
              onUpdateQuoteItem={handleUpdateQuoteItem}
              onAddQuoteItem={addQuoteItem}
              onRemoveQuoteItem={removeQuoteItem}
              aiAnalysis={aiAnalysis}
              isProcessing={isProcessing}
              isAnalyzing={isAnalyzing}
              uploadedImage={uploadedImage}
              onRunAnalysis={runAnalysis}
          />
      )}
    </div>
  );
};

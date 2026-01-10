import React, { useState, useEffect, useCallback, useRef } from "react";
import { Icons } from "./components/Icons";
import { NavButton } from "./components/common";
import { DashboardView } from "./views/DashboardView";
import { ProjectsView } from "./views/ProjectsView";
import { WorkspaceView } from "./views/WorkspaceView";
import { RightPanel } from "./features/RightPanel";
import { stage1Extraction, stage2Analysis } from "./services/aiService";
import { projectDatabase } from "./services/projectDatabase";
import { ViewState, DetectedComponent, QuoteItem, QuoteInfo, Project, AnalysisReport, Blueprint, Comment } from "./types";
import { NewProjectData } from "./components/NewProjectModal";
import { ToastContainer, ToastMsg, ToastType } from "./components/Toasts";

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
  const [toasts, setToasts] = useState<ToastMsg[]>([]);
  const abortControllerRef = useRef<AbortController | null>(null);

  const addToast = (title: string, message: string, type: ToastType = 'info') => {
      const id = Date.now().toString();
      setToasts(prev => [...prev, { id, title, message, type }]);
  };

  const removeToast = (id: string) => {
      setToasts(prev => prev.filter(t => t.id !== id));
  };

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
  }, [activeBlueprint?.id, activeBlueprint?.imageData]);

  // RESTORE STATE: Load analysis results when switching blueprints
  useEffect(() => {
    // 1. Components & Quote
    if (activeBlueprint?.detectedComponents && activeBlueprint.detectedComponents.length > 0) {
        setComponents(activeBlueprint.detectedComponents);
        // Regenerate quote items from stored components
        setQuoteItems(activeBlueprint.detectedComponents.map(c => ({
              id: c.id,
              description: c.name,
              sku: c.sku,
              quantity: 1,
              unit: 'EA',
              materialCost: c.cost,
              hours: c.estimatedInstallHours || 2,
              laborCost: (c.estimatedInstallHours || 2) * quoteInfo.laborRate,
              comments: c.comments || []
        })));
    } else {
        setComponents([]);
        setQuoteItems([]);
    }

    // 2. Analysis Report
    if (activeBlueprint?.analysisText) {
        setAiAnalysis(activeBlueprint.analysisText);
    } else {
        setAiAnalysis(null);
    }
  }, [activeBlueprint?.id, activeBlueprint?.detectedComponents, activeBlueprint?.analysisText, quoteInfo.laborRate]);

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
      addToast("Project Created", `${data.name} initialized successfully.`, 'success');
  };

  const handleUpdateProject = (updatedProject: Project) => {
      const updatedList = projectDatabase.updateProject(updatedProject);
      setProjects(updatedList);
      addToast("Project Updated", "Changes saved successfully.", 'success');
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
      addToast("File Uploaded", "Blueprint upload complete. Ready for analysis.", 'info');
    };
    reader.readAsDataURL(file);
  };

  const cancelAnalysis = () => {
      if (abortControllerRef.current) {
          abortControllerRef.current.abort();
          abortControllerRef.current = null;
          setIsProcessing(false);
          setIsAnalyzing(false);
          addToast("Operation Cancelled", "Analysis pipeline stopped by user.", 'info');
      }
  };

  const runAnalysis = async () => {
    if (!uploadedImage || !activeProjectId) return;
    
    // Create new abort controller for this run
    const controller = new AbortController();
    abortControllerRef.current = controller;

    // STAGE 1: Visual Extraction
    setIsProcessing(true); // Triggers visual overlay on image
    setAiAnalysis(null);
    addToast("Stage 1 Initiated", "AI Vision extracting component topology...", 'info');
    
    try {
        const matches = uploadedImage.match(/^data:(.+);base64,(.+)$/);
        const mimeType = matches ? matches[1] : 'image/png';
        const base64Data = matches ? matches[2] : uploadedImage.split(',')[1];

        // Check cancellation before expensive call
        if (controller.signal.aborted) throw new Error("Cancelled");

        const extractionResult = await stage1Extraction(base64Data, mimeType);
        
        // Check cancellation after call
        if (controller.signal.aborted) throw new Error("Cancelled");

        // --- CRITICAL UI UPDATE ---
        // Visual processing (Stage 1) is done. Remove overlay so user can see the image with results.
        setIsProcessing(false); 
        
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
                  laborCost: (c.estimatedInstallHours || 2) * quoteInfo.laborRate,
                  comments: []
            })));
            addToast("Stage 1 Complete", `${extractionResult.detectedComponents.length} assets identified and tagged.`, 'success');

            // --- PERSIST STAGE 1 ---
            if (activeProjectId && activeBlueprintId) {
                const latestProjects = projectDatabase.getProjects();
                const targetBp = latestProjects.find(p => p.id === activeProjectId)?.blueprintsData.find(b => b.id === activeBlueprintId);
                if (targetBp) {
                    targetBp.detectedComponents = extractionResult.detectedComponents;
                    const updated = projectDatabase.saveBlueprint(activeProjectId, targetBp);
                    setProjects(updated);
                }
            }
        }

        // STAGE 2: Deep Analysis
        // We set isAnalyzing to true. This locks the button but DOES NOT obscure the image.
        setIsAnalyzing(true);
        addToast("Stage 2 Initiated", "Generating forensic engineering report...", 'info');
        
        // Check cancellation before next expensive call
        if (controller.signal.aborted) throw new Error("Cancelled");

        const analysisResult = await stage2Analysis(base64Data, mimeType, extractionResult.detectedComponents);
        
        // Check cancellation after call
        if (controller.signal.aborted) throw new Error("Cancelled");

        setAiAnalysis(analysisResult.analysisReport);
        setIsAnalyzing(false);
        addToast("Stage 2 Complete", "Forensic analysis report generated successfully.", 'success');

        // SYNC: Commit report to database
        if (analysisResult.analysisReport) {
            const newReport: AnalysisReport = {
                id: `rep-${Math.random().toString(36).substr(2, 5)}`,
                blueprintId: currentBlueprint.id,
                blueprintName: currentBlueprint.name,
                date: new Date().toLocaleString(),
                content: analysisResult.analysisReport,
                author: "AI Engine Stage 2"
            };
            projectDatabase.addReport(activeProjectId, newReport);
            
            // --- PERSIST STAGE 2 & METADATA ---
            if (activeProjectId && activeBlueprintId) {
                const latestProjects = projectDatabase.getProjects();
                const targetBp = latestProjects.find(p => p.id === activeProjectId)?.blueprintsData.find(b => b.id === activeBlueprintId);
                if (targetBp) {
                    targetBp.status = 'processed';
                    targetBp.compliance = 85 + Math.floor(Math.random() * 10);
                    targetBp.analysisText = analysisResult.analysisReport; // Save Report Text
                    const updated = projectDatabase.saveBlueprint(activeProjectId, targetBp);
                    setProjects(updated);
                }
            }
        }

    } catch (err: any) {
        if (err.message === "Cancelled") {
            // Already handled by cancel logic, mostly for clean exit
            console.log("Analysis run cancelled by user.");
        } else {
            console.error("Analysis failed", err);
            setAiAnalysis("Critical analysis failure. Pipeline interrupted.");
            addToast("Pipeline Error", "AI inference failed. Please try again.", 'error');
        }
    } finally {
        // Only reset if we are still the active controller (avoids race conditions with new runs)
        if (abortControllerRef.current === controller) {
            setIsProcessing(false);
            setIsAnalyzing(false);
            abortControllerRef.current = null;
        }
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
          hours: 0,
          comments: []
      }]);
  };

  const removeQuoteItem = (id: string) => {
      setQuoteItems(prev => prev.filter(item => item.id !== id));
  };

  const handleAddComment = (targetId: string, text: string) => {
      const newComment: Comment = {
          id: `c-${Date.now()}`,
          text,
          author: 'Me', // In a real app, this comes from auth
          initials: 'ME',
          timestamp: 'Just now',
          role: 'Lead'
      };

      // Update Components
      setComponents(prev => prev.map(c => 
          c.id === targetId 
            ? { ...c, comments: [...(c.comments || []), newComment] } 
            : c
      ));

      // Update Quote Items
      setQuoteItems(prev => prev.map(q => 
          q.id === targetId
            ? { ...q, comments: [...(q.comments || []), newComment] }
            : q
      ));

      // Persist to DB (Simulated)
      if (activeProjectId && activeBlueprintId) {
          const latestProjects = projectDatabase.getProjects();
          const targetBp = latestProjects.find(p => p.id === activeProjectId)?.blueprintsData.find(b => b.id === activeBlueprintId);
          if (targetBp) {
              const compIndex = targetBp.detectedComponents?.findIndex(c => c.id === targetId);
              if (compIndex !== undefined && compIndex !== -1 && targetBp.detectedComponents) {
                  const existingComments = targetBp.detectedComponents[compIndex].comments || [];
                  targetBp.detectedComponents[compIndex].comments = [...existingComments, newComment];
                  projectDatabase.saveBlueprint(activeProjectId, targetBp);
              }
          }
      }
  };

  // SEND PROPOSAL HANDLER
  const handleSendProposal = (recipients: string[], note: string) => {
      if (!activeProject) return;

      // Log activity
      const updatedProject = {
          ...activeProject,
          activityLog: [
              { 
                  text: `Proposal sent to ${recipients.join(', ')}`, 
                  time: 'Just now', 
                  type: 'clipboard' as const 
              },
              ...activeProject.activityLog
          ]
      };
      projectDatabase.updateProject(updatedProject);
      refreshProjects();
      
      addToast("Proposal Sent", `Quote distributed to ${recipients.length} team members.`, 'success');
  };

  if (!activeProject && projects.length === 0) {
      return (
          <div className="h-screen bg-black flex items-center justify-center">
              <div className="text-center">
                  <div className="w-12 h-12 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-500 font-mono text-xs uppercase tracking-widest">Initializing AI engine...</p>
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
                onUpdateProject={handleUpdateProject}
            />
        )}
        {view === 'workspace' && activeProject && (
            <WorkspaceView 
                blueprint={currentBlueprint} 
                activeProject={activeProject}
                projects={projects}
                onSelectProject={handleSelectProject}
                isProcessing={isProcessing}
                isAnalyzing={isAnalyzing}
                onRunAnalysis={runAnalysis}
                onCancelAnalysis={cancelAnalysis}
                uploadedImage={uploadedImage}
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
              // Pass Team Data
              teamMembers={activeProject?.team}
              onSendProposal={handleSendProposal}
              onAddComment={handleAddComment}
          />
      )}

      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
};
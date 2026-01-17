
import React, { useState, useEffect, useCallback, useRef } from "react";
import { Icons } from "./components/Icons";
import { DashboardView } from "./views/DashboardView";
import { ProjectsView } from "./views/ProjectsView";
import { WorkspaceView } from "./views/WorkspaceView";
import { RightPanel } from "./features/RightPanel";
import { stage1Extraction, stage2Analysis, synthesizeMultiPageReport, AI_MODELS } from "./services/aiService";
import { projectDatabase, getImageFromDB, getPagesFromDB } from "./services/projectDatabase";
import { ViewState, DetectedComponent, QuoteItem, QuoteInfo, Project, AnalysisReport, Blueprint, Comment } from "./types";
import { NewProjectData } from "./components/NewProjectModal";
import { ToastContainer, ToastMsg, ToastType } from "./components/Toasts";
import { GlobalSettingsModal } from "./components/GlobalSettingsModal";
import { ConfirmationModal } from "./components/ConfirmationModal";

const NavItem = ({ active, onClick, icon, tooltip }: { active: boolean, onClick: () => void, icon: React.ReactNode, tooltip: string }) => (
    <button 
        onClick={onClick}
        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 group relative ${
            active 
            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
            : 'text-zinc-500 hover:text-white hover:bg-white/5'
        }`}
    >
        {icon}
        <div className="absolute left-full ml-3 px-2 py-1 bg-zinc-800 text-white text-[10px] font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 border border-white/5">
            {tooltip}
        </div>
        {active && <div className="absolute left-0 top-1/2 -translate-y-1/2 -ml-3 w-1 h-4 bg-blue-600 rounded-r-full"></div>}
    </button>
);

export const App = () => {
  const [view, setView] = useState<ViewState>('dashboard');
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [activeBlueprintId, setActiveBlueprintId] = useState<string | null>(null);

  // --- MODEL STATE ---
  const [activeModelId, setActiveModelId] = useState<string>(AI_MODELS.FLASH.id);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // --- MODAL STATE ---
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);

  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  // NEW: State to hold all pages for multi-page analysis
  const [documentPages, setDocumentPages] = useState<string[]>([]);
  
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
  
  // Interaction State
  const [highlightedComponentId, setHighlightedComponentId] = useState<string | null>(null);
  const [requestedExpandId, setRequestedExpandId] = useState<string | null>(null);

  const addToast = (title: string, message: string, type: ToastType = 'info') => {
      const id = Date.now().toString();
      setToasts(prev => [...prev, { id, title, message, type }]);
  };

  const removeToast = (id: string) => {
      setToasts(prev => prev.filter(t => t.id !== id));
  };

  const refreshProjects = useCallback(() => {
    const loadedProjects = projectDatabase.getProjects();
    setProjects(loadedProjects);
    return loadedProjects;
  }, []);

  useEffect(() => {
    const loaded = refreshProjects();
    if (loaded.length > 0 && !activeProjectId) {
      setActiveProjectId(loaded[0].id);
      if (loaded[0].blueprintsData.length > 0) {
          setActiveBlueprintId(loaded[0].blueprintsData[0].id);
      }
    }
  }, [refreshProjects, activeProjectId]);

    // On startup, query backend for actual loaded model and set activeModelId accordingly
    useEffect(() => {
            let mounted = true;
            const sleep = (ms: number) => new Promise(res => setTimeout(res, ms));
            const checkModel = async () => {
                try {
                    const maxAttempts = 8;
                    for (let attempt = 0; attempt < maxAttempts && mounted; attempt++) {
                        const resp = await fetch('http://localhost:8000/api/model');
                        if (!resp.ok) {
                            await sleep(1000);
                            continue;
                        }
                        const data = await resp.json();
                        if (!mounted) return;

                        // Prefer the matched_model returned by backend (best-effort)
                        const matched = data.matched_model || data.model;
                        const available: string[] = data.available || [];

                        if (data.loaded && matched) {
                            const name = (matched as string).toLowerCase();
                            // Direct mapping to AI_MODELS by id
                            const direct = Object.values(AI_MODELS).find(m => m.id === name || (m.id && name.includes(m.id)));
                            if (direct) {
                                setActiveModelId(direct.id);
                                return;
                            }

                            // Heuristics: look for qwen / llama keywords
                            if (name.includes('qwen')) {
                                setActiveModelId(AI_MODELS.QWEN_VL.id);
                                return;
                            }
                            if (name.includes('llama') || name.includes('llm')) {
                                setActiveModelId(AI_MODELS.LOCAL_OLLAMA.id);
                                return;
                            }

                            // Fallback: if available list contains obvious candidates
                            for (const a of available) {
                                const low = (a || '').toLowerCase();
                                if (low.includes('qwen')) { setActiveModelId(AI_MODELS.QWEN_VL.id); return; }
                                if (low.includes('llama')) { setActiveModelId(AI_MODELS.LOCAL_OLLAMA.id); return; }
                            }

                            // If no mapping, set the raw matched string as activeModelId if it exists in mapping
                            const foundAny = Object.values(AI_MODELS).find(m => matched && ((m.id && (matched as string).includes(m.id))));
                            if (foundAny) { setActiveModelId(foundAny.id); return; }

                            // otherwise break and leave default
                            return;
                        }

                        // Not loaded yet — wait and retry
                        await sleep(1000);
                    }
                } catch (e) {
                    console.debug('Could not query model status', e);
                }
            };
            checkModel();
            return () => { mounted = false; };
    }, []);

  const activeProject = projects.find(p => p.id === activeProjectId) || projects[0] || null;
  
  const activeBlueprint = (activeProject && activeBlueprintId) 
      ? activeProject.blueprintsData.find(b => b.id === activeBlueprintId) 
      : null;
      
  const currentBlueprint: Blueprint = activeBlueprint || { 
      id: 'new-session', name: 'Draft Analysis', status: 'queued', compliance: 0, uploadedBy: 'System', uploadedAt: 'Now' 
  };

  // ASYNC IMAGE & PAGES LOADER
  useEffect(() => {
    const loadBlueprintAssets = async () => {
        if (!activeBlueprintId) {
            setUploadedImage(null);
            setDocumentPages([]);
            return;
        }

        let img: string | undefined = undefined;
        let pages: string[] | undefined = undefined;

        if (activeBlueprint?.imageData) {
            // Legacy support
            img = activeBlueprint.imageData;
        } else if (activeBlueprint?.id) {
            // Load from IndexedDB
            img = await getImageFromDB(activeBlueprint.id);
            // Try to load pages if they exist
            pages = await getPagesFromDB(activeBlueprint.id);
        }

        setUploadedImage(img || null);
        setDocumentPages(pages || (img ? [img] : []));
    };
    loadBlueprintAssets();
  }, [activeBlueprint?.imageData, activeBlueprintId, activeBlueprint?.id]);

  useEffect(() => {
    if (activeBlueprint?.detectedComponents && activeBlueprint.detectedComponents.length > 0) {
        setComponents(activeBlueprint.detectedComponents);
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
          issues: [],
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

  const processImageUpload = (pages: string[], fileName: string, targetProjectId: string) => {
      if (pages.length === 0) return;

      const newBlueprint: Blueprint = {
          id: `bp-${Math.random().toString(36).substr(2, 5)}`,
          name: fileName,
          status: 'processing',
          compliance: 0,
          uploadedBy: 'Lead Engineer',
          uploadedAt: 'Just now',
          imageData: pages[0], // Preview is the first page
          pages: pages // Store all pages
      };

      projectDatabase.saveBlueprint(targetProjectId, newBlueprint);
      refreshProjects();
      
      if (targetProjectId === activeProjectId) {
        setActiveBlueprintId(newBlueprint.id);
        setUploadedImage(pages[0]);
        setDocumentPages(pages);
      }
      
      if (pages.length > 1) {
          addToast("Multi-Page PDF", `${pages.length} pages processed. Detection skipped for full document analysis mode.`, 'info');
      } else {
          addToast("File Uploaded", "Blueprint upload complete. Ready for analysis.", 'info');
      }
  };

  const handleUploadBlueprint = async (file: File, targetProjectId: string) => {
    if (file.type === 'application/pdf') {
        try {
            addToast("Uploading PDF", "Sending file to backend for server-side processing...", 'info');
            setIsProcessing(true);

            const reader = new FileReader();
            reader.onload = async (evt) => {
                try {
                    const base64 = evt.target?.result as string; // data:application/pdf;base64,...
                    const resp = await fetch('http://localhost:8000/api/upload', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ file_base64: base64, filename: file.name })
                    });

                    if (!resp.ok) {
                        const text = await resp.text();
                        console.error('upload failed', text);
                        addToast('Upload Failed', 'Server failed to process PDF.', 'error');
                        setIsProcessing(false);
                        return;
                    }

                    const data = await resp.json();
                    if (data.error) {
                        console.error('upload error', data);
                        addToast('Upload Failed', data.error || 'Unknown error', 'error');
                        setIsProcessing(false);
                        return;
                    }

                    const pages: string[] = data.pages || [];
                    processImageUpload(pages.length ? pages : [base64], file.name, targetProjectId);
                    addToast('Upload Complete', `Rendered ${pages.length} page(s).`, 'success');
                } catch (err) {
                    console.error(err);
                    addToast('Upload Failed', 'Could not process PDF upload.', 'error');
                } finally {
                    setIsProcessing(false);
                }
            };
            reader.onerror = (err) => {
                console.error(err);
                addToast('Upload Failed', 'Could not read PDF file.', 'error');
                setIsProcessing(false);
            };
            reader.readAsDataURL(file);
        } catch (error) {
            console.error(error);
            addToast('Upload Failed', 'Could not process PDF document.', 'error');
            setIsProcessing(false);
        }
    } else {
        const reader = new FileReader();
        reader.onload = (evt) => {
            const base64 = evt.target?.result as string;
            // Treat single image as 1-page array
            processImageUpload([base64], file.name, targetProjectId);
        };
        reader.readAsDataURL(file);
    }
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

  const handleClearWorkspaceRequest = () => {
      setIsClearModalOpen(true);
  };

  const handleClearWorkspaceConfirm = () => {
      setUploadedImage(null);
      setDocumentPages([]);
      setComponents([]);
      setQuoteItems([]);
      setAiAnalysis(null);
      setIsProcessing(false);
      setIsAnalyzing(false);
      setHighlightedComponentId(null);
      setActiveBlueprintId(null); 
      addToast("Workspace Cleared", "Session reset successfully.", 'info');
  };

  const runAnalysis = async () => {
    if (!uploadedImage || !activeProjectId) return;
    
    const controller = new AbortController();
    abortControllerRef.current = controller;

    // --- PIPELINE FORK: MULTI-PAGE vs SINGLE PAGE ---
    // If we have multiple pages, we SKIP detection (Stage 1) and run Analysis (Stage 2) on every page.
    const isMultiPage = documentPages.length > 1;

    setAiAnalysis(null);

    try {
        let extractedComponents: DetectedComponent[] = [];

        // ------------------------------------------
        // PATH A: SINGLE PAGE (Standard Workflow)
        // Run Detection -> Then Analysis
        // ------------------------------------------
        if (!isMultiPage) {
            setIsProcessing(true);
            addToast("Detection Analysis", `Extracting topology using ${activeModelId === AI_MODELS.FLASH.id ? 'Flash (Speed)' : 'Pro (Reasoning)'}...`, 'info');
            
            const matches = uploadedImage.match(/^data:(.+);base64,(.+)$/);
            const mimeType = matches ? matches[1] : 'image/png';
            const base64Data = matches ? matches[2] : uploadedImage.split(',')[1];

            if (controller.signal.aborted) throw new Error("Cancelled");
            const extractionResult = await stage1Extraction(base64Data, mimeType, activeModelId);
            if (controller.signal.aborted) throw new Error("Cancelled");

            setIsProcessing(false); 
            
            if (extractionResult.detectedComponents) {
                extractedComponents = extractionResult.detectedComponents;
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
                      comments: c.comments || []
                })));
                addToast("Detection Complete", `${extractionResult.detectedComponents.length} assets identified and tagged.`, 'success');

                // Save components to DB
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

            // Single Page Analysis
            setIsAnalyzing(true);
            addToast("Report Generation", "Generating forensic engineering report...", 'info');
            
            if (controller.signal.aborted) throw new Error("Cancelled");
            const analysisResult = await stage2Analysis(base64Data, mimeType, extractedComponents, activeModelId);
            if (controller.signal.aborted) throw new Error("Cancelled");

            setAiAnalysis(analysisResult.analysisReport);
            
        } 
        // ------------------------------------------
        // PATH B: MULTI-PAGE (Full Document Mode)
        // Skip Detection -> Loop Analysis per Page -> Synthesize Master Report
        // ------------------------------------------
        else {
            setIsAnalyzing(true);
            addToast("Multi-Page Pipeline", `Initiating deep analysis on ${documentPages.length} pages. This may take a moment.`, 'info');
            
            const rawPageReports: string[] = [];
            
            // 1. Map Phase: Extract insights from each page
            for (let i = 0; i < documentPages.length; i++) {
                if (controller.signal.aborted) throw new Error("Cancelled");
                
                const pageImage = documentPages[i];
                const matches = pageImage.match(/^data:(.+);base64,(.+)$/);
                const mimeType = matches ? matches[1] : 'image/png';
                const base64Data = matches ? matches[2] : pageImage.split(',')[1];

                addToast("Analyzing Document", `Processing Page ${i + 1} of ${documentPages.length}...`, 'info');
                
                // Show progress in the analysis panel
                setAiAnalysis(`## 🔄 Processing Pipeline Active\n\n**Analyzing Page ${i + 1} of ${documentPages.length}...**\n\n> Extracting topology, identifying anomalies, and digitizing specifications...`);

                // We pass an empty component list because detection was skipped
                const pageAnalysis = await stage2Analysis(base64Data, mimeType, [], activeModelId);
                rawPageReports.push(pageAnalysis.analysisReport);
            }

            // 2. Reduce Phase: Synthesize into Master Report
            if (controller.signal.aborted) throw new Error("Cancelled");
            
            addToast("Synthesizing Report", "Merging page insights into master forensic document...", 'info');
            setAiAnalysis(`## 🧠 Synthesizing Master Report\n\n**Merging ${documentPages.length} analysis streams...**\n\n> Cross-referencing findings, deduplicating issues, and generating executive summary...`);

            const masterReport = await synthesizeMultiPageReport(rawPageReports, currentBlueprint.name, activeModelId);
            
            setAiAnalysis(masterReport.analysisReport);
        }

        setIsAnalyzing(false);
        addToast("Analysis Report Ready", "Forensic analysis report generated successfully.", 'success');

        // Save Final Report to DB (For both single and multi-page, aiAnalysis state is updated)
        // Note: state update is async, so we use the value we just obtained/set
        // But for simplicity in this synchronous block flow, we might need to rely on the side-effect or duplicate the save logic
        // The original code handled saving in state, let's keep it simple and ensure the latest result is what counts.
        
        // We will trigger a re-save of the project with the new report content if available
        if (activeProjectId && activeBlueprintId) {
             // Logic to save the report is currently in `projectDatabase.addReport` inside specific paths in original code.
             // We should consolidate it here or trust the state effect? 
             // Best to just let the user see it. If they want to keep it, we could autosave.
             // (Original code had autosave logic inside the single page block, let's replicate that for multi-page implicit save)
             
             // ... We can add a "Save Report" feature later or just rely on the user viewing it.
             // For now, let's auto-save the generated text to the blueprint so it persists on reload.
             
             setTimeout(() => {
                 setAiAnalysis(prev => {
                     if (prev && activeProjectId && activeBlueprintId) {
                        const projects = projectDatabase.getProjects();
                        const project = projects.find(p => p.id === activeProjectId);
                        const bp = project?.blueprintsData.find(b => b.id === activeBlueprintId);
                        if (project && bp) {
                            bp.analysisText = prev;
                            bp.status = 'processed';
                            projectDatabase.saveBlueprint(activeProjectId, bp);
                            
                            // Also add to report registry
                            const newReport: AnalysisReport = {
                                id: `rep-${Math.random().toString(36).substr(2, 5)}`,
                                blueprintId: bp.id,
                                blueprintName: bp.name,
                                date: new Date().toLocaleString(),
                                content: prev,
                                author: `AI Engine (${activeModelId})`
                            };
                            projectDatabase.addReport(activeProjectId, newReport);
                        }
                     }
                     return prev;
                 });
             }, 100);
        }

    } catch (err: any) {
        if (err.message === "Cancelled") {
            console.log("Analysis run cancelled by user.");
        } else {
            console.error("Analysis failed", err);
            setAiAnalysis("Critical analysis failure. Pipeline interrupted.");
            addToast("Pipeline Error", "AI inference failed. Please try again.", 'error');
        }
    } finally {
        if (abortControllerRef.current === controller) {
            setIsProcessing(false);
            setIsAnalyzing(false);
            abortControllerRef.current = null;
        }
    }
  };

  const handleUpdateComponent = (id: string, updates: Partial<DetectedComponent>) => {
      setComponents(prev => prev.map(comp => {
          if (comp.id === id) {
              const updated = { ...comp, ...updates };
              if (updates.name || updates.cost !== undefined || updates.sku || updates.estimatedInstallHours !== undefined) {
                 setQuoteItems(prevQ => prevQ.map(q => {
                     if (q.id === id) {
                         return {
                             ...q,
                             description: updates.name || q.description,
                             sku: updates.sku || q.sku,
                             materialCost: updates.cost !== undefined ? updates.cost : q.materialCost,
                             hours: updates.estimatedInstallHours !== undefined ? updates.estimatedInstallHours : q.hours,
                             laborCost: (updates.estimatedInstallHours !== undefined ? updates.estimatedInstallHours : q.hours) * quoteInfo.laborRate
                         };
                     }
                     return q;
                 }));
              }
              return updated;
          }
          return comp;
      }));
  };

  const handleDeleteComponent = (id: string) => {
      setComponents(prev => prev.filter(c => c.id !== id));
      setQuoteItems(prev => prev.filter(q => q.id !== id));
      if (highlightedComponentId === id) setHighlightedComponentId(null);
  };

  const handleAddComponent = () => {
      const newId = `MAN-${Date.now().toString().slice(-4)}`;
      const newComp: DetectedComponent = {
          id: newId,
          name: 'New Asset',
          type: 'Accessory',
          confidence: 1.0,
          status: 'review',
          cost: 0,
          sku: 'PENDING',
          description: 'Manually added component',
          technicalSpecs: {},
          comments: []
      };
      setComponents(prev => [newComp, ...prev]);
      setQuoteItems(prev => [{
          id: newId,
          description: newComp.name,
          sku: newComp.sku,
          quantity: 1,
          unit: 'EA',
          materialCost: 0,
          laborCost: 0,
          hours: 2,
          comments: []
      }, ...prev]);
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

      setComponents(prev => prev.map(comp => {
          if (comp.id === id) {
              const updates: Partial<DetectedComponent> = {};
              if (field === 'materialCost') updates.cost = value;
              if (field === 'description') updates.name = value;
              if (field === 'sku') updates.sku = value;
              if (field === 'hours') updates.estimatedInstallHours = value;
              return { ...comp, ...updates };
          }
          return comp;
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
          author: 'Me',
          initials: 'ME',
          timestamp: 'Just now',
          role: 'Lead'
      };

      setComponents(prev => prev.map(c => 
          c.id === targetId ? { ...c, comments: [...(c.comments || []), newComment] } : c
      ));

      setQuoteItems(prev => prev.map(q => 
          q.id === targetId ? { ...q, comments: [...(q.comments || []), newComment] } : q
      ));

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

  const handleSendProposal = (recipients: string[], note: string) => {
      if (!activeProject) return;
      const updatedProject = {
          ...activeProject,
          activityLog: [
              { text: `Proposal sent to ${recipients.join(', ')}`, time: 'Just now', type: 'clipboard' as const },
              ...activeProject.activityLog
          ]
      };
      projectDatabase.updateProject(updatedProject);
      refreshProjects();
      addToast("Proposal Sent", `Quote distributed to ${recipients.length} team members.`, 'success');
  };

  const handleRequestComponentExpand = (id: string) => {
      setRequestedExpandId(id);
      setTimeout(() => setRequestedExpandId(null), 100);
  };

  if (!activeProject && projects.length === 0) {
      return (
          <div className="h-screen bg-black flex items-center justify-center">
              <div className="text-center">
                  <div className="w-12 h-12 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest">Initializing AI engine...</p>
              </div>
          </div>
      );
  }

  return (
    <div className="flex h-screen bg-[#000000] text-gray-200 font-sans selection:bg-blue-500/30 overflow-hidden">
      
      <GlobalSettingsModal 
          isOpen={isSettingsOpen} 
          onClose={() => setIsSettingsOpen(false)} 
          activeModelId={activeModelId}
          onSelectModel={setActiveModelId}
      />

      <ConfirmationModal 
          isOpen={isClearModalOpen}
          onClose={() => setIsClearModalOpen(false)}
          onConfirm={handleClearWorkspaceConfirm}
          title="Clear Workspace"
          message={activeBlueprintId ? "Are you sure you want to close this blueprint? Unsaved analysis data and temporary edits will be cleared from the active view." : "Are you sure you want to clear the current analysis session?"}
          confirmLabel="Clear Session"
          isDestructive={true}
      />

      <nav className="w-16 bg-zinc-950 flex flex-col items-center py-6 gap-4 z-50 shrink-0 border-r border-white/5">
        <div className="text-blue-500 mb-4 p-2 bg-blue-500/10 rounded-xl"><Icons.Wind width={20} height={20} /></div>
        <NavItem active={view === 'dashboard'} onClick={() => setView('dashboard')} icon={<Icons.Home width={18} height={18} />} tooltip="Dashboard" />
        <NavItem active={view === 'projects'} onClick={() => setView('projects')} icon={<Icons.Layers width={18} height={18} />} tooltip="Projects" />
        <NavItem active={view === 'workspace'} onClick={() => setView('workspace')} icon={<Icons.Maximize width={18} height={18} />} tooltip="Workspace" />
        <div className="mt-auto">
             <NavItem active={isSettingsOpen} onClick={() => setIsSettingsOpen(true)} icon={<Icons.Settings width={18} height={18} />} tooltip="Settings" />
        </div>
      </nav>

      <main className="flex-1 overflow-hidden relative flex flex-col min-w-0 bg-[#050505]">
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
                onClearWorkspace={handleClearWorkspaceRequest}
                highlightedComponentId={highlightedComponentId}
                components={components}
                activeModelId={activeModelId}
                onSelectModel={setActiveModelId}
                onHoverComponent={(id) => setHighlightedComponentId(id)}
                onSelectComponent={handleRequestComponentExpand}
                documentPages={documentPages}
            />
        )}
      </main>

      {view === 'workspace' && (
          <RightPanel 
              components={components}
              onUpdateComponentCost={handleComponentCostChange}
              onUpdateComponent={handleUpdateComponent}
              onDeleteComponent={handleDeleteComponent}
              onAddComponent={handleAddComponent}
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
              teamMembers={activeProject?.team}
              onSendProposal={handleSendProposal}
              onAddComment={handleAddComment}
              onHoverComponent={(id) => setHighlightedComponentId(id)}
              requestedExpandId={requestedExpandId}
          />
      )}

      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
};

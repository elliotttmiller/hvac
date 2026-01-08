import React, { useState, useEffect, useRef } from 'react';
import InteractiveViewer from '@/features/blueprint-viewer/InteractiveViewer';
import InspectorPanel from './InspectorPanel';
import { analyzeDocument, generateBackgroundAnalysis } from '@/features/document-analysis/orchestrator';
import startConsoleCapture from '@/lib/consoleCapture';
import { config } from '@/app/config';
import { DetectedComponent, ValidationIssue} from '@/features/document-analysis/types';
import { ProcessingPhase } from '@/components/feedback/ProcessingOverlay';
import { useToastHelpers } from '@/lib/hooks/useToast';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const BlueprintWorkspace: React.FC<{
  fileToAnalyze?: string | null;
  onAnalyzed?: () => void;
}> = ({ fileToAnalyze, onAnalyzed }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingPhase, setProcessingPhase] = useState<ProcessingPhase>('uploading');
  
  // Analysis Data
  const [analysisRaw, setAnalysisRaw] = useState<string>("");
  const [executiveSummary, setExecutiveSummary] = useState<string>("");
  const [inventory, setInventory] = useState<any[]>([]);
  const [detectedBoxes, setDetectedBoxes] = useState<DetectedComponent[]>([]);
  const [validationIssues, setValidationIssues] = useState<ValidationIssue[]>([]);
  const [finalAnalysisReport, setFinalAnalysisReport] = useState<any>(null);
  
  // Interactivity State
  const [selectedBoxId, setSelectedBoxId] = useState<string | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [panelWidth, setPanelWidth] = useState(320);
  const [isResizingPanel, setIsResizingPanel] = useState(false);
  
  // Background analysis state
  const [backgroundJobId, setBackgroundJobId] = useState<string | null>(null);
  const [isBackgroundRunning, setIsBackgroundRunning] = useState(false);
  const finalAnalysisReportRef = useRef<any>(null);

  // Normalize various server response shapes into the UI-friendly finalAnalysisReport
  const normalizeFinalReport = (raw: any) => {
    if (!raw) return null;

    // Support both snake_case keys and human-friendly title keys from mock/AI
    const get = (keys: string[]) => {
      for (const k of keys) {
        if (raw[k] !== undefined && raw[k] !== null) return raw[k];
      }
      return undefined;
    };

    const normalized: any = {
      report_title: get(['report_title', 'title', 'reportTitle', 'Report Title', 'report']) || null,
      executive_summary: get(['executive_summary', 'executiveSummary', 'Executive Summary']) || get(['executive_summary_text']) || null,
      system_workflow_narrative: get(['system_workflow_narrative', 'systemWorkflowNarrative', 'System Workflow Narrative']) || null,
      control_logic_analysis: get(['control_logic_analysis', 'controlLogicAnalysis', 'Control Logic Analysis']) || null,
      specifications_and_details: get(['specifications_and_details', 'specificationsAndDetails', 'Specifications and Details']) || null,
      critical_equipment: get(['critical_equipment', 'criticalEquipment', 'Critical Equipment']) || null,
      engineering_observations: get(['engineering_observations', 'engineeringObservations', 'Engineering Observations']) || null,
      // Keep the original payload for debugging/fallback
      _raw: raw
    };

    // If no canonical fields found but raw has keys, try to infer common single-string report
    const hasAny = Object.keys(normalized).some(k => normalized[k]);
    if (!hasAny) {
      // If raw looks like a single string or has a single top-level text field, map it to system_workflow_narrative
      if (typeof raw === 'string') {
        normalized.system_workflow_narrative = raw;
      } else if (raw.raw && typeof raw.raw === 'string') {
        normalized.system_workflow_narrative = raw.raw;
      } else if (Object.keys(raw).length === 1) {
        const val = raw[Object.keys(raw)[0]];
        if (typeof val === 'string') normalized.system_workflow_narrative = val;
      }
    }

    return normalized;
  };
  
  // Toast notifications
  const toast = useToastHelpers();

  // Auto-run analysis when a file is selected from the sidebar
  useEffect(() => {
    if (!fileToAnalyze) return;

    const loadAndMaybeAnalyze = async () => {
      try {
        const response = await fetch(`/api/files/content?path=${encodeURIComponent(fileToAnalyze)}`);
        if (!response.ok) throw new Error('Failed to load file');

        const blob = await response.blob();
        const file = new File([blob], fileToAnalyze.split('/').pop() || 'file');
        const url = URL.createObjectURL(file);

        setImageUrl(url);
        setDetectedBoxes([]);
        setInventory([]);

        // AUTO-RUN DISABLED: do not automatically invoke the analysis pipeline when
        // a file is selected from the sidebar. Loading the image into the viewer
        // is sufficient — the user must click the "Run" button to start analysis.
        //
        // If you need to re-enable automatic analysis, restore the block below:
        // if (config.features.autoAnalyze) {
        //   await runAnalysisInternal(file, url);
        // }

        onAnalyzed?.();
      } catch (error) {
        console.error('Failed to load file for analysis:', error);
        onAnalyzed?.();
      }
    };

    loadAndMaybeAnalyze();
  }, [fileToAnalyze, onAnalyzed]);

  // Persistent polling for background job completion
  // Polls the server every 2 seconds to check if Stage 2 analysis is complete
  useEffect(() => {
    // Only poll if we have a job ID and background analysis is running
    if (!backgroundJobId || !isBackgroundRunning) {
      return;
    }

    console.log('[Polling] Starting poll for job:', backgroundJobId);

    const pollInterval = setInterval(async () => {
      try {
        // Poll the project endpoint instead of the ephemeral job endpoint
        // This ensures persistence across page refreshes
        const projectId = 'default'; // TODO: Make this configurable per project
        console.log('[Polling] Checking project status:', projectId);
        const response = await fetch(`/api/projects/${projectId}`);
        
        if (!response.ok) {
          console.warn('[Polling] Failed to fetch project status:', response.status);
          return;
        }

        const projectData = await response.json();
        console.log('[Polling] Project status:', projectData.status);

        if (projectData.status === 'completed') {
          console.log('[Polling] Project completed! Setting final analysis report');
          
          // Stop polling
          clearInterval(pollInterval);
          setIsBackgroundRunning(false);
          
          // Update state with the final report
          if (projectData.finalReport) {
            const normalized = normalizeFinalReport(projectData.finalReport);
            setFinalAnalysisReport(normalized);
            finalAnalysisReportRef.current = normalized;
            
            // Update analysis raw log with completion message
            setAnalysisRaw((prev) => `${prev}\n\n[Stage 2 Complete] Final analysis report generated successfully.`);
            
            // Show success toast
            toast.success(
              'Comprehensive analysis ready',
              'Click to view the detailed report',
              {
                duration: 8000,
                clickable: true,
                onClick: () => {
                  window.dispatchEvent(new CustomEvent('switch-to-analysis-tab'));
                }
              }
            );
          }
        } else if (projectData.status === 'failed') {
          console.error('[Polling] Project failed:', projectData.error);
          
          // Stop polling
          clearInterval(pollInterval);
          setIsBackgroundRunning(false);
          
          // Show error toast
          toast.error(
            'Background analysis failed',
            projectData.error || 'Unable to generate comprehensive report',
            { duration: 6000 }
          );
        }
        // If status is 'processing' or 'idle', continue polling
      } catch (error) {
        console.error('[Polling] Error checking project status:', error);
      }
    }, 2000); // Poll every 2 seconds

    // Cleanup: stop polling when component unmounts or job changes
    return () => {
      console.log('[Polling] Cleanup: stopping poll');
      clearInterval(pollInterval);
    };
  }, [backgroundJobId, isBackgroundRunning, toast]);

  // Right panel resizing effect (mouse drag)
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizingPanel) return;
      // Calculate width from the right edge: use viewport math and subtract a left-margin offset
      const newWidth = Math.round(window.innerWidth - e.clientX - 56);
      if (newWidth > 200 && newWidth < 720) {
        setPanelWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizingPanel(false);
    };

    if (isResizingPanel) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    } else {
      document.body.style.cursor = 'default';
      document.body.style.userSelect = 'auto';
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'default';
      document.body.style.userSelect = 'auto';
    };
  }, [isResizingPanel]);

  // Main analysis function - STAGE 1: Fast visual analysis
  const runAnalysisInternal = async (file: File, url: string) => {
    setIsProcessing(true);
    setProcessingPhase('classifying');
    setFinalAnalysisReport(null); // Clear previous final analysis
    finalAnalysisReportRef.current = null; // Clear ref as well

    // Append-only log helper for the inspector panel
    const appendLog = (msg: string) => {
      setAnalysisRaw((prev) => (prev ? `${prev}\n${msg}` : msg));
      try { window.dispatchEvent(new CustomEvent('analysis-log', { detail: msg })); } catch(_){}
    };

    appendLog('Step 1: Classifying document...');

    // Optionally capture console output during analysis (dev flag)
    const stopCapture = config.features.captureConsole ? startConsoleCapture(appendLog) : () => {};

    try {
      const base64Data = url.split(',')[1] || await blobToBase64(file);
      setProcessingPhase('analyzing');
      
      // STAGE 1: Fast visual analysis
      const result = await analyzeDocument(base64Data, { fileName: file.name, onProgress: appendLog });
      console.log('Stage 1 (Visual Analysis) complete:', result);

      setProcessingPhase('refining');

      if (result.visual && result.visual.components) {
        // Keep canonical DetectedComponent objects from the analysis pipeline
        setDetectedBoxes(result.visual.components);

        // Generate inventory
        const counts: Record<string, number> = {};
        result.visual.components.forEach((comp) => {
          const key = comp.meta?.description || comp.type;
          counts[key] = (counts[key] || 0) + 1;
        });
        setInventory(Object.entries(counts).map(([name, count]) => ({ name, count })));
      }

      setExecutiveSummary(result.executive_summary || `Document classified as: ${result.document_type}`);
      setValidationIssues(result.validation_issues || []);
      setAnalysisRaw((prev) => `${prev}\n\n${JSON.stringify(result, null, 2)}`);

      // STAGE 1 COMPLETE - Release UI
      setTimeout(() => setIsProcessing(false), 500);
      
      // STAGE 2: Background final analysis
      // Show toast notification that background analysis is starting
      toast.info(
        'Visual analysis complete',
        'Generating comprehensive report in the background...',
        { duration: 4000 }
      );
      
      setIsBackgroundRunning(true);
      
      // Trigger background analysis
      generateBackgroundAnalysis(result, {
        onProgress: (msg) => {
          console.log('[Stage 2]', msg);
          appendLog(`[Background] ${msg}`);
        },
        // Note: onComplete and onError callbacks are now handled by polling
        // The socket.io events may fire, but polling is the authoritative source
        onComplete: (report) => {
          console.log('[Stage 2] Socket event: Final analysis complete:', report);
          // Fallback in case socket fires before polling
          // Use ref to check latest state and avoid race condition
          if (report && !finalAnalysisReportRef.current) {
            const normalized = normalizeFinalReport(report);
            setFinalAnalysisReport(normalized);
            finalAnalysisReportRef.current = normalized;
          }
        },
        onError: (error) => {
          console.error('[Stage 2] Socket event: Final analysis failed:', error);
          setIsBackgroundRunning(false);
        }
      }).then(jobId => {
        setBackgroundJobId(jobId);
        console.log('[Stage 2] Background job queued:', jobId);
        // Polling will now activate via useEffect watching backgroundJobId
      }).catch(err => {
        console.error('[Stage 2] Failed to queue background job:', err);
        setIsBackgroundRunning(false);
        
        toast.error(
          'Failed to start background analysis',
          err.message || 'Unable to queue analysis job',
          { duration: 6000 }
        );
      });

    } catch (error) {
        console.error(error);
        const msg = `Error: ${error instanceof Error ? error.message : "Pipeline Failed"}`;
        setAnalysisRaw((prev) => (prev ? `${prev}\n${msg}` : msg));
        setIsProcessing(false);
        
        // Show error toast
        toast.error(
          'Analysis failed',
          error instanceof Error ? error.message : 'Unknown error occurred',
          { duration: 6000 }
        );
    } finally {
      try { stopCapture(); } catch (_) {}
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImageUrl(url);
      // AUTO-RUN DISABLED: do not automatically invoke analysis on direct upload.
      // Users should click the Run button to start the pipeline.
      // To re-enable, restore:
      // if (config.features.autoAnalyze) runAnalysisInternal(file, url);
    }
  };

  const handleClearImage = () => {
    setImageUrl(null);
    setDetectedBoxes([]);
  };

  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
      reader.readAsDataURL(blob);
    });
  };

  return (
    <div className="flex-1 flex h-full bg-[#121212] overflow-hidden relative">
      <InteractiveViewer 
        imageUrl={imageUrl}
        components={detectedBoxes} // <--- CORRECTED PROP NAME
        isProcessing={isProcessing}
        processingPhase={processingPhase}
        selectedBoxId={selectedBoxId}
        onSelectBox={setSelectedBoxId}
        onFileUpload={handleFileUpload}
        onClearImage={handleClearImage}
        onRunAnalysis={() => {
          if (imageUrl) {
            fetch(imageUrl).then(res => res.blob()).then(blob => {
              const file = new File([blob], "current-image");
              runAnalysisInternal(file, imageUrl);
            });
          }
        }}
        debugMode={config.features.debugOverlay}
      />

      {/* Resizable Right Panel */}
      <div 
        className={`relative flex flex-col bg-[#1e1e1e] border-l border-white/5 shrink-0 ${!isPanelOpen && 'border-l-0 overflow-hidden'}`}
        style={{ 
          width: isPanelOpen ? panelWidth : 0,
          transition: isResizingPanel ? 'none' : 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          willChange: isResizingPanel ? 'width' : 'auto'
        }}
      >
          <div className="w-full h-full overflow-hidden flex flex-col" style={{ width: panelWidth }}>
            <InspectorPanel 
                analysis={analysisRaw}
                executiveSummary={executiveSummary}
                inventory={inventory}
                detectedBoxes={detectedBoxes}
                validationIssues={validationIssues}
                selectedBoxId={selectedBoxId}
                onSelectBox={setSelectedBoxId}
                finalAnalysisReport={finalAnalysisReport}
            />
          </div>

          {/* Resize Handle for Right Panel (drag from left edge of the inspector) */}
          {isPanelOpen && (
            <div
              className="absolute top-0 left-0 bottom-0 w-1 cursor-col-resize hover:bg-cyan-500/50 transition-colors z-20 group"
              onMouseDown={(e) => { e.preventDefault(); setIsResizingPanel(true); }}
            >
              <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-1/2 w-0.5 h-8 bg-white/10 group-hover:bg-cyan-400 rounded-full transition-colors"></div>
            </div>
          )}
          
          {/* Floating Toggle Button used when panel is visible is now rendered outside the panel
              so it remains clickable even when the panel width becomes 0. */}
      </div>
      {/* Persistent Toggle Button for Right Inspector (always visible) */}
      <button
        onClick={() => setIsPanelOpen(!isPanelOpen)}
        aria-label={isPanelOpen ? 'Collapse inspector panel' : 'Expand inspector panel'}
        title={isPanelOpen ? 'Collapse Inspector' : 'Expand Inspector'}
        className={`absolute top-1/2 -translate-y-1/2 z-40 p-2 rounded-full bg-black/30 backdrop-blur-md border border-white/10 text-zinc-400 hover:text-white hover:bg-black/50 shadow-lg transition-all duration-300`}
        style={{
          right: isPanelOpen ? `calc(${panelWidth}px - 12px)` : '0.5rem',
          transform: 'translateY(-50%)'
        } as React.CSSProperties}
      >
        {isPanelOpen ? <ChevronRight size={12} /> : <ChevronLeft size={14} />}
      </button>
    </div>
  );
};

export default BlueprintWorkspace;
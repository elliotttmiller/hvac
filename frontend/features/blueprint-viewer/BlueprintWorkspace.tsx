import React, { useState, useEffect } from 'react';
import InteractiveViewer from '@/features/blueprint-viewer/InteractiveViewer';
import InspectorPanel from './InspectorPanel';
import { analyzeDocument, generateBackgroundAnalysis } from '@/features/document-analysis/orchestrator';
import startConsoleCapture from '@/lib/consoleCapture';
import { config } from '@/app/config';
import { DetectedComponent, ValidationIssue} from '@/features/document-analysis/types';
import { ProcessingOverlay, ProcessingPhase } from '@/components/feedback/ProcessingOverlay';
import { useToastHelpers } from '@/lib/hooks/useToast';

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
  
  // Background analysis state
  const [backgroundJobId, setBackgroundJobId] = useState<string | null>(null);
  const [isBackgroundRunning, setIsBackgroundRunning] = useState(false);
  const [pollingIntervalId, setPollingIntervalId] = useState<number | null>(null);
  
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
        console.log('[Polling] Checking status for job:', backgroundJobId);
        const response = await fetch(`/api/analysis/status/${backgroundJobId}`);
        
        if (!response.ok) {
          console.warn('[Polling] Failed to fetch job status:', response.status);
          return;
        }

        const jobData = await response.json();
        console.log('[Polling] Job status:', jobData.status);

        if (jobData.status === 'completed') {
          console.log('[Polling] Job completed! Setting final analysis report');
          
          // Stop polling
          clearInterval(pollInterval);
          setPollingIntervalId(null);
          setIsBackgroundRunning(false);
          
          // Update state with the final report
          if (jobData.result) {
            setFinalAnalysisReport(jobData.result);
            
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
        } else if (jobData.status === 'failed') {
          console.error('[Polling] Job failed:', jobData.error);
          
          // Stop polling
          clearInterval(pollInterval);
          setPollingIntervalId(null);
          setIsBackgroundRunning(false);
          
          // Show error toast
          toast.error(
            'Background analysis failed',
            jobData.error || 'Unable to generate comprehensive report',
            { duration: 6000 }
          );
        }
        // If status is 'running' or 'pending', continue polling
      } catch (error) {
        console.error('[Polling] Error checking job status:', error);
      }
    }, 2000); // Poll every 2 seconds

    setPollingIntervalId(pollInterval as unknown as number);

    // Cleanup: stop polling when component unmounts or job changes
    return () => {
      console.log('[Polling] Cleanup: stopping poll');
      clearInterval(pollInterval);
    };
  }, [backgroundJobId, isBackgroundRunning, toast]);

  // Main analysis function - STAGE 1: Fast visual analysis
  const runAnalysisInternal = async (file: File, url: string) => {
    setIsProcessing(true);
    setProcessingPhase('classifying');
    setFinalAnalysisReport(null); // Clear previous final analysis

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
          if (report && !finalAnalysisReport) {
            setFinalAnalysisReport(report);
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
      <ProcessingOverlay isOpen={isProcessing} phase={processingPhase} />
      
      <InteractiveViewer 
        imageUrl={imageUrl}
        components={detectedBoxes} // <--- CORRECTED PROP NAME
        isProcessing={isProcessing}
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
        className={`relative flex flex-col bg-[#1e1e1e] border-l border-white/5 transition-all duration-300 shrink-0 ${!isPanelOpen && 'w-0 border-l-0'}`}
        style={{ width: isPanelOpen ? 320 : 0 }}
      >
          <div className="w-full h-full overflow-hidden flex flex-col">
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
      </div>
    </div>
  );
};

export default BlueprintWorkspace;
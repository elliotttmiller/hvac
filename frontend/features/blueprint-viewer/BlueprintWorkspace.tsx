import React, { useState, useEffect } from 'react';
import InteractiveViewer from './InteractiveViewer';
import InspectorPanel from './InspectorPanel';
import { analyzeDocument } from '@/features/document-analysis/orchestrator';
import { config } from '@/app/config';
import { DetectedComponent, ValidationIssue} from '@/features/document-analysis/types';
import { ProcessingOverlay, ProcessingPhase } from '@/components/feedback/ProcessingOverlay';

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
  
  // Interactivity State
  const [selectedBoxId, setSelectedBoxId] = useState<string | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(true);

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

        // Only run analysis automatically when the feature flag is enabled
        if (config.features.autoAnalyze) {
          await runAnalysisInternal(file, url);
        }

        onAnalyzed?.();
      } catch (error) {
        console.error('Failed to load file for analysis:', error);
        onAnalyzed?.();
      }
    };

    loadAndMaybeAnalyze();
  }, [fileToAnalyze, onAnalyzed]);

  // Main analysis function
  const runAnalysisInternal = async (file: File, url: string) => {
    setIsProcessing(true);
    setProcessingPhase('classifying');
    setAnalysisRaw("Step 1: Classifying document...");

    try {
      const base64Data = url.split(',')[1] || await blobToBase64(file);
      setProcessingPhase('analyzing');
      const result = await analyzeDocument(base64Data, { fileName: file.name });
      console.log('Analysis result:', result);
      
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
      setAnalysisRaw(JSON.stringify(result, null, 2));
      
      setTimeout(() => setIsProcessing(false), 500);
    } catch (error) {
        console.error(error);
        setAnalysisRaw(`Error: ${error instanceof Error ? error.message : "Pipeline Failed"}`);
        setIsProcessing(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImageUrl(url);
      // Only auto-run analysis on upload when feature is enabled
      if (config.features.autoAnalyze) runAnalysisInternal(file, url);
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
        detectedBoxes={detectedBoxes}
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
            />
          </div>
      </div>
    </div>
  );
};

export default BlueprintWorkspace;
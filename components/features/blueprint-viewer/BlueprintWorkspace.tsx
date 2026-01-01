import React, { useState, useEffect } from 'react';
import InteractiveViewer from './InteractiveViewer';
import InspectorPanel from './InspectorPanel';
import { analyzeBlueprintImage, generateInventoryFromAnalysis } from '../../../services/geminiService';
import { analyzeDocument } from '../../../features/document-analysis/orchestrator';
import { DetectedObject, ValidationIssue } from '../../../types';
import { ChevronRight, PanelRightOpen, PanelRightClose } from 'lucide-react';

const BlueprintWorkspace: React.FC = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageDims, setImageDims] = useState<{width: number, height: number} | null>(null);
  
  const [isProcessing, setIsProcessing] = useState(false);
  // We now default to the Gemini workflow (single default AI pipeline).
  const [backendType, setBackendType] = useState<'RAY' | 'GEMINI'>('GEMINI');
  
  // Analysis Data
  const [analysisRaw, setAnalysisRaw] = useState<string>("");
  const [executiveSummary, setExecutiveSummary] = useState<string>("");
  const [inventory, setInventory] = useState<any[]>([]);
  const [detectedBoxes, setDetectedBoxes] = useState<DetectedObject[]>([]);
  const [validationIssues, setValidationIssues] = useState<ValidationIssue[]>([]);
  
  // Interactivity State
  const [selectedBoxId, setSelectedBoxId] = useState<string | null>(null);

  // Right Panel Resize State
  const [panelWidth, setPanelWidth] = useState(320);
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [isResizing, setIsResizing] = useState(false);

  // Resize Handlers
  const startResizing = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      const newWidth = window.innerWidth - e.clientX;
      if (newWidth > 250 && newWidth < 600) {
        setPanelWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
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
  }, [isResizing]);


  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const url = URL.createObjectURL(file);
      setImageUrl(url);
      
      // Reset State
      setAnalysisRaw("");
      setExecutiveSummary("");
      setInventory([]);
      setDetectedBoxes([]);
      setValidationIssues([]);
      setSelectedBoxId(null);
      
      const img = new Image();
      img.onload = () => {
        setImageDims({ width: img.width, height: img.height });
      };
      img.src = url;
    }
  };

  const handleClearImage = () => {
    setImageFile(null);
    setImageUrl(null);
    setImageDims(null);
    setAnalysisRaw("");
    setInventory([]);
    setDetectedBoxes([]);
    setSelectedBoxId(null);
  };

  const convertRayEntitiesToBoxes = (entities: any[], imgWidth: number, imgHeight: number): DetectedObject[] => {
    return entities.map((entity, idx) => {
        const [x1, y1, x2, y2] = entity.bbox;
        const w = x2 - x1;
        const h = y2 - y1;
        const isText = entity.label === 'tag_number' || entity.label === 'id_letters';

        return {
            id: `ray-${idx}-${Date.now()}`,
            label: entity.tag || entity.label,
            confidence: entity.confidence || 0.9,
            x: (x1 / imgWidth) * 100,
            y: (y1 / imgHeight) * 100,
            width: (w / imgWidth) * 100,
            height: (h / imgHeight) * 100,
            rotation: 0, 
            type: isText ? 'text' : 'component',
            meta: {
                tag: entity.tag,
                description: entity.description,
                reasoning: entity.attributes?.find((a: any) => a.type === 'reasoning')?.text
            }
        };
    });
  };

  const runAnalysis = async () => {
    if (!imageFile || !imageUrl) return;
    setIsProcessing(true);
    setAnalysisRaw("Initializing analysis pipeline...");

    try {
      // New Architecture 2.0 Pipeline
      setAnalysisRaw("Step 1: Classifying document...");
      const base64Data = imageUrl.split(',')[1] || await blobToBase64(imageFile);

      // Use new orchestrator
      const result = await analyzeDocument(base64Data, {
        fileName: imageFile.name,
      });

      console.log('Analysis result:', result);
      
      // Update executive summary
      setExecutiveSummary(result.executive_summary || `Document classified as: ${result.document_type}`);
      
      // Update validation issues
      setValidationIssues(result.validation_issues || []);

      // Process visual analysis results
      if (result.visual && result.visual.components) {
        const boxes = result.visual.components.map((comp) => {
          // Convert normalized bbox (0-1) to percentage
          const [x1, y1, x2, y2] = comp.bbox;
          return {
            id: comp.id,
            label: comp.label || comp.type,
            confidence: comp.confidence,
            x: x1 * 100,
            y: y1 * 100,
            width: (x2 - x1) * 100,
            height: (y2 - y1) * 100,
            rotation: comp.rotation,
            type: comp.type as 'component' | 'text' | 'symbol',
            meta: comp.meta,
          };
        });
        setDetectedBoxes(boxes);

        // Generate inventory
        const counts: Record<string, number> = {};
        result.visual.components.forEach((comp) => {
          const key = comp.meta?.description || comp.type;
          counts[key] = (counts[key] || 0) + 1;
        });
        setInventory(Object.entries(counts).map(([name, count]) => ({ name, count })));
      }

      setAnalysisRaw(JSON.stringify(result, null, 2));
    } catch (error) {
        console.error(error);
        setAnalysisRaw(`Error: ${error instanceof Error ? error.message : "Pipeline Failed"}`);
    } finally {
        setIsProcessing(false);
    }
  };

  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, _) => {
      const reader = new FileReader();
      reader.onloadend = () => {
          const res = reader.result as string;
          resolve(res.split(',')[1]);
      };
      reader.readAsDataURL(blob);
    });
  }

  return (
    <div className="flex-1 flex h-full bg-[#121212] overflow-hidden relative">
      
      {/* Center Canvas */}
      <InteractiveViewer 
        imageUrl={imageUrl}
        detectedBoxes={detectedBoxes}
        isProcessing={isProcessing}
        backendType={backendType}
        selectedBoxId={selectedBoxId}
        onSelectBox={setSelectedBoxId}
        onFileUpload={handleFileUpload}
        onClearImage={handleClearImage}
        onRunAnalysis={runAnalysis}
      />

      {/* Floating Toggle for Right Panel */}
      <button 
        onClick={() => setIsPanelOpen(!isPanelOpen)}
        className={`absolute top-4 z-30 p-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-zinc-400 hover:text-white hover:bg-black/60 shadow-lg transition-all duration-300 ${isPanelOpen ? '-right-3 opacity-0 hover:opacity-100 hover:right-1' : 'right-3'}`}
        title={isPanelOpen ? "Close Inspector" : "Open Inspector"}
      >
          {isPanelOpen ? <ChevronRight size={14} /> : <PanelRightOpen size={16} />}
      </button>

      {/* Resizable Right Panel Container */}
      <div 
        className={`relative flex flex-col bg-[#1e1e1e] border-l border-white/5 transition-all duration-300 ease-in-out shrink-0 ${!isPanelOpen && 'w-0 border-l-0 overflow-hidden'}`}
        style={{ width: isPanelOpen ? panelWidth : 0 }}
      >
          {/* Resize Handle */}
          {isPanelOpen && (
            <div 
                className="absolute top-0 left-0 bottom-0 w-1 cursor-col-resize hover:bg-fuchsia-500/50 transition-colors z-20 group"
                onMouseDown={startResizing}
            >
                <div className="absolute top-1/2 left-0 transform -translate-y-1/2 w-0.5 h-8 bg-white/10 group-hover:bg-fuchsia-400 rounded-full transition-colors"></div>
            </div>
          )}

          <div className="w-full h-full overflow-hidden flex flex-col" style={{ width: panelWidth }}>
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
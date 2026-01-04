import React, { useState } from 'react';
import InteractiveViewer from './InteractiveViewer';
import InspectorPanel from './InspectorPanel';
import { analyzeBlueprintImage, generateInventoryFromAnalysis } from '../../../services/geminiService';
import { analyzeWithRayBackend } from '../../../services/rayService';
import { DetectedObject } from '../../../types';
import { GOLDEN_RECORD } from '../../../mock/golden-record';
import { Bug, Database } from 'lucide-react';

const BlueprintWorkspace: React.FC = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageDims, setImageDims] = useState<{width: number, height: number} | null>(null);
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [backendType, setBackendType] = useState<'RAY' | 'GEMINI'>('RAY');
  
  const [analysis, setAnalysis] = useState<string>("");
  const [inventory, setInventory] = useState<any[]>([]);
  const [detectedBoxes, setDetectedBoxes] = useState<DetectedObject[]>([]);
  const [activeBox, setActiveBox] = useState<DetectedObject | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const url = URL.createObjectURL(file);
      setImageUrl(url);
      setAnalysis("");
      setInventory([]);
      setDetectedBoxes([]);
      setActiveBox(null);
      
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
    setAnalysis("");
    setInventory([]);
    setDetectedBoxes([]);
    setActiveBox(null);
  };

  const loadMockData = async () => {
    setIsProcessing(true);
    setAnalysis("Loading Golden Record for debugging...");
    
    // Simulate short network delay for realism
    await new Promise(r => setTimeout(r, 300));

    try {
        // Map Golden Record (Standard [xmin, ymin, xmax, ymax] format) to DetectedObject (0-100 Percentage)
        const boxes = GOLDEN_RECORD.components.map((c, idx) => {
            const [xmin, ymin, xmax, ymax] = c.bbox;
            
            return {
                id: c.id || `mock-${idx}`,
                label: c.label,
                confidence: c.confidence,
                x: xmin * 100,
                y: ymin * 100,
                width: (xmax - xmin) * 100,
                height: (ymax - ymin) * 100,
                rotation: c.rotation || 0,
                type: c.type.includes('text') || c.type === 'tag' ? 'text' : 'component',
                meta: {
                    tag: c.meta.tag,
                    description: c.meta.description
                },
                debugLog: {
                    source: 'MOCK',
                    rawInput: `[${xmin}, ${ymin}, ${xmax}, ${ymax}] (Norm 0-1)`,
                    transformation: `x: ${xmin} * 100 = ${xmin*100}%`
                }
            } as DetectedObject;
        });

        setDetectedBoxes(boxes);

        // Generate Inventory
        const counts: Record<string, number> = {};
        boxes.forEach(b => {
            const key = b.meta?.description || b.label;
            counts[key] = (counts[key] || 0) + 1;
        });
        setInventory(Object.entries(counts).map(([name, count]) => ({ name, count })));
        
        setAnalysis("Golden Record Loaded successfully.\n\nValidation Status: PASSED (Ground Truth).\nData Source: /mock/golden-record.json\n\nCorrected Geometry Pipeline: [xmin, ymin, xmax, ymax] mapping applied.");

        // Load mock image if not already loaded
        if (!imageUrl) {
            try {
                // Try fetching the mock image
                const res = await fetch('/mock/pid-diagram.png');
                if (res.ok) {
                    const blob = await res.blob();
                    const url = URL.createObjectURL(blob);
                    setImageUrl(url);
                    const img = new Image();
                    img.onload = () => setImageDims({ width: img.width, height: img.height });
                    img.src = url;
                } else {
                     setAnalysis(prev => prev + "\n\n[WARN] Mock image '/mock/pid-diagram.png' could not be loaded. Please upload a blueprint manually to visualize the alignment.");
                }
            } catch (e) {
                console.warn("Could not fetch mock image", e);
            }
        }

    } catch (e) {
        console.error(e);
        setAnalysis("Failed to load Golden Record.");
    } finally {
        setIsProcessing(false);
    }
  };

  const convertRayEntitiesToBoxes = (entities: any[], imgWidth: number, imgHeight: number): DetectedObject[] => {
    return entities.map((entity, idx) => {
        // inference_graph.py returns [x1, y1, x2, y2]
        const [x1, y1, x2, y2] = entity.bbox;
        const w = x2 - x1;
        const h = y2 - y1;
        const isText = entity.label === 'tag_number' || entity.label === 'id_letters';

        return {
            id: `ray-${idx}`,
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
                description: entity.description
            },
            debugLog: {
                source: 'RAY',
                rawInput: `[${x1}, ${y1}, ${x2}, ${y2}] (Pixels)`,
                transformation: `x: (${x1}/${imgWidth})*100`
            }
        };
    });
  };

  const convertGeminiEntitiesToBoxes = (entities: any[]): DetectedObject[] => {
      // Gemini returns 0-1000 normalized coordinates: [ymin, xmin, ymax, xmax]
      return entities.map((entity, idx) => {
          const [ymin, xmin, ymax, xmax] = entity.bbox_2d;
          // Convert 0-1000 to Percentage (0-100)
          return {
              id: `gemini-${idx}`,
              label: entity.tag || entity.label,
              confidence: entity.confidence || 0.85,
              x: (xmin / 1000) * 100,
              y: (ymin / 1000) * 100,
              width: ((xmax - xmin) / 1000) * 100,
              height: ((ymax - ymin) / 1000) * 100,
              rotation: 0,
              type: 'component',
              meta: {
                  tag: entity.tag,
                  description: entity.description
              },
              debugLog: {
                source: 'GEMINI',
                rawInput: `[${ymin}, ${xmin}, ${ymax}, ${xmax}] (0-1000)`,
                transformation: `x: (${xmin}/1000)*100 (Note: Swapped ymin/xmin)`
            }
          }
      });
  }

  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
          const res = reader.result as string;
          resolve(res.split(',')[1]);
      };
      reader.readAsDataURL(blob);
    });
  }

  const runAnalysis = async () => {
    if (!imageFile || !imageUrl) return;
    setIsProcessing(true);
    setAnalysis("Initializing analysis pipeline...");

    try {
        if (backendType === 'RAY') {
            if (!imageDims) throw new Error("Image dimensions not loaded");
            
            setAnalysis("Sending to Ray Serve (YOLOv11 + ISA-5.1 Engine)...");
            const result = await analyzeWithRayBackend(imageFile);
            
            const boxes = convertRayEntitiesToBoxes(result.entities, imageDims.width, imageDims.height);
            setDetectedBoxes(boxes);
            
            const counts: Record<string, number> = {};
            result.entities.forEach(e => {
                const key = e.description || e.label;
                counts[key] = (counts[key] || 0) + 1;
            });
            
            setInventory(Object.entries(counts).map(([name, count]) => ({ name, count })));
            setAnalysis(`Processed ${result.metadata.raw_count} raw symbols into ${result.metadata.entity_count} semantic entities using ISA-5.1 composition logic.`);
            
        } else {
            setAnalysis("Sending to Gemini 3.0 Pro Vision (Prompt Engineered)...");
            const base64Data = imageUrl.split(',')[1] || await blobToBase64(imageFile);
            const jsonResultString = await analyzeBlueprintImage(base64Data);
            
            try {
                const data = JSON.parse(jsonResultString);
                
                if (data.entities) {
                    const boxes = convertGeminiEntitiesToBoxes(data.entities);
                    setDetectedBoxes(boxes);
                    setAnalysis(data.summary || "Gemini Analysis Complete.");
                    
                    // Generate inventory locally from the structured data
                    const counts: Record<string, number> = {};
                    data.entities.forEach((e: any) => {
                        const key = e.description || e.label;
                        counts[key] = (counts[key] || 0) + 1;
                    });
                    setInventory(Object.entries(counts).map(([name, count]) => ({ name, count })));
                } else {
                    setAnalysis(jsonResultString); // Fallback if raw text
                }
            } catch (e) {
                console.error("Failed to parse Gemini JSON", e);
                setAnalysis("Failed to parse structured response from Gemini.");
            }
        }
    } catch (error) {
        console.error(error);
        setAnalysis(`Error: ${error instanceof Error ? error.message : "Pipeline Failed"}`);
    } finally {
        setIsProcessing(false);
    }
  };

  return (
    <div className="flex-1 flex h-full overflow-hidden relative">
        {/* Debug Controls Overlay */}
        <div className="absolute top-4 right-4 z-50 flex flex-col gap-2">
             <button 
                onClick={loadMockData}
                className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 border border-amber-500/50 p-2.5 rounded-full shadow-lg backdrop-blur-md transition-all group"
                title="Load Golden Record (Debug)"
             >
                 <Bug size={18} className="group-hover:rotate-12 transition-transform"/>
             </button>
        </div>

      <InteractiveViewer 
        imageUrl={imageUrl}
        detectedBoxes={detectedBoxes}
        isProcessing={isProcessing}
        backendType={backendType}
        onFileUpload={handleFileUpload}
        onClearImage={handleClearImage}
        onRunAnalysis={runAnalysis}
        onSetBackendType={setBackendType}
        onBoxHover={setActiveBox}
      />
      <InspectorPanel 
        analysis={analysis} 
        inventory={inventory}
        backendType={backendType}
        activeBox={activeBox}
      />
    </div>
  );
};

export default BlueprintWorkspace;
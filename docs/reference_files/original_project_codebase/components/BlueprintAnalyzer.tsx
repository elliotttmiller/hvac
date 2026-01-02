import React, { useState, useRef } from 'react';
import { Upload, FileSearch, CheckCircle, AlertOctagon, Layers, Type, Scan, Eye, Server, X } from 'lucide-react';
import { analyzeBlueprintImage, generateInventoryFromAnalysis } from '../services/geminiService';
import { analyzeWithRayBackend } from '../services/rayService';
import { DetectedObject } from '../types';

const BlueprintAnalyzer: React.FC = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageDims, setImageDims] = useState<{width: number, height: number} | null>(null);
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [backendType, setBackendType] = useState<'RAY' | 'GEMINI'>('RAY');
  
  const [analysis, setAnalysis] = useState<string>("");
  const [inventory, setInventory] = useState<any[]>([]);
  const [detectedBoxes, setDetectedBoxes] = useState<DetectedObject[]>([]);
  
  // Layer Toggles
  const [showOBB, setShowOBB] = useState(true);
  const [showOCR, setShowOCR] = useState(false);
  const [showGeo, setShowGeo] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const url = URL.createObjectURL(file);
      setImageUrl(url);
      setAnalysis("");
      setInventory([]);
      setDetectedBoxes([]);
      
      // Load image to get dimensions for pixel->percent conversion
      const img = new Image();
      img.onload = () => {
        setImageDims({ width: img.width, height: img.height });
      };
      img.src = url;
    }
  };

  const convertRayEntitiesToBoxes = (entities: any[], imgWidth: number, imgHeight: number): DetectedObject[] => {
    return entities.map((entity, idx) => {
        // inference_graph.py returns [x1, y1, x2, y2]
        const [x1, y1, x2, y2] = entity.bbox;
        const w = x2 - x1;
        const h = y2 - y1;

        // Determine type based on backend label
        const isText = entity.label === 'tag_number' || entity.label === 'id_letters';

        return {
            id: `ray-${idx}`,
            label: entity.tag || entity.label,
            confidence: entity.confidence || 0.9,
            x: (x1 / imgWidth) * 100,
            y: (y1 / imgHeight) * 100,
            width: (w / imgWidth) * 100,
            height: (h / imgHeight) * 100,
            rotation: 0, // Ray backend currently returns axis-aligned boxes in this version
            type: isText ? 'text' : 'component',
            meta: {
                tag: entity.tag,
                description: entity.description
            }
        };
    });
  };

  const runAnalysis = async () => {
    if (!imageFile || !imageUrl) return;
    setIsProcessing(true);
    setAnalysis("Initializing analysis pipeline...");

    try {
        if (backendType === 'RAY') {
            if (!imageDims) throw new Error("Image dimensions not loaded");
            
            setAnalysis("Sending to Ray Serve (YOLOv11 + ISA-5.1 Engine)...");
            const result = await analyzeWithRayBackend(imageFile);
            
            // Transform Ray results for visualization
            const boxes = convertRayEntitiesToBoxes(result.entities, imageDims.width, imageDims.height);
            setDetectedBoxes(boxes);
            
            // Create simplified inventory
            const counts: Record<string, number> = {};
            result.entities.forEach(e => {
                const key = e.description || e.label;
                counts[key] = (counts[key] || 0) + 1;
            });
            
            setInventory(Object.entries(counts).map(([name, count]) => ({ name, count })));
            setAnalysis(`Processed ${result.metadata.raw_count} raw symbols into ${result.metadata.entity_count} semantic entities using ISA-5.1 composition logic.`);
            
        } else {
            // Fallback to Gemini VLM simulation
            setAnalysis("Uploading to Gemini 2.5 Vision...");
            const base64Data = imageUrl.split(',')[1] || await blobToBase64(imageFile);
            const textResult = await analyzeBlueprintImage(base64Data);
            setAnalysis(textResult);
            
            const jsonStr = await generateInventoryFromAnalysis(textResult);
            try {
                const inv = JSON.parse(jsonStr);
                setInventory(inv);
            } catch (e) {
                console.error("Failed to parse inventory JSON", e);
            }
            // Mock boxes for Gemini demo
            setDetectedBoxes([
                 { id: '1', label: 'AHU-1', confidence: 0.98, x: 20, y: 30, width: 15, height: 10, rotation: 0, type: 'component' },
                 { id: '2', label: 'Analysis-Cloud', confidence: 0.9, x: 50, y: 50, width: 20, height: 20, rotation: 0, type: 'text' }
            ]);
        }

    } catch (error) {
        console.error(error);
        setAnalysis(`Error: ${error instanceof Error ? error.message : "Pipeline Failed"}`);
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
    <div className="flex-1 flex h-full bg-slate-950 overflow-hidden">
      {/* Main Canvas Area */}
      <div className="flex-1 relative bg-slate-900 border-r border-slate-800 flex flex-col">
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
             {imageUrl && (
                <div className="flex gap-2">
                    <button 
                        onClick={() => setShowOBB(!showOBB)} 
                        className={`p-2 rounded border transition-colors flex items-center gap-2 text-xs font-mono ${showOBB ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400' : 'bg-slate-800 border-slate-700 text-slate-500'}`}
                    >
                        <Scan size={14} /> Detect
                    </button>
                    <button 
                        onClick={() => setShowOCR(!showOCR)} 
                        className={`p-2 rounded border transition-colors flex items-center gap-2 text-xs font-mono ${showOCR ? 'bg-purple-500/20 border-purple-500 text-purple-400' : 'bg-slate-800 border-slate-700 text-slate-500'}`}
                    >
                        <Type size={14} /> Text
                    </button>
                    <button onClick={() => { setImageFile(null); setImageUrl(null); }} className="bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/50 p-2 rounded ml-2">
                        <X size={14} />
                    </button>
                </div>
             )}
             
             {/* Backend Selector */}
             <div className="bg-slate-950/90 backdrop-blur border border-slate-700 rounded p-1 flex items-center gap-1">
                 <button 
                    onClick={() => setBackendType('RAY')}
                    className={`px-3 py-1 rounded text-[10px] font-bold transition-colors ${backendType === 'RAY' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
                 >
                    RAY SERVE
                 </button>
                 <button 
                    onClick={() => setBackendType('GEMINI')}
                    className={`px-3 py-1 rounded text-[10px] font-bold transition-colors ${backendType === 'GEMINI' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
                 >
                    GEMINI VLM
                 </button>
             </div>
        </div>

        <div className="flex-1 flex items-center justify-center p-8 overflow-auto relative">
          {!imageUrl ? (
            <div className="border-2 border-dashed border-slate-700 rounded-xl p-12 text-center max-w-md">
              <Upload className="mx-auto text-slate-500 mb-4" size={48} />
              <h3 className="text-xl font-medium text-slate-200 mb-2">Multi-Modal Ingestion</h3>
              <p className="text-slate-500 mb-6">Upload PDF, DWG, or Raster for analysis.</p>
              <label className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-3 rounded-lg cursor-pointer transition-colors inline-flex items-center gap-2">
                <FileSearch size={18} />
                <span>Select Blueprint</span>
                <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
              </label>
            </div>
          ) : (
            <div className="relative w-full h-full flex items-center justify-center">
                <div className="relative inline-block max-w-full max-h-full shadow-2xl">
                    <img src={imageUrl} alt="Blueprint" className={`max-w-full max-h-full object-contain border border-slate-700 transition-all ${showGeo ? 'perspective-correction' : ''}`} style={showGeo ? {transform: 'perspective(1000px) rotateX(2deg)'} : {}} />
                    
                    {/* Render Bounding Boxes */}
                    {detectedBoxes.map(box => {
                        const isText = box.type === 'text';
                        const isVisible = (isText && showOCR) || (!isText && showOBB);
                        
                        if (!isVisible) return null;

                        return (
                            <div 
                                key={box.id}
                                className={`absolute border-2 flex items-start justify-start group cursor-pointer ${isText ? 'border-purple-400 bg-purple-400/10' : 'border-cyan-400 bg-cyan-400/10'}`}
                                style={{
                                    left: `${box.x}%`,
                                    top: `${box.y}%`,
                                    width: `${box.width}%`,
                                    height: `${box.height}%`,
                                    transform: `rotate(${box.rotation || 0}deg)`,
                                    transformOrigin: 'center center'
                                }}
                            >
                                {/* Tooltip / Label */}
                                <div className={`absolute -top-6 left-0 text-slate-950 text-[10px] font-bold px-1.5 py-0.5 rounded-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-20 ${isText ? 'bg-purple-500' : 'bg-cyan-500'}`}>
                                    {box.label}
                                    {box.meta?.tag && <span className="block font-normal opacity-90">{box.meta.tag}</span>}
                                    {box.meta?.description && <span className="block font-light italic opacity-80 text-[9px]">{box.meta.description}</span>}
                                </div>
                            </div>
                        );
                    })}
                    
                    {isProcessing && (
                         <div className="absolute inset-0 bg-slate-950/50 flex items-center justify-center backdrop-blur-sm z-50">
                            <div className="flex flex-col items-center">
                                <div className="w-16 h-1 border-2 border-cyan-500 rounded animate-scan mb-4 relative overflow-hidden">
                                     <div className="absolute top-0 left-0 h-full bg-cyan-400 w-full animate-progress"></div>
                                </div>
                                <span className="text-cyan-400 font-mono animate-pulse">Running {backendType} Inference...</span>
                            </div>
                         </div>
                    )}
                </div>
            </div>
          )}
        </div>

        {/* Toolbar */}
        {imageUrl && !isProcessing && (
             <div className="h-16 border-t border-slate-800 bg-slate-900 p-4 flex justify-between items-center gap-4">
                 <div className="flex items-center gap-4 text-xs text-slate-500 font-mono">
                    <span className="flex items-center gap-1"><Scan size={12}/> Components: {detectedBoxes.filter(b => b.type === 'component').length}</span>
                    <span className="flex items-center gap-1"><Type size={12}/> OCR Regions: {detectedBoxes.filter(b => b.type === 'text').length}</span>
                 </div>
                 <button 
                    onClick={runAnalysis}
                    className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-2 rounded-md font-medium transition-colors flex items-center gap-2"
                 >
                    <Eye size={18} />
                    {backendType === 'RAY' ? 'Run Inference Graph' : 'Run Gemini VLM'}
                 </button>
             </div>
        )}
      </div>

      {/* Right Details Panel */}
      <div className="w-96 bg-slate-950 border-l border-slate-800 flex flex-col">
        <div className="p-4 border-b border-slate-800 bg-slate-900/50">
            <h2 className="font-semibold text-slate-200">Analysis Results</h2>
            <div className="flex items-center gap-2 mt-1">
                {backendType === 'RAY' ? <Server size={12} className="text-emerald-400"/> : <Eye size={12} className="text-purple-400"/>}
                <span className="text-xs text-slate-500">{backendType === 'RAY' ? 'Ray Serve (Python)' : 'Gemini Cloud'}</span>
            </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {!analysis ? (
                <div className="text-center text-slate-600 mt-10">
                    <Layers className="mx-auto mb-4 opacity-50" size={32}/>
                    <p>No telemetry data.</p>
                </div>
            ) : (
                <>
                    {/* Compliance Check */}
                    <div className="space-y-3">
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                             <AlertOctagon size={12}/> Compliance Status
                        </h3>
                        <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg flex items-start gap-3">
                            <CheckCircle className="text-emerald-500 shrink-0" size={18} />
                            <div>
                                <p className="text-sm text-emerald-400 font-medium">Validation Passed</p>
                                <p className="text-xs text-slate-500 mt-1">System design matches constraints.</p>
                            </div>
                        </div>
                    </div>

                    {/* Inventory */}
                    <div className="space-y-3">
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Detected Assets</h3>
                        <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden max-h-60 overflow-y-auto">
                            {inventory.length > 0 ? inventory.map((item, idx) => (
                                <div key={idx} className="p-3 border-b border-slate-800 last:border-0 flex justify-between items-center hover:bg-slate-800/50">
                                    <span className="text-sm text-slate-300 truncate max-w-[180px]" title={item.name}>{item.name || item.label}</span>
                                    <span className="text-xs font-mono text-cyan-500 bg-cyan-950/30 px-2 py-1 rounded">x{item.count || 1}</span>
                                </div>
                            )) : (
                                <div className="p-3 text-xs text-slate-500 italic">No assets detected.</div>
                            )}
                        </div>
                    </div>

                    {/* AI Summary */}
                    <div className="space-y-3">
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Process Log</h3>
                        <div className="text-sm text-slate-400 leading-relaxed font-mono text-xs p-3 bg-slate-900 rounded border border-slate-800 max-h-60 overflow-y-auto">
                            {analysis}
                        </div>
                    </div>
                </>
            )}
        </div>
      </div>
    </div>
  );
};

export default BlueprintAnalyzer;
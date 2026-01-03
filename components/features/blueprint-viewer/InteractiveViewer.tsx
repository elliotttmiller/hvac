import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Scan, Type, Layers, X, ZoomIn, ZoomOut, Maximize2, Play } from 'lucide-react';
import { DetectedComponent } from '../../../features/document-analysis/types';

interface InteractiveViewerProps {
  imageUrl: string | null;
  detectedBoxes: DetectedComponent[];
  isProcessing: boolean;
  backendType?: 'RAY' | 'GEMINI';
  selectedBoxId?: string | null;
  onSelectBox?: (id: string | null) => void;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClearImage: () => void;
  onRunAnalysis: () => void;
}

const InteractiveViewer: React.FC<InteractiveViewerProps> = ({
  imageUrl,
  detectedBoxes,
  isProcessing,
  onFileUpload,
  onClearImage,
  onRunAnalysis
}) => {
  // --- UI State ---
  const [showOBB, setShowOBB] = useState(true);
  const [showOCR, setShowOCR] = useState(false);
  const [showGeo, setShowGeo] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [activeBoxId, setActiveBoxId] = useState<string | null>(null);
  const [imageUrlState, setImageUrl] = useState<string | null>(null);

  // --- Geometry Engine (The Legacy "Secret Sauce") ---
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [metrics, setMetrics] = useState({ w: 0, h: 0, top: 0, left: 0 });

  const updateMetrics = useCallback(() => {
    const container = containerRef.current;
    const img = imageRef.current;
    if (!container || !img) return;

    const cRatio = container.clientWidth / container.clientHeight;
    const iRatio = img.naturalWidth / img.naturalHeight;
    
    let w, h, top, left;
    if (cRatio > iRatio) {
      h = container.clientHeight; w = h * iRatio;
      top = 0; left = (container.clientWidth - w) / 2;
    } else {
      w = container.clientWidth; h = w / iRatio;
      left = 0; top = (container.clientHeight - h) / 2;
    }
    setMetrics({ w, h, top, left });
  }, []);

  useEffect(() => {
    window.addEventListener('resize', updateMetrics);
    const observer = new ResizeObserver(updateMetrics);
    if (containerRef.current) observer.observe(containerRef.current);
    return () => { window.removeEventListener('resize', updateMetrics); observer.disconnect(); };
  }, [updateMetrics]);

  useEffect(() => {
    // Listen for external file uploads and hand them to parent via onFileUpload
    const handleFileUpload = (event: CustomEvent<File>) => {
      const file = event.detail;
      if (file && onFileUpload) {
        // Build a synthetic input change event so parent handler (which expects ChangeEvent<HTMLInputElement>) can reuse logic
        const syntheticEvent = { target: { files: [file] } } as unknown as React.ChangeEvent<HTMLInputElement>;
        onFileUpload(syntheticEvent);
      }
    };

    window.addEventListener('file-upload', handleFileUpload as EventListener);
    return () => {
      window.removeEventListener('file-upload', handleFileUpload as EventListener);
    };
  }, [onFileUpload]);

  return (
    <div className="flex-1 relative bg-[#0B1120] flex flex-col overflow-hidden">
      
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

      {/* Toolbar (Top Left) */}
      {imageUrl && (
        <div className="absolute top-4 left-4 z-20 flex gap-2">
           <button onClick={() => setShowOBB(!showOBB)} className={`px-3 py-1.5 rounded-md border text-xs font-semibold shadow-lg backdrop-blur-sm transition-all ${showOBB ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400' : 'bg-slate-900/80 border-slate-700 text-slate-500'}`}>
              <Scan size={14} /> Detect
           </button>
           <button onClick={() => setShowOCR(!showOCR)} className={`px-3 py-1.5 rounded-md border text-xs font-semibold shadow-lg backdrop-blur-sm transition-all ${showOCR ? 'bg-purple-500/20 border-purple-500 text-purple-400' : 'bg-slate-900/80 border-slate-700 text-slate-500'}`}>
              <Type size={14} /> Text
           </button>
           <button onClick={() => setShowGeo(!showGeo)} className={`px-3 py-1.5 rounded-md border text-xs font-semibold shadow-lg backdrop-blur-sm transition-all ${showGeo ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-slate-900/80 border-slate-700 text-slate-500'}`}>
              <Layers size={14} /> 3D View
           </button>
       <button onClick={() => onRunAnalysis()} disabled={!imageUrl || isProcessing} className={`px-3 py-1.5 rounded-md border text-xs font-semibold shadow-lg backdrop-blur-sm transition-all ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'bg-slate-900/80 border-slate-700 text-slate-500 hover:bg-cyan-500/10 hover:text-cyan-300'}`} title="Run Analysis">
         <Play size={14} /> Run
       </button>
           <div className="w-px h-6 bg-slate-700/50 mx-1 self-center"></div>
           <button onClick={onClearImage} className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 p-1.5 rounded-md">
              <X size={16} />
           </button>
        </div>
      )}

      {/* Main Canvas Area */}
      <div ref={containerRef} className="flex-1 flex items-center justify-center p-8 overflow-hidden relative">
        {imageUrl && (
          <div 
            className="relative inline-block shadow-2xl transition-transform duration-200 ease-out origin-center"
            style={{ 
              width: metrics.w, 
              height: metrics.h, 
              transform: `scale(${zoom})` // Zoom applies to container
            }}
          >
            {/* The Image */}
            <img 
              ref={imageRef}
              src={imageUrl} 
              alt="Blueprint" 
              className={`w-full h-full object-contain transition-all duration-700 ease-out ${showGeo ? 'perspective-[1000px] rotate-x-2 scale-[0.98]' : ''}`} 
              onLoad={updateMetrics}
            />

            {/* The Overlay Layer (Locked to Image Pixels) */}
            <div className="absolute inset-0 pointer-events-none">
              {detectedBoxes.map((box) => {
                // Defensive checks: ensure bbox exists and is valid
                if (!box || !Array.isArray(box.bbox) || box.bbox.length < 4) return null;
                const isText = box.type === 'text' || box.type === 'label';
                const isVisible = (isText && showOCR) || (!isText && showOBB);
                if (!isVisible) return null;

                // Coordinates are 0-1 Normalized (bbox) or percent values (x/y/width/height).
                let style: Record<string, string> = { left: '0%', top: '0%', width: '0%', height: '0%' };
                if (Array.isArray(box.bbox) && box.bbox.length >= 4) {
                  const [x1, y1, x2, y2] = box.bbox;
                  style = {
                    left: `${y1 * 100}%`,
                    top: `${x1 * 100}%`,
                    width: `${(y2 - y1) * 100}%`,
                    height: `${(x2 - x1) * 100}%`
                  };
                } else if (typeof (box as any).x === 'number' && typeof (box as any).y === 'number') {
                  // Accept existing workspace format where x,y,width,height are in percent (0-100)
                  const bx: any = box as any;
                  style = {
                    left: `${bx.y}%`,
                    top: `${bx.x}%`,
                    width: `${bx.width}%`,
                    height: `${bx.height}%`
                  };
                }

                return (
                  <div 
                    key={box.id}
                    className={`absolute border-2 flex items-start justify-start group cursor-pointer transition-all duration-200 pointer-events-auto
                      ${isText ? 'border-purple-500/60 bg-purple-500/10' : 'border-cyan-500/60 bg-cyan-500/10'}
                      hover:border-opacity-100 hover:bg-opacity-20
                    `}
                    style={style}
                    onMouseEnter={() => setActiveBoxId(box.id)}
                    onMouseLeave={() => setActiveBoxId(null)}
                  >
                    {/* Corner Markers */}
                    <div className="absolute -top-[1px] -left-[1px] w-1.5 h-1.5 border-t-2 border-l-2 border-current opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute -bottom-[1px] -right-[1px] w-1.5 h-1.5 border-b-2 border-r-2 border-current opacity-0 group-hover:opacity-100 transition-opacity" />

                    {/* --- SMART HOVER CARD (The "Glass" Popover) --- */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-64 opacity-0 group-hover:opacity-100 transition-all duration-300 z-50 pointer-events-none origin-top scale-95 group-hover:scale-100">
                      <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-lg shadow-2xl p-0 overflow-hidden ring-1 ring-white/10">
                        <div className={`h-1 w-full bg-gradient-to-r ${isText ? 'from-purple-600 to-fuchsia-500' : 'from-cyan-600 to-blue-500'}`} />
                        <div className="p-3.5 text-left">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="text-xs font-bold text-slate-100 uppercase tracking-wider truncate pr-2">
                              {box.label || box.id}
                            </h4>
                            <span className={`text-xs font-bold ${isText ? 'text-purple-400' : 'text-cyan-400'}`}>
                              {Math.round(box.confidence * 100)}%
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-400 capitalize bg-slate-800 px-1.5 py-0.5 rounded w-fit">
                            {box.type}
                          </div>
                          {(box.meta?.description || box.meta?.reasoning) && (
                            <div className="mt-2 pt-2 border-t border-slate-800/50 text-[10px] text-slate-400 leading-relaxed line-clamp-3">
                              {box.meta.description || box.meta.reasoning}
                            </div>
                          )}
                        </div>
                      </div>
                      {/* Triangle Connector */}
                      <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-slate-900 border-l border-t border-slate-700/50 transform rotate-45" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Zoom Controls */}
      {imageUrl && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30">
          <div className="bg-[#1e1e1e] border border-white/10 rounded-full px-4 py-2 flex items-center gap-4 shadow-xl">
            <button onClick={() => setZoom(z => Math.max(0.5, z - 0.1))} className="text-zinc-400 hover:text-white"><ZoomOut size={14}/></button>
            <span className="text-[10px] font-mono text-zinc-300 w-8 text-center">{Math.round(zoom * 100)}%</span>
            <button onClick={() => setZoom(z => Math.min(3, z + 0.1))} className="text-zinc-400 hover:text-white"><ZoomIn size={14}/></button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InteractiveViewer;
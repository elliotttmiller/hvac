import React, { useState, useRef, useEffect, useCallback } from 'react';
import { convertNormalizedToDisplay, NormBBox } from '../../lib/geometry';
import { Scan, Type, Layers, X, ZoomIn, ZoomOut, Upload, FileSearch, Play } from 'lucide-react';
import { DetectedComponent } from '@/features/document-analysis/types';

interface InteractiveViewerProps {
  imageUrl: string | null;
  components: DetectedComponent[]; // <--- CORRECTED PROP NAME
  isProcessing: boolean;
  selectedBoxId?: string | null;
  onSelectBox?: (id: string | null) => void;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClearImage: () => void;
  onRunAnalysis: () => void;
  debugMode?: boolean; // show debug visuals (QA) when true
}

const InteractiveViewer: React.FC<InteractiveViewerProps> = ({
  imageUrl,
  components = [], // <--- ADDED DEFAULT VALUE
  isProcessing,
  selectedBoxId,
  onSelectBox,
  onFileUpload,
  onClearImage,
  onRunAnalysis,
  debugMode = false,
}) => {
  // --- UI State ---
  const [showOBB, setShowOBB] = useState(true);
  const [showOCR, setShowOCR] = useState(false);
  const [showGeo, setShowGeo] = useState(false);
  const [zoom, setZoom] = useState(1);

  // --- Geometry Engine (Drift Fix Logic) ---
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [metrics, setMetrics] = useState({ w: 0, h: 0, top: 0, left: 0 });

  const updateMetrics = useCallback(() => {
    const container = containerRef.current;
    const img = imageRef.current;
    if (!container || !img || !img.naturalWidth) return;

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
    
    // Initial calculation after mount
    requestAnimationFrame(updateMetrics);
    
    return () => { 
      window.removeEventListener('resize', updateMetrics); 
      observer.disconnect(); 
    };
  }, [updateMetrics]);

  return (
    <div className="flex-1 relative flex flex-col overflow-hidden" style={{ backgroundColor: 'var(--app-bg)' }}>
      
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

      {/* Toolbar (Top Left) */}
      {imageUrl && (
        <div className="absolute top-4 left-4 z-20 flex gap-2 pointer-events-auto">
           <button onClick={onRunAnalysis} disabled={isProcessing} className={`px-3 py-1.5 rounded-md border text-xs font-semibold shadow-lg backdrop-blur-sm transition-all flex items-center gap-2 ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20'}`}>
              <Play size={14} /> Run
           </button>
           <div className="w-px h-6 bg-slate-700/50 self-center"></div>
           <button onClick={() => setShowOBB(!showOBB)} className={`px-3 py-1.5 rounded-md border text-xs font-semibold shadow-lg backdrop-blur-sm transition-all ${showOBB ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400' : 'bg-slate-900/80 border-slate-700 text-slate-500'}`}>
              <Scan size={14} /> Detect
           </button>
           <button onClick={() => setShowOCR(!showOCR)} className={`px-3 py-1.5 rounded-md border text-xs font-semibold shadow-lg backdrop-blur-sm transition-all ${showOCR ? 'bg-purple-500/20 border-purple-500 text-purple-400' : 'bg-slate-900/80 border-slate-700 text-slate-500'}`}>
              <Type size={14} /> Text
           </button>
           <button onClick={onClearImage} className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 p-1.5 rounded-md">
              <X size={16} />
           </button>
        </div>
      )}

      {/* Main Canvas Area */}
      <div ref={containerRef} className="flex-1 flex items-center justify-center p-8 overflow-hidden relative">
        {!imageUrl ? (
            <div className="border border-dashed border-zinc-800 bg-[#1e1e1e] rounded-xl p-12 text-center max-w-sm hover:border-cyan-500/30 transition-all group">
              <Upload className="mx-auto text-zinc-500 mb-4 group-hover:text-cyan-400" size={32} />
              <h3 className="text-sm font-medium text-zinc-200 mb-1">Import Schematic</h3>
              <p className="text-zinc-500 mb-6 text-xs">Supports PDF, DWG, PNG.</p>
              <label className="bg-cyan-600 hover:bg-cyan-500 text-white px-5 py-2 rounded-md cursor-pointer inline-flex items-center gap-2 text-xs font-medium">
                <FileSearch size={14} />
                <span>Browse Files</span>
                <input type="file" className="hidden" accept="image/*,.pdf" onChange={onFileUpload} />
              </label>
            </div>
        ) : (
          <div 
            className="relative shadow-2xl transition-transform duration-200 ease-out origin-center"
            style={{ 
              width: metrics.w, 
              height: metrics.h, 
              transform: `scale(${zoom})`,
            }}
          >
            {/* The Image */}
            <img 
              ref={imageRef}
              src={imageUrl} 
              alt="Blueprint" 
              className={`w-full h-full object-contain`}
              onLoad={updateMetrics}
            />

            {/* The Overlay Layer - measured (pixel-anchored) */}
            {/* Use measured metrics to render boxes in pixels to avoid object-fit / letterbox drift. */}
            <div className="absolute inset-0 pointer-events-none">
              {components.map((box) => {
                if (!box || !Array.isArray(box.bbox) || box.bbox.length < 4) return null;
                // Ensure metrics are available before rendering boxes
                if (!metrics || metrics.w === 0 || metrics.h === 0) return null;

                const isText = box.type === 'text';
                const isVisible = (isText && showOCR) || (!isText && showOBB);
                if (!isVisible) return null;

                // Assume canonical bbox: [xmin, ymin, xmax, ymax] normalized 0-1
                const bbox = box.bbox as NormBBox;

                const origSize = { width: Number(imageRef.current?.naturalWidth || 1), height: Number(imageRef.current?.naturalHeight || 1) };
                const displaySize = { width: metrics.w, height: metrics.h };
                const { x, y, w, h } = convertNormalizedToDisplay(bbox, origSize, displaySize, true);

                const style: React.CSSProperties = {
                  left: `${Math.round(x)}px`,
                  top: `${Math.round(y)}px`,
                  width: `${Math.max(1, Math.round(w))}px`,
                  height: `${Math.max(1, Math.round(h))}px`
                };

                const isSelected = selectedBoxId === box.id;
                
                return (
                  <div
                    key={box.id}
                    className={`absolute border-2 flex items-start justify-start group cursor-pointer transition-all duration-200 pointer-events-auto
                      ${isText ? 'border-purple-500/60 bg-purple-500/10' : 'border-cyan-500/60 bg-cyan-500/10'}
                      ${isSelected ? 'border-opacity-100 bg-opacity-30 ring-2 ring-cyan-400/50' : 'hover:border-opacity-100 hover:bg-opacity-20'}
                    `}
                    style={style}
                    onMouseEnter={() => onSelectBox?.(box.id)}
                    onMouseLeave={() => onSelectBox?.(null)}
                    onClick={() => onSelectBox?.(box.id)}
                  >
                    {/* Always-visible tiny debug badge for easier QA (mock mode) */}
                    {debugMode && (
                      <div className="absolute left-1 top-1 bg-slate-900/90 text-[9px] text-slate-200 px-1 rounded font-mono z-40 pointer-events-none truncate max-w-[70%]">
                        {box.label || box.id}
                      </div>
                    )}

                    {/* Hover Card */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-64 opacity-0 group-hover:opacity-100 transition-all duration-300 z-50 pointer-events-none origin-top scale-95 group-hover:scale-100">
                      <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-lg shadow-2xl p-0 overflow-hidden ring-1 ring-white/10">
                        <div className={`h-1 w-full bg-gradient-to-r ${isText ? 'from-purple-600' : 'from-cyan-600'}`} />
                        <div className="p-3 text-left space-y-1">
                          <h4 className="text-xs font-bold text-slate-100 uppercase truncate">{box.label || box.id}</h4>
                          {box.meta?.description && (
                            <div className="text-[11px] text-cyan-300 font-medium">{box.meta.description}</div>
                          )}
                          <div className="text-[10px] text-slate-400 capitalize">{box.type}</div>
                          {box.confidence && (
                            <div className="text-[10px] text-emerald-400 font-mono">
                              Confidence: {(box.confidence * 100).toFixed(1)}%
                            </div>
                          )}
                        </div>
                      </div>
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
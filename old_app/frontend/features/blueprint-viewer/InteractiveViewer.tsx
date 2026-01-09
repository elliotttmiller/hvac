import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/primitives';
import { convertNormalizedToDisplay, NormBBox } from '../../lib/geometry';
import { Layers, X, ZoomIn, ZoomOut, Upload, FileSearch, Play } from 'lucide-react';
import { DetectedComponent } from '@/features/document-analysis/types';
import { ProcessingOverlay, ProcessingPhase } from '@/components/feedback/ProcessingOverlay';

interface InteractiveViewerProps {
  imageUrl: string | null;
  components: DetectedComponent[]; // <--- CORRECTED PROP NAME
  isProcessing: boolean;
  processingPhase?: ProcessingPhase;
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
  processingPhase = 'uploading',
  selectedBoxId,
  onSelectBox,
  onFileUpload,
  onClearImage,
  onRunAnalysis,
  debugMode = false,
}) => {
  // --- UI State ---
  // Always show detections and OCR overlays by default
  const [showOBB, setShowOBB] = useState(true);
  const [showOCR, setShowOCR] = useState(true);
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

      {/* Vertical Edge Toolbar (left center) */}
      {imageUrl && (
        <div className="absolute right-4 top-4 z-30 flex flex-col items-end gap-3 pointer-events-auto">
          {/* Run (icon-only) with hover label to the left */}
          <div className="relative group">
            <Button onClick={onRunAnalysis} disabled={isProcessing} size="sm" className="w-12 h-12 flex items-center justify-center rounded-full shadow-md transition-transform transform hover:-translate-y-0.5 hover:scale-105 hover:shadow-xl focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#2563eb]/40" style={isProcessing ? { background: 'linear-gradient(180deg,#154e4a,#2aa68a)' } : undefined}>
              <Play size={18} className="text-[#2aa68a]" />
            </Button>
            <div className="pointer-events-none absolute right-full mr-3 top-1/2 -translate-y-1/2 opacity-0 translate-x-2 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-150 bg-black/80 text-white text-[12px] px-2.5 py-1 rounded-lg shadow-sm whitespace-nowrap">
              Run analysis
            </div>
          </div>

          {/* Detections and OCR overlays are always enabled; toggles removed */}

          {/* Clear */}
          <div className="relative group">
            <Button onClick={onClearImage} variant="secondary" size="sm" className="w-10 h-10 flex items-center justify-center text-red-400 border-red-600/20 transition-transform transform hover:-translate-y-0.5 hover:scale-105 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-400/40">
              <X size={16} />
            </Button>
            <div className="pointer-events-none absolute right-full mr-3 top-1/2 -translate-y-1/2 opacity-0 translate-x-2 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-150 bg-black/80 text-white text-[12px] px-2.5 py-1 rounded-lg shadow-sm whitespace-nowrap">
              Clear image
            </div>
          </div>
        </div>
      )}

      {/* Main Canvas Area */}
      <div ref={containerRef} className="flex-1 flex items-center justify-center p-8 overflow-hidden relative">
        {!imageUrl ? (
            <div className="border border-dashed border-zinc-800 bg-[#1e1e1e] rounded-xl p-12 text-center max-w-sm hover:border-[#2563eb]/30 transition-all group">
              <Upload className="mx-auto text-zinc-500 mb-4 group-hover:text-[#2563eb]" size={32} />
              <h3 className="text-sm font-medium text-zinc-200 mb-1">Import Schematic</h3>
              <p className="text-zinc-500 mb-6 text-xs">Supports PDF, DWG, PNG.</p>
              <label className="bg-[#2563eb] hover:bg-[#2563eb]/90 text-white px-5 py-2 rounded-md cursor-pointer inline-flex items-center gap-2 text-xs font-medium">
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
            {/* Processing Overlay - positioned relative to image container */}
            <ProcessingOverlay isOpen={isProcessing} phase={processingPhase} />
            
            {/* The Image */}
            <img 
              key={imageUrl || 'no-image'}
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
                      ${isText ? 'border-purple-500/60 bg-purple-500/10' : 'border-[#2563eb]/60 bg-[#2563eb]/10'}
                      ${isSelected ? 'border-opacity-100 bg-opacity-30 ring-2 ring-[#2563eb]/50' : 'hover:border-opacity-100 hover:bg-opacity-20'}
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
                        <div className={`h-1 w-full bg-gradient-to-r ${isText ? 'from-purple-600' : 'from-[#2563eb]'}`} />
                        <div className="p-3 text-left space-y-1">
                          <h4 className="text-xs font-bold text-slate-100 uppercase truncate">{box.label || box.id}</h4>
                          {box.meta?.description && (
                            <div className="text-[11px] text-[#2563eb] font-medium">{box.meta.description}</div>
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
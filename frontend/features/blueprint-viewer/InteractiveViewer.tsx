import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Scan, Type, X, ZoomIn, ZoomOut, Upload, FileSearch, Play } from 'lucide-react';
import { DetectedComponent } from '@/features/document-analysis/types'; // Correct Import

interface InteractiveViewerProps {
  imageUrl: string | null;
  detectedBoxes: DetectedComponent[]; // Use the correct type from the API
  isProcessing: boolean;
  selectedBoxId?: string | null;
  onSelectBox?: (id: string | null) => void;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClearImage: () => void;
  onRunAnalysis: () => void;
}

const InteractiveViewer: React.FC<InteractiveViewerProps> = ({
  imageUrl,
  detectedBoxes, // This prop receives the raw API components
  isProcessing,
  selectedBoxId,
  onSelectBox,
  onFileUpload,
  onClearImage,
  onRunAnalysis,
}) => {
  // --- UI State ---
  const [showOBB, setShowOBB] = useState(true);
  const [showOCR, setShowOCR] = useState(false);
  const [showGeo, setShowGeo] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [activeBoxId, setActiveBoxId] = useState<string | null>(null);

  // --- Hover Card Positioning Thresholds ---
  // If box center Y > 0.6 (in bottom 40% of image), position card above
  const CARD_POSITION_BOTTOM_THRESHOLD = 0.6;
  // If box center X > 0.7 (in right 30% of image), position card to left
  const CARD_POSITION_RIGHT_THRESHOLD = 0.7;

  // --- Geometry Engine ---
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
    requestAnimationFrame(updateMetrics);
    return () => { 
      window.removeEventListener('resize', updateMetrics); 
      observer.disconnect(); 
    };
  }, [updateMetrics]);

  return (
    <div className="flex-1 relative bg-[#0B1120] flex flex-col overflow-hidden">
      
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
            className="relative inline-block shadow-2xl transition-transform duration-200 ease-out origin-center"
            style={{ 
              width: metrics.w, 
              height: metrics.h, 
              transform: `scale(${zoom})`
            }}
          >
            {/* The Image */}
            <img 
              ref={imageRef}
              src={imageUrl} 
              alt="Blueprint" 
              className={`w-full h-full block`}
              style={{ objectFit: 'contain' }}
              onLoad={updateMetrics}
            />

            {/* The Overlay Layer */}
            <div className="absolute inset-0 pointer-events-none">
              {detectedBoxes.map((box) => {
                // Defensive check: Ensure we have a valid bbox array
                if (!box || !Array.isArray(box.bbox) || box.bbox.length < 4) return null;
                
                const isText = box.type === 'text';
                const isVisible = (isText && showOCR) || (!isText && showOBB);
                if (!isVisible) return null;

                // --- CRITICAL FIX: Direct BBox Mapping ---
                // API sends: [ymin, xmin, ymax, xmax] (Normalized 0-1)
                const [ymin, xmin, ymax, xmax] = box.bbox;
                
                // Convert to CSS Percentages (relative to the image itself)
                const style = {
                  left: `${xmin * 100}%`,
                  top: `${ymin * 100}%`,
                  width: `${(xmax - xmin) * 100}%`,
                  height: `${(ymax - ymin) * 100}%`
                };

                // Calculate if hover card would go off-screen
                // Position card based on available space
                const boxCenterY = (ymin + ymax) / 2;
                const boxCenterX = (xmin + xmax) / 2;
                const shouldPositionAbove = boxCenterY > CARD_POSITION_BOTTOM_THRESHOLD;
                const shouldPositionLeft = boxCenterX > CARD_POSITION_RIGHT_THRESHOLD;

                return (
                  <div 
                    key={box.id}
                    className={`absolute border-2 flex items-start justify-start group cursor-pointer transition-all duration-200 pointer-events-auto
                      ${isText ? 'border-purple-500/60 bg-purple-500/10' : 'border-cyan-500/60 bg-cyan-500/10'}
                      hover:border-opacity-100 hover:bg-opacity-20 hover:z-50
                    `}
                    style={style}
                    onMouseEnter={() => setActiveBoxId(box.id)}
                    onMouseLeave={() => setActiveBoxId(null)}
                  >
                    {/* Corner Markers */}
                    <div className="absolute -top-[2px] -left-[2px] w-2 h-2 border-t-2 border-l-2 border-current opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="absolute -top-[2px] -right-[2px] w-2 h-2 border-t-2 border-r-2 border-current opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="absolute -bottom-[2px] -left-[2px] w-2 h-2 border-b-2 border-l-2 border-current opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="absolute -bottom-[2px] -right-[2px] w-2 h-2 border-b-2 border-r-2 border-current opacity-0 group-hover:opacity-100 transition-opacity"></div>

                    {/* Hover Card with Smart Positioning */}
                    <div 
                      className={`absolute w-64 opacity-0 group-hover:opacity-100 transition-all duration-300 z-50 pointer-events-none origin-top scale-95 group-hover:scale-100
                        ${shouldPositionAbove ? 'bottom-full mb-3' : 'top-full mt-3'}
                        ${shouldPositionLeft ? 'right-0' : 'left-1/2 -translate-x-1/2'}
                      `}
                    >
                      <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-lg shadow-2xl p-0 overflow-hidden ring-1 ring-white/10">
                        <div className={`h-1 w-full bg-gradient-to-r ${isText ? 'from-purple-600' : 'from-cyan-600'}`} />
                        <div className="p-3 text-left">
                          <div className="flex justify-between items-center mb-1">
                            <h4 className="text-xs font-bold text-slate-100 uppercase truncate pr-2">{box.label || box.id}</h4>
                            <span className="text-[10px] text-cyan-400 font-mono">{Math.round((box.confidence || 0) * 100)}%</span>
                          </div>
                          <div className="text-[10px] text-slate-400 capitalize mb-2">{box.type}</div>
                          {box.meta?.description && (
                            <div className="text-[9px] text-slate-500 border-t border-slate-800 pt-2 leading-relaxed">
                              {box.meta.description}
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
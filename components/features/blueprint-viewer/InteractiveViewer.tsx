import React, { useState } from 'react';
import { Upload, FileSearch, Scan, Type, Layers, X, Eye, Server, Sparkles, Box, ZoomIn, ZoomOut, Move } from 'lucide-react';
import { DetectedObject, GeminiModel } from '../../../types';

interface InteractiveViewerProps {
  imageUrl: string | null;
  detectedBoxes: DetectedObject[];
  isProcessing: boolean;
  backendType: 'RAY' | 'GEMINI';
  selectedBoxId: string | null;
  onSelectBox: (id: string | null) => void;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClearImage: () => void;
  onRunAnalysis: () => void;
  // onSetBackendType removed: we now use a single/default AI workflow (Gemini)
}

const InteractiveViewer: React.FC<InteractiveViewerProps> = ({
  imageUrl,
  detectedBoxes,
  isProcessing,
  backendType,
  selectedBoxId,
  onSelectBox,
  onFileUpload,
  onClearImage,
  onRunAnalysis,
  
}) => {
  const [showOBB, setShowOBB] = useState(true);
  const [showOCR, setShowOCR] = useState(false);
  const [showGeo, setShowGeo] = useState(false);
  const [zoom, setZoom] = useState(1);

  return (
    <div className="flex-1 relative bg-[#121212] flex flex-col overflow-hidden">
      
      {/* Canvas Grid Background */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" 
           style={{ 
             backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', 
             backgroundSize: '20px 20px' 
           }}>
      </div>

    {/* Internal Toolbar (Canvas Controls) - Top Center */}
    {imageUrl && (
      <>
       <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
         <button 
           onClick={onRunAnalysis}
           className="bg-zinc-100 hover:bg-white text-black px-4 py-1.5 rounded-lg text-xs font-semibold shadow-xl transition-all flex items-center gap-2"
         >
            <Eye size={12} /> Run
         </button>
       </div>

       {/* Subtle AI model identifier badge (read-only) */}
       <div className="absolute top-4 right-4 z-20">
        <div className="bg-black/60 text-zinc-200 text-xs px-3 py-1 rounded-full border border-white/10 flex items-center gap-2 backdrop-blur">
          <Sparkles size={12} />
          <span className="font-mono text-[11px]">{GeminiModel.PRO}</span>
        </div>
       </div>
      </>
    )}

      {/* Main Content */}
      <div 
        className="flex-1 flex items-center justify-center p-8 overflow-hidden relative"
        onClick={() => onSelectBox(null)} // Deselect on background click
      >
        {!imageUrl ? (
          <div className="border border-dashed border-zinc-800 bg-[#1e1e1e] rounded-xl p-12 text-center max-w-sm hover:border-cyan-500/30 transition-all duration-300 group">
            <div className="w-12 h-12 bg-zinc-800 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Upload className="text-zinc-500 group-hover:text-cyan-400" size={20} />
            </div>
            <h3 className="text-sm font-medium text-zinc-200 mb-1">Import Schematic</h3>
            <p className="text-zinc-500 mb-6 text-xs leading-relaxed">
                Supports PDF, DWG, PNG. Max 50MB.
            </p>
            <label className="bg-cyan-600 hover:bg-cyan-500 text-white px-5 py-2 rounded-md cursor-pointer transition-all shadow-lg shadow-cyan-900/20 inline-flex items-center gap-2 text-xs font-medium">
              <FileSearch size={14} />
              <span>Browse Files</span>
              <input type="file" className="hidden" accept="image/*" onChange={onFileUpload} />
            </label>
          </div>
        ) : (
          <div className="relative w-full h-full flex items-center justify-center overflow-auto cursor-grab active:cursor-grabbing">
              <div 
                className="relative inline-block shadow-2xl shadow-black/50 transition-transform duration-200 ease-out"
                style={{ transform: `scale(${zoom})` }}
                onClick={(e) => e.stopPropagation()} // Prevent deselection when clicking image area
              >
                  <img 
                    src={imageUrl} 
                    alt="Blueprint" 
                    className={`max-w-none shadow-2xl ${showGeo ? 'perspective-[1000px] rotate-x-2 scale-[0.98] duration-500' : ''}`} 
                  />
                  
                  {/* Render Bounding Boxes */}
                  {detectedBoxes.map(box => {
                      const isText = box.type === 'text';
                      const isVisible = (isText && showOCR) || (!isText && showOBB);
                      const isSelected = selectedBoxId === box.id;
                      
                      if (!isVisible) return null;

                      return (
                          <div 
                              key={box.id}
                              onClick={(e) => {
                                  e.stopPropagation();
                                  onSelectBox(box.id);
                              }}
                              className={`absolute flex items-start justify-start group cursor-pointer transition-all duration-300
                                ${isSelected 
                                    ? 'border-2 border-cyan-500 bg-cyan-500/20 z-10' 
                                    : isText 
                                        ? 'border border-purple-500/30 hover:border-purple-500 hover:bg-purple-500/10' 
                                        : 'border border-cyan-400/30 hover:border-cyan-400 hover:bg-cyan-400/10'
                                }
                              `}
                              style={{
                                  left: `${box.x}%`,
                                  top: `${box.y}%`,
                                  width: `${box.width}%`,
                                  height: `${box.height}%`,
                                  transform: `rotate(${box.rotation || 0}deg)`,
                                  transformOrigin: 'center center'
                              }}
                          >
                              {/* Selection Handles (Figma Style) - Only visible when selected */}
                              {isSelected && (
                                <>
                                    <div className="absolute -top-1 -left-1 w-2 h-2 bg-white border border-cyan-500 shadow-sm"></div>
                                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-white border border-cyan-500 shadow-sm"></div>
                                    <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-white border border-cyan-500 shadow-sm"></div>
                                    <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-white border border-cyan-500 shadow-sm"></div>
                                </>
                              )}

                              {/* Corner Markers for Tech Feel - Transplanted from Legacy */}
                              <div className="absolute -top-[1px] -left-[1px] w-1.5 h-1.5 border-t-2 border-l-2 border-current opacity-0 group-hover:opacity-100 transition-opacity"></div>
                              <div className="absolute -top-[1px] -right-[1px] w-1.5 h-1.5 border-t-2 border-r-2 border-current opacity-0 group-hover:opacity-100 transition-opacity"></div>
                              <div className="absolute -bottom-[1px] -left-[1px] w-1.5 h-1.5 border-b-2 border-l-2 border-current opacity-0 group-hover:opacity-100 transition-opacity"></div>
                              <div className="absolute -bottom-[1px] -right-[1px] w-1.5 h-1.5 border-b-2 border-r-2 border-current opacity-0 group-hover:opacity-100 transition-opacity"></div>

                              {/* SLEEK POPOVER CARD - Transplanted from Legacy InteractiveViewer */}
                              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-64 opacity-0 group-hover:opacity-100 transition-all duration-300 z-50 pointer-events-none group-hover:pointer-events-auto origin-top scale-95 group-hover:scale-100">
                                <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-lg shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] p-0 overflow-hidden ring-1 ring-white/10">
                                  {/* Color Strip */}
                                  <div className={`h-1 w-full bg-gradient-to-r ${isText ? 'from-purple-600 via-fuchsia-500 to-purple-600' : 'from-cyan-600 via-blue-500 to-cyan-600'}`}></div>
                                  
                                  <div className="p-3.5">
                                    <div className="flex justify-between items-start mb-3">
                                      <div>
                                        <h4 className="text-xs font-bold text-slate-100 uppercase tracking-wider leading-tight">{box.label.replace(/_/g, ' ')}</h4>
                                        <div className="flex items-center gap-2 mt-1.5">
                                          <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border ${isText ? 'bg-purple-500/10 border-purple-500/20 text-purple-300' : 'bg-cyan-500/10 border-cyan-500/20 text-cyan-300'}`}>
                                            {box.meta?.tag || 'ID-' + box.id.split('-')[1]}
                                          </span>
                                        </div>
                                      </div>
                                      <div className="flex flex-col items-end">
                                        <span className={`text-sm font-bold tabular-nums tracking-tight ${isText ? 'text-purple-400' : 'text-cyan-400'}`}>
                                          {Math.round(box.confidence * 100)}%
                                        </span>
                                        <span className="text-[8px] text-slate-500 uppercase font-semibold tracking-wider">Conf.</span>
                                      </div>
                                    </div>

                                    {box.meta?.description && (
                                      <div className="py-2.5 border-t border-slate-800/50">
                                        <p className="text-[10px] text-slate-400 leading-relaxed">
                                          {box.meta.description}
                                        </p>
                                      </div>
                                    )}

                                    <div className="pt-2.5 border-t border-slate-800/50 grid grid-cols-2 gap-4">
                                      <div className="flex flex-col gap-0.5">
                                        <span className="text-[8px] text-slate-600 uppercase tracking-widest font-semibold">Position</span>
                                        <span className="text-[10px] font-mono text-slate-400">
                                          X:{Math.round(box.x)} Y:{Math.round(box.y)}
                                        </span>
                                      </div>
                                      <div className="flex flex-col gap-0.5 text-right">
                                        <span className="text-[8px] text-slate-600 uppercase tracking-widest font-semibold">Type</span>
                                        <span className="text-[10px] font-mono text-slate-400 capitalize">
                                          {box.type || 'Object'}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                {/* Triangle Connector */}
                                <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-slate-900 border-l border-t border-slate-700/50 transform rotate-45"></div>
                              </div>
                          </div>
                      );
                  })}
                  
                  {isProcessing && (
                        <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px] flex items-center justify-center z-50">
                          <div className="bg-[#1e1e1e] p-4 rounded-xl shadow-2xl border border-white/10 flex flex-col items-center">
                                <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mb-3"></div>
                                <span className="text-zinc-200 text-xs font-medium">Processing...</span>
                          </div>
                        </div>
                  )}
              </div>
          </div>
        )}
      </div>

      {/* Bottom Bar Controls */}
      {imageUrl && !isProcessing && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30">
            <div className="bg-[#1e1e1e] border border-white/10 rounded-full px-4 py-2 flex items-center gap-4 shadow-xl">
                
                <div className="flex items-center gap-2 border-r border-white/10 pr-4">
                    <button onClick={() => setZoom(z => Math.max(0.2, z - 0.1))} className="text-zinc-400 hover:text-white"><ZoomOut size={14}/></button>
                    <span className="text-[10px] font-mono text-zinc-300 w-8 text-center">{Math.round(zoom * 100)}%</span>
                    <button onClick={() => setZoom(z => Math.min(3, z + 0.1))} className="text-zinc-400 hover:text-white"><ZoomIn size={14}/></button>
                </div>

                <div className="flex items-center gap-2">
                    <button 
                        onClick={() => setShowOBB(!showOBB)} 
                        className={`p-1.5 rounded hover:bg-white/10 transition-colors ${showOBB ? 'text-cyan-400' : 'text-zinc-500'}`}
                        title="Show Objects"
                    >
                        <Scan size={16} />
                    </button>
                    <button 
                        onClick={() => setShowOCR(!showOCR)} 
                        className={`p-1.5 rounded hover:bg-white/10 transition-colors ${showOCR ? 'text-cyan-400' : 'text-zinc-500'}`}
                        title="Show Text"
                    >
                        <Type size={16} />
                    </button>
                    <button onClick={onClearImage} className="p-1.5 text-red-400 hover:bg-red-500/10 rounded ml-2">
                        <X size={16} />
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default InteractiveViewer;
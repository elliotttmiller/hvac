import React, { useState } from 'react';
import { Upload, FileSearch, Scan, Type, Layers, X, Eye, Server, Info, Maximize2 } from 'lucide-react';
import { DetectedObject } from '../../../types';

interface InteractiveViewerProps {
  imageUrl: string | null;
  detectedBoxes: DetectedObject[];
  isProcessing: boolean;
  backendType: 'RAY' | 'GEMINI';
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClearImage: () => void;
  onRunAnalysis: () => void;
  onSetBackendType: (type: 'RAY' | 'GEMINI') => void;
}

const InteractiveViewer: React.FC<InteractiveViewerProps> = ({
  imageUrl,
  detectedBoxes,
  isProcessing,
  backendType,
  onFileUpload,
  onClearImage,
  onRunAnalysis,
  onSetBackendType
}) => {
  const [showOBB, setShowOBB] = useState(true);
  const [showOCR, setShowOCR] = useState(false);
  const [showGeo, setShowGeo] = useState(false);
  const [activeBoxId, setActiveBoxId] = useState<string | null>(null);

  return (
    <div className="flex-1 relative bg-slate-900 border-r border-slate-800 flex flex-col">
      {/* Toolbar Overlay */}
      <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
        {imageUrl && (
          <div className="flex gap-2">
            <button 
                onClick={() => setShowOBB(!showOBB)} 
                className={`px-3 py-1.5 rounded-md border transition-all flex items-center gap-2 text-xs font-semibold shadow-lg backdrop-blur-sm ${showOBB ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400 shadow-cyan-900/20' : 'bg-slate-900/80 border-slate-700 text-slate-500 hover:border-slate-600'}`}
            >
                <Scan size={14} /> Detect
            </button>
            <button 
                onClick={() => setShowOCR(!showOCR)} 
                className={`px-3 py-1.5 rounded-md border transition-all flex items-center gap-2 text-xs font-semibold shadow-lg backdrop-blur-sm ${showOCR ? 'bg-purple-500/20 border-purple-500 text-purple-400 shadow-purple-900/20' : 'bg-slate-900/80 border-slate-700 text-slate-500 hover:border-slate-600'}`}
            >
                <Type size={14} /> Text
            </button>
            <button 
                onClick={() => setShowGeo(!showGeo)} 
                className={`px-3 py-1.5 rounded-md border transition-all flex items-center gap-2 text-xs font-semibold shadow-lg backdrop-blur-sm ${showGeo ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-emerald-900/20' : 'bg-slate-900/80 border-slate-700 text-slate-500 hover:border-slate-600'}`}
            >
                <Layers size={14} /> Geo
            </button>
            <div className="w-px h-6 bg-slate-700/50 mx-1 self-center"></div>
            <button onClick={onClearImage} className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 p-1.5 rounded-md transition-colors">
                <X size={16} />
            </button>
          </div>
        )}
        
        {/* Backend Selector */}
        {imageUrl && (
          <div className="bg-slate-950/80 backdrop-blur-md border border-slate-800 rounded-lg p-1 flex items-center gap-1 w-fit shadow-xl">
              <button 
                onClick={() => onSetBackendType('RAY')}
                className={`px-3 py-1.5 rounded-md text-[10px] font-bold tracking-wide transition-all ${backendType === 'RAY' ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-900/50' : 'text-slate-500 hover:text-slate-300'}`}
              >
                RAY SERVE
              </button>
              <button 
                onClick={() => onSetBackendType('GEMINI')}
                className={`px-3 py-1.5 rounded-md text-[10px] font-bold tracking-wide transition-all ${backendType === 'GEMINI' ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/50' : 'text-slate-500 hover:text-slate-300'}`}
              >
                GEMINI VLM
              </button>
          </div>
        )}
      </div>

      {/* Main Canvas */}
      <div className="flex-1 flex items-center justify-center p-8 overflow-auto relative bg-[#0B1120]">
        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#334155 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
        
        {!imageUrl ? (
          <div className="border-2 border-dashed border-slate-800 bg-slate-900/50 rounded-2xl p-16 text-center max-w-lg hover:border-cyan-500/30 hover:bg-slate-900/80 transition-all duration-300 group">
            <div className="w-20 h-20 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-xl">
               <Upload className="text-slate-500 group-hover:text-cyan-400 transition-colors" size={32} />
            </div>
            <h3 className="text-2xl font-semibold text-slate-200 mb-3 tracking-tight">System Analysis</h3>
            <p className="text-slate-500 mb-8 leading-relaxed">
                Upload HVAC P&IDs, Schematics, or Blueprints.<br/>
                Supports PDF, DWG (Rasterized), and PNG.
            </p>
            <label className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-8 py-3 rounded-xl font-semibold cursor-pointer transition-all shadow-lg shadow-cyan-900/20 hover:shadow-cyan-500/20 inline-flex items-center gap-2 transform hover:-translate-y-0.5">
              <FileSearch size={20} />
              <span>Select File</span>
              <input type="file" className="hidden" accept="image/*" onChange={onFileUpload} />
            </label>
          </div>
        ) : (
          <div className="relative w-full h-full flex items-center justify-center">
              <div className="relative inline-block max-w-full max-h-full shadow-2xl ring-1 ring-slate-800 rounded-sm">
                  <img 
                    src={imageUrl} 
                    alt="Blueprint" 
                    className={`max-w-full max-h-full object-contain transition-all duration-700 ease-out ${showGeo ? 'perspective-correction' : ''}`} 
                    style={showGeo ? {transform: 'perspective(1500px) rotateX(10deg) rotateY(-5deg) scale(0.9) translateY(-20px)'} : {}} 
                  />
                  
                  {/* Bounding Boxes Layer */}
                  {detectedBoxes.map(box => {
                      const isText = box.type === 'text';
                      const isVisible = (isText && showOCR) || (!isText && showOBB);
                      if (!isVisible) return null;

                      return (
                          <div 
                              key={box.id}
                              className={`absolute border-2 flex items-start justify-start group cursor-pointer transition-all duration-200 ${
                                isText 
                                  ? 'border-purple-500/60 hover:border-purple-400 hover:bg-purple-500/10' 
                                  : 'border-cyan-500/60 hover:border-cyan-400 hover:bg-cyan-500/10'
                              }`}
                              style={{
                                  left: `${box.x}%`,
                                  top: `${box.y}%`,
                                  width: `${box.width}%`,
                                  height: `${box.height}%`,
                                  transform: `rotate(${box.rotation || 0}deg)`,
                                  transformOrigin: 'center center'
                              }}
                              onMouseEnter={() => setActiveBoxId(box.id)}
                              onMouseLeave={() => setActiveBoxId(null)}
                          >
                              {/* Corner Markers for Tech Feel */}
                              <div className="absolute -top-[1px] -left-[1px] w-1.5 h-1.5 border-t-2 border-l-2 border-current opacity-0 group-hover:opacity-100 transition-opacity"></div>
                              <div className="absolute -top-[1px] -right-[1px] w-1.5 h-1.5 border-t-2 border-r-2 border-current opacity-0 group-hover:opacity-100 transition-opacity"></div>
                              <div className="absolute -bottom-[1px] -left-[1px] w-1.5 h-1.5 border-b-2 border-l-2 border-current opacity-0 group-hover:opacity-100 transition-opacity"></div>
                              <div className="absolute -bottom-[1px] -right-[1px] w-1.5 h-1.5 border-b-2 border-r-2 border-current opacity-0 group-hover:opacity-100 transition-opacity"></div>

                              {/* SLEEK POPOVER CARD */}
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
                    <div className="absolute inset-0 bg-slate-950/60 flex items-center justify-center backdrop-blur-sm z-40 transition-opacity duration-500">
                        <div className="flex flex-col items-center bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-2xl">
                            <div className="relative w-16 h-16 mb-6">
                                <div className="absolute inset-0 border-4 border-slate-800 rounded-full"></div>
                                <div className="absolute inset-0 border-4 border-cyan-500 rounded-full border-t-transparent animate-spin"></div>
                                <Server className="absolute inset-0 m-auto text-cyan-500 animate-pulse" size={24} />
                            </div>
                            <h4 className="text-lg font-medium text-slate-200 mb-1">Processing Blueprint</h4>
                            <p className="text-sm text-slate-500 font-mono flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></span>
                                {backendType === 'RAY' ? 'Ray Serve Inference...' : 'Gemini Vision Analysis...'}
                            </p>
                        </div>
                    </div>
                  )}
              </div>
          </div>
        )}
      </div>

      {/* Bottom Status Bar */}
      {imageUrl && !isProcessing && (
            <div className="h-14 border-t border-slate-800 bg-slate-900 px-6 flex justify-between items-center z-20">
                <div className="flex items-center gap-6 text-xs text-slate-500 font-mono">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-cyan-500/50"></div>
                    <span>Components: <span className="text-slate-300 font-semibold">{detectedBoxes.filter(b => b.type === 'component').length}</span></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-purple-500/50"></div>
                    <span>OCR Regions: <span className="text-slate-300 font-semibold">{detectedBoxes.filter(b => b.type === 'text').length}</span></span>
                  </div>
                </div>
                <button 
                  onClick={onRunAnalysis}
                  className="bg-cyan-600 hover:bg-cyan-500 text-white pl-4 pr-5 py-2 rounded-lg text-sm font-medium transition-all shadow-lg shadow-cyan-900/40 flex items-center gap-2 transform active:scale-95"
                >
                  <Eye size={16} />
                  <span>Analyze</span>
                </button>
            </div>
      )}
    </div>
  );
};

export default InteractiveViewer;

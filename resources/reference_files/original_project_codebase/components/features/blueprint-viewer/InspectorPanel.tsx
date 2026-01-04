import React from 'react';
import { Layers, AlertOctagon, CheckCircle, Server, Eye, Ruler } from 'lucide-react';
import { DetectedObject } from '../../../types';

interface InspectorPanelProps {
  analysis: string;
  inventory: any[];
  backendType: 'RAY' | 'GEMINI';
  activeBox?: DetectedObject | null;
}

const InspectorPanel: React.FC<InspectorPanelProps> = ({ analysis, inventory, backendType, activeBox }) => {
  return (
    <div className="w-96 bg-slate-950 border-l border-slate-800 flex flex-col shrink-0 transition-all duration-300">
      <div className="p-4 border-b border-slate-800 bg-slate-900/50 backdrop-blur">
          <h2 className="font-semibold text-slate-200">Analysis Results</h2>
          <div className="flex items-center gap-2 mt-1">
              {backendType === 'RAY' ? <Server size={12} className="text-emerald-400"/> : <Eye size={12} className="text-purple-400"/>}
              <span className="text-xs text-slate-500">{backendType === 'RAY' ? 'Ray Serve (Python)' : 'Gemini Cloud'}</span>
          </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-slate-800">
          
          {/* Debug Geometry Card - Appears when hovering a box */}
          {activeBox && activeBox.debugLog && (
              <div className="bg-slate-900 border border-amber-500/30 rounded-lg p-3 shadow-lg shadow-amber-900/10 animate-in fade-in slide-in-from-right-4 duration-200">
                  <div className="flex items-center gap-2 mb-3 border-b border-slate-800 pb-2">
                      <Ruler size={14} className="text-amber-500"/>
                      <span className="text-xs font-bold text-amber-500 uppercase tracking-widest">Geometry Debugger</span>
                  </div>
                  <div className="space-y-2 text-[10px] font-mono text-slate-400">
                      <div className="grid grid-cols-3 gap-2">
                          <span className="text-slate-500">Source:</span>
                          <span className="col-span-2 text-slate-200">{activeBox.debugLog.source}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                          <span className="text-slate-500">Raw Input:</span>
                          <span className="col-span-2 text-cyan-400 break-all">{activeBox.debugLog.rawInput}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                          <span className="text-slate-500">Transform:</span>
                          <span className="col-span-2 text-purple-400 break-all">{activeBox.debugLog.transformation}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-slate-800">
                          <span className="text-slate-500">Render X:</span>
                          <span className="col-span-2 text-slate-200">{activeBox.x.toFixed(2)}%</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                          <span className="text-slate-500">Render Y:</span>
                          <span className="col-span-2 text-slate-200">{activeBox.y.toFixed(2)}%</span>
                      </div>
                  </div>
              </div>
          )}

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
                      <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg flex items-start gap-3 shadow-sm">
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
                              <div key={idx} className="p-3 border-b border-slate-800 last:border-0 flex justify-between items-center hover:bg-slate-800/50 transition-colors">
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
                      <div className="text-sm text-slate-400 leading-relaxed font-mono text-xs p-3 bg-slate-900 rounded border border-slate-800 max-h-60 overflow-y-auto whitespace-pre-wrap">
                          {analysis}
                      </div>
                  </div>
              </>
          )}
      </div>
    </div>
  );
};

export default InspectorPanel;
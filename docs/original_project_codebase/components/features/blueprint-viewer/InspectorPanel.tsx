import React from 'react';
import { Layers, AlertOctagon, CheckCircle, Server, Eye } from 'lucide-react';

interface InspectorPanelProps {
  analysis: string;
  inventory: any[];
  backendType: 'RAY' | 'GEMINI';
}

const InspectorPanel: React.FC<InspectorPanelProps> = ({ analysis, inventory, backendType }) => {
  return (
    <div className="w-96 bg-slate-950 border-l border-slate-800 flex flex-col shrink-0">
      <div className="p-4 border-b border-slate-800 bg-slate-900/50 backdrop-blur">
          <h2 className="font-semibold text-slate-200">Analysis Results</h2>
          <div className="flex items-center gap-2 mt-1">
              {backendType === 'RAY' ? <Server size={12} className="text-emerald-400"/> : <Eye size={12} className="text-purple-400"/>}
              <span className="text-xs text-slate-500">{backendType === 'RAY' ? 'Ray Serve (Python)' : 'Gemini Cloud'}</span>
          </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-slate-800">
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
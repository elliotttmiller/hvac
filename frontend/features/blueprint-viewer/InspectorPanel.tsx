import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
   Layers, 
   Search,
   ChevronDown,
   ChevronRight,
   DollarSign,
   FileText,
   Box,
   ShoppingCart,
   Send,
   MoreHorizontal,
   Plus,
   Copy,
   ClipboardList
} from 'lucide-react';
import { ValidationIssue, DetectedComponent } from '@/features/document-analysis/types';
import { config } from '@/app/config';

interface InspectorPanelProps {
  analysis: string;
  executiveSummary: string;
  inventory: any[];
   detectedBoxes: DetectedComponent[];
  validationIssues: ValidationIssue[];
  selectedBoxId: string | null;
  onSelectBox: (id: string | null) => void;
}

type Tab = 'COMPONENTS' | 'ANALYSIS' | 'PRICING' | 'QUOTE';

// Constant for underscore replacement to avoid regex recompilation
const UNDERSCORE_REGEX = /_/g;

// Confidence quality thresholds (matches visual pipeline assessDetectionQuality)
const CONFIDENCE_THRESHOLDS = {
  EXCELLENT: 0.9,
  GOOD: 0.7,
  MODERATE: 0.5
} as const;

const getConfidenceQualityLabel = (confidence: number): string => {
  if (confidence >= CONFIDENCE_THRESHOLDS.EXCELLENT) return 'excellent';
  if (confidence >= CONFIDENCE_THRESHOLDS.GOOD) return 'good';
  if (confidence >= CONFIDENCE_THRESHOLDS.MODERATE) return 'moderate';
  return 'low';
};

const InspectorPanel: React.FC<InspectorPanelProps> = ({ 
   analysis, 
   executiveSummary, 
   inventory, 
   detectedBoxes,
   validationIssues, 
   selectedBoxId,
   onSelectBox
}) => {
  const [activeTab, setActiveTab] = useState<Tab>('COMPONENTS');
  const [searchQuery, setSearchQuery] = useState('');
      const [copied, setCopied] = useState(false);
      // Streaming log state — starts with the prop snapshot and then appends live events
      const [streamingLog, setStreamingLog] = useState<string>(analysis || '');
      
      // Ref for scrolling to selected component
      const selectedRowRef = useRef<HTMLDivElement>(null);
      
      // State for expanded component details
      const [expandedComponentId, setExpandedComponentId] = useState<string | null>(null);

      useEffect(() => {
         // initialize from prop when it changes (e.g., new analysis run)
         setStreamingLog(analysis || '');
      }, [analysis]);
      
      // Scroll to selected component in list
      useEffect(() => {
         if (selectedBoxId && selectedRowRef.current) {
            selectedRowRef.current.scrollIntoView({
               behavior: 'smooth',
               block: 'nearest'
            });
         }
      }, [selectedBoxId]);

      useEffect(() => {
         const handler = (e: Event) => {
            const detail = (e as CustomEvent).detail as string;
            setStreamingLog((prev) => (prev ? `${prev}\n${detail}` : detail));
         };
         window.addEventListener('analysis-log', handler as EventListener);
         return () => window.removeEventListener('analysis-log', handler as EventListener);
      }, []);

   const copyProcessLog = async () => {
      try {
         const toCopy = streamingLog || '';
         if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(toCopy);
         } else {
            const ta = document.createElement('textarea');
            ta.value = toCopy;
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
         }
         setCopied(true);
         setTimeout(() => setCopied(false), 1500);
      } catch (e) {
         console.warn('Copy failed', e);
      }
   };

  // Derived state for filtered components
  const filteredBoxes = useMemo(() => {
    if (!searchQuery) return detectedBoxes;
    return detectedBoxes.filter(box => 
      box.label.toLowerCase().includes(searchQuery.toLowerCase()) || 
      box.meta?.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [detectedBoxes, searchQuery]);

  // Derived state for Pricing
  const pricingData = useMemo(() => {
    // Mock pricing database
    const prices: Record<string, number> = {
      'AHU': 12500,
      'VAV': 850,
      'Thermostat': 150,
      'Sensor': 85,
      'Damper': 200,
      'Chiller': 45000,
      'Pump': 3200
    };

    return inventory.map(item => {
       // Simple fuzzy match for price
       const priceKey = Object.keys(prices).find(k => item.name.includes(k)) || 'Default';
       const unitPrice = prices[priceKey] || 100;
       return {
         ...item,
         unitPrice,
         totalPrice: unitPrice * item.count
       };
    });
  }, [inventory]);

  const totalProjectCost = pricingData.reduce((sum, item) => sum + item.totalPrice, 0);

  // Log line parser for syntax highlighting
  const parseLogLine = (line: string): { className: string; prefix: string } => {
    if (line.includes('Step')) {
      return { className: 'text-cyan-400 font-semibold', prefix: '▶ ' };
    } else if (line.includes('Error') || line.includes('error')) {
      return { className: 'text-red-400', prefix: '✖ ' };
    } else if (line.includes('complete') || line.includes('Complete')) {
      return { className: 'text-emerald-400', prefix: '✓ ' };
    } else if (line.startsWith('[') || line.startsWith('{')) {
      return { className: 'text-purple-300', prefix: '' };
    } else if (line.includes('result:') || line.includes('Selected')) {
      return { className: 'text-amber-300', prefix: '' };
    }
    return { className: 'text-zinc-300', prefix: '' };
  };

  // Memoize parsed log lines for performance
  const parsedLogLines = useMemo(() => {
    return streamingLog.split('\n').map((line, index) => ({
      line,
      index,
      ...parseLogLine(line)
    }));
  }, [streamingLog]);

  // Memoize component analysis data
  const componentsByType = useMemo(() => {
    const groups: Record<string, DetectedComponent[]> = {};
    detectedBoxes.forEach(comp => {
      const type = comp.meta?.equipment_type || comp.type || 'Other';
      if (!groups[type]) groups[type] = [];
      groups[type].push(comp);
    });
    return groups;
  }, [detectedBoxes]);

  const componentStats = useMemo(() => {
    const stats = {
      total: detectedBoxes.length,
      bySubsystem: {} as Record<string, number>,
      avgConfidence: 0,
      excellentQuality: 0,
      isaCompliant: 0
    };
    
    let confidenceSum = 0;
    detectedBoxes.forEach(comp => {
      confidenceSum += comp.confidence;
      const subsystem = comp.meta?.hvac_subsystem || 'other';
      stats.bySubsystem[subsystem] = (stats.bySubsystem[subsystem] || 0) + 1;
      if (comp.meta?.detection_quality === 'excellent') stats.excellentQuality++;
      if (comp.meta?.isa_function) stats.isaCompliant++;
    });
    
    stats.avgConfidence = detectedBoxes.length > 0 ? confidenceSum / detectedBoxes.length : 0;
    return stats;
  }, [detectedBoxes]);

  const renderComponentsTab = () => (
      <div className="flex flex-col h-full">
         {/* Scrollable content area */}
         <div className="flex-1 overflow-y-auto scrollbar-thin px-3 space-y-3">
            {/* Search */}
            <div className="px-0 pb-0">
               <div className="relative">
                     <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-zinc-500" size={12} />
                     <input 
                           type="text" 
                           value={searchQuery}
                           onChange={(e) => setSearchQuery(e.target.value)}
                           placeholder="Filter detected assets..." 
                           className="w-full bg-[#252526] border border-white/5 rounded h-8 pl-8 pr-2 text-xs text-zinc-300 focus:outline-none focus:border-cyan-500/50 transition-colors placeholder:text-zinc-600"
                     />
               </div>
            </div>

            {/* Components List */}
            <div className="space-y-1">
               {filteredBoxes.length > 0 ? (
                  filteredBoxes.map((box) => {
                     const isSelected = selectedBoxId === box.id;
                     const isExpanded = expandedComponentId === box.id;
                     return (
                        <div 
                           key={box.id}
                           ref={isSelected ? selectedRowRef : null}
                           className={`rounded border transition-all ${
                              isSelected
                                 ? 'bg-cyan-500/10 border-cyan-500/30' 
                                 : 'border-transparent hover:bg-white/5'
                           }`}
                        >
                           {/* Component Header */}
                           <div 
                              onClick={() => {
                                 onSelectBox(box.id);
                                 setExpandedComponentId(isExpanded ? null : box.id);
                              }}
                              onMouseEnter={() => onSelectBox(box.id)}
                              onMouseLeave={() => onSelectBox(null)}
                              className="flex items-center gap-3 p-2 cursor-pointer group"
                           >
                              {/* Expand/Collapse Icon */}
                              <div className="shrink-0">
                                 {isExpanded ? (
                                    <ChevronDown size={14} className="text-cyan-400" />
                                 ) : (
                                    <ChevronRight size={14} className={isSelected ? 'text-cyan-400' : 'text-zinc-500 group-hover:text-zinc-300'} />
                                 )}
                              </div>
                      
                              <div className={`w-8 h-8 rounded flex items-center justify-center shrink-0 ${
                                   isSelected ? 'bg-cyan-500/20 text-cyan-400' : 'bg-[#252526] text-zinc-500 group-hover:text-zinc-300'
                              }`}>
                                   <Box size={14} />
                              </div>
                              <div className="flex-1 min-w-0">
                                   <div className={`text-xs font-semibold truncate ${isSelected ? 'text-cyan-100' : 'text-zinc-300'}`}>
                                      {box.label}
                                   </div>
                                   <div className="text-[10px] text-zinc-500 truncate">
                                      {box.meta?.description || 'No description'}
                                   </div>
                              </div>
                              {isSelected && (
                                   <div className="w-1.5 h-1.5 rounded-full bg-cyan-500"></div>
                              )}
                           </div>

                           {/* Expanded Details */}
                           {isExpanded && (
                              <div className="px-2 pb-2 pt-0 space-y-3 animate-in slide-in-from-top-2 duration-200">
                                 {/* Component Specifications */}
                                 <div className="bg-[#1a1a1a] rounded-lg p-3 border border-white/5">
                                    <div className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                                       <div className="w-1 h-3 bg-cyan-500 rounded-full"></div>
                                       Component Specifications
                                    </div>
                                    <div className="space-y-2.5 text-xs">
                                       <div className="grid grid-cols-2 gap-x-3 gap-y-2">
                                          <div>
                                             <span className="text-zinc-500 text-[10px] uppercase tracking-wide">Type</span>
                                             <div className="text-zinc-200 font-medium mt-0.5">{box.type || 'N/A'}</div>
                                          </div>
                                          <div>
                                             <span className="text-zinc-500 text-[10px] uppercase tracking-wide">Confidence</span>
                                             <div className="text-emerald-400 font-mono font-semibold mt-0.5">
                                                {(box.confidence * 100).toFixed(1)}%
                                             </div>
                                          </div>
                                          {box.meta?.tag && (
                                             <div>
                                                <span className="text-zinc-500 text-[10px] uppercase tracking-wide">Tag ID</span>
                                                <div className="text-zinc-200 font-mono mt-0.5">{box.meta.tag}</div>
                                             </div>
                                          )}
                                          {box.meta?.equipment_type && (
                                             <div>
                                                <span className="text-zinc-500 text-[10px] uppercase tracking-wide">Equipment Type</span>
                                                <div className="text-zinc-200 mt-0.5">{box.meta.equipment_type}</div>
                                             </div>
                                          )}
                                          {box.meta?.hvac_subsystem && (
                                             <div>
                                                <span className="text-zinc-500 text-[10px] uppercase tracking-wide">HVAC Subsystem</span>
                                                <div className="text-zinc-200 mt-0.5 capitalize">{box.meta.hvac_subsystem.replace(UNDERSCORE_REGEX, ' ')}</div>
                                             </div>
                                          )}
                                          {box.meta?.detection_quality && (
                                             <div>
                                                <span className="text-zinc-500 text-[10px] uppercase tracking-wide">Detection Quality</span>
                                                <div className={`mt-0.5 capitalize font-medium ${
                                                   box.meta.detection_quality === 'excellent' ? 'text-emerald-400' :
                                                   box.meta.detection_quality === 'good' ? 'text-cyan-400' :
                                                   'text-yellow-400'
                                                }`}>
                                                   {box.meta.detection_quality}
                                                </div>
                                             </div>
                                          )}
                                       </div>
                                    </div>
                                 </div>

                                 {/* AI Inference Analysis */}
                                 {box.meta?.reasoning && (
                                    <div className="bg-[#1a1a1a] rounded-lg p-3 border border-white/5">
                                       <div className="text-[10px] font-bold text-purple-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                                          <div className="w-1 h-3 bg-purple-500 rounded-full"></div>
                                          AI Inference Analysis
                                       </div>
                                       <div className="text-xs text-zinc-300 leading-relaxed">
                                          {box.meta.reasoning}
                                       </div>
                                    </div>
                                 )}

                                 {/* ISA Information */}
                                 {(box.meta?.isa_function || box.meta?.isa_measured_variable) && (
                                    <div className="bg-[#1a1a1a] rounded-lg p-3 border border-white/5">
                                       <div className="text-[10px] font-bold text-amber-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                                          <div className="w-1 h-3 bg-amber-500 rounded-full"></div>
                                          ISA Standards
                                       </div>
                                       <div className="space-y-2 text-xs">
                                          {box.meta.isa_function && (
                                             <div className="flex justify-between items-center">
                                                <span className="text-zinc-400">Function Code</span>
                                                <span className="text-zinc-200 font-mono font-semibold">{box.meta.isa_function}</span>
                                             </div>
                                          )}
                                          {box.meta.isa_measured_variable && (
                                             <div className="flex justify-between items-center">
                                                <span className="text-zinc-400">Measured Variable</span>
                                                <span className="text-zinc-200">{box.meta.isa_measured_variable}</span>
                                             </div>
                                          )}
                                          {box.meta.isa_modifier && (
                                             <div className="flex justify-between items-center">
                                                <span className="text-zinc-400">Modifier</span>
                                                <span className="text-zinc-200">{box.meta.isa_modifier}</span>
                                             </div>
                                          )}
                                          {box.meta.isa_confidence !== undefined && (
                                             <div className="flex justify-between items-center pt-1 border-t border-white/5">
                                                <span className="text-zinc-400">ISA Confidence</span>
                                                <span className="text-amber-400 font-mono font-semibold">
                                                   {(box.meta.isa_confidence * 100).toFixed(0)}%
                                                </span>
                                             </div>
                                          )}
                                          {box.meta.isa_reasoning && (
                                             <div className="pt-2 mt-2 border-t border-white/5">
                                                <div className="text-zinc-500 text-[10px] mb-1">Reasoning:</div>
                                                <div className="text-zinc-300 text-xs leading-relaxed">{box.meta.isa_reasoning}</div>
                                             </div>
                                          )}
                                       </div>
                                    </div>
                                 )}

                                 {/* Additional Metadata */}
                                 {(box.meta?.occlusion_level || box.meta?.text_clarity || box.meta?.functional_desc || box.rotation !== undefined) && (
                                    <div className="bg-[#1a1a1a] rounded-lg p-3 border border-white/5">
                                       <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                                          <div className="w-1 h-3 bg-zinc-500 rounded-full"></div>
                                          Additional Properties
                                       </div>
                                       <div className="space-y-2 text-xs">
                                          {box.meta.functional_desc && (
                                             <div className="flex justify-between items-center">
                                                <span className="text-zinc-400">Function</span>
                                                <span className="text-zinc-200">{box.meta.functional_desc}</span>
                                             </div>
                                          )}
                                          {box.meta.occlusion_level && (
                                             <div className="flex justify-between items-center">
                                                <span className="text-zinc-400">Occlusion Level</span>
                                                <span className="text-zinc-200 capitalize">{box.meta.occlusion_level}</span>
                                             </div>
                                          )}
                                          {box.meta.text_clarity && (
                                             <div className="flex justify-between items-center">
                                                <span className="text-zinc-400">Text Clarity</span>
                                                <span className="text-zinc-200 capitalize">{box.meta.text_clarity}</span>
                                             </div>
                                          )}
                                          {box.rotation !== undefined && (
                                             <div className="flex justify-between items-center">
                                                <span className="text-zinc-400">Rotation</span>
                                                <span className="text-zinc-200 font-mono">{box.rotation}°</span>
                                             </div>
                                          )}
                                       </div>
                                    </div>
                                 )}
                              </div>
                           )}
                        </div>
                     );
                  })
               ) : (
                  <div className="p-4 text-center text-zinc-500 text-xs italic">
                     No components found.
                  </div>
               )}
            </div>

            {/* Process Log */}
                  {streamingLog && (
                     <div className="pb-3">
                        <div className="flex items-center justify-between mb-2 relative">
                           <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-0 pt-1">Process Log</div>
                           <div className="relative">
                             <button onClick={copyProcessLog} aria-label="Copy process log" title="Copy process log" className="text-zinc-400 hover:text-white p-2 rounded-md transition-colors">
                                <Copy size={14} />
                             </button>
                                           {copied && (
                                              <div className="absolute flex items-center" style={{ right: '100%', marginRight: '6px', top: '50%', transform: 'translateY(-50%)' }}>
                                                 <div className="bg-emerald-600/95 text-white text-[10px] px-2 py-0.5 rounded-full shadow-sm whitespace-nowrap flex items-center gap-2" style={{ minHeight: '20px' }}>
                                                    <span className="text-[10px]">Process log copied</span>
                                                 </div>
                                              </div>
                                           )}
                           </div>
                        </div>
                        <div className="bg-gradient-to-br from-[#0d0d0d] to-[#151515] rounded-lg p-4 border border-white/10 shadow-lg">
                           <div className="text-[11px] text-zinc-300 leading-relaxed font-mono whitespace-pre-wrap max-h-96 overflow-y-auto scrollbar-thin" style={{ userSelect: 'text' }}>
                              {parsedLogLines.map(({ line, index, className, prefix }) => (
                                 <div key={`log-line-${index}`} className={`${className} py-0.5`}>
                                    {prefix}{line}
                                 </div>
                              ))}
                           </div>
                        </div>
                     </div>
                  )}
         </div>
      </div>
  );

  const renderAnalysisTab = () => {
    const hasData = detectedBoxes.length > 0;

    return (
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-4">
          {!hasData ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <ClipboardList size={48} className="text-zinc-600 mb-4" />
              <div className="text-sm font-semibold text-zinc-400 mb-2">No Analysis Available</div>
              <div className="text-xs text-zinc-500">Run document analysis to generate a comprehensive report</div>
            </div>
          ) : (
            <>
              {/* Executive Summary */}
              <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1 h-6 bg-cyan-500 rounded-full"></div>
                  <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wide">Executive Summary</h3>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  {executiveSummary || 'Analysis complete. Document contains detected HVAC components and systems.'}
                </p>
              </div>

              {/* Key Metrics */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1 h-5 bg-emerald-500 rounded-full"></div>
                  <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Key Metrics</h3>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-[#1a1a1a] rounded-lg p-3 border border-white/5">
                    <div className="text-[10px] text-zinc-500 uppercase mb-1">Total Components</div>
                    <div className="text-xl font-bold text-cyan-400">{componentStats.total}</div>
                  </div>
                  <div className="bg-[#1a1a1a] rounded-lg p-3 border border-white/5">
                    <div className="text-[10px] text-zinc-500 uppercase mb-1">Avg Confidence</div>
                    <div className="text-xl font-bold text-emerald-400">{(componentStats.avgConfidence * 100).toFixed(1)}%</div>
                  </div>
                  <div className="bg-[#1a1a1a] rounded-lg p-3 border border-white/5">
                    <div className="text-[10px] text-zinc-500 uppercase mb-1">Excellent Quality</div>
                    <div className="text-xl font-bold text-purple-400">{componentStats.excellentQuality}</div>
                  </div>
                  <div className="bg-[#1a1a1a] rounded-lg p-3 border border-white/5">
                    <div className="text-[10px] text-zinc-500 uppercase mb-1">ISA Compliant</div>
                    <div className="text-xl font-bold text-amber-400">{componentStats.isaCompliant}</div>
                  </div>
                </div>
              </div>

              {/* System Distribution */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1 h-5 bg-purple-500 rounded-full"></div>
                  <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">System Distribution</h3>
                </div>
                <div className="space-y-2">
                  {Object.entries(componentStats.bySubsystem).map(([subsystem, count]) => {
                    const percentage = (count / componentStats.total) * 100;
                    return (
                      <div key={subsystem} className="bg-[#1a1a1a] rounded-lg p-3 border border-white/5">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs text-zinc-300 capitalize">{subsystem.replace(UNDERSCORE_REGEX, ' ')}</span>
                          <span className="text-xs font-mono text-cyan-400">{count} ({percentage.toFixed(0)}%)</span>
                        </div>
                        <div 
                          className="w-full bg-zinc-800 rounded-full h-1.5"
                          role="progressbar"
                          aria-valuenow={count}
                          aria-valuemin={0}
                          aria-valuemax={componentStats.total}
                          aria-label={`${subsystem.replace(UNDERSCORE_REGEX, ' ')} subsystem: ${count} components (${percentage.toFixed(0)}%)`}
                        >
                          <div 
                            className="bg-gradient-to-r from-cyan-500 to-blue-500 h-1.5 rounded-full transition-all"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Component Breakdown by Type */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1 h-5 bg-amber-500 rounded-full"></div>
                  <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Component Breakdown</h3>
                </div>
                <div className="space-y-3">
                  {Object.entries(componentsByType).map(([type, components]) => (
                    <div key={type} className="bg-[#1a1a1a] rounded-lg border border-white/5 overflow-hidden">
                      <div className="bg-gradient-to-r from-amber-500/10 to-transparent p-3 border-b border-white/5">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-semibold text-zinc-200">{type}</span>
                          <span className="text-xs text-amber-400 font-mono">{components.length} units</span>
                        </div>
                      </div>
                      <div className="p-3 space-y-2">
                        {components.slice(0, 3).map(comp => (
                          <div key={comp.id} className="flex items-center justify-between text-[10px]">
                            <span className="text-zinc-400 truncate flex-1">{comp.label}</span>
                            <span className="text-emerald-400 font-mono ml-2">{(comp.confidence * 100).toFixed(0)}%</span>
                          </div>
                        ))}
                        {components.length > 3 && (
                          <div className="text-[10px] text-zinc-500 italic">
                            +{components.length - 3} more...
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Insights */}
              {detectedBoxes.some(c => c.meta?.reasoning) && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-1 h-5 bg-purple-500 rounded-full"></div>
                    <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">AI Detection Insights</h3>
                  </div>
                  <div className="bg-[#1a1a1a] rounded-lg p-4 border border-purple-500/20">
                    <div className="space-y-3">
                      {detectedBoxes
                        .filter(c => c.meta?.reasoning)
                        .slice(0, 5)
                        .map(comp => (
                          <div key={comp.id} className="border-b border-white/5 last:border-0 pb-3 last:pb-0">
                            <div className="text-xs font-semibold text-purple-400 mb-1">{comp.label}</div>
                            <div className="text-[10px] text-zinc-400 leading-relaxed">{comp.meta?.reasoning}</div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Validation Issues */}
              {validationIssues.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-1 h-5 bg-red-500 rounded-full"></div>
                    <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Issues & Recommendations</h3>
                  </div>
                  <div className="space-y-2">
                    {validationIssues.map((issue, idx) => (
                      <div 
                        key={issue.id || idx}
                        className={`rounded-lg p-3 border ${
                          issue.severity === 'CRITICAL' ? 'bg-red-500/10 border-red-500/30' :
                          issue.severity === 'WARNING' ? 'bg-yellow-500/10 border-yellow-500/30' :
                          'bg-blue-500/10 border-blue-500/30'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <div className={`text-xs font-bold uppercase ${
                            issue.severity === 'CRITICAL' ? 'text-red-400' :
                            issue.severity === 'WARNING' ? 'text-yellow-400' :
                            'text-blue-400'
                          }`}>
                            {issue.severity}
                          </div>
                          <div className="flex-1">
                            <div className="text-xs text-zinc-300 mb-1">{issue.issue}</div>
                            {issue.recommendation && (
                              <div className="text-[10px] text-zinc-500 italic">→ {issue.recommendation}</div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Conclusions */}
              <div className="bg-gradient-to-br from-[#0d0d0d] to-[#151515] rounded-xl p-4 border border-white/10">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1 h-5 bg-cyan-500 rounded-full"></div>
                  <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Analysis Conclusions</h3>
                </div>
                <div className="space-y-2 text-xs text-zinc-300 leading-relaxed">
                  <p>
                    • Detected <span className="text-cyan-400 font-semibold">{componentStats.total} components</span> across {Object.keys(componentStats.bySubsystem).length} HVAC subsystems
                  </p>
                  <p>
                    • Average detection confidence of <span className="text-emerald-400 font-semibold">{(componentStats.avgConfidence * 100).toFixed(1)}%</span> indicates {getConfidenceQualityLabel(componentStats.avgConfidence)} model certainty
                  </p>
                  {componentStats.isaCompliant > 0 && (
                    <p>
                      • <span className="text-amber-400 font-semibold">{componentStats.isaCompliant} components</span> conform to ISA standards for instrumentation naming
                    </p>
                  )}
                  {validationIssues.length > 0 && (
                    <p className="text-yellow-400">
                      • <span className="font-semibold">{validationIssues.length} validation issues</span> require attention for compliance
                    </p>
                  )}
                  <p className="pt-2 text-zinc-400 text-[10px]">
                    This automated analysis provides comprehensive insights into the document's HVAC system components, 
                    their classifications, and conformance to industry standards. Review individual components for detailed specifications.
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  const renderPricingTab = () => (
    <div className="flex flex-col h-full">
       <div className="px-4 py-3 bg-gradient-to-br from-emerald-900/10 to-transparent border-b border-emerald-500/10 mb-2">
          <div className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-1">Estimated Project Cost</div>
          <div className="text-2xl font-bold text-white tracking-tight">
            ${totalProjectCost.toLocaleString()}
          </div>
       </div>

       <div className="flex-1 overflow-y-auto scrollbar-thin p-3 space-y-2">
          {pricingData.map((item, idx) => (
             <div key={idx} className="bg-[#252526] border border-white/5 rounded-lg p-3 flex justify-between items-center group hover:border-emerald-500/30 transition-colors">
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                      <DollarSign size={14} />
                   </div>
                   <div>
                      <div className="text-xs font-semibold text-zinc-200">{item.name}</div>
                      <div className="text-[10px] text-zinc-500">Qty: {item.count} × ${item.unitPrice.toLocaleString()}</div>
                   </div>
                </div>
                <div className="text-sm font-medium text-emerald-400 font-mono">
                   ${item.totalPrice.toLocaleString()}
                </div>
             </div>
          ))}

          {pricingData.length === 0 && (
             <div className="text-center text-zinc-500 text-xs py-8">
                Run analysis to generate pricing estimate.
             </div>
          )}
       </div>
    </div>
  );

  const renderQuoteTab = () => (
    <div className="flex flex-col h-full p-4 space-y-6">
       <div className="space-y-4">
          <div>
              <label className="text-[10px] font-bold text-zinc-500 uppercase block mb-1.5">Client Reference</label>
              <input type="text" placeholder="Acme Corp - Tower A" className="w-full bg-[#252526] border border-white/5 rounded px-3 py-2 text-xs text-zinc-200 focus:border-cyan-500/50 focus:outline-none" />
          </div>
          <div>
              <label className="text-[10px] font-bold text-zinc-500 uppercase block mb-1.5">Project ID</label>
              <input type="text" value="PRJ-2024-8821" readOnly className="w-full bg-[#252526] border border-white/5 rounded px-3 py-2 text-xs text-zinc-500 focus:outline-none cursor-not-allowed" />
          </div>
       </div>

   <div className="bg-cyan-500/5 border border-cyan-500/20 rounded-xl p-4 space-y-3">
          <div className="flex justify-between items-center pb-3 border-b border-cyan-500/10">
              <span className="text-xs text-zinc-300">Material Cost</span>
              <span className="text-xs font-mono text-zinc-200">${totalProjectCost.toLocaleString()}</span>
          </div>
        <div className="flex justify-between items-center pb-3 border-b border-cyan-500/10">
              <span className="text-xs text-zinc-300">Labor Estimate (25%)</span>
              <span className="text-xs font-mono text-zinc-200">${(totalProjectCost * 0.25).toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center pt-1">
              <span className="text-sm font-bold text-cyan-400">Total Quote</span>
              <span className="text-sm font-bold font-mono text-white">${(totalProjectCost * 1.25).toLocaleString()}</span>
          </div>
       </div>

   <button className="w-full bg-cyan-600 hover:bg-cyan-500 text-white py-2.5 rounded-lg text-xs font-bold shadow-lg shadow-cyan-900/20 flex items-center justify-center gap-2 transition-all">
          <Send size={14} />
          Generate Official PDF
       </button>
    </div>
  );

  return (
    <div className="w-full h-full flex flex-col bg-[#1e1e1e] border-l border-white/10 select-none">
      
      {/* Header / Tabs */}
      <div className="h-12 border-b border-white/5 flex items-center px-1" role="tablist" aria-label="Inspector panel tabs">
         <button 
            onClick={() => setActiveTab('COMPONENTS')}
            role="tab"
            aria-selected={activeTab === 'COMPONENTS'}
            aria-controls="components-panel"
            id="components-tab"
            className={`flex-1 h-full flex items-center justify-center gap-1 text-[10px] font-bold uppercase tracking-wider transition-colors border-b-2 ${activeTab === 'COMPONENTS' ? 'border-cyan-500 text-cyan-400' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}
         >
            <Layers size={11} /> <span className="hidden sm:inline">Components</span>
         </button>
         <button 
            onClick={() => setActiveTab('ANALYSIS')}
            role="tab"
            aria-selected={activeTab === 'ANALYSIS'}
            aria-controls="analysis-panel"
            id="analysis-tab"
            className={`flex-1 h-full flex items-center justify-center gap-1 text-[10px] font-bold uppercase tracking-wider transition-colors border-b-2 ${activeTab === 'ANALYSIS' ? 'border-purple-500 text-purple-400' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}
         >
            <ClipboardList size={11} /> <span className="hidden sm:inline">Analysis</span>
         </button>
         <button 
            onClick={() => setActiveTab('PRICING')}
            role="tab"
            aria-selected={activeTab === 'PRICING'}
            aria-controls="pricing-panel"
            id="pricing-tab"
            className={`flex-1 h-full flex items-center justify-center gap-1 text-[10px] font-bold uppercase tracking-wider transition-colors border-b-2 ${activeTab === 'PRICING' ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}
         >
            <DollarSign size={11} /> <span className="hidden sm:inline">Pricing</span>
         </button>
         <button 
            onClick={() => setActiveTab('QUOTE')}
            role="tab"
            aria-selected={activeTab === 'QUOTE'}
            aria-controls="quote-panel"
            id="quote-tab"
            className={`flex-1 h-full flex items-center justify-center gap-1 text-[10px] font-bold uppercase tracking-wider transition-colors border-b-2 ${activeTab === 'QUOTE' ? 'border-cyan-500 text-cyan-400' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}
         >
            <FileText size={11} /> <span className="hidden sm:inline">Quote</span>
         </button>
      </div>

         <div 
            className="flex-1 overflow-hidden relative bg-[#121212]"
            role="tabpanel"
            id={`${activeTab.toLowerCase()}-panel`}
            aria-labelledby={`${activeTab.toLowerCase()}-tab`}
         >
             {activeTab === 'COMPONENTS' && renderComponentsTab()}
             {activeTab === 'ANALYSIS' && renderAnalysisTab()}
             {activeTab === 'PRICING' && renderPricingTab()}
             {activeTab === 'QUOTE' && renderQuoteTab()}
         </div>

      {/* Footer Info */}
      <div className="h-8 border-t border-white/5 bg-[#1e1e1e] flex items-center justify-between px-3 text-[10px] text-zinc-500">
         <div className="flex items-center gap-1.5">
            <div className={`w-1.5 h-1.5 rounded-full ${inventory.length > 0 ? 'bg-emerald-500' : 'bg-zinc-600'}`}></div>
            <span>{inventory.length} Assets Detected</span>
         </div>
         <span className="uppercase">{String(config.ai.provider).toUpperCase()} ({config.ai.model})</span>
      </div>
    </div>
  );
};

export default InspectorPanel;
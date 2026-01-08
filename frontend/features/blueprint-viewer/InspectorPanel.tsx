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
   ClipboardList,
   BarChart3,
   PieChart,
   TrendingUp
} from 'lucide-react';
import { BarChart, Bar, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts';
import { ValidationIssue, DetectedComponent } from '@/features/document-analysis/types';
import { config } from '@/app/config';
import { getParentCategory, formatCategoryName } from '@/lib/utils/component-categorization';

interface InspectorPanelProps {
  analysis: string;
  executiveSummary: string;
  inventory: any[];
   detectedBoxes: DetectedComponent[];
  validationIssues: ValidationIssue[];
  selectedBoxId: string | null;
  onSelectBox: (id: string | null) => void;
  finalAnalysisReport?: any; // Optional final analysis report
}

type Tab = 'COMPONENTS' | 'ANALYSIS' | 'PRICING' | 'QUOTE';

// Configuration constants for component visualization
const MAX_CHART_TYPES = 8; // Maximum number of component types to display in chart
const CHART_COLORS = ['#2563eb', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#6366f1', '#14b8a6'];

// Constant for underscore replacement to avoid regex recompilation
const UNDERSCORE_REGEX = /_/g;

/**
 * Hierarchical component grouping structure
 * Groups components by parent category, then by specific type for subcategorization
 */
interface HierarchicalGroup {
  name: string;
  displayName: string;
  totalCount: number;
  subcategories: Record<string, DetectedComponent[]>;
}

/**
 * Helper function to group components hierarchically
 * Creates parent categories (instruments, valves, equipment) with subcategories
 */
const groupComponentsHierarchically = (components: DetectedComponent[]): Record<string, HierarchicalGroup> => {
  const hierarchical: Record<string, HierarchicalGroup> = {};
  
  components.forEach(comp => {
    const type = comp.meta?.equipment_type || comp.type || 'other';
    const parentCategory = comp.meta?.parent_category || getParentCategory(type);
    
    // Initialize parent category if it doesn't exist
    if (!hierarchical[parentCategory]) {
      hierarchical[parentCategory] = {
        name: parentCategory,
        displayName: formatCategoryName(parentCategory),
        totalCount: 0,
        subcategories: {}
      };
    }
    
    // Initialize subcategory if it doesn't exist
    if (!hierarchical[parentCategory].subcategories[type]) {
      hierarchical[parentCategory].subcategories[type] = [];
    }
    
    // Add component to subcategory
    hierarchical[parentCategory].subcategories[type].push(comp);
    hierarchical[parentCategory].totalCount++;
  });
  
  return hierarchical;
};

// Helper function to group components by parent category for organized display
// Groups all instruments together, all valves together, all equipment together, etc.
const groupComponentsByType = (components: DetectedComponent[]): Record<string, DetectedComponent[]> => {
  const groups: Record<string, DetectedComponent[]> = {};
  components.forEach(comp => {
    const type = comp.meta?.equipment_type || comp.type || 'other';
    const parentCategory = comp.meta?.parent_category || getParentCategory(type);
    const displayName = formatCategoryName(parentCategory);
    if (!groups[displayName]) groups[displayName] = [];
    groups[displayName].push(comp);
  });
  return groups;
};

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
   onSelectBox,
   finalAnalysisReport
}) => {
  const [activeTab, setActiveTab] = useState<Tab>('COMPONENTS');
  const [searchQuery, setSearchQuery] = useState('');
      const [copied, setCopied] = useState(false);
         const [copiedReport, setCopiedReport] = useState(false);
      // Streaming log state — starts with the prop snapshot and then appends live events
      const [streamingLog, setStreamingLog] = useState<string>(analysis || '');
      
      // Ref for scrolling to selected component
      const selectedRowRef = useRef<HTMLDivElement>(null);
      
      // State for expanded component details
      const [expandedComponentId, setExpandedComponentId] = useState<string | null>(null);
      
      // State for expanded categories (collapsed by default for cleaner view)
      const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

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
      
      // Listen for tab switch event from toast click
      useEffect(() => {
         const handler = () => {
            setActiveTab('ANALYSIS');
         };
         window.addEventListener('switch-to-analysis-tab', handler);
         return () => window.removeEventListener('switch-to-analysis-tab', handler);
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
   
   // Toggle category expansion
   const toggleCategory = (categoryName: string) => {
      setExpandedCategories(prev => {
         const newSet = new Set(prev);
         if (newSet.has(categoryName)) {
            newSet.delete(categoryName);
         } else {
            newSet.add(categoryName);
         }
         return newSet;
      });
   };

  // Derived state for filtered components
  const filteredBoxes = useMemo(() => {
    if (!searchQuery) return detectedBoxes;
    return detectedBoxes.filter(box => 
      box.label.toLowerCase().includes(searchQuery.toLowerCase()) || 
      box.meta?.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [detectedBoxes, searchQuery]);
  
  // Group filtered components by type for categorized display
  const filteredComponentsByType = useMemo<Record<string, DetectedComponent[]>>(() => {
    return groupComponentsByType(filteredBoxes);
  }, [filteredBoxes]);

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
   return { className: 'text-[#2563eb] font-semibold', prefix: '▶ ' };
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

   /**
    * Build professional formatted report in Markdown for copying
    * Generates clean Markdown that can be styled, formatted, and designed
    * Uses standard Markdown syntax for headers, emphasis, and lists
    */
   const buildReportText = (report: any) => {
      if (!report) return '';
      
      const sections: string[] = [];
      
      // ============================================================================
      // REPORT HEADER (Markdown H1)
      // ============================================================================
      if (report.report_title) {
         sections.push(`# ${report.report_title}`);
      } else {
         sections.push('# HVAC System Analysis Report');
      }
      
      sections.push('');
      
      // Report metadata
      const today = new Date();
      const dateStr = today.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
      
      sections.push(`**Report Date:** ${dateStr}  `);
      sections.push(`**Document ID:** ${Date.now().toString(36).toUpperCase()}`);
      sections.push('');
      sections.push('---');
      sections.push('');
      
      // ============================================================================
      // EXECUTIVE SUMMARY (H2)
      // ============================================================================
      if (report.executive_summary) {
         sections.push('## Executive Summary');
         sections.push('');
         sections.push(report.executive_summary);
         sections.push('');
      }
      
      // ============================================================================
      // DESIGN OVERVIEW (H2)
      // ============================================================================
      if (report.design_overview) {
         sections.push('## Design Overview');
         sections.push('');
         sections.push(report.design_overview);
         sections.push('');
      }
      
      // ============================================================================
      // SYSTEM WORKFLOW (H2)
      // ============================================================================
      if (report.system_workflow_narrative) {
         sections.push('## System Workflow');
         sections.push('');
         sections.push(report.system_workflow_narrative);
         sections.push('');
      }
      
      // ============================================================================
      // VENTILATION DESIGN (H2)
      // ============================================================================
      if (report.ventilation_design) {
         sections.push('## Ventilation Design');
         sections.push('');
         sections.push(report.ventilation_design);
         sections.push('');
      }
      
      // ============================================================================
      // CONTROL LOGIC ANALYSIS (H2)
      // ============================================================================
      if (report.control_logic_analysis) {
         sections.push('## Control Logic Analysis');
         sections.push('');
         sections.push(report.control_logic_analysis);
         sections.push('');
      }
      
      // ============================================================================
      // EQUIPMENT SPECIFICATIONS (H2)
      // ============================================================================
      if (report.equipment_specifications) {
         sections.push('## Equipment Specifications');
         sections.push('');
         sections.push(report.equipment_specifications);
         sections.push('');
      } else if (report.specifications_and_details) {
         // Legacy field support
         sections.push('## Technical Specifications');
         sections.push('');
         sections.push(report.specifications_and_details);
         sections.push('');
      }
      
      // ============================================================================
      // HEATING & COOLING LOADS (H2)
      // ============================================================================
      if (report.heating_cooling_loads) {
         sections.push('## Heating & Cooling Loads');
         sections.push('');
         sections.push(report.heating_cooling_loads);
         sections.push('');
      }
      
      // ============================================================================
      // CRITICAL EQUIPMENT (H2 with Markdown Table)
      // ============================================================================
      if (report.critical_equipment && Array.isArray(report.critical_equipment) && report.critical_equipment.length > 0) {
         sections.push('## Critical Equipment');
         sections.push('');
         
         // Create a markdown table with better visual organization
         sections.push('| # | Equipment Tag | Role & Description |');
         sections.push('|---|---------------|-------------------|');
         
         report.critical_equipment.forEach((equip: any, idx: number) => {
            const tag = equip.tag || equip.name || 'N/A';
            const role = equip.role || 'No description';
            
            sections.push(`| ${idx + 1} | **${tag}** | ${role} |`);
         });
         
         sections.push('');
         sections.push(`*Total Equipment: ${report.critical_equipment.length} items*`);
         sections.push('');
      }
      
      // ============================================================================
      // STANDARDS & COMPLIANCE (H2)
      // ============================================================================
      if (report.standards_compliance) {
         sections.push('## Standards & Compliance');
         sections.push('');
         sections.push(report.standards_compliance);
         sections.push('');
      }
      
      // ============================================================================
      // ENGINEERING OBSERVATIONS (H2)
      // ============================================================================
      if (report.engineering_observations) {
         sections.push('## Engineering Observations');
         sections.push('');
         sections.push(report.engineering_observations);
         sections.push('');
      }
      
      // ============================================================================
      // REPORT FOOTER (Markdown)
      // ============================================================================
      sections.push('---');
      sections.push('');
      sections.push('*This report was generated by automated HVAC analysis software. All technical interpretations should be verified by a licensed professional engineer.*');
      
      // Fallback to raw data if no sections were added (only header + footer)
      if (sections.length <= 10 && report._raw) {
         if (typeof report._raw === 'string') return report._raw;
         return JSON.stringify(report._raw, null, 2);
      }
      
      return sections.join('\n');
   };

   const copyFinalReport = async () => {
      try {
         const toCopy = buildReportText(finalAnalysisReport) || '';
         if (!toCopy) return;
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
         setCopiedReport(true);
         setTimeout(() => setCopiedReport(false), 1500);
      } catch (e) {
         console.warn('Copy report failed', e);
      }
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
  const componentsByType = useMemo<Record<string, DetectedComponent[]>>(() => {
    return groupComponentsByType(detectedBoxes);
  }, [detectedBoxes]);

  const componentStats = useMemo<{
    total: number;
    bySubsystem: Record<string, number>;
    avgConfidence: number;
    excellentQuality: number;
    isaCompliant: number;
  }>(() => {
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

  const renderComponentsTab = () => {
    // Prepare chart data for subsystems
    const subsystemChartData = Object.entries(componentStats.bySubsystem).map(([name, count]) => ({
      name: name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      count: count as number,
      percentage: parseFloat((((count as number) / componentStats.total) * 100).toFixed(1))
    })).sort((a, b) => b.count - a.count);
    
    // Prepare chart data for component types (top types only for readability)
    const typeChartData = Object.entries(componentsByType).map(([name, components]: [string, DetectedComponent[]]) => ({
      name: name.replace(/_/g, ' '),
      count: components.length,
      percentage: parseFloat(((components.length / componentStats.total) * 100).toFixed(1))
    })).sort((a, b) => b.count - a.count).slice(0, MAX_CHART_TYPES);
    
    return (
      <div className="flex flex-col h-full">
         {/* Scrollable content area */}
         <div className="flex-1 overflow-y-auto scrollbar-thin px-3 space-y-3">
            {/* Statistics Dashboard - Only show when components exist */}
            {detectedBoxes.length > 0 && (
               <div className="space-y-3 pt-1">
                  {/* Component Types Distribution Bar Chart */}
                  {typeChartData.length > 0 && (
                     <div className="bg-[#1a1a1a] rounded-lg border border-white/5 p-3">
                        <div className="flex items-center gap-2 mb-3">
                           <BarChart3 size={14} className="text-[#2563eb]" />
                           <h4 className="text-[10px] font-bold text-[#2563eb] uppercase tracking-wider">Component Types Distribution</h4>
                        </div>
                        <ResponsiveContainer width="100%" height={180}>
                           <BarChart data={typeChartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
                              <XAxis 
                                 dataKey="name" 
                                 tick={{ fill: '#a1a1aa', fontSize: 9 }}
                                 angle={-45}
                                 textAnchor="end"
                                 height={60}
                              />
                              <YAxis tick={{ fill: '#a1a1aa', fontSize: 10 }} />
                              <Tooltip 
                                 contentStyle={{ 
                                    backgroundColor: '#1a1a1a', 
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '8px',
                                    fontSize: '11px'
                                 }}
                                 labelStyle={{ color: '#e4e4e7', fontWeight: 'bold' }}
                                 itemStyle={{ color: '#2563eb' }}
                              />
                              <Bar dataKey="count" fill="#2563eb" radius={[4, 4, 0, 0]} />
                           </BarChart>
                        </ResponsiveContainer>
                     </div>
                  )}
                  
                  {/* HVAC Subsystems Breakdown */}
                  {subsystemChartData.length > 0 && (
                     <div className="bg-[#1a1a1a] rounded-lg border border-white/5 p-3">
                        <div className="flex items-center gap-2 mb-3">
                           <PieChart size={14} className="text-purple-400" />
                           <h4 className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">HVAC Subsystems</h4>
                        </div>
                        <div className="space-y-2">
                           {subsystemChartData.map((item, idx) => (
                              <div key={item.name} className="flex items-center gap-2">
                                 <div 
                                    className="w-3 h-3 rounded-sm shrink-0" 
                                    style={{ backgroundColor: CHART_COLORS[idx % CHART_COLORS.length] }}
                                 />
                                 <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-2">
                                       <span className="text-[10px] text-zinc-300 truncate">{item.name}</span>
                                       <span className="text-[10px] text-zinc-500 font-mono">{item.count}</span>
                                    </div>
                                    <div className="w-full bg-white/5 rounded-full h-1.5 mt-1">
                                       <div 
                                          className="h-1.5 rounded-full transition-all"
                                          style={{ 
                                             width: `${item.percentage}%`,
                                             backgroundColor: CHART_COLORS[idx % CHART_COLORS.length]
                                          }}
                                       />
                                    </div>
                                 </div>
                                 <span className="text-[9px] text-zinc-500 font-bold w-10 text-right">{item.percentage}%</span>
                              </div>
                           ))}
                        </div>
                     </div>
                  )}
               </div>
            )}
            
            {/* Search */}
            <div className="px-0 pb-0">
               <div className="relative">
                     <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-zinc-500" size={12} />
                     <input 
                           type="text" 
                           value={searchQuery}
                           onChange={(e) => setSearchQuery(e.target.value)}
                           placeholder="Filter detected assets..." 
                           className="w-full bg-[#252526] border border-white/5 rounded h-8 pl-8 pr-2 text-xs text-zinc-300 focus:outline-none focus:border-[#2563eb]/50 transition-colors placeholder:text-zinc-600"
                     />
               </div>
            </div>

            {/* Components List - Organized by Category */}
            <div className="space-y-2">
               {Object.keys(filteredComponentsByType).length > 0 ? (
                  Object.entries(filteredComponentsByType)
                     .sort(([, aComps], [, bComps]) => (bComps as DetectedComponent[]).length - (aComps as DetectedComponent[]).length) // Sort by count descending
                     .map(([categoryName, categoryComponents]: [string, DetectedComponent[]]) => {
                        const isCategoryExpanded = expandedCategories.has(categoryName);
                        const categoryCount = categoryComponents.length;
                        
                        return (
                           <div key={categoryName} className="bg-[#1e1e1e] rounded-lg border border-white/5 overflow-hidden">
                              {/* Category Header */}
                              <div 
                                 onClick={() => toggleCategory(categoryName)}
                                 className="flex items-center justify-between p-3 cursor-pointer bg-gradient-to-r from-white/5 to-transparent hover:from-white/10 transition-colors group"
                              >
                                 <div className="flex items-center gap-3">
                                    {/* Category Expand/Collapse Icon */}
                                    <div className="shrink-0">
                                       {isCategoryExpanded ? (
                                          <ChevronDown size={16} className="text-[#2563eb]" />
                                       ) : (
                                          <ChevronRight size={16} className="text-zinc-400 group-hover:text-[#2563eb] transition-colors" />
                                       )}
                                    </div>
                                    
                                    {/* Category Icon */}
                                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#2563eb]/20 to-blue-500/20 border border-[#2563eb]/30 flex items-center justify-center">
                                       <Layers size={14} className="text-[#2563eb]" />
                                    </div>
                                    
                                    {/* Category Name and Count */}
                                    <div>
                                       <div className="text-sm font-bold text-zinc-200 group-hover:text-white transition-colors">
                                          {categoryName.replace(/_/g, ' ')}
                                       </div>
                                       <div className="text-[10px] text-zinc-500">
                                          {categoryCount} {categoryCount === 1 ? 'component' : 'components'}
                                       </div>
                                    </div>
                                 </div>
                                 
                                 {/* Category Count Badge */}
                                 <div className="px-2.5 py-1 rounded-full bg-[#2563eb]/10 border border-[#2563eb]/30">
                                    <span className="text-xs font-bold text-[#2563eb] font-mono">{categoryCount}</span>
                                 </div>
                              </div>
                              
                              {/* Category Components (collapsible) */}
                              {isCategoryExpanded && (
                                 <div className="border-t border-white/5">
                                    {categoryComponents.map((box) => {
                                       const isSelected = selectedBoxId === box.id;
                                       const isExpanded = expandedComponentId === box.id;
                                       return (
                                          <div 
                                             key={box.id}
                                             ref={isSelected ? selectedRowRef : null}
                                             className={`border-b border-white/5 last:border-0 transition-all ${
                                                isSelected ? 'bg-[#2563eb]/10' : 'hover:bg-white/5'
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
                                                className="flex items-center gap-3 p-3 pl-14 cursor-pointer group"
                                             >
                                                {/* Component Expand/Collapse Icon */}
                                                <div className="shrink-0">
                                                   {isExpanded ? (
                                                      <ChevronDown size={12} className="text-[#2563eb]" />
                                                   ) : (
                                                      <ChevronRight size={12} className={isSelected ? 'text-[#2563eb]' : 'text-zinc-500 group-hover:text-zinc-300'} />
                                                   )}
                                                </div>
                                        
                              <div className={`w-7 h-7 rounded flex items-center justify-center shrink-0 ${
                                 isSelected ? 'bg-[#2563eb]/20 text-[#2563eb]' : 'bg-[#252526] text-zinc-500 group-hover:text-zinc-300'
                              }`}>
                                 <Box size={12} />
                              </div>
                              <div className="flex-1 min-w-0">
                                 <div className={`text-xs font-semibold truncate ${isSelected ? 'text-[#2563eb]' : 'text-zinc-300'}`}>
                                  {box.label}
                                 </div>
                                                     <div className="text-[10px] text-zinc-500 truncate">
                                                        {box.meta?.description || 'No description'}
                                                     </div>
                                                </div>
                              {isSelected && (
                                 <div className="w-1.5 h-1.5 rounded-full bg-[#2563eb]"></div>
                              )}
                                             </div>

                                             {/* Expanded Details */}
                                             {isExpanded && (
                              <div className="px-2 pb-2 pt-0 space-y-3 animate-in slide-in-from-top-2 duration-200">
                                 {/* Component Specifications */}
                                 <div className="bg-[#1a1a1a] rounded-lg p-3 border border-white/5">
                                    <div className="text-[10px] font-bold text-[#2563eb] uppercase tracking-wider mb-3 flex items-center gap-2">
                                       <div className="w-1 h-3 bg-[#2563eb] rounded-full"></div>
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
                                                   box.meta.detection_quality === 'good' ? 'text-[#2563eb]' :
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

                      {/* Additional Metadata removed per UI request */}
                                             </div>
                                          )}
                                       </div>
                                    );
                                 })}
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
  };

  const renderAnalysisTab = () => {
    const hasData = detectedBoxes.length > 0;
    const hasFinalReport = finalAnalysisReport && Object.keys(finalAnalysisReport).length > 0;

    return (
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto scrollbar-thin space-y-4">
          {!hasData ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <ClipboardList size={48} className="text-zinc-600 mb-4" />
              <div className="text-sm font-semibold text-zinc-400 mb-2">No Analysis Available</div>
              <div className="text-xs text-zinc-500">Run document analysis to generate a comprehensive report</div>
            </div>
               ) : hasFinalReport ? (
                  // NARRATIVE-FOCUSED FINAL ANALYSIS REPORT (with copy + scroll)
                  <div className="p-4 space-y-4">
                     <div className="flex items-center justify-end gap-2">
                        <button onClick={copyFinalReport} aria-label="Copy final report" title="Copy final report" className="text-zinc-400 hover:text-white p-2 rounded-md transition-colors">
                           <Copy size={14} />
                        </button>
                        {copiedReport && (
                           <div className="text-[10px] bg-emerald-600/95 text-white px-2 py-0.5 rounded-full">Report copied</div>
                        )}
                     </div>

                     <div className="space-y-4">
                        {/* Report Title */}
                           {finalAnalysisReport.report_title && (
                           <div className="bg-gradient-to-br from-[#2563eb]/15 to-blue-500/15 border border-[#2563eb]/30 rounded-xl p-4">
                              <h2 className="text-lg font-bold text-[#2563eb]">{finalAnalysisReport.report_title}</h2>
                           </div>
                        )}

                        <div className="space-y-4 px-1">
                           {/* Executive Summary */}
                           {finalAnalysisReport.executive_summary && (
                              <div>
                                 <div className="flex items-center gap-2 mb-3">
                                    <div className="w-1 h-6 bg-[#2563eb] rounded-full"></div>
                                    <h3 className="text-sm font-bold text-[#2563eb] uppercase tracking-wide">Executive Summary</h3>
                                 </div>
                                 <div className="bg-[#1a1a1a] rounded-lg p-4 border border-white/5">
                                    <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-line">
                                       {finalAnalysisReport.executive_summary}
                                    </p>
                                 </div>
                              </div>
                           )}

                           {/* Design Overview */}
                           {finalAnalysisReport.design_overview && (
                              <div>
                                 <div className="flex items-center gap-2 mb-3">
                                    <div className="w-1 h-6 bg-indigo-500 rounded-full"></div>
                                    <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wide">Design Overview</h3>
                                 </div>
                                 <div className="bg-[#1a1a1a] rounded-lg p-4 border border-white/5">
                                    <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-line">
                                       {finalAnalysisReport.design_overview}
                                    </p>
                                 </div>
                              </div>
                           )}

                           {/* System Workflow Narrative */}
                           {finalAnalysisReport.system_workflow_narrative && (
                              <div>
                                 <div className="flex items-center gap-2 mb-3">
                                    <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                                    <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wide">System Workflow</h3>
                                 </div>
                                 <div className="bg-[#1a1a1a] rounded-lg p-4 border border-white/5">
                                    <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-line">
                                       {finalAnalysisReport.system_workflow_narrative}
                                    </p>
                                 </div>
                              </div>
                           )}

                           {/* Ventilation Design */}
                           {finalAnalysisReport.ventilation_design && (
                              <div>
                                 <div className="flex items-center gap-2 mb-3">
                                    <div className="w-1 h-6 bg-sky-500 rounded-full"></div>
                                    <h3 className="text-sm font-bold text-sky-400 uppercase tracking-wide">Ventilation Design</h3>
                                 </div>
                                 <div className="bg-[#1a1a1a] rounded-lg p-4 border border-white/5">
                                    <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-line">
                                       {finalAnalysisReport.ventilation_design}
                                    </p>
                                 </div>
                              </div>
                           )}

                           {/* Control Logic Analysis */}
                           {finalAnalysisReport.control_logic_analysis && (
                              <div>
                                 <div className="flex items-center gap-2 mb-3">
                                    <div className="w-1 h-6 bg-purple-500 rounded-full"></div>
                                    <h3 className="text-sm font-bold text-purple-400 uppercase tracking-wide">Control Logic</h3>
                                 </div>
                                 <div className="bg-[#1a1a1a] rounded-lg p-4 border border-white/5">
                                    <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-line">
                                       {finalAnalysisReport.control_logic_analysis}
                                    </p>
                                 </div>
                              </div>
                           )}

                           {/* Equipment Specifications */}
                           {finalAnalysisReport.equipment_specifications && (
                              <div>
                                 <div className="flex items-center gap-2 mb-3">
                                    <div className="w-1 h-6 bg-emerald-500 rounded-full"></div>
                                    <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wide">Equipment Selection & Specifications</h3>
                                 </div>
                                 <div className="bg-[#1a1a1a] rounded-lg p-4 border border-white/5">
                                    <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-line">
                                       {finalAnalysisReport.equipment_specifications}
                                    </p>
                                 </div>
                              </div>
                           )}

                           {/* Heating & Cooling Loads */}
                           {finalAnalysisReport.heating_cooling_loads && (
                              <div>
                                 <div className="flex items-center gap-2 mb-3">
                                    <div className="w-1 h-6 bg-orange-500 rounded-full"></div>
                                    <h3 className="text-sm font-bold text-orange-400 uppercase tracking-wide">Heating & Cooling Loads</h3>
                                 </div>
                                 <div className="bg-[#1a1a1a] rounded-lg p-4 border border-white/5">
                                    <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-line">
                                       {finalAnalysisReport.heating_cooling_loads}
                                    </p>
                                 </div>
                              </div>
                           )}

                           {/* Standards Compliance */}
                           {finalAnalysisReport.standards_compliance && (
                              <div>
                                 <div className="flex items-center gap-2 mb-3">
                                    <div className="w-1 h-6 bg-green-500 rounded-full"></div>
                                    <h3 className="text-sm font-bold text-green-400 uppercase tracking-wide">Standards Compliance</h3>
                                 </div>
                                 <div className="bg-[#1a1a1a] rounded-lg p-4 border border-white/5">
                                    <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-line">
                                       {finalAnalysisReport.standards_compliance}
                                    </p>
                                 </div>
                              </div>
                           )}

                           {/* Specifications and Details (Legacy - for backwards compatibility) */}
                           {finalAnalysisReport.specifications_and_details && !finalAnalysisReport.equipment_specifications && (
                              <div>
                                 <div className="flex items-center gap-2 mb-3">
                                    <div className="w-1 h-6 bg-emerald-500 rounded-full"></div>
                                    <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wide">Technical Specifications</h3>
                                 </div>
                                 <div className="bg-[#1a1a1a] rounded-lg p-4 border border-white/5">
                                    <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-line">
                                       {finalAnalysisReport.specifications_and_details}
                                    </p>
                                 </div>
                              </div>
                           )}

                           {/* Critical Equipment (Optional) */}
                           {finalAnalysisReport.critical_equipment && finalAnalysisReport.critical_equipment.length > 0 && (
                              <div>
                                 <div className="flex items-center gap-2 mb-3">
                                    <div className="w-1 h-6 bg-amber-500 rounded-full"></div>
                                    <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wide">Critical Equipment</h3>
                                 </div>
                                 <div className="bg-[#1a1a1a] rounded-lg border border-white/5 overflow-hidden">
                                    {/* Table Header */}
                                    <div className="grid grid-cols-12 gap-3 px-4 py-3 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-b border-amber-500/20">
                                       <div className="col-span-1 text-[10px] font-bold text-amber-400 uppercase tracking-wider">#</div>
                                       <div className="col-span-3 text-[10px] font-bold text-amber-400 uppercase tracking-wider">Equipment Tag</div>
                                       <div className="col-span-8 text-[10px] font-bold text-amber-400 uppercase tracking-wider">Role & Description</div>
                                    </div>
                                    
                                    {/* Table Body */}
                                    <div className="divide-y divide-white/5">
                                       {finalAnalysisReport.critical_equipment.map((equip: any, idx: number) => (
                                          <div key={idx} className="grid grid-cols-12 gap-3 px-4 py-3 hover:bg-white/5 transition-colors group">
                                             {/* Index Number with Status Indicator */}
                                             <div className="col-span-1 flex items-center">
                                                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 flex items-center justify-center">
                                                   <span className="text-[10px] font-bold text-amber-300">{idx + 1}</span>
                                                </div>
                                             </div>
                                             
                                             {/* Equipment Tag with Icon */}
                                             <div className="col-span-3 flex items-center gap-2">
                                                <div className="w-7 h-7 rounded bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
                                                   <Box size={12} className="text-amber-400" />
                                                </div>
                                                <div className="min-w-0">
                                                   <div className="text-xs font-bold text-amber-300 font-mono truncate group-hover:text-amber-200 transition-colors">
                                                      {equip.tag}
                                                   </div>
                                                </div>
                                             </div>
                                             
                                             {/* Role Description */}
                                             <div className="col-span-8 flex items-center">
                                                <p className="text-xs text-zinc-300 leading-relaxed group-hover:text-zinc-200 transition-colors">
                                                   {equip.role}
                                                </p>
                                             </div>
                                          </div>
                                       ))}
                                    </div>
                                    
                                    {/* Table Footer with Summary */}
                                    <div className="px-4 py-2 bg-gradient-to-r from-amber-500/5 to-orange-500/5 border-t border-amber-500/20">
                                       <div className="flex items-center justify-between">
                                          <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Total Equipment</span>
                                          <span className="text-xs font-bold text-amber-400 font-mono">{finalAnalysisReport.critical_equipment.length} items</span>
                                       </div>
                                    </div>
                                 </div>
                              </div>
                           )}

                           {/* Engineering Observations (Optional) */}
                           {finalAnalysisReport.engineering_observations && (
                              <div>
                                 <div className="flex items-center gap-2 mb-3">
                                    <div className="w-1 h-6 bg-teal-500 rounded-full"></div>
                                    <h3 className="text-sm font-bold text-teal-400 uppercase tracking-wide">Engineering Observations</h3>
                                 </div>
                                 <div className="bg-[#1a1a1a] rounded-lg p-4 border border-white/5">
                                    <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-line">
                                       {finalAnalysisReport.engineering_observations}
                                    </p>
                                 </div>
                              </div>
                           )}
                        </div>
                     </div>
                  </div>
          ) : (
            // LOADING STATE - Show placeholder while background analysis is running
            <div className="p-4 space-y-4">
                  <div className="bg-gradient-to-br from-[#2563eb]/10 to-blue-500/10 border border-[#2563eb]/20 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-3">
                           <div className="w-1 h-6 bg-[#2563eb] rounded-full"></div>
                           <h3 className="text-sm font-bold text-[#2563eb] uppercase tracking-wide">Analysis In Progress</h3>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Visual analysis complete. Comprehensive engineering narrative is being generated in the background...
                </p>
              </div>

              <div className="bg-[#1a1a1a] rounded-lg p-4 border border-white/5">
                <div className="flex items-center gap-3 text-zinc-400 text-xs">
                           <div className="w-4 h-4 border-2 border-[#2563eb] border-t-transparent rounded-full animate-spin"></div>
                  <span>Analyzing system topology and generating narrative report...</span>
                </div>
              </div>
            </div>
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
              <input type="text" placeholder="Acme Corp - Tower A" className="w-full bg-[#252526] border border-white/5 rounded px-3 py-2 text-xs text-zinc-200 focus:border-[#2563eb]/50 focus:outline-none" />
          </div>
          <div>
              <label className="text-[10px] font-bold text-zinc-500 uppercase block mb-1.5">Project ID</label>
              <input type="text" value="PRJ-2024-8821" readOnly className="w-full bg-[#252526] border border-white/5 rounded px-3 py-2 text-xs text-zinc-500 focus:outline-none cursor-not-allowed" />
          </div>
       </div>

   <div className="bg-[#2563eb]/5 border border-[#2563eb]/20 rounded-xl p-4 space-y-3">
        <div className="flex justify-between items-center pb-3 border-b border-[#2563eb]/10">
              <span className="text-xs text-zinc-300">Material Cost</span>
              <span className="text-xs font-mono text-zinc-200">${totalProjectCost.toLocaleString()}</span>
          </div>
      <div className="flex justify-between items-center pb-3 border-b border-[#2563eb]/10">
              <span className="text-xs text-zinc-300">Labor Estimate (25%)</span>
              <span className="text-xs font-mono text-zinc-200">${(totalProjectCost * 0.25).toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center pt-1">
           <span className="text-sm font-bold text-[#2563eb]">Total Quote</span>
              <span className="text-sm font-bold font-mono text-white">${(totalProjectCost * 1.25).toLocaleString()}</span>
          </div>
       </div>

   <button className="w-full bg-[#2563eb] hover:bg-[#2563eb]/90 text-white py-2.5 rounded-lg text-xs font-bold shadow-lg shadow-[#2563eb]/20 flex items-center justify-center gap-2 transition-all">
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
            className={`flex-1 h-full flex items-center justify-center gap-1 text-[10px] font-bold uppercase tracking-wider transition-colors border-b-2 ${activeTab === 'COMPONENTS' ? 'border-[#2563eb] text-[#2563eb]' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}
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
            className={`flex-1 h-full flex items-center justify-center gap-1 text-[10px] font-bold uppercase tracking-wider transition-colors border-b-2 ${activeTab === 'QUOTE' ? 'border-[#2563eb] text-[#2563eb]' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}
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
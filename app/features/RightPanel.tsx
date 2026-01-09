import React, { useState, useEffect, useCallback } from "react";
import { Icons } from "../components/Icons";
import { StatusBadge, ToggleButton, MarkdownRenderer } from "../components/common";
import { DetectedComponent, QuoteItem, QuoteInfo } from "../types";

type RightPanelTab = 'components' | 'analysis' | 'pricing' | 'quote';

const ComponentCard = ({ 
    comp, 
    isExpanded, 
    onToggle,
    isNarrow
}: { 
    comp: DetectedComponent, 
    isExpanded: boolean, 
    onToggle: () => void,
    isNarrow: boolean
}) => {
    return (
        <div 
            className={`group bg-[#121214] border rounded-lg transition-all duration-300 overflow-hidden cursor-pointer ${
                isExpanded ? 'border-blue-500 ring-1 ring-blue-500/20' : 'border-[#27272a] hover:border-blue-500/30'
            }`}
            onClick={onToggle}
        >
            <div className="p-4 flex items-start gap-3">
                <div className={`p-2 rounded-md transition-colors shrink-0 ${
                    isExpanded ? 'bg-blue-600 text-white' : 'bg-[#18181b] text-gray-400 group-hover:text-blue-400'
                }`}>
                    <Icons.Box />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1 gap-2">
                        <div className="text-sm font-semibold text-gray-100 truncate">{comp.name}</div>
                        <div className="shrink-0"><StatusBadge status={comp.status} /></div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] font-mono text-blue-400 bg-blue-400/10 px-1.5 py-0.5 rounded">{comp.id}</span>
                        <span className="text-[10px] text-gray-500 truncate">{comp.type}</span>
                    </div>
                </div>
                <div className={`transition-transform duration-300 text-gray-500 shrink-0 ${isExpanded ? 'rotate-180' : ''}`}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                </div>
            </div>

            {isExpanded && (
                <div className="px-4 pb-5 pt-0 animate-fade-in border-t border-gray-800/50 mt-2">
                    <div className="space-y-4 pt-4">
                        <div>
                            <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Overview</h4>
                            <p className="text-xs text-gray-300 leading-relaxed italic">{comp.description}</p>
                        </div>

                        <div className={`grid gap-6 ${isNarrow ? 'grid-cols-1' : 'grid-cols-2'}`}>
                            <div>
                                <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Technical Specs</h4>
                                <div className="space-y-1.5">
                                    {Object.entries(comp.technicalSpecs).map(([key, val]) => (
                                        <div key={key} className="flex justify-between text-[10px] gap-4">
                                            <span className="text-gray-500 shrink-0">{key}</span>
                                            <span className="text-gray-200 font-medium text-right">{val}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Performance</h4>
                                <div className="space-y-1.5">
                                    <div className="flex justify-between text-[10px]">
                                        <span className="text-gray-500">Confidence</span>
                                        <span className="text-emerald-400">{(comp.confidence * 100).toFixed(0)}%</span>
                                    </div>
                                    <div className="flex justify-between text-[10px]">
                                        <span className="text-gray-500">Efficiency</span>
                                        <span className="text-blue-400">{comp.efficiencyRating || 'Standard'}</span>
                                    </div>
                                    <div className="flex justify-between text-[10px]">
                                        <span className="text-gray-500">Est. Life</span>
                                        <span className="text-gray-300">{comp.estimatedLifespan || '15+ Years'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {comp.maintenanceNotes && (
                            <div className="bg-amber-500/5 border border-amber-500/10 rounded p-3">
                                <div className="flex items-center gap-2 mb-1.5">
                                    <Icons.Info className="text-amber-500" width={12} height={12} />
                                    <span className="text-[10px] font-bold text-amber-500 uppercase">Maintenance Insight</span>
                                </div>
                                <p className="text-[11px] text-amber-200/70 leading-relaxed">{comp.maintenanceNotes}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export const RightPanel = ({
    components,
    onUpdateComponentCost,
    quoteItems,
    quoteInfo,
    onUpdateQuoteInfo,
    onUpdateQuoteItem,
    onAddQuoteItem,
    onRemoveQuoteItem,
    aiAnalysis,
    isProcessing,
    isAnalyzing,
    uploadedImage,
    onRunAnalysis
}: {
    components: DetectedComponent[],
    onUpdateComponentCost: (id: string, cost: number) => void,
    quoteItems: QuoteItem[],
    quoteInfo: QuoteInfo,
    onUpdateQuoteInfo: (info: Partial<QuoteInfo>) => void,
    onUpdateQuoteItem: (id: string, field: string, value: any) => void,
    onAddQuoteItem: () => void,
    onRemoveQuoteItem: (id: string) => void,
    aiAnalysis: string | null,
    isProcessing: boolean,
    isAnalyzing?: boolean,
    uploadedImage: string | null,
    onRunAnalysis: () => void
}) => {
    const [rightWidth, setRightWidth] = useState(500); 
    const [isRightOpen, setIsRightOpen] = useState(true);
    const [isResizingRight, setIsResizingRight] = useState(false);
    const [activeRightTab, setActiveRightTab] = useState<RightPanelTab>('components');
    const [expandedCompId, setExpandedCompId] = useState<string | null>(null);

    const startResizingRight = useCallback(() => setIsResizingRight(true), []);
    const stopResizing = useCallback(() => setIsResizingRight(false), []);

    useEffect(() => {
        const handleResize = (e: MouseEvent) => {
            if (isResizingRight) {
                const newWidth = window.innerWidth - e.clientX;
                if (newWidth > 320 && newWidth < 1400) {
                    setRightWidth(newWidth);
                }
            }
        };

        if (isResizingRight) {
            window.addEventListener("mousemove", handleResize);
            window.addEventListener("mouseup", stopResizing);
        }
        return () => {
            window.removeEventListener("mousemove", handleResize);
            window.removeEventListener("mouseup", stopResizing);
        };
    }, [isResizingRight, stopResizing]);

    // Adaptive logic thresholds
    const isNarrow = rightWidth < 500;
    const isUltraNarrow = rightWidth < 380;

    // Financial calculations
    const materialSubtotal = quoteItems.reduce((sum, item) => sum + (item.materialCost * item.quantity), 0);
    const laborSubtotal = quoteItems.reduce((sum, item) => sum + (item.laborCost * item.quantity), 0);
    const grandTotal = materialSubtotal + laborSubtotal;
    const tax = grandTotal * 0.0825;

    return (
        <>
        <div 
            className="relative flex flex-col shrink-0 z-20 group"
            style={{ 
                width: isRightOpen ? rightWidth : 0, 
                transition: isResizingRight ? 'none' : 'width 0.4s cubic-bezier(0.2, 0, 0, 1)' 
            }}
        >
            <ToggleButton isOpen={isRightOpen} onClick={() => setIsRightOpen(!isRightOpen)} side="right" />

            {isRightOpen && (
                <div 
                    className="absolute top-0 left-0 w-2 h-full cursor-col-resize hover:bg-blue-500/10 transition-colors z-30"
                    onMouseDown={startResizingRight}
                >
                    <div className="absolute top-0 bottom-0 left-0 w-[1px] bg-transparent group-hover:bg-blue-500/50 transition-colors delay-100"></div>
                </div>
            )}

            <div className="absolute inset-0 overflow-hidden border-l border-[#27272a] bg-[#09090b] flex flex-col">
                <div className="h-full flex flex-col" style={{ width: rightWidth }}>
                    
                    <div className="h-12 border-b border-[#27272a] flex items-center px-1 shrink-0 bg-[#09090b] gap-0.5 overflow-x-auto custom-scrollbar no-scrollbar">
                        {[
                        { id: 'components', label: isUltraNarrow ? 'Comp' : 'Components' },
                        { id: 'analysis', label: 'Analysis' },
                        { id: 'pricing', label: 'Pricing' },
                        { id: 'quote', label: 'Quote' },
                        ].map(tab => (
                        <button 
                            key={tab.id}
                            onClick={() => setActiveRightTab(tab.id as RightPanelTab)}
                            className={`flex-1 min-w-[70px] flex items-center justify-center h-full text-[11px] font-medium border-b-2 transition-all duration-200 hover:bg-[#121214] rounded-t-lg mt-1 whitespace-nowrap px-2 ${
                                activeRightTab === tab.id 
                                ? 'border-blue-500 text-white bg-[#121214]' 
                                : 'border-transparent text-gray-500 hover:text-gray-300'
                            }`}
                        >
                            {tab.label}
                        </button>
                        ))}
                    </div>

                    <div className="flex-1 overflow-y-auto overflow-x-hidden bg-[#09090b] relative scroll-smooth custom-scrollbar">
                        
                        {activeRightTab === 'components' && (
                            <div className="p-4 space-y-3 animate-fade-in">
                                <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                                    <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Asset Registry</h3>
                                    <span className="bg-blue-500/10 text-blue-400 text-[10px] px-2 py-0.5 rounded-full border border-blue-500/20">{components.length} Detected</span>
                                </div>
                                {isProcessing && components.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-48 gap-4">
                                        <div className="w-8 h-8 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
                                        <p className="text-[10px] text-gray-500 uppercase tracking-widest animate-pulse">Neural Extraction in progress...</p>
                                    </div>
                                ) : components.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-48 text-gray-600 text-center px-4">
                                        <Icons.Search width={32} height={32} />
                                        <p className="text-xs mt-2 font-medium">No components detected yet.</p>
                                        <p className="text-[10px] opacity-60">Upload blueprint and run analysis to begin identification.</p>
                                    </div>
                                ) : (
                                    components.map((comp) => (
                                        <ComponentCard 
                                            key={comp.id} 
                                            comp={comp} 
                                            isExpanded={expandedCompId === comp.id}
                                            onToggle={() => setExpandedCompId(expandedCompId === comp.id ? null : comp.id)}
                                            isNarrow={isNarrow}
                                        />
                                    ))
                                )}
                            </div>
                        )}

                        {activeRightTab === 'analysis' && (
                            <div className="p-6 text-xs text-gray-300 markdown-body animate-fade-in w-full">
                                {isAnalyzing && (
                                    <div className="flex items-center gap-3 mb-6 p-4 bg-purple-500/5 border border-purple-500/10 rounded-lg animate-pulse">
                                        <Icons.Sparkles className="text-purple-400 shrink-0" width={16} height={16} />
                                        <span className="text-[11px] font-medium text-purple-300 tracking-tight">Stage 2: Generating Deep Forensic Report...</span>
                                    </div>
                                )}
                                
                                {aiAnalysis ? (
                                    <div className="space-y-2">
                                        {!isAnalyzing && (
                                            <div className="flex items-center gap-2 mb-6 p-3 bg-blue-500/5 border border-blue-500/10 rounded-lg">
                                                <Icons.Sparkles className="text-blue-400 shrink-0" width={16} height={16} />
                                                <span className="text-[11px] font-medium text-blue-300 tracking-tight">AI Neural Analysis Verified</span>
                                            </div>
                                        )}
                                        <MarkdownRenderer content={aiAnalysis} />
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center min-h-[300px] text-gray-600 gap-3 text-center px-6">
                                        <div className="p-4 rounded-full bg-[#121214] border border-[#27272a] text-purple-900/40">
                                            <Icons.Sparkles width={24} height={24} />
                                        </div>
                                        <p className="text-sm font-medium">No forensic analysis yet.</p>
                                        {!isProcessing && uploadedImage && (
                                            <button onClick={onRunAnalysis} className="mt-2 text-blue-500 hover:text-blue-400 hover:underline text-xs">Execute Neural Analysis</button>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        {activeRightTab === 'pricing' && (
                            <div className="flex flex-col animate-fade-in w-full">
                                <div className="p-6 border-b border-[#27272a] bg-[#121214] shrink-0">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-sm text-gray-400">Total Project Estimate</span>
                                        <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 text-[10px] rounded border border-blue-500/20">Market Verified</span>
                                    </div>
                                    <div className="text-3xl font-light text-white tracking-tight truncate">
                                        ${grandTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </div>
                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3">
                                        <div className="text-[10px] text-gray-500">
                                            Labor Rate: <span className="text-blue-400 font-mono">${quoteInfo.laborRate}/hr</span>
                                        </div>
                                        <div className="text-[10px] text-gray-500">
                                            Total Hours: <span className="text-blue-400 font-mono">{quoteItems.reduce((s, i) => s + (i.hours * i.quantity), 0)} hrs</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-4 space-y-4">
                                    {quoteItems.map(item => (
                                        <div key={item.id} className="bg-[#121214] border border-[#27272a] rounded-lg p-4 space-y-3 shadow-sm">
                                            <div className="flex justify-between items-start gap-3">
                                                <div className="min-w-0">
                                                    <div className="text-sm font-medium text-gray-100 truncate">{item.description}</div>
                                                    <div className="text-[10px] text-gray-500 font-mono uppercase truncate">{item.sku}</div>
                                                </div>
                                                <div className="flex items-center gap-2 bg-black/40 p-1 rounded border border-[#27272a] shrink-0">
                                                    <span className="text-[10px] text-gray-500 px-1">QTY</span>
                                                    <input 
                                                        type="number" 
                                                        value={item.quantity}
                                                        onChange={(e) => onUpdateQuoteItem(item.id, 'quantity', parseInt(e.target.value) || 1)}
                                                        className="w-10 bg-transparent text-center text-xs text-white focus:outline-none"
                                                    />
                                                </div>
                                            </div>
                                            <div className={`grid gap-4 pt-2 border-t border-[#27272a]/50 ${isNarrow ? 'grid-cols-1' : 'grid-cols-2'}`}>
                                                <div>
                                                    <label className="block text-[10px] text-gray-500 uppercase font-bold mb-1">Unit Cost</label>
                                                    <div className="flex items-center gap-1 bg-black/40 px-2 py-1.5 rounded border border-[#27272a]">
                                                        <span className="text-xs text-gray-500">$</span>
                                                        <input 
                                                            type="number"
                                                            value={item.materialCost}
                                                            onChange={(e) => onUpdateQuoteItem(item.id, 'materialCost', parseFloat(e.target.value) || 0)}
                                                            className="w-full bg-transparent text-sm text-white focus:outline-none font-mono"
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-[10px] text-gray-500 uppercase font-bold mb-1">Labor (Est)</label>
                                                    <div className="flex items-center gap-1 bg-black/40 px-2 py-1.5 rounded border border-[#27272a]">
                                                        <Icons.Activity width={12} height={12} className="text-gray-500" />
                                                        <input 
                                                            type="number"
                                                            step="0.5"
                                                            value={item.hours}
                                                            onChange={(e) => onUpdateQuoteItem(item.id, 'hours', parseFloat(e.target.value) || 0)}
                                                            className="w-full bg-transparent text-sm text-white focus:outline-none font-mono"
                                                        />
                                                        <span className="text-[10px] text-gray-600">HR</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex justify-between items-center text-[11px] pt-1">
                                                <span className="text-gray-500">Row Total</span>
                                                <span className="text-blue-400 font-mono font-bold">
                                                    ${((item.materialCost + (item.hours * quoteInfo.laborRate)) * item.quantity).toFixed(2)}
                                                </span>
                                            </div>
                                        </div>
                                    ))}

                                    {quoteItems.length === 0 && (
                                        <div className="text-center py-12 text-gray-600">
                                            <Icons.Tag width={32} height={32} className="mx-auto mb-2 opacity-20" />
                                            <p className="text-xs">No assets configured for pricing yet.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeRightTab === 'quote' && (
                            <div className="bg-[#0c0c0e] p-4 sm:p-6 overflow-x-hidden animate-fade-in">
                                <div className="bg-[#121214] shadow-2xl p-6 sm:p-10 border border-[#27272a] rounded-xl flex flex-col w-full mx-auto transition-all">
                                    
                                    {/* Quote Header */}
                                    <div className={`flex justify-between items-start mb-12 border-b border-[#27272a] pb-10 gap-8 ${isNarrow ? 'flex-col' : 'flex-row'}`}>
                                        <div className="flex flex-col gap-4">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2.5 bg-blue-600 rounded-lg text-white shadow-lg shadow-blue-500/20 shrink-0">
                                                    <Icons.Wind width={24} height={24} />
                                                </div>
                                                <div className="min-w-0">
                                                    <h1 className="text-xl font-light tracking-tight text-white uppercase">Proposal</h1>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="text-[10px] text-gray-500 font-mono">ID:</span>
                                                        <input 
                                                            type="text" 
                                                            value={quoteInfo.number}
                                                            onChange={(e) => onUpdateQuoteInfo({ number: e.target.value })}
                                                            className="bg-transparent border-b border-dashed border-[#3f3f46] text-[10px] text-blue-400 font-mono focus:outline-none focus:border-blue-500 w-24"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={`${isNarrow ? 'text-left' : 'text-right'} min-w-0`}>
                                            <div className="font-semibold text-base text-white truncate">HVAC AI ENGINEERING</div>
                                            <p className="text-[#71717a] text-[10px] mt-1">DYNAMICS LABORATORY UNIT 4</p>
                                            <p className="text-[#71717a] text-[10px]">SAN FRANCISCO, CA 94105</p>
                                        </div>
                                    </div>

                                    {/* Client & Date Info */}
                                    <div className={`grid gap-8 mb-12 ${isNarrow ? 'grid-cols-1' : 'grid-cols-2'}`}>
                                        <div className="space-y-4">
                                            <label className="text-[9px] uppercase font-bold text-blue-500 tracking-widest border-b border-blue-500/20 pb-1 block">Prepared For</label>
                                            <div className="space-y-1">
                                                <input 
                                                    type="text"
                                                    value={quoteInfo.billToName}
                                                    onChange={(e) => onUpdateQuoteInfo({ billToName: e.target.value })}
                                                    className="w-full bg-transparent border border-transparent hover:border-[#27272a] focus:border-blue-500 rounded px-2 py-1 -ml-2 text-sm text-white font-medium transition-all"
                                                />
                                                <input 
                                                    type="text"
                                                    value={quoteInfo.billToCompany}
                                                    onChange={(e) => onUpdateQuoteInfo({ billToCompany: e.target.value })}
                                                    className="w-full bg-transparent border border-transparent hover:border-[#27272a] focus:border-blue-500 rounded px-2 py-1 -ml-2 text-xs text-gray-400 transition-all"
                                                />
                                            </div>
                                        </div>
                                        <div className={`space-y-4 ${isNarrow ? 'text-left' : 'text-right'}`}>
                                            <label className="text-[9px] uppercase font-bold text-blue-500 tracking-widest border-b border-blue-500/20 pb-1 block">Proposal Cycle</label>
                                            <div className="space-y-2">
                                                <div className={`flex items-center gap-3 ${isNarrow ? 'justify-start' : 'justify-end'}`}>
                                                    <span className="text-[9px] text-gray-500">DATE</span>
                                                    <input 
                                                        type="text"
                                                        value={quoteInfo.date}
                                                        onChange={(e) => onUpdateQuoteInfo({ date: e.target.value })}
                                                        className="bg-transparent border-b border-dashed border-[#3f3f46] text-right text-[10px] text-gray-300 focus:outline-none focus:border-blue-500 w-24"
                                                    />
                                                </div>
                                                <div className={`flex items-center gap-3 ${isNarrow ? 'justify-start' : 'justify-end'}`}>
                                                    <span className="text-[9px] text-gray-500">LABOR</span>
                                                    <div className="flex items-center gap-1 font-mono text-[10px] text-blue-400">
                                                        <span>$</span>
                                                        <input 
                                                            type="number"
                                                            value={quoteInfo.laborRate}
                                                            onChange={(e) => onUpdateQuoteInfo({ laborRate: parseFloat(e.target.value) || 0 })}
                                                            className="bg-transparent border-b border-dashed border-[#3f3f46] text-right w-12 focus:outline-none"
                                                        />
                                                        <span className="text-gray-600">/hr</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Line Items Table Wrapper */}
                                    <div className="w-full overflow-x-auto custom-scrollbar pb-4">
                                        <table className="w-full text-left border-collapse min-w-[500px]">
                                            <thead>
                                                <tr className="border-b border-[#27272a]">
                                                    <th className="py-3 text-[9px] uppercase text-[#71717a] font-bold tracking-wider pl-2">Asset / Spec</th>
                                                    <th className="py-3 text-[9px] uppercase text-[#71717a] font-bold tracking-wider text-center w-12">Qty</th>
                                                    <th className="py-3 text-[9px] uppercase text-[#71717a] font-bold tracking-wider text-right w-24">Unit Price</th>
                                                    {!isNarrow && <th className="py-3 text-[9px] uppercase text-[#71717a] font-bold tracking-wider text-right w-24">Labor Est</th>}
                                                    <th className="py-3 text-[9px] uppercase text-[#71717a] font-bold tracking-wider text-right w-24 pr-2">Total</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-[#27272a]">
                                                {quoteItems.map(item => (
                                                    <tr key={item.id} className="group hover:bg-[#18181b] transition-colors relative">
                                                        <td className="py-4 pl-2 min-w-[150px]">
                                                            <input 
                                                                type="text" 
                                                                value={item.description}
                                                                onChange={(e) => onUpdateQuoteItem(item.id, 'description', e.target.value)}
                                                                className="w-full bg-transparent text-xs text-gray-100 font-medium focus:outline-none placeholder-gray-600"
                                                                placeholder="Component"
                                                            />
                                                            <input 
                                                                type="text" 
                                                                value={item.sku}
                                                                onChange={(e) => onUpdateQuoteItem(item.id, 'sku', e.target.value)}
                                                                className="w-full bg-transparent text-[9px] text-gray-500 font-mono focus:outline-none mt-1"
                                                                placeholder="SKU"
                                                            />
                                                        </td>
                                                        <td className="py-4 text-center">
                                                            <input 
                                                                type="number" 
                                                                value={item.quantity}
                                                                onChange={(e) => onUpdateQuoteItem(item.id, 'quantity', parseInt(e.target.value) || 1)}
                                                                className="w-8 bg-transparent text-xs text-center text-gray-300 focus:outline-none font-mono"
                                                            />
                                                        </td>
                                                        <td className="py-4 text-right font-mono text-xs text-gray-400">
                                                            ${item.materialCost.toFixed(2)}
                                                        </td>
                                                        {!isNarrow && (
                                                            <td className="py-4 text-right font-mono text-xs text-gray-500">
                                                                ${(item.hours * quoteInfo.laborRate).toFixed(2)}
                                                                <div className="text-[8px] text-gray-600 font-sans">{item.hours}h</div>
                                                            </td>
                                                        )}
                                                        <td className="py-4 text-right font-mono text-xs text-white font-bold pr-2">
                                                            ${((item.materialCost + (item.hours * quoteInfo.laborRate)) * item.quantity).toFixed(2)}
                                                            
                                                            <button 
                                                                onClick={() => onRemoveQuoteItem(item.id)}
                                                                className="absolute -right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-1 text-rose-500 hover:bg-rose-500/10 rounded transition-all"
                                                            >
                                                                <Icons.Trash width={12} height={12} />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    <button 
                                        onClick={onAddQuoteItem}
                                        className="w-full py-3 border border-dashed border-[#3f3f46] rounded-lg text-[10px] text-gray-500 hover:text-blue-400 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all mt-4 flex items-center justify-center gap-2"
                                    >
                                        <Icons.Plus width={12} height={12} />
                                        <span>Add Asset Specification Line</span>
                                    </button>

                                    {/* Quote Summary Footer */}
                                    <div className={`mt-12 pt-8 border-t border-[#27272a] flex justify-between gap-12 ${isNarrow ? 'flex-col' : 'flex-row'}`}>
                                        <div className="flex-1 space-y-4">
                                            <h4 className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">General Exclusions</h4>
                                            <p className="text-[10px] text-gray-600 leading-relaxed max-w-xs">
                                                Based on multi-stage forensic AI schematic analysis. Final engineering sign-off required post site-walk.
                                            </p>
                                        </div>
                                        <div className={`w-full max-w-xs space-y-3 bg-[#09090b]/40 p-5 rounded-xl border border-[#27272a] ${isNarrow ? 'mx-auto' : ''}`}>
                                            <div className="flex justify-between text-[11px] text-gray-500">
                                                <span>Material Subtotal</span>
                                                <span className="font-mono text-gray-300">${materialSubtotal.toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between text-[11px] text-gray-500">
                                                <span>Labor Subtotal</span>
                                                <span className="font-mono text-gray-300">${laborSubtotal.toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between text-[11px] text-gray-600 italic">
                                                <span>Sales Tax (8.25%)</span>
                                                <span className="font-mono">${tax.toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between py-3 border-t border-[#27272a] text-base font-light text-white">
                                                <span className="uppercase text-[9px] font-bold text-blue-500 self-center">Grand Total</span>
                                                <span className="font-mono text-emerald-400 font-bold">${(grandTotal + tax).toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-12 text-[8px] text-gray-800 text-center uppercase tracking-[0.3em] font-medium border-t border-[#27272a]/30 pt-8">
                                        Powered by Multi-Stage Neural Logic. Valid 30 Days.
                                    </div>
                                </div>
                                
                                <div className={`flex justify-center mt-8 gap-4 flex-wrap ${isUltraNarrow ? 'flex-col' : 'flex-row'}`}>
                                    <button className="flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg shadow-lg shadow-blue-500/20 transition-all text-[10px] font-bold uppercase tracking-wider min-w-[160px]">
                                        <Icons.Send width={14} height={14} /> Send Proposal
                                    </button>
                                    <button className="flex items-center justify-center gap-2 px-6 py-2.5 bg-[#18181b] hover:bg-[#27272a] text-gray-300 rounded-lg border border-[#3f3f46] transition-all text-[10px] font-medium min-w-[140px]">
                                        <Icons.FileText width={12} height={12} /> Draft PDF
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {isResizingRight && (
                <div className="fixed inset-0 z-[100] cursor-col-resize"></div>
            )}
        </div>
        </>
    );
};

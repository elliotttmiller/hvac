import React, { useState, useEffect, useCallback, useRef } from "react";
import { Icons } from "../components/Icons";
import { StatusBadge, ToggleButton, MarkdownRenderer } from "../components/common";
import { DetectedComponent, QuoteItem, QuoteInfo, TeamMember, Comment } from "../types";

type RightPanelTab = 'workspace' | 'analysis' | 'pricing' | 'quote';

// --- SHARED COMPONENTS ---

const UserAvatar = ({ initials, size = "sm" }: { initials: string, size?: "xs" | "sm" | "md" }) => {
    const sizeClasses = {
        xs: "w-5 h-5 text-[8px]",
        sm: "w-8 h-8 text-[10px]",
        md: "w-10 h-10 text-xs"
    };

    return (
        <div className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold ring-2 ring-[#121214]`}>
            {initials}
        </div>
    );
};

const CommentThread = ({ 
    comments = [], 
    onAddComment, 
    contextId,
    compact = false
}: { 
    comments?: Comment[], 
    onAddComment: (text: string) => void, 
    contextId: string,
    compact?: boolean
}) => {
    const [newComment, setNewComment] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(!newComment.trim()) return;
        onAddComment(newComment);
        setNewComment("");
    };

    return (
        <div className={`flex flex-col h-full ${compact ? 'gap-2' : 'gap-3'}`}>
            <div className={`flex-1 overflow-y-auto custom-scrollbar space-y-3 ${comments.length === 0 ? 'flex items-center justify-center' : 'pr-1'}`}>
                {comments.length > 0 ? (
                    comments.map((c) => (
                        <div key={c.id} className="flex gap-3 animate-fade-in group">
                            <div className="shrink-0 mt-0.5">
                                <UserAvatar initials={c.initials} size="xs" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-0.5">
                                    <span className="text-xs font-medium text-gray-200">{c.author}</span>
                                    <span className="text-[9px] text-gray-600">{c.timestamp}</span>
                                </div>
                                <div className="text-xs text-gray-400 leading-relaxed break-words bg-[#18181b] p-2 rounded-lg rounded-tl-none border border-[#27272a] group-hover:border-gray-600 transition-colors">
                                    {c.text}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center text-gray-600">
                        <Icons.MessageSquare width={24} height={24} className="mx-auto mb-2 opacity-20" />
                        <p className="text-[10px]">No notes yet. Start the discussion.</p>
                    </div>
                )}
            </div>
            
            <form onSubmit={handleSubmit} className="relative shrink-0 mt-2">
                 <div className="relative">
                    <input 
                        ref={inputRef}
                        type="text" 
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Type a note..."
                        className="w-full bg-[#09090b] border border-[#27272a] rounded-lg pl-3 pr-10 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all"
                    />
                    <button 
                        type="submit"
                        disabled={!newComment.trim()}
                        className={`absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 rounded-md transition-colors ${newComment.trim() ? 'text-white bg-blue-600 hover:bg-blue-500' : 'text-gray-600'}`}
                    >
                        <Icons.Send width={12} height={12} />
                    </button>
                 </div>
            </form>
        </div>
    );
};

// --- COMPONENT CARD ---
interface ComponentCardProps { 
    comp: DetectedComponent;
    isExpanded: boolean;
    onToggle: () => void;
    onAddComment: (text: string) => void;
}

const ComponentCard = ({ 
    comp, 
    isExpanded, 
    onToggle,
    onAddComment
}: ComponentCardProps) => {
    const [activeTab, setActiveTab] = useState<'specs' | 'economics' | 'notes'>('specs');

    return (
        <div 
            className={`group bg-[#121214] border rounded-lg transition-all duration-300 overflow-hidden ${
                isExpanded ? 'border-blue-500/50 ring-1 ring-blue-500/10 shadow-lg' : 'border-[#27272a] hover:border-blue-500/30'
            }`}
        >
            <div className="p-3 flex items-start gap-3 cursor-pointer" onClick={onToggle}>
                <div className={`p-2 rounded-md transition-colors shrink-0 relative ${
                    isExpanded ? 'bg-blue-600 text-white' : 'bg-[#18181b] text-gray-400 group-hover:text-blue-400'
                }`}>
                    <Icons.Box width={16} height={16} />
                    {comp.comments && comp.comments.length > 0 && !isExpanded && (
                        <div className="absolute -top-1 -right-1 flex h-3 w-3 items-center justify-center rounded-full bg-rose-500 ring-2 ring-[#121214]">
                            <span className="h-1.5 w-1.5 rounded-full bg-white"></span>
                        </div>
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1 gap-2">
                        <div className="text-sm font-semibold text-gray-100 truncate">{comp.name}</div>
                        <div className="shrink-0"><StatusBadge status={comp.status} /></div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[9px] font-mono text-blue-400 bg-blue-400/10 px-1.5 py-0.5 rounded border border-blue-400/20">{comp.id}</span>
                        <span className="text-[10px] text-gray-500 truncate border-l border-[#27272a] pl-2">{comp.type}</span>
                    </div>
                </div>
                <div className={`transition-transform duration-300 text-gray-500 shrink-0 ${isExpanded ? 'rotate-180' : ''}`}>
                    <Icons.ChevronDown width={12} height={12} />
                </div>
            </div>

            {isExpanded && (
                <div className="animate-fade-in border-t border-[#27272a] bg-[#0c0c0e]">
                    {/* Tab Navigation */}
                    <div className="flex items-center px-4 border-b border-[#27272a] gap-6">
                        <button 
                            onClick={() => setActiveTab('specs')}
                            className={`py-3 text-[10px] font-bold uppercase tracking-wider border-b-2 transition-colors ${activeTab === 'specs' ? 'border-blue-500 text-blue-400' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
                        >
                            Specifications
                        </button>
                        <button 
                            onClick={() => setActiveTab('economics')}
                            className={`py-3 text-[10px] font-bold uppercase tracking-wider border-b-2 transition-colors ${activeTab === 'economics' ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
                        >
                            Financials
                        </button>
                        <button 
                            onClick={() => setActiveTab('notes')}
                            className={`py-3 text-[10px] font-bold uppercase tracking-wider border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'notes' ? 'border-purple-500 text-purple-400' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
                        >
                            Team Notes
                            {(comp.comments?.length || 0) > 0 && (
                                <span className="bg-[#27272a] text-white px-1.5 rounded-full text-[9px]">{comp.comments?.length}</span>
                            )}
                        </button>
                    </div>

                    <div className="p-4">
                        {activeTab === 'specs' && (
                            <div className="space-y-4 animate-fade-in">
                                <div>
                                    <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Description</h4>
                                    <p className="text-xs text-gray-300 leading-relaxed bg-[#121214] p-3 rounded border border-[#27272a]">
                                        {comp.description || "No specific description available."}
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Parameters</h4>
                                        <div className="space-y-1 bg-[#121214] p-3 rounded border border-[#27272a]">
                                            {Object.entries(comp.technicalSpecs).map(([key, val]) => (
                                                <div key={key} className="flex justify-between text-[10px] border-b border-[#27272a]/50 last:border-0 pb-1 last:pb-0 mb-1 last:mb-0">
                                                    <span className="text-gray-500 shrink-0">{key}</span>
                                                    <span className="text-gray-200 font-medium text-right truncate pl-2">{val}</span>
                                                </div>
                                            ))}
                                            <div className="flex justify-between text-[10px] pt-1">
                                                <span className="text-gray-500">Confidence</span>
                                                <span className="text-emerald-400 font-medium">{(comp.confidence * 100).toFixed(0)}%</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Lifecycle</h4>
                                        <div className="bg-[#121214] p-3 rounded border border-[#27272a] space-y-2">
                                            <div className="flex justify-between text-[10px]">
                                                <span className="text-gray-500">Lifespan</span>
                                                <span className="text-gray-200">{comp.estimatedLifespan || "N/A"}</span>
                                            </div>
                                            <div className="flex justify-between text-[10px]">
                                                <span className="text-gray-500">Efficiency</span>
                                                <span className="text-blue-400">{comp.efficiencyRating || "Standard"}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {comp.maintenanceNotes && (
                                    <div className="bg-amber-500/5 border border-amber-500/10 rounded p-3 flex items-start gap-3">
                                        <Icons.Info className="text-amber-500 shrink-0 mt-0.5" width={14} height={14} />
                                        <div>
                                            <span className="text-[10px] font-bold text-amber-500 uppercase block mb-1">Maintenance Insight</span>
                                            <p className="text-[11px] text-amber-200/70 leading-relaxed">{comp.maintenanceNotes}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'economics' && (
                            <div className="space-y-4 animate-fade-in">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="col-span-2">
                                        <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Catalog Match</h4>
                                        <div className="bg-[#121214] p-3 rounded border border-[#27272a] flex items-center justify-between">
                                            <div>
                                                <div className="text-xs text-gray-400 font-mono mb-1">{comp.sku}</div>
                                                <div className="text-[10px] text-gray-600">Standard SKU</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-sm font-bold text-white tabular-nums">${comp.cost.toFixed(2)}</div>
                                                <div className="text-[10px] text-emerald-500">Market Rate</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Labor Estimate</h4>
                                        <div className="bg-[#121214] p-3 rounded border border-[#27272a] space-y-1">
                                            <div className="flex justify-between text-[10px]">
                                                <span className="text-gray-500">Install Time</span>
                                                <span className="text-gray-200">{comp.estimatedInstallHours || 0} hrs</span>
                                            </div>
                                            <div className="flex justify-between text-[10px]">
                                                <span className="text-gray-500">Hourly Rate</span>
                                                <span className="text-gray-200">$115/hr</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Total Value</h4>
                                        <div className="bg-[#121214] p-3 rounded border border-[#27272a] flex items-center justify-center h-[58px]">
                                            <span className="text-lg font-bold text-emerald-400 tabular-nums">
                                                ${(comp.cost + ((comp.estimatedInstallHours || 0) * 115)).toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'notes' && (
                            <div className="h-48 animate-fade-in">
                                <CommentThread 
                                    comments={comp.comments} 
                                    onAddComment={onAddComment} 
                                    contextId={comp.id}
                                />
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

// --- PRINTABLE QUOTE COMPONENT (Visible only via CSS @media print) ---
const PrintableQuote = ({ info, items, total, tax }: { info: QuoteInfo, items: QuoteItem[], total: number, tax: number }) => (
    <div id="printable-quote-container" className="hidden p-12 max-w-[850px] mx-auto bg-white text-gray-900 font-sans">
        {/* Header */}
        <div className="flex justify-between items-start mb-12 border-b border-gray-200 pb-8">
            <div>
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-blue-600 rounded flex items-center justify-center text-white">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"/></svg>
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">HVAC AI ENGINEERING</h1>
                </div>
                <div className="text-sm text-gray-500 space-y-1">
                    <p>Dynamics Laboratory Unit 4</p>
                    <p>San Francisco, CA 94105</p>
                    <p>engineering@hvac.ai</p>
                </div>
            </div>
            <div className="text-right">
                <h2 className="text-4xl font-light text-gray-300 uppercase tracking-widest mb-4">Proposal</h2>
                <div className="space-y-2">
                    <div className="flex justify-end gap-4">
                        <span className="text-sm font-bold text-gray-400 uppercase">Quote #</span>
                        <span className="text-sm font-mono font-medium text-gray-900">{info.number}</span>
                    </div>
                    <div className="flex justify-end gap-4">
                        <span className="text-sm font-bold text-gray-400 uppercase">Date</span>
                        <span className="text-sm font-medium text-gray-900">{info.date}</span>
                    </div>
                </div>
            </div>
        </div>

        {/* Bill To */}
        <div className="flex justify-between mb-12">
            <div>
                <h3 className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-3">Prepared For</h3>
                <p className="text-lg font-semibold text-gray-900">{info.billToName}</p>
                <p className="text-gray-600">{info.billToCompany}</p>
            </div>
            <div className="text-right">
                <h3 className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-3">Project Specs</h3>
                <p className="text-sm text-gray-600"><span className="font-medium text-gray-900">Labor Rate:</span> ${info.laborRate}/hr</p>
                <p className="text-sm text-gray-600"><span className="font-medium text-gray-900">Valid Until:</span> 30 Days</p>
            </div>
        </div>

        {/* Table */}
        <table className="w-full mb-8">
            <thead>
                <tr className="border-b-2 border-gray-900">
                    <th className="text-left py-3 text-xs font-bold text-gray-900 uppercase tracking-wider">Description</th>
                    <th className="text-left py-3 text-xs font-bold text-gray-900 uppercase tracking-wider">SKU</th>
                    <th className="text-center py-3 text-xs font-bold text-gray-900 uppercase tracking-wider">Qty</th>
                    <th className="text-right py-3 text-xs font-bold text-gray-900 uppercase tracking-wider">Unit Price</th>
                    <th className="text-right py-3 text-xs font-bold text-gray-900 uppercase tracking-wider">Labor</th>
                    <th className="text-right py-3 text-xs font-bold text-gray-900 uppercase tracking-wider">Total</th>
                </tr>
            </thead>
            <tbody className="text-sm text-gray-700">
                {items.map((item, i) => (
                    <tr key={i} className="border-b border-gray-200">
                        <td className="py-4 font-medium">{item.description}</td>
                        <td className="py-4 text-gray-500 font-mono text-xs">{item.sku}</td>
                        <td className="py-4 text-center">{item.quantity}</td>
                        <td className="py-4 text-right">${item.materialCost.toFixed(2)}</td>
                        <td className="py-4 text-right">${(item.hours * info.laborRate).toFixed(2)}</td>
                        <td className="py-4 text-right font-bold text-gray-900">
                            ${((item.materialCost + (item.hours * info.laborRate)) * item.quantity).toFixed(2)}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>

        {/* Totals */}
        <div className="flex justify-end mb-16">
            <div className="w-64 space-y-3">
                <div className="flex justify-between text-sm text-gray-600">
                    <span>Subtotal</span>
                    <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                    <span>Tax (8.25%)</span>
                    <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-gray-900 pt-4 border-t border-gray-300">
                    <span>Total</span>
                    <span className="text-blue-600">${(total + tax).toFixed(2)}</span>
                </div>
            </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 pt-8 text-center text-xs text-gray-400">
            <p className="mb-2">Thank you for your business.</p>
            <p>Generated by HVAC AI • Proprietary Engineering Analysis</p>
        </div>
    </div>
);

// --- SEND PROPOSAL MODAL ---
const SendProposalModal = ({ 
    isOpen, 
    onClose, 
    onSend, 
    teamMembers,
    quoteNumber
}: { 
    isOpen: boolean; 
    onClose: () => void; 
    onSend: (recipients: string[], note: string) => void; 
    teamMembers: TeamMember[];
    quoteNumber: string;
}) => {
    const [selected, setSelected] = useState<string[]>([]);
    const [note, setNote] = useState("");
    const [isSending, setIsSending] = useState(false);

    if (!isOpen) return null;

    const toggleMember = (name: string) => {
        if (selected.includes(name)) setSelected(selected.filter(n => n !== name));
        else setSelected([...selected, name]);
    };

    const handleSend = () => {
        if (selected.length === 0) return;
        setIsSending(true);
        // Simulate network
        setTimeout(() => {
            onSend(selected, note);
            setIsSending(false);
            onClose();
            setSelected([]);
            setNote("");
        }, 1200);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative bg-[#121214] border border-[#27272a] rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in">
                <div className="px-6 py-4 border-b border-[#27272a] bg-[#18181b] flex justify-between items-center">
                    <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                        <Icons.Send width={16} height={16} className="text-blue-500" />
                        Send Proposal {quoteNumber}
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white"><Icons.X width={16} height={16} /></button>
                </div>
                
                <div className="p-6 space-y-4">
                    <div>
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 block">Select Recipients</label>
                        <div className="space-y-2">
                            {teamMembers.map((member, i) => (
                                <div 
                                    key={i}
                                    onClick={() => toggleMember(member.name)}
                                    className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${
                                        selected.includes(member.name) 
                                        ? 'bg-blue-600/10 border-blue-500/50' 
                                        : 'bg-[#09090b] border-[#27272a] hover:border-gray-600'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-[10px] text-white font-bold">
                                            {member.initials}
                                        </div>
                                        <div>
                                            <div className={`text-sm font-medium ${selected.includes(member.name) ? 'text-blue-400' : 'text-gray-200'}`}>{member.name}</div>
                                            <div className="text-[10px] text-gray-500">{member.role}</div>
                                        </div>
                                    </div>
                                    {selected.includes(member.name) && <Icons.CheckCircle className="text-blue-500" width={16} height={16} />}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 block">Message (Optional)</label>
                        <textarea 
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            className="w-full bg-[#09090b] border border-[#27272a] rounded-lg p-3 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 resize-none h-20"
                            placeholder="Add a note about this proposal..."
                        />
                    </div>
                </div>

                <div className="p-4 border-t border-[#27272a] bg-[#18181b] flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 text-xs font-medium text-gray-400 hover:text-white">Cancel</button>
                    <button 
                        onClick={handleSend}
                        disabled={selected.length === 0 || isSending}
                        className={`px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded flex items-center gap-2 ${
                            (selected.length === 0 || isSending) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-500 shadow-lg shadow-blue-500/20'
                        }`}
                    >
                        {isSending ? (
                            <>
                                <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                Sending...
                            </>
                        ) : (
                            <>
                                <Icons.Send width={14} height={14} />
                                Send Proposal
                            </>
                        )}
                    </button>
                </div>
            </div>
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
    onRunAnalysis,
    teamMembers = [], 
    onSendProposal,
    onAddComment
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
    onRunAnalysis: () => void,
    teamMembers?: TeamMember[],
    onSendProposal?: (recipients: string[], note: string) => void,
    onAddComment: (targetId: string, text: string) => void
}) => {
    const [rightWidth, setRightWidth] = useState(500); 
    const [isRightOpen, setIsRightOpen] = useState(true);
    const [isResizingRight, setIsResizingRight] = useState(false);
    const [activeRightTab, setActiveRightTab] = useState<RightPanelTab>('workspace');
    const [expandedCompId, setExpandedCompId] = useState<string | null>(null);
    const [isSendModalOpen, setIsSendModalOpen] = useState(false);
    const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});
    
    // Track expanded rows for comments in Pricing/Quote tabs
    const [expandedRowComments, setExpandedRowComments] = useState<Record<string, boolean>>({});

    const startResizingRight = useCallback(() => setIsResizingRight(true), []);
    const stopResizing = useCallback(() => setIsResizingRight(false), []);

    // Grouping Logic for Categorized Accordion
    const groupedComponents = React.useMemo(() => {
        const groups: Record<string, DetectedComponent[]> = {
            'Controllers & Logic': [],
            'Sensors & Inputs': [],
            'Valves & Dampers': [],
            'Actuators': [],
            'Accessories & Misc': []
        };

        components.forEach(comp => {
            const t = (comp.type || '').toLowerCase();
            let added = false;

            if (t.includes('controller') || t.includes('plc') || t.includes('panel') || t.includes('io') || t.includes('module')) {
                groups['Controllers & Logic'].push(comp);
                added = true;
            } else if (t.includes('sensor') || t.includes('temp') || t.includes('pressure') || t.includes('stat') || t.includes('switch') || t.includes('transmitter')) {
                groups['Sensors & Inputs'].push(comp);
                added = true;
            } else if (t.includes('valve') || t.includes('damper') || t.includes('vav') || t.includes('coil')) {
                groups['Valves & Dampers'].push(comp);
                added = true;
            } else if (t.includes('actuator') || t.includes('drive') || t.includes('motor')) {
                groups['Actuators'].push(comp);
                added = true;
            } 
            
            if (!added) {
                groups['Accessories & Misc'].push(comp);
            }
        });

        // Only return groups that have items
        return Object.entries(groups).filter(([_, items]) => items.length > 0);
    }, [components]);

    const toggleCategory = (category: string) => {
        setCollapsedCategories(prev => ({
            ...prev,
            [category]: !prev[category]
        }));
    };

    const toggleRowComment = (id: string) => {
        setExpandedRowComments(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };
    
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
    const isNarrow = rightWidth < 600;
    const isUltraNarrow = rightWidth < 420;

    // Financial calculations
    const materialSubtotal = quoteItems.reduce((sum, item) => sum + (item.materialCost * item.quantity), 0);
    const laborSubtotal = quoteItems.reduce((sum, item) => sum + (item.laborCost * item.quantity), 0);
    const grandTotal = materialSubtotal + laborSubtotal;
    const tax = grandTotal * 0.0825;

    // Native Browser Print Functionality
    const handlePrint = () => {
        window.print();
    };

    return (
        <>
        {/* Hidden Print Template */}
        <PrintableQuote 
            info={quoteInfo} 
            items={quoteItems} 
            total={grandTotal} 
            tax={tax} 
        />
        
        <SendProposalModal 
            isOpen={isSendModalOpen} 
            onClose={() => setIsSendModalOpen(false)}
            teamMembers={teamMembers}
            quoteNumber={quoteInfo.number}
            onSend={(recipients, note) => {
                if(onSendProposal) onSendProposal(recipients, note);
            }}
        />

        <div 
            className="relative flex flex-col shrink-0 z-20 group print:hidden"
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
                        { id: 'workspace', label: isUltraNarrow ? 'Hub' : 'Workspace' },
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
                        
                        {activeRightTab === 'workspace' && (
                            <div className="p-4 space-y-6 animate-fade-in pb-20">
                                {/* Collaborators / Header Section */}
                                <div className="flex items-center justify-between border-b border-[#27272a] pb-6">
                                    <div>
                                        <h3 className="text-xs font-semibold text-white uppercase tracking-wider mb-1">Active Session</h3>
                                        <p className="text-[10px] text-gray-500">Live collaboration environment</p>
                                    </div>
                                    <div className="flex -space-x-2">
                                        {teamMembers.map((m, i) => (
                                            <div key={i} title={`${m.name} (${m.role})`}>
                                                <UserAvatar initials={m.initials} size="sm" />
                                            </div>
                                        ))}
                                        <button className="w-8 h-8 rounded-full bg-[#18181b] border border-[#27272a] flex items-center justify-center text-gray-500 hover:text-white hover:border-gray-500 transition-colors">
                                            <Icons.Plus width={12} height={12} />
                                        </button>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                                    <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Detection Registry</h3>
                                    <span className="bg-blue-500/10 text-blue-400 text-[10px] px-2 py-0.5 rounded-full border border-blue-500/20">{components.length} Assets</span>
                                </div>
                                
                                {isProcessing && components.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-48 gap-4">
                                        <div className="w-8 h-8 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
                                        <p className="text-[10px] text-gray-500 uppercase tracking-widest animate-pulse">AI Extraction in progress...</p>
                                    </div>
                                ) : components.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-48 text-gray-600 text-center px-4">
                                        <Icons.Search width={32} height={32} />
                                        <p className="text-xs mt-2 font-medium">No components detected yet.</p>
                                        <p className="text-[10px] opacity-60">Upload blueprint and run analysis to begin identification.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {groupedComponents.map(([category, items]) => (
                                            <div key={category} className="animate-fade-in">
                                                <button 
                                                    onClick={() => toggleCategory(category)}
                                                    className="w-full flex items-center justify-between p-3 bg-[#121214] border border-[#27272a] rounded-lg hover:border-gray-600 transition-all group sticky top-0 z-10 shadow-sm"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-xs font-bold text-gray-300 uppercase tracking-wide group-hover:text-white">{category}</span>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <span className="bg-[#18181b] border border-[#27272a] text-gray-500 text-[9px] px-1.5 py-0.5 rounded-md font-mono">{items.length}</span>
                                                        <div className={`text-gray-500 transition-transform duration-300 ${collapsedCategories[category] ? '-rotate-90' : 'rotate-0'}`}>
                                                            <Icons.ChevronDown width={14} height={14} />
                                                        </div>
                                                    </div>
                                                </button>
                                                
                                                {!collapsedCategories[category] && (
                                                    <div className="space-y-2 mt-2 pl-2 border-l border-[#27272a] ml-4">
                                                        {items.map((comp) => (
                                                            <ComponentCard 
                                                                key={comp.id} 
                                                                comp={comp} 
                                                                isExpanded={expandedCompId === comp.id}
                                                                onToggle={() => setExpandedCompId(expandedCompId === comp.id ? null : comp.id)}
                                                                onAddComment={(text) => onAddComment(comp.id, text)}
                                                            />
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {activeRightTab === 'analysis' && (
                            <div className="animate-fade-in w-full h-full flex flex-col">
                                {isAnalyzing && (
                                    <div className="p-6">
                                        <div className="flex items-center gap-3 mb-6 p-4 bg-purple-500/5 border border-purple-500/10 rounded-lg animate-pulse">
                                            <Icons.Sparkles className="text-purple-400 shrink-0" width={16} height={16} />
                                            <span className="text-[11px] font-medium text-purple-300 tracking-tight">Stage 2: Generating Deep Forensic Report...</span>
                                        </div>
                                    </div>
                                )}
                                
                                {aiAnalysis ? (
                                    <div className="flex flex-col h-full">
                                        {!isAnalyzing && (
                                            <div className="px-6 py-4 border-b border-[#27272a] bg-[#121214] flex justify-between items-center sticky top-0 z-10 backdrop-blur-sm bg-opacity-90">
                                                <div className="flex items-center gap-2">
                                                    <div className="p-1.5 bg-blue-500/10 rounded text-blue-400"><Icons.Sparkles width={14} height={14} /></div>
                                                    <div>
                                                        <div className="text-[11px] font-bold text-gray-200">FORENSIC ANALYSIS</div>
                                                        <div className="text-[9px] text-gray-500">ID: REP-{Math.floor(Math.random()*10000)} • STATUS: VERIFIED</div>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                     <button className="p-1.5 hover:bg-[#27272a] rounded text-gray-400 hover:text-white" title="Copy to Clipboard"><Icons.Clipboard width={14} height={14}/></button>
                                                     <button className="p-1.5 hover:bg-[#27272a] rounded text-gray-400 hover:text-white" title="Export PDF"><Icons.FileText width={14} height={14}/></button>
                                                </div>
                                            </div>
                                        )}
                                        <div className="p-6 lg:p-8 markdown-body">
                                            <MarkdownRenderer content={aiAnalysis} />
                                        </div>
                                        
                                        {/* Analysis Footer - General Project Notes/Discussion */}
                                        <div className="p-6 border-t border-[#27272a] bg-[#121214] mt-auto">
                                            <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Project Engineering Notes</h4>
                                            {/* We can reuse CommentThread here but contextId would need to be generic "project" or "report". For now, sticking to component context request. */}
                                            <p className="text-[10px] text-gray-600 italic mb-2">Generated by Gemini 3 Flash • PE Review Required</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center min-h-[400px] text-gray-600 gap-3 text-center px-6">
                                        <div className="p-4 rounded-full bg-[#121214] border border-[#27272a] text-purple-900/40 shadow-xl">
                                            <Icons.Sparkles width={28} height={28} />
                                        </div>
                                        <p className="text-sm font-medium text-gray-400">Analysis Engine Ready</p>
                                        <p className="text-xs text-gray-600 max-w-[200px]">Waiting for Stage 1 extraction to complete before generating forensic report.</p>
                                        {!isProcessing && uploadedImage && (
                                            <button 
                                                onClick={onRunAnalysis} 
                                                className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2"
                                            >
                                                <Icons.Activity width={14} height={14} />
                                                Execute Pipeline
                                            </button>
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
                                    <div className="text-3xl font-light text-white tracking-tight truncate tabular-nums">
                                        ${grandTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </div>
                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3">
                                        <div className="text-[10px] text-gray-500">
                                            Labor Rate: <span className="text-blue-400 font-medium tabular-nums">${quoteInfo.laborRate}/hr</span>
                                        </div>
                                        <div className="text-[10px] text-gray-500">
                                            Total Hours: <span className="text-blue-400 font-medium tabular-nums">{quoteItems.reduce((s, i) => s + (i.hours * i.quantity), 0)} hrs</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-4 space-y-4">
                                    {quoteItems.map(item => (
                                        <div key={item.id} className="bg-[#121214] border border-[#27272a] rounded-lg p-4 shadow-sm transition-all duration-300">
                                            <div className="flex justify-between items-start gap-3">
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <div className="text-sm font-medium text-gray-100 truncate">{item.description}</div>
                                                        <button 
                                                            onClick={() => toggleRowComment(item.id)}
                                                            className={`p-1 rounded transition-colors ${item.comments && item.comments.length > 0 ? 'text-blue-400 bg-blue-500/10' : 'text-gray-600 hover:text-gray-300'}`}
                                                            title="Toggle Notes"
                                                        >
                                                            <div className="flex items-center gap-1">
                                                                <Icons.MessageSquare width={12} height={12} />
                                                                {(item.comments?.length || 0) > 0 && <span className="text-[9px] font-bold">{item.comments?.length}</span>}
                                                            </div>
                                                        </button>
                                                    </div>
                                                    <div className="text-[10px] text-gray-500 font-medium uppercase truncate">{item.sku}</div>
                                                </div>
                                                <div className="flex items-center gap-2 bg-black/40 p-1 rounded border border-[#27272a] shrink-0">
                                                    <span className="text-[10px] text-gray-500 px-1">QTY</span>
                                                    <input 
                                                        type="number" 
                                                        value={item.quantity}
                                                        onChange={(e) => onUpdateQuoteItem(item.id, 'quantity', parseInt(e.target.value) || 1)}
                                                        className="w-10 bg-transparent text-center text-xs text-white focus:outline-none tabular-nums"
                                                    />
                                                </div>
                                            </div>
                                            
                                            {expandedRowComments[item.id] && (
                                                <div className="mt-3 pt-3 border-t border-[#27272a] animate-fade-in">
                                                    <h4 className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-2">Item Notes</h4>
                                                    <CommentThread 
                                                        comments={item.comments} 
                                                        onAddComment={(text) => onAddComment(item.id, text)} 
                                                        contextId={item.id}
                                                        compact={true}
                                                    />
                                                </div>
                                            )}
                                            
                                            <div className={`grid gap-4 pt-2 mt-3 border-t border-[#27272a]/50 ${isNarrow ? 'grid-cols-1' : 'grid-cols-2'}`}>
                                                <div>
                                                    <label className="block text-[10px] text-gray-500 uppercase font-bold mb-1">Unit Cost</label>
                                                    <div className="flex items-center gap-1 bg-black/40 px-2 py-1.5 rounded border border-[#27272a]">
                                                        <span className="text-xs text-gray-500">$</span>
                                                        <input 
                                                            type="number"
                                                            value={item.materialCost}
                                                            onChange={(e) => onUpdateQuoteItem(item.id, 'materialCost', parseFloat(e.target.value) || 0)}
                                                            className="w-full bg-transparent text-sm text-white focus:outline-none tabular-nums font-medium"
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-500 uppercase font-bold mb-1">Labor (Est)</label>
                                                    <div className="flex items-center gap-1 bg-black/40 px-2 py-1.5 rounded border border-[#27272a]">
                                                        <Icons.Activity width={12} height={12} className="text-gray-500" />
                                                        <input 
                                                            type="number"
                                                            step="0.5"
                                                            value={item.hours}
                                                            onChange={(e) => onUpdateQuoteItem(item.id, 'hours', parseFloat(e.target.value) || 0)}
                                                            className="w-full bg-transparent text-sm text-white focus:outline-none tabular-nums font-medium"
                                                        />
                                                        <span className="text-[10px] text-gray-600">HR</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex justify-between items-center text-[11px] pt-1">
                                                <span className="text-gray-500">Row Total</span>
                                                <span className="text-blue-400 font-bold tabular-nums">
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
                            <div className={`bg-[#0c0c0e] overflow-x-hidden animate-fade-in w-full h-full flex flex-col ${isUltraNarrow ? 'p-2' : isNarrow ? 'p-4' : 'p-6'}`}>
                                <div className={`bg-[#121214] shadow-2xl border border-[#27272a] rounded-xl flex flex-col w-full mx-auto transition-all ${isUltraNarrow ? 'p-3' : 'p-6 sm:p-8'}`}>
                                    
                                    {/* Header Section */}
                                    <div className={`flex justify-between items-start mb-8 border-b border-[#27272a] pb-6 gap-6 ${isNarrow ? 'flex-col' : 'flex-row'}`}>
                                         <div className="flex flex-col gap-4 w-full">
                                             <div className="flex items-center gap-3">
                                                 <div className="p-2.5 bg-blue-600 rounded-lg text-white shadow-lg shadow-blue-500/20 shrink-0">
                                                     <Icons.Wind width={24} height={24} />
                                                 </div>
                                                 <div className="min-w-0 flex-1">
                                                     <h1 className="text-xl font-light tracking-tight text-white uppercase whitespace-nowrap">Proposal</h1>
                                                     <div className="flex items-center gap-2 mt-1">
                                                         <span className="text-[10px] text-gray-500 font-medium">ID:</span>
                                                         <input 
                                                             type="text" 
                                                             value={quoteInfo.number}
                                                             onChange={(e) => onUpdateQuoteInfo({ number: e.target.value })}
                                                             className="bg-transparent border-b border-dashed border-[#3f3f46] text-[10px] text-blue-400 font-medium focus:outline-none focus:border-blue-500 w-full max-w-[120px]"
                                                         />
                                                     </div>
                                                 </div>
                                             </div>
                                         </div>
                                         <div className={`${isNarrow ? 'text-left w-full' : 'text-right'} min-w-0 shrink-0`}>
                                             <div className="font-semibold text-base text-white truncate">HVAC AI ENGINEERING</div>
                                             <p className="text-[#71717a] text-[10px] mt-1">DYNAMICS LABORATORY UNIT 4</p>
                                             <p className="text-[#71717a] text-[10px]">SAN FRANCISCO, CA 94105</p>
                                         </div>
                                    </div>

                                    {/* ... [Client & Date Info Section - Same as previous] ... */}
                                    {/* Client & Date Info */}
                                    <div className={`grid gap-6 mb-8 ${isUltraNarrow ? 'grid-cols-1' : 'grid-cols-2'}`}>
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
                                                        className="bg-transparent border-b border-dashed border-[#3f3f46] text-right text-[10px] text-gray-300 focus:outline-none focus:border-blue-500 w-24 tabular-nums"
                                                    />
                                                </div>
                                                <div className={`flex items-center gap-3 ${isNarrow ? 'justify-start' : 'justify-end'}`}>
                                                    <span className="text-[9px] text-gray-500">LABOR</span>
                                                    <div className="flex items-center gap-1 font-medium text-[10px] text-blue-400">
                                                        <span>$</span>
                                                        <input 
                                                            type="number"
                                                            value={quoteInfo.laborRate}
                                                            onChange={(e) => onUpdateQuoteInfo({ laborRate: parseFloat(e.target.value) || 0 })}
                                                            className="bg-transparent border-b border-dashed border-[#3f3f46] text-right w-12 focus:outline-none tabular-nums"
                                                        />
                                                        <span className="text-gray-600">/hr</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* LINE ITEMS */}
                                    <div className="w-full mb-4">
                                        {!isUltraNarrow && (
                                            <div className="flex items-center border-b border-[#27272a] pb-2 mb-2 px-2 gap-2">
                                                <div className="flex-1 text-[9px] uppercase text-[#71717a] font-bold tracking-wider">Asset / Spec</div>
                                                <div className="w-12 text-center text-[9px] uppercase text-[#71717a] font-bold tracking-wider">Qty</div>
                                                <div className="w-20 text-right text-[9px] uppercase text-[#71717a] font-bold tracking-wider">Unit Cost</div>
                                                {!isNarrow && <div className="w-20 text-right text-[9px] uppercase text-[#71717a] font-bold tracking-wider">Labor</div>}
                                                <div className="w-24 text-right text-[9px] uppercase text-[#71717a] font-bold tracking-wider">Total</div>
                                            </div>
                                        )}

                                        <div className="space-y-1">
                                            {quoteItems.map(item => (
                                                <div key={item.id} className="flex flex-col bg-[#18181b]/50 border border-transparent hover:border-[#27272a] rounded-lg transition-colors">
                                                    <div className={`group relative ${isUltraNarrow ? 'p-3' : 'flex items-start py-2 px-2 gap-2'}`}>
                                                        
                                                         {/* Delete Button */}
                                                        <button 
                                                            onClick={() => onRemoveQuoteItem(item.id)}
                                                            className={`absolute z-10 text-rose-500 hover:bg-rose-500/10 rounded p-1 transition-all ${isUltraNarrow ? 'top-2 right-2' : '-left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 -translate-x-full'}`}
                                                        >
                                                            <Icons.Trash width={12} height={12} />
                                                        </button>

                                                        {/* Description Section */}
                                                        <div className={`${isUltraNarrow ? 'mb-3 pr-6' : 'flex-1 min-w-0'}`}>
                                                            <div className="flex items-center gap-2">
                                                                <input 
                                                                    type="text" 
                                                                    value={item.description}
                                                                    onChange={(e) => onUpdateQuoteItem(item.id, 'description', e.target.value)}
                                                                    className={`w-full bg-transparent text-gray-100 font-medium focus:outline-none placeholder-gray-600 ${isUltraNarrow ? 'text-sm mb-1' : 'text-xs'}`}
                                                                    placeholder="Component Name"
                                                                />
                                                                <button onClick={() => toggleRowComment(item.id)} className={`text-gray-500 hover:text-blue-400 ${item.comments && item.comments.length > 0 ? 'text-blue-400' : ''}`}>
                                                                    <Icons.MessageSquare width={10} height={10} />
                                                                </button>
                                                            </div>
                                                            <input 
                                                                type="text" 
                                                                value={item.sku}
                                                                onChange={(e) => onUpdateQuoteItem(item.id, 'sku', e.target.value)}
                                                                className="w-full bg-transparent text-[9px] text-gray-500 font-medium focus:outline-none"
                                                                placeholder="SKU / ID"
                                                            />
                                                        </div>

                                                        {/* Controls Container */}
                                                        <div className={`${isUltraNarrow ? 'grid grid-cols-2 gap-3 pt-2 border-t border-[#27272a]/50' : 'flex items-start gap-2 shrink-0'}`}>
                                                            
                                                            {/* QTY */}
                                                            <div className={`${isUltraNarrow ? '' : 'w-12 flex justify-center'}`}>
                                                                {isUltraNarrow && <label className="block text-[9px] text-gray-500 mb-0.5">Qty</label>}
                                                                <input 
                                                                    type="number" 
                                                                    value={item.quantity}
                                                                    onChange={(e) => onUpdateQuoteItem(item.id, 'quantity', parseInt(e.target.value) || 1)}
                                                                    className={`bg-transparent text-gray-300 focus:outline-none font-medium tabular-nums focus:text-white transition-colors ${isUltraNarrow ? 'w-full text-sm bg-black/20 rounded px-2 py-1' : 'w-8 text-center text-xs'}`}
                                                                />
                                                            </div>

                                                            {/* Unit Cost */}
                                                            <div className={`${isUltraNarrow ? '' : 'w-20 text-right'}`}>
                                                                {isUltraNarrow && <label className="block text-[9px] text-gray-500 mb-0.5">Unit Cost</label>}
                                                                <div className={`flex items-center ${isUltraNarrow ? 'bg-black/20 rounded px-2 py-1' : 'justify-end'}`}>
                                                                    <span className="text-[10px] text-gray-500 mr-1">$</span>
                                                                    <input 
                                                                        type="number"
                                                                        value={item.materialCost}
                                                                        onChange={(e) => onUpdateQuoteItem(item.id, 'materialCost', parseFloat(e.target.value) || 0)}
                                                                        className={`bg-transparent focus:outline-none font-medium tabular-nums text-gray-400 focus:text-white ${isUltraNarrow ? 'w-full text-sm' : 'w-14 text-right text-xs'}`}
                                                                    />
                                                                </div>
                                                            </div>

                                                            {/* Labor */}
                                                            {(!isNarrow) && (
                                                                <div className="w-20 text-right">
                                                                    <div className="flex items-center justify-end">
                                                                        <input 
                                                                            type="number"
                                                                            value={item.hours}
                                                                            step="0.5"
                                                                            onChange={(e) => onUpdateQuoteItem(item.id, 'hours', parseFloat(e.target.value) || 0)}
                                                                            className="bg-transparent focus:outline-none font-medium tabular-nums text-gray-500 focus:text-white w-10 text-right text-xs"
                                                                        />
                                                                        <span className="text-[9px] text-gray-600 ml-1">h</span>
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {/* Total */}
                                                            <div className={`${isUltraNarrow ? 'col-span-2 mt-1 pt-2 border-t border-[#27272a]/30 flex justify-between items-center' : 'w-24 text-right flex justify-end items-center'}`}>
                                                                {isUltraNarrow && <span className="text-[10px] font-bold text-gray-500 uppercase">Line Total</span>}
                                                                <span className={`font-bold tabular-nums text-white ${isUltraNarrow ? 'text-sm' : 'text-xs'}`}>
                                                                    ${((item.materialCost + (item.hours * quoteInfo.laborRate)) * item.quantity).toFixed(2)}
                                                                </span>
                                                            </div>

                                                        </div>
                                                    </div>
                                                    {expandedRowComments[item.id] && (
                                                        <div className="px-3 pb-3">
                                                            <CommentThread 
                                                                comments={item.comments} 
                                                                onAddComment={(text) => onAddComment(item.id, text)} 
                                                                contextId={item.id}
                                                                compact={true}
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <button 
                                        onClick={onAddQuoteItem}
                                        className="w-full py-3 border border-dashed border-[#3f3f46] rounded-lg text-[10px] text-gray-500 hover:text-blue-400 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all mt-4 flex items-center justify-center gap-2"
                                    >
                                        <Icons.Plus width={12} height={12} />
                                        <span>Add Asset Specification Line</span>
                                    </button>

                                    {/* Quote Summary Footer - Revised */}
                                    <div className="mt-8 pt-8 border-t border-[#27272a] flex flex-col items-end gap-6">
                                        
                                        {/* Financials */}
                                        <div className={`w-full max-w-sm space-y-3 bg-[#09090b]/40 p-5 rounded-xl border border-[#27272a] ${isNarrow ? 'w-full' : 'min-w-[300px]'}`}>
                                            <div className="flex justify-between text-[11px] text-gray-500">
                                                <span>Material Subtotal</span>
                                                <span className="font-medium tabular-nums text-gray-300">${materialSubtotal.toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between text-[11px] text-gray-500">
                                                <span>Labor Subtotal</span>
                                                <span className="font-medium tabular-nums text-gray-300">${laborSubtotal.toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between text-[11px] text-gray-600 italic">
                                                <span>Sales Tax (8.25%)</span>
                                                <span className="font-medium tabular-nums">${tax.toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between py-3 border-t border-[#27272a] text-base font-light text-white">
                                                <span className="uppercase text-[9px] font-bold text-blue-500 self-center">Grand Total</span>
                                                <span className="font-bold tabular-nums text-emerald-400">${(grandTotal + tax).toFixed(2)}</span>
                                            </div>
                                        </div>

                                        {/* Disclaimer - Moved Below */}
                                        <div className="w-full text-center sm:text-right">
                                            <p className="text-[10px] text-gray-600 italic">
                                                * Final engineering review, approval, and sign-off required.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-12 text-[8px] text-gray-800 text-center uppercase tracking-[0.3em] font-medium border-t border-[#27272a]/30 pt-8">
                                        Powered by Multi-Stage AI Logic. Valid 30 Days.
                                    </div>
                                </div>
                                
                                <div className={`flex justify-center mt-8 gap-4 flex-wrap ${isUltraNarrow ? 'flex-col' : 'flex-row'}`}>
                                    <button 
                                        onClick={() => setIsSendModalOpen(true)}
                                        className="flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg shadow-lg shadow-blue-500/20 transition-all text-[10px] font-bold uppercase tracking-wider min-w-[160px]"
                                    >
                                        <Icons.Send width={14} height={14} /> Send Proposal
                                    </button>
                                    <button 
                                        onClick={handlePrint}
                                        className="flex items-center justify-center gap-2 px-6 py-2.5 bg-[#18181b] hover:bg-[#27272a] text-gray-300 rounded-lg border border-[#3f3f46] transition-all text-[10px] font-medium min-w-[140px]"
                                    >
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
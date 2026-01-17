
import React, { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { Icons } from "../components/Icons";
import { StatusBadge, ToggleButton, MarkdownRenderer } from "../components/common";
import { HVACReportViewer } from "../components/HVACReportViewer";
import { DetectedComponent, QuoteItem, QuoteInfo, TeamMember, Comment } from "../types";
import { UserAvatar, CommentThread } from "../components/Comments";
import { performGroundedPricing, GroundedPriceResult } from "../services/aiService";
import { BackendAnalysisReport } from "../services/apiTypes";

type RightPanelTab = 'workspace' | 'analysis' | 'pricing' | 'quote';

// --- PRINT LAYOUT (WHITE PAPER PDF STYLE) ---
// High-fidelity proposal layout for professional PDF generation
const PrintLayout = ({ info, items, total, tax }: { info: QuoteInfo, items: QuoteItem[], total: number, tax: number }) => {
    // Recalculate strictly for print consistency
    const subtotalMat = items.reduce((acc, item) => acc + (item.materialCost * item.quantity), 0);
    const subtotalLab = items.reduce((acc, item) => acc + (item.hours * info.laborRate * item.quantity), 0);
    const calculatedTax = (subtotalMat + subtotalLab) * 0.0825;
    const calculatedTotal = subtotalMat + subtotalLab + calculatedTax;

    return (
        <div className="font-sans text-gray-900 max-w-[210mm] mx-auto bg-white min-h-[297mm] flex flex-col relative p-8 print:p-0">
            {/* Header */}
            <div className="flex justify-between items-start mb-12 border-b-2 border-gray-900 pb-8">
                <div>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white print:bg-blue-600 print-color-adjust-exact">
                            <Icons.Wind width={24} height={24} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-gray-900">HVAC AI</h1>
                            <p className="text-[10px] uppercase tracking-widest text-gray-500 font-medium">Engineering Intelligence</p>
                        </div>
                    </div>
                </div>
                <div className="text-right">
                    <h2 className="text-4xl font-light text-gray-400 uppercase tracking-widest mb-2">Proposal</h2>
                    <p className="font-mono text-lg font-bold text-gray-900">#{info.number}</p>
                    <p className="text-sm text-gray-500 mt-1">{info.date}</p>
                </div>
            </div>

            {/* Client Info Grid */}
            <div className="grid grid-cols-2 gap-12 mb-12">
                <div>
                    <h3 className="text-xs font-bold uppercase text-gray-400 tracking-widest mb-4">Prepared For</h3>
                    <div className="text-sm leading-relaxed">
                        <p className="font-bold text-lg text-gray-900 mb-1">{info.billToCompany}</p>
                        <p className="text-gray-600">Attn: {info.billToName}</p>
                        <p className="text-gray-600">Project Location: Site Unspecified</p>
                    </div>
                </div>
                <div className="text-right">
                    <h3 className="text-xs font-bold uppercase text-gray-400 tracking-widest mb-4">Provider</h3>
                    <div className="text-sm leading-relaxed text-gray-600">
                        <p className="font-bold text-gray-900">Dynamics Lab Unit 4</p>
                        <p>123 Innovation Dr.</p>
                        <p>San Francisco, CA 94105</p>
                        <p>support@hvac.ai</p>
                    </div>
                </div>
            </div>

            {/* Line Items */}
            <div className="mb-8">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b-2 border-gray-900 text-left">
                            <th className="py-3 font-bold uppercase text-xs tracking-wider text-gray-500 w-[40%]">Description</th>
                            <th className="py-3 font-bold uppercase text-xs tracking-wider text-gray-500 text-center">Qty</th>
                            <th className="py-3 font-bold uppercase text-xs tracking-wider text-gray-500 text-right">Unit Price</th>
                            <th className="py-3 font-bold uppercase text-xs tracking-wider text-gray-500 text-right">Labor (Hrs)</th>
                            <th className="py-3 font-bold uppercase text-xs tracking-wider text-gray-500 text-right">Total</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-700">
                        {items.map((item, idx) => {
                            const rowTotal = (item.materialCost + (item.hours * info.laborRate)) * item.quantity;
                            return (
                                <tr key={item.id} className={`border-b border-gray-100 ${idx % 2 === 0 ? 'bg-gray-50 print:bg-gray-50' : 'bg-white'}`}>
                                    <td className="py-4 pl-2">
                                        <p className="font-medium text-gray-900">{item.description}</p>
                                        <p className="text-xs font-mono text-gray-400 mt-0.5">{item.sku}</p>
                                    </td>
                                    <td className="py-4 text-center">{item.quantity}</td>
                                    <td className="py-4 text-right">${item.materialCost.toFixed(2)}</td>
                                    <td className="py-4 text-right">{item.hours}</td>
                                    <td className="py-4 text-right font-bold pr-2">${rowTotal.toFixed(2)}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Totals */}
            <div className="flex justify-end mb-16 break-inside-avoid">
                <div className="w-80 space-y-3">
                    <div className="flex justify-between text-sm text-gray-600">
                        <span>Subtotal (Materials)</span>
                        <span className="font-medium">${subtotalMat.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                        <span>Labor ({info.laborRate}/hr)</span>
                        <span className="font-medium">${subtotalLab.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600 border-b border-gray-200 pb-3">
                        <span>Tax (8.25%)</span>
                        <span className="font-medium">${calculatedTax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-baseline pt-1">
                        <span className="text-lg font-bold text-gray-900 uppercase tracking-widest">Total</span>
                        <span className="text-3xl font-light text-blue-600 print:text-blue-600 print-color-adjust-exact">${calculatedTotal.toFixed(2)}</span>
                    </div>
                </div>
            </div>

            {/* Footer / Terms */}
            <div className="mt-auto border-t border-gray-200 pt-8 text-xs text-gray-400 leading-relaxed break-inside-avoid">
                <h4 className="font-bold uppercase tracking-widest mb-2 text-gray-500">Terms & Conditions</h4>
                <p>
                    This proposal is valid for 30 days from the date of issue. 
                    Payment terms: Net 30. 
                    All material is guaranteed to be as specified. 
                    All work to be completed in a workmanlike manner according to standard practices. 
                    Any alteration or deviation from above specifications involving extra costs will be executed only upon written orders, and will become an extra charge over and above the estimate.
                </p>
                <div className="mt-12 flex justify-between items-end">
                    <div className="border-t border-gray-400 w-64 pt-2 text-center text-gray-900">Authorized Signature</div>
                    <div className="border-t border-gray-400 w-64 pt-2 text-center text-gray-900">Date</div>
                </div>
            </div>
        </div>
    );
};

// --- INTERACTIVE QUOTE BUILDER (DARK MODE) ---
const QuoteBuilder = ({ 
    items, 
    info, 
    onUpdateItem, 
    onRemoveItem, 
    onUpdateInfo, 
    onAddComment
}: { 
    items: QuoteItem[], 
    info: QuoteInfo, 
    onUpdateItem: (id: string, field: string, value: any) => void,
    onRemoveItem: (id: string) => void,
    onUpdateInfo: (info: Partial<QuoteInfo>) => void,
    onAddComment: (id: string, text: string) => void
}) => {
    const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});

    const toggleComments = (id: string) => {
        setExpandedComments(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const materialSubtotal = items.reduce((sum, item) => sum + (item.materialCost * item.quantity), 0);
    const laborSubtotal = items.reduce((sum, item) => sum + (item.laborCost * item.quantity), 0);
    const tax = (materialSubtotal + laborSubtotal) * 0.0825;
    const total = materialSubtotal + laborSubtotal + tax;

    return (
        <div className="flex flex-col bg-[#0c0c0e] min-h-full">
            {/* 1. Header Configuration */}
            <div className="p-6 bg-[#121214] border-b border-[#27272a]">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                        <Icons.FileText width={16} height={16} className="text-blue-500" />
                        Proposal Configuration
                    </h3>
                    <div className="text-[10px] text-gray-500 font-mono">#{info.number}</div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-3">
                        <div>
                            <label className="block text-[9px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Bill To Name</label>
                            <input 
                                type="text" 
                                value={info.billToName} 
                                onChange={(e) => onUpdateInfo({ billToName: e.target.value })} 
                                className="w-full bg-[#09090b] border border-[#27272a] rounded p-2 text-xs text-white focus:border-blue-500 focus:outline-none focus:bg-[#121214] transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-[9px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Company / Org</label>
                            <input 
                                type="text" 
                                value={info.billToCompany} 
                                onChange={(e) => onUpdateInfo({ billToCompany: e.target.value })} 
                                className="w-full bg-[#09090b] border border-[#27272a] rounded p-2 text-xs text-white focus:border-blue-500 focus:outline-none focus:bg-[#121214] transition-colors"
                            />
                        </div>
                    </div>
                    <div className="space-y-3">
                        <div>
                            <label className="block text-[9px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Proposal Date</label>
                            <input 
                                type="text" 
                                value={info.date} 
                                onChange={(e) => onUpdateInfo({ date: e.target.value })} 
                                className="w-full bg-[#09090b] border border-[#27272a] rounded p-2 text-xs text-white focus:border-blue-500 focus:outline-none focus:bg-[#121214] transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-[9px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Labor Rate ($/hr)</label>
                            <div className="relative">
                                <span className="absolute left-2.5 top-2 text-gray-500 text-xs">$</span>
                                <input 
                                    type="number" 
                                    value={info.laborRate} 
                                    onChange={(e) => onUpdateInfo({ laborRate: parseFloat(e.target.value) || 0 })} 
                                    className="w-full bg-[#09090b] border border-[#27272a] rounded pl-6 p-2 text-xs text-white focus:border-blue-500 focus:outline-none focus:bg-[#121214] transition-colors"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. Items Table - Full width with horizontal scroll support */}
            <div className="p-6">
                <div className="border border-[#27272a] rounded-lg bg-[#121214] overflow-hidden">
                    <div className="overflow-x-auto">
                        <div className="min-w-[600px]">
                            {/* Table Header */}
                            <div className="grid grid-cols-[1.5fr_0.8fr_0.4fr_0.6fr_0.5fr_0.6fr_0.5fr] gap-2 px-4 py-3 bg-[#18181b] border-b border-[#27272a] text-[9px] font-bold text-gray-500 uppercase tracking-widest sticky top-0 z-10 shadow-sm">
                                <div>Description</div>
                                <div>SKU / Model</div>
                                <div className="text-center">Qty</div>
                                <div className="text-right">Unit Cost</div>
                                <div className="text-right">Labor</div>
                                <div className="text-right">Total</div>
                                <div className="text-right">Actions</div>
                            </div>

                            {/* Table Rows */}
                            <div className="divide-y divide-[#27272a]">
                                {items.map(item => {
                                    const lineTotal = (item.materialCost + (item.hours * info.laborRate)) * item.quantity;
                                    const hasComments = item.comments && item.comments.length > 0;
                                    const isExpanded = expandedComments[item.id];

                                    return (
                                        <div key={item.id} className="group bg-[#121214] hover:bg-[#151518] transition-colors">
                                            <div className="grid grid-cols-[1.5fr_0.8fr_0.4fr_0.6fr_0.5fr_0.6fr_0.5fr] gap-2 px-4 py-3 items-center">
                                                {/* Description */}
                                                <input 
                                                    type="text" 
                                                    value={item.description} 
                                                    onChange={(e) => onUpdateItem(item.id, 'description', e.target.value)}
                                                    className="w-full bg-transparent border-b border-transparent focus:border-blue-500 hover:border-[#3f3f46] text-xs text-white px-1 py-0.5 focus:outline-none transition-all placeholder-gray-600"
                                                    placeholder="Item Name"
                                                />
                                                {/* SKU */}
                                                <input 
                                                    type="text" 
                                                    value={item.sku} 
                                                    onChange={(e) => onUpdateItem(item.id, 'sku', e.target.value)}
                                                    className="w-full bg-transparent border-b border-transparent focus:border-blue-500 hover:border-[#3f3f46] text-[10px] font-mono text-gray-400 px-1 py-0.5 focus:outline-none transition-all uppercase"
                                                    placeholder="SKU"
                                                />
                                                {/* Quantity */}
                                                <input 
                                                    type="number" 
                                                    value={item.quantity} 
                                                    onChange={(e) => onUpdateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                                                    className="w-full bg-transparent border border-[#27272a] rounded bg-[#09090b] focus:border-blue-500 text-xs text-white text-center py-1 focus:outline-none transition-all"
                                                />
                                                {/* Cost */}
                                                <div className="relative group/input">
                                                    <span className="absolute left-1 top-1 text-gray-600 text-[10px]">$</span>
                                                    <input 
                                                        type="number" 
                                                        value={item.materialCost} 
                                                        onChange={(e) => onUpdateItem(item.id, 'materialCost', parseFloat(e.target.value) || 0)}
                                                        className="w-full bg-transparent border border-[#27272a] rounded bg-[#09090b] focus:border-blue-500 text-xs text-white text-right pl-3 pr-2 py-1 focus:outline-none transition-all"
                                                    />
                                                </div>
                                                {/* Labor */}
                                                <div className="flex items-center gap-1 justify-end">
                                                    <input 
                                                        type="number" 
                                                        value={item.hours} 
                                                        onChange={(e) => onUpdateItem(item.id, 'hours', parseFloat(e.target.value) || 0)}
                                                        className="w-12 bg-transparent border border-[#27272a] rounded bg-[#09090b] focus:border-blue-500 text-xs text-white text-right px-1 py-1 focus:outline-none transition-all"
                                                    />
                                                    <span className="text-[9px] text-gray-600 font-bold">HR</span>
                                                </div>
                                                {/* Total */}
                                                <div className="text-right text-xs font-bold text-white tabular-nums">
                                                    ${lineTotal.toFixed(2)}
                                                </div>
                                                {/* Actions */}
                                                <div className="flex justify-end gap-1">
                                                    <button 
                                                        onClick={() => toggleComments(item.id)}
                                                        className={`p-1.5 rounded transition-all relative ${
                                                            isExpanded || hasComments 
                                                            ? 'text-blue-400 bg-blue-500/10 hover:bg-blue-500/20' 
                                                            : 'text-gray-600 hover:text-white hover:bg-[#27272a]'
                                                        }`}
                                                        title="Team Comments"
                                                    >
                                                        <Icons.MessageSquare width={12} height={12} />
                                                        {hasComments && <div className="absolute top-0 right-0 w-1.5 h-1.5 bg-blue-500 rounded-full border border-[#121214]"></div>}
                                                    </button>
                                                    <button 
                                                        onClick={() => onRemoveItem(item.id)}
                                                        className="p-1.5 rounded text-gray-600 hover:text-rose-500 hover:bg-rose-500/10 transition-all"
                                                        title="Delete Item"
                                                    >
                                                        <Icons.Trash width={12} height={12} />
                                                    </button>
                                                </div>
                                            </div>
                                            {/* Inline Comments */}
                                            {isExpanded && (
                                                <div className="px-4 pb-4 pt-0 bg-[#09090b] border-b border-[#27272a] animate-fade-in pl-12 border-l-2 border-l-blue-500/50 ml-4 mb-2 rounded-r-lg">
                                                    <div className="flex items-center gap-2 py-2 mb-2 border-b border-[#27272a]/50">
                                                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Internal Notes</span>
                                                    </div>
                                                    <div className="h-40">
                                                        <CommentThread 
                                                            comments={item.comments} 
                                                            onAddComment={(text) => onAddComment(item.id, text)} 
                                                            contextId={item.id}
                                                            compact={true}
                                                            placeholder={`Add note for ${item.sku}...`}
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                                
                                {items.length === 0 && (
                                    <div className="py-12 text-center text-gray-600 flex flex-col items-center">
                                        <Icons.FileText width={32} height={32} className="opacity-20 mb-3" />
                                        <p className="text-xs">No items in this quote.</p>
                                        <p className="text-[10px] opacity-60 mt-1">Add items manually or run analysis.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. Footer Summary */}
            <div className="p-6 bg-[#121214] border-t border-[#27272a] mt-auto">
                <div className="flex justify-end">
                    <div className="w-64 space-y-2">
                        <div className="flex justify-between text-xs">
                            <span className="text-gray-500 font-medium">Material Subtotal</span>
                            <span className="text-gray-300 tabular-nums">${materialSubtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                            <span className="text-gray-500 font-medium">Labor Subtotal</span>
                            <span className="text-gray-300 tabular-nums">${laborSubtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                            <span className="text-gray-500 font-medium">Tax (8.25%)</span>
                            <span className="text-gray-300 tabular-nums">${tax.toFixed(2)}</span>
                        </div>
                        <div className="h-px bg-[#27272a] my-2"></div>
                        <div className="flex justify-between items-baseline">
                            <span className="text-sm font-bold text-white uppercase tracking-wider">Total</span>
                            <span className="text-xl font-light text-blue-400 tabular-nums">${total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// 2. Portal Component for Printing (Hidden on Screen)
// Updated to use zero-size technique instead of display:none to ensure availability for print media
const PrintableQuote = (props: React.ComponentProps<typeof PrintLayout>) => {
    // Render directly to body to escape #root constraints during print
    return createPortal(
        <div id="printable-quote-container" className="fixed top-0 left-0 w-0 h-0 overflow-hidden print:w-full print:h-full print:static print:overflow-visible print:block z-[-1]">
            <div className="bg-white print:p-0">
               <PrintLayout {...props} />
            </div>
        </div>,
        document.body
    );
};

const SendProposalModal = ({ isOpen, onClose, teamMembers, quoteNumber, onSend }: { isOpen: boolean, onClose: () => void, teamMembers: TeamMember[], quoteNumber: string, onSend: (recipients: string[], note: string) => void }) => {
    const [note, setNote] = useState("");
    const [selected, setSelected] = useState<string[]>([]);
    
    if (!isOpen) return null;

    const toggleMember = (name: string) => {
        if(selected.includes(name)) setSelected(selected.filter(s => s !== name));
        else setSelected([...selected, name]);
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative bg-[#121214] border border-[#27272a] rounded-xl p-6 w-full max-w-md shadow-2xl animate-fade-in">
                <h3 className="text-lg font-medium text-white mb-1">Send Proposal {quoteNumber}</h3>
                <p className="text-xs text-gray-500 mb-4">Share this quote with project stakeholders.</p>
                
                <div className="space-y-3 mb-6">
                    <label className="text-xs font-bold text-gray-500 uppercase">Recipients</label>
                    <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar border border-[#27272a] rounded-lg p-2 bg-[#09090b]">
                        {teamMembers.map((m) => (
                            <div key={m.name} onClick={() => toggleMember(m.name)} className={`flex items-center gap-3 p-2 rounded cursor-pointer transition-colors ${selected.includes(m.name) ? 'bg-blue-600/20 border border-blue-600/50' : 'hover:bg-[#18181b] border border-transparent'}`}>
                                <div className={`w-4 h-4 rounded border flex items-center justify-center ${selected.includes(m.name) ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-600'}`}>
                                    {selected.includes(m.name) && <Icons.CheckCircle width={10} height={10} />}
                                </div>
                                <div className="text-sm text-gray-300">{m.name}</div>
                                <div className="text-[10px] text-gray-500 ml-auto">{m.role}</div>
                            </div>
                        ))}
                    </div>
                    
                    <label className="text-xs font-bold text-gray-500 uppercase block mt-4">Personal Note</label>
                    <textarea 
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        className="w-full bg-[#09090b] border border-[#27272a] rounded-lg p-3 text-sm text-white focus:border-blue-500 focus:outline-none h-24 resize-none"
                        placeholder="Add a message..."
                    />
                </div>
                
                <div className="flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 text-xs text-gray-400 hover:text-white">Cancel</button>
                    <button 
                        onClick={() => { onSend(selected, note); onClose(); }}
                        disabled={selected.length === 0}
                        className={`px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg flex items-center gap-2 ${selected.length === 0 ? 'opacity-50' : 'hover:bg-blue-500'}`}
                    >
                        <Icons.Send width={12} height={12} /> Send Now
                    </button>
                </div>
            </div>
        </div>
    );
};

// ... PricingCard and ComponentCard implementations (unchanged) ...
const PricingCard = ({ 
    item, 
    comp, 
    isExpanded, 
    onToggle, 
    onUpdateItem, 
    onAudit, 
    isAuditing,
    isNarrow,
    isUltraNarrow
}: { 
    item: QuoteItem, 
    comp: DetectedComponent, 
    isExpanded: boolean, 
    onToggle: () => void, 
    onUpdateItem: (field: string, value: any) => void,
    onAudit?: () => void,
    isAuditing?: boolean,
    isNarrow?: boolean,
    isUltraNarrow?: boolean,
    key?: React.Key
}) => {
    // Calculate total for this line
    const total = (item.materialCost + (item.hours * 115)) * item.quantity; 

    return (
        <div 
            className={`group bg-[#121214] border rounded-lg transition-all duration-300 overflow-hidden ${
                isExpanded ? 'border-blue-500/50 ring-1 ring-blue-500/10 shadow-lg scale-[1.01]' : 'border-[#27272a] hover:border-blue-500/30'
            } ${comp.groundedData ? 'border-l-[3px] border-l-emerald-500' : ''}`}
        >
            {/* PRICING HEADER - Responsive Transactional Layout */}
            <div 
                className={`p-3 flex ${isUltraNarrow ? 'flex-col items-start gap-3' : 'items-center justify-between gap-4'} cursor-pointer hover:bg-[#18181b]/50 transition-colors`} 
                onClick={onToggle}
            >
                {/* Left: Identity */}
                <div className={`flex items-center gap-3 min-w-0 ${isUltraNarrow ? 'w-full' : 'flex-1'}`}>
                    <div className={`p-2 rounded-md shrink-0 ${comp.groundedData ? 'bg-emerald-500/10 text-emerald-500' : 'bg-[#18181b] text-gray-400'}`}>
                        {comp.groundedData ? <Icons.CheckCircle width={16} height={16} /> : <Icons.Box width={16} height={16} />}
                    </div>
                    <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-white truncate">{item.description}</span>
                            {comp.groundedData && !isUltraNarrow && <span className="text-[9px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/20 font-bold uppercase tracking-wide">Verified</span>}
                        </div>
                        <div className="text-[10px] text-gray-500 font-mono tracking-tight uppercase flex items-center gap-2">
                            <span>{item.sku}</span>
                            <span className="w-1 h-1 rounded-full bg-gray-700"></span>
                            <span className="text-blue-400/80">{comp.type}</span>
                        </div>
                    </div>
                </div>

                {/* Right: Financial Inputs & Actions */}
                <div 
                    className={`flex items-center ${isUltraNarrow ? 'w-full justify-between gap-2' : (isNarrow ? 'gap-2 shrink-0' : 'gap-4 shrink-0')}`} 
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Input Group */}
                    <div className={`flex items-center ${isNarrow || isUltraNarrow ? 'gap-2' : 'gap-4'}`}>
                        {/* Qty Input */}
                        <div className="flex items-center gap-1.5 bg-black/40 border border-[#27272a] rounded px-2 py-1 focus-within:border-blue-500/50 transition-colors">
                            <span className="text-[9px] text-gray-500 font-bold uppercase">Qty</span>
                            <input 
                                type="number" 
                                value={item.quantity}
                                onChange={(e) => onUpdateItem('quantity', parseFloat(e.target.value) || 0)}
                                className="w-8 bg-transparent text-xs text-white text-center font-medium focus:outline-none"
                            />
                        </div>

                        {/* Unit Cost Input */}
                        <div className="flex items-center gap-1 bg-black/40 border border-[#27272a] rounded px-2 py-1 focus-within:border-blue-500/50 transition-colors">
                            <span className="text-[10px] text-gray-500">$</span>
                            <input 
                                type="number" 
                                value={item.materialCost}
                                onChange={(e) => onUpdateItem('materialCost', parseFloat(e.target.value) || 0)}
                                className={`${isNarrow ? 'w-12' : 'w-16'} bg-transparent text-xs text-white text-right font-medium focus:outline-none tabular-nums`}
                            />
                        </div>
                    </div>

                    {/* Right Side Group: Total + Actions */}
                    <div className={`flex items-center ${isNarrow ? 'gap-2' : 'gap-4'} ${isUltraNarrow ? 'ml-auto' : ''}`}>
                         {/* Total Display */}
                        <div className={`${isNarrow ? 'w-16' : 'w-20'} text-right`}>
                            <div className="text-sm font-bold text-white tabular-nums">${total.toFixed(2)}</div>
                        </div>

                        {/* Actions */}
                        <div className={`flex items-center gap-1 ${!isUltraNarrow ? 'border-l border-[#27272a] pl-2' : ''}`}>
                            <button 
                                onClick={(e) => { e.stopPropagation(); onAudit && onAudit(); }}
                                disabled={isAuditing}
                                className={`p-1.5 rounded transition-all ${isAuditing ? 'text-blue-400 animate-spin' : 'text-gray-500 hover:text-blue-400 hover:bg-[#27272a]'}`}
                                title="Sync Market Price"
                            >
                                <Icons.RefreshCw width={14} height={14} />
                            </button>
                            <div className={`transition-transform duration-300 text-gray-500 ${isExpanded ? 'rotate-180' : ''}`}>
                                <Icons.ChevronDown width={14} height={14} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* EXPANDED CONTENT - STRICTLY ECONOMICS ONLY */}
            {isExpanded && (
                <div className="animate-fade-in border-t border-[#27272a] bg-[#0c0c0e] p-4 space-y-4">
                    
                    {/* NEW: MARKET SPECIFICATIONS INTELLIGENCE (If Grounded) */}
                    {comp.groundedData && (
                        <div className="mb-2">
                            <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                                <Icons.Cpu width={12} height={12} />
                                Market Specifications
                            </h4>
                            <div className="bg-[#18181b] rounded-lg border border-[#27272a] p-3 space-y-3">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <div className="text-[9px] text-gray-500 uppercase font-bold tracking-wider mb-0.5">Manufacturer</div>
                                        <div className="text-xs text-white font-medium truncate">{comp.groundedData.manufacturer || comp.manufacturer || 'Unknown'}</div>
                                    </div>
                                    <div>
                                        <div className="text-[9px] text-gray-500 uppercase font-bold tracking-wider mb-0.5">Model / SKU</div>
                                        <div className="text-xs text-blue-400 font-mono truncate">{comp.groundedData.foundSku || comp.sku}</div>
                                    </div>
                                </div>
                                
                                {/* Specs Grid */}
                                {comp.groundedData.specs && Object.keys(comp.groundedData.specs).length > 0 && (
                                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 pt-2 border-t border-[#27272a]">
                                        {Object.entries(comp.groundedData.specs).slice(0, 6).map(([k, v]) => (
                                            <div key={k} className="flex flex-col min-w-0">
                                                <span className="text-[8px] text-gray-600 uppercase font-bold tracking-tight truncate">{k}</span>
                                                <span className="text-[10px] text-gray-300 truncate">{v}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                
                                <div className="flex items-center justify-between pt-2 mt-1 border-t border-[#27272a]">
                                    <div className="text-[10px] text-gray-500 italic truncate max-w-[200px]">
                                        {comp.groundedData.foundName}
                                    </div>
                                    <a 
                                        href={comp.groundedData.sources[0]?.uri} 
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-[9px] text-blue-500 hover:text-blue-400 flex items-center gap-1"
                                    >
                                        Source <Icons.ExternalLink width={9} height={9} />
                                    </a>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* MARKET VERIFICATION BANNER (Reduced Size if Specs Shown) */}
                    {!comp.groundedData && (
                        <div className="bg-blue-500/5 border border-blue-500/10 rounded-lg p-3 flex items-center gap-3">
                            <div className="text-blue-500"><Icons.Info width={14} height={14} /></div>
                            <div>
                                <div className="text-xs text-blue-400 font-medium">Estimated Pricing</div>
                                <div className="text-[10px] text-gray-500">Run sync to fetch real-time distributor data.</div>
                            </div>
                        </div>
                    )}
                    
                    {/* FINANCIALS GRID - SLEEK REDESIGN */}
                    <div className="grid grid-cols-2 gap-3">
                        {/* Labor Estimate Block */}
                        <div className="bg-[#121214] p-3 rounded border border-[#27272a]">
                            <div className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-3">Labor Estimate</div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] text-gray-400">Install Time</span>
                                    <div className="flex items-center gap-1">
                                        <input 
                                            type="number" 
                                            value={item.hours}
                                            onChange={(e) => onUpdateItem('hours', parseFloat(e.target.value) || 0)}
                                            className="w-10 bg-[#09090b] border border-[#27272a] rounded text-right text-xs text-white px-1 py-0.5 focus:border-blue-500 focus:outline-none transition-colors"
                                        />
                                        <span className="text-[10px] text-gray-500">hrs</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] text-gray-400">Rate</span>
                                    <span className="text-[10px] text-gray-500 font-mono">$115/hr</span>
                                </div>
                            </div>
                        </div>

                        {/* Total Value Block - Sleek Gradient Container */}
                        <div className="bg-gradient-to-br from-[#121214] to-[#18181b] p-3 rounded border border-[#27272a] flex flex-col justify-center relative overflow-hidden">
                            {/* Subtle Glow Effect */}
                            <div className="absolute top-0 right-0 p-8 bg-blue-500/5 rounded-full blur-xl -mr-4 -mt-4 pointer-events-none"></div>
                            
                            <div className="relative z-10 flex flex-col h-full justify-between">
                                <div className="flex justify-between items-start">
                                    <div className="text-[9px] font-bold text-blue-400 uppercase tracking-widest">Net Value</div>
                                    <Icons.DollarSign width={12} height={12} className="text-gray-600" />
                                </div>
                                <div>
                                    <div className="text-xl font-light text-white tabular-nums tracking-tight">
                                        ${(item.materialCost + ((item.hours * 115))).toFixed(2)}
                                    </div>
                                    <div className="text-[9px] text-gray-600 mt-0.5">Material + Labor</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const ComponentCard = ({ 
    comp, 
    isExpanded, 
    onToggle, 
    onAddComment, 
    onMouseEnter, 
    onMouseLeave, 
    onUpdate, 
    onDelete, 
    onAudit,
    isAuditing,
    key
}: { 
    comp: DetectedComponent, 
    isExpanded: boolean, 
    onToggle: () => void, 
    onAddComment: (text: string) => void, 
    onMouseEnter: () => void, 
    onMouseLeave: () => void, 
    onUpdate: (updates: Partial<DetectedComponent>) => void, 
    onDelete: () => void, 
    onAudit?: (comp: DetectedComponent) => void, 
    isAuditing?: boolean,
    key?: React.Key
}) => {
    // UPDATED: Added 'comments' state to activeTab type
    const [activeTab, setActiveTab] = useState<'specs' | 'economics' | 'comments'>('specs');

    useEffect(() => {
        if (isExpanded) {
            setActiveTab('specs'); // Default to specs when opening
        }
    }, [isExpanded]);

    return (
        <div 
            id={`comp-card-${comp.id}`}
            className={`group bg-[#121214] border rounded-lg transition-all duration-300 overflow-hidden ${
                isExpanded ? 'border-blue-500/50 ring-1 ring-blue-500/10 shadow-lg scale-[1.01]' : 'border-[#27272a] hover:border-blue-500/30'
            } ${comp.groundedData ? 'border-l-[3px] border-l-emerald-500' : ''}`}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            {/* Header */}
            <div 
                className="p-3 flex items-center justify-between gap-4 cursor-pointer hover:bg-[#18181b]/50 transition-colors"
                onClick={onToggle}
            >
                {/* Left: Identity */}
                <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className={`p-2 rounded-md shrink-0 ${comp.groundedData ? 'bg-emerald-500/10 text-emerald-500' : 'bg-[#18181b] text-gray-400'}`}>
                        {comp.groundedData ? <Icons.CheckCircle width={16} height={16} /> : <Icons.Box width={16} height={16} />}
                    </div>
                    <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 min-w-0">
                             {/* READ-ONLY TITLE AS REQUESTED */}
                             <span className="text-sm font-bold text-white truncate">{comp.name}</span>
                             {comp.groundedData && <span className="text-[9px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/20 font-bold uppercase tracking-wide flex-shrink-0">Verified</span>}
                        </div>
                        <div className="text-[10px] text-gray-500 font-mono tracking-tight uppercase flex items-center gap-2">
                            <span>{comp.id}</span>
                            <span className="w-1 h-1 rounded-full bg-gray-700"></span>
                            <span className="text-blue-400/80">{comp.type}</span>
                        </div>
                    </div>
                </div>
                
                 {/* Right: Actions */}
                 <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    {onAudit && (
                        <button 
                            onClick={() => onAudit(comp)}
                            disabled={isAuditing}
                            className={`p-1.5 rounded transition-all ${isAuditing ? 'text-blue-400 animate-spin' : 'text-gray-500 hover:text-blue-400 hover:bg-[#27272a]'}`}
                            title="Audit Pricing"
                        >
                            <Icons.RefreshCw width={14} height={14} />
                        </button>
                    )}
                    <button 
                        onClick={onDelete}
                        className="p-1.5 rounded text-gray-600 hover:text-rose-500 hover:bg-rose-500/10 transition-all"
                    >
                        <Icons.Trash width={14} height={14} />
                    </button>
                     <div className={`transition-transform duration-300 text-gray-500 ${isExpanded ? 'rotate-180' : ''}`} onClick={onToggle}>
                        <Icons.ChevronDown width={14} height={14} />
                    </div>
                 </div>
            </div>

            {/* Expanded Content with Tabs */}
            {isExpanded && (
                <div className="animate-fade-in border-t border-[#27272a] bg-[#0c0c0e]">
                    {/* NEW: Updated Tab Navigation with integrated Chat Action */}
                    <div className="flex items-center justify-between px-4 border-b border-[#27272a] bg-[#121214]">
                        <div className="flex items-center gap-6">
                            <button 
                                onClick={() => setActiveTab('specs')}
                                className={`py-3 text-[10px] font-bold uppercase tracking-wider border-b-2 transition-colors ${activeTab === 'specs' ? 'border-blue-500 text-blue-400' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
                            >
                                Properties
                            </button>
                            <button 
                                onClick={() => setActiveTab('economics')}
                                className={`py-3 text-[10px] font-bold uppercase tracking-wider border-b-2 transition-colors ${activeTab === 'economics' ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
                            >
                                Financials
                            </button>
                        </div>
                        {/* SLEEK CHAT ICON TOGGLE */}
                        <button 
                            onClick={() => setActiveTab(activeTab === 'comments' ? 'specs' : 'comments')}
                            className={`p-3 hover:bg-[#18181b] transition-colors relative border-b-2 ${activeTab === 'comments' ? 'border-blue-500 text-blue-400' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
                            title="Team Notes"
                        >
                            <Icons.MessageSquare width={14} height={14} />
                            {comp.comments && comp.comments.length > 0 && activeTab !== 'comments' && (
                                <span className="absolute top-2.5 right-2 w-1.5 h-1.5 bg-blue-500 rounded-full border border-[#121214]"></span>
                            )}
                        </button>
                    </div>

                    <div className="p-4 space-y-6 min-h-[300px]">
                        {activeTab === 'specs' && (
                            <div className="space-y-6 animate-fade-in">
                                {/* Component Identity */}
                                <div>
                                    <div className="flex items-center gap-2 mb-2 px-1">
                                        <Icons.Box width={12} height={12} className="text-blue-500" />
                                        <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Component Identity</h4>
                                    </div>
                                    <div className="bg-[#121214] border border-[#27272a] rounded-lg overflow-hidden divide-y divide-[#27272a]">
                                        <div className="grid grid-cols-3 px-3 py-2.5 hover:bg-[#18181b] transition-colors">
                                            <div className="text-[10px] font-medium text-gray-500 uppercase tracking-wide flex items-center">Tag ID</div>
                                            <div className="col-span-2 text-xs text-blue-400 font-mono tracking-tight font-medium">{comp.id}</div>
                                        </div>
                                        <div className="grid grid-cols-3 px-3 py-2.5 hover:bg-[#18181b] transition-colors">
                                            <div className="text-[10px] font-medium text-gray-500 uppercase tracking-wide flex items-center">Asset Type</div>
                                            <div className="col-span-2 text-xs text-gray-200 font-medium">{comp.type}</div>
                                        </div>
                                        <div className="grid grid-cols-3 px-3 py-2.5 hover:bg-[#18181b] transition-colors group/row">
                                            <div className="text-[10px] font-medium text-gray-500 uppercase tracking-wide flex items-center">Description</div>
                                            <div className="col-span-2">
                                                <input 
                                                    type="text" 
                                                    value={comp.description}
                                                    onChange={(e) => onUpdate({ description: e.target.value })}
                                                    className="w-full bg-transparent border-0 p-0 text-xs text-gray-400 font-normal focus:outline-none focus:ring-0 placeholder-gray-700 italic"
                                                    placeholder="Add details..."
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-3 px-3 py-2.5 hover:bg-[#18181b] transition-colors">
                                            <div className="text-[10px] font-medium text-gray-500 uppercase tracking-wide flex items-center">Manufacturer</div>
                                            <div className="col-span-2 text-xs text-gray-200 font-medium">{comp.manufacturer || 'Generic / Unspecified'}</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Engineering Specifications Table */}
                                {comp.technicalSpecs && Object.keys(comp.technicalSpecs).length > 0 ? (
                                    <div>
                                        <div className="flex items-center gap-2 mb-2 px-1">
                                            <Icons.List width={12} height={12} className="text-blue-500" />
                                            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Engineering Specifications</h4>
                                        </div>
                                        <div className="bg-[#121214] border border-[#27272a] rounded-lg overflow-hidden divide-y divide-[#27272a]">
                                            {Object.entries(comp.technicalSpecs).map(([key, value]) => (
                                                <div key={key} className="grid grid-cols-3 px-3 py-2.5 hover:bg-[#18181b] transition-colors">
                                                    <div className="text-[10px] font-medium text-gray-500 uppercase tracking-wide flex items-center">{key}</div>
                                                    <div className="col-span-2 text-xs text-gray-200 font-medium">{value}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-6 border border-dashed border-[#27272a] rounded-lg bg-[#121214]/50">
                                        <p className="text-[10px] text-gray-600 uppercase tracking-widest">No technical specs extracted</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'economics' && (
                            <div className="space-y-4 animate-fade-in">
                                {/* Pricing Card (Reused Logic) */}
                                <div className="bg-[#121214] rounded-lg border border-[#27272a] overflow-hidden">
                                    {/* Header */}
                                    <div className="px-4 py-3 border-b border-[#27272a] bg-[#18181b]/50 flex justify-between items-center">
                                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Unit Cost Analysis</span>
                                        <div className="flex items-center gap-2">
                                            <div className={`text-[9px] px-2 py-0.5 rounded border uppercase font-bold tracking-wider ${comp.groundedData ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' : 'text-gray-400 bg-gray-500/10 border-gray-500/20'}`}>
                                                {comp.groundedData ? 'Verified' : 'Estimate'}
                                            </div>
                                            <button 
                                                onClick={() => onAudit && onAudit(comp)}
                                                disabled={isAuditing}
                                                className={`p-1.5 rounded-md border transition-all ${isAuditing ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' : 'bg-[#121214] border-[#27272a] text-gray-500 hover:text-blue-400 hover:border-blue-500/30'}`}
                                                title="Sync Market Price"
                                            >
                                                {isAuditing ? (
                                                    <Icons.RefreshCw width={12} height={12} className="animate-spin" />
                                                ) : (
                                                    <Icons.RefreshCw width={12} height={12} />
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="p-5 flex flex-col gap-4">
                                        {/* Price Display */}
                                        <div className="flex items-baseline justify-between">
                                            <div className="flex-1">
                                                {/* EDITABLE COST INPUT */}
                                                <div className="flex items-center gap-2">
                                                    <span className="text-2xl font-light text-gray-500">$</span>
                                                    <input 
                                                        type="number" 
                                                        value={comp.cost}
                                                        onChange={(e) => onUpdate({ cost: parseFloat(e.target.value) || 0 })}
                                                        className="bg-transparent text-3xl font-light text-white tabular-nums tracking-tight focus:outline-none w-full border-b border-transparent focus:border-blue-500 transition-colors"
                                                        placeholder="0.00"
                                                    />
                                                </div>
                                                <div className="text-[10px] text-gray-500 mt-1 font-medium">
                                                    {comp.groundedData ? 'Live Distributor Pricing' : comp.sku !== 'GENERIC' ? 'Internal Catalog Estimate' : 'Unverified Estimate'}
                                                </div>
                                            </div>
                                            {comp.sku !== 'GENERIC' && !comp.groundedData && (
                                                <div className="px-2 py-1 bg-gray-800 rounded text-[10px] text-gray-400 font-mono">
                                                    {comp.sku}
                                                </div>
                                            )}
                                        </div>

                                        {/* Audit Result Display */}
                                        {comp.groundedData && (
                                            <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-lg p-3">
                                                <div className="flex items-start gap-3">
                                                    <div className="p-1.5 bg-emerald-500/10 rounded-md text-emerald-500 mt-0.5">
                                                        <Icons.CheckCircle width={14} height={14} />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="text-xs font-bold text-emerald-400 mb-0.5">Market Verified</div>
                                                        <p className="text-[10px] text-gray-400 leading-relaxed italic mb-3">
                                                            "{comp.groundedData.sourceDescription}"
                                                        </p>
                                                        
                                                        {comp.groundedData.specs && Object.keys(comp.groundedData.specs).length > 0 && (
                                                            <div className="mb-3 grid grid-cols-2 gap-1 bg-black/20 p-2 rounded border border-[#27272a]">
                                                                {Object.entries(comp.groundedData.specs).slice(0, 4).map(([k, v]) => (
                                                                    <div key={k} className="flex flex-col">
                                                                        <span className="text-[8px] text-gray-600 uppercase font-bold tracking-tight">{k}</span>
                                                                        <span className="text-[9px] text-gray-300 font-medium truncate">{v}</span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}

                                                        <div className="mt-2 flex items-center gap-2">
                                                            <a 
                                                                href={comp.groundedData.sources[0]?.uri} 
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                className="text-[10px] text-blue-400 hover:underline flex items-center gap-1"
                                                            >
                                                                View Source <Icons.ExternalLink width={10} height={10} />
                                                            </a>
                                                            <span className="text-[10px] text-gray-600">•</span>
                                                            <span className="text-[10px] text-gray-600">{comp.groundedData.lastUpdated}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                
                                <div>
                                    <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Labor Estimate</h4>
                                    <div className="bg-[#121214] p-3 rounded border border-[#27272a] space-y-2">
                                        <div className="flex justify-between text-[11px] items-center pb-2 border-b border-[#27272a]">
                                            <span className="text-gray-400">Install Time</span>
                                            <div className="flex items-center gap-1">
                                                <input 
                                                    type="number" 
                                                    value={comp.estimatedInstallHours || 0}
                                                    onChange={(e) => onUpdate({ estimatedInstallHours: parseFloat(e.target.value) || 0 })}
                                                    className="w-16 bg-transparent text-right text-white font-medium focus:outline-none border-b border-transparent focus:border-blue-500 transition-colors"
                                                />
                                                <span className="text-white font-medium">hrs</span>
                                            </div>
                                        </div>
                                        <div className="flex justify-between text-[11px] items-center">
                                            <span className="text-gray-400">Hourly Rate</span>
                                            <span className="text-white font-medium">$115/hr</span>
                                        </div>
                                        <div className="pt-2 mt-1 flex justify-between text-xs font-bold">
                                            <span className="text-gray-500">Labor Total</span>
                                            <span className="text-blue-400">${((comp.estimatedInstallHours || 0) * 115).toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div>
                                    <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Total Value</h4>
                                    <div className="bg-[#121214] p-3 rounded border border-[#27272a] flex items-center justify-center h-[80px]">
                                        <div className="text-center">
                                            <span className="text-2xl font-light text-white tabular-nums block mb-1">
                                                ${(comp.cost + ((comp.estimatedInstallHours || 0) * 115)).toFixed(2)}
                                            </span>
                                            <span className="text-[9px] text-gray-500 uppercase tracking-widest">Material + Labor</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* NEW: DEDICATED COMMENTS TAB VIEW */}
                        {activeTab === 'comments' && (
                            <div className="h-[400px] flex flex-col animate-fade-in">
                                <div className="flex items-center justify-between mb-4 px-1">
                                    <div className="flex items-center gap-2">
                                        <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Team Discussion</h4>
                                        <div className="h-px w-8 bg-gray-800"></div>
                                    </div>
                                    <span className="text-[10px] text-gray-600 font-mono">{comp.comments?.length || 0} Notes</span>
                                </div>
                                <div className="flex-1 bg-[#09090b] border border-[#27272a] rounded-lg p-1 overflow-hidden shadow-inner">
                                    <CommentThread 
                                        comments={comp.comments} 
                                        onAddComment={onAddComment} 
                                        contextId={comp.id}
                                        compact={false}
                                        placeholder="Type a message to the engineering team..."
                                    />
                                </div>
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
    onUpdateComponent,
    onDeleteComponent,
    onAddComponent,
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
    onAddComment,
    onHoverComponent,
    requestedExpandId
}: {
    components: DetectedComponent[],
    onUpdateComponentCost: (id: string, cost: number) => void,
    onUpdateComponent: (id: string, updates: Partial<DetectedComponent>) => void,
    onDeleteComponent: (id: string) => void,
    onAddComponent: () => void,
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
    onAddComment: (targetId: string, text: string) => void,
    onHoverComponent: (id: string | null) => void,
    requestedExpandId?: string | null
}) => {
    const [rightWidth, setRightWidth] = useState(500); 
    const [isRightOpen, setIsRightOpen] = useState(true);
    const [isResizingRight, setIsResizingRight] = useState(false);
    const [activeRightTab, setActiveRightTab] = useState<RightPanelTab>('workspace');
    const [expandedCompId, setExpandedCompId] = useState<string | null>(null);
    const [expandedPricingCompId, setExpandedPricingCompId] = useState<string | null>(null);
    const [isSendModalOpen, setIsSendModalOpen] = useState(false);
    
    // Collapsing State for both Workspace and Pricing tabs (independent)
    const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});
    const [collapsedPricingCategories, setCollapsedPricingCategories] = useState<Record<string, boolean>>({});
    
    const [expandedRowComments, setExpandedRowComments] = useState<Record<string, boolean>>({});
    const [searchQuery, setSearchQuery] = useState("");
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // Grounding & Batch Audit State
    const [isAuditing, setIsAuditing] = useState<Record<string, boolean>>({});
    const [groundedResults, setGroundedResults] = useState<Record<string, GroundedPriceResult>>({});
    const [batchProgress, setBatchProgress] = useState<{current: number, total: number} | null>(null);

    const startResizingRight = useCallback(() => setIsResizingRight(true), []);
    const stopResizing = useCallback(() => setIsResizingRight(false), []);

    // REAL-TIME AUDIT HANDLER
    const triggerMarketAudit = async (comp: DetectedComponent) => {
        setIsAuditing(prev => ({ ...prev, [comp.id]: true }));
        try {
            const result = await performGroundedPricing(comp);
            setGroundedResults(prev => ({ ...prev, [comp.id]: result }));
            
            // Automatically update component cost if found
            if (result.cost > 0) {
                const updates: Partial<DetectedComponent> = {
                    groundedData: result,
                    cost: result.cost,
                    description: `${comp.description}\n[Verified Source: ${result.sourceDescription}]`
                };
                
                // If the audit found a specific SKU/Name, upgrade the generic detection
                if (result.foundName) updates.name = result.foundName;
                if (result.foundSku && result.foundSku !== 'N/A') updates.sku = result.foundSku;
                
                // NEW: Update Manufacturer and Specs
                if (result.manufacturer) updates.manufacturer = result.manufacturer;
                if (result.specs && Object.keys(result.specs).length > 0) {
                    updates.technicalSpecs = { ...comp.technicalSpecs, ...result.specs };
                }

                onUpdateComponent(comp.id, updates);
                onUpdateComponentCost(comp.id, result.cost);
            }
        } finally {
            setIsAuditing(prev => ({ ...prev, [comp.id]: false }));
        }
    };

    // BATCH AUDIT TRIGGER - OPTIMIZED WITH DEDUPLICATION
    const triggerBatchAudit = async () => {
        // 1. Identify components that need auditing
        const candidates = components.filter(c => !c.groundedData && !isAuditing[c.id]);
        if (candidates.length === 0) return;

        // 2. Group by unique "signature" to deduplicate requests
        // Signature = Name + Type + Manufacturer + SKU (if present)
        const groups: Record<string, DetectedComponent[]> = {};
        candidates.forEach(comp => {
            // Refined key to include manufacturer for better grouping accuracy
            const normalize = (s: string | undefined) => (s || '').trim().toLowerCase();
            const key = `${normalize(comp.name)}|${normalize(comp.sku)}|${normalize(comp.manufacturer)}|${normalize(comp.type)}`;
            if (!groups[key]) groups[key] = [];
            groups[key].push(comp);
        });

        // 3. Create representative list of unique items to audit
        const uniqueItemsToAudit = Object.values(groups).map(group => group[0]);
        
        // CORRECTION: Track TOTAL items, not just unique API calls, to avoid user confusion
        const totalItemsCount = candidates.length;
        setBatchProgress({ current: 0, total: totalItemsCount });

        // 4. Process unique items
        // We still limit concurrency to be polite to the API
        const CONCURRENCY_LIMIT = 1; 
        
        for (let i = 0; i < uniqueItemsToAudit.length; i += CONCURRENCY_LIMIT) {
            const batch = uniqueItemsToAudit.slice(i, i + CONCURRENCY_LIMIT);
            
            // Mark all related components as auditing
            const allInBatch = batch.flatMap(rep => {
                const normalize = (s: string | undefined) => (s || '').trim().toLowerCase();
                const key = `${normalize(rep.name)}|${normalize(rep.sku)}|${normalize(rep.manufacturer)}|${normalize(rep.type)}`;
                return groups[key];
            });
            const auditingState: Record<string, boolean> = {};
            allInBatch.forEach(c => auditingState[c.id] = true);
            setIsAuditing(prev => ({ ...prev, ...auditingState }));

            // Perform Audit on Representatives
            await Promise.all(batch.map(async (rep) => {
                try {
                    const result = await performGroundedPricing(rep);
                    
                    // Apply result to ALL identical components in the group
                    const normalize = (s: string | undefined) => (s || '').trim().toLowerCase();
                    const key = `${normalize(rep.name)}|${normalize(rep.sku)}|${normalize(rep.manufacturer)}|${normalize(rep.type)}`;
                    const siblings = groups[key];

                    if (siblings) {
                        siblings.forEach(sibling => {
                            setGroundedResults(prev => ({ ...prev, [sibling.id]: result }));
                            
                            if (result.cost > 0) {
                                const updates: Partial<DetectedComponent> = {
                                    groundedData: result,
                                    cost: result.cost,
                                    description: `${sibling.description}\n[Verified Source: ${result.sourceDescription}]`
                                };
                                if (result.foundName) updates.name = result.foundName;
                                // Only update SKU if it's a real find, not N/A
                                if (result.foundSku && result.foundSku !== 'N/A') updates.sku = result.foundSku;
                                if (result.manufacturer) updates.manufacturer = result.manufacturer;
                                if (result.specs && Object.keys(result.specs).length > 0) {
                                    updates.technicalSpecs = { ...sibling.technicalSpecs, ...result.specs };
                                }
                                onUpdateComponent(sibling.id, updates);
                                onUpdateComponentCost(sibling.id, result.cost);
                            }
                        });
                    }
                } catch (e) {
                    console.error("Batch audit error for group", rep.name, e);
                }
            }));

            // Clear auditing state
            const finishState: Record<string, boolean> = {};
            allInBatch.forEach(c => finishState[c.id] = false);
            setIsAuditing(prev => ({ ...prev, ...finishState }));

            // ADD DELAY between batches
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Update progress based on ACTUAL items processed (allInBatch.length), not just API calls
            setBatchProgress(prev => ({ 
                current: Math.min((prev?.current || 0) + allInBatch.length, totalItemsCount), 
                total: totalItemsCount 
            }));
        }

        setTimeout(() => setBatchProgress(null), 1000);
    };

    // Selection Listener Effect
    useEffect(() => {
        if (requestedExpandId) {
            setActiveRightTab('workspace');
            setExpandedCompId(requestedExpandId);
            setCollapsedCategories({}); 
            setTimeout(() => {
                const el = document.getElementById(`comp-card-${requestedExpandId}`);
                if (el) {
                    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    el.classList.add('ring-2', 'ring-blue-500', 'ring-offset-2', 'ring-offset-black');
                    setTimeout(() => {
                        el.classList.remove('ring-2', 'ring-blue-500', 'ring-offset-2', 'ring-offset-black');
                    }, 2000);
                }
            }, 150);
        }
    }, [requestedExpandId]);

    const filteredComponents = components.filter(c => 
        searchQuery === "" || 
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.id.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const groupedComponents = React.useMemo(() => {
        const groups: Record<string, DetectedComponent[]> = {
            'Controllers & Logic': [],
            'Sensors & Inputs': [],
            'Valves & Dampers': [],
            'Actuators': [],
            'Accessories & Misc': []
        };
        filteredComponents.forEach(comp => {
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
            if (!added) groups['Accessories & Misc'].push(comp);
        });
        return Object.entries(groups).filter(([_, items]) => items.length > 0);
    }, [filteredComponents]);

    // Grouping Logic for Pricing Tab (mirroring workspace logic)
    const groupedQuoteItems = React.useMemo(() => {
        const groups: Record<string, QuoteItem[]> = {
            'Controllers & Logic': [],
            'Sensors & Inputs': [],
            'Valves & Dampers': [],
            'Actuators': [],
            'Accessories & Misc': []
        };

        quoteItems.forEach(item => {
            const comp = components.find(c => c.id === item.id);
            const type = (comp?.type || '').toLowerCase();
            
            let added = false;
            if (type.includes('controller') || type.includes('plc') || type.includes('panel') || type.includes('io') || type.includes('module')) {
                groups['Controllers & Logic'].push(item);
                added = true;
            } else if (type.includes('sensor') || type.includes('temp') || type.includes('pressure') || type.includes('stat') || type.includes('switch') || type.includes('transmitter')) {
                groups['Sensors & Inputs'].push(item);
                added = true;
            } else if (type.includes('valve') || type.includes('damper') || type.includes('vav') || type.includes('coil')) {
                groups['Valves & Dampers'].push(item);
                added = true;
            } else if (type.includes('actuator') || type.includes('drive') || type.includes('motor')) {
                groups['Actuators'].push(item);
                added = true;
            } 
            if (!added) groups['Accessories & Misc'].push(item);
        });

        return Object.entries(groups).filter(([_, items]) => items.length > 0);
    }, [quoteItems, components]);

    const toggleCategory = (category: string) => {
        setCollapsedCategories(prev => ({ ...prev, [category]: !prev[category] }));
    };

    const togglePricingCategory = (category: string) => {
        setCollapsedPricingCategories(prev => ({ ...prev, [category]: !prev[category] }));
    };

    const toggleCollapseAll = () => {
        const totalCategories = groupedComponents.map(([key]) => key);
        const allCollapsed = totalCategories.every(cat => collapsedCategories[cat]);
        if (allCollapsed) setCollapsedCategories({});
        else {
            const newCollapsed: Record<string, boolean> = {};
            totalCategories.forEach(cat => newCollapsed[cat] = true);
            setCollapsedCategories(newCollapsed);
        }
    };

    const toggleRowComment = (id: string) => {
        setExpandedRowComments(prev => ({ ...prev, [id]: !prev[id] }));
    };
    
    useEffect(() => {
        const handleResize = (e: MouseEvent) => {
            if (isResizingRight) {
                const newWidth = window.innerWidth - e.clientX;
                if (newWidth > 320 && newWidth < 1400) setRightWidth(newWidth);
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

    useEffect(() => {
        if (scrollContainerRef.current) scrollContainerRef.current.scrollTop = 0;
    }, [activeRightTab]);

    const isNarrow = rightWidth < 600;
    const isUltraNarrow = rightWidth < 420;
    const materialSubtotal = quoteItems.reduce((sum, item) => sum + (item.materialCost * item.quantity), 0);
    const laborSubtotal = quoteItems.reduce((sum, item) => sum + (item.laborCost * item.quantity), 0);
    const grandTotal = materialSubtotal + laborSubtotal;
    const tax = grandTotal * 0.0825;
    const handlePrint = () => {
        const originalTitle = document.title;
        // Dynamically set title for better PDF filename "Proposal_[Number]_[Client].pdf"
        const safeName = quoteInfo.number.replace(/[^a-z0-9]/gi, '_');
        const safeCompany = quoteInfo.billToCompany.replace(/[^a-z0-9]/gi, '_');
        document.title = `Proposal_${safeName}_${safeCompany}`;
        
        // Use timeout to ensure title update propagates to print dialog logic
        // and handle afterprint cleanup
        const cleanup = () => {
            document.title = originalTitle;
            window.removeEventListener('afterprint', cleanup);
        };
        
        window.addEventListener('afterprint', cleanup);
        
        // Robust Print Execution
        try {
            setTimeout(() => {
                window.print();
            }, 150);
        } catch(e) {
            console.error("Print dialog failed:", e);
            document.title = originalTitle;
        }
        
        // Fallback cleanup
        setTimeout(() => {
             if (document.title !== originalTitle) document.title = originalTitle;
        }, 2000);
    };

    const allCategoriesCollapsed = groupedComponents.length > 0 && groupedComponents.every(([key]) => collapsedCategories[key]);

    const groundedCount = components.filter(c => c.groundedData).length;

    // Helper to create a temporary DetectedComponent for manual quote items
    const createTempComponent = (item: QuoteItem): DetectedComponent => ({
        id: item.id,
        name: item.description,
        type: 'Manual Entry',
        confidence: 1,
        status: 'review',
        cost: item.materialCost,
        sku: item.sku,
        description: 'Manually added quote item',
        technicalSpecs: {},
        estimatedInstallHours: item.hours,
        comments: item.comments
    });

    return (
        <>
        <PrintableQuote info={quoteInfo} items={quoteItems} total={grandTotal} tax={tax} />
        <SendProposalModal isOpen={isSendModalOpen} onClose={() => setIsSendModalOpen(false)} teamMembers={teamMembers} quoteNumber={quoteInfo.number} onSend={(recipients, note) => onSendProposal && onSendProposal(recipients, note)} />

        <div className="relative flex flex-col shrink-0 z-20 group print:hidden" style={{ width: isRightOpen ? rightWidth : 0, transition: isResizingRight ? 'none' : 'width 0.4s cubic-bezier(0.2, 0, 0, 1)' }}>
            <ToggleButton isOpen={isRightOpen} onClick={() => setIsRightOpen(!isRightOpen)} side="right" />
            {isRightOpen && <div className="absolute top-0 left-0 w-2 h-full cursor-col-resize hover:bg-blue-500/10 transition-colors z-30" onMouseDown={startResizingRight}><div className="absolute top-0 bottom-0 left-0 w-[1px] bg-transparent group-hover:bg-blue-500/50 transition-colors delay-100"></div></div>}

            <div className="absolute inset-0 overflow-hidden border-l border-[#27272a] bg-[#09090b] flex flex-col">
                <div className="h-full flex flex-col" style={{ width: rightWidth }}>
                    <div className="h-12 border-b border-[#27272a] flex items-center px-1 shrink-0 bg-[#09090b] gap-0.5 overflow-x-auto custom-scrollbar no-scrollbar">
                        {[{ id: 'workspace', label: isUltraNarrow ? 'Hub' : 'Workspace' }, { id: 'analysis', label: 'Analysis' }, { id: 'pricing', label: 'Pricing' }, { id: 'quote', label: 'Quote' }].map(tab => (
                        <button key={tab.id} onClick={() => setActiveRightTab(tab.id as RightPanelTab)} className={`flex-1 min-w-[70px] flex items-center justify-center h-full text-[11px] font-medium border-b-2 transition-all duration-200 hover:bg-[#121214] rounded-t-lg mt-1 whitespace-nowrap px-2 ${activeRightTab === tab.id ? 'border-blue-500 text-white bg-[#121214]' : 'border-transparent text-gray-500 hover:text-gray-300'}`}>
                            {tab.label}
                        </button>
                        ))}
                    </div>

                    <div ref={scrollContainerRef} className="flex-1 overflow-y-auto overflow-x-hidden bg-[#09090b] relative scroll-smooth custom-scrollbar">
                        {activeRightTab === 'workspace' && (
                            <div className="px-4 pt-6 pb-20 space-y-6 animate-fade-in">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between flex-wrap gap-2">
                                        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Detection Registry</h3>
                                        <div className="flex items-center gap-2">
                                            {components.length > 0 && <button onClick={toggleCollapseAll} title={allCategoriesCollapsed ? "Expand All" : "Collapse All"} className="p-1 hover:bg-[#27272a] rounded text-gray-500 hover:text-white transition-colors">{allCategoriesCollapsed ? <Icons.Maximize width={12} height={12} /> : <Icons.Grid width={12} height={12} />}</button>}
                                            <span className="bg-blue-500/10 text-blue-400 text-[10px] px-2 py-0.5 rounded-full border border-blue-500/20">{components.length} Assets</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <div className="relative group flex-1">
                                            <span className="absolute left-3 top-2.5 text-gray-500 group-focus-within:text-blue-500 transition-colors"><Icons.Search width={14} height={14} /></span>
                                            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Filter assets..." className="w-full bg-[#121214] border border-[#27272a] rounded-lg pl-9 pr-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none transition-all placeholder-gray-600" />
                                        </div>
                                        <button onClick={onAddComponent} className="px-3 py-2 bg-[#121214] border border-[#27272a] rounded-lg text-gray-400 hover:text-white hover:border-blue-500/50 hover:bg-blue-500/10 transition-all flex items-center justify-center" title="Add Manual Asset"><Icons.Plus width={14} height={14} /></button>
                                    </div>
                                </div>
                                {isProcessing && components.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-48 gap-4"><div className="w-8 h-8 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div><p className="text-[10px] text-gray-500 uppercase tracking-widest animate-pulse">AI Extraction in progress...</p></div>
                                ) : components.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-48 text-gray-600 text-center px-4"><Icons.Search width={32} height={32} /><p className="text-xs mt-2 font-medium">No components detected yet.</p><p className="text-[10px] opacity-60">Upload blueprint or add manually.</p><button onClick={onAddComponent} className="mt-3 text-blue-500 text-[10px] font-bold uppercase tracking-wider hover:underline">+ Add First Item</button></div>
                                ) : (
                                    <div className="space-y-4">
                                        {groupedComponents.map(([category, items]) => (
                                            <div key={category} className="animate-fade-in">
                                                <button onClick={() => toggleCategory(category)} className="w-full flex items-center justify-between p-3 bg-[#121214] border border-[#27272a] rounded-lg hover:border-gray-600 transition-all group sticky top-0 z-10 shadow-sm"><div className="flex items-center gap-3"><span className="text-xs font-bold text-gray-300 uppercase tracking-wide group-hover:text-white">{category}</span></div><div className="flex items-center gap-3"><span className="bg-[#18181b] border border-[#27272a] text-gray-500 text-[9px] px-1.5 py-0.5 rounded-md font-mono">{items.length}</span><div className={`text-gray-500 transition-transform duration-300 ${collapsedCategories[category] ? '-rotate-90' : 'rotate-0'}`}><Icons.ChevronDown width={14} height={14} /></div></div></button>
                                                {!collapsedCategories[category] && <div className="space-y-2 mt-2 pl-2 border-l border-[#27272a] ml-4">
                                                    {items.map((comp) => (
                                                        <ComponentCard 
                                                            key={comp.id} 
                                                            comp={comp} 
                                                            isExpanded={expandedCompId === comp.id} 
                                                            onToggle={() => setExpandedCompId(expandedCompId === comp.id ? null : comp.id)} 
                                                            onAddComment={(text) => onAddComment(comp.id, text)} 
                                                            onMouseEnter={() => onHoverComponent(comp.id)} 
                                                            onMouseLeave={() => onHoverComponent(null)} 
                                                            onUpdate={(updates) => onUpdateComponent(comp.id, updates)} 
                                                            onDelete={() => onDeleteComponent(comp.id)}
                                                            onAudit={(c) => triggerMarketAudit(c)}
                                                            isAuditing={isAuditing[comp.id]}
                                                        />
                                                    ))}
                                                </div>}
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
                                            <span className="text-[11px] font-medium text-purple-300 tracking-tight">
                                                Analyzing HVAC system design...
                                            </span>
                                        </div>
                                    </div>
                                )}
                                {aiAnalysis ? (
                                    <div className="flex flex-col h-full">
                                        {!isAnalyzing && (
                                            <div className="px-6 py-4 border-b border-[#27272a] bg-[#121214] flex justify-between items-center sticky top-0 z-10 backdrop-blur-sm bg-opacity-90">
                                                <div className="flex items-center gap-2">
                                                    <div className="p-1.5 bg-blue-500/10 rounded text-blue-400">
                                                        <Icons.CheckCircle width={14} height={14} />
                                                    </div>
                                                    <div>
                                                        <div className="text-[11px] font-bold text-gray-200">
                                                            HVAC ANALYSIS COMPLETE
                                                        </div>
                                                        <div className="text-[9px] text-gray-500">
                                                            Code compliance verified
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        <div className="p-6 overflow-auto">
                                            {(() => {
                                                try {
                                                    const report: BackendAnalysisReport = JSON.parse(aiAnalysis);
                                                    return <HVACReportViewer report={report} />;
                                                } catch (e) {
                                                    // Fallback to markdown if parsing fails
                                                    return <MarkdownRenderer content={aiAnalysis} />;
                                                }
                                            })()}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center min-h-[400px] text-center px-8 space-y-5">
                                        <div className="p-5 rounded-full bg-[#18181b] border border-[#27272a] shadow-2xl relative group transition-all duration-500 hover:border-purple-500/30">
                                            <div className="absolute inset-0 bg-purple-500/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                                            <Icons.Sparkles width={32} height={32} className="text-purple-400/80 group-hover:text-purple-400 relative z-10 transition-colors" />
                                        </div>
                                        <div className="space-y-2 max-w-[280px]">
                                            <h3 className="text-sm font-semibold text-gray-200 tracking-tight">
                                                HVAC Engineering Analysis
                                            </h3>
                                            <p className="text-xs text-gray-500 leading-6">
                                                Analyze load calculations, equipment sizing, and code compliance for Minnesota Climate Zone 7.
                                            </p>
                                        </div>
                                        {!isProcessing && uploadedImage && (
                                            <button 
                                                onClick={onRunAnalysis} 
                                                className="mt-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white text-xs font-bold rounded-lg shadow-lg shadow-blue-900/20 transition-all flex items-center gap-2 group"
                                            >
                                                <Icons.Activity width={14} height={14} className="group-hover:scale-110 transition-transform" />
                                                Generate Analysis Report
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                        
                        {activeRightTab === 'pricing' && (
                            <div className="flex flex-col animate-fade-in w-full pb-20">
                                <div className="p-6 border-b border-[#27272a] bg-[#121214] shrink-0">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-sm text-gray-400">Total Project Estimate</span>
                                        <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[10px] rounded border border-emerald-500/20 font-bold tracking-widest uppercase">Live Market Sync</span>
                                    </div>
                                    <div className="text-3xl font-light text-white tracking-tight truncate tabular-nums">
                                        ${grandTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </div>
                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3">
                                        <div className="text-[10px] text-gray-500">Labor: <span className="text-blue-400 font-medium tabular-nums">${quoteInfo.laborRate}/hr</span></div>
                                        <div className="text-[10px] text-gray-500">Total: <span className="text-blue-400 font-medium tabular-nums">{quoteItems.reduce((s, i) => s + (i.hours * i.quantity), 0)} hrs</span></div>
                                    </div>
                                </div>

                                {/* SLEEK BATCH AUDIT CONTROLLER */}
                                <div className="px-6 py-3 border-b border-[#27272a] bg-[#121214] flex items-center justify-between sticky top-0 z-10 backdrop-blur-md bg-[#121214]/90">
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Market Data</span>
                                        {batchProgress && (
                                            <span className="text-[10px] text-blue-400 animate-pulse ml-2 font-medium">
                                                Syncing {batchProgress.current}/{batchProgress.total}...
                                            </span>
                                        )}
                                        {!batchProgress && (
                                            <div className="text-[10px] text-gray-500 font-medium ml-2">
                                                {groundedCount} Verified / {components.length} Total
                                            </div>
                                        )}
                                    </div>
                                    
                                    <button 
                                        onClick={triggerBatchAudit}
                                        disabled={!!batchProgress || components.length === 0}
                                        className={`p-1.5 rounded-md border transition-all group flex items-center gap-2 ${
                                            batchProgress 
                                            ? 'bg-blue-500/10 border-blue-500/20 text-blue-400 cursor-not-allowed' 
                                            : 'bg-[#18181b] border-[#27272a] text-gray-400 hover:text-white hover:border-gray-500'
                                        }`}
                                        title="Sync All Prices"
                                    >
                                        <Icons.RefreshCw width={14} height={14} className={batchProgress ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'} />
                                    </button>
                                </div>
                                {batchProgress && (
                                    <div className="h-[2px] w-full bg-[#18181b]">
                                        <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${(batchProgress.current / batchProgress.total) * 100}%` }}></div>
                                    </div>
                                )}

                                <div className="px-4 pt-6 space-y-4">
                                    {groupedQuoteItems.map(([category, items]) => (
                                        <div key={category} className="animate-fade-in">
                                            <button 
                                                onClick={() => togglePricingCategory(category)} 
                                                className="w-full flex items-center justify-between p-3 bg-[#121214] border border-[#27272a] rounded-lg hover:border-gray-600 transition-all group sticky top-0 z-10 shadow-sm"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <span className="text-xs font-bold text-gray-300 uppercase tracking-wide group-hover:text-white">{category}</span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className="bg-[#18181b] border border-[#27272a] text-gray-500 text-[9px] px-1.5 py-0.5 rounded-md font-mono">{items.length}</span>
                                                    <div className={`text-gray-500 transition-transform duration-300 ${collapsedPricingCategories[category] ? '-rotate-90' : 'rotate-0'}`}>
                                                        <Icons.ChevronDown width={14} height={14} />
                                                    </div>
                                                </div>
                                            </button>
                                            
                                            {!collapsedPricingCategories[category] && (
                                                <div className="space-y-4 mt-2 pl-2 border-l border-[#27272a] ml-4">
                                                    {items.map(item => {
                                                        const existingComp = components.find(c => c.id === item.id);
                                                        const comp = existingComp || createTempComponent(item);
                                                        const auditing = isAuditing[item.id];

                                                        return (
                                                            <PricingCard 
                                                                key={item.id}
                                                                item={item}
                                                                comp={comp}
                                                                isExpanded={expandedPricingCompId === item.id}
                                                                onToggle={() => setExpandedPricingCompId(expandedPricingCompId === item.id ? null : item.id)}
                                                                onUpdateItem={(field, value) => onUpdateQuoteItem(item.id, field, value)}
                                                                onAudit={existingComp ? () => triggerMarketAudit(comp) : undefined}
                                                                isAuditing={auditing}
                                                                isNarrow={isNarrow}
                                                                isUltraNarrow={isUltraNarrow}
                                                            />
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeRightTab === 'quote' && (
                            <div className="flex flex-col min-h-full animate-fade-in pb-10">
                                <div className="px-6 py-4 border-b border-[#27272a] bg-[#121214] flex justify-between items-center shrink-0">
                                    <div>
                                        <h3 className="text-sm font-bold text-white uppercase tracking-wider">Formal Proposal</h3>
                                        <p className="text-[10px] text-gray-500 mt-0.5">Generated Quote #{quoteInfo.number}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        {/* UPDATED PRINT BUTTON */}
                                        <button 
                                            onClick={handlePrint}
                                            className="px-3 py-1.5 bg-[#18181b] border border-[#27272a] hover:bg-[#27272a] hover:text-white text-[10px] font-bold uppercase tracking-wider text-gray-400 rounded-lg flex items-center gap-2 transition-all"
                                        >
                                            <Icons.FileText width={12} height={12} /> Print PDF
                                        </button>
                                        <button 
                                            onClick={() => setIsSendModalOpen(true)}
                                            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold uppercase tracking-wider rounded-lg flex items-center gap-2 transition-all shadow-lg shadow-blue-500/20"
                                        >
                                            <Icons.Send width={12} height={12} /> Send
                                        </button>
                                    </div>
                                </div>

                                <div className="">
                                    <QuoteBuilder 
                                        items={quoteItems}
                                        info={quoteInfo}
                                        onUpdateItem={onUpdateQuoteItem}
                                        onRemoveItem={onRemoveQuoteItem}
                                        onUpdateInfo={onUpdateQuoteInfo}
                                        onAddComment={onAddComment}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {isResizingRight && <div className="fixed inset-0 z-[100] cursor-col-resize"></div>}
        </div>
        </>
    );
};

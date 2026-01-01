import React, { useState, useMemo } from 'react';
import { 
  Layers, 
  Search,
  ChevronDown,
  DollarSign,
  FileText,
  Box,
  ShoppingCart,
  Send,
  MoreHorizontal,
  Plus
} from 'lucide-react';
import { ValidationIssue, DetectedObject } from '../../../types';
import { config } from '../../../app/config';

interface InspectorPanelProps {
  analysis: string;
  executiveSummary: string;
  inventory: any[];
  detectedBoxes: DetectedObject[];
  validationIssues: ValidationIssue[];
  selectedBoxId: string | null;
  onSelectBox: (id: string | null) => void;
}

type Tab = 'COMPONENTS' | 'PRICING' | 'QUOTE';

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

  const renderComponentsTab = () => (
    <div className="flex flex-col h-full">
      {/* Search */}
      <div className="px-3 pb-3">
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

      {/* List */}
      <div className="flex-1 overflow-y-auto scrollbar-thin px-3 space-y-1">
        {filteredBoxes.length > 0 ? (
          filteredBoxes.map((box) => (
            <div 
              key={box.id}
              onClick={() => onSelectBox(box.id)}
              className={`flex items-center gap-3 p-2 rounded cursor-pointer transition-all group ${
                selectedBoxId === box.id 
                  ? 'bg-cyan-500/10 border border-cyan-500/30' 
                  : 'hover:bg-white/5 border border-transparent'
              }`}
            >
               <div className={`w-8 h-8 rounded flex items-center justify-center shrink-0 ${
                  selectedBoxId === box.id ? 'bg-cyan-500/20 text-cyan-400' : 'bg-[#252526] text-zinc-500 group-hover:text-zinc-300'
               }`}>
                  <Box size={14} />
               </div>
               <div className="flex-1 min-w-0">
                  <div className={`text-xs font-semibold truncate ${selectedBoxId === box.id ? 'text-cyan-100' : 'text-zinc-300'}`}>
                    {box.label}
                  </div>
                  <div className="text-[10px] text-zinc-500 truncate">
                    {box.meta?.description || 'No description'}
                  </div>
               </div>
               {selectedBoxId === box.id && (
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-500"></div>
               )}
            </div>
          ))
        ) : (
          <div className="p-4 text-center text-zinc-500 text-xs italic">
            No components found.
          </div>
        )}
      </div>

      {/* Selected Item Details Footer */}
      {selectedBoxId && (
        <div className="mt-auto border-t border-white/5 p-3 bg-[#1a1a1a]">
           <div className="text-[10px] font-bold text-zinc-500 uppercase mb-2">Selected Properties</div>
           {(() => {
              const selected = detectedBoxes.find(b => b.id === selectedBoxId);
              if (!selected) return null;
              return (
                <div className="space-y-2">
                    <div className="flex justify-between">
                        <span className="text-xs text-zinc-400">Confidence</span>
                        <span className="text-xs text-emerald-400 font-mono">{(selected.confidence * 100).toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-xs text-zinc-400">Tag ID</span>
                        <span className="text-xs text-zinc-200 font-mono">{selected.meta?.tag || 'N/A'}</span>
                    </div>
                </div>
              );
           })()}
        </div>
      )}
    </div>
  );

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
    <div className="w-80 bg-[#1e1e1e] border-l border-white/10 flex flex-col shrink-0 select-none">
      
      {/* Header / Tabs */}
      <div className="h-12 border-b border-white/5 flex items-center px-1">
         <button 
            onClick={() => setActiveTab('COMPONENTS')}
            className={`flex-1 h-full flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-wider transition-colors border-b-2 ${activeTab === 'COMPONENTS' ? 'border-cyan-500 text-cyan-400' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}
         >
            <Layers size={12} /> Components
         </button>
         <button 
            onClick={() => setActiveTab('PRICING')}
            className={`flex-1 h-full flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-wider transition-colors border-b-2 ${activeTab === 'PRICING' ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}
         >
            <DollarSign size={12} /> Pricing
         </button>
         <button 
            onClick={() => setActiveTab('QUOTE')}
            className={`flex-1 h-full flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-wider transition-colors border-b-2 ${activeTab === 'QUOTE' ? 'border-cyan-500 text-cyan-400' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}
         >
            <FileText size={12} /> Quote
         </button>
      </div>

      <div className="flex-1 overflow-hidden relative bg-[#121212]">
         {activeTab === 'COMPONENTS' && renderComponentsTab()}
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
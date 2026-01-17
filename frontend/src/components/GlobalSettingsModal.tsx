import React from 'react';
import { Icons } from './Icons';
import { AI_MODELS } from '../services/aiService';

export const GlobalSettingsModal = ({ 
    isOpen, 
    onClose, 
    activeModelId, 
    onSelectModel 
}: { 
    isOpen: boolean; 
    onClose: () => void; 
    activeModelId: string;
    onSelectModel: (id: string) => void;
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-8 animate-fade-in">
             {/* Backdrop */}
             <div 
               className="absolute inset-0 bg-black/80 backdrop-blur-md z-40"
               onClick={onClose}
             ></div>

             <div className="relative z-50 w-full max-w-2xl bg-[#09090b] border border-[#27272a] rounded-2xl shadow-2xl flex flex-col overflow-hidden ring-1 ring-white/10">
                {/* Header */}
                <div className="h-16 border-b border-[#27272a] bg-[#121214] flex items-center justify-between px-8">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-800 rounded-lg text-gray-300">
                            <Icons.Settings width={20} height={20} />
                        </div>
                        <div>
                            <h2 className="text-sm font-semibold text-white">System Configuration</h2>
                            <p className="text-xs text-gray-500">Inference Engine Parameters</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
                        <Icons.X width={20} height={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-8 space-y-8">
                    
                    {/* Model Section */}
                    <div>
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <Icons.Cpu width={14} height={14} />
                            Active Inference Model
                        </h3>
                        
                        <div className="grid grid-cols-2 gap-4">
                            {/* Gemini 3 Flash Card */}
                            <button
                                onClick={() => onSelectModel(AI_MODELS.FLASH.id)}
                                className={`relative group text-left p-5 rounded-xl border transition-all duration-300 ${
                                    activeModelId === AI_MODELS.FLASH.id 
                                    ? 'bg-blue-600/10 border-blue-500 ring-1 ring-blue-500/50' 
                                    : 'bg-[#121214] border-[#27272a] hover:border-blue-500/30 hover:bg-[#18181b]'
                                }`}
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <div className={`p-2 rounded-lg ${activeModelId === AI_MODELS.FLASH.id ? 'bg-blue-500 text-white' : 'bg-[#18181b] text-gray-400'}`}>
                                        <Icons.Zap width={20} height={20} />
                                    </div>
                                    {activeModelId === AI_MODELS.FLASH.id && (
                                        <span className="flex h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_8px_#3b82f6]"></span>
                                    )}
                                </div>
                                <div className="mb-1">
                                    <h4 className={`text-sm font-semibold ${activeModelId === AI_MODELS.FLASH.id ? 'text-white' : 'text-gray-300'}`}>
                                        {AI_MODELS.FLASH.label}
                                    </h4>
                                    <span className="text-[10px] font-mono text-blue-400 opacity-80">{AI_MODELS.FLASH.id}</span>
                                </div>
                                <p className="text-xs text-gray-500 leading-relaxed mt-2">
                                    Optimized for high-throughput, real-time object detection. Ideal for rapid P&ID scanning and initial component extraction.
                                </p>
                            </button>

                            {/* Gemini 3 Pro Card */}
                            <button
                                onClick={() => onSelectModel(AI_MODELS.PRO.id)}
                                className={`relative group text-left p-5 rounded-xl border transition-all duration-300 ${
                                    activeModelId === AI_MODELS.PRO.id 
                                    ? 'bg-purple-600/10 border-purple-500 ring-1 ring-purple-500/50' 
                                    : 'bg-[#121214] border-[#27272a] hover:border-purple-500/30 hover:bg-[#18181b]'
                                }`}
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <div className={`p-2 rounded-lg ${activeModelId === AI_MODELS.PRO.id ? 'bg-purple-500 text-white' : 'bg-[#18181b] text-gray-400'}`}>
                                        <Icons.Sparkles width={20} height={20} />
                                    </div>
                                    {activeModelId === AI_MODELS.PRO.id && (
                                        <span className="flex h-2 w-2 rounded-full bg-purple-500 shadow-[0_0_8px_#a855f7]"></span>
                                    )}
                                </div>
                                <div className="mb-1">
                                    <h4 className={`text-sm font-semibold ${activeModelId === AI_MODELS.PRO.id ? 'text-white' : 'text-gray-300'}`}>
                                        {AI_MODELS.PRO.label}
                                    </h4>
                                    <span className="text-[10px] font-mono text-purple-400 opacity-80">{AI_MODELS.PRO.id}</span>
                                </div>
                                <p className="text-xs text-gray-500 leading-relaxed mt-2">
                                    Advanced reasoning engine with larger context window. Best for complex topology analysis, compliance auditing, and forensic reporting.
                                </p>
                            </button>

                            {/* Local Ollama Card */}
                            <button
                                onClick={() => onSelectModel(AI_MODELS.LOCAL_OLLAMA.id)}
                                className={`relative group text-left p-5 rounded-xl border transition-all duration-300 ${
                                    activeModelId === AI_MODELS.LOCAL_OLLAMA.id 
                                    ? 'bg-emerald-600/10 border-emerald-500 ring-1 ring-emerald-500/50' 
                                    : 'bg-[#121214] border-[#27272a] hover:border-emerald-500/30 hover:bg-[#18181b]'
                                }`}
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <div className={`p-2 rounded-lg ${activeModelId === AI_MODELS.LOCAL_OLLAMA.id ? 'bg-emerald-500 text-white' : 'bg-[#18181b] text-gray-400'}`}>
                                        <Icons.Box width={20} height={20} />
                                    </div>
                                    {activeModelId === AI_MODELS.LOCAL_OLLAMA.id && (
                                        <span className="flex h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#34d399]"></span>
                                    )}
                                </div>
                                <div className="mb-1">
                                    <h4 className={`text-sm font-semibold ${activeModelId === AI_MODELS.LOCAL_OLLAMA.id ? 'text-white' : 'text-gray-300'}`}>
                                        {AI_MODELS.LOCAL_OLLAMA.label}
                                    </h4>
                                    <span className="text-[10px] font-mono text-emerald-400 opacity-80">{AI_MODELS.LOCAL_OLLAMA.id}</span>
                                </div>
                                <p className="text-xs text-gray-500 leading-relaxed mt-2">
                                    Runs inference against your local Ollama instance (Llama 3.1). Works offline and avoids cloud quotas. Ensure Ollama is running locally.
                                </p>
                            </button>
                        </div>
                    </div>

                    {/* Additional Settings Stub */}
                    <div className="pt-6 border-t border-[#27272a]">
                         <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Pipeline Parameters</h3>
                         <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-[#121214] border border-[#27272a] rounded-lg">
                                <div>
                                    <div className="text-xs text-gray-300 font-medium">BBox Spatial Indexing</div>
                                    <div className="text-[10px] text-gray-600">Vector compression for coordinate output</div>
                                </div>
                                <div className="h-4 w-8 bg-emerald-500/20 rounded-full border border-emerald-500/50 flex items-center justify-end px-0.5">
                                    <div className="w-3 h-3 bg-emerald-500 rounded-full shadow"></div>
                                </div>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-[#121214] border border-[#27272a] rounded-lg opacity-50 cursor-not-allowed">
                                <div>
                                    <div className="text-xs text-gray-300 font-medium">Thinking Budget</div>
                                    <div className="text-[10px] text-gray-600">Reserved token allocation for reasoning</div>
                                </div>
                                <div className="text-[10px] font-mono text-gray-500">AUTO</div>
                            </div>
                         </div>
                    </div>

                </div>

                {/* Footer */}
                <div className="p-4 bg-[#121214] border-t border-[#27272a] flex justify-end">
                    <button 
                        onClick={onClose}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition-all"
                    >
                        Done
                    </button>
                </div>
             </div>
        </div>
    );
};
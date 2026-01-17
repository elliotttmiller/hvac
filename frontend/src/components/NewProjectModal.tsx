import React, { useState } from "react";
import { Icons } from "./Icons";

export type NewProjectData = {
    name: string;
    client: string;
    location: string;
    description: string;
    budget: string;
};

export const NewProjectModal = ({ 
    onClose, 
    onCreate 
}: { 
    onClose: () => void, 
    onCreate: (data: NewProjectData) => void 
}) => {
    const [formData, setFormData] = useState<NewProjectData>({
        name: "",
        client: "",
        location: "",
        description: "",
        budget: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name.trim() || !formData.client.trim()) return;

        setIsSubmitting(true);
        // Simulate a small network delay for "robustness" feel
        setTimeout(() => {
            onCreate(formData);
            setIsSubmitting(false);
            onClose();
        }, 600);
    };

    const handleChange = (field: keyof NewProjectData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-8 animate-fade-in">
             <div 
               className="absolute inset-0 bg-black/70 backdrop-blur-sm z-40 transition-opacity"
               onClick={onClose}
             ></div>
             
             <div className="relative z-50 w-full max-w-xl bg-[#121214] border border-[#27272a] rounded-xl shadow-2xl flex flex-col overflow-hidden animate-fade-in">
                <div className="h-16 border-b border-[#27272a] bg-[#18181b] flex items-center justify-between px-6 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500 border border-blue-500/20">
                            <Icons.Layers width={20} height={20} />
                        </div>
                        <div>
                            <h2 className="text-sm font-semibold text-white">Initialize New Project</h2>
                            <p className="text-xs text-gray-500">Configure project parameters and metadata</p>
                        </div>
                    </div>
                    <button 
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        <Icons.X width={18} height={18} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 bg-[#09090b] space-y-5">
                    
                    <div className="grid grid-cols-2 gap-5">
                        <div className="col-span-2">
                            <label className="block text-xs font-medium text-gray-400 mb-2">Project Name <span className="text-red-400">*</span></label>
                            <input 
                                autoFocus
                                type="text" 
                                value={formData.name} 
                                onChange={e => handleChange('name', e.target.value)}
                                className="w-full bg-[#121214] border border-[#27272a] rounded-lg px-3 py-2.5 text-sm text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all placeholder-gray-600"
                                placeholder="e.g. Northside Hospital Expansion Phase 1"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-400 mb-2">Client / Organization <span className="text-red-400">*</span></label>
                            <div className="relative">
                                <span className="absolute left-3 top-2.5 text-gray-600"><Icons.Users width={14} height={14} /></span>
                                <input 
                                    type="text" 
                                    value={formData.client} 
                                    onChange={e => handleChange('client', e.target.value)}
                                    className="w-full bg-[#121214] border border-[#27272a] rounded-lg pl-9 pr-3 py-2.5 text-sm text-white focus:border-blue-500 focus:outline-none transition-all placeholder-gray-600"
                                    placeholder="e.g. Acme Healthcare"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-400 mb-2">Site Location</label>
                            <div className="relative">
                                <span className="absolute left-3 top-2.5 text-gray-600"><Icons.Home width={14} height={14} /></span>
                                <input 
                                    type="text" 
                                    value={formData.location} 
                                    onChange={e => handleChange('location', e.target.value)}
                                    className="w-full bg-[#121214] border border-[#27272a] rounded-lg pl-9 pr-3 py-2.5 text-sm text-white focus:border-blue-500 focus:outline-none transition-all placeholder-gray-600"
                                    placeholder="City, State"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-400 mb-2">Estimated Budget (USD)</label>
                            <div className="relative">
                                <span className="absolute left-3 top-2.5 text-gray-600 font-mono text-xs">$</span>
                                <input 
                                    type="number" 
                                    value={formData.budget} 
                                    onChange={e => handleChange('budget', e.target.value)}
                                    className="w-full bg-[#121214] border border-[#27272a] rounded-lg pl-9 pr-3 py-2.5 text-sm text-white focus:border-blue-500 focus:outline-none transition-all placeholder-gray-600"
                                    placeholder="0.00"
                                />
                            </div>
                        </div>

                        <div>
                             <label className="block text-xs font-medium text-gray-400 mb-2">Project Type</label>
                             <select className="w-full bg-[#121214] border border-[#27272a] rounded-lg px-3 py-2.5 text-sm text-gray-300 focus:border-blue-500 focus:outline-none appearance-none">
                                <option>Retrofit / Renovation</option>
                                <option>New Construction</option>
                                <option>Audit / Compliance</option>
                             </select>
                        </div>
                        
                        <div className="col-span-2">
                            <label className="block text-xs font-medium text-gray-400 mb-2">Scope Notes</label>
                            <textarea 
                                value={formData.description}
                                onChange={e => handleChange('description', e.target.value)}
                                rows={3}
                                className="w-full bg-[#121214] border border-[#27272a] rounded-lg px-3 py-2.5 text-sm text-white focus:border-blue-500 focus:outline-none transition-all placeholder-gray-600 resize-none"
                                placeholder="Enter brief project scope, critical requirements, or engineering notes..."
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between mt-8 pt-6 border-t border-[#27272a]">
                        <div className="flex items-center gap-2 text-[10px] text-gray-500">
                            <Icons.Info width={12} height={12} />
                            <span>Fields marked with * are required</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <button 
                                type="button" 
                                onClick={onClose} 
                                className="px-4 py-2 text-xs font-medium text-gray-400 hover:text-white transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit" 
                                disabled={!formData.name.trim() || !formData.client.trim() || isSubmitting} 
                                className={`flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium rounded-lg transition-all shadow-lg shadow-blue-500/20 ${(!formData.name.trim() || isSubmitting) ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        Initializing...
                                    </>
                                ) : (
                                    <>
                                        <Icons.Plus width={14} height={14} />
                                        Create Project
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </form>
             </div>
        </div>
    );
};

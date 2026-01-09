import React, { useRef, useState } from 'react';
import { Icons } from '../components/Icons';
import { Blueprint, Project } from '../types';

const BlueprintCanvas = ({ isProcessing, uploadedImage, onTriggerUpload }: { isProcessing: boolean, uploadedImage: string | null, onTriggerUpload: () => void }) => {
    return (
        <div className="relative w-full h-full bg-[#09090b] flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 opacity-10 pointer-events-none" 
                 style={{ 
                    backgroundImage: 'radial-gradient(#4b5563 1px, transparent 1px)', 
                    backgroundSize: '20px 20px' 
                 }}>
            </div>

            {uploadedImage ? (
                <div className="relative max-w-[95%] max-h-[95%] z-10">
                    <img 
                        src={uploadedImage} 
                        alt="Blueprint" 
                        className={`max-w-full max-h-full object-contain shadow-2xl border border-[#27272a] transition-all duration-500 ${isProcessing ? 'opacity-50 blur-[1px]' : 'opacity-100'}`} 
                    />
                    {isProcessing && (
                        <div className="absolute inset-0 z-20 overflow-hidden">
                             <div className="absolute top-0 left-0 w-full h-[2px] bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.8)] animate-scan"></div>
                             <div className="absolute inset-0 bg-blue-500/5 mix-blend-overlay"></div>
                        </div>
                    )}
                </div>
            ) : (
                <div 
                    onClick={onTriggerUpload}
                    className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-[#27272a] rounded-xl bg-[#18181b]/50 text-[#71717a] cursor-pointer hover:bg-[#18181b] hover:border-blue-500/50 hover:text-blue-400 transition-all group"
                >
                    <div className="mb-4 p-4 rounded-full bg-[#27272a] group-hover:bg-blue-500/10 group-hover:text-blue-400 transition-colors">
                        <Icons.Upload />
                    </div>
                    <p className="text-sm font-medium text-gray-300 group-hover:text-blue-200">No blueprint loaded</p>
                    <p className="text-xs">Upload a P&ID or architectural plan</p>
                </div>
            )}
            <style>{`
                @keyframes scan {
                    0% { top: 0%; opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { top: 100%; opacity: 0; }
                }
                .animate-scan {
                    animation: scan 3s linear infinite;
                }
            `}</style>
        </div>
    );
};

const ContextSwitcher = ({ 
    projects, 
    activeProject, 
    activeBlueprint, 
    onSelect 
}: { 
    projects: Project[], 
    activeProject: Project, 
    activeBlueprint?: Blueprint,
    onSelect: (projectId: string, blueprintId?: string) => void
}) => {
    const [projectOpen, setProjectOpen] = useState(false);
    const [fileOpen, setFileOpen] = useState(false);

    return (
        <div className="flex items-center gap-1 text-sm font-medium">
            {/* Project Selector */}
            <div className="relative">
                <button 
                    onClick={() => { setProjectOpen(!projectOpen); setFileOpen(false); }}
                    className={`flex items-center gap-2 px-2 py-1 rounded-md transition-all hover:bg-[#18181b] ${projectOpen ? 'bg-[#18181b] text-blue-400' : 'text-gray-400'}`}
                >
                    <Icons.Box width={14} height={14} className={projectOpen ? 'text-blue-400' : 'text-gray-500'} />
                    <span className="max-w-[150px] truncate">{activeProject.name}</span>
                    <Icons.ChevronRight width={12} height={12} className={`transition-transform duration-200 ${projectOpen ? 'rotate-90' : ''}`} />
                </button>

                {projectOpen && (
                    <div className="absolute top-full left-0 mt-1 w-64 bg-[#121214] border border-[#27272a] rounded-lg shadow-2xl z-[100] py-1 animate-fade-in">
                        <div className="px-3 py-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest border-b border-[#27272a] mb-1">Select Project</div>
                        <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                            {projects.map(p => (
                                <button
                                    key={p.id}
                                    onClick={() => { onSelect(p.id); setProjectOpen(false); }}
                                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-blue-600/10 group transition-colors ${p.id === activeProject.id ? 'text-blue-400 bg-blue-600/5' : 'text-gray-400 hover:text-gray-100'}`}
                                >
                                    <span className="truncate">{p.name}</span>
                                    {p.id === activeProject.id && <Icons.CheckCircle width={12} height={12} />}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <span className="text-gray-700 mx-0.5">/</span>

            {/* File Selector */}
            <div className="relative">
                <button 
                    onClick={() => { setFileOpen(!fileOpen); setProjectOpen(false); }}
                    className={`flex items-center gap-2 px-2 py-1 rounded-md transition-all hover:bg-[#18181b] ${fileOpen ? 'bg-[#18181b] text-blue-400' : 'text-gray-100'}`}
                >
                    <Icons.FileText width={14} height={14} className={fileOpen ? 'text-blue-400' : 'text-blue-500/50'} />
                    <span className="max-w-[180px] truncate">{activeBlueprint?.name || 'Select File'}</span>
                    <Icons.ChevronRight width={12} height={12} className={`transition-transform duration-200 ${fileOpen ? 'rotate-90' : ''}`} />
                </button>

                {fileOpen && (
                    <div className="absolute top-full left-0 mt-1 w-72 bg-[#121214] border border-[#27272a] rounded-lg shadow-2xl z-[100] py-1 animate-fade-in">
                        <div className="px-3 py-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest border-b border-[#27272a] mb-1 flex justify-between items-center">
                            <span>Project Files</span>
                            <span className="text-[9px] bg-gray-800 px-1.5 py-0.5 rounded text-gray-400">{activeProject.blueprintsData.length}</span>
                        </div>
                        <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                            {activeProject.blueprintsData.length > 0 ? activeProject.blueprintsData.map(bp => (
                                <button
                                    key={bp.id}
                                    onClick={() => { onSelect(activeProject.id, bp.id); setFileOpen(false); }}
                                    className={`w-full text-left px-3 py-2.5 text-xs flex flex-col gap-0.5 hover:bg-blue-600/10 group transition-colors ${bp.id === activeBlueprint?.id ? 'text-blue-400 bg-blue-600/5 border-l-2 border-blue-500' : 'text-gray-400 hover:text-gray-100 border-l-2 border-transparent'}`}
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="truncate font-medium">{bp.name}</span>
                                        {bp.id === activeBlueprint?.id && <Icons.CheckCircle width={12} height={12} />}
                                    </div>
                                    <div className="flex items-center gap-2 text-[10px] text-gray-500">
                                        <span className="uppercase tracking-tighter">{bp.status}</span>
                                        {bp.compliance > 0 && (
                                            <>
                                                <span className="w-0.5 h-0.5 rounded-full bg-gray-700"></span>
                                                <span className={bp.compliance > 85 ? 'text-emerald-500' : 'text-amber-500'}>{bp.compliance}% Compliance</span>
                                            </>
                                        )}
                                    </div>
                                </button>
                            )) : (
                                <div className="px-4 py-8 text-center text-xs text-gray-600 italic">
                                    No files found in this project.
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export const WorkspaceView = ({ 
    blueprint, 
    activeProject,
    projects,
    onSelectProject,
    isProcessing, 
    onRunAnalysis,
    uploadedImage,
    onUpload
}: { 
    blueprint: Blueprint, 
    activeProject: Project,
    projects: Project[],
    onSelectProject: (projectId: string, blueprintId?: string) => void,
    isProcessing: boolean, 
    onRunAnalysis: () => void,
    uploadedImage: string | null,
    onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    return (
        <div className="flex flex-col h-full animate-fade-in">
             {/* Workspace Header */}
            <div className="h-14 border-b border-[var(--border-subtle)] bg-[var(--bg-app)] flex items-center justify-between px-6 shrink-0 z-10">
                <div className="flex items-center gap-6">
                    <ContextSwitcher 
                        projects={projects} 
                        activeProject={activeProject} 
                        activeBlueprint={blueprint} 
                        onSelect={onSelectProject} 
                    />
                    
                    <span className="h-4 w-px bg-[var(--border-active)]"></span>
                    
                    <div className="flex items-center gap-2 text-[10px] text-[var(--text-muted)] font-mono uppercase tracking-wider">
                        <Icons.Cpu className="text-blue-500" />
                        <span>Core: <span className="text-emerald-500">Gemini-3 Flash</span></span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        accept="image/*" 
                        onChange={onUpload}
                    />
                    <button 
                        onClick={onRunAnalysis}
                        disabled={isProcessing || !uploadedImage}
                        className={`flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                            isProcessing || !uploadedImage
                            ? 'bg-gray-800 text-gray-500 cursor-not-allowed border border-transparent' 
                            : 'bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-500/20 border border-blue-400/20 active:scale-95'
                        }`}
                    >
                        {isProcessing ? (
                            <>
                                <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                Analyzing...
                            </>
                        ) : (
                            <>
                                <Icons.Activity width={14} height={14} />
                                Run Pipeline
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Canvas Area */}
            <div className="flex-1 relative overflow-hidden bg-[#09090b]">
                <BlueprintCanvas 
                    isProcessing={isProcessing} 
                    uploadedImage={uploadedImage} 
                    onTriggerUpload={() => fileInputRef.current?.click()}
                />
                
                 {/* Floating Toolbar */}
                <div className="absolute top-4 right-4 flex flex-col gap-2 bg-[#09090b]/80 backdrop-blur-md border border-[var(--border-subtle)] rounded-xl p-1 shadow-2xl z-20 overflow-hidden">
                    <button className="p-2.5 hover:bg-[var(--bg-hover)] rounded-lg text-gray-400 hover:text-white transition-all active:scale-90" title="Zoom In"><Icons.Maximize width={16} height={16} /></button>
                    <button className="p-2.5 hover:bg-[var(--bg-hover)] rounded-lg text-gray-400 hover:text-white transition-all active:scale-90" title="Layers"><Icons.Layers width={16} height={16} /></button>
                    <button className="p-2.5 hover:bg-[var(--bg-hover)] rounded-lg text-gray-400 hover:text-white transition-all active:scale-90" title="Inspect"><Icons.Search width={16} height={16} /></button>
                    <div className="h-px w-6 bg-gray-800 mx-auto my-1"></div>
                    <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="p-2.5 hover:bg-blue-500/10 rounded-lg text-gray-400 hover:text-blue-400 transition-all active:scale-90" 
                        title="Upload New"
                    >
                        <Icons.Upload width={16} height={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};

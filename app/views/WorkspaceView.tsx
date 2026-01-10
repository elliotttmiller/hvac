import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Icons } from '../components/Icons';
import { Blueprint, Project } from '../types';
import { ACTIVE_MODEL_NAME } from '../services/aiService';

const BlueprintCanvas = ({ isProcessing, uploadedImage, onTriggerUpload }: { isProcessing: boolean, uploadedImage: string | null, onTriggerUpload: () => void }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [transform, setTransform] = useState({ scale: 1, x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

    // Reset view when new image loads
    useEffect(() => {
        if (uploadedImage) {
            setTransform({ scale: 1, x: 0, y: 0 });
        }
    }, [uploadedImage]);

    const handleWheel = useCallback((e: React.WheelEvent) => {
        if (!uploadedImage) return;
        e.preventDefault();

        const zoomSensitivity = 0.001;
        const minScale = 0.1;
        const maxScale = 8;

        const container = containerRef.current;
        if (!container) return;

        const rect = container.getBoundingClientRect();
        
        // Calculate mouse position relative to the container
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Determine new scale
        const delta = -e.deltaY;
        const scaleMultiplier = 1 + (delta * zoomSensitivity);
        const newScale = Math.min(Math.max(minScale, transform.scale * scaleMultiplier), maxScale);

        // Calculate new position to keep the point under the cursor stationary
        // Logic: (mousePos - oldTranslate) / oldScale = (mousePos - newTranslate) / newScale
        const newX = x - (x - transform.x) * (newScale / transform.scale);
        const newY = y - (y - transform.y) * (newScale / transform.scale);

        setTransform({
            scale: newScale,
            x: newX,
            y: newY
        });
    }, [transform, uploadedImage]);

    const handleMouseDown = (e: React.MouseEvent) => {
        if (!uploadedImage) return;
        e.preventDefault(); // Prevent text selection
        setIsDragging(true);
        setDragStart({ x: e.clientX - transform.x, y: e.clientY - transform.y });
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging || !uploadedImage) return;
        e.preventDefault();
        setTransform(prev => ({
            ...prev,
            x: e.clientX - dragStart.x,
            y: e.clientY - dragStart.y
        }));
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleReset = () => {
        setTransform({ scale: 1, x: 0, y: 0 });
    };

    // Zoom controls for the toolbar
    const handleZoomIn = () => {
        setTransform(prev => ({ ...prev, scale: Math.min(prev.scale * 1.2, 8) }));
    };

    return (
        <div 
            ref={containerRef}
            className="relative w-full h-full bg-[#09090b] flex items-center justify-center overflow-hidden cursor-crosshair select-none"
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
        >
            <div className="absolute inset-0 opacity-10 pointer-events-none" 
                 style={{ 
                    backgroundImage: 'radial-gradient(#4b5563 1px, transparent 1px)', 
                    backgroundSize: '20px 20px',
                    // Optional: Make grid pan with image for "infinite canvas" feel, 
                    // or keep static for viewport feel. Keeping static for cleaner look relative to UI.
                 }}>
            </div>

            {uploadedImage ? (
                <div 
                    className="relative origin-top-left will-change-transform"
                    style={{ 
                        transform: `translate3d(${transform.x}px, ${transform.y}px, 0) scale(${transform.scale})`,
                        cursor: isDragging ? 'grabbing' : 'grab'
                    }}
                >
                    <img 
                        src={uploadedImage} 
                        alt="Blueprint" 
                        draggable={false}
                        className={`max-w-none shadow-2xl border border-[#27272a] transition-opacity duration-500 ${isProcessing ? 'opacity-50 blur-[1px]' : 'opacity-100'}`}
                        // Prevent default browser drag behavior on the image element itself
                        onDragStart={(e) => e.preventDefault()} 
                    />
                    
                    {isProcessing && (
                        <div className="absolute inset-0 z-20 overflow-hidden rounded-lg">
                             <div className="absolute top-0 left-0 w-full h-[2px] bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.8)] animate-scan"></div>
                             {/* Floating label that counter-scales so it remains readable regardless of zoom level */}
                             <div className="absolute inset-0 bg-blue-500/10 mix-blend-overlay flex items-center justify-center">
                                <div 
                                    className="bg-black/60 backdrop-blur-sm px-6 py-3 rounded-xl border border-blue-500/30 flex flex-col items-center gap-2"
                                    style={{ transform: `scale(${1/transform.scale})` }} // Keep text size constant
                                >
                                    <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                    <span className="text-xs font-medium text-blue-400 uppercase tracking-widest whitespace-nowrap">Identifying Assets...</span>
                                </div>
                             </div>
                        </div>
                    )}
                </div>
            ) : (
                <div 
                    onClick={onTriggerUpload}
                    className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-[#27272a] rounded-xl bg-[#18181b]/50 text-[#71717a] cursor-pointer hover:bg-[#18181b] hover:border-blue-500/50 hover:text-blue-400 transition-all group z-10"
                >
                    <div className="mb-4 p-4 rounded-full bg-[#27272a] group-hover:bg-blue-500/10 group-hover:text-blue-400 transition-colors">
                        <Icons.Upload />
                    </div>
                    <p className="text-sm font-medium text-gray-300 group-hover:text-blue-200">No blueprint loaded</p>
                    <p className="text-xs">Upload a P&ID or architectural plan</p>
                </div>
            )}

            {/* Canvas Controls - Wired up to State */}
            {uploadedImage && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-[#09090b]/90 backdrop-blur-md border border-[#27272a] rounded-full px-4 py-2 flex items-center gap-4 shadow-2xl z-50">
                    <button onClick={() => setTransform(p => ({...p, scale: Math.max(0.1, p.scale / 1.2)}))} className="text-gray-400 hover:text-white transition-colors"><Icons.ChevronLeft className="rotate-[-90deg]" width={14} height={14} /></button>
                    <span className="text-xs font-mono text-blue-400 w-12 text-center">{(transform.scale * 100).toFixed(0)}%</span>
                    <button onClick={handleZoomIn} className="text-gray-400 hover:text-white transition-colors"><Icons.ChevronRight className="rotate-[-90deg]" width={14} height={14} /></button>
                    <div className="w-px h-3 bg-gray-700 mx-1"></div>
                    <button onClick={handleReset} className="text-[10px] font-bold uppercase text-gray-500 hover:text-white transition-colors">Reset</button>
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

            {/* Helper for zoom functionality export if needed */}
            <div id="canvas-controls-portal"></div> 
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
                    <div className="absolute top-full left-0 mt-1 w-64 bg-zinc-900 border border-[#27272a] rounded-lg shadow-2xl z-[100] py-1 animate-fade-in ring-1 ring-white/5">
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
                    <div className="absolute top-full left-0 mt-1 w-72 bg-zinc-900 border border-[#27272a] rounded-lg shadow-2xl z-[100] py-1 animate-fade-in ring-1 ring-white/5">
                        <div className="px-3 py-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest border-b border-[#27272a] mb-1 flex justify-between items-center">
                            <span>Project Files</span>
                            <span className="text-[9px] bg-gray-800 px-1.5 py-0.5 rounded text-gray-400 tabular-nums">{activeProject.blueprintsData.length}</span>
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
    isAnalyzing,
    onRunAnalysis,
    onCancelAnalysis,
    uploadedImage,
    onUpload
}: { 
    blueprint: Blueprint, 
    activeProject: Project,
    projects: Project[],
    onSelectProject: (projectId: string, blueprintId?: string) => void,
    isProcessing: boolean, 
    isAnalyzing: boolean,
    onRunAnalysis: () => void,
    onCancelAnalysis: () => void,
    uploadedImage: string | null,
    onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const isRunning = isProcessing || isAnalyzing;

    return (
        <div className="flex flex-col h-full animate-fade-in">
             {/* Workspace Header */}
            <div className="h-14 border-b border-[var(--border-subtle)] bg-[var(--bg-app)] flex items-center justify-between px-6 shrink-0 relative z-50">
                <div className="flex items-center gap-6">
                    <ContextSwitcher 
                        projects={projects} 
                        activeProject={activeProject} 
                        activeBlueprint={blueprint} 
                        onSelect={onSelectProject} 
                    />
                    
                    <span className="h-4 w-px bg-[var(--border-active)]"></span>
                    
                    <div className="flex items-center gap-2 text-[10px] text-[var(--text-muted)] font-medium uppercase tracking-wider">
                        <span>Core: <span className="text-emerald-500">{ACTIVE_MODEL_NAME}</span></span>
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
                    
                    {/* RUN / CANCEL CONTROLS */}
                    <div className="flex items-center gap-2">
                        <button 
                            onClick={onRunAnalysis}
                            disabled={isRunning || !uploadedImage}
                            title="Execute AI Pipeline"
                            className={`flex items-center justify-center w-8 h-8 rounded-full transition-all border ${
                                isRunning || !uploadedImage
                                ? 'bg-gray-800 text-gray-600 border-transparent cursor-not-allowed' 
                                : 'bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-500/20 border-blue-400/20 active:scale-95'
                            }`}
                        >
                            {isProcessing || isAnalyzing ? (
                                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <Icons.Play width={14} height={14} />
                            )}
                        </button>

                        {isRunning && (
                            <button 
                                onClick={onCancelAnalysis}
                                title="Stop Analysis"
                                className="flex items-center justify-center w-8 h-8 rounded-full bg-[#18181b] border border-rose-500/30 text-rose-500 hover:bg-rose-500/10 hover:text-rose-400 transition-all active:scale-95"
                            >
                                <Icons.Stop width={10} height={10} />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Canvas Area */}
            <div className="flex-1 relative overflow-hidden bg-[#09090b]">
                <BlueprintCanvas 
                    isProcessing={isProcessing} // Only stage 1 causes the full canvas overlay
                    uploadedImage={uploadedImage} 
                    onTriggerUpload={() => fileInputRef.current?.click()}
                />
                
                 {/* Floating Toolbar */}
                <div className="absolute top-4 right-4 flex flex-col gap-2 bg-[#09090b]/80 backdrop-blur-md border border-[var(--border-subtle)] rounded-xl p-1 shadow-2xl z-20 overflow-hidden">
                    {/* Note: Zoom buttons are now handled inside BlueprintCanvas via internal state, 
                        these global buttons could interact via context in a larger app, 
                        but for now we keep the upload button here. */}
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
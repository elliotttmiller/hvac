import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Icons } from '../components/Icons';
import { Blueprint, Project, DetectedComponent } from '../types';
import { AI_MODELS } from '../services/aiService';

const BlueprintCanvas = ({ 
    isProcessing, 
    uploadedImage, 
    onTriggerUpload,
    highlightedComponentId,
    components,
    onHoverComponent,
    onSelectComponent,
    pageIndex = 0,
    totalPages = 0,
    onPageChange
}: { 
    isProcessing: boolean, 
    uploadedImage: string | null, 
    onTriggerUpload: () => void,
    highlightedComponentId: string | null,
    components: DetectedComponent[],
    onHoverComponent: (id: string | null) => void,
    onSelectComponent: (id: string) => void,
    pageIndex?: number,
    totalPages?: number,
    onPageChange?: (index: number) => void
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const imgRef = useRef<HTMLImageElement>(null);
    const [transform, setTransform] = useState({ scale: 1, x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    // New state to prevent flash of giant unscaled image
    const [hasFitted, setHasFitted] = useState(false);

    const highlightedComponent = components.find(c => c.id === highlightedComponentId);

    // Auto-fit function with retry logic
    const fitToContainer = useCallback(() => {
        requestAnimationFrame(() => {
            const container = containerRef.current;
            const img = imgRef.current;

            if (!container || !img) return;

            // Dimensions check
            const contW = container.clientWidth;
            const contH = container.clientHeight;
            const imgW = img.naturalWidth || img.width;
            const imgH = img.naturalHeight || img.height;

            // Robustness: If dimensions are zero (e.g. during tab switch or initial render), retry shortly
            if (contW === 0 || contH === 0 || imgW === 0 || imgH === 0) {
                setTimeout(fitToContainer, 100);
                return;
            }

            // Calculate scale to contain image within container with padding
            const scaleX = contW / imgW;
            const scaleY = contH / imgH;
            // 90% fit to leave a comfortable margin
            const scale = Math.min(scaleX, scaleY) * 0.90;

            // Center the image based on the new scale
            const x = (contW - (imgW * scale)) / 2;
            const y = (contH - (imgH * scale)) / 2;

            setTransform({ scale, x, y });
            setHasFitted(true);
        });
    }, []);

    // Watch for image upload changes
    useEffect(() => {
        if (!uploadedImage) {
            setTransform({ scale: 1, x: 0, y: 0 });
            setHasFitted(false);
            return;
        }
        
        // Reset fitted state when new image arrives
        setHasFitted(false);

        // Attempt fit if image is already cached/loaded
        if (imgRef.current && imgRef.current.complete) {
            fitToContainer();
        }
    }, [uploadedImage, fitToContainer]);

    // Resize Observer
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const observer = new ResizeObserver(() => {
            if (uploadedImage && imgRef.current) {
                fitToContainer();
            }
        });

        observer.observe(container);
        return () => observer.disconnect();
    }, [uploadedImage, fitToContainer]);

    const handleWheel = useCallback((e: React.WheelEvent) => {
        if (!uploadedImage) return;
        e.preventDefault();

        const zoomSensitivity = 0.001;
        const minScale = 0.05; 
        const maxScale = 20; // Increased max zoom for PDF detail

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
        fitToContainer();
    };

    const handleZoomIn = () => {
        setTransform(prev => ({ ...prev, scale: Math.min(prev.scale * 1.2, 20) }));
    };

    return (
        <div 
            ref={containerRef}
            className="relative w-full h-full bg-[#09090b] overflow-hidden cursor-crosshair select-none"
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
        >
            {/* Background Grid */}
            <div className="absolute inset-0 opacity-10 pointer-events-none" 
                 style={{ 
                    backgroundImage: 'radial-gradient(#4b5563 1px, transparent 1px)', 
                    backgroundSize: '20px 20px',
                 }}>
            </div>

            {uploadedImage ? (
                <div 
                    className="absolute top-0 left-0 origin-top-left will-change-transform"
                    style={{ 
                        transform: `translate3d(${transform.x}px, ${transform.y}px, 0) scale(${transform.scale})`,
                        cursor: isDragging ? 'grabbing' : 'grab',
                        opacity: hasFitted ? 1 : 0, // Prevent flash of giant unscaled image
                        transition: isDragging ? 'none' : 'opacity 0.3s ease-in',
                    }}
                >
                    <img 
                        ref={imgRef}
                        src={uploadedImage} 
                        alt="Blueprint" 
                        draggable={false}
                        onLoad={fitToContainer}
                        className={`max-w-none shadow-2xl border border-[#27272a] ${isProcessing ? 'opacity-50 blur-[1px]' : 'opacity-100'}`}
                        onDragStart={(e) => e.preventDefault()} 
                    />
                    
                    {/* HIT TARGETS FOR HOVER INTERACTION (Invisible Layer) - Only if on Page 1 or single image */}
                    {pageIndex === 0 && components.map(comp => comp.boundingBox && (
                        <div
                            key={comp.id}
                            className="absolute cursor-pointer hover:bg-blue-500/10 hover:ring-1 hover:ring-blue-500/30 transition-colors rounded-sm z-20"
                            style={{
                                left: `${comp.boundingBox.xmin * 100}%`,
                                top: `${comp.boundingBox.ymin * 100}%`,
                                width: `${(comp.boundingBox.xmax - comp.boundingBox.xmin) * 100}%`,
                                height: `${(comp.boundingBox.ymax - comp.boundingBox.ymin) * 100}%`,
                            }}
                            onMouseEnter={() => onHoverComponent(comp.id)}
                            onMouseLeave={() => onHoverComponent(null)}
                            onClick={(e) => { e.stopPropagation(); onSelectComponent(comp.id); }}
                        />
                    ))}

                    {/* Hover Highlight Overlay - Only renders floating HUD */}
                    {pageIndex === 0 && highlightedComponent && highlightedComponent.boundingBox && (
                        <div 
                            className="absolute z-30 pointer-events-none animate-fade-in"
                            style={{
                                // Calculate Center Point based on bounding box
                                left: `${(highlightedComponent.boundingBox.xmin + highlightedComponent.boundingBox.xmax) / 2 * 100}%`,
                                top: `${(highlightedComponent.boundingBox.ymin + highlightedComponent.boundingBox.ymax) / 2 * 100}%`,
                            }}
                        >
                            {/* Floating Tech Label - SLEEK MINIMALIST REDESIGN */}
                            <div 
                                className="relative flex items-center justify-center"
                                // Counter-scale the text so it stays readable regardless of image zoom
                                style={{ transform: `translate(-50%, -50%) scale(${1 / transform.scale})` }}
                            >
                                {/* Label Container - Absolute Positioned ABOVE the dot */}
                                <div 
                                    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 flex flex-col items-center min-w-max z-20 pointer-events-auto cursor-pointer"
                                    onClick={(e) => { e.stopPropagation(); onSelectComponent(highlightedComponent.id); }}
                                >
                                     <div className="bg-black/90 backdrop-blur-md border border-blue-500/30 rounded px-2 py-1 shadow-2xl flex flex-col items-center hover:bg-blue-600 transition-colors">
                                        <span className="text-[9px] font-bold text-white leading-none whitespace-nowrap font-mono tracking-tight">{highlightedComponent.id}</span>
                                        <span className="text-[7px] text-blue-300/80 leading-none whitespace-nowrap mt-0.5 uppercase tracking-wide group-hover:text-white">{highlightedComponent.name}</span>
                                     </div>
                                     {/* Leader Line - Points down to dot */}
                                     <div className="absolute top-full left-1/2 -translate-x-1/2 w-px h-2 bg-gradient-to-b from-blue-500/50 to-transparent"></div>
                                </div>

                                {/* Blinking Target Indicator (Centered on point) */}
                                <div className="relative z-10">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.8)] z-10 relative"></div>
                                    <div className="absolute inset-0 w-2 h-2 bg-blue-400 rounded-full animate-ping opacity-75"></div>
                                </div>
                            </div>
                        </div>
                    )}

                    {isProcessing && (
                        <div className="absolute inset-0 z-20 overflow-hidden rounded-lg">
                             <div className="absolute top-0 left-0 w-full h-[2px] bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.8)] animate-scan"></div>
                             <div className="absolute inset-0 bg-blue-500/10 mix-blend-overlay flex items-center justify-center">
                                <div 
                                    className="bg-black/60 backdrop-blur-sm px-6 py-3 rounded-xl border border-blue-500/30 flex flex-col items-center gap-2"
                                    style={{ transform: `scale(${1/transform.scale})` }}
                                >
                                    <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                    <span className="text-xs font-medium text-blue-400 uppercase tracking-widest whitespace-nowrap">Analyzing...</span>
                                </div>
                             </div>
                        </div>
                    )}
                </div>
            ) : (
                <div 
                    onClick={onTriggerUpload}
                    className="w-full h-full flex flex-col items-center justify-center p-12 text-[#71717a] cursor-pointer hover:text-blue-400 transition-all group z-10"
                >
                    <div className="mb-4 p-6 rounded-full bg-[#18181b] border-2 border-dashed border-[#27272a] group-hover:bg-[#18181b] group-hover:border-blue-500/50 transition-all">
                        <Icons.Upload width={32} height={32} />
                    </div>
                    <p className="text-sm font-medium text-gray-300 group-hover:text-blue-200">No blueprint loaded</p>
                    <p className="text-xs">Upload P&ID (Image/PDF)</p>
                </div>
            )}

            {/* Canvas Controls */}
            {uploadedImage && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-[#09090b]/90 backdrop-blur-md border border-[#27272a] rounded-full px-4 py-2 flex items-center gap-4 shadow-2xl z-50 transition-all">
                    {/* Pagination Controls - Only show if multiple pages */}
                    {totalPages > 1 && onPageChange && (
                        <>
                            <div className="flex items-center gap-2">
                                <button 
                                    onClick={() => onPageChange(Math.max(0, pageIndex - 1))}
                                    disabled={pageIndex === 0}
                                    className={`text-gray-400 transition-colors ${pageIndex === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:text-white'}`}
                                    title="Previous Page"
                                >
                                    <Icons.ChevronLeft width={14} height={14} />
                                </button>
                                <span className="text-xs font-mono text-gray-300 w-20 text-center">
                                    Page {pageIndex + 1} <span className="text-gray-600">/</span> {totalPages}
                                </span>
                                <button 
                                    onClick={() => onPageChange(Math.min(totalPages - 1, pageIndex + 1))}
                                    disabled={pageIndex === totalPages - 1}
                                    className={`text-gray-400 transition-colors ${pageIndex === totalPages - 1 ? 'opacity-30 cursor-not-allowed' : 'hover:text-white'}`}
                                    title="Next Page"
                                >
                                    <Icons.ChevronRight width={14} height={14} />
                                </button>
                            </div>
                            <div className="w-px h-3 bg-gray-700 mx-1"></div>
                        </>
                    )}

                    {/* Zoom Controls */}
                    <button onClick={() => setTransform(p => ({...p, scale: Math.max(0.05, p.scale / 1.2)}))} className="text-gray-400 hover:text-white transition-colors"><Icons.ChevronLeft className="rotate-[-90deg]" width={14} height={14} /></button>
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
            <div id="canvas-controls-portal"></div> 
        </div>
    );
};

const ModelSwitcher = ({ 
    activeModelId, 
    onSelect 
}: { 
    activeModelId: string, 
    onSelect: (id: string) => void
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const activeModel = Object.values(AI_MODELS).find(m => m.id === activeModelId) || AI_MODELS.FLASH;

    return (
        <div className="relative">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-2 px-2 py-1 rounded-md transition-all hover:bg-[#18181b] ${isOpen ? 'bg-[#18181b] text-blue-400' : 'text-gray-500'}`}
            >
                <div className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-wider">
                    <span>Core:</span>
                    <span className={`flex items-center gap-1.5 ${activeModel.id === AI_MODELS.FLASH.id ? 'text-blue-500' : 'text-purple-400'}`}>
                        {activeModel.label}
                    </span>
                </div>
                <Icons.ChevronDown width={10} height={10} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 mt-1 w-72 bg-zinc-900 border border-[#27272a] rounded-lg shadow-2xl z-[100] py-1 animate-fade-in ring-1 ring-white/5">
                    <div className="px-3 py-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest border-b border-[#27272a] mb-1">Inference Engine</div>
                    <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                        {Object.values(AI_MODELS).map(model => (
                            <button
                                key={model.id}
                                onClick={() => { onSelect(model.id); setIsOpen(false); }}
                                className={`w-full text-left px-3 py-2.5 text-xs flex flex-col gap-0.5 hover:bg-blue-600/10 group transition-colors ${model.id === activeModelId ? 'bg-blue-600/5 border-l-2 border-blue-500' : 'border-l-2 border-transparent'}`}
                            >
                                <div className="flex items-center justify-between">
                                    <span className={`font-medium ${model.id === activeModelId ? 'text-blue-400' : 'text-gray-300'}`}>{model.label}</span>
                                    {model.id === activeModelId && <Icons.CheckCircle width={12} height={12} className="text-blue-500" />}
                                </div>
                                <div className="text-[9px] font-mono text-gray-600 group-hover:text-gray-500 transition-colors uppercase tracking-tighter">{model.id}</div>
                                <div className="text-[10px] text-gray-500 mt-1 leading-relaxed line-clamp-2">{model.description}</div>
                            </button>
                        ))}
                    </div>
                </div>
            )}
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
    onUpload,
    onClearWorkspace,
    highlightedComponentId,
    components,
    activeModelId,
    onSelectModel,
    onHoverComponent,
    onSelectComponent,
    documentPages = []
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
    onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void,
    onClearWorkspace: () => void,
    highlightedComponentId: string | null,
    components: DetectedComponent[],
    activeModelId: string,
    onSelectModel: (id: string) => void,
    onHoverComponent: (id: string | null) => void,
    onSelectComponent: (id: string) => void,
    documentPages?: string[]
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const isRunning = isProcessing || isAnalyzing;
    const [pageIndex, setPageIndex] = useState(0);

    // Reset page index when documentPages changes (new load)
    useEffect(() => {
        setPageIndex(0);
    }, [documentPages]);

    // Determine currently displayed image based on pages available
    const activeImage = documentPages && documentPages.length > 0 
        ? documentPages[pageIndex] 
        : uploadedImage;

    // Fix: Reset file input when workspace is cleared so users can re-upload the same file immediately
    useEffect(() => {
        if (!uploadedImage && fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }, [uploadedImage]);

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
                    
                    <ModelSwitcher 
                        activeModelId={activeModelId} 
                        onSelect={onSelectModel} 
                    />

                    {/* NEW IMPORT BUTTON */}
                    <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center justify-center w-8 h-8 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-all shadow-lg shadow-blue-500/20 group"
                        title="Import New Blueprint"
                    >
                        <Icons.Plus width={16} height={16} className="group-hover:scale-110 transition-transform" />
                    </button>
                </div>

                <div className="flex items-center gap-3">
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        accept="image/*,application/pdf" 
                        onChange={onUpload}
                    />
                    
                    {/* RUN / CANCEL CONTROLS */}
                    <div className="flex items-center gap-2">
                        {/* Clear/Reset Button */}
                        {uploadedImage && !isRunning && (
                            <button 
                                onClick={onClearWorkspace}
                                className="p-2 mr-2 text-gray-500 hover:text-white hover:bg-[#27272a] rounded-md transition-all group relative"
                                title="Clear Workspace / Close File"
                            >
                                <Icons.Trash width={16} height={16} className="group-hover:text-rose-400 transition-colors" />
                            </button>
                        )}

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
                    isProcessing={isProcessing} 
                    uploadedImage={activeImage} 
                    onTriggerUpload={() => fileInputRef.current?.click()}
                    highlightedComponentId={highlightedComponentId}
                    components={components}
                    onHoverComponent={onHoverComponent}
                    onSelectComponent={onSelectComponent}
                    pageIndex={pageIndex}
                    totalPages={documentPages.length}
                    onPageChange={setPageIndex}
                />
            </div>
        </div>
    );
};

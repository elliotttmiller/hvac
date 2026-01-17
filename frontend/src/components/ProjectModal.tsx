
import React, { useState, useRef, useEffect } from "react";
import { Icons } from "./Icons";
import { Project, Activity, AnalysisReport, ProjectSettings, TeamMember, Issue, Comment } from "../types";
import { MarkdownRenderer, getStatusColor, HealthStatus } from "./common";
import { OpenIssuesModal } from "./OpenIssuesModal";

const MetricCard = ({ 
    label, 
    value, 
    subtext, 
    icon, 
    health,
    onClick 
}: { 
    label: string, 
    value: string, 
    subtext: React.ReactNode, 
    icon: React.ReactNode, 
    health: HealthStatus,
    onClick?: () => void
}) => {
    const colors = {
        green: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
        amber: 'text-orange-400 bg-orange-500/10 border-orange-500/20', // Updated to Orange
        red: 'text-rose-500 bg-rose-500/10 border-rose-500/20',
        blue: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
        gray: 'text-gray-400 bg-gray-500/10 border-gray-500/20'
    };

    return (
        <div 
            onClick={onClick}
            className={`p-4 rounded-lg border border-[#27272a] bg-[#121214] hover:border-[#3f3f46] transition-colors relative overflow-hidden group ${onClick ? 'cursor-pointer hover:bg-[#18181b]' : ''}`}
        >
            <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</span>
                <div className={`p-1.5 rounded-md ${colors[health]}`}>
                    {icon}
                </div>
            </div>
            <div className="text-2xl font-bold text-white tracking-tight tabular-nums">{value}</div>
            <div className="text-[10px] text-gray-500 mt-1 flex items-center gap-1">
                {subtext}
            </div>
            {onClick && (
                <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Icons.ExternalLink width={12} height={12} className="text-gray-500" />
                </div>
            )}
        </div>
    );
};

const WorkflowStep = ({ label, status, date, health }: { label: string, status: 'complete' | 'current' | 'pending', date?: string, health: HealthStatus }) => {
    const healthColors = {
        green: 'bg-emerald-500',
        amber: 'bg-orange-400', // Updated to Orange
        red: 'bg-rose-500',
        blue: 'bg-blue-500',
        gray: 'bg-gray-700'
    };

    return (
        <div className="flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full ${status === 'pending' ? 'bg-gray-700' : healthColors[health]} ${status === 'current' ? 'animate-pulse' : ''}`}></div>
            <div className="flex-1">
                <div className={`text-xs font-medium ${status === 'pending' ? 'text-gray-600' : 'text-gray-300'}`}>{label}</div>
                {date && <div className="text-[10px] text-gray-600">{date}</div>}
            </div>
            {status === 'complete' && <Icons.CheckCircle width={12} height={12} className={healthColors[health].replace('bg-', 'text-')} />}
        </div>
    );
};

const SettingsSection = ({ title, icon, children }: { title: string, icon: React.ReactNode, children?: React.ReactNode }) => (
    <div className="bg-[#121214] border border-[#27272a] rounded-xl overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-[#27272a] bg-[#18181b]/50 flex items-center gap-3">
            <div className="text-blue-400">{icon}</div>
            <h3 className="text-sm font-semibold text-gray-200">{title}</h3>
        </div>
        <div className="p-6">
            {children}
        </div>
    </div>
);

const SettingField = ({ label, children, description }: { label: string, children?: React.ReactNode, description?: string }) => (
    <div className="mb-5 last:mb-0">
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{label}</label>
        {children}
        {description && <p className="text-[10px] text-gray-600 mt-1.5 leading-relaxed">{description}</p>}
    </div>
);

export const ProjectModal = ({ 
    project, 
    onClose, 
    onOpenWorkspace,
    onUploadBlueprint,
    onUpdateProject
}: { 
    project: Project, 
    onClose: () => void, 
    onOpenWorkspace: (blueprintId?: string) => void,
    onUploadBlueprint: (file: File, projectId: string) => void,
    onUpdateProject: (project: Project) => void
}) => {
    const [activeTab, setActiveTab] = useState<'overview' | 'blueprints' | 'analysis' | 'team' | 'settings'>('overview');
    const [viewingReport, setViewingReport] = useState<AnalysisReport | null>(null);
    const [isOpenIssuesModalOpen, setIsOpenIssuesModalOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // --- SETTINGS STATE ---
    // Initialize local settings with defaults if they don't exist
    const [localSettings, setLocalSettings] = useState<ProjectSettings>(project.settings || {
        jobNumber: `JOB-${new Date().getFullYear()}-${Math.floor(Math.random()*1000)}`,
        phase: 'Design Development',
        buildingCode: 'IBC 2021',
        ashraeStandards: ['62.1-2019', '90.1-2019'],
        laborRate: 115.00,
        materialMarkup: 15,
        taxRate: 8.25,
        contingency: 10,
        measurementSystem: 'imperial'
    });
    
    // Local editable state for basic fields
    const [basicInfo, setBasicInfo] = useState({
        name: project.name,
        client: project.client,
        location: project.location,
        budget: project.budget,
        description: project.description
    });

    const [isSaving, setIsSaving] = useState(false);

    // --- TEAM STATE ---
    const [isAddingMember, setIsAddingMember] = useState(false);
    const [newMember, setNewMember] = useState<TeamMember>({ name: '', role: 'Engineer', initials: '' });

    // Handle Issue Resolution
    const handleResolveIssue = (issueId: string) => {
        const issueIndex = project.issues.findIndex(i => i.id === issueId);
        if (issueIndex === -1) return;

        const updatedIssues = [...project.issues];
        updatedIssues[issueIndex] = {
            ...updatedIssues[issueIndex],
            status: 'resolved'
        };

        const resolvedCount = project.issues.filter(i => i.status === 'open').length - 1;

        const updatedProject: Project = {
            ...project,
            issues: updatedIssues,
            openIssues: Math.max(0, resolvedCount),
            activityLog: [
                { 
                    text: `Issue resolved: ${updatedIssues[issueIndex].title}`, 
                    time: 'Just now', 
                    type: 'check' as const 
                },
                ...project.activityLog
            ]
        };

        onUpdateProject(updatedProject);
    };

    // Handle Issue Dismissal
    const handleDismissIssue = (issueId: string) => {
        const issueIndex = project.issues.findIndex(i => i.id === issueId);
        if (issueIndex === -1) return;

        const updatedIssues = [...project.issues];
        updatedIssues[issueIndex] = {
            ...updatedIssues[issueIndex],
            status: 'ignored'
        };

        const openCount = project.issues.filter(i => i.status === 'open').length - 1;

        const updatedProject: Project = {
            ...project,
            issues: updatedIssues,
            openIssues: Math.max(0, openCount),
            activityLog: [
                { 
                    text: `Issue dismissed: ${updatedIssues[issueIndex].title}`, 
                    time: 'Just now', 
                    type: 'alert' as const 
                },
                ...project.activityLog
            ]
        };

        onUpdateProject(updatedProject);
    };

    const handleAddIssueComment = (issueId: string, text: string) => {
        const issueIndex = project.issues.findIndex(i => i.id === issueId);
        if (issueIndex === -1) return;

        const newComment: Comment = {
             id: `c-${Date.now()}`,
             text,
             author: 'Me', // hardcoded for now 
             initials: 'ME',
             timestamp: 'Just now',
             role: 'Lead'
        };

        const updatedIssues = [...project.issues];
        const existingComments = updatedIssues[issueIndex].comments || [];
        updatedIssues[issueIndex] = {
            ...updatedIssues[issueIndex],
            comments: [...existingComments, newComment]
        };

        const updatedProject = {
            ...project,
            issues: updatedIssues
        };
        onUpdateProject(updatedProject);
    };

    const handleSaveSettings = () => {
        setIsSaving(true);
        setTimeout(() => {
            const updatedProject: Project = {
                ...project,
                ...basicInfo,
                settings: localSettings,
                lastUpdated: 'Just now'
            };
            onUpdateProject(updatedProject);
            setIsSaving(false);
        }, 600);
    };

    const handleArchiveProject = () => {
        if(confirm("Are you sure you want to archive this project? It will move to read-only state.")) {
             const updatedProject: Project = {
                ...project,
                status: 'archived',
                lastUpdated: 'Just now'
            };
            onUpdateProject(updatedProject);
            onClose();
        }
    };

    const handleAddMember = () => {
        if (!newMember.name || !newMember.initials) return;
        
        const updatedProject: Project = {
            ...project,
            team: [...project.team, newMember]
        };
        onUpdateProject(updatedProject);
        
        setNewMember({ name: '', role: 'Engineer', initials: '' });
        setIsAddingMember(false);
    };

    const toggleAshrae = (std: string) => {
        setLocalSettings(prev => {
            const exists = prev.ashraeStandards.includes(std);
            return {
                ...prev,
                ashraeStandards: exists 
                    ? prev.ashraeStandards.filter(s => s !== std)
                    : [...prev.ashraeStandards, std]
            };
        });
    };

    const handleContentClick = (e: React.MouseEvent) => {
        e.stopPropagation();
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            onUploadBlueprint(file, project.id);
            setActiveTab('blueprints');
        }
    };

    const budgetUtilized = project.budget ? project.budget * (project.progress / 100) : 0;
    const projectHealth = getStatusColor(project.status, project.openIssues);
    
    // Calculate total assets from all blueprints
    const totalAssets = project.blueprintsData.reduce((acc, bp) => acc + (bp.detectedComponents?.length || 0), 0);

    const getIconForType = (type: Activity['type']) => {
        switch(type) {
            case 'cpu': return <Icons.Cpu />;
            case 'clipboard': return <Icons.Clipboard />;
            case 'upload': return <Icons.Upload />;
            case 'alert': return <Icons.AlertTriangle />;
            case 'check': return <Icons.CheckCircle />;
            default: return <Icons.Plus />;
        }
    };

    const getColorForType = (type: Activity['type']) => {
        switch(type) {
            case 'cpu': return 'text-blue-400';
            case 'clipboard': return 'text-emerald-400';
            case 'upload': return 'text-gray-400';
            case 'alert': return 'text-orange-400'; // Updated to Orange
            case 'check': return 'text-emerald-500';
            default: return 'text-gray-500';
        }
    };

    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-8 animate-fade-in">
             {/* Open Issues Detail Modal */}
             <OpenIssuesModal 
                isOpen={isOpenIssuesModalOpen}
                onClose={() => setIsOpenIssuesModalOpen(false)}
                project={project}
                onResolveIssue={handleResolveIssue}
                onDismissIssue={handleDismissIssue}
                onAddComment={handleAddIssueComment}
             />

             <div 
               className="absolute inset-0 bg-black/80 backdrop-blur-md z-40 transition-opacity"
               onClick={onClose}
             ></div>

             <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*,application/pdf" 
                onChange={handleFileChange} 
             />
             
             <div 
                className="relative z-50 w-full max-w-6xl h-[90%] bg-[#09090b] border border-[#27272a] rounded-xl shadow-2xl flex flex-col overflow-hidden"
                onClick={handleContentClick}
             >
                {/* Header */}
                <div className="h-20 border-b border-[#27272a] bg-[#121214] flex items-center justify-between px-8 shrink-0">
                    <div className="flex items-center gap-5">
                        <div className={`w-12 h-12 bg-gradient-to-br from-[#121214] to-[#18181b] rounded-xl border border-[#27272a] flex items-center justify-center shadow-lg shadow-black/20 ${
                            projectHealth === 'green' ? 'text-emerald-400' : projectHealth === 'amber' ? 'text-orange-400' : projectHealth === 'red' ? 'text-rose-500' : 'text-blue-400'
                        }`}>
                            <Icons.Box width={24} height={24} />
                        </div>
                        <div>
                            <div className="flex items-center gap-3">
                                <h2 className="text-xl font-semibold text-white tracking-tight">{project.name}</h2>
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                                    projectHealth === 'green' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 
                                    projectHealth === 'amber' ? 'bg-orange-400/10 text-orange-400 border-orange-400/20' : 
                                    projectHealth === 'red' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' : 
                                    projectHealth === 'blue' ? 'bg-blue-500/10 text-blue-400 border-blue-400/20' :
                                    'bg-gray-500/10 text-gray-500 border-gray-500/20'
                                }`}>
                                    {projectHealth === 'green' ? 'On Track' : projectHealth === 'amber' ? 'Caution' : projectHealth === 'red' ? 'Critical' : projectHealth === 'blue' ? 'Completed' : 'Pending'}
                                </span>
                            </div>
                            <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                                <span className="flex items-center gap-1.5"><Icons.Users width={12} height={12} /> {project.client}</span>
                                <span className="w-1 h-1 rounded-full bg-gray-700"></span>
                                <span className="flex items-center gap-1.5"><Icons.Home width={12} height={12} /> {project.location || 'Site Unspecified'}</span>
                                <span className="w-1 h-1 rounded-full bg-gray-700"></span>
                                <span className="font-medium text-[10px] opacity-60 tracking-wider">ID: {project.id}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                         <button 
                            onClick={() => { onOpenWorkspace(); onClose(); }}
                            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium rounded-lg transition-all shadow-lg shadow-blue-500/20 group"
                         >
                            <Icons.ExternalLink width={14} height={14} />
                            Launch Workspace
                         </button>
                         <div className="h-8 w-px bg-[#27272a] mx-1"></div>
                         <button 
                            onClick={onClose}
                            className="p-2.5 text-gray-400 hover:text-white hover:bg-[#27272a] rounded-lg transition-colors"
                         >
                            <Icons.X width={20} height={20} />
                        </button>
                    </div>
                </div>

                {/* Sub-nav */}
                <div className="flex px-8 border-b border-[#27272a] bg-[#09090b] shrink-0 sticky top-0 z-10">
                    {[
                        { id: 'overview', label: 'Overview' },
                        { id: 'blueprints', label: 'Blueprints' },
                        { id: 'analysis', label: 'Analysis Reports' },
                        { id: 'team', label: 'Team' },
                        { id: 'settings', label: 'Configuration' }
                    ].map((tab) => (
                         <button 
                            key={tab.id}
                            onClick={() => { setActiveTab(tab.id as any); setViewingReport(null); }}
                            className={`px-4 py-4 text-xs font-medium border-b-2 transition-colors flex items-center gap-2 ${
                                activeTab === tab.id 
                                ? 'border-blue-500 text-blue-400 bg-blue-500/5' 
                                : 'border-transparent text-gray-500 hover:text-gray-300 hover:bg-[#121214]'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto bg-[#0c0c0e] relative custom-scrollbar">
                    
                    {/* OVERVIEW TAB */}
                    {activeTab === 'overview' && (
                        <div className="p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
                            
                            <div className="grid grid-cols-4 gap-4">
                                <MetricCard 
                                    label="Project Progress" 
                                    value={`${project.progress}%`} 
                                    subtext={<><span className={projectHealth === 'red' ? 'text-rose-500' : projectHealth === 'amber' ? 'text-orange-400' : 'text-emerald-500'}>
                                        {projectHealth === 'green' ? 'On Track' : projectHealth === 'amber' ? 'Caution' : projectHealth === 'red' ? 'Action Required' : 'Completed'}
                                    </span></>}
                                    icon={<Icons.Activity />}
                                    health={projectHealth}
                                />
                                <MetricCard 
                                    label="Total System Assets" 
                                    value={totalAssets.toLocaleString()} 
                                    subtext={totalAssets > 0 ? <><span className="text-blue-400">AI Digitized</span> from {project.blueprintsData.length} plans</> : <>Pending Analysis</>}
                                    icon={<Icons.Zap />}
                                    health={totalAssets > 0 ? 'blue' : 'gray'}
                                />
                                <MetricCard 
                                    label="Budget Utilized" 
                                    value={`$${budgetUtilized.toLocaleString()}`} 
                                    subtext={budgetUtilized > project.budget ? <span className="text-rose-500">Over Budget</span> : <>of ${project.budget.toLocaleString()} (Est.)</>}
                                    icon={<Icons.DollarSign />}
                                    health={budgetUtilized > project.budget ? 'red' : 'gray'}
                                />
                                <MetricCard 
                                    label="Open Issues" 
                                    value={project.openIssues.toString()} 
                                    subtext={project.openIssues > 0 ? <><span className={project.openIssues > 3 ? 'text-rose-500' : 'text-orange-500'}>{project.openIssues > 3 ? 'Immediate management attention' : 'Requires review'}</span></> : <>All clear</>}
                                    icon={<Icons.AlertTriangle />}
                                    health={project.openIssues > 3 ? 'red' : project.openIssues > 0 ? 'amber' : 'green'}
                                    onClick={() => setIsOpenIssuesModalOpen(true)}
                                />
                            </div>

                            <div className="grid grid-cols-3 gap-8">
                                <div className="col-span-2 space-y-8">
                                    <div className="bg-[#121214] border border-[#27272a] rounded-xl p-6 shadow-sm">
                                        <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                                            <Icons.Info width={16} height={16} className="text-blue-400" />
                                            Project Scope & Notes
                                        </h3>
                                        <p className="text-sm text-gray-400 leading-relaxed">
                                            {project.description || "No specific scope notes provided for this project bucket. Use the settings tab to refine metadata."}
                                        </p>
                                    </div>

                                    <div className="bg-[#121214] border border-[#27272a] rounded-xl p-6 shadow-sm">
                                        <div className="flex items-center justify-between mb-6">
                                            <h3 className="text-sm font-semibold text-white">Recent Activity</h3>
                                        </div>
                                        <div className="space-y-6 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-px before:bg-[#27272a]">
                                            {project.activityLog.length > 0 ? project.activityLog.map((item, i) => (
                                                <div key={i} className="flex gap-4 relative pl-2">
                                                    <div className={`w-4 h-4 rounded-full bg-[#121214] border border-[#27272a] flex items-center justify-center absolute -left-2 top-0.5 ${getColorForType(item.type)} shadow-sm z-10`}>
                                                        {React.cloneElement(getIconForType(item.type) as React.ReactElement<any>, { width: 10, height: 10 })}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-gray-300">{item.text}</p>
                                                        <p className="text-[10px] text-gray-600 mt-1">{item.time}</p>
                                                    </div>
                                                </div>
                                            )) : (
                                                <div className="text-sm text-gray-600 pl-4 italic">No activity recorded for this session.</div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="bg-[#121214] border border-[#27272a] rounded-xl p-5 shadow-sm">
                                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Workflow Status</h3>
                                        <div className="space-y-4">
                                            <WorkflowStep label="Data Upload" status={project.progress > 0 ? 'complete' : 'current'} date={project.startDate} health={projectHealth} />
                                            <WorkflowStep label="AI Analysis" status={project.progress > 25 ? 'complete' : project.progress > 0 ? 'current' : 'pending'} health={projectHealth} />
                                            <WorkflowStep label="Engineering Review" status={project.progress > 60 ? 'complete' : project.progress > 25 ? 'current' : 'pending'} health={projectHealth} />
                                            <WorkflowStep label="Client Report" status={project.progress >= 100 ? 'complete' : project.progress > 60 ? 'current' : 'pending'} health={projectHealth} />
                                        </div>
                                    </div>
                                    <div className="bg-blue-600/5 border border-blue-500/10 rounded-xl p-5 shadow-sm">
                                        <h3 className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-2">Quick Actions</h3>
                                        <div className="space-y-2">
                                            <button onClick={handleUploadClick} className="w-full py-2 px-3 bg-[#121214] border border-[#27272a] rounded text-xs text-gray-300 hover:text-white hover:border-blue-500/50 transition-all flex items-center gap-2">
                                                <Icons.Upload width={12} height={12} /> Upload File
                                            </button>
                                            <button onClick={() => { onOpenWorkspace(); onClose(); }} className="w-full py-2 px-3 bg-[#121214] border border-[#27272a] rounded text-xs text-gray-300 hover:text-white hover:border-blue-500/50 transition-all flex items-center gap-2">
                                                <Icons.Maximize width={12} height={12} /> Open Workspace
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    {/* ... (rest of the tabs remain the same) ... */}
                    {activeTab === 'blueprints' && (
                        // ... Blueprints content ...
                        <div className="p-8 max-w-7xl mx-auto animate-fade-in">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h3 className="text-lg font-medium text-white">Project Files</h3>
                                    <p className="text-xs text-gray-500 mt-1">Uploaded blueprints and P&ID schematics for this project.</p>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={handleUploadClick} className="px-4 py-2 bg-blue-600 text-white text-xs font-medium rounded hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2">
                                        <Icons.Upload width={14} height={14} /> 
                                        Upload New File
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                {project.blueprintsData.length > 0 ? (
                                    project.blueprintsData.map(bp => (
                                        <div key={bp.id} className="flex items-center justify-between p-4 rounded-lg bg-[#121214] border border-[#27272a] hover:border-blue-500/30 transition-all group">
                                            <div className="flex items-center gap-4">
                                                <div className="p-3 bg-[#09090b] rounded-lg text-gray-400 group-hover:text-blue-400 transition-colors">
                                                    <Icons.FileText width={24} height={24} />
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium text-white">{bp.name}</div>
                                                    <div className="text-[10px] text-gray-500 mt-0.5 flex items-center gap-2">
                                                        <span className="font-medium uppercase">ID: {bp.id}</span>
                                                        <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                                                        <span>Uploaded by {bp.uploadedBy || 'Lead Engineer'}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-8">
                                                <div className="text-right w-24">
                                                    <div className="text-[9px] text-gray-600 uppercase tracking-widest mb-1">Status</div>
                                                    <span className={`text-[10px] px-2 py-0.5 rounded border ${
                                                        bp.status === 'processed' ? 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' : 
                                                        bp.status === 'processing' ? 'text-blue-400 bg-blue-400/10 border-blue-400/20 animate-pulse' : 
                                                        'text-gray-400 bg-gray-400/10 border-gray-400/20'
                                                    }`}>
                                                        {bp.status}
                                                    </span>
                                                </div>
                                                <div className="text-right w-24">
                                                    <div className="text-[9px] text-gray-600 uppercase tracking-widest mb-1">Compliance</div>
                                                    <div className="text-sm font-medium tabular-nums text-white">{bp.compliance > 0 ? `${bp.compliance}%` : '-'}</div>
                                                </div>
                                                <button 
                                                    onClick={() => { onOpenWorkspace(bp.id); onClose(); }}
                                                    className="px-4 py-2 bg-[#18181b] border border-[#27272a] hover:bg-blue-600 hover:text-white hover:border-blue-500 text-[11px] text-gray-400 font-medium rounded transition-all"
                                                >
                                                    Open In Workspace
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed border-[#27272a] rounded-xl bg-[#121214]/50 group cursor-pointer" onClick={handleUploadClick}>
                                        <div className="p-4 rounded-full bg-[#18181b] mb-4 text-gray-600 group-hover:text-blue-500 transition-colors border border-[#27272a]">
                                            <Icons.Upload width={32} height={32} />
                                        </div>
                                        <p className="text-sm font-medium text-gray-300">Project File Bucket Empty</p>
                                        <p className="text-xs text-gray-500 mt-1 max-w-[280px] text-center px-6 leading-relaxed">
                                            No blueprints or architectural plans have been uploaded to this project. Click here or the button above to upload your first file.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                    {/* ... rest of the tabs ... */}
                    {activeTab === 'analysis' && (
                        <div className="p-8 max-w-7xl mx-auto animate-fade-in h-full flex flex-col">
                            {viewingReport ? (
                                <div className="flex-1 animate-fade-in bg-[#121214] border border-[#27272a] rounded-xl overflow-hidden flex flex-col">
                                    <div className="px-6 py-4 bg-[#18181b] border-b border-[#27272a] flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <button onClick={() => setViewingReport(null)} className="p-2 hover:bg-[#27272a] rounded text-gray-400 hover:text-white"><Icons.ChevronLeft /></button>
                                            <div>
                                                <h4 className="text-sm font-semibold text-white">Forensic Analysis: {viewingReport.blueprintName}</h4>
                                                <p className="text-[10px] text-gray-500 font-medium mt-0.5">{viewingReport.date} • {viewingReport.author}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button className="p-2 text-gray-400 hover:text-blue-400 transition-colors"><Icons.Clipboard width={16} height={16} /></button>
                                            <button className="p-2 text-gray-400 hover:text-blue-400 transition-colors"><Icons.FileText width={16} height={16} /></button>
                                        </div>
                                    </div>
                                    <div className="flex-1 overflow-y-auto p-8 prose prose-invert prose-sm max-w-none">
                                        <MarkdownRenderer content={viewingReport.content} />
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="flex items-center justify-between mb-8">
                                        <div>
                                            <h3 className="text-lg font-medium text-white">Forensic Reports Registry</h3>
                                            <p className="text-xs text-gray-500 mt-1">Registry of AI interpretations generated via Stage 2 inference.</p>
                                        </div>
                                    </div>

                                    {project.analysisReports && project.analysisReports.length > 0 ? (
                                        <div className="grid grid-cols-2 gap-4">
                                            {project.analysisReports.map(report => (
                                                <div 
                                                    key={report.id} 
                                                    onClick={() => setViewingReport(report)}
                                                    className="group p-5 rounded-xl bg-[#121214] border border-[#27272a] hover:border-blue-500/40 transition-all cursor-pointer relative overflow-hidden"
                                                >
                                                    <div className="absolute top-0 right-0 p-12 bg-blue-500 opacity-0 group-hover:opacity-[0.03] rounded-full -mr-6 -mt-6 transition-opacity"></div>
                                                    <div className="flex items-start gap-4">
                                                        <div className="p-3 bg-[#09090b] rounded-lg text-purple-400 border border-[#27272a] group-hover:border-blue-500/20 transition-all">
                                                            <Icons.Sparkles width={20} height={20} />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="text-sm font-semibold text-gray-100 mb-1 group-hover:text-blue-400 transition-colors truncate">
                                                                {report.blueprintName} Analysis
                                                            </div>
                                                            <div className="flex items-center justify-between mt-6">
                                                                <div className="flex items-center gap-2">
                                                                    <div className="w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center text-[8px] text-white">AI</div>
                                                                    <span className="text-[10px] text-gray-600 italic">AI Engine</span>
                                                                </div>
                                                                <span className="text-[10px] text-gray-500">{report.date}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center py-24 border border-dashed border-[#27272a] rounded-xl bg-[#121214]/30">
                                            <div className="p-4 rounded-full bg-[#18181b] border border-[#27272a] text-purple-900/40 mb-4">
                                                <Icons.Sparkles width={32} height={32} />
                                            </div>
                                            <p className="text-sm font-medium text-gray-300">Analysis Registry Pending</p>
                                            <p className="text-xs text-gray-500 mt-2 max-w-[320px] text-center px-6 leading-relaxed">
                                                No forensic reports have been generated for this project. To create one, open a blueprint in the <b>Workspace</b> and execute the <b>Run Pipeline</b> command.
                                            </p>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    )}
                    
                    {/* ... team and settings ... */}
                    {activeTab === 'team' && (
                        <div className="p-8 max-w-7xl mx-auto animate-fade-in">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h3 className="text-lg font-medium text-white">Collaborators</h3>
                                    <p className="text-xs text-gray-500 mt-1">Manage project access and permissions for your engineering team.</p>
                                </div>
                                <button 
                                    onClick={() => setIsAddingMember(true)}
                                    className="px-4 py-2 bg-[#18181b] border border-[#3f3f46] text-white text-xs font-medium rounded hover:bg-[#27272a] transition-all flex items-center gap-2"
                                >
                                    <Icons.Plus width={14} height={14} /> 
                                    Add Member
                                </button>
                            </div>

                            {/* Add Member Form */}
                            {isAddingMember && (
                                <div className="mb-6 p-4 bg-[#18181b] border border-[#27272a] rounded-lg animate-fade-in">
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">New Team Member</h4>
                                    <div className="grid grid-cols-4 gap-4 mb-4">
                                        <div className="col-span-2">
                                            <input 
                                                type="text" 
                                                placeholder="Full Name"
                                                value={newMember.name}
                                                onChange={(e) => setNewMember({...newMember, name: e.target.value})}
                                                className="w-full bg-[#09090b] border border-[#27272a] rounded p-2 text-sm text-white focus:border-blue-500 focus:outline-none"
                                            />
                                        </div>
                                        <div>
                                            <input 
                                                type="text" 
                                                placeholder="Role (e.g. Engineer)"
                                                value={newMember.role}
                                                onChange={(e) => setNewMember({...newMember, role: e.target.value})}
                                                className="w-full bg-[#09090b] border border-[#27272a] rounded p-2 text-sm text-white focus:border-blue-500 focus:outline-none"
                                            />
                                        </div>
                                        <div>
                                            <input 
                                                type="text" 
                                                placeholder="Initials (e.g. JD)"
                                                value={newMember.initials}
                                                onChange={(e) => setNewMember({...newMember, initials: e.target.value})}
                                                className="w-full bg-[#09090b] border border-[#27272a] rounded p-2 text-sm text-white focus:border-blue-500 focus:outline-none"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex justify-end gap-3">
                                        <button 
                                            onClick={() => setIsAddingMember(false)}
                                            className="px-3 py-1.5 text-xs text-gray-400 hover:text-white"
                                        >
                                            Cancel
                                        </button>
                                        <button 
                                            onClick={handleAddMember}
                                            disabled={!newMember.name || !newMember.initials}
                                            className={`px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded ${(!newMember.name || !newMember.initials) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-500'}`}
                                        >
                                            Save Member
                                        </button>
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                {project.team.length > 0 ? (
                                    project.team.map((member, i) => (
                                        <div key={i} className="p-5 rounded-xl bg-[#121214] border border-[#27272a] flex items-center gap-4 group">
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                                {member.initials}
                                            </div>
                                            <div className="flex-1">
                                                <div className="text-sm font-semibold text-white">{member.name}</div>
                                                <div className="text-xs text-gray-500">{member.role}</div>
                                            </div>
                                            <button className="p-2 text-gray-600 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Icons.Settings width={14} height={14} />
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-span-2 py-20 text-center text-gray-500 italic text-sm">
                                        No team members assigned.
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'settings' && (
                        <div className="p-8 max-w-5xl mx-auto animate-fade-in">
                            <div className="flex justify-between items-center mb-8">
                                <div>
                                    <h3 className="text-lg font-medium text-white">Project Configuration</h3>
                                    <p className="text-xs text-gray-500 mt-1">System-wide parameters for financials, compliance, and metadata.</p>
                                </div>
                                <button 
                                    onClick={handleSaveSettings}
                                    className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2"
                                >
                                    {isSaving ? <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <Icons.CheckCircle width={14} height={14} />}
                                    Save Changes
                                </button>
                            </div>

                            <div className="grid grid-cols-3 gap-8">
                                <div className="col-span-2 space-y-6">
                                    {/* SECTION 1: IDENTITY */}
                                    <SettingsSection title="Identity & Metadata" icon={<Icons.FileText width={18} height={18} />}>
                                        <div className="grid grid-cols-2 gap-5">
                                            <SettingField label="Project Name">
                                                <input type="text" value={basicInfo.name} onChange={e => setBasicInfo({...basicInfo, name: e.target.value})} className="w-full bg-[#09090b] border border-[#27272a] rounded-lg px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none" />
                                            </SettingField>
                                            <SettingField label="Client Organization">
                                                <input type="text" value={basicInfo.client} onChange={e => setBasicInfo({...basicInfo, client: e.target.value})} className="w-full bg-[#09090b] border border-[#27272a] rounded-lg px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none" />
                                            </SettingField>
                                            <SettingField label="Internal Job #">
                                                <input type="text" value={localSettings.jobNumber} onChange={e => setLocalSettings({...localSettings, jobNumber: e.target.value})} className="w-full bg-[#09090b] border border-[#27272a] rounded-lg px-3 py-2 text-sm text-white font-mono focus:border-blue-500 focus:outline-none" />
                                            </SettingField>
                                            <SettingField label="Project Phase">
                                                <select value={localSettings.phase} onChange={e => setLocalSettings({...localSettings, phase: e.target.value})} className="w-full bg-[#09090b] border border-[#27272a] rounded-lg px-3 py-2 text-sm text-gray-300 focus:border-blue-500 focus:outline-none">
                                                    <option>Pre-Design / Audit</option>
                                                    <option>Design Development</option>
                                                    <option>Construction Documents</option>
                                                    <option>Permitting</option>
                                                    <option>Construction Admin</option>
                                                </select>
                                            </SettingField>
                                            <div className="col-span-2">
                                                <SettingField label="Scope Description">
                                                    <textarea rows={3} value={basicInfo.description} onChange={e => setBasicInfo({...basicInfo, description: e.target.value})} className="w-full bg-[#09090b] border border-[#27272a] rounded-lg px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none resize-none" />
                                                </SettingField>
                                            </div>
                                        </div>
                                    </SettingsSection>

                                    {/* SECTION 2: FINANCIALS */}
                                    <SettingsSection title="Financial Parameters" icon={<Icons.DollarSign width={18} height={18} />}>
                                        <div className="grid grid-cols-2 gap-5">
                                            <SettingField label="Total Budget Limit" description="Hard cap for budget tracking warnings.">
                                                <div className="relative">
                                                    <span className="absolute left-3 top-2 text-gray-500 text-xs">$</span>
                                                    <input type="number" value={basicInfo.budget} onChange={e => setBasicInfo({...basicInfo, budget: parseFloat(e.target.value) || 0})} className="w-full bg-[#09090b] border border-[#27272a] rounded-lg pl-6 pr-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none tabular-nums" />
                                                </div>
                                            </SettingField>
                                            <SettingField label="Default Labor Rate" description="Applied to all new quote items automatically.">
                                                <div className="relative">
                                                    <span className="absolute left-3 top-2 text-gray-500 text-xs">$</span>
                                                    <input type="number" value={localSettings.laborRate} onChange={e => setLocalSettings({...localSettings, laborRate: parseFloat(e.target.value) || 0})} className="w-full bg-[#09090b] border border-[#27272a] rounded-lg pl-6 pr-10 py-2 text-sm text-white focus:border-blue-500 focus:outline-none tabular-nums" />
                                                    <span className="absolute right-3 top-2.5 text-gray-600 text-[10px]">/hr</span>
                                                </div>
                                            </SettingField>
                                            <SettingField label="Material Markup %" description="Standard markup applied to component list prices.">
                                                <input type="number" value={localSettings.materialMarkup} onChange={e => setLocalSettings({...localSettings, materialMarkup: parseFloat(e.target.value) || 0})} className="w-full bg-[#09090b] border border-[#27272a] rounded-lg px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none tabular-nums" />
                                            </SettingField>
                                            <SettingField label="Sales Tax Rate %">
                                                <input type="number" value={localSettings.taxRate} onChange={e => setLocalSettings({...localSettings, taxRate: parseFloat(e.target.value) || 0})} className="w-full bg-[#09090b] border border-[#27272a] rounded-lg px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none tabular-nums" />
                                            </SettingField>
                                        </div>
                                    </SettingsSection>
                                </div>

                                <div className="space-y-6">
                                     {/* SECTION 3: COMPLIANCE */}
                                    <SettingsSection title="Engineering Standards" icon={<Icons.CheckCircle width={18} height={18} />}>
                                        <div className="space-y-5">
                                            <SettingField label="Building Code Version">
                                                <select value={localSettings.buildingCode} onChange={e => setLocalSettings({...localSettings, buildingCode: e.target.value})} className="w-full bg-[#09090b] border border-[#27272a] rounded-lg px-3 py-2 text-sm text-gray-300 focus:border-blue-500 focus:outline-none">
                                                    <option>IBC 2021 (International Building Code)</option>
                                                    <option>IBC 2018</option>
                                                    <option>IMC 2021 (Mechanical Code)</option>
                                                    <option>UMC 2021 (Uniform Mechanical Code)</option>
                                                </select>
                                            </SettingField>
                                            
                                            <SettingField label="Active ASHRAE Standards">
                                                <div className="space-y-2">
                                                    {['62.1-2019 Ventilation', '90.1-2019 Energy', '55-2020 Thermal Comfort', '170-2021 Healthcare'].map(std => (
                                                        <label key={std} onClick={() => toggleAshrae(std)} className="flex items-center gap-3 p-3 bg-[#09090b] border border-[#27272a] rounded-lg cursor-pointer hover:border-blue-500/50 transition-colors group">
                                                            <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${localSettings.ashraeStandards.includes(std) ? 'bg-blue-600 border-blue-600' : 'border-gray-600 group-hover:border-gray-400'}`}>
                                                                {localSettings.ashraeStandards.includes(std) && <Icons.CheckCircle width={12} height={12} className="text-white" />}
                                                            </div>
                                                            <span className={`text-xs ${localSettings.ashraeStandards.includes(std) ? 'text-white font-medium' : 'text-gray-400'}`}>{std}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            </SettingField>
                                        </div>
                                    </SettingsSection>

                                    <div className="pt-6 border-t border-[#27272a]">
                                        <h3 className="text-xs font-bold text-rose-500 uppercase tracking-widest mb-4">Danger Zone</h3>
                                        <div className="p-4 border border-rose-500/20 bg-rose-500/5 rounded-xl space-y-4">
                                            <div>
                                                <div className="text-sm font-semibold text-gray-100">Archive Project</div>
                                                <p className="text-[10px] text-gray-500 mt-1 leading-relaxed">Moves project to cold storage. Stage 2 analysis will be disabled.</p>
                                            </div>
                                            <button 
                                                onClick={handleArchiveProject}
                                                className="w-full py-2 bg-[#09090b] border border-rose-500/30 text-rose-500 text-xs font-bold rounded hover:bg-rose-600 hover:text-white transition-all"
                                            >
                                                Archive Project
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
             </div>
        </div>
    );
};

import React, { useState } from 'react';
import { Icons } from '../components/Icons';
import { StatusBadge, getStatusColor } from '../components/common';
import { ProjectModal } from '../components/ProjectModal';
import { NewProjectModal, NewProjectData } from '../components/NewProjectModal';
import { Project } from '../types';

export const ProjectsView = ({ 
    projects, 
    onSelectProject,
    onCreateProject,
    onUploadBlueprint
}: { 
    projects: Project[], 
    onSelectProject: (projectId: string, blueprintId?: string) => void,
    onCreateProject: (data: NewProjectData) => void,
    onUploadBlueprint: (file: File, projectId: string) => void
}) => {
    const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
    const [isCreating, setIsCreating] = useState(false);

    const selectedProject = projects.find(p => p.id === selectedProjectId);

    return (
        <div className="relative h-full w-full">
            <div className="p-8 space-y-6 animate-fade-in overflow-y-auto h-full">
                 <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-xl font-medium text-white">Projects Directory</h2>
                        <p className="text-sm text-[var(--text-muted)]">Manage your HVAC analysis buckets</p>
                    </div>
                    <button 
                        onClick={() => setIsCreating(true)}
                        className="px-4 py-2 bg-[var(--accent-core)] text-white text-sm rounded hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/20 flex items-center gap-2"
                    >
                        <Icons.Plus width={16} height={16} />
                        New Project
                    </button>
                </div>

                <div className="w-full text-left border-collapse">
                    <div className="grid grid-cols-12 gap-4 pb-3 border-b border-[var(--border-subtle)] text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider px-4">
                        <div className="col-span-4">Project / Client</div>
                        <div className="col-span-2">Location</div>
                        <div className="col-span-2">Status</div>
                        <div className="col-span-1">Files</div>
                        <div className="col-span-1">Progress</div>
                        <div className="col-span-2 text-right">Last Updated</div>
                    </div>
                    <div className="space-y-1 mt-2">
                        {projects.map(proj => {
                            const health = getStatusColor(proj.status, proj.openIssues);
                            const barColors = {
                                green: 'bg-emerald-500',
                                amber: 'bg-amber-400',
                                red: 'bg-rose-500',
                                blue: 'bg-blue-500',
                                gray: 'bg-gray-700'
                            };

                            return (
                                <div 
                                    key={proj.id}
                                    onClick={() => setSelectedProjectId(proj.id)}
                                    className={`grid grid-cols-12 gap-4 py-4 px-4 items-center bg-[var(--bg-panel)] border border-transparent hover:border-[var(--border-active)] rounded transition-all cursor-pointer group ${health === 'red' ? 'border-l-rose-500/50 border-l-2' : ''}`}
                                >
                                    <div className="col-span-4 flex items-center gap-3">
                                        <div className={`p-2 rounded bg-gray-800 transition-colors ${
                                            health === 'green' ? 'group-hover:text-emerald-400' : 
                                            health === 'amber' ? 'group-hover:text-amber-400' : 
                                            health === 'red' ? 'group-hover:text-rose-500' : 
                                            'group-hover:text-white'
                                        }`}>
                                            <Icons.Box />
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium text-[var(--text-primary)]">{proj.name}</div>
                                            <div className="text-xs text-gray-500">{proj.client}</div>
                                        </div>
                                    </div>
                                    <div className="col-span-2 text-sm text-[var(--text-secondary)] truncate">
                                        <span className="flex items-center gap-1.5"><Icons.Home width={12} height={12} /> {proj.location}</span>
                                    </div>
                                    <div className="col-span-2">
                                        <StatusBadge status={proj.status} openIssues={proj.openIssues} />
                                    </div>
                                    <div className="col-span-1 text-sm text-[var(--text-secondary)]">
                                        {proj.blueprintsData.length}
                                    </div>
                                    <div className="col-span-1">
                                        <div className="flex items-center gap-2">
                                            <div className="h-1.5 w-16 bg-gray-800 rounded-full overflow-hidden">
                                                <div className={`h-full ${barColors[health]}`} style={{ width: `${proj.progress}%` }}></div>
                                            </div>
                                            <span className="text-[10px] text-gray-500">{proj.progress}%</span>
                                        </div>
                                    </div>
                                    <div className="col-span-2 text-right text-xs font-mono text-[var(--text-muted)]">
                                        {proj.lastUpdated}
                                    </div>
                                </div>
                            );
                        })}
                        {projects.length === 0 && (
                            <div className="py-12 flex flex-col items-center justify-center text-gray-500">
                                <Icons.Layers width={48} height={48} className="opacity-20 mb-4" />
                                <p className="text-sm">No projects found.</p>
                                <button onClick={() => setIsCreating(true)} className="text-blue-500 hover:underline text-xs mt-2">Create your first project</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {selectedProject && (
                <ProjectModal 
                    project={selectedProject} 
                    onClose={() => setSelectedProjectId(null)}
                    onOpenWorkspace={(blueprintId) => onSelectProject(selectedProject.id, blueprintId)}
                    onUploadBlueprint={onUploadBlueprint}
                />
            )}

            {isCreating && (
                <NewProjectModal 
                    onClose={() => setIsCreating(false)}
                    onCreate={onCreateProject}
                />
            )}
        </div>
    );
};

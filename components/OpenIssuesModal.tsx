import React, { useState } from 'react';
import { Icons } from './Icons';
import { Issue, Project, IssueSeverity } from '../types';
import { CommentThread, UserAvatar } from './Comments';

interface OpenIssuesModalProps {
    isOpen: boolean;
    onClose: () => void;
    project: Project;
    onResolveIssue: (issueId: string) => void;
    onDismissIssue: (issueId: string) => void;
    onAddComment: (issueId: string, text: string) => void;
}

export const OpenIssuesModal = ({ isOpen, onClose, project, onResolveIssue, onDismissIssue, onAddComment }: OpenIssuesModalProps) => {
    const [filter, setFilter] = useState<'all' | IssueSeverity>('all');
    const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});

    if (!isOpen) return null;

    // Filter logic
    const displayedIssues = project.issues.filter(issue => {
        if (issue.status !== 'open') return false; // Only show open issues in the main list
        if (filter === 'all') return true;
        return issue.severity === filter;
    });

    const criticalCount = project.issues.filter(i => i.status === 'open' && i.severity === 'critical').length;
    const warningCount = project.issues.filter(i => i.status === 'open' && i.severity === 'warning').length;

    const toggleComments = (id: string) => {
        setExpandedComments(prev => ({...prev, [id]: !prev[id]}));
    };

    const getSeverityStyles = (severity: IssueSeverity) => {
        switch (severity) {
            case 'critical': return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
            case 'warning': return 'text-orange-500 bg-orange-500/10 border-orange-500/20'; // Updated to Orange
            case 'info': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
            default: return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
        }
    };

    const getIcon = (severity: IssueSeverity) => {
        switch (severity) {
            case 'critical': return <Icons.AlertTriangle width={18} height={18} />;
            case 'warning': return <Icons.AlertTriangle width={18} height={18} />;
            case 'info': return <Icons.Info width={18} height={18} />;
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 animate-fade-in">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/80 backdrop-blur-md z-40"
                onClick={onClose}
            ></div>

            <div className="relative z-50 w-full max-w-4xl bg-[#09090b] border border-[#27272a] rounded-xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden ring-1 ring-white/10">
                
                {/* Header */}
                <div className="h-16 border-b border-[#27272a] bg-[#121214] flex items-center justify-between px-6 shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-rose-500/10 rounded-lg text-rose-500 border border-rose-500/20">
                            <Icons.AlertTriangle width={20} height={20} />
                        </div>
                        <div>
                            <h2 className="text-sm font-semibold text-white">Project Issues Log</h2>
                            <p className="text-xs text-gray-500">{project.name} • {project.openIssues} Open Items</p>
                        </div>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-white hover:bg-[#27272a] rounded-lg transition-colors"
                    >
                        <Icons.X width={20} height={20} />
                    </button>
                </div>

                {/* Dashboard Stats & Filters */}
                <div className="p-6 border-b border-[#27272a] bg-[#0c0c0e] flex flex-wrap gap-6 items-center justify-between">
                    <div className="flex gap-4">
                        <div className="flex items-center gap-3 px-4 py-2 bg-rose-500/5 border border-rose-500/20 rounded-lg">
                            <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></div>
                            <div>
                                <div className="text-[10px] uppercase font-bold text-rose-500 tracking-wider">Critical</div>
                                <div className="text-lg font-bold text-white leading-none">{criticalCount}</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 px-4 py-2 bg-orange-500/5 border border-orange-500/20 rounded-lg">
                            <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                            <div>
                                <div className="text-[10px] uppercase font-bold text-orange-500 tracking-wider">Warning</div>
                                <div className="text-lg font-bold text-white leading-none">{warningCount}</div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center bg-[#18181b] rounded-lg p-1 border border-[#27272a]">
                        {(['all', 'critical', 'warning', 'info'] as const).map((t) => (
                            <button
                                key={t}
                                onClick={() => setFilter(t)}
                                className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all ${
                                    filter === t 
                                    ? 'bg-[#27272a] text-white shadow-sm' 
                                    : 'text-gray-500 hover:text-gray-300'
                                }`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Issues List */}
                <div className="flex-1 overflow-y-auto p-6 bg-[#09090b] space-y-3 custom-scrollbar">
                    {displayedIssues.length > 0 ? (
                        displayedIssues.map(issue => (
                            <div 
                                key={issue.id} 
                                className="group flex flex-col p-4 rounded-xl border border-[#27272a] bg-[#121214] hover:border-[#3f3f46] transition-all relative overflow-hidden"
                            >
                                {/* Status Line */}
                                <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                                    issue.severity === 'critical' ? 'bg-rose-500' : issue.severity === 'warning' ? 'bg-orange-500' : 'bg-blue-500'
                                }`}></div>

                                {/* Dismiss (X) - Top Right */}
                                <button 
                                    onClick={() => onDismissIssue(issue.id)}
                                    className="absolute top-3 right-3 p-1.5 text-gray-600 hover:text-rose-400 hover:bg-rose-500/10 rounded-md transition-all z-10"
                                    title="Dismiss Issue"
                                >
                                    <Icons.X width={14} height={14} />
                                </button>

                                <div className="flex items-start gap-4">
                                    <div className={`mt-0.5 shrink-0 w-8 h-8 rounded-lg flex items-center justify-center border ${getSeverityStyles(issue.severity)}`}>
                                        {getIcon(issue.severity)}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between mb-1.5">
                                            <h3 className="text-sm font-medium text-gray-200 group-hover:text-blue-400 transition-colors pr-2">
                                                {issue.title}
                                            </h3>
                                            
                                            {/* Metadata in header, right aligned. Added pr-8 to prevent overlap with absolute close button */}
                                            <div className="flex items-center gap-3 shrink-0 pr-8 mt-0.5"> 
                                                <span className="text-[10px] text-gray-600 font-mono">{issue.date}</span>
                                                {issue.assignedTo && (
                                                    <div title={`Assigned to ${issue.assignedTo}`}>
                                                        <UserAvatar initials={issue.assignedTo} size="xs" />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        
                                        <p className="text-xs text-gray-400 leading-relaxed mb-4">
                                            {issue.description}
                                        </p>
                                        
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                {issue.location && (
                                                    <span className="flex items-center gap-1.5 text-[10px] text-gray-500 bg-[#18181b] px-2 py-1 rounded border border-[#27272a]">
                                                        <Icons.Box width={10} height={10} />
                                                        {issue.location}
                                                    </span>
                                                )}
                                                <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded border ${getSeverityStyles(issue.severity)} bg-opacity-5`}>
                                                    {issue.severity}
                                                </span>
                                            </div>
                                            
                                            <div className="flex gap-2 items-center">
                                                {/* Discussion Toggle Icon */}
                                                <button 
                                                    onClick={() => toggleComments(issue.id)}
                                                    className={`p-1.5 rounded-md transition-colors flex items-center gap-1.5 relative border border-transparent ${
                                                        expandedComments[issue.id] || (issue.comments?.length || 0) > 0
                                                        ? 'text-blue-400 bg-blue-500/10 border-blue-500/20' 
                                                        : 'text-gray-500 hover:text-gray-300 hover:bg-[#18181b] hover:border-[#27272a]'
                                                    }`}
                                                    title="Discussion"
                                                >
                                                    <Icons.MessageSquare width={14} height={14} />
                                                    {(issue.comments?.length || 0) > 0 && (
                                                        <span className="text-[9px] font-bold">{issue.comments?.length}</span>
                                                    )}
                                                </button>

                                                {/* Resolve (Check) - Primary */}
                                                <button 
                                                    onClick={() => onResolveIssue(issue.id)}
                                                    className="p-1.5 text-gray-500 hover:text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500/20 border border-transparent rounded-md transition-all group/resolve"
                                                    title="Mark Resolved"
                                                >
                                                    <Icons.CheckCircle width={14} height={14} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Collapsible Comment Thread */}
                                {expandedComments[issue.id] && (
                                    <div className="mt-4 pt-4 border-t border-[#27272a] pl-12 animate-fade-in">
                                        <div className="bg-[#0c0c0e] rounded-lg border border-[#27272a] p-3">
                                            <h4 className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-2">Team Discussion</h4>
                                            <div className="max-h-48">
                                                <CommentThread 
                                                    comments={issue.comments}
                                                    onAddComment={(text) => onAddComment(issue.id, text)}
                                                    contextId={issue.id}
                                                    compact={true}
                                                    placeholder="Add engineering note..."
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="p-4 bg-[#121214] border border-[#27272a] rounded-full mb-4">
                                <Icons.CheckCircle width={32} height={32} className="text-emerald-500/50" />
                            </div>
                            <h3 className="text-sm font-medium text-gray-300">No {filter !== 'all' ? filter : ''} issues found</h3>
                            <p className="text-xs text-gray-500 mt-1">System status is nominal. No action required.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
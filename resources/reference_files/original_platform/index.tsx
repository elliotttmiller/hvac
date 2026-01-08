import React, { useState, useEffect, useRef, useCallback } from "react";
import { createRoot } from "react-dom/client";
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// --- Icons (Inline SVGs) ---
const Icons = {
  Cpu: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><rect x="9" y="9" width="6" height="6"></rect><path d="M9 1v3"></path><path d="M15 1v3"></path><path d="M9 20v3"></path><path d="M15 20v3"></path><path d="M20 9h3"></path><path d="M20 14h3"></path><path d="M1 9h3"></path><path d="M1 14h3"></path></svg>,
  Layers: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>,
  FileText: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>,
  Activity: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>,
  Bot: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="10" rx="2"></rect><circle cx="12" cy="5" r="2"></circle><path d="M12 7v4"></path><line x1="8" y1="16" x2="8" y2="16"></line><line x1="16" y1="16" x2="16" y2="16"></line></svg>,
  CheckCircle: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>,
  AlertTriangle: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>,
  Search: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>,
  Settings: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>,
  Send: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>,
  Maximize: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>,
  Sparkles: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>,
  Home: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>,
  Grid: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>,
  Box: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>,
  Upload: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>,
  ChevronLeft: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>,
  ChevronRight: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>,
};

// --- Types ---
type Blueprint = {
  id: string;
  name: string;
  status: 'processed' | 'processing' | 'queued';
  compliance: number;
};

type Project = {
  id: string;
  name: string;
  blueprints: number;
  status: 'active' | 'archived';
  lastUpdated: string;
};

type LogEntry = {
  id: number;
  timestamp: string;
  service: 'GEMINI-2.0' | 'SYSTEM' | 'VISION' | 'REASONING';
  message: string;
  level: 'info' | 'warn' | 'success';
};

type ViewState = 'dashboard' | 'workspace' | 'projects';

// --- Mock Data ---
const MOCK_PROJECTS: Project[] = [
  { id: 'proj-01', name: 'ASHRAE HQ Retrofit', blueprints: 12, status: 'active', lastUpdated: '10m ago' },
  { id: 'proj-02', name: 'City Center Mall', blueprints: 45, status: 'active', lastUpdated: '2h ago' },
  { id: 'proj-03', name: 'Northside Hospital', blueprints: 8, status: 'archived', lastUpdated: '4d ago' },
];

const MOCK_BLUEPRINTS: Blueprint[] = [
  { id: 'bp-101', name: 'Level 2 - VAV Layout', status: 'processed', compliance: 92 },
  { id: 'bp-102', name: 'Mechanical Room B', status: 'processing', compliance: 0 },
  { id: 'bp-103', name: 'Ductwork Risers', status: 'queued', compliance: 0 },
];

const INITIAL_LOGS: LogEntry[] = [
  { id: 1, timestamp: '10:00:01', service: 'SYSTEM', message: 'Application initialized', level: 'success' },
  { id: 2, timestamp: '10:00:02', service: 'GEMINI-2.0', message: 'API Connection Established', level: 'info' },
  { id: 3, timestamp: '10:00:02', service: 'SYSTEM', message: 'Standard: ANSI/ISA-5.1-2009', level: 'info' },
];

// --- Sub-Components ---

const StatusBadge = ({ status }: { status: string }) => {
  const colors = {
    processed: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
    processing: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
    queued: 'text-slate-400 bg-slate-400/10 border-slate-400/20',
    active: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
    archived: 'text-gray-400 bg-gray-400/10 border-gray-400/20',
  };
  const c = colors[status as keyof typeof colors] || colors.queued;
  return (
    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${c}`}>
      {status}
    </span>
  );
};

const MarkdownComponents = {
  h1: ({node, ...props}: any) => <h1 className="text-lg font-bold text-white mt-4 mb-2 border-b border-gray-700 pb-1" {...props} />,
  h2: ({node, ...props}: any) => <h2 className="text-base font-semibold text-blue-400 mt-4 mb-2" {...props} />,
  h3: ({node, ...props}: any) => <h3 className="text-sm font-semibold text-white mt-3 mb-1" {...props} />,
  ul: ({node, ...props}: any) => <ul className="list-disc list-inside space-y-1 mb-3 text-gray-300 ml-2" {...props} />,
  ol: ({node, ...props}: any) => <ol className="list-decimal list-inside space-y-1 mb-3 text-gray-300 ml-2" {...props} />,
  li: ({node, ...props}: any) => <li className="pl-1" {...props} />,
  p: ({node, ...props}: any) => <p className="mb-3 leading-relaxed text-gray-300" {...props} />,
  strong: ({node, ...props}: any) => <strong className="font-semibold text-white" {...props} />,
  table: ({node, ...props}: any) => <div className="overflow-x-auto mb-4 rounded border border-gray-700 bg-gray-900/50"><table className="w-full text-left text-xs border-collapse" {...props} /></div>,
  thead: ({node, ...props}: any) => <thead className="bg-gray-800 text-gray-200 uppercase tracking-wider" {...props} />,
  tbody: ({node, ...props}: any) => <tbody className="divide-y divide-gray-700" {...props} />,
  tr: ({node, ...props}: any) => <tr className="hover:bg-gray-800/30 transition-colors" {...props} />,
  th: ({node, ...props}: any) => <th className="px-3 py-2 font-medium border-b border-gray-600" {...props} />,
  td: ({node, ...props}: any) => <td className="px-3 py-2 text-gray-400 border-r border-gray-800 last:border-r-0" {...props} />,
  blockquote: ({node, ...props}: any) => <blockquote className="border-l-2 border-blue-500 pl-4 py-1 my-2 bg-blue-500/5 text-gray-400 italic" {...props} />,
  code: ({node, inline, className, children, ...props}: any) => {
     return inline 
       ? <code className="px-1 py-0.5 rounded bg-gray-800 text-blue-300 font-mono text-xs" {...props}>{children}</code>
       : <pre className="p-3 rounded bg-gray-950 border border-gray-800 overflow-x-auto mb-3"><code className="text-xs font-mono text-gray-300" {...props}>{children}</code></pre>
  }
};

const ToggleButton = ({ isOpen, onClick, side }: { isOpen: boolean, onClick: () => void, side: 'left' | 'right' }) => {
  return (
    <button
      onClick={onClick}
      className={`absolute top-1/2 -translate-y-1/2 z-50 w-5 h-16 flex items-center justify-center
        transition-all duration-300 ease-out opacity-60 hover:opacity-100 hover:w-7
        ${side === 'left' ? '-right-5 rounded-r-lg hover:pr-1' : '-left-5 rounded-l-lg hover:pl-1'}
        bg-black/40 backdrop-blur-md border border-[var(--border-subtle)] ${side === 'left' ? 'border-l-0' : 'border-r-0'}
        text-[var(--text-muted)] hover:text-white hover:shadow-[0_0_15px_rgba(37,99,235,0.3)]
      `}
      aria-label={isOpen ? "Close panel" : "Open panel"}
    >
      <div className={`transition-transform duration-300 ${isOpen ? '' : 'rotate-180'}`}>
         {side === 'left' ? <Icons.ChevronLeft /> : <Icons.ChevronRight />}
      </div>
    </button>
  );
};

// --- Views ---

const DashboardView = ({ onNavigate }: { onNavigate: (view: ViewState) => void }) => {
    return (
        <div className="p-8 space-y-8 animate-fade-in overflow-y-auto h-full">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-light text-white mb-1">Good morning, Engineer.</h2>
                    <p className="text-sm text-[var(--text-muted)]">System status nominal. ISA-5.1 Standards Loaded.</p>
                </div>
                <div className="flex gap-2">
                    <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                        SYSTEM ONLINE
                    </span>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-4 gap-4">
                {[
                    { label: 'Active Projects', value: '3', icon: <Icons.Layers />, color: 'text-blue-400' },
                    { label: 'Blueprints Processed', value: '1,248', icon: <Icons.FileText />, color: 'text-purple-400' },
                    { label: 'Compliance Rate', value: '98.2%', icon: <Icons.CheckCircle />, color: 'text-emerald-400' },
                    { label: 'AI Inference Ops', value: '42.5k', icon: <Icons.Cpu />, color: 'text-orange-400' },
                ].map((stat, i) => (
                    <div key={i} className="bg-[var(--bg-panel)] border border-[var(--border-subtle)] p-4 rounded-lg hover:border-[var(--border-active)] transition-colors shadow-sm">
                        <div className={`mb-3 ${stat.color}`}>{stat.icon}</div>
                        <div className="text-2xl font-medium text-white mb-1">{stat.value}</div>
                        <div className="text-xs text-[var(--text-muted)]">{stat.label}</div>
                    </div>
                ))}
            </div>

            {/* Recent Activity / Graph Placeholder */}
            <div className="grid grid-cols-3 gap-6">
                <div className="col-span-2 bg-[var(--bg-panel)] border border-[var(--border-subtle)] rounded-lg p-5 shadow-sm">
                    <h3 className="text-sm font-medium text-white mb-4 flex items-center gap-2">
                        <Icons.Activity /> Inference Load (24h)
                    </h3>
                    <div className="h-48 flex items-end gap-2 px-2 border-b border-[var(--border-subtle)] pb-2">
                        {[40, 65, 45, 80, 55, 70, 45, 60, 90, 75, 50, 65, 85, 95, 60, 50, 40, 55, 70, 60].map((h, i) => (
                            <div key={i} className="flex-1 bg-blue-500/20 hover:bg-blue-500/40 transition-colors rounded-t" style={{ height: `${h}%` }}></div>
                        ))}
                    </div>
                </div>

                <div className="col-span-1 bg-[var(--bg-panel)] border border-[var(--border-subtle)] rounded-lg p-5 shadow-sm">
                    <h3 className="text-sm font-medium text-white mb-4">Quick Actions</h3>
                    <div className="space-y-2">
                        <button onClick={() => onNavigate('projects')} className="w-full text-left px-4 py-3 rounded bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)] text-sm transition-colors border border-transparent hover:border-[var(--border-active)] flex items-center justify-between group">
                            <span>View All Projects</span>
                            <Icons.Home />
                        </button>
                        <button onClick={() => onNavigate('workspace')} className="w-full text-left px-4 py-3 rounded bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)] text-sm transition-colors border border-transparent hover:border-[var(--border-active)] flex items-center justify-between group">
                            <span>Resume Workspace</span>
                            <Icons.Maximize />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ProjectsView = ({ onSelectProject }: { onSelectProject: (id: string) => void }) => {
    return (
        <div className="p-8 space-y-6 animate-fade-in overflow-y-auto h-full">
             <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-medium text-white">Projects Directory</h2>
                    <p className="text-sm text-[var(--text-muted)]">Manage your HVAC analysis buckets</p>
                </div>
                <button className="px-4 py-2 bg-[var(--accent-core)] text-white text-sm rounded hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/20">
                    + New Project
                </button>
            </div>

            <div className="w-full text-left border-collapse">
                <div className="grid grid-cols-12 gap-4 pb-3 border-b border-[var(--border-subtle)] text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider px-4">
                    <div className="col-span-5">Project Name</div>
                    <div className="col-span-2">Status</div>
                    <div className="col-span-2">Blueprints</div>
                    <div className="col-span-3 text-right">Last Updated</div>
                </div>
                <div className="space-y-1 mt-2">
                    {MOCK_PROJECTS.map(proj => (
                        <div 
                            key={proj.id}
                            onClick={() => onSelectProject(proj.id)}
                            className="grid grid-cols-12 gap-4 py-4 px-4 items-center bg-[var(--bg-panel)] border border-transparent hover:border-[var(--border-active)] rounded transition-all cursor-pointer group"
                        >
                            <div className="col-span-5 flex items-center gap-3">
                                <div className="p-2 rounded bg-gray-800 text-gray-400 group-hover:text-white transition-colors">
                                    <Icons.Box />
                                </div>
                                <span className="text-sm font-medium text-[var(--text-primary)]">{proj.name}</span>
                            </div>
                            <div className="col-span-2">
                                <StatusBadge status={proj.status} />
                            </div>
                            <div className="col-span-2 text-sm text-[var(--text-secondary)]">
                                {proj.blueprints} files
                            </div>
                            <div className="col-span-3 text-right text-xs font-mono text-[var(--text-muted)]">
                                {proj.lastUpdated}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const WorkspaceView = ({ 
    blueprint, 
    isProcessing, 
    onRunAnalysis,
    uploadedImage,
    onUpload
}: { 
    blueprint: Blueprint, 
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
                <div className="flex items-center gap-4">
                    <h1 className="text-sm font-medium text-white">{blueprint.name}</h1>
                    <span className="h-4 w-px bg-[var(--border-active)]"></span>
                    <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
                        <Icons.Cpu />
                        <span>Gemini API: <span className="text-emerald-500">Connected</span></span>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-2 px-4 py-1.5 rounded text-xs font-medium bg-[var(--bg-surface)] text-[var(--text-primary)] border border-[var(--border-subtle)] hover:border-[var(--text-muted)] transition-all"
                    >
                        <Icons.Upload />
                        <span>Upload P&ID</span>
                    </button>
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
                        className={`flex items-center gap-2 px-4 py-1.5 rounded text-xs font-medium transition-all ${
                            isProcessing || !uploadedImage
                            ? 'bg-gray-800 text-gray-500 cursor-not-allowed' 
                            : 'bg-white text-black hover:bg-gray-200 shadow-md'
                        }`}
                    >
                        {isProcessing ? <><Icons.Activity /> Processing...</> : <><Icons.Activity /> Run Analysis</>}
                    </button>
                </div>
            </div>

            {/* Canvas Area */}
            <div className="flex-1 relative overflow-hidden bg-[#131315]">
                <BlueprintCanvas isProcessing={isProcessing} uploadedImage={uploadedImage} />
                
                 {/* Floating Toolbar */}
                <div className="absolute top-4 right-4 flex flex-col gap-2 bg-[#09090b] border border-[var(--border-subtle)] rounded-lg p-1 shadow-2xl z-20">
                    <button className="p-2 hover:bg-[var(--bg-hover)] rounded text-gray-400 hover:text-white transition-colors" title="Zoom In"><Icons.Maximize /></button>
                    <button className="p-2 hover:bg-[var(--bg-hover)] rounded text-gray-400 hover:text-white transition-colors" title="Layers"><Icons.Layers /></button>
                    <button className="p-2 hover:bg-[var(--bg-hover)] rounded text-gray-400 hover:text-white transition-colors" title="Inspect"><Icons.Search /></button>
                </div>
            </div>
        </div>
    );
};

const BlueprintCanvas = ({ isProcessing, uploadedImage }: { isProcessing: boolean, uploadedImage: string | null }) => {
  return (
    <div className="relative w-full h-full flex items-center justify-center p-8 group overflow-auto">
      {/* Grid Background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
      </div>
      
      {/* Blueprint Visual */}
      <div className={`relative w-auto h-auto max-w-full max-h-full bg-[#0a0a0a] border border-[#333] shadow-2xl transition-all duration-700 ${isProcessing ? 'scale-[0.99] opacity-90' : 'scale-100 opacity-100'}`}>
        
        {uploadedImage ? (
             <img src={uploadedImage} alt="Uploaded Blueprint" className="max-w-full max-h-[80vh] object-contain block" />
        ) : (
            // Default Mock Content
            <svg className="w-[800px] h-[600px] p-4 bg-[#0a0a0a]" viewBox="0 0 800 600">
                <defs>
                    <pattern id="hatch" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                        <rect width="2" height="4" transform="translate(0,0)" fill="#333"></rect>
                    </pattern>
                </defs>
                <rect x="50" y="50" width="700" height="500" fill="none" stroke="#555" strokeWidth="4" />
                <line x1="200" y1="50" x2="200" y2="550" stroke="#555" strokeWidth="2" />
                <line x1="400" y1="50" x2="400" y2="550" stroke="#555" strokeWidth="2" />
                <line x1="600" y1="50" x2="600" y2="550" stroke="#555" strokeWidth="2" />
                <line x1="50" y1="300" x2="750" y2="300" stroke="#555" strokeWidth="2" />
                <text x="300" y="280" fill="#444" fontFamily="monospace" fontSize="24">UPLOAD A P&ID TO ANALYZE</text>
            </svg>
        )}
            
        {/* Scanning Line Effect */}
        {isProcessing && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="w-full h-1 bg-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.8)] absolute top-0 animate-[scan_3s_ease-in-out_infinite]" style={{ animationName: 'scan' }}></div>
            </div>
        )}
        <style>{`
            @keyframes scan {
                0% { top: 0%; opacity: 0; }
                10% { opacity: 1; }
                90% { opacity: 1; }
                100% { top: 100%; opacity: 0; }
            }
        `}</style>

        {/* Overlay Info */}
        <div className="absolute bottom-4 left-4 flex gap-2">
            <div className="bg-black/80 backdrop-blur px-3 py-1 rounded border border-gray-800 text-xs font-mono text-gray-400">
                SCALE: 1/8" = 1'0"
            </div>
            <div className="bg-black/80 backdrop-blur px-3 py-1 rounded border border-gray-800 text-xs font-mono text-gray-400 flex items-center gap-2">
                <Icons.Sparkles /> 
                POWERED BY GEMINI
            </div>
        </div>
      </div>
    </div>
  );
};

const PipelineLog = ({ logs }: { logs: LogEntry[] }) => {
  const bottomRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <div className="flex flex-col h-full bg-[#0c0c0e] font-mono text-xs overflow-hidden">
      <div className="flex items-center justify-between px-3 py-2 border-b border-[var(--border-subtle)] bg-[var(--bg-panel)] shrink-0">
        <span className="text-[var(--text-secondary)] font-medium flex items-center gap-2">
          <Icons.Sparkles /> LIVE INFERENCE
        </span>
        <div className="flex gap-2">
           <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse-slow"></div>
           <span className="text-[10px] text-blue-500">GEMINI ACTIVE</span>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-1.5 scroll-smooth">
        {logs.map((log) => (
          <div key={log.id} className="flex gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <span className="text-[var(--text-muted)] min-w-[60px]">{log.timestamp}</span>
            <span className={`font-bold min-w-[80px] ${
              log.service === 'GEMINI-2.0' ? 'text-blue-400' :
              log.service === 'VISION' ? 'text-purple-400' :
              log.service === 'REASONING' ? 'text-orange-400' : 'text-gray-400'
            }`}>{log.service}</span>
            <span className={
              log.level === 'success' ? 'text-emerald-400' :
              log.level === 'warn' ? 'text-amber-400' : 'text-[var(--text-primary)]'
            }>{log.message}</span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
};

const ChatPanel = ({ 
    onNewLog, 
    messages, 
    onSendMessage 
}: { 
    onNewLog: (l: LogEntry) => void, 
    messages: {role: 'user' | 'model', text: string}[],
    onSendMessage: (text: string) => void
}) => {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  
  const handleSend = async () => {
      if(!input.trim()) return;
      const t = input;
      setInput("");
      setLoading(true);
      await onSendMessage(t);
      setLoading(false);
  }

  return (
    <div className="flex flex-col h-full bg-[#121214]">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] rounded-lg p-3 text-sm overflow-hidden ${
                        m.role === 'user' 
                        ? 'bg-[#2563eb] text-white' 
                        : 'bg-[#27272a] text-gray-200 border border-[#3f3f46]'
                    }`}>
                        <ReactMarkdown 
                            remarkPlugins={[remarkGfm]}
                            components={MarkdownComponents}
                        >
                            {m.text}
                        </ReactMarkdown>
                    </div>
                </div>
            ))}
            {loading && <div className="text-xs text-gray-500 animate-pulse ml-2">Thinking...</div>}
        </div>
        <div className="p-3 border-t border-[var(--border-subtle)] bg-[#09090b] flex gap-2 shrink-0">
            <input 
                type="text" 
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="Ask about ISA-5.1 standards..."
                className="flex-1 bg-[#18181b] border border-[#3f3f46] rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-[#2563eb] placeholder-gray-600"
            />
            <button onClick={handleSend} className="p-2 bg-[#2563eb] rounded hover:bg-blue-600 transition-colors text-white">
                <Icons.Send />
            </button>
        </div>
    </div>
  );
};

export default function App() {
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [selectedBlueprint, setSelectedBlueprint] = useState(MOCK_BLUEPRINTS[0]);
  const [logs, setLogs] = useState<LogEntry[]>(INITIAL_LOGS);
  const [isProcessing, setIsProcessing] = useState(false);
  const [rightPanelTab, setRightPanelTab] = useState<'pipeline' | 'chat'>('pipeline');
  
  // -- RESIZABLE PANEL STATES --
  const [leftWidth, setLeftWidth] = useState(256);
  const [rightWidth, setRightWidth] = useState(320);
  const [isLeftOpen, setIsLeftOpen] = useState(true);
  const [isRightOpen, setIsRightOpen] = useState(true);
  const [isResizingLeft, setIsResizingLeft] = useState(false);
  const [isResizingRight, setIsResizingRight] = useState(false);
  
  // New State for Real Analysis
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<{role: 'user' | 'model', text: string}[]>([
      {role: 'model', text: 'Gemini 2.0 Flash Engineer online. ISA-5.1 Standards Loaded. Upload a P&ID 2D drawing to begin top-to-bottom instrumentation analysis.'}
  ]);
  const chatRef = useRef<Chat | null>(null);

  // Initialize Chat
  useEffect(() => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    chatRef.current = ai.chats.create({
      model: 'gemini-2.0-flash-exp',
      config: {
        systemInstruction: "You are an expert Control Systems Engineer specializing in ANSI/ISA-5.1 Instrumentation Symbols and Identification. When analyzing technical drawings, you must strictly interpret symbols according to this standard. \n\nYour capabilities include:\n1. Decoding Tag Numbers (First Letter = Measured Variable, Succeeding Letters = Readout/Output Function).\n2. Identifying Line Symbology (Pneumatic vs. Electrical vs. Hydraulic).\n3. Recognizing Valve Bodies and Actuators (Diaphragm, Motor, Solenoid).\n4. Analyzing Complex Control Loops and Signal Processing blocks.\n\nAlways provide precise, technical, and standard-compliant answers using Markdown formatting (Tables, Lists, Bold Text).",
      }
    });
  }, []);

  // -- RESIZE HANDLERS --
  const startResizingLeft = useCallback(() => setIsResizingLeft(true), []);
  const startResizingRight = useCallback(() => setIsResizingRight(true), []);
  const stopResizing = useCallback(() => {
    setIsResizingLeft(false);
    setIsResizingRight(false);
  }, []);

  useEffect(() => {
    const handleResize = (e: MouseEvent) => {
      if (isResizingLeft) {
        const newWidth = Math.max(200, Math.min(600, e.clientX));
        setLeftWidth(newWidth);
      }
      if (isResizingRight) {
        const newWidth = Math.max(240, Math.min(600, window.innerWidth - e.clientX));
        setRightWidth(newWidth);
      }
    };

    if (isResizingLeft || isResizingRight) {
      window.addEventListener("mousemove", handleResize);
      window.addEventListener("mouseup", stopResizing);
    }
    return () => {
      window.removeEventListener("mousemove", handleResize);
      window.removeEventListener("mouseup", stopResizing);
    };
  }, [isResizingLeft, isResizingRight, stopResizing]);


  const addLog = (entry: Omit<LogEntry, 'id' | 'timestamp'>) => {
    const newLog = {
      ...entry,
      id: Date.now(),
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false })
    };
    setLogs(prev => [...prev, newLog]);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          addLog({ service: 'SYSTEM', message: `Loading image: ${file.name}`, level: 'info' });
          const reader = new FileReader();
          reader.onloadend = () => {
              setUploadedImage(reader.result as string);
              addLog({ service: 'SYSTEM', message: 'Image loaded into workspace.', level: 'success' });
          };
          reader.readAsDataURL(file);
      }
  };

  const handleRunAnalysis = async () => {
    if (!uploadedImage) return;

    setIsProcessing(true);
    addLog({ service: 'SYSTEM', message: 'Initiating Gemini 2.0 ISA-5.1 Analysis...', level: 'info' });
    
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        // Extract base64 data
        const [header, base64Data] = uploadedImage.split(',');
        const mimeType = header.match(/:(.*?);/)?.[1] || 'image/png';

        addLog({ service: 'GEMINI-2.0', message: 'Sending high-res P&ID to API...', level: 'info' });
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.0-flash-exp',
            contents: {
                parts: [
                    { inlineData: { mimeType, data: base64Data } },
                    { text: "Analyze this P&ID/technical drawing acting as a Senior Instrumentation Engineer. Your analysis must strictly adhere to the ANSI/ISA-5.1-2009 \"Instrumentation Symbols and Identification\" standard.\n\n1. **Tag Analysis & Decoding**:\n   - Present the extracted tags in a **Markdown Table** with columns: `Tag` | `Variable` | `Function` | `Loop` | `Description`.\n   - DECODE the tag based on ISA-5.1 Table 1.\n\n2. **Line & Signal Identification**:\n   - List specific signal types found (Pneumatic, Electrical, Hydraulic, etc.).\n\n3. **Final Control Elements**:\n   - Identify Valve Body types (Gate, Globe, Check, etc.).\n   - Identify Actuator types (Diaphragm, Solenoid, etc.).\n\n4. **System Architecture**:\n   - Trace the control loops.\n\n5. **Compliance Report**:\n   - Highlight deviations.\n\nProvide the output in a clean, professional **Markdown** format." }
                ]
            }
        });

        const resultText = response.text;
        addLog({ service: 'GEMINI-2.0', message: 'Analysis Complete.', level: 'success' });
        addLog({ service: 'REASONING', message: 'Generated ISA-5.1 report.', level: 'info' });

        setChatMessages(prev => [...prev, {
            role: 'model',
            text: `**ISA-5.1 Technical Analysis Report**\n\n${resultText}`
        }]);

        setRightPanelTab('chat');

    } catch (e: any) {
        addLog({ service: 'SYSTEM', message: `Error: ${e.message}`, level: 'warn' });
        console.error(e);
    } finally {
        setIsProcessing(false);
    }
  };

  const handleChatMessage = async (userMsg: string) => {
     if (!chatRef.current) return;
     setChatMessages(prev => [...prev, {role: 'user', text: userMsg}]);
     
     try {
        const result = await chatRef.current.sendMessage({ message: userMsg });
        setChatMessages(prev => [...prev, {role: 'model', text: result.text}]);
     } catch (e) {
        console.error(e);
        setChatMessages(prev => [...prev, {role: 'model', text: "Error connecting to Gemini."}]);
     }
  };

  const handleProjectSelect = (id: string) => {
      addLog({ service: 'SYSTEM', message: `Project ${id} loaded into workspace.`, level: 'info' });
      setCurrentView('workspace');
  };

  return (
    <div className="flex h-screen w-screen bg-[var(--bg-app)] text-[var(--text-primary)] overflow-hidden relative selection:bg-blue-500/30">
      
      {/* LEFT SIDEBAR (GLOBAL NAV) */}
      <div 
        className="relative flex flex-col shrink-0 z-20 group"
        style={{ width: isLeftOpen ? leftWidth : 0, transition: isResizingLeft ? 'none' : 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }}
      >
        {/* Toggle Button - Anchored to Right Edge */}
        <ToggleButton isOpen={isLeftOpen} onClick={() => setIsLeftOpen(!isLeftOpen)} side="left" />

        {/* CLIPPING CONTAINER */}
        <div className="absolute inset-0 overflow-hidden border-r border-[var(--border-subtle)] bg-[var(--bg-panel)] flex flex-col">
            {/* CONTENT CONTAINER - Fixed width to prevent squashing */}
            <div className="h-full w-full flex flex-col" style={{ width: leftWidth }}>
                <div className="h-14 flex items-center px-4 border-b border-[var(--border-subtle)] shrink-0">
                    <div className="h-6 w-6 bg-gradient-to-br from-blue-600 to-indigo-600 rounded mr-3 flex items-center justify-center">
                        <Icons.Sparkles />
                    </div>
                    <span className="font-bold tracking-tight">HVAC AI <span className="text-[10px] font-normal text-gray-500 ml-1">v3.0</span></span>
                </div>

                <div className="p-4 space-y-6 flex-1 overflow-y-auto">
                    <div>
                        <h3 className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-3">Navigation</h3>
                        <div className="space-y-1">
                            <button 
                                onClick={() => setCurrentView('dashboard')}
                                className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded transition-colors ${
                                    currentView === 'dashboard' ? 'bg-[#2563eb] text-white shadow-lg shadow-blue-500/10' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]'
                                }`}
                            >
                                <Icons.Home /> 
                                <span>Dashboard</span>
                            </button>
                            <button 
                                onClick={() => setCurrentView('projects')}
                                className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded transition-colors ${
                                    currentView === 'projects' ? 'bg-[#2563eb] text-white shadow-lg shadow-blue-500/10' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]'
                                }`}
                            >
                                <Icons.Grid /> 
                                <span>Projects</span>
                            </button>
                            <button 
                                onClick={() => setCurrentView('workspace')}
                                className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded transition-colors ${
                                    currentView === 'workspace' ? 'bg-[#2563eb] text-white shadow-lg shadow-blue-500/10' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]'
                                }`}
                            >
                                <Icons.Maximize /> 
                                <span>Workspace</span>
                            </button>
                        </div>
                    </div>

                    {/* Contextual Sidebar Content based on View */}
                    {currentView === 'workspace' && (
                        <div className="animate-fade-in">
                            <h3 className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-3">Active Blueprints</h3>
                            <div className="space-y-1">
                                {MOCK_BLUEPRINTS.map(bp => (
                                    <button 
                                        key={bp.id}
                                        onClick={() => setSelectedBlueprint(bp)}
                                        className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded transition-colors group ${
                                            selectedBlueprint.id === bp.id ? 'bg-[#2563eb]/10 text-blue-400 border border-blue-500/20' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <Icons.FileText />
                                            <span className="truncate">{bp.name}</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Global Settings/Info */}
                <div className="p-4 border-t border-[var(--border-subtle)] mt-auto bg-[var(--bg-panel)] shrink-0">
                    <h3 className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-3">Model Config</h3>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                        <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                        Gemini 2.0 Flash
                    </div>
                </div>
            </div>
        </div>

        {/* Resize Handle - Invisible but draggable area */}
        {isLeftOpen && (
            <div 
                className="absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-blue-500/50 transition-colors z-30"
                onMouseDown={startResizingLeft}
            />
        )}
      </div>

      {/* MIDDLE PANEL (DYNAMIC CONTENT) */}
      <div className="flex-1 flex flex-col min-w-0 bg-[var(--bg-app)] overflow-hidden relative">
          {currentView === 'dashboard' && <DashboardView onNavigate={setCurrentView} />}
          {currentView === 'projects' && <ProjectsView onSelectProject={handleProjectSelect} />}
          {currentView === 'workspace' && (
              <WorkspaceView 
                blueprint={selectedBlueprint} 
                isProcessing={isProcessing} 
                onRunAnalysis={handleRunAnalysis}
                uploadedImage={uploadedImage}
                onUpload={handleFileUpload}
              />
          )}
      </div>

      {/* RIGHT PANEL (GLOBAL CONSOLE) */}
      <div 
        className="relative flex flex-col shrink-0 z-20 group shadow-[-4px_0_24px_rgba(0,0,0,0.2)]"
        style={{ width: isRightOpen ? rightWidth : 0, transition: isResizingRight ? 'none' : 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }}
      >
         {/* Toggle Button - Anchored to Left Edge */}
         <ToggleButton isOpen={isRightOpen} onClick={() => setIsRightOpen(!isRightOpen)} side="right" />

         {/* CLIPPING CONTAINER */}
         <div className="absolute inset-0 overflow-hidden border-l border-[var(--border-subtle)] bg-[var(--bg-panel)] flex flex-col">
             {/* CONTENT CONTAINER - Fixed width */}
             <div className="h-full w-full flex flex-col" style={{ width: rightWidth }}>
                 <div className="flex border-b border-[var(--border-subtle)] shrink-0">
                     <button 
                        onClick={() => setRightPanelTab('pipeline')}
                        className={`flex-1 py-3 text-xs font-medium text-center border-b-2 transition-colors ${
                            rightPanelTab === 'pipeline' ? 'border-[#2563eb] text-white' : 'border-transparent text-gray-500 hover:text-gray-300'
                        }`}
                     >
                        Pipeline Stream
                     </button>
                     <button 
                        onClick={() => setRightPanelTab('chat')}
                        className={`flex-1 py-3 text-xs font-medium text-center border-b-2 transition-colors ${
                            rightPanelTab === 'chat' ? 'border-[#2563eb] text-white' : 'border-transparent text-gray-500 hover:text-gray-300'
                        }`}
                     >
                        Eng. Copilot
                     </button>
                 </div>

                 <div className="flex-1 overflow-hidden flex flex-col">
                     {rightPanelTab === 'pipeline' ? (
                         <PipelineLog logs={logs} />
                     ) : (
                         <ChatPanel 
                            onNewLog={addLog} 
                            messages={chatMessages}
                            onSendMessage={handleChatMessage}
                         />
                     )}
                 </div>

                 {/* Summary Widget (Persistent) */}
                 <div className="p-4 border-t border-[var(--border-subtle)] bg-[#0c0c0e] shrink-0">
                     <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-3">Compliance Status</h4>
                     <div className="flex items-center justify-between mb-2">
                         <span className="text-xs text-gray-300">ASHRAE 62.1</span>
                         <span className="text-xs font-mono text-emerald-400">PASS</span>
                     </div>
                     <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                         <div className="h-full bg-emerald-500 w-[92%]"></div>
                     </div>
                     <div className="mt-2 text-[10px] text-gray-500 text-right">92% Confidence</div>
                 </div>
             </div>
         </div>

         {/* Resize Handle */}
         {isRightOpen && (
             <div 
                 className="absolute top-0 left-0 w-1 h-full cursor-col-resize hover:bg-blue-500/50 transition-colors z-30"
                 onMouseDown={startResizingRight}
             />
         )}
      </div>

    </div>
  );
}

const root = createRoot(document.getElementById("root")!);
root.render(<App />);
import React, { useState, useEffect, useRef, useCallback } from "react";
import { createRoot } from "react-dom/client";
import { GoogleGenAI, Chat, GenerateContentResponse, Type } from "@google/genai";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// --- Icons (Inline SVGs) ---
const Icons = {
  Wind: (props: React.SVGProps<SVGSVGElement>) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"/></svg>,
  Cpu: (props: React.SVGProps<SVGSVGElement>) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><rect x="9" y="9" width="6" height="6"></rect><path d="M9 1v3"></path><path d="M15 1v3"></path><path d="M9 20v3"></path><path d="M15 20v3"></path><path d="M20 9h3"></path><path d="M20 14h3"></path><path d="M1 9h3"></path><path d="M1 14h3"></path></svg>,
  Layers: (props: React.SVGProps<SVGSVGElement>) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>,
  FileText: (props: React.SVGProps<SVGSVGElement>) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>,
  Activity: (props: React.SVGProps<SVGSVGElement>) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>,
  Bot: (props: React.SVGProps<SVGSVGElement>) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="3" y="11" width="18" height="10" rx="2"></rect><circle cx="12" cy="5" r="2"></circle><path d="M12 7v4"></path><line x1="8" y1="16" x2="8" y2="16"></line><line x1="16" y1="16" x2="16" y2="16"></line></svg>,
  CheckCircle: (props: React.SVGProps<SVGSVGElement>) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>,
  AlertTriangle: (props: React.SVGProps<SVGSVGElement>) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>,
  Search: (props: React.SVGProps<SVGSVGElement>) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>,
  Settings: (props: React.SVGProps<SVGSVGElement>) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>,
  Send: (props: React.SVGProps<SVGSVGElement>) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>,
  Maximize: (props: React.SVGProps<SVGSVGElement>) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>,
  Sparkles: (props: React.SVGProps<SVGSVGElement>) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L12 3Z"/></svg>,
  Home: (props: React.SVGProps<SVGSVGElement>) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>,
  Grid: (props: React.SVGProps<SVGSVGElement>) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>,
  Box: (props: React.SVGProps<SVGSVGElement>) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>,
  Upload: (props: React.SVGProps<SVGSVGElement>) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>,
  ChevronLeft: (props: React.SVGProps<SVGSVGElement>) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M15 18l-6-6 6-6"/></svg>,
  ChevronRight: (props: React.SVGProps<SVGSVGElement>) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M9 18l6-6-6-6"/></svg>,
  Users: (props: React.SVGProps<SVGSVGElement>) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>,
  X: (props: React.SVGProps<SVGSVGElement>) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>,
  BarChart: (props: React.SVGProps<SVGSVGElement>) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>,
  ExternalLink: (props: React.SVGProps<SVGSVGElement>) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>,
  Info: (props: React.SVGProps<SVGSVGElement>) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>,
  Bell: (props: React.SVGProps<SVGSVGElement>) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>,
  Zap: (props: React.SVGProps<SVGSVGElement>) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>,
  Tag: (props: React.SVGProps<SVGSVGElement>) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>,
  Clipboard: (props: React.SVGProps<SVGSVGElement>) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>,
  List: (props: React.SVGProps<SVGSVGElement>) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>,
  DollarSign: (props: React.SVGProps<SVGSVGElement>) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>,
  Plus: (props: React.SVGProps<SVGSVGElement>) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>,
  Trash: (props: React.SVGProps<SVGSVGElement>) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>,
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

type ViewState = 'dashboard' | 'workspace' | 'projects';
type RightPanelTab = 'components' | 'analysis' | 'pricing' | 'quote';

type DetectedComponent = {
  id: string;
  name: string;
  type: string;
  confidence: number;
  status: 'verified' | 'review';
  cost: number;
  sku: string;
};

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

// --- Sub-Components ---

const StatusBadge = ({ status }: { status: string }) => {
  const colors = {
    processed: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
    processing: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
    queued: 'text-slate-400 bg-slate-400/10 border-slate-400/20',
    active: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
    archived: 'text-gray-400 bg-gray-400/10 border-gray-400/20',
    verified: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
    review: 'text-amber-400 bg-amber-400/10 border-amber-400/20'
  };
  const c = colors[status as keyof typeof colors] || colors.queued;
  return (
    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${c}`}>
      {status}
    </span>
  );
};

const MarkdownComponents = {
  // H1: Modern, gradient-ish text or clean white with heavy tracking
  h1: ({node, ...props}: any) => (
      <div className="mt-8 mb-6 border-b border-gray-800/50 pb-4">
          <h1 className="text-2xl font-light tracking-tight text-white flex items-center gap-3" {...props} />
          <div className="h-0.5 w-16 bg-blue-600 mt-4 rounded-full"></div>
      </div>
  ),
  // H2: Section headers, cleaner, maybe with a small icon or accent
  h2: ({node, ...props}: any) => (
      <h2 className="text-lg font-medium text-blue-400 mt-8 mb-4 flex items-center gap-2" {...props}>
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]"></span>
          {props.children}
      </h2>
  ),
  // H3: Subsection, gray/white
  h3: ({node, ...props}: any) => <h3 className="text-sm font-bold text-gray-100 mt-6 mb-3 uppercase tracking-wider pl-4 border-l-2 border-gray-700" {...props} />,
  
  // Paragraphs: readable, good leading
  p: ({node, ...props}: any) => <p className="mb-4 leading-7 text-gray-300 text-sm font-normal" {...props} />,
  
  // Lists
  ul: ({node, ...props}: any) => <ul className="space-y-3 mb-6" {...props} />,
  ol: ({node, ...props}: any) => <ol className="list-decimal list-inside space-y-3 mb-6 text-gray-400" {...props} />,
  li: ({node, ...props}: any) => (
      <li className="flex gap-3 text-sm text-gray-300 leading-6 pl-1" {...props}>
          <span className="text-blue-500/50 mt-1.5 text-[10px]">●</span>
          <span className="flex-1">{props.children}</span>
      </li>
  ),
  
  // Strong: Highlighting key terms
  strong: ({node, ...props}: any) => <strong className="font-semibold text-white bg-blue-500/10 px-1.5 py-0.5 rounded text-xs border border-blue-500/20" {...props} />,
  
  // Blockquotes: Tips/Notes
  blockquote: ({node, ...props}: any) => (
      <div className="flex gap-3 p-4 my-6 bg-blue-900/10 border border-blue-500/20 rounded-lg shadow-sm">
          <div className="text-blue-400 shrink-0 mt-0.5"><Icons.Info /></div>
          <div className="text-sm text-gray-300 italic leading-relaxed">{props.children}</div>
      </div>
  ),

  // Code
  code: ({node, inline, className, children, ...props}: any) => {
     return inline 
       ? <code className="px-1.5 py-0.5 rounded bg-[#1e1e20] text-blue-300 font-mono text-[11px] border border-gray-800" {...props}>{children}</code>
       : <div className="rounded-lg overflow-hidden border border-gray-800 my-6 bg-[#0c0c0e] shadow-lg"><div className="px-4 py-2 bg-[#18181b] border-b border-gray-800 text-[10px] text-gray-500 font-mono uppercase tracking-wider">System Output</div><pre className="p-4 overflow-x-auto"><code className="text-xs font-mono text-gray-300" {...props}>{children}</code></pre></div>
  },
  
  // Table
  table: ({node, ...props}: any) => <div className="overflow-hidden mb-8 rounded-lg border border-gray-800 bg-[#0c0c0e] shadow-md"><table className="w-full text-left text-xs" {...props} /></div>,
  thead: ({node, ...props}: any) => <thead className="bg-[#18181b] text-gray-400 uppercase tracking-wider font-semibold border-b border-gray-800" {...props} />,
  tr: ({node, ...props}: any) => <tr className="border-b border-gray-800/50 last:border-0 hover:bg-gray-800/30 transition-colors" {...props} />,
  th: ({node, ...props}: any) => <th className="px-4 py-3 font-medium text-[11px]" {...props} />,
  td: ({node, ...props}: any) => <td className="px-4 py-3 text-gray-400" {...props} />,
};

const ToggleButton = ({ isOpen, onClick, side }: { isOpen: boolean, onClick: () => void, side: 'left' | 'right' }) => {
  return (
    <button
      onClick={onClick}
      className={`absolute top-1/2 -translate-y-1/2 z-50 w-4 h-12 flex items-center justify-center
        transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]
        ${side === 'left' ? '-right-4 rounded-r-md hover:w-6 hover:pr-1' : '-left-4 rounded-l-md hover:w-6 hover:pl-1'}
        bg-[#09090b]/80 backdrop-blur-md border border-white/10
        ${side === 'left' ? 'border-l-0' : 'border-r-0'}
        text-gray-500 hover:text-white hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:border-blue-500/30
        group cursor-pointer
      `}
      aria-label={isOpen ? "Close panel" : "Open panel"}
    >
      <div className={`transition-transform duration-500 ${isOpen ? '' : 'rotate-180'} opacity-70 group-hover:opacity-100 scale-75 group-hover:scale-100`}>
         {side === 'left' ? <Icons.ChevronLeft /> : <Icons.ChevronRight />}
      </div>
    </button>
  );
};

// --- Modal Component ---
const ProjectModal = ({ 
    project, 
    onClose, 
    onOpenWorkspace 
}: { 
    project: Project, 
    onClose: () => void, 
    onOpenWorkspace: () => void 
}) => {
    const [activeTab, setActiveTab] = useState<'overview' | 'blueprints' | 'team' | 'settings'>('overview');

    const handleContentClick = (e: React.MouseEvent) => {
        e.stopPropagation();
    };

    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-8 animate-fade-in">
             <div 
               className="absolute inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity"
               onClick={onClose}
             ></div>
             
             <div 
                className="relative z-50 w-full max-w-4xl h-[80%] bg-[#121214] border border-[#27272a] rounded-xl shadow-2xl flex flex-col overflow-hidden"
                onClick={handleContentClick}
             >
                <div className="h-16 border-b border-[#27272a] bg-[#18181b] flex items-center justify-between px-6 shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                            <Icons.Box />
                        </div>
                        <div>
                            <h2 className="text-lg font-medium text-white leading-tight">{project.name}</h2>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                <span>ID: {project.id}</span>
                                <span className="w-1 h-1 rounded-full bg-gray-600"></span>
                                <span className="uppercase">{project.status}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                         <button 
                            onClick={onOpenWorkspace}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium rounded transition-colors"
                         >
                            <Icons.ExternalLink />
                            Launch Workspace
                         </button>
                         <button 
                            onClick={onClose}
                            className="p-2 text-gray-400 hover:text-white hover:bg-[#27272a] rounded transition-colors"
                         >
                            <Icons.X />
                         </button>
                    </div>
                </div>

                <div className="flex px-6 border-b border-[#27272a] bg-[#121214] shrink-0">
                    {['Overview', 'Blueprints', 'Team', 'Settings'].map((tab) => (
                         <button 
                            key={tab}
                            onClick={() => setActiveTab(tab.toLowerCase() as any)}
                            className={`px-4 py-3 text-xs font-medium border-b-2 transition-colors ${
                                activeTab === tab.toLowerCase() 
                                ? 'border-blue-500 text-blue-400' 
                                : 'border-transparent text-gray-500 hover:text-gray-300'
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                <div className="flex-1 overflow-y-auto p-6 bg-[#09090b]">
                    {activeTab === 'overview' && (
                        <div className="space-y-6 animate-fade-in">
                            <div className="grid grid-cols-3 gap-4">
                                <div className="p-4 rounded border border-[#27272a] bg-[#121214]">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs text-gray-500">Compliance Score</span>
                                        <div className="text-emerald-500"><Icons.CheckCircle /></div>
                                    </div>
                                    <div className="text-2xl font-bold text-white">87%</div>
                                    <div className="text-[10px] text-gray-500 mt-1">+2.4% vs last week</div>
                                </div>
                                <div className="p-4 rounded border border-[#27272a] bg-[#121214]">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs text-gray-500">Total Files</span>
                                        <div className="text-purple-500"><Icons.FileText /></div>
                                    </div>
                                    <div className="text-2xl font-bold text-white">{project.blueprints}</div>
                                    <div className="text-[10px] text-gray-500 mt-1">12 processed, 3 queued</div>
                                </div>
                                <div className="p-4 rounded border border-[#27272a] bg-[#121214]">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs text-gray-500">Critical Issues</span>
                                        <div className="text-amber-500"><Icons.AlertTriangle /></div>
                                    </div>
                                    <div className="text-2xl font-bold text-white">4</div>
                                    <div className="text-[10px] text-gray-500 mt-1">Requires engineering review</div>
                                </div>
                            </div>
                        </div>
                    )}
                    {activeTab === 'blueprints' && (
                        <div className="space-y-2 animate-fade-in">
                             {MOCK_BLUEPRINTS.map(bp => (
                                <div key={bp.id} className="flex items-center justify-between p-3 rounded bg-[#121214] border border-[#27272a] hover:border-blue-500/30 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-[#09090b] rounded text-gray-400">
                                            <Icons.FileText />
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium text-white">{bp.name}</div>
                                            <div className="text-xs text-gray-500">ID: {bp.id} • Processed 2h ago</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-right">
                                            <div className="text-xs text-gray-400">Compliance</div>
                                            <div className="text-sm font-mono text-emerald-400">{bp.compliance}%</div>
                                        </div>
                                        <button className="px-3 py-1 bg-[#27272a] hover:bg-[#3f3f46] text-xs text-white rounded transition-colors">
                                            View
                                        </button>
                                    </div>
                                </div>
                             ))}
                        </div>
                    )}
                    {activeTab === 'team' && (
                        <div className="animate-fade-in">
                            <div className="p-4 rounded bg-[#121214] border border-[#27272a] mb-4">
                                <h3 className="text-sm font-medium text-white mb-4">Project Members</h3>
                                <div className="space-y-3">
                                    {['Dr. Sarah Chen (Lead)', 'Mike Ross (MEP)', 'AI System (Bot)'].map((name, i) => (
                                        <div key={i} className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-xs text-white font-bold">
                                                {name.charAt(0)}
                                            </div>
                                            <div className="text-sm text-gray-300">{name}</div>
                                            {i === 2 && <span className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded">Admin</span>}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                    {activeTab === 'settings' && (
                        <div className="animate-fade-in space-y-4">
                             <div className="p-4 rounded bg-[#121214] border border-[#27272a]">
                                <label className="block text-xs font-medium text-gray-400 mb-2">Project Name</label>
                                <input type="text" value={project.name} disabled className="w-full bg-[#09090b] border border-[#333] rounded px-3 py-2 text-sm text-gray-500" />
                             </div>
                             <div className="p-4 rounded bg-[#121214] border border-[#27272a]">
                                <h3 className="text-sm font-medium text-red-400 mb-2">Danger Zone</h3>
                                <p className="text-xs text-gray-500 mb-4">Archiving this project will make it read-only for all members.</p>
                                <button className="px-4 py-2 bg-red-500/10 border border-red-500/30 text-red-500 hover:bg-red-500/20 text-xs rounded transition-colors">
                                    Archive Project
                                </button>
                             </div>
                        </div>
                    )}
                </div>
             </div>
        </div>
    );
}

// --- Views ---

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

            <div className="grid grid-cols-4 gap-4">
                {[
                    { 
                        label: 'Active Projects', 
                        value: '3', 
                        subtext: '1 pending approval',
                        icon: <Icons.Layers />, 
                        color: 'text-blue-400',
                        dotColor: 'bg-blue-400'
                    },
                    { 
                        label: 'System Alerts', 
                        value: '2', 
                        subtext: 'Sensor sync required',
                        icon: <Icons.Bell />, 
                        color: 'text-rose-400',
                        dotColor: 'bg-rose-400'
                    },
                    { 
                        label: 'Pending Reviews', 
                        value: '5', 
                        subtext: 'Awaiting engineer sign-off',
                        icon: <Icons.FileText />, 
                        color: 'text-amber-400',
                        dotColor: 'bg-amber-400'
                    },
                    { 
                        label: 'Energy Savings', 
                        value: '14.2%', 
                        subtext: 'AI-detected optimizations',
                        icon: <Icons.Zap />, 
                        color: 'text-emerald-400',
                        dotColor: 'bg-emerald-400'
                    },
                ].map((stat, i) => (
                    <div key={i} className={`group relative overflow-hidden bg-[var(--bg-panel)] border border-[var(--border-subtle)] p-6 rounded-xl hover:border-[var(--border-active)] transition-all duration-300 hover:shadow-lg hover:bg-[var(--bg-surface)]`}>
                        {/* Top Right Icon - Enhanced Hover */}
                        <div className={`absolute top-4 right-4 p-2 transition-all duration-500 ease-out ${stat.color} opacity-20 group-hover:opacity-100 group-hover:scale-110 group-hover:drop-shadow-lg`}>
                            {React.cloneElement(stat.icon as React.ReactElement<any>, { width: 24, height: 24 })}
                        </div>
                        
                        <div className="flex flex-col h-full justify-end relative z-10 pt-4">
                            <div>
                                <div className="text-3xl font-light text-white tracking-tight mb-2">{stat.value}</div>
                                <div className={`text-sm font-medium ${stat.color} mb-2 opacity-90`}>{stat.label}</div>
                                <div className="text-xs text-[var(--text-muted)] font-mono flex items-center gap-2">
                                   <span className={`w-1.5 h-1.5 rounded-full ${stat.dotColor} animate-pulse-slow`}></span>
                                   {stat.subtext}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-3 gap-6">
                <div className="col-span-2 bg-[var(--bg-panel)] border border-[var(--border-subtle)] rounded-lg p-5 shadow-sm">
                    <h3 className="text-sm font-medium text-white mb-4 flex items-center gap-2">
                        <Icons.Activity /> Analysis Throughput (24h)
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
    const [selectedProjectForModal, setSelectedProjectForModal] = useState<Project | null>(null);

    return (
        <div className="relative h-full w-full">
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
                                onClick={() => setSelectedProjectForModal(proj)}
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

            {selectedProjectForModal && (
                <ProjectModal 
                    project={selectedProjectForModal} 
                    onClose={() => setSelectedProjectForModal(null)}
                    onOpenWorkspace={() => onSelectProject(selectedProjectForModal.id)}
                />
            )}
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
            <div className="flex-1 relative overflow-hidden bg-[#09090b]">
                <BlueprintCanvas 
                    isProcessing={isProcessing} 
                    uploadedImage={uploadedImage} 
                    onTriggerUpload={() => fileInputRef.current?.click()}
                />
                
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

const NavButton = ({ active, onClick, icon }: { active: boolean, onClick: () => void, icon: React.ReactNode }) => (
    <button 
        onClick={onClick}
        className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${active ? 'bg-blue-600 text-white' : 'text-gray-500 hover:text-gray-300 hover:bg-[#18181b]'}`}
    >
        {icon}
    </button>
);

// --- Main App Component ---
const App = () => {
  const [view, setView] = useState<ViewState>('dashboard');
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [components, setComponents] = useState<DetectedComponent[]>([]);
  
  // Right Panel State
  const [rightWidth, setRightWidth] = useState(450); 
  const [isRightOpen, setIsRightOpen] = useState(true);
  const [isResizingRight, setIsResizingRight] = useState(false);
  const [activeRightTab, setActiveRightTab] = useState<RightPanelTab>('components');

  // Quote State
  const [quoteItems, setQuoteItems] = useState<{id: string, description: string, sku: string, cost: number}[]>([]);
  const [quoteInfo, setQuoteInfo] = useState({
      number: 'QT-2024-8842',
      billToName: 'Project Manager',
      billToCompany: 'ASHRAE HQ Retrofit',
      date: new Date().toLocaleDateString()
  });

  // Resize Handlers
  const startResizingRight = useCallback(() => setIsResizingRight(true), []);
  const stopResizing = useCallback(() => setIsResizingRight(false), []);

  useEffect(() => {
    const handleResize = (e: MouseEvent) => {
      if (isResizingRight) {
        const newWidth = window.innerWidth - e.clientX;
        // Limit width between 280px and 800px
        if (newWidth > 300 && newWidth < 900) {
            setRightWidth(newWidth);
        }
      }
    };

    if (isResizingRight) {
      window.addEventListener("mousemove", handleResize);
      window.addEventListener("mouseup", stopResizing);
    }
    return () => {
      window.removeEventListener("mousemove", handleResize);
      window.removeEventListener("mouseup", stopResizing);
    };
  }, [isResizingRight, stopResizing]);

  // Quote Handlers
  const handleQuoteItemChange = (id: string, field: string, value: any) => {
      setQuoteItems(prev => prev.map(item => 
          item.id === id ? { ...item, [field]: value } : item
      ));
  };

  const addQuoteItem = () => {
      setQuoteItems(prev => [...prev, {
          id: `manual-${Date.now()}`,
          description: 'New Item',
          sku: 'MANUAL',
          cost: 0
      }]);
  };

  const removeQuoteItem = (id: string) => {
      setQuoteItems(prev => prev.filter(item => item.id !== id));
  };

  // Pricing Handlers
  const handleComponentCostChange = (id: string, newCost: number) => {
      setComponents(prev => prev.map(comp => 
          comp.id === id ? { ...comp, cost: newCost } : comp
      ));
      // Also sync to quote items to keep them consistent if they exist
      setQuoteItems(prev => prev.map(item => 
          item.id === id ? { ...item, cost: newCost } : item
      ));
  };

  // Handlers
  const handleNavigate = (v: ViewState) => setView(v);
  
  const handleSelectProject = (id: string) => {
    setActiveProjectId(id);
    handleNavigate('workspace');
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        setUploadedImage(evt.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const runAnalysis = async () => {
    if (!uploadedImage) return;
    setIsProcessing(true);
    // Switch to analysis tab initially to show loading or results
    setActiveRightTab('components'); 

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
        
        // Extract mime type and base64 data to handle varied image formats
        const matches = uploadedImage.match(/^data:(.+);base64,(.+)$/);
        const mimeType = matches ? matches[1] : 'image/png';
        const base64Data = matches ? matches[2] : uploadedImage.split(',')[1];
        
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: {
                parts: [
                    { inlineData: { mimeType: mimeType, data: base64Data } },
                    { text: "Analyze this HVAC blueprint. Identify all HVAC components (VAV boxes, AHUs, Diffusers, Thermostats, Dampers, etc.). \n\n" +
                            "For each component, provide:\n" +
                            "- A unique ID (e.g., VAV-01)\n" +
                            "- Name\n" +
                            "- Type\n" +
                            "- Confidence score (0.0-1.0)\n" +
                            "- Status ('verified' if confidence > 0.9, else 'review')\n" +
                            "- Estimated unit cost in USD (realistic market rates)\n" +
                            "- A plausible manufacturer SKU\n\n" +
                            "Also generate a detailed technical analysis report in Markdown covering ASHRAE 62.1 compliance, issues, and optimizations." 
                    }
                ]
            },
            config: {
                thinkingConfig: { thinkingBudget: 4096 }, // Allocate 4k tokens for reasoning
                maxOutputTokens: 20000, // Increase max output to accommodate thinking + detailed JSON
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        analysisReport: {
                            type: Type.STRING,
                            description: "Markdown formatted technical analysis report."
                        },
                        detectedComponents: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    id: { type: Type.STRING },
                                    name: { type: Type.STRING },
                                    type: { type: Type.STRING },
                                    confidence: { type: Type.NUMBER },
                                    status: { type: Type.STRING },
                                    cost: { type: Type.NUMBER },
                                    sku: { type: Type.STRING }
                                },
                                required: ["id", "name", "type", "confidence", "status", "cost", "sku"]
                            }
                        }
                    },
                    required: ["analysisReport", "detectedComponents"]
                }
            }
        });

        const result = JSON.parse(response.text || "{}");
        
        if (result.analysisReport) {
             setAiAnalysis(result.analysisReport);
        }
        
        if (result.detectedComponents) {
            // Map the API status string to our specific union type 'verified' | 'review'
            const components: DetectedComponent[] = result.detectedComponents.map((c: any) => ({
                ...c,
                status: (c.status === 'verified' || c.status === 'review') ? c.status : 'review'
            }));
            
            setComponents(components);
            
            // Initialize Quote Items based on actual components detected
            setQuoteItems(components.map(c => ({
                  id: c.id,
                  description: c.name,
                  sku: c.sku,
                  cost: c.cost
            })));
        }

    } catch (err) {
        console.error("Analysis failed", err);
        setAiAnalysis("Analysis failed. Please try again.");
    } finally {
        setIsProcessing(false);
    }
  };

  // --- Pricing Calculation ---
  const subtotal = components.reduce((sum, item) => sum + item.cost, 0);
  const taxRate = 0.08;
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  return (
    <div className="flex h-screen bg-[#000000] text-gray-200 font-sans selection:bg-blue-900/50 overflow-hidden">
      {/* Sidebar */}
      <nav className="w-16 border-r border-[#27272a] bg-[#09090b] flex flex-col items-center py-6 gap-6 z-50 shrink-0">
        <div className="text-blue-500 mb-2"><Icons.Wind /></div>
        <NavButton active={view === 'dashboard'} onClick={() => setView('dashboard')} icon={<Icons.Home />} />
        <NavButton active={view === 'projects'} onClick={() => setView('projects')} icon={<Icons.Layers />} />
        <NavButton active={view === 'workspace'} onClick={() => setView('workspace')} icon={<Icons.Maximize />} />
        <div className="mt-auto">
             <NavButton active={false} onClick={() => {}} icon={<Icons.Settings />} />
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden relative flex flex-col min-w-0">
        {view === 'dashboard' && <DashboardView onNavigate={handleNavigate} />}
        {view === 'projects' && <ProjectsView onSelectProject={handleSelectProject} />}
        {view === 'workspace' && (
            <WorkspaceView 
                blueprint={MOCK_BLUEPRINTS.find(b => b.id === 'bp-101')!} 
                isProcessing={isProcessing}
                uploadedImage={uploadedImage}
                onRunAnalysis={runAnalysis}
                onUpload={handleUpload}
            />
        )}
      </main>

      {/* RIGHT PANEL (Resizable & Collapsible) */}
      <div 
        className="relative flex flex-col shrink-0 z-20 group"
        style={{ 
            width: isRightOpen ? rightWidth : 0, 
            transition: isResizingRight ? 'none' : 'width 0.4s cubic-bezier(0.2, 0, 0, 1)' 
        }}
      >
         {/* Toggle Button - Anchored to Left Edge */}
         <ToggleButton isOpen={isRightOpen} onClick={() => setIsRightOpen(!isRightOpen)} side="right" />

         {/* Resize Handle */}
         {isRightOpen && (
             <div 
                 className="absolute top-0 left-0 w-2 h-full cursor-col-resize hover:bg-blue-500/0 transition-colors z-30"
                 onMouseDown={startResizingRight}
             >
                 <div className="absolute top-0 bottom-0 left-0 w-[1px] bg-transparent group-hover:bg-blue-500/50 transition-colors delay-100"></div>
             </div>
         )}

         {/* CLIPPING CONTAINER */}
         <div className="absolute inset-0 overflow-hidden border-l border-[#27272a] bg-[#09090b] flex flex-col">
             {/* CONTENT CONTAINER - Fixed width */}
             <div className="h-full flex flex-col" style={{ width: rightWidth }}>
                
                {/* Tab Header - Updated */}
                <div className="h-12 border-b border-[#27272a] flex items-center px-1 shrink-0 bg-[#09090b] gap-0.5">
                    {[
                      { id: 'components', label: 'Components' },
                      { id: 'analysis', label: 'Analysis' },
                      { id: 'pricing', label: 'Pricing' },
                      { id: 'quote', label: 'Quote' },
                    ].map(tab => (
                      <button 
                        key={tab.id}
                        onClick={() => setActiveRightTab(tab.id as RightPanelTab)}
                        className={`flex-1 flex items-center justify-center h-full text-[11px] font-medium border-b-2 transition-all duration-200 hover:bg-[#121214] rounded-t-lg mt-1 ${
                            activeRightTab === tab.id 
                            ? 'border-blue-500 text-white bg-[#121214]' 
                            : 'border-transparent text-gray-500 hover:text-gray-300'
                        }`}
                        title={tab.label}
                    >
                        {tab.label}
                    </button>
                    ))}
                </div>

                {/* Tab Content Area */}
                <div className="flex-1 overflow-y-auto bg-[#09090b] relative">
                    
                    {/* COMPONENTS TAB */}
                    {activeRightTab === 'components' && (
                        <div className="absolute inset-0 p-4 space-y-3 animate-fade-in">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Detected Equipment</h3>
                                <span className="bg-blue-500/10 text-blue-400 text-[10px] px-2 py-0.5 rounded-full border border-blue-500/20">{components.length} Found</span>
                            </div>
                            {components.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-48 text-gray-600">
                                   <Icons.Search />
                                   <p className="text-xs mt-2">No components detected yet.</p>
                                   <p className="text-[10px] opacity-60">Run analysis to identify equipment.</p>
                                </div>
                            ) : (
                                components.map((comp) => (
                                    <div key={comp.id} className="group bg-[#121214] border border-[#27272a] rounded-lg p-3 hover:border-blue-500/30 transition-all flex items-start gap-3">
                                        <div className="p-2 bg-[#18181b] rounded-md text-gray-400 group-hover:text-blue-400 transition-colors">
                                            <Icons.Box />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between">
                                                <div className="text-sm font-medium text-gray-200 truncate">{comp.name}</div>
                                                <StatusBadge status={comp.status} />
                                            </div>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-[10px] bg-gray-800 text-gray-400 px-1.5 rounded">{comp.id}</span>
                                                <span className="text-[10px] text-gray-500">Confidence: {(comp.confidence * 100).toFixed(0)}%</span>
                                            </div>
                                            <div className="mt-2 h-1 w-full bg-gray-800 rounded-full overflow-hidden">
                                                <div className="h-full bg-blue-500/50" style={{ width: `${comp.confidence * 100}%` }}></div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {/* ANALYSIS TAB */}
                    {activeRightTab === 'analysis' && (
                        <div className="absolute inset-0 p-6 text-xs text-gray-300 markdown-body animate-fade-in">
                            {aiAnalysis ? (
                                <ReactMarkdown remarkPlugins={[remarkGfm]} components={MarkdownComponents}>
                                    {aiAnalysis}
                                </ReactMarkdown>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-gray-600 gap-3">
                                    <div className="p-4 rounded-full bg-[#121214] border border-[#27272a] text-purple-900/40">
                                        <Icons.Sparkles />
                                    </div>
                                    <p className="text-sm font-medium">No analysis generated yet.</p>
                                    {!isProcessing && uploadedImage && (
                                        <button onClick={runAnalysis} className="mt-2 text-blue-500 hover:text-blue-400 hover:underline text-xs">Run Analysis Now</button>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {/* PRICING TAB - EDITABLE UNIT COSTS */}
                    {activeRightTab === 'pricing' && (
                        <div className="absolute inset-0 flex flex-col animate-fade-in">
                             <div className="p-6 border-b border-[#27272a] bg-[#121214]">
                                 <div className="flex items-center justify-between mb-1">
                                     <span className="text-sm text-gray-400">Total Estimate</span>
                                     <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[10px] rounded border border-emerald-500/20">USD</span>
                                 </div>
                                 <div className="text-3xl font-light text-white tracking-tight">
                                     ${total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                 </div>
                             </div>
                             <div className="flex-1 overflow-y-auto p-4">
                                 <table className="w-full text-xs text-left text-gray-400">
                                     <thead className="text-[10px] uppercase text-gray-500 border-b border-[#27272a]">
                                         <tr>
                                             <th className="pb-2 font-medium">Component</th>
                                             <th className="pb-2 font-medium text-right">Unit Cost</th>
                                             <th className="pb-2 font-medium text-right">Total</th>
                                         </tr>
                                     </thead>
                                     <tbody className="divide-y divide-[#27272a]">
                                         {components.map(comp => (
                                             <tr key={comp.id}>
                                                 <td className="py-3 pr-2">
                                                     <div className="text-gray-200">{comp.name}</div>
                                                     <div className="text-[10px] text-gray-600">{comp.sku}</div>
                                                 </td>
                                                 <td className="py-3 text-right">
                                                    <div className="flex items-center justify-end gap-1">
                                                        <span className="text-gray-500 font-mono">$</span>
                                                        <input 
                                                            type="number"
                                                            value={comp.cost}
                                                            onChange={(e) => handleComponentCostChange(comp.id, parseFloat(e.target.value) || 0)}
                                                            className="w-20 bg-transparent text-right text-gray-200 focus:outline-none font-mono border-b border-transparent focus:border-blue-500 transition-colors"
                                                        />
                                                    </div>
                                                 </td>
                                                 <td className="py-3 text-right text-gray-300 font-mono">${comp.cost.toFixed(2)}</td>
                                             </tr>
                                         ))}
                                         {components.length > 0 && (
                                            <>
                                                <tr className="bg-blue-900/5">
                                                    <td className="py-3 font-medium text-blue-400">Subtotal</td>
                                                    <td className="py-3"></td>
                                                    <td className="py-3 text-right text-blue-400 font-mono">${subtotal.toFixed(2)}</td>
                                                </tr>
                                                <tr>
                                                    <td className="py-3 text-gray-500">Tax (8%)</td>
                                                    <td className="py-3"></td>
                                                    <td className="py-3 text-right text-gray-500 font-mono">${tax.toFixed(2)}</td>
                                                </tr>
                                            </>
                                         )}
                                     </tbody>
                                 </table>
                                 {components.length === 0 && (
                                    <div className="text-center py-12 text-gray-600">
                                        <Icons.Tag />
                                        <p className="mt-2 text-xs">No components to price.</p>
                                    </div>
                                 )}
                             </div>
                        </div>
                    )}

                    {/* QUOTE TAB - EDITABLE DARK THEME */}
                    {activeRightTab === 'quote' && (
                        <div className="absolute inset-0 bg-[#09090b] p-6 overflow-y-auto animate-fade-in custom-scrollbar">
                            {/* Dark Document UI */}
                            <div className="bg-[#121214] shadow-2xl min-h-[600px] p-8 border border-[#27272a] rounded-xl relative max-w-2xl mx-auto">
                                 {/* Header */}
                                 <div className="flex justify-between items-start mb-8 border-b border-[#27272a] pb-8">
                                     <div className="flex flex-col gap-2">
                                         <h1 className="text-2xl font-light tracking-tight text-white">QUOTE</h1>
                                         <div className="flex items-center gap-2">
                                            <span className="text-xs text-gray-500 font-mono">#</span>
                                            <input 
                                                type="text" 
                                                value={quoteInfo.number}
                                                onChange={(e) => setQuoteInfo(prev => ({...prev, number: e.target.value}))}
                                                className="bg-transparent border-b border-dashed border-[#3f3f46] text-sm text-blue-400 font-mono focus:outline-none focus:border-blue-500 w-32"
                                            />
                                         </div>
                                     </div>
                                     <div className="text-right">
                                         <div className="font-medium text-lg text-white">HVAC AI Solutions</div>
                                         <p className="text-[#71717a] text-xs">101 Tech Plaza</p>
                                         <p className="text-[#71717a] text-xs">San Francisco, CA</p>
                                     </div>
                                 </div>

                                 {/* Client Info & Date */}
                                 <div className="flex justify-between mb-8">
                                     <div className="flex flex-col gap-1 w-1/2">
                                         <label className="text-[10px] uppercase font-bold text-[#71717a] mb-1">Bill To</label>
                                         <input 
                                            type="text"
                                            value={quoteInfo.billToName}
                                            onChange={(e) => setQuoteInfo(prev => ({...prev, billToName: e.target.value}))} 
                                            className="bg-transparent border border-transparent hover:border-[#27272a] focus:border-blue-500 rounded px-2 py-1 -ml-2 text-sm text-white font-medium transition-all"
                                         />
                                         <input 
                                            type="text"
                                            value={quoteInfo.billToCompany}
                                            onChange={(e) => setQuoteInfo(prev => ({...prev, billToCompany: e.target.value}))}
                                            className="bg-transparent border border-transparent hover:border-[#27272a] focus:border-blue-500 rounded px-2 py-1 -ml-2 text-xs text-gray-400 transition-all"
                                         />
                                     </div>
                                     <div className="text-right">
                                         <label className="text-[10px] uppercase font-bold text-[#71717a] mb-1">Date</label>
                                         <input 
                                            type="text"
                                            value={quoteInfo.date}
                                            onChange={(e) => setQuoteInfo(prev => ({...prev, date: e.target.value}))}
                                            className="bg-transparent border-b border-dashed border-[#3f3f46] text-right text-sm text-gray-300 focus:outline-none focus:border-blue-500 w-24"
                                         />
                                     </div>
                                 </div>

                                 {/* Editable Table */}
                                 <table className="w-full mb-6">
                                     <thead>
                                         <tr className="border-b border-[#27272a]">
                                             <th className="text-left py-2 text-[10px] uppercase text-[#71717a] font-medium pl-2">Description</th>
                                             <th className="text-right py-2 text-[10px] uppercase text-[#71717a] font-medium w-24">Amount</th>
                                             <th className="w-8"></th>
                                         </tr>
                                     </thead>
                                     <tbody className="divide-y divide-[#27272a]">
                                         {quoteItems.map(item => (
                                             <tr key={item.id} className="group hover:bg-[#18181b] transition-colors">
                                                 <td className="py-2 pl-2">
                                                     <input 
                                                        type="text" 
                                                        value={item.description}
                                                        onChange={(e) => handleQuoteItemChange(item.id, 'description', e.target.value)}
                                                        className="w-full bg-transparent text-sm text-gray-200 focus:outline-none placeholder-gray-600"
                                                        placeholder="Item description"
                                                     />
                                                     <input 
                                                        type="text" 
                                                        value={item.sku}
                                                        onChange={(e) => handleQuoteItemChange(item.id, 'sku', e.target.value)}
                                                        className="w-full bg-transparent text-[10px] text-gray-500 font-mono focus:outline-none placeholder-gray-700"
                                                        placeholder="SKU / ID"
                                                     />
                                                 </td>
                                                 <td className="py-2 text-right align-top">
                                                    <div className="flex items-center justify-end gap-1 text-gray-400">
                                                        <span className="text-xs">$</span>
                                                        <input 
                                                            type="number" 
                                                            value={item.cost}
                                                            onChange={(e) => handleQuoteItemChange(item.id, 'cost', parseFloat(e.target.value) || 0)}
                                                            className="w-16 bg-transparent text-sm text-right text-gray-200 focus:outline-none font-mono no-spin"
                                                        />
                                                    </div>
                                                 </td>
                                                 <td className="py-2 text-right align-middle">
                                                     <button 
                                                        onClick={() => removeQuoteItem(item.id)}
                                                        className="opacity-0 group-hover:opacity-100 p-1.5 text-red-500 hover:bg-red-500/10 rounded transition-all"
                                                     >
                                                        <Icons.Trash width={12} height={12} />
                                                     </button>
                                                 </td>
                                             </tr>
                                         ))}
                                     </tbody>
                                 </table>

                                 <button 
                                    onClick={addQuoteItem}
                                    className="w-full py-2 border border-dashed border-[#3f3f46] rounded text-xs text-gray-500 hover:text-blue-400 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all mb-8 flex items-center justify-center gap-2"
                                 >
                                    <Icons.Plus />
                                    <span>Add Line Item</span>
                                 </button>

                                 {/* Totals */}
                                 <div className="flex justify-end mb-12">
                                     <div className="w-48 space-y-2">
                                         <div className="flex justify-between text-xs text-gray-500">
                                             <span>Subtotal</span>
                                             <span className="font-mono text-gray-300">${quoteItems.reduce((s, i) => s + i.cost, 0).toFixed(2)}</span>
                                         </div>
                                         <div className="flex justify-between text-xs text-gray-500">
                                             <span>Tax (8%)</span>
                                             <span className="font-mono text-gray-300">${(quoteItems.reduce((s, i) => s + i.cost, 0) * 0.08).toFixed(2)}</span>
                                         </div>
                                         <div className="flex justify-between py-3 border-t border-[#27272a] text-sm font-medium text-white">
                                             <span>Total</span>
                                             <span className="font-mono text-emerald-400">${(quoteItems.reduce((s, i) => s + i.cost, 0) * 1.08).toFixed(2)}</span>
                                         </div>
                                     </div>
                                 </div>

                                 <div className="text-[10px] text-[#52525b] text-center border-t border-[#27272a] pt-6 mt-auto">
                                     <p>Generated by HVAC AI Neural Engine. Valid for 30 days.</p>
                                 </div>
                            </div>
                            
                            <div className="flex justify-center mt-6">
                                 <button className="flex items-center gap-2 px-6 py-2 bg-[#27272a] hover:bg-[#3f3f46] text-white rounded-lg shadow-lg border border-black transition-colors text-xs font-medium">
                                     <Icons.FileText /> Export PDF
                                 </button>
                             </div>
                        </div>
                    )}

                </div>
             </div>
         </div>
      </div>

      {/* Resize Overlay for smooth dragging across iframes/elements */}
      {isResizingRight && (
        <div className="fixed inset-0 z-[100] cursor-col-resize"></div>
      )}
    </div>
  );
};

const container = document.getElementById("root");
if (container) {
    const root = createRoot(container);
    root.render(<App />);
}
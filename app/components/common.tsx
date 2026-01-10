import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Icons } from './Icons';

export type HealthStatus = 'green' | 'amber' | 'red' | 'blue' | 'gray';

export const getStatusColor = (status: string, openIssues: number = 0): HealthStatus => {
  if (status === 'completed') return 'blue';
  if (status === 'archived') return 'gray';
  if (status === 'on_hold') return 'red';
  if (openIssues > 3) return 'red';
  if (openIssues > 0) return 'amber';
  if (status === 'active') return 'green';
  return 'gray';
};

export const StatusBadge = ({ status, openIssues = 0 }: { status: string, openIssues?: number }) => {
  const health = getStatusColor(status, openIssues);
  
  const colors = {
    green: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20', // On Track
    amber: 'text-amber-400 bg-amber-400/10 border-amber-400/20',    // Caution
    red: 'text-rose-500 bg-rose-500/10 border-rose-500/20',        // Critical
    blue: 'text-blue-400 bg-blue-400/10 border-blue-400/20',       // Completed
    gray: 'text-gray-400 bg-gray-400/10 border-gray-400/20',       // Unallocated/Pending
  };

  const labels: Record<string, string> = {
    active: health === 'green' ? 'On Track' : health === 'amber' ? 'Caution' : 'Active',
    completed: 'Completed',
    on_hold: 'Critical',
    archived: 'Archived'
  };

  return (
    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border whitespace-nowrap ${colors[health]}`}>
      {labels[status] || status}
    </span>
  );
};

export const NavButton = ({ active, onClick, icon }: { active: boolean, onClick: () => void, icon: React.ReactNode }) => (
    <button 
        onClick={onClick}
        className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${active ? 'bg-blue-600 text-white' : 'text-gray-500 hover:text-gray-300 hover:bg-[#18181b]'}`}
    >
        {icon}
    </button>
);

export const ToggleButton = ({ isOpen, onClick, side }: { isOpen: boolean, onClick: () => void, side: 'left' | 'right' }) => {
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

const MarkdownComponents = {
  // Title: Professional Document Header style
  h1: ({node, ...props}: any) => (
      <div className="mt-2 mb-8 border-b border-blue-500/30 pb-4">
          <h1 className="text-2xl font-light tracking-tight text-white flex items-center gap-3" {...props} />
          <div className="flex items-center gap-2 mt-2">
             <span className="h-1 w-12 bg-blue-500 rounded-full"></span>
             <span className="text-[10px] text-blue-400 font-mono uppercase tracking-widest">Engineering Report</span>
          </div>
      </div>
  ),
  // Section Header: High contrast, distinct from body
  h2: ({node, ...props}: any) => {
    // Helper to extract plain text from React children to determine context
    const getText = (children: any): string => {
        if (typeof children === 'string') return children.toLowerCase();
        if (Array.isArray(children)) return children.map(getText).join('').toLowerCase();
        if (children && children.props && children.props.children) return getText(children.props.children);
        return '';
    };

    const text = getText(props.children);
    
    let Icon = Icons.Layers;
    let iconColor = "text-blue-400";
    let borderColor = "border-[#27272a]";
    let bg = "bg-[#18181b]";

    if (text.includes('topology') || text.includes('system')) {
        Icon = Icons.Grid; 
        iconColor = "text-blue-400";
    } else if (text.includes('critical') || text.includes('flaw') || text.includes('risk') || text.includes('safety')) {
        Icon = Icons.AlertTriangle;
        iconColor = "text-rose-500";
        bg = "bg-rose-500/10";
        borderColor = "border-rose-500/20";
    } else if (text.includes('observation') || text.includes('finding') || text.includes('note')) {
        Icon = Icons.Search;
        iconColor = "text-amber-400";
        bg = "bg-amber-400/10";
        borderColor = "border-amber-400/20";
    } else if (text.includes('optimization') || text.includes('recommendation') || text.includes('energy') || text.includes('efficiency')) {
        Icon = Icons.Zap;
        iconColor = "text-emerald-400";
        bg = "bg-emerald-400/10";
        borderColor = "border-emerald-400/20";
    } else if (text.includes('summary') || text.includes('executive')) {
        Icon = Icons.FileText;
        iconColor = "text-purple-400";
    }

    return (
      <div className="group mt-10 mb-4 flex items-center gap-3">
          <div className={`w-8 h-8 rounded flex items-center justify-center ${bg} border ${borderColor} ${iconColor} shadow-sm transition-all`}>
             <Icon width={16} height={16} />
          </div>
          <h2 className="text-lg font-semibold text-gray-100" {...props} />
      </div>
    );
  },
  // Sub-header: Technical Label style
  h3: ({node, ...props}: any) => (
      <h3 className="text-xs font-bold text-gray-400 mt-6 mb-3 uppercase tracking-widest flex items-center gap-2" {...props}>
          <span className="w-1.5 h-1.5 bg-gray-600 rounded-full"></span>
          {props.children}
      </h3>
  ),
  // Body text: High readability, lighter than headers
  p: ({node, ...props}: any) => <p className="mb-4 leading-7 text-gray-300 text-sm font-normal max-w-3xl" {...props} />,
  
  // Lists: Clean technical bullets
  ul: ({node, ...props}: any) => <ul className="space-y-3 mb-6 pl-2" {...props} />,
  ol: ({node, ...props}: any) => <ol className="list-decimal list-inside space-y-3 mb-6 text-gray-400 pl-2" {...props} />,
  li: ({node, ...props}: any) => (
      <li className="flex items-start gap-3 text-sm text-gray-300 leading-6 group" {...props}>
          <span className="mt-1.5 min-w-[6px] h-1.5 rounded-full bg-blue-500/40 group-hover:bg-blue-400 transition-colors"></span>
          <span className="flex-1">{props.children}</span>
      </li>
  ),
  
  // Emphasis: Highlight marker style
  strong: ({node, ...props}: any) => <strong className="font-semibold text-white" {...props} />,
  
  // Executive Summary / Key Insights: Rich Card
  blockquote: ({node, ...props}: any) => (
      <div className="my-6 bg-gradient-to-r from-blue-900/10 to-transparent border-l-4 border-blue-500 rounded-r-lg p-5 relative overflow-hidden">
          <div className="flex gap-4 relative z-10">
              <div className="text-blue-400 shrink-0 mt-0.5 p-1.5 bg-blue-500/10 rounded-md">
                 <Icons.Info width={18} height={18} />
              </div>
              <div>
                 <div className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-1">Key Engineering Insight</div>
                 <div className="text-sm text-gray-200 italic leading-relaxed">{props.children}</div>
              </div>
          </div>
      </div>
  ),

  // Code/Data: Terminal style box
  code: ({node, inline, className, children, ...props}: any) => {
     return inline 
       ? <code className="px-1.5 py-0.5 rounded bg-[#1e1e20] text-emerald-400 font-mono text-[11px] border border-gray-800" {...props}>{children}</code>
       : <div className="rounded-lg overflow-hidden border border-[#27272a] my-6 bg-[#0c0c0e] shadow-lg group">
           <div className="px-4 py-2 bg-[#18181b] border-b border-[#27272a] flex items-center justify-between">
              <span className="text-[10px] text-gray-500 font-mono uppercase tracking-wider">System Output</span>
              <div className="flex gap-1.5">
                 <div className="w-2 h-2 rounded-full bg-red-500/20"></div>
                 <div className="w-2 h-2 rounded-full bg-amber-500/20"></div>
                 <div className="w-2 h-2 rounded-full bg-green-500/20"></div>
              </div>
           </div>
           <pre className="p-4 overflow-x-auto custom-scrollbar"><code className="text-xs font-mono text-gray-300 leading-relaxed" {...props}>{children}</code></pre>
         </div>
  },

  // Tables: Data Grid style
  table: ({node, ...props}: any) => (
     <div className="overflow-hidden rounded-lg border border-[#27272a] bg-[#121214] shadow-sm my-8">
        <div className="overflow-x-auto custom-scrollbar">
           <table className="w-full text-left text-xs" {...props} />
        </div>
     </div>
  ),
  thead: ({node, ...props}: any) => <thead className="bg-[#18181b] text-gray-400 uppercase tracking-wider font-semibold border-b border-[#27272a]" {...props} />,
  tr: ({node, ...props}: any) => <tr className="border-b border-[#27272a]/50 last:border-0 hover:bg-blue-500/5 transition-colors group" {...props} />,
  th: ({node, ...props}: any) => <th className="px-6 py-4 font-medium text-[10px] tracking-widest text-gray-500" {...props} />,
  td: ({node, ...props}: any) => <td className="px-6 py-3.5 text-gray-300 group-hover:text-white transition-colors border-r border-[#27272a]/30 last:border-r-0" {...props} />,
};

export const MarkdownRenderer = ({ content }: { content: string }) => (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={MarkdownComponents}>
        {content}
    </ReactMarkdown>
);
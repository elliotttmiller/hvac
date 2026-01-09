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
  h1: ({node, ...props}: any) => (
      <div className="mt-8 mb-6 border-b border-gray-800/50 pb-4">
          <h1 className="text-2xl font-light tracking-tight text-white flex items-center gap-3" {...props} />
          <div className="h-0.5 w-16 bg-blue-600 mt-4 rounded-full"></div>
      </div>
  ),
  h2: ({node, ...props}: any) => (
      <h2 className="text-lg font-medium text-blue-400 mt-8 mb-4 flex items-center gap-2" {...props}>
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]"></span>
          {props.children}
      </h2>
  ),
  h3: ({node, ...props}: any) => <h3 className="text-sm font-bold text-gray-100 mt-6 mb-3 uppercase tracking-wider pl-4 border-l-2 border-gray-700" {...props} />,
  p: ({node, ...props}: any) => <p className="mb-4 leading-7 text-gray-300 text-sm font-normal" {...props} />,
  ul: ({node, ...props}: any) => <ul className="space-y-3 mb-6" {...props} />,
  ol: ({node, ...props}: any) => <ol className="list-decimal list-inside space-y-3 mb-6 text-gray-400" {...props} />,
  li: ({node, ...props}: any) => (
      <li className="flex gap-3 text-sm text-gray-300 leading-6 pl-1" {...props}>
          <span className="text-blue-500/50 mt-1.5 text-[10px]">●</span>
          <span className="flex-1">{props.children}</span>
      </li>
  ),
  strong: ({node, ...props}: any) => <strong className="font-semibold text-white bg-blue-500/10 px-1.5 py-0.5 rounded text-xs border border-blue-500/20" {...props} />,
  blockquote: ({node, ...props}: any) => (
      <div className="flex gap-3 p-4 my-6 bg-blue-900/10 border border-blue-500/20 rounded-lg shadow-sm">
          <div className="text-blue-400 shrink-0 mt-0.5"><Icons.Info /></div>
          <div className="text-sm text-gray-300 italic leading-relaxed">{props.children}</div>
      </div>
  ),
  code: ({node, inline, className, children, ...props}: any) => {
     return inline 
       ? <code className="px-1.5 py-0.5 rounded bg-[#1e1e20] text-blue-300 font-mono text-[11px] border border-gray-800" {...props}>{children}</code>
       : <div className="rounded-lg overflow-hidden border border-gray-800 my-6 bg-[#0c0c0e] shadow-lg"><div className="px-4 py-2 bg-[#18181b] border-b border-gray-800 text-[10px] text-gray-500 font-mono uppercase tracking-wider">System Output</div><pre className="p-4 overflow-x-auto"><code className="text-xs font-mono text-gray-300" {...props}>{children}</code></pre></div>
  },
  table: ({node, ...props}: any) => <div className="overflow-x-auto mb-8 rounded-lg border border-gray-800 bg-[#0c0c0e] shadow-md custom-scrollbar"><table className="w-full text-left text-xs min-w-[400px]" {...props} /></div>,
  thead: ({node, ...props}: any) => <thead className="bg-[#18181b] text-gray-400 uppercase tracking-wider font-semibold border-b border-gray-800" {...props} />,
  tr: ({node, ...props}: any) => <tr className="border-b border-gray-800/50 last:border-0 hover:bg-gray-800/30 transition-colors" {...props} />,
  th: ({node, ...props}: any) => <th className="px-4 py-3 font-medium text-[11px]" {...props} />,
  td: ({node, ...props}: any) => <td className="px-4 py-3 text-gray-400" {...props} />,
};

export const MarkdownRenderer = ({ content }: { content: string }) => (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={MarkdownComponents}>
        {content}
    </ReactMarkdown>
);

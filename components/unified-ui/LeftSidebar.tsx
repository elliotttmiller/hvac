import React, { useState, useEffect } from 'react';
import { 
  Search, 
  ChevronRight, 
  ChevronDown, 
  Folder, 
  FileText, 
  Image as ImageIcon,
  Box,
  MoreHorizontal,
  Plus,
  FileCode,
  Briefcase
} from 'lucide-react';

// Data structures returned by the local file API
interface FileNode {
  id: string; // relative path
  name: string;
  type: 'file' | 'folder';
  fileType?: string;
  children?: FileNode[];
}

interface Project {
  id: string;
  name: string;
  root: string;
}

const FileIcon = ({ type }: { type?: string }) => {
  switch (type) {
    case 'pdf': return <FileText size={12} className="text-red-400" />;
    case 'dwg': return <Box size={12} className="text-blue-400" />;
    case 'png': return <ImageIcon size={12} className="text-emerald-400" />;
    case 'json': return <FileCode size={12} className="text-yellow-400" />;
    default: return <FileText size={12} className="text-zinc-500" />;
  }
};

interface TreeNodeProps {
  node: FileNode;
  level: number;
  activeId: string | null;
  onSelect: (id: string) => void;
  onLoadChildren?: (id: string) => Promise<void>;
}

const TreeNode: React.FC<TreeNodeProps> = ({ node, level, activeId, onSelect, onLoadChildren }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const isFolder = node.type === 'folder';
  
  return (
    <div>
      <div 
        className={`flex items-center gap-1.5 py-1 pr-2 rounded cursor-pointer transition-colors group ${
            activeId === node.id ? 'bg-fuchsia-500/10 text-fuchsia-100' : 'text-zinc-400 hover:bg-white/5 hover:text-zinc-200'
        }`}
        style={{ paddingLeft: `${level * 12 + 12}px` }}
        onClick={async (e) => {
            e.stopPropagation();
            if (isFolder) {
              if (!node.children && onLoadChildren) {
                setLoading(true);
                try {
                  await onLoadChildren(node.id);
                } finally {
                  setLoading(false);
                  setIsOpen(true);
                }
              } else {
                setIsOpen(!isOpen);
              }
            } else onSelect(node.id);
        }}
      >
        <span className="opacity-70">
            {isFolder ? (
                <div className={`transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}>
                    <ChevronRight size={10} />
                </div>
            ) : (
                <div className="w-2.5" /> // Spacer
            )}
        </span>
        
      {isFolder ? (
        <div className="flex items-center gap-2">
          <Folder size={12} className={`${isOpen ? 'text-zinc-300' : 'text-zinc-500'} fill-zinc-500/10`} />
          {loading && <span className="text-[10px] text-zinc-500">Loading...</span>}
        </div>
      ) : (
        <FileIcon type={node.fileType} />
      )}
        
        <span className="text-xs truncate flex-1">{node.name}</span>
      </div>

            {isFolder && isOpen && node.children && (
        <div>
          {node.children.map(child => (
            <TreeNode key={child.id} node={child} level={level + 1} activeId={activeId} onSelect={onSelect} />
          ))}
        </div>
      )}
    </div>
  );
};

import { io } from 'socket.io-client';
import PreviewModal from '../PreviewModal';

const LeftSidebar: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProject, setActiveProject] = useState<string | null>(null);
  const [tree, setTree] = useState<FileNode[]>([]);
  const [activeFile, setActiveFile] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const currentProject = projects.find(p => p.id === activeProject) || (projects[0] ?? null);

  useEffect(() => {
    // fetch projects
    fetch('/api/projects')
      .then(r => r.json())
      .then(d => {
        setProjects(d.projects || []);
        if (d.projects && d.projects.length) setActiveProject(d.projects[0].id);
      })
      .catch(() => setProjects([]));
  }, []);

  useEffect(() => {
    if (!activeProject) return;
    // fetch top-level immediate children only
    fetch(`/api/projects/${activeProject}/tree?dir=${encodeURIComponent('.')}`)
      .then(r => r.json())
      .then(d => setTree(d.tree || []))
      .catch(() => setTree([]));

    // subscribe to socket updates and refetch tree on changes
    const socket = io();
    const onChange = () => {
      fetch(`/api/projects/${activeProject}/tree`).then(r=>r.json()).then(d=>setTree(d.tree||[])).catch(()=>{});
    };
    socket.on('file-added', onChange);
    socket.on('file-changed', onChange);
    socket.on('file-removed', onChange);

    return () => {
      socket.off('file-added', onChange);
      socket.off('file-changed', onChange);
      socket.off('file-removed', onChange);
      socket.close();
    };
  }, [activeProject]);

  // preview state
  const [previewPath, setPreviewPath] = useState<string | null>(null);

  // load children for a folder (lazy)
  const loadChildren = async (id: string) => {
    if (!activeProject) return;
    try {
      const res = await fetch(`/api/projects/${activeProject}/tree?dir=${encodeURIComponent(id)}`);
      const data = await res.json();
      const children: FileNode[] = data.tree || [];
      // set children into tree
      setTree(prev => setChildrenForNode(prev, id, children));
    } catch (e) {
      console.error('Failed to load children', e);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e] select-none overflow-hidden w-full">
      
      {/* Explorer Header */}
      <div className="px-4 py-3 flex items-center justify-between border-b border-white/5 bg-[#1e1e1e]">
        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Project Explorer</span>
        <MoreHorizontal size={14} className="text-zinc-500 hover:text-zinc-300 cursor-pointer" />
      </div>

      {/* Project Selector (Dropdown style) */}
      <div className="p-3 border-b border-white/5 bg-[#18181b]">
         <div className="flex items-center gap-2 mb-2 px-1">
             <Briefcase size={12} className="text-fuchsia-500" />
             <span className="text-xs font-semibold text-zinc-400">Active Workspace</span>
         </div>
         <div className="relative group">
            <button className="w-full flex items-center gap-3 p-2 bg-[#252526] hover:bg-zinc-800 border border-white/5 hover:border-zinc-600 rounded-lg transition-all text-left">
        <div className="w-8 h-8 rounded bg-gradient-to-br from-zinc-700 to-zinc-900 flex items-center justify-center shrink-0 border border-white/5 shadow-inner">
          <span className="text-xs font-bold text-zinc-300">{currentProject ? currentProject.name.substring(0,1) : '?'}</span>
        </div>
                <div className="flex-1 min-w-0">
          <div className="text-xs font-medium text-zinc-200 truncate">{currentProject ? currentProject.name : ''}</div>
          <div className="text-[10px] text-zinc-500 truncate">{currentProject ? currentProject.root : ''}</div>
                </div>
                <ChevronDown size={12} className="text-zinc-500" />
            </button>
            
            {/* Project List Dropdown (Simulated for this view, would be a real dropdown/modal in prod) */}
      <div className="hidden group-hover:block absolute top-full left-0 right-0 mt-1 bg-[#252526] border border-zinc-700 rounded-lg shadow-xl z-20 overflow-hidden">
        {projects.map(p => (
          <div 
            key={p.id}
            onClick={() => setActiveProject(p.id)} 
            className={`px-3 py-2 text-xs hover:bg-zinc-700 cursor-pointer flex justify-between ${activeProject === p.id ? 'text-fuchsia-400' : 'text-zinc-300'}`}
          >
            <span>{p.name}</span>
            {activeProject === p.id && <div className="w-1.5 h-1.5 rounded-full bg-fuchsia-500 my-auto"></div>}
          </div>
        ))}
      </div>
         </div>
      </div>

      {/* Search */}
      <div className="px-3 py-2">
        <div className="relative group">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-zinc-400 transition-colors" size={12} />
            <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search files..." 
                className="w-full bg-[#18181b] border border-white/5 rounded-md h-8 pl-8 pr-2 text-xs text-zinc-300 focus:outline-none focus:border-fuchsia-500/30 transition-all placeholder:text-zinc-600"
            />
        </div>
      </div>

      {/* File Tree */}
      <div className="flex-1 overflow-y-auto scrollbar-thin pt-1 pb-4">
        {tree.map(node => (
             <TreeNode 
                key={node.id} 
                node={node} 
                level={0} 
                activeId={activeFile} 
                onLoadChildren={loadChildren}
                onSelect={(id)=>{
                  setActiveFile(id);
                  const clicked = treeFindById(tree, id);
                  if (clicked && clicked.type === 'file') {
                    // show inline preview modal
                    setPreviewPath(clicked.id);
                  }
                }} 
            />
        ))}

        <PreviewModal open={!!previewPath} path={previewPath} onClose={()=>setPreviewPath(null)} />
        
        {/* Empty State / Drop Zone */}
        <div className="mt-4 mx-3 border border-dashed border-zinc-800 rounded-lg p-4 flex flex-col items-center justify-center text-center hover:border-zinc-700 hover:bg-white/5 transition-all cursor-pointer group">
            <Plus size={16} className="text-zinc-600 group-hover:text-zinc-400 mb-2" />
            <span className="text-[10px] text-zinc-500 group-hover:text-zinc-400">Add New Document</span>
        </div>
      </div>
      {/* Footer Stats */}
      <div className="h-8 bg-[#18181b] border-t border-white/5 flex items-center justify-between px-3 text-[9px] text-zinc-600">
          <span>{tree.length} items</span>
          <span className="font-mono">{currentProject ? currentProject.name : ''}</span>
      </div>
    </div>
  );
};

// Helper to find node by id in tree
function treeFindById(nodes: FileNode[], id: string | null): FileNode | null {
  if (!id) return null;
  for (const n of nodes) {
    if (n.id === id) return n;
    if (n.children) {
      const found = treeFindById(n.children, id);
      if (found) return found;
    }
  }
  return null;
}

// Helper to set children for a node (immutable update)
function setChildrenForNode(nodes: FileNode[], id: string, children: FileNode[]): FileNode[] {
  return nodes.map(n => {
    if (n.id === id) {
      return { ...n, children };
    }
    if (n.children) {
      return { ...n, children: setChildrenForNode(n.children, id, children) };
    }
    return n;
  });
}

export default LeftSidebar;
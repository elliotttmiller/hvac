import React, { useState } from 'react';
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

// Mock Data Structure for Projects
interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  fileType?: 'pdf' | 'dwg' | 'png' | 'json';
  children?: FileNode[];
}

interface Project {
  id: string;
  name: string;
  location: string;
  version: string;
  files: FileNode[];
}

const MOCK_PROJECTS: Project[] = [
  {
    id: 'p1',
    name: 'Acme Corp HQ',
    location: 'Tower Block A',
    version: 'v2.4',
    files: [
      {
        id: 'f1',
        name: 'Schematics',
        type: 'folder',
        children: [
          { id: 'doc1', name: 'Main_HVAC_L1.pdf', type: 'file', fileType: 'pdf' },
          { id: 'doc2', name: 'Electrical_Risers.dwg', type: 'file', fileType: 'dwg' },
        ]
      },
      {
        id: 'f2',
        name: 'Assets',
        type: 'folder',
        children: [
            { id: 'img1', name: 'Site_Survey_01.png', type: 'file', fileType: 'png' }
        ]
      },
      { id: 'doc3', name: 'Specs_Sheet.json', type: 'file', fileType: 'json' }
    ]
  },
  {
    id: 'p2',
    name: 'Stark Industries',
    location: 'Lab Complex B',
    version: 'v1.1',
    files: [
      { id: 'doc4', name: 'Clean_Room_Vent.pdf', type: 'file', fileType: 'pdf' }
    ]
  }
];

const FileIcon = ({ type }: { type?: string }) => {
  switch (type) {
    case 'pdf': return <FileText size={12} className="text-red-400" />;
    case 'dwg': return <Box size={12} className="text-blue-400" />;
    case 'png': return <ImageIcon size={12} className="text-emerald-400" />;
    case 'json': return <FileCode size={12} className="text-yellow-400" />;
    default: return <FileText size={12} className="text-zinc-500" />;
  }
};

const TreeNode = ({ node, level, activeId, onSelect }: { node: FileNode, level: number, activeId: string | null, onSelect: (id: string) => void }) => {
  const [isOpen, setIsOpen] = useState(true); // Default open for demo
  const isFolder = node.type === 'folder';
  
  return (
    <div>
      <div 
        className={`flex items-center gap-1.5 py-1 pr-2 rounded cursor-pointer transition-colors group ${
            activeId === node.id ? 'bg-fuchsia-500/10 text-fuchsia-100' : 'text-zinc-400 hover:bg-white/5 hover:text-zinc-200'
        }`}
        style={{ paddingLeft: `${level * 12 + 12}px` }}
        onClick={(e) => {
            e.stopPropagation();
            if (isFolder) setIsOpen(!isOpen);
            else onSelect(node.id);
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
            <Folder size={12} className={`${isOpen ? 'text-zinc-300' : 'text-zinc-500'} fill-zinc-500/10`} />
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

const LeftSidebar: React.FC = () => {
  const [activeProject, setActiveProject] = useState<string>(MOCK_PROJECTS[0].id);
  const [activeFile, setActiveFile] = useState<string | null>('doc1');
  const [searchQuery, setSearchQuery] = useState('');

  const currentProject = MOCK_PROJECTS.find(p => p.id === activeProject) || MOCK_PROJECTS[0];

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
                    <span className="text-xs font-bold text-zinc-300">{currentProject.name.substring(0,1)}</span>
                </div>
                <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-zinc-200 truncate">{currentProject.name}</div>
                    <div className="text-[10px] text-zinc-500 truncate">{currentProject.location}</div>
                </div>
                <ChevronDown size={12} className="text-zinc-500" />
            </button>
            
            {/* Project List Dropdown (Simulated for this view, would be a real dropdown/modal in prod) */}
            <div className="hidden group-hover:block absolute top-full left-0 right-0 mt-1 bg-[#252526] border border-zinc-700 rounded-lg shadow-xl z-20 overflow-hidden">
                {MOCK_PROJECTS.map(p => (
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
        {currentProject.files.map(node => (
             <TreeNode 
                key={node.id} 
                node={node} 
                level={0} 
                activeId={activeFile} 
                onSelect={setActiveFile} 
            />
        ))}
        
        {/* Empty State / Drop Zone */}
        <div className="mt-4 mx-3 border border-dashed border-zinc-800 rounded-lg p-4 flex flex-col items-center justify-center text-center hover:border-zinc-700 hover:bg-white/5 transition-all cursor-pointer group">
            <Plus size={16} className="text-zinc-600 group-hover:text-zinc-400 mb-2" />
            <span className="text-[10px] text-zinc-500 group-hover:text-zinc-400">Add New Document</span>
        </div>
      </div>

      {/* Footer Stats */}
      <div className="h-8 bg-[#18181b] border-t border-white/5 flex items-center justify-between px-3 text-[9px] text-zinc-600">
          <span>{currentProject.files.length} items</span>
          <span className="font-mono">{currentProject.version}</span>
      </div>
    </div>
  );
};

export default LeftSidebar;
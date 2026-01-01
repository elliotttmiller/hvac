import React from 'react';
import { X } from 'lucide-react';

interface Project { id: string; name: string; root: string }

interface Props {
  project: Project;
  onClose: () => void;
  onOpen?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const ProjectDetailModal: React.FC<Props> = ({ project, onClose, onOpen, onDelete }) => {
  const [confirming, setConfirming] = React.useState(false);
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pointer-events-none">
      <div className="mt-28 w-full max-w-xl pointer-events-auto bg-[#0b0b0b] border border-white/6 rounded shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-white/5">
          <div>
            <div className="text-sm font-semibold">{project.name}</div>
            <div className="text-[11px] text-zinc-500">{project.root}</div>
          </div>
          <div>
            <button onClick={onClose} className="w-8 h-8 rounded flex items-center justify-center bg-white/6 hover:bg-white/10">
              <X size={16} />
            </button>
          </div>
        </div>

        <div className="p-4">
          <h3 className="text-sm font-medium mb-2">Details</h3>
          <div className="text-xs text-zinc-400 mb-2">ID: <span className="font-mono text-[11px] text-zinc-300">{project.id}</span></div>
          <div className="text-xs text-zinc-400">Root: <span className="font-mono text-[11px] text-zinc-300">{project.root}</span></div>

          <div className="mt-4 flex items-center gap-2">
            <button onClick={() => { if (onOpen) onOpen(project.id); onClose(); }} className="px-3 py-1 rounded bg-cyan-600 text-white text-xs">Open in Explorer</button>
            <button onClick={() => { if (onOpen) onOpen(project.id); }} className="px-3 py-1 rounded bg-[#151515] border border-white/5 text-xs">View Tree</button>

            <div className="ml-auto">
              {!confirming ? (
                <button onClick={()=>setConfirming(true)} className="px-3 py-1 rounded bg-red-600 text-white text-xs">Delete</button>
              ) : (
                <span className="flex items-center gap-2">
                  <button onClick={() => { if (onDelete) onDelete(project.id); }} className="px-2 py-1 rounded bg-red-700 text-white text-xs">Confirm</button>
                  <button onClick={()=>setConfirming(false)} className="px-2 py-1 rounded bg-[#151515] border border-white/5 text-xs">Cancel</button>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailModal;

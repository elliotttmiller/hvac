import React, { useEffect } from 'react';
import Copilot from './Copilot';
import { X } from 'lucide-react';

interface Props {
  open: boolean;
  onClose: () => void;
}

const CopilotModal: React.FC<Props> = ({ open, onClose }) => {
  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = prev; };
    }
    return;
  }, [open]);

  if (!open) return null;

  // Right-side panel (seamless sidebar) — won't take over the full screen
  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Click-catcher backdrop (subtle) */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sidebar panel anchored to the right */}
      <aside
        role="dialog"
        aria-modal="true"
        className="relative ml-auto w-full max-w-md h-full bg-[#0b0b0b] border-l border-white/6 shadow-2xl overflow-hidden"
      >
        <div className="absolute left-3 top-3 z-20">
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-md bg-white/6 hover:bg-white/10 flex items-center justify-center text-zinc-200"
            aria-label="Close Copilot"
          >
            <X size={16} />
          </button>
        </div>

        <div className="h-full flex flex-col">
          <Copilot />
        </div>
      </aside>
    </div>
  );
};

export default CopilotModal;

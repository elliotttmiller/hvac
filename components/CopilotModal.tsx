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

  return (
    // Backdrop
    <div className="fixed inset-0 z-50 flex items-end justify-center pointer-events-none">
      {/* Subtle translucent background */}
      <div
        className="absolute inset-0 bg-white/10 backdrop-blur-sm transition-opacity pointer-events-auto"
        onClick={onClose}
      />

      {/* Panel - bottom-right floating style */}
      <div className="relative pointer-events-auto m-6 w-full max-w-xl h-[70vh] rounded-xl overflow-hidden shadow-2xl border border-white/10 bg-gray-100/20">
        {/* Close button */}
        <div className="absolute right-3 top-3 z-20">
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-md bg-white/6 hover:bg-white/10 flex items-center justify-center text-zinc-200"
            aria-label="Close Copilot"
          >
            <X size={16} />
          </button>
        </div>

        {/* Copilot content (keeps its internal styling) */}
        <div className="w-full h-full">
          <Copilot />
        </div>
      </div>
    </div>
  );
};

export default CopilotModal;

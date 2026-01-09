import React, { useEffect, useState } from 'react';
import { X, Scan } from 'lucide-react';

interface Props {
  path: string | null; // relative path from repo root
  open: boolean;
  onClose: () => void;
  onAnalyze?: (path: string) => void; // New callback for analysis
}

const PreviewModal: React.FC<Props> = ({ path, open, onClose, onAnalyze }) => {
  const [mime, setMime] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !path) return;
    // infer mime from extension
    const ext = path.split('.').pop()?.toLowerCase() || '';
    if (['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(ext)) setMime('image');
    else if (ext === 'pdf') setMime('pdf');
    else setMime('other');
  }, [open, path]);

  if (!open || !path) return null;

  const src = `/api/files/content?path=${encodeURIComponent(path)}`;
  const canAnalyze = mime === 'image' || mime === 'pdf';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="relative w-[85vw] max-w-5xl h-[85vh] bg-[#0b0b0b] rounded-lg shadow-2xl overflow-hidden">
        <div className="absolute right-3 top-3 z-20 flex gap-2">
          {canAnalyze && onAnalyze && (
            <button 
              onClick={() => {
                onAnalyze(path);
                onClose();
              }} 
              className="px-3 py-1.5 rounded-md bg-[#2563eb] hover:bg-[#2563eb]/90 flex items-center gap-2 text-zinc-100 text-sm font-medium transition-colors"
            >
              <Scan size={14} />
              Analyze
            </button>
          )}
          <button onClick={onClose} className="w-8 h-8 rounded-md bg-white/6 hover:bg-white/10 flex items-center justify-center text-zinc-200">
            <X size={16} />
          </button>
        </div>

        <div className="w-full h-full p-4 bg-[#0b0b0b]">
          {mime === 'image' && (
            <div className="w-full h-full flex items-center justify-center">
              <img src={src} alt={path} className="max-h-full max-w-full object-contain" />
            </div>
          )}

          {mime === 'pdf' && (
            <iframe src={src} className="w-full h-full border-0" title={path}></iframe>
          )}

          {mime === 'other' && (
            <div className="w-full h-full flex items-center justify-center text-zinc-400">
              <a href={src} target="_blank" rel="noreferrer" className="underline">Download / Open file</a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PreviewModal;

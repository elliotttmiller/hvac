import React from 'react';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    isDestructive?: boolean;
}

export const ConfirmationModal = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmLabel = "Confirm",
    cancelLabel = "Cancel",
    isDestructive = false
}: ConfirmationModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in">
            <div 
                className="absolute inset-0 bg-black/80 backdrop-blur-sm z-40 transition-opacity"
                onClick={onClose}
            ></div>
            
            <div className="relative z-50 w-full max-w-sm bg-[#121214] border border-[#27272a] rounded-xl shadow-2xl overflow-hidden p-6 ring-1 ring-white/10">
                <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
                <p className="text-sm text-gray-400 mb-6 leading-relaxed">{message}</p>
                
                <div className="flex justify-end gap-3">
                    <button 
                        onClick={onClose}
                        className="px-4 py-2 text-xs font-medium text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-[#18181b]"
                    >
                        {cancelLabel}
                    </button>
                    <button 
                        onClick={() => { onConfirm(); onClose(); }}
                        className={`px-4 py-2 text-xs font-bold text-white rounded-lg transition-all shadow-lg ${
                            isDestructive 
                            ? 'bg-rose-600 hover:bg-rose-500 shadow-rose-500/20' 
                            : 'bg-blue-600 hover:bg-blue-500 shadow-blue-500/20'
                        }`}
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
};
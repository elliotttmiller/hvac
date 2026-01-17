
import React, { useEffect, useState } from 'react';
import { Icons } from './Icons';

export type ToastType = 'success' | 'info' | 'error' | 'warning';

export interface ToastMsg {
    id: string;
    title: string;
    message: string;
    type: ToastType;
}

const ToastItem = ({ toast, onClose }: { toast: ToastMsg; onClose: (id: string) => void; key?: React.Key }) => {
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            handleClose();
        }, 5000);
        return () => clearTimeout(timer);
    }, []);

    const handleClose = () => {
        setIsExiting(true);
        setTimeout(() => {
            onClose(toast.id);
        }, 400); // Wait for exit animation
    };

    const styles = {
        success: {
            border: 'border-emerald-500/20',
            bg: 'bg-[#09090b]/95', 
            iconColor: 'text-emerald-500',
            iconBg: 'bg-emerald-500/10',
            icon: <Icons.CheckCircle width={14} height={14} />,
            progress: 'bg-emerald-500'
        },
        info: {
            border: 'border-blue-500/20',
            bg: 'bg-[#09090b]/95',
            iconColor: 'text-blue-500',
            iconBg: 'bg-blue-500/10',
            icon: <Icons.Activity width={14} height={14} />,
            progress: 'bg-blue-500'
        },
        error: {
            border: 'border-rose-500/20',
            bg: 'bg-[#09090b]/95',
            iconColor: 'text-rose-500',
            iconBg: 'bg-rose-500/10',
            icon: <Icons.AlertTriangle width={14} height={14} />,
            progress: 'bg-rose-500'
        },
        warning: {
            border: 'border-orange-500/20',
            bg: 'bg-[#09090b]/95',
            iconColor: 'text-orange-500',
            iconBg: 'bg-orange-500/10',
            icon: <Icons.AlertTriangle width={14} height={14} />,
            progress: 'bg-orange-500'
        }
    };

    const style = styles[toast.type];

    return (
        <div 
            className={`
                group relative w-[320px] rounded-lg border backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.5)] overflow-hidden
                ${style.border} ${style.bg}
                transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]
                ${isExiting 
                    ? 'opacity-0 translate-x-4 scale-95 mb-0 h-0 py-0' 
                    : 'opacity-100 translate-x-0 scale-100 animate-slide-in-right mb-3'
                }
            `}
            role="alert"
        >
            <div className="p-3 flex items-center gap-3">
                {/* Minimalist Icon Container */}
                <div className={`shrink-0 w-7 h-7 rounded-md ${style.iconBg} ${style.iconColor} flex items-center justify-center ring-1 ring-white/5`}>
                    {style.icon}
                </div>
                
                <div className="flex-1 min-w-0">
                    <h4 className="text-[12px] font-medium text-gray-200 leading-tight tracking-tight">{toast.title}</h4>
                </div>
                
                <button 
                    onClick={handleClose}
                    className="shrink-0 p-1 text-gray-600 hover:text-gray-300 transition-colors rounded-md hover:bg-white/5"
                >
                    <Icons.X width={12} height={12} />
                </button>
            </div>
            
            {/* Subtle Progress Line at bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-gray-800/50">
                <div 
                    className={`h-full ${style.progress} opacity-60`}
                    style={{ animation: `shrink 5s linear forwards` }}
                ></div>
            </div>

            <style>{`
                @keyframes shrink {
                    from { width: 100%; }
                    to { width: 0%; }
                }
                @keyframes slide-in-right {
                    from { opacity: 0; transform: translateX(20px) scale(0.98); }
                    to { opacity: 1; transform: translateX(0) scale(1); }
                }
                .animate-slide-in-right {
                    animation: slide-in-right 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                }
            `}</style>
        </div>
    );
};

export const ToastContainer = ({ toasts, removeToast }: { toasts: ToastMsg[]; removeToast: (id: string) => void }) => {
    return (
        <div className="fixed top-6 right-6 z-[100] flex flex-col items-end pointer-events-none">
            <div className="pointer-events-auto flex flex-col items-end">
                {toasts.map(toast => (
                    <ToastItem key={toast.id} toast={toast} onClose={removeToast} />
                ))}
            </div>
        </div>
    );
};

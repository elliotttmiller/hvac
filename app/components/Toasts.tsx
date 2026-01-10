import React, { useEffect, useState } from 'react';
import { Icons } from './Icons';

export type ToastType = 'success' | 'info' | 'error' | 'warning';

export interface ToastMsg {
    id: string;
    title: string;
    message: string;
    type: ToastType;
}

const ToastItem = ({ toast, onClose }: { toast: ToastMsg; onClose: (id: string) => void }) => {
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
        }, 300); // Match animation duration
    };

    const styles = {
        success: {
            border: 'border-emerald-500/30',
            bg: 'bg-emerald-500/10',
            iconColor: 'text-emerald-400',
            icon: <Icons.CheckCircle width={18} height={18} />,
            bar: 'bg-emerald-500'
        },
        info: {
            border: 'border-blue-500/30',
            bg: 'bg-blue-500/10',
            iconColor: 'text-blue-400',
            icon: <Icons.Activity width={18} height={18} />,
            bar: 'bg-blue-500'
        },
        error: {
            border: 'border-rose-500/30',
            bg: 'bg-rose-500/10',
            iconColor: 'text-rose-400',
            icon: <Icons.AlertTriangle width={18} height={18} />,
            bar: 'bg-rose-500'
        },
        warning: {
            border: 'border-amber-500/30',
            bg: 'bg-amber-500/10',
            iconColor: 'text-amber-400',
            icon: <Icons.AlertTriangle width={18} height={18} />,
            bar: 'bg-amber-500'
        }
    };

    const style = styles[toast.type];

    return (
        <div 
            className={`
                relative w-80 rounded-lg border backdrop-blur-md shadow-2xl overflow-hidden mb-3 transition-all duration-300 ease-in-out
                ${style.border} ${style.bg}
                ${isExiting ? 'opacity-0 translate-x-full' : 'opacity-100 translate-x-0 animate-fade-in-left'}
            `}
            role="alert"
        >
            <div className={`absolute left-0 top-0 bottom-0 w-1 ${style.bar}`}></div>
            <div className="p-4 pl-5 flex items-start gap-3">
                <div className={`mt-0.5 shrink-0 ${style.iconColor}`}>
                    {style.icon}
                </div>
                <div className="flex-1 min-w-0">
                    <h4 className={`text-sm font-semibold mb-0.5 ${style.iconColor}`}>{toast.title}</h4>
                    <p className="text-xs text-gray-300 leading-relaxed">{toast.message}</p>
                </div>
                <button 
                    onClick={handleClose}
                    className="shrink-0 text-gray-500 hover:text-white transition-colors"
                >
                    <Icons.X width={14} height={14} />
                </button>
            </div>
            {/* Progress bar animation */}
            <div className="absolute bottom-0 left-1 right-0 h-[2px] bg-gray-700/30">
                <div 
                    className={`h-full ${style.bar} opacity-50`}
                    style={{ animation: `shrink 5s linear forwards` }}
                ></div>
            </div>
            <style>{`
                @keyframes shrink {
                    from { width: 100%; }
                    to { width: 0%; }
                }
                @keyframes fade-in-left {
                    from { opacity: 0; transform: translateX(20px); }
                    to { opacity: 1; transform: translateX(0); }
                }
            `}</style>
        </div>
    );
};

export const ToastContainer = ({ toasts, removeToast }: { toasts: ToastMsg[]; removeToast: (id: string) => void }) => {
    return (
        <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end pointer-events-none">
            <div className="pointer-events-auto">
                {toasts.map(toast => (
                    <ToastItem key={toast.id} toast={toast} onClose={removeToast} />
                ))}
            </div>
        </div>
    );
};
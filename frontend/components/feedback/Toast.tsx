/**
 * Toast Notification Component
 * Lightweight toast notifications with glass pill design
 * Supports click handlers and auto-dismiss
 */

import React, { useEffect, useState } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'info' | 'warning' | 'error';

export interface ToastProps {
  id: string;
  type?: ToastType;
  title: string;
  message?: string;
  duration?: number; // milliseconds, 0 = no auto-dismiss
  onClick?: () => void;
  onClose?: () => void;
  clickable?: boolean;
}

const TYPE_CONFIG = {
  success: {
    icon: CheckCircle,
    color: '#10b981', // green-500
    bgColor: 'rgba(16, 185, 129, 0.1)',
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  info: {
    icon: Info,
    color: '#06b6d4', // cyan-500
    bgColor: 'rgba(6, 182, 212, 0.1)',
    borderColor: 'rgba(6, 182, 212, 0.3)',
  },
  warning: {
    icon: AlertCircle,
    color: '#f59e0b', // amber-500
    bgColor: 'rgba(245, 158, 11, 0.1)',
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  error: {
    icon: AlertCircle,
    color: '#ef4444', // red-500
    bgColor: 'rgba(239, 68, 68, 0.1)',
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
};

export const Toast: React.FC<ToastProps> = ({
  type = 'info',
  title,
  message,
  duration = 5000,
  onClick,
  onClose,
  clickable = false,
}) => {
  const [isExiting, setIsExiting] = useState(false);
  
  const config = TYPE_CONFIG[type];
  const Icon = config.icon;
  
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [duration]);
  
  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose?.();
    }, 300);
  };
  
  const handleClick = () => {
    if (onClick) {
      onClick();
      handleClose();
    }
  };
  
  return (
    <div
      style={{
        backgroundColor: 'rgba(24, 24, 27, 0.9)',
        backdropFilter: 'blur(12px)',
        border: `1px solid ${config.borderColor}`,
        borderRadius: '12px',
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
        minWidth: '280px',
        maxWidth: '400px',
        cursor: clickable || onClick ? 'pointer' : 'default',
        animation: isExiting ? 'slideOutRight 0.3s ease-out forwards' : 'slideInRight 0.3s ease-out',
        transition: 'transform 0.2s ease',
      }}
      onClick={clickable || onClick ? handleClick : undefined}
      onMouseEnter={(e) => {
        if (clickable || onClick) {
          e.currentTarget.style.transform = 'scale(1.02)';
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
      }}
    >
      {/* Icon */}
      <div style={{ flexShrink: 0 }}>
        <Icon 
          size={20} 
          color={config.color}
          style={{ strokeWidth: 2 }}
        />
      </div>
      
      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: '14px',
          fontWeight: '600',
          color: '#f4f4f5',
          marginBottom: message ? '4px' : 0,
        }}>
          {title}
        </div>
        {message && (
          <div style={{
            fontSize: '13px',
            color: '#a1a1aa',
            lineHeight: '1.4',
          }}>
            {message}
          </div>
        )}
      </div>
      
      {/* Close button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleClose();
        }}
        style={{
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          padding: '2px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '4px',
          transition: 'background-color 0.2s',
          flexShrink: 0,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
        }}
      >
        <X size={16} color="#71717a" />
      </button>
    </div>
  );
};

/**
 * Toast Container Component
 * Manages multiple toasts in a stack
 */
export interface ToastContainerProps {
  toasts: ToastProps[];
  onRemove: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onRemove }) => {
  if (toasts.length === 0) return null;
  
  return (
    <>
      <div style={{
        position: 'fixed',
        top: '80px',
        right: '20px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        pointerEvents: 'none',
      }}>
        {toasts.map((toast) => (
          <div key={toast.id} style={{ pointerEvents: 'auto' }}>
            <Toast
              {...toast}
              onClose={() => onRemove(toast.id)}
            />
          </div>
        ))}
      </div>
      
      <style>{`
        @keyframes slideInRight {
          from { 
            opacity: 0;
            transform: translateX(100px);
          }
          to { 
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes slideOutRight {
          from { 
            opacity: 1;
            transform: translateX(0);
          }
          to { 
            opacity: 0;
            transform: translateX(100px);
          }
        }
      `}</style>
    </>
  );
};

export default Toast;

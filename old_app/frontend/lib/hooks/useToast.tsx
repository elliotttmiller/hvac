/**
 * Toast Context and Hook
 * Provides a global toast notification system
 */

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { ToastContainer, ToastProps } from '../../components/feedback/Toast';

interface ToastContextValue {
  showToast: (toast: Omit<ToastProps, 'id' | 'onClose'>) => string;
  removeToast: (id: string) => void;
  clearAllToasts: () => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

let toastIdCounter = 0;
const generateToastId = () => `toast-${++toastIdCounter}-${Date.now()}`;

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastProps[]>([]);
  
  const showToast = useCallback((toast: Omit<ToastProps, 'id' | 'onClose'>) => {
    const id = generateToastId();
    const newToast: ToastProps = {
      ...toast,
      id,
    };
    
    setToasts((prev) => [...prev, newToast]);
    return id;
  }, []);
  
  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);
  
  const clearAllToasts = useCallback(() => {
    setToasts([]);
  }, []);
  
  return (
    <ToastContext.Provider value={{ showToast, removeToast, clearAllToasts }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

/**
 * Convenience hooks for common toast types
 */
export const useToastHelpers = () => {
  const { showToast } = useToast();
  
  return {
    success: (title: string, message?: string, options?: Partial<Omit<ToastProps, 'id' | 'type' | 'title' | 'message'>>) =>
      showToast({ type: 'success', title, message, ...options }),
    
    info: (title: string, message?: string, options?: Partial<Omit<ToastProps, 'id' | 'type' | 'title' | 'message'>>) =>
      showToast({ type: 'info', title, message, ...options }),
    
    warning: (title: string, message?: string, options?: Partial<Omit<ToastProps, 'id' | 'type' | 'title' | 'message'>>) =>
      showToast({ type: 'warning', title, message, ...options }),
    
    error: (title: string, message?: string, options?: Partial<Omit<ToastProps, 'id' | 'type' | 'title' | 'message'>>) =>
      showToast({ type: 'error', title, message, ...options }),
  };
};

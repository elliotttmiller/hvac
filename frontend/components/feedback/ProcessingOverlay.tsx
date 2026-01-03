/**
 * ProcessingOverlay Component
 * Non-intrusive floating status indicator with glass pill design
 * Shows progress through: Uploading -> Classifying -> Analyzing -> Refining
 */

import React, { useEffect, useState } from 'react';

export type ProcessingPhase = 'uploading' | 'classifying' | 'analyzing' | 'refining' | 'complete';

export interface ProcessingOverlayProps {
  isOpen: boolean;
  phase?: ProcessingPhase;
  progress?: number; // 0-100
  message?: string;
  onClose?: () => void;
}

const PHASE_CONFIG = {
  uploading: {
    label: 'Uploading',
    description: 'Preparing document...',
  },
  classifying: {
    label: 'Classifying',
    description: 'Identifying document type...',
  },
  analyzing: {
    label: 'Analyzing',
    description: 'Extracting components...',
  },
  refining: {
    label: 'Refining',
    description: 'Validating results...',
  },
  complete: {
    label: 'Complete',
    description: 'Analysis finished',
  }
};

/**
 * ProcessingOverlay as a floating glass pill indicator
 */
export const ProcessingOverlay: React.FC<ProcessingOverlayProps> = ({
  isOpen,
  phase = 'uploading',
  progress = 0,
  message,
  onClose
}) => {
  const [displayPhase, setDisplayPhase] = useState<ProcessingPhase>(phase);
  
  useEffect(() => {
    if (phase) {
      setDisplayPhase(phase);
    }
  }, [phase]);
  
  if (!isOpen) return null;
  
  const config = PHASE_CONFIG[displayPhase];
  
  return (
    <div style={{
      position: 'absolute',
      top: '20px',
      right: '20px',
      zIndex: 50,
      animation: 'slideInRight 0.3s ease-out'
    }}>
      <div style={{
        backgroundColor: 'rgba(24, 24, 27, 0.8)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '9999px',
        padding: '12px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
        minWidth: '200px'
      }}>
        {/* Spinner */}
        <div style={{
          width: '16px',
          height: '16px',
          border: '2px solid rgba(6, 182, 212, 0.3)',
          borderTopColor: '#06b6d4',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }} />
        
        {/* Text */}
        <div style={{ flex: 1 }}>
          <div style={{
            fontSize: '13px',
            fontWeight: '500',
            color: '#f4f4f5',
            marginBottom: '2px'
          }}>
            {message || config.description}
          </div>
          {progress > 0 && (
            <div style={{
              fontSize: '11px',
              color: '#71717a',
              fontFamily: 'monospace'
            }}>
              {Math.round(progress)}%
            </div>
          )}
        </div>
      </div>
      
      <style>{`
        @keyframes slideInRight {
          from { 
            opacity: 0;
            transform: translateX(20px);
          }
          to { 
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default ProcessingOverlay;

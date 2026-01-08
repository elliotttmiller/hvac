/**
 * ProcessingOverlay Component
 * Displays processing status with two modes:
 * - Badge mode: Small floating pill in top-right (for uploading, classifying, refining)
 * - Center overlay mode: Full-screen blur with centered spinner (for analyzing/extracting components)
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
 * ProcessingOverlay with dual modes
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
  
  // Use center overlay mode for analyzing phase (extracting components)
  const useCenterMode = displayPhase === 'analyzing';
  
  if (useCenterMode) {
    return (
      <div style={{
        position: 'absolute',
        inset: '0',
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        animation: 'fadeIn 0.3s ease-out',
        pointerEvents: 'none'
      }}>
        {/* Backdrop blur overlay */}
        <div style={{
          position: 'absolute',
          inset: '0',
          backdropFilter: 'blur(8px)',
          backgroundColor: 'rgba(18, 18, 18, 0.4)'
        }} />
        
        {/* Center content */}
        <div style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px',
          animation: 'scaleIn 0.4s ease-out'
        }}>
          {/* Animated spinner with rings */}
          <div style={{
            position: 'relative',
            width: '80px',
            height: '80px'
          }}>
            {/* Outer ring */}
            <div style={{
              position: 'absolute',
              inset: '0',
              border: '3px solid rgba(6, 182, 212, 0.2)',
              borderRadius: '50%',
              animation: 'pulse 2s ease-in-out infinite'
            }} />
            {/* Middle spinning ring */}
            <div style={{
              position: 'absolute',
              inset: '8px',
              border: '3px solid transparent',
              borderTopColor: '#06b6d4',
              borderRightColor: '#06b6d4',
              borderRadius: '50%',
              animation: 'spin 1.2s linear infinite'
            }} />
            {/* Inner spinning ring */}
            <div style={{
              position: 'absolute',
              inset: '16px',
              border: '2px solid transparent',
              borderTopColor: '#22d3ee',
              borderRadius: '50%',
              animation: 'spinReverse 0.8s linear infinite'
            }} />
            {/* Center dot */}
            <div style={{
              position: 'absolute',
              inset: '32px',
              backgroundColor: '#06b6d4',
              borderRadius: '50%',
              animation: 'glow 1.5s ease-in-out infinite'
            }} />
          </div>
          
          {/* Text content */}
          <div style={{
            textAlign: 'center',
            maxWidth: '320px'
          }}>
            <div style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#f4f4f5',
              marginBottom: '8px',
              textShadow: '0 2px 8px rgba(0, 0, 0, 0.5)',
              letterSpacing: '0.025em'
            }}>
              {message || config.description}
            </div>
            {progress > 0 && (
              <div style={{
                fontSize: '14px',
                color: '#06b6d4',
                fontFamily: 'monospace',
                fontWeight: '500'
              }}>
                {Math.round(progress)}%
              </div>
            )}
          </div>
        </div>
        
        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes scaleIn {
            from { 
              opacity: 0;
              transform: scale(0.9);
            }
            to { 
              opacity: 1;
              transform: scale(1);
            }
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          @keyframes spinReverse {
            to { transform: rotate(-360deg); }
          }
          @keyframes pulse {
            0%, 100% { 
              opacity: 1;
              transform: scale(1);
            }
            50% { 
              opacity: 0.6;
              transform: scale(1.05);
            }
          }
          @keyframes glow {
            0%, 100% { 
              opacity: 1;
              box-shadow: 0 0 10px rgba(6, 182, 212, 0.5);
            }
            50% { 
              opacity: 0.8;
              box-shadow: 0 0 20px rgba(6, 182, 212, 0.8);
            }
          }
        `}</style>
      </div>
    );
  }
  
  // Badge mode for other phases
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

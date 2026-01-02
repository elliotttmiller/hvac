/**
 * ProcessingOverlay Component
 * Multi-step processing overlay with modern glass/clean theme
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
    description: 'Preparing document for analysis...',
    icon: '📤',
    color: '#3B82F6'
  },
  classifying: {
    label: 'Classifying',
    description: 'Identifying document type...',
    icon: '🏷️',
    color: '#8B5CF6'
  },
  analyzing: {
    label: 'Analyzing',
    description: 'Extracting components and connections...',
    icon: '🔍',
    color: '#10B981'
  },
  refining: {
    label: 'Refining',
    description: 'Validating results and generating insights...',
    icon: '✨',
    color: '#F59E0B'
  },
  complete: {
    label: 'Complete',
    description: 'Analysis finished successfully',
    icon: '✅',
    color: '#10B981'
  }
};

/**
 * ProcessingOverlay with multi-step progress display
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
  const phases: ProcessingPhase[] = ['uploading', 'classifying', 'analyzing', 'refining'];
  const currentPhaseIndex = phases.indexOf(displayPhase);
  
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
      backdropFilter: 'blur(8px)',
      animation: 'fadeIn 0.2s ease-out'
    }}>
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        padding: '32px',
        maxWidth: '480px',
        width: '90%',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        animation: 'slideUp 0.3s ease-out'
      }}>
        {/* Header */}
        <div style={{ 
          textAlign: 'center', 
          marginBottom: '24px'
        }}>
          <div style={{ 
            fontSize: '48px',
            marginBottom: '16px',
            animation: 'pulse 2s ease-in-out infinite'
          }}>
            {config.icon}
          </div>
          <h2 style={{ 
            margin: '0 0 8px 0',
            fontSize: '20px',
            fontWeight: '600',
            color: '#111827'
          }}>
            {config.label}
          </h2>
          <p style={{ 
            margin: 0,
            fontSize: '14px',
            color: '#6B7280'
          }}>
            {message || config.description}
          </p>
        </div>
        
        {/* Progress Bar */}
        <div style={{
          width: '100%',
          height: '8px',
          backgroundColor: '#F3F4F6',
          borderRadius: '9999px',
          overflow: 'hidden',
          marginBottom: '24px'
        }}>
          <div style={{
            height: '100%',
            backgroundColor: config.color,
            borderRadius: '9999px',
            width: `${progress}%`,
            transition: 'width 0.3s ease-out',
            boxShadow: `0 0 10px ${config.color}40`
          }} />
        </div>
        
        {/* Phase Steps */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: '8px'
        }}>
          {phases.map((p, idx) => {
            const phaseConfig = PHASE_CONFIG[p];
            const isActive = idx === currentPhaseIndex;
            const isComplete = idx < currentPhaseIndex;
            
            return (
              <div
                key={p}
                style={{
                  flex: 1,
                  textAlign: 'center'
                }}
              >
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  margin: '0 auto 8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px',
                  backgroundColor: isComplete ? phaseConfig.color : isActive ? `${phaseConfig.color}20` : '#F3F4F6',
                  border: isActive ? `2px solid ${phaseConfig.color}` : 'none',
                  transition: 'all 0.3s ease',
                  boxShadow: isActive ? `0 0 0 4px ${phaseConfig.color}20` : 'none'
                }}>
                  {isComplete ? '✓' : phaseConfig.icon}
                </div>
                <div style={{
                  fontSize: '11px',
                  fontWeight: isActive ? '600' : '400',
                  color: isActive ? phaseConfig.color : isComplete ? '#374151' : '#9CA3AF',
                  transition: 'all 0.3s ease'
                }}>
                  {phaseConfig.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
};

export default ProcessingOverlay;

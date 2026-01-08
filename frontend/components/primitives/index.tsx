/**
 * Basic UI Primitives
 * Reusable button, card, and input components
 */

import React from 'react';

// ============================================================================
// Button
// ============================================================================

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'xs' | 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  children,
  style,
  ...props
}) => {
  // Prefer Tailwind classes for consistent theming. Use the requested accent
  // color (#2563eb) for the primary variant as an arbitrary class.
  // Modern, subtle button styles (inspired by shadcn/ui):
  const variantClasses: Record<string, string> = {
    primary: 'bg-gradient-to-b from-emerald-500 to-emerald-600 text-white shadow-sm hover:from-emerald-400 hover:to-emerald-500 border border-transparent',
    secondary: 'bg-zinc-900/70 text-zinc-200 border border-white/6 hover:bg-zinc-900',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  };

  const sizeClasses: Record<string, string> = {
    xs: 'px-2 py-1 text-[11px] rounded-md',
    sm: 'px-2.5 py-1.5 text-sm rounded-md',
    md: 'px-3 py-2 text-sm rounded-lg',
    lg: 'px-4 py-2.5 text-base rounded-lg',
  };

  const disabled = Boolean((props as any).disabled);
  const disabledClass = disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'cursor-pointer';
  const className = `${variantClasses[variant] || variantClasses.primary} ${sizeClasses[size] || sizeClasses.md} inline-flex items-center justify-center font-semibold transition transform-gpu ${disabledClass} ${(props as any).className || ''}`.trim();

  // Keep inline style support for callers that pass explicit styles.
  return (
    <button
      className={className}
      style={style}
      {...props}
    >
      {children}
    </button>
  );
};

// ============================================================================
// Card
// ============================================================================

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  title?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, title, style, onClick, ...props }) => {
  return (
    <div
      onClick={onClick}
      style={{
        backgroundColor: '#fff',
        borderRadius: '8px',
        /* remove inline boxShadow so consumers can control hover shadow via CSS/Tailwind */
        padding: '16px',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'box-shadow 0.2s, transform 0.15s',
        ...style,
      }}
      {...props}
    >
      {title && (
        <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: '600' }}>
          {title}
        </h3>
      )}
      {children}
    </div>
  );
};

// ============================================================================
// DashboardCard - visual card that matches the Dashboard's glow/hover styling
// ============================================================================
export interface DashboardCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export const DashboardCard: React.FC<DashboardCardProps> = ({ children, size = 'md', className = '', onClick, ...props }) => {
  // Mirror the Dashboard card visuals: subtle translucent bg, backdrop blur,
  // border, rounded corners, gentle hover background, and group hover transitions.
  const padding = size === 'sm' ? 'p-4' : size === 'lg' ? 'p-6' : 'p-4';
  const base = `bg-zinc-900/60 backdrop-blur-sm border border-zinc-800 rounded-xl ${padding} transition-all duration-200 group hover:bg-zinc-900/80 cursor-pointer`;

  return (
    <div onClick={onClick} className={`${base} ${className}`} {...props}>
      {children}
    </div>
  );
};

// ============================================================================
// StatusBadge
// ============================================================================
import { normalizeStatus } from '../../lib/types/project';

export interface StatusBadgeProps {
  status?: string | null;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  const s = normalizeStatus(status || undefined);

  let classes = 'text-sm font-medium px-2 py-0.5 rounded';
  let label = status || '';

  if (!s) {
    classes += ' text-zinc-300 bg-zinc-800/40 border border-zinc-700';
    label = 'Not Started';
  } else if (['not yet started', 'not_started', 'notstarted', 'pending', 'idle', 'queued'].includes(s)) {
    classes += ' text-zinc-400 bg-zinc-800/40 border border-zinc-700';
    label = 'Not Yet Started';
  } else if (['in progress', 'in_progress', 'work in progress', 'work_in_progress', 'active', 'running'].includes(s)) {
    classes += ' text-[#2563eb] bg-[#2563eb]/10 border border-[#2563eb]/20';
    label = 'In Progress';
  } else if (['delayed', 'warning', 'stalled'].includes(s)) {
    classes += ' text-[#f59e0b] bg-[#f59e0b]/10 border border-[#f59e0b]/20';
    label = 'Delayed';
  } else if (['complete', 'completed', 'done', 'finished'].includes(s)) {
    classes += ' text-[#10b981] bg-[#10b981]/10 border border-[#10b981]/20';
    label = 'Completed';
  } else if (s === 'closed') {
    classes += ' text-[#ef4444] bg-[#ef4444]/10 border border-[#ef4444]/20';
    label = 'Closed';
  } else {
    // Fallback
    classes += ' text-zinc-300 bg-zinc-800 hover:bg-zinc-700 border border-transparent';
    label = status || label;
  }

  return (
    <span className={`${classes} ${className}`}>{label}</span>
  );
};

// ============================================================================
// Input
// ============================================================================

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, style, ...props }) => {
  return (
    <div style={{ marginBottom: '16px' }}>
      {label && (
        <label style={{ 
          display: 'block', 
          marginBottom: '4px', 
          fontSize: '14px', 
          fontWeight: '600',
          color: '#333',
        }}>
          {label}
        </label>
      )}
      <input
        style={{
          width: '100%',
          padding: '8px 12px',
          border: `1px solid ${error ? '#F44336' : '#e0e0e0'}`,
          borderRadius: '4px',
          fontSize: '14px',
          transition: 'border-color 0.2s',
          boxSizing: 'border-box',
          ...style,
        }}
        {...props}
      />
      {error && (
        <div style={{ 
          marginTop: '4px', 
          fontSize: '12px', 
          color: '#F44336' 
        }}>
          {error}
        </div>
      )}
    </div>
  );
};

// ============================================================================
// Modal
// ============================================================================

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
}) => {
  if (!isOpen) return null;
  
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          backgroundColor: '#fff',
          borderRadius: '8px',
          maxWidth: '600px',
          maxHeight: '90vh',
          overflow: 'auto',
          boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
        }}
      >
        {title && (
          <div style={{
            padding: '16px 24px',
            borderBottom: '1px solid #e0e0e0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '600' }}>
              {title}
            </h2>
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                color: '#999',
              }}
            >
              ×
            </button>
          </div>
        )}
        <div style={{ padding: '24px' }}>
          {children}
        </div>
        {footer && (
          <div style={{
            padding: '16px 24px',
            borderTop: '1px solid #e0e0e0',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '8px',
          }}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// Table
// ============================================================================

export interface TableProps {
  headers: string[];
  rows: any[][];
  onRowClick?: (row: any[], index: number) => void;
}

export const Table: React.FC<TableProps> = ({ headers, rows, onRowClick }) => {
  return (
    <table style={{
      width: '100%',
      borderCollapse: 'collapse',
      fontSize: '14px',
    }}>
      <thead>
        <tr style={{ backgroundColor: '#f5f5f5' }}>
          {headers.map((header, i) => (
            <th
              key={i}
              style={{
                padding: '12px',
                textAlign: 'left',
                fontWeight: '600',
                borderBottom: '2px solid #e0e0e0',
              }}
            >
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr
            key={i}
            onClick={() => onRowClick?.(row, i)}
            style={{
              cursor: onRowClick ? 'pointer' : 'default',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={e => {
              if (onRowClick) {
                e.currentTarget.style.backgroundColor = '#f5f5f5';
              }
            }}
            onMouseLeave={e => {
              if (onRowClick) {
                e.currentTarget.style.backgroundColor = 'transparent';
              }
            }}
          >
            {row.map((cell, j) => (
              <td
                key={j}
                style={{
                  padding: '12px',
                  borderBottom: '1px solid #f0f0f0',
                }}
              >
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

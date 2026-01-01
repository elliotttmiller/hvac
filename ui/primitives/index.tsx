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
  size?: 'small' | 'medium' | 'large';
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  children,
  style,
  ...props
}) => {
  const variants = {
    primary: { backgroundColor: '#2196F3', color: '#fff' },
    secondary: { backgroundColor: '#f5f5f5', color: '#333' },
    danger: { backgroundColor: '#F44336', color: '#fff' },
  };
  
  const sizes = {
    small: { padding: '6px 12px', fontSize: '12px' },
    medium: { padding: '8px 16px', fontSize: '14px' },
    large: { padding: '12px 24px', fontSize: '16px' },
  };
  
  return (
    <button
      style={{
        ...variants[variant],
        ...sizes[size],
        border: 'none',
        borderRadius: '4px',
        cursor: props.disabled ? 'not-allowed' : 'pointer',
        opacity: props.disabled ? 0.5 : 1,
        fontWeight: '600',
        transition: 'all 0.2s',
        ...style,
      }}
      {...props}
    >
      {children}
    </button>
  );
};

// ============================================================================
// Card
// ============================================================================

export interface CardProps {
  children: React.ReactNode;
  title?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, title, style, onClick }) => {
  return (
    <div
      onClick={onClick}
      style={{
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        padding: '16px',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'box-shadow 0.2s',
        ...style,
      }}
      onMouseEnter={e => {
        if (onClick) {
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
        }
      }}
      onMouseLeave={e => {
        if (onClick) {
          e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
        }
      }}
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

/**
 * Canvas Overlay Component
 * Renders bounding boxes and annotations on top of images
 * Uses normalized 0-1 coordinates that scale to viewport
 */

import React, { useRef, useEffect, useState } from 'react';
import { DetectedComponent, Connection } from '../../features/document-analysis/types';

export interface CanvasOverlayProps {
  imageUrl: string;
  components?: DetectedComponent[];
  connections?: Connection[];
  selectedComponent?: string | null;
  onComponentClick?: (component: DetectedComponent) => void;
  showLabels?: boolean;
  showBoundingBoxes?: boolean;
  showConnections?: boolean;
}

/**
 * Canvas Overlay Component
 * Handles normalized 0-1 coordinates and scales to current viewport size
 */
export const CanvasOverlay: React.FC<CanvasOverlayProps> = ({
  imageUrl,
  components = [],
  connections = [],
  selectedComponent = null,
  onComponentClick,
  showLabels = true,
  showBoundingBoxes = true,
  showConnections = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  const [scale, setScale] = useState({ x: 1, y: 1 });
  
  // Update scale when image loads
  useEffect(() => {
    const img = imageRef.current;
    if (!img) return;
    
    const handleLoad = () => {
      const naturalWidth = img.naturalWidth;
      const naturalHeight = img.naturalHeight;
      const displayWidth = img.clientWidth;
      const displayHeight = img.clientHeight;
      
      setImageDimensions({ width: displayWidth, height: displayHeight });
      setScale({
        x: displayWidth,
        y: displayHeight,
      });
    };
    
    if (img.complete) {
      handleLoad();
    } else {
      img.addEventListener('load', handleLoad);
      return () => img.removeEventListener('load', handleLoad);
    }
  }, [imageUrl]);
  
  // Draw overlays on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    const img = imageRef.current;
    
    if (!canvas || !img || scale.x <= 0) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas size to match image display size
    canvas.width = imageDimensions.width;
    canvas.height = imageDimensions.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw connections first (under components)
    if (showConnections && connections.length > 0) {
      drawConnections(ctx, connections, components, scale);
    }
    
    // Draw component bounding boxes
    if (showBoundingBoxes && components.length > 0) {
      drawComponents(ctx, components, scale, selectedComponent);
    }
    
    // Draw labels
    if (showLabels && components.length > 0) {
      drawLabels(ctx, components, scale);
    }
  }, [components, connections, imageDimensions, scale, selectedComponent, showLabels, showBoundingBoxes, showConnections]);
  
  // Handle component clicks
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!onComponentClick || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / scale.x;
    const y = (e.clientY - rect.top) / scale.y;
    
    // Find clicked component
    for (const component of components) {
      const [x1, y1, x2, y2] = component.bbox;
      if (x >= x1 && x <= x2 && y >= y1 && y <= y2) {
        onComponentClick(component);
        break;
      }
    }
  };
  
  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%', height: '100%' }}>
      <img
        ref={imageRef}
        src={imageUrl}
        alt="Blueprint"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          display: 'block',
        }}
      />
      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          cursor: onComponentClick ? 'pointer' : 'default',
        }}
      />
    </div>
  );
};

/**
 * Draw component bounding boxes
 */
function drawComponents(
  ctx: CanvasRenderingContext2D,
  components: DetectedComponent[],
  scale: { x: number; y: number },
  selectedId: string | null
) {
  components.forEach(component => {
    const [x1, y1, x2, y2] = component.bbox;
    const x = x1 * scale.x;
    const y = y1 * scale.y;
    const width = (x2 - x1) * scale.x;
    const height = (y2 - y1) * scale.y;
    
    // Determine color based on component type
    const color = getComponentColor(component.type);
    const isSelected = component.id === selectedId;
    
    // Draw bounding box
    ctx.strokeStyle = isSelected ? '#FFD700' : color;
    ctx.lineWidth = isSelected ? 3 : 2;
    ctx.strokeRect(x, y, width, height);
    
    // Fill with semi-transparent color
    ctx.fillStyle = isSelected ? 'rgba(255, 215, 0, 0.1)' : `${color}20`;
    ctx.fillRect(x, y, width, height);
  });
}

/**
 * Draw component labels
 */
function drawLabels(
  ctx: CanvasRenderingContext2D,
  components: DetectedComponent[],
  scale: { x: number; y: number }
) {
  ctx.font = '12px Arial';
  ctx.textBaseline = 'top';
  
  components.forEach(component => {
    if (!component.label) return;
    
    const [x1, y1] = component.bbox;
    const x = x1 * scale.x;
    const y = y1 * scale.y - 18; // Position above box
    
    // Draw background
    const metrics = ctx.measureText(component.label);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(x, y, metrics.width + 8, 16);
    
    // Draw text
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(component.label, x + 4, y + 2);
  });
}

/**
 * Draw connections between components
 */
function drawConnections(
  ctx: CanvasRenderingContext2D,
  connections: Connection[],
  components: DetectedComponent[],
  scale: { x: number; y: number }
) {
  connections.forEach(connection => {
    const fromComp = components.find(c => c.id === connection.from_id);
    const toComp = components.find(c => c.id === connection.to_id);
    
    if (!fromComp || !toComp) return;
    
    // Calculate centers
    const fromX = ((fromComp.bbox[0] + fromComp.bbox[2]) / 2) * scale.x;
    const fromY = ((fromComp.bbox[1] + fromComp.bbox[3]) / 2) * scale.y;
    const toX = ((toComp.bbox[0] + toComp.bbox[2]) / 2) * scale.x;
    const toY = ((toComp.bbox[1] + toComp.bbox[3]) / 2) * scale.y;
    
    // Draw line
    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    
    // Style based on connection type
    const color = getConnectionColor(connection.type);
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    
    if (connection.type === 'return') {
      ctx.setLineDash([5, 5]);
    } else {
      ctx.setLineDash([]);
    }
    
    ctx.stroke();
    
    // Draw arrow
    drawArrow(ctx, fromX, fromY, toX, toY, color);
  });
  
  ctx.setLineDash([]); // Reset dash
}

/**
 * Draw arrow head
 */
function drawArrow(
  ctx: CanvasRenderingContext2D,
  fromX: number,
  fromY: number,
  toX: number,
  toY: number,
  color: string
) {
  const angle = Math.atan2(toY - fromY, toX - fromX);
  const arrowLength = 10;
  const arrowWidth = 5;
  
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(toX, toY);
  ctx.lineTo(
    toX - arrowLength * Math.cos(angle - Math.PI / 6),
    toY - arrowLength * Math.sin(angle - Math.PI / 6)
  );
  ctx.lineTo(
    toX - arrowLength * Math.cos(angle + Math.PI / 6),
    toY - arrowLength * Math.sin(angle + Math.PI / 6)
  );
  ctx.closePath();
  ctx.fill();
}

/**
 * Get color for component type
 */
function getComponentColor(type: string): string {
  const colors: Record<string, string> = {
    vav: '#4CAF50',
    ahu: '#2196F3',
    damper: '#FF9800',
    diffuser: '#9C27B0',
    duct: '#607D8B',
    sensor: '#F44336',
    controller: '#00BCD4',
  };
  
  return colors[type.toLowerCase()] || '#999999';
}

/**
 * Get color for connection type
 */
function getConnectionColor(type: string): string {
  const colors: Record<string, string> = {
    supply: '#2196F3',
    return: '#FF5722',
    electric: '#FFC107',
    pneumatic: '#9C27B0',
    signal: '#4CAF50',
  };
  
  return colors[type.toLowerCase()] || '#999999';
}

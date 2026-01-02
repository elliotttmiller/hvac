/**
 * Canvas Overlay Component
 * Renders bounding boxes and annotations on top of images
 * Uses normalized 0-1 coordinates that scale to viewport
 * 
 * FIXED: Accounts for object-fit:contain letterboxing to eliminate drift
 */

import React, { useRef, useEffect, useState } from 'react';
import { DetectedComponent, Connection } from '../../features/document-analysis/types';

// Constants for hover card dimensions
const CARD_WIDTH = 256; // w-64 = 16rem = 256px
const CARD_HEIGHT = 200; // estimated card height
const CARD_MARGIN = 12; // mt-3 = 0.75rem = 12px

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
 * Accounts for object-fit:contain letterboxing/pillarboxing
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
  const resizeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const [imageDimensions, setImageDimensions] = useState({ 
    width: 0, 
    height: 0, 
    offsetX: 0, 
    offsetY: 0,
    actualWidth: 0,
    actualHeight: 0 
  });
  const [scale, setScale] = useState({ x: 1, y: 1 });
  // Note: activeBoxId tracks hover state but currently unused as hover effects use CSS group-hover
  // Kept for potential future enhancements (e.g., showing active box in external components)
  const [activeBoxId, setActiveBoxId] = useState<string | null>(null);
  
  // Smart positioning: Calculate optimal placement for hover cards to avoid viewport clipping
  const calculateCardPosition = (
    boxLeft: number,
    boxTop: number,
    boxWidth: number,
    boxHeight: number
  ): { position: 'bottom' | 'top' | 'left' | 'right', alignment: 'center' | 'start' | 'end' } => {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    const boxRight = boxLeft + boxWidth;
    const boxBottom = boxTop + boxHeight;
    const boxCenterX = boxLeft + boxWidth / 2;
    
    // Check if card would clip at viewport edges
    const wouldClipRight = boxCenterX + CARD_WIDTH / 2 > viewportWidth;
    const wouldClipLeft = boxCenterX - CARD_WIDTH / 2 < 0;
    const wouldClipBottom = boxBottom + CARD_MARGIN + CARD_HEIGHT > viewportHeight;
    const wouldClipTop = boxTop - CARD_MARGIN - CARD_HEIGHT < 0;
    const hasHorizontalSpace = !wouldClipRight && !wouldClipLeft;
    
    // Determine position priority: bottom > top > right > left
    if (!wouldClipBottom && hasHorizontalSpace) {
      return { position: 'bottom', alignment: 'center' };
    } else if (!wouldClipTop && hasHorizontalSpace) {
      return { position: 'top', alignment: 'center' };
    } else if (!wouldClipBottom) {
      // Try bottom with adjusted alignment
      if (wouldClipRight) {
        return { position: 'bottom', alignment: 'end' };
      } else if (wouldClipLeft) {
        return { position: 'bottom', alignment: 'start' };
      }
    } else if (!wouldClipTop) {
      // Try top with adjusted alignment
      if (wouldClipRight) {
        return { position: 'top', alignment: 'end' };
      } else if (wouldClipLeft) {
        return { position: 'top', alignment: 'start' };
      }
    }
    
    // Fallback to right or left side positioning if vertical doesn't work
    const wouldClipRightSide = boxRight + CARD_MARGIN + CARD_WIDTH > viewportWidth;
    if (!wouldClipRightSide) {
      return { position: 'right', alignment: 'center' };
    } else {
      return { position: 'left', alignment: 'center' };
    }
  };
  
  // Update scale when image loads or container resizes - FIXED: Calculate exact rendered dimensions with object-fit:contain
  useEffect(() => {
    const img = imageRef.current;
    const container = containerRef.current;
    if (!img || !container) return;
    
    const calculateDimensions = () => {
      const naturalWidth = img.naturalWidth;
      const naturalHeight = img.naturalHeight;
      
      // Safety check: image must be loaded
      if (naturalWidth === 0 || naturalHeight === 0) {
        console.warn('[CanvasOverlay] Image not loaded yet, skipping calculation');
        return;
      }
      
      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight;
      
      // Calculate aspect ratios
      const imageAspect = naturalWidth / naturalHeight;
      const containerAspect = containerWidth / containerHeight;
      
      let actualWidth: number;
      let actualHeight: number;
      let offsetX: number;
      let offsetY: number;
      
      // Determine if image is letterboxed (horizontal bars) or pillarboxed (vertical bars)
      if (imageAspect > containerAspect) {
        // Image is wider - pillarboxing (vertical bars on sides)
        actualWidth = containerWidth;
        actualHeight = containerWidth / imageAspect;
        offsetX = 0;
        offsetY = (containerHeight - actualHeight) / 2;
      } else {
        // Image is taller - letterboxing (horizontal bars on top/bottom)
        actualHeight = containerHeight;
        actualWidth = containerHeight * imageAspect;
        offsetX = (containerWidth - actualWidth) / 2;
        offsetY = 0;
      }
      
      setImageDimensions({ 
        width: containerWidth, 
        height: containerHeight,
        offsetX,
        offsetY,
        actualWidth,
        actualHeight
      });
      setScale({
        x: actualWidth,
        y: actualHeight,
      });
    };
    
    // Handle image load
    const handleLoad = () => {
      calculateDimensions();
    };
    
    if (img.complete) {
      handleLoad();
    } else {
      img.addEventListener('load', handleLoad);
    }
    
    // Add ResizeObserver to handle viewport changes
    const resizeObserver = new ResizeObserver(() => {
      // Debounce the recalculation to avoid performance issues during rapid resizing
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
      
      resizeTimeoutRef.current = setTimeout(() => {
        if (img.complete) {
          calculateDimensions();
        }
      }, 100); // 100ms debounce delay
    });
    
    resizeObserver.observe(container);
    
    return () => {
      img.removeEventListener('load', handleLoad);
      resizeObserver.disconnect();
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
    };
  }, [imageUrl]);
  
  // Draw overlays on canvas - FIXED: Apply offset for letterboxing
  useEffect(() => {
    const canvas = canvasRef.current;
    const img = imageRef.current;
    
    if (!canvas || !img || scale.x <= 0) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas size to match actual rendered image dimensions
    canvas.width = imageDimensions.actualWidth;
    canvas.height = imageDimensions.actualHeight;
    
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
          top: `${imageDimensions.offsetY}px`,
          left: `${imageDimensions.offsetX}px`,
          cursor: onComponentClick ? 'pointer' : 'default',
        }}
      />
      
      {/* Interactive Hover Cards - Transplanted from Legacy InteractiveViewer */}
      {showBoundingBoxes && components.map(component => {
        const [x1, y1, x2, y2] = component.bbox;
        // Convert normalized 0-1 coordinates to percentage (0-100) for CSS positioning
        const x = x1 * 100;
        const y = y1 * 100;
        const width = (x2 - x1) * 100;
        const height = (y2 - y1) * 100;
        
        const isText = component.type === 'text';
        const isActive = activeBoxId === component.id;
        
        // Calculate absolute pixel positions for smart positioning
        const boxLeft = imageDimensions.offsetX + (x / 100) * imageDimensions.actualWidth;
        const boxTop = imageDimensions.offsetY + (y / 100) * imageDimensions.actualHeight;
        const boxWidth = (width / 100) * imageDimensions.actualWidth;
        const boxHeight = (height / 100) * imageDimensions.actualHeight;
        
        // Calculate smart card position to avoid viewport clipping
        const cardPlacement = calculateCardPosition(boxLeft, boxTop, boxWidth, boxHeight);
        
        // Dynamic positioning classes based on placement
        let cardPositionClass = '';
        let connectorClass = '';
        
        switch (cardPlacement.position) {
          case 'bottom':
            cardPositionClass = 'top-full mt-3';
            connectorClass = 'absolute -top-1.5 w-3 h-3 bg-slate-900 border-l border-t border-slate-700/50 transform rotate-45';
            if (cardPlacement.alignment === 'center') {
              cardPositionClass += ' left-1/2 -translate-x-1/2';
              connectorClass += ' left-1/2 -translate-x-1/2';
            } else if (cardPlacement.alignment === 'end') {
              cardPositionClass += ' right-0';
              connectorClass += ' right-8';
            } else {
              cardPositionClass += ' left-0';
              connectorClass += ' left-8';
            }
            break;
          case 'top':
            cardPositionClass = 'bottom-full mb-3';
            connectorClass = 'absolute -bottom-1.5 w-3 h-3 bg-slate-900 border-r border-b border-slate-700/50 transform rotate-45';
            if (cardPlacement.alignment === 'center') {
              cardPositionClass += ' left-1/2 -translate-x-1/2';
              connectorClass += ' left-1/2 -translate-x-1/2';
            } else if (cardPlacement.alignment === 'end') {
              cardPositionClass += ' right-0';
              connectorClass += ' right-8';
            } else {
              cardPositionClass += ' left-0';
              connectorClass += ' left-8';
            }
            break;
          case 'right':
            cardPositionClass = 'left-full ml-3 top-1/2 -translate-y-1/2';
            connectorClass = 'absolute -left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 bg-slate-900 border-l border-b border-slate-700/50 transform rotate-45';
            break;
          case 'left':
            cardPositionClass = 'right-full mr-3 top-1/2 -translate-y-1/2';
            connectorClass = 'absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 bg-slate-900 border-r border-t border-slate-700/50 transform rotate-45';
            break;
        }
        
        return (
          <div
            key={component.id}
            className={`absolute border-2 flex items-start justify-start group cursor-pointer transition-all duration-200 ${
              isText 
                ? 'border-purple-500/60 hover:border-purple-400 hover:bg-purple-500/10' 
                : 'border-cyan-500/60 hover:border-cyan-400 hover:bg-cyan-500/10'
            }`}
            style={{
              left: `${boxLeft}px`,
              top: `${boxTop}px`,
              width: `${boxWidth}px`,
              height: `${boxHeight}px`,
              transform: `rotate(${component.rotation || 0}deg)`,
              transformOrigin: 'center center',
              zIndex: isActive ? 50 : 10, // Active box gets higher z-index
            }}
            onMouseEnter={() => setActiveBoxId(component.id)}
            onMouseLeave={() => setActiveBoxId(null)}
            onClick={() => onComponentClick?.(component)}
          >
            {/* Corner Markers for Tech Feel */}
            <div className="absolute -top-[1px] -left-[1px] w-1.5 h-1.5 border-t-2 border-l-2 border-current opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="absolute -top-[1px] -right-[1px] w-1.5 h-1.5 border-t-2 border-r-2 border-current opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="absolute -bottom-[1px] -left-[1px] w-1.5 h-1.5 border-b-2 border-l-2 border-current opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="absolute -bottom-[1px] -right-[1px] w-1.5 h-1.5 border-b-2 border-r-2 border-current opacity-0 group-hover:opacity-100 transition-opacity"></div>

            {/* SLEEK POPOVER CARD - Smart positioned to avoid viewport clipping */}
            <div className={`absolute ${cardPositionClass} w-64 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none group-hover:pointer-events-auto origin-top scale-95 group-hover:scale-100`} style={{ zIndex: 100 }}>
              <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-lg shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] p-0 overflow-hidden ring-1 ring-white/10">
                {/* Color Strip */}
                <div className={`h-1 w-full bg-gradient-to-r ${isText ? 'from-purple-600 via-fuchsia-500 to-purple-600' : 'from-cyan-600 via-blue-500 to-cyan-600'}`}></div>
                
                <div className="p-3.5">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="text-xs font-bold text-slate-100 uppercase tracking-wider leading-tight">{component.label.replace(/_/g, ' ')}</h4>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border ${isText ? 'bg-purple-500/10 border-purple-500/20 text-purple-300' : 'bg-cyan-500/10 border-cyan-500/20 text-cyan-300'}`}>
                          {component.meta?.tag || 'ID-' + component.id.split('-')[1]}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className={`text-sm font-bold tabular-nums tracking-tight ${isText ? 'text-purple-400' : 'text-cyan-400'}`}>
                        {Math.round(component.confidence * 100)}%
                      </span>
                      <span className="text-[8px] text-slate-500 uppercase font-semibold tracking-wider">Conf.</span>
                    </div>
                  </div>

                  {component.meta?.description && (
                    <div className="py-2.5 border-t border-slate-800/50">
                      <p className="text-[10px] text-slate-400 leading-relaxed">
                        {component.meta.description}
                      </p>
                    </div>
                  )}

                  <div className="pt-2.5 border-t border-slate-800/50 grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[8px] text-slate-600 uppercase tracking-widest font-semibold">Position</span>
                      <span className="text-[10px] font-mono text-slate-400">
                        X:{Math.round(x1 * 100)} Y:{Math.round(y1 * 100)}
                      </span>
                    </div>
                    <div className="flex flex-col gap-0.5 text-right">
                      <span className="text-[8px] text-slate-600 uppercase tracking-widest font-semibold">Type</span>
                      <span className="text-[10px] font-mono text-slate-400 capitalize">
                        {component.type || 'Object'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              {/* Triangle Connector - dynamically positioned */}
              <div className={connectorClass}></div>
            </div>
          </div>
        );
      })}
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

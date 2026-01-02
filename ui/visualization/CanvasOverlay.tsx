/**
 * Canvas Overlay Component - OVERHAULED (January 2026)
 * 
 * Architecture based on forensic audit of legacy InteractiveViewer.tsx
 * 
 * Key Design Decisions (from legacy analysis):
 * 1. GEOMETRY ENGINE: Uses percentage-based positioning (not pixel calculations)
 * 2. COORDINATE MAPPING: API bbox [x1, y1, x2, y2] (0-1 normalized) → CSS % (0-100%)
 * 3. DRIFT PREVENTION: Boxes are children of image container, scale automatically
 * 4. ASPECT RATIO: object-fit:contain on image, percentage positioning handles letterboxing
 * 5. SMART POSITIONING: Viewport collision detection for hover cards
 * 6. Z-INDEX HIERARCHY: Active box (50) > Passive box (10), Card (100) > All
 * 
 * Visual Language (from pid-analyst.ts):
 * - Component boxes: Cyan gradient (engineering blue)
 * - Text/OCR boxes: Purple gradient (distinct from components)
 * - Confidence displayed prominently
 * - ISA-5.1 compliant labeling
 */

import React, { useState, useRef, useEffect } from 'react';
import { DetectedComponent, Connection } from '../../features/document-analysis/types';

// Visual Constants (from legacy code analysis)
const CARD_WIDTH = 256; // w-64 = 16rem
const CARD_HEIGHT = 200; // estimated
const CARD_MARGIN = 12; // mt-3

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
 * Smart card positioning to prevent viewport clipping
 * Returns optimal position and alignment based on available space
 */
function calculateCardPosition(
  boxLeft: number,
  boxTop: number,
  boxWidth: number,
  boxHeight: number
): { position: 'bottom' | 'top' | 'left' | 'right', alignment: 'center' | 'start' | 'end' } {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  
  const boxRight = boxLeft + boxWidth;
  const boxBottom = boxTop + boxHeight;
  const boxCenterX = boxLeft + boxWidth / 2;
  
  // Collision detection
  const wouldClipRight = boxCenterX + CARD_WIDTH / 2 > viewportWidth;
  const wouldClipLeft = boxCenterX - CARD_WIDTH / 2 < 0;
  const wouldClipBottom = boxBottom + CARD_MARGIN + CARD_HEIGHT > viewportHeight;
  const wouldClipTop = boxTop - CARD_MARGIN - CARD_HEIGHT < 0;
  const hasHorizontalSpace = !wouldClipRight && !wouldClipLeft;
  
  // Priority: bottom > top > right > left
  if (!wouldClipBottom && hasHorizontalSpace) {
    return { position: 'bottom', alignment: 'center' };
  } else if (!wouldClipTop && hasHorizontalSpace) {
    return { position: 'top', alignment: 'center' };
  } else if (!wouldClipBottom) {
    if (wouldClipRight) return { position: 'bottom', alignment: 'end' };
    if (wouldClipLeft) return { position: 'bottom', alignment: 'start' };
  } else if (!wouldClipTop) {
    if (wouldClipRight) return { position: 'top', alignment: 'end' };
    if (wouldClipLeft) return { position: 'top', alignment: 'start' };
  }
  
  // Fallback to side positioning
  const wouldClipRightSide = boxRight + CARD_MARGIN + CARD_WIDTH > viewportWidth;
  return wouldClipRightSide 
    ? { position: 'left', alignment: 'center' }
    : { position: 'right', alignment: 'center' };
}

/**
 * Generate CSS classes for card positioning based on collision detection
 */
function getCardPositionClasses(
  position: 'bottom' | 'top' | 'left' | 'right',
  alignment: 'center' | 'start' | 'end'
): { cardClass: string, connectorClass: string } {
  let cardClass = 'absolute w-64 ';
  let connectorClass = 'absolute w-3 h-3 bg-slate-900 transform ';
  
  switch (position) {
    case 'bottom':
      cardClass += 'top-full mt-3 ';
      connectorClass += '-top-1.5 border-l border-t border-slate-700/50 rotate-45 ';
      if (alignment === 'center') {
        cardClass += 'left-1/2 -translate-x-1/2';
        connectorClass += 'left-1/2 -translate-x-1/2';
      } else if (alignment === 'end') {
        cardClass += 'right-0';
        connectorClass += 'right-8';
      } else {
        cardClass += 'left-0';
        connectorClass += 'left-8';
      }
      break;
    case 'top':
      cardClass += 'bottom-full mb-3 ';
      connectorClass += '-bottom-1.5 border-r border-b border-slate-700/50 rotate-45 ';
      if (alignment === 'center') {
        cardClass += 'left-1/2 -translate-x-1/2';
        connectorClass += 'left-1/2 -translate-x-1/2';
      } else if (alignment === 'end') {
        cardClass += 'right-0';
        connectorClass += 'right-8';
      } else {
        cardClass += 'left-0';
        connectorClass += 'left-8';
      }
      break;
    case 'right':
      cardClass += 'left-full ml-3 top-1/2 -translate-y-1/2';
      connectorClass += '-left-1.5 top-1/2 -translate-y-1/2 border-l border-b border-slate-700/50 rotate-45';
      break;
    case 'left':
      cardClass += 'right-full mr-3 top-1/2 -translate-y-1/2';
      connectorClass += '-right-1.5 top-1/2 -translate-y-1/2 border-r border-t border-slate-700/50 rotate-45';
      break;
  }
  
  return { cardClass, connectorClass };
}

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
  const [activeBoxId, setActiveBoxId] = useState<string | null>(null);
  
  // Track image container dimensions for card positioning calculations
  const [containerRect, setContainerRect] = useState<DOMRect | null>(null);
  
  useEffect(() => {
    const updateRect = () => {
      if (containerRef.current) {
        setContainerRect(containerRef.current.getBoundingClientRect());
      }
    };
    
    updateRect();
    window.addEventListener('resize', updateRect);
    window.addEventListener('scroll', updateRect);
    
    return () => {
      window.removeEventListener('resize', updateRect);
      window.removeEventListener('scroll', updateRect);
    };
  }, [imageUrl]);
  
  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full flex items-center justify-center bg-[#0B1120]"
    >
      {/* Grid background for engineering feel (from legacy) */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none" 
        style={{ 
          backgroundImage: 'radial-gradient(#334155 1px, transparent 1px)', 
          backgroundSize: '24px 24px' 
        }}
      />
      
      {/* Image Container - Positioned with object-fit:contain */}
      <div className="relative inline-block max-w-full max-h-full">
        <img
          ref={imageRef}
          src={imageUrl}
          alt="Blueprint"
          className="max-w-full max-h-full object-contain"
        />
        
        {/* Bounding Boxes Layer - Positioned as percentage-based children */}
        {showBoundingBoxes && components.map(component => {
          const [x1, y1, x2, y2] = component.bbox;
          
          // Convert normalized 0-1 to percentage 0-100 (legacy approach)
          const x = x1 * 100;
          const y = y1 * 100;
          const width = (x2 - x1) * 100;
          const height = (y2 - y1) * 100;
          
          const isText = component.type === 'text';
          const isActive = activeBoxId === component.id;
          const isSelected = component.id === selectedComponent;
          
          // Calculate absolute position for smart card positioning
          let boxLeft = 0, boxTop = 0, boxWidth = 0, boxHeight = 0;
          if (containerRect && imageRef.current) {
            const imgRect = imageRef.current.getBoundingClientRect();
            boxLeft = imgRect.left + (x / 100) * imgRect.width;
            boxTop = imgRect.top + (y / 100) * imgRect.height;
            boxWidth = (width / 100) * imgRect.width;
            boxHeight = (height / 100) * imgRect.height;
          }
          
          const cardPlacement = calculateCardPosition(boxLeft, boxTop, boxWidth, boxHeight);
          const { cardClass, connectorClass } = getCardPositionClasses(
            cardPlacement.position,
            cardPlacement.alignment
          );
          
          return (
            <div
              key={component.id}
              className={`absolute border-2 flex items-start justify-start group cursor-pointer transition-all duration-200 ${
                isSelected
                  ? 'border-yellow-400 bg-yellow-400/10'
                  : isText 
                    ? 'border-purple-500/60 hover:border-purple-400 hover:bg-purple-500/10' 
                    : 'border-cyan-500/60 hover:border-cyan-400 hover:bg-cyan-500/10'
              }`}
              style={{
                left: `${x}%`,
                top: `${y}%`,
                width: `${width}%`,
                height: `${height}%`,
                transform: `rotate(${component.rotation || 0}deg)`,
                transformOrigin: 'center center',
                zIndex: isActive ? 50 : 10, // Z-index hierarchy: active > passive
              }}
              onMouseEnter={() => setActiveBoxId(component.id)}
              onMouseLeave={() => setActiveBoxId(null)}
              onClick={() => onComponentClick?.(component)}
            >
              {/* Corner Markers - Engineering aesthetic from legacy */}
              <div className="absolute -top-[1px] -left-[1px] w-1.5 h-1.5 border-t-2 border-l-2 border-current opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute -top-[1px] -right-[1px] w-1.5 h-1.5 border-t-2 border-r-2 border-current opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute -bottom-[1px] -left-[1px] w-1.5 h-1.5 border-b-2 border-l-2 border-current opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute -bottom-[1px] -right-[1px] w-1.5 h-1.5 border-b-2 border-r-2 border-current opacity-0 group-hover:opacity-100 transition-opacity" />
              
              {/* Smart-Positioned Hover Card */}
              <div 
                className={`${cardClass} opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none group-hover:pointer-events-auto origin-top scale-95 group-hover:scale-100`}
                style={{ zIndex: 100 }} // Card always on top
              >
                <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-lg shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] p-0 overflow-hidden ring-1 ring-white/10">
                  {/* Color Strip - Visual language from legacy */}
                  <div className={`h-1 w-full bg-gradient-to-r ${
                    isText 
                      ? 'from-purple-600 via-fuchsia-500 to-purple-600' 
                      : 'from-cyan-600 via-blue-500 to-cyan-600'
                  }`} />
                  
                  <div className="p-3.5">
                    {/* Header with label and confidence */}
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="text-xs font-bold text-slate-100 uppercase tracking-wider leading-tight">
                          {component.label.replace(/_/g, ' ')}
                        </h4>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border ${
                            isText 
                              ? 'bg-purple-500/10 border-purple-500/20 text-purple-300' 
                              : 'bg-cyan-500/10 border-cyan-500/20 text-cyan-300'
                          }`}>
                            {component.meta?.tag || 'ID-' + (component.id.includes('-') ? component.id.split('-')[1] : component.id.slice(0, 8))}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className={`text-sm font-bold tabular-nums tracking-tight ${
                          isText ? 'text-purple-400' : 'text-cyan-400'
                        }`}>
                          {Math.round(component.confidence * 100)}%
                        </span>
                        <span className="text-[8px] text-slate-500 uppercase font-semibold tracking-wider">
                          Conf.
                        </span>
                      </div>
                    </div>
                    
                    {/* Description (ISA-5.1 compliant) */}
                    {component.meta?.description && (
                      <div className="py-2.5 border-t border-slate-800/50">
                        <p className="text-[10px] text-slate-400 leading-relaxed">
                          {component.meta.description}
                        </p>
                      </div>
                    )}
                    
                    {/* Metadata Grid */}
                    <div className="pt-2.5 border-t border-slate-800/50 grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[8px] text-slate-600 uppercase tracking-widest font-semibold">
                          Position
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">
                          X:{Math.round(x1 * 100)} Y:{Math.round(y1 * 100)}
                        </span>
                      </div>
                      <div className="flex flex-col gap-0.5 text-right">
                        <span className="text-[8px] text-slate-600 uppercase tracking-widest font-semibold">
                          Type
                        </span>
                        <span className="text-[10px] font-mono text-slate-400 capitalize">
                          {component.type || 'Object'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Triangle Connector - dynamically positioned */}
                <div className={connectorClass} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

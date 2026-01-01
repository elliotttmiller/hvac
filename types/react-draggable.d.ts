declare module 'react-draggable' {
  import * as React from 'react';

  export interface DraggableProps {
    axis?: 'both' | 'x' | 'y';
    handle?: string;
    cancel?: string;
    grid?: [number, number];
    bounds?: string | { left: number; top: number; right: number; bottom: number };
    defaultPosition?: { x: number; y: number };
    position?: { x: number; y: number };
    scale?: number;
    onStart?: (e: MouseEvent, data: DraggableData) => void | false;
    onDrag?: (e: MouseEvent, data: DraggableData) => void | false;
    onStop?: (e: MouseEvent, data: DraggableData) => void | false;
    children: React.ReactNode;
  }

  export interface DraggableData {
    node: HTMLElement;
    x: number;
    y: number;
    deltaX: number;
    deltaY: number;
  }

  export default class Draggable extends React.Component<DraggableProps> {}
}
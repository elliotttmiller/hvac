'use client';

import React, { useState, useEffect, ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { TopHeader } from './TopHeader';
import { LeftSidebar } from './LeftSidebar';
import { DashboardContent } from './DashboardContent';
import { ActivityBar } from './ActivityBar';
import dynamic from 'next/dynamic';
import type { Document } from '@/lib/local-db';

// Local detection type used across UnifiedLayout and Workspace
interface DetectionItem {
  label: string;
  conf: number;
  box: [number, number, number, number];
  obb?: {
    x_center: number;
    y_center: number;
    width: number;
    height: number;
    rotation: number;
  };
  textContent?: string;
  textConfidence?: number;
}

// Dynamically import Workspace to avoid SSR issues
const Workspace = dynamic(
  () => import('@/components/features/workspace/Workspace').then(mod => ({ default: mod.Workspace })),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-full w-full bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    ),
  }
);

type LayoutMode = 'studio' | 'simple';

interface UnifiedLayoutProps {
  /** Optional project ID for workspace routes */
  projectId?: string;
  /** Optional document id to open when workspace loads */
  documentId?: string;
  /** Layout mode: 'studio' = 3-pane with sidebars, 'simple' = content only */
  mode?: LayoutMode;
  /** Children to render in simple mode */
  children?: ReactNode;
  /** Test mode flag for development/testing */
  testMode?: boolean;
}

export function UnifiedLayout({ projectId, mode: propMode, children, testMode = false, documentId }: UnifiedLayoutProps) {
  const pathname = usePathname();
  
  // Detect if we're on a workspace route
  const isWorkspaceRoute = pathname?.startsWith('/workspace/') ?? false;
  const workspaceProjectId = projectId || (isWorkspaceRoute ? pathname?.split('/workspace/')[1]?.split('/')[0] : undefined);
  
  // Detect if we're on dashboard/home route (panel layout with sidebars)
  const isDashboardRoute = pathname === '/dashboard' || pathname === '/';
  
  // Auto-detect mode based on route if not explicitly provided
  // Panel layout (formerly "studio mode"): workspace, dashboard, home - has sidebars
  // Page layout (formerly "simple mode"): everything else (projects, etc.) - content only
  const mode: LayoutMode = propMode || (isWorkspaceRoute || isDashboardRoute ? 'studio' : 'simple');

  // State for activity bar
  const [activeView, setActiveView] = useState('files');

  // Fetch image URL for workspace
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [detections, setDetections] = useState<DetectionItem[]>([]);
  const [isLoadingProject, setIsLoadingProject] = useState(false);

  useEffect(() => {
    if (!workspaceProjectId) return;

  console.log('[UnifiedLayout] testMode:', testMode, 'workspaceProjectId:', workspaceProjectId, 'documentId:', documentId);

    // In test mode, generate mock data
    if (testMode) {
      console.log('[UnifiedLayout] Generating test mode data');
      // Create a simple test image URL that works
      const canvas = document.createElement('canvas');
      canvas.width = 800;
      canvas.height = 600;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Draw a simple blueprint-like background
        ctx.fillStyle = '#1a1d2e';
        ctx.fillRect(0, 0, 800, 600);
        ctx.strokeStyle = '#3b4259';
        ctx.lineWidth = 1;
        // Draw grid
        for (let x = 0; x < 800; x += 40) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, 600);
          ctx.stroke();
        }
        for (let y = 0; y < 600; y += 40) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(800, y);
          ctx.stroke();
        }
        // Add some text
        ctx.fillStyle = '#6b7280';
        ctx.font = '24px sans-serif';
        ctx.fillText('Test HVAC Blueprint', 250, 300);
        
        setImageUrl(canvas.toDataURL());
      }
      
      // Set mock detections
      setDetections([
        { 
          label: 'VAV Box', 
          conf: 0.95, 
          box: [100, 100, 300, 200],
          obb: { x_center: 200, y_center: 150, width: 200, height: 100, rotation: 0 }
        },
        { 
          label: 'VAV Box', 
          conf: 0.92, 
          box: [400, 150, 600, 250],
          obb: { x_center: 500, y_center: 200, width: 200, height: 100, rotation: 15 }
        },
        { 
          label: 'Ductwork', 
          conf: 0.87, 
          box: [300, 350, 500, 420],
          textContent: 'SUPPLY-12"',
          textConfidence: 0.85
        },
        { 
          label: 'Sensor', 
          conf: 0.92, 
          box: [200, 450, 280, 510],
        },
        { 
          label: 'Valve', 
          conf: 0.89, 
          box: [500, 450, 580, 520],
        },
        { 
          label: 'Ductwork', 
          conf: 0.88, 
          box: [100, 250, 250, 330],
        },
        { 
          label: 'Sensor', 
          conf: 0.91, 
          box: [600, 200, 680, 260],
          textContent: 'TEMP-01',
          textConfidence: 0.92
        },
      ]);
      setIsLoadingProject(false);
      console.log('[UnifiedLayout] Test mode data set');
      return;
    }

    // If a specific documentId is present in the URL, fetch that document directly
    if (documentId) {
      setIsLoadingProject(true);
      fetch(`/api/documents/${documentId}`)
        .then((res) => res.json())
        .then((data) => {
          // API returns { document } shape; normalize to the document object
          const doc = (data && data.document) ? data.document as Document & { analysisResult?: { detections?: DetectionItem[] } } : data as Document & { analysisResult?: { detections?: DetectionItem[] } };
          if (doc && doc.url) {
            setImageUrl(doc.url as string);
          }
          if (doc.analysisResult?.detections) {
            setDetections(doc.analysisResult.detections as DetectionItem[]);
          }
        })
        .catch((err) => {
          console.error('[UnifiedLayout] Failed to load document by id:', err);
        })
        .finally(() => setIsLoadingProject(false));
      return;
    }

    setIsLoadingProject(true);
    console.log('[UnifiedLayout] Fetching project data from API');
    // Fetch project and documents (fallback)
    fetch(`/api/projects/${workspaceProjectId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.documents && data.documents.length > 0) {
          // Get the first document's URL as the image
          const firstDoc = data.documents[0] as Document;
          setImageUrl(firstDoc.url);
          // Set detections if available
          // Some documents may include an analysisResult shape produced by
          // the analysis pipeline. This is not part of the persisted
          // `Document` type in local-db, so narrow dynamically here.
          const docWithAnalysis = firstDoc as Document & { analysisResult?: { detections?: DetectionItem[] } };
          if (docWithAnalysis.analysisResult?.detections) {
            setDetections(docWithAnalysis.analysisResult.detections);
          }
        }
      })
      .catch((err) => {
        console.error('Failed to load project:', err);
      })
      .finally(() => {
        setIsLoadingProject(false);
      });
  }, [workspaceProjectId, testMode, documentId]);

  // For workspace routes, render Workspace with TopHeader and ActivityBar
  if (isWorkspaceRoute && workspaceProjectId) {
    return (
      <div className="h-screen w-screen bg-background overflow-hidden">
        {/* Top Header - Fixed at top, always visible, spans full width */}
        <div className="fixed top-0 left-0 right-0 z-50">
          <TopHeader />
        </div>
        
        {/* VSCode-style Activity Bar on far left - Fixed position, always visible */}
        <div className="fixed top-14 left-0 bottom-0 z-40">
          <ActivityBar activeView={activeView} onViewChange={setActiveView} />
        </div>
        
        {/* Workspace - Positioned to account for fixed header and activity bar */}
        <div className="fixed top-14 left-12 right-0 bottom-0 overflow-hidden">
          {isLoadingProject ? (
            <div className="flex items-center justify-center h-full w-full bg-background">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <Workspace 
              projectId={workspaceProjectId} 
              imageUrl={imageUrl || undefined}
              detections={detections}
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-background overflow-hidden">
      {/* Top Header - Fixed at top, always visible, spans full width */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <TopHeader />
      </div>
      
      {/* VSCode-style Activity Bar on far left - Fixed position, always visible */}
      <div className="fixed top-14 left-0 bottom-0 z-40">
        <ActivityBar activeView={activeView} onViewChange={setActiveView} />
      </div>
      
      {/* Main Content Area - Positioned to account for fixed header and activity bar */}
      <div className="fixed top-14 left-12 right-0 bottom-0 overflow-hidden">
        {mode === 'studio' ? (
          // Studio Mode: 3-pane layout with sidebars (Dashboard/Home)
          // Use a flex container so LeftSidebar and DashboardContent sit side-by-side
          <div className="h-full flex">
            <LeftSidebar />
            <div className="flex-1 h-full overflow-auto">
              <DashboardContent />
            </div>
          </div>
        ) : (
          // Simple Mode: Content only with padding for scrollable pages
          <main className="h-full w-full overflow-auto bg-background">
            <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </main>
        )}
      </div>
    </div>
  );
}

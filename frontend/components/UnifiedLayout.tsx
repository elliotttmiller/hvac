import React, { useState, useRef, useEffect } from 'react';
import LeftSidebar from './LeftSidebar';
import TopHeader from './TopHeader';
import ActivityBar from './ActivityBar';
import { ViewState } from '@/features/document-analysis/types';
import { ChevronRight, ChevronLeft, PanelLeftClose, PanelLeftOpen } from 'lucide-react';

interface UnifiedLayoutProps {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
  children: React.ReactNode;
  // Project explorer wiring (optional - passed from App)
  projects?: { id: string; name: string; root: string }[];
  activeProject?: string | null;
  onSelectProject?: (id: string) => void;
  onProjectsChange?: (list: { id: string; name: string; root: string }[]) => void;
  onOpenProject?: (id: string) => void;
  // File analysis callback
  onAnalyzeFile?: (filePath: string) => void;
}

const UnifiedLayout: React.FC<UnifiedLayoutProps> = ({ currentView, onChangeView, children, projects, activeProject, onSelectProject, onProjectsChange, onOpenProject, onAnalyzeFile }) => {
  // Only show the "Explorer" sidebar in Analyzer mode
  const showContextSidebar = currentView === ViewState.ANALYZER;
  
  // Resize State for Left Sidebar
  const [sidebarWidth, setSidebarWidth] = useState(260);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const startResizing = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      // 56px is roughly the ActivityBar width + padding
      const newWidth = e.clientX - 56; 
      if (newWidth > 180 && newWidth < 450) {
        setSidebarWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    } else {
      document.body.style.cursor = 'default';
      document.body.style.userSelect = 'auto';
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'default';
      document.body.style.userSelect = 'auto';
    };
  }, [isResizing]);

  return (
  <div className="flex flex-col h-screen bg-[#09090b] text-zinc-100 font-sans overflow-hidden selection:bg-cyan-500/30">
      <TopHeader />
      <div className="flex-1 flex min-h-0 relative">
        <ActivityBar currentView={currentView} onChangeView={onChangeView} />
        
      {/* Left Sidebar Container */}
      {showContextSidebar && (
        <div 
         ref={sidebarRef}
         className={`relative flex flex-col bg-[#1e1e1e] border-r border-white/5 shrink-0 ${!isSidebarOpen && 'border-r-0 overflow-hidden'}`}
         style={{ 
           width: isSidebarOpen ? sidebarWidth : 0,
           transition: isResizing ? 'none' : 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
           willChange: isResizing ? 'width' : 'auto'
         }}
        >
          {/* Content Wrapper to prevent layout thrashing during collapse */}
          <div className="w-full h-full overflow-hidden" style={{ width: sidebarWidth }}>
            <LeftSidebar
              projects={projects}
              activeProject={activeProject}
              onSelectProject={onSelectProject}
              onProjectsChange={onProjectsChange}
              onOpenProject={onOpenProject}
              onAnalyzeFile={onAnalyzeFile}
            />
          </div>

              {/* Resize Handle */}
              {isSidebarOpen && (
                <div 
                    className="absolute top-0 right-0 bottom-0 w-1 cursor-col-resize hover:bg-cyan-500/50 transition-colors z-20 group"
                    onMouseDown={startResizing}
                >
                    <div className="absolute top-1/2 right-0 transform -translate-y-1/2 w-0.5 h-8 bg-white/10 group-hover:bg-cyan-400 rounded-full transition-colors"></div>
                </div>
              )}
           </div>
        )}
        
        {/* Main Content */}
        <main className="flex-1 flex flex-col min-w-0 relative bg-[#121212] overflow-hidden">
            
            {/* Floating Toggle Button for Left Sidebar */}
            {showContextSidebar && (
              <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className={`absolute top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-black/30 backdrop-blur-md border border-white/10 text-zinc-400 hover:text-white hover:bg-black/50 shadow-lg transition-all duration-300 ${isSidebarOpen ? 'left-[calc(var(--sidebar-width)-0.75rem)] opacity-20 hover:opacity-100' : 'left-3 opacity-80 hover:opacity-100'}`}
                style={{ '--sidebar-width': `${sidebarWidth}px` } as React.CSSProperties}
                title={isSidebarOpen ? "Collapse Explorer" : "Expand Explorer"}
              >
                  {isSidebarOpen ? <ChevronLeft size={12} /> : <PanelLeftOpen size={14} />}
              </button>
            )}

            {children}
        </main>
      </div>
    </div>
  );
};

export default UnifiedLayout;
import React, { useState } from 'react';
import UnifiedLayout from '@/components/UnifiedLayout';
import Dashboard from '@/app/Dashboard';
import BlueprintWorkspace from '@/features/blueprint-viewer/BlueprintWorkspace';
import ProjectsPage from '@/components/ProjectsPage';
import CopilotModal from '@/components/CopilotModal';
import Copilot from '@/components/Copilot';
import { ViewState } from '@/features/document-analysis/types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.DASHBOARD);
  const [projects, setProjects] = useState<Array<{ id: string; name: string; root: string }>>([]);
  const [activeProject, setActiveProject] = useState<string | null>(null);
  const [showCopilot, setShowCopilot] = useState(false);
  const [fileToAnalyze, setFileToAnalyze] = useState<string | null>(null);

  // Fetch projects on mount
  React.useEffect(() => {
    fetch('/api/projects')
      .then(r => r.json())
      .then(d => {
        setProjects(d.projects || []);
        if (d.projects && d.projects.length > 0 && !activeProject) {
          setActiveProject(d.projects[0].id);
        }
      })
      .catch(err => {
        console.error('Failed to fetch projects:', err);
        setProjects([]);
      });
  }, []);

  React.useEffect(() => {
    // Update browser tab title based on current view
    const base = 'HVAC AI Platform';
    switch (currentView) {
      case ViewState.DASHBOARD:
        document.title = `${base} — Dashboard`;
        break;
      case ViewState.ANALYZER:
        document.title = `${base} — Blueprint Analyzer`;
        break;
      case ViewState.PROJECTS:
        document.title = `${base} — Projects`;
        break;
      default:
        document.title = base;
    }
  }, [currentView]);

  // Intercept attempts to navigate to Copilot: open modal instead of replacing the page
  const handleChangeView = (view: ViewState) => {
    if (view === ViewState.COPILOT) {
      // smooth modal experience
      setShowCopilot(true);
      return;
    }
    setCurrentView(view);
  };

  // Handle file analysis request from sidebar
  const handleAnalyzeFile = (filePath: string) => {
    setFileToAnalyze(filePath);
    // Switch to analyzer view if not already there
    if (currentView !== ViewState.ANALYZER) {
      setCurrentView(ViewState.ANALYZER);
    }
  };

  const renderView = () => {
    switch (currentView) {
      case ViewState.DASHBOARD:
        return <Dashboard />;
      case ViewState.ANALYZER:
        return <BlueprintWorkspace fileToAnalyze={fileToAnalyze} onAnalyzed={() => setFileToAnalyze(null)} />;
      case ViewState.PROJECTS:
        return (
          <ProjectsPage
            projects={projects}
            activeProject={activeProject}
            onSelectProject={(id) => setActiveProject(id)}
            onProjectsChange={(list) => setProjects(list)}
            onOpenProject={(id) => {
              setActiveProject(id);
              setCurrentView(ViewState.ANALYZER);
            }}
          />
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <UnifiedLayout
      currentView={currentView}
      onChangeView={handleChangeView}
      projects={projects}
      activeProject={activeProject}
      onSelectProject={(id) => setActiveProject(id)}
      onProjectsChange={(list) => setProjects(list)}
      onOpenProject={(id) => {
        setActiveProject(id);
        setCurrentView(ViewState.ANALYZER);
      }}
      onAnalyzeFile={handleAnalyzeFile}
    >
        {renderView()}

        {/* Copilot modal — mounted at app root so it overlays content seamlessly */}
  <CopilotModal open={showCopilot} onClose={() => setShowCopilot(false)} />

  {/* Floating, moveable Copilot button + panel (always mounted) */}
  <Copilot />
    </UnifiedLayout>
  );
};

export default App;
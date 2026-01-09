import React, { useState, useEffect } from 'react';
import UnifiedLayout from '@/components/UnifiedLayout';
import Dashboard from '@/app/Dashboard';
import BlueprintWorkspace from '@/features/blueprint-viewer/BlueprintWorkspace';
import ProjectsPage from '@/components/ProjectsPage';
import CopilotModal from '@/components/CopilotModal';
import Copilot from '@/components/Copilot';
import { ViewState } from '@/features/document-analysis/types';
import { ToastProvider, useToastHelpers } from '@/lib/hooks/useToast';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.DASHBOARD);
  const [projects, setProjects] = useState<Array<{ id: string; name: string; root: string }>>([]);
  const [activeProject, setActiveProject] = useState<string | null>(null);
  const [showCopilot, setShowCopilot] = useState(false);
  const [fileToAnalyze, setFileToAnalyze] = useState<string | null>(null);

  // Determine initial view from URL so refresh preserves where the user was
  React.useEffect(() => {
    const path = window.location.pathname || '/';
    if (path.startsWith('/analyzer')) setCurrentView(ViewState.ANALYZER);
    else if (path.startsWith('/projects')) setCurrentView(ViewState.PROJECTS);
    else setCurrentView(ViewState.DASHBOARD);

    // respond to browser navigation (back/forward)
    const onPop = () => {
      const p = window.location.pathname || '/';
      if (p.startsWith('/analyzer')) setCurrentView(ViewState.ANALYZER);
      else if (p.startsWith('/projects')) setCurrentView(ViewState.PROJECTS);
      else setCurrentView(ViewState.DASHBOARD);
    };
    window.addEventListener('popstate', onPop);

    return () => window.removeEventListener('popstate', onPop);
  }, []);

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

  

  // Global listener: when any part of the UI dispatches a 'file-upload' event,
  // upload the file to the server under the currently active project so the
  // projects list and explorer stay in sync.
  // Note: Global upload handling is provided by a child component rendered
  // inside the ToastProvider so it can use the toast hooks. See <GlobalUploadHandler />

  React.useEffect(() => {
    // Update browser tab title based on current view
    const base = 'HVAC AI';
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
    // update URL so refresh preserves view
    let path = '/';
    if (view === ViewState.ANALYZER) path = '/analyzer';
    else if (view === ViewState.PROJECTS) path = '/projects';
    window.history.pushState({}, '', path);
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

  // Listen for external requests to open a file in the analyzer (emitted by various UI pieces)
  React.useEffect(() => {
    const onOpenFile = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (!detail) return;
      // detail expected to be "<projectId>::<relPath>" or a raw path
      handleAnalyzeFile(detail);
    };
    window.addEventListener('open-file-in-analyzer', onOpenFile as EventListener);
    return () => window.removeEventListener('open-file-in-analyzer', onOpenFile as EventListener);
  }, [handleAnalyzeFile]);

  const renderView = () => {
    switch (currentView) {
      case ViewState.DASHBOARD:
        return <Dashboard />;
      case ViewState.ANALYZER:
        return <BlueprintWorkspace fileToAnalyze={fileToAnalyze} onAnalyzed={() => setFileToAnalyze(null)} activeProject={activeProject} />;
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

  // Small wrapper component so we can call useToastHelpers() inside the
  // ToastProvider context. It listens for global 'file-upload' events and
  // uploads the file to the server under the currently active project.
  const GlobalUploadHandlerWrapper: React.FC<{
    activeProject: string | null;
    setProjects: (u: any) => void;
    setCurrentView: (v: ViewState) => void;
  }> = ({ activeProject, setProjects, setCurrentView }) => {
    const toast = useToastHelpers();

    useEffect(() => {
      const handler = async (e: Event) => {
        const detail = (e as CustomEvent).detail;
        if (!detail) return;
        const file: File = detail as File;

        if (!activeProject) {
          try {
            toast.warning('No active project', 'Select or create a project to upload', {
              duration: 8000,
              clickable: true,
              onClick: () => {
                setCurrentView(ViewState.PROJECTS);
                try { window.dispatchEvent(new CustomEvent('open-create-project')); } catch {}
              }
            });
          } catch (err) {}
          setCurrentView(ViewState.PROJECTS);
          try { window.dispatchEvent(new CustomEvent('open-create-project')); } catch {}
          return;
        }

        try {
          const form = new FormData();
          form.append('file', file, file.name);
          const res = await fetch(`/api/projects/${encodeURIComponent(activeProject)}/files`, {
            method: 'POST',
            body: form,
          });
          if (!res.ok) throw new Error('Upload failed: ' + res.statusText);
          const data = await res.json();
          const updatedProject = data.project || data;

          if (data.projects && Array.isArray(data.projects)) {
            setProjects(data.projects);
          } else if (updatedProject) {
            setProjects((prev: any[]) => {
              const idx = prev.findIndex(p => p.id === updatedProject.id);
              if (idx === -1) return [updatedProject, ...prev];
              const copy = [...prev];
              copy[idx] = { ...copy[idx], ...updatedProject };
              return copy;
            });
          }

          try { window.dispatchEvent(new CustomEvent('projects-updated', { detail: updatedProject })); } catch {}

          try {
            const projectName = (updatedProject && updatedProject.name) ? updatedProject.name : 'project';
            toast.success('Upload complete', `${file.name} uploaded to ${projectName}`, { duration: 5000 });
          } catch (err) {}
        } catch (err) {
          console.error('Global upload handler error', err);
          try { window.dispatchEvent(new CustomEvent('upload-error', { detail: (err as Error).message || err })); } catch {}
          try {
            const msg = err instanceof Error ? err.message : String(err);
            toast.error('Upload failed', msg, { duration: 8000 });
          } catch (e) {}
        }
      };

      window.addEventListener('file-upload', handler as EventListener);
      return () => window.removeEventListener('file-upload', handler as EventListener);
    }, [activeProject, setProjects, setCurrentView, toast]);

    return null;
  };

  return (
    <ToastProvider>
      {/* Global upload handler needs to live inside ToastProvider so it can call useToastHelpers() */}
      <GlobalUploadHandlerWrapper
        activeProject={activeProject}
        setProjects={setProjects}
        setCurrentView={setCurrentView}
      />
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
    </ToastProvider>
  );
};

export default App;
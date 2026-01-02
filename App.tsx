import React, { useState } from 'react';
import UnifiedLayout from './components/unified-ui/UnifiedLayout';
import Dashboard from './components/Dashboard';
import BlueprintWorkspace from './components/features/blueprint-viewer/BlueprintWorkspace';
import CopilotModal from './components/CopilotModal';
import { ViewState } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.DASHBOARD);
  const [showCopilot, setShowCopilot] = useState(false);

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

  const renderView = () => {
    switch (currentView) {
      case ViewState.DASHBOARD:
        return <Dashboard />;
      case ViewState.ANALYZER:
        return <BlueprintWorkspace />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <UnifiedLayout currentView={currentView} onChangeView={handleChangeView}>
        {renderView()}

        {/* Copilot modal — mounted at app root so it overlays content seamlessly */}
        <CopilotModal open={showCopilot} onClose={() => setShowCopilot(false)} />
    </UnifiedLayout>
  );
};

export default App;
import React, { useState } from 'react';
import UnifiedLayout from './components/unified-ui/UnifiedLayout';
import Dashboard from './components/Dashboard';
import BlueprintWorkspace from './components/features/blueprint-viewer/BlueprintWorkspace';
import Copilot from './components/Copilot';
import { ViewState } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.DASHBOARD);

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
      case ViewState.COPILOT:
        document.title = `${base} — Copilot`;
        break;
      default:
        document.title = base;
    }
  }, [currentView]);

  const renderView = () => {
    switch (currentView) {
      case ViewState.DASHBOARD:
        return <Dashboard />;
      case ViewState.ANALYZER:
        return <BlueprintWorkspace />;
      case ViewState.COPILOT:
        return <Copilot />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <UnifiedLayout currentView={currentView} onChangeView={setCurrentView}>
        {renderView()}
    </UnifiedLayout>
  );
};

export default App;
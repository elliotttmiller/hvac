import React, { useState } from 'react';
import UnifiedLayout from './components/unified-ui/UnifiedLayout';
import Dashboard from './components/Dashboard';
import BlueprintWorkspace from './components/features/blueprint-viewer/BlueprintWorkspace';
import Copilot from './components/Copilot';
import KnowledgeGraph from './components/KnowledgeGraph';
import { ViewState } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.DASHBOARD);

  const renderView = () => {
    switch (currentView) {
      case ViewState.DASHBOARD:
        return <Dashboard />;
      case ViewState.ANALYZER:
        return <BlueprintWorkspace />;
      case ViewState.COPILOT:
        return <Copilot />;
      case ViewState.KNOWLEDGE_GRAPH:
        return <KnowledgeGraph />;
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
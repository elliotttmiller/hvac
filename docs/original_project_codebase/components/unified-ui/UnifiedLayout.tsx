import React from 'react';
import LeftSidebar from './LeftSidebar';
import TopHeader from './TopHeader';
import { ViewState } from '../../types';

interface UnifiedLayoutProps {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
  children: React.ReactNode;
}

const UnifiedLayout: React.FC<UnifiedLayoutProps> = ({ currentView, onChangeView, children }) => {
  return (
    <div className="flex h-screen bg-slate-950 text-slate-200 font-sans overflow-hidden">
      <LeftSidebar currentView={currentView} onChangeView={onChangeView} />
      <div className="flex-1 flex flex-col min-w-0">
        <TopHeader />
        <main className="flex-1 flex flex-col min-h-0 relative">
            {children}
        </main>
      </div>
    </div>
  );
};

export default UnifiedLayout;
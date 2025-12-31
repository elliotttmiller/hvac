import React from 'react';
import { ViewState } from '../types';
import { 
  LayoutDashboard, 
  ScanLine, 
  BrainCircuit, 
  Settings, 
  FileText
} from 'lucide-react';

interface SidebarProps {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView }) => {
  
  const navItems = [
    { id: ViewState.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
    { id: ViewState.ANALYZER, label: 'Blueprint Analysis', icon: ScanLine },
    { id: ViewState.COPILOT, label: 'AI Copilot', icon: BrainCircuit },
  ];

  return (
    <div className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-full shrink-0">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-cyan-500 rounded-sm flex items-center justify-center">
            <span className="font-bold text-slate-950">H</span>
        </div>
        <span className="font-bold text-lg tracking-wider text-slate-100">HVAC<span className="text-cyan-400">.AI</span></span>
      </div>

      <div className="px-4 mb-6">
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2 px-2">Platform</div>
        <nav className="space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onChangeView(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md transition-all duration-200 group ${
                currentView === item.id 
                  ? 'bg-cyan-500/10 text-cyan-400 border-r-2 border-cyan-400' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <item.icon size={20} className={currentView === item.id ? 'text-cyan-400' : 'text-slate-500 group-hover:text-slate-300'} />
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="px-4 mt-auto mb-6">
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2 px-2">System</div>
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors">
          <FileText size={20} className="text-slate-500" />
          <span className="text-sm font-medium">Reports</span>
        </button>
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors">
          <Settings size={20} className="text-slate-500" />
          <span className="text-sm font-medium">Settings</span>
        </button>
      </div>
      
      <div className="p-4 border-t border-slate-800 text-xs text-slate-600 text-center">
        v2.4.0-ray-dist
      </div>
    </div>
  );
};

export default Sidebar;
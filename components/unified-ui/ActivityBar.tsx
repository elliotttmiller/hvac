import React from 'react';
import { ViewState } from '../../types';
import { 
  LayoutGrid, 
  Presentation,
  Sparkles, 
  Settings2, 
  HelpCircle,
  Folder
} from 'lucide-react';

interface ActivityBarProps {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
}

const ActivityBar: React.FC<ActivityBarProps> = ({ currentView, onChangeView }) => {
  const navItems = [
    { id: ViewState.DASHBOARD, label: 'Dashboard', icon: LayoutGrid },
  { id: ViewState.ANALYZER, label: 'Workspace', icon: Presentation },
    { id: ViewState.PROJECTS, label: 'Projects', icon: Folder },
  ];

  return (
    <div className="w-14 bg-[#09090b] border-r border-white/5 flex flex-col items-center py-4 shrink-0 z-40 select-none">
      <div className="flex-1 w-full flex flex-col gap-4 px-2">
        {navItems.map((item) => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onChangeView(item.id)}
              className={`relative w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 group ${
                isActive 
                  ? 'bg-zinc-800/50 text-white' 
                  : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'
              }`}
              title={item.label}
            >
               <item.icon 
                  size={20} 
                  strokeWidth={1.5} 
                  className={`transition-all duration-300 ${isActive ? 'scale-100' : 'scale-95 group-hover:scale-100'}`}
                  fill={isActive && item.id === ViewState.COPILOT ? "currentColor" : "none"} 
               />
               
               {/* Active Indicator (Dot) */}
               {isActive && (
                   <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-1 h-3 bg-white rounded-r-full shadow-[0_0_10px_rgba(255,255,255,0.5)]"></div>
               )}
            </button>
          );
        })}
      </div>

      <div className="w-full flex flex-col gap-4 px-2 pb-2">
         <button className="w-10 h-10 rounded-xl flex items-center justify-center text-zinc-500 hover:text-zinc-200 hover:bg-white/5 transition-all">
            <HelpCircle size={20} strokeWidth={1.5} />
         </button>
         <button className="w-10 h-10 rounded-xl flex items-center justify-center text-zinc-500 hover:text-zinc-200 hover:bg-white/5 transition-all">
            <Settings2 size={20} strokeWidth={1.5} />
         </button>
      </div>
    </div>
  );
};

export default ActivityBar;
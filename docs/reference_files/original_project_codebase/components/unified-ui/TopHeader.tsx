import React from 'react';

const TopHeader: React.FC = () => {
  return (
    <header className="h-14 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between px-6 shrink-0 backdrop-blur-sm">
        <div className="flex items-center gap-2 text-sm text-slate-500">
            <span className="text-slate-300">Project:</span>
            <select className="bg-transparent border-none text-slate-300 font-medium focus:ring-0 cursor-pointer outline-none">
                <option>HQ_Tower_Main_Retrofit</option>
                <option>Annex_B_New_Construction</option>
            </select>
        </div>
        <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-xs font-mono text-emerald-500">SYSTEM ONLINE</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-purple-500 shadow-lg shadow-cyan-500/20"></div>
        </div>
    </header>
  );
};

export default TopHeader;
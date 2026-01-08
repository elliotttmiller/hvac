import React from 'react';
import { 
  Bell, 
  Wind,
  Menu
} from 'lucide-react';

export default function TopHeader() {
  return (
    <header className="h-14 border-b border-white/5 bg-[#09090b]/80 backdrop-blur-xl grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center px-4 shrink-0 select-none z-50 sticky top-0">
        
        {/* Left: Mobile Trigger (Empty on Desktop to maintain grid) */}
        <div className="flex items-center justify-start">
             <button className="md:hidden p-1.5 text-zinc-400 hover:text-white rounded-md hover:bg-white/5">
                <Menu size={16} />
             </button>
             {/* Spacer/Empty for Desktop to balance grid */}
             <div className="hidden md:block w-1"></div>
        </div>

    {/* Center: Branding (Architectural Pill) - clickable to go to homepage/dashboard */}
    <div className="flex items-center justify-center">
      <button
        onClick={() => { window.location.href = '/'; }}
        title="Go to dashboard"
        className="flex items-center gap-2.5 px-5 py-1.5 bg-zinc-900/50 border border-white/5 rounded-full shadow-[0_0_20px_-12px_rgba(255,255,255,0.2)] backdrop-blur-md group hover:border-white/10 hover:bg-zinc-900/80 transition-all"
      >
        <div className="relative flex items-center justify-center">
           <Wind size={16} className="text-[#2563eb] relative z-10 transition-transform duration-700 group-hover:rotate-180" strokeWidth={2} />
           <div className="absolute inset-0 bg-[#2563eb]/20 blur-[8px] rounded-full group-hover:bg-[#2563eb]/30 transition-all"></div>
        </div>
        <div className="flex items-baseline gap-0.5">
          <span className="text-sm font-bold text-white tracking-normal leading-none">HVAC</span>
          <span className="text-sm font-light text-zinc-500 group-hover:text-zinc-400 transition-colors">AI</span>
        </div>
      </button>
    </div>

        {/* Right: Modern Actions */}
        <div className="flex items-center justify-end gap-3">
             
             {/* Icons */}
             <button className="relative w-8 h-8 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-all group" title="Notifications">
                <Bell size={16} strokeWidth={1.5} className="group-hover:scale-105 transition-transform" />
                <div className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-[#2563eb] rounded-full border border-[#09090b]"></div>
             </button>

             <div className="h-4 w-px bg-white/10 mx-1"></div>

             {/* Profile */}
             <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#2563eb] to-[#2563eb] p-[1px] cursor-pointer hover:shadow-lg hover:shadow-[#2563eb]/20 transition-all shrink-0">
                <div className="w-full h-full rounded-[7px] bg-[#09090b] flex items-center justify-center overflow-hidden relative">
                    <span className="text-[10px] font-bold text-white z-10">JD</span>
                </div>
             </div>
        </div>
    </header>
  );
}
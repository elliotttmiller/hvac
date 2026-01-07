import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { Activity, ShieldCheck, AlertCircle, Zap, Cpu, TrendingUp, Clock, Upload, FolderPlus, FileSearch, Settings } from 'lucide-react';

const Dashboard: React.FC = () => {
  // Mock Data
  const processingData = [
    { name: '08:00', throughput: 12, latency: 120 },
    { name: '10:00', throughput: 45, latency: 135 },
    { name: '12:00', throughput: 89, latency: 110 },
    { name: '14:00', throughput: 67, latency: 140 },
    { name: '16:00', throughput: 102, latency: 95 },
    { name: '18:00', throughput: 34, latency: 105 },
    { name: '20:00', throughput: 20, latency: 115 },
  ];

  const stats = [
    { label: 'System Health', value: '99.9%', sub: 'All nodes operational', icon: Activity, color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/20' },
    { label: 'Processed Docs', value: '2,405', sub: '+28% vs last week', icon: Cpu, color: 'text-cyan-400', bg: 'bg-cyan-400/10', border: 'border-cyan-400/20' },
    { label: 'Active Alerts', value: '3', sub: 'Requires Review', icon: AlertCircle, color: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-400/20' },
    { label: 'Efficiency', value: '142ms', sub: 'Avg Inference Time', icon: Zap, color: 'text-purple-400', bg: 'bg-purple-400/10', border: 'border-purple-400/20' },
  ];

  const quickActions = [
    { label: 'Upload Document', icon: Upload, color: 'text-cyan-400', bg: 'bg-cyan-400/10', border: 'border-cyan-400/20', description: 'Analyze new P&ID' },
    { label: 'New Project', icon: FolderPlus, color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/20', description: 'Create workspace' },
    { label: 'Search Files', icon: FileSearch, color: 'text-purple-400', bg: 'bg-purple-400/10', border: 'border-purple-400/20', description: 'Find documents' },
    { label: 'Settings', icon: Settings, color: 'text-zinc-400', bg: 'bg-zinc-400/10', border: 'border-zinc-400/20', description: 'Configure system' },
  ];

  return (
    // Use an explicit solid background to avoid any remaining colored gradient bleed
    <div className="flex-1 p-8 overflow-y-auto bg-[#09090b]">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Hero Section with Gradient */}
        <header className="relative">
          {/* Neutral, dark overlay to keep dashboard background consistent with app theme */}
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-900/5 via-zinc-800/4 to-zinc-900/5 blur-3xl -z-10" />
          <h1 className="text-3xl font-bold text-white tracking-tight">Welcome back</h1>
          <p className="text-zinc-400 text-sm mt-2">Monitor your HVAC analysis platform and system performance.</p>
        </header>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <button
              key={index}
              className="bg-zinc-900/60 backdrop-blur-sm border border-zinc-800 hover:border-zinc-700 p-4 rounded-xl hover:bg-zinc-900/80 transition-all duration-200 group text-left"
            >
              <div className={`${action.bg} ${action.color} border ${action.border} p-3 rounded-lg inline-flex mb-3 group-hover:scale-110 transition-transform`}>
                <action.icon size={20} />
              </div>
              <div className="text-sm font-medium text-zinc-200 group-hover:text-white transition-colors">{action.label}</div>
              <div className="text-xs text-zinc-500 mt-1">{action.description}</div>
            </button>
          ))}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <div key={index} className="bg-zinc-900/60 backdrop-blur-sm border border-zinc-800 p-5 rounded-xl hover:bg-zinc-900/80 transition-all duration-200 group">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-2 rounded-lg ${stat.bg} ${stat.color} border ${stat.border}`}>
                  <stat.icon size={18} />
                </div>
                {index === 0 && <span className="relative flex h-2 w-2 mt-1">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>}
              </div>
              <div className="text-2xl font-bold text-white tabular-nums tracking-tight">{stat.value}</div>
              <div className="text-sm font-medium text-zinc-400 mt-1">{stat.label}</div>
              <div className="text-xs text-zinc-500 mt-2 flex items-center gap-1">
                 {index === 1 && <TrendingUp size={10} className="text-emerald-500"/>}
                 {stat.sub}
              </div>
            </div>
          ))}
        </div>

        {/* Main Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-zinc-900/60 backdrop-blur-sm border border-zinc-800 rounded-xl p-6">
             <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-sm font-medium text-zinc-200">Throughput Velocity</h3>
                    <p className="text-xs text-zinc-500">Documents processed per hour</p>
                </div>
                <div className="flex gap-2">
                    <span className="px-2 py-1 rounded bg-zinc-800 text-[10px] text-zinc-400 font-mono">1H</span>
                    <span className="px-2 py-1 rounded bg-cyan-500/10 text-[10px] text-cyan-400 font-mono border border-cyan-500/20">24H</span>
                    <span className="px-2 py-1 rounded bg-zinc-800 text-[10px] text-zinc-400 font-mono">7D</span>
                </div>
             </div>
         <div className="h-72 w-full">
           {/* Use a fixed pixel height for the ResponsiveContainer to avoid layout timing issues
              when parent containers are measured by the browser (flex/overflow layouts).
              h-72 (Tailwind) equals 18rem -> typically 288px. */}
           <ResponsiveContainer width="100%" height={288}>
                  <AreaChart data={processingData}>
                    <defs>
                      <linearGradient id="colorThroughput" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                    <XAxis dataKey="name" stroke="#52525b" tick={{fill: '#71717a', fontSize: 10}} tickLine={false} axisLine={false} dy={10} />
                    <YAxis stroke="#52525b" tick={{fill: '#71717a', fontSize: 10}} tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', color: '#f4f4f5', borderRadius: '8px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)' }}
                      itemStyle={{ color: '#06b6d4' }}
                    />
                    <Area type="monotone" dataKey="throughput" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#colorThroughput)" />
                  </AreaChart>
                </ResponsiveContainer>
             </div>
          </div>

          <div className="bg-zinc-900/60 backdrop-blur-sm border border-zinc-800 rounded-xl p-6 flex flex-col">
             <h3 className="text-sm font-medium text-zinc-200 mb-4">Recent Activity</h3>
             <div className="flex-1 space-y-4">
                {[1, 2, 3, 4].map((_, i) => (
                    <div key={i} className="flex gap-3 items-start group">
                        <div className="mt-1 w-2 h-2 rounded-full bg-zinc-700 group-hover:bg-cyan-400 transition-colors"></div>
                        <div className="flex-1">
                            <p className="text-xs text-zinc-300 group-hover:text-white transition-colors">
                                {i === 0 ? "ASHRAE 62.1 Violation Detected" : "Blueprint analysis completed"}
                            </p>
                            <p className="text-[10px] text-zinc-500 mt-0.5">Project HQ_Tower_A • {10 + i * 15}m ago</p>
                        </div>
                    </div>
                ))}
             </div>
             <button className="w-full mt-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-300 hover:text-white transition-colors">
                View Audit Log
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
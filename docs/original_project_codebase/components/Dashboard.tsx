import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Activity, CheckCircle, AlertTriangle, Zap, Server, Cpu } from 'lucide-react';

const Dashboard: React.FC = () => {
  // Mock Data
  const processingData = [
    { name: '08:00', blueprints: 12 },
    { name: '10:00', blueprints: 45 },
    { name: '12:00', blueprints: 89 },
    { name: '14:00', blueprints: 67 },
    { name: '16:00', blueprints: 102 },
    { name: '18:00', blueprints: 34 },
  ];

  const complianceData = [
    { name: 'Compliant', value: 85 },
    { name: 'Warnings', value: 10 },
    { name: 'Violations', value: 5 },
  ];

  const COLORS = ['#10b981', '#f59e0b', '#ef4444'];

  const stats = [
    { label: 'Ray Serve Replicas', value: '12/12', sub: 'YOLOv11 Inference Nodes Active', icon: Server, color: 'text-emerald-400' },
    { label: 'Documents Processed', value: '2,405', sub: '+28% throughput (Semantic Cache)', icon: CheckCircle, color: 'text-cyan-400' },
    { label: 'Compliance Alerts', value: '3', sub: 'ASHRAE 62.1 Violations', icon: AlertTriangle, color: 'text-red-400' },
    { label: 'VLM Accuracy', value: '98.2%', sub: 'Hybrid OCR + Vision', icon: Cpu, color: 'text-purple-400' },
  ];

  return (
    <div className="flex-1 p-8 overflow-y-auto bg-slate-950">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-100">System Dashboard</h1>
        <p className="text-slate-400 mt-2">Real-time telemetry of Distributed HVAC AI Pipeline.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-slate-900 border border-slate-800 p-6 rounded-lg shadow-sm hover:border-slate-700 transition-colors group">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-md bg-slate-800 ${stat.color} group-hover:bg-slate-800/80 transition-colors`}>
                <stat.icon size={24} />
              </div>
              <span className="text-[10px] font-mono text-emerald-500 bg-emerald-950/30 border border-emerald-500/30 px-2 py-1 rounded">HEALTHY</span>
            </div>
            <div className="text-3xl font-bold text-slate-100 mb-1">{stat.value}</div>
            <div className="text-sm font-medium text-slate-400">{stat.label}</div>
            <div className="text-xs text-slate-600 mt-2">{stat.sub}</div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Throughput Chart */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-slate-200 mb-6">Inference Throughput (Docs/Hour)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={processingData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" tick={{fill: '#64748b'}} />
                <YAxis stroke="#64748b" tick={{fill: '#64748b'}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f1f5f9' }}
                />
                <Line type="monotone" dataKey="blueprints" stroke="#06b6d4" strokeWidth={3} dot={{ r: 4, fill: '#06b6d4' }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Compliance Distribution */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-slate-200 mb-6">Compliance Validation</h3>
          <div className="h-64 flex flex-col items-center justify-center">
             <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={complianceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {complianceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f1f5f9' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex gap-4 mt-4 text-xs text-slate-400">
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-emerald-500"></div> Pass</div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-amber-500"></div> Warn</div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-red-500"></div> Fail</div>
            </div>
          </div>
        </div>

      </div>
      
      {/* Recent Alerts */}
      <div className="mt-8 bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-slate-200">System Alerts & Notifications</h3>
            <button className="text-xs text-cyan-400 hover:text-cyan-300">View All</button>
        </div>
        <div className="divide-y divide-slate-800">
            {[1, 2, 3].map((_, i) => (
                <div key={i} className="px-6 py-4 flex items-center justify-between hover:bg-slate-800/50 transition-colors">
                    <div className="flex items-center gap-4">
                        <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                        <div>
                            <p className="text-sm font-medium text-slate-200">ASHRAE 62.1 Violation Detected</p>
                            <p className="text-xs text-slate-500">Project: HQ_Tower_Block_A.dwg • Sector 4 VAV sizing insufficient for occupancy.</p>
                        </div>
                    </div>
                    <span className="text-xs text-slate-600 font-mono">10m ago</span>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
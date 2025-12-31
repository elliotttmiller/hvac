import React from 'react';
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, Cell } from 'recharts';

const KnowledgeGraph: React.FC = () => {
  // Simulating graph nodes as scatter points for visual effect in Recharts
  // In a real D3 impl, this would be a force-directed graph
  const data = [
    { x: 10, y: 30, z: 200, name: 'Main Chiller', type: 'Equipment' },
    { x: 30, y: 50, z: 100, name: 'AHU-L1', type: 'Distribution' },
    { x: 30, y: 10, z: 100, name: 'AHU-L2', type: 'Distribution' },
    { x: 50, y: 60, z: 50, name: 'VAV-101', type: 'Terminal' },
    { x: 50, y: 40, z: 50, name: 'VAV-102', type: 'Terminal' },
    { x: 50, y: 20, z: 50, name: 'VAV-201', type: 'Terminal' },
    { x: 70, y: 50, z: 30, name: 'T-Stat 101', type: 'Sensor' },
    { x: 70, y: 30, z: 30, name: 'T-Stat 201', type: 'Sensor' },
  ];

  const COLORS = {
    'Equipment': '#ef4444',
    'Distribution': '#f59e0b',
    'Terminal': '#06b6d4',
    'Sensor': '#10b981'
  };

  return (
    <div className="flex-1 bg-slate-950 p-8 flex flex-col h-full">
      <header className="mb-6 flex justify-between items-end">
        <div>
            <h1 className="text-3xl font-bold text-slate-100">Knowledge Graph</h1>
            <p className="text-slate-400 mt-2">Visualizing semantic relationships and system topology.</p>
        </div>
        <div className="flex gap-4">
            {Object.keys(COLORS).map(type => (
                <div key={type} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{backgroundColor: (COLORS as any)[type]}}></div>
                    <span className="text-xs text-slate-400 uppercase tracking-wide">{type}</span>
                </div>
            ))}
        </div>
      </header>

      <div className="flex-1 bg-slate-900 border border-slate-800 rounded-lg overflow-hidden relative">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <XAxis type="number" dataKey="x" name="stature" hide domain={[0, 100]} />
            <YAxis type="number" dataKey="y" name="weight" hide domain={[0, 80]} />
            <ZAxis type="number" dataKey="z" range={[100, 800]} />
            <Tooltip 
                cursor={{ strokeDasharray: '3 3' }} 
                content={({ payload }) => {
                    if (payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                            <div className="bg-slate-950 border border-slate-800 p-3 rounded shadow-xl">
                                <p className="text-slate-200 font-bold">{data.name}</p>
                                <p className="text-xs text-slate-500">{data.type}</p>
                            </div>
                        );
                    }
                    return null;
                }}
            />
            <Scatter name="Nodes" data={data} fill="#8884d8">
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={(COLORS as any)[entry.type]} stroke="rgba(255,255,255,0.2)" strokeWidth={2} />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
        
        {/* Overlay Lines (Fake connections for visual) */}
        <svg className="absolute inset-0 pointer-events-none w-full h-full opacity-30">
            {/* Simple connection simulation based on roughly mapped percentages */}
            <line x1="10%" y1="37.5%" x2="30%" y2="62.5%" stroke="white" strokeWidth="1" />
            <line x1="10%" y1="37.5%" x2="30%" y2="12.5%" stroke="white" strokeWidth="1" />
            
            <line x1="30%" y1="62.5%" x2="50%" y2="75%" stroke="white" strokeWidth="1" />
            <line x1="30%" y1="62.5%" x2="50%" y2="50%" stroke="white" strokeWidth="1" />
            
            <line x1="30%" y1="12.5%" x2="50%" y2="25%" stroke="white" strokeWidth="1" />
        </svg>

        <div className="absolute bottom-4 right-4 bg-slate-950/80 backdrop-blur border border-slate-800 p-4 rounded-lg max-w-xs">
            <h4 className="text-sm font-bold text-slate-200 mb-2">Graph Insight</h4>
            <p className="text-xs text-slate-400">
                Found <span className="text-cyan-400">3</span> disconnected sensor nodes in Sector 4. 
                Possible data ingestion latency from IoT gateway.
            </p>
        </div>
      </div>
    </div>
  );
};

export default KnowledgeGraph;
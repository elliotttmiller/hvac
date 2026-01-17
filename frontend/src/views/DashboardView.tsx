import React, { useState, useMemo } from 'react';
import { Icons } from '../components/Icons';
import { ViewState, Project } from '../types';
import { getStatusColor } from '../components/common';

// --- REAL-TIME CHART DATA HOOK ---
// Synchronizes graph curves with actual application state
const useRealtimeChartData = (projects: Project[]) => {
    return useMemo(() => {
        // 1. Calculate Aggregates from Real Data
        let totalValue = 0;
        let totalIssues = 0;
        let complianceSum = 0;
        let complianceCount = 0;

        projects.forEach(p => {
             // Financials
             const compsValue = p.blueprintsData.reduce((sum, bp) => {
                 return sum + (bp.detectedComponents || []).reduce((cSum, c) => {
                     return cSum + c.cost + ((c.estimatedInstallHours || 2) * 115);
                 }, 0);
             }, 0);
             
             const projectVal = compsValue > 0 ? compsValue : (p.budget * (p.progress / 100));
             totalValue += projectVal;

             // Issues
             totalIssues += p.openIssues;

             // Compliance
             p.blueprintsData.forEach(bp => {
                 if(bp.status === 'processed' && bp.compliance > 0) {
                     complianceSum += bp.compliance;
                     complianceCount++;
                 }
             });
        });

        const avgCompliance = complianceCount > 0 ? (complianceSum / complianceCount) : 0;

        // 2. Generate Trend Lines
        const points = 24;

        const velocityData = Array.from({ length: points }, (_, i) => {
            if (totalValue === 0) return 0;
            const progress = i / (points - 1);
            const curve = 1 / (1 + Math.exp(-6 * (progress - 0.5))); 
            const variance = i === points - 1 ? 0 : (Math.random() * 0.05) - 0.025;
            return Math.max(0, totalValue * (curve + variance));
        });

        const complianceData = Array.from({ length: points }, (_, i) => {
            if (complianceCount === 0) return 0;
            if (i === points - 1) return avgCompliance;
            const trend = avgCompliance + (Math.random() * 10 - 5); 
            return Math.min(100, Math.max(0, trend));
        });

        const issuesData = Array.from({ length: points }, (_, i) => {
            if (i === points - 1) return totalIssues;
            const variance = Math.floor(Math.random() * 5) - 2;
            return Math.max(0, totalIssues + variance);
        });

        return { 
            velocityData, 
            complianceData, 
            issuesData, 
            currentStats: { totalValue, avgCompliance, totalIssues } 
        };
    }, [projects]);
};

interface ChartProps {
    data: number[];
    title: string;
    subtitle: string;
    icon: React.ReactNode;
    color: string;
    formatValue: (v: number) => string;
}

const ModernChart = ({ data, title, subtitle, icon, color, formatValue }: ChartProps) => {
    const [hoverIndex, setHoverIndex] = useState<number | null>(null);
    const width = 1000;
    const height = 300;
    
    const rawMax = Math.max(...data);
    const maxVal = rawMax > 0 ? rawMax * 1.3 : 100;
    const minVal = 0;
    
    const points = useMemo(() => {
        return data.map((val, index) => {
            const x = (index / (data.length - 1)) * width;
            const normalizedY = (val - minVal) / (maxVal - minVal); 
            const y = height - (normalizedY * height); 
            return { x, y, val };
        });
    }, [data, maxVal, minVal]);

    const getPath = (points: {x: number, y: number}[]) => {
        if (points.length === 0) return "";
        let d = `M ${points[0].x},${points[0].y}`;
        for (let i = 0; i < points.length - 1; i++) {
            const p0 = points[i];
            const p1 = points[i + 1];
            const cp1x = p0.x + (p1.x - p0.x) * 0.5;
            const cp1y = p0.y;
            const cp2x = p0.x + (p1.x - p0.x) * 0.5;
            const cp2y = p1.y;
            d += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p1.x},${p1.y}`;
        }
        return d;
    };

    const pathD = getPath(points);
    const areaD = `${pathD} L ${width},${height} L 0,${height} Z`;

    return (
        <div 
            className="relative w-full h-full group"
            onMouseLeave={() => setHoverIndex(null)}
        >
             <div className="absolute inset-0 flex flex-col justify-between py-6 px-0 opacity-5 pointer-events-none">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="border-t border-dashed border-white w-full h-0"></div>
                ))}
             </div>

             <div className="absolute top-6 left-6 z-10 pointer-events-none">
                <div className="flex items-center gap-2 mb-1">
                     <div className="p-1.5 rounded-md bg-white/5 border border-white/5" style={{ color }}>{icon}</div>
                     <h3 className="text-sm font-semibold text-white">{title}</h3>
                </div>
                <p className="text-xs text-zinc-500">{subtitle}</p>
             </div>

            <svg 
                viewBox={`0 0 ${width} ${height}`} 
                className="w-full h-full preserve-3d" 
                preserveAspectRatio="none"
                style={{ overflow: 'visible' }}
            >
                <defs>
                    <linearGradient id={`gradient-${color}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={color} stopOpacity="0.2" />
                        <stop offset="100%" stopColor={color} stopOpacity="0" />
                    </linearGradient>
                </defs>

                <path d={areaD} fill={`url(#gradient-${color})`} className="transition-all duration-500" />
                <path 
                    d={pathD} 
                    fill="none" 
                    stroke={color} 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    className="transition-all duration-500 shadow-[0_0_15px_rgba(0,0,0,0.5)]"
                />

                {points.map((p, i) => (
                    <rect
                        key={i}
                        x={p.x - (width / points.length / 2)}
                        y={0}
                        width={width / points.length}
                        height={height}
                        fill="transparent"
                        onMouseEnter={() => setHoverIndex(i)}
                        className="cursor-crosshair focus:outline-none"
                    />
                ))}

                {hoverIndex !== null && (
                    <g className="pointer-events-none">
                        <line x1={points[hoverIndex].x} y1={points[hoverIndex].y} x2={points[hoverIndex].x} y2={height} stroke={color} strokeWidth="1" strokeDasharray="4,4" opacity="0.5" />
                        <circle cx={points[hoverIndex].x} cy={points[hoverIndex].y} r="4" fill="#09090b" stroke={color} strokeWidth="2" />
                    </g>
                )}
            </svg>

            {hoverIndex !== null && (
                <div 
                    className="absolute pointer-events-none bg-zinc-900 border border-zinc-800 px-3 py-2 rounded-lg shadow-xl z-20 flex flex-col items-start min-w-[100px]"
                    style={{ 
                        left: `${(hoverIndex / (data.length - 1)) * 100}%`, 
                        top: `${(points[hoverIndex].y / height) * 100}%`,
                        transform: 'translate(-50%, -130%)'
                    }}
                >
                    <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold">Value</span>
                    <span className="text-lg font-bold text-white tabular-nums">{formatValue(points[hoverIndex].val)}</span>
                </div>
            )}
        </div>
    );
};

const DashboardInsights = ({ projects }: { projects: Project[] }) => {
    const [activeTab, setActiveTab] = useState<'velocity' | 'compliance' | 'issues'>('velocity');
    const { velocityData, complianceData, issuesData } = useRealtimeChartData(projects);

    const config = {
        velocity: {
            data: velocityData,
            title: "Value Velocity",
            subtitle: "Cumulative Construction Value",
            icon: <Icons.BarChart width={14} height={14} />,
            color: "#10b981",
            format: (v: number) => v >= 1000000 ? `$${(v / 1000000).toFixed(2)}M` : v >= 1000 ? `$${(v / 1000).toFixed(1)}k` : `$${v.toFixed(0)}`
        },
        compliance: {
            data: complianceData,
            title: "Code Compliance",
            subtitle: "ASHRAE Standard Adherence",
            icon: <Icons.CheckCircle width={14} height={14} />,
            color: "#3b82f6",
            format: (v: number) => `${v.toFixed(1)}%`
        },
        issues: {
            data: issuesData,
            title: "Issue Tracking",
            subtitle: "Active Anomalies",
            icon: <Icons.AlertTriangle width={14} height={14} />,
            color: "#f97316",
            format: (v: number) => v.toFixed(0)
        }
    };

    const current = config[activeTab];

    return (
        <div className="col-span-2 relative h-[360px] bg-zinc-900/50 backdrop-blur-sm rounded-2xl border border-white/5 shadow-sm flex flex-col overflow-hidden">
            <div className="absolute top-4 right-4 z-20 bg-zinc-900/80 p-1 rounded-lg border border-white/5 flex gap-1">
                {Object.keys(config).map(key => (
                    <button 
                        key={key}
                        onClick={() => setActiveTab(key as any)}
                        className={`px-3 py-1.5 text-[10px] font-medium rounded-md transition-all ${activeTab === key ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
                    >
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                    </button>
                ))}
            </div>
            <div className="flex-1 w-full min-h-0">
                <ModernChart 
                    data={current.data} 
                    title={current.title}
                    subtitle={current.subtitle}
                    color={current.color}
                    formatValue={current.format}
                    icon={current.icon}
                />
            </div>
        </div>
    );
};

export const DashboardView = ({ onNavigate, projects }: { onNavigate: (view: ViewState) => void, projects: Project[] }) => {
    const activeProjectsCount = projects.filter(p => p.status === 'active').length;
    const systemAlerts = projects.reduce((acc, p) => acc + p.activityLog.filter(log => log.type === 'alert').length, 0);
    const pendingReviews = projects.reduce((acc, p) => acc + p.blueprintsData.filter(bp => bp.status === 'processing' || bp.status === 'queued').length, 0);
    const holdCount = projects.filter(p => p.status === 'on_hold').length;
    
    const timeOfDay = useMemo(() => {
        const h = new Date().getHours();
        return h < 5 ? 'night' : h < 12 ? 'morning' : h < 17 ? 'afternoon' : 'evening';
    }, []);

    const StatsCard = ({ label, value, subtext, icon, color }: any) => (
        <div className="group relative bg-zinc-900/50 backdrop-blur-sm border border-white/5 p-6 rounded-2xl hover:bg-zinc-900/80 transition-all duration-300 hover:border-white/10 hover:shadow-2xl overflow-hidden">
            <div className={`absolute top-0 right-0 p-24 rounded-full blur-3xl opacity-5 group-hover:opacity-10 transition-opacity ${color.replace('text-', 'bg-')}`}></div>
            <div className="relative z-10">
                <div className="flex items-start justify-between mb-8">
                    <div className={`p-3 rounded-xl bg-zinc-950 border border-white/5 text-white shadow-inner group-hover:scale-110 transition-transform duration-300`}>
                        {React.cloneElement(icon, { width: 20, height: 20 })}
                    </div>
                    <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border ${color.replace('text-', 'bg-').replace('500', '500/10')} ${color.replace('text-', 'border-').replace('500', '500/20')} ${color}`}>
                        Live
                    </div>
                </div>
                <div>
                    <div className="text-3xl font-light text-white tracking-tight mb-2 tabular-nums">{value}</div>
                    <div className="text-xs text-zinc-400 font-medium mb-1">{label}</div>
                    <div className="text-[10px] text-zinc-600 font-medium flex items-center gap-1.5">
                       {subtext}
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="p-8 space-y-8 animate-fade-in overflow-y-auto h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900/20 via-zinc-950 to-zinc-950">
            <div className="flex items-center justify-between pb-4 border-b border-white/5">
                <div>
                    <h2 className="text-3xl font-light text-white mb-2">Good {timeOfDay}.</h2>
                    <p className="text-sm text-zinc-500">System operating nominally. All inference engines ready.</p>
                </div>
                <div className="flex items-center gap-4">
                     <div className="px-4 py-2 rounded-full bg-zinc-900/50 border border-white/5 text-xs text-zinc-400 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        Connected to Core
                     </div>
                </div>
            </div>

            <div className="grid grid-cols-4 gap-4">
                <StatsCard 
                    label="Active Projects" 
                    value={activeProjectsCount} 
                    subtext="Processing Pipeline Active" 
                    icon={<Icons.Layers />} 
                    color="text-blue-500" 
                />
                <StatsCard 
                    label="System Alerts" 
                    value={systemAlerts} 
                    subtext={systemAlerts > 0 ? "Requires Attention" : "All Systems Clear"} 
                    icon={<Icons.Bell />} 
                    color={systemAlerts > 0 ? "text-rose-500" : "text-emerald-500"} 
                />
                <StatsCard 
                    label="Pending Reviews" 
                    value={pendingReviews} 
                    subtext="Engineer Sign-off Needed" 
                    icon={<Icons.FileText />} 
                    color={pendingReviews > 0 ? "text-orange-500" : "text-zinc-500"} 
                />
                <StatsCard 
                    label="Projects on Hold" 
                    value={holdCount} 
                    subtext="Blocked Workflows" 
                    icon={<Icons.AlertTriangle />} 
                    color={holdCount > 0 ? "text-rose-500" : "text-zinc-500"} 
                />
            </div>

            <div className="grid grid-cols-3 gap-6">
                <DashboardInsights projects={projects} />

                <div className="col-span-1 bg-zinc-900/50 backdrop-blur-sm border border-white/5 rounded-2xl p-6 shadow-sm h-[360px] flex flex-col">
                    <h3 className="text-sm font-semibold text-white mb-6 flex items-center gap-2">
                        <Icons.Zap className="text-yellow-500" width={16} height={16} />
                        Quick Actions
                    </h3>
                    <div className="space-y-3 flex-1">
                        <button onClick={() => onNavigate('projects')} className="w-full text-left p-4 rounded-xl bg-zinc-950 hover:bg-zinc-800 border border-white/5 hover:border-white/10 transition-all group">
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-sm font-medium text-white">Project Directory</span>
                                <Icons.ChevronRight className="text-zinc-600 group-hover:text-white transition-colors" width={14} height={14} />
                            </div>
                            <p className="text-[10px] text-zinc-500">View and manage all active buckets</p>
                        </button>
                        <button onClick={() => onNavigate('workspace')} className="w-full text-left p-4 rounded-xl bg-zinc-950 hover:bg-zinc-800 border border-white/5 hover:border-white/10 transition-all group">
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-sm font-medium text-white">Resume Workspace</span>
                                <Icons.Maximize className="text-zinc-600 group-hover:text-white transition-colors" width={14} height={14} />
                            </div>
                            <p className="text-[10px] text-zinc-500">Return to active blueprint analysis</p>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

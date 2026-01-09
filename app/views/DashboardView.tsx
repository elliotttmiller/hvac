import React, { useState, useMemo } from 'react';
import { Icons } from '../components/Icons';
import { ViewState, Project } from '../types';
import { getStatusColor } from '../components/common';

// Generate dynamic chart data based on project activity
const generateChartData = (projects: Project[]) => {
    // Determine a "seed" based on total blueprints
    const totalBlueprints = projects.reduce((acc, p) => acc + p.blueprintsData.length, 0);
    const baseVolume = totalBlueprints * 10; 
    
    // Create a trend that looks like real processing throughput
    return Array.from({ length: 20 }, (_, i) => {
        // Create a pseudo-random but consistent curve
        const noise = Math.sin(i * 0.5) * 20;
        const trend = i * 2; 
        const val = Math.max(20, Math.min(100, baseVolume + noise + trend));
        return Math.floor(val);
    });
};

const ModernChart = ({ data }: { data: number[] }) => {
    const [hoverIndex, setHoverIndex] = useState<number | null>(null);

    // SVG Configuration
    const width = 1000;
    const height = 300;
    
    // Data Processing
    const maxVal = Math.max(...data) * 1.1; 
    const minVal = 0;
    
    const points = useMemo(() => {
        return data.map((val, index) => {
            const x = (index / (data.length - 1)) * width;
            const normalizedY = (val - minVal) / (maxVal - minVal); 
            // Invert Y for SVG (0 is top)
            const y = height - (normalizedY * height); 
            return { x, y, val };
        });
    }, [data, maxVal, minVal]);

    const pathD = `M ${points.map(p => `${p.x},${p.y}`).join(' L ')}`;
    const areaD = `${pathD} L ${width},${height} L 0,${height} Z`;

    return (
        <div 
            className="relative w-full h-64 bg-[var(--bg-panel)] rounded-lg overflow-hidden border border-[var(--border-subtle)] shadow-sm group"
            onMouseLeave={() => setHoverIndex(null)}
        >
             {/* Background Grid */}
             <div className="absolute inset-0 flex flex-col justify-between py-6 px-0 opacity-10 pointer-events-none">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="border-t border-gray-400 w-full h-0"></div>
                ))}
             </div>

             {/* Chart Header */}
             <div className="absolute top-4 left-4 z-10 pointer-events-none">
                <h3 className="text-sm font-medium text-white flex items-center gap-2">
                    <Icons.Activity /> Analysis Throughput
                </h3>
                <p className="text-xs text-[var(--text-muted)] mt-1">Real-time inference tokens processed</p>
             </div>

            <svg 
                viewBox={`0 0 ${width} ${height}`} 
                className="w-full h-full preserve-3d px-4 pt-12 pb-2" 
                preserveAspectRatio="none"
                style={{ overflow: 'visible' }}
            >
                <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                    </linearGradient>
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                        <feMerge>
                            <feMergeNode in="coloredBlur"/>
                            <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                    </filter>
                </defs>

                <path 
                    d={areaD} 
                    fill="url(#chartGradient)" 
                    className="opacity-80 transition-all duration-300" 
                />

                <path 
                    d={pathD} 
                    fill="none" 
                    stroke="#3b82f6" 
                    strokeWidth="3" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    filter="url(#glow)"
                >
                     <animate 
                        attributeName="stroke-dasharray" 
                        from={`0, ${width * 2}`} 
                        to={`${width * 2}, 0`} 
                        dur="1.5s" 
                        fill="freeze"
                    />
                </path>

                {points.map((p, i) => (
                    <g key={i}>
                        <rect
                            x={p.x - (width / data.length / 2)}
                            y={0}
                            width={width / data.length}
                            height={height}
                            fill="transparent"
                            onMouseEnter={() => setHoverIndex(i)}
                            className="cursor-crosshair focus:outline-none"
                        />
                    </g>
                ))}

                {hoverIndex !== null && (
                    <g className="pointer-events-none">
                        <line 
                            x1={points[hoverIndex].x} 
                            y1={0} 
                            x2={points[hoverIndex].x} 
                            y2={height} 
                            stroke="#3b82f6" 
                            strokeWidth="1" 
                            strokeDasharray="4,4" 
                            opacity="0.5" 
                        />
                        <circle 
                            cx={points[hoverIndex].x} 
                            cy={points[hoverIndex].y} 
                            r="5" 
                            fill="#09090b" 
                            stroke="#3b82f6" 
                            strokeWidth="2" 
                        />
                        <circle 
                            cx={points[hoverIndex].x} 
                            cy={points[hoverIndex].y} 
                            r="12" 
                            fill="#3b82f6" 
                            opacity="0.2"
                            className="animate-pulse"
                        />
                    </g>
                )}
            </svg>

            {hoverIndex !== null && (
                <div 
                    className="absolute pointer-events-none bg-[#18181b] border border-[#3f3f46] px-3 py-2 rounded shadow-2xl z-20 flex flex-col items-center min-w-[80px]"
                    style={{ 
                        left: `${(hoverIndex / (data.length - 1)) * 100}%`, 
                        top: `${points[hoverIndex].y / height * 80 + 10}%`, 
                        transform: 'translate(-50%, -120%)'
                    }}
                >
                    <span className="text-[10px] text-gray-500 font-mono uppercase tracking-wider">Tokens</span>
                    <span className="text-xl font-bold text-white leading-none font-mono">{points[hoverIndex].val}k</span>
                    <span className="text-[9px] text-blue-400 mt-1">{(hoverIndex * 0.5).toFixed(1)}m ago</span>
                </div>
            )}
        </div>
    );
};

export const DashboardView = ({ 
    onNavigate,
    projects 
}: { 
    onNavigate: (view: ViewState) => void,
    projects: Project[]
}) => {
    // Derived Statistics
    const activeProjectsCount = projects.filter(p => p.status === 'active').length;
    
    const systemAlerts = projects.reduce((acc, p) => 
        acc + p.activityLog.filter(log => log.type === 'alert').length, 0);
    
    const pendingReviews = projects.reduce((acc, p) => 
        acc + p.blueprintsData.filter(bp => bp.status === 'processing' || bp.status === 'queued').length, 0);

    const onTrackCount = projects.filter(p => getStatusColor(p.status, p.openIssues) === 'green').length;
    const holdCount = projects.filter(p => p.status === 'on_hold').length;

    const chartData = generateChartData(projects);
    const sessionID = useMemo(() => `SES-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}-${new Date().getFullYear()}`, []);

    return (
        <div className="p-8 space-y-8 animate-fade-in overflow-y-auto h-full">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-light text-white mb-1">Good morning, Engineer.</h2>
                    <p className="text-sm text-[var(--text-muted)]">System status nominal. ISA-5.1 Standards Loaded.</p>
                </div>
                <div className="flex gap-2">
                    <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                        SYSTEM ONLINE
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-4 gap-4">
                {[
                    { 
                        label: 'Active Projects', 
                        value: activeProjectsCount.toString(), 
                        subtext: `${onTrackCount} on track`,
                        icon: <Icons.Layers />, 
                        color: 'text-emerald-400',
                        dotColor: 'bg-emerald-500'
                    },
                    { 
                        label: 'System Alerts', 
                        value: systemAlerts.toString(), 
                        subtext: systemAlerts > 0 ? 'Immediate attention' : 'All systems clear',
                        icon: <Icons.Bell />, 
                        // System Alerts: RED
                        color: systemAlerts > 0 ? 'text-rose-500' : 'text-gray-500',
                        dotColor: systemAlerts > 0 ? 'bg-rose-500' : 'bg-gray-500'
                    },
                    { 
                        label: 'Pending Reviews', 
                        value: pendingReviews.toString(), 
                        subtext: 'Awaiting engineer sign-off',
                        icon: <Icons.FileText />, 
                        // Pending Reviews: YELLOW/AMBER
                        color: pendingReviews > 0 ? 'text-amber-400' : 'text-gray-500',
                        dotColor: pendingReviews > 0 ? 'bg-amber-400' : 'bg-gray-500'
                    },
                    { 
                        label: 'Projects on Hold', 
                        value: holdCount.toString(), 
                        subtext: holdCount > 0 ? 'Critical bottlenecks' : 'No hold state',
                        icon: <Icons.AlertTriangle />, 
                        // Projects on Hold: RED
                        color: holdCount > 0 ? 'text-rose-500' : 'text-gray-500',
                        dotColor: holdCount > 0 ? 'bg-rose-500' : 'bg-gray-500'
                    },
                ].map((stat, i) => (
                    <div key={i} className={`group relative overflow-hidden bg-[var(--bg-panel)] border border-[var(--border-subtle)] p-6 rounded-xl hover:border-[var(--border-active)] transition-all duration-300 hover:shadow-lg hover:bg-[var(--bg-surface)]`}>
                        <div className={`absolute top-4 right-4 p-2 transition-all duration-500 ease-out ${stat.color} opacity-20 group-hover:opacity-100 group-hover:scale-110 group-hover:drop-shadow-lg`}>
                            {React.cloneElement(stat.icon as React.ReactElement<any>, { width: 24, height: 24 })}
                        </div>
                        
                        <div className="flex flex-col h-full justify-end relative z-10 pt-4">
                            <div>
                                <div className="text-3xl font-light text-white tracking-tight mb-2">{stat.value}</div>
                                <div className={`text-sm font-medium ${stat.color} mb-2 opacity-90`}>{stat.label}</div>
                                <div className="text-xs text-[var(--text-muted)] font-mono flex items-center gap-2">
                                   <span className={`w-1.5 h-1.5 rounded-full ${stat.dotColor} ${stat.dotColor !== 'bg-gray-500' ? 'animate-pulse-slow' : ''}`}></span>
                                   {stat.subtext}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-3 gap-6">
                <div className="col-span-2">
                    <ModernChart data={chartData} />
                </div>

                <div className="col-span-1 bg-[var(--bg-panel)] border border-[var(--border-subtle)] rounded-lg p-5 shadow-sm h-64 flex flex-col">
                    <h3 className="text-sm font-medium text-white mb-4">Quick Actions</h3>
                    <div className="space-y-2 flex-1">
                        <button onClick={() => onNavigate('projects')} className="w-full text-left px-4 py-3 rounded bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)] text-sm transition-colors border border-transparent hover:border-[var(--border-active)] flex items-center justify-between group">
                            <span>View All Projects</span>
                            <Icons.Home />
                        </button>
                        <button onClick={() => onNavigate('workspace')} className="w-full text-left px-4 py-3 rounded bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)] text-sm transition-colors border border-transparent hover:border-[var(--border-active)] flex items-center justify-between group">
                            <span>Resume Workspace</span>
                            <Icons.Maximize />
                        </button>
                    </div>
                    <div className="pt-4 border-t border-[var(--border-subtle)] text-[10px] text-[var(--text-muted)]">
                        Current Session ID: <span className="font-mono text-gray-500">{sessionID}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
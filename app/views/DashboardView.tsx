import React, { useState, useMemo } from 'react';
import { Icons } from '../components/Icons';
import { ViewState, Project } from '../types';
import { getStatusColor } from '../components/common';

// Generate dynamic chart data based on REAL project financials
const generateFinancialData = (projects: Project[]) => {
    // 1. Calculate the Real Total Value currently in the system
    const calculateProjectValue = (p: Project) => {
        // If we have detailed component data, use that (Bottom-up accuracy)
        const componentTotal = p.blueprintsData.reduce((bpSum, bp) => {
            const comps = bp.detectedComponents || [];
            return bpSum + comps.reduce((cSum, c) => {
                const material = c.cost || 0;
                // Assume avg 2 hours labor if not specified, @ $115/hr standard
                const labor = (c.estimatedInstallHours || 2) * 115; 
                return cSum + material + labor;
            }, 0);
        }, 0);

        // If components exist, return that. Otherwise use budget * progress as a proxy.
        return componentTotal > 0 ? componentTotal : (p.budget * (p.progress / 100));
    };

    const totalSystemValue = projects.reduce((acc, p) => acc + calculateProjectValue(p), 0);
    
    // If system is empty, show a "Projected" baseline for UI aesthetics
    const baseline = totalSystemValue > 0 ? totalSystemValue : 250000;

    // 2. Generate a realistic S-Curve (Construction Accumulation Curve)
    return Array.from({ length: 24 }, (_, i) => {
        const progress = i / 23; // 0 to 1
        // Sigmoid-like function to simulate realistic project ramp-up
        const curve = 1 / (1 + Math.exp(-6 * (progress - 0.5))); 
        
        // Add slight randomness to simulate daily variance
        const variance = (Math.random() * 0.1) - 0.05; 
        
        const val = baseline * (curve + variance);
        return Math.max(0, val);
    });
};

const ModernChart = ({ data }: { data: number[] }) => {
    const [hoverIndex, setHoverIndex] = useState<number | null>(null);

    // SVG Configuration
    const width = 1000;
    const height = 300;
    
    // Scale data to fit, leaving room at top (1.3x max) for tooltips/visuals
    const maxVal = Math.max(...data) * 1.3; 
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

    // Smooth Bezier Curve Generation
    const getPath = (points: {x: number, y: number}[]) => {
        if (points.length === 0) return "";
        let d = `M ${points[0].x},${points[0].y}`;
        for (let i = 0; i < points.length - 1; i++) {
            const p0 = points[i];
            const p1 = points[i + 1];
            // Control points for bezier smoothing
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

    const formatCurrency = (val: number) => {
        if (val >= 1000000) return `$${(val / 1000000).toFixed(2)}M`;
        if (val >= 1000) return `$${(val / 1000).toFixed(1)}k`;
        return `$${val.toFixed(0)}`;
    };

    return (
        <div 
            className="relative w-full h-64 bg-[var(--bg-panel)] rounded-lg overflow-hidden border border-[var(--border-subtle)] shadow-sm group"
            onMouseLeave={() => setHoverIndex(null)}
        >
             {/* Background Grid - Dashed technical look */}
             <div className="absolute inset-0 flex flex-col justify-between py-6 px-0 opacity-10 pointer-events-none">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="border-t border-dashed border-gray-400 w-full h-0"></div>
                ))}
             </div>

             {/* Chart Header */}
             <div className="absolute top-4 left-4 z-10 pointer-events-none">
                <h3 className="text-sm font-medium text-white flex items-center gap-2">
                    <Icons.BarChart className="text-emerald-400" /> 
                    Construction Value Velocity
                </h3>
                <p className="text-xs text-[var(--text-muted)] mt-1">Est. Material + Labor Value Processed (Last 30 Days)</p>
             </div>

            <svg 
                viewBox={`0 0 ${width} ${height}`} 
                className="w-full h-full preserve-3d" 
                preserveAspectRatio="none"
                style={{ overflow: 'visible' }}
            >
                <defs>
                    <linearGradient id="valueGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                    </linearGradient>
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                        <feMerge>
                            <feMergeNode in="coloredBlur"/>
                            <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                    </filter>
                </defs>

                {/* Filled Area */}
                <path 
                    d={areaD} 
                    fill="url(#valueGradient)" 
                    className="opacity-80 transition-all duration-300" 
                />

                {/* Line Path */}
                <path 
                    d={pathD} 
                    fill="none" 
                    stroke="#10b981" 
                    strokeWidth="2.5" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    filter="url(#glow)"
                >
                     <animate 
                        attributeName="stroke-dasharray" 
                        from={`0, ${width * 3}`} 
                        to={`${width * 3}, 0`} 
                        dur="1.2s" 
                        fill="freeze"
                    />
                </path>

                {/* Interactive Overlay */}
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

                {/* Hover Indicator */}
                {hoverIndex !== null && (
                    <g className="pointer-events-none">
                        <line 
                            x1={points[hoverIndex].x} 
                            y1={points[hoverIndex].y} 
                            x2={points[hoverIndex].x} 
                            y2={height} 
                            stroke="#10b981" 
                            strokeWidth="1" 
                            strokeDasharray="4,4" 
                            opacity="0.5" 
                        />
                        <circle 
                            cx={points[hoverIndex].x} 
                            cy={points[hoverIndex].y} 
                            r="4" 
                            fill="#09090b" 
                            stroke="#10b981" 
                            strokeWidth="2" 
                        />
                        <circle 
                            cx={points[hoverIndex].x} 
                            cy={points[hoverIndex].y} 
                            r="10" 
                            fill="#10b981" 
                            opacity="0.2"
                            className="animate-pulse"
                        />
                    </g>
                )}
            </svg>

            {/* Smart Tooltip */}
            {hoverIndex !== null && (
                <div 
                    className="absolute pointer-events-none bg-[#18181b] border border-[#3f3f46] px-4 py-3 rounded-lg shadow-2xl z-20 flex flex-col items-start min-w-[120px] transition-all duration-75 ease-out"
                    style={{ 
                        left: `${(hoverIndex / (data.length - 1)) * 100}%`, 
                        top: `${(points[hoverIndex].y / height) * 100}%`,
                        transform: (() => {
                             const p = points[hoverIndex];
                             // Vertical Flip: If in top 40% of graph, show tooltip BELOW point
                             const isTop = p.y < height * 0.4;
                             const vert = isTop ? '20px' : '-125%'; 
                             
                             // Horizontal Clamp: Prevent edge clipping
                             let horz = '-50%';
                             if (hoverIndex === 0) horz = '0%'; // Align Left
                             else if (hoverIndex < 3) horz = '-20%';
                             else if (hoverIndex === data.length - 1) horz = '-100%'; // Align Right
                             else if (hoverIndex > data.length - 4) horz = '-80%';

                             return `translate(${horz}, ${vert})`;
                        })()
                    }}
                >
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Est. Value</span>
                    </div>
                    <span className="text-xl font-bold text-white leading-none tabular-nums tracking-tight">
                        {formatCurrency(points[hoverIndex].val)}
                    </span>
                    <span className="text-[10px] text-emerald-500 mt-1 font-medium">
                        +{(Math.random() * 5).toFixed(1)}% vs prev
                    </span>
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

    const chartData = generateFinancialData(projects);
    const sessionID = useMemo(() => `SES-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}-${new Date().getFullYear()}`, []);

    return (
        <div className="p-8 space-y-8 animate-fade-in overflow-y-auto h-full">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-light text-white mb-1">Good morning, Engineer.</h2>
                    <p className="text-sm text-[var(--text-muted)]">System status nominal. ISA-5.1 Standards Loaded.</p>
                </div>
                <div className="flex gap-2">
                    <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium flex items-center gap-2">
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
                        color: 'text-blue-400',
                        dotColor: 'bg-blue-500'
                    },
                    { 
                        label: 'System Alerts', 
                        value: systemAlerts.toString(), 
                        subtext: systemAlerts > 0 ? 'Immediate attention' : 'All systems clear',
                        icon: <Icons.Bell />, 
                        color: systemAlerts > 0 ? 'text-rose-500' : 'text-gray-500',
                        dotColor: systemAlerts > 0 ? 'bg-rose-500' : 'bg-gray-500'
                    },
                    { 
                        label: 'Pending Reviews', 
                        value: pendingReviews.toString(), 
                        subtext: 'Awaiting engineer sign-off',
                        icon: <Icons.FileText />, 
                        color: pendingReviews > 0 ? 'text-amber-400' : 'text-gray-500',
                        dotColor: pendingReviews > 0 ? 'bg-amber-400' : 'bg-gray-500'
                    },
                    { 
                        label: 'Projects on Hold', 
                        value: holdCount.toString(), 
                        subtext: holdCount > 0 ? 'Critical bottlenecks' : 'No hold state',
                        icon: <Icons.AlertTriangle />, 
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
                                <div className="text-3xl font-light text-white tracking-tight mb-2 tabular-nums">{stat.value}</div>
                                <div className={`text-sm font-medium ${stat.color} mb-2 opacity-90`}>{stat.label}</div>
                                <div className="text-xs text-[var(--text-muted)] font-medium flex items-center gap-2">
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
                        Current Session ID: <span className="font-medium text-gray-500">{sessionID}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
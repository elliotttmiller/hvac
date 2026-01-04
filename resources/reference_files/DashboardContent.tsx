'use client';

import React, { useEffect, useState } from 'react';
import { 
  FileText, 
  Layers, 
  DollarSign, 
  CheckCircle2, 
  Zap,
  Plus,
  Clock,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  ArrowUpRight,
  Activity,
  FolderOpen,
  Sparkles,
  Upload,
  BarChart3,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  trendUp?: boolean;
  description?: string;
  delay?: number;
}

function MetricCard({ title, value, icon, trend, trendUp, description, delay = 0 }: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <Card className="bg-card border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 group">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <p className="text-sm text-muted-foreground mb-2 uppercase tracking-wide font-medium">{title}</p>
              <p className="text-4xl font-bold text-foreground bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text">
                {value}
              </p>
            </div>
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              {icon}
            </div>
          </div>
          {trend && (
            <div className="flex items-center gap-2 pt-3 border-t border-border/50">
              <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${trendUp ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                {trendUp ? (
                  <TrendingUp className="h-3 w-3 text-green-500" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-500" />
                )}
                <span className={`text-xs font-semibold ${trendUp ? 'text-green-500' : 'text-red-500'}`}>
                  {trend}
                </span>
              </div>
              <span className="text-xs text-muted-foreground">vs last month</span>
            </div>
          )}
          {description && (
            <p className="text-xs text-muted-foreground mt-2">{description}</p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

interface ActivityItem {
  id: string;
  type: 'analysis' | 'quote' | 'review';
  title: string;
  description: string;
  timestamp: string;
  status: 'complete' | 'processing' | 'pending';
}

interface RecentProject {
  id: string;
  name: string;
  location: string;
  components: number;
  status: string;
  thumbnail?: string;
  progress: number;
}

interface ProjectApiResponse {
  id: string;
  name: string;
  location?: string;
  components?: number;
  status?: string;
}

// Progress calculation constants
const PROGRESS_BASE = 60; // Minimum progress percentage
const PROGRESS_RANGE = 40; // Range of possible progress values (60-100%)
const PROGRESS_MODULO = 4; // Number of distinct progress bands

/**
 * Generates a deterministic progress percentage based on project ID
 * This ensures consistent UI across renders without using random values
 */
function calculateProjectProgress(projectId: string): number {
  // Use base-36 parsing to convert ID to number, then modulo to get consistent band
  const progressBand = parseInt(projectId, 36) % PROGRESS_MODULO;
  return PROGRESS_BASE + (progressBand * (PROGRESS_RANGE / PROGRESS_MODULO));
}

function ActivityFeed({ activities }: { activities: ActivityItem[] }) {
  const statusConfig = {
    complete: {
      color: 'text-green-500',
      bg: 'bg-green-500/10',
      border: 'border-green-500/20',
      icon: CheckCircle2,
    },
    processing: {
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20',
      icon: Clock,
    },
    pending: {
      color: 'text-amber-500',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20',
      icon: AlertCircle,
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <Card className="bg-card border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Recent Activity
              </CardTitle>
              <CardDescription className="mt-1">Latest blueprint processing and analysis</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[350px] pr-4">
            <div className="space-y-3">
              {activities.map((activity, index) => {
                const config = statusConfig[activity.status];
                const StatusIcon = config.icon;
                return (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="flex gap-4 p-3 rounded-lg hover:bg-accent/50 transition-colors duration-200 cursor-pointer border border-transparent hover:border-border"
                  >
                    <div className={`h-10 w-10 rounded-lg ${config.bg} border ${config.border} flex items-center justify-center flex-shrink-0`}>
                      <StatusIcon className={`h-5 w-5 ${config.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-semibold text-foreground">{activity.title}</p>
                        <Badge variant="outline" className={`text-xs ${config.color} ${config.bg} ${config.border} border`}>
                          {activity.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{activity.description}</p>
                      <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {activity.timestamp}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function RecentProjectsGrid({ projects }: { projects: RecentProject[] }) {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="bg-card border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <FolderOpen className="h-5 w-5 text-primary" />
                Recent Projects
              </CardTitle>
              <CardDescription className="mt-1">Your latest HVAC projects</CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={() => router.push('/projects')}>
              View All
              <ArrowUpRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                onClick={() => router.push(`/workspace/${project.id}`)}
                className="p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-accent/30 transition-all duration-300 cursor-pointer group"
              >
                <div className="flex items-start gap-4">
                  <div className="h-16 w-16 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                    <FileText className="h-8 w-8 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-foreground truncate">{project.name}</h4>
                        <p className="text-xs text-muted-foreground mt-0.5">{project.location}</p>
                      </div>
                      <Badge variant="secondary" className="text-xs whitespace-nowrap">
                        {project.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
                      <div className="flex items-center gap-1">
                        <Layers className="h-3 w-3" />
                        <span>{project.components} components</span>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium text-foreground">{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} className="h-1.5" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function QuickActions() {
  const router = useRouter();

  const actions = [
    {
      icon: Sparkles,
      title: 'AI Analysis',
      description: 'Upload and analyze blueprint with AI',
      color: 'from-blue-500 to-purple-500',
      onClick: () => router.push('/projects/new'),
    },
    {
      icon: Plus,
      title: 'New Project',
      description: 'Create a new HVAC project',
      color: 'from-green-500 to-emerald-500',
      onClick: () => router.push('/projects/new'),
    },
    {
      icon: Upload,
      title: 'Quick Upload',
      description: 'Upload blueprint documents',
      color: 'from-orange-500 to-red-500',
      onClick: () => router.push('/projects/new'),
    },
    {
      icon: BarChart3,
      title: 'View Reports',
      description: 'Access analytics and insights',
      color: 'from-cyan-500 to-blue-500',
      onClick: () => router.push('/projects'),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            Quick Actions
          </CardTitle>
          <CardDescription>Common tasks and workflows</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-3">
          {actions.map((action, index) => {
            const Icon = action.icon;
            return (
              <motion.div
                key={action.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.4 + index * 0.05 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outline"
                  className="w-full h-auto flex-col items-start gap-3 p-4 border-border hover:border-primary/50 hover:bg-accent/50 transition-all duration-300 group"
                  onClick={action.onClick}
                >
                  <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-semibold text-foreground">{action.title}</div>
                    <div className="text-xs text-muted-foreground mt-1 whitespace-normal">{action.description}</div>
                  </div>
                </Button>
              </motion.div>
            );
          })}
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function DashboardContent() {
  const [metrics, setMetrics] = useState({
    blueprints: 0,
    components: 0,
    estValue: '$0',
    compliance: 0,
  });

  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [recentProjects, setRecentProjects] = useState<RecentProject[]>([]);

  useEffect(() => {
    // Fetch dashboard data
    fetch('/api/dashboard/metrics')
      .then((res) => res.json())
      .then((data) => {
        setMetrics({
          blueprints: data.blueprints || 24,
          components: data.components || 156,
          estValue: data.estValue || '$45,200',
          compliance: data.compliance || 94,
        });
      })
      .catch(() => {
        // Use default values on error
        setMetrics({
          blueprints: 24,
          components: 156,
          estValue: '$45,200',
          compliance: 94,
        });
      });

    fetch('/api/dashboard/activity')
      .then((res) => res.json())
      .then((data) => {
        setActivities(data.activities || []);
      })
      .catch(() => {
        // Use default mock data on error
        setActivities([
          {
            id: '1',
            type: 'analysis',
            title: 'Blueprint Analysis Complete',
            description: 'Commercial HVAC Floor Plan - 45 components detected',
            timestamp: '2 hours ago',
            status: 'complete',
          },
          {
            id: '2',
            type: 'quote',
            title: 'Quote Generated',
            description: 'Office Building Retrofit - $23,500 estimate',
            timestamp: '5 hours ago',
            status: 'complete',
          },
          {
            id: '3',
            type: 'analysis',
            title: 'Processing Blueprint',
            description: 'Residential HVAC System - Analyzing components...',
            timestamp: '1 day ago',
            status: 'processing',
          },
          {
            id: '4',
            type: 'review',
            title: 'Pending Review',
            description: 'Industrial Ductwork Layout - Manual review required',
            timestamp: '2 days ago',
            status: 'pending',
          },
        ]);
      });

    // Fetch recent projects
    fetch('/api/projects')
      .then((res) => res.json())
      .then((data) => {
        const projects = (data.projects || []).slice(0, 3).map((p: ProjectApiResponse): RecentProject => ({
          id: p.id,
          name: p.name,
          location: p.location || 'Unknown Location',
          components: p.components || 0,
          status: p.status || 'Active',
          progress: calculateProjectProgress(p.id),
        }));
        setRecentProjects(projects);
      })
      .catch(() => {
        // Use mock data
        setRecentProjects([
          {
            id: '1',
            name: 'Commercial HVAC Installation',
            location: 'Downtown Office Complex',
            components: 45,
            status: 'In Progress',
            progress: 75,
          },
          {
            id: '2',
            name: 'Residential Retrofit',
            location: 'Suburban Home',
            components: 28,
            status: 'Active',
            progress: 60,
          },
          {
            id: '3',
            name: 'Industrial Warehouse',
            location: 'East Industrial Park',
            components: 82,
            status: 'Planning',
            progress: 30,
          },
        ]);
      });
  }, []);

  return (
    <div className="h-full flex-1 bg-background flex flex-col">
      <div className="flex-1 overflow-auto">
        <div className="p-8 space-y-8">
          {/* Hero Section with Gradient */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent rounded-3xl blur-3xl" />
            <div className="relative">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-foreground text-4xl font-bold tracking-tight">
                    Dashboard
                  </h1>
                  <p className="text-muted-foreground text-sm mt-1">
                    Welcome to your HVAC AI command center
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              title="Blueprints Analyzed"
              value={metrics.blueprints}
              icon={<FileText className="h-6 w-6 text-primary" />}
              trend="+12%"
              trendUp={true}
              delay={0}
              description="Total processed documents"
            />
            <MetricCard
              title="Components Detected"
              value={metrics.components}
              icon={<Layers className="h-6 w-6 text-primary" />}
              trend="+8%"
              trendUp={true}
              delay={0.1}
              description="HVAC elements identified"
            />
            <MetricCard
              title="Est. Project Value"
              value={metrics.estValue}
              icon={<DollarSign className="h-6 w-6 text-primary" />}
              delay={0.2}
              description="Combined estimates"
            />
            <MetricCard
              title="Compliance Score"
              value={`${metrics.compliance}%`}
              icon={<CheckCircle2 className="h-6 w-6 text-primary" />}
              trend="+3%"
              trendUp={true}
              delay={0.3}
              description="Building codes adherence"
            />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Projects - Takes 2 columns */}
            <div className="lg:col-span-2">
              <RecentProjectsGrid projects={recentProjects} />
            </div>

            {/* Quick Actions - Takes 1 column */}
            <div>
              <QuickActions />
            </div>
          </div>

          {/* Activity Feed - Full Width */}
          <div>
            <ActivityFeed activities={activities} />
          </div>
        </div>
      </div>
    </div>
  );
}

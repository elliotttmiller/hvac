import React from 'react';
import { 
  FolderOpen, 
  Plus, 
  Layers, 
  MapPin, 
  Briefcase 
} from 'lucide-react';

interface Project { id: string; name: string; root: string }

interface Props {
  projects: Project[];
  activeProject?: string | null;
  onSelectProject?: (id: string) => void;
  onProjectsChange?: (list: Project[]) => void;
  onOpenProject?: (id: string) => void;
}

import ProjectDetailModal from './ProjectDetailModal.tsx';
import { DashboardCard, StatusBadge } from './primitives';

const ProjectsPage: React.FC<Props> = ({ projects, activeProject, onSelectProject, onProjectsChange, onOpenProject }) => {
  const [creating, setCreating] = React.useState(false);
  const [name, setName] = React.useState('');
  const [root, setRoot] = React.useState('.');
  const [loading, setLoading] = React.useState(false);
  const [detailProject, setDetailProject] = React.useState<Project | null>(null);

  const createProject = async () => {
    if (!name || !root) return;
    setLoading(true);
    try {
      const res = await fetch('/api/projects', {
        method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ name, root })
      });
      if (!res.ok) throw new Error('Failed to create');
      const { project } = await res.json();
      // refresh projects list from server and notify parent
      const listRes = await fetch('/api/projects');
      const { projects: newList } = await listRes.json();
      if (onProjectsChange) onProjectsChange(newList);
      // select new project
      if (onSelectProject) onSelectProject(project.id);
      setName('');
      setRoot('.');
      setCreating(false);
    } catch (e) {
      console.error('Create project failed, falling back to local:', e);
      // Fallback: create locally and notify parent so UI remains functional in dev
      const project = { id: Date.now().toString(), name, root };
      if (onProjectsChange) onProjectsChange([...projects, project]);
      if (onSelectProject) onSelectProject(project.id);
      setName('');
      setRoot('.');
      setCreating(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full overflow-auto bg-[#09090b]">
      <div className="container mx-auto py-8 px-6 max-w-7xl">
        {/* Hero Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-[#2563eb]/20 to-[#2563eb]/10 border border-[#2563eb]/20 flex items-center justify-center">
                <Briefcase className="h-7 w-7 text-[#2563eb]" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-zinc-100 tracking-tight">Projects</h1>
                <p className="text-sm text-zinc-500 mt-1">Manage your HVAC project workspace</p>
              </div>
            </div>
            <button 
              onClick={() => setCreating(!creating)} 
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#2563eb] hover:bg-[#2563eb] text-white font-medium transition-all shadow-lg shadow-[#2563eb]/20 hover:shadow-[#2563eb]/30"
            >
              <Plus size={18} />
              {creating ? 'Cancel' : 'New Project'}
            </button>
          </div>
        </div>

        {/* Create Project Form */}
        {creating && (
          <div className="mb-8 p-6 rounded-xl bg-[#18181b] border border-zinc-800 shadow-xl">
            <h3 className="text-sm font-semibold text-zinc-300 mb-4 uppercase tracking-wider">Create New Project</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-2">Project Name</label>
                <input 
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                  placeholder="e.g., Commercial HVAC Installation" 
                  className="w-full p-3 bg-[#0f0f10] border border-zinc-800 rounded-lg text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-[#2563eb] transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-2">Location (Optional)</label>
                <input 
                  value={root} 
                  onChange={e => setRoot(e.target.value)} 
                  placeholder="Specify location (e.g., ./projects)" 
                  className="w-full p-3 bg-[#0f0f10] border border-zinc-800 rounded-lg text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-[#2563eb] transition-colors"
                />
              </div>
            </div>
            <div className="mt-4 flex gap-3">
              <button 
                disabled={loading || !name || !root} 
                onClick={createProject} 
                className="px-4 py-2 rounded-lg bg-[#2563eb] hover:bg-[#2563eb] text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {loading ? 'Creating...' : 'Create Project'}
              </button>
              <button 
                onClick={() => setCreating(false)} 
                className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Projects Grid */}
        {projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-6 rounded-xl border-2 border-dashed border-zinc-800 bg-[#18181b]/50">
            <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center mb-4">
              <FolderOpen className="h-10 w-10 text-zinc-600" />
            </div>
            <h3 className="text-lg font-semibold text-zinc-300 mb-2">No Projects Found</h3>
            <p className="text-sm text-zinc-500 text-center max-w-sm mb-6">
              Get started by creating your first HVAC project workspace.
            </p>
            <button 
              onClick={() => setCreating(true)} 
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#2563eb] hover:bg-[#2563eb] text-white font-medium transition-all"
            >
              <Plus size={18} />
              Create Your First Project
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {projects.map(p => {
              const isActive = activeProject === p.id;
              
              return (
                <DashboardCard
                  key={p.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => setDetailProject(p)}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setDetailProject(p); }}
                  size="lg"
                  className={`group relative overflow-hidden transform will-change-transform ${
                    isActive
                      ? 'border-zinc-700 ring-1 ring-white/6 shadow-[0_0_26px_rgba(255,255,255,0.03)] scale-[1.003]'
                      : 'border-zinc-800 hover:border-zinc-700 hover:shadow-[0_0_18px_rgba(255,255,255,0.02)] hover:scale-[1.01]'
                  }`}
                >
                  {/* Active Project Indicator - subtle soft glow */}
                  {isActive && (
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: 'rgba(255,255,255,0.04)' }} />
                  )}

                  <div style={{ padding: 0 }}>
                    {/* Project Icon & Header */}
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-zinc-100 mb-1">
                        {p.name}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-zinc-500">
                        <MapPin size={12} />
                        <span className="break-words">{p.root}</span>
                      </div>
                      {/* If you have a richer description field in the future, render it here */}
                    </div>

                    {/* Project Stats - TODO: Make dynamic based on actual project data */}
                    <div className="flex items-center gap-4 py-3 mb-4 border-t border-b border-zinc-800">
                      <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                        <Layers size={14} />
                        <span>0 documents</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      {/*
                        Reuse the bottom action button as the project status indicator.
                        Map overall project lifecycle statuses to the requested colors:
                          - Not Yet Started -> light grey
                          - Work in Progress -> bright blue (#2563eb)
                          - Delayed -> yellow (#f59e0b)
                          - Completed -> green (#10b981)
                        If the project has no explicit status, fall back to Active/Select behavior.
                      */}
                      <button
                        onClick={(e) => { e.stopPropagation(); onSelectProject && onSelectProject(p.id); }}
                        aria-label={`Project ${p.name} status`}
                        className="flex-1"
                      >
                        <div className="w-full flex items-center justify-center">
                          <StatusBadge status={(p as any).status} className="w-full flex justify-center" />
                        </div>
                      </button>
                    </div>
                  </div>
                </DashboardCard>
              );
            })}

          </div>
        )}

        {/* Project Detail Modal */}
        {detailProject && (
          <ProjectDetailModal
            project={detailProject}
            onClose={() => setDetailProject(null)}
            onOpen={(id) => {
              if (onSelectProject) onSelectProject(id);
              if (onOpenProject) onOpenProject(id);
              setDetailProject(null);
            }}
            onDelete={async (id) => {
              const ok = confirm('Delete project "' + detailProject.name + '"? This cannot be undone.');
              if (!ok) return;
              try {
                const res = await fetch('/api/projects/' + encodeURIComponent(id), { method: 'DELETE' });
                if (!res.ok && res.status !== 204) throw new Error('Failed');
                const listRes = await fetch('/api/projects');
                const { projects: newList } = await listRes.json();
                if (onProjectsChange) onProjectsChange(newList);
                setDetailProject(null);
              } catch (e) {
                console.error('Delete project failed, falling back to local:', e);
                // Fallback: remove locally
                if (onProjectsChange) onProjectsChange(projects.filter(p => p.id !== id));
                setDetailProject(null);
              }
            }}
          />
        )}
      </div>
    </div>
  );
};

export default ProjectsPage;

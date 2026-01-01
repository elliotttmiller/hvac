import React from 'react';

interface Project { id: string; name: string; root: string }

interface Props {
  projects: Project[];
  activeProject?: string | null;
  onSelectProject?: (id: string) => void;
  onProjectsChange?: (list: Project[]) => void;
  onOpenProject?: (id: string) => void;
}

import ProjectDetailModal from './ProjectDetailModal.tsx';

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
    <div className="p-6 h-full overflow-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Projects</h2>
        <div>
          <button onClick={()=>setCreating(!creating)} className="px-3 py-1 text-sm rounded bg-[#111] border border-white/5">{creating ? 'Cancel' : 'New Project'}</button>
        </div>
      </div>

      {creating && (
        <div className="mb-4 p-4 rounded bg-[#0f0f10] border border-white/5">
          <div className="grid grid-cols-2 gap-2">
            <input value={name} onChange={e=>setName(e.target.value)} placeholder="Project name" className="p-2 bg-[#0b0b0c] border border-white/5 rounded" />
            <input value={root} onChange={e=>setRoot(e.target.value)} placeholder="Root path (relative)" className="p-2 bg-[#0b0b0c] border border-white/5 rounded" />
          </div>
          <div className="mt-3">
            <button disabled={loading} onClick={createProject} className="px-3 py-1 rounded bg-cyan-500 text-white">Create</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-3">
        {projects.length === 0 && (
          <div className="p-4 rounded bg-[#141414] border border-white/5 text-zinc-400">No projects found.</div>
        )}

        {projects.map(p => (
          <div key={p.id} className={`flex items-center justify-between p-3 rounded border ${activeProject === p.id ? 'border-cyan-500 bg-[#15121a]' : 'border-white/5 bg-[#101010]'}`}>
            <div onClick={()=>setDetailProject(p)} className="cursor-pointer">
              <div className="text-sm font-medium">{p.name}</div>
              <div className="text-[11px] text-zinc-500">{p.root}</div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onSelectProject && onSelectProject(p.id)}
                className="px-2 py-1 text-xs rounded bg-cyan-500 hover:bg-cyan-600 text-white"
              >
                Select
              </button>
            </div>
          </div>
        ))}
      </div>

      {detailProject && (
        <ProjectDetailModal
          project={detailProject}
          onClose={()=>setDetailProject(null)}
          onOpen={(id)=>{
            if (onSelectProject) onSelectProject(id);
            if (onOpenProject) onOpenProject(id);
            setDetailProject(null);
          }}
          onDelete={async (id)=>{
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
  );
};

export default ProjectsPage;

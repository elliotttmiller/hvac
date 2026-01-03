import React, { useState } from 'react';
import { X, FileText, Settings as SettingsIcon, Trash2, FolderOpen } from 'lucide-react';

interface Project { id: string; name: string; root: string }

interface Props {
  project: Project;
  onClose: () => void;
  onOpen?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const ProjectDetailModal: React.FC<Props> = ({ project, onClose, onOpen, onDelete }) => {
  const [confirming, setConfirming] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'documents' | 'settings'>('overview');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-zinc-800">
          <div>
            <div className="text-lg font-semibold text-zinc-100">{project.name}</div>
            <div className="text-xs text-zinc-500 mt-1">{project.root}</div>
          </div>
          <button 
            onClick={onClose} 
            className="w-9 h-9 rounded-lg flex items-center justify-center bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-zinc-800 bg-zinc-900/50">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-3 text-sm font-medium transition-colors relative ${
              activeTab === 'overview' 
                ? 'text-cyan-400 border-b-2 border-cyan-400' 
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <FolderOpen size={14} className="inline mr-2" />
            Overview
          </button>
          <button
            onClick={() => setActiveTab('documents')}
            className={`px-6 py-3 text-sm font-medium transition-colors relative ${
              activeTab === 'documents' 
                ? 'text-cyan-400 border-b-2 border-cyan-400' 
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <FileText size={14} className="inline mr-2" />
            Documents
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-6 py-3 text-sm font-medium transition-colors relative ${
              activeTab === 'settings' 
                ? 'text-cyan-400 border-b-2 border-cyan-400' 
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <SettingsIcon size={14} className="inline mr-2" />
            Settings
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 max-h-96 overflow-y-auto">
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-zinc-300 mb-3">Project Details</h3>
                <div className="space-y-2">
                  <div className="flex justify-between py-2 border-b border-zinc-800">
                    <span className="text-xs text-zinc-500">Project ID</span>
                    <span className="font-mono text-xs text-zinc-300">{project.id}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-zinc-800">
                    <span className="text-xs text-zinc-500">Status</span>
                    <span className="inline-flex items-center px-2 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs">
                      Active
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 pt-4">
                <button 
                  onClick={() => { if (onOpen) onOpen(project.id); onClose(); }} 
                  className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-medium transition-colors"
                >
                  Open in Explorer
                </button>
                <button 
                  onClick={() => { if (onOpen) onOpen(project.id); }} 
                  className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 hover:text-white text-sm transition-colors"
                >
                  View Files
                </button>
              </div>
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-zinc-300 mb-3">Project Documents</h3>
                <p className="text-xs text-zinc-500 mb-4">Manage files and analysis results for this project.</p>
                
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-lg border border-zinc-800 hover:border-zinc-700 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-zinc-700 flex items-center justify-center">
                          <FileText size={14} className="text-zinc-400" />
                        </div>
                        <div>
                          <div className="text-sm text-zinc-300">Document_{i}.pdf</div>
                          <div className="text-xs text-zinc-500">1.2 MB • Analyzed 2h ago</div>
                        </div>
                      </div>
                      <button className="text-zinc-500 hover:text-cyan-400 transition-colors">
                        <FileText size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              
              <button 
                className="w-full py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-400 hover:text-white text-sm transition-colors"
                onClick={() => {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = '*/*';
                  input.onchange = (e) => {
                    const file = (e.target as HTMLInputElement).files?.[0];
                    if (file) {
                      const event = new CustomEvent('file-upload', { detail: file });
                      window.dispatchEvent(event);
                    }
                  };
                  input.click();
                }}
              >
                + Add Document
              </button>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-zinc-300 mb-3">Project Settings</h3>
                <p className="text-xs text-zinc-500 mb-4">Configure project preferences and danger zone.</p>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-zinc-400 mb-2 block">Project Name</label>
                    <input 
                      type="text" 
                      defaultValue={project.name}
                      className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-300 focus:outline-none focus:border-cyan-500 transition-colors"
                    />
                  </div>
                  
                  <div>
                    <label className="text-xs text-zinc-400 mb-2 block">Description</label>
                    <textarea 
                      rows={3}
                      placeholder="Add a description..."
                      className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-300 focus:outline-none focus:border-cyan-500 transition-colors resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="pt-4 border-t border-zinc-800">
                <h4 className="text-sm font-medium text-red-400 mb-2">Danger Zone</h4>
                <p className="text-xs text-zinc-500 mb-3">Permanently delete this project and all its data.</p>
                
                {!confirming ? (
                  <button 
                    onClick={() => setConfirming(true)} 
                    className="px-4 py-2 rounded-lg bg-red-600/10 hover:bg-red-600/20 border border-red-600/20 text-red-400 text-sm transition-colors inline-flex items-center gap-2"
                  >
                    <Trash2 size={14} />
                    Delete Project
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => { if (onDelete) onDelete(project.id); }} 
                      className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm transition-colors"
                    >
                      Confirm Delete
                    </button>
                    <button 
                      onClick={() => setConfirming(false)} 
                      className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 text-sm transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailModal;

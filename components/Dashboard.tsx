import React, { useState } from 'react';
import { Plus, FileText, MoreVertical, Trash2, Edit2, FolderOpen } from 'lucide-react';
import { SprintData } from '../types';

interface DashboardProps {
  onStart: () => void;
  history: SprintData[];
  onViewReport?: (sprint: SprintData) => void;
  onDeleteSprint?: (sprintId: string) => void;
  onRenameSprint?: (sprintId: string, newName: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ 
  onStart, 
  history, 
  onViewReport, 
  onDeleteSprint, 
  onRenameSprint 
}) => {
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState<string>('');

  return (
    <div className="max-w-5xl mx-auto space-y-20 py-8">
      {/* Hero Section */}
      <div className="text-center space-y-6 py-20">
        <h1 className="text-5xl tracking-tight text-gray-900" style={{ fontFamily: 'Playfair Display, serif' }}>
          Your Workspace
        </h1>
        <p className="text-base text-gray-500 font-light max-w-xl mx-auto">
          Access your sprint reports and project documentation
        </p>
      </div>

      {/* Reports Grid */}
      {history.length > 0 ? (
        <div className="space-y-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Recent Reports</h2>
            <button
              onClick={onStart}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-gray-900 border border-gray-200 rounded-full hover:bg-gray-50 transition-all"
            >
              <Plus size={16} />
              New Report
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {history.map((sprint) => (
              <div
                key={sprint.id}
                className="group relative bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-md transition-all cursor-pointer"
                onClick={() => onViewReport?.(sprint)}
              >
                {/* Icon */}
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <FileText size={20} className="text-gray-400" />
                  </div>
                  
                  {/* Menu */}
                  <div className="relative" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => setMenuOpenId(menuOpenId === sprint.id ? null : sprint.id)}
                      className="p-1.5 hover:bg-gray-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MoreVertical size={16} className="text-gray-400" />
                    </button>
                    {menuOpenId === sprint.id && (
                      <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg py-1 z-50 min-w-[140px]">
                        <button
                          onClick={() => {
                            setEditName(sprint.customName || sprint.repoName);
                            setEditingId(sprint.id);
                            setMenuOpenId(null);
                          }}
                          className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-50 text-left text-sm text-gray-700"
                        >
                          <Edit2 size={14} className="text-gray-400" />
                          Rename
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Delete "${sprint.customName || sprint.repoName}"?`)) {
                              onDeleteSprint?.(sprint.id);
                            }
                            setMenuOpenId(null);
                          }}
                          className="w-full flex items-center gap-2 px-4 py-2 hover:bg-red-50 text-left text-sm text-red-600"
                        >
                          <Trash2 size={14} className="text-red-400" />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Content */}
                {editingId === sprint.id ? (
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onBlur={() => {
                      if (editName.trim()) {
                        onRenameSprint?.(sprint.id, editName);
                      }
                      setEditingId(null);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        if (editName.trim()) {
                          onRenameSprint?.(sprint.id, editName);
                        }
                        setEditingId(null);
                      }
                      if (e.key === 'Escape') {
                        setEditingId(null);
                      }
                    }}
                    onClick={(e) => e.stopPropagation()}
                    className="w-full text-base font-medium text-gray-900 bg-gray-50 border border-gray-300 rounded-lg px-2 py-1 focus:outline-none focus:border-gray-400"
                    autoFocus
                  />
                ) : (
                  <h3 className="text-base font-medium text-gray-900 mb-2 line-clamp-1">
                    {sprint.customName || sprint.repoName}
                  </h3>
                )}
                
                <p className="text-sm text-gray-400 mb-3">
                  {sprint.startDate} — {sprint.endDate}
                </p>
                
                {sprint.createdAt && (
                  <p className="text-xs text-gray-300">
                    Created {new Date(sprint.createdAt).toLocaleDateString()}
                  </p>
                )}

                {/* Metrics */}
                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-4 text-xs text-gray-400">
                  <span>{sprint.commits.length} commits</span>
                  <span>{sprint.pullRequests.length} PRs</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-20 space-y-6">
          <div className="flex justify-center">
            <div className="p-6 bg-gray-50 rounded-full">
              <FolderOpen size={40} className="text-gray-300" />
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-lg text-gray-500">No reports yet</p>
            <p className="text-sm text-gray-400">Create your first sprint analysis to get started</p>
          </div>
          <button
            onClick={onStart}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white text-sm font-medium rounded-full hover:bg-gray-800 transition-all"
          >
            <Plus size={18} />
            New Report
          </button>
        </div>
      )}
    </div>
  );
};
import React from 'react';
import { GitCommit, GitPullRequest, CheckSquare, AlertCircle } from 'lucide-react';
import { SprintData } from '../types';

interface RawDataPreviewProps {
  data: SprintData;
  onNext: () => void;
}

export const RawDataPreview: React.FC<RawDataPreviewProps> = ({ data, onNext }) => {
  return (
    <div className="max-w-6xl mx-auto py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl tracking-tight text-gray-900 mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
          Verify Data
        </h1>
        <p className="text-base text-gray-500 font-light mb-8">
          Review the collected activity before generating your report
        </p>
        <button 
          onClick={onNext}
          className="inline-flex items-center gap-2 bg-gray-900 text-white px-8 py-3 rounded-full text-sm font-medium hover:bg-gray-800 transition-all shadow-sm"
        >
          Generate Report
        </button>
      </div>

      {/* Data Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Commits */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden flex flex-col h-[500px]">
          <div className="p-4 bg-gray-50 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <GitCommit size={16} className="text-gray-400" />
              <h3 className="text-sm font-medium text-gray-900">
                Commits ({data.commits.length})
              </h3>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {data.commits.map(c => (
              <div key={c.id} className="p-3 bg-gray-50 rounded-xl border border-gray-100 hover:border-gray-200 transition-all">
                <p className="text-xs text-gray-800 leading-tight mb-2">"{c.message}"</p>
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-gray-600 font-medium">{c.author.split(' ')[0]}</span>
                  <span className="text-gray-400">{c.date.split('T')[0]}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* PRs */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden flex flex-col h-[500px]">
          <div className="p-4 bg-gray-50 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <GitPullRequest size={16} className="text-gray-400" />
              <h3 className="text-sm font-medium text-gray-900">
                Pull Requests ({data.pullRequests.length})
              </h3>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {data.pullRequests.map(pr => (
              <div key={pr.id} className="p-3 bg-blue-50 rounded-xl border border-blue-100 hover:border-blue-200 transition-all">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-medium text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                    #{pr.number}
                  </span>
                  <span className={`text-[10px] font-medium ${pr.state === 'closed' ? 'text-gray-600' : 'text-green-600'}`}>
                    {pr.state}
                  </span>
                </div>
                <p className="text-xs text-gray-800 leading-tight mb-1">{pr.title}</p>
                {pr.body && (
                  <p className="text-[10px] text-gray-500 mt-2 line-clamp-2">{pr.body}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Issues */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden flex flex-col h-[500px]">
          <div className="p-4 bg-gray-50 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <CheckSquare size={16} className="text-gray-400" />
              <h3 className="text-sm font-medium text-gray-900">
                Jira Issues ({data.issues.length})
              </h3>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {data.issues.length > 0 ? (
              data.issues.map(i => (
                <div key={i.id} className="p-3 bg-green-50 rounded-xl border border-green-100 hover:border-green-200 transition-all">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-medium text-green-700 bg-green-100 px-2 py-0.5 rounded">
                      {i.id}
                    </span>
                    <span className="text-[10px] font-medium text-green-600">
                      {i.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-800 leading-tight mb-2">{i.title}</p>
                  {i.labels.length > 0 && (
                    <div className="flex gap-1 flex-wrap">
                      {i.labels.map(l => (
                        <span key={l} className="text-[10px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                          {l}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center p-6">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                  <AlertCircle size={20} className="text-gray-300" />
                </div>
                <p className="text-sm font-medium text-gray-500 mb-1">No Jira Issues</p>
                <p className="text-xs text-gray-400">
                  Report will be generated from commits and PRs
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500">
          Found {data.commits.length} commits, {data.pullRequests.length} pull requests, and {data.issues.length} issues
        </p>
      </div>
    </div>
  );
};
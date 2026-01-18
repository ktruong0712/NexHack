
import React from 'react';
import { GitCommit, GitPullRequest, CheckSquare, Zap, ChevronRight, AlertCircle } from 'lucide-react';
import { SprintData } from '../types';

interface RawDataPreviewProps {
  data: SprintData;
  onNext: () => void;
}

export const RawDataPreview: React.FC<RawDataPreviewProps> = ({ data, onNext }) => {
  return (
    <div className="max-w-6xl mx-auto py-8 animate-in slide-in-from-right-4 duration-500">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase leading-none">Step 3: Source Evidence</h2>
          <p className="text-slate-500 font-medium">Verify detected activity before AI synthesis.</p>
        </div>
        <button 
          onClick={onNext}
          className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-indigo-600 transition-all active:scale-95 flex items-center gap-3"
        >
          Generate Sprint Report <Zap size={18} className="fill-current" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Commits */}
        <div className="bg-white rounded-[35px] border border-slate-200 overflow-hidden flex flex-col h-[600px] shadow-sm">
          <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 flex items-center gap-2">
              <GitCommit size={16} className="text-indigo-600" /> Commits ({data.commits.length})
            </h3>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
            {data.commits.map(c => (
              <div key={c.id} className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100 hover:bg-white transition-all">
                <p className="text-xs font-bold text-slate-800 leading-tight mb-1">"{c.message}"</p>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-[9px] font-black text-indigo-600 uppercase bg-indigo-50 px-2 py-0.5 rounded">{c.author.split(' ')[0]}</span>
                  <span className="text-[8px] font-bold text-slate-400">{c.date.split('T')[0]}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* PRs */}
        <div className="bg-white rounded-[35px] border border-slate-200 overflow-hidden flex flex-col h-[600px] shadow-sm">
          <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 flex items-center gap-2">
              <GitPullRequest size={16} className="text-blue-600" /> Pull Requests ({data.pullRequests.length})
            </h3>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
            {data.pullRequests.map(pr => (
              <div key={pr.id} className="p-4 bg-blue-50/20 rounded-2xl border border-blue-100/50 hover:bg-white transition-all">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-black text-blue-700 bg-blue-100 px-2 py-0.5 rounded-lg">#{pr.number}</span>
                  <span className={`text-[8px] font-black uppercase ${pr.state === 'closed' ? 'text-indigo-600' : 'text-emerald-600'}`}>{pr.state}</span>
                </div>
                <p className="text-xs font-bold text-slate-800 leading-tight">{pr.title}</p>
                <p className="text-[10px] text-slate-500 mt-2 italic truncate">{pr.body || 'No description provided.'}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Issues */}
        <div className="bg-white rounded-[35px] border border-slate-200 overflow-hidden flex flex-col h-[600px] shadow-sm">
          <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 flex items-center gap-2">
              <CheckSquare size={16} className="text-emerald-600" /> Jira Tasks ({data.issues.length})
            </h3>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
            {data.issues.map(i => (
              <div key={i.id} className="p-4 bg-emerald-50/20 rounded-2xl border border-emerald-100/50 hover:bg-white transition-all">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-lg">{i.id}</span>
                  <span className="text-[8px] font-black uppercase text-emerald-600">{i.status}</span>
                </div>
                <p className="text-xs font-bold text-slate-800 leading-tight">{i.title}</p>
                <div className="mt-3 flex gap-1 flex-wrap">
                  {i.labels.map(l => <span key={l} className="text-[8px] font-bold text-slate-400 border border-slate-200 px-2 py-0.5 rounded-full">{l}</span>)}
                </div>
              </div>
            ))}
            {data.issues.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full opacity-40 text-center p-8">
                <AlertCircle size={32} className="mb-4" />
                <p className="text-xs font-bold uppercase tracking-widest">No Jira Context Linked</p>
                <p className="text-[10px] font-medium mt-2">AI will infer requirements from commit patterns.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

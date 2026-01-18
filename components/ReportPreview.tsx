
import React, { useEffect, useState } from 'react';
import { Download, FileText, Share2, Sparkles, Loader2, Trophy, ShieldAlert, Zap, Rocket, Link2, GitPullRequest, Edit3, Save, RotateCw } from 'lucide-react';
import { SprintData, SprintReport } from '../types';
import { generateSprintReport } from '../services/geminiService';

interface ReportPreviewProps {
  data: SprintData;
  report: SprintReport | null;
  setReport: (report: SprintReport) => void;
}

export const ReportPreview: React.FC<ReportPreviewProps> = ({ data, report, setReport }) => {
  const [loading, setLoading] = useState(!report);
  const [error, setError] = useState<string | null>(null);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempReport, setTempReport] = useState<SprintReport | null>(report);

  useEffect(() => {
    if (!report) {
      const fetchReport = async () => {
        try {
          setLoading(true);
          const res = await generateSprintReport(data);
          setReport(res);
          setTempReport(res);
        } catch (err) {
          setError('Failed to generate report. Please ensure your API key is valid.');
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchReport();
    } else {
      setTempReport(report);
    }
  }, [data, report, setReport]);

  const handleSaveEdit = () => {
    if (tempReport) {
      setReport(tempReport);
      setEditingField(null);
    }
  };

  const handleExportMarkdown = () => {
    if (!report) return;
    const content = `# Sprint Report: ${data.repoName}\n\n## Summary\n${report.summary}\n\n## PR Summary\n${report.prSummary}\n\n## Technical Highlights\n${report.technicalHighlights.join('\n')}`;
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sprint-report-${data.repoName}.md`;
    a.click();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 animate-pulse">
        <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 mb-4">
          <Loader2 className="animate-spin" size={40} />
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-900 uppercase">AI Synthesis Engine Active</h2>
          <p className="text-slate-500 max-w-md mx-auto mt-2 font-medium italic">
            Clustering {data.commits.length} commits and applying {data.template} logic constraints...
          </p>
        </div>
        <div className="flex gap-2">
            <div className="h-2 w-2 rounded-full bg-indigo-600 animate-bounce [animation-delay:-0.3s]"></div>
            <div className="h-2 w-2 rounded-full bg-indigo-600 animate-bounce [animation-delay:-0.15s]"></div>
            <div className="h-2 w-2 rounded-full bg-indigo-600 animate-bounce"></div>
        </div>
      </div>
    );
  }

  if (error || !report || !tempReport) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] text-red-600">
        <ShieldAlert size={48} className="mb-4" />
        <h3 className="text-xl font-bold uppercase tracking-widest">Synthesis Breakdown</h3>
        <p>{error || 'Something went wrong.'}</p>
        <button onClick={() => window.location.reload()} className="mt-4 px-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors">Re-Attempt Analysis</button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase leading-none">Step 5 & 6: Review & Finalize</h2>
          <p className="text-slate-500 font-medium">Edit the AI's findings before exporting as documentation.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleExportMarkdown}
            className="flex items-center gap-2 px-6 py-3 border border-slate-200 rounded-xl hover:bg-white font-black text-[10px] uppercase tracking-widest transition-all"
          >
            <FileText size={16} /> Markdown
          </button>
          <button 
             onClick={() => { navigator.clipboard.writeText(JSON.stringify(report, null, 2)); alert('Copied raw JSON to clipboard!'); }}
             className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all shadow-md active:scale-95"
          >
            <Download size={16} /> Export Docs
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[40px] border border-slate-200 shadow-2xl overflow-hidden print:shadow-none print:border-none">
        <div className="p-12 border-b-8 border-indigo-600 bg-slate-50/50">
          <div className="flex justify-between items-start mb-10">
            <div>
              <h1 className="text-5xl font-black tracking-tighter text-slate-900 mb-4 uppercase leading-none">Sprint Report</h1>
              <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-indigo-600 text-white text-[10px] font-bold rounded-lg uppercase">Template: {data.template}</span>
                  <p className="text-sm font-bold text-slate-400">Project: {data.repoName}</p>
              </div>
            </div>
            <div className="text-right text-xs text-slate-500 font-mono space-y-1">
              <p>Period: {data.startDate} — {data.endDate}</p>
              <p>Correlation: Jira ↔ GitHub (Commits/PRs)</p>
              <p>ID: SSR-{Math.floor(Math.random()*9000)+1000}</p>
            </div>
          </div>

          <div className="grid grid-cols-5 gap-4">
             <MetricBox label="Velocity" value={`${report.velocityScore}%`} icon={Zap} color="text-amber-600" />
             <MetricBox label="Commits" value={data.commits.length.toString()} icon={FileText} color="text-blue-600" />
             <MetricBox label="PRs" value={data.pullRequests.length.toString()} icon={GitPullRequest} color="text-indigo-600" />
             <MetricBox label="Tasks" value={data.issues.length.toString()} icon={Trophy} color="text-emerald-600" />
             <MetricBox label="Systems" value="3 SYNC" icon={Link2} color="text-purple-600" />
          </div>
        </div>

        <div className="p-12 space-y-12">
          {/* Summary Section - Editable */}
          <section className="group relative space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-indigo-600">
                  <Sparkles size={20} />
                  <h3 className="text-lg font-black uppercase tracking-widest">Executive Summary</h3>
              </div>
              <button 
                onClick={() => setEditingField(editingField === 'summary' ? null : 'summary')}
                className="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-indigo-600 transition-all"
              >
                {editingField === 'summary' ? <Save size={18} onClick={handleSaveEdit} /> : <Edit3 size={18} />}
              </button>
            </div>
            {editingField === 'summary' ? (
              <textarea 
                className="w-full text-xl text-slate-800 leading-relaxed font-semibold bg-white p-8 rounded-[30px] border-2 border-indigo-600 focus:outline-none h-48"
                value={tempReport.summary}
                onChange={(e) => setTempReport({...tempReport, summary: e.target.value})}
              />
            ) : (
              <p className="text-xl text-slate-800 leading-relaxed font-semibold bg-indigo-50/50 p-8 rounded-[30px] border border-indigo-100 italic relative">
                "{tempReport.summary}"
              </p>
            )}
          </section>

          {/* PR Summary */}
          {tempReport.prSummary && (
            <section className="space-y-4">
              <div className="flex items-center gap-2 text-indigo-500">
                  <GitPullRequest size={20} />
                  <h3 className="text-lg font-black uppercase tracking-widest">Pull Request Insights</h3>
              </div>
              <div className="bg-white p-8 rounded-[30px] border-2 border-dashed border-indigo-100 text-slate-700 leading-relaxed text-sm">
                {tempReport.prSummary}
                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-2 text-[8px] font-black uppercase tracking-widest text-slate-400">
                  ✦ Based on PR Analysis: PR #{data.pullRequests[0]?.number || 'N/A'}, Commit {data.commits[0]?.id || 'N/A'}
                </div>
              </div>
            </section>
          )}

          {/* Individual Contributions */}
          <section className="space-y-6">
            <h3 className="text-lg font-black uppercase tracking-widest border-b border-slate-100 pb-2">Team Impact Matrix</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {tempReport.individualContributions.map((contributor, idx) => (
                <div key={idx} className="bg-white p-8 rounded-[30px] border border-slate-100 shadow-sm hover:border-indigo-100 transition-colors group/item">
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="text-xl font-black text-slate-900">{contributor.name}</h4>
                    <div className="flex flex-wrap gap-2 text-[8px] font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full uppercase">
                        <span>{contributor.metrics.commits} C</span>
                        <span>{contributor.metrics.prsMerged} PRs</span>
                    </div>
                  </div>
                  <ul className="space-y-3">
                    {contributor.highlights.map((h, i) => (
                      <li key={i} className="text-sm text-slate-600 flex gap-3">
                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-400 flex-shrink-0" />
                        <span className="leading-snug">{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* Technical Highlights */}
          <section className="space-y-4">
              <h3 className="text-lg font-black uppercase tracking-widest border-b border-slate-100 pb-2 text-slate-800">System Architecture & Tech Debt</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {tempReport.technicalHighlights.map((h, i) => (
                  <div key={i} className="flex gap-4 text-slate-700 text-sm bg-slate-50 p-6 rounded-3xl border-l-4 border-slate-900">
                    <div className="text-indigo-600 font-black">0{i+1}</div>
                    <p className="leading-relaxed">{h}</p>
                  </div>
                ))}
              </div>
          </section>

          {/* Objectives */}
          <section className="bg-slate-900 text-white p-12 rounded-[40px] shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
               <RotateCw size={120} />
            </div>
            <div className="flex items-center gap-3 mb-8">
                <Rocket className="text-indigo-400" size={24} />
                <h3 className="text-3xl font-black tracking-tight uppercase">Strategic Next Steps</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
               {tempReport.futureGoals.map((goal, i) => (
                 <div key={i} className="flex items-center gap-5 bg-white/5 p-5 rounded-2xl border border-white/10 backdrop-blur-sm">
                    <div className="text-indigo-500 font-black text-2xl">0{i+1}</div>
                    <div className="text-sm font-bold leading-tight">{goal}</div>
                 </div>
               ))}
            </div>
          </section>
        </div>

        <div className="p-12 bg-slate-900 text-center text-[10px] text-slate-500 border-t border-slate-800 flex justify-between items-center font-mono uppercase tracking-widest">
            <span>Powered by Gemini 3 Flash (High-Fidelity)</span>
            <span>SprintGenius v3.0 // {data.template} Mode</span>
            <span>&copy; Academic & Professional Synthesis Suite</span>
        </div>
      </div>
    </div>
  );
};

const MetricBox: React.FC<{label: string, value: string, icon: any, color: string}> = ({ label, value, icon: Icon, color }) => (
  <div className="p-5 bg-white border border-slate-100 rounded-[20px] shadow-sm">
    <div className={`flex items-center gap-2 mb-2 ${color}`}>
        <Icon size={14} />
        <span className="text-[9px] font-black uppercase tracking-tighter opacity-70">{label}</span>
    </div>
    <div className="text-2xl font-black text-slate-900 leading-none">{value}</div>
  </div>
);

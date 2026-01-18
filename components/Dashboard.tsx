
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Plus, Clock, CheckCircle, AlertCircle, FileText, Calendar, GitPullRequest, Users } from 'lucide-react';
import { SprintData } from '../types';

interface DashboardProps {
  onStart: () => void;
  history: SprintData[];
}

export const Dashboard: React.FC<DashboardProps> = ({ onStart, history }) => {
  // Aggregate data by contributor for the chart
  const teamActivity = React.useMemo(() => {
    const contributors: Record<string, { commits: number; name: string }> = {};
    history.forEach(sprint => {
      sprint.commits.forEach(c => {
        if (!contributors[c.author]) contributors[c.author] = { commits: 0, name: c.author };
        contributors[c.author].commits++;
      });
    });
    return Object.values(contributors).sort((a, b) => b.commits - a.commits).slice(0, 5);
  }, [history]);

  const totalCommits = history.reduce((acc, curr) => acc + curr.commits.length, 0);
  const totalIssues = history.reduce((acc, curr) => acc + curr.issues.length, 0);
  const totalPRs = history.reduce((acc, curr) => acc + (curr.pullRequests?.length || 0), 0);

  const colors = ['#4f46e5', '#10b981', '#f59e0b', '#3b82f6', '#8b5cf6'];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Team Pulse</h2>
          <p className="text-slate-500 font-medium">Holistic view of collective engineering impact.</p>
        </div>
        <button 
          onClick={onStart}
          className="flex items-center gap-3 bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-500/20 hover:bg-indigo-700 transition-all active:scale-95"
        >
          <Plus size={20} />
          Initialize Analysis
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="Team Commits" value={totalCommits.toString()} change={`${history.length} Sprints`} icon={Clock} color="text-blue-600" bg="bg-blue-50" />
        <StatCard title="Issues Resolved" value={totalIssues.toString()} change="Project Wide" icon={CheckCircle} color="text-emerald-600" bg="bg-emerald-50" />
        <StatCard title="PRs Conducted" value={totalPRs.toString()} change="Code Reviewed" icon={GitPullRequest} color="text-indigo-600" bg="bg-indigo-50" />
        <StatCard title="Contributors" value={teamActivity.length.toString()} change="Verified Core" icon={Users} color="text-purple-600" bg="bg-purple-50" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-8">
             <h3 className="text-lg font-black uppercase tracking-widest text-slate-900">Top Contributors</h3>
             <Users size={20} className="text-slate-300" />
          </div>
          <div className="h-64">
            {teamActivity.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={teamActivity} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 10, fontWeight: 800}} width={80} />
                  <Tooltip 
                    cursor={{fill: '#f8fafc'}}
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="commits" radius={[0, 8, 8, 0]} barSize={24}>
                    {teamActivity.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-300 italic">No contributor data yet</div>
            )}
          </div>
        </div>

        <div className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-lg font-black uppercase tracking-widest text-slate-900">Sprint Archive</h3>
            <div className="p-2 bg-slate-50 text-slate-400 rounded-lg"><Calendar size={18} /></div>
          </div>
          <div className="space-y-4 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
            {history.length > 0 ? history.map((s) => (
              <div key={s.id} className="flex items-center justify-between p-5 border border-slate-100 rounded-3xl hover:bg-slate-50 transition-all cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                    <FileText size={20} />
                  </div>
                  <div>
                    <h4 className="font-black text-sm uppercase tracking-tight">{s.repoName}</h4>
                    <p className="text-[10px] text-slate-400 font-bold">{s.startDate} — {s.endDate}</p>
                  </div>
                </div>
                <div className="text-xs font-black text-indigo-600 bg-indigo-50 px-4 py-2 rounded-xl group-hover:bg-indigo-100 transition-colors">
                  {s.report?.velocityScore || 0}% SCORE
                </div>
              </div>
            )) : (
              <div className="text-center py-12 text-slate-400 font-bold italic text-sm">No historical data recorded.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{title: string, value: string, change: string, icon: any, color: string, bg: string}> = ({ title, value, change, icon: Icon, color, bg }) => (
  <div className="bg-white p-8 rounded-[35px] border border-slate-200 shadow-sm flex items-start justify-between hover:scale-[1.02] transition-transform">
    <div>
      <p className="text-slate-400 text-[9px] font-black uppercase tracking-[0.2em] mb-2">{title}</p>
      <h3 className="text-4xl font-black mb-2 text-slate-900 tracking-tight">{value}</h3>
      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{change}</p>
    </div>
    <div className={`p-4 ${bg} ${color} rounded-2xl shadow-sm`}>
      <Icon size={24} />
    </div>
  </div>
);

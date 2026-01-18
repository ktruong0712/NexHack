
import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, GitCommit, CheckSquare, GitPullRequest, Info, Target } from 'lucide-react';
import { SprintData, Issue, Commit, PullRequest } from '../types';

interface SprintCalendarProps {
  history: SprintData[];
  onSelectSprint: (sprint: SprintData) => void;
}

export const SprintCalendar: React.FC<SprintCalendarProps> = ({ history, onSelectSprint }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const startOfWeek = useMemo(() => {
    const d = new Date(currentDate);
    const day = d.getDay();
    const diff = d.getDate() - day;
    return new Date(d.setDate(diff));
  }, [currentDate]);

  const weekDays = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(startOfWeek);
      d.setDate(d.getDate() + i);
      return d;
    });
  }, [startOfWeek]);

  const navigateWeek = (direction: number) => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() + direction * 7);
    setCurrentDate(d);
  };

  const isSameDay = (d1: Date, d2: Date) => {
    return d1.getFullYear() === d2.getFullYear() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getDate() === d2.getDate();
  };

  const formatDateString = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const isViewingCurrentWeek = useMemo(() => {
    const today = new Date();
    return weekDays.some(day => isSameDay(day, today));
  }, [weekDays]);

  const visibleSprints = useMemo(() => {
    const weekStartStr = formatDateString(weekDays[0]);
    const weekEndStr = formatDateString(weekDays[6]);
    return history.filter(s => 
      (s.startDate <= weekEndStr && s.endDate >= weekStartStr)
    );
  }, [history, weekDays]);

  const itemsByDay = useMemo(() => {
    const map: Record<string, { issues: Issue[], commits: Commit[], prs: PullRequest[] }> = {};
    weekDays.forEach(day => {
      const dateStr = formatDateString(day);
      map[dateStr] = { issues: [], commits: [], prs: [] };
      
      history.forEach(sprint => {
        sprint.issues.forEach(issue => {
          const issueDate = issue.updatedAt || sprint.endDate;
          if (issueDate === dateStr) map[dateStr].issues.push(issue);
        });
        sprint.commits.forEach(commit => {
          if (commit.date.startsWith(dateStr)) map[dateStr].commits.push(commit);
        });
        if (sprint.pullRequests) {
          sprint.pullRequests.forEach(pr => {
            const prDate = (pr.mergedAt || pr.createdAt).split('T')[0];
            if (prDate === dateStr) map[dateStr].prs.push(pr);
          });
        }
      });
    });
    return map;
  }, [history, weekDays]);

  return (
    <div className="h-full flex flex-col space-y-6 animate-in fade-in duration-700">
      {/* Calendar Header */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-4">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              <CalendarIcon className="text-indigo-600" size={28} />
              {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </h2>
            {isViewingCurrentWeek && (
              <span className="flex items-center gap-1.5 px-3 py-1 bg-indigo-100 text-indigo-700 text-[10px] font-black rounded-full uppercase tracking-wider animate-pulse">
                <Target size={12} /> Current Week
              </span>
            )}
          </div>
          
          <div className="flex items-center bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <button 
              onClick={() => navigateWeek(-1)} 
              className="p-3 hover:bg-slate-50 border-r border-slate-200 transition-colors text-slate-400 hover:text-slate-900"
              title="Previous Week"
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              onClick={() => setCurrentDate(new Date())} 
              className={`px-6 py-3 text-sm font-bold transition-all ${
                isViewingCurrentWeek 
                  ? 'bg-indigo-600 text-white' 
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              Today
            </button>
            <button 
              onClick={() => navigateWeek(1)} 
              className="p-3 hover:bg-slate-50 border-l border-slate-200 transition-colors text-slate-400 hover:text-slate-900"
              title="Next Week"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
        
        <div className="flex gap-3 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm">
          <LegendItem color="bg-indigo-500" label="Sprint" />
          <LegendItem color="bg-emerald-500" label="Issue" />
          <LegendItem color="bg-blue-500" label="PR" />
          <LegendItem color="bg-amber-500" label="Commit" />
        </div>
      </div>

      {/* Calendar Grid Container */}
      <div className="flex-1 bg-white border border-slate-200 rounded-[40px] shadow-2xl overflow-hidden flex flex-col min-h-[600px] relative">
        {/* Days Header */}
        <div className="grid grid-cols-7 border-b border-slate-100 bg-slate-50/50">
          {weekDays.map((day, idx) => {
            const isToday = isSameDay(day, new Date());
            return (
              <div key={idx} className={`p-6 text-center border-r border-slate-100 last:border-r-0 transition-colors ${isToday ? 'bg-indigo-50/30' : ''}`}>
                <p className={`text-[10px] font-black uppercase tracking-[0.2em] mb-2 ${isToday ? 'text-indigo-600' : 'text-slate-400'}`}>
                  {day.toLocaleDateString('default', { weekday: 'short' })}
                </p>
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl text-xl font-black transition-all ${
                  isToday 
                    ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-200 scale-110' 
                    : 'text-slate-700 hover:bg-slate-200/50'
                }`}>
                  {day.getDate()}
                </div>
              </div>
            );
          })}
        </div>

        {/* Sprint Bars Overlay */}
        <div className="relative border-b border-slate-100 min-h-[50px] bg-slate-50/20 p-3 space-y-2">
          {visibleSprints.map((sprint) => {
            const startIdx = weekDays.findIndex(d => isSameDay(d, new Date(sprint.startDate + 'T00:00:00')));
            const endIdx = weekDays.findIndex(d => isSameDay(d, new Date(sprint.endDate + 'T00:00:00')));
            
            // Bounds handling for sprints that extend beyond current week
            const effectiveStartIdx = startIdx === -1 ? 0 : startIdx;
            const effectiveEndIdx = endIdx === -1 ? 6 : endIdx;
            
            const width = ((effectiveEndIdx - effectiveStartIdx + 1) / 7) * 100;
            const left = (effectiveStartIdx / 7) * 100;

            return (
              <div 
                key={sprint.id}
                onClick={() => onSelectSprint(sprint)}
                className="relative h-8 bg-indigo-600 text-white text-[10px] font-black px-4 rounded-xl flex items-center shadow-lg shadow-indigo-100 cursor-pointer hover:bg-indigo-700 hover:-translate-y-0.5 transition-all truncate uppercase tracking-wider z-10"
                style={{ width: `${width}%`, left: `${left}%` }}
              >
                {sprint.repoName} — Sprint Active
              </div>
            );
          })}
          {visibleSprints.length === 0 && (
            <div className="h-full flex items-center justify-center text-slate-300 text-[9px] font-black uppercase tracking-[0.3em] opacity-40">
              No Sprints Scheduled for this Window
            </div>
          )}
        </div>

        {/* Tasks/PRs/Commits Grid */}
        <div className="flex-1 overflow-y-auto grid grid-cols-7 divide-x divide-slate-100">
          {weekDays.map((day, idx) => {
            const dateStr = formatDateString(day);
            const data = itemsByDay[dateStr];
            const isToday = isSameDay(day, new Date());
            
            return (
              <div key={idx} className={`p-3 space-y-3 min-h-[400px] hover:bg-slate-50/50 transition-colors group relative ${isToday ? 'bg-indigo-50/10' : ''}`}>
                {isToday && <div className="absolute inset-0 border-x-2 border-indigo-600/10 pointer-events-none" />}
                
                {data.issues.map(issue => (
                  <div key={issue.id} className="p-3 bg-emerald-50/80 border border-emerald-100 rounded-2xl shadow-sm hover:shadow-md transition-all group/item">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckSquare size={12} className="text-emerald-600" />
                      <span className="text-[9px] font-black text-emerald-700 uppercase tracking-tighter">{issue.id}</span>
                    </div>
                    <p className="text-[11px] font-bold text-slate-800 leading-tight line-clamp-2">{issue.title}</p>
                    <div className="mt-2 text-[8px] font-black text-emerald-600 uppercase">{issue.status}</div>
                  </div>
                ))}

                {data.prs.map(pr => (
                  <div key={pr.id} className="p-3 bg-blue-50/80 border border-blue-100 rounded-2xl shadow-sm hover:shadow-md transition-all">
                    <div className="flex items-center gap-2 mb-2">
                      <GitPullRequest size={12} className="text-blue-600" />
                      <span className="text-[9px] font-black text-blue-700 uppercase tracking-tighter">PR #{pr.number}</span>
                    </div>
                    <p className="text-[11px] font-bold text-slate-800 leading-tight line-clamp-2">{pr.title}</p>
                    <div className={`mt-2 text-[8px] font-black uppercase ${pr.state === 'closed' ? 'text-indigo-600' : 'text-emerald-600'}`}>
                      {pr.state}
                    </div>
                  </div>
                ))}

                {data.commits.map(commit => (
                  <div key={commit.id} className="p-3 bg-amber-50/80 border border-amber-100 rounded-2xl shadow-sm hover:shadow-md transition-all">
                    <div className="flex items-center gap-2 mb-2">
                      <GitCommit size={12} className="text-amber-600" />
                      <span className="text-[9px] font-black text-amber-700 uppercase tracking-tighter">{commit.id}</span>
                    </div>
                    <p className="text-[11px] font-medium text-slate-600 leading-tight italic line-clamp-2">"{commit.message}"</p>
                    <div className="mt-2 text-[8px] font-black text-amber-500 uppercase">{commit.author.split(' ')[0]}</div>
                  </div>
                ))}

                {data.issues.length === 0 && data.commits.length === 0 && data.prs.length === 0 && (
                   <div className="h-full w-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                   </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Legend & Footer */}
      <div className="flex justify-between items-center px-8 py-5 bg-slate-900 rounded-[30px] text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] shadow-xl">
         <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-lg">
              <Info size={16} />
            </div>
            <span>Select a Sprint timeline to generate or view deep-dive AI documentation</span>
         </div>
         <div className="flex items-center gap-6">
            <span className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
              Real-time Ecosystem Sync
            </span>
            <span className="text-white/20">|</span>
            <span>SprintGenius Analytics Engine v2.5</span>
         </div>
      </div>
    </div>
  );
};

const LegendItem = ({ color, label }: { color: string, label: string }) => (
  <div className="flex items-center gap-2 px-3 border-r border-slate-100 last:border-0">
    <div className={`w-2 h-2 rounded-full ${color}`} />
    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none">{label}</span>
  </div>
);

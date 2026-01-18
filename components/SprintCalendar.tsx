import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, GitCommit, CheckSquare, GitPullRequest } from 'lucide-react';
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
    <div className="max-w-7xl mx-auto space-y-8 py-8">
      {/* Header */}
      <div className="text-center space-y-4 mb-12">
        <h1 className="text-4xl tracking-tight text-gray-900" style={{ fontFamily: 'Playfair Display, serif' }}>
          Sprint Timeline
        </h1>
        <p className="text-base text-gray-500 font-light">
          View your sprint activity across time
        </p>
      </div>

      {/* Calendar Controls */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-medium text-gray-900">
            {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </h2>
          {isViewingCurrentWeek && (
            <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
              Current Week
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={() => navigateWeek(-1)} 
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-gray-900"
            title="Previous Week"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={() => setCurrentDate(new Date())} 
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
              isViewingCurrentWeek 
                ? 'bg-gray-900 text-white' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Today
          </button>
          <button 
            onClick={() => navigateWeek(1)} 
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-gray-900"
            title="Next Week"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-6 text-xs text-gray-500 pb-4 border-b border-gray-100">
        <LegendItem color="bg-gray-900" label="Sprint" />
        <LegendItem color="bg-green-500" label="Issue" />
        <LegendItem color="bg-blue-500" label="PR" />
        <LegendItem color="bg-amber-500" label="Commit" />
      </div>

      {/* Calendar Grid */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        {/* Days Header */}
        <div className="grid grid-cols-7 border-b border-gray-100 bg-gray-50">
          {weekDays.map((day, idx) => {
            const isToday = isSameDay(day, new Date());
            return (
              <div key={idx} className={`p-4 text-center border-r border-gray-100 last:border-r-0 ${isToday ? 'bg-gray-100' : ''}`}>
                <p className={`text-xs font-medium mb-2 ${isToday ? 'text-gray-900' : 'text-gray-500'}`}>
                  {day.toLocaleDateString('default', { weekday: 'short' })}
                </p>
                <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg text-lg font-medium ${
                  isToday 
                    ? 'bg-gray-900 text-white' 
                    : 'text-gray-700'
                }`}>
                  {day.getDate()}
                </div>
              </div>
            );
          })}
        </div>

        {/* Sprint Bars */}
        {visibleSprints.length > 0 && (
          <div className="relative border-b border-gray-100 bg-gray-50 p-3 space-y-2">
            {visibleSprints.map((sprint) => {
              const startIdx = weekDays.findIndex(d => isSameDay(d, new Date(sprint.startDate + 'T00:00:00')));
              const endIdx = weekDays.findIndex(d => isSameDay(d, new Date(sprint.endDate + 'T00:00:00')));
              
              const effectiveStartIdx = startIdx === -1 ? 0 : startIdx;
              const effectiveEndIdx = endIdx === -1 ? 6 : endIdx;
              
              const width = ((effectiveEndIdx - effectiveStartIdx + 1) / 7) * 100;
              const left = (effectiveStartIdx / 7) * 100;

              return (
                <div 
                  key={sprint.id}
                  onClick={() => onSelectSprint(sprint)}
                  className="relative h-8 bg-gray-900 text-white text-xs font-medium px-3 rounded-lg flex items-center cursor-pointer hover:bg-gray-800 transition-all truncate"
                  style={{ width: `${width}%`, left: `${left}%` }}
                >
                  {sprint.customName || sprint.repoName}
                </div>
              );
            })}
          </div>
        )}

        {/* Activity Grid */}
        <div className="grid grid-cols-7 divide-x divide-gray-100 min-h-[500px]">
          {weekDays.map((day, idx) => {
            const dateStr = formatDateString(day);
            const data = itemsByDay[dateStr];
            const isToday = isSameDay(day, new Date());
            
            return (
              <div key={idx} className={`p-2 space-y-2 ${isToday ? 'bg-gray-50' : ''}`}>
                {data.issues.map(issue => (
                  <div key={issue.id} className="p-2 bg-green-50 border border-green-100 rounded-lg hover:shadow-sm transition-all">
                    <div className="flex items-center gap-1 mb-1">
                      <CheckSquare size={10} className="text-green-600" />
                      <span className="text-[10px] font-medium text-green-700">{issue.id}</span>
                    </div>
                    <p className="text-[11px] text-gray-800 leading-tight line-clamp-2">{issue.title}</p>
                  </div>
                ))}

                {data.prs.map(pr => (
                  <div key={pr.id} className="p-2 bg-blue-50 border border-blue-100 rounded-lg hover:shadow-sm transition-all">
                    <div className="flex items-center gap-1 mb-1">
                      <GitPullRequest size={10} className="text-blue-600" />
                      <span className="text-[10px] font-medium text-blue-700">#{pr.number}</span>
                    </div>
                    <p className="text-[11px] text-gray-800 leading-tight line-clamp-2">{pr.title}</p>
                  </div>
                ))}

                {data.commits.map(commit => (
                  <div key={commit.id} className="p-2 bg-amber-50 border border-amber-100 rounded-lg hover:shadow-sm transition-all">
                    <div className="flex items-center gap-1 mb-1">
                      <GitCommit size={10} className="text-amber-600" />
                      <span className="text-[10px] font-medium text-amber-700">{commit.id}</span>
                    </div>
                    <p className="text-[11px] text-gray-600 leading-tight line-clamp-2 italic">"{commit.message}"</p>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Info */}
      <div className="text-center text-sm text-gray-400 py-6">
        Click on a sprint bar to view detailed report
      </div>
    </div>
  );
};

const LegendItem = ({ color, label }: { color: string, label: string }) => (
  <div className="flex items-center gap-2">
    <div className={`w-2 h-2 rounded-full ${color}`} />
    <span>{label}</span>
  </div>
);
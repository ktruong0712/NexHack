
import React from 'react';
import { LayoutDashboard, Link2, FileText, Rocket, ChevronRight, Calendar, Users, Shield, Zap } from 'lucide-react';
import { AppView } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  currentView: AppView;
  setView: (view: AppView) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentView, setView }) => {
  const navItems = [
    { id: 'dashboard', label: 'History', icon: LayoutDashboard },
    { id: 'setup', label: 'New Analysis', icon: Link2 },
    { id: 'calendar', label: 'Timeline', icon: Calendar },
  ];

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900">
      {/* Sidebar */}
      <aside className="w-72 bg-slate-900 text-white flex flex-col shadow-2xl z-20">
        <div className="p-8 flex items-center gap-4">
          <div className="p-2 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-500/20">
            <Rocket className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-black tracking-tighter uppercase leading-none">SprintGenius</h1>
        </div>
        
        <nav className="flex-1 px-4 py-8 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id as AppView)}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all ${
                currentView === item.id 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <item.icon size={22} />
              <span className="font-black text-xs uppercase tracking-widest leading-none">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-slate-800">
          <div className="p-4 bg-slate-800/50 rounded-2xl border border-slate-700">
            <div className="flex items-center gap-3 mb-3">
              <Shield size={16} className="text-indigo-400" />
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Team Status</p>
            </div>
            <div className="flex items-center gap-3">
               <div className="flex -space-x-2">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="w-6 h-6 rounded-full border-2 border-slate-800 bg-slate-600" />
                  ))}
               </div>
               <span className="text-xs font-bold text-slate-300">Active Node</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-slate-50 relative">
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-10 sticky top-0 z-10">
          <div className="flex items-center gap-4 text-xs font-black uppercase tracking-[0.2em] text-slate-400">
             <span className="text-indigo-600">Workspace</span>
             <ChevronRight size={14} />
             <span className="text-slate-900">{currentView.replace('-', ' ')}</span>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-widest">
              <Zap size={14} />
              Live Context
            </div>
            <div className="h-8 w-[1px] bg-slate-200" />
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-xs font-black uppercase tracking-widest text-slate-900">Engineering Hub</p>
                <p className="text-[9px] text-slate-400 font-bold">Analysis Engine v3.0</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center">
                <Users size={20} className="text-slate-500" />
              </div>
            </div>
          </div>
        </header>

        <div className="p-10 max-w-[1600px] mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

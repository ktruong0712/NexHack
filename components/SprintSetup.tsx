
import React, { useState } from 'react';
import { Github, Key, Mail, Globe, Calendar, Rocket, ChevronRight, Link2, AlertCircle } from 'lucide-react';
import { Credentials, SprintData } from '../types';

interface SprintSetupProps {
  credentials: Credentials;
  onSaveCreds: (creds: Credentials) => void;
  onNext: (config: Partial<SprintData>) => void;
  error?: string | null;
}

export const SprintSetup: React.FC<SprintSetupProps> = ({ credentials, onSaveCreds, onNext, error }) => {
  const [ghToken, setGhToken] = useState(credentials.githubToken || '');
  const [jEmail, setJEmail] = useState(credentials.jiraEmail || '');
  const [jToken, setJToken] = useState(credentials.jiraToken || '');
  
  const [repoOwner, setRepoOwner] = useState('');
  const [repoName, setRepoName] = useState('');
  
  // Default to last 14 days
  const defaultStart = new Date();
  defaultStart.setDate(defaultStart.getDate() - 14);
  const [startDate, setStartDate] = useState(defaultStart.toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

  const [jiraDomain, setJiraDomain] = useState('');
  const [jiraProject, setJiraProject] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveCreds({ githubToken: ghToken, jiraEmail: jEmail, jiraToken: jToken });
    onNext({ repoOwner, repoName, startDate, endDate, jiraDomain, jiraProject });
  };

  return (
    <div className="max-w-5xl mx-auto py-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4 mb-10">
        <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-lg">
          <Link2 size={24} />
        </div>
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase leading-none">Step 1: Ecosystem Connection</h2>
          <p className="text-slate-500 font-medium">Connect your professional tools to synchronize real activity.</p>
        </div>
      </div>

      {error && (
        <div className="mb-8 p-6 bg-red-50 border border-red-200 rounded-3xl flex items-start gap-4 animate-in slide-in-from-top-2">
          <AlertCircle className="text-red-500 mt-1 flex-shrink-0" size={24} />
          <div>
            <h4 className="font-black text-red-900 uppercase text-xs tracking-widest mb-1">Synchronization Failed</h4>
            <p className="text-red-700 text-sm font-medium">{error}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-8">
          <div className="bg-white p-8 rounded-[35px] border border-slate-200 shadow-sm space-y-6">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-indigo-600 mb-2 flex items-center gap-2">
              <Key size={14} /> GitHub Authentication (Required)
            </h3>
            
            <div className="space-y-4">
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400">Personal Access Token</label>
              <input 
                type="password"
                required
                placeholder="ghp_xxxxxxxxxxxx"
                value={ghToken}
                onChange={(e) => setGhToken(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-indigo-500/10 focus:outline-none transition-all font-mono text-sm"
              />
              <p className="text-[10px] text-slate-400">Need a token? Generate one in Developer Settings with 'repo' scope.</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400">GitHub Owner</label>
                <input 
                  required
                  placeholder="e.g. facebook"
                  value={repoOwner}
                  onChange={(e) => setRepoOwner(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-indigo-500/10 focus:outline-none font-bold"
                />
              </div>
              <div className="space-y-4">
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400">Repo Name</label>
                <input 
                  required
                  placeholder="e.g. react"
                  value={repoName}
                  onChange={(e) => setRepoName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-indigo-500/10 focus:outline-none font-bold"
                />
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[35px] border border-slate-200 shadow-sm space-y-6 opacity-80 hover:opacity-100 transition-opacity">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 mb-2 flex items-center gap-2">
              <Calendar size={14} /> Sprint Window
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400">Start Date</label>
                <input 
                  type="date"
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-indigo-500/10 focus:outline-none font-bold"
                />
              </div>
              <div className="space-y-4">
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400">End Date</label>
                <input 
                  type="date"
                  required
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-indigo-500/10 focus:outline-none font-bold"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white p-8 rounded-[35px] border border-slate-200 shadow-sm space-y-6">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-indigo-600 mb-2 flex items-center gap-2">
              <Globe size={14} /> Jira Integration (Optional)
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400">Site Domain</label>
                <input 
                  placeholder="my-company"
                  value={jiraDomain}
                  onChange={(e) => setJiraDomain(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-indigo-500/10 focus:outline-none font-bold"
                />
              </div>
              <div className="space-y-4">
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400">Project Key</label>
                <input 
                  placeholder="PROJ"
                  value={jiraProject}
                  onChange={(e) => setJiraProject(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-indigo-500/10 focus:outline-none font-bold uppercase"
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400">Atlassian Email</label>
              <input 
                type="email"
                placeholder="name@company.com"
                value={jEmail}
                onChange={(e) => setJEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-indigo-500/10 focus:outline-none transition-all text-sm"
              />
            </div>
            <div className="space-y-4">
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400">Jira API Token</label>
              <input 
                type="password"
                placeholder="ATATT..."
                value={jToken}
                onChange={(e) => setJToken(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-indigo-500/10 focus:outline-none transition-all font-mono text-sm"
              />
              <p className="text-[10px] text-slate-400">Requires a 'Basic Auth' API Token from your Atlassian account security page.</p>
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-indigo-600 text-white py-6 rounded-[30px] font-black text-xs uppercase tracking-[0.3em] shadow-2xl shadow-indigo-500/30 hover:bg-indigo-700 active:scale-95 transition-all flex items-center justify-center gap-4"
          >
            Pull Source Data <ChevronRight size={18} />
          </button>
        </div>
      </form>
    </div>
  );
};

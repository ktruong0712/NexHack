import React, { useState } from 'react';
import { Github, Key, Mail, Globe, Calendar, AlertCircle, ChevronLeft } from 'lucide-react';
import { Credentials, SprintData } from '../types';

interface SprintSetupProps {
  credentials: Credentials;
  onSaveCreds: (creds: Credentials) => void;
  onNext: (config: Partial<SprintData>) => void;
  onBack?: () => void;
  error?: string | null;
}

export const SprintSetup: React.FC<SprintSetupProps> = ({ credentials, onSaveCreds, onNext, onBack, error }) => {
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
    <div className="max-w-3xl mx-auto py-12">
      {/* Back Button */}
      {onBack && (
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-8 transition-colors"
        >
          <ChevronLeft size={16} />
          Back
        </button>
      )}

      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl tracking-tight text-gray-900 mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
          Connect Repository
        </h1>
        <p className="text-base text-gray-500 font-light">
          Link your GitHub repository to create a sprint report
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3">
          <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={18} />
          <div>
            <p className="text-sm text-red-800 font-medium">{error}</p>
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* GitHub Section */}
        <div className="bg-white border border-gray-200 rounded-2xl p-8 space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-gray-100">
            <Github size={18} className="text-gray-400" />
            <h2 className="text-sm font-medium text-gray-900 uppercase tracking-wide">GitHub Connection</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Personal Access Token <span className="text-red-500">*</span>
              </label>
              <input 
                type="password"
                required
                placeholder="ghp_xxxxxxxxxxxx"
                value={ghToken}
                onChange={(e) => setGhToken(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent focus:outline-none transition-all font-mono"
              />
              <p className="text-xs text-gray-400 mt-1.5">Generate a token in GitHub Developer Settings with 'repo' scope</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Repository Owner <span className="text-red-500">*</span>
                </label>
                <input 
                  required
                  placeholder="e.g. facebook"
                  value={repoOwner}
                  onChange={(e) => setRepoOwner(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent focus:outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Repository Name <span className="text-red-500">*</span>
                </label>
                <input 
                  required
                  placeholder="e.g. react"
                  value={repoName}
                  onChange={(e) => setRepoName(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent focus:outline-none transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Date Range Section */}
        <div className="bg-white border border-gray-200 rounded-2xl p-8 space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-gray-100">
            <Calendar size={18} className="text-gray-400" />
            <h2 className="text-sm font-medium text-gray-900 uppercase tracking-wide">Sprint Period</h2>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Start Date <span className="text-red-500">*</span>
              </label>
              <input 
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent focus:outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                End Date <span className="text-red-500">*</span>
              </label>
              <input 
                type="date"
                required
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent focus:outline-none transition-all"
              />
            </div>
          </div>
        </div>

        {/* Jira Section (Optional) */}
        <div className="bg-white border border-gray-200 rounded-2xl p-8 space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-gray-100">
            <Globe size={18} className="text-gray-400" />
            <h2 className="text-sm font-medium text-gray-900 uppercase tracking-wide">Jira Integration</h2>
            <span className="text-xs text-gray-400 ml-auto">(Optional)</span>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">Site Domain</label>
                <input 
                  placeholder="my-company"
                  value={jiraDomain}
                  onChange={(e) => setJiraDomain(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent focus:outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">Project Key</label>
                <input 
                  placeholder="PROJ"
                  value={jiraProject}
                  onChange={(e) => setJiraProject(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent focus:outline-none transition-all uppercase"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Atlassian Email</label>
              <input 
                type="email"
                placeholder="name@company.com"
                value={jEmail}
                onChange={(e) => setJEmail(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent focus:outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Jira API Token</label>
              <input 
                type="password"
                placeholder="ATATT..."
                value={jToken}
                onChange={(e) => setJToken(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent focus:outline-none transition-all font-mono"
              />
              <p className="text-xs text-gray-400 mt-1.5">Generate a token from your Atlassian account security settings</p>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button 
          type="submit"
          className="w-full bg-gray-900 text-white py-4 rounded-full text-sm font-medium hover:bg-gray-800 transition-all shadow-sm"
        >
          Generate Report
        </button>
      </form>
    </div>
  );
};
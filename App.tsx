
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { SprintSetup } from './components/SprintSetup';
import { TemplateSelection } from './components/TemplateSelection';
import { RawDataPreview } from './components/RawDataPreview';
import { ReportPreview } from './components/ReportPreview';
import { SprintCalendar } from './components/SprintCalendar';
import { AppView, SprintData, SprintReport, Credentials, ReportTemplate } from './types';
import { fetchGithubCommits, fetchGithubPullRequests } from './services/githubService';
import { fetchJiraIssues } from './services/jiraService';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>('dashboard');
  const [credentials, setCredentials] = useState<Credentials>({});
  const [sprintHistory, setSprintHistory] = useState<SprintData[]>([]);
  const [activeSprint, setActiveSprint] = useState<SprintData | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    const savedHistory = localStorage.getItem('sg_global_history');
    const savedCreds = localStorage.getItem('sg_global_creds');
    if (savedHistory) setSprintHistory(JSON.parse(savedHistory));
    if (savedCreds) setCredentials(JSON.parse(savedCreds));
  }, []);

  const saveToHistory = (sprint: SprintData) => {
    const newHistory = [sprint, ...sprintHistory.filter(s => s.id !== sprint.id)];
    setSprintHistory(newHistory);
    localStorage.setItem('sg_global_history', JSON.stringify(newHistory));
  };

  const saveCredentials = (creds: Credentials) => {
    setCredentials(creds);
    localStorage.setItem('sg_global_creds', JSON.stringify(creds));
  };

  const handleSetupDone = async (config: Partial<SprintData>) => {
    setIsFetching(true);
    setFetchError(null);
    try {
      const startDate = config.startDate || '';
      const endDate = config.endDate || '';
      const repoOwner = config.repoOwner || '';
      const repoName = config.repoName || '';

      if (!repoOwner || !repoName) throw new Error("Repository owner and name are required.");

      // FETCH REAL DATA
      const [commits, pullRequests] = await Promise.all([
        fetchGithubCommits(repoOwner, repoName, startDate, endDate, credentials.githubToken),
        fetchGithubPullRequests(repoOwner, repoName, startDate, endDate, credentials.githubToken)
      ]);

      let issues = [];
      if (config.jiraDomain && config.jiraProject && credentials.jiraEmail && credentials.jiraToken) {
        issues = await fetchJiraIssues(config.jiraDomain, config.jiraProject, credentials.jiraEmail, credentials.jiraToken, startDate, endDate);
      }

      if (commits.length === 0 && pullRequests.length === 0) {
        throw new Error("No activity found for this repository in the selected date range. Please check your settings.");
      }

      const newSprint: SprintData = {
        id: `sprint-${Date.now()}`,
        startDate,
        endDate,
        repoOwner,
        repoName,
        jiraDomain: config.jiraDomain,
        jiraProject: config.jiraProject,
        commits,
        issues,
        pullRequests,
      };

      setActiveSprint(newSprint);
      setCurrentView('templates');
    } catch (err) {
      setFetchError(err instanceof Error ? err.message : "An unexpected error occurred during synchronization.");
    } finally {
      setIsFetching(false);
    }
  };

  const handleTemplateSelect = (template: ReportTemplate) => {
    if (activeSprint) {
      setActiveSprint({ ...activeSprint, template });
      setCurrentView('raw-preview');
    }
  };

  const handleProceedToReport = () => setCurrentView('report');

  const handleReportGenerated = (report: SprintReport) => {
    if (activeSprint) {
      const updatedSprint = { ...activeSprint, report };
      setActiveSprint(updatedSprint);
      saveToHistory(updatedSprint);
    }
  };

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard onStart={() => setCurrentView('setup')} history={sprintHistory} />;
      case 'setup':
        return <SprintSetup credentials={credentials} onSaveCreds={saveCredentials} onNext={handleSetupDone} error={fetchError} />;
      case 'templates':
        return <TemplateSelection onSelect={handleTemplateSelect} />;
      case 'raw-preview':
        return activeSprint ? <RawDataPreview data={activeSprint} onNext={handleProceedToReport} /> : null;
      case 'report':
        return activeSprint ? <ReportPreview data={activeSprint} report={activeSprint.report || null} setReport={handleReportGenerated} /> : null;
      case 'calendar':
        return <SprintCalendar history={sprintHistory} onSelectSprint={(s) => { setActiveSprint(s); setCurrentView('report'); }} />;
      default:
        return <Dashboard onStart={() => setCurrentView('setup')} history={sprintHistory} />;
    }
  };

  return (
    <Layout currentView={currentView} setView={setCurrentView}>
      {isFetching ? (
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8 animate-in fade-in">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-slate-100 rounded-full"></div>
            <div className="w-20 h-20 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
          </div>
          <div className="text-center">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Synchronizing Live Data</h2>
            <p className="text-slate-500 mt-2 font-medium italic">Fetching commits, PRs and tasks from GitHub & Jira APIs...</p>
          </div>
        </div>
      ) : renderView()}
    </Layout>
  );
};

export default App;

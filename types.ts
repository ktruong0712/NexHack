
export interface Commit {
  id: string;
  author: string;
  message: string;
  date: string;
  type: 'feature' | 'fix' | 'refactor' | 'docs' | 'other';
  changes: number;
}

export interface Issue {
  id: string;
  title: string;
  status: string;
  assignee: string;
  labels: string[];
  dueDate?: string;
  updatedAt?: string;
}

export interface PullRequest {
  id: number;
  number: number;
  title: string;
  author: string;
  state: 'open' | 'closed';
  mergedAt?: string;
  createdAt: string;
  body: string;
  htmlUrl: string;
}

export type ReportTemplate = 'generic' | 'cs-capstone' | 'agile-reflection';

export interface SprintData {
  id: string;
  startDate: string;
  endDate: string;
  repoOwner: string;
  repoName: string;
  template?: ReportTemplate;
  jiraDomain?: string;
  jiraProject?: string;
  commits: Commit[];
  issues: Issue[];
  pullRequests: PullRequest[];
  report?: SprintReport;
}

export interface Credentials {
  githubToken?: string;
  jiraToken?: string;
  jiraEmail?: string;
}

export interface SprintReport {
  summary: string;
  individualContributions: {
    name: string;
    highlights: string[];
    metrics: { commits: number; issuesResolved: number; prsMerged: number };
  }[];
  technicalHighlights: string[];
  blockers: string[];
  velocityScore: number;
  futureGoals: string[];
  dataCorrelation?: string; 
  prSummary?: string;
}

export type AppView = 'dashboard' | 'setup' | 'templates' | 'raw-preview' | 'report' | 'calendar';

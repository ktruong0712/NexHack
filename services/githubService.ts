
import { Commit, PullRequest } from '../types';

export const fetchGithubCommits = async (
  owner: string,
  repo: string,
  since: string,
  until: string,
  token?: string
): Promise<Commit[]> => {
  if (!owner || !repo) throw new Error("Owner and Repository name are required.");

  const headers: HeadersInit = {
    'Accept': 'application/vnd.github.v3+json',
  };
  if (token) {
    headers['Authorization'] = `token ${token}`;
  }

  // GitHub API expects ISO 8601 format
  const sinceISO = new Date(since).toISOString();
  const untilISO = new Date(until);
  untilISO.setHours(23, 59, 59, 999);
  const untilISOStr = untilISO.toISOString();

  const url = `https://api.github.com/repos/${owner}/${repo}/commits?since=${sinceISO}&until=${untilISOStr}&per_page=100`;
  
  const response = await fetch(url, { headers });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(`GitHub Error: ${error.message || response.statusText}`);
  }

  const data = await response.json();
  
  return data.map((item: any) => {
    const msg = item.commit.message.toLowerCase();
    let type: Commit['type'] = 'other';
    if (msg.startsWith('feat')) type = 'feature';
    else if (msg.startsWith('fix')) type = 'fix';
    else if (msg.startsWith('docs')) type = 'docs';
    else if (msg.startsWith('refactor')) type = 'refactor';

    return {
      id: item.sha.substring(0, 7),
      author: item.commit.author.name || item.author?.login || 'Unknown',
      message: item.commit.message,
      date: item.commit.author.date,
      type,
      changes: 0, // Changes count requires a separate comparison call for production
    };
  });
};

export const fetchGithubPullRequests = async (
  owner: string,
  repo: string,
  since: string,
  until: string,
  token?: string
): Promise<PullRequest[]> => {
  const headers: HeadersInit = {
    'Accept': 'application/vnd.github.v3+json',
  };
  if (token) {
    headers['Authorization'] = `token ${token}`;
  }

  const url = `https://api.github.com/repos/${owner}/${repo}/pulls?state=all&sort=updated&direction=desc&per_page=100`;
  
  const response = await fetch(url, { headers });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(`GitHub PR Error: ${error.message || response.statusText}`);
  }

  const data = await response.json();
  const startDate = new Date(since);
  const endDate = new Date(until);
  endDate.setHours(23, 59, 59);

  return data
    .filter((pr: any) => {
      const updatedAt = new Date(pr.updated_at);
      return updatedAt >= startDate && updatedAt <= endDate;
    })
    .map((pr: any) => ({
      id: pr.id,
      number: pr.number,
      title: pr.title,
      author: pr.user.login,
      state: pr.state,
      mergedAt: pr.merged_at,
      createdAt: pr.created_at,
      body: pr.body || '',
      htmlUrl: pr.html_url,
    }));
};

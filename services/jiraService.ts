
import { Issue } from '../types';

export const fetchJiraIssues = async (
  domain: string,
  projectKey: string,
  email: string,
  token: string,
  since: string,
  until: string
): Promise<Issue[]> => {
  if (!domain || !projectKey || !email || !token) return [];

  const auth = btoa(`${email}:${token}`);
  // Filtering by updated date to match the sprint window
  const jql = `project = "${projectKey}" AND updated >= "${since}" AND updated <= "${until}" ORDER BY updated DESC`;
  const url = `https://${domain}.atlassian.net/rest/api/3/search?jql=${encodeURIComponent(jql)}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Accept': 'application/json',
      }
    });

    if (!response.ok) {
      if (response.status === 401) throw new Error('Jira Unauthorized: Check Email and API Token.');
      throw new Error(`Jira API Error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.issues.map((issue: any) => ({
      id: issue.key,
      title: issue.fields.summary,
      status: issue.fields.status.name,
      assignee: issue.fields.assignee?.displayName || 'Unassigned',
      labels: issue.fields.labels || [],
      updatedAt: issue.fields.updated.split('T')[0]
    }));
  } catch (err) {
    console.error("Jira Fetch Exception:", err);
    throw err; // Re-throw to handle in UI
  }
};


import { GoogleGenAI, Type } from "@google/genai";
import { SprintData, SprintReport } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateSprintReport = async (data: SprintData): Promise<SprintReport> => {
  const templateInstructions = {
    'generic': 'Focus on business value, efficiency, and stakeholder-level outcomes.',
    'cs-capstone': 'Focus on technical complexity, implementation details, academic rigor, and individual pedagogical impact.',
    'agile-reflection': 'Focus on process health, team velocity, retrospective analysis, and continuous improvement.'
  }[data.template || 'generic'];

  const prompt = `
    Analyze this combined sprint data from GitHub (Commits, Pull Requests) and Jira.
    
    TEMPLATE MODE: ${data.template || 'generic'}
    INSTRUCTION: ${templateInstructions}

    CONTEXT:
    Repository: ${data.repoOwner}/${data.repoName}
    Sprint Period: ${data.startDate} to ${data.endDate}
    Jira Project: ${data.jiraProject || 'N/A'}
    
    RAW DATA - COMMITS:
    ${data.commits.map(c => `- ${c.author} committed: "${c.message}" [SHA: ${c.id}]`).join('\n')}
    
    RAW DATA - PULL REQUESTS:
    ${data.pullRequests.map(pr => `- PR #${pr.number} [${pr.state}]: "${pr.title}" by ${pr.author}. Description: ${pr.body.substring(0, 100)}...`).join('\n')}
    
    RAW DATA - JIRA ISSUES:
    ${data.issues.map(i => `- [${i.status}] ${i.id}: ${i.title} (Assigned: ${i.assignee})`).join('\n')}
    
    TASK:
    Generate a professional synthesized report. You MUST correlate the commits, PRs, and issues.
    CITATION RULE: For major findings or individual highlights, explicitly mention specific PR #numbers or Commit SHAs in parentheses like "(Based on: PR #12)".
    
    JSON SCHEMA REQUIREMENTS:
    1. summary: A high-level professional narrative of the sprint.
    2. individualContributions: Array of objects with name, highlights (correlating their commits/PRs to Jira tasks), and metrics.
    3. technicalHighlights: Key architectural or code changes extracted from commits and PR discussions.
    4. blockers: Problems identified from issue statuses, rejected PRs, or commit messages.
    5. velocityScore: 0-100 based on completion rate and PR throughput.
    6. futureGoals: Next steps based on open PRs and remaining Jira issues.
    7. dataCorrelation: A specific section explaining how coding activity, PR reviews, and task tracking aligned.
    8. prSummary: A specific summary of pull request activity, highlighting peer review and code quality.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING },
          individualContributions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                highlights: { type: Type.ARRAY, items: { type: Type.STRING } },
                metrics: {
                  type: Type.OBJECT,
                  properties: {
                    commits: { type: Type.NUMBER },
                    issuesResolved: { type: Type.NUMBER },
                    prsMerged: { type: Type.NUMBER }
                  },
                  required: ["commits", "issuesResolved", "prsMerged"]
                }
              },
              required: ["name", "highlights", "metrics"]
            }
          },
          technicalHighlights: { type: Type.ARRAY, items: { type: Type.STRING } },
          blockers: { type: Type.ARRAY, items: { type: Type.STRING } },
          velocityScore: { type: Type.NUMBER },
          futureGoals: { type: Type.ARRAY, items: { type: Type.STRING } },
          dataCorrelation: { type: Type.STRING },
          prSummary: { type: Type.STRING }
        },
        required: ["summary", "individualContributions", "technicalHighlights", "blockers", "velocityScore", "futureGoals", "dataCorrelation", "prSummary"]
      }
    }
  });

  const text = response.text || "{}";
  return JSON.parse(text) as SprintReport;
};

import React, { useEffect, useState } from 'react';
import { Download, FileText, Loader2, AlertCircle, Edit3, Save } from 'lucide-react';
import { SprintData, SprintReport } from '../types';
import { generateSprintReport } from '../services/geminiService';

interface ReportPreviewProps {
  data: SprintData;
  report: SprintReport | null;
  setReport: (report: SprintReport) => void;
  onBack?: () => void;
}

export const ReportPreview: React.FC<ReportPreviewProps> = ({ data, report, setReport, onBack }) => {
  const [loading, setLoading] = useState(!report);
  const [error, setError] = useState<string | null>(null);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempReport, setTempReport] = useState<SprintReport | null>(report);

  useEffect(() => {
    if (!report) {
      const fetchReport = async () => {
        try {
          setLoading(true);
          const res = await generateSprintReport(data);
          setReport(res);
          setTempReport(res);
        } catch (err) {
          setError('Failed to generate report. Please ensure your API key is valid.');
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchReport();
    } else {
      setTempReport(report);
    }
  }, [data, report, setReport]);

  const handleSaveEdit = () => {
    if (tempReport) {
      setReport(tempReport);
      setEditingField(null);
    }
  };

  const handleExportMarkdown = () => {
    if (!report) return;
    const content = `# Sprint Report: ${data.repoName}\n\n## Summary\n${report.summary}\n\n## PR Summary\n${report.prSummary}\n\n## Technical Highlights\n${report.technicalHighlights.join('\n')}`;
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sprint-report-${data.repoName}.md`;
    a.click();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
          <Loader2 className="animate-spin text-gray-400" size={32} />
        </div>
        <div>
          <h2 className="text-xl font-medium text-gray-900 mb-2">Generating Report</h2>
          <p className="text-sm text-gray-500 max-w-md mx-auto">
            Analyzing {data.commits.length} commits and {data.pullRequests.length} pull requests...
          </p>
        </div>
      </div>
    );
  }

  if (error || !report || !tempReport) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] text-center space-y-4">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center">
          <AlertCircle size={32} className="text-red-500" />
        </div>
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Generation Failed</h3>
          <p className="text-sm text-gray-500">{error || 'Something went wrong.'}</p>
        </div>
        <button 
          onClick={() => window.location.reload()} 
          className="px-6 py-2.5 bg-gray-900 text-white rounded-full text-sm font-medium hover:bg-gray-800 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-12 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between mb-12">
        <div>
          <h1 className="text-3xl tracking-tight text-gray-900 mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
            Sprint Report
          </h1>
          <p className="text-sm text-gray-500">{data.repoName} · {data.startDate} to {data.endDate}</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleExportMarkdown}
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-sm font-medium transition-all"
          >
            <FileText size={16} />
            Export
          </button>
          <button 
            onClick={() => { navigator.clipboard.writeText(JSON.stringify(report, null, 2)); alert('Copied to clipboard!'); }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 text-sm font-medium transition-all"
          >
            <Download size={16} />
            Copy JSON
          </button>
        </div>
      </div>

      {/* Report Content */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        {/* Metrics Header */}
        <div className="p-8 bg-gray-50 border-b border-gray-200">
          <div className="grid grid-cols-4 gap-4 mb-6">
            <MetricBox label="Velocity" value={`${report.velocityScore}%`} />
            <MetricBox label="Commits" value={data.commits.length.toString()} />
            <MetricBox label="PRs" value={data.pullRequests.length.toString()} />
            <MetricBox label="Issues" value={data.issues.length.toString()} />
          </div>
          <p className="text-xs text-gray-500">Template: {data.template}</p>
        </div>

        {/* Content */}
        <div className="p-8 space-y-10">
          {/* Summary */}
          <section className="group relative">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-900">Executive Summary</h2>
              <button 
                onClick={() => setEditingField(editingField === 'summary' ? null : 'summary')}
                className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-400 hover:text-gray-900 transition-all"
              >
                {editingField === 'summary' ? <Save size={16} onClick={handleSaveEdit} /> : <Edit3 size={16} />}
              </button>
            </div>
            {editingField === 'summary' ? (
              <textarea 
                className="w-full text-base text-gray-700 leading-relaxed bg-gray-50 p-6 rounded-xl border border-gray-300 focus:outline-none focus:border-gray-400 h-40"
                value={tempReport.summary}
                onChange={(e) => setTempReport({...tempReport, summary: e.target.value})}
              />
            ) : (
              <p className="text-base text-gray-700 leading-relaxed bg-gray-50 p-6 rounded-xl">
                {tempReport.summary}
              </p>
            )}
          </section>

          {/* PR Summary */}
          {tempReport.prSummary && (
            <section>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Pull Request Analysis</h2>
              <p className="text-sm text-gray-600 leading-relaxed bg-blue-50 p-6 rounded-xl border border-blue-100">
                {tempReport.prSummary}
              </p>
            </section>
          )}

          {/* Team Contributions */}
          <section>
            <h2 className="text-lg font-medium text-gray-900 mb-6">Team Contributions</h2>
            <div className="space-y-6">
              {tempReport.individualContributions.map((contributor, idx) => (
                <div key={idx} className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-medium text-gray-900">{contributor.name}</h3>
                    <div className="flex gap-3 text-xs text-gray-500">
                      <span>{contributor.metrics.commits} commits</span>
                      <span>{contributor.metrics.prsMerged} PRs</span>
                    </div>
                  </div>
                  <ul className="space-y-2">
                    {contributor.highlights.map((h, i) => (
                      <li key={i} className="text-sm text-gray-600 flex gap-3">
                        <span className="text-gray-400">•</span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* Technical Highlights */}
          <section>
            <h2 className="text-lg font-medium text-gray-900 mb-6">Technical Highlights</h2>
            <div className="space-y-3">
              {tempReport.technicalHighlights.map((h, i) => (
                <div key={i} className="flex gap-3 text-sm text-gray-700 bg-gray-50 p-4 rounded-xl border-l-2 border-gray-900">
                  <span className="text-gray-400 font-medium">{i + 1}.</span>
                  <p>{h}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Future Goals */}
          <section>
            <h2 className="text-lg font-medium text-gray-900 mb-6">Next Steps</h2>
            <div className="space-y-3">
              {tempReport.futureGoals.map((goal, i) => (
                <div key={i} className="flex gap-3 items-start bg-gray-50 p-4 rounded-xl">
                  <span className="text-gray-400 font-medium text-sm">{i + 1}.</span>
                  <p className="text-sm text-gray-700">{goal}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="px-8 py-6 bg-gray-50 border-t border-gray-200 text-center">
          <p className="text-xs text-gray-400">
            Generated by Minerva · {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
};

const MetricBox: React.FC<{label: string, value: string}> = ({ label, value }) => (
  <div className="text-center">
    <div className="text-2xl font-medium text-gray-900 mb-1">{value}</div>
    <div className="text-xs text-gray-500">{label}</div>
  </div>
);
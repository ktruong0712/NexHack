import React from 'react';
import { Layout, Briefcase, FileText } from 'lucide-react';
import { ReportTemplate } from '../types';

interface TemplateSelectionProps {
  onSelect: (template: ReportTemplate) => void;
}

export const TemplateSelection: React.FC<TemplateSelectionProps> = ({ onSelect }) => {
  const templates: { id: ReportTemplate; title: string; desc: string; icon: any }[] = [
    {
      id: 'generic',
      title: 'Generic Sprint Report',
      desc: 'Standard professional format for engineering managers and stakeholders.',
      icon: Briefcase
    },
    {
      id: 'agile-reflection',
      title: 'Agile Reflection',
      desc: 'Introspective format focusing on process, blockers, and team dynamics.',
      icon: Layout
    }
  ];

  return (
    <div className="max-w-4xl mx-auto py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl tracking-tight text-gray-900 mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
          Choose Report Style
        </h1>
        <p className="text-base text-gray-500 font-light">
          Select a template to calibrate the tone and structure of your report
        </p>
      </div>

      {/* Template Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {templates.map((tpl) => (
          <button
            key={tpl.id}
            onClick={() => onSelect(tpl.id)}
            className="group relative bg-white border border-gray-200 rounded-2xl p-8 text-left hover:border-gray-900 hover:shadow-md transition-all"
          >
            {/* Icon */}
            <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 mb-6 group-hover:bg-gray-900 group-hover:text-white transition-all">
              <tpl.icon size={22} />
            </div>
            
            {/* Content */}
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {tpl.title}
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              {tpl.desc}
            </p>

            {/* Hover Indicator */}
            <div className="mt-6 pt-6 border-t border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-xs font-medium text-gray-900">
                Select this template →
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Helper Text */}
      <div className="text-center mt-12">
        <p className="text-sm text-gray-400">
          You can always regenerate with a different template later
        </p>
      </div>
    </div>
  );
};
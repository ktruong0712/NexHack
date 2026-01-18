
import React from 'react';
import { Layout, GraduationCap, Briefcase, FileText, Check } from 'lucide-react';
import { ReportTemplate } from '../types';

interface TemplateSelectionProps {
  onSelect: (template: ReportTemplate) => void;
}

export const TemplateSelection: React.FC<TemplateSelectionProps> = ({ onSelect }) => {
  const templates: { id: ReportTemplate; title: string; desc: string; icon: any; color: string }[] = [
    {
      id: 'generic',
      title: 'Generic Sprint Report',
      desc: 'Standard professional format for engineering managers and stakeholders.',
      icon: Briefcase,
      color: 'bg-blue-600'
    },
    {
      id: 'cs-capstone',
      title: 'CS Capstone Report',
      desc: 'Academic format with focus on individual impact and technical implementation.',
      icon: GraduationCap,
      color: 'bg-emerald-600'
    },
    {
      id: 'agile-reflection',
      title: 'Agile Reflection',
      desc: 'Introspective format focusing on process, blockers, and team dynamics.',
      icon: Layout,
      color: 'bg-indigo-600'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto py-12 animate-in fade-in zoom-in-95 duration-500">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-black text-slate-900 tracking-tight uppercase mb-4">Step 2: Documentation Format</h2>
        <p className="text-slate-500 text-lg">Select a template to calibrate the tone and structure of your generated report.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {templates.map((tpl) => (
          <button
            key={tpl.id}
            onClick={() => onSelect(tpl.id)}
            className="group relative bg-white border border-slate-200 rounded-[40px] p-10 text-left hover:border-indigo-600 hover:scale-105 transition-all shadow-sm hover:shadow-2xl hover:shadow-indigo-500/10"
          >
            <div className={`w-16 h-16 ${tpl.color} rounded-[20px] flex items-center justify-center text-white mb-8 shadow-lg group-hover:rotate-12 transition-transform`}>
              <tpl.icon size={28} />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-3 uppercase tracking-tight">{tpl.title}</h3>
            <p className="text-slate-500 text-sm leading-relaxed mb-8">{tpl.desc}</p>
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity">
              Select Template <Check size={14} />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

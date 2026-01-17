import React, { useState } from 'react';
import { useDiagramStore } from '@/store/diagramStore';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Copy, Check, Download } from 'lucide-react';

export const SQLGenerator: React.FC = () => {
  const { generateSQL, diagram } = useDiagramStore();
  const [copied, setCopied] = useState(false);

  const sql = generateSQL();

  const handleCopy = async () => {
    await navigator.clipboard.writeText(sql);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([sql], { type: 'text/sql' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'diagram_schema.sql';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Simple syntax highlighting
  const highlightSQL = (code: string) => {
    return code
      .replace(
        /(CREATE TABLE|PRIMARY KEY|NOT NULL|FOREIGN KEY|REFERENCES|INT|VARCHAR|TEXT|BOOLEAN|DATE|TIMESTAMP|ALTER TABLE|ADD COLUMN)/gi,
        '<span class="sql-keyword">$1</span>'
      )
      .replace(
        /(\(|\))/g,
        '<span class="text-muted-foreground">$1</span>'
      );
  };

  return (
    <div className="h-full flex flex-col bg-card border-l border-border">
      {/* Header */}
      <div className="panel-header flex items-center justify-between">
        <span>SQL Generator</span>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="h-7 px-2"
            disabled={diagram.entities.length === 0}
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-accent" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDownload}
            className="h-7 px-2"
            disabled={diagram.entities.length === 0}
          >
            <Download className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="p-3 border-b border-border">
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-muted">
            <span className="text-muted-foreground">Tables:</span>
            <span className="font-mono text-foreground">{diagram.entities.length}</span>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-muted">
            <span className="text-muted-foreground">Relations:</span>
            <span className="font-mono text-foreground">{diagram.relationships.length}</span>
          </div>
        </div>
      </div>

      {/* SQL Output */}
      <ScrollArea className="flex-1">
        {diagram.entities.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-sm">No entities to generate SQL from.</p>
            <p className="text-xs mt-1">Create some entities first!</p>
          </div>
        ) : (
          <pre
            className="sql-output m-2 text-xs leading-relaxed"
            dangerouslySetInnerHTML={{ __html: highlightSQL(sql) }}
          />
        )}
      </ScrollArea>

      {/* Help */}
      <div className="border-t border-border p-3">
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">
          Generated Output
        </p>
        <ul className="text-xs text-muted-foreground space-y-1">
          <li>• CREATE TABLE for each entity</li>
          <li>• PRIMARY KEY constraints</li>
          <li>• Junction tables for M:N</li>
          <li>• Foreign key suggestions</li>
        </ul>
      </div>
    </div>
  );
};

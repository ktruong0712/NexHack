import React, { useMemo } from 'react';
import { useDiagramStore } from '@/store/diagramStore';
import { ValidationIssue } from '@/types/diagram';
import { AlertCircle, AlertTriangle, Info, CheckCircle2, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';

export const ValidationPanel: React.FC = () => {
  const { validate, diagram } = useDiagramStore();

  const issues = useMemo(() => validate(), [diagram]);

  const errorCount = issues.filter((i) => i.type === 'error').length;
  const warningCount = issues.filter((i) => i.type === 'warning').length;
  const infoCount = issues.filter((i) => i.type === 'info').length;

  const getIcon = (type: ValidationIssue['type']) => {
    switch (type) {
      case 'error':
        return <AlertCircle className="w-4 h-4 text-destructive shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-warning shrink-0" />;
      case 'info':
        return <Info className="w-4 h-4 text-primary shrink-0" />;
    }
  };

  return (
    <div className="h-full flex flex-col bg-card border-l border-border">
      {/* Header */}
      <div className="panel-header flex items-center justify-between">
        <span>Validation</span>
        <div className="flex items-center gap-2 text-xs font-mono">
          {errorCount > 0 && (
            <span className="text-destructive">{errorCount} errors</span>
          )}
          {warningCount > 0 && (
            <span className="text-warning">{warningCount} warnings</span>
          )}
        </div>
      </div>

      {/* Summary */}
      <div className="p-3 border-b border-border">
        <div className="flex items-center gap-3">
          <div className={cn(
            'flex items-center gap-1.5 px-2 py-1 rounded text-xs',
            errorCount === 0 ? 'bg-accent/20 text-accent' : 'bg-destructive/20 text-destructive'
          )}>
            {errorCount === 0 ? (
              <CheckCircle2 className="w-3.5 h-3.5" />
            ) : (
              <AlertCircle className="w-3.5 h-3.5" />
            )}
            {errorCount} Errors
          </div>
          <div className={cn(
            'flex items-center gap-1.5 px-2 py-1 rounded text-xs',
            warningCount === 0 ? 'bg-muted text-muted-foreground' : 'bg-warning/20 text-warning'
          )}>
            <AlertTriangle className="w-3.5 h-3.5" />
            {warningCount} Warnings
          </div>
          <div className="flex items-center gap-1.5 px-2 py-1 rounded text-xs bg-muted text-muted-foreground">
            <Info className="w-3.5 h-3.5" />
            {infoCount} Info
          </div>
        </div>
      </div>

      {/* Issues list */}
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-2">
          {issues.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle2 className="w-12 h-12 text-accent mx-auto mb-3" />
              <p className="text-accent font-medium">All checks passed!</p>
              <p className="text-xs text-muted-foreground mt-1">
                Your diagram follows best practices
              </p>
            </div>
          ) : (
            issues.map((issue) => (
              <div
                key={issue.id}
                className={cn(
                  'validation-item',
                  issue.type === 'error' && 'error',
                  issue.type === 'warning' && 'warning',
                  issue.type === 'info' && 'bg-muted/50 text-foreground'
                )}
              >
                {getIcon(issue.type)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm">{issue.message}</p>
                  {issue.suggestion && (
                    <div className="flex items-start gap-1.5 mt-1.5 text-xs text-muted-foreground">
                      <Lightbulb className="w-3 h-3 mt-0.5 shrink-0" />
                      <span>{issue.suggestion}</span>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>

      {/* Rules reference */}
      <div className="border-t border-border p-3">
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">
          Validation Rules
        </p>
        <ul className="text-xs text-muted-foreground space-y-1">
          <li>• Every entity must have a primary key</li>
          <li>• M:N relationships need junction tables</li>
          <li>• Weak entities need identifying relationships</li>
          <li>• Check for isolated entities</li>
        </ul>
      </div>
    </div>
  );
};

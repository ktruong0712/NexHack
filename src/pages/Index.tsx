import React, { useState } from 'react';
import { useDiagramStore } from '@/store/diagramStore';
import { DiagramCanvas } from '@/components/canvas/DiagramCanvas';
import { ChenToolbar } from '@/components/notation/ChenToolbar';
import { CrowsFootToolbar } from '@/components/notation/CrowsFootToolbar';
import { PlaybackPanel } from '@/components/playback/PlaybackPanel';
import { ValidationPanel } from '@/components/validation/ValidationPanel';
import { SQLGenerator } from '@/components/sql/SQLGenerator';
import { PropertiesPanel } from '@/components/properties/PropertiesPanel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  Database, 
  Play, 
  CheckCircle, 
  Code, 
  Settings,
  Trash2,
  Download,
  Upload
} from 'lucide-react';
import { NotationType } from '@/types/diagram';

const Index = () => {
  const { diagram, setNotation, clearDiagram } = useDiagramStore();
  const [rightPanel, setRightPanel] = useState<'playback' | 'validation' | 'sql' | 'properties'>('properties');

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Header */}
      <header className="h-12 border-b border-border bg-card flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-3">
          <Database className="w-5 h-5 text-primary" />
          <h1 className="font-semibold text-lg">ER Diagram Studio</h1>
          <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
            Hackathon MVP
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Notation Selector */}
          <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
            <Button
              variant={diagram.notation === 'chen' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setNotation('chen')}
              className="h-7 text-xs"
            >
              Chen
            </Button>
            <Button
              variant={diagram.notation === 'crowsfoot' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setNotation('crowsfoot')}
              className="h-7 text-xs"
            >
              Crow's Foot
            </Button>
          </div>

          <div className="w-px h-6 bg-border" />

          <Button variant="ghost" size="sm" onClick={clearDiagram} className="text-destructive hover:text-destructive">
            <Trash2 className="w-4 h-4 mr-1" />
            Clear
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Toolbar */}
        <aside className="w-44 border-r border-border bg-sidebar shrink-0">
          {diagram.notation === 'chen' ? <ChenToolbar /> : <CrowsFootToolbar />}
        </aside>

        {/* Canvas */}
        <main className="flex-1 relative">
          <DiagramCanvas />
        </main>

        {/* Right Panel */}
        <aside className="w-72 flex flex-col shrink-0">
          {/* Panel Tabs */}
          <div className="flex border-b border-border bg-card">
            <button
              onClick={() => setRightPanel('properties')}
              className={`flex-1 py-2 text-xs font-medium transition-colors ${
                rightPanel === 'properties' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Settings className="w-3.5 h-3.5 mx-auto mb-0.5" />
              Props
            </button>
            <button
              onClick={() => setRightPanel('playback')}
              className={`flex-1 py-2 text-xs font-medium transition-colors ${
                rightPanel === 'playback' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Play className="w-3.5 h-3.5 mx-auto mb-0.5" />
              Playback
            </button>
            <button
              onClick={() => setRightPanel('validation')}
              className={`flex-1 py-2 text-xs font-medium transition-colors ${
                rightPanel === 'validation' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <CheckCircle className="w-3.5 h-3.5 mx-auto mb-0.5" />
              Validate
            </button>
            <button
              onClick={() => setRightPanel('sql')}
              className={`flex-1 py-2 text-xs font-medium transition-colors ${
                rightPanel === 'sql' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Code className="w-3.5 h-3.5 mx-auto mb-0.5" />
              SQL
            </button>
          </div>

          {/* Panel Content */}
          <div className="flex-1 overflow-hidden">
            {rightPanel === 'properties' && <PropertiesPanel />}
            {rightPanel === 'playback' && <PlaybackPanel />}
            {rightPanel === 'validation' && <ValidationPanel />}
            {rightPanel === 'sql' && <SQLGenerator />}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Index;

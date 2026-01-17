import React from 'react';
import { ToolType } from '@/types/diagram';
import { useDiagramStore } from '@/store/diagramStore';
import { 
  CrowEntitySymbol,
  CrowZeroSymbol,
  CrowOneSymbol,
  CrowManySymbol,
  CrowZeroOrOneSymbol,
  CrowOneAndOnlyOneSymbol,
  CrowZeroOrManySymbol,
  CrowOneOrManySymbol,
  CrowIdentifyingRelSymbol,
  CrowNonIdentifyingRelSymbol,
  PrimaryKeySymbol,
  ForeignKeySymbol,
  SupertypeSymbol
} from './NotationSymbols';
import { MousePointer2, Link, GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface ToolItem {
  id: ToolType;
  label: string;
  icon: React.ReactNode;
  description?: string;
  draggable?: boolean;
}

const crowEntityTools: ToolItem[] = [
  { 
    id: 'entity-strong', 
    label: 'Entity', 
    icon: <CrowEntitySymbol className="w-8 h-7 text-crow-entity" />,
    description: 'Standard entity with attributes',
    draggable: true,
  },
  { 
    id: 'entity-associative', 
    label: 'Associative', 
    icon: <CrowEntitySymbol className="w-8 h-7 text-entity-associative" />,
    description: 'Associative entity (junction table)',
    draggable: true,
  },
];

const crowRelationshipTools: ToolItem[] = [
  { 
    id: 'relationship', 
    label: 'Non-Identifying', 
    icon: <CrowNonIdentifyingRelSymbol className="w-10 h-4 text-crow-relationship" />,
    description: 'Non-identifying relationship (dashed)',
    draggable: true,
  },
  { 
    id: 'relationship-identifying', 
    label: 'Identifying', 
    icon: <CrowIdentifyingRelSymbol className="w-10 h-4 text-crow-relationship" />,
    description: 'Identifying relationship (solid)',
    draggable: true,
  },
];

const cardinalitySymbols = [
  { 
    label: 'Zero', 
    icon: <CrowZeroSymbol className="w-4 h-4 text-foreground" />, 
    description: 'Optional (zero)' 
  },
  { 
    label: 'One', 
    icon: <CrowOneSymbol className="w-4 h-4 text-foreground" />, 
    description: 'Exactly one' 
  },
  { 
    label: 'Many', 
    icon: <CrowManySymbol className="w-6 h-4 text-foreground" />, 
    description: 'Many (crow\'s foot)' 
  },
  { 
    label: '0..1', 
    icon: <CrowZeroOrOneSymbol className="w-7 h-4 text-foreground" />, 
    description: 'Zero or one' 
  },
  { 
    label: '1..1', 
    icon: <CrowOneAndOnlyOneSymbol className="w-7 h-4 text-foreground" />, 
    description: 'One and only one' 
  },
  { 
    label: '0..*', 
    icon: <CrowZeroOrManySymbol className="w-8 h-4 text-foreground" />, 
    description: 'Zero or many' 
  },
  { 
    label: '1..*', 
    icon: <CrowOneOrManySymbol className="w-8 h-4 text-foreground" />, 
    description: 'One or many' 
  },
];

const keySymbols = [
  { 
    label: 'PK', 
    icon: <PrimaryKeySymbol className="w-4 h-4 text-crow-pk" />, 
    description: 'Primary Key' 
  },
  { 
    label: 'FK', 
    icon: <ForeignKeySymbol className="w-4 h-4 text-crow-fk" />, 
    description: 'Foreign Key' 
  },
];

export const CrowsFootToolbar: React.FC = () => {
  const { selectedTool, setSelectedTool } = useDiagramStore();

  const handleDragStart = (e: React.DragEvent, toolId: ToolType) => {
    e.dataTransfer.setData('tool-type', toolId);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const renderToolButton = (tool: ToolItem) => (
    <Tooltip key={tool.id}>
      <TooltipTrigger asChild>
        <div
          draggable={tool.draggable}
          onDragStart={(e) => handleDragStart(e, tool.id)}
          onClick={() => setSelectedTool(tool.id)}
          className={cn(
            'toolbar-btn w-full flex items-center gap-2 py-2 px-2 cursor-grab active:cursor-grabbing',
            selectedTool === tool.id && 'active'
          )}
        >
          <GripVertical className="w-3 h-3 text-muted-foreground/50 shrink-0" />
          {tool.icon}
          <span className="text-[10px] text-muted-foreground truncate flex-1">{tool.label}</span>
        </div>
      </TooltipTrigger>
      <TooltipContent side="right" className="max-w-48">
        <p className="font-medium">{tool.label}</p>
        {tool.description && (
          <p className="text-xs text-muted-foreground">{tool.description}</p>
        )}
        <p className="text-xs text-primary mt-1">Drag to canvas</p>
      </TooltipContent>
    </Tooltip>
  );

  return (
    <ScrollArea className="h-full">
      <div className="p-2 space-y-3">
        {/* Selection Tools */}
        <div className="space-y-1">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground px-1">Tools</p>
          <div className="grid grid-cols-2 gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setSelectedTool('select')}
                  className={cn(
                    'toolbar-btn flex flex-col items-center gap-1 py-2',
                    selectedTool === 'select' && 'active'
                  )}
                >
                  <MousePointer2 className="w-5 h-5" />
                  <span className="text-[10px] text-muted-foreground">Select</span>
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Select and move elements</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setSelectedTool('connection')}
                  className={cn(
                    'toolbar-btn flex flex-col items-center gap-1 py-2',
                    selectedTool === 'connection' && 'active'
                  )}
                >
                  <Link className="w-5 h-5" />
                  <span className="text-[10px] text-muted-foreground">Connect</span>
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Draw relationships between entities</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        <Separator />

        {/* Entities */}
        <div className="space-y-1">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground px-1 flex items-center gap-1">
            Entities
            <span className="text-[8px] text-primary">(drag)</span>
          </p>
          <div className="space-y-1">
            {crowEntityTools.map(renderToolButton)}
          </div>
        </div>

        <Separator />

        {/* Relationships */}
        <div className="space-y-1">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground px-1 flex items-center gap-1">
            Relationships
            <span className="text-[8px] text-primary">(drag)</span>
          </p>
          <div className="space-y-1">
            {crowRelationshipTools.map(renderToolButton)}
          </div>
        </div>

        <Separator />

        {/* Subtype/Supertype */}
        <div className="space-y-1">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground px-1">Hierarchy</p>
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                draggable
                onDragStart={(e) => handleDragStart(e, 'specialization')}
                onClick={() => setSelectedTool('specialization')}
                className={cn(
                  'toolbar-btn w-full flex items-center gap-2 py-2 px-2 cursor-grab active:cursor-grabbing',
                  selectedTool === 'specialization' && 'active'
                )}
              >
                <GripVertical className="w-3 h-3 text-muted-foreground/50" />
                <SupertypeSymbol className="w-8 h-6 text-foreground" />
                <span className="text-[10px] text-muted-foreground">Super/Subtype</span>
              </div>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Supertype/Subtype hierarchy</p>
              <p className="text-xs text-primary mt-1">Drag to canvas</p>
            </TooltipContent>
          </Tooltip>
        </div>

        <Separator />

        {/* Cardinality Reference */}
        <div className="space-y-1">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground px-1">Cardinality (Ref)</p>
          <div className="grid grid-cols-2 gap-1">
            {cardinalitySymbols.map((sym, idx) => (
              <Tooltip key={idx}>
                <TooltipTrigger asChild>
                  <div className="flex flex-col items-center gap-1 p-2 rounded-md bg-muted/30">
                    {sym.icon}
                    <span className="text-[9px] text-muted-foreground">{sym.label}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>{sym.description}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </div>

        <Separator />

        {/* Key Reference */}
        <div className="space-y-1">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground px-1">Keys (Ref)</p>
          <div className="grid grid-cols-2 gap-1">
            {keySymbols.map((sym, idx) => (
              <Tooltip key={idx}>
                <TooltipTrigger asChild>
                  <div className="flex flex-col items-center gap-1 p-2 rounded-md bg-muted/30">
                    {sym.icon}
                    <span className="text-[9px] text-muted-foreground">{sym.label}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>{sym.description}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </div>
      </div>
    </ScrollArea>
  );
};

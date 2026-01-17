import React from 'react';
import { ToolType } from '@/types/diagram';
import { useDiagramStore } from '@/store/diagramStore';
import { 
  StrongEntitySymbol, 
  WeakEntitySymbol, 
  AssociativeEntitySymbol,
  SimpleAttributeSymbol,
  CompositeAttributeSymbol,
  MultivaluedAttributeSymbol,
  DerivedAttributeSymbol,
  KeyAttributeSymbol,
  PartialKeySymbol,
  RelationshipSymbol,
  IdentifyingRelationshipSymbol,
  SupertypeSymbol,
  TotalParticipationSymbol,
  PartialParticipationSymbol,
  OneCardinalitySymbol,
  ManyCardinalitySymbol,
  DisjointSymbol,
  OverlappingSymbol,
  CategorySymbol,
  AggregationSymbol
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

const chenEntityTools: ToolItem[] = [
  { 
    id: 'entity-strong', 
    label: 'Strong Entity', 
    icon: <StrongEntitySymbol className="w-8 h-6 text-chen-entity" />,
    description: 'An entity that can exist independently',
    draggable: true,
  },
  { 
    id: 'entity-weak', 
    label: 'Weak Entity', 
    icon: <WeakEntitySymbol className="w-8 h-6 text-chen-weak" />,
    description: 'An entity dependent on another entity',
    draggable: true,
  },
  { 
    id: 'entity-associative', 
    label: 'Associative', 
    icon: <AssociativeEntitySymbol className="w-8 h-6 text-entity-associative" />,
    description: 'Entity that resolves M:N relationships',
    draggable: true,
  },
];

const chenAttributeTools: ToolItem[] = [
  { 
    id: 'attribute-simple', 
    label: 'Simple', 
    icon: <SimpleAttributeSymbol className="w-7 h-5 text-chen-attribute" />,
    description: 'A basic single-valued attribute',
    draggable: true,
  },
  { 
    id: 'attribute-composite', 
    label: 'Composite', 
    icon: <CompositeAttributeSymbol className="w-8 h-6 text-chen-attribute" />,
    description: 'Attribute composed of sub-attributes',
    draggable: true,
  },
  { 
    id: 'attribute-multivalued', 
    label: 'Multivalued', 
    icon: <MultivaluedAttributeSymbol className="w-7 h-5 text-chen-attribute" />,
    description: 'Attribute that can have multiple values',
    draggable: true,
  },
  { 
    id: 'attribute-derived', 
    label: 'Derived', 
    icon: <DerivedAttributeSymbol className="w-7 h-5 text-chen-attribute" />,
    description: 'Calculated from other attributes',
    draggable: true,
  },
  { 
    id: 'attribute-key', 
    label: 'Key (PK)', 
    icon: <KeyAttributeSymbol className="w-7 h-5 text-pk" />,
    description: 'Primary key attribute',
    draggable: true,
  },
  { 
    id: 'attribute-partial-key', 
    label: 'Partial Key', 
    icon: <PartialKeySymbol className="w-7 h-5 text-pk" />,
    description: 'Partial key for weak entities',
    draggable: true,
  },
];

const chenRelationshipTools: ToolItem[] = [
  { 
    id: 'relationship', 
    label: 'Relationship', 
    icon: <RelationshipSymbol className="w-8 h-6 text-chen-relationship" />,
    description: 'Standard relationship between entities',
    draggable: true,
  },
  { 
    id: 'relationship-identifying', 
    label: 'Identifying', 
    icon: <IdentifyingRelationshipSymbol className="w-8 h-6 text-chen-relationship" />,
    description: 'Identifying relationship for weak entities',
    draggable: true,
  },
];

const eerTools: ToolItem[] = [
  { 
    id: 'specialization', 
    label: 'ISA / Specialization', 
    icon: <SupertypeSymbol className="w-8 h-6 text-foreground" />,
    description: 'Supertype/subtype hierarchy',
    draggable: true,
  },
];

const constraintSymbols = [
  { label: 'Total', icon: <TotalParticipationSymbol className="w-6 h-3 text-foreground" />, description: 'Total participation constraint' },
  { label: 'Partial', icon: <PartialParticipationSymbol className="w-6 h-3 text-foreground" />, description: 'Partial participation constraint' },
  { label: 'One', icon: <OneCardinalitySymbol className="w-5 h-4 text-foreground" />, description: 'Cardinality of one' },
  { label: 'Many', icon: <ManyCardinalitySymbol className="w-5 h-4 text-foreground" />, description: 'Cardinality of many' },
  { label: 'Disjoint', icon: <DisjointSymbol className="w-6 h-4 text-foreground" />, description: 'Disjoint specialization' },
  { label: 'Overlap', icon: <OverlappingSymbol className="w-6 h-4 text-foreground" />, description: 'Overlapping specialization' },
  { label: 'Union', icon: <CategorySymbol className="w-6 h-4 text-foreground" />, description: 'Category/Union type' },
  { label: 'Aggregate', icon: <AggregationSymbol className="w-8 h-6 text-foreground" />, description: 'Aggregation' },
];

export const ChenToolbar: React.FC = () => {
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
                <p>Draw connections between elements</p>
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
            {chenEntityTools.map(renderToolButton)}
          </div>
        </div>

        <Separator />

        {/* Attributes */}
        <div className="space-y-1">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground px-1 flex items-center gap-1">
            Attributes
            <span className="text-[8px] text-primary">(drag)</span>
          </p>
          <div className="space-y-1">
            {chenAttributeTools.map(renderToolButton)}
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
            {chenRelationshipTools.map(renderToolButton)}
          </div>
        </div>

        <Separator />

        {/* EER Extensions */}
        <div className="space-y-1">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground px-1">EER Extensions</p>
          <div className="space-y-1">
            {eerTools.map(renderToolButton)}
          </div>
        </div>

        <Separator />

        {/* Constraint Reference */}
        <div className="space-y-1">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground px-1">Constraints (Ref)</p>
          <div className="grid grid-cols-2 gap-1">
            {constraintSymbols.map((sym, idx) => (
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

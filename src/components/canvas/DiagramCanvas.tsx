import React, { useRef, useState, useCallback, useEffect } from 'react';
import { useDiagramStore } from '@/store/diagramStore';
import { Entity, Relationship, Position, ToolType } from '@/types/diagram';
import { cn } from '@/lib/utils';

const generateId = () => Math.random().toString(36).substr(2, 9);

interface ResizeHandle {
  position: 'nw' | 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w';
  cursor: string;
}

const resizeHandles: ResizeHandle[] = [
  { position: 'nw', cursor: 'nwse-resize' },
  { position: 'n', cursor: 'ns-resize' },
  { position: 'ne', cursor: 'nesw-resize' },
  { position: 'e', cursor: 'ew-resize' },
  { position: 'se', cursor: 'nwse-resize' },
  { position: 's', cursor: 'ns-resize' },
  { position: 'sw', cursor: 'nesw-resize' },
  { position: 'w', cursor: 'ew-resize' },
];

export const DiagramCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [draggingEntity, setDraggingEntity] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [connectionStart, setConnectionStart] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [resizing, setResizing] = useState<{ entityId: string; handle: string; startPos: Position; startSize: { width: number; height: number } } | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const {
    diagram,
    selectedTool,
    selectedEntityId,
    selectedRelationshipId,
    setSelectedEntity,
    setSelectedRelationship,
    addEntity,
    updateEntity,
    moveEntity,
    addRelationship,
    setSelectedTool,
  } = useDiagramStore();

  const getCanvasPosition = useCallback((clientX: number, clientY: number): Position => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    return {
      x: (clientX - rect.left - offset.x) / scale,
      y: (clientY - rect.top - offset.y) / scale,
    };
  }, [offset, scale]);

  // Handle drop from toolbar
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const toolType = e.dataTransfer.getData('tool-type') as ToolType;
    if (!toolType) return;

    const pos = getCanvasPosition(e.clientX, e.clientY);

    if (toolType.startsWith('entity-')) {
      const entityType = toolType.replace('entity-', '') as 'strong' | 'weak' | 'associative';
      const newEntity: Entity = {
        id: generateId(),
        name: `Entity_${diagram.entities.length + 1}`,
        type: entityType,
        position: pos,
        attributes: [],
        width: 140,
        height: 80,
      };
      addEntity(newEntity);
      setSelectedEntity(newEntity.id);
    } else if (toolType === 'relationship' || toolType === 'relationship-identifying') {
      const relType = toolType === 'relationship-identifying' ? 'identifying' : 'relationship';
      const newRel: Relationship = {
        id: generateId(),
        name: `Rel_${diagram.relationships.length + 1}`,
        type: relType,
        position: pos,
        connections: [],
      };
      addRelationship(newRel);
      setSelectedRelationship(newRel.id);
    } else if (toolType === 'specialization') {
      // Add ISA circle
      const newRel: Relationship = {
        id: generateId(),
        name: 'ISA',
        type: 'binary',
        position: pos,
        connections: [],
      };
      addRelationship(newRel);
    } else if (toolType.startsWith('attribute-')) {
      // If an entity is selected, add attribute to it
      if (selectedEntityId) {
        const attrType = toolType.replace('attribute-', '') as any;
        useDiagramStore.getState().addAttribute(selectedEntityId, {
          id: generateId(),
          name: `attr_${Math.floor(Math.random() * 100)}`,
          type: attrType,
          dataType: 'VARCHAR(255)',
        });
      }
    }
  }, [getCanvasPosition, diagram, addEntity, addRelationship, setSelectedEntity, setSelectedRelationship, selectedEntityId]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false);
  }, []);

  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    if (e.target !== canvasRef.current) return;
    setSelectedEntity(null);
    setSelectedRelationship(null);
  }, [setSelectedEntity, setSelectedRelationship]);

  const handleEntityMouseDown = useCallback((e: React.MouseEvent, entityId: string) => {
    e.stopPropagation();
    
    if (selectedTool === 'connection') {
      if (!connectionStart) {
        setConnectionStart(entityId);
      } else if (connectionStart !== entityId) {
        const newRel: Relationship = {
          id: generateId(),
          name: `Rel_${diagram.relationships.length + 1}`,
          type: 'relationship',
          position: { 
            x: (diagram.entities.find(e => e.id === connectionStart)!.position.x + 
                diagram.entities.find(e => e.id === entityId)!.position.x) / 2,
            y: (diagram.entities.find(e => e.id === connectionStart)!.position.y + 
                diagram.entities.find(e => e.id === entityId)!.position.y) / 2,
          },
          connections: [
            { entityId: connectionStart, cardinality: 'one', participation: 'partial' },
            { entityId, cardinality: 'many', participation: 'partial' },
          ],
        };
        addRelationship(newRel);
        setConnectionStart(null);
        setSelectedTool('select');
      }
      return;
    }

    setSelectedEntity(entityId);
    const entity = diagram.entities.find((e) => e.id === entityId);
    if (entity) {
      const pos = getCanvasPosition(e.clientX, e.clientY);
      setDragOffset({
        x: pos.x - entity.position.x,
        y: pos.y - entity.position.y,
      });
      setDraggingEntity(entityId);
    }
  }, [selectedTool, connectionStart, diagram.entities, diagram.relationships.length, addRelationship, setSelectedTool, setSelectedEntity, getCanvasPosition]);

  const handleResizeStart = useCallback((e: React.MouseEvent, entityId: string, handle: string) => {
    e.stopPropagation();
    const entity = diagram.entities.find((ent) => ent.id === entityId);
    if (!entity) return;
    
    setResizing({
      entityId,
      handle,
      startPos: getCanvasPosition(e.clientX, e.clientY),
      startSize: { width: entity.width || 140, height: entity.height || 80 },
    });
  }, [diagram.entities, getCanvasPosition]);

  const handleRelationshipClick = useCallback((e: React.MouseEvent, relId: string) => {
    e.stopPropagation();
    setSelectedRelationship(relId);
  }, [setSelectedRelationship]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const pos = getCanvasPosition(e.clientX, e.clientY);
    setMousePos(pos);

    if (resizing) {
      const entity = diagram.entities.find((ent) => ent.id === resizing.entityId);
      if (!entity) return;

      const dx = pos.x - resizing.startPos.x;
      const dy = pos.y - resizing.startPos.y;
      
      let newWidth = resizing.startSize.width;
      let newHeight = resizing.startSize.height;
      let newX = entity.position.x;
      let newY = entity.position.y;

      if (resizing.handle.includes('e')) newWidth = Math.max(80, resizing.startSize.width + dx);
      if (resizing.handle.includes('w')) {
        newWidth = Math.max(80, resizing.startSize.width - dx);
        newX = entity.position.x + (resizing.startSize.width - newWidth) / 2;
      }
      if (resizing.handle.includes('s')) newHeight = Math.max(60, resizing.startSize.height + dy);
      if (resizing.handle.includes('n')) {
        newHeight = Math.max(60, resizing.startSize.height - dy);
        newY = entity.position.y + (resizing.startSize.height - newHeight) / 2;
      }

      updateEntity(resizing.entityId, { 
        width: newWidth, 
        height: newHeight,
        position: { x: newX, y: newY }
      });
      return;
    }

    if (draggingEntity) {
      moveEntity(draggingEntity, {
        x: pos.x - dragOffset.x,
        y: pos.y - dragOffset.y,
      });
    }

    if (isPanning) {
      setOffset({
        x: offset.x + (e.clientX - panStart.x),
        y: offset.y + (e.clientY - panStart.y),
      });
      setPanStart({ x: e.clientX, y: e.clientY });
    }
  }, [draggingEntity, dragOffset, isPanning, panStart, offset, getCanvasPosition, moveEntity, resizing, diagram.entities, updateEntity]);

  const handleMouseUp = useCallback(() => {
    setDraggingEntity(null);
    setIsPanning(false);
    setResizing(null);
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setScale((s) => Math.min(Math.max(s * delta, 0.25), 3));
  }, []);

  const handleMiddleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 1) {
      e.preventDefault();
      setIsPanning(true);
      setPanStart({ x: e.clientX, y: e.clientY });
    }
  }, []);

  useEffect(() => {
    if (selectedTool !== 'connection') {
      setConnectionStart(null);
    }
  }, [selectedTool]);

  const getHandlePosition = (handle: string, width: number, height: number) => {
    const halfW = width / 2;
    const halfH = height / 2;
    const positions: Record<string, { x: number; y: number }> = {
      'nw': { x: -halfW - 4, y: -halfH - 4 },
      'n': { x: 0, y: -halfH - 4 },
      'ne': { x: halfW + 4, y: -halfH - 4 },
      'e': { x: halfW + 4, y: 0 },
      'se': { x: halfW + 4, y: halfH + 4 },
      's': { x: 0, y: halfH + 4 },
      'sw': { x: -halfW - 4, y: halfH + 4 },
      'w': { x: -halfW - 4, y: 0 },
    };
    return positions[handle] || { x: 0, y: 0 };
  };

  const renderChenEntity = (entity: Entity) => {
    const isSelected = selectedEntityId === entity.id;
    const isConnectionStart = connectionStart === entity.id;
    const width = entity.width || 140;
    const height = entity.height || 80;
    
    return (
      <g
        key={entity.id}
        transform={`translate(${entity.position.x}, ${entity.position.y})`}
        className={cn("cursor-move", draggingEntity === entity.id && "opacity-80")}
        onMouseDown={(e) => handleEntityMouseDown(e as any, entity.id)}
      >
        {/* Entity box */}
        {entity.type === 'weak' ? (
          <>
            <rect
              x={-width/2}
              y={-height/2}
              width={width}
              height={height}
              rx={4}
              className={cn(
                'fill-card stroke-chen-weak transition-all',
                isSelected && 'stroke-canvas-selection',
                isConnectionStart && 'animate-pulse-glow'
              )}
              strokeWidth={isSelected ? 3 : 2}
            />
            <rect
              x={-width/2 + 5}
              y={-height/2 + 5}
              width={width - 10}
              height={height - 10}
              rx={3}
              className="fill-none stroke-chen-weak"
              strokeWidth={2}
            />
          </>
        ) : entity.type === 'associative' ? (
          <>
            <rect
              x={-width/2}
              y={-height/2}
              width={width}
              height={height}
              rx={4}
              className={cn(
                'fill-card stroke-entity-associative transition-all',
                isSelected && 'stroke-canvas-selection',
                isConnectionStart && 'animate-pulse-glow'
              )}
              strokeWidth={isSelected ? 3 : 2}
            />
            <polygon
              points={`0,${-height/2 + 10} ${width/2 - 10},0 0,${height/2 - 10} ${-width/2 + 10},0`}
              className="fill-none stroke-entity-associative"
              strokeWidth={1.5}
            />
          </>
        ) : (
          <rect
            x={-width/2}
            y={-height/2}
            width={width}
            height={height}
            rx={4}
            className={cn(
              'fill-card stroke-chen-entity transition-all',
              isSelected && 'stroke-canvas-selection',
              isConnectionStart && 'animate-pulse-glow'
            )}
            strokeWidth={isSelected ? 3 : 2}
          />
        )}
        
        {/* Entity name */}
        <text
          x={0}
          y={-height/2 + 20}
          textAnchor="middle"
          className="fill-foreground font-medium text-sm pointer-events-none"
        >
          {entity.name}
        </text>
        
        {/* Attributes list */}
        {entity.attributes.slice(0, 3).map((attr, idx) => (
          <text
            key={attr.id}
            x={0}
            y={-height/2 + 38 + idx * 14}
            textAnchor="middle"
            className={cn(
              'text-xs pointer-events-none',
              attr.type === 'key' ? 'fill-pk font-medium' : 'fill-muted-foreground'
            )}
          >
            {attr.type === 'key' && '🔑 '}
            {attr.name}
          </text>
        ))}
        
        {/* Resize handles */}
        {isSelected && (
          <>
            {resizeHandles.map((handle) => {
              const handlePos = getHandlePosition(handle.position, width, height);
              return (
                <rect
                  key={handle.position}
                  x={handlePos.x - 4}
                  y={handlePos.y - 4}
                  width={8}
                  height={8}
                  rx={1}
                  className="fill-primary stroke-primary-foreground cursor-pointer"
                  style={{ cursor: handle.cursor }}
                  onMouseDown={(e) => handleResizeStart(e as any, entity.id, handle.position)}
                />
              );
            })}
          </>
        )}
      </g>
    );
  };

  const renderChenRelationship = (rel: Relationship) => {
    const isSelected = selectedRelationshipId === rel.id;
    
    return (
      <g
        key={rel.id}
        transform={`translate(${rel.position.x}, ${rel.position.y})`}
        className="cursor-move"
        onClick={(e) => handleRelationshipClick(e as any, rel.id)}
      >
        {rel.type === 'identifying' ? (
          <>
            <polygon
              points="0,-35 50,0 0,35 -50,0"
              className={cn(
                'fill-card stroke-chen-relationship transition-all',
                isSelected && 'stroke-canvas-selection'
              )}
              strokeWidth={isSelected ? 3 : 2}
            />
            <polygon
              points="0,-28 40,0 0,28 -40,0"
              className="fill-none stroke-chen-relationship"
              strokeWidth={2}
            />
          </>
        ) : (
          <polygon
            points="0,-35 50,0 0,35 -50,0"
            className={cn(
              'fill-card stroke-chen-relationship transition-all',
              isSelected && 'stroke-canvas-selection'
            )}
            strokeWidth={isSelected ? 3 : 2}
          />
        )}
        <text
          x={0}
          y={5}
          textAnchor="middle"
          className="fill-foreground font-medium text-xs pointer-events-none"
        >
          {rel.name}
        </text>
      </g>
    );
  };

  const renderConnectionLines = () => {
    return diagram.relationships.flatMap((rel) => {
      return rel.connections.map((conn, idx) => {
        const entity = diagram.entities.find((e) => e.id === conn.entityId);
        if (!entity) return null;

        const key = `${rel.id}-${conn.entityId}-${idx}`;
        
        return (
          <g key={key}>
            <line
              x1={rel.position.x}
              y1={rel.position.y}
              x2={entity.position.x}
              y2={entity.position.y}
              className={cn(
                'stroke-muted-foreground transition-all',
                conn.participation === 'total' && 'stroke-[3px]'
              )}
              strokeWidth={conn.participation === 'total' ? 3 : 2}
            />
            <text
              x={(rel.position.x + entity.position.x) / 2 + 10}
              y={(rel.position.y + entity.position.y) / 2 - 5}
              className="fill-foreground text-xs font-mono"
            >
              {conn.cardinality === 'one' && '1'}
              {conn.cardinality === 'many' && 'N'}
              {conn.cardinality === 'zero-or-one' && '0..1'}
              {conn.cardinality === 'one-and-only-one' && '1..1'}
              {conn.cardinality === 'zero-or-many' && '0..*'}
              {conn.cardinality === 'one-or-many' && '1..*'}
            </text>
          </g>
        );
      });
    });
  };

  const renderPendingConnection = () => {
    if (!connectionStart) return null;
    const startEntity = diagram.entities.find((e) => e.id === connectionStart);
    if (!startEntity) return null;

    return (
      <line
        x1={startEntity.position.x}
        y1={startEntity.position.y}
        x2={mousePos.x}
        y2={mousePos.y}
        className="stroke-primary stroke-2"
        strokeDasharray="5,5"
      />
    );
  };

  return (
    <div
      ref={canvasRef}
      className={cn(
        "w-full h-full bg-canvas-bg canvas-grid overflow-hidden relative transition-colors",
        isDragOver && "bg-primary/5 ring-2 ring-primary/30 ring-inset"
      )}
      onClick={handleCanvasClick}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
      onMouseDown={handleMiddleMouseDown}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      {/* Drop zone indicator */}
      {isDragOver && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <div className="bg-primary/10 border-2 border-dashed border-primary rounded-lg px-8 py-4 text-primary font-medium animate-pulse">
            Drop to add element
          </div>
        </div>
      )}

      <svg
        className="w-full h-full"
        style={{
          transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
          transformOrigin: '0 0',
        }}
      >
        {renderConnectionLines()}
        {renderPendingConnection()}
        {diagram.relationships.map(renderChenRelationship)}
        {diagram.entities.map(renderChenEntity)}
      </svg>

      {/* Canvas info */}
      <div className="absolute bottom-4 left-4 text-xs text-muted-foreground bg-card/80 px-2 py-1 rounded font-mono">
        Zoom: {Math.round(scale * 100)}% | Entities: {diagram.entities.length} | Relationships: {diagram.relationships.length}
      </div>

      {/* Hint */}
      {diagram.entities.length === 0 && !isDragOver && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-muted-foreground pointer-events-none">
          <p className="text-lg font-medium mb-2">Drag elements from the toolbar</p>
          <p className="text-sm">or double-click canvas to add</p>
        </div>
      )}

      {connectionStart && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium animate-pulse-glow">
          Click another entity to create relationship
        </div>
      )}
    </div>
  );
};

import { create } from 'zustand';
import { 
  DiagramState, 
  Entity, 
  Relationship, 
  Specialization, 
  Action, 
  ActionType,
  NotationType,
  ToolType,
  Attribute,
  ValidationIssue,
  Position
} from '@/types/diagram';

interface DiagramStore {
  // State
  diagram: DiagramState;
  actions: Action[];
  currentActionIndex: number;
  selectedTool: ToolType;
  selectedEntityId: string | null;
  selectedRelationshipId: string | null;
  isPlaying: boolean;
  playbackSpeed: number;
  
  // Diagram actions
  addEntity: (entity: Entity) => void;
  updateEntity: (id: string, updates: Partial<Entity>) => void;
  deleteEntity: (id: string) => void;
  moveEntity: (id: string, position: Position) => void;
  
  addAttribute: (entityId: string, attribute: Attribute) => void;
  updateAttribute: (entityId: string, attributeId: string, updates: Partial<Attribute>) => void;
  deleteAttribute: (entityId: string, attributeId: string) => void;
  
  addRelationship: (relationship: Relationship) => void;
  updateRelationship: (id: string, updates: Partial<Relationship>) => void;
  deleteRelationship: (id: string) => void;
  
  addSpecialization: (specialization: Specialization) => void;
  deleteSpecialization: (id: string) => void;
  
  setNotation: (notation: NotationType) => void;
  
  // Tool selection
  setSelectedTool: (tool: ToolType) => void;
  setSelectedEntity: (id: string | null) => void;
  setSelectedRelationship: (id: string | null) => void;
  
  // Playback
  setIsPlaying: (isPlaying: boolean) => void;
  setPlaybackSpeed: (speed: number) => void;
  stepForward: () => void;
  stepBackward: () => void;
  goToAction: (index: number) => void;
  rewind: () => void;
  
  // Validation
  validate: () => ValidationIssue[];
  
  // SQL Generation
  generateSQL: () => string;
  
  // Clear
  clearDiagram: () => void;
  loadDiagram: (diagram: DiagramState, actions: Action[]) => void;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

const initialDiagram: DiagramState = {
  entities: [],
  relationships: [],
  specializations: [],
  notation: 'chen',
};

export const useDiagramStore = create<DiagramStore>((set, get) => ({
  diagram: initialDiagram,
  actions: [],
  currentActionIndex: -1,
  selectedTool: 'select',
  selectedEntityId: null,
  selectedRelationshipId: null,
  isPlaying: false,
  playbackSpeed: 1,
  
  addEntity: (entity) => {
    const action: Action = {
      id: generateId(),
      type: 'ADD_ENTITY',
      timestamp: Date.now(),
      payload: entity,
      description: `Added ${entity.type} entity "${entity.name}"`,
    };
    
    set((state) => ({
      diagram: {
        ...state.diagram,
        entities: [...state.diagram.entities, entity],
      },
      actions: [...state.actions.slice(0, state.currentActionIndex + 1), action],
      currentActionIndex: state.currentActionIndex + 1,
    }));
  },
  
  updateEntity: (id, updates) => {
    const entity = get().diagram.entities.find((e) => e.id === id);
    if (!entity) return;
    
    const action: Action = {
      id: generateId(),
      type: 'UPDATE_ENTITY',
      timestamp: Date.now(),
      payload: { id, updates },
      previousState: entity,
      description: `Updated entity "${entity.name}"`,
    };
    
    set((state) => ({
      diagram: {
        ...state.diagram,
        entities: state.diagram.entities.map((e) =>
          e.id === id ? { ...e, ...updates } : e
        ),
      },
      actions: [...state.actions.slice(0, state.currentActionIndex + 1), action],
      currentActionIndex: state.currentActionIndex + 1,
    }));
  },
  
  deleteEntity: (id) => {
    const entity = get().diagram.entities.find((e) => e.id === id);
    if (!entity) return;
    
    const action: Action = {
      id: generateId(),
      type: 'DELETE_ENTITY',
      timestamp: Date.now(),
      payload: entity,
      description: `Deleted entity "${entity.name}"`,
    };
    
    set((state) => ({
      diagram: {
        ...state.diagram,
        entities: state.diagram.entities.filter((e) => e.id !== id),
        relationships: state.diagram.relationships.filter(
          (r) => !r.connections.some((c) => c.entityId === id)
        ),
      },
      actions: [...state.actions.slice(0, state.currentActionIndex + 1), action],
      currentActionIndex: state.currentActionIndex + 1,
      selectedEntityId: state.selectedEntityId === id ? null : state.selectedEntityId,
    }));
  },
  
  moveEntity: (id, position) => {
    const entity = get().diagram.entities.find((e) => e.id === id);
    if (!entity) return;
    
    const action: Action = {
      id: generateId(),
      type: 'MOVE_ENTITY',
      timestamp: Date.now(),
      payload: { id, position },
      previousState: entity.position,
      description: `Moved entity "${entity.name}"`,
    };
    
    set((state) => ({
      diagram: {
        ...state.diagram,
        entities: state.diagram.entities.map((e) =>
          e.id === id ? { ...e, position } : e
        ),
      },
      actions: [...state.actions.slice(0, state.currentActionIndex + 1), action],
      currentActionIndex: state.currentActionIndex + 1,
    }));
  },
  
  addAttribute: (entityId, attribute) => {
    const entity = get().diagram.entities.find((e) => e.id === entityId);
    if (!entity) return;
    
    const action: Action = {
      id: generateId(),
      type: 'ADD_ATTRIBUTE',
      timestamp: Date.now(),
      payload: { entityId, attribute },
      description: `Added attribute "${attribute.name}" to "${entity.name}"`,
    };
    
    set((state) => ({
      diagram: {
        ...state.diagram,
        entities: state.diagram.entities.map((e) =>
          e.id === entityId
            ? { ...e, attributes: [...e.attributes, attribute] }
            : e
        ),
      },
      actions: [...state.actions.slice(0, state.currentActionIndex + 1), action],
      currentActionIndex: state.currentActionIndex + 1,
    }));
  },
  
  updateAttribute: (entityId, attributeId, updates) => {
    const action: Action = {
      id: generateId(),
      type: 'UPDATE_ATTRIBUTE',
      timestamp: Date.now(),
      payload: { entityId, attributeId, updates },
      description: `Updated attribute`,
    };
    
    set((state) => ({
      diagram: {
        ...state.diagram,
        entities: state.diagram.entities.map((e) =>
          e.id === entityId
            ? {
                ...e,
                attributes: e.attributes.map((a) =>
                  a.id === attributeId ? { ...a, ...updates } : a
                ),
              }
            : e
        ),
      },
      actions: [...state.actions.slice(0, state.currentActionIndex + 1), action],
      currentActionIndex: state.currentActionIndex + 1,
    }));
  },
  
  deleteAttribute: (entityId, attributeId) => {
    const action: Action = {
      id: generateId(),
      type: 'DELETE_ATTRIBUTE',
      timestamp: Date.now(),
      payload: { entityId, attributeId },
      description: `Deleted attribute`,
    };
    
    set((state) => ({
      diagram: {
        ...state.diagram,
        entities: state.diagram.entities.map((e) =>
          e.id === entityId
            ? { ...e, attributes: e.attributes.filter((a) => a.id !== attributeId) }
            : e
        ),
      },
      actions: [...state.actions.slice(0, state.currentActionIndex + 1), action],
      currentActionIndex: state.currentActionIndex + 1,
    }));
  },
  
  addRelationship: (relationship) => {
    const action: Action = {
      id: generateId(),
      type: 'ADD_RELATIONSHIP',
      timestamp: Date.now(),
      payload: relationship,
      description: `Added relationship "${relationship.name}"`,
    };
    
    set((state) => ({
      diagram: {
        ...state.diagram,
        relationships: [...state.diagram.relationships, relationship],
      },
      actions: [...state.actions.slice(0, state.currentActionIndex + 1), action],
      currentActionIndex: state.currentActionIndex + 1,
    }));
  },
  
  updateRelationship: (id, updates) => {
    const relationship = get().diagram.relationships.find((r) => r.id === id);
    if (!relationship) return;
    
    const action: Action = {
      id: generateId(),
      type: 'UPDATE_RELATIONSHIP',
      timestamp: Date.now(),
      payload: { id, updates },
      previousState: relationship,
      description: `Updated relationship "${relationship.name}"`,
    };
    
    set((state) => ({
      diagram: {
        ...state.diagram,
        relationships: state.diagram.relationships.map((r) =>
          r.id === id ? { ...r, ...updates } : r
        ),
      },
      actions: [...state.actions.slice(0, state.currentActionIndex + 1), action],
      currentActionIndex: state.currentActionIndex + 1,
    }));
  },
  
  deleteRelationship: (id) => {
    const relationship = get().diagram.relationships.find((r) => r.id === id);
    if (!relationship) return;
    
    const action: Action = {
      id: generateId(),
      type: 'DELETE_RELATIONSHIP',
      timestamp: Date.now(),
      payload: relationship,
      description: `Deleted relationship "${relationship.name}"`,
    };
    
    set((state) => ({
      diagram: {
        ...state.diagram,
        relationships: state.diagram.relationships.filter((r) => r.id !== id),
      },
      actions: [...state.actions.slice(0, state.currentActionIndex + 1), action],
      currentActionIndex: state.currentActionIndex + 1,
      selectedRelationshipId: state.selectedRelationshipId === id ? null : state.selectedRelationshipId,
    }));
  },
  
  addSpecialization: (specialization) => {
    const action: Action = {
      id: generateId(),
      type: 'ADD_SPECIALIZATION',
      timestamp: Date.now(),
      payload: specialization,
      description: `Added specialization`,
    };
    
    set((state) => ({
      diagram: {
        ...state.diagram,
        specializations: [...state.diagram.specializations, specialization],
      },
      actions: [...state.actions.slice(0, state.currentActionIndex + 1), action],
      currentActionIndex: state.currentActionIndex + 1,
    }));
  },
  
  deleteSpecialization: (id) => {
    const action: Action = {
      id: generateId(),
      type: 'DELETE_SPECIALIZATION',
      timestamp: Date.now(),
      payload: id,
      description: `Deleted specialization`,
    };
    
    set((state) => ({
      diagram: {
        ...state.diagram,
        specializations: state.diagram.specializations.filter((s) => s.id !== id),
      },
      actions: [...state.actions.slice(0, state.currentActionIndex + 1), action],
      currentActionIndex: state.currentActionIndex + 1,
    }));
  },
  
  setNotation: (notation) => {
    const action: Action = {
      id: generateId(),
      type: 'CHANGE_NOTATION',
      timestamp: Date.now(),
      payload: notation,
      previousState: get().diagram.notation,
      description: `Changed notation to ${notation}`,
    };
    
    set((state) => ({
      diagram: {
        ...state.diagram,
        notation,
      },
      actions: [...state.actions.slice(0, state.currentActionIndex + 1), action],
      currentActionIndex: state.currentActionIndex + 1,
    }));
  },
  
  setSelectedTool: (tool) => set({ selectedTool: tool }),
  setSelectedEntity: (id) => set({ selectedEntityId: id, selectedRelationshipId: null }),
  setSelectedRelationship: (id) => set({ selectedRelationshipId: id, selectedEntityId: null }),
  
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setPlaybackSpeed: (speed) => set({ playbackSpeed: speed }),
  
  stepForward: () => {
    const { currentActionIndex, actions } = get();
    if (currentActionIndex < actions.length - 1) {
      get().goToAction(currentActionIndex + 1);
    }
  },
  
  stepBackward: () => {
    const { currentActionIndex } = get();
    if (currentActionIndex >= 0) {
      get().goToAction(currentActionIndex - 1);
    }
  },
  
  goToAction: (index) => {
    const { actions } = get();
    
    // Rebuild state from scratch up to the target index
    let diagram: DiagramState = {
      entities: [],
      relationships: [],
      specializations: [],
      notation: 'chen',
    };
    
    for (let i = 0; i <= index; i++) {
      const action = actions[i];
      if (!action) continue;
      
      switch (action.type) {
        case 'ADD_ENTITY':
          diagram.entities.push(action.payload);
          break;
        case 'UPDATE_ENTITY':
          diagram.entities = diagram.entities.map((e) =>
            e.id === action.payload.id ? { ...e, ...action.payload.updates } : e
          );
          break;
        case 'DELETE_ENTITY':
          diagram.entities = diagram.entities.filter((e) => e.id !== action.payload.id);
          diagram.relationships = diagram.relationships.filter(
            (r) => !r.connections.some((c) => c.entityId === action.payload.id)
          );
          break;
        case 'MOVE_ENTITY':
          diagram.entities = diagram.entities.map((e) =>
            e.id === action.payload.id ? { ...e, position: action.payload.position } : e
          );
          break;
        case 'ADD_ATTRIBUTE':
          diagram.entities = diagram.entities.map((e) =>
            e.id === action.payload.entityId
              ? { ...e, attributes: [...e.attributes, action.payload.attribute] }
              : e
          );
          break;
        case 'UPDATE_ATTRIBUTE':
          diagram.entities = diagram.entities.map((e) =>
            e.id === action.payload.entityId
              ? {
                  ...e,
                  attributes: e.attributes.map((a) =>
                    a.id === action.payload.attributeId ? { ...a, ...action.payload.updates } : a
                  ),
                }
              : e
          );
          break;
        case 'DELETE_ATTRIBUTE':
          diagram.entities = diagram.entities.map((e) =>
            e.id === action.payload.entityId
              ? { ...e, attributes: e.attributes.filter((a) => a.id !== action.payload.attributeId) }
              : e
          );
          break;
        case 'ADD_RELATIONSHIP':
          diagram.relationships.push(action.payload);
          break;
        case 'UPDATE_RELATIONSHIP':
          diagram.relationships = diagram.relationships.map((r) =>
            r.id === action.payload.id ? { ...r, ...action.payload.updates } : r
          );
          break;
        case 'DELETE_RELATIONSHIP':
          diagram.relationships = diagram.relationships.filter((r) => r.id !== action.payload.id);
          break;
        case 'ADD_SPECIALIZATION':
          diagram.specializations.push(action.payload);
          break;
        case 'DELETE_SPECIALIZATION':
          diagram.specializations = diagram.specializations.filter((s) => s.id !== action.payload);
          break;
        case 'CHANGE_NOTATION':
          diagram.notation = action.payload;
          break;
      }
    }
    
    set({ diagram, currentActionIndex: index });
  },
  
  rewind: () => {
    set({
      currentActionIndex: -1,
      diagram: initialDiagram,
    });
  },
  
  validate: () => {
    const { diagram } = get();
    const issues: ValidationIssue[] = [];
    
    // Check for entities without primary keys
    diagram.entities.forEach((entity) => {
      const hasPK = entity.attributes.some((a) => a.type === 'key');
      if (!hasPK) {
        issues.push({
          id: generateId(),
          type: 'error',
          message: `Entity "${entity.name}" has no primary key`,
          entityId: entity.id,
          suggestion: 'Add a key attribute to identify unique records',
        });
      }
    });
    
    // Check for M:N relationships without junction tables
    diagram.relationships.forEach((rel) => {
      const manyToMany = rel.connections.every(
        (c) => c.cardinality === 'many' || c.cardinality === 'zero-or-many' || c.cardinality === 'one-or-many'
      );
      if (manyToMany && rel.connections.length === 2) {
        issues.push({
          id: generateId(),
          type: 'warning',
          message: `Many-to-many relationship "${rel.name}" may need a junction table`,
          relationshipId: rel.id,
          suggestion: 'Consider creating an associative entity to resolve M:N',
        });
      }
    });
    
    // Check for weak entities without identifying relationships
    diagram.entities
      .filter((e) => e.type === 'weak')
      .forEach((entity) => {
        const hasIdentifying = diagram.relationships.some(
          (r) =>
            r.type === 'identifying' &&
            r.connections.some((c) => c.entityId === entity.id)
        );
        if (!hasIdentifying) {
          issues.push({
            id: generateId(),
            type: 'warning',
            message: `Weak entity "${entity.name}" has no identifying relationship`,
            entityId: entity.id,
            suggestion: 'Connect to a strong entity with an identifying relationship',
          });
        }
      });
    
    // Check for orphan entities
    diagram.entities.forEach((entity) => {
      const hasRelationship = diagram.relationships.some((r) =>
        r.connections.some((c) => c.entityId === entity.id)
      );
      if (!hasRelationship) {
        issues.push({
          id: generateId(),
          type: 'info',
          message: `Entity "${entity.name}" has no relationships`,
          entityId: entity.id,
        });
      }
    });
    
    return issues;
  },
  
  generateSQL: () => {
    const { diagram } = get();
    const lines: string[] = [];
    
    lines.push('-- Generated SQL DDL');
    lines.push(`-- Notation: ${diagram.notation.toUpperCase()}`);
    lines.push(`-- Generated: ${new Date().toISOString()}`);
    lines.push('');
    
    // Generate tables for entities
    diagram.entities.forEach((entity) => {
      lines.push(`CREATE TABLE ${entity.name.toLowerCase().replace(/\s+/g, '_')} (`);
      
      const columns: string[] = [];
      const primaryKeys: string[] = [];
      
      entity.attributes.forEach((attr) => {
        let dataType = attr.dataType || 'VARCHAR(255)';
        let columnDef = `  ${attr.name.toLowerCase().replace(/\s+/g, '_')} ${dataType}`;
        
        if (attr.type === 'key' || attr.type === 'partial-key') {
          columnDef += ' NOT NULL';
          primaryKeys.push(attr.name.toLowerCase().replace(/\s+/g, '_'));
        } else if (attr.isRequired) {
          columnDef += ' NOT NULL';
        }
        
        if (attr.type === 'derived') {
          columnDef += ' -- DERIVED';
        }
        
        columns.push(columnDef);
      });
      
      // Add primary key constraint
      if (primaryKeys.length > 0) {
        columns.push(`  PRIMARY KEY (${primaryKeys.join(', ')})`);
      }
      
      lines.push(columns.join(',\n'));
      lines.push(');');
      lines.push('');
    });
    
    // Generate junction tables for M:N relationships
    diagram.relationships.forEach((rel) => {
      const manyToMany = rel.connections.every(
        (c) => c.cardinality === 'many' || c.cardinality === 'zero-or-many' || c.cardinality === 'one-or-many'
      );
      
      if (manyToMany && rel.connections.length === 2) {
        const tableName = rel.name.toLowerCase().replace(/\s+/g, '_') || 
          rel.connections.map((c) => {
            const entity = diagram.entities.find((e) => e.id === c.entityId);
            return entity?.name.toLowerCase().replace(/\s+/g, '_');
          }).join('_');
        
        lines.push(`-- Junction table for M:N relationship`);
        lines.push(`CREATE TABLE ${tableName} (`);
        
        const fkColumns: string[] = [];
        rel.connections.forEach((conn) => {
          const entity = diagram.entities.find((e) => e.id === conn.entityId);
          if (entity) {
            const pk = entity.attributes.find((a) => a.type === 'key');
            const fkName = `${entity.name.toLowerCase().replace(/\s+/g, '_')}_${pk?.name.toLowerCase().replace(/\s+/g, '_') || 'id'}`;
            fkColumns.push(fkName);
            lines.push(`  ${fkName} INT NOT NULL,`);
          }
        });
        
        lines.push(`  PRIMARY KEY (${fkColumns.join(', ')})`);
        lines.push(');');
        lines.push('');
      }
    });
    
    // Generate foreign key constraints
    lines.push('-- Foreign Key Constraints');
    diagram.relationships.forEach((rel) => {
      rel.connections.forEach((conn) => {
        const entity = diagram.entities.find((e) => e.id === conn.entityId);
        if (!entity) return;
        
        // For 1:N relationships, add FK to the many side
        if (conn.cardinality === 'many' || conn.cardinality === 'zero-or-many' || conn.cardinality === 'one-or-many') {
          const otherConn = rel.connections.find((c) => c.entityId !== conn.entityId);
          if (otherConn && (otherConn.cardinality === 'one' || otherConn.cardinality === 'one-and-only-one' || otherConn.cardinality === 'zero-or-one')) {
            const otherEntity = diagram.entities.find((e) => e.id === otherConn.entityId);
            if (otherEntity) {
              const pk = otherEntity.attributes.find((a) => a.type === 'key');
              lines.push(`-- ALTER TABLE ${entity.name.toLowerCase().replace(/\s+/g, '_')}`);
              lines.push(`--   ADD COLUMN ${otherEntity.name.toLowerCase().replace(/\s+/g, '_')}_${pk?.name.toLowerCase().replace(/\s+/g, '_') || 'id'} INT;`);
            }
          }
        }
      });
    });
    
    return lines.join('\n');
  },
  
  clearDiagram: () => {
    set({
      diagram: initialDiagram,
      actions: [],
      currentActionIndex: -1,
      selectedEntityId: null,
      selectedRelationshipId: null,
    });
  },
  
  loadDiagram: (diagram, actions) => {
    set({
      diagram,
      actions,
      currentActionIndex: actions.length - 1,
    });
  },
}));

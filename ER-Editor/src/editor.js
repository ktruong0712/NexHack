/**
 * EREditor - Main ER Diagram Editor Class
 * Handles entity, attribute, and relationship creation with action logging
 */

class EREditor {
  constructor(container) {
    this.container = container;
    this.graph = null;
    this.actionLog = [];
    this.entities = new Map();
    this.attributes = new Map();
    this.relationships = new Map();
    this.cellIdCounter = 1;
    
    this.init();
  }
  
  init() {
    // Check if mxGraph is loaded
    if (typeof mxGraph === 'undefined') {
      console.error('mxGraph library not loaded!');
      return;
    }
    
    // Create graph instance
    this.graph = new mxGraph(this.container);
    
    // Configure graph settings
    this.graph.setConnectable(true);
    this.graph.setAllowDanglingEdges(false);
    this.graph.setCellsEditable(true);
    this.graph.setCellsResizable(true);
    this.graph.setCellsMovable(true);
    this.graph.setTooltips(true);
    this.graph.setEnabled(true);
    
    // Enable rubberband selection
    new mxRubberband(this.graph);
    
    // Setup ER-specific styles
    this.setupStyles();
    
    // Setup event listeners
    this.setupEventListeners();
    
    console.log('EREditor initialized');
  }
  
  setupStyles() {
    const style = this.graph.getStylesheet();
    const defaultVertex = style.getDefaultVertexStyle();
    const defaultEdge = style.getDefaultEdgeStyle();
    
    // Configure default styles
    defaultVertex[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_RECTANGLE;
    defaultVertex[mxConstants.STYLE_STROKECOLOR] = '#000000';
    defaultVertex[mxConstants.STYLE_FILLCOLOR] = '#FFFFFF';
    defaultEdge[mxConstants.STYLE_STROKECOLOR] = '#000000';
    defaultEdge[mxConstants.STYLE_STROKEWIDTH] = 2;
    
    // Register ER-specific styles
    style.putCellStyle('entity', {
      [mxConstants.STYLE_SHAPE]: mxConstants.SHAPE_RECTANGLE,
      [mxConstants.STYLE_STROKECOLOR]: '#000000',
      [mxConstants.STYLE_FILLCOLOR]: '#DAE8FC',
      [mxConstants.STYLE_STROKEWIDTH]: 2,
      [mxConstants.STYLE_FONTCOLOR]: '#000000',
      [mxConstants.STYLE_FONTSIZE]: 14,
      [mxConstants.STYLE_FONTSTYLE]: 1
    });
    
    style.putCellStyle('attribute', {
      [mxConstants.STYLE_SHAPE]: mxConstants.SHAPE_ELLIPSE,
      [mxConstants.STYLE_STROKECOLOR]: '#000000',
      [mxConstants.STYLE_FILLCOLOR]: '#D5E8D4',
      [mxConstants.STYLE_STROKEWIDTH]: 2,
      [mxConstants.STYLE_FONTCOLOR]: '#000000',
      [mxConstants.STYLE_FONTSIZE]: 12
    });
    
    style.putCellStyle('keyAttribute', {
      [mxConstants.STYLE_SHAPE]: mxConstants.SHAPE_ELLIPSE,
      [mxConstants.STYLE_STROKECOLOR]: '#000000',
      [mxConstants.STYLE_FILLCOLOR]: '#FFE6CC',
      [mxConstants.STYLE_STROKEWIDTH]: 2,
      [mxConstants.STYLE_FONTCOLOR]: '#000000',
      [mxConstants.STYLE_FONTSIZE]: 12,
      [mxConstants.STYLE_FONTSTYLE]: 4 // Underlined
    });
    
    style.putCellStyle('relationship', {
      [mxConstants.STYLE_SHAPE]: mxConstants.SHAPE_RHOMBUS,
      [mxConstants.STYLE_STROKECOLOR]: '#000000',
      [mxConstants.STYLE_FILLCOLOR]: '#E1D5E7',
      [mxConstants.STYLE_STROKEWIDTH]: 2,
      [mxConstants.STYLE_FONTCOLOR]: '#000000',
      [mxConstants.STYLE_FONTSIZE]: 12
    });
  }
  
  setupEventListeners() {
    // Listen for cell label changes
    this.graph.addListener(mxEvent.LABEL_CHANGED, (sender, evt) => {
      const cell = evt.getProperty('cell');
      const value = evt.getProperty('value');
      const old = evt.getProperty('old');
      
      this.logAction({
        type: 'LABEL_CHANGED',
        cellId: cell.id,
        oldValue: old,
        newValue: value,
        timestamp: Date.now()
      });
    });
    
    // Listen for cell moves
    this.graph.addListener(mxEvent.CELLS_MOVED, (sender, evt) => {
      const cells = evt.getProperty('cells');
      cells.forEach(cell => {
        this.logAction({
          type: 'CELL_MOVED',
          cellId: cell.id,
          x: cell.geometry.x,
          y: cell.geometry.y,
          timestamp: Date.now()
        });
      });
    });
  }
  
  addEntity(name, x = 100, y = 100, isPK = false) {
    const parent = this.graph.getDefaultParent();
    
    this.graph.getModel().beginUpdate();
    try {
      const cell = this.graph.insertVertex(
        parent,
        `entity_${this.cellIdCounter++}`,
        name || 'Entity',
        x, y, 120, 60,
        'entity'
      );
      
      this.entities.set(cell.id, {
        cell,
        name: cell.value,
        attributes: [],
        relationships: []
      });
      
      this.logAction({
        type: 'ADD_ENTITY',
        cellId: cell.id,
        name: cell.value,
        x, y,
        timestamp: Date.now()
      });
      
      return cell;
    } finally {
      this.graph.getModel().endUpdate();
    }
  }
  
  addAttribute(entityCell, name, isPrimaryKey = false) {
    if (!entityCell) {
      console.error('Entity cell is required');
      return null;
    }
    
    const parent = this.graph.getDefaultParent();
    const style = isPrimaryKey ? 'keyAttribute' : 'attribute';
    
    // Position attribute relative to entity
    const x = entityCell.geometry.x + 150;
    const y = entityCell.geometry.y;
    
    this.graph.getModel().beginUpdate();
    try {
      const attrCell = this.graph.insertVertex(
        parent,
        `attr_${this.cellIdCounter++}`,
        name || 'Attribute',
        x, y, 100, 40,
        style
      );
      
      const edge = this.graph.insertEdge(
        parent,
        null,
        '',
        entityCell,
        attrCell,
        'strokeColor=#000000;strokeWidth=1;'
      );
      
      this.attributes.set(attrCell.id, {
        cell: attrCell,
        name: attrCell.value,
        entityId: entityCell.id,
        isPrimaryKey,
        edge
      });
      
      // Update entity's attribute list
      if (this.entities.has(entityCell.id)) {
        this.entities.get(entityCell.id).attributes.push(attrCell.id);
      }
      
      this.logAction({
        type: 'ADD_ATTRIBUTE',
        cellId: attrCell.id,
        name: attrCell.value,
        entityId: entityCell.id,
        isPrimaryKey,
        x, y,
        timestamp: Date.now()
      });
      
      return attrCell;
    } finally {
      this.graph.getModel().endUpdate();
    }
  }
  
  addRelationship(sourceEntity, targetEntity, cardinality = '1:N', name = '') {
    if (!sourceEntity || !targetEntity) {
      console.error('Source and target entities required');
      return null;
    }
    
    const parent = this.graph.getDefaultParent();
    
    this.graph.getModel().beginUpdate();
    try {
      // Create relationship diamond
      const midX = (sourceEntity.geometry.x + targetEntity.geometry.x) / 2;
      const midY = (sourceEntity.geometry.y + targetEntity.geometry.y) / 2;
      
      const relCell = this.graph.insertVertex(
        parent,
        `rel_${this.cellIdCounter++}`,
        name || cardinality,
        midX - 40, midY - 30, 80, 60,
        'relationship'
      );
      
      // Create edges
      const edge1 = this.graph.insertEdge(
        parent,
        null,
        '',
        sourceEntity,
        relCell,
        'strokeColor=#000000;strokeWidth=2;'
      );
      
      const edge2 = this.graph.insertEdge(
        parent,
        null,
        cardinality,
        relCell,
        targetEntity,
        'strokeColor=#000000;strokeWidth=2;'
      );
      
      this.relationships.set(relCell.id, {
        cell: relCell,
        name: name || cardinality,
        sourceId: sourceEntity.id,
        targetId: targetEntity.id,
        cardinality,
        edges: [edge1, edge2]
      });
      
      this.logAction({
        type: 'ADD_RELATIONSHIP',
        cellId: relCell.id,
        name: name || cardinality,
        sourceId: sourceEntity.id,
        targetId: targetEntity.id,
        cardinality,
        timestamp: Date.now()
      });
      
      return relCell;
    } finally {
      this.graph.getModel().endUpdate();
    }
  }
  
  markAsPrimaryKey(attributeCell) {
    if (!attributeCell) return;
    
    this.graph.getModel().beginUpdate();
    try {
      this.graph.setCellStyle('keyAttribute', [attributeCell]);
      
      if (this.attributes.has(attributeCell.id)) {
        this.attributes.get(attributeCell.id).isPrimaryKey = true;
      }
      
      this.logAction({
        type: 'MARK_PRIMARY_KEY',
        cellId: attributeCell.id,
        timestamp: Date.now()
      });
    } finally {
      this.graph.getModel().endUpdate();
    }
  }
  
  logAction(action) {
    this.actionLog.push(action);
    console.log('Action logged:', action);
    
    // Dispatch custom event for external listeners
    window.dispatchEvent(new CustomEvent('er-action', { detail: action }));
  }
  
  getActionLog() {
    return [...this.actionLog];
  }
  
  clearActionLog() {
    this.actionLog = [];
  }
  
  clear() {
    this.graph.removeCells(this.graph.getChildVertices(this.graph.getDefaultParent()));
    this.entities.clear();
    this.attributes.clear();
    this.relationships.clear();
    this.clearActionLog();
  }
  
  getEntities() {
    return Array.from(this.entities.values());
  }
  
  getAttributes() {
    return Array.from(this.attributes.values());
  }
  
  getRelationships() {
    return Array.from(this.relationships.values());
  }
  
  exportDiagram() {
    return {
      entities: this.getEntities().map(e => ({
        id: e.cell.id,
        name: e.name,
        x: e.cell.geometry.x,
        y: e.cell.geometry.y,
        attributes: e.attributes
      })),
      attributes: this.getAttributes().map(a => ({
        id: a.cell.id,
        name: a.name,
        entityId: a.entityId,
        isPrimaryKey: a.isPrimaryKey
      })),
      relationships: this.getRelationships().map(r => ({
        id: r.cell.id,
        name: r.name,
        sourceId: r.sourceId,
        targetId: r.targetId,
        cardinality: r.cardinality
      })),
      actionLog: this.actionLog
    };
  }
}

// Export for use in HTML
if (typeof window !== 'undefined') {
  window.EREditor = EREditor;
}

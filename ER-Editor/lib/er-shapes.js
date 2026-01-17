/**
 * ER Diagram Shape Definitions
 * Extracted and adapted from draw.io
 */

// Entity shape styles
const ER_STYLES = {
  entity: {
    shape: 'rectangle',
    strokeColor: '#000000',
    fillColor: '#FFFFFF',
    fontColor: '#000000',
    strokeWidth: 2,
    rounded: 0,
    fontSize: 14,
    fontStyle: 1, // Bold
    align: 'center',
    verticalAlign: 'middle'
  },
  
  weakEntity: {
    shape: 'rectangle',
    strokeColor: '#000000',
    fillColor: '#FFFFFF',
    fontColor: '#000000',
    strokeWidth: 4,
    rounded: 0,
    fontSize: 14,
    fontStyle: 1,
    align: 'center',
    verticalAlign: 'middle',
    dashed: 1
  },
  
  attribute: {
    shape: 'ellipse',
    strokeColor: '#000000',
    fillColor: '#FFFFFF',
    fontColor: '#000000',
    strokeWidth: 2,
    fontSize: 12,
    align: 'center',
    verticalAlign: 'middle'
  },
  
  keyAttribute: {
    shape: 'ellipse',
    strokeColor: '#000000',
    fillColor: '#FFE6CC',
    fontColor: '#000000',
    strokeWidth: 2,
    fontSize: 12,
    fontStyle: 4, // Underlined
    align: 'center',
    verticalAlign: 'middle'
  },
  
  derivedAttribute: {
    shape: 'ellipse',
    strokeColor: '#000000',
    fillColor: '#FFFFFF',
    fontColor: '#000000',
    strokeWidth: 2,
    fontSize: 12,
    dashed: 1,
    align: 'center',
    verticalAlign: 'middle'
  },
  
  relationship: {
    shape: 'rhombus',
    strokeColor: '#000000',
    fillColor: '#E1D5E7',
    fontColor: '#000000',
    strokeWidth: 2,
    fontSize: 12,
    align: 'center',
    verticalAlign: 'middle'
  },
  
  identifyingRelationship: {
    shape: 'rhombus',
    strokeColor: '#000000',
    fillColor: '#E1D5E7',
    fontColor: '#000000',
    strokeWidth: 4,
    fontSize: 12,
    align: 'center',
    verticalAlign: 'middle'
  },
  
  edge: {
    edgeStyle: 'orthogonalEdgeStyle',
    rounded: 0,
    orthogonalLoop: 1,
    jettySize: 'auto',
    html: 1,
    strokeColor: '#000000',
    strokeWidth: 2,
    endArrow: 'none',
    endFill: 0
  },
  
  oneToMany: {
    edgeStyle: 'orthogonalEdgeStyle',
    rounded: 0,
    orthogonalLoop: 1,
    jettySize: 'auto',
    html: 1,
    strokeColor: '#000000',
    strokeWidth: 2,
    startArrow: 'none',
    startFill: 0,
    endArrow: 'ERmany',
    endFill: 0
  },
  
  manyToMany: {
    edgeStyle: 'orthogonalEdgeStyle',
    rounded: 0,
    orthogonalLoop: 1,
    jettySize: 'auto',
    html: 1,
    strokeColor: '#000000',
    strokeWidth: 2,
    startArrow: 'ERmany',
    startFill: 0,
    endArrow: 'ERmany',
    endFill: 0
  }
};

// Cardinality options
const CARDINALITY_TYPES = {
  ONE_TO_ONE: '1:1',
  ONE_TO_MANY: '1:N',
  MANY_TO_MANY: 'M:N',
  ZERO_TO_ONE: '0:1',
  ZERO_TO_MANY: '0:N'
};

// Helper function to convert style object to mxGraph style string
function styleToString(styleObj) {
  return Object.entries(styleObj)
    .map(([key, value]) => `${key}=${value}`)
    .join(';');
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ER_STYLES, CARDINALITY_TYPES, styleToString };
}

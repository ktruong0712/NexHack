// Notation types
export type NotationType = 'chen' | 'crowsfoot' | 'uml' | 'idef1x';

// Entity types
export type EntityType = 'strong' | 'weak' | 'associative';

// Attribute types
export type AttributeType = 
  | 'simple' 
  | 'composite' 
  | 'multivalued' 
  | 'derived' 
  | 'key' 
  | 'partial-key';

// Relationship types
export type RelationshipType = 
  | 'relationship' 
  | 'identifying' 
  | 'unary' 
  | 'binary' 
  | 'ternary' 
  | 'n-ary';

// Cardinality
export type Cardinality = 
  | 'one' 
  | 'many' 
  | 'zero-or-one' 
  | 'one-and-only-one' 
  | 'zero-or-many' 
  | 'one-or-many';

// Participation
export type Participation = 'total' | 'partial';

// Specialization
export type SpecializationType = 
  | 'disjoint' 
  | 'overlapping' 
  | 'total' 
  | 'partial';

// Position
export interface Position {
  x: number;
  y: number;
}

// Attribute
export interface Attribute {
  id: string;
  name: string;
  type: AttributeType;
  dataType?: string;
  isRequired?: boolean;
  compositeOf?: string[]; // for composite attributes
}

// Entity
export interface Entity {
  id: string;
  name: string;
  type: EntityType;
  position: Position;
  attributes: Attribute[];
  width?: number;
  height?: number;
}

// Relationship connection
export interface RelationshipConnection {
  entityId: string;
  cardinality: Cardinality;
  participation: Participation;
  role?: string;
}

// Relationship
export interface Relationship {
  id: string;
  name: string;
  type: RelationshipType;
  position: Position;
  connections: RelationshipConnection[];
  attributes?: Attribute[];
}

// EER Specialization
export interface Specialization {
  id: string;
  supertypeId: string;
  subtypeIds: string[];
  type: SpecializationType;
  position: Position;
}

// Diagram state
export interface DiagramState {
  entities: Entity[];
  relationships: Relationship[];
  specializations: Specialization[];
  notation: NotationType;
}

// Action types for recording
export type ActionType = 
  | 'ADD_ENTITY'
  | 'UPDATE_ENTITY'
  | 'DELETE_ENTITY'
  | 'MOVE_ENTITY'
  | 'ADD_ATTRIBUTE'
  | 'UPDATE_ATTRIBUTE'
  | 'DELETE_ATTRIBUTE'
  | 'ADD_RELATIONSHIP'
  | 'UPDATE_RELATIONSHIP'
  | 'DELETE_RELATIONSHIP'
  | 'ADD_SPECIALIZATION'
  | 'DELETE_SPECIALIZATION'
  | 'CHANGE_NOTATION';

// Action record
export interface Action {
  id: string;
  type: ActionType;
  timestamp: number;
  payload: any;
  previousState?: any;
  description: string;
}

// Validation issue
export interface ValidationIssue {
  id: string;
  type: 'error' | 'warning' | 'info';
  message: string;
  entityId?: string;
  relationshipId?: string;
  suggestion?: string;
}

// Tool types
export type ToolType = 
  | 'select'
  | 'entity-strong'
  | 'entity-weak'
  | 'entity-associative'
  | 'attribute-simple'
  | 'attribute-composite'
  | 'attribute-multivalued'
  | 'attribute-derived'
  | 'attribute-key'
  | 'attribute-partial-key'
  | 'relationship'
  | 'relationship-identifying'
  | 'specialization'
  | 'connection';

// Crow's Foot specific
export interface CrowsFootEntity {
  id: string;
  name: string;
  position: Position;
  attributes: CrowsFootAttribute[];
  width?: number;
  height?: number;
}

export interface CrowsFootAttribute {
  id: string;
  name: string;
  dataType: string;
  isPrimaryKey: boolean;
  isForeignKey: boolean;
  isAlternateKey: boolean;
  isRequired: boolean;
}

export interface CrowsFootRelationship {
  id: string;
  name?: string;
  type: 'identifying' | 'non-identifying' | 'recursive';
  sourceEntityId: string;
  targetEntityId: string;
  sourceCardinality: Cardinality;
  targetCardinality: Cardinality;
}

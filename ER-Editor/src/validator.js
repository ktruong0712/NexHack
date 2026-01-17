/**
 * ERValidator - Validates ER diagram for common issues
 * - Missing Primary Keys
 * - Unresolved M:N relationships (suggests join tables)
 * - Orphaned entities
 * - Duplicate entity names
 */

class ERValidator {
  constructor(editor) {
    this.editor = editor;
    this.issues = [];
  }
  
  /**
   * Run all validations
   */
  validate() {
    this.issues = [];
    
    this.checkMissingPrimaryKeys();
    this.checkUnresolvedManyToMany();
    this.checkOrphanedEntities();
    this.checkDuplicateNames();
    this.checkEmptyNames();
    
    return {
      valid: this.issues.length === 0,
      issues: this.issues,
      summary: this.getSummary()
    };
  }
  
  /**
   * Check for entities without primary keys
   */
  checkMissingPrimaryKeys() {
    const entities = this.editor.getEntities();
    
    entities.forEach(entity => {
      const hasPK = entity.attributes.some(attrId => {
        const attr = this.editor.attributes.get(attrId);
        return attr && attr.isPrimaryKey;
      });
      
      if (!hasPK) {
        this.addIssue({
          type: 'MISSING_PRIMARY_KEY',
          severity: 'error',
          entityId: entity.cell.id,
          entityName: entity.name,
          message: `Entity "${entity.name}" has no primary key`,
          suggestion: 'Add a primary key attribute to uniquely identify records'
        });
      }
    });
  }
  
  /**
   * Check for M:N relationships that need join tables
   */
  checkUnresolvedManyToMany() {
    const relationships = this.editor.getRelationships();
    
    relationships.forEach(rel => {
      if (rel.cardinality === 'M:N') {
        // Check if there's a join table entity between them
        const hasJoinTable = this.hasJoinTableFor(rel.sourceId, rel.targetId);
        
        if (!hasJoinTable) {
          const sourceEntity = this.editor.entities.get(rel.sourceId);
          const targetEntity = this.editor.entities.get(rel.targetId);
          
          this.addIssue({
            type: 'UNRESOLVED_MANY_TO_MANY',
            severity: 'warning',
            relationshipId: rel.cell.id,
            sourceId: rel.sourceId,
            targetId: rel.targetId,
            message: `M:N relationship between "${sourceEntity?.name}" and "${targetEntity?.name}" needs a join table`,
            suggestion: this.suggestJoinTable(sourceEntity, targetEntity)
          });
        }
      }
    });
  }
  
  /**
   * Check if join table exists for M:N relationship
   */
  hasJoinTableFor(sourceId, targetId) {
    const entities = this.editor.getEntities();
    const sourceEntity = this.editor.entities.get(sourceId);
    const targetEntity = this.editor.entities.get(targetId);
    
    if (!sourceEntity || !targetEntity) return false;
    
    // Look for entity that references both
    return entities.some(entity => {
      const attrs = entity.attributes.map(id => this.editor.attributes.get(id));
      const hasSourceFK = attrs.some(attr => 
        attr && attr.name.toLowerCase().includes(sourceEntity.name.toLowerCase())
      );
      const hasTargetFK = attrs.some(attr => 
        attr && attr.name.toLowerCase().includes(targetEntity.name.toLowerCase())
      );
      
      return hasSourceFK && hasTargetFK;
    });
  }
  
  /**
   * Suggest join table name and structure
   */
  suggestJoinTable(sourceEntity, targetEntity) {
    if (!sourceEntity || !targetEntity) return '';
    
    const joinTableName = `${sourceEntity.name}_${targetEntity.name}`;
    const sourcePK = this.getPrimaryKey(sourceEntity);
    const targetPK = this.getPrimaryKey(targetEntity);
    
    return `Create join table "${joinTableName}" with:\n` +
           `- ${sourcePK || sourceEntity.name + '_ID'} (FK to ${sourceEntity.name})\n` +
           `- ${targetPK || targetEntity.name + '_ID'} (FK to ${targetEntity.name})\n` +
           `- Composite PK of both columns`;
  }
  
  /**
   * Get primary key attribute name for entity
   */
  getPrimaryKey(entity) {
    if (!entity) return null;
    
    const pkAttrId = entity.attributes.find(attrId => {
      const attr = this.editor.attributes.get(attrId);
      return attr && attr.isPrimaryKey;
    });
    
    if (pkAttrId) {
      const attr = this.editor.attributes.get(pkAttrId);
      return attr?.name;
    }
    
    return null;
  }
  
  /**
   * Check for entities with no relationships
   */
  checkOrphanedEntities() {
    const entities = this.editor.getEntities();
    const relationships = this.editor.getRelationships();
    
    entities.forEach(entity => {
      const isConnected = relationships.some(rel => 
        rel.sourceId === entity.cell.id || rel.targetId === entity.cell.id
      );
      
      if (!isConnected) {
        this.addIssue({
          type: 'ORPHANED_ENTITY',
          severity: 'info',
          entityId: entity.cell.id,
          entityName: entity.name,
          message: `Entity "${entity.name}" has no relationships`,
          suggestion: 'Connect this entity to others or remove if unused'
        });
      }
    });
  }
  
  /**
   * Check for duplicate entity names
   */
  checkDuplicateNames() {
    const entities = this.editor.getEntities();
    const nameMap = new Map();
    
    entities.forEach(entity => {
      const name = entity.name.toLowerCase().trim();
      if (nameMap.has(name)) {
        nameMap.get(name).push(entity);
      } else {
        nameMap.set(name, [entity]);
      }
    });
    
    nameMap.forEach((entityList, name) => {
      if (entityList.length > 1) {
        this.addIssue({
          type: 'DUPLICATE_NAME',
          severity: 'error',
          entityIds: entityList.map(e => e.cell.id),
          entityName: name,
          message: `Multiple entities named "${name}"`,
          suggestion: 'Entity names must be unique'
        });
      }
    });
  }
  
  /**
   * Check for empty entity/attribute names
   */
  checkEmptyNames() {
    const entities = this.editor.getEntities();
    
    entities.forEach(entity => {
      if (!entity.name || entity.name.trim() === '') {
        this.addIssue({
          type: 'EMPTY_NAME',
          severity: 'error',
          entityId: entity.cell.id,
          message: 'Entity has no name',
          suggestion: 'Provide a meaningful name for the entity'
        });
      }
    });
    
    const attributes = this.editor.getAttributes();
    attributes.forEach(attr => {
      if (!attr.name || attr.name.trim() === '') {
        this.addIssue({
          type: 'EMPTY_NAME',
          severity: 'error',
          attributeId: attr.cell.id,
          message: 'Attribute has no name',
          suggestion: 'Provide a meaningful name for the attribute'
        });
      }
    });
  }
  
  /**
   * Add issue to list
   */
  addIssue(issue) {
    this.issues.push({
      ...issue,
      timestamp: Date.now()
    });
  }
  
  /**
   * Get validation summary
   */
  getSummary() {
    const errors = this.issues.filter(i => i.severity === 'error').length;
    const warnings = this.issues.filter(i => i.severity === 'warning').length;
    const info = this.issues.filter(i => i.severity === 'info').length;
    
    return {
      total: this.issues.length,
      errors,
      warnings,
      info,
      status: errors > 0 ? 'invalid' : warnings > 0 ? 'warnings' : 'valid'
    };
  }
  
  /**
   * Get issues by severity
   */
  getIssuesBySeverity(severity) {
    return this.issues.filter(i => i.severity === severity);
  }
  
  /**
   * Get issues for specific entity
   */
  getIssuesForEntity(entityId) {
    return this.issues.filter(i => 
      i.entityId === entityId || 
      (i.entityIds && i.entityIds.includes(entityId))
    );
  }
  
  /**
   * Clear all issues
   */
  clear() {
    this.issues = [];
  }
  
  /**
   * Auto-fix some issues (where possible)
   */
  autoFix() {
    const fixed = [];
    
    // Auto-add primary keys to entities without them
    this.issues.forEach(issue => {
      if (issue.type === 'MISSING_PRIMARY_KEY') {
        const entity = this.editor.entities.get(issue.entityId);
        if (entity) {
          const pkName = `${entity.name}_ID`;
          const attrCell = this.editor.addAttribute(entity.cell, pkName, true);
          if (attrCell) {
            fixed.push({
              issue: issue.type,
              entityId: issue.entityId,
              action: `Added primary key "${pkName}"`
            });
          }
        }
      }
    });
    
    return {
      fixed,
      remaining: this.validate().issues.length
    };
  }
}

// Export for use in HTML
if (typeof window !== 'undefined') {
  window.ERValidator = ERValidator;
}

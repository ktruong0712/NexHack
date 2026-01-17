/**
 * SQLGenerator - Generate SQL DDL from ER diagram
 * Supports CREATE TABLE, PRIMARY KEY, FOREIGN KEY statements
 */

class SQLGenerator {
  constructor(editor) {
    this.editor = editor;
    this.dialect = 'mysql'; // 'mysql', 'postgresql', 'sqlite'
  }
  
  /**
   * Generate complete SQL script
   */
  generate() {
    const entities = this.editor.getEntities();
    const relationships = this.editor.getRelationships();
    
    let sql = this.generateHeader();
    
    // Generate CREATE TABLE statements
    entities.forEach(entity => {
      sql += this.generateCreateTable(entity);
      sql += '\n';
    });
    
    // Generate join tables for M:N relationships
    const manyToMany = relationships.filter(r => r.cardinality === 'M:N');
    manyToMany.forEach(rel => {
      sql += this.generateJoinTable(rel);
      sql += '\n';
    });
    
    // Generate ALTER TABLE statements for foreign keys
    relationships.forEach(rel => {
      if (rel.cardinality !== 'M:N') {
        sql += this.generateForeignKey(rel);
      }
    });
    
    sql += this.generateFooter();
    
    return sql;
  }
  
  /**
   * Generate SQL header with metadata
   */
  generateHeader() {
    const timestamp = new Date().toISOString();
    return `-- SQL DDL Generated from ER Diagram\n` +
           `-- Generated: ${timestamp}\n` +
           `-- Dialect: ${this.dialect.toUpperCase()}\n\n`;
  }
  
  /**
   * Generate SQL footer
   */
  generateFooter() {
    return `\n-- End of SQL script\n`;
  }
  
  /**
   * Generate CREATE TABLE statement for entity
   */
  generateCreateTable(entity) {
    const tableName = this.sanitizeName(entity.name);
    const attributes = entity.attributes.map(id => this.editor.attributes.get(id));
    
    let sql = `CREATE TABLE ${tableName} (\n`;
    
    // Add columns
    const columns = attributes.map(attr => {
      if (!attr) return null;
      
      const colName = this.sanitizeName(attr.name);
      const dataType = this.inferDataType(attr);
      const isPK = attr.isPrimaryKey;
      
      let colDef = `    ${colName} ${dataType}`;
      
      if (isPK) {
        colDef += ' PRIMARY KEY';
        if (this.dialect === 'mysql') {
          colDef += ' AUTO_INCREMENT';
        } else if (this.dialect === 'postgresql') {
          colDef = `    ${colName} SERIAL PRIMARY KEY`;
        }
      } else {
        colDef += ' NOT NULL';
      }
      
      return colDef;
    }).filter(col => col !== null);
    
    // If no primary key exists, add default ID
    const hasPK = attributes.some(a => a && a.isPrimaryKey);
    if (!hasPK) {
      if (this.dialect === 'mysql') {
        columns.unshift(`    ${tableName}_ID INT PRIMARY KEY AUTO_INCREMENT`);
      } else if (this.dialect === 'postgresql') {
        columns.unshift(`    ${tableName}_ID SERIAL PRIMARY KEY`);
      } else {
        columns.unshift(`    ${tableName}_ID INTEGER PRIMARY KEY AUTOINCREMENT`);
      }
    }
    
    sql += columns.join(',\n');
    sql += '\n);\n';
    
    return sql;
  }
  
  /**
   * Generate join table for M:N relationship
   */
  generateJoinTable(relationship) {
    const sourceEntity = this.editor.entities.get(relationship.sourceId);
    const targetEntity = this.editor.entities.get(relationship.targetId);
    
    if (!sourceEntity || !targetEntity) return '';
    
    const joinTableName = this.sanitizeName(`${sourceEntity.name}_${targetEntity.name}`);
    const sourcePK = this.getPrimaryKeyColumn(sourceEntity);
    const targetPK = this.getPrimaryKeyColumn(targetEntity);
    
    let sql = `-- Join table for M:N relationship\n`;
    sql += `CREATE TABLE ${joinTableName} (\n`;
    
    const columns = [];
    
    // Source FK
    columns.push(`    ${sourcePK.name} ${sourcePK.type} NOT NULL`);
    
    // Target FK
    columns.push(`    ${targetPK.name} ${sourcePK.type} NOT NULL`);
    
    // Composite PK
    columns.push(`    PRIMARY KEY (${sourcePK.name}, ${targetPK.name})`);
    
    sql += columns.join(',\n');
    sql += '\n);\n';
    
    // Add foreign key constraints
    sql += `\nALTER TABLE ${joinTableName}\n`;
    sql += `    ADD FOREIGN KEY (${sourcePK.name}) REFERENCES ${this.sanitizeName(sourceEntity.name)}(${sourcePK.name});\n`;
    sql += `\nALTER TABLE ${joinTableName}\n`;
    sql += `    ADD FOREIGN KEY (${targetPK.name}) REFERENCES ${this.sanitizeName(targetEntity.name)}(${targetPK.name});\n`;
    
    return sql;
  }
  
  /**
   * Generate foreign key constraint
   */
  generateForeignKey(relationship) {
    const sourceEntity = this.editor.entities.get(relationship.sourceId);
    const targetEntity = this.editor.entities.get(relationship.targetId);
    
    if (!sourceEntity || !targetEntity) return '';
    
    // Determine which side gets the foreign key (1:N = N side gets FK)
    let fkTable, refTable;
    
    if (relationship.cardinality === '1:N' || relationship.cardinality === '0:N') {
      fkTable = targetEntity; // "many" side gets FK
      refTable = sourceEntity; // "one" side is referenced
    } else {
      fkTable = targetEntity;
      refTable = sourceEntity;
    }
    
    const fkTableName = this.sanitizeName(fkTable.name);
    const refTableName = this.sanitizeName(refTable.name);
    const refPK = this.getPrimaryKeyColumn(refTable);
    const fkColName = `${refTableName}_${refPK.name}`;
    
    let sql = `-- Foreign key for ${relationship.cardinality} relationship\n`;
    sql += `ALTER TABLE ${fkTableName}\n`;
    sql += `    ADD COLUMN ${fkColName} ${refPK.type}`;
    
    if (relationship.cardinality.startsWith('1:')) {
      sql += ' NOT NULL';
    }
    
    sql += ',\n';
    sql += `    ADD FOREIGN KEY (${fkColName}) REFERENCES ${refTableName}(${refPK.name});\n\n`;
    
    return sql;
  }
  
  /**
   * Get primary key column info for entity
   */
  getPrimaryKeyColumn(entity) {
    const pkAttrId = entity.attributes.find(attrId => {
      const attr = this.editor.attributes.get(attrId);
      return attr && attr.isPrimaryKey;
    });
    
    if (pkAttrId) {
      const attr = this.editor.attributes.get(pkAttrId);
      return {
        name: this.sanitizeName(attr.name),
        type: this.inferDataType(attr)
      };
    }
    
    // Default PK if none exists
    return {
      name: `${this.sanitizeName(entity.name)}_ID`,
      type: this.dialect === 'mysql' ? 'INT' : 'INTEGER'
    };
  }
  
  /**
   * Infer SQL data type from attribute name
   */
  inferDataType(attribute) {
    const name = attribute.name.toLowerCase();
    
    // Check for common patterns
    if (name.includes('id') || name.endsWith('_id')) {
      return this.dialect === 'mysql' ? 'INT' : 'INTEGER';
    }
    
    if (name.includes('date') || name.includes('time')) {
      return this.dialect === 'postgresql' ? 'TIMESTAMP' : 'DATETIME';
    }
    
    if (name.includes('email') || name.includes('url')) {
      return 'VARCHAR(255)';
    }
    
    if (name.includes('description') || name.includes('comment') || name.includes('text')) {
      return 'TEXT';
    }
    
    if (name.includes('price') || name.includes('amount') || name.includes('cost')) {
      return this.dialect === 'postgresql' ? 'NUMERIC(10,2)' : 'DECIMAL(10,2)';
    }
    
    if (name.includes('quantity') || name.includes('count') || name.includes('number')) {
      return this.dialect === 'mysql' ? 'INT' : 'INTEGER';
    }
    
    if (name.includes('active') || name.includes('enabled') || name.includes('is_')) {
      return this.dialect === 'postgresql' ? 'BOOLEAN' : 'TINYINT(1)';
    }
    
    // Default
    return 'VARCHAR(100)';
  }
  
  /**
   * Sanitize names for SQL
   */
  sanitizeName(name) {
    if (!name) return 'unnamed';
    
    // Remove special characters, replace spaces with underscores
    let sanitized = name.trim()
      .replace(/[^a-zA-Z0-9_]/g, '_')
      .replace(/^[0-9]/, '_$&'); // Can't start with number
    
    // Convert to appropriate case
    if (this.dialect === 'postgresql') {
      sanitized = sanitized.toLowerCase();
    }
    
    return sanitized;
  }
  
  /**
   * Set SQL dialect
   */
  setDialect(dialect) {
    const supported = ['mysql', 'postgresql', 'sqlite'];
    if (supported.includes(dialect.toLowerCase())) {
      this.dialect = dialect.toLowerCase();
    } else {
      console.warn(`Unsupported dialect: ${dialect}. Using mysql.`);
    }
  }
  
  /**
   * Get current dialect
   */
  getDialect() {
    return this.dialect;
  }
  
  /**
   * Generate INSERT statements with sample data
   */
  generateSampleData(rowsPerTable = 3) {
    const entities = this.editor.getEntities();
    let sql = '\n-- Sample Data\n\n';
    
    entities.forEach(entity => {
      const tableName = this.sanitizeName(entity.name);
      const attributes = entity.attributes
        .map(id => this.editor.attributes.get(id))
        .filter(a => a && !a.isPrimaryKey);
      
      if (attributes.length === 0) return;
      
      sql += `-- Sample data for ${tableName}\n`;
      
      for (let i = 1; i <= rowsPerTable; i++) {
        const columns = attributes.map(a => this.sanitizeName(a.name));
        const values = attributes.map(a => this.generateSampleValue(a, i));
        
        sql += `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES (${values.join(', ')});\n`;
      }
      
      sql += '\n';
    });
    
    return sql;
  }
  
  /**
   * Generate sample value based on attribute type
   */
  generateSampleValue(attribute, index) {
    const name = attribute.name.toLowerCase();
    
    if (name.includes('name')) {
      return `'Sample ${attribute.name} ${index}'`;
    }
    
    if (name.includes('email')) {
      return `'user${index}@example.com'`;
    }
    
    if (name.includes('date')) {
      return `'2024-01-${String(index).padStart(2, '0')}'`;
    }
    
    if (name.includes('price') || name.includes('amount')) {
      return (10.99 * index).toFixed(2);
    }
    
    if (name.includes('quantity') || name.includes('count')) {
      return index * 10;
    }
    
    return `'Value ${index}'`;
  }
}

// Export for use in HTML
if (typeof window !== 'undefined') {
  window.SQLGenerator = SQLGenerator;
}
